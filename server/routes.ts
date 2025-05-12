import type { Express, Request, Response } from "express";
import { createServer, type Server } from "http";
import { WebSocketServer, WebSocket } from 'ws';
import { contentGenerationSchema } from "../shared/schema";
import { storage } from "./storage";
import fs from "fs";
import path from "path";
import { z } from 'zod';
import { checkAllServices } from './service-status';
import { generateScript } from './generate-script';
import { fallbackScriptGeneration } from './fallback-generator';
import { generateVideo as generateAIVideo } from "./ai-service";
import { generateTestVideo } from "./test-video-generator";
import { generateCompatibleVideo, generateSimpleVideo, fixExistingVideo } from "./video-fix";
import { analyzeAsCritic } from "./critics-analysis";
import { nanoid } from 'nanoid';

// Diretórios padrão para armazenamento de arquivos
const TMP_DIR = path.join(process.cwd(), 'tmp');
const OUTPUT_DIR = path.join(process.cwd(), 'output');
const IMAGES_DIR = path.join(TMP_DIR, 'images');

// Armazenamento temporário de progresso dos processamentos
interface ProcessingTask {
  id: string;
  status: 'pending' | 'processing' | 'completed' | 'failed';
  progress: number;
  message: string;
  startTime: number;
  result?: any;
  error?: string;
}

const processingTasks: Record<string, ProcessingTask> = {};

// Atualizar progresso de uma tarefa
function updateTaskProgress(taskId: string, progress: number, message: string, status?: 'pending' | 'processing' | 'completed' | 'failed', result?: any, error?: string) {
  if (!processingTasks[taskId]) {
    processingTasks[taskId] = {
      id: taskId,
      status: 'pending',
      progress: 0,
      message: 'Inicializando...',
      startTime: Date.now()
    };
  }
  
  const task = processingTasks[taskId];
  task.progress = progress;
  task.message = message;
  
  if (status) {
    task.status = status;
  }
  
  if (result) {
    task.result = result;
  }
  
  if (error) {
    task.error = error;
  }
  
  // Notificar clientes WebSocket
  broadcastTaskUpdate(task);
}

// Função para calcular tempo estimado de conclusão
function calculateEstimatedTime(progress: number): number {
  const totalEstimatedTime = 300;
  return Math.ceil((100 - progress) / 100 * totalEstimatedTime);
}

// Removida inicialização do OpenAI - usando apenas HuggingFace

// WebSocket para envio de atualizações de progresso em tempo real
let wss: WebSocketServer;

// Transmitir atualização para todos os clientes
function broadcastTaskUpdate(task: ProcessingTask) {
  if (!wss) return;
  
  const message = JSON.stringify({
    type: 'taskUpdate',
    task: {
      ...task,
      estimatedTimeRemaining: calculateEstimatedTime(task.progress)
    }
  });
  
  wss.clients.forEach((client) => {
    if (client.readyState === WebSocket.OPEN) {
      client.send(message);
    }
  });
}

export async function registerRoutes(app: Express): Promise<Server> {
  // Adicionar rota para o gerador de roteiros
  app.post('/api/generate-script', generateScript);
  
  // Rota alternativa que usa o gerador de fallback (sem depender de APIs externas)
  app.post('/api/generate-script/fallback', fallbackScriptGeneration);
  
  // Rota para análise de roteiro por crítico de cinema
  app.post('/api/analyze-script', analyzeAsCritic);
  
  /**
   * Endpoint para estatísticas do servidor - utilizado para monitoramento e debugging
   */
  app.get("/api/server-stats", async (req: Request, res: Response) => {
    const stats = {
      uptime: process.uptime(),
      memory: process.memoryUsage(),
      nodeVersion: process.version,
      apiIntegrations: {
        huggingface: !!process.env.HUGGINGFACE_API_KEY,
        elevenlabs: !!process.env.ELEVENLABS_API_KEY,
        pexels: !!process.env.PEXELS_API_KEY
      }
    };
    
    return res.json(stats);
  });

  // Criar HTTP server
  const httpServer = createServer(app);
  
  // Configurar WebSocket
  wss = new WebSocketServer({ server: httpServer, path: '/ws' });
  
  wss.on('connection', (ws: WebSocket) => {
    console.log('Cliente WebSocket conectado');
    
    // Enviar todos os status de tarefas para o cliente que acabou de conectar
    Object.values(processingTasks).forEach(task => {
      if (ws.readyState === WebSocket.OPEN) {
        ws.send(JSON.stringify({
          type: 'taskUpdate',
          task: {
            ...task,
            estimatedTimeRemaining: calculateEstimatedTime(task.progress)
          }
        }));
      }
    });
    
    ws.on('message', (message: string) => {
      try {
        const data = JSON.parse(message);
        if (data.type === 'requestTaskStatus' && data.taskId) {
          const task = processingTasks[data.taskId];
          if (task && ws.readyState === WebSocket.OPEN) {
            ws.send(JSON.stringify({
              type: 'taskUpdate',
              task: {
                ...task,
                estimatedTimeRemaining: calculateEstimatedTime(task.progress)
              }
            }));
          }
        }
      } catch (e) {
        console.error('Erro ao processar mensagem WebSocket:', e);
      }
    });
    
    ws.on('close', () => {
      console.log('Cliente WebSocket desconectado');
    });
  });

  return httpServer;
}
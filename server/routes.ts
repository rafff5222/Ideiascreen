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
        openai: !!process.env.OPENAI_API_KEY
      }
    };
    
    return res.json(stats);
  });
  
  /**
   * Endpoint para pré-carregamento do modelo de IA
   * Otimiza a experiência do usuário iniciando o carregamento do modelo em background
   */
  app.post("/api/preload-model", async (req: Request, res: Response) => {
    try {
      const { modelType } = req.body;
      
      console.log(`Iniciando pré-carregamento do modelo: ${modelType || 'default'}`);
      
      // Aqui podemos iniciar o carregamento do modelo em segundo plano
      // Por exemplo, fazendo uma chamada leve à API do HuggingFace
      
      // Responder imediatamente ao cliente para não bloquear
      res.status(200).json({ success: true, message: 'Pré-carregamento iniciado' });
      
      // Simulação de pré-carregamento assíncrono (em produção, seria uma chamada real à API)
      if (process.env.HUGGINGFACE_API_KEY) {
        // Esta é uma solicitação muito pequena apenas para "aquecer" a API
        fetch(`https://api-inference.huggingface.co/models/facebook/blenderbot-400M-distill`, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${process.env.HUGGINGFACE_API_KEY}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            inputs: "Olá",
            parameters: { 
              max_new_tokens: 5,
              return_full_text: false
            }
          })
        }).catch(err => {
          console.log('Erro no pré-aquecimento do modelo (não crítico):', err.message);
        });
      }
    } catch (err) {
      console.error("Erro ao pré-carregar modelo:", err);
      // Não retornamos erro ao cliente, pois isso é apenas uma otimização
      res.status(200).json({ success: true });
    }
  });

  /**
   * Endpoint para registro de erros do cliente
   * Centraliza o monitoramento de erros da aplicação
   */
  app.post("/api/error-log", async (req: Request, res: Response) => {
    try {
      const errorData = req.body;
      
      // Registra o erro no console do servidor (para desenvolvimento)
      console.error("Erro reportado pelo cliente:", errorData);
      
      // Em produção, enviaria para um serviço de monitoramento como Sentry ou similar
      // ou armazenaria em um banco de dados para análise posterior
      
      // Log para arquivo (mínimo em produção)
      const logDir = path.join(process.cwd(), 'logs');
      if (!fs.existsSync(logDir)) {
        fs.mkdirSync(logDir, { recursive: true });
      }
      
      // Formato do log: data_hora | tipo | mensagem | detalhes
      const logEntry = `${new Date().toISOString()} | ${errorData.type || 'error'} | ${errorData.message || 'Erro desconhecido'} | ${JSON.stringify(errorData)}\n`;
      
      // Append ao arquivo de log
      fs.appendFileSync(
        path.join(logDir, 'client-errors.log'), 
        logEntry, 
        { encoding: 'utf8' }
      );
      
      return res.status(200).json({ success: true });
    } catch (err) {
      console.error("Erro ao processar log de erro:", err);
      return res.status(500).json({ success: false });
    }
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
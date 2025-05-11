import type { Express, Request, Response } from "express";
import { createServer, type Server } from "http";
import { WebSocketServer, WebSocket } from 'ws';
import OpenAI from "openai";
import { contentGenerationSchema } from "../shared/schema";
import { generateContent, generateSpeech, generateVideo as generateOpenAIVideo, type SpeechGenerationRequest, type VideoGenerationRequest } from "./openai";
import { storage } from "./storage";
import fs from "fs";
import path from "path";
import { z } from 'zod';
import { generateVideo as generateAIVideo } from "./ai-service";
import { testeGerarVideo } from "./test-video-generator";
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

// Map para armazenar as tarefas em andamento
const activeTasks = new Map<string, ProcessingTask>();

// Conexões WebSocket ativas
const activeConnections = new Map<string, Set<WebSocket>>();

// Função para atualizar o progresso de uma tarefa e notificar clientes
function updateTaskProgress(taskId: string, progress: number, message: string, status?: 'pending' | 'processing' | 'completed' | 'failed', result?: any, error?: string) {
  const task = activeTasks.get(taskId);
  if (!task) return;
  
  task.progress = progress;
  task.message = message;
  if (status) task.status = status;
  if (result) task.result = result;
  if (error) task.error = error;
  
  // Notificar clientes conectados
  const connections = activeConnections.get(taskId);
  if (connections) {
    // Formato da mensagem deve corresponder exatamente ao formato esperado pelo cliente
    const update = JSON.stringify({
      type: 'progress_update',
      taskId,
      progress,
      message,
      status: task.status,
      result: task.result,
      error: task.error,
      estimatedTimeRemaining: calculateEstimatedTime(progress)
    });
    
    connections.forEach(client => {
      if (client.readyState === WebSocket.OPEN) {
        console.log(`[WebSocket] Enviando atualização para cliente: ${taskId}, progresso: ${progress}%`);
        client.send(update);
      }
    });
  } else {
    console.log(`[WebSocket] Nenhum cliente conectado para a tarefa: ${taskId}`);
  }
}

// Função para calcular tempo estimado restante baseado no progresso
function calculateEstimatedTime(progress: number): number {
  if (progress >= 100) return 0;
  
  // Baseado em um tempo total estimado de 5 minutos (300 segundos)
  const totalEstimatedTime = 300;
  return Math.ceil((100 - progress) / 100 * totalEstimatedTime);
}

// Initialize OpenAI
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

// Esquema Zod para validação do request de geração de narração
const speechGenerationSchema = z.object({
  text: z.string().min(1, "O texto não pode estar vazio"),
  voice: z.string(),
  speed: z.number().min(0.5).max(2.0).default(1.0)
});

// Contador global de requisições para monitoramento
const requestCounter = {
  total: 0,
  success: 0,
  failed: 0
};

// Esquema Zod para validação do request de geração de vídeo
const videoGenerationSchema = z.object({
  script: z.string().min(1, "O roteiro não pode estar vazio"),
  voice: z.string(),
  speed: z.number().min(0.5).max(2.0).default(1.0),
  transitions: z.array(z.string()).default([]),
  outputFormat: z.string().default("mp4")
});

// Adicionar tipos para autenticação
declare global {
  namespace Express {
    interface Request {
      isAuthenticated?: () => boolean;
      user?: any;
    }
  }
}

export async function registerRoutes(app: Express): Promise<Server> {
  // Criação do servidor HTTP para Express e WebSockets
  const httpServer = createServer(app);
  
  // Configurar WebSocketServer para atualizações em tempo real
  const wss = new WebSocketServer({ server: httpServer, path: '/ws' });
  
  // Manipular conexões WebSocket
  wss.on('connection', (ws: WebSocket) => {
    console.log('Nova conexão WebSocket estabelecida');
    
    // Manipular mensagens recebidas
    ws.on('message', (message: Buffer | string) => {
      try {
        console.log('[WebSocket] Mensagem recebida:', message.toString());
        const data = JSON.parse(message.toString());
        console.log('[WebSocket] Dados da mensagem:', data);
        
        // Tratar comando de subscrição a uma tarefa
        if (data.type === 'subscribe' && data.taskId) {
          const taskId = data.taskId;
          console.log(`[WebSocket] Cliente subscrevendo para tarefa: ${taskId}`);
          
          // Verificar se existe uma tarefa com este ID
          if (activeTasks.has(taskId)) {
            console.log(`[WebSocket] Tarefa encontrada: ${taskId}`);
            // Adicionar esta conexão ao conjunto de clientes interessados nesta tarefa
            if (!activeConnections.has(taskId)) {
              activeConnections.set(taskId, new Set());
            }
            activeConnections.get(taskId)?.add(ws);
            
            // Enviar o estado atual da tarefa imediatamente
            const task = activeTasks.get(taskId);
            const initialState = {
              type: 'initial_state',
              taskId,
              progress: task?.progress || 0,
              message: task?.message || 'Iniciando processamento...',
              status: task?.status || 'pending',
              estimatedTimeRemaining: calculateEstimatedTime(task?.progress || 0)
            };
            console.log(`[WebSocket] Enviando estado inicial:`, initialState);
            ws.send(JSON.stringify(initialState));
          } else {
            // Tarefa não encontrada
            console.log(`[WebSocket] Tarefa não encontrada: ${taskId}`);
            ws.send(JSON.stringify({
              type: 'error',
              message: 'Tarefa não encontrada'
            }));
          }
        }
        // Tratar comando de unsubscribe
        else if (data.type === 'unsubscribe' && data.taskId) {
          const taskId = data.taskId;
          const connections = activeConnections.get(taskId);
          if (connections) {
            connections.delete(ws);
            if (connections.size === 0) {
              activeConnections.delete(taskId);
            }
          }
        }
      } catch (error) {
        console.error('Erro ao processar mensagem WebSocket:', error);
      }
    });
    
    // Limpar quando a conexão for fechada
    ws.on('close', () => {
      console.log('Conexão WebSocket fechada');
      
      // Remover esta conexão de todas as tarefas
      activeConnections.forEach((connections, taskId) => {
        if (connections.has(ws)) {
          connections.delete(ws);
          if (connections.size === 0) {
            activeConnections.delete(taskId);
          }
        }
      });
    });
  });

  // Middleware para contagem de requisições
  app.use((req: Request, res: Response, next) => {
    requestCounter.total++;
    
    // Registrar o resultado da requisição
    const originalSend = res.send;
    res.send = function(body) {
      // Registrar sucesso ou falha baseado no status
      if (res.statusCode >= 200 && res.statusCode < 400) {
        requestCounter.success++;
      } else {
        requestCounter.failed++;
      }
      
      return originalSend.call(this, body);
    };
    
    next();
  });

  /**
   * Endpoint para gerar narração de áudio a partir de texto usando OpenAI TTS
   */
  app.post("/api/generate-speech", async (req: Request, res: Response) => {
    try {
      // Validar os dados de entrada
      const validatedData = speechGenerationSchema.parse(req.body);
      
      // Gerar a narração
      const audioBuffer = await generateSpeech(validatedData);
      
      // Configurar os headers para download do arquivo de áudio
      res.setHeader('Content-Type', 'audio/mpeg');
      res.setHeader('Content-Disposition', 'attachment; filename="narration.mp3"');
      
      // Enviar o buffer como resposta
      res.send(audioBuffer);
      
    } catch (error: any) {
      console.error("Erro ao gerar narração:", error);
      res.status(400).json({ 
        error: error.message || "Erro ao gerar narração" 
      });
    }
  });
  
  /**
   * Endpoint para gerar vídeo completo a partir de roteiro
   */
  app.post("/api/generate-video", async (req: Request, res: Response) => {
    try {
      // Validar os dados de entrada
      const validatedData = videoGenerationSchema.parse(req.body);
      
      // Usar o novo serviço de IA para geração de vídeo
      try {
        // Tentar a abordagem com novo sistema de IA
        const videoResult = await generateAIVideo({
          script: validatedData.script,
          voice: validatedData.voice,
          speed: validatedData.speed,
          transitions: validatedData.transitions,
          outputFormat: validatedData.outputFormat
        });
        
        // Retornar os dados do vídeo
        res.json(videoResult);
      } catch (aiError: any) {
        console.error("Erro no novo gerador de vídeo, usando fallback:", aiError);
        
        // Fallback para o sistema original
        const result = await generateOpenAIVideo(validatedData);
        res.json(JSON.parse(result));
      }
      
    } catch (error: any) {
      console.error("Erro ao gerar vídeo:", error);
      res.status(400).json({ 
        error: error.message || "Erro ao gerar vídeo" 
      });
    }
  });
  
  /**
   * Endpoint para processamento assíncrono com WebSockets para atualização de progresso
   * Baseado nas recomendações para processamento em etapas
   */
  app.post("/api/process-video", async (req: Request, res: Response) => {
    try {
      // Validar os dados de entrada
      const validatedData = videoGenerationSchema.parse(req.body);
      
      // Gerar ID único para esta tarefa
      const taskId = nanoid();
      
      // Criar registro da tarefa
      const task: ProcessingTask = {
        id: taskId,
        status: 'pending',
        progress: 0,
        message: 'Tarefa criada, aguardando processamento',
        startTime: Date.now()
      };
      
      // Armazenar a tarefa
      activeTasks.set(taskId, task);
      
      // Iniciar processamento em background
      setTimeout(async () => {
        try {
          // Atualizar status para processando
          updateTaskProgress(taskId, 5, 'Iniciando processamento do vídeo', 'processing');
          
          // Simular etapas de processamento
          updateTaskProgress(taskId, 10, 'Analisando roteiro');
          await new Promise(resolve => setTimeout(resolve, 500));
          
          updateTaskProgress(taskId, 20, 'Gerando sequência de áudio');
          await new Promise(resolve => setTimeout(resolve, 1000));
          
          updateTaskProgress(taskId, 35, 'Processando narração');
          await new Promise(resolve => setTimeout(resolve, 1500));
          
          // Etapa principal de processamento
          updateTaskProgress(taskId, 50, 'Gerando vídeo através de modelo de IA');
          
          try {
            // Tentar gerar o vídeo com o sistema principal
            const videoResult = await generateAIVideo({
              script: validatedData.script,
              voice: validatedData.voice,
              speed: validatedData.speed,
              transitions: validatedData.transitions,
              outputFormat: validatedData.outputFormat
            });
            
            updateTaskProgress(taskId, 90, 'Finalizando processamento');
            await new Promise(resolve => setTimeout(resolve, 500));
            
            // Marcar como concluído
            updateTaskProgress(
              taskId, 
              100, 
              'Processamento concluído com sucesso', 
              'completed', 
              videoResult
            );
            
          } catch (aiError) {
            // Fallback para sistema secundário
            updateTaskProgress(taskId, 60, 'Usando sistema alternativo para geração');
            
            try {
              const result = await generateOpenAIVideo(validatedData);
              const parsedResult = JSON.parse(result);
              
              updateTaskProgress(taskId, 90, 'Finalizando processamento alternativo');
              await new Promise(resolve => setTimeout(resolve, 500));
              
              // Marcar como concluído
              updateTaskProgress(
                taskId, 
                100, 
                'Processamento concluído com sistema alternativo', 
                'completed', 
                parsedResult
              );
              
            } catch (fallbackError) {
              // Ambos os sistemas falharam
              updateTaskProgress(
                taskId, 
                100, 
                'Falha ao processar vídeo', 
                'failed', 
                undefined, 
                'Erro nos sistemas de processamento principal e alternativo'
              );
            }
          }
          
        } catch (processingError: any) {
          // Em caso de erro no processamento
          updateTaskProgress(
            taskId, 
            100, 
            'Falha ao processar vídeo', 
            'failed', 
            undefined, 
            processingError.message || 'Erro desconhecido durante o processamento'
          );
        }
      }, 0);
      
      // Retornar imediatamente o ID da tarefa
      res.json({
        success: true,
        taskId,
        message: 'Processamento iniciado. Conecte-se ao WebSocket para atualizações em tempo real.'
      });
      
    } catch (error: any) {
      console.error("Erro ao iniciar processamento:", error);
      res.status(400).json({ 
        success: false,
        error: error.message || "Erro ao iniciar processamento de vídeo" 
      });
    }
  });
  
  /**
   * Endpoint para verificar o status atual de um processamento
   */
  app.get("/api/task-status/:taskId", (req: Request, res: Response) => {
    try {
      const { taskId } = req.params;
      
      if (!taskId) {
        return res.status(400).json({
          success: false,
          error: 'ID da tarefa não fornecido'
        });
      }
      
      // Verificar se a tarefa existe
      const task = activeTasks.get(taskId);
      if (!task) {
        return res.status(404).json({
          success: false,
          error: 'Tarefa não encontrada'
        });
      }
      
      // Retornar status atual
      return res.json({
        success: true,
        taskId,
        status: task.status,
        progress: task.progress,
        message: task.message,
        processingTime: Date.now() - task.startTime,
        estimatedTimeRemaining: calculateEstimatedTime(task.progress)
      });
      
    } catch (error: any) {
      console.error('Erro ao verificar status da tarefa:', error);
      res.status(500).json({
        success: false,
        error: error.message || 'Erro ao verificar status da tarefa'
      });
    }
  });
  
  /**
   * Endpoint para geração de vídeo usando nova sintaxe (/generate)
   * Compatível com o código do cliente fornecido
   * Implementado com sistema de filas para processamento assíncrono
   */
  app.post("/generate", async (req: Request, res: Response) => {
    try {
      // Extrair script do body
      const { script } = req.body;
      
      // Validação aprimorada do input
      if (!script || typeof script !== 'string') {
        return res.status(400).json({ 
          success: false, 
          error: 'O roteiro é obrigatório e deve ser uma string' 
        });
      }
      
      // Validar tamanho do roteiro
      const maxScriptLength = parseInt(process.env.MAX_SCRIPT_LENGTH || '500');
      if (script.length > maxScriptLength) {
        return res.status(400).json({ 
          success: false, 
          error: `O roteiro deve ter no máximo ${maxScriptLength} caracteres`
        });
      }

      // Importar sistema de filas
      const { queueVideoGeneration } = await import('./queue');
      
      // Adicionar o job à fila
      const queueResult = await queueVideoGeneration({ 
        script,
        voice: req.body.voice,
        speed: req.body.speed,
        transitions: req.body.transitions,
        outputFormat: req.body.outputFormat
      });
      
      // Retornar o ID do job e status
      return res.json({
        success: true,
        jobId: queueResult.jobId,
        status: queueResult.status,
        message: queueResult.message
      });
      
    } catch (error: any) {
      console.error('Erro na geração:', error);
      
      // Classificação detalhada do erro
      let statusCode = 500;
      let errorMessage = error.message || 'Falha ao processar a solicitação';
      let errorType = 'server_error';
      
      // Determinar tipos específicos de erro
      if (error.message?.includes('API key')) {
        errorType = 'api_key_error';
        statusCode = 401;
      } else if (error.message?.includes('rate limit')) {
        errorType = 'rate_limit_error';
        statusCode = 429;
      } else if (error.message?.includes('incompletos')) {
        errorType = 'data_error';
      }
      
      res.status(statusCode).json({
        success: false,
        error: errorMessage,
        errorType: errorType,
        dica: errorType === 'api_key_error' 
          ? 'Verifique se suas chaves de API (ElevenLabs e OpenAI) estão configuradas corretamente'
          : errorType === 'rate_limit_error'
          ? 'Aguarde alguns minutos e tente novamente'
          : 'Verifique os logs do servidor para mais detalhes'
      });
    }
  });
  
  /**
   * Endpoint para verificar o status de um job na fila
   */
  app.get("/job-status/:jobId", async (req: Request, res: Response) => {
    try {
      const { jobId } = req.params;
      
      if (!jobId) {
        return res.status(400).json({
          success: false,
          error: 'ID do job não fornecido'
        });
      }
      
      // Importar sistema de filas
      const { checkJobStatus } = await import('./queue');
      
      // Verificar status do job
      const status = await checkJobStatus(jobId);
      
      if (!status.exists) {
        return res.status(404).json({
          success: false,
          error: 'Job não encontrado'
        });
      }
      
      return res.json({
        success: true,
        jobId,
        status: status.status,
        progress: status.progress,
        message: status.message,
        processingTime: status.processingTime,
        createdAt: status.createdAt
      });
      
    } catch (error: any) {
      console.error('Erro ao verificar status do job:', error);
      res.status(500).json({
        success: false,
        error: error.message || 'Erro ao verificar status do job'
      });
    }
  });
  
  /**
   * Endpoint para obter resultado de um job concluído
   */
  app.get("/job-result/:jobId", async (req: Request, res: Response) => {
    try {
      const { jobId } = req.params;
      
      if (!jobId) {
        return res.status(400).json({
          success: false,
          error: 'ID do job não fornecido'
        });
      }
      
      // Importar sistema de filas e utilizar a função de verificação de status
      const { checkJobStatus } = await import('./queue');
      
      // Verificar status do job
      const status = await checkJobStatus(jobId);
      
      if (!status.exists) {
        return res.status(404).json({
          success: false,
          error: 'Job não encontrado'
        });
      }
      
      if (status.status !== 'completed') {
        return res.status(400).json({
          success: false,
          error: `Job ainda não concluído (status: ${status.status})`,
          status: status.status,
          progress: status.progress
        });
      }
      
      // Para acessar o resultado, precisamos obter o job da fila diretamente
      // Usando um método não exportado pelo nosso módulo
      // Solução: importamos diretamente do Bull
      const Queue = require('bull');
      const videoQueue = new Queue('video-generation', process.env.REDIS_URL || 'redis://127.0.0.1:6379');
      
      // Tentar obter o job e seu resultado
      const job = await videoQueue.getJob(jobId);
      
      if (!job) {
        return res.status(404).json({
          success: false,
          error: 'Job não encontrado após verificação de status'
        });
      }
      
      // Obter resultado
      const videoResult = job.returnvalue;
      
      // Validação adicional do resultado
      if (!videoResult || !videoResult.resources) {
        throw new Error('Dados incompletos gerados pelo serviço de vídeo');
      }
      
      // Retornar no formato esperado pelo cliente com campos adicionais
      res.json({ 
        videoUrl: videoResult.resources.audioData,
        subtitles: videoResult.resources.subtitles,
        imageUrls: videoResult.resources.imageUrls,
        success: true,
        metadata: {
          duration: videoResult.metadata?.duration || 0,
          segments: videoResult.metadata?.segments || 0
        }
      });
      
    } catch (error: any) {
      console.error('Erro ao obter resultado do job:', error);
      res.status(500).json({
        success: false,
        error: error.message || 'Erro ao obter resultado do job'
      });
    }
  });
  
  /**
   * Endpoint para verificar o status de um vídeo e sua disponibilidade
   * Inclui verificações avançadas para garantir que o vídeo está completo e pronto para visualização
   */
  app.get("/video-status/:id", async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      const fs = require('fs');
      const path = require('path');
      
      // Verificar se o ID é válido
      if (!id) {
        return res.status(400).json({
          success: false,
          error: 'ID de vídeo inválido'
        });
      }
      
      // Buscar o status do job
      const { checkJobStatus } = await import('./queue');
      const jobStatus = await checkJobStatus(id);
      
      // Verificar se o resultado do job está disponível
      let jobResult;
      let videoPath = '';
      let fileSize = 0;
      let duration = 0;
      let isPlayable = false;
      
      if (jobStatus && jobStatus.status === 'completed') {
        // Para acessar o resultado, precisamos obter o job da fila diretamente
        const Queue = require('bull');
        const videoQueue = new Queue('video-generation', process.env.REDIS_URL || 'redis://127.0.0.1:6379');
        
        // Tentar obter o job e seu resultado
        const job = await videoQueue.getJob(id);
        
        if (job) {
          jobResult = job.returnvalue;
          
          // Determinar o caminho do arquivo de vídeo (se disponível)
          if (jobResult && jobResult.resources && jobResult.resources.audioData) {
            videoPath = jobResult.resources.audioData;
            
            // Verificar se o arquivo existe e é acessível
            if (fs.existsSync(videoPath)) {
              const stat = fs.statSync(videoPath);
              fileSize = stat.size;
              
              // Verificar integridade do arquivo (tamanho mínimo para ser um vídeo válido)
              if (fileSize > 1024) { // Pelo menos 1KB
                isPlayable = true;
                
                // Tentar obter a duração (opcional, pode exigir dependências adicionais)
                if (jobResult.metadata && jobResult.metadata.duration) {
                  duration = jobResult.metadata.duration;
                }
              }
            }
          }
        }
      }
      
      res.json({
        success: true,
        status: jobStatus?.status || 'unknown',
        jobId: id,
        path: videoPath,
        size: fileSize,
        duration: duration,
        isPlayable: isPlayable,
        isComplete: jobStatus?.status === 'completed' && isPlayable,
        result: jobResult || null
      });
      
    } catch (error: any) {
      console.error("Erro ao verificar status do vídeo:", error);
      res.status(500).json({
        success: false,
        error: error.message || "Erro ao verificar status do vídeo"
      });
    }
  });
  
  /**
   * Endpoint para streaming de vídeo com suporte a range requests
   * Permite streaming eficiente do conteúdo para o player de vídeo
   */
  app.get("/video-stream/:id", async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      const fs = require('fs');
      
      // Primeiro, obter o caminho do arquivo de vídeo
      // Verificar se o resultado do job está disponível
      const Queue = require('bull');
      const videoQueue = new Queue('video-generation', process.env.REDIS_URL || 'redis://127.0.0.1:6379');
      
      // Tentar obter o job e seu resultado
      const job = await videoQueue.getJob(id);
      
      if (!job || !job.returnvalue || !job.returnvalue.resources || !job.returnvalue.resources.audioData) {
        return res.status(404).send('Vídeo não encontrado');
      }
      
      const videoPath = job.returnvalue.resources.audioData;
      
      // Verificar se o arquivo existe
      if (!fs.existsSync(videoPath)) {
        return res.status(404).send('Arquivo de vídeo não encontrado');
      }
      
      // Configuração para streaming de vídeo
      const stat = fs.statSync(videoPath);
      const fileSize = stat.size;
      const range = req.headers.range;
      
      if (range) {
        // Streaming parcial (range request)
        const parts = range.replace(/bytes=/, "").split("-");
        const start = parseInt(parts[0], 10);
        const end = parts[1] ? parseInt(parts[1], 10) : fileSize - 1;
        
        const chunksize = (end - start) + 1;
        const file = fs.createReadStream(videoPath, { start, end });
        const head = {
          'Content-Range': `bytes ${start}-${end}/${fileSize}`,
          'Accept-Ranges': 'bytes',
          'Content-Length': chunksize,
          'Content-Type': 'video/mp4',
        };
        
        res.writeHead(206, head);
        file.pipe(res);
      } else {
        // Streaming completo
        const head = {
          'Content-Length': fileSize,
          'Content-Type': 'video/mp4',
        };
        res.writeHead(200, head);
        fs.createReadStream(videoPath).pipe(res);
      }
    } catch (error: any) {
      console.error('Erro ao realizar streaming de vídeo:', error);
      res.status(500).send('Erro ao processar vídeo para streaming');
    }
  });
  
  /**
   * Endpoint para download de vídeo
   * Permite que os usuários baixem o vídeo completo
   */
  app.get("/download-video/:id", async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      const fs = require('fs');
      const path = require('path');
      
      // Obter o caminho do arquivo de vídeo
      const Queue = require('bull');
      const videoQueue = new Queue('video-generation', process.env.REDIS_URL || 'redis://127.0.0.1:6379');
      
      // Tentar obter o job e seu resultado
      const job = await videoQueue.getJob(id);
      
      if (!job || !job.returnvalue || !job.returnvalue.resources || !job.returnvalue.resources.audioData) {
        return res.status(404).send('Vídeo não disponível para download');
      }
      
      const videoPath = job.returnvalue.resources.audioData;
      
      // Verificar se o arquivo existe
      if (!fs.existsSync(videoPath)) {
        return res.status(404).send('Arquivo de vídeo não encontrado');
      }
      
      // Fornecer o arquivo para download
      res.download(videoPath, `video-${id}.mp4`, (err) => {
        if (err) {
          console.error('Erro no download:', err);
        }
      });
    } catch (error: any) {
      console.error('Erro ao realizar download de vídeo:', error);
      res.status(500).send('Erro ao processar vídeo para download');
    }
  });
  
  /**
   * Endpoint para gerar conteúdo com OpenAI
   */
  app.post("/api/generate", async (req: Request, res: Response) => {
    try {
      const validatedData = contentGenerationSchema.parse(req.body);
      const result = await generateContent(validatedData);
      
      // Salvar o conteúdo gerado
      const savedContent = await storage.saveContent({
        type: validatedData.type,
        platform: validatedData.platform,
        topic: validatedData.topic,
        style: validatedData.style,
        content: result,
        createdAt: new Date()
      });
      
      res.json({ 
        success: true,
        content: result,
        contentId: savedContent.id
      });
    } catch (error: any) {
      console.error("Erro ao gerar conteúdo:", error);
      res.status(400).json({ 
        success: false,
        error: error.message || "Erro ao gerar conteúdo" 
      });
    }
  });
  
  /**
   * Endpoint para obter histórico de conteúdo do usuário
   */
  app.get("/api/content-history", async (req: Request, res: Response) => {
    try {
      const contentHistory = await storage.getContentHistory();
      res.json({
        success: true,
        history: contentHistory
      });
    } catch (error: any) {
      console.error("Erro ao obter histórico:", error);
      res.status(500).json({
        success: false,
        error: error.message || "Erro ao obter histórico"
      });
    }
  });
  
  /**
   * Endpoint para dados de preços dinâmicos
   */
  app.get("/api/pricing-data", (req: Request, res: Response) => {
    // Simulação de dados dinâmicos baseados na hora do dia e outros fatores
    const now = new Date();
    const hour = now.getHours();
    
    // Preços base
    const basePrices = {
      basic: { original: 89, current: 59 },
      premium: { original: 117, current: 89 },
      ultimate: { original: 149, current: 129.90 }
    };
    
    // Aplicar variação baseada na hora do dia
    // Preços ligeiramente mais altos durante horário comercial (9h-18h)
    const isPeakHour = hour >= 9 && hour <= 18;
    const priceMultiplier = isPeakHour ? 1.00 : 0.97;
    
    // Simular também baseado no dia da semana (promoção de fim de semana)
    const dayOfWeek = now.getDay(); // 0 = Domingo, 6 = Sábado
    const isWeekend = dayOfWeek === 0 || dayOfWeek === 6;
    const weekendDiscount = isWeekend ? 0.95 : 1.0;
    
    // Calcular preços finais
    const finalPrices = {
      basic: {
        original: basePrices.basic.original,
        current: Math.round(basePrices.basic.current * priceMultiplier * weekendDiscount)
      },
      premium: {
        original: basePrices.premium.original,
        current: Math.round(basePrices.premium.current * priceMultiplier * weekendDiscount),
        expiresIn: Math.floor(Math.random() * 24) + 1 // Horas restantes (1-24)
      },
      ultimate: {
        original: basePrices.ultimate.original,
        current: Math.round(basePrices.ultimate.current * priceMultiplier * weekendDiscount * 100) / 100
      }
    };
    
    // Adicionar metadados da promoção
    const metadata = {
      promoActive: true,
      promoName: isWeekend ? "Promoção de Fim de Semana" : "Oferta Relâmpago",
      globalDiscount: isWeekend ? "5%" : null,
      expiresAt: (() => {
        const expiry = new Date();
        expiry.setHours(23, 59, 59, 999); // Fim do dia atual
        return expiry.toISOString();
      })(),
      userViews: Math.floor(Math.random() * 5) + 1, // Número de visualizações do usuário (1-5)
      recentSales: Math.floor(Math.random() * 10) + 5 // Vendas recentes (5-15)
    };
    
    res.json({
      success: true,
      prices: finalPrices,
      metadata
    });
  });
  
  /**
   * Endpoint para log de cliques de usuários
   */
  app.post("/api/clicks", (req: Request, res: Response) => {
    const { element, page, timestamp, sessionId } = req.body;
    
    // Log para debug e análise
    console.log(`Clique registrado: ${element} em ${page} (${sessionId})`);
    
    // Aqui poderia salvar em banco de dados
    
    res.json({ success: true });
  });
  
  /**
   * Endpoint para log de dados de heatmap
   */
  app.post("/api/heatmap-data", (req: Request, res: Response) => {
    const { movements, page, sessionId } = req.body;
    
    // Log para debug (apenas quantidade para não sobrecarregar o log)
    if (movements && Array.isArray(movements)) {
      console.log(`Recebidos ${movements.length} movimentos para a página ${page} (${sessionId})`);
    }
    
    res.json({ success: true });
  });
  
  /**
   * Endpoint para analytics gerais
   */
  app.post("/api/analytics", (req: Request, res: Response) => {
    const { eventType, eventData, sessionId, timestamp } = req.body;
    
    // Log para debug
    console.log(`Evento analytics: ${eventType} (${sessionId})`);
    
    res.json({ success: true });
  });
  
  /**
   * Endpoint para log de erros
   */
  app.post("/api/error-log", (req: Request, res: Response) => {
    const { message, stack, componentStack, url, line, column, sessionId } = req.body;
    
    // Log para debug
    console.error(`Erro do cliente: ${message} em ${url}:${line}:${column}`);
    if (stack) {
      console.error("Stack:", stack.split("\n").slice(0, 5).join("\n"));
    }
    
    res.json({ success: true, logged: true });
  });
  
  /**
   * Endpoint para verificação de status das APIs e ambiente
   */
  app.get("/api/sys-status", (req: Request, res: Response) => {
    const apiStatus = {
      openai: !!process.env.OPENAI_API_KEY ? 'configured' : 'missing',
      elevenlabs: !!process.env.ELEVENLABS_API_KEY ? 'configured' : 'missing',
      stripe: !!process.env.STRIPE_SECRET_KEY ? 'configured' : 'missing'
    };
    
    res.json({
      success: true,
      status: {
        server: 'online',
        apis: apiStatus,
        environment: process.env.NODE_ENV || 'development',
        version: '1.0.0'
      }
    });
  });

  /**
   * Endpoint para testar a conexão com uma API específica
   * Realiza testes reais de conectividade em vez de apenas verificar se as chaves existem
   */
  app.get("/api/test-api-connection/:api", async (req: Request, res: Response) => {
    const { api } = req.params;
    
    try {
      // Verificação de OpenAI
      if (api === 'openai') {
        if (!process.env.OPENAI_API_KEY) {
          return res.status(400).json({
            success: false,
            error: 'Chave de API da OpenAI não configurada'
          });
        }
        
        // Teste de conexão simples à API da OpenAI
        const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
        
        try {
          const models = await openai.models.list();
          
          return res.json({
            success: true,
            connection: {
              working: true,
              status: 'connected',
              models: models.data.length
            }
          });
        } catch (openAIError: any) {
          console.error('Erro OpenAI:', openAIError);
          
          return res.json({
            success: false,
            connection: {
              working: false,
              status: 'error',
              message: openAIError.message
            }
          });
        }
      }
      
      // Verificação de ElevenLabs
      if (api === 'elevenlabs') {
        if (!process.env.ELEVENLABS_API_KEY) {
          return res.status(400).json({
            success: false,
            error: 'Chave de API da ElevenLabs não configurada'
          });
        }
        
        try {
          // Teste básico de conexão com a API da ElevenLabs
          const response = await fetch('https://api.elevenlabs.io/v1/voices', {
            headers: {
              'xi-api-key': process.env.ELEVENLABS_API_KEY as string,
              'Content-Type': 'application/json'
            }
          });
          
          const data = await response.json();
          
          if (response.ok) {
            return res.json({
              success: true,
              connection: {
                working: true,
                status: 'connected',
                voices: data.voices?.length || 0
              }
            });
          } else {
            return res.json({
              success: false,
              connection: {
                working: false,
                status: 'error',
                message: data.detail || 'Erro ao conectar à API ElevenLabs'
              }
            });
          }
        } catch (elevenLabsError: any) {
          console.error('Erro ElevenLabs:', elevenLabsError);
          
          return res.json({
            success: false,
            connection: {
              working: false,
              status: 'error',
              message: elevenLabsError.message
            }
          });
        }
      }
      
      // API não suportada
      return res.status(400).json({
        success: false,
        error: `API não suportada: ${api}`
      });
      
    } catch (error: any) {
      console.error(`Erro ao testar API ${api}:`, error);
      
      return res.status(500).json({
        success: false,
        error: error.message || 'Erro interno ao testar conexão com API'
      });
    }
  });
  
  /**
   * Endpoint para testar a geração de vídeo com processador aprimorado e detecção de silêncio
   */
  app.post("/api/test-video-generator", async (req: Request, res: Response) => {
    try {
      console.log('Recebida solicitação para gerar vídeo de teste');
      const { script, options } = req.body;
      
      if (!script || typeof script !== 'string') {
        console.warn('Script inválido recebido na solicitação');
        return res.status(400).json({
          success: false,
          error: 'O script é obrigatório e deve ser uma string'
        });
      }
      
      // Verificar diretórios necessários antes de iniciar o processamento
      try {
        // Garantir que diretórios existem
        const tmpDir = path.join(process.cwd(), 'tmp');
        const outputDir = path.join(process.cwd(), 'output');
        
        // Verificar/criar diretório tmp
        try {
          await fs.promises.access(tmpDir);
          console.log('Diretório tmp existe');
        } catch (e) {
          console.log('Criando diretório tmp');
          await fs.promises.mkdir(tmpDir, { recursive: true });
        }
        
        // Verificar/criar diretório output
        try {
          await fs.promises.access(outputDir);
          console.log('Diretório output existe');
        } catch (e) {
          console.log('Criando diretório output');
          await fs.promises.mkdir(outputDir, { recursive: true });
        }
      } catch (dirError) {
        console.error('Erro ao verificar/criar diretórios:', dirError);
        return res.status(500).json({
          success: false,
          error: 'Falha ao preparar diretórios para processamento'
        });
      }
      
      // Criar uma nova tarefa
      const taskId = nanoid();
      console.log(`Nova tarefa criada: ${taskId}`);
      
      // Registrar a tarefa
      activeTasks.set(taskId, {
        id: taskId,
        status: 'pending',
        progress: 0,
        message: 'Inicializando geração de vídeo de teste',
        startTime: Date.now()
      });
      
      // Iniciar processamento assíncrono
      console.log('Iniciando processamento assíncrono');
      setTimeout(async () => {
        try {
          // Marcar início para rastrear duração
          const startTime = Date.now();
          
          // Atualizar status para processando
          updateTaskProgress(taskId, 10, 'Gerando vídeo de teste...', 'processing');
          
          console.log('Chamando função testeGerarVideo com script e opções');
          // Processar o vídeo com as opções fornecidas
          const videoPath = await testeGerarVideo(script, {
            voz: options?.voz,
            detectarSilencio: options?.detectarSilencio,
            topico: options?.topico,
            transicoes: options?.transicoes,
            resolucao: options?.resolucao
          });
          
          // Verificar se o caminho retornado é válido
          if (!videoPath) {
            throw new Error('Caminho de vídeo inválido retornado pelo processador');
          }
          
          console.log(`Vídeo processado com sucesso: ${videoPath}`);
          
          // Verificar se o arquivo realmente existe
          try {
            // Preparar resultado com estatísticas básicas
            // Usar o fs nativo para obter estatísticas do arquivo
            const fsSync = fs;
            const fileStats = await fsSync.promises.stat(videoPath);
            
            if (fileStats.size < 1000) {
              console.warn(`Arquivo de vídeo gerado é muito pequeno: ${fileStats.size} bytes`);
              throw new Error('Arquivo de vídeo gerado é muito pequeno ou inválido');
            }
            
            const processingTime = Date.now() - startTime;
            console.log(`Tempo total de processamento: ${processingTime}ms`);
            
            // Atualizar status para concluído
            updateTaskProgress(
              taskId, 
              100, 
              'Vídeo gerado com sucesso!', 
              'completed',
              {
                videoPath,
                size: fileStats.size,
                duration: 'N/A', // Poderia ser obtido com FFmpeg
                createdAt: new Date().toISOString(),
                processingTime
              }
            );
          } catch (statError: any) {
            console.error('Erro ao verificar arquivo de vídeo:', statError);
            throw new Error(`Falha ao verificar arquivo de vídeo: ${statError.message}`);
          }
          
        } catch (err) {
          const error = err instanceof Error ? err : new Error(String(err));
          console.error('Erro na geração de vídeo de teste:', error);
          
          // Atualizar status para falha
          updateTaskProgress(
            taskId,
            0,
            `Falha ao gerar vídeo: ${error.message}`,
            'failed',
            null,
            error.message
          );
        }
      }, 0);
      
      // Retornar o ID da tarefa para que o cliente possa consultar o status
      return res.json({
        success: true,
        taskId,
        message: 'Geração de vídeo iniciada'
      });
      
    } catch (error: any) {
      console.error('Erro ao processar solicitação de teste de vídeo:', error);
      return res.status(500).json({
        success: false,
        error: error.message || 'Erro interno ao processar solicitação'
      });
    }
  });
  
  /**
   * Endpoint para verificar o status de uma tarefa de processamento
   */
  app.get("/api/task-status/:taskId", async (req: Request, res: Response) => {
    try {
      const { taskId } = req.params;
      
      if (!taskId) {
        return res.status(400).json({
          success: false,
          error: 'ID da tarefa não fornecido'
        });
      }
      
      // Verificar se a tarefa existe
      const task = activeTasks.get(taskId);
      
      if (!task) {
        return res.status(404).json({
          success: false,
          error: 'Tarefa não encontrada'
        });
      }
      
      // Calcular o tempo de processamento
      const processingTime = Date.now() - task.startTime;
      
      return res.json({
        success: true,
        task: {
          id: task.id,
          status: task.status,
          progress: task.progress,
          message: task.message,
          processingTime,
          result: task.result,
          error: task.error
        }
      });
    } catch (error: any) {
      console.error('Erro ao verificar status da tarefa:', error);
      return res.status(500).json({
        success: false,
        error: error.message || 'Erro interno ao verificar status da tarefa'
      });
    }
  });
  
  /**
   * Endpoint para garantir a existência dos diretórios necessários
   */
  app.get("/api/ensure-directories", async (req: Request, res: Response) => {
    try {
      // Garantir que os diretórios necessários existem
      const ensureDir = async (dir: string) => {
        try {
          // Usar o pacote fs-extra que tem suporte a promessas
          const fsPromises = require('fs').promises;
          try {
            await fsPromises.access(dir);
          } catch (e) {
            await fsPromises.mkdir(dir, { recursive: true });
          }
        } catch (err) {
          console.error(`Erro ao manipular diretório ${dir}:`, err);
          // Se falhar com promises, tenta o método síncrono
          const fs = require('fs');
          if (!fs.existsSync(dir)) {
            fs.mkdirSync(dir, { recursive: true });
          }
        }
      };
      
      await ensureDir(TMP_DIR);
      await ensureDir(OUTPUT_DIR);
      await ensureDir(IMAGES_DIR);
      
      return res.json({
        success: true,
        directories: {
          tmp: TMP_DIR,
          output: OUTPUT_DIR,
          images: IMAGES_DIR
        }
      });
    } catch (error: any) {
      console.error('Erro ao garantir diretórios:', error);
      return res.status(500).json({
        success: false,
        error: error.message || 'Erro ao garantir diretórios'
      });
    }
  });
  
  /**
   * Endpoint para visualização de vídeo a partir do caminho do arquivo
   */
  app.get("/api/video/:videoPath(*)", async (req: Request, res: Response) => {
    try {
      const videoPath = req.params.videoPath;
      
      if (!videoPath) {
        return res.status(400).send('Caminho do vídeo não especificado');
      }
      
      // Por segurança, garantir que o caminho está dentro dos diretórios permitidos
      const absolutePath = path.resolve(videoPath);
      const outputDir = path.resolve('output');
      const tmpDir = path.resolve('tmp');
      
      if (!absolutePath.startsWith(outputDir) && !absolutePath.startsWith(tmpDir)) {
        return res.status(403).send('Acesso negado ao arquivo');
      }
      
      // Verificar se o arquivo existe
      try {
        const fsSync = require('fs');
        await fs.access(absolutePath);
        
        // Streaming do vídeo
        const stat = fsSync.statSync(absolutePath);
        const fileSize = stat.size;
        const range = req.headers.range;
        
        if (range) {
          const parts = range.replace(/bytes=/, '').split('-');
          const start = parseInt(parts[0], 10);
          const end = parts[1] ? parseInt(parts[1], 10) : fileSize - 1;
          const chunksize = (end - start) + 1;
          const file = fsSync.createReadStream(absolutePath, { start, end });
          
          const head = {
            'Content-Range': `bytes ${start}-${end}/${fileSize}`,
            'Accept-Ranges': 'bytes',
            'Content-Length': chunksize,
            'Content-Type': 'video/mp4',
          };
          
          res.writeHead(206, head);
          file.pipe(res);
        } else {
          const head = {
            'Content-Length': fileSize,
            'Content-Type': 'video/mp4',
          };
          
          res.writeHead(200, head);
          fsSync.createReadStream(absolutePath).pipe(res);
        }
      } catch (error) {
        console.error('Erro ao acessar arquivo de vídeo:', error);
        return res.status(404).send('Arquivo de vídeo não encontrado');
      }
    } catch (error) {
      console.error('Erro ao processar requisição de vídeo:', error);
      return res.status(500).send('Erro ao processar vídeo');
    }
  });
  
  /**
   * Endpoint para estatísticas do servidor - utilizado para monitoramento e debugging
   */
  app.get("/api/server-stats", async (req: Request, res: Response) => {
    try {
      // Estatísticas simples
      const stats = {
        uptime: process.uptime(),
        memory: process.memoryUsage(),
        requestCounts: requestCounter,
        activeTasks: activeTasks.size,
        activeWebSocketConnections: (() => {
          let count = 0;
          activeConnections.forEach(clients => {
            count += clients.size;
          });
          return count;
        })()
      };
      
      res.json({
        success: true,
        stats
      });
    } catch (error: any) {
      console.error("Erro ao obter estatísticas:", error);
      res.status(500).json({
        success: false,
        error: error.message || "Erro ao obter estatísticas"
      });
    }
  });
  
  /**
   * Endpoint para estatísticas da fila de processamento
   */
  app.get("/api/queue-stats", async (req: Request, res: Response) => {
    try {
      // Importar sistema de filas
      const { getQueueStats } = await import('./queue');
      
      // Obter estatísticas
      const stats = await getQueueStats();
      
      res.json({
        success: true,
        stats
      });
    } catch (error: any) {
      console.error("Erro ao obter estatísticas da fila:", error);
      res.status(500).json({
        success: false,
        error: error.message || "Erro ao obter estatísticas da fila"
      });
    }
  });
  
  /**
   * Endpoint para limpar a fila de processamento
   * Limpa todos os jobs pendentes (não afeta jobs ativos)
   */
  app.post("/api/clear-queue", async (req: Request, res: Response) => {
    try {
      const Queue = require('bull');
      const videoQueue = new Queue('video-generation', process.env.REDIS_URL || 'redis://127.0.0.1:6379');
      
      // Limpar jobs
      await videoQueue.clean(0, 'wait');
      await videoQueue.clean(0, 'delayed');
      await videoQueue.clean(0, 'failed');
      
      res.json({
        success: true,
        message: 'Fila limpa com sucesso'
      });
    } catch (error: any) {
      console.error("Erro ao limpar fila:", error);
      res.status(500).json({
        success: false,
        error: error.message || "Erro ao limpar fila"
      });
    }
  });
  
  /**
   * Endpoint para diagnóstico aprofundado - verificação API real
   * Usamos uma rota alternativa para evitar problemas com o servidor Vite
   */
  app.get("/api/debug-system-check", async (req: Request, res: Response) => {
    try {
      const results = await (async () => {
        // Verificar Redis
        let redisResult = { working: false, status: "error" };
        try {
          const Queue = require('bull');
          const testQueue = new Queue('test-queue', process.env.REDIS_URL || 'redis://127.0.0.1:6379');
          await testQueue.add({test: true});
          await testQueue.clean(0, 'completed');
          await testQueue.close();
          redisResult = { working: true, status: "ok" };
        } catch (error: any) {
          redisResult = { 
            working: false, 
            status: error.code === 'ECONNREFUSED' ? "connection_refused" : "error",
            message: error.message 
          };
        }
        
        // Verificar FFmpeg
        let ffmpegResult = { working: false, status: "not_found" };
        try {
          const { execSync } = require('child_process');
          const output = execSync('ffmpeg -version');
          ffmpegResult = { working: true, status: "ok", version: output.toString().split('\n')[0] };
        } catch (error: any) {
          ffmpegResult = { 
            working: false, 
            status: error.code === 'ENOENT' ? "not_found" : "error",
            message: error.message 
          };
        }
        
        // Verificar OpenAI com teste mais robusto
        let openaiResult = { working: false, status: "unconfigured" };
        if (process.env.OPENAI_API_KEY) {
          try {
            console.log('Verificando API OpenAI...');
            const openai = new OpenAI({
              apiKey: process.env.OPENAI_API_KEY
            });
            
            // Tentar fazer uma requisição real para testar autenticação e capacidade
            const completion = await openai.chat.completions.create({
              model: "gpt-3.5-turbo",
              messages: [{ role: "user", content: "API test" }],
              max_tokens: 5
            });
            
            console.log('OpenAI respondeu com:', completion.choices[0]?.message?.content);
            
            openaiResult = { 
              working: true, 
              status: "ok", 
              model: completion.model,
              response: completion.choices[0]?.message?.content,
              usage: completion.usage
            };
          } catch (error: any) {
            console.error('Erro detalhado OpenAI:', error);
            
            // Análise mais detalhada do erro
            let errorStatus = "api_error";
            if (error.status === 401) {
              errorStatus = "invalid_api_key";
            } else if (error.status === 429) {
              errorStatus = "rate_limit_exceeded";
            } else if (error.status === 403) {
              errorStatus = "permission_denied";
            }
            
            openaiResult = { 
              working: false, 
              status: errorStatus,
              message: error.message,
              details: error.toString()
            };
          }
        }
        
        // Verificar ElevenLabs com teste mais robusto
        let elevenlabsResult = { working: false, status: "unconfigured" };
        if (process.env.ELEVENLABS_API_KEY) {
          try {
            console.log('Verificando API ElevenLabs...');
            // Usar endpoint de usuário para testar autenticação
            const response = await fetch('https://api.elevenlabs.io/v1/user', {
              headers: {
                'Accept': 'application/json',
                'xi-api-key': process.env.ELEVENLABS_API_KEY
              }
            });
            
            console.log('ElevenLabs respondeu com status:', response.status);
            
            if (!response.ok) {
              const errorText = await response.text();
              console.error('Erro ElevenLabs:', errorText);
              
              // Identificar o tipo de erro
              let errorStatus = "api_error";
              if (response.status === 401) {
                errorStatus = "invalid_api_key";
              } else if (response.status === 429) {
                errorStatus = "rate_limit_exceeded";
              }
              
              throw new Error(`${errorStatus}: Status ${response.status}`);
            }
            
            const userData = await response.json();
            console.log('ElevenLabs dados de usuário recebidos:', userData.subscription?.tier || 'dados básicos');
            
            // Se o teste básico de autenticação funcionou, buscar as vozes disponíveis
            const voicesResponse = await fetch('https://api.elevenlabs.io/v1/voices', {
              headers: {
                'Accept': 'application/json',
                'xi-api-key': process.env.ELEVENLABS_API_KEY
              }
            });
            
            if (!voicesResponse.ok) {
              throw new Error(`Erro ao buscar vozes: ${voicesResponse.status}`);
            }
            
            const voicesData = await voicesResponse.json();
            
            elevenlabsResult = { 
              working: true, 
              status: "ok", 
              subscription: userData.subscription?.tier || "desconhecido",
              voices: voicesData.voices?.slice(0, 3).map((v: any) => v.name) || []
            };
          } catch (error: any) {
            console.error('Erro detalhado ElevenLabs:', error);
            
            // Extrair tipo de erro da mensagem
            let errorStatus = "api_error";
            if (error.message.includes("invalid_api_key") || error.message.includes("401")) {
              errorStatus = "invalid_api_key";
            } else if (error.message.includes("rate_limit") || error.message.includes("429")) {
              errorStatus = "rate_limit_exceeded";
            }
            
            elevenlabsResult = { 
              working: false, 
              status: errorStatus,
              message: error.message,
              details: error.toString() 
            };
          }
        }
        
        return {
          redis: redisResult,
          ffmpeg: ffmpegResult,
          openai: openaiResult,
          elevenlabs: elevenlabsResult,
          environment: {
            node: process.version,
            platform: process.platform,
            arch: process.arch,
            memory: {
              total: Math.round(require('os').totalmem() / (1024 * 1024)) + 'MB',
              free: Math.round(require('os').freemem() / (1024 * 1024)) + 'MB'
            }
          }
        };
      })();
      
      // Retornar resultados
      res.json({
        success: true,
        results,
        components: results,
        suggestions: [
          !results.redis.working ? "Reinicie o servidor Redis com: redis-server --daemonize yes" : null,
          !results.ffmpeg.working ? "Instale o FFmpeg com: sudo apt-get install ffmpeg" : null,
          !results.elevenlabs.working && results.elevenlabs.status === "authentication error" ? "Verifique a chave API do ElevenLabs" : null,
          !results.openai.working && results.openai.status === "authentication error" ? "Verifique a chave API da OpenAI" : null
        ].filter(Boolean)
      });
    } catch (error: any) {
      console.error("Erro ao executar diagnóstico:", error);
      res.status(500).json({
        success: false,
        error: error.message || "Erro ao executar diagnóstico"
      });
    }
  });
  
  /**
   * Endpoint para testar a geração de vídeo diretamente
   * Útil para diagnóstico e depuração
   */
  app.post("/api/test-video-generation", async (req: Request, res: Response) => {
    try {
      const { script, voice, speed, transitions, outputFormat } = req.body;
      
      if (!script) {
        return res.status(400).json({
          success: false,
          error: 'O script é obrigatório para a geração do vídeo de teste'
        });
      }
      
      // Importar os módulos necessários
      const { processAudioToVideo, ensureDirectoryExists } = await import('./video-processor');
      const fs = await import('fs/promises');
      const fsSync = await import('fs');
      const path = await import('path');
      const crypto = await import('crypto');
      
      // Diretórios para os arquivos temporários e de saída
      const TMP_DIR = path.join(process.cwd(), 'tmp');
      const OUTPUT_DIR = path.join(process.cwd(), 'output');
      
      // Garantir que os diretórios existam
      await ensureDirectoryExists(TMP_DIR);
      await ensureDirectoryExists(OUTPUT_DIR);
      
      // Criar ID único para o teste
      const testId = crypto.randomUUID();
      console.log(`Iniciando teste de geração de vídeo (ID: ${testId})...`);
      
      // Usar arquivo de áudio existente de teste para simplificar
      const audioPath = path.join(process.cwd(), 'test_audio.mp3');
      
      // Verificar se o arquivo de áudio de teste existe
      try {
        await fs.access(audioPath);
      } catch (err) {
        return res.status(500).json({
          success: false,
          error: 'Arquivo de áudio de teste não encontrado. Por favor, certifique-se de que test_audio.mp3 existe na raiz do projeto.'
        });
      }
      
      // Ler o arquivo de áudio em buffer
      const audioBuffer = await fs.readFile(audioPath);
      
      // Converter buffer para base64
      const audioData = audioBuffer.toString('base64');
      
      // Gerar URLs de imagens simuladas (usando path para test_video.mp4 como placeholder)
      const imageUrls = [
        '/placeholder-image-1.jpg',
        '/placeholder-image-2.jpg',
        '/placeholder-image-3.jpg'
      ];
      
      // Gerar legendas simuladas a partir do script
      const segmentos = script.split(/[.!?]/)
        .filter((segmento: string) => segmento.trim().length > 0)
        .map((segmento: string) => segmento.trim());
      
      // Criar legendas em formato SRT
      const subtitlesArray = segmentos.map((segmento: string, index: number) => {
        return `${index + 1}\n00:0${index}:00,000 --> 00:0${index + 1}:00,000\n${segmento}`;
      });
      
      // Gerar o vídeo
      console.log('Processando áudio para vídeo...');
      const videoPath = await processAudioToVideo(audioData, imageUrls, subtitlesArray);
      
      // Verificar se o arquivo existe
      try {
        await fs.access(videoPath);
        const stats = await fs.stat(videoPath);
        console.log(`Vídeo gerado com sucesso: ${videoPath} (${stats.size} bytes)`);
        
        // Retornar o caminho do vídeo e URL para streaming
        res.json({
          success: true,
          videoPath,
          videoUrl: `/video-stream/${path.basename(videoPath)}`,
          fileSize: stats.size,
          testId,
          message: 'Vídeo gerado com sucesso usando o arquivo de áudio de teste'
        });
      } catch (fileError: any) {
        throw new Error(`Arquivo de vídeo não encontrado ou inacessível: ${videoPath} - ${fileError.message}`);
      }
    } catch (error: any) {
      console.error('Erro ao testar geração de vídeo:', error);
      res.status(500).json({
        success: false,
        error: `Erro ao gerar vídeo: ${error.message}`
      });
    }
  });
  
  /**
   * Endpoint para verificar disponibilidade do ffmpeg
   */
  app.get("/api/check-ffmpeg", async (req: Request, res: Response) => {
    try {
      // Importação simplificada dos módulos necessários
      const { exec } = await import('child_process');
      
      // Função para executar comandos de shell de forma assíncrona
      const execAsync = (cmd: string) => {
        return new Promise<{stdout: string, stderr: string}>((resolve, reject) => {
          exec(cmd, (error, stdout, stderr) => {
            if (error) {
              reject(error);
              return;
            }
            resolve({ stdout, stderr });
          });
        });
      };
      
      // Verificar caminho do ffmpeg-static do pacote
      const ffmpegStaticPackagePath = '/nix/store/3zc5jbvqzrn8zmva4fx5p0nh4yy03wk4-ffmpeg-6.1.1-bin/bin/ffmpeg';
      
      // Tentar executar o ffmpeg diretamente
      try {
        const result = await execAsync('ffmpeg -version');
        console.log('FFmpeg disponível no sistema:', result.stdout.split('\n')[0]);
        
        return res.json({
          success: true,
          source: 'system',
          version: result.stdout.split('\n')[0],
          available: true,
          details: { 
            output: result.stdout.trim(),
            path: await execAsync('which ffmpeg').then(r => r.stdout.trim())
          }
        });
      } catch (systemError) {
        console.error('Erro ao executar ffmpeg do sistema:', systemError);
        
        // Tentar executar o ffmpeg-static diretamente usando o caminho conhecido
        try {
          const staticResult = await execAsync(`${ffmpegStaticPackagePath} -version`);
          console.log('FFmpeg-static disponível:', staticResult.stdout.split('\n')[0]);
          
          return res.json({
            success: true,
            source: 'ffmpeg-static',
            version: staticResult.stdout.split('\n')[0],
            available: true,
            path: ffmpegStaticPackagePath
          });
        } catch (staticError) {
          console.error('Erro ao executar ffmpeg-static:', staticError);
          
          // Verificar se o ffmpeg está instalado em algum local
          try {
            const whichResult = await execAsync('which ffmpeg');
            console.log('FFmpeg encontrado em:', whichResult.stdout.trim());
            
            return res.json({
              success: false,
              error: 'FFmpeg encontrado mas não executável',
              path: whichResult.stdout.trim(),
              available: false
            });
          } catch (whichError) {
            console.error('FFmpeg não encontrado no sistema:', whichError);
            
            return res.json({
              success: false,
              error: 'FFmpeg não encontrado no sistema',
              available: false
            });
          }
        }
      }
    } catch (error: any) {
      console.error('Erro ao verificar ffmpeg:', error);
      res.status(500).json({
        success: false,
        error: `Erro ao verificar ffmpeg: ${error.message}`
      });
    }
  });
  
  // Retornar o servidor HTTP
  return httpServer;
}
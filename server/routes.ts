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
import { nanoid } from 'nanoid';

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
        client.send(update);
      }
    });
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
    ws.on('message', (message: string) => {
      try {
        const data = JSON.parse(message);
        
        // Tratar comando de subscrição a uma tarefa
        if (data.type === 'subscribe' && data.taskId) {
          const taskId = data.taskId;
          
          // Verificar se existe uma tarefa com este ID
          if (activeTasks.has(taskId)) {
            // Adicionar esta conexão ao conjunto de clientes interessados nesta tarefa
            if (!activeConnections.has(taskId)) {
              activeConnections.set(taskId, new Set());
            }
            activeConnections.get(taskId)?.add(ws);
            
            // Enviar o estado atual da tarefa imediatamente
            const task = activeTasks.get(taskId);
            ws.send(JSON.stringify({
              type: 'initial_state',
              taskId,
              progress: task?.progress || 0,
              message: task?.message || 'Iniciando processamento...',
              status: task?.status || 'pending',
              estimatedTimeRemaining: calculateEstimatedTime(task?.progress || 0)
            }));
          } else {
            // Tarefa não encontrada
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
        
        // Verificar OpenAI
        let openaiResult = { working: false, status: "unconfigured" };
        if (process.env.OPENAI_API_KEY) {
          try {
            const openai = new OpenAI({
              apiKey: process.env.OPENAI_API_KEY
            });
            const models = await openai.models.list();
            openaiResult = { 
              working: true, 
              status: "ok", 
              models: models.data.slice(0, 5).map(m => m.id) 
            };
          } catch (error: any) {
            openaiResult = { 
              working: false, 
              status: error.status === 401 ? "authentication error" : "api_error",
              message: error.message 
            };
          }
        }
        
        // Verificar ElevenLabs
        let elevenlabsResult = { working: false, status: "unconfigured" };
        if (process.env.ELEVENLABS_API_KEY) {
          try {
            // Chamada simples para listar vozes disponíveis
            const response = await fetch('https://api.elevenlabs.io/v1/voices', {
              headers: {
                'Accept': 'application/json',
                'xi-api-key': process.env.ELEVENLABS_API_KEY
              }
            });
            
            if (!response.ok) {
              throw new Error(`Status: ${response.status}`);
            }
            
            const data = await response.json();
            elevenlabsResult = { 
              working: true, 
              status: "ok", 
              voices: data.voices.slice(0, 3).map((v: any) => v.name) 
            };
          } catch (error: any) {
            elevenlabsResult = { 
              working: false, 
              status: error.status === 401 ? "authentication error" : "api_error",
              message: error.message 
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
  
  // Retornar o servidor HTTP
  return httpServer;
}
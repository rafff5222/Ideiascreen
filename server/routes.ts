import type { Express, Request, Response } from "express";
import { createServer, type Server } from "http";
import OpenAI from "openai";
import { contentGenerationSchema } from "../shared/schema";
import { generateContent, generateSpeech, generateVideo as generateOpenAIVideo, type SpeechGenerationRequest, type VideoGenerationRequest } from "./openai";
import { storage } from "./storage";
import fs from "fs";
import path from "path";
import { z } from 'zod';
import { generateVideo as generateAIVideo } from "./ai-service";

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
          segments: videoResult.metadata?.segments || 0,
          format: videoResult.format || 'mp4',
          generatedAt: videoResult.metadata?.generatedAt || new Date().toISOString()
        },
        jobId: job.id
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
   * Endpoint para gerar conteúdo com OpenAI
   */
  app.post("/api/generate", async (req: Request, res: Response) => {
    try {
      const validatedData = contentGenerationSchema.parse(req.body);
      
      const content = await generateContent(validatedData);
      
      // Salva o item de conteúdo se o usuário estiver autenticado
      const isAuthenticated = typeof req.isAuthenticated === 'function' ? req.isAuthenticated() : false;
      if (isAuthenticated && req.user) {
        const contentItem = await storage.saveContent({
          userId: req.user.id,
          contentType: validatedData.contentType,
          platform: validatedData.platform,
          topic: validatedData.topic,
          communicationStyle: validatedData.communicationStyle,
          content
        });
        
        return res.json({ content, contentItem });
      }
      
      // Retorna apenas o conteúdo para usuários não autenticados
      res.json({ content });
    } catch (error: any) {
      console.error("Erro ao gerar conteúdo:", error);
      res.status(400).json({ 
        error: error.message || "Erro ao gerar conteúdo" 
      });
    }
  });
  
  /**
   * Endpoint para obter histórico de conteúdo do usuário
   */
  app.get("/api/content-history", async (req: Request, res: Response) => {
    try {
      const isAuthenticated = typeof req.isAuthenticated === 'function' ? req.isAuthenticated() : false;
      if (!isAuthenticated) {
        return res.status(401).json({ error: "Não autorizado" });
      }
      
      const contentHistory = await storage.getContentHistory();
      res.json(contentHistory);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });
  
  /**
   * Endpoint para dados de preços dinâmicos
   */
  app.get("/api/pricing-data", (req: Request, res: Response) => {
    // Preços base
    const basePrices = {
      basic: 59,
      premium: 89,
      pro: 119,
      ultimate: 149
    };
    
    // Hora atual
    const hour = new Date().getHours();
    
    // Desconto noturno (22h às 8h)
    const isNightTime = hour >= 22 || hour < 8;
    const discount = isNightTime ? 0.10 : 0;
    
    // Aplicando desconto
    const dynamicPrices = {
      basic: Math.round(basePrices.basic * (1 - discount)),
      premium: Math.round(basePrices.premium * (1 - discount)),
      pro: Math.round(basePrices.pro * (1 - discount)),
      ultimate: Math.round(basePrices.ultimate * (1 - discount))
    };
    
    // Mensagem promocional
    let promoMessage = '';
    if (isNightTime) {
      promoMessage = '🌙 Promoção especial noturna: 10% OFF em todos os planos!';
    }
    
    res.json({
      prices: dynamicPrices,
      basePrices,
      discount,
      promoMessage
    });
  });
  
  /**
   * Endpoint para log de cliques de usuários
   */
  app.post("/api/clicks", (req: Request, res: Response) => {
    // Registra cliques para análise de comportamento
    console.log("Clique registrado:", req.body);
    res.status(200).send({ success: true });
  });
  
  /**
   * Endpoint para log de dados de heatmap
   */
  app.post("/api/heatmap-data", (req: Request, res: Response) => {
    // Registra dados para heatmap
    console.log("Analytics:", req.body);
    res.status(200).send({ success: true });
  });
  
  /**
   * Endpoint para analytics gerais
   */
  app.post("/api/analytics", (req: Request, res: Response) => {
    // Registra dados de analytics
    console.log("Analytics:", req.body);
    res.status(200).send({ success: true });
  });
  
  /**
   * Endpoint para log de erros
   */
  app.post("/api/error-log", (req: Request, res: Response) => {
    try {
      const { message, source, lineno, colno, error, stack, userAgent, url, timestamp } = req.body;
      
      // Formata a mensagem de erro
      const errorMessage = `
[${new Date(timestamp).toLocaleString()}]
Message: ${message}
URL: ${url}
Source: ${source}
Line/Column: ${lineno}:${colno}
User Agent: ${userAgent}
Stack Trace: ${stack || 'N/A'}
      `.trim();
      
      // Cria o diretório de logs se não existir
      const logDir = path.join(process.cwd(), 'logs');
      if (!fs.existsSync(logDir)) {
        fs.mkdirSync(logDir, { recursive: true });
      }
      
      // Escreve no arquivo de log
      const logFile = path.join(logDir, 'error.log');
      fs.appendFileSync(logFile, errorMessage + '\n\n');
      
      // Registra no console também
      console.error("Erro capturado pelo ErrorMonitor:", {
        message,
        source,
        url,
        timestamp
      });
      
      res.status(200).json({ success: true });
    } catch (error) {
      console.error("Erro ao registrar erro:", error);
      res.status(500).json({ success: false, error: "Falha ao registrar erro" });
    }
  });
  
  /**
   * Endpoint para verificação de status das APIs e ambiente
   */
  app.get("/api/sys-status", (req: Request, res: Response) => {
    // Verificar APIs e chaves de configuração
    const elevenLabsKeyStatus = process.env.ELEVENLABS_API_KEY ? 
      { configured: true, partial: `${process.env.ELEVENLABS_API_KEY.substring(0, 3)}...${process.env.ELEVENLABS_API_KEY.substring(process.env.ELEVENLABS_API_KEY.length - 3)}` } : 
      { configured: false };
    
    const openAIKeyStatus = process.env.OPENAI_API_KEY ? 
      { configured: true, partial: `${process.env.OPENAI_API_KEY.substring(0, 3)}...${process.env.OPENAI_API_KEY.substring(process.env.OPENAI_API_KEY.length - 3)}` } : 
      { configured: false };
      
    // Retorna informações sobre o ambiente e status das APIs
    res.json({
      success: true,
      apis: {
        elevenlabs: elevenLabsKeyStatus,
        openai: openAIKeyStatus
      },
      environment: {
        nodeVersion: process.version,
        platform: process.platform,
        timestamp: new Date().toISOString()
      }
    });
  });
  
  /**
   * Endpoint para estatísticas do servidor - utilizado para monitoramento e debugging
   */
  app.get("/api/server-stats", async (req: Request, res: Response) => {
    // Obter uso de memória atual
    const memoryUsage = process.memoryUsage();
    
    // Calcular estatísticas de requisições
    const requestStats = {
      totalRequests: requestCounter.total,
      successfulRequests: requestCounter.success,
      failedRequests: requestCounter.failed
    };
    
    // Obter estatísticas da fila de processamento (se disponível)
    let queueStats = null;
    try {
      const { getQueueStats } = await import('./queue');
      queueStats = await getQueueStats();
    } catch (error) {
      console.error("Erro ao obter estatísticas da fila:", error);
      // Continua sem as estatísticas da fila
    }
    
    // Retornar estatísticas
    res.json({
      success: true,
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
      memory: {
        heapUsed: memoryUsage.heapUsed,
        heapTotal: memoryUsage.heapTotal,
        external: memoryUsage.external,
        rss: memoryUsage.rss
      },
      requests: requestStats,
      queue: queueStats,
      // Valores de config para debugging
      config: {
        maxScriptLength: process.env.MAX_SCRIPT_LENGTH || 500,
        cacheTTL: process.env.CACHE_TTL || 3600,
        ffmpegPath: process.env.FFMPEG_PATH || './ffmpeg',
      }
    });
  });
  
  /**
   * Endpoint para estatísticas da fila de processamento
   */
  app.get("/api/queue-stats", async (req: Request, res: Response) => {
    try {
      const { getQueueStats } = await import('./queue');
      const stats = await getQueueStats();
      
      // Verificar se é uma requisição de API ou uma página HTML
      const acceptHeader = req.headers.accept || '';
      const wantsHtml = acceptHeader.includes('text/html');
      
      if (wantsHtml) {
        // Retornar uma página HTML com as estatísticas e jobs ativos
        res.setHeader('Content-Type', 'text/html');
        res.send(`
        <!DOCTYPE html>
        <html lang="pt-BR">
        <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Estatísticas da Fila de Processamento</title>
          <style>
            body {
              font-family: system-ui, -apple-system, sans-serif;
              line-height: 1.5;
              color: #333;
              max-width: 1000px;
              margin: 0 auto;
              padding: 20px;
            }
            h1 { color: #0066cc; }
            h2 { color: #444; margin-top: 30px; }
            .stat-card {
              display: inline-block;
              width: 140px;
              text-align: center;
              padding: 15px;
              margin: 10px;
              border-radius: 8px;
              box-shadow: 0 2px 5px rgba(0,0,0,0.1);
            }
            .stat-count {
              font-size: 24px;
              font-weight: bold;
              margin: 10px 0;
            }
            .active { background-color: #fff4cc; }
            .waiting { background-color: #e6f7ff; }
            .completed { background-color: #e6ffea; }
            .failed { background-color: #fff1f0; }
            .total { background-color: #f4f4f7; }
            .progress-bar {
              height: 20px;
              background-color: #e9ecef;
              border-radius: 10px;
              margin: 20px 0;
              overflow: hidden;
            }
            .progress {
              height: 100%;
              background-color: #0066cc;
              border-radius: 10px;
              transition: width 0.3s ease;
            }
            table {
              width: 100%;
              border-collapse: collapse;
              margin: 20px 0;
            }
            th, td {
              padding: 12px;
              text-align: left;
              border-bottom: 1px solid #ddd;
            }
            th { background-color: #f8f9fa; }
            .refresh { margin-top: 20px; }
            .refresh-btn {
              padding: 8px 16px;
              background-color: #0066cc;
              color: white;
              border: none;
              border-radius: 4px;
              cursor: pointer;
            }
            .refresh-btn:hover { background-color: #0052a3; }
          </style>
        </head>
        <body>
          <h1>Estatísticas da Fila de Processamento</h1>
          <p>Última atualização: ${new Date().toLocaleString()}</p>
          
          <div>
            <div class="stat-card active">
              <div>Ativos</div>
              <div class="stat-count">${stats.active}</div>
            </div>
            <div class="stat-card waiting">
              <div>Aguardando</div>
              <div class="stat-count">${stats.waiting}</div>
            </div>
            <div class="stat-card completed">
              <div>Concluídos</div>
              <div class="stat-count">${stats.completed}</div>
            </div>
            <div class="stat-card failed">
              <div>Falhas</div>
              <div class="stat-count">${stats.failed}</div>
            </div>
            <div class="stat-card total">
              <div>Total</div>
              <div class="stat-count">${stats.total}</div>
            </div>
          </div>
          
          <div class="progress-bar">
            <div class="progress" style="width: ${Math.min(100, (stats.completed / Math.max(1, stats.total)) * 100)}%"></div>
          </div>
          
          <div class="refresh">
            <button class="refresh-btn" onclick="location.reload()">Atualizar Dados</button>
          </div>
          
          <h2>Detalhes dos Jobs</h2>
          <p>Esta seção mostrará detalhes dos jobs em execução e em fila quando disponíveis.</p>
          
          <script>
            // Auto-refresh a cada 5 segundos
            setTimeout(() => location.reload(), 5000);
          </script>
        </body>
        </html>
        `);
      } else {
        // Retornar JSON para APIs
        res.json({
          success: true,
          timestamp: new Date().toISOString(),
          stats
        });
      }
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
      // Importamos o módulo bull diretamente para ter acesso a métodos que não exportamos
      const Queue = require('bull');
      const videoQueue = new Queue('video-generation', process.env.REDIS_URL || 'redis://127.0.0.1:6379');
      
      // Obter todos os jobs pendentes
      const waitingJobs = await videoQueue.getWaiting();
      
      // Remover cada job da fila
      let removedCount = 0;
      for (const job of waitingJobs) {
        await job.remove();
        removedCount++;
      }
      
      console.log(`Fila limpa: ${removedCount} jobs removidos`);
      
      res.json({
        success: true,
        message: `Fila limpa com sucesso. ${removedCount} jobs removidos.`,
        removedCount
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
   */
  app.get("/api/diagnose", async (req: Request, res: Response) => {
    const results: Record<string, { working: boolean, status: string, error?: string }> = {
      elevenlabs: { working: false, status: "unchecked" },
      openai: { working: false, status: "unchecked" },
      ffmpeg: { working: false, status: "unchecked" },
      redis: { working: false, status: "unchecked" }
    };
    
    try {
      // 1. Testar FFmpeg (mais rápido e local)
      try {
        const { execSync } = require('child_process');
        const ffmpegVersion = execSync('ffmpeg -version').toString().split('\n')[0];
        results.ffmpeg = { 
          working: ffmpegVersion.includes('ffmpeg version'), 
          status: "installed",
          error: ffmpegVersion.includes('ffmpeg version') ? undefined : "Invalid version response"
        };
      } catch (err: any) {
        results.ffmpeg = { 
          working: false, 
          status: "error", 
          error: err?.message || "Not installed or inaccessible"
        };
      }
      
      // 2. Testar Redis
      try {
        const Redis = require('ioredis');
        const redis = new Redis(process.env.REDIS_URL || 'redis://127.0.0.1:6379');
        await redis.ping();
        await redis.quit();
        results.redis = { 
          working: true, 
          status: "connected" 
        };
      } catch (err: any) {
        results.redis = { 
          working: false, 
          status: "error", 
          error: err?.message || "Failed to connect"
        };
      }
      
      // 3. Testar ElevenLabs API
      if (process.env.ELEVENLABS_API_KEY) {
        try {
          const ElevenLabs = require('elevenlabs-node');
          const voice = new ElevenLabs({
            apiKey: process.env.ELEVENLABS_API_KEY
          });
          
          // Tentar obter lista de vozes para testar autenticação
          try {
            await voice.getVoices();
            results.elevenlabs = { 
              working: true, 
              status: "connected" 
            };
          } catch (apiErr: any) {
            results.elevenlabs = { 
              working: false, 
              status: "authentication error", 
              error: apiErr?.message || "Failed to authenticate"
            };
          }
        } catch (err: any) {
          results.elevenlabs = { 
            working: false, 
            status: "error", 
            error: err?.message || "Unknown error"
          };
        }
      } else {
        results.elevenlabs = { working: false, status: "no api key" };
      }
      
      // 4. Testar OpenAI API
      if (process.env.OPENAI_API_KEY) {
        try {
          const { OpenAI } = await import("openai");
          const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
          
          // Fazer uma requisição simples para testar a autenticação
          try {
            const response = await openai.chat.completions.create({
              model: "gpt-4o",
              messages: [
                { role: "user", content: "API test" }
              ],
              max_tokens: 5
            });
            
            results.openai = { 
              working: !!response?.choices?.[0]?.message?.content, 
              status: "connected"
            };
          } catch (apiErr: any) {
            results.openai = { 
              working: false, 
              status: "authentication error", 
              error: apiErr?.message || "Failed to authenticate"
            };
          }
        } catch (err: any) {
          results.openai = { 
            working: false, 
            status: "error", 
            error: err?.message || "Unknown error"
          };
        }
      } else {
        results.openai = { working: false, status: "no api key" };
      }
      
      // Calcular status geral do sistema
      const allComponentsWorking = Object.values(results).every(r => r.working);
      const apiStatus = (results.elevenlabs.working || results.openai.working) ? "partial" : "down";
      
      // Retornar diagnóstico completo
      res.json({
        success: true,
        timestamp: new Date().toISOString(),
        system_ready: allComponentsWorking,
        api_status: apiStatus,
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

  const httpServer = createServer(app);
  
  return httpServer;
}
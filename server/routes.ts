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
      if (script.length > 500) {
        return res.status(400).json({ 
          success: false, 
          error: 'O roteiro deve ter no máximo 500 caracteres'
        });
      }
      
      // Usar o novo serviço de IA para geração
      const videoResult = await generateAIVideo({ script });
      
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
        }
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

  const httpServer = createServer(app);
  
  return httpServer;
}
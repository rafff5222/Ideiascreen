import Queue from 'bull';
import { generateVideo as generateAIVideo } from './ai-service';
import { log } from './vite';

// Configuração para conectar ao Redis com fallback para processamento em memória
// Para desenvolvimento, usaremos a opção de memória para evitar dependência do Redis
const USE_REDIS = false; // Definido como false para facilitar o desenvolvimento
const REDIS_URL = process.env.REDIS_URL || 'redis://127.0.0.1:6379';

// Fila para geração de vídeos
export let videoQueue: Queue.Queue;

// Opções comuns para ambos os modos
const commonOptions = {
  defaultJobOptions: {
    attempts: 3,            // Número máximo de tentativas
    removeOnComplete: true, // Remove jobs depois de completados com sucesso
    timeout: 120000         // Timeout para jobs (2 minutos)
  }
};

if (USE_REDIS) {
  try {
    // Tentar usar Redis
    videoQueue = new Queue('video-generation', REDIS_URL, {
      ...commonOptions,
      defaultJobOptions: {
        ...commonOptions.defaultJobOptions,
        backoff: {
          type: 'exponential',  // Backoff exponencial
          delay: 1000           // Tempo inicial de espera entre tentativas (1 segundo)
        }
      }
    });
    
    log('Sistema de filas inicializado com sucesso (Redis)', 'queue');
  } catch (error: any) {
    log(`Erro ao configurar Redis: ${error.message}. Usando modo de memória.`, 'queue');
    useMemoryQueue();
  }
} else {
  // Usar memória diretamente sem tentar Redis
  useMemoryQueue();
}

// Função para criar fila em memória
function useMemoryQueue() {
  videoQueue = new Queue('video-generation-memory', {
    ...commonOptions,
    limiter: {
      max: 2,                // Máximo de 2 jobs concorrentes
      duration: 5000         // Em um período de 5 segundos
    }
  });
  
  log('Sistema de filas inicializado em modo de memória', 'queue');
}

// Processador de jobs para geração de vídeo
videoQueue.process(async (job) => {
  const { script, voice, speed, transitions, outputFormat } = job.data;
  
  log(`Processando job ${job.id}: Gerando vídeo a partir do script`, 'queue');
  job.progress(10); // 10% - Iniciando processamento
  
  try {
    // Tentar gerar o vídeo com o sistema de IA
    const videoResult = await generateAIVideo({
      script,
      voice,
      speed,
      transitions,
      outputFormat
    });
    
    job.progress(100); // 100% - Concluído
    log(`Job ${job.id} concluído com sucesso`, 'queue');
    
    return videoResult;
  } catch (error: any) {
    log(`Erro no job ${job.id}: ${error.message}`, 'queue');
    throw error; // Re-throw para ativar o mecanismo de retry
  }
});

// Eventos de log e monitoramento
videoQueue.on('completed', (job, result) => {
  log(`Job ${job.id} completado com sucesso - resultado: ${JSON.stringify(result.id)}`, 'queue');
});

videoQueue.on('failed', (job, error) => {
  log(`Job ${job.id} falhou após ${job.opts.attempts} tentativas: ${error.message}`, 'queue');
});

videoQueue.on('error', (error) => {
  log(`Erro na fila: ${error.message}`, 'queue');
});

// Interface para adicionar jobs na fila
export const queueVideoGeneration = async (data: {
  script: string;
  voice?: string;
  speed?: number;
  transitions?: string[];
  outputFormat?: string;
}) => {
  // Validação básica
  if (!data.script || typeof data.script !== 'string') {
    throw new Error('Script é obrigatório e deve ser uma string');
  }
  
  // Valores padrão
  const jobData = {
    script: data.script,
    voice: data.voice || 'pt-BR-Female-Professional',
    speed: data.speed || 1.0,
    transitions: data.transitions || [],
    outputFormat: data.outputFormat || 'mp4'
  };
  
  log(`Adicionando job para geração de vídeo: "${data.script.substring(0, 30)}..."`, 'queue');
  
  // Adicionar à fila com prioridade normal (default)
  const job = await videoQueue.add(jobData);
  
  return {
    jobId: job.id,
    status: 'queued',
    message: 'Vídeo adicionado à fila de processamento'
  };
};

// Interface para verificar status de um job
export const checkJobStatus = async (jobId: string) => {
  const job = await videoQueue.getJob(jobId);
  
  if (!job) {
    return {
      exists: false,
      status: 'not_found',
      message: 'Job não encontrado'
    };
  }
  
  const state = await job.getState();
  const progress = job.progress();
  
  return {
    exists: true,
    status: state,
    progress,
    message: `Job ${state} com ${progress}% de progresso`,
    createdAt: job.timestamp,
    processingTime: Date.now() - parseInt(job.timestamp as unknown as string),
    attempts: job.attemptsMade
  };
};

// Método para obter estatísticas da fila
export const getQueueStats = async () => {
  const [active, waiting, completed, failed] = await Promise.all([
    videoQueue.getActiveCount(),
    videoQueue.getWaitingCount(),
    videoQueue.getCompletedCount(),
    videoQueue.getFailedCount()
  ]);
  
  return {
    active,
    waiting,
    completed,
    failed,
    total: active + waiting + completed + failed
  };
};
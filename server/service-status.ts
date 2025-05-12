/**
 * Verifica o status de todos os serviços da aplicação,
 * incluindo alternativas gratuitas para APIs pagas
 */

import { OpenAI } from 'openai';
import axios from 'axios';
import path from 'path';
import fs from 'fs';
import { spawn } from 'child_process';

// Resultado de verificação
export interface ServiceStatus {
  working: boolean;
  status: string;
  provider?: string;
  details?: string;
  error?: any;
}

/**
 * Verifica se o ffmpeg está disponível no sistema
 */
export async function checkFFmpeg(): Promise<ServiceStatus> {
  return new Promise((resolve) => {
    const ffmpegPath: string = process.env.FFMPEG_PATH || 'ffmpeg';
    const childProcess = spawn(ffmpegPath, ['-version']);
    
    let output = '';
    let errorOutput = '';
    
    childProcess.stdout.on('data', (data: Buffer) => {
      output += data.toString();
    });
    
    childProcess.stderr.on('data', (data: Buffer) => {
      errorOutput += data.toString();
    });
    
    childProcess.on('error', (err: Error) => {
      resolve({
        working: false,
        status: 'not_found',
        error: err.message
      });
    });
    
    childProcess.on('close', (code: number) => {
      if (code === 0) {
        const version = output.split('\n')[0].trim();
        resolve({
          working: true,
          status: 'ok',
          details: version
        });
      } else {
        resolve({
          working: false,
          status: 'error',
          error: errorOutput || `Exit code: ${code}`
        });
      }
    });
  });
}

/**
 * Verifica o status da API do OpenAI
 */
export async function checkOpenAI(): Promise<ServiceStatus> {
  if (!process.env.OPENAI_API_KEY) {
    return { working: false, status: 'not_configured', provider: 'openai' };
  }
  
  try {
    const openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY
    });
    
    const completion = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: [{ role: 'user', content: 'API status check' }],
      max_tokens: 5
    });
    
    return {
      working: true,
      status: 'ok',
      provider: 'openai',
      details: `Model: ${completion.model}`
    };
  } catch (error: any) {
    let errorStatus = 'api_error';
    
    if (error.status === 401) {
      errorStatus = 'invalid_api_key';
    } else if (error.status === 429) {
      errorStatus = 'rate_limit_exceeded';
    } else if (error.status === 403) {
      errorStatus = 'permission_denied';
    }
    
    return {
      working: false,
      status: errorStatus,
      provider: 'openai',
      error: error.message
    };
  }
}

/**
 * Verifica o status da API do ElevenLabs
 */
export async function checkElevenLabs(): Promise<ServiceStatus> {
  if (!process.env.ELEVENLABS_API_KEY) {
    return { working: false, status: 'not_configured', provider: 'elevenlabs' };
  }
  
  try {
    const response = await axios.get('https://api.elevenlabs.io/v1/voices', {
      headers: {
        'xi-api-key': process.env.ELEVENLABS_API_KEY,
        'Content-Type': 'application/json'
      }
    });
    
    if (response.data && response.data.voices) {
      const voiceCount = response.data.voices.length;
      
      return {
        working: true,
        status: 'ok',
        provider: 'elevenlabs',
        details: `${voiceCount} voices available`
      };
    }
    
    return {
      working: false,
      status: 'unexpected_response',
      provider: 'elevenlabs',
      error: 'API responded but no voices found'
    };
  } catch (error: any) {
    let errorStatus = 'api_error';
    
    if (error.response?.status === 401) {
      errorStatus = 'invalid_api_key';
    } else if (error.response?.status === 429) {
      errorStatus = 'rate_limit_exceeded';
    }
    
    return {
      working: false,
      status: errorStatus,
      provider: 'elevenlabs',
      error: error.message
    };
  }
}

/**
 * Verifica o status do Edge TTS (alternativa gratuita ao ElevenLabs)
 */
export async function checkEdgeTTS(): Promise<ServiceStatus> {
  return new Promise((resolve) => {
    const childProcess = spawn('edge-tts', ['--version']);
    
    let output = '';
    let errorOutput = '';
    
    childProcess.stdout.on('data', (data: Buffer) => {
      output += data.toString();
    });
    
    childProcess.stderr.on('data', (data: Buffer) => {
      errorOutput += data.toString();
    });
    
    childProcess.on('error', () => {
      resolve({
        working: false,
        status: 'not_installed',
        provider: 'edge-tts',
        details: 'Microsoft Edge TTS não está instalado. Use: npm install -g edge-tts'
      });
    });
    
    childProcess.on('close', (code: number) => {
      if (code === 0) {
        resolve({
          working: true,
          status: 'ok',
          provider: 'edge-tts',
          details: output.trim() || 'Microsoft Edge TTS está disponível (alternativa gratuita ao ElevenLabs)'
        });
      } else {
        resolve({
          working: false,
          status: 'error',
          provider: 'edge-tts',
          error: errorOutput || `Exit code: ${code}`
        });
      }
    });
  });
}

/**
 * Verifica o status da API do Pexels
 */
export async function checkPexels(): Promise<ServiceStatus> {
  if (!process.env.PEXELS_API_KEY) {
    return { working: false, status: 'not_configured', provider: 'pexels' };
  }
  
  try {
    const response = await axios.get('https://api.pexels.com/v1/curated?per_page=1', {
      headers: {
        'Authorization': process.env.PEXELS_API_KEY
      }
    });
    
    if (response.data && response.data.photos) {
      return {
        working: true,
        status: 'ok',
        provider: 'pexels',
        details: 'Pexels API está funcionando corretamente'
      };
    }
    
    return {
      working: false,
      status: 'unexpected_response',
      provider: 'pexels',
      error: 'API responded but no photos found'
    };
  } catch (error: any) {
    let errorStatus = 'api_error';
    
    if (error.response?.status === 401) {
      errorStatus = 'invalid_api_key';
    } else if (error.response?.status === 429) {
      errorStatus = 'rate_limit_exceeded';
    }
    
    return {
      working: false,
      status: errorStatus,
      provider: 'pexels',
      error: error.message
    };
  }
}

/**
 * Verifica o status da API do Pixabay (alternativa gratuita ao Pexels)
 */
export async function checkPixabay(): Promise<ServiceStatus> {
  if (!process.env.PIXABAY_API_KEY) {
    return { working: false, status: 'not_configured', provider: 'pixabay' };
  }
  
  try {
    const response = await axios.get(`https://pixabay.com/api/?key=${process.env.PIXABAY_API_KEY}&per_page=1`);
    
    if (response.data && response.data.hits) {
      return {
        working: true,
        status: 'ok',
        provider: 'pixabay',
        details: `Pixabay API está funcionando corretamente (limite: 5.000 requests/hora)`
      };
    }
    
    return {
      working: false,
      status: 'unexpected_response',
      provider: 'pixabay',
      error: 'API responded but no images found'
    };
  } catch (error: any) {
    return {
      working: false,
      status: 'api_error',
      provider: 'pixabay',
      error: error.message
    };
  }
}

/**
 * Verifica o status da API do Unsplash (alternativa gratuita ao Pexels)
 */
export async function checkUnsplash(): Promise<ServiceStatus> {
  if (!process.env.UNSPLASH_API_KEY) {
    return { working: false, status: 'not_configured', provider: 'unsplash' };
  }
  
  try {
    const response = await axios.get('https://api.unsplash.com/photos/random', {
      headers: {
        'Authorization': `Client-ID ${process.env.UNSPLASH_API_KEY}`
      }
    });
    
    if (response.data && response.data.id) {
      return {
        working: true,
        status: 'ok',
        provider: 'unsplash',
        details: `Unsplash API está funcionando corretamente (limite: 50 requests/hora)`
      };
    }
    
    return {
      working: false,
      status: 'unexpected_response',
      provider: 'unsplash',
      error: 'API responded but no photo found'
    };
  } catch (error: any) {
    let errorStatus = 'api_error';
    
    if (error.response?.status === 401) {
      errorStatus = 'invalid_api_key';
    } else if (error.response?.status === 429) {
      errorStatus = 'rate_limit_exceeded';
    }
    
    return {
      working: false,
      status: errorStatus,
      provider: 'unsplash',
      error: error.message
    };
  }
}

/**
 * Verifica o status da Hugging Face (alternativa gratuita à OpenAI)
 */
export async function checkHuggingFace(): Promise<ServiceStatus> {
  if (!process.env.HUGGINGFACE_API_KEY) {
    return { working: false, status: 'not_configured', provider: 'huggingface' };
  }
  
  try {
    const response = await axios.post(
      'https://api-inference.huggingface.co/models/facebook/blenderbot-400M-distill',
      { inputs: 'API status check' },
      {
        headers: {
          'Authorization': `Bearer ${process.env.HUGGINGFACE_API_KEY}`,
          'Content-Type': 'application/json'
        }
      }
    );
    
    if (response.data) {
      return {
        working: true,
        status: 'ok',
        provider: 'huggingface',
        details: 'Hugging Face API está funcionando corretamente'
      };
    }
    
    return {
      working: false,
      status: 'unexpected_response',
      provider: 'huggingface',
      error: 'API responded but no data found'
    };
  } catch (error: any) {
    return {
      working: false,
      status: 'api_error',
      provider: 'huggingface',
      error: error.message
    };
  }
}

/**
 * Verifica se o Ollama está disponível (alternativa gratuita local à OpenAI)
 */
export async function checkOllama(): Promise<ServiceStatus> {
  return new Promise((resolve) => {
    const childProcess = spawn('ollama', ['list']);
    
    let output = '';
    let errorOutput = '';
    
    childProcess.stdout.on('data', (data: Buffer) => {
      output += data.toString();
    });
    
    childProcess.stderr.on('data', (data: Buffer) => {
      errorOutput += data.toString();
    });
    
    childProcess.on('error', () => {
      resolve({
        working: false,
        status: 'not_installed',
        provider: 'ollama',
        details: 'Ollama não está instalado. Visite: https://ollama.com'
      });
    });
    
    childProcess.on('close', (code: number) => {
      if (code === 0) {
        const models = output.trim().split('\n').filter(Boolean);
        resolve({
          working: true,
          status: 'ok',
          provider: 'ollama',
          details: `${models.length} modelo(s) disponível(is): ${models.join(', ')}`
        });
      } else {
        resolve({
          working: false,
          status: 'error',
          provider: 'ollama',
          error: errorOutput || `Exit code: ${code}`
        });
      }
    });
  });
}

/**
 * Verifica o status de todos os serviços, incluindo alternativas gratuitas
 */
export async function checkAllServices(): Promise<{
  paid: Record<string, ServiceStatus>;
  free: Record<string, ServiceStatus>;
  ffmpeg: ServiceStatus;
  recommendation: {
    text: string;
    useFree: boolean;
  };
}> {
  const [
    openai, elevenlabs, pexels,
    edgeTts, pixabay, unsplash, huggingFace, ollama,
    ffmpeg
  ] = await Promise.all([
    checkOpenAI(),
    checkElevenLabs(),
    checkPexels(),
    checkEdgeTTS(),
    checkPixabay(),
    checkUnsplash(),
    checkHuggingFace(),
    checkOllama(),
    checkFFmpeg()
  ]);
  
  // Serviços pagos
  const paid = {
    openai,
    elevenlabs,
    pexels
  };
  
  // Alternativas gratuitas
  const free = {
    edgeTts,
    pixabay,
    unsplash,
    huggingFace,
    ollama
  };
  
  // Verificar se podemos usar apenas alternativas gratuitas
  const hasWorkingFreeVoice = edgeTts.working;
  const hasWorkingFreeImages = pixabay.working || unsplash.working;
  const hasWorkingFreeAI = huggingFace.working || ollama.working;
  
  const canUseAllFree = hasWorkingFreeVoice && hasWorkingFreeImages && hasWorkingFreeAI;
  const hasWorkingPaid = openai.working || elevenlabs.working || pexels.working;
  
  // Gerar recomendação
  let recommendationText = '';
  
  if (canUseAllFree) {
    recommendationText = 'Todas as alternativas gratuitas estão funcionando! Você pode usar o sistema sem nenhum custo.';
  } else if (!hasWorkingPaid) {
    if (!hasWorkingFreeVoice && !edgeTts.working) {
      recommendationText += 'Instale o Edge TTS para conversão de texto em fala gratuita: npm install -g edge-tts. ';
    }
    if (!hasWorkingFreeImages) {
      recommendationText += 'Configure uma API gratuita de imagens (Pixabay ou Unsplash). ';
    }
    if (!hasWorkingFreeAI && !ollama.working) {
      recommendationText += 'Considere instalar o Ollama para IA local gratuita: https://ollama.com. ';
    }
    
    recommendationText += 'Nenhum serviço pago está funcionando, configure pelo menos um serviço alternativo.';
  } else {
    recommendationText = 'Alguns serviços pagos estão funcionando, mas você pode economizar usando as alternativas gratuitas disponíveis.';
  }
  
  return {
    paid,
    free,
    ffmpeg,
    recommendation: {
      text: recommendationText,
      useFree: canUseAllFree || !hasWorkingPaid
    }
  };
}
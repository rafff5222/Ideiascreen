import fs from 'fs';
import path from 'path';
import { createRequire } from 'module';

// Usar createRequire para importar módulos CommonJS em um ambiente ESM
const require = createRequire(import.meta.url);
const ElevenLabs = require('elevenlabs-node');

/**
 * Serviço de integração com a API do ElevenLabs para geração de vozes em português brasileiro
 */

// Tipos para vozes em PT-BR
export enum VoiceType {
  FEMININO_PROFISSIONAL = 'pt-BR-Female-Professional',
  MASCULINO_PROFISSIONAL = 'pt-BR-Male-Professional',
  FEMININO_JOVEM = 'pt-BR-Female-Young',
  MASCULINO_JOVEM = 'pt-BR-Male-Young',
  NEUTRO = 'pt-BR-Neutral',
}

// IDs das vozes no ElevenLabs para português do Brasil
// Estes são exemplos de IDs, os reais precisam ser obtidos via API
const voiceIdMapping: Record<VoiceType, string> = {
  [VoiceType.FEMININO_PROFISSIONAL]: 'oWAxAEDNcvRjXq0VF9K5', // Nicole 
  [VoiceType.MASCULINO_PROFISSIONAL]: 'ErXwobaYiN019PkySvjV', // Antoni
  [VoiceType.FEMININO_JOVEM]: 'jsCqWAovK2LkecY7zXl4', // Elli
  [VoiceType.MASCULINO_JOVEM]: '5TK57XAJW9JQWUNPWTyR', // Josh
  [VoiceType.NEUTRO]: 'pFZP5JQG7iQjIQuC4Npu', // Gigi
};

// Tipos para configuração da API
type Voice = {
  voice_id: string;
  name: string;
  category?: string;
  description?: string;
};

/**
 * Gera áudio a partir de texto usando a API do ElevenLabs
 * @param text Texto a ser convertido em áudio
 * @param voiceType Tipo de voz a ser usada
 * @param speed Velocidade de fala (1.0 = normal)
 * @returns Buffer com o áudio gerado ou null em caso de erro
 */
export async function generateElevenLabsAudio(
  text: string, 
  voiceType: VoiceType = VoiceType.FEMININO_PROFISSIONAL,
  speed: number = 1.0
): Promise<Buffer | null> {
  try {
    if (!process.env.ELEVENLABS_API_KEY) {
      console.error('Erro: API key do ElevenLabs não está configurada');
      return null;
    }
    
    // Inicializa o cliente ElevenLabs
    const voice = new ElevenLabs({
      apiKey: process.env.ELEVENLABS_API_KEY
    });
    
    // Ajusta o texto para melhorar a pronúncia em português
    const formattedText = formatTextForPTBR(text);
    
    // Obter o ID da voz selecionada
    const voiceId = voiceIdMapping[voiceType];
    console.log(`Gerando áudio com ElevenLabs usando voz ID: ${voiceId}`);
    
    // Define o caminho temporário para salvar o arquivo
    const outputFilePath = path.join(process.cwd(), 'temp_audio.mp3');
    
    // Calcula os ajustes para a velocidade
    const stability = speed > 1.2 ? 0.3 : 0.5;
    const similarityBoost = 0.75;
    
    try {
      // Log detalhado da API key (apenas parcial por segurança)
      const apiKeyMasked = process.env.ELEVENLABS_API_KEY ? 
        `${process.env.ELEVENLABS_API_KEY.substring(0, 4)}...${process.env.ELEVENLABS_API_KEY.substring(process.env.ELEVENLABS_API_KEY.length - 4)}` : 
        'não configurada';
      console.log(`Usando API Key ElevenLabs: ${apiKeyMasked}`);
      
      // Gera o áudio usando a API do ElevenLabs
      const response = await voice.textToSpeech({
        voiceId: voiceId,
        textInput: formattedText,
        fileName: outputFilePath,
        stability: stability,
        similarityBoost: similarityBoost,
        modelId: 'eleven_multilingual_v2', // Modelo multilíngue que suporta português
        speakerBoost: true,
        style: speed > 1.0 ? 0.3 : 0, // Ajuste de estilo baseado na velocidade
      });
      
      console.log('Resposta da API ElevenLabs:', response?.status || 'sem status');
      
      // Aguarda um pouco para ter certeza que o arquivo foi escrito completamente
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // Lê o arquivo gerado
      if (!fs.existsSync(outputFilePath)) {
        console.error('Arquivo de saída não encontrado:', outputFilePath);
        throw new Error('Arquivo de áudio não foi gerado corretamente');
      }
      
      const audioBuffer = fs.readFileSync(outputFilePath);
      
      // Remove o arquivo temporário
      try {
        fs.unlinkSync(outputFilePath);
      } catch (err) {
        console.warn('Aviso: Não foi possível excluir o arquivo temporário', err);
      }
      
      console.log('Áudio gerado com sucesso via ElevenLabs');
      return audioBuffer;
    } catch (apiError) {
      console.error('Erro na API do ElevenLabs:', apiError);
      return null;
    }
  } catch (error) {
    console.error('Erro ao gerar áudio via ElevenLabs:', error);
    return null;
  }
}

/**
 * Formata o texto para melhorar a pronúncia em português brasileiro
 * @param text Texto a ser formatado
 * @returns Texto formatado
 */
function formatTextForPTBR(text: string): string {
  // Substitui hashtags por uma versão mais legível
  let formatted = text.replace(/#(\w+)/g, 'hashtag $1');
  
  // Substitui emojis comuns por texto
  formatted = formatted.replace(/❤️/g, 'coração')
    .replace(/👍/g, 'joinha')
    .replace(/😊/g, 'sorriso')
    .replace(/🔥/g, 'fogo')
    .replace(/⭐/g, 'estrela');
  
  // Adiciona pausas em pontuações para melhorar o ritmo
  formatted = formatted.replace(/\./g, '. ')
    .replace(/\!/g, '! ')
    .replace(/\?/g, '? ')
    .replace(/\,/g, ', ');
  
  // Corrige problemas comuns de pronúncia
  formatted = formatted.replace(/([0-9]+)k/gi, '$1 mil')
    .replace(/([0-9]+)M/gi, '$1 milhões');
  
  return formatted;
}

/**
 * Lista as vozes disponíveis na API
 * @returns Array de vozes disponíveis ou null em caso de erro
 */
export async function listAvailableVoices(): Promise<Voice[] | null> {
  try {
    if (!process.env.ELEVENLABS_API_KEY) {
      console.error('Erro: API key do ElevenLabs não está configurada');
      return null;
    }
    
    const voice = new ElevenLabs({
      apiKey: process.env.ELEVENLABS_API_KEY
    });
    
    const voices = await voice.getVoices();
    return voices;
  } catch (error) {
    console.error('Erro ao listar vozes do ElevenLabs:', error);
    return null;
  }
}
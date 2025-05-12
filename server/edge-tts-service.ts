/**
 * Serviço de conversão de texto para voz usando Microsoft Edge TTS
 * Uma alternativa 100% GRATUITA ao ElevenLabs
 */

import { spawn } from 'child_process';
import fs from 'fs';
import path from 'path';
import os from 'os';
import { promises as fsPromises } from 'fs';

// Mapeamento de vozes do Edge TTS para português brasileiro
export enum EdgeTTSVoiceType {
  FEMININO_PROFISSIONAL = 'pt-BR-FranciscaNeural',
  MASCULINO_PROFISSIONAL = 'pt-BR-AntonioNeural',
  FEMININO_JOVEM = 'pt-BR-GiovannaNeural',
  MASCULINO_JOVEM = 'pt-BR-BrendanNeural',
  NEUTRO = 'pt-BR-JulioNeural',
}

// Interface para as opções de conversão
interface EdgeTTSOptions {
  text: string;
  voiceType?: EdgeTTSVoiceType;
  outputPath?: string;
  speed?: number; // Velocidade de fala (por exemplo, 1.0x normal, 1.5x mais rápido)
}

/**
 * Verifica se o Edge TTS está disponível no sistema
 * @returns True se o Edge TTS está disponível, False caso contrário
 */
export async function checkEdgeTTSAvailability(): Promise<boolean> {
  return new Promise((resolve) => {
    const process = spawn('edge-tts', ['--version']);
    
    process.on('error', () => {
      resolve(false);
    });
    
    process.on('close', (code) => {
      resolve(code === 0);
    });
  });
}

/**
 * Lista todas as vozes disponíveis no Edge TTS
 * @returns Lista de vozes disponíveis
 */
export async function listAvailableVoices(): Promise<string[]> {
  return new Promise((resolve, reject) => {
    const process = spawn('edge-tts', ['--list-voices']);
    
    let stdout = '';
    
    process.stdout.on('data', (data) => {
      stdout += data.toString();
    });
    
    process.on('error', (err) => {
      reject(new Error(`Erro ao listar vozes: ${err.message}`));
    });
    
    process.on('close', (code) => {
      if (code === 0) {
        const voices = stdout
          .split('\n')
          .filter((line) => line.trim().length > 0)
          .map((line) => {
            const parts = line.split(' ');
            return parts[0]; // Nome da voz
          });
        
        resolve(voices);
      } else {
        reject(new Error(`Falha ao listar vozes (código de saída: ${code})`));
      }
    });
  });
}

/**
 * Gera áudio a partir de texto usando Microsoft Edge TTS
 * @param options Opções de conversão
 * @returns Caminho para o arquivo de áudio gerado
 */
export async function generateEdgeTTSAudio(options: EdgeTTSOptions): Promise<string> {
  const {
    text,
    voiceType = EdgeTTSVoiceType.FEMININO_PROFISSIONAL,
    outputPath,
    speed = 1.0,
  } = options;
  
  // Formatar o texto para melhorar a pronúncia em português
  const formattedText = formatTextForPTBR(text);
  
  // Definir o caminho de saída
  const timestamp = Date.now();
  const outputFile = outputPath || path.join(process.cwd(), 'output', 'audio', `edge_tts_${timestamp}.mp3`);
  
  // Garantir que o diretório de saída exista
  const outputDir = path.dirname(outputFile);
  await fsPromises.mkdir(outputDir, { recursive: true });
  
  // Gerar arquivo temporário para o texto
  const tempTextFile = path.join(os.tmpdir(), `edge_tts_text_${timestamp}.txt`);
  await fsPromises.writeFile(tempTextFile, formattedText);
  
  // Construir opções de comando
  const rateOption = `+${Math.round((speed - 1) * 100)}%`;
  
  return new Promise((resolve, reject) => {
    const process = spawn('edge-tts', [
      '--voice', voiceType,
      '--file', tempTextFile,
      '--write-media', outputFile,
      ...(speed !== 1.0 ? ['--rate', rateOption] : []),
    ]);
    
    let stderr = '';
    
    process.stderr.on('data', (data) => {
      stderr += data.toString();
    });
    
    process.on('error', (err) => {
      // Limpar arquivo temporário
      fs.unlink(tempTextFile, () => {});
      reject(new Error(`Erro ao gerar áudio: ${err.message}`));
    });
    
    process.on('close', async (code) => {
      // Limpar arquivo temporário
      await fsPromises.unlink(tempTextFile).catch(() => {});
      
      if (code === 0) {
        if (!fs.existsSync(outputFile)) {
          reject(new Error('O arquivo de áudio não foi gerado'));
          return;
        }
        
        resolve(outputFile);
      } else {
        reject(new Error(`Falha ao gerar áudio (código de saída: ${code}): ${stderr}`));
      }
    });
  });
}

/**
 * Gera um buffer de áudio a partir de texto
 * @param text Texto a ser convertido em áudio
 * @param voiceType Tipo de voz a ser usada
 * @param speed Velocidade de fala
 * @returns Buffer com o áudio gerado ou null em caso de erro
 */
export async function generateEdgeTTSBuffer(
  text: string,
  voiceType: EdgeTTSVoiceType = EdgeTTSVoiceType.FEMININO_PROFISSIONAL,
  speed: number = 1.0
): Promise<Buffer | null> {
  try {
    // Gerar arquivo de áudio
    const outputFile = await generateEdgeTTSAudio({
      text,
      voiceType,
      speed,
    });
    
    // Ler o arquivo como buffer
    const buffer = await fsPromises.readFile(outputFile);
    
    // Opcional: remover o arquivo temporário
    await fsPromises.unlink(outputFile).catch(() => {});
    
    return buffer;
  } catch (error) {
    console.error('Erro ao gerar buffer de áudio com Edge TTS:', error);
    return null;
  }
}

/**
 * Formata o texto para melhorar a pronúncia em português brasileiro
 * @param text Texto a ser formatado
 * @returns Texto formatado
 */
function formatTextForPTBR(text: string): string {
  // Remover múltiplos espaços
  let formatted = text.replace(/\s+/g, ' ').trim();
  
  // Adicionar quebras de linha após pontuação para melhorar a naturalidade
  formatted = formatted.replace(/\. /g, '.\n');
  formatted = formatted.replace(/\! /g, '!\n');
  formatted = formatted.replace(/\? /g, '?\n');
  
  // Ajustar siglas (adicionar espaços entre letras)
  formatted = formatted.replace(/\b([A-Z]{2,})\b/g, (match) => {
    return match.split('').join(' ');
  });
  
  // Ajustar números para serem lidos corretamente
  formatted = formatted.replace(/(\d+)([,.])(\d+)/g, '$1 vírgula $3');
  
  return formatted;
}

// Exportar um serviço singleton para uso em toda a aplicação
export const edgeTTSService = {
  checkAvailability: checkEdgeTTSAvailability,
  listVoices: listAvailableVoices,
  generateAudio: generateEdgeTTSAudio,
  generateBuffer: generateEdgeTTSBuffer,
};
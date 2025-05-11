/**
 * Módulo para correção e teste de geração de vídeos
 * Implementa métodos mais simples para garantir compatibilidade com navegadores
 */

import path from 'path';
import { promises as fs } from 'fs';
import { exec } from 'child_process';
import { promisify } from 'util';

const execAsync = promisify(exec);

/**
 * Verifica e cria diretórios necessários
 */
async function ensureDirectoriesExist() {
  const dirs = ['tmp', 'output', 'output/videos', 'output/images', 'output/audio'];
  for (const dir of dirs) {
    try {
      await fs.mkdir(dir, { recursive: true });
    } catch (error) {
      console.error(`Erro ao criar diretório ${dir}:`, error);
    }
  }
}

/**
 * Gera vídeo compatível com navegador a partir de uma única imagem
 * @param outputPath Caminho de saída para o vídeo
 * @returns Caminho do vídeo gerado
 */
export async function generateCompatibleVideo(outputPath?: string): Promise<string> {
  await ensureDirectoriesExist();
  
  const timestamp = Date.now();
  const videoPath = outputPath || path.join('output', `compatible_video_${timestamp}.mp4`);
  
  try {
    // Criar uma imagem de teste simples
    const imagePath = path.join('tmp', `test_image_${timestamp}.jpg`);
    
    // Comando de criação da imagem (tom azul sólido)
    await execAsync(`ffmpeg -y -f lavfi -i color=c=blue:s=1280x720 -frames:v 1 ${imagePath}`);
    
    // Comando de criação do vídeo - usando configurações mais básicas
    // Criando um vídeo de 5 segundos com a imagem
    await execAsync(`ffmpeg -y -loop 1 -i ${imagePath} -c:v libx264 -t 5 -pix_fmt yuv420p -vf "scale=1280:720" ${videoPath}`);
    
    console.log(`Vídeo compatível gerado em: ${videoPath}`);
    return videoPath;
  } catch (error) {
    console.error('Erro ao gerar vídeo compatível:', error);
    throw error;
  }
}

/**
 * Gera vídeo diferente para teste com imagem e áudio
 * @param outputPath Caminho de saída para o vídeo
 * @returns Caminho do vídeo gerado
 */
export async function generateSimpleVideo(outputPath?: string): Promise<string> {
  await ensureDirectoriesExist();
  
  const timestamp = Date.now();
  const videoPath = outputPath || path.join('output', `simple_video_${timestamp}.mp4`);
  
  try {
    // Criar uma imagem de teste
    const imagePath = path.join('tmp', `simple_image_${timestamp}.jpg`);
    
    // Gerar um tom de áudio (1 segundo)
    const audioPath = path.join('tmp', `simple_audio_${timestamp}.aac`);
    
    // Comando de criação da imagem (cor vermelha)
    await execAsync(`ffmpeg -y -f lavfi -i color=c=red:s=640x480 -frames:v 1 ${imagePath}`);
    
    // Gerar um tom de áudio
    await execAsync(`ffmpeg -y -f lavfi -i "sine=frequency=440:duration=5" ${audioPath}`);
    
    // Combinar em um vídeo usando comando direto (sem concat)
    await execAsync(`ffmpeg -y -loop 1 -i ${imagePath} -i ${audioPath} -c:v libx264 -c:a aac -strict experimental -b:a 192k -shortest -pix_fmt yuv420p ${videoPath}`);
    
    console.log(`Vídeo simples gerado em: ${videoPath}`);
    return videoPath;
  } catch (error) {
    console.error('Erro ao gerar vídeo simples:', error);
    throw error;
  }
}

/**
 * Testa a reprodução de um vídeo existente convertendo para formato mais compatível
 * @param inputPath Caminho do vídeo existente
 * @returns Caminho do vídeo recodificado
 */
export async function fixExistingVideo(inputPath: string): Promise<string> {
  if (!inputPath) {
    throw new Error('Caminho de vídeo não fornecido');
  }
  
  await ensureDirectoriesExist();
  
  const timestamp = Date.now();
  const outputPath = path.join('output', `fixed_video_${timestamp}.mp4`);
  
  try {
    // Recodificar o vídeo com configurações mais compatíveis
    await execAsync(`ffmpeg -y -i ${inputPath} -c:v libx264 -profile:v baseline -level 3.0 -pix_fmt yuv420p -c:a aac -strict experimental -b:a 128k ${outputPath}`);
    
    console.log(`Vídeo recodificado em: ${outputPath}`);
    return outputPath;
  } catch (error) {
    console.error('Erro ao recodificar vídeo:', error);
    throw error;
  }
}
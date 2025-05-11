/**
 * Módulo de processamento em modo de demonstração
 * Permite a criação de vídeos de demonstração sem depender de serviços externos
 */

import fs from 'fs/promises';
import path from 'path';
import { execSync } from 'child_process';
import crypto from 'crypto';

// Diretórios para armazenamento de arquivos
const TMP_DIR = path.join(process.cwd(), 'tmp');
const TMP_AUDIO_DIR = path.join(TMP_DIR, 'audio');
const TMP_IMAGES_DIR = path.join(TMP_DIR, 'images');
const OUTPUT_DIR = path.join(process.cwd(), 'output');
const OUTPUT_VIDEOS_DIR = path.join(OUTPUT_DIR, 'videos');

/**
 * Verifica e cria diretórios necessários
 */
async function ensureDirectoriesExist() {
  try {
    await fs.mkdir(TMP_DIR, { recursive: true });
    await fs.mkdir(TMP_AUDIO_DIR, { recursive: true });
    await fs.mkdir(TMP_IMAGES_DIR, { recursive: true });
    await fs.mkdir(OUTPUT_DIR, { recursive: true });
    await fs.mkdir(OUTPUT_VIDEOS_DIR, { recursive: true });
    
    console.log('Todos os diretórios verificados e existentes');
  } catch (error) {
    console.error('Erro ao criar diretórios:', error);
    throw new Error('Falha ao criar diretórios necessários');
  }
}

/**
 * Gera um áudio de demonstração usando ffmpeg a partir do texto
 * @param text Texto que será "narrado" no áudio de demonstração
 * @returns Caminho para o arquivo de áudio gerado
 */
async function generateDemoAudio(text: string): Promise<string> {
  try {
    // ID único para o arquivo
    const audioId = crypto.randomUUID();
    const audioPath = path.join(TMP_AUDIO_DIR, `demo_audio_${audioId}.mp3`);
    
    // Calcular duração baseada no tamanho do texto (aproximadamente)
    const duration = Math.max(3, Math.min(30, text.length / 20));
    
    // Gerar áudio silencioso ou com tom simples
    const command = `ffmpeg -f lavfi -i "sine=frequency=440:duration=${duration}" -af "atempo=0.8" "${audioPath}"`;
    
    console.log('Gerando áudio de demonstração...');
    console.log(`Comando: ${command}`);
    
    execSync(command);
    
    // Verificar se o arquivo foi gerado
    await fs.access(audioPath);
    console.log(`Áudio de demonstração gerado: ${audioPath}`);
    
    return audioPath;
  } catch (error) {
    console.error('Erro ao gerar áudio de demonstração:', error);
    throw new Error('Falha ao gerar áudio de demonstração');
  }
}

/**
 * Gera uma imagem de demonstração colorida
 * @param index Índice da imagem (para variar as cores)
 * @returns Caminho para a imagem gerada
 */
async function generateDemoImage(index: number): Promise<string> {
  try {
    // ID único para o arquivo
    const imageId = crypto.randomUUID();
    const imagePath = path.join(TMP_IMAGES_DIR, `demo_image_${imageId}.jpg`);
    
    // Cores diferentes baseadas no índice
    const colors = ['blue', 'red', 'green', 'purple', 'orange', 'teal'];
    const color = colors[index % colors.length];
    
    // Gerar imagem colorida
    const command = `ffmpeg -f lavfi -i "color=c=${color}:s=1280x720" -frames:v 1 "${imagePath}"`;
    
    console.log(`Gerando imagem de demonstração ${index + 1}...`);
    console.log(`Comando: ${command}`);
    
    execSync(command);
    
    // Verificar se o arquivo foi gerado
    await fs.access(imagePath);
    console.log(`Imagem de demonstração gerada: ${imagePath}`);
    
    return imagePath;
  } catch (error) {
    console.error('Erro ao gerar imagem de demonstração:', error);
    throw new Error(`Falha ao gerar imagem de demonstração ${index + 1}`);
  }
}

/**
 * Gera múltiplas imagens de demonstração
 * @param count Número de imagens a gerar
 * @returns Lista de caminhos para as imagens geradas
 */
async function generateDemoImages(count: number): Promise<string[]> {
  console.log(`Gerando ${count} imagens de demonstração...`);
  
  const imagePaths: string[] = [];
  
  for (let i = 0; i < count; i++) {
    const imagePath = await generateDemoImage(i);
    imagePaths.push(imagePath);
  }
  
  return imagePaths;
}

/**
 * Cria um vídeo a partir de imagens e áudio
 * @param imagePaths Caminhos para as imagens a usar no vídeo
 * @param audioPath Caminho para o arquivo de áudio
 * @param duration Duração em segundos para cada imagem (opcional)
 * @returns Caminho para o vídeo gerado
 */
async function createVideoFromImagesAndAudio(
  imagePaths: string[],
  audioPath: string,
  duration: number = 3
): Promise<string> {
  try {
    // Criar arquivo de texto com lista de imagens para o ffmpeg
    const videoId = crypto.randomUUID();
    const imageListPath = path.join(TMP_DIR, `image_list_${videoId}.txt`);
    const outputVideoPath = path.join(OUTPUT_VIDEOS_DIR, `demo_video_${videoId}.mp4`);
    
    // Criar conteúdo do arquivo de lista de imagens
    let imageListContent = '';
    for (const imgPath of imagePaths) {
      imageListContent += `file '${imgPath}'\nduration ${duration}\n`;
    }
    // Repetir a última imagem para evitar corte no final
    imageListContent += `file '${imagePaths[imagePaths.length - 1]}'\n`;
    
    await fs.writeFile(imageListPath, imageListContent);
    
    // Criar o vídeo combinando as imagens e o áudio
    const command = `ffmpeg -f concat -safe 0 -i "${imageListPath}" -i "${audioPath}" -c:v libx264 -pix_fmt yuv420p -c:a aac -shortest "${outputVideoPath}"`;
    
    console.log('Gerando vídeo de demonstração...');
    console.log(`Comando: ${command}`);
    
    execSync(command);
    
    // Verificar se o vídeo foi gerado
    await fs.access(outputVideoPath);
    console.log(`Vídeo de demonstração gerado: ${outputVideoPath}`);
    
    // Limpar arquivo temporário de lista
    await fs.unlink(imageListPath);
    
    return outputVideoPath;
  } catch (error) {
    console.error('Erro ao criar vídeo de demonstração:', error);
    throw new Error('Falha ao criar vídeo de demonstração');
  }
}

/**
 * Processa um texto em vídeo no modo de demonstração
 * Não depende de APIs externas, apenas do ffmpeg local
 * @param text Texto a ser processado
 * @returns Caminho para o vídeo gerado
 */
export async function processTextToDemoVideo(text: string): Promise<string> {
  try {
    console.log('Iniciando processamento de vídeo no modo de demonstração');
    console.log(`Texto: "${text.substring(0, 30)}..."`);
    
    // Garantir que os diretórios existam
    await ensureDirectoriesExist();
    
    // Gerar áudio de demonstração
    const audioPath = await generateDemoAudio(text);
    
    // Calcular número de imagens baseado no tamanho do texto
    const imageCount = Math.max(3, Math.min(8, Math.ceil(text.length / 100)));
    console.log(`Gerando ${imageCount} imagens para o vídeo`);
    
    // Gerar imagens de demonstração
    const imagePaths = await generateDemoImages(imageCount);
    
    // Criar vídeo com as imagens e o áudio
    const videoPath = await createVideoFromImagesAndAudio(imagePaths, audioPath);
    
    console.log('Processamento de vídeo de demonstração concluído com sucesso');
    return videoPath;
  } catch (error) {
    console.error('Erro no processamento de vídeo demonstrativo:', error);
    throw error;
  }
}
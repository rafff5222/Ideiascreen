/**
 * Gerador de vídeo de teste
 * Este módulo gera um vídeo de teste simples com imagens fixas e áudio
 * Útil para depurar problemas de reprodução de vídeo
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
 * Gera uma imagem de teste com cor sólida e texto
 * @param text Texto a ser exibido na imagem
 * @param color Cor de fundo (formato hexadecimal, ex: "#FF0000")
 * @param outputPath Caminho para salvar a imagem
 */
async function generateTestImage(
  text: string,
  color: string = '#3498db',
  outputPath: string
): Promise<void> {
  try {
    const command = `ffmpeg -y -f lavfi -i color=${color.replace('#', '0x')}:s=1280x720 \
      -vf "drawtext=text='${text}':fontcolor=white:fontsize=60:x=(w-text_w)/2:y=(h-text_h)/2" \
      -frames:v 1 ${outputPath}`;
    
    await execAsync(command);
    console.log(`Imagem de teste gerada: ${outputPath}`);
  } catch (error) {
    console.error('Erro ao gerar imagem de teste:', error);
    throw error;
  }
}

/**
 * Gera um áudio de teste com TTS usando ffmpeg
 * @param text Texto a ser convertido em áudio
 * @param outputPath Caminho para salvar o áudio
 */
async function generateTestAudio(text: string, outputPath: string): Promise<void> {
  try {
    // Usamos um tom simples para evitar problemas com TTS
    const command = `ffmpeg -y -f lavfi -i "sine=frequency=440:duration=5" ${outputPath}`;
    
    await execAsync(command);
    console.log(`Áudio de teste gerado: ${outputPath}`);
  } catch (error) {
    console.error('Erro ao gerar áudio de teste:', error);
    throw error;
  }
}

/**
 * Cria um vídeo de teste combinando imagens e áudio
 * @param imagePaths Lista de caminhos das imagens a serem usadas
 * @param audioPath Caminho do arquivo de áudio
 * @param outputPath Caminho para salvar o vídeo
 */
async function createTestVideo(
  imagePaths: string[],
  audioPath: string,
  outputPath: string
): Promise<void> {
  try {
    if (imagePaths.length === 0) {
      throw new Error('Nenhuma imagem fornecida para o vídeo');
    }

    // Cria um arquivo de texto listando as imagens para o ffmpeg
    const imageListFile = path.join('tmp', 'image_list.txt');
    let imageListContent = '';
    
    // Cada imagem terá a mesma duração
    const durationPerImage = 5 / imagePaths.length;
    
    for (const imagePath of imagePaths) {
      imageListContent += `file '${path.resolve(imagePath)}'\n`;
      imageListContent += `duration ${durationPerImage}\n`;
    }
    
    // Repetir a última imagem sem duração (requerido pelo ffmpeg)
    imageListContent += `file '${path.resolve(imagePaths[imagePaths.length - 1])}'\n`;
    
    await fs.writeFile(imageListFile, imageListContent);

    // Comando para criar o vídeo com ffmpeg
    const command = `ffmpeg -y -f concat -safe 0 -i ${imageListFile} -i ${audioPath} \
      -c:v libx264 -pix_fmt yuv420p -preset faster -crf 23 \
      -c:a aac -strict experimental -shortest \
      -map 0:v:0 -map 1:a:0 \
      ${outputPath}`;
    
    await execAsync(command);
    console.log(`Vídeo de teste gerado: ${outputPath}`);
  } catch (error) {
    console.error('Erro ao criar vídeo de teste:', error);
    throw error;
  }
}

/**
 * Gera um vídeo de teste completo
 * @returns Caminho do vídeo gerado
 */
export async function generateTestVideo(): Promise<string> {
  try {
    await ensureDirectoriesExist();
    
    const timestamp = Date.now();
    const outputVideoPath = path.join('output', 'videos', `test_video_${timestamp}.mp4`);
    
    // Gerar imagens de teste
    const imageColors = ['#3498db', '#e74c3c', '#2ecc71', '#f39c12'];
    const texts = ['TESTE 1', 'TESTE 2', 'TESTE 3', 'TESTE 4'];
    const imagePaths: string[] = [];
    
    for (let i = 0; i < 4; i++) {
      const imagePath = path.join('output', 'images', `test_image_${i}_${timestamp}.jpg`);
      await generateTestImage(texts[i], imageColors[i], imagePath);
      imagePaths.push(imagePath);
    }
    
    // Gerar áudio de teste
    const audioPath = path.join('output', 'audio', `test_audio_${timestamp}.aac`);
    await generateTestAudio('Teste', audioPath);
    
    // Criar vídeo de teste
    await createTestVideo(imagePaths, audioPath, outputVideoPath);
    
    return outputVideoPath;
  } catch (error) {
    console.error('Erro ao gerar vídeo de teste:', error);
    throw error;
  }
}
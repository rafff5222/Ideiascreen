import { promises as fs } from 'fs';
import path from 'path';
import { exec } from 'child_process';
import util from 'util';
import crypto from 'crypto';

// Importar serviços auxiliares
import * as pexelsService from './pexels-service';
import * as audioAnalyzer from './audio-analyzer';

// Converter exec para Promisify
const execAsync = util.promisify(exec);

// Caminho para o ffmpeg verificado via endpoint /api/check-ffmpeg
// O caminho correto para o ffmpeg do sistema no Replit está em:
const FFMPEG_PATH = '/nix/store/3zc5jbvqzrn8zmva4fx5p0nh4yy03wk4-ffmpeg-6.1.1-bin/bin/ffmpeg';

// Caminho para o diretório temporário e de saída
const TMP_DIR = path.join(process.cwd(), 'tmp');
const OUTPUT_DIR = path.join(process.cwd(), 'output');
const IMAGES_DIR = path.join(TMP_DIR, 'images');

// Resoluções de vídeo predefinidas
const VIDEO_RESOLUTIONS = {
  '1080p': { width: 1920, height: 1080 },
  '720p': { width: 1280, height: 720 },
  '480p': { width: 854, height: 480 },
  '360p': { width: 640, height: 360 }
};

/**
 * Garante que o diretório existe
 */
export async function ensureDirectoryExists(directory: string): Promise<void> {
  try {
    await fs.access(directory);
  } catch (e) {
    // Diretório não existe, criar
    await fs.mkdir(directory, { recursive: true });
  }
}

/**
 * Busca imagens relacionadas ao tópico usando a API do Pexels
 * @param topic Tópico para busca de imagens
 * @param count Quantidade de imagens
 * @returns Caminhos das imagens baixadas
 */
export async function fetchRelatedImages(topic: string, count: number = 5): Promise<string[]> {
  try {
    await ensureDirectoryExists(IMAGES_DIR);
    
    console.log(`Buscando ${count} imagens para o tópico "${topic}" via Pexels`);
    
    // Buscar imagens usando o serviço Pexels
    const imageUrls = await pexelsService.searchImages(topic, count);
    
    if (imageUrls.length === 0) {
      console.warn('Nenhuma imagem encontrada para o tópico, usando placeholder');
      return [];
    }
    
    // Baixar as imagens
    const localPaths = await pexelsService.downloadMultipleImages(imageUrls);
    
    console.log(`${localPaths.length} imagens baixadas com sucesso para "${topic}"`);
    return localPaths;
  } catch (err) {
    const error = err instanceof Error ? err : new Error(String(err));
    console.error('Erro ao buscar imagens relacionadas:', error.message);
    return [];
  }
}

/**
 * Cria uma imagem de cor sólida com texto
 * @param text Texto a ser adicionado à imagem
 * @param width Largura da imagem
 * @param height Altura da imagem
 * @param color Cor de fundo (formato hexadecimal ou nome)
 * @returns Caminho da imagem criada
 */
export async function createTextImage(
  text: string,
  width: number = 1280,
  height: number = 720,
  color: string = 'black'
): Promise<string> {
  await ensureDirectoryExists(IMAGES_DIR);
  
  const filename = `text_${crypto.randomUUID()}.jpg`;
  const outputPath = path.join(IMAGES_DIR, filename);
  
  try {
    // Escapar texto para evitar problemas com aspas no comando
    const escapedText = text.replace(/"/g, '\\"').replace(/\n/g, ' ');
    
    // Comando ffmpeg para criar imagem com texto centralizado
    const command = `"${FFMPEG_PATH}" -y -f lavfi -i color=c=${color}:s=${width}x${height} -vf "drawtext=text='${escapedText}':fontcolor=white:fontsize=48:x=(w-text_w)/2:y=(h-text_h)/2" -frames:v 1 "${outputPath}"`;
    
    await execAsync(command);
    
    // Verificar se o arquivo foi criado
    await fs.access(outputPath);
    
    console.log(`Imagem com texto criada: ${outputPath}`);
    return outputPath;
  } catch (err) {
    const error = err instanceof Error ? err : new Error(String(err));
    console.error('Erro ao criar imagem com texto:', error.message);
    
    // Fallback: criar uma imagem em branco sem texto
    try {
      const backupCommand = `"${FFMPEG_PATH}" -y -f lavfi -i color=c=${color}:s=${width}x${height} -frames:v 1 "${outputPath}"`;
      await execAsync(backupCommand);
      return outputPath;
    } catch (e) {
      throw new Error(`Não foi possível criar nem mesmo uma imagem em branco: ${e}`);
    }
  }
}

/**
 * Detecta pontos de corte em um arquivo de áudio baseados em silêncio
 * @param audioPath Caminho do arquivo de áudio
 * @param threshold Limiar de silêncio em dB (negativo, menor = mais sensível)
 * @returns Lista de pontos de tempo (em segundos) para cortes
 */
export async function detectAudioCutPoints(
  audioPath: string,
  threshold: number = -30
): Promise<number[]> {
  try {
    // Primeiro, garantir que o arquivo existe
    await fs.access(audioPath);
    
    // Usar o analisador de áudio para detectar silêncio
    const segments = await audioAnalyzer.detectSilence(audioPath, threshold);
    
    // Filtrar apenas o início dos segmentos não-silenciosos significativos
    const cutPoints = segments
      .filter(seg => !seg.isSilent && seg.duration >= 0.5)
      .map(seg => seg.start);
    
    // Adicionar o tempo zero se não estiver presente
    if (cutPoints.length > 0 && cutPoints[0] > 0) {
      cutPoints.unshift(0);
    }
    
    console.log(`Detectados ${cutPoints.length} pontos de corte baseados em silêncio`);
    return cutPoints;
  } catch (err) {
    const error = err instanceof Error ? err : new Error(String(err));
    console.error('Erro ao detectar pontos de corte no áudio:', error.message);
    return [0]; // Retornar apenas o ponto inicial como fallback
  }
}

/**
 * Processa o áudio e gera um vídeo
 * @param audioData Base64 ou caminho para o arquivo de áudio
 * @param imageUrls URLs das imagens a serem usadas
 * @param subtitles Legendas para o vídeo
 * @param options Opções adicionais para processamento
 * @returns Caminho para o vídeo gerado
 */
export async function processAudioToVideo(
  audioData: string,
  imageUrls: string[],
  subtitles: string[] | string,
  options: {
    topic?: string;           // Tópico para buscar imagens caso imageUrls esteja vazio
    detectSilence?: boolean;  // Se deve detectar silêncio para cortes automáticos
    silenceThreshold?: number; // Limite de detecção de silêncio em dB
    transitions?: string[];   // Tipos de transição a serem aplicados
    resolution?: string;      // Resolução do vídeo (ex: "1080p", "720p")
  } = {}
): Promise<string> {
  // Importar o serviço de Pexels
  const pexelsService = await import('./pexels-service');
  const audioAnalyzer = await import('./audio-analyzer');
  // Garantir que os diretórios existem
  await ensureDirectoryExists(TMP_DIR);
  await ensureDirectoryExists(OUTPUT_DIR);
  
  // Gerar ID único para este processamento
  const processingId = Date.now().toString();
  const audioPath = path.join(TMP_DIR, `audio_${processingId}.mp3`);
  const imageListFile = path.join(TMP_DIR, `images_${processingId}.txt`);
  const subtitlesFile = path.join(TMP_DIR, `subtitles_${processingId}.srt`);
  const outputVideoPath = path.join(OUTPUT_DIR, `video_${processingId}.mp4`);
  
  try {
    // Passo 1: Extrair o áudio (de base64 ou URL) para um arquivo
    if (audioData.startsWith('data:audio')) {
      // Extrair base64 e salvar como arquivo
      const base64Data = audioData.split(',')[1]; // Remove o cabeçalho data:audio/...
      await fs.writeFile(audioPath, Buffer.from(base64Data, 'base64'));
      console.log(`Áudio salvo em ${audioPath}`);
    } else if (audioData.startsWith('http')) {
      // Baixar o áudio de uma URL
      const fetch = (await import('node-fetch')).default;
      const response = await fetch(audioData);
      const buffer = await response.buffer();
      await fs.writeFile(audioPath, buffer);
      console.log(`Áudio baixado e salvo em ${audioPath}`);
    } else {
      // Assume que já é um caminho de arquivo
      await fs.copyFile(audioData, audioPath);
      console.log(`Áudio copiado para ${audioPath}`);
    }
    
    // Verificar se o arquivo de áudio existe
    try {
      await fs.access(audioPath);
      const stats = await fs.stat(audioPath);
      console.log(`Verificação de áudio: arquivo existe, tamanho: ${stats.size} bytes`);
      if (stats.size < 100) {
        throw new Error('Arquivo de áudio muito pequeno, possivelmente corrompido');
      }
    } catch (error: any) {
      console.error('Erro ao acessar arquivo de áudio:', error);
      throw new Error('Falha ao verificar arquivo de áudio: ' + error.message);
    }
    
    // Passo 2: Obter imagens (baixar URLs, usar as fornecidas ou buscar no Pexels)
    let localImagePaths: string[] = [];
    
    // Se não houver URLs de imagem e houver um tópico fornecido, buscar do Pexels
    if (imageUrls.length === 0 && options.topic) {
      console.log(`Buscando imagens do Pexels para o tópico: "${options.topic}"`);
      // Buscar imagens do Pexels
      const pexelsImages = await pexelsService.searchImages(options.topic, 5);
      
      // Baixar as imagens encontradas
      if (pexelsImages.length > 0) {
        localImagePaths = await pexelsService.downloadMultipleImages(pexelsImages);
        console.log(`${localImagePaths.length} imagens baixadas do Pexels`);
      }
    } else if (imageUrls.length > 0) {
      // Usar as URLs fornecidas
      for (let i = 0; i < imageUrls.length; i++) {
        const imagePath = path.join(IMAGES_DIR, `image_${processingId}_${i}.jpg`);
        
        if (imageUrls[i].startsWith('http')) {
          try {
            // Baixar a imagem
            const fetch = (await import('node-fetch')).default;
            const response = await fetch(imageUrls[i]);
            const buffer = await response.buffer();
            await fs.writeFile(imagePath, buffer);
            localImagePaths.push(imagePath);
          } catch (err) {
            const error = err instanceof Error ? err : new Error(String(err));
            console.error(`Erro ao baixar imagem de ${imageUrls[i]}:`, error.message);
            // Continuar com as próximas imagens
          }
        } else {
          try {
            // Assume que já é um caminho de arquivo
            await fs.copyFile(imageUrls[i], imagePath);
            localImagePaths.push(imagePath);
          } catch (err) {
            const error = err instanceof Error ? err : new Error(String(err));
            console.error(`Erro ao copiar imagem de ${imageUrls[i]}:`, error.message);
            // Continuar com as próximas imagens
          }
        }
      }
      
      console.log(`${localImagePaths.length} imagens processadas`);
    }
    
    // Se ainda não tiver imagens, criar uma imagem padrão de cor sólida
    if (localImagePaths.length === 0) {
      console.log('Nenhuma imagem disponível, criando imagem padrão');
      // Criar imagem padrão com texto (se houver tópico) ou em branco
      if (options.topic) {
        const imagePath = await createTextImage(options.topic, 1280, 720, "black");
        localImagePaths.push(imagePath);
      } else {
        // Gerar uma imagem preta simples com ffmpeg
        const defaultImagePath = path.join(IMAGES_DIR, `default_${processingId}.jpg`);
        const defaultImageCmd = `"${FFMPEG_PATH}" -y -f lavfi -i color=c=black:s=1280x720 -frames:v 1 "${defaultImagePath}"`;
        await execAsync(defaultImageCmd);
        localImagePaths.push(defaultImagePath);
      }
      console.log('Imagem padrão criada como fallback');
    }
    
    // Passo 3: Processar o áudio para detectar silêncio, se solicitado
    let cutPoints: number[] = [];
    let audioDuration = 0;
    
    try {
      // Obter a duração do áudio usando a própria função
      audioDuration = await getAudioDuration(audioPath);
      console.log(`Duração do áudio: ${audioDuration} segundos`);
      
      // Detectar silêncio para cortes, se solicitado
      if (options.detectSilence) {
        const silenceThreshold = options.silenceThreshold || -30;
        console.log(`Detectando silêncio com limiar de ${silenceThreshold}dB`);
        
        const segments = await audioAnalyzer.detectSilence(audioPath, silenceThreshold);
        
        // Gerar pontos de corte
        cutPoints = segments
          .filter(seg => !seg.isSilent && seg.duration >= 0.5) // Filtrar segmentos significativos
          .map(seg => seg.start);
        
        console.log(`Detectados ${cutPoints.length} pontos de corte baseados em silêncio`);
      }
    } catch (err) {
      const error = err instanceof Error ? err : new Error(String(err));
      console.warn('Erro ao processar áudio para detecção de silêncio:', error.message);
      // Continuar sem detecção de silêncio
    }
    
    // Passo 4: Gerar arquivo de lista de imagens para o ffmpeg
    let imageListContent = '';
    
    // Se tiver pontos de corte, usar eles para definir a duração das imagens
    if (cutPoints.length > 0) {
      // Garantir que o primeiro corte começa do zero
      if (cutPoints[0] > 0) {
        cutPoints.unshift(0);
      }
      
      // Adicionar o fim do áudio como último ponto
      if (cutPoints[cutPoints.length - 1] < audioDuration) {
        cutPoints.push(audioDuration);
      }
      
      // Distribuir as imagens pelos segmentos de áudio
      for (let i = 0; i < cutPoints.length - 1; i++) {
        const segmentDuration = cutPoints[i + 1] - cutPoints[i];
        // Usar imagem conforme o índice do segmento, com wrap-around se necessário
        const imageIndex = i % localImagePaths.length;
        
        imageListContent += `file '${localImagePaths[imageIndex]}'\nduration ${segmentDuration}\n`;
      }
    } else {
      // Sem pontos de corte, distribuir imagens uniformemente
      const imageDuration = audioDuration / Math.max(1, localImagePaths.length);
      
      for (const imagePath of localImagePaths) {
        imageListContent += `file '${imagePath}'\nduration ${imageDuration}\n`;
      }
    }
    
    // Adicionar a última imagem novamente sem duração (exigência do ffmpeg)
    if (localImagePaths.length > 0) {
      imageListContent += `file '${localImagePaths[localImagePaths.length - 1]}'\n`;
    }
    
    await fs.writeFile(imageListFile, imageListContent);
    console.log(`Arquivo de lista de imagens criado em: ${imageListFile}`);
    
    // Passo 4: Gerar arquivo de legendas SRT
    let srtContent = '';
    
    // Verificar se subtitles é um array ou string
    if (Array.isArray(subtitles)) {
      let duration = 0;
      for (let i = 0; i < subtitles.length; i++) {
        const startTime = formatSrtTime(duration);
        duration += imageDuration; // Ou ajustar conforme necessário para sincronização
        const endTime = formatSrtTime(duration);
        
        srtContent += `${i + 1}\n${startTime} --> ${endTime}\n${subtitles[i]}\n\n`;
      }
    } else {
      // Se for string, assumir que já está no formato SRT
      srtContent = subtitles;
    }
    
    await fs.writeFile(subtitlesFile, srtContent);
    console.log(`Arquivo de legendas criado em: ${subtitlesFile}`);
    
    // Passo 5: Usar ffmpeg para combinar áudio e imagens em um vídeo
    console.log('Iniciando geração de vídeo com FFmpeg...');
    
    // Comando para criar vídeo com transições
    const command = `"${FFMPEG_PATH}" -y -f concat -safe 0 -i "${imageListFile}" -i "${audioPath}" -vf "subtitles=${subtitlesFile},fade=t=in:st=0:d=1,fade=t=out:st=${audioDuration-1}:d=1" -c:v libx264 -pix_fmt yuv420p -preset fast -c:a aac -strict experimental -b:a 192k "${outputVideoPath}"`;
    
    console.log(`Executando comando: ${command}`);
    
    try {
      const { stdout, stderr } = await execAsync(command);
      console.log('FFmpeg stdout:', stdout);
      console.log('FFmpeg stderr:', stderr);
    } catch (error) {
      console.error('Erro ao executar FFmpeg:', error);
      
      // Se o comando principal falhar, tentar uma versão mais simples
      console.log('Tentando comando alternativo de FFmpeg mais simples...');
      
      const simpleCommand = `"${FFMPEG_PATH}" -y -loop 1 -i "${localImagePaths[0]}" -i "${audioPath}" -c:v libx264 -pix_fmt yuv420p -preset fast -c:a aac -strict experimental -b:a 192k -shortest "${outputVideoPath}"`;
      
      try {
        const { stdout, stderr } = await execAsync(simpleCommand);
        console.log('FFmpeg simples stdout:', stdout);
        console.log('FFmpeg simples stderr:', stderr);
      } catch (fallbackError: any) {
        console.error('Erro no comando alternativo de FFmpeg:', fallbackError);
        throw new Error('Falha ao gerar vídeo: ' + fallbackError.message);
      }
    }
    
    // Verificar se o vídeo foi gerado corretamente
    try {
      await fs.access(outputVideoPath);
      const stats = await fs.stat(outputVideoPath);
      console.log(`Vídeo gerado com sucesso em ${outputVideoPath}, tamanho: ${stats.size} bytes`);
      
      if (stats.size < 1000) {
        throw new Error('Arquivo de vídeo muito pequeno, possivelmente corrompido');
      }
    } catch (error: any) {
      console.error('Erro ao verificar arquivo de vídeo:', error);
      throw new Error('Falha ao verificar arquivo de vídeo gerado: ' + error.message);
    }
    
    return outputVideoPath;
  } catch (error) {
    console.error('Erro durante o processamento de vídeo:', error);
    throw error;
  } finally {
    // Limpeza (opcional): remover arquivos temporários
    // Comentado para depuração, descomente para usar em produção
    /*
    try {
      await fs.unlink(audioPath);
      await fs.unlink(imageListFile);
      await fs.unlink(subtitlesFile);
      
      for (const imagePath of localImagePaths) {
        await fs.unlink(imagePath);
      }
    } catch (e) {
      console.warn('Aviso: Não foi possível limpar alguns arquivos temporários', e);
    }
    */
  }
}

/**
 * Obter a duração de um arquivo de áudio usando ffmpeg
 */
async function getAudioDuration(audioPath: string): Promise<number> {
  try {
    const command = `"${FFMPEG_PATH}" -i "${audioPath}" 2>&1 | grep "Duration"`;
    const { stdout } = await execAsync(command);
    
    // Extrair a duração do formato HH:MM:SS.ms
    const durationMatch = stdout.match(/Duration: (\d+):(\d+):(\d+\.\d+)/);
    if (durationMatch) {
      const hours = parseInt(durationMatch[1]);
      const minutes = parseInt(durationMatch[2]);
      const seconds = parseFloat(durationMatch[3]);
      
      return hours * 3600 + minutes * 60 + seconds;
    }
    
    console.warn('Não foi possível extrair a duração do áudio, usando valor padrão');
    return 10; // Valor padrão se não conseguir extrair
  } catch (error) {
    console.error('Erro ao obter duração do áudio:', error);
    
    // Tentar um método alternativo
    try {
      const command = `"${FFMPEG_PATH}" -i "${audioPath}" -f null -`;
      const { stderr } = await execAsync(command);
      
      // Extrair a duração de outro formato possível
      const durationMatch = stderr.match(/time=(\d+):(\d+):(\d+\.\d+)/);
      if (durationMatch) {
        const hours = parseInt(durationMatch[1]);
        const minutes = parseInt(durationMatch[2]);
        const seconds = parseFloat(durationMatch[3]);
        
        return hours * 3600 + minutes * 60 + seconds;
      }
    } catch (e) {
      console.error('Método alternativo também falhou:', e);
    }
    
    return 10; // Valor padrão se ambos os métodos falharem
  }
}

/**
 * Formatar o tempo para formato SRT (00:00:00,000)
 */
function formatSrtTime(seconds: number): string {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const secs = Math.floor(seconds % 60);
  const ms = Math.floor((seconds % 1) * 1000);
  
  return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(secs).padStart(2, '0')},${String(ms).padStart(3, '0')}`;
}

/**
 * Converter um vídeo para outro formato ou resolução
 */
export async function convertVideo(
  inputPath: string, 
  outputFormat: string = 'mp4', 
  resolution: string = '720p'
): Promise<string> {
  // Extrair o diretório e nome base do arquivo
  const parsedPath = path.parse(inputPath);
  const outputPath = path.join(parsedPath.dir, `${parsedPath.name}_converted.${outputFormat}`);
  
  // Definir resolução
  let resolutionParam = '';
  if (resolution === '720p') {
    resolutionParam = '-vf "scale=1280:720"';
  } else if (resolution === '1080p') {
    resolutionParam = '-vf "scale=1920:1080"';
  }
  
  // Comando para converter vídeo
  const command = `"${FFMPEG_PATH}" -y -i "${inputPath}" ${resolutionParam} -c:v libx264 -preset fast -c:a aac -strict experimental -b:a 192k "${outputPath}"`;
  
  console.log(`Executando conversão de vídeo: ${command}`);
  
  try {
    const { stdout, stderr } = await execAsync(command);
    console.log('FFmpeg conversão stdout:', stdout);
    console.log('FFmpeg conversão stderr:', stderr);
    
    // Verificar se o vídeo foi gerado corretamente
    await fs.access(outputPath);
    const stats = await fs.stat(outputPath);
    console.log(`Vídeo convertido com sucesso, tamanho: ${stats.size} bytes`);
    
    return outputPath;
  } catch (error: any) {
    console.error('Erro ao converter vídeo:', error);
    throw new Error(`Falha ao converter vídeo: ${error.message}`);
  }
}
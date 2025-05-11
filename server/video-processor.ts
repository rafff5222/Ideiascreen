import { promises as fs } from 'fs';
import path from 'path';
import { exec } from 'child_process';
import util from 'util';

// Converter exec para Promisify
const execAsync = util.promisify(exec);

// Caminho para o ffmpeg verificado via endpoint /api/check-ffmpeg
// O caminho correto para o ffmpeg do sistema no Replit está em:
const FFMPEG_PATH = '/nix/store/3zc5jbvqzrn8zmva4fx5p0nh4yy03wk4-ffmpeg-6.1.1-bin/bin/ffmpeg';

// Caminho para o diretório temporário e de saída
const TMP_DIR = path.join(process.cwd(), 'tmp');
const OUTPUT_DIR = path.join(process.cwd(), 'output');

/**
 * Garante que o diretório existe
 */
async function ensureDirectoryExists(directory: string): Promise<void> {
  try {
    await fs.access(directory);
  } catch (e) {
    // Diretório não existe, criar
    await fs.mkdir(directory, { recursive: true });
  }
}

/**
 * Processa o áudio e gera um vídeo
 * @param audioData Base64 ou caminho para o arquivo de áudio
 * @param imageUrls URLs das imagens a serem usadas
 * @param subtitles Legendas para o vídeo
 * @returns Caminho para o vídeo gerado
 */
export async function processAudioToVideo(
  audioData: string,
  imageUrls: string[],
  subtitles: string[]
): Promise<string> {
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
    
    // Passo 2: Baixar as imagens
    const localImagePaths: string[] = [];
    for (let i = 0; i < imageUrls.length; i++) {
      const imagePath = path.join(TMP_DIR, `image_${processingId}_${i}.jpg`);
      
      if (imageUrls[i].startsWith('http')) {
        // Baixar a imagem
        const fetch = (await import('node-fetch')).default;
        const response = await fetch(imageUrls[i]);
        const buffer = await response.buffer();
        await fs.writeFile(imagePath, buffer);
      } else {
        // Assume que já é um caminho de arquivo
        await fs.copyFile(imageUrls[i], imagePath);
      }
      
      localImagePaths.push(imagePath);
    }
    
    console.log(`${localImagePaths.length} imagens baixadas`);
    
    // Passo 3: Gerar arquivo de lista de imagens para o ffmpeg
    let imageListContent = '';
    // Duração total do áudio
    const audioDuration = await getAudioDuration(audioPath);
    console.log(`Duração do áudio: ${audioDuration} segundos`);
    
    // Calcular duração de cada imagem baseado no número de imagens
    const imageDuration = audioDuration / localImagePaths.length;
    
    // Criar arquivo de lista para o ffmpeg
    for (const imagePath of localImagePaths) {
      imageListContent += `file '${imagePath}'\nduration ${imageDuration}\n`;
    }
    
    // Adicionar a última imagem novamente sem duração (exigência do ffmpeg)
    if (localImagePaths.length > 0) {
      imageListContent += `file '${localImagePaths[localImagePaths.length - 1]}'\n`;
    }
    
    await fs.writeFile(imageListFile, imageListContent);
    console.log(`Arquivo de lista de imagens criado em: ${imageListFile}`);
    
    // Passo 4: Gerar arquivo de legendas SRT
    let srtContent = '';
    let duration = 0;
    for (let i = 0; i < subtitles.length; i++) {
      const startTime = formatSrtTime(duration);
      duration += imageDuration; // Ou ajustar conforme necessário para sincronização
      const endTime = formatSrtTime(duration);
      
      srtContent += `${i + 1}\n${startTime} --> ${endTime}\n${subtitles[i]}\n\n`;
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
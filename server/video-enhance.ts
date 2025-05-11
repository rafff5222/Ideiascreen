/**
 * Módulo de aprimoramento de vídeo
 * Adiciona recursos avançados para edição e processamento inteligente de vídeos
 */

import { promises as fs } from 'fs';
import path from 'path';
import { exec } from 'child_process';
import util from 'util';
import * as audioAnalyzer from './audio-analyzer';

// Converter exec para Promisify
const execAsync = util.promisify(exec);

// Caminho para o ffmpeg
const FFMPEG_PATH = '/nix/store/3zc5jbvqzrn8zmva4jbvqzrn8zmva4fx5p0nh4yy03wk4-ffmpeg-6.1.1-bin/bin/ffmpeg';

// Interface para segmentos de texto
interface TextSegment {
  text: string;
  duration: number;
  emphasis: boolean; // Indica se o segmento deve ser enfatizado
}

// Interface para configurações de exportação
export interface ExportConfig {
  platform: 'instagram' | 'tiktok' | 'youtube' | 'generic';
  resolution: string;
  format: string;
}

/**
 * Analisa o texto para determinar a ênfase baseada em pontuação e palavras-chave
 * @param text Texto a ser analisado
 * @returns Segmentos de texto com análise de ênfase
 */
export function analyzeTextEmphasis(text: string): TextSegment[] {
  // Dividir o texto em segmentos (frases)
  const sentences = text.split(/(?<=[.!?])\s+/);
  
  return sentences.map(sentence => {
    // Verificar se a frase deve ter ênfase (contém ! ou ? ou palavras-chave)
    const hasEmphasis = /[!?]$/.test(sentence) || 
                        /\b(importante|atenção|incrível|surpreendente|exclusivo)\b/i.test(sentence);
    
    // Calcular duração baseada no comprimento e ênfase
    // Frases com ênfase recebem um pouco mais de tempo na tela
    const wordCount = sentence.split(/\s+/).length;
    let duration = Math.max(2, wordCount * 0.5); // Pelo menos 2 segundos ou 0.5s por palavra
    
    if (hasEmphasis) {
      duration *= 1.2; // 20% mais tempo para frases com ênfase
    }
    
    return {
      text: sentence.trim(),
      duration,
      emphasis: hasEmphasis
    };
  });
}

/**
 * Calcula a duração ideal para cada imagem baseada na análise do texto
 * @param segments Segmentos de texto analisados
 * @param totalImages Número total de imagens disponíveis
 * @param audioLength Duração total do áudio em segundos
 * @returns Array com duração para cada imagem
 */
export function calculateImageDurations(
  segments: TextSegment[], 
  totalImages: number, 
  audioLength: number
): number[] {
  // Se não tivermos segmentos ou imagens, retornar um array vazio
  if (segments.length === 0 || totalImages === 0) {
    return [];
  }

  // Se temos mais imagens que segmentos, vamos criar um mapeamento
  // onde os segmentos com ênfase podem ter múltiplas imagens
  if (totalImages >= segments.length) {
    // Calcular quantas imagens extras temos para distribuir para segmentos com ênfase
    const baseImagesPerSegment = Math.floor(totalImages / segments.length);
    let extraImages = totalImages - (baseImagesPerSegment * segments.length);
    
    // Primeiro, dar prioridade aos segmentos com ênfase
    const emphasisSegments = segments.filter(s => s.emphasis);
    
    // Distribuir duração para cada imagem
    const durations: number[] = [];
    
    segments.forEach(segment => {
      let imagesForThisSegment = baseImagesPerSegment;
      
      // Se temos imagens extras e este é um segmento com ênfase, dar uma imagem extra
      if (extraImages > 0 && segment.emphasis) {
        imagesForThisSegment++;
        extraImages--;
      }
      
      // Distribuir a duração do segmento pelas imagens
      const durationPerImage = segment.duration / imagesForThisSegment;
      
      for (let i = 0; i < imagesForThisSegment; i++) {
        durations.push(durationPerImage);
      }
    });
    
    return durations;
  } else {
    // Temos menos imagens que segmentos, precisamos agrupar segmentos
    const segmentsPerImage = Math.ceil(segments.length / totalImages);
    const durations: number[] = [];
    
    for (let i = 0; i < totalImages; i++) {
      const startIdx = i * segmentsPerImage;
      const endIdx = Math.min(startIdx + segmentsPerImage, segments.length);
      const segmentsForThisImage = segments.slice(startIdx, endIdx);
      
      // Somar duração de todos os segmentos para esta imagem
      const totalDuration = segmentsForThisImage.reduce((sum, seg) => sum + seg.duration, 0);
      durations.push(totalDuration);
    }
    
    return durations;
  }
}

/**
 * Gera um comando ffmpeg para aplicar efeitos de transição entre clips
 * @param transitionType Tipo de transição: fade, dissolve, wipe, slide ou zoom
 * @param duration Duração da transição em segundos
 * @returns Parte do comando ffmpeg para aplicar a transição
 */
export function getTransitionEffect(transitionType: string, duration: number = 1): string {
  const durationFrames = Math.round(duration * 25); // Assumindo 25fps
  
  switch (transitionType) {
    case 'fade':
      return `fade=t=in:st=0:d=${duration},fade=t=out:st=${duration * 3}:d=${duration}`;
    case 'dissolve':
      return `tblend=all_mode=average:all_opacity=0.5`;
    case 'wipe':
      return `wipeleft=0:${durationFrames}`;
    case 'slide':
      return `hslice=h=16,vstack=16`;
    case 'zoom':
      return `zoompan=z='min(zoom+0.0015,1.5)':d=25:s=1280x720`;
    default:
      return `fade=t=in:st=0:d=${duration},fade=t=out:st=${duration * 3}:d=${duration}`;
  }
}

/**
 * Aplica legendas ao vídeo baseadas no texto analisado
 * @param videoInputPath Caminho para o vídeo de entrada
 * @param videoOutputPath Caminho para o vídeo de saída
 * @param segments Segmentos de texto com durações
 * @returns Caminho para o vídeo com legendas
 */
export async function addSubtitlesToVideo(
  videoInputPath: string,
  videoOutputPath: string,
  segments: TextSegment[]
): Promise<string> {
  // Criar arquivo de legendas SRT
  const srtPath = videoInputPath.replace(/\.\w+$/, '.srt');
  let srtContent = '';
  let startTime = 0;
  
  segments.forEach((segment, index) => {
    const endTime = startTime + segment.duration;
    
    // Formato SRT para tempos: HH:MM:SS,milliseconds
    const formatTime = (time: number) => {
      const hours = Math.floor(time / 3600);
      const minutes = Math.floor((time % 3600) / 60);
      const seconds = Math.floor(time % 60);
      const ms = Math.floor((time % 1) * 1000);
      
      return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')},${ms.toString().padStart(3, '0')}`;
    };
    
    srtContent += `${index + 1}\n`;
    srtContent += `${formatTime(startTime)} --> ${formatTime(endTime)}\n`;
    srtContent += `${segment.text}\n\n`;
    
    startTime = endTime;
  });
  
  await fs.writeFile(srtPath, srtContent);
  
  // Aplicar legendas ao vídeo usando ffmpeg
  const command = `${FFMPEG_PATH} -i "${videoInputPath}" -vf subtitles="${srtPath}" -c:a copy "${videoOutputPath}"`;
  
  try {
    await execAsync(command);
    return videoOutputPath;
  } catch (error: any) {
    console.error('Erro ao adicionar legendas:', error.message);
    // Se falhar, retornar o vídeo original
    return videoInputPath;
  }
}

/**
 * Exporta o vídeo para diferentes plataformas com configurações otimizadas
 * @param videoPath Caminho para o vídeo original
 * @param config Configuração de exportação
 * @returns Caminho para o vídeo exportado
 */
export async function exportForPlatform(
  videoPath: string,
  config: ExportConfig
): Promise<string> {
  const { platform, resolution, format } = config;
  const outputFileName = path.basename(videoPath, path.extname(videoPath));
  const outputPath = path.join(path.dirname(videoPath), `${outputFileName}_${platform}.${format}`);
  
  let resolutionStr: string;
  let additionalParams: string = '';
  
  switch (platform) {
    case 'tiktok':
      resolutionStr = '1080x1920'; // Retrato 9:16
      additionalParams = '-preset slow -crf 23 -b:a 128k';
      break;
    case 'instagram':
      resolutionStr = '1080x1080'; // Quadrado 1:1
      additionalParams = '-preset medium -crf 24 -b:a 128k';
      break;
    case 'youtube':
      resolutionStr = '1920x1080'; // Paisagem 16:9
      additionalParams = '-preset slow -crf 20 -b:a 320k';
      break;
    default: // generic
      resolutionStr = resolution === '1080p' ? '1920x1080' : resolution === '720p' ? '1280x720' : '854x480';
      additionalParams = '-preset medium -crf 23 -b:a 128k';
  }
  
  const command = `${FFMPEG_PATH} -i "${videoPath}" -vf "scale=${resolutionStr}" ${additionalParams} "${outputPath}"`;
  
  try {
    await execAsync(command);
    return outputPath;
  } catch (error: any) {
    console.error(`Erro ao exportar para ${platform}:`, error.message);
    return videoPath; // Retornar original em caso de erro
  }
}

/**
 * Calcula uma pontuação de engajamento para o vídeo baseado em características
 * @param segments Segmentos de texto analisados
 * @param transitionCount Número de transições no vídeo
 * @param hasSubtitles Se o vídeo tem legendas
 * @returns Pontuação de 0 a 100
 */
export function calculateEngagementScore(
  segments: TextSegment[],
  transitionCount: number,
  hasSubtitles: boolean
): number {
  let score = 0;
  
  // Variedade de duração nos segmentos (ritmo dinâmico)
  const durations = segments.map(s => s.duration);
  const avgDuration = durations.reduce((sum, dur) => sum + dur, 0) / durations.length;
  const durationVariance = durations.reduce((sum, dur) => sum + Math.abs(dur - avgDuration), 0) / durations.length;
  
  // Normalizar variância para pontuação (0-25)
  const rhythmScore = Math.min(25, Math.round(durationVariance * 10));
  score += rhythmScore;
  
  // Pontuação para ênfase (0-25)
  const emphasisCount = segments.filter(s => s.emphasis).length;
  const emphasisPercentage = (emphasisCount / segments.length) * 100;
  const emphasisScore = Math.min(25, Math.round(emphasisPercentage));
  score += emphasisScore;
  
  // Pontuação para transições (0-25)
  const transitionScore = Math.min(25, transitionCount * 5);
  score += transitionScore;
  
  // Pontuação para recursos adicionais (0-25)
  if (hasSubtitles) score += 15;
  
  // Garantir que a pontuação está entre 0 e 100
  return Math.max(0, Math.min(100, score));
}

/**
 * Retorna uma descrição textual para uma pontuação de engajamento
 * @param score Pontuação de engajamento (0-100)
 * @returns Descrição textual da pontuação
 */
export function getEngagementDescription(score: number): string {
  if (score >= 90) return "Excelente! Vídeo altamente envolvente";
  if (score >= 75) return "Muito bom. Engajamento acima da média";
  if (score >= 60) return "Bom. Engajamento médio";
  if (score >= 40) return "Razoável. Considere mais variações";
  return "Básico. Adicione mais elementos dinâmicos";
}
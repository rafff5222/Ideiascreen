import { exec } from 'child_process';
import util from 'util';
import path from 'path';
import fs from 'fs/promises';

// Versão promisificada do exec
const execAsync = util.promisify(exec);

// Caminho para o ffmpeg verificado via endpoint /api/check-ffmpeg
const FFMPEG_PATH = '/nix/store/3zc5jbvqzrn8zmva4fx5p0nh4yy03wk4-ffmpeg-6.1.1-bin/bin/ffmpeg';

// Interface para os segmentos de áudio
export interface AudioSegment {
  start: number;  // Tempo de início em segundos
  end: number;    // Tempo de fim em segundos
  duration: number; // Duração em segundos
  isSilent: boolean; // Se é um segmento silencioso
}

/**
 * Detecta segmentos silenciosos em um arquivo de áudio
 * @param audioPath Caminho para o arquivo de áudio
 * @param silenceThreshold Limiar de silêncio em dB (negativo, menor = mais sensível)
 * @param minSilenceDuration Duração mínima do silêncio em segundos
 * @returns Lista de segmentos de áudio com indicação de silêncio
 */
export async function detectSilence(
  audioPath: string,
  silenceThreshold: number = -30,
  minSilenceDuration: number = 0.3
): Promise<AudioSegment[]> {
  try {
    // Verificar se o arquivo existe
    await fs.access(audioPath);
    
    // Comando ffmpeg para detectar silêncio
    const command = `"${FFMPEG_PATH}" -i "${audioPath}" -af silencedetect=noise=${silenceThreshold}dB:d=${minSilenceDuration} -f null -`;
    
    console.log(`Executando comando para detecção de silêncio: ${command}`);
    
    // Executar o comando
    const { stderr } = await execAsync(command);
    
    // Analisar a saída para encontrar segmentos de silêncio
    const silenceStartRegex = /silence_start: ([0-9.]+)/g;
    const silenceEndRegex = /silence_end: ([0-9.]+) \\| silence_duration: ([0-9.]+)/g;
    
    // Coletar inícios de silêncio
    const silenceStarts: number[] = [];
    let startMatch;
    while ((startMatch = silenceStartRegex.exec(stderr)) !== null) {
      silenceStarts.push(parseFloat(startMatch[1]));
    }
    
    // Coletar fins de silêncio e durações
    const silenceEnds: {end: number, duration: number}[] = [];
    let endMatch;
    while ((endMatch = silenceEndRegex.exec(stderr)) !== null) {
      silenceEnds.push({
        end: parseFloat(endMatch[1]),
        duration: parseFloat(endMatch[2])
      });
    }
    
    // Obter a duração total do áudio
    const audioDuration = await getAudioDuration(audioPath);
    
    // Combinar os dados para criar segmentos
    const segments: AudioSegment[] = [];
    
    // Se houver silêncio no início, adicionar o segmento de silêncio
    if (silenceStarts.length > 0 && silenceStarts[0] === 0) {
      const endTime = silenceEnds[0].end;
      segments.push({
        start: 0,
        end: endTime,
        duration: endTime,
        isSilent: true
      });
    } else {
      // Se não começar com silêncio, o primeiro segmento é não-silencioso começando em 0
      const firstSilenceStart = silenceStarts.length > 0 ? silenceStarts[0] : audioDuration;
      segments.push({
        start: 0,
        end: firstSilenceStart,
        duration: firstSilenceStart,
        isSilent: false
      });
    }
    
    // Adicionar os segmentos intermediários
    for (let i = 0; i < silenceStarts.length; i++) {
      // Adicionar segmento de silêncio, exceto o primeiro que já foi tratado acima
      if (!(i === 0 && silenceStarts[i] === 0)) {
        const start = silenceStarts[i];
        const end = silenceEnds[i].end;
        segments.push({
          start,
          end,
          duration: end - start,
          isSilent: true
        });
      }
      
      // Adicionar segmento não-silencioso após o silêncio, se não for o último
      if (i < silenceStarts.length - 1) {
        const start = silenceEnds[i].end;
        const end = silenceStarts[i + 1];
        segments.push({
          start,
          end,
          duration: end - start,
          isSilent: false
        });
      }
    }
    
    // Adicionar último segmento não-silencioso, se houver
    const lastEnd = silenceEnds.length > 0 ? silenceEnds[silenceEnds.length - 1].end : 0;
    if (lastEnd < audioDuration) {
      segments.push({
        start: lastEnd,
        end: audioDuration,
        duration: audioDuration - lastEnd,
        isSilent: false
      });
    }
    
    return segments;
  } catch (error) {
    console.error('Erro ao detectar silêncio:', error);
    throw error;
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
    
    console.error('Erro ao obter duração do áudio:', stdout);
    
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
    } catch (alternativeError) {
      console.error('Método alternativo falhou:', alternativeError);
    }
    
    // Valor padrão se não conseguir determinar
    return 10; 
  } catch (error) {
    console.error('Erro ao obter duração do áudio:', error);
    // Valor padrão se não conseguir determinar
    return 10;
  }
}

/**
 * Gera pontos de corte baseados em silêncio para edição automática de vídeo
 * @param audioPath Caminho para o arquivo de áudio
 * @param minSegmentDuration Duração mínima de um segmento não silencioso
 * @returns Lista de timestamps para cortes (início de cada segmento não silencioso)
 */
export async function generateCutPoints(
  audioPath: string,
  minSegmentDuration: number = 1.0
): Promise<number[]> {
  try {
    // Detectar segmentos de silêncio
    const segments = await detectSilence(audioPath);
    
    // Filtrar apenas os segmentos não silenciosos com duração mínima
    const validSegments = segments.filter(
      segment => !segment.isSilent && segment.duration >= minSegmentDuration
    );
    
    // Extrair os pontos de início de cada segmento válido
    const cutPoints = validSegments.map(segment => segment.start);
    
    console.log(`Gerados ${cutPoints.length} pontos de corte baseados em silêncio`);
    return cutPoints;
  } catch (error) {
    console.error('Erro ao gerar pontos de corte:', error);
    throw error;
  }
}
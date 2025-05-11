import fs from 'fs';
import path from 'path';
import { Request, Response } from 'express';
import { promisify } from 'util';
import { exec } from 'child_process';

const execPromise = promisify(exec);

// Constantes para cache e streaming
const CACHE_MAX_AGE = 86400; // 1 dia em segundos
const DEFAULT_CHUNK_SIZE = 1024 * 1024; // 1MB

/**
 * Serviço de streaming de vídeo otimizado
 * - Suporte para Range Requests
 * - Cabeçalhos de cache otimizados
 * - Suporte para diferentes formatos
 */
export class VideoStreamService {
  private videoFolders: string[];

  constructor(videoFolders: string[] = ['output/videos', 'videos']) {
    this.videoFolders = videoFolders;
  }

  /**
   * Localiza um vídeo em todos os diretórios configurados
   */
  async findVideo(fileName: string): Promise<string | null> {
    for (const folder of this.videoFolders) {
      const filePath = path.join(folder, fileName);
      try {
        await fs.promises.access(filePath, fs.constants.F_OK);
        return filePath;
      } catch (err) {
        // Arquivo não encontrado neste diretório, continua procurando
      }
    }
    return null;
  }

  /**
   * Obtém informações básicas sobre o vídeo usando ffprobe
   */
  async getVideoInfo(filePath: string): Promise<{ 
    duration: number;
    width: number;
    height: number;
    bitrate: number;
    format: string;
  } | null> {
    try {
      const { stdout } = await execPromise(
        `ffprobe -v error -select_streams v:0 -show_entries stream=width,height,duration,bit_rate:format=format_name -of json "${filePath}"`
      );
      
      const info = JSON.parse(stdout);
      const stream = info.streams[0];
      
      return {
        duration: parseFloat(stream.duration || '0'),
        width: stream.width || 0,
        height: stream.height || 0,
        bitrate: parseInt(stream.bit_rate || '0', 10),
        format: info.format?.format_name || 'unknown'
      };
    } catch (error) {
      console.error('Erro ao obter informações do vídeo:', error);
      return null;
    }
  }

  /**
   * Gera uma thumbnail para o vídeo
   */
  async generateThumbnail(videoPath: string, outputPath?: string): Promise<string | null> {
    try {
      // Define um local para salvar se não for especificado
      if (!outputPath) {
        const dir = path.dirname(videoPath);
        const baseName = path.basename(videoPath, path.extname(videoPath));
        outputPath = path.join(dir, `${baseName}_thumb.jpg`);
      }

      // Posição para captura (1 segundo)
      const position = '00:00:01';
      
      await execPromise(
        `ffmpeg -y -i "${videoPath}" -ss ${position} -vframes 1 -q:v 2 "${outputPath}"`
      );
      
      return outputPath;
    } catch (error) {
      console.error('Erro ao gerar thumbnail:', error);
      return null;
    }
  }

  /**
   * Handler de streaming otimizado para Express
   */
  streamVideo(req: Request, res: Response, filePath: string): void {
    const stat = fs.statSync(filePath);
    const fileSize = stat.size;
    const range = req.headers.range;

    // Configurações de cache
    res.setHeader('Cache-Control', `public, max-age=${CACHE_MAX_AGE}`);
    res.setHeader('Content-Type', this.getContentType(filePath));

    // Processamento de range requests (streaming parcial)
    if (range) {
      const parts = range.replace(/bytes=/, '').split('-');
      const start = parseInt(parts[0], 10);
      const end = parts[1] ? parseInt(parts[1], 10) : fileSize - 1;
      const chunkSize = (end - start) + 1;
      const file = fs.createReadStream(filePath, { start, end });

      res.writeHead(206, {
        'Content-Range': `bytes ${start}-${end}/${fileSize}`,
        'Accept-Ranges': 'bytes',
        'Content-Length': chunkSize,
      });

      file.pipe(res);
    } else {
      // Streaming completo se não houver range request
      res.writeHead(200, {
        'Content-Length': fileSize,
        'Accept-Ranges': 'bytes',
      });
      
      fs.createReadStream(filePath).pipe(res);
    }
  }

  /**
   * Determina o Content-Type com base na extensão do arquivo
   */
  private getContentType(filePath: string): string {
    const ext = path.extname(filePath).toLowerCase();
    
    switch (ext) {
      case '.mp4':
        return 'video/mp4';
      case '.webm':
        return 'video/webm';
      case '.ogg':
        return 'video/ogg';
      case '.mov':
        return 'video/quicktime';
      case '.m3u8':
        return 'application/x-mpegURL';
      case '.ts':
        return 'video/MP2T';
      default:
        return 'application/octet-stream';
    }
  }

  /**
   * Converte vídeo para formato HLS (streaming adaptativo)
   * Retorna o caminho do arquivo de playlist (m3u8)
   */
  async convertToHLS(videoPath: string, outputDir?: string): Promise<string | null> {
    try {
      // Define diretório de saída se não especificado
      if (!outputDir) {
        const dir = path.dirname(videoPath);
        const baseName = path.basename(videoPath, path.extname(videoPath));
        outputDir = path.join(dir, `${baseName}_hls`);
      }

      // Cria o diretório se não existir
      await fs.promises.mkdir(outputDir, { recursive: true });

      const playlistPath = path.join(outputDir, 'playlist.m3u8');
      
      // Converte para diferentes qualidades
      await execPromise(
        `ffmpeg -y -i "${videoPath}" \
        -filter_complex "split=3[v1][v2][v3]; \
        [v1]scale=-2:720[v1out]; \
        [v2]scale=-2:480[v2out]; \
        [v3]scale=-2:360[v3out]" \
        -map "[v1out]" -c:v:0 libx264 -b:v:0 2800k \
        -map "[v2out]" -c:v:1 libx264 -b:v:1 1400k \
        -map "[v3out]" -c:v:2 libx264 -b:v:2 800k \
        -map a:0 -c:a aac -b:a:0 128k -ac 2 \
        -map a:0 -c:a aac -b:a:1 96k -ac 2 \
        -map a:0 -c:a aac -b:a:2 48k -ac 2 \
        -var_stream_map "v:0,a:0 v:1,a:1 v:2,a:2" \
        -master_pl_name master.m3u8 \
        -f hls -hls_time 4 -hls_playlist_type vod \
        -hls_segment_filename "${outputDir}/segment_%v_%03d.ts" \
        "${outputDir}/stream_%v.m3u8"`
      );
      
      return path.join(outputDir, 'master.m3u8');
    } catch (error) {
      console.error('Erro ao converter para HLS:', error);
      return null;
    }
  }
}

// Exportar uma instância singleton do serviço
export const videoStreamService = new VideoStreamService();
/**
 * Serviço de streaming de vídeo otimizado
 * Suporta range requests, caching e controle de qualidade
 */

import { Request, Response } from 'express';
import fs from 'fs';
import path from 'path';
import crypto from 'crypto';

interface StreamOptions {
  start?: number;
  end?: number;
  quality?: string;
  cacheControl?: string;
}

// Cache de vídeos em memória para vídeos populares
const videoCache = new Map<string, {
  buffer: Buffer, 
  lastAccessed: number,
  hits: number
}>();

// Tamanho máximo do cache (100MB)
const MAX_CACHE_SIZE = 100 * 1024 * 1024;
// Tempo máximo de cache (1 hora)
const MAX_CACHE_AGE = 60 * 60 * 1000;
// Tamanho atual do cache
let currentCacheSize = 0;

/**
 * Classe para gerenciar streaming de vídeo
 */
class VideoStreamService {
  /**
   * Stream um vídeo para o cliente com suporte a range requests
   * @param req Request HTTP
   * @param res Response HTTP
   * @param filePath Caminho para o arquivo de vídeo
   * @param options Opções de streaming
   */
  async streamVideo(
    req: Request, 
    res: Response, 
    filePath: string, 
    options: StreamOptions = {}
  ): Promise<void> {
    try {
      // Verifica se o arquivo existe
      if (!fs.existsSync(filePath)) {
        res.status(404).send('Arquivo não encontrado');
        return;
      }

      // Calcular hash do arquivo para identificação no cache
      const fileKey = crypto.createHash('md5').update(filePath).digest('hex');
      
      // Informações do arquivo
      const stat = await fs.promises.stat(filePath);
      const fileSize = stat.size;

      // Determinar se é um range request
      const range = req.headers.range;
      
      // Configurar headers comuns
      const contentType = this.getContentType(filePath);
      res.setHeader('Content-Type', contentType);
      res.setHeader('Accept-Ranges', 'bytes');
      
      // Adicionar headers de cache conforme necessário
      if (options.cacheControl) {
        res.setHeader('Cache-Control', options.cacheControl);
      } else {
        // Por padrão, permitir cache por 1 hora para vídeos
        res.setHeader('Cache-Control', 'public, max-age=3600');
      }

      // Verificar se é um range request
      if (range) {
        // Parse do range request
        const parts = range.replace(/bytes=/, "").split("-");
        const start = parseInt(parts[0], 10);
        const end = parts[1] ? parseInt(parts[1], 10) : fileSize - 1;
        const chunksize = (end - start) + 1;

        // Verificar se o range é válido
        if (start >= fileSize || end >= fileSize) {
          res.status(416).send('Range Not Satisfiable');
          return;
        }

        // Configurar headers para resposta parcial
        res.setHeader('Content-Range', `bytes ${start}-${end}/${fileSize}`);
        res.setHeader('Content-Length', chunksize);
        res.status(206);

        // Tentar usar cache se for um arquivo pequeno e frequentemente acessado
        if (fileSize < 10 * 1024 * 1024 && this.shouldUseCache(fileKey, fileSize)) {
          await this.streamFromCache(res, fileKey, filePath, start, end);
        } else {
          // Stream direto do arquivo
          const fileStream = fs.createReadStream(filePath, { start, end });
          fileStream.pipe(res);
        }
      } else {
        // Resposta completa
        res.setHeader('Content-Length', fileSize);
        res.status(200);
        
        // Para arquivos pequenos, considerar cache
        if (fileSize < 10 * 1024 * 1024 && this.shouldUseCache(fileKey, fileSize)) {
          await this.streamFromCache(res, fileKey, filePath, 0, fileSize - 1);
        } else {
          // Stream direto do arquivo
          const fileStream = fs.createReadStream(filePath);
          fileStream.pipe(res);
        }
      }
    } catch (error) {
      console.error('Erro ao streamar vídeo:', error);
      res.status(500).send('Erro interno ao processar vídeo');
    }
  }

  /**
   * Verifica se deve usar cache para um arquivo
   */
  private shouldUseCache(fileKey: string, fileSize: number): boolean {
    // Se o arquivo já está em cache, use-o
    if (videoCache.has(fileKey)) {
      const cacheEntry = videoCache.get(fileKey)!;
      cacheEntry.lastAccessed = Date.now();
      cacheEntry.hits++;
      return true;
    }

    // Se o arquivo é muito grande ou o cache está cheio, não use cache
    if (fileSize > MAX_CACHE_SIZE * 0.2 || currentCacheSize + fileSize > MAX_CACHE_SIZE) {
      return false;
    }

    // Por padrão, considere colocar em cache
    return true;
  }

  /**
   * Stream a partir do cache ou carrega o arquivo no cache
   */
  private async streamFromCache(
    res: Response, 
    fileKey: string, 
    filePath: string, 
    start: number, 
    end: number
  ): Promise<void> {
    let buffer: Buffer;
    
    // Verificar se o arquivo já está em cache
    if (videoCache.has(fileKey)) {
      const cacheEntry = videoCache.get(fileKey)!;
      buffer = cacheEntry.buffer;
      cacheEntry.lastAccessed = Date.now();
      cacheEntry.hits++;
    } else {
      // Se não estiver em cache, ler o arquivo
      buffer = await fs.promises.readFile(filePath);
      
      // Limpar cache se necessário
      this.cleanupCache();
      
      // Adicionar ao cache
      videoCache.set(fileKey, {
        buffer,
        lastAccessed: Date.now(),
        hits: 1
      });
      
      // Atualizar tamanho do cache
      currentCacheSize += buffer.length;
    }
    
    // Enviar parte do buffer
    const chunk = buffer.slice(start, end + 1);
    res.write(chunk);
    res.end();
  }

  /**
   * Limpa entradas antigas do cache
   */
  private cleanupCache(): void {
    if (currentCacheSize < MAX_CACHE_SIZE * 0.9) {
      return; // Não precisa limpar ainda
    }

    // Ordenar por último acesso e hits
    const entries = Array.from(videoCache.entries())
      .sort((a, b) => {
        // Priorizar manutenção de entradas com mais hits
        const hitsDiff = b[1].hits - a[1].hits;
        if (hitsDiff !== 0) return hitsDiff;
        
        // Se hits são iguais, remover as mais antigas
        return a[1].lastAccessed - b[1].lastAccessed;
      });

    // Remover entradas até liberar 20% do espaço
    let targetSize = MAX_CACHE_SIZE * 0.8;
    for (const [key, entry] of entries) {
      // Não remover entradas recentes ou muito populares
      const isRecent = Date.now() - entry.lastAccessed < MAX_CACHE_AGE / 2;
      const isPopular = entry.hits > 10;
      
      if (!isRecent && !isPopular) {
        videoCache.delete(key);
        currentCacheSize -= entry.buffer.length;
        
        if (currentCacheSize <= targetSize) {
          break;
        }
      }
    }
  }

  /**
   * Retorna o content-type baseado na extensão do arquivo
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
      case '.m4v':
        return 'video/x-m4v';
      case '.avi':
        return 'video/x-msvideo';
      case '.wmv':
        return 'video/x-ms-wmv';
      case '.mpg':
      case '.mpeg':
        return 'video/mpeg';
      default:
        return 'application/octet-stream';
    }
  }
}

// Exportar instância singleton
export const videoStreamService = new VideoStreamService();
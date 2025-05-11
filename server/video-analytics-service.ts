import fs from 'fs';
import path from 'path';
import { promisify } from 'util';

// Estrutura para estatísticas gerais
interface VideoStats {
  views: number;
  completions: number;
  averageWatchTime: number;
  popularSegments: { start: number; end: number; viewCount: number }[];
  shareCount: number;
  downloadCount: number;
}

// Estrutura para registro de visualização
interface ViewRecord {
  videoId: string;
  userId?: string;
  sessionId: string;
  timestamp: number;
  watchTime: number;
  completed: boolean;
  segments: { start: number; end: number }[];
  playbackRate: number;
  device: string;
  quality: string;
}

// Estrutura para registro de evento
interface EventRecord {
  videoId: string;
  userId?: string;
  sessionId: string;
  timestamp: number;
  eventType: 'play' | 'pause' | 'seek' | 'volumeChange' | 'qualityChange' | 'download' | 'share' | 'error';
  eventData: any;
}

/**
 * Serviço para rastreamento e análise de métricas de vídeo
 */
export class VideoAnalyticsService {
  private storagePath: string;
  private viewsCache: Map<string, ViewRecord[]> = new Map();
  private eventsCache: Map<string, EventRecord[]> = new Map();
  
  constructor(storagePath: string = 'data/analytics') {
    this.storagePath = storagePath;
    this.ensureDirectoryExists();
  }
  
  /**
   * Garante que o diretório de armazenamento exista
   */
  private async ensureDirectoryExists(): Promise<void> {
    try {
      await fs.promises.mkdir(this.storagePath, { recursive: true });
    } catch (err) {
      console.error('Erro ao criar diretório de analytics:', err);
    }
  }
  
  /**
   * Registra uma visualização de vídeo
   */
  async recordView(record: Omit<ViewRecord, 'timestamp'>): Promise<void> {
    const videoId = record.videoId;
    const timestamp = Date.now();
    
    try {
      // Obter registros atuais
      let views = this.viewsCache.get(videoId) || [];
      
      // Adicionar novo registro
      views.push({
        ...record,
        timestamp
      });
      
      // Atualizar cache
      this.viewsCache.set(videoId, views);
      
      // Salvar de forma assíncrona
      this.persistData(videoId, 'views');
    } catch (err) {
      console.error('Erro ao registrar visualização:', err);
    }
  }
  
  /**
   * Registra um evento de vídeo
   */
  async recordEvent(record: Omit<EventRecord, 'timestamp'>): Promise<void> {
    const videoId = record.videoId;
    const timestamp = Date.now();
    
    try {
      // Obter eventos atuais
      let events = this.eventsCache.get(videoId) || [];
      
      // Adicionar novo evento
      events.push({
        ...record,
        timestamp
      });
      
      // Atualizar cache
      this.eventsCache.set(videoId, events);
      
      // Salvar de forma assíncrona
      this.persistData(videoId, 'events');
      
      // Atualizar contadores específicos
      if (record.eventType === 'download') {
        this.incrementCounter(videoId, 'downloads');
      } else if (record.eventType === 'share') {
        this.incrementCounter(videoId, 'shares');
      }
    } catch (err) {
      console.error('Erro ao registrar evento:', err);
    }
  }
  
  /**
   * Persiste os dados no sistema de arquivos
   */
  private async persistData(videoId: string, dataType: 'views' | 'events'): Promise<void> {
    try {
      const data = dataType === 'views' 
        ? this.viewsCache.get(videoId) 
        : this.eventsCache.get(videoId);
      
      if (!data || data.length === 0) return;
      
      const filePath = path.join(this.storagePath, `${videoId}_${dataType}.json`);
      await fs.promises.writeFile(filePath, JSON.stringify(data, null, 2));
    } catch (err) {
      console.error(`Erro ao persistir dados de ${dataType}:`, err);
    }
  }
  
  /**
   * Incrementa um contador específico
   */
  private async incrementCounter(videoId: string, counterType: 'views' | 'downloads' | 'shares'): Promise<void> {
    try {
      const counterPath = path.join(this.storagePath, `${videoId}_counters.json`);
      let counters: Record<string, number> = {};
      
      try {
        const data = await fs.promises.readFile(counterPath, 'utf-8');
        counters = JSON.parse(data);
      } catch {
        // Arquivo não existe, usar objeto vazio
      }
      
      // Incrementar contador
      counters[counterType] = (counters[counterType] || 0) + 1;
      
      // Salvar
      await fs.promises.writeFile(counterPath, JSON.stringify(counters));
    } catch (err) {
      console.error('Erro ao incrementar contador:', err);
    }
  }
  
  /**
   * Obtém estatísticas para um vídeo específico
   */
  async getVideoStats(videoId: string): Promise<VideoStats | null> {
    try {
      // Carregar dados se necessário
      await this.loadDataIfNeeded(videoId);
      
      // Obter registros
      const views = this.viewsCache.get(videoId) || [];
      const events = this.eventsCache.get(videoId) || [];
      
      // Calcular estatísticas
      const totalViews = views.length;
      const completions = views.filter(v => v.completed).length;
      const averageWatchTime = totalViews > 0
        ? views.reduce((sum, v) => sum + v.watchTime, 0) / totalViews
        : 0;
      
      // Obter segmentos populares
      const segmentMap = new Map<string, number>();
      for (const view of views) {
        for (const segment of view.segments) {
          const key = `${segment.start}-${segment.end}`;
          segmentMap.set(key, (segmentMap.get(key) || 0) + 1);
        }
      }
      
      // Converter para formato de retorno
      const popularSegments = Array.from(segmentMap.entries())
        .map(([key, count]) => {
          const [start, end] = key.split('-').map(Number);
          return { start, end, viewCount: count };
        })
        .sort((a, b) => b.viewCount - a.viewCount)
        .slice(0, 5);
      
      // Contar compartilhamentos e downloads
      const shareCount = events.filter(e => e.eventType === 'share').length;
      const downloadCount = events.filter(e => e.eventType === 'download').length;
      
      return {
        views: totalViews,
        completions,
        averageWatchTime,
        popularSegments,
        shareCount,
        downloadCount
      };
    } catch (err) {
      console.error('Erro ao obter estatísticas do vídeo:', err);
      return null;
    }
  }
  
  /**
   * Carrega os dados do sistema de arquivos se não estiverem em cache
   */
  private async loadDataIfNeeded(videoId: string): Promise<void> {
    if (!this.viewsCache.has(videoId)) {
      try {
        const viewsPath = path.join(this.storagePath, `${videoId}_views.json`);
        const data = await fs.promises.readFile(viewsPath, 'utf-8');
        this.viewsCache.set(videoId, JSON.parse(data));
      } catch {
        // Arquivo não existe, usar array vazio
        this.viewsCache.set(videoId, []);
      }
    }
    
    if (!this.eventsCache.has(videoId)) {
      try {
        const eventsPath = path.join(this.storagePath, `${videoId}_events.json`);
        const data = await fs.promises.readFile(eventsPath, 'utf-8');
        this.eventsCache.set(videoId, JSON.parse(data));
      } catch {
        // Arquivo não existe, usar array vazio
        this.eventsCache.set(videoId, []);
      }
    }
  }
  
  /**
   * Obtém o número total de visualizações para um vídeo
   */
  async getViewCount(videoId: string): Promise<number> {
    try {
      // Tentar obter do contador
      const counterPath = path.join(this.storagePath, `${videoId}_counters.json`);
      try {
        const data = await fs.promises.readFile(counterPath, 'utf-8');
        const counters = JSON.parse(data);
        return counters.views || 0;
      } catch {
        // Se não existir, calcular a partir dos registros
        await this.loadDataIfNeeded(videoId);
        const views = this.viewsCache.get(videoId) || [];
        return views.length;
      }
    } catch (err) {
      console.error('Erro ao obter contagem de visualizações:', err);
      return 0;
    }
  }
  
  /**
   * Obtém dados para painel de administração/resumo
   */
  async getAnalyticsDashboardData(): Promise<any> {
    try {
      const files = await fs.promises.readdir(this.storagePath);
      const counterFiles = files.filter(f => f.endsWith('_counters.json'));
      
      const videoData = await Promise.all(
        counterFiles.map(async (file) => {
          const videoId = file.replace('_counters.json', '');
          const stats = await this.getVideoStats(videoId);
          return {
            videoId,
            stats
          };
        })
      );
      
      // Ordenar por popularidade (visualizações)
      videoData.sort((a, b) => (b.stats?.views || 0) - (a.stats?.views || 0));
      
      return {
        totalVideos: videoData.length,
        totalViews: videoData.reduce((sum, v) => sum + (v.stats?.views || 0), 0),
        totalCompletions: videoData.reduce((sum, v) => sum + (v.stats?.completions || 0), 0),
        videos: videoData
      };
    } catch (err) {
      console.error('Erro ao obter dados do painel:', err);
      return {
        totalVideos: 0,
        totalViews: 0,
        totalCompletions: 0,
        videos: []
      };
    }
  }
}

// Exportar uma instância singleton
export const videoAnalytics = new VideoAnalyticsService();
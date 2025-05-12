/**
 * Serviço de analytics para vídeos
 * Rastreia visualizações, interações e métricas de desempenho
 */

import fs from 'fs';
import path from 'path';

// Tipos para eventos de analytics
export type VideoEventType = 'play' | 'pause' | 'seek' | 'buffer' | 'error' | 'complete' | 'quality_change';

export interface VideoEvent {
  videoId: string;
  eventType: VideoEventType;
  sessionId?: string;
  userId?: string | number;
  timestamp?: number;
  eventData?: Record<string, any>;
}

export interface VideoView {
  videoId: string;
  sessionId?: string;
  userId?: string | number;
  timestamp?: number;
  watchTime: number;
  completed: boolean;
  segments?: Array<{ start: number; end: number }>;
  playbackRate: number;
  device?: string;
  quality?: string;
}

class VideoAnalyticsService {
  private events: VideoEvent[] = [];
  private views: VideoView[] = [];
  // Estatísticas em memória indexadas por videoId
  private videoStats: Map<string, {
    totalViews: number;
    uniqueViewers: Set<string>;
    totalWatchTime: number;
    completionRate: number;
    completions: number;
    averageWatchTime: number;
    popularSegments: Array<{ start: number; end: number; count: number }>;
    lastUpdated: number;
  }> = new Map();
  
  private readonly FLUSH_INTERVAL = 5 * 60 * 1000; // 5 minutos
  private readonly MAX_EVENTS_BEFORE_FLUSH = 1000;
  private flushTimeout: NodeJS.Timeout | null = null;
  private analyticsDir = path.join(process.cwd(), 'logs', 'analytics');
  
  constructor() {
    this.initializeAnalytics();
  }
  
  /**
   * Inicializa o serviço de analytics
   */
  private async initializeAnalytics() {
    // Garantir que o diretório de analytics existe
    try {
      if (!fs.existsSync(this.analyticsDir)) {
        fs.mkdirSync(this.analyticsDir, { recursive: true });
      }
      
      // Carregar estatísticas anteriores, se existirem
      await this.loadStats();
      
      // Iniciar o timer para flush periódico
      this.scheduleFlush();
    } catch (error) {
      console.error('Erro ao inicializar analytics de vídeo:', error);
    }
  }
  
  /**
   * Registra um evento de vídeo
   */
  recordEvent(event: VideoEvent): void {
    // Adicionar timestamp se não fornecido
    if (!event.timestamp) {
      event.timestamp = Date.now();
    }
    
    // Adicionar à lista de eventos
    this.events.push(event);
    
    // Auto-flush se atingir o limite
    if (this.events.length >= this.MAX_EVENTS_BEFORE_FLUSH) {
      this.flushEvents();
    }
  }
  
  /**
   * Registra uma visualização de vídeo
   */
  recordView(view: VideoView): void {
    // Adicionar timestamp se não fornecido
    if (!view.timestamp) {
      view.timestamp = Date.now();
    }
    
    // Adicionar à lista de visualizações
    this.views.push(view);
    
    // Atualizar estatísticas em memória
    this.updateStats(view);
    
    // Auto-flush se atingir o limite
    if (this.views.length >= this.MAX_EVENTS_BEFORE_FLUSH / 10) {
      this.flushViews();
    }
  }
  
  /**
   * Atualiza métricas para um vídeo específico
   */
  private updateStats(view: VideoView): void {
    const { videoId, sessionId, userId, watchTime, completed, segments } = view;
    const viewerId = userId?.toString() || sessionId || 'anonymous';
    
    // Obter ou criar estatísticas para este vídeo
    if (!this.videoStats.has(videoId)) {
      this.videoStats.set(videoId, {
        totalViews: 0,
        uniqueViewers: new Set<string>(),
        totalWatchTime: 0,
        completionRate: 0,
        completions: 0,
        averageWatchTime: 0,
        popularSegments: [],
        lastUpdated: Date.now()
      });
    }
    
    const stats = this.videoStats.get(videoId)!;
    
    // Incrementar contadores
    stats.totalViews++;
    stats.uniqueViewers.add(viewerId);
    stats.totalWatchTime += watchTime;
    
    if (completed) {
      stats.completions++;
    }
    
    // Recalcular médias
    stats.completionRate = stats.completions / stats.totalViews;
    stats.averageWatchTime = stats.totalWatchTime / stats.totalViews;
    
    // Atualizar segmentos populares
    if (segments && segments.length > 0) {
      for (const segment of segments) {
        const existingSegment = stats.popularSegments.find(
          s => s.start === segment.start && s.end === segment.end
        );
        
        if (existingSegment) {
          existingSegment.count++;
        } else {
          stats.popularSegments.push({
            ...segment,
            count: 1
          });
        }
      }
      
      // Ordenar por contagem
      stats.popularSegments.sort((a, b) => b.count - a.count);
      
      // Limitar a 10 segmentos
      if (stats.popularSegments.length > 10) {
        stats.popularSegments = stats.popularSegments.slice(0, 10);
      }
    }
    
    stats.lastUpdated = Date.now();
  }
  
  /**
   * Agenda o próximo flush de dados
   */
  private scheduleFlush(): void {
    if (this.flushTimeout) {
      clearTimeout(this.flushTimeout);
    }
    
    this.flushTimeout = setTimeout(() => {
      this.flushAll();
      this.scheduleFlush();
    }, this.FLUSH_INTERVAL);
  }
  
  /**
   * Salva todos os dados pendentes
   */
  async flushAll(): Promise<void> {
    try {
      await Promise.all([
        this.flushEvents(),
        this.flushViews(),
        this.flushStats()
      ]);
    } catch (error) {
      console.error('Erro ao persistir analytics de vídeo:', error);
    }
  }
  
  /**
   * Salva eventos em arquivo
   */
  private async flushEvents(): Promise<void> {
    if (this.events.length === 0) return;
    
    try {
      const eventsToSave = [...this.events];
      this.events = [];
      
      const filename = path.join(
        this.analyticsDir,
        `events_${new Date().toISOString().replace(/:/g, '-')}.json`
      );
      
      await fs.promises.writeFile(
        filename,
        JSON.stringify(eventsToSave, null, 2)
      );
    } catch (error) {
      console.error('Erro ao persistir eventos de vídeo:', error);
      // Restaurar eventos não salvos
      this.events = [...this.events];
    }
  }
  
  /**
   * Salva visualizações em arquivo
   */
  private async flushViews(): Promise<void> {
    if (this.views.length === 0) return;
    
    try {
      const viewsToSave = [...this.views];
      this.views = [];
      
      const filename = path.join(
        this.analyticsDir,
        `views_${new Date().toISOString().replace(/:/g, '-')}.json`
      );
      
      await fs.promises.writeFile(
        filename,
        JSON.stringify(viewsToSave, null, 2)
      );
    } catch (error) {
      console.error('Erro ao persistir visualizações de vídeo:', error);
      // Restaurar visualizações não salvas
      this.views = [...this.views];
    }
  }
  
  /**
   * Salva estatísticas agregadas em arquivo
   */
  private async flushStats(): Promise<void> {
    if (this.videoStats.size === 0) return;
    
    try {
      const statsToSave: Record<string, any> = {};
      
      // Converter Map para objeto serializável
      for (const [videoId, stats] of this.videoStats.entries()) {
        statsToSave[videoId] = {
          ...stats,
          uniqueViewers: Array.from(stats.uniqueViewers).length
        };
      }
      
      const filename = path.join(
        this.analyticsDir,
        'video_stats.json'
      );
      
      await fs.promises.writeFile(
        filename,
        JSON.stringify(statsToSave, null, 2)
      );
    } catch (error) {
      console.error('Erro ao persistir estatísticas de vídeo:', error);
    }
  }
  
  /**
   * Carrega estatísticas de arquivo
   */
  private async loadStats(): Promise<void> {
    try {
      const statsFile = path.join(this.analyticsDir, 'video_stats.json');
      
      if (fs.existsSync(statsFile)) {
        const statsData = await fs.promises.readFile(statsFile, 'utf-8');
        const stats = JSON.parse(statsData);
        
        // Converter objeto para Map com Sets
        for (const [videoId, videoStats] of Object.entries(stats)) {
          const uniqueViewersCount = (videoStats as any).uniqueViewers;
          (videoStats as any).uniqueViewers = new Set(
            Array(uniqueViewersCount).fill(null).map((_, i) => `legacy-viewer-${i}`)
          );
          
          this.videoStats.set(videoId, videoStats as any);
        }
      }
    } catch (error) {
      console.error('Erro ao carregar estatísticas de vídeo:', error);
    }
  }
  
  /**
   * Obtém estatísticas para um vídeo específico
   */
  getVideoStats(videoId: string): any {
    const stats = this.videoStats.get(videoId);
    
    if (!stats) {
      return {
        totalViews: 0,
        uniqueViewers: 0,
        totalWatchTime: 0,
        completionRate: 0,
        completions: 0,
        averageWatchTime: 0,
        popularSegments: []
      };
    }
    
    // Converter Set para número para retorno
    return {
      ...stats,
      uniqueViewers: stats.uniqueViewers.size
    };
  }
  
  /**
   * Obtém estatísticas para todos os vídeos
   */
  getAllStats(): Record<string, any> {
    const result: Record<string, any> = {};
    
    for (const [videoId, stats] of this.videoStats.entries()) {
      result[videoId] = {
        ...stats,
        uniqueViewers: stats.uniqueViewers.size
      };
    }
    
    return result;
  }
}

// Exportar instância singleton
export const videoAnalytics = new VideoAnalyticsService();
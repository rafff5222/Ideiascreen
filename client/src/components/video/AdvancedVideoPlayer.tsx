import { useState, useEffect, useRef } from 'react';
import { 
  Play, Pause, Volume2, VolumeX, Maximize, SkipForward, 
  SkipBack, DownloadCloud, Share2, Settings 
} from 'lucide-react';
import { Slider } from '@/components/ui/slider';
import { Button } from '@/components/ui/button';
import { 
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

// Tipos de qualidade de vídeo disponíveis
const QUALITY_OPTIONS = [
  { label: 'Auto', value: 'auto' },
  { label: '1080p', value: '1080p' },
  { label: '720p', value: '720p' },
  { label: '480p', value: '480p' },
  { label: '360p', value: '360p' }
];

// Velocidades de reprodução
const PLAYBACK_RATES = [
  { label: '0.5x', value: 0.5 },
  { label: '0.75x', value: 0.75 },
  { label: 'Normal', value: 1 },
  { label: '1.25x', value: 1.25 },
  { label: '1.5x', value: 1.5 },
  { label: '2x', value: 2 }
];

interface AdvancedVideoPlayerProps {
  src: string;
  title?: string;
  poster?: string;
  autoPlay?: boolean;
  muted?: boolean;
  preload?: 'auto' | 'metadata' | 'none';
  loop?: boolean;
  className?: string;
  onEnded?: () => void;
  onError?: (error: any) => void;
  onPlaybackAnalytics?: (data: {
    playing: boolean;
    currentTime: number;
    duration: number;
    volume: number;
    playbackRate: number;
  }) => void;
}

export default function AdvancedVideoPlayer({
  src,
  title,
  poster,
  autoPlay = false,
  muted = false,
  preload = 'metadata',
  loop = false,
  className,
  onEnded,
  onError,
  onPlaybackAnalytics
}: AdvancedVideoPlayerProps) {
  // Refs
  const videoRef = useRef<HTMLVideoElement>(null);
  const playerRef = useRef<HTMLDivElement>(null);
  
  // Estados de controle
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(muted);
  const [volume, setVolume] = useState(muted ? 0 : 0.8);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [bufferProgress, setBufferProgress] = useState(0);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showControls, setShowControls] = useState(true);
  const [playbackRate, setPlaybackRate] = useState(1);
  const [selectedQuality, setSelectedQuality] = useState('auto');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Timer para esconder controles após inatividade
  const controlsTimerRef = useRef<number | null>(null);
  
  // Formatar tempo em MM:SS
  const formatTime = (time: number): string => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  };
  
  // Resetar o timer para esconder controles
  const resetControlsTimer = () => {
    if (controlsTimerRef.current) {
      window.clearTimeout(controlsTimerRef.current);
    }
    setShowControls(true);
    controlsTimerRef.current = window.setTimeout(() => {
      if (isPlaying) {
        setShowControls(false);
      }
    }, 3000);
  };
  
  // Efeito para inicializar o vídeo
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;
    
    // Funções de evento
    const onVideoPlay = () => setIsPlaying(true);
    const onVideoPause = () => setIsPlaying(false);
    const onVideoLoadedData = () => setIsLoading(false);
    const onVideoVolumeChange = () => {
      if (video.muted) {
        setIsMuted(true);
        setVolume(0);
      } else {
        setIsMuted(false);
        setVolume(video.volume);
      }
    };
    const onVideoTimeUpdate = () => {
      setCurrentTime(video.currentTime);
      // Enviar analytics
      if (onPlaybackAnalytics) {
        onPlaybackAnalytics({
          playing: !video.paused,
          currentTime: video.currentTime,
          duration: video.duration || 0,
          volume: video.volume,
          playbackRate: video.playbackRate
        });
      }
    };
    const onVideoDurationChange = () => {
      setDuration(video.duration || 0);
    };
    const onVideoProgress = () => {
      if (video.buffered.length > 0) {
        const bufferedEnd = video.buffered.end(video.buffered.length - 1);
        const duration = video.duration;
        if (duration > 0) {
          setBufferProgress((bufferedEnd / duration) * 100);
        }
      }
    };
    const onVideoEnded = () => {
      setIsPlaying(false);
      if (onEnded) onEnded();
    };
    const onVideoError = (e: any) => {
      setError('Erro ao reproduzir o vídeo');
      setIsLoading(false);
      if (onError) onError(e);
    };
    
    // Adicionar listeners
    video.addEventListener('play', onVideoPlay);
    video.addEventListener('pause', onVideoPause);
    video.addEventListener('loadeddata', onVideoLoadedData);
    video.addEventListener('volumechange', onVideoVolumeChange);
    video.addEventListener('timeupdate', onVideoTimeUpdate);
    video.addEventListener('durationchange', onVideoDurationChange);
    video.addEventListener('progress', onVideoProgress);
    video.addEventListener('ended', onVideoEnded);
    video.addEventListener('error', onVideoError);
    
    // Configurações iniciais
    video.volume = volume;
    video.muted = isMuted;
    
    // Cleanup
    return () => {
      video.removeEventListener('play', onVideoPlay);
      video.removeEventListener('pause', onVideoPause);
      video.removeEventListener('loadeddata', onVideoLoadedData);
      video.removeEventListener('volumechange', onVideoVolumeChange);
      video.removeEventListener('timeupdate', onVideoTimeUpdate);
      video.removeEventListener('durationchange', onVideoDurationChange);
      video.removeEventListener('progress', onVideoProgress);
      video.removeEventListener('ended', onVideoEnded);
      video.removeEventListener('error', onVideoError);
      
      if (controlsTimerRef.current) {
        window.clearTimeout(controlsTimerRef.current);
      }
    };
  }, []);
  
  // Atualizar src quando mudar
  useEffect(() => {
    if (videoRef.current && src) {
      setIsLoading(true);
      setError(null);
      videoRef.current.load();
    }
  }, [src]);

  // Efeito para controlar o fullscreen
  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };
    
    document.addEventListener('fullscreenchange', handleFullscreenChange);
    return () => {
      document.removeEventListener('fullscreenchange', handleFullscreenChange);
    };
  }, []);
  
  // Atualizar playbackRate quando mudar
  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.playbackRate = playbackRate;
    }
  }, [playbackRate]);
  
  // Funções de controle
  const togglePlay = () => {
    if (!videoRef.current) return;
    
    if (isPlaying) {
      videoRef.current.pause();
    } else {
      videoRef.current.play();
    }
    
    resetControlsTimer();
  };
  
  const toggleMute = () => {
    if (!videoRef.current) return;
    
    const newMutedState = !isMuted;
    setIsMuted(newMutedState);
    videoRef.current.muted = newMutedState;
    
    resetControlsTimer();
  };
  
  const handleVolumeChange = (value: number[]) => {
    if (!videoRef.current) return;
    
    const newVolume = value[0];
    setVolume(newVolume);
    videoRef.current.volume = newVolume;
    
    if (newVolume === 0) {
      setIsMuted(true);
      videoRef.current.muted = true;
    } else if (isMuted) {
      setIsMuted(false);
      videoRef.current.muted = false;
    }
    
    resetControlsTimer();
  };
  
  const handleTimeChange = (value: number[]) => {
    if (!videoRef.current) return;
    
    const newTime = value[0];
    setCurrentTime(newTime);
    videoRef.current.currentTime = newTime;
    
    resetControlsTimer();
  };
  
  const handleSeek = (seconds: number) => {
    if (!videoRef.current) return;
    
    const newTime = Math.max(0, Math.min(videoRef.current.currentTime + seconds, duration));
    videoRef.current.currentTime = newTime;
    
    resetControlsTimer();
  };
  
  const toggleFullscreen = () => {
    if (!playerRef.current) return;
    
    if (!document.fullscreenElement) {
      playerRef.current.requestFullscreen().catch(err => {
        console.error(`Erro ao entrar em tela cheia: ${err.message}`);
      });
    } else {
      document.exitFullscreen();
    }
    
    resetControlsTimer();
  };
  
  const handleQualityChange = (quality: string) => {
    setSelectedQuality(quality);
    // Aqui você implementaria a lógica para trocar a qualidade do vídeo
    // (normalmente mudando a source do vídeo para uma URL diferente)
    resetControlsTimer();
  };
  
  const handlePlaybackRateChange = (rate: number) => {
    if (!videoRef.current) return;
    
    setPlaybackRate(rate);
    videoRef.current.playbackRate = rate;
    
    resetControlsTimer();
  };
  
  const handleDownload = () => {
    if (!src) return;
    
    const a = document.createElement('a');
    a.href = src;
    a.download = title || 'video';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    
    resetControlsTimer();
  };
  
  const handleShare = async () => {
    if (navigator.share && src) {
      try {
        await navigator.share({
          title: title || 'Vídeo compartilhado',
          url: window.location.href
        });
      } catch (err) {
        console.error('Erro ao compartilhar:', err);
      }
    } else {
      // Fallback - copiar para clipboard
      navigator.clipboard.writeText(window.location.href);
      alert('Link copiado para a área de transferência!');
    }
    
    resetControlsTimer();
  };
  
  return (
    <div 
      ref={playerRef}
      className={cn(
        "relative group w-full overflow-hidden rounded-lg bg-black",
        isFullscreen ? "fixed inset-0 z-50" : "aspect-video",
        className
      )}
      onMouseMove={resetControlsTimer}
      onMouseLeave={() => isPlaying && setShowControls(false)}
    >
      {/* Video element */}
      <video
        ref={videoRef}
        className="w-full h-full"
        src={src}
        poster={poster}
        preload={preload}
        autoPlay={autoPlay}
        loop={loop}
        playsInline
        onClick={togglePlay}
      />
      
      {/* Overlay de carregamento */}
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/30">
          <div className="animate-spin w-12 h-12 border-4 border-primary border-t-transparent rounded-full"></div>
        </div>
      )}
      
      {/* Mensagem de erro */}
      {error && (
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/80 text-white p-4">
          <div className="text-red-400 text-xl mb-2">Erro ao reproduzir o vídeo</div>
          <p className="text-center text-sm text-gray-300">{error}</p>
          <button 
            className="mt-4 px-4 py-2 bg-primary rounded-md text-white font-medium"
            onClick={() => {
              setError(null);
              setIsLoading(true);
              if (videoRef.current) {
                videoRef.current.load();
              }
            }}
          >
            Tentar novamente
          </button>
        </div>
      )}
      
      {/* Controles de vídeo */}
      <div 
        className={cn(
          "absolute inset-0 transition-opacity duration-300 flex flex-col",
          showControls ? "opacity-100" : "opacity-0 pointer-events-none",
          isPlaying ? "bg-gradient-to-t from-black/80 to-transparent" : "bg-black/50"
        )}
      >
        {/* Topo - Título */}
        {title && (
          <div className="p-4 flex items-center">
            <h3 className="text-white font-medium truncate">{title}</h3>
          </div>
        )}
        
        {/* Centro - Botão de play */}
        <div className="flex-grow flex items-center justify-center">
          {!isPlaying && (
            <button
              className="w-20 h-20 flex items-center justify-center rounded-full bg-primary/80 hover:bg-primary transition-colors"
              onClick={togglePlay}
            >
              <Play className="w-10 h-10 text-white" />
            </button>
          )}
        </div>
        
        {/* Barra de progresso */}
        <div className="px-4 py-2">
          <div className="h-1 bg-gray-700 rounded-full relative">
            {/* Buffer */}
            <div 
              className="absolute h-full bg-gray-500 rounded-full"
              style={{ width: `${bufferProgress}%` }}
            />
            
            {/* Progresso */}
            <div 
              className="absolute h-full bg-primary rounded-full"
              style={{ width: `${(currentTime / duration) * 100}%` }}
            />
            
            {/* Slider */}
            <Slider
              value={[currentTime]}
              min={0}
              max={duration || 100}
              step={0.1}
              onValueChange={handleTimeChange}
              className="absolute inset-0 h-1 appearance-none opacity-0"
            />
          </div>
          
          {/* Tempo */}
          <div className="flex items-center justify-between mt-1 text-xs text-white/90">
            <span>{formatTime(currentTime)}</span>
            <span>{formatTime(duration)}</span>
          </div>
        </div>
        
        {/* Linha inferior de controles */}
        <div className="px-4 pb-3 flex items-center">
          {/* Play/Pause */}
          <Button 
            size="icon" 
            variant="ghost"
            className="text-white hover:bg-white/10" 
            onClick={togglePlay}
          >
            {isPlaying ? <Pause className="h-5 w-5" /> : <Play className="h-5 w-5" />}
          </Button>
          
          {/* Skip backward */}
          <Tooltip>
            <TooltipTrigger asChild>
              <Button 
                size="icon" 
                variant="ghost" 
                className="text-white hover:bg-white/10"
                onClick={() => handleSeek(-10)}
              >
                <SkipBack className="h-5 w-5" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>-10 segundos</TooltipContent>
          </Tooltip>
          
          {/* Skip forward */}
          <Tooltip>
            <TooltipTrigger asChild>
              <Button 
                size="icon" 
                variant="ghost" 
                className="text-white hover:bg-white/10"
                onClick={() => handleSeek(10)}
              >
                <SkipForward className="h-5 w-5" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>+10 segundos</TooltipContent>
          </Tooltip>
          
          {/* Volume */}
          <div className="relative flex items-center ml-2 group">
            <Button 
              size="icon" 
              variant="ghost" 
              className="text-white hover:bg-white/10" 
              onClick={toggleMute}
            >
              {isMuted || volume === 0 ? <VolumeX className="h-5 w-5" /> : <Volume2 className="h-5 w-5" />}
            </Button>
            
            <div className="hidden md:block w-24 ml-1">
              <Slider
                value={[isMuted ? 0 : volume]}
                min={0}
                max={1}
                step={0.01}
                onValueChange={handleVolumeChange}
              />
            </div>
          </div>
          
          {/* Spacer */}
          <div className="flex-grow" />
          
          {/* Qualidade atual */}
          <Badge variant="outline" className="text-white border-white/20">
            {selectedQuality}
          </Badge>
          
          {/* Download */}
          <Tooltip>
            <TooltipTrigger asChild>
              <Button 
                size="icon" 
                variant="ghost" 
                className="text-white hover:bg-white/10"
                onClick={handleDownload}
              >
                <DownloadCloud className="h-5 w-5" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>Download</TooltipContent>
          </Tooltip>
          
          {/* Compartilhar */}
          <Tooltip>
            <TooltipTrigger asChild>
              <Button 
                size="icon" 
                variant="ghost" 
                className="text-white hover:bg-white/10"
                onClick={handleShare}
              >
                <Share2 className="h-5 w-5" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>Compartilhar</TooltipContent>
          </Tooltip>
          
          {/* Configurações */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button 
                size="icon" 
                variant="ghost" 
                className="text-white hover:bg-white/10"
              >
                <Settings className="h-5 w-5" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Configurações</DropdownMenuLabel>
              
              <DropdownMenuSeparator />
              
              <DropdownMenuLabel className="text-xs text-muted-foreground">Velocidade</DropdownMenuLabel>
              {PLAYBACK_RATES.map((rate) => (
                <DropdownMenuItem 
                  key={rate.value}
                  className={cn(
                    "flex justify-between",
                    playbackRate === rate.value && "bg-secondary"
                  )}
                  onClick={() => handlePlaybackRateChange(rate.value)}
                >
                  {rate.label}
                  {playbackRate === rate.value && (
                    <span className="text-primary">✓</span>
                  )}
                </DropdownMenuItem>
              ))}
              
              <DropdownMenuSeparator />
              
              <DropdownMenuLabel className="text-xs text-muted-foreground">Qualidade</DropdownMenuLabel>
              {QUALITY_OPTIONS.map((quality) => (
                <DropdownMenuItem 
                  key={quality.value}
                  className={cn(
                    "flex justify-between",
                    selectedQuality === quality.value && "bg-secondary"
                  )}
                  onClick={() => handleQualityChange(quality.value)}
                >
                  {quality.label}
                  {selectedQuality === quality.value && (
                    <span className="text-primary">✓</span>
                  )}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
          
          {/* Fullscreen */}
          <Tooltip>
            <TooltipTrigger asChild>
              <Button 
                size="icon" 
                variant="ghost" 
                className="text-white hover:bg-white/10"
                onClick={toggleFullscreen}
              >
                <Maximize className="h-5 w-5" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>Tela cheia</TooltipContent>
          </Tooltip>
        </div>
      </div>
    </div>
  );
}
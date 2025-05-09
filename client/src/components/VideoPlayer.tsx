import React, { useEffect, useState } from 'react';
import { Button } from "@/components/ui/button";
import { Loader2, Download, RefreshCw, AlertCircle, CheckCircle } from 'lucide-react';
import { useToast } from "@/hooks/use-toast";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";

interface VideoPlayerProps {
  videoId: string;
  onPlaybackReady?: () => void;
  autoCheck?: boolean;
  showDownload?: boolean;
}

type VideoState = {
  loading: boolean;
  error: string | null;
  url: string | null;
  downloadUrl: string | null;
  isPlayable: boolean;
  checkingStatus: boolean;
  retryCount: number;
  metadata: {
    duration: number;
    size: number;
  };
};

/**
 * Componente de reprodução de vídeo com verificação de processamento
 * Verifica se o vídeo está completamente processado antes de tentar reproduzir
 */
export default function VideoPlayer({ 
  videoId, 
  onPlaybackReady, 
  autoCheck = true,
  showDownload = true
}: VideoPlayerProps) {
  const [videoState, setVideoState] = useState<VideoState>({
    loading: true,
    error: null,
    url: null,
    downloadUrl: null,
    isPlayable: false,
    checkingStatus: false,
    retryCount: 0,
    metadata: {
      duration: 0,
      size: 0
    }
  });
  
  const { toast } = useToast();
  
  // Função para verificar status do vídeo
  const checkVideoStatus = async () => {
    if (videoState.checkingStatus) return;
    
    setVideoState(prev => ({ ...prev, checkingStatus: true }));
    
    try {
      const response = await fetch(`/video-status/${videoId}`);
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || 'Erro ao verificar status do vídeo');
      }
      
      if (data.isComplete && data.isPlayable) {
        // Vídeo está pronto para ser reproduzido
        setVideoState({
          loading: false,
          error: null,
          url: `/video-stream/${videoId}`,
          downloadUrl: `/download-video/${videoId}`,
          isPlayable: true,
          checkingStatus: false,
          retryCount: 0,
          metadata: {
            duration: data.duration || 0,
            size: data.size || 0
          }
        });
        
        if (onPlaybackReady) {
          onPlaybackReady();
        }
        
        toast({
          title: 'Vídeo pronto!',
          description: 'Seu vídeo foi processado e está pronto para visualização.',
          variant: 'default'
        });
      } else if (data.status === 'completed' && !data.isPlayable) {
        // Vídeo completou processamento mas não está reproduzível
        setVideoState(prev => ({
          ...prev,
          loading: false,
          error: 'O vídeo foi processado, mas não está disponível para reprodução. Tente novamente.',
          checkingStatus: false,
          retryCount: prev.retryCount + 1
        }));
      } else if (data.status === 'failed') {
        // Vídeo falhou no processamento
        setVideoState(prev => ({
          ...prev,
          loading: false,
          error: 'Falha ao processar o vídeo. Tente gerar novamente.',
          checkingStatus: false,
          retryCount: prev.retryCount + 1
        }));
      } else {
        // Vídeo ainda em processamento
        setVideoState(prev => ({
          ...prev,
          loading: true,
          error: null,
          checkingStatus: false,
          retryCount: prev.retryCount + 1
        }));
        
        // Continuar verificando periodicamente
        if (videoState.retryCount < 20) { // Limite de 20 tentativas
          setTimeout(() => checkVideoStatus(), 3000);
        } else {
          setVideoState(prev => ({
            ...prev,
            loading: false,
            error: 'Tempo limite excedido ao verificar o vídeo.',
            checkingStatus: false
          }));
        }
      }
      
    } catch (error: any) {
      console.error('Erro ao verificar vídeo:', error);
      
      setVideoState(prev => ({
        ...prev,
        loading: false,
        error: error.message || 'Erro ao verificar o vídeo',
        checkingStatus: false,
        retryCount: prev.retryCount + 1
      }));
    }
  };
  
  // Formatar tamanho em MB
  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };
  
  // Formatar duração em minutos e segundos
  const formatDuration = (seconds: number): string => {
    if (!seconds) return '00:00';
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };
  
  // Iniciar verificação ao montar o componente se autoCheck estiver ativado
  useEffect(() => {
    if (autoCheck && videoId) {
      checkVideoStatus();
    }
  }, [videoId, autoCheck]);
  
  // Renderizar estados de loading
  if (videoState.loading) {
    return (
      <div className="flex flex-col items-center justify-center p-4 bg-gray-50 rounded-lg border border-gray-200">
        <div className="flex items-center justify-center w-full h-48 bg-gray-100 rounded-md">
          <div className="flex flex-col items-center">
            <Loader2 className="w-12 h-12 text-primary animate-spin mb-2" />
            <p className="text-gray-600 text-sm">Verificando vídeo... (tentativa {videoState.retryCount + 1})</p>
          </div>
        </div>
      </div>
    );
  }
  
  // Renderizar estado de erro
  if (videoState.error) {
    return (
      <div className="flex flex-col space-y-4">
        <Alert variant="destructive" className="mb-4">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Problema ao carregar vídeo</AlertTitle>
          <AlertDescription>{videoState.error}</AlertDescription>
        </Alert>
        
        <Button 
          variant="outline" 
          onClick={checkVideoStatus} 
          disabled={videoState.checkingStatus}
          className="w-full"
        >
          {videoState.checkingStatus ? (
            <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Verificando...</>
          ) : (
            <><RefreshCw className="mr-2 h-4 w-4" /> Verificar novamente</>
          )}
        </Button>
      </div>
    );
  }
  
  // Renderizar o player de vídeo quando estiver pronto
  return (
    <div className="flex flex-col space-y-4">
      {videoState.isPlayable && videoState.url ? (
        <>
          <div className="relative rounded-lg overflow-hidden">
            <video 
              controls 
              width="100%" 
              className="rounded-md"
              preload="metadata"
            >
              <source src={videoState.url} type="video/mp4" />
              Seu navegador não suporta o elemento de vídeo.
            </video>
          </div>
          
          <div className="flex items-center justify-between">
            <div className="text-sm text-gray-600">
              <span>{formatDuration(videoState.metadata.duration)}</span>
              {videoState.metadata.size > 0 && (
                <span className="ml-2">({formatFileSize(videoState.metadata.size)})</span>
              )}
            </div>
            
            {showDownload && videoState.downloadUrl && (
              <Button 
                variant="outline" 
                size="sm" 
                asChild
              >
                <a 
                  href={videoState.downloadUrl} 
                  download
                  className="flex items-center"
                >
                  <Download className="mr-2 h-4 w-4" />
                  Baixar vídeo
                </a>
              </Button>
            )}
          </div>
        </>
      ) : (
        <Alert className="bg-yellow-50 border-yellow-200">
          <AlertCircle className="h-4 w-4 text-yellow-600" />
          <AlertTitle>Vídeo não disponível</AlertTitle>
          <AlertDescription>
            O vídeo ainda não está disponível para visualização.
          </AlertDescription>
        </Alert>
      )}
    </div>
  );
}
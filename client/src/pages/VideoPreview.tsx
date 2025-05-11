import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Loader2, Share2, Download } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import AdvancedVideoPlayer from '@/components/video/AdvancedVideoPlayer';

interface VideoInfo {
  url: string;
  title?: string;
  duration?: number;
  format?: string;
  resolution?: string;
  size?: number;
  createdAt?: string;
}

export default function VideoPreview() {
  const [videoUrl, setVideoUrl] = useState<string>('');
  const [previewUrl, setPreviewUrl] = useState<string>('');
  const [videoInfo, setVideoInfo] = useState<VideoInfo | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false); 
  const [videoTitle, setVideoTitle] = useState<string>('Pré-visualização de Vídeo');
  const [activeTab, setActiveTab] = useState<string>('player');
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  // Verificar se há parâmetro de URL na inicialização
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const urlFromParam = urlParams.get('url');
    const titleParam = urlParams.get('title');
    
    if (urlFromParam) {
      setVideoUrl(urlFromParam);
      setPreviewUrl(urlFromParam);
      
      if (titleParam) {
        setVideoTitle(decodeURIComponent(titleParam));
      }
      
      // Tenta buscar informações do vídeo
      fetchVideoInfo(urlFromParam);
    }
  }, []);

  // Função para buscar informações do vídeo
  const fetchVideoInfo = async (url: string) => {
    if (!url) return;
    
    setIsLoading(true);
    setError(null);
    
    try {
      // Extrair ID do vídeo da URL
      const videoId = url.split('/').pop()?.split('?')[0];
      
      if (!videoId) {
        throw new Error('ID do vídeo não encontrado na URL');
      }
      
      // Buscar informações do vídeo - caso tenhamos um endpoint para isso
      const response = await fetch(`/api/video-status/${videoId}`);
      
      if (!response.ok) {
        // Se não encontrar informações, apenas define informações básicas
        setVideoInfo({
          url,
          title: videoTitle || 'Vídeo sem título',
        });
        return;
      }
      
      const data = await response.json();
      
      if (data.success) {
        setVideoInfo({
          url,
          title: data.video?.name || videoTitle,
          duration: data.video?.duration,
          format: data.video?.format || 'mp4',
          resolution: data.video?.resolution || 'HD',
          size: data.video?.size,
          createdAt: data.video?.createdAt,
        });
      } else {
        throw new Error(data.error || 'Erro ao buscar informações do vídeo');
      }
    } catch (err: any) {
      console.error('Erro ao buscar informações do vídeo:', err);
      // Não definimos como erro fatal, apenas continuamos com as informações básicas
      setVideoInfo({
        url,
        title: videoTitle || 'Vídeo sem título',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handlePreview = () => {
    if (!videoUrl.trim()) {
      toast({
        title: "URL obrigatória",
        description: "Por favor, insira a URL do vídeo para pré-visualizar.",
        variant: "destructive",
      });
      return;
    }

    setPreviewUrl(videoUrl);
    fetchVideoInfo(videoUrl);
    
    // Atualizar a URL no navegador para permitir compartilhamento
    const currentUrl = new URL(window.location.href);
    currentUrl.searchParams.set('url', videoUrl);
    window.history.pushState({}, '', currentUrl.toString());
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setVideoUrl(e.target.value);
  };
  
  // Função para lidar com eventos de analytics
  const handleVideoAnalytics = (data: any) => {
    // Enviar dados para o servidor de analytics
    try {
      fetch('/api/analytics', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          event: 'video_playback',
          videoUrl: previewUrl,
          data
        }),
      });
    } catch (err) {
      console.error('Erro ao enviar dados de analytics:', err);
    }
  };
  
  // Função para compartilhar o vídeo
  const handleShare = async () => {
    try {
      if (navigator.share) {
        await navigator.share({
          title: videoInfo?.title || 'Vídeo compartilhado',
          text: 'Confira este vídeo!',
          url: window.location.href
        });
        
        toast({
          title: "Compartilhado com sucesso",
          description: "O link para o vídeo foi compartilhado.",
        });
      } else {
        // Fallback - copiar para a área de transferência
        await navigator.clipboard.writeText(window.location.href);
        
        toast({
          title: "Link copiado",
          description: "O link foi copiado para a área de transferência.",
        });
      }
    } catch (err) {
      console.error('Erro ao compartilhar:', err);
      toast({
        title: "Erro ao compartilhar",
        description: "Não foi possível compartilhar o vídeo.",
        variant: "destructive",
      });
    }
  };
  
  // Função para download do vídeo
  const handleDownload = () => {
    if (!previewUrl) return;
    
    // Criar um link temporário para download
    const a = document.createElement('a');
    a.href = previewUrl;
    a.download = videoInfo?.title || 'video';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    
    // Registrar o download para analytics
    try {
      fetch('/api/analytics', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          event: 'video_download',
          videoUrl: previewUrl
        }),
      });
    } catch (err) {
      console.error('Erro ao registrar download:', err);
    }
  };

  return (
    <div className="container mx-auto py-8">
      <Card className="w-full">
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle className="text-xl">{videoTitle}</CardTitle>
            {videoInfo && (
              <CardDescription>
                {videoInfo.format && (
                  <Badge variant="outline" className="mr-2">
                    {videoInfo.format.toUpperCase()}
                  </Badge>
                )}
                {videoInfo.resolution && (
                  <Badge variant="outline" className="mr-2">
                    {videoInfo.resolution}
                  </Badge>
                )}
                {videoInfo.duration && (
                  <span className="text-sm text-muted-foreground">
                    {Math.floor(videoInfo.duration / 60)}:{(videoInfo.duration % 60).toString().padStart(2, '0')}
                  </span>
                )}
              </CardDescription>
            )}
          </div>
          
          <div className="flex gap-2">
            <Button 
              variant="outline" 
              size="sm"
              onClick={handleShare}
              disabled={!previewUrl}
            >
              <Share2 className="h-4 w-4 mr-2" />
              Compartilhar
            </Button>
            <Button 
              variant="secondary" 
              size="sm"
              onClick={handleDownload}
              disabled={!previewUrl}
            >
              <Download className="h-4 w-4 mr-2" />
              Download
            </Button>
          </div>
        </CardHeader>
        
        <CardContent>
          <div className="space-y-4">
            <div className="flex space-x-2">
              <Input 
                placeholder="Digite a URL completa do vídeo (ex: /api/video-stream/video_123456.mp4)"
                value={videoUrl}
                onChange={handleInputChange}
                className="flex-1"
              />
              <Button 
                onClick={handlePreview}
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Carregando...
                  </>
                ) : (
                  'Pré-visualizar'
                )}
              </Button>
            </div>

            {error && (
              <div className="rounded-md bg-red-50 p-4 border border-red-200">
                <p className="text-sm text-red-700">{error}</p>
              </div>
            )}

            {previewUrl && (
              <Tabs defaultValue="player" value={activeTab} onValueChange={setActiveTab} className="w-full">
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="player">Player</TabsTrigger>
                  <TabsTrigger value="details">Detalhes Técnicos</TabsTrigger>
                </TabsList>
                
                <TabsContent value="player" className="mt-4">
                  <div className="border rounded-md overflow-hidden bg-black">
                    <AdvancedVideoPlayer 
                      src={previewUrl}
                      title={videoInfo?.title}
                      autoPlay={false}
                      preload="metadata"
                      onPlaybackAnalytics={handleVideoAnalytics}
                      onError={(err) => {
                        console.error('Erro no player:', err);
                        setError('Erro ao reproduzir o vídeo. Verifique se a URL está correta.');
                      }}
                    />
                  </div>
                  
                  {/* SEO e tags OpenGraph para compartilhamento */}
                  {videoInfo && (
                    <>
                      <div style={{ display: 'none' }}>
                        <meta property="og:title" content={videoInfo.title || 'Vídeo'} />
                        <meta property="og:type" content="video.other" />
                        <meta property="og:url" content={window.location.href} />
                        <meta property="og:video" content={previewUrl} />
                        <meta property="og:video:type" content="video/mp4" />
                        {videoInfo.duration && (
                          <meta property="og:video:duration" content={videoInfo.duration.toString()} />
                        )}
                      </div>
                    </>
                  )}
                </TabsContent>
                
                <TabsContent value="details" className="mt-4">
                  <div className="border rounded-md p-4 bg-gray-50 dark:bg-gray-900">
                    <h3 className="text-lg font-semibold mb-2">Informações do Vídeo</h3>
                    
                    <div className="space-y-2">
                      <div className="grid grid-cols-3 gap-4">
                        <div>
                          <p className="text-sm font-medium text-muted-foreground">URL</p>
                          <p className="text-sm break-all">{previewUrl}</p>
                        </div>
                        
                        <div>
                          <p className="text-sm font-medium text-muted-foreground">Formato</p>
                          <p className="text-sm">{videoInfo?.format || 'Desconhecido'}</p>
                        </div>
                        
                        <div>
                          <p className="text-sm font-medium text-muted-foreground">Resolução</p>
                          <p className="text-sm">{videoInfo?.resolution || 'Desconhecida'}</p>
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-3 gap-4">
                        <div>
                          <p className="text-sm font-medium text-muted-foreground">Duração</p>
                          <p className="text-sm">
                            {videoInfo?.duration 
                              ? `${Math.floor(videoInfo.duration / 60)}:${(videoInfo.duration % 60).toString().padStart(2, '0')}`
                              : 'Desconhecida'
                            }
                          </p>
                        </div>
                        
                        <div>
                          <p className="text-sm font-medium text-muted-foreground">Tamanho</p>
                          <p className="text-sm">
                            {videoInfo?.size 
                              ? `${(videoInfo.size / (1024 * 1024)).toFixed(2)} MB`
                              : 'Desconhecido'
                            }
                          </p>
                        </div>
                        
                        <div>
                          <p className="text-sm font-medium text-muted-foreground">Data de Criação</p>
                          <p className="text-sm">
                            {videoInfo?.createdAt 
                              ? new Date(videoInfo.createdAt).toLocaleDateString()
                              : 'Desconhecida'
                            }
                          </p>
                        </div>
                      </div>
                    </div>
                    
                    <div className="mt-4">
                      <h3 className="text-md font-semibold mb-2">Código de Incorporação</h3>
                      <div className="bg-gray-100 dark:bg-gray-800 p-2 rounded-md">
                        <pre className="text-xs overflow-auto whitespace-pre-wrap">
{`<video
  src="${previewUrl}"
  controls
  preload="metadata"
  poster="${videoInfo?.thumbnail || ''}"
  class="w-full max-w-full rounded-md"
  controlsList="nodownload"
>
  Seu navegador não suporta reprodução de vídeo.
</video>`}
                        </pre>
                      </div>
                    </div>
                  </div>
                </TabsContent>
              </Tabs>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
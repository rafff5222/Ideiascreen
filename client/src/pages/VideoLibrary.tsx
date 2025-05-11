import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { RefreshCw, Play, Download, Trash2 } from 'lucide-react';
import { apiRequest } from '@/lib/queryClient';
import { useToast } from '@/hooks/use-toast';

interface VideoFile {
  name: string;
  path: string;
  size: number;
  createdAt: string;
  duration?: number;
}

export default function VideoLibrary() {
  const [videos, setVideos] = useState<VideoFile[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [selectedVideo, setSelectedVideo] = useState<VideoFile | null>(null);
  const { toast } = useToast();

  const loadVideos = async () => {
    setIsLoading(true);
    try {
      const response = await apiRequest('GET', '/api/list-videos');
      const data = await response.json();

      if (data.success) {
        setVideos(data.videos);
      } else {
        toast({
          title: "Erro ao carregar vídeos",
          description: data.error || "Não foi possível obter a lista de vídeos.",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error('Erro ao carregar vídeos:', error);
      toast({
        title: "Erro de comunicação",
        description: "Falha ao se comunicar com o servidor.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadVideos();
  }, []);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString() + ' ' + date.toLocaleTimeString();
  };

  const formatSize = (bytes: number) => {
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(2) + ' KB';
    return (bytes / (1024 * 1024)).toFixed(2) + ' MB';
  };

  const handlePlay = (video: VideoFile) => {
    setSelectedVideo(video);
  };

  const handleDownload = (video: VideoFile) => {
    // Criar um link para download e clicar nele
    const link = document.createElement('a');
    link.href = `/api/video/${video.path}`;
    link.download = video.name;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleDelete = async (video: VideoFile) => {
    if (!confirm(`Tem certeza que deseja excluir o vídeo "${video.name}"?`)) {
      return;
    }

    try {
      const response = await apiRequest('DELETE', `/api/delete-video/${video.path}`);
      const data = await response.json();

      if (data.success) {
        toast({
          title: "Vídeo excluído",
          description: "O vídeo foi excluído com sucesso.",
        });
        // Atualizar a lista de vídeos
        loadVideos();
        // Se o vídeo selecionado foi excluído, limpar a seleção
        if (selectedVideo && selectedVideo.path === video.path) {
          setSelectedVideo(null);
        }
      } else {
        toast({
          title: "Erro ao excluir vídeo",
          description: data.error || "Não foi possível excluir o vídeo.",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error('Erro ao excluir vídeo:', error);
      toast({
        title: "Erro de comunicação",
        description: "Falha ao se comunicar com o servidor.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="container mx-auto py-8">
      <Card className="w-full">
        <CardHeader>
          <div className="flex justify-between items-center">
            <div>
              <CardTitle className="text-2xl">Biblioteca de Vídeos</CardTitle>
              <CardDescription>
                Acesse e gerencie todos os vídeos gerados pela plataforma
              </CardDescription>
            </div>
            <Button variant="outline" onClick={loadVideos} disabled={isLoading}>
              <RefreshCw className={`h-4 w-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
              Atualizar
            </Button>
          </div>
        </CardHeader>
        <CardContent className="p-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Vídeos Disponíveis</h3>
              <div className="border rounded-md overflow-hidden">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Nome</TableHead>
                      <TableHead>Tamanho</TableHead>
                      <TableHead>Data</TableHead>
                      <TableHead>Ações</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {videos.length > 0 ? (
                      videos.map((video) => (
                        <TableRow key={video.path}>
                          <TableCell className="font-medium">{video.name}</TableCell>
                          <TableCell>{formatSize(video.size)}</TableCell>
                          <TableCell>{formatDate(video.createdAt)}</TableCell>
                          <TableCell>
                            <div className="flex space-x-2">
                              <Button variant="ghost" size="icon" onClick={() => handlePlay(video)} title="Reproduzir">
                                <Play className="h-4 w-4" />
                              </Button>
                              <Button variant="ghost" size="icon" onClick={() => handleDownload(video)} title="Baixar">
                                <Download className="h-4 w-4" />
                              </Button>
                              <Button variant="ghost" size="icon" onClick={() => handleDelete(video)} title="Excluir">
                                <Trash2 className="h-4 w-4 text-red-500" />
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))
                    ) : (
                      <TableRow>
                        <TableCell colSpan={4} className="text-center py-4 text-muted-foreground">
                          {isLoading ? 'Carregando vídeos...' : 'Nenhum vídeo encontrado'}
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Visualizador</h3>
              {selectedVideo ? (
                <div className="border rounded-md p-4 bg-black">
                  <video 
                    src={`/api/video/${selectedVideo.path}`} 
                    controls 
                    className="w-full rounded-md max-h-[400px]"
                    controlsList="nodownload"
                  />
                  <div className="mt-3 text-center">
                    <p className="text-sm text-white">{selectedVideo.name}</p>
                    <div className="flex justify-center mt-2 gap-2">
                      <Button size="sm" onClick={() => handleDownload(selectedVideo)}>
                        <Download className="h-4 w-4 mr-2" />
                        Baixar
                      </Button>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="border rounded-md p-6 flex items-center justify-center h-[400px] bg-muted/30">
                  <p className="text-muted-foreground text-center">
                    Selecione um vídeo para visualizar
                    <br />
                    <span className="text-sm">Clique no botão de play em um dos vídeos da lista</span>
                  </p>
                </div>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { apiRequest } from '@/lib/queryClient';
import { Loader2, CheckCircle, AlertCircle, Play, Download } from 'lucide-react';

export default function TestVideoPlayer() {
  const [loading, setLoading] = useState(false);
  const [taskId, setTaskId] = useState<string | null>(null);
  const [status, setStatus] = useState<string | null>(null);
  const [videoUrl, setVideoUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  const generateTestVideo = async () => {
    try {
      setLoading(true);
      setError(null);
      setVideoUrl(null);
      setStatus('Gerando vídeo de teste...');

      const response = await apiRequest('POST', '/api/generate-test-video');
      const data = await response.json();
      
      if (data.success) {
        setTaskId(data.taskId);
        
        // Polling para verificar o status da tarefa
        const intervalId = setInterval(async () => {
          try {
            const statusResponse = await apiRequest('GET', `/api/task-status/${data.taskId}`);
            const statusData = await statusResponse.json();
            
            if (statusData.success) {
              setStatus(statusData.task.message);
              
              if (statusData.task.status === 'completed') {
                clearInterval(intervalId);
                setLoading(false);
                setVideoUrl(`/api/video-stream/${statusData.task.result.videoPath}`);
                toast({
                  title: 'Sucesso!',
                  description: 'Vídeo de teste gerado com sucesso.',
                  variant: 'default',
                });
              } else if (statusData.task.status === 'failed') {
                clearInterval(intervalId);
                setLoading(false);
                setError(statusData.task.error || 'Erro desconhecido ao gerar vídeo');
                toast({
                  title: 'Erro!',
                  description: statusData.task.error || 'Falha ao gerar vídeo de teste.',
                  variant: 'destructive',
                });
              }
            } else {
              throw new Error(statusData.error || 'Erro ao verificar status da tarefa');
            }
          } catch (error: any) {
            console.error('Erro ao verificar status:', error);
          }
        }, 1000);
      } else {
        throw new Error(data.error || 'Erro ao iniciar geração de vídeo');
      }
    } catch (error: any) {
      setLoading(false);
      setError(error.message || 'Erro ao gerar vídeo de teste');
      toast({
        title: 'Erro!',
        description: error.message || 'Falha ao gerar vídeo de teste.',
        variant: 'destructive',
      });
    }
  };

  const handleDownload = () => {
    if (!videoUrl) return;
    
    // Converter de streaming para download
    const downloadUrl = videoUrl.replace('/api/video-stream/', '/api/video-download/');
    
    // Criar um link temporário para download
    const a = document.createElement('a');
    a.href = downloadUrl;
    a.download = 'test-video.mp4';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  return (
    <div className="container mx-auto py-8">
      <Card className="w-full">
        <CardHeader>
          <CardTitle>Gerador de Vídeo de Teste</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col gap-4">
            <p className="text-gray-600">
              Gere um vídeo de teste com imagens coloridas e áudio para verificar a funcionalidade
              de reprodução de vídeo no navegador.
            </p>
            
            <div className="flex justify-center my-4">
              <Button 
                onClick={generateTestVideo} 
                disabled={loading}
                className="px-8"
              >
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Gerando...
                  </>
                ) : (
                  'Gerar Vídeo de Teste'
                )}
              </Button>
            </div>
            
            {status && (
              <div className="bg-gray-100 p-4 rounded-md text-center">
                <p className="font-medium">{status}</p>
              </div>
            )}
            
            {error && (
              <div className="bg-red-50 text-red-600 p-4 rounded-md flex items-center">
                <AlertCircle className="h-5 w-5 mr-2" />
                <p>{error}</p>
              </div>
            )}
            
            {videoUrl && (
              <div className="mt-6">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-semibold text-lg">Vídeo Gerado:</h3>
                  <div className="flex gap-2">
                    <Button size="sm" variant="outline" onClick={handleDownload}>
                      <Download className="h-4 w-4 mr-1" />
                      Baixar
                    </Button>
                  </div>
                </div>
                
                <div className="bg-black rounded-md overflow-hidden">
                  <video 
                    src={videoUrl} 
                    controls 
                    className="w-full max-h-[500px]"
                    controlsList="nodownload"
                  />
                </div>
                
                <div className="mt-4 bg-gray-50 p-4 rounded-md">
                  <h4 className="font-medium mb-2">Informações Técnicas:</h4>
                  <p className="text-sm text-gray-600">URL do vídeo: {videoUrl}</p>
                </div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
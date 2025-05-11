import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { apiRequest } from '@/lib/queryClient';
import { Loader2, Play, Download, CheckCircle2, X } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface VideoResult {
  videoPath: string;
  fileName: string;
  fullPath: string;
}

export default function VideoTest() {
  const [activeTab, setActiveTab] = useState('compatible');
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState<string | null>(null);
  const [taskId, setTaskId] = useState<string | null>(null);
  const [videoResult, setVideoResult] = useState<VideoResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  const handleGenerate = async (type: 'compatible' | 'simple' | 'test') => {
    try {
      setLoading(true);
      setError(null);
      setVideoResult(null);
      setStatus('Iniciando geração de vídeo...');

      let endpoint = '';
      switch (type) {
        case 'compatible':
          endpoint = '/api/generate-compatible-video';
          break;
        case 'simple':
          endpoint = '/api/generate-simple-video';
          break;
        case 'test':
          endpoint = '/api/generate-test-video';
          break;
      }

      const response = await apiRequest('POST', endpoint);
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
                setVideoResult(statusData.task.result);
                toast({
                  title: 'Vídeo gerado com sucesso!',
                  description: `Vídeo ${type} criado e pronto para visualização.`,
                });
              } else if (statusData.task.status === 'failed') {
                clearInterval(intervalId);
                setLoading(false);
                setError(statusData.task.error || `Erro ao gerar vídeo ${type}`);
                toast({
                  title: 'Falha na geração',
                  description: statusData.task.error || `Não foi possível gerar o vídeo ${type}.`,
                  variant: 'destructive',
                });
              }
            }
          } catch (err) {
            console.error('Erro ao verificar status:', err);
          }
        }, 1000);
      } else {
        throw new Error(data.error || 'Erro ao iniciar geração de vídeo');
      }
    } catch (error: any) {
      setLoading(false);
      setError(error.message);
      toast({
        title: 'Erro',
        description: error.message || 'Ocorreu um erro ao gerar o vídeo.',
        variant: 'destructive',
      });
    }
  };

  const handleDownload = () => {
    if (!videoResult) return;
    
    const downloadUrl = `/api/video-download/${videoResult.videoPath}`;
    const a = document.createElement('a');
    a.href = downloadUrl;
    a.download = videoResult.fileName;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  return (
    <div className="container py-8">
      <h1 className="text-3xl font-bold mb-6 text-center">Teste de Compatibilidade de Vídeo</h1>
      
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Diagnóstico de Vídeo</CardTitle>
          <CardDescription>
            Teste diferentes formatos de vídeo para encontrar o que funciona melhor no seu navegador.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-gray-500 mb-4">
            Se você está enfrentando problemas com a reprodução de vídeos (tela preta, somente áudio),
            use esta ferramenta para gerar e testar vídeos em diferentes formatos para solucionar o problema.
          </p>
          
          <Tabs defaultValue="compatible" onValueChange={(v) => setActiveTab(v)}>
            <TabsList className="grid grid-cols-3 mb-6">
              <TabsTrigger value="compatible">Vídeo Compatível</TabsTrigger>
              <TabsTrigger value="simple">Vídeo com Áudio</TabsTrigger>
              <TabsTrigger value="test">Vídeo Completo</TabsTrigger>
            </TabsList>
            
            <TabsContent value="compatible">
              <div className="space-y-4">
                <p>Gera um vídeo super compatível apenas com imagem estática. Recomendado para verificar problemas básicos de compatibilidade.</p>
                <Button 
                  onClick={() => handleGenerate('compatible')} 
                  disabled={loading}
                >
                  {loading && activeTab === 'compatible' ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Gerando...
                    </>
                  ) : (
                    'Gerar Vídeo Compatível'
                  )}
                </Button>
              </div>
            </TabsContent>
            
            <TabsContent value="simple">
              <div className="space-y-4">
                <p>Gera um vídeo com imagem estática e áudio. Útil para testar se o problema está na sincronização de áudio e vídeo.</p>
                <Button 
                  onClick={() => handleGenerate('simple')} 
                  disabled={loading}
                >
                  {loading && activeTab === 'simple' ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Gerando...
                    </>
                  ) : (
                    'Gerar Vídeo com Áudio'
                  )}
                </Button>
              </div>
            </TabsContent>
            
            <TabsContent value="test">
              <div className="space-y-4">
                <p>Gera um vídeo completo com múltiplas imagens e áudio. Este é um teste mais complexo que simula os vídeos reais da aplicação.</p>
                <Button 
                  onClick={() => handleGenerate('test')} 
                  disabled={loading}
                >
                  {loading && activeTab === 'test' ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Gerando...
                    </>
                  ) : (
                    'Gerar Vídeo Completo'
                  )}
                </Button>
              </div>
            </TabsContent>
          </Tabs>
          
          {status && loading && (
            <div className="mt-6 p-4 bg-gray-50 rounded-md">
              <div className="flex items-center">
                <Loader2 className="animate-spin h-4 w-4 mr-2" />
                <p>{status}</p>
              </div>
            </div>
          )}
          
          {error && (
            <div className="mt-6 p-4 bg-red-50 text-red-600 rounded-md flex items-start">
              <X className="h-5 w-5 mr-2 mt-0.5" />
              <div>
                <h3 className="font-semibold">Erro na geração do vídeo</h3>
                <p>{error}</p>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
      
      {videoResult && (
        <Card>
          <CardHeader>
            <div className="flex justify-between items-center">
              <CardTitle>Resultado</CardTitle>
              <Button size="sm" onClick={handleDownload} variant="outline">
                <Download className="mr-2 h-4 w-4" />
                Baixar Vídeo
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="bg-black rounded-lg overflow-hidden mb-4">
              <video 
                src={`/api/video-stream/${videoResult.videoPath}`} 
                controls 
                className="w-full max-h-[500px]"
                autoPlay 
              />
            </div>
            
            <div className="bg-gray-50 p-4 rounded-md">
              <h3 className="font-semibold mb-2">Informações Técnicas</h3>
              <div className="text-sm text-gray-600 space-y-1">
                <p><span className="font-medium">Nome do arquivo:</span> {videoResult.fileName}</p>
                <p><span className="font-medium">URL do vídeo:</span> {`/api/video-stream/${videoResult.videoPath}`}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
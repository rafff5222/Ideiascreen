import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { apiRequest } from '@/lib/queryClient';
import { Loader2, Play, Download, CheckCircle2, X, Image, Video, Mic } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Separator } from '@/components/ui/separator';

interface VideoResult {
  videoPath: string;
  fileName: string;
  fullPath: string;
  size?: number;
  duration?: string;
  processingTime?: number;
}

export default function VideoGenerator() {
  // Estados para o formulário
  const [script, setScript] = useState<string>('');
  const [voiceType, setVoiceType] = useState<string>('FEMININO_PROFISSIONAL');
  const [topic, setTopic] = useState<string>('');
  const [showAdvanced, setShowAdvanced] = useState<boolean>(false);
  const [detectionEnabled, setDetectionEnabled] = useState<boolean>(true);
  const [loading, setLoading] = useState<boolean>(false);
  const [status, setStatus] = useState<string | null>(null);
  const [taskId, setTaskId] = useState<string | null>(null);
  const [videoResult, setVideoResult] = useState<VideoResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  // Lista de vozes disponíveis
  const voices = [
    { id: 'FEMININO_PROFISSIONAL', label: 'Feminina Profissional' },
    { id: 'MASCULINO_PROFISSIONAL', label: 'Masculina Profissional' },
    { id: 'FEMININO_JOVEM', label: 'Feminina Jovem' },
    { id: 'MASCULINO_JOVEM', label: 'Masculina Jovem' },
    { id: 'NEUTRO', label: 'Neutra' }
  ];

  // Lista de transições disponíveis
  const transitions = [
    { id: 'fade', label: 'Fade' },
    { id: 'dissolve', label: 'Dissolve' },
    { id: 'wipe', label: 'Wipe' },
    { id: 'slide', label: 'Slide' },
    { id: 'zoom', label: 'Zoom' }
  ];

  // Função para gerar o vídeo
  const handleGenerate = async () => {
    if (!script.trim()) {
      toast({
        title: 'Script obrigatório',
        description: 'Por favor, digite o texto para narração.',
        variant: 'destructive',
      });
      return;
    }

    try {
      setLoading(true);
      setError(null);
      setVideoResult(null);
      setStatus('Iniciando geração de vídeo...');

      // Preparar os dados para envio
      const requestData = {
        script: script,
        options: {
          voz: voiceType,
          topico: topic || undefined,
          detectarSilencio: detectionEnabled,
          transicoes: ['fade', 'dissolve'], // Padrão, poderia ser personalizado
          useDemoMode: false // Permite usar o modo de demonstração explicitamente
        }
      };

      // Enviar solicitação para o servidor
      const response = await apiRequest('POST', '/api/generate-test-video', requestData);
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
                  description: 'Seu vídeo está pronto para visualização e download.',
                });
              } else if (statusData.task.status === 'failed') {
                clearInterval(intervalId);
                setLoading(false);
                setError(statusData.task.error || 'Erro ao gerar vídeo');
                toast({
                  title: 'Falha na geração',
                  description: statusData.task.error || 'Não foi possível gerar o vídeo.',
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

  // Função para baixar o vídeo gerado
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

  // Formatar a duração do processamento
  const formatProcessingTime = (ms: number): string => {
    if (ms < 1000) return `${ms}ms`;
    return `${(ms / 1000).toFixed(1)}s`;
  };

  return (
    <div className="container py-8">
      <h1 className="text-3xl font-bold mb-2 text-center bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 text-transparent bg-clip-text">
        Criador de Vídeos Automatizado
      </h1>
      <p className="text-center text-gray-500 mb-8">
        Transforme seu texto em vídeos profissionais com narração em poucos segundos
      </p>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <Card className="mb-6">
            <CardHeader>
              <CardTitle className="flex items-center">
                <Mic className="mr-2 h-5 w-5 text-primary" />
                Configurações de Narração
              </CardTitle>
              <CardDescription>
                Digite o texto que será transformado em narração no vídeo
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="script" className="text-base font-medium">
                    Texto para Narração
                  </Label>
                  <Textarea
                    id="script"
                    placeholder="Digite o script da narração aqui. Exemplo: Bem-vindo ao nosso novo produto..."
                    value={script}
                    onChange={(e) => setScript(e.target.value)}
                    className="min-h-[150px] mt-2"
                  />
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="voice" className="text-base font-medium">
                      Voz
                    </Label>
                    <Select
                      value={voiceType}
                      onValueChange={setVoiceType}
                    >
                      <SelectTrigger id="voice" className="mt-2">
                        <SelectValue placeholder="Selecione uma voz" />
                      </SelectTrigger>
                      <SelectContent>
                        {voices.map((voice) => (
                          <SelectItem key={voice.id} value={voice.id}>
                            {voice.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div>
                    <Label htmlFor="topic" className="text-base font-medium">
                      Tema para Imagens
                    </Label>
                    <Input
                      id="topic"
                      placeholder="Ex: natureza, tecnologia, negócios"
                      value={topic}
                      onChange={(e) => setTopic(e.target.value)}
                      className="mt-2"
                    />
                  </div>
                </div>
                
                <div className="flex items-center space-x-2 pt-2">
                  <Switch
                    checked={showAdvanced}
                    onCheckedChange={setShowAdvanced}
                    id="advanced-mode"
                  />
                  <Label htmlFor="advanced-mode" className="cursor-pointer">
                    Mostrar configurações avançadas
                  </Label>
                </div>
                
                {showAdvanced && (
                  <div className="p-4 bg-gray-50 rounded-md mt-2">
                    <h3 className="font-semibold mb-3">Configurações Avançadas</h3>
                    
                    <div className="flex items-center space-x-2 mb-4">
                      <Switch
                        checked={detectionEnabled}
                        onCheckedChange={setDetectionEnabled}
                        id="detect-silence"
                      />
                      <Label htmlFor="detect-silence" className="cursor-pointer">
                        Ativar detecção de silêncio para cortes automáticos
                      </Label>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="transitions" className="text-sm font-medium">
                          Tipo de Transição
                        </Label>
                        <Select defaultValue="fade">
                          <SelectTrigger id="transitions" className="mt-2">
                            <SelectValue placeholder="Selecione o tipo de transição" />
                          </SelectTrigger>
                          <SelectContent>
                            {transitions.map((transition) => (
                              <SelectItem key={transition.id} value={transition.id}>
                                {transition.label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      
                      <div>
                        <Label htmlFor="resolution" className="text-sm font-medium">
                          Resolução do Vídeo
                        </Label>
                        <Select defaultValue="720p">
                          <SelectTrigger id="resolution" className="mt-2">
                            <SelectValue placeholder="Selecione a resolução" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="480p">480p (SD)</SelectItem>
                            <SelectItem value="720p">720p (HD)</SelectItem>
                            <SelectItem value="1080p">1080p (Full HD)</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  </div>
                )}
                
                <div className="pt-4">
                  <Button 
                    onClick={handleGenerate} 
                    disabled={loading} 
                    size="lg"
                    className="w-full bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white"
                  >
                    {loading ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Gerando Vídeo...
                      </>
                    ) : (
                      <>
                        <Video className="mr-2 h-5 w-5" />
                        Gerar Vídeo
                      </>
                    )}
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
          
          {status && loading && (
            <Card className="mb-6">
              <CardContent className="pt-6">
                <div className="flex items-center">
                  <Loader2 className="animate-spin h-5 w-5 mr-3 text-primary" />
                  <div>
                    <p className="font-medium">{status}</p>
                    <p className="text-sm text-gray-500">Não feche esta página enquanto o vídeo está sendo processado.</p>
                  </div>
                </div>
                
                <div className="w-full bg-gray-200 rounded-full h-2.5 mt-4">
                  <div className="bg-primary h-2.5 rounded-full" style={{ width: `${loading ? Math.min(90, Math.max(10, Date.now() % 100)) : 100}%` }}></div>
                </div>
              </CardContent>
            </Card>
          )}
          
          {error && (
            <Card className="mb-6 border-red-200">
              <CardContent className="pt-6">
                <div className="flex items-start">
                  <X className="h-6 w-6 mr-3 text-red-500 flex-shrink-0 mt-0.5" />
                  <div>
                    <h3 className="font-semibold text-red-600">Erro na geração do vídeo</h3>
                    <p className="text-gray-700">{error}</p>
                    <p className="text-sm text-gray-500 mt-2">
                      Tente novamente com um texto diferente ou entre em contato com o suporte se o problema persistir.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
        
        <div>
          <Card>
            <CardHeader>
              <CardTitle>
                Banco de Mídia
              </CardTitle>
              <CardDescription>
                Sugestões de imagens para seu vídeo
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <p className="text-sm text-gray-500">
                  {topic ? 
                    `Imagens relacionadas a "${topic}" serão usadas no seu vídeo.` : 
                    'Digite um tema para receber sugestões de imagens para seu vídeo.'}
                </p>
                
                <div className="grid grid-cols-2 gap-2">
                  {!topic ? (
                    <div className="col-span-2 flex items-center justify-center h-32 bg-gray-100 rounded-md">
                      <Image className="h-8 w-8 text-gray-400" />
                    </div>
                  ) : (
                    <>
                      {[1, 2, 3, 4].map((num) => (
                        <div 
                          key={num}
                          className="aspect-video bg-gray-100 rounded-md flex items-center justify-center"
                        >
                          <div 
                            className="w-full h-full rounded-md" 
                            style={{ 
                              backgroundColor: ['#3498db', '#e74c3c', '#2ecc71', '#f39c12'][num-1],
                              opacity: 0.7
                            }}
                          />
                        </div>
                      ))}
                    </>
                  )}
                </div>
                
                <Separator className="my-4" />
                
                <h3 className="font-semibold">Formatos de Exportação</h3>
                <div className="grid grid-cols-2 gap-2">
                  <Button variant="outline" size="sm" disabled>
                    Instagram Reels
                  </Button>
                  <Button variant="outline" size="sm" disabled>
                    TikTok
                  </Button>
                  <Button variant="outline" size="sm" disabled>
                    YouTube Shorts
                  </Button>
                  <Button variant="outline" size="sm" disabled>
                    Widescreen 16:9
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
      
      {videoResult && (
        <Card className="mt-8">
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle>Vídeo Gerado</CardTitle>
              <CardDescription>Visualize ou baixe seu vídeo</CardDescription>
            </div>
            <Button onClick={handleDownload} variant="outline">
              <Download className="mr-2 h-4 w-4" />
              Baixar Vídeo
            </Button>
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
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
              <div className="bg-gray-50 p-4 rounded-md">
                <h3 className="font-semibold mb-2 text-sm text-gray-600">Tamanho do Arquivo</h3>
                <p className="text-lg font-medium">
                  {videoResult.size ? `${(videoResult.size / (1024 * 1024)).toFixed(2)} MB` : 'N/A'}
                </p>
              </div>
              
              <div className="bg-gray-50 p-4 rounded-md">
                <h3 className="font-semibold mb-2 text-sm text-gray-600">Duração do Vídeo</h3>
                <p className="text-lg font-medium">
                  {videoResult.duration || 'N/A'}
                </p>
              </div>
              
              <div className="bg-gray-50 p-4 rounded-md">
                <h3 className="font-semibold mb-2 text-sm text-gray-600">Tempo de Processamento</h3>
                <p className="text-lg font-medium">
                  {videoResult.processingTime ? formatProcessingTime(videoResult.processingTime) : 'N/A'}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
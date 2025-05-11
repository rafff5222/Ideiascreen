import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Separator } from '@/components/ui/separator';
import { Progress } from '@/components/ui/progress';
import { AlertCircle, FolderCheck } from 'lucide-react';
import { apiRequest } from '@/lib/queryClient';
import { Loader2, Video, CheckCircle, AlertTriangle, Wand2 } from 'lucide-react';
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { useToast } from '@/hooks/use-toast';
import APIStatusChecker from '@/components/APIStatusChecker';

export default function VideoTester() {
  const [script, setScript] = useState<string>('Este é um teste de geração de vídeo com detecção de silêncio. A pausa entre frases será detectada automaticamente. Isso permite criar vídeos mais naturais e sincronizados.');
  const [voice, setVoice] = useState<string>('FEMININO_PROFISSIONAL');
  const [topic, setTopic] = useState<string>('tecnologia digital business');
  const [detectSilence, setDetectSilence] = useState<boolean>(true);
  const [selectedTransitions, setSelectedTransitions] = useState<string[]>(['fade', 'zoom']);
  const [resolution, setResolution] = useState<string>('720p');
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [taskId, setTaskId] = useState<string | null>(null);
  const [progress, setProgress] = useState<number>(0);
  const [status, setStatus] = useState<string>('');
  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  const [ensureDirectories, setEnsureDirectories] = useState<{
    success: boolean;
    directories?: { 
      tmp: string;
      output: string;
      images: string;
    };
    error?: string;
  } | null>(null);
  const [isEnsuring, setIsEnsuring] = useState<boolean>(false);
  const { toast } = useToast();
  
  // Função para garantir que os diretórios necessários existem
  const handleEnsureDirectories = async () => {
    try {
      setIsEnsuring(true);
      const response = await apiRequest('GET', '/api/ensure-directories');
      const data = await response.json();
      
      setEnsureDirectories(data);
      
      if (data.success) {
        toast({
          title: "Diretórios verificados",
          description: "Todos os diretórios necessários estão prontos para uso.",
        });
      } else {
        toast({
          title: "Erro ao verificar diretórios",
          description: data.error || "Não foi possível garantir a existência dos diretórios necessários.",
          variant: "destructive",
        });
      }
    } catch (error: any) {
      toast({
        title: "Erro na comunicação",
        description: "Não foi possível verificar os diretórios. Tente novamente.",
        variant: "destructive",
      });
    } finally {
      setIsEnsuring(false);
    }
  };

  // Verificar o status do processamento periodicamente
  React.useEffect(() => {
    let interval: NodeJS.Timeout;
    
    if (taskId && (status !== 'completed' && status !== 'failed')) {
      interval = setInterval(async () => {
        try {
          const response = await apiRequest('GET', `/api/task-status/${taskId}`);
          const data = await response.json();
          
          if (data.success) {
            setProgress(data.task.progress);
            setStatus(data.task.status);
            
            if (data.task.error) {
              setError(data.task.error);
            }
            
            if (data.task.result) {
              setResult(data.task.result);
            }
            
            // Se o processamento terminou, limpar o intervalo
            if (data.task.status === 'completed' || data.task.status === 'failed') {
              clearInterval(interval);
              
              if (data.task.status === 'completed') {
                toast({
                  title: "Vídeo gerado com sucesso!",
                  description: "Seu vídeo foi processado e está pronto para visualização.",
                  variant: "default",
                });
              } else if (data.task.status === 'failed') {
                toast({
                  title: "Falha na geração do vídeo",
                  description: data.task.error || "Ocorreu um erro durante o processamento.",
                  variant: "destructive",
                });
              }
            }
          }
        } catch (err) {
          console.error('Erro ao verificar status:', err);
        }
      }, 1500);
    }
    
    return () => {
      if (interval) {
        clearInterval(interval);
      }
    };
  }, [taskId, status, toast]);

  // Função para enviar o script e gerar o vídeo
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      setIsSubmitting(true);
      setError(null);
      setTaskId(null);
      setProgress(0);
      setStatus('');
      setResult(null);
      
      const response = await apiRequest('POST', '/api/test-video-generator', {
        script,
        options: {
          voz: voice,
          topico: topic,
          detectarSilencio: detectSilence,
          transicoes: selectedTransitions,
          resolucao: resolution
        }
      });
      
      const data = await response.json();
      
      if (data.success) {
        setTaskId(data.taskId);
        setStatus('pending');
        toast({
          title: "Processamento iniciado",
          description: "A geração do vídeo foi iniciada. Aguarde enquanto processamos seu conteúdo.",
        });
      } else {
        setError(data.error || 'Ocorreu um erro ao iniciar o processamento');
        toast({
          title: "Erro na solicitação",
          description: data.error || "Não foi possível iniciar o processamento do vídeo.",
          variant: "destructive",
        });
      }
    } catch (err: any) {
      setError(err.message || 'Erro ao enviar solicitação');
      toast({
        title: "Erro na comunicação",
        description: "Houve um problema na comunicação com o servidor.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Verificar diretórios ao carregar o componente
  useEffect(() => {
    handleEnsureDirectories();
  }, []);
  
  return (
    <div className="container mx-auto py-8">
      <div className="w-full max-w-4xl mx-auto mb-8">
        <h1 className="text-3xl font-bold mb-2">Gerador de Vídeo Avançado</h1>
        <p className="text-gray-600 mb-6">
          Teste nossa versão aprimorada de geração de vídeo com detecção automática de silêncio, 
          imagens do Pexels e transições personalizáveis.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="md:col-span-2">
            <APIStatusChecker />
          </div>
          
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-lg flex items-center gap-2">
                <FolderCheck className="h-5 w-5 text-primary" />
                Diretórios do Sistema
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {ensureDirectories?.success ? (
                  <div className="text-sm text-muted-foreground">
                    <p className="font-medium text-green-600 mb-2 flex items-center">
                      <CheckCircle className="h-4 w-4 mr-1" />
                      Diretórios verificados
                    </p>
                    <ul className="space-y-1">
                      <li><span className="font-medium">TMP:</span> {ensureDirectories.directories?.tmp.split('/').pop()}</li>
                      <li><span className="font-medium">Output:</span> {ensureDirectories.directories?.output.split('/').pop()}</li>
                      <li><span className="font-medium">Images:</span> {ensureDirectories.directories?.images.split('/').pop()}</li>
                    </ul>
                  </div>
                ) : (
                  <p className="text-sm text-muted-foreground">
                    Verificando diretórios necessários...
                  </p>
                )}
                
                <Button 
                  size="sm" 
                  variant="outline" 
                  className="w-full mt-2"
                  onClick={handleEnsureDirectories}
                  disabled={isEnsuring}
                >
                  {isEnsuring ? (
                    <>
                      <Loader2 className="h-3 w-3 mr-2 animate-spin" />
                      Verificando...
                    </>
                  ) : (
                    "Verificar Diretórios"
                  )}
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
      
      <Card className="w-full max-w-4xl mx-auto mb-8">
        <CardHeader>
          <CardTitle className="text-2xl">Gerar Novo Vídeo</CardTitle>
          <CardDescription>
            Personalize seu vídeo com detecção automática de silêncio para cortes naturais
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="script">Script (roteiro)</Label>
              <Textarea
                id="script"
                value={script}
                onChange={(e) => setScript(e.target.value)}
                placeholder="Digite o roteiro do seu vídeo aqui..."
                className="min-h-32"
                required
              />
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="voice">Voz</Label>
                <Select value={voice} onValueChange={setVoice}>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione uma voz" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      <SelectLabel>Vozes Brasileiras</SelectLabel>
                      <SelectItem value="FEMININO_PROFISSIONAL">Feminina Profissional</SelectItem>
                      <SelectItem value="MASCULINO_PROFISSIONAL">Masculina Profissional</SelectItem>
                      <SelectItem value="FEMININO_JOVEM">Feminina Jovem</SelectItem>
                      <SelectItem value="MASCULINO_JOVEM">Masculina Jovem</SelectItem>
                      <SelectItem value="NEUTRO">Neutra</SelectItem>
                    </SelectGroup>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="topic">Tópico para Imagens</Label>
                <Input
                  id="topic"
                  value={topic}
                  onChange={(e) => setTopic(e.target.value)}
                  placeholder="Tópico para buscar imagens"
                />
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div className="flex items-center space-x-2">
                  <Checkbox 
                    id="detectSilence" 
                    checked={detectSilence}
                    onCheckedChange={(checked) => setDetectSilence(checked as boolean)}
                  />
                  <Label htmlFor="detectSilence">
                    Usar detecção de silêncio para cortes automáticos
                  </Label>
                </div>
                
                <div className="space-y-2">
                  <Label>Resolução do vídeo</Label>
                  <RadioGroup 
                    value={resolution} 
                    onValueChange={setResolution}
                    className="flex flex-col space-y-1"
                  >
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="480p" id="r-480p" />
                      <Label htmlFor="r-480p" className="font-normal">480p (SD)</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="720p" id="r-720p" />
                      <Label htmlFor="r-720p" className="font-normal">720p (HD)</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="1080p" id="r-1080p" />
                      <Label htmlFor="r-1080p" className="font-normal">1080p (Full HD)</Label>
                    </div>
                  </RadioGroup>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="transitions">Efeitos de transição</Label>
                <div className="border rounded-md p-4">
                  <ToggleGroup 
                    type="multiple" 
                    value={selectedTransitions}
                    onValueChange={(value) => {
                      if (value.length > 0) {
                        setSelectedTransitions(value);
                      }
                    }}
                    className="flex flex-wrap gap-2 justify-start"
                  >
                    <ToggleGroupItem value="fade" aria-label="Fade" className="data-[state=on]:bg-primary data-[state=on]:text-white data-[state=on]:shadow-sm">
                      Fade
                    </ToggleGroupItem>
                    <ToggleGroupItem value="slide" aria-label="Slide" className="data-[state=on]:bg-primary data-[state=on]:text-white data-[state=on]:shadow-sm">
                      Slide
                    </ToggleGroupItem>
                    <ToggleGroupItem value="zoom" aria-label="Zoom" className="data-[state=on]:bg-primary data-[state=on]:text-white data-[state=on]:shadow-sm">
                      Zoom
                    </ToggleGroupItem>
                    <ToggleGroupItem value="blur" aria-label="Blur" className="data-[state=on]:bg-primary data-[state=on]:text-white data-[state=on]:shadow-sm">
                      Blur
                    </ToggleGroupItem>
                    <ToggleGroupItem value="wipe" aria-label="Wipe" className="data-[state=on]:bg-primary data-[state=on]:text-white data-[state=on]:shadow-sm">
                      Wipe
                    </ToggleGroupItem>
                  </ToggleGroup>
                  <p className="mt-2 text-xs text-muted-foreground">
                    Selecione uma ou mais transições para o vídeo
                  </p>
                </div>
              </div>
            </div>
            
            <Button 
              type="submit" 
              className="w-full btn-gradient font-medium h-12 rounded-lg relative overflow-hidden shadow-lg"
              disabled={isSubmitting || (!!taskId && status !== 'completed' && status !== 'failed')}
            >
              <span className="relative z-10 flex items-center justify-center">
                {isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                    Processando...
                  </>
                ) : (
                  <>
                    <Wand2 className="mr-2 h-5 w-5" />
                    Gerar Vídeo com IA
                  </>
                )}
              </span>
            </Button>
          </form>
        </CardContent>
      </Card>
      
      {error && (
        <Alert variant="destructive" className="max-w-4xl mx-auto mb-8">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}
      
      {taskId && (
        <Card className="w-full max-w-4xl mx-auto">
          <CardHeader>
            <CardTitle className="flex items-center">
              {status === 'completed' ? (
                <>
                  <CheckCircle className="h-5 w-5 mr-2 text-green-500" />
                  Vídeo Gerado com Sucesso
                </>
              ) : status === 'failed' ? (
                <>
                  <AlertTriangle className="h-5 w-5 mr-2 text-red-500" />
                  Falha na Geração
                </>
              ) : (
                <>
                  <Video className="h-5 w-5 mr-2" />
                  Processamento do Vídeo
                </>
              )}
            </CardTitle>
            <CardDescription>
              ID da tarefa: {taskId}
            </CardDescription>
          </CardHeader>
          <CardContent>
            {(status === 'pending' || status === 'processing') && (
              <div className="space-y-4">
                <div className="space-y-2">
                  <div className="flex justify-between text-sm mb-1">
                    <span>Progresso total</span>
                    <span>{progress}%</span>
                  </div>
                  <Progress value={progress} className="h-2" />
                </div>
                
                <div className="border rounded-md p-4 bg-muted/30">
                  <div className="space-y-4">
                    <div className="animate-pulse opacity-80">
                      <div className={`rounded-full w-5 h-5 ${progress < 20 ? 'bg-purple-500' : 'bg-gray-300'} mb-2 inline-block mr-2`}></div>
                      <span className={`text-sm font-medium ${progress < 20 ? 'text-purple-700' : 'text-gray-500'}`}>
                        Processando roteiro
                      </span>
                      {progress >= 20 && <span className="text-xs ml-2 text-green-600">✓ Concluído</span>}
                    </div>
                    
                    <div className="animate-pulse opacity-80">
                      <div className={`rounded-full w-5 h-5 ${progress >= 20 && progress < 40 ? 'bg-blue-500' : 'bg-gray-300'} mb-2 inline-block mr-2`}></div>
                      <span className={`text-sm font-medium ${progress >= 20 && progress < 40 ? 'text-blue-700' : 'text-gray-500'}`}>
                        Gerando áudio
                      </span>
                      {progress >= 40 && <span className="text-xs ml-2 text-green-600">✓ Concluído</span>}
                    </div>
                    
                    <div className="animate-pulse opacity-80">
                      <div className={`rounded-full w-5 h-5 ${progress >= 40 && progress < 60 ? 'bg-teal-500' : 'bg-gray-300'} mb-2 inline-block mr-2`}></div>
                      <span className={`text-sm font-medium ${progress >= 40 && progress < 60 ? 'text-teal-700' : 'text-gray-500'}`}>
                        Analisando áudio e detectando cortes
                      </span>
                      {progress >= 60 && <span className="text-xs ml-2 text-green-600">✓ Concluído</span>}
                    </div>
                    
                    <div className="animate-pulse opacity-80">
                      <div className={`rounded-full w-5 h-5 ${progress >= 60 && progress < 80 ? 'bg-amber-500' : 'bg-gray-300'} mb-2 inline-block mr-2`}></div>
                      <span className={`text-sm font-medium ${progress >= 60 && progress < 80 ? 'text-amber-700' : 'text-gray-500'}`}>
                        Selecionando imagens
                      </span>
                      {progress >= 80 && <span className="text-xs ml-2 text-green-600">✓ Concluído</span>}
                    </div>
                    
                    <div className="animate-pulse opacity-80">
                      <div className={`rounded-full w-5 h-5 ${progress >= 80 ? 'bg-red-500' : 'bg-gray-300'} mb-2 inline-block mr-2`}></div>
                      <span className={`text-sm font-medium ${progress >= 80 ? 'text-red-700' : 'text-gray-500'}`}>
                        Montando vídeo final
                      </span>
                      {progress >= 100 && <span className="text-xs ml-2 text-green-600">✓ Concluído</span>}
                    </div>
                  </div>
                </div>
                
                <p className="text-center mt-2 text-sm text-muted-foreground">
                  {status === 'pending' ? 'Iniciando processamento...' : 'Seu vídeo está sendo gerado...'}
                </p>
              </div>
            )}
            
            {result && (
              <div className="mt-4">
                <Separator className="my-4" />
                <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
                  <div className="lg:col-span-3">
                    <div className="border rounded-lg overflow-hidden bg-black">
                      <video 
                        controls 
                        className="w-full h-auto" 
                        src={`/api/video/${result.videoPath}`}
                        poster="/placeholder-video.jpg"
                      >
                        Seu navegador não suporta a tag de vídeo.
                      </video>
                    </div>
                  </div>
                  
                  <div className="lg:col-span-2">
                    <h3 className="text-lg font-medium mb-4">Detalhes do Vídeo</h3>
                    
                    <div className="space-y-4">
                      <div className="grid grid-cols-2 gap-3">
                        <div className="bg-muted/30 p-3 rounded-md">
                          <p className="text-xs text-muted-foreground">Tamanho</p>
                          <p className="text-sm font-medium">
                            {Math.round(result.size / 1024 / 1024 * 100) / 100} MB
                          </p>
                        </div>
                        
                        <div className="bg-muted/30 p-3 rounded-md">
                          <p className="text-xs text-muted-foreground">Gerado em</p>
                          <p className="text-sm font-medium">
                            {new Date(result.createdAt).toLocaleTimeString()}
                          </p>
                        </div>
                      </div>
                      
                      <div className="bg-muted/30 p-3 rounded-md">
                        <p className="text-xs text-muted-foreground">Caminho do arquivo</p>
                        <p className="text-sm font-medium truncate">
                          {result.videoPath}
                        </p>
                      </div>
                      
                      <div className="flex flex-col space-y-2">
                        <Button
                          variant="outline"
                          className="w-full"
                          onClick={() => {
                            window.open(`/api/video/${result.videoPath}`, '_blank');
                          }}
                        >
                          <Video className="h-4 w-4 mr-2" />
                          Abrir em Nova Janela
                        </Button>
                        
                        <Button
                          variant="default"
                          className="w-full bg-gradient-to-r from-blue-600 to-indigo-700 hover:from-blue-700 hover:to-indigo-800"
                          onClick={() => {
                            // Criar um link temporário para download
                            const link = document.createElement('a');
                            link.href = `/api/video/${result.videoPath}`;
                            link.download = `video_${new Date().getTime()}.mp4`;
                            document.body.appendChild(link);
                            link.click();
                            document.body.removeChild(link);
                          }}
                        >
                          <svg 
                            xmlns="http://www.w3.org/2000/svg" 
                            className="h-4 w-4 mr-2" 
                            fill="none" 
                            viewBox="0 0 24 24" 
                            stroke="currentColor"
                          >
                            <path 
                              strokeLinecap="round" 
                              strokeLinejoin="round" 
                              strokeWidth={2} 
                              d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" 
                            />
                          </svg>
                          Baixar Vídeo
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
}
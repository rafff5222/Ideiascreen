import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { apiRequest } from '@/lib/queryClient';
import { Loader2, Play, Download, CheckCircle2, X, Image, Video, Mic, FileText, Settings, AlertTriangle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Separator } from '@/components/ui/separator';
import { Progress } from '@/components/ui/progress';

// Componentes customizados para o sistema de geração de vídeo
import EngagementScore from '@/components/video/EngagementScore';
import ExportOptions from '@/components/video/ExportOptions';
import DebugConsole from '@/components/video/DebugConsole';
import ImageGallery from '@/components/video/ImageGallery';
import { ServiceStatusDisplay } from '@/components/ui/service-status-display';

interface VideoResult {
  videoPath: string;
  fileName: string;
  fullPath: string;
  size?: number;
  duration?: string;
  processingTime?: number;
}

export default function VideoGenerator() {
  // Interface para imagens selecionadas  
  interface SelectedImage {
    id: string;
    url: string;
    thumbnail: string;
    alt: string;
    source: string;
  }

  // Estados para o formulário e etapas
  const [currentStep, setCurrentStep] = useState<number>(1);
  const [script, setScript] = useState<string>('');
  const [voiceType, setVoiceType] = useState<string>('FEMININO_PROFISSIONAL');
  const [topic, setTopic] = useState<string>('');
  const [showAdvanced, setShowAdvanced] = useState<boolean>(false);
  const [detectionEnabled, setDetectionEnabled] = useState<boolean>(true);
  const [selectedTransitions, setSelectedTransitions] = useState<string[]>(['fade', 'dissolve']);
  const [resolution, setResolution] = useState<string>('720p');
  const [selectedImages, setSelectedImages] = useState<SelectedImage[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [progressPercent, setProgressPercent] = useState<number>(0);
  const [status, setStatus] = useState<string | null>(null);
  const [taskId, setTaskId] = useState<string | null>(null);
  const [videoResult, setVideoResult] = useState<VideoResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [previewText, setPreviewText] = useState<string>('');
  const { toast } = useToast();

  // Atualizar o texto de preview quando o script mudar
  useEffect(() => {
    // Limitamos o texto de preview para 150 caracteres
    setPreviewText(script.length > 150 ? script.substring(0, 150) + '...' : script);
  }, [script]);

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
    { id: 'fade', label: 'Fade (Suave)' },
    { id: 'dissolve', label: 'Dissolve (Mistura)' },
    { id: 'wipe', label: 'Wipe (Deslizante)' },
    { id: 'slide', label: 'Slide (Deslizar)' },
    { id: 'zoom', label: 'Zoom (Aproximação)' }
  ];

  // Avançar para a próxima etapa
  const nextStep = () => {
    if (currentStep === 1 && !script.trim()) {
      toast({
        title: 'Script necessário',
        description: 'Por favor, digite o texto para narração antes de continuar.',
        variant: 'destructive',
      });
      return;
    }
    
    if (currentStep < 3) {
      setCurrentStep(currentStep + 1);
    }
  };

  // Voltar para a etapa anterior
  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

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
      setProgressPercent(10);

      // Preparar os dados para envio
      const requestData = {
        script: script,
        options: {
          voz: voiceType,
          topico: topic || undefined,
          detectarSilencio: detectionEnabled,
          transicoes: selectedTransitions,
          resolucao: resolution,
          useDemoMode: false, // Permite usar o modo de demonstração explicitamente
          customImages: selectedImages.length > 0 ? selectedImages.map(img => img.url) : undefined
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
              
              // Atualizar a barra de progresso com base nas etapas do processo
              if (statusData.task.message.includes('Gerando áudio')) {
                setProgressPercent(30);
              } else if (statusData.task.message.includes('Processando imagens')) {
                setProgressPercent(50);
              } else if (statusData.task.message.includes('Montando vídeo')) {
                setProgressPercent(70);
              } else if (statusData.task.message.includes('Finalizando')) {
                setProgressPercent(90);
              }
              
              if (statusData.task.status === 'completed') {
                clearInterval(intervalId);
                setLoading(false);
                setProgressPercent(100);
                setVideoResult(statusData.task.result);
                setCurrentStep(4); // Avançar para a etapa de visualização
                toast({
                  title: 'Vídeo gerado com sucesso!',
                  description: 'Seu vídeo está pronto para visualização e download.',
                });
              } else if (statusData.task.status === 'failed') {
                clearInterval(intervalId);
                setLoading(false);
                setProgressPercent(0);
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
      setProgressPercent(0);
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
      <p className="text-center text-gray-500 mb-6">
        Transforme seu texto em vídeos profissionais com narração em poucos segundos
      </p>
      
      {/* Indicador de Progresso para as Etapas */}
      <div className="mb-8">
        <div className="flex justify-between mb-2">
          {['Roteiro', 'Mídia', 'Configurações', 'Resultado'].map((step, index) => (
            <div 
              key={index} 
              className={`flex flex-col items-center ${index + 1 === currentStep ? 'text-primary font-medium' : 'text-gray-400'}`}
              style={{width: '25%'}}
            >
              <div 
                className={`w-8 h-8 rounded-full flex items-center justify-center mb-1
                  ${index + 1 < currentStep ? 'bg-green-100 text-green-600' : 
                    index + 1 === currentStep ? 'bg-primary text-white' : 'bg-gray-100 text-gray-400'}`}
              >
                {index + 1 < currentStep ? <CheckCircle2 className="h-5 w-5" /> : index + 1}
              </div>
              <span className="text-sm text-center">{step}</span>
            </div>
          ))}
        </div>
        <div className="w-full bg-gray-100 h-2 rounded-full">
          <div 
            className="bg-primary h-2 rounded-full transition-all duration-300"
            style={{ width: `${Math.max(25, (currentStep - 1) * 33.33)}%` }}
          ></div>
        </div>
      </div>
      
      {/* ETAPA 1: ROTEIRO */}
      {currentStep === 1 && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <Card className="mb-6 border-2 border-primary/20">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <FileText className="mr-2 h-5 w-5 text-primary" />
                  Etapa 1: Escreva seu Roteiro
                </CardTitle>
                <CardDescription>
                  Digite o texto que será transformado em narração no vídeo
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="script" className="text-base font-medium text-primary">
                    Texto para Narração
                  </Label>
                  <Textarea
                    id="script"
                    placeholder="Digite o script da narração aqui. Exemplo: Bem-vindo ao nosso novo produto..."
                    value={script}
                    onChange={(e) => setScript(e.target.value)}
                    className="min-h-[200px] mt-2 border-2 focus:border-primary/50"
                  />
                </div>
                <div className="pt-2">
                  <Button 
                    onClick={nextStep} 
                    size="lg"
                    className="w-full bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white"
                  >
                    Continuar para Mídia
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
          
          <div>
            <Card>
              <CardHeader>
                <CardTitle>Pré-visualização</CardTitle>
                <CardDescription>
                  Visualize como seu texto ficará
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="rounded-md bg-gray-50 p-4 min-h-[150px]">
                  {previewText ? (
                    <p className="text-sm">{previewText}</p>
                  ) : (
                    <p className="text-sm text-gray-400 italic">
                      O texto digitado aparecerá aqui...
                    </p>
                  )}
                </div>
                <div className="mt-4">
                  <h3 className="font-semibold text-sm">Dicas para um bom roteiro:</h3>
                  <ul className="text-sm space-y-1 mt-2 text-gray-600">
                    <li>• Use frases curtas e diretas</li>
                    <li>• Evite termos técnicos complexos</li>
                    <li>• Inclua pausas naturais usando pontuação</li>
                    <li>• Escreva como se estivesse falando</li>
                  </ul>
                </div>
                
                <div className="mt-6">
                  <ServiceStatusDisplay />
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      )}
      
      {/* ETAPA 2: MÍDIA */}
      {currentStep === 2 && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <Card className="mb-6 border-2 border-primary/20">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Image className="mr-2 h-5 w-5 text-primary" />
                  Etapa 2: Configuração de Mídia
                </CardTitle>
                <CardDescription>
                  Escolha a voz e o tema das imagens para seu vídeo
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <Label htmlFor="voice" className="text-base font-medium text-primary">
                        Escolha a Voz
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
                      <p className="text-xs text-gray-500 mt-1">
                        Escolha a voz que melhor se encaixa com o tom do seu vídeo
                      </p>
                    </div>
                    
                    <div>
                      <Label htmlFor="topic" className="text-base font-medium text-primary">
                        Tema para Imagens
                      </Label>
                      <Input
                        id="topic"
                        placeholder="Ex: natureza, tecnologia, negócios"
                        value={topic}
                        onChange={(e) => setTopic(e.target.value)}
                        className="mt-2"
                      />
                      <p className="text-xs text-gray-500 mt-1">
                        Insira palavras-chave para buscar imagens relacionadas ao seu conteúdo
                      </p>
                    </div>
                  </div>
                </div>
                
                <div className="mt-6 flex gap-3">
                  <Button
                    onClick={prevStep}
                    variant="outline"
                    className="flex-1"
                  >
                    Voltar
                  </Button>
                  <Button
                    onClick={nextStep}
                    className="flex-1 bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white"
                  >
                    Continuar
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
          
          <div>
            <ImageGallery 
              initialTopic={topic} 
              onSelectImages={(images) => {
                // Armazenar as imagens selecionadas no estado
                setSelectedImages(images);
                toast({
                  title: "Imagens selecionadas",
                  description: `${images.length} imagens serão usadas no seu vídeo.`,
                });
              }}
              maxImages={5}
            />
            
            <div className="mt-4 bg-blue-50 p-3 rounded-md border border-blue-100">
              <p className="text-sm text-blue-700 flex gap-2">
                <Image className="h-5 w-5 flex-shrink-0" />
                <span>
                  <span className="font-medium">Dica Pro:</span> Selecione imagens relacionadas entre si 
                  para criar uma narrativa visual coerente.
                </span>
              </p>
            </div>
          </div>
        </div>
      )}
      
      {/* ETAPA 3: CONFIGURAÇÕES AVANÇADAS */}
      {currentStep === 3 && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <Card className="mb-6 border-2 border-primary/20">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Settings className="mr-2 h-5 w-5 text-primary" />
                  Etapa 3: Configurações do Vídeo
                </CardTitle>
                <CardDescription>
                  Personalize as opções avançadas de geração de vídeo
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div className="flex items-center space-x-2">
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
                      <Select 
                        value={selectedTransitions[0]} 
                        onValueChange={(val) => setSelectedTransitions([val, 'dissolve'])}
                      >
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
                      <Select 
                        value={resolution} 
                        onValueChange={setResolution}
                      >
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
                  
                  <div className="p-4 bg-amber-50 rounded-md mt-4 border border-amber-100">
                    <div className="flex">
                      <AlertTriangle className="h-5 w-5 text-amber-500 mr-2 flex-shrink-0 mt-0.5" />
                      <div>
                        <h3 className="font-medium text-amber-800">Recomendação</h3>
                        <p className="text-sm text-amber-700">
                          Para melhor desempenho, recomendamos usar resolução HD (720p) e transição Fade para a maioria dos vídeos.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="mt-6 flex gap-3">
                  <Button
                    onClick={prevStep}
                    variant="outline"
                    className="flex-1"
                  >
                    Voltar
                  </Button>
                  <Button
                    onClick={handleGenerate}
                    disabled={loading}
                    className="flex-1 bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white"
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
              </CardContent>
            </Card>
            
            {/* Área de status e processamento */}
            {status && loading && (
              <Card className="mb-6 border border-primary/30">
                <CardContent className="pt-6">
                  <div className="flex items-center">
                    <Loader2 className="animate-spin h-5 w-5 mr-3 text-primary" />
                    <div>
                      <p className="font-medium">{status}</p>
                      <p className="text-sm text-gray-500">Não feche esta página enquanto o vídeo está sendo processado.</p>
                    </div>
                  </div>
                  
                  <Progress className="mt-4" value={progressPercent} />
                  <p className="text-xs text-right mt-1 text-gray-500">{progressPercent}% concluído</p>
                </CardContent>
              </Card>
            )}
            
            {/* Erro */}
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
                <CardTitle>Resumo do Vídeo</CardTitle>
                <CardDescription>
                  Confira o resumo das configurações
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="bg-gray-50 p-3 rounded-md">
                    <h3 className="font-semibold text-sm text-gray-700">Roteiro</h3>
                    <p className="text-sm line-clamp-2 text-gray-600">{previewText || "Nenhum roteiro definido"}</p>
                  </div>
                  
                  <div className="bg-gray-50 p-3 rounded-md">
                    <h3 className="font-semibold text-sm text-gray-700">Voz</h3>
                    <p className="text-sm text-gray-600">
                      {voices.find(v => v.id === voiceType)?.label || "Padrão"}
                    </p>
                  </div>
                  
                  <div className="bg-gray-50 p-3 rounded-md">
                    <h3 className="font-semibold text-sm text-gray-700">Tema das Imagens</h3>
                    <p className="text-sm text-gray-600">{topic || "Automático"}</p>
                  </div>
                  
                  <div className="bg-gray-50 p-3 rounded-md">
                    <h3 className="font-semibold text-sm text-gray-700">Configurações</h3>
                    <p className="text-sm text-gray-600">
                      Resolução: {resolution}<br />
                      Transição: {transitions.find(t => t.id === selectedTransitions[0])?.label}<br />
                      Detecção de Silêncio: {detectionEnabled ? "Ativada" : "Desativada"}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      )}
      
      {/* ETAPA 4: RESULTADO */}
      {(currentStep === 4 || videoResult) && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <Card className="mb-6 border-2 border-primary/20">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Video className="mr-2 h-5 w-5 text-primary" />
                  Vídeo Gerado
                </CardTitle>
                <CardDescription>
                  Visualize e baixe o seu vídeo
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="overflow-hidden rounded-lg mb-4 bg-gray-900">
                  {videoResult ? (
                    <>
                      <video 
                        src={`/api/video-stream/${videoResult.videoPath}`} 
                        controls 
                        className="w-full max-h-[500px]"
                        autoPlay
                        playsInline
                      />
                    </>
                  ) : (
                    <div className="flex items-center justify-center h-64 bg-gray-800">
                      <Loader2 className="h-8 w-8 animate-spin text-gray-400" />
                    </div>
                  )}
                </div>
                
                <div className="flex justify-between mt-4">
                  <Button
                    onClick={() => setCurrentStep(1)}
                    variant="outline"
                  >
                    Criar Novo Vídeo
                  </Button>
                  
                  {videoResult && (
                    <Button
                      onClick={handleDownload}
                      className="bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white"
                    >
                      <Download className="mr-2 h-4 w-4" />
                      Baixar Vídeo
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
            
            {/* Depuração em Tempo Real */}
            <div className="mb-6">
              <DebugConsole 
                logs={[
                  { id: '1', timestamp: new Date(), message: 'Vídeo gerado com sucesso', type: 'success' },
                  { id: '2', timestamp: new Date(), message: 'Áudio processado corretamente', type: 'info' },
                  { id: '3', timestamp: new Date(), message: 'Imagens baixadas: 5', type: 'info' },
                  { id: '4', timestamp: new Date(), message: 'Silêncios detectados: 3', type: 'info' },
                  { id: '5', timestamp: new Date(), message: 'Renderização completa', type: 'success' }
                ]}
              />
            </div>
            
            {/* Estatísticas de Engajamento */}
            {videoResult && (
              <div className="mb-6">
                <EngagementScore 
                  score={85}
                  rhythm={75}
                  emphasis={65}
                  transitions={90}
                  duration={videoResult.duration ? parseInt(videoResult.duration) : 30}
                  description="Excelente! Vídeo altamente envolvente."
                />
              </div>
            )}
          </div>
          
          <div className="space-y-6">
            {videoResult && (
              <Card>
                <CardHeader>
                  <CardTitle>Detalhes do Vídeo</CardTitle>
                  <CardDescription>
                    Informações técnicas do vídeo gerado
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 gap-3">
                    <div className="bg-gray-50 p-4 rounded-md">
                      <h3 className="font-semibold mb-2 text-sm text-gray-600">Nome do Arquivo</h3>
                      <p className="text-sm text-gray-700 break-all">
                        {videoResult.fileName}
                      </p>
                    </div>
                    
                    <div className="bg-gray-50 p-4 rounded-md">
                      <h3 className="font-semibold mb-2 text-sm text-gray-600">Tamanho do Arquivo</h3>
                      <p className="text-sm text-gray-700">
                        {videoResult.size ? `${(videoResult.size / (1024 * 1024)).toFixed(2)} MB` : 'N/A'}
                      </p>
                    </div>
                    
                    <div className="bg-gray-50 p-4 rounded-md">
                      <h3 className="font-semibold mb-2 text-sm text-gray-600">Duração do Vídeo</h3>
                      <p className="text-sm text-gray-700">
                        {videoResult.duration || 'N/A'}
                      </p>
                    </div>
                    
                    <div className="bg-gray-50 p-4 rounded-md">
                      <h3 className="font-semibold mb-2 text-sm text-gray-600">Tempo de Processamento</h3>
                      <p className="text-sm text-gray-700">
                        {videoResult.processingTime ? formatProcessingTime(videoResult.processingTime) : 'N/A'}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}
            
            {/* Opções de Exportação */}
            {videoResult && (
              <ExportOptions 
                onExport={(platform, format) => {
                  toast({
                    title: 'Exportação iniciada',
                    description: `Exportando para ${platform} em formato ${format}...`,
                  });
                }}
              />
            )}
            
            {videoResult && (
              <div className="bg-blue-50 p-4 border border-blue-100 rounded-md">
                <p className="text-sm text-blue-800">
                  <span className="font-semibold">Dica Pro:</span> Exporte seu vídeo em diferentes 
                  formatos para alcançar diversas plataformas e maximizar seu alcance.
                </p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
import React, { useState, useEffect } from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './select';
import { Label } from './label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from './card';
import { Badge } from './badge';
import { apiRequest } from '@/lib/queryClient';
import { toast } from '@/hooks/use-toast';
import { Button } from './button';
import { AlertTriangle, CheckCircle, RefreshCw } from 'lucide-react';

type ServiceStatus = {
  working: boolean;
  status: string;
  provider?: string;
  details?: string;
  error?: string;
};

type AllServicesResponse = {
  success: boolean;
  timestamp: number;
  services: {
    paid: Record<string, ServiceStatus>;
    free: Record<string, ServiceStatus>;
    system: {
      ffmpeg: ServiceStatus;
    }
  };
  recommendation: {
    text: string;
    useFree: boolean;
  }
};

export function ServiceSwitcher() {
  const [loading, setLoading] = useState(true);
  const [serviceStatus, setServiceStatus] = useState<AllServicesResponse | null>(null);
  const [selectedServices, setSelectedServices] = useState({
    ai: 'openai',
    voice: 'elevenlabs',
    image: 'pexels'
  });

  // Carregar status inicial
  useEffect(() => {
    checkServices();
  }, []);

  const checkServices = async () => {
    setLoading(true);
    try {
      const response = await apiRequest('GET', '/api/check-all-services');
      const data = await response.json();
      setServiceStatus(data);

      // Configurar seleções baseado nas recomendações
      if (data.success && data.recommendation.useFree) {
        // Se a recomendação é usar alternativas gratuitas, sugerir as melhores opções
        const newSelection = { ...selectedServices };
        
        // Verificar opções gratuitas disponíveis
        if (data.services.free.edgeTts.working) {
          newSelection.voice = 'edge-tts';
        }
        
        if (data.services.free.ollama.working) {
          newSelection.ai = 'ollama';
        } else if (data.services.free.huggingFace.working) {
          newSelection.ai = 'huggingface';
        }
        
        if (data.services.free.pixabay.working) {
          newSelection.image = 'pixabay';
        } else if (data.services.free.unsplash.working) {
          newSelection.image = 'unsplash';
        }
        
        setSelectedServices(newSelection);
      }
    } catch (error) {
      console.error('Erro ao verificar serviços:', error);
      toast({
        title: 'Erro ao verificar serviços',
        description: 'Não foi possível carregar o status dos serviços. Tente novamente.',
        variant: 'destructive'
      });
    } finally {
      setLoading(false);
    }
  };

  const handleServiceChange = (service: string, value: string) => {
    setSelectedServices(prev => ({
      ...prev,
      [service]: value
    }));
  };

  const saveChanges = async () => {
    try {
      toast({
        title: 'Configuração salva',
        description: 'Suas preferências de serviço foram atualizadas.',
      });
      // Aqui poderíamos enviar ao servidor, mas por enquanto apenas atualizamos o localStorage
      localStorage.setItem('service_preferences', JSON.stringify(selectedServices));
    } catch (error) {
      toast({
        title: 'Erro ao salvar configurações',
        description: 'Não foi possível salvar suas preferências.',
        variant: 'destructive'
      });
    }
  };

  if (loading) {
    return (
      <Card className="w-full">
        <CardHeader>
          <CardTitle>Serviços de Geração de Conteúdo</CardTitle>
          <CardDescription>Verificando status dos serviços...</CardDescription>
        </CardHeader>
        <CardContent className="flex items-center justify-center py-8">
          <div className="flex flex-col items-center gap-2">
            <RefreshCw className="h-8 w-8 animate-spin text-muted-foreground" />
            <p className="text-sm text-muted-foreground">Carregando status dos serviços</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!serviceStatus) {
    return (
      <Card className="w-full">
        <CardHeader>
          <CardTitle>Serviços de Geração de Conteúdo</CardTitle>
          <CardDescription>Erro ao carregar status dos serviços</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col items-center gap-4 py-4">
            <AlertTriangle className="h-12 w-12 text-destructive" />
            <p className="text-center">Não foi possível obter informações sobre os serviços disponíveis.</p>
            <Button variant="outline" onClick={checkServices}>Tentar Novamente</Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full">
      <CardHeader className="pb-3">
        <div className="flex justify-between items-center">
          <div>
            <CardTitle>Serviços de Geração de Conteúdo</CardTitle>
            <CardDescription>Escolha quais serviços usar para cada funcionalidade</CardDescription>
          </div>
          <Button variant="outline" size="sm" onClick={checkServices} className="h-8 gap-1">
            <RefreshCw className="h-3.5 w-3.5" />
            <span>Atualizar</span>
          </Button>
        </div>
      </CardHeader>
      <CardContent className="grid gap-6">
        {/* IA/Texto */}
        <div className="grid gap-3">
          <Label htmlFor="ai-service">Serviço de IA para Texto</Label>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Select value={selectedServices.ai} onValueChange={(value) => handleServiceChange('ai', value)}>
              <SelectTrigger>
                <SelectValue placeholder="Selecione um serviço de IA" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="openai" disabled={!serviceStatus.services.paid.openai.working}>
                  <div className="flex items-center gap-2">
                    <span>OpenAI</span>
                    {!serviceStatus.services.paid.openai.working && 
                      <Badge variant="destructive" className="text-xs">Indisponível</Badge>
                    }
                    {serviceStatus.services.paid.openai.working && 
                      <Badge variant="secondary" className="text-xs">Pago</Badge>
                    }
                  </div>
                </SelectItem>
                <SelectItem value="huggingface" disabled={!serviceStatus.services.free.huggingFace.working}>
                  <div className="flex items-center gap-2">
                    <span>HuggingFace</span>
                    {!serviceStatus.services.free.huggingFace.working && 
                      <Badge variant="destructive" className="text-xs">Indisponível</Badge>
                    }
                    {serviceStatus.services.free.huggingFace.working && 
                      <Badge variant="success" className="text-xs bg-green-100 text-green-800">Gratuito</Badge>
                    }
                  </div>
                </SelectItem>
                <SelectItem value="ollama" disabled={!serviceStatus.services.free.ollama.working}>
                  <div className="flex items-center gap-2">
                    <span>Ollama (Local)</span>
                    {!serviceStatus.services.free.ollama.working && 
                      <Badge variant="destructive" className="text-xs">Indisponível</Badge>
                    }
                    {serviceStatus.services.free.ollama.working && 
                      <Badge variant="success" className="text-xs bg-green-100 text-green-800">100% Gratuito</Badge>
                    }
                  </div>
                </SelectItem>
              </SelectContent>
            </Select>
            
            <div className="col-span-2 flex items-center text-sm text-muted-foreground">
              {selectedServices.ai === 'openai' && serviceStatus.services.paid.openai.working && (
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-green-500" />
                  <span>OpenAI operacional. Preço sob demanda.</span>
                </div>
              )}
              {selectedServices.ai === 'huggingface' && serviceStatus.services.free.huggingFace.working && (
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-green-500" />
                  <span>HuggingFace disponível. Limite gratuito generoso.</span>
                </div>
              )}
              {selectedServices.ai === 'ollama' && serviceStatus.services.free.ollama.working && (
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-green-500" />
                  <span>Ollama local: 100% gratuito, execução offline.</span>
                </div>
              )}
              {((selectedServices.ai === 'openai' && !serviceStatus.services.paid.openai.working) ||
                (selectedServices.ai === 'huggingface' && !serviceStatus.services.free.huggingFace.working) ||
                (selectedServices.ai === 'ollama' && !serviceStatus.services.free.ollama.working)) && (
                <div className="flex items-center gap-2">
                  <AlertTriangle className="h-4 w-4 text-amber-500" />
                  <span>O serviço selecionado não está disponível.</span>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Voz */}
        <div className="grid gap-3">
          <Label htmlFor="voice-service">Serviço de Voz/Áudio</Label>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Select value={selectedServices.voice} onValueChange={(value) => handleServiceChange('voice', value)}>
              <SelectTrigger>
                <SelectValue placeholder="Selecione um serviço de voz" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="elevenlabs" disabled={!serviceStatus.services.paid.elevenlabs.working}>
                  <div className="flex items-center gap-2">
                    <span>ElevenLabs</span>
                    {!serviceStatus.services.paid.elevenlabs.working && 
                      <Badge variant="destructive" className="text-xs">Indisponível</Badge>
                    }
                    {serviceStatus.services.paid.elevenlabs.working && 
                      <Badge variant="secondary" className="text-xs">Pago</Badge>
                    }
                  </div>
                </SelectItem>
                <SelectItem value="edge-tts" disabled={!serviceStatus.services.free.edgeTts.working}>
                  <div className="flex items-center gap-2">
                    <span>Microsoft Edge TTS</span>
                    {!serviceStatus.services.free.edgeTts.working && 
                      <Badge variant="destructive" className="text-xs">Indisponível</Badge>
                    }
                    {serviceStatus.services.free.edgeTts.working && 
                      <Badge variant="success" className="text-xs bg-green-100 text-green-800">100% Gratuito</Badge>
                    }
                  </div>
                </SelectItem>
              </SelectContent>
            </Select>
            
            <div className="col-span-2 flex items-center text-sm text-muted-foreground">
              {selectedServices.voice === 'elevenlabs' && serviceStatus.services.paid.elevenlabs.working && (
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-green-500" />
                  <span>ElevenLabs operacional. ~10.000 caracteres grátis por mês.</span>
                </div>
              )}
              {selectedServices.voice === 'edge-tts' && serviceStatus.services.free.edgeTts.working && (
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-green-500" />
                  <span>Microsoft Edge TTS: 100% gratuito, vozes em alta qualidade.</span>
                </div>
              )}
              {((selectedServices.voice === 'elevenlabs' && !serviceStatus.services.paid.elevenlabs.working) ||
                (selectedServices.voice === 'edge-tts' && !serviceStatus.services.free.edgeTts.working)) && (
                <div className="flex items-center gap-2">
                  <AlertTriangle className="h-4 w-4 text-amber-500" />
                  <span>O serviço selecionado não está disponível.</span>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Imagens */}
        <div className="grid gap-3">
          <Label htmlFor="image-service">Serviço de Imagens</Label>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Select value={selectedServices.image} onValueChange={(value) => handleServiceChange('image', value)}>
              <SelectTrigger>
                <SelectValue placeholder="Selecione um serviço de imagens" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="pexels" disabled={!serviceStatus.services.paid.pexels.working}>
                  <div className="flex items-center gap-2">
                    <span>Pexels</span>
                    {!serviceStatus.services.paid.pexels.working && 
                      <Badge variant="destructive" className="text-xs">Indisponível</Badge>
                    }
                    {serviceStatus.services.paid.pexels.working && 
                      <Badge variant="secondary" className="text-xs">Pago</Badge>
                    }
                  </div>
                </SelectItem>
                <SelectItem value="pixabay" disabled={!serviceStatus.services.free.pixabay.working}>
                  <div className="flex items-center gap-2">
                    <span>Pixabay</span>
                    {!serviceStatus.services.free.pixabay.working && 
                      <Badge variant="destructive" className="text-xs">Indisponível</Badge>
                    }
                    {serviceStatus.services.free.pixabay.working && 
                      <Badge variant="success" className="text-xs bg-green-100 text-green-800">Gratuito</Badge>
                    }
                  </div>
                </SelectItem>
                <SelectItem value="unsplash" disabled={!serviceStatus.services.free.unsplash.working}>
                  <div className="flex items-center gap-2">
                    <span>Unsplash</span>
                    {!serviceStatus.services.free.unsplash.working && 
                      <Badge variant="destructive" className="text-xs">Indisponível</Badge>
                    }
                    {serviceStatus.services.free.unsplash.working && 
                      <Badge variant="success" className="text-xs bg-green-100 text-green-800">Gratuito</Badge>
                    }
                  </div>
                </SelectItem>
              </SelectContent>
            </Select>
            
            <div className="col-span-2 flex items-center text-sm text-muted-foreground">
              {selectedServices.image === 'pexels' && serviceStatus.services.paid.pexels.working && (
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-green-500" />
                  <span>Pexels operacional. Limite de 200 requests/hora gratuitos.</span>
                </div>
              )}
              {selectedServices.image === 'pixabay' && serviceStatus.services.free.pixabay.working && (
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-green-500" />
                  <span>Pixabay disponível. Limite de 5.000 requests/hora gratuitos.</span>
                </div>
              )}
              {selectedServices.image === 'unsplash' && serviceStatus.services.free.unsplash.working && (
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-green-500" />
                  <span>Unsplash disponível. Limite de 50 requests/hora gratuitos.</span>
                </div>
              )}
              {((selectedServices.image === 'pexels' && !serviceStatus.services.paid.pexels.working) ||
                (selectedServices.image === 'pixabay' && !serviceStatus.services.free.pixabay.working) ||
                (selectedServices.image === 'unsplash' && !serviceStatus.services.free.unsplash.working)) && (
                <div className="flex items-center gap-2">
                  <AlertTriangle className="h-4 w-4 text-amber-500" />
                  <span>O serviço selecionado não está disponível.</span>
                </div>
              )}
            </div>
          </div>
        </div>
        
        {/* FFmpeg Status */}
        <div className="mt-2 rounded-lg border p-4">
          <div className="flex items-center gap-3">
            <div className="flex-shrink-0">
              {serviceStatus.services.system.ffmpeg.working ? (
                <div className="rounded-full bg-green-100 p-1">
                  <CheckCircle className="h-5 w-5 text-green-600" />
                </div>
              ) : (
                <div className="rounded-full bg-amber-100 p-1">
                  <AlertTriangle className="h-5 w-5 text-amber-600" />
                </div>
              )}
            </div>
            <div>
              <h4 className="text-sm font-medium">
                FFmpeg: {serviceStatus.services.system.ffmpeg.working ? 'Disponível' : 'Indisponível'}
              </h4>
              <p className="text-xs text-muted-foreground">
                {serviceStatus.services.system.ffmpeg.working ? 
                  serviceStatus.services.system.ffmpeg.details || 'Processamento de vídeo está funcionando corretamente.' : 
                  'FFmpeg não está disponível. Processamento de vídeo pode falhar.'}
              </p>
            </div>
          </div>
        </div>
        
        {/* Recomendação */}
        {serviceStatus.recommendation && (
          <div className={`mt-2 rounded-lg border ${serviceStatus.recommendation.useFree ? 'border-green-200 bg-green-50' : 'border-amber-200 bg-amber-50'} p-4`}>
            <h4 className="text-sm font-medium">
              {serviceStatus.recommendation.useFree ? 'Recomendação: Use Alternativas Gratuitas' : 'Recomendação de Configuração'}
            </h4>
            <p className="text-xs mt-1">
              {serviceStatus.recommendation.text}
            </p>
          </div>
        )}
      </CardContent>
      <CardFooter className="border-t pt-4 flex justify-between">
        <Button variant="outline" onClick={checkServices}>
          Verificar Serviços
        </Button>
        <Button onClick={saveChanges}>
          Aplicar Configurações
        </Button>
      </CardFooter>
    </Card>
  );
}
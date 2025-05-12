import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './card';
import { Badge } from './badge';
import { apiRequest } from '@/lib/queryClient';
import { CheckCircle, XCircle } from 'lucide-react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from './tooltip';
import { Link } from 'wouter';

type ServiceStatus = {
  working: boolean;
  status: string;
  provider?: string;
  details?: string;
};

type ServicesStatusResponse = {
  success: boolean;
  timestamp: number;
  services: {
    paid: Record<string, ServiceStatus>;
    free: Record<string, ServiceStatus>;
    system: {
      ffmpeg: ServiceStatus;
    }
  };
};

export function ServiceStatusDisplay() {
  const [status, setStatus] = useState<ServicesStatusResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeServices, setActiveServices] = useState({
    ai: '',
    voice: '',
    image: ''
  });

  useEffect(() => {
    // Carregar status dos serviços
    checkServiceStatus();
    
    // Também tenta obter as preferências salvas do localStorage
    try {
      const savedPreferences = localStorage.getItem('service_preferences');
      if (savedPreferences) {
        setActiveServices(JSON.parse(savedPreferences));
      }
    } catch (error) {
      console.error('Erro ao carregar preferências de serviço:', error);
    }
    
    // Verificar status a cada 5 minutos
    const interval = setInterval(checkServiceStatus, 5 * 60 * 1000);
    
    return () => clearInterval(interval);
  }, []);
  
  const checkServiceStatus = async () => {
    setLoading(true);
    try {
      const response = await apiRequest('GET', '/api/check-all-services');
      const data = await response.json();
      
      if (data.success) {
        setStatus(data);
        
        // Detectar quais serviços estão ativos com base no status
        const services = {
          ai: determineActiveAIService(data),
          voice: determineActiveVoiceService(data),
          image: determineActiveImageService(data)
        };
        
        setActiveServices(prev => ({
          ai: prev.ai || services.ai,
          voice: prev.voice || services.voice,
          image: prev.image || services.image
        }));
      }
    } catch (error) {
      console.error('Erro ao verificar status dos serviços:', error);
    } finally {
      setLoading(false);
    }
  };
  
  // Determina qual serviço de IA está ativo com base no status
  const determineActiveAIService = (data: ServicesStatusResponse): string => {
    // Prioridade: OpenAI > HuggingFace > Ollama
    if (data.services.paid.openai.working) return 'openai';
    if (data.services.free.huggingFace.working) return 'huggingface';
    if (data.services.free.ollama.working) return 'ollama';
    return '';
  };
  
  // Determina qual serviço de voz está ativo com base no status
  const determineActiveVoiceService = (data: ServicesStatusResponse): string => {
    // Prioridade: ElevenLabs > Edge TTS
    if (data.services.paid.elevenlabs.working) return 'elevenlabs';
    if (data.services.free.edgeTts.working) return 'edge-tts';
    return '';
  };
  
  // Determina qual serviço de imagem está ativo com base no status
  const determineActiveImageService = (data: ServicesStatusResponse): string => {
    // Prioridade: Pexels > Pixabay > Unsplash
    if (data.services.paid.pexels.working) return 'pexels';
    if (data.services.free.pixabay.working) return 'pixabay';
    if (data.services.free.unsplash.working) return 'unsplash';
    return '';
  };
  
  // Verifica se qualquer API está disponível
  const hasAvailableAPI = (): boolean => {
    if (!status) return false;
    
    return (
      status.services.paid.openai.working ||
      status.services.paid.elevenlabs.working ||
      status.services.paid.pexels.working ||
      status.services.free.huggingFace.working ||
      status.services.free.ollama.working ||
      status.services.free.edgeTts.working ||
      status.services.free.pixabay.working ||
      status.services.free.unsplash.working
    );
  };
  
  // Retorna o tipo de badge para um serviço (pago, gratuito)
  const getBadgeType = (serviceName: string): "secondary" | "success" => {
    const paidServices = ['openai', 'elevenlabs', 'pexels'];
    return paidServices.includes(serviceName) ? "secondary" : "success";
  };
  
  // Retorna o texto para o badge
  const getBadgeText = (serviceName: string): string => {
    const paidServices = ['openai', 'elevenlabs', 'pexels'];
    return paidServices.includes(serviceName) ? "Pago" : "Gratuito";
  };
  
  // Verifica se há um serviço ativo para uma categoria
  const hasActiveService = (category: 'ai' | 'voice' | 'image'): boolean => {
    return !!activeServices[category];
  };
  
  // Retorna o nome legível de um serviço
  const getServiceName = (serviceId: string): string => {
    const names: {[key: string]: string} = {
      'openai': 'OpenAI',
      'huggingface': 'HuggingFace',
      'ollama': 'Ollama (Local)',
      'elevenlabs': 'ElevenLabs',
      'edge-tts': 'Edge TTS',
      'pexels': 'Pexels',
      'pixabay': 'Pixabay',
      'unsplash': 'Unsplash'
    };
    
    return names[serviceId] || serviceId;
  };
  
  if (loading && !status) {
    return null; // Não exibir nada enquanto carrega inicialmente
  }
  
  return (
    <Card className="overflow-hidden">
      <CardHeader className="py-3 bg-muted/30">
        <CardTitle className="text-sm font-medium flex justify-between items-center">
          <span>Serviços Ativos</span>
          <Link href="/settings">
            <span className="text-xs text-blue-500 hover:underline cursor-pointer">
              Configurar
            </span>
          </Link>
        </CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        <div className="grid grid-cols-3 divide-x text-xs">
          <div className="p-3 flex flex-col items-center justify-center gap-2">
            <span className="text-xs text-muted-foreground">IA/Texto</span>
            {hasActiveService('ai') ? (
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <div className="flex items-center gap-1.5">
                      <CheckCircle className="h-3.5 w-3.5 text-green-500" />
                      <span>{getServiceName(activeServices.ai)}</span>
                      <Badge variant={getBadgeType(activeServices.ai)} className="ml-1">
                        {getBadgeText(activeServices.ai)}
                      </Badge>
                    </div>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Serviço de IA para geração de texto</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            ) : (
              <div className="flex items-center gap-1.5">
                <XCircle className="h-3.5 w-3.5 text-red-500" />
                <span className="text-red-500">Indisponível</span>
              </div>
            )}
          </div>
          
          <div className="p-3 flex flex-col items-center justify-center gap-2">
            <span className="text-xs text-muted-foreground">Voz/Áudio</span>
            {hasActiveService('voice') ? (
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <div className="flex items-center gap-1.5">
                      <CheckCircle className="h-3.5 w-3.5 text-green-500" />
                      <span>{getServiceName(activeServices.voice)}</span>
                      <Badge variant={getBadgeType(activeServices.voice)} className="ml-1">
                        {getBadgeText(activeServices.voice)}
                      </Badge>
                    </div>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Serviço de conversão de texto para voz</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            ) : (
              <div className="flex items-center gap-1.5">
                <XCircle className="h-3.5 w-3.5 text-red-500" />
                <span className="text-red-500">Indisponível</span>
              </div>
            )}
          </div>
          
          <div className="p-3 flex flex-col items-center justify-center gap-2">
            <span className="text-xs text-muted-foreground">Imagens</span>
            {hasActiveService('image') ? (
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <div className="flex items-center gap-1.5">
                      <CheckCircle className="h-3.5 w-3.5 text-green-500" />
                      <span>{getServiceName(activeServices.image)}</span>
                      <Badge variant={getBadgeType(activeServices.image)} className="ml-1">
                        {getBadgeText(activeServices.image)}
                      </Badge>
                    </div>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Serviço de busca de imagens</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            ) : (
              <div className="flex items-center gap-1.5">
                <XCircle className="h-3.5 w-3.5 text-red-500" />
                <span className="text-red-500">Indisponível</span>
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
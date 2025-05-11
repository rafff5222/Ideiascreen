import React, { useState, useEffect } from 'react';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { AlertCircle, CheckCircle, RefreshCw } from 'lucide-react';
import { apiRequest } from '@/lib/queryClient';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

interface APIStatus {
  working: boolean;
  status: string;
  message?: string;
  version?: string;
  model?: string;
  subscription?: any;
}

interface SystemStatus {
  openai: APIStatus;
  elevenlabs: APIStatus;
  pexels: APIStatus;
  ffmpeg: APIStatus;
  filesystem: APIStatus;
}

export default function APIStatusChecker() {
  const [status, setStatus] = useState<SystemStatus | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [lastChecked, setLastChecked] = useState<string>('');

  const checkStatus = async () => {
    setIsLoading(true);
    try {
      const response = await apiRequest('GET', '/api/sys-status');
      const data = await response.json();
      setStatus(data);
      setLastChecked(new Date().toLocaleTimeString());
    } catch (error) {
      console.error('Erro ao verificar status:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    checkStatus();
  }, []);

  const getStatusBadge = (apiStatus?: APIStatus) => {
    if (!apiStatus) {
      return (
        <Badge variant="outline" className="bg-gray-100 text-gray-800 border-gray-200">
          <RefreshCw className="h-3 w-3 mr-1 animate-spin" />
          Verificando
        </Badge>
      );
    }
  
    if (apiStatus.working) {
      return (
        <Badge variant="outline" className="bg-green-100 text-green-800 border-green-200">
          <CheckCircle className="h-3 w-3 mr-1" />
          Operacional
        </Badge>
      );
    } else {
      return (
        <Badge variant="outline" className="bg-red-100 text-red-800 border-red-200">
          <AlertCircle className="h-3 w-3 mr-1" />
          Indisponível
        </Badge>
      );
    }
  };

  return (
    <Card className="w-full">
      <CardHeader className="pb-3">
        <div className="flex justify-between items-center">
          <div>
            <CardTitle className="text-xl">Status das APIs</CardTitle>
            <CardDescription>
              Verifique se todos os serviços necessários estão funcionando
            </CardDescription>
          </div>
          <Button variant="outline" size="sm" onClick={checkStatus} disabled={isLoading}>
            <RefreshCw className={`h-4 w-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
            Atualizar
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        {status ? (
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="border rounded-md p-3">
                <div className="flex justify-between items-center mb-2">
                  <h3 className="font-semibold">OpenAI</h3>
                  {getStatusBadge(status?.openai)}
                </div>
                <p className="text-sm text-muted-foreground">
                  {status?.openai?.model ? `Modelo: ${status.openai.model}` : 
                   status?.openai?.message || 'Serviço de IA para geração de conteúdo'}
                </p>
              </div>
              
              <div className="border rounded-md p-3">
                <div className="flex justify-between items-center mb-2">
                  <h3 className="font-semibold">ElevenLabs</h3>
                  {getStatusBadge(status?.elevenlabs)}
                </div>
                <p className="text-sm text-muted-foreground">
                  {status?.elevenlabs?.subscription ? 
                    `Plano: ${status.elevenlabs.subscription.tier}` :
                    status?.elevenlabs?.message || 'Serviço de síntese de voz'}
                </p>
              </div>
              
              <div className="border rounded-md p-3">
                <div className="flex justify-between items-center mb-2">
                  <h3 className="font-semibold">Pexels</h3>
                  {getStatusBadge(status?.pexels)}
                </div>
                <p className="text-sm text-muted-foreground">
                  {status?.pexels?.message || 'Biblioteca de imagens e vídeos'}
                </p>
              </div>
              
              <div className="border rounded-md p-3">
                <div className="flex justify-between items-center mb-2">
                  <h3 className="font-semibold">FFmpeg</h3>
                  {getStatusBadge(status?.ffmpeg)}
                </div>
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <p className="text-sm text-muted-foreground truncate">
                        {status?.ffmpeg?.version || status?.ffmpeg?.message || 'Processador de vídeo'}
                      </p>
                    </TooltipTrigger>
                    <TooltipContent className="max-w-xs">
                      <p>{status?.ffmpeg?.version || status?.ffmpeg?.message || 'Processador de vídeo'}</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </div>
            </div>
            
            <div className="text-xs text-right text-muted-foreground mt-4">
              Última verificação: {lastChecked}
            </div>
          </div>
        ) : (
          <div className="flex justify-center items-center h-32">
            <RefreshCw className="h-5 w-5 animate-spin text-muted-foreground" />
          </div>
        )}
      </CardContent>
    </Card>
  );
}
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
  apis: {
    openai: {
      configured: boolean;
      working: boolean;
      status: string;
    };
    huggingface: {
      configured: boolean;
      working: boolean;
      status: string;
    };
  };
  environment: {
    nodeVersion: string;
    platform: string;
    timestamp: string;
    ffmpeg: boolean;
  };
  recommendations?: {
    text: string;
    useFree: boolean;
  };
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

  const getStatusBadge = (working?: boolean) => {
    if (working === undefined) {
      return (
        <Badge variant="outline" className="bg-gray-100 text-gray-800 border-gray-200">
          <RefreshCw className="h-3 w-3 mr-1 animate-spin" />
          Verificando
        </Badge>
      );
    }
  
    if (working) {
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
                  {getStatusBadge(status?.apis?.openai?.working)}
                </div>
                <p className="text-sm text-muted-foreground">
                  {status?.apis?.openai?.configured ? 
                   'Configurado e pronto para geração de roteiros' : 
                   'API Key não configurada - usando HuggingFace como alternativa'}
                </p>
              </div>
              
              <div className="border rounded-md p-3">
                <div className="flex justify-between items-center mb-2">
                  <h3 className="font-semibold">HuggingFace</h3>
                  {getStatusBadge(status?.apis?.huggingface?.working)}
                </div>
                <p className="text-sm text-muted-foreground">
                  {status?.apis?.huggingface?.configured ? 
                   'Configurado - alternativa gratuita ao OpenAI' : 
                   'API Key não configurada - configure para usar como backup'}
                </p>
              </div>
              
              <div className="border rounded-md p-3">
                <div className="flex justify-between items-center mb-2">
                  <h3 className="font-semibold">Sistema</h3>
                  <Badge variant="outline" className="bg-blue-100 text-blue-800 border-blue-200">
                    Informações
                  </Badge>
                </div>
                <p className="text-sm text-muted-foreground">
                  Node {status?.environment?.nodeVersion || 'N/A'} | Plataforma: {status?.environment?.platform || 'N/A'}
                </p>
                {status?.recommendations && (
                  <div className="mt-2 text-xs border-t pt-2 border-gray-100">
                    <p className={status?.recommendations.useFree ? "text-green-600" : "text-amber-600"}>
                      {status.recommendations.text}
                    </p>
                  </div>
                )}
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
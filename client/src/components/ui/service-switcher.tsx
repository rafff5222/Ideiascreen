import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from './card';
import { Switch } from './switch';
import { Label } from './label';
import { Badge } from './badge';
import { Button } from './button';
import { AlertCircle, CheckCircle, AlertTriangle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { apiRequest } from '@/lib/queryClient';

type ServiceSwitcherProps = {
  title: string;
  description: string;
  paidService: {
    id: string;
    name: string;
    description: string;
  };
  freeService: {
    id: string;
    name: string;
    description: string;
  };
  type: 'ai' | 'voice' | 'image';
  defaultEnabled?: boolean;
  onChange?: (enabled: boolean) => void;
};

export function ServiceSwitcher({
  title,
  description,
  paidService,
  freeService,
  type,
  defaultEnabled = true,
  onChange
}: ServiceSwitcherProps) {
  const [enabled, setEnabled] = useState(defaultEnabled);
  const [loading, setLoading] = useState(false);
  const [paidStatus, setPaidStatus] = useState<'checking' | 'available' | 'unavailable'>('checking');
  const [freeStatus, setFreeStatus] = useState<'checking' | 'available' | 'unavailable'>('checking');
  const { toast } = useToast();
  
  // Tentar carregar preferências salvas
  useEffect(() => {
    try {
      const savedPreferences = localStorage.getItem('service_preferences');
      if (savedPreferences) {
        const prefs = JSON.parse(savedPreferences);
        if (type === 'ai' && prefs.useOpenAI !== undefined) {
          setEnabled(prefs.useOpenAI);
        } else if (type === 'voice' && prefs.useElevenLabs !== undefined) {
          setEnabled(prefs.useElevenLabs);
        } else if (type === 'image' && prefs.usePexels !== undefined) {
          setEnabled(prefs.usePexels);
        }
      }
    } catch (error) {
      console.error('Erro ao carregar preferências:', error);
    }
    
    // Verificar status dos serviços
    checkServices();
  }, [type]);
  
  // Verificar status dos serviços específicos
  const checkServices = async () => {
    setLoading(true);
    try {
      const response = await apiRequest('GET', '/api/check-all-services');
      const data = await response.json();
      
      if (data.success) {
        // Verificar status dos serviços com base no tipo
        if (type === 'ai') {
          setPaidStatus(data.services.paid.openai.working ? 'available' : 'unavailable');
          setFreeStatus(data.services.free.huggingFace.working ? 'available' : 'unavailable');
        } else if (type === 'voice') {
          setPaidStatus(data.services.paid.elevenlabs.working ? 'available' : 'unavailable');
          setFreeStatus(data.services.free.edgeTts.working ? 'available' : 'unavailable');
        } else if (type === 'image') {
          setPaidStatus(data.services.paid.pexels.working ? 'available' : 'unavailable');
          // Verificar se Pixabay ou Unsplash estão disponíveis para o serviço gratuito
          setFreeStatus(
            data.services.free.pixabay.working || data.services.free.unsplash.working 
              ? 'available' 
              : 'unavailable'
          );
        }
      }
    } catch (error) {
      console.error('Erro ao verificar serviços:', error);
      setPaidStatus('unavailable');
      setFreeStatus('unavailable');
    } finally {
      setLoading(false);
    }
  };
  
  // Alternar entre serviço pago e gratuito
  const handleToggle = () => {
    const newValue = !enabled;
    setEnabled(newValue);
    
    // Salvar preferência no localStorage
    try {
      const savedPreferences = localStorage.getItem('service_preferences') || '{}';
      const prefs = JSON.parse(savedPreferences);
      
      if (type === 'ai') {
        prefs.useOpenAI = newValue;
      } else if (type === 'voice') {
        prefs.useElevenLabs = newValue;
      } else if (type === 'image') {
        prefs.usePexels = newValue;
      }
      
      localStorage.setItem('service_preferences', JSON.stringify(prefs));
      
      // Notificar componente pai se onChange for fornecido
      if (onChange) {
        onChange(newValue);
      }
    } catch (error) {
      console.error('Erro ao salvar preferências:', error);
    }
  };
  
  // Atualizar configurações no servidor
  const updateServerConfig = async () => {
    setLoading(true);
    try {
      // Construir objeto de configuração baseado no tipo
      const config = {
        ...(type === 'ai' && { useOpenAI: enabled }),
        ...(type === 'voice' && { useElevenLabs: enabled }),
        ...(type === 'image' && { usePexels: enabled }),
      };
      
      const response = await apiRequest('POST', '/api/update-service-preferences', config);
      const data = await response.json();
      
      if (data.success) {
        toast({
          title: 'Configuração atualizada',
          description: `O serviço ${enabled ? paidService.name : freeService.name} será usado para ${title.toLowerCase()}.`,
        });
      } else {
        throw new Error(data.error || 'Erro ao atualizar configuração');
      }
    } catch (error: any) {
      toast({
        title: 'Erro',
        description: error.message || 'Ocorreu um erro ao atualizar a configuração.',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <Card className="mb-4">
      <CardHeader className="pb-3">
        <div className="flex justify-between items-start">
          <div>
            <CardTitle>{title}</CardTitle>
            <CardDescription className="mt-1.5">{description}</CardDescription>
          </div>
          {(paidStatus === 'unavailable' && freeStatus === 'unavailable') && (
            <Badge variant="destructive" className="ml-2">
              <AlertTriangle className="h-3 w-3 mr-1" />
              Todos indisponíveis
            </Badge>
          )}
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex flex-col space-y-3">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label className="text-base font-medium">{paidService.name}</Label>
              <p className="text-sm text-muted-foreground">{paidService.description}</p>
            </div>
            <div className="flex items-center gap-3">
              {paidStatus === 'checking' ? (
                <div className="w-3 h-3 rounded-full bg-yellow-400 animate-pulse" />
              ) : paidStatus === 'available' ? (
                <Badge variant="success">
                  <CheckCircle className="h-3 w-3 mr-1" />
                  Disponível
                </Badge>
              ) : (
                <Badge variant="outline" className="border-red-200 text-red-600">
                  <AlertCircle className="h-3 w-3 mr-1" />
                  Indisponível
                </Badge>
              )}
            </div>
          </div>
          
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label className="text-base font-medium">{freeService.name}</Label>
              <p className="text-sm text-muted-foreground">{freeService.description}</p>
            </div>
            <div className="flex items-center gap-3">
              {freeStatus === 'checking' ? (
                <div className="w-3 h-3 rounded-full bg-yellow-400 animate-pulse" />
              ) : freeStatus === 'available' ? (
                <Badge variant="success">
                  <CheckCircle className="h-3 w-3 mr-1" />
                  Disponível
                </Badge>
              ) : (
                <Badge variant="outline" className="border-red-200 text-red-600">
                  <AlertCircle className="h-3 w-3 mr-1" />
                  Indisponível
                </Badge>
              )}
            </div>
          </div>
        </div>
        
        <div className="flex items-center justify-between pt-2">
          <Label htmlFor={`switch-${type}`}>
            Usar {paidService.name} (pago) ao invés de {freeService.name} (gratuito)
          </Label>
          <Switch
            id={`switch-${type}`}
            checked={enabled}
            onCheckedChange={handleToggle}
            disabled={loading}
          />
        </div>
      </CardContent>
      <CardFooter className="pt-0">
        <Button 
          onClick={updateServerConfig} 
          disabled={loading}
          variant="outline" 
          className="w-full"
        >
          {loading ? 'Atualizando...' : 'Aplicar configuração'}
        </Button>
      </CardFooter>
    </Card>
  );
}
import { useState, useEffect } from 'react';
import { 
  Alert, 
  AlertTitle, 
  AlertDescription 
} from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { RefreshCw, CheckCircle, XCircle, AlertCircle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface APIStatus {
  openai: 'checking' | 'configured' | 'unconfigured' | 'error';
  elevenlabs: 'checking' | 'configured' | 'unconfigured' | 'error';
  stripe?: 'checking' | 'configured' | 'unconfigured' | 'error';
}

interface APIStatusCheckerProps {
  onStatusChange?: (status: APIStatus) => void;
  showStripe?: boolean;
}

export default function APIStatusChecker({ 
  onStatusChange,
  showStripe = false
}: APIStatusCheckerProps) {
  const [status, setStatus] = useState<APIStatus>({
    openai: 'checking',
    elevenlabs: 'checking',
    stripe: showStripe ? 'checking' : undefined
  });
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  // Função para checar status das APIs
  const checkAPIStatus = async () => {
    setIsLoading(true);
    
    try {
      const response = await fetch('/api/sys-status');
      
      if (!response.ok) {
        throw new Error('Erro ao verificar status das APIs');
      }
      
      const data = await response.json();
      
      if (!data.success) {
        throw new Error(data.error || 'Erro desconhecido');
      }
      
      const apiStatus: APIStatus = {
        openai: data.status.apis.openai,
        elevenlabs: data.status.apis.elevenlabs,
        stripe: showStripe ? data.status.apis.stripe : undefined
      };
      
      setStatus(apiStatus);
      
      if (onStatusChange) {
        onStatusChange(apiStatus);
      }
      
      // Verificar se há problemas com as APIs
      const hasIssues = apiStatus.openai !== 'configured' || 
                        apiStatus.elevenlabs !== 'configured' ||
                        (showStripe && apiStatus.stripe !== 'configured');
      
      if (hasIssues) {
        toast({
          variant: 'destructive',
          title: 'Problemas com chaves de API',
          description: 'Algumas APIs necessárias não estão configuradas corretamente.'
        });
      }
      
    } catch (error) {
      console.error('Erro ao verificar status das APIs:', error);
      
      setStatus({
        openai: 'error',
        elevenlabs: 'error',
        stripe: showStripe ? 'error' : undefined
      });
      
      toast({
        variant: 'destructive',
        title: 'Erro de conexão',
        description: 'Não foi possível verificar o status das APIs.'
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  // Verificar status das APIs ao montar o componente
  useEffect(() => {
    checkAPIStatus();
  }, []);
  
  // Determinar o status geral (para exibição)
  const allConfigured = status.openai === 'configured' && 
                        status.elevenlabs === 'configured' &&
                        (!showStripe || status.stripe === 'configured');
                        
  const hasErrors = status.openai === 'error' || 
                    status.elevenlabs === 'error' || 
                    (showStripe && status.stripe === 'error');
                   
  const isChecking = status.openai === 'checking' || 
                     status.elevenlabs === 'checking' || 
                     (showStripe && status.stripe === 'checking');
  
  // Renderizar status de API específica
  const renderAPIStatus = (api: string, status: string) => {
    let Icon;
    let color;
    let text;
    
    switch (status) {
      case 'configured':
        Icon = CheckCircle;
        color = 'text-green-500';
        text = 'Configurada';
        break;
      case 'unconfigured':
        Icon = XCircle;
        color = 'text-red-500';
        text = 'Não configurada';
        break;
      case 'error':
        Icon = AlertCircle;
        color = 'text-orange-500';
        text = 'Erro ao verificar';
        break;
      default:
        Icon = RefreshCw;
        color = 'text-blue-500';
        text = 'Verificando...';
    }
    
    return (
      <div className="flex items-center gap-2">
        <Icon className={`h-4 w-4 ${color}`} />
        <span><strong>{api}:</strong> {text}</span>
      </div>
    );
  };
  
  // Recuperar links para configuração
  const getConfigLink = (api: string) => {
    switch (api) {
      case 'OpenAI':
        return 'https://platform.openai.com/account/api-keys';
      case 'ElevenLabs':
        return 'https://elevenlabs.io/app/account';
      case 'Stripe':
        return 'https://dashboard.stripe.com/apikeys';
      default:
        return '#';
    }
  };
  
  // Recuperar instruções para configuração
  const getConfigInstructions = (api: string) => {
    switch (api) {
      case 'OpenAI':
        return 'Crie uma conta na OpenAI e gere uma chave de API no painel de controle.';
      case 'ElevenLabs':
        return 'Crie uma conta na ElevenLabs e copie sua chave de API da seção de configurações.';
      case 'Stripe':
        return 'Acesse seu painel do Stripe e copie as chaves pública e privada.';
      default:
        return '';
    }
  };
  
  if (allConfigured) {
    return (
      <Alert className="bg-green-50 border-green-200 mb-4">
        <CheckCircle className="h-4 w-4 text-green-500" />
        <AlertTitle>APIs configuradas corretamente</AlertTitle>
        <AlertDescription>
          Todas as APIs necessárias estão configuradas e funcionando.
        </AlertDescription>
      </Alert>
    );
  }
  
  return (
    <Alert className={`${hasErrors ? 'bg-red-50 border-red-200' : 'bg-orange-50 border-orange-200'} mb-4`}>
      <AlertTitle className="flex items-center gap-2">
        {hasErrors ? (
          <XCircle className="h-4 w-4 text-red-500" />
        ) : (
          <AlertCircle className="h-4 w-4 text-orange-500" />
        )}
        Atenção: Problemas com chaves de API
      </AlertTitle>
      <AlertDescription>
        <div className="mt-2 space-y-2">
          {renderAPIStatus('OpenAI', status.openai)}
          {renderAPIStatus('ElevenLabs', status.elevenlabs)}
          {showStripe && status.stripe && renderAPIStatus('Stripe', status.stripe)}
        </div>
        
        <div className="mt-4">
          <p className="text-sm font-medium">Instruções para Configuração:</p>
          
          <ul className="list-disc pl-5 mt-2 space-y-2 text-sm">
            {status.openai !== 'configured' && (
              <li>
                <strong>OpenAI:</strong> {getConfigInstructions('OpenAI')}{' '}
                <a 
                  href={getConfigLink('OpenAI')} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:underline"
                >
                  Obter chave
                </a>
              </li>
            )}
            
            {status.elevenlabs !== 'configured' && (
              <li>
                <strong>ElevenLabs:</strong> {getConfigInstructions('ElevenLabs')}{' '}
                <a 
                  href={getConfigLink('ElevenLabs')} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:underline"
                >
                  Obter chave
                </a>
              </li>
            )}
            
            {showStripe && status.stripe !== 'configured' && (
              <li>
                <strong>Stripe:</strong> {getConfigInstructions('Stripe')}{' '}
                <a 
                  href={getConfigLink('Stripe')} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:underline"
                >
                  Obter chave
                </a>
              </li>
            )}
          </ul>
        </div>
        
        <div className="mt-4">
          <Button 
            variant="outline" 
            size="sm" 
            onClick={checkAPIStatus}
            disabled={isLoading}
          >
            <RefreshCw className={`mr-2 h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
            {isLoading ? 'Verificando...' : 'Verificar novamente'}
          </Button>
        </div>
      </AlertDescription>
    </Alert>
  );
}
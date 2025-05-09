import { useState, useEffect, useRef } from 'react';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Loader2, CheckCircle2, XCircle, RefreshCcw } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface ProcessingProgressProps {
  taskId: string;
  onComplete?: (result: any) => void;
  onError?: (error: string) => void;
  showDetails?: boolean;
}

interface TaskUpdate {
  type: string;
  taskId: string;
  progress: number;
  message: string;
  status: 'pending' | 'processing' | 'completed' | 'failed';
  estimatedTimeRemaining?: number;
  result?: any;
  error?: string;
}

export function ProcessingProgress({ 
  taskId, 
  onComplete, 
  onError,
  showDetails = true
}: ProcessingProgressProps) {
  const [progress, setProgress] = useState(0);
  const [message, setMessage] = useState('Iniciando processamento...');
  const [status, setStatus] = useState<'pending' | 'processing' | 'completed' | 'failed'>('pending');
  const [estimatedTime, setEstimatedTime] = useState<number | null>(null);
  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [reconnectAttempts, setReconnectAttempts] = useState(0);
  
  const wsRef = useRef<WebSocket | null>(null);
  const { toast } = useToast();
  
  // Formatação do tempo estimado
  const formatTime = (seconds: number): string => {
    if (seconds < 60) {
      return `${seconds} segundos`;
    } else {
      const minutes = Math.floor(seconds / 60);
      const remainingSeconds = seconds % 60;
      return `${minutes} min ${remainingSeconds} seg`;
    }
  };
  
  // Efeito para conexão WebSocket
  useEffect(() => {
    if (!taskId) return;
    
    const connectWebSocket = () => {
      // Determinar o protocolo correto (ws ou wss)
      const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
      const wsUrl = `${protocol}//${window.location.host}/ws`;
      
      // Criar nova conexão
      const ws = new WebSocket(wsUrl);
      wsRef.current = ws;
      
      // Manipuladores de eventos
      ws.onopen = () => {
        console.log('WebSocket conectado');
        setIsConnected(true);
        setReconnectAttempts(0);
        
        // Enviar comando de subscrição à tarefa específica
        ws.send(JSON.stringify({
          type: 'subscribe',
          taskId
        }));
      };
      
      ws.onmessage = (event) => {
        try {
          const data: TaskUpdate = JSON.parse(event.data);
          
          // Atualizar estado baseado no tipo de mensagem
          if (data.type === 'initial_state' || data.type === 'progress_update') {
            setProgress(data.progress);
            setMessage(data.message);
            setStatus(data.status);
            
            if (data.estimatedTimeRemaining !== undefined) {
              setEstimatedTime(data.estimatedTimeRemaining);
            }
            
            if (data.result) {
              setResult(data.result);
              if (data.status === 'completed' && onComplete) {
                onComplete(data.result);
              }
            }
            
            if (data.error) {
              setError(data.error);
              if (data.status === 'failed' && onError) {
                onError(data.error);
              }
            }
          } else if (data.type === 'error') {
            console.error('Erro do WebSocket:', data.message);
            toast({
              variant: 'destructive',
              title: 'Erro de conexão',
              description: data.message
            });
          }
        } catch (err) {
          console.error('Erro ao processar mensagem:', err);
        }
      };
      
      ws.onclose = () => {
        console.log('WebSocket desconectado');
        setIsConnected(false);
        
        // Tentar reconectar (com backoff exponencial)
        const maxAttempts = 5;
        if (reconnectAttempts < maxAttempts) {
          const delay = Math.min(1000 * Math.pow(2, reconnectAttempts), 30000);
          setTimeout(() => {
            setReconnectAttempts(prev => prev + 1);
            connectWebSocket();
          }, delay);
        } else {
          toast({
            variant: 'destructive',
            title: 'Erro de conexão',
            description: 'Não foi possível reconectar ao servidor. Tente recarregar a página.'
          });
        }
      };
      
      ws.onerror = (error) => {
        console.error('Erro no WebSocket:', error);
        toast({
          variant: 'destructive',
          title: 'Erro de conexão',
          description: 'Ocorreu um erro na conexão com o servidor.'
        });
      };
    };
    
    connectWebSocket();
    
    // Cleanup na desmontagem do componente
    return () => {
      if (wsRef.current) {
        // Enviar unsubscribe antes de fechar
        if (wsRef.current.readyState === WebSocket.OPEN) {
          wsRef.current.send(JSON.stringify({
            type: 'unsubscribe',
            taskId
          }));
        }
        
        wsRef.current.close();
        wsRef.current = null;
      }
    };
  }, [taskId, reconnectAttempts, toast, onComplete, onError]);
  
  // Renderização condicional baseada no status
  let statusDisplay;
  switch (status) {
    case 'pending':
      statusDisplay = (
        <div className="flex items-center text-yellow-600">
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          <span>Aguardando início</span>
        </div>
      );
      break;
    case 'processing':
      statusDisplay = (
        <div className="flex items-center text-blue-600">
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          <span>Processando</span>
        </div>
      );
      break;
    case 'completed':
      statusDisplay = (
        <div className="flex items-center text-green-600">
          <CheckCircle2 className="mr-2 h-4 w-4" />
          <span>Concluído</span>
        </div>
      );
      break;
    case 'failed':
      statusDisplay = (
        <div className="flex items-center text-red-600">
          <XCircle className="mr-2 h-4 w-4" />
          <span>Falhou</span>
        </div>
      );
      break;
  }
  
  // Para interface simplificada (sem detalhes)
  if (!showDetails) {
    return (
      <div className="w-full">
        <div className="flex justify-between items-center mb-2">
          <div className="text-sm text-gray-500">{message}</div>
          <div className="text-sm font-medium">
            {progress === 100 && status === 'completed' 
              ? 'Concluído!' 
              : status === 'failed'
                ? 'Falhou!'
                : `${progress}%`
            }
          </div>
        </div>
        <Progress value={progress} className="h-2" />
        {estimatedTime !== null && progress < 100 && status !== 'failed' && (
          <div className="text-xs text-gray-500 mt-1 text-right">
            Tempo estimado: {formatTime(estimatedTime)}
          </div>
        )}
      </div>
    );
  }
  
  // Interface completa com card e detalhes
  return (
    <Card className="w-full mb-4">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg flex justify-between">
          <span>Processamento</span>
          {statusDisplay}
        </CardTitle>
        <CardDescription>
          {isConnected 
            ? 'Conectado ao servidor em tempo real'
            : 'Tentando conectar ao servidor...'}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="mb-4">
          <div className="flex justify-between items-center mb-2">
            <div className="text-sm">{message}</div>
            <div className="text-sm font-medium">{progress}%</div>
          </div>
          <Progress value={progress} className="h-2" />
          {estimatedTime !== null && progress < 100 && status !== 'failed' && (
            <div className="text-xs text-gray-500 mt-1 text-right">
              Tempo estimado restante: {formatTime(estimatedTime)}
            </div>
          )}
        </div>
        
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-md p-3 text-sm text-red-800 mt-2">
            {error}
          </div>
        )}
      </CardContent>
      {(status === 'failed' || status === 'completed') && (
        <CardFooter className="pt-0 flex justify-end gap-2">
          {status === 'failed' && (
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => window.location.reload()}
            >
              <RefreshCcw className="mr-2 h-4 w-4" /> Tentar novamente
            </Button>
          )}
        </CardFooter>
      )}
    </Card>
  );
}
import React, { useEffect, useState, useRef } from 'react';
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { Loader2, RefreshCw, AlertCircle, CheckCircle, Clock } from 'lucide-react';
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { useToast } from "@/hooks/use-toast";
import VideoPlayer from './VideoPlayer';

interface ProcessingProgressProps {
  taskId: string;
  onComplete?: (result: any) => void;
  autoConnect?: boolean;
}

type ProcessingStatus = {
  connected: boolean;
  status: 'pending' | 'processing' | 'completed' | 'failed';
  progress: number;
  message: string;
  result: any;
  error: string | null;
  reconnectCount: number;
  estimatedTimeRemaining: number;
  startTime: number;
  lastUpdateTime: number;
};

/**
 * Componente para exibir progresso de processamento de vídeo em tempo real
 * Conecta-se ao WebSocket para atualizações em tempo real e mostra o resultado quando concluído
 */
export default function ProcessingProgress({ taskId, onComplete, autoConnect = true }: ProcessingProgressProps) {
  const [status, setStatus] = useState<ProcessingStatus>({
    connected: false,
    status: 'pending',
    progress: 0,
    message: 'Iniciando processamento...',
    result: null,
    error: null,
    reconnectCount: 0,
    estimatedTimeRemaining: 0,
    startTime: Date.now(),
    lastUpdateTime: Date.now()
  });
  
  const [finalVideoId, setFinalVideoId] = useState<string | null>(null);
  const socketRef = useRef<WebSocket | null>(null);
  const { toast } = useToast();
  
  // Formatar tempo estimado em minutos e segundos
  const formatEstimatedTime = (seconds: number): string => {
    if (seconds <= 0) return 'Calculando...';
    
    if (seconds < 60) {
      return `${Math.floor(seconds)} segundos`;
    } else {
      const minutes = Math.floor(seconds / 60);
      const remainingSeconds = Math.floor(seconds % 60);
      return `${minutes} min ${remainingSeconds} seg`;
    }
  };
  
  // Conectar ao WebSocket
  const connectWebSocket = () => {
    try {
      // Verificar se já existe uma conexão
      if (socketRef.current && socketRef.current.readyState === WebSocket.OPEN) {
        return;
      }
      
      // Fechar qualquer conexão existente
      if (socketRef.current) {
        socketRef.current.close();
      }
      
      // Determinar o protocolo correto baseado no HTTPS
      const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
      const wsUrl = `${protocol}//${window.location.host}/ws?taskId=${taskId}`;
      
      // Criar nova conexão
      const socket = new WebSocket(wsUrl);
      
      // Configurar handlers
      socket.onopen = () => {
        console.log('[WebSocket] Conexão estabelecida');
        setStatus(prev => ({
          ...prev,
          connected: true,
          message: 'Conectado. Aguardando atualizações...',
          reconnectCount: 0
        }));
      };
      
      socket.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data);
          
          if (data.type === 'progress') {
            setStatus(prev => ({
              ...prev,
              progress: data.progress,
              message: data.message,
              status: data.status,
              lastUpdateTime: Date.now(),
              estimatedTimeRemaining: data.estimatedTimeRemaining || 0
            }));
            
            // Se concluído, notificar
            if (data.status === 'completed') {
              setStatus(prev => ({
                ...prev,
                result: data.result,
                progress: 100
              }));
              
              if (data.result && data.result.jobId) {
                setFinalVideoId(data.result.jobId);
              }
              
              if (onComplete) {
                onComplete(data.result);
              }
              
              toast({
                title: 'Processamento concluído!',
                description: 'Seu vídeo foi processado com sucesso.',
                variant: 'default'
              });
            }
            
            // Se falhou, mostrar erro
            if (data.status === 'failed') {
              setStatus(prev => ({
                ...prev,
                error: data.error || 'Erro desconhecido durante o processamento',
                status: 'failed'
              }));
              
              toast({
                title: 'Falha no processamento',
                description: data.error || 'Ocorreu um erro durante o processamento do vídeo.',
                variant: 'destructive'
              });
            }
          }
        } catch (error) {
          console.error('[WebSocket] Erro ao processar mensagem:', error);
        }
      };
      
      socket.onerror = (error) => {
        console.error('[WebSocket] Erro na conexão:', error);
        setStatus(prev => ({
          ...prev,
          connected: false,
          message: 'Erro na conexão WebSocket. Tentando reconectar...'
        }));
      };
      
      socket.onclose = () => {
        console.log('[WebSocket] Conexão fechada');
        setStatus(prev => {
          // Se já falhou ou completou, não tente reconectar
          if (prev.status === 'completed' || prev.status === 'failed') {
            return {
              ...prev,
              connected: false
            };
          }
          
          // Caso contrário, tente reconectar
          if (prev.reconnectCount < 5) {
            // Tentar reconectar após um pequeno atraso
            setTimeout(connectWebSocket, 3000);
            
            return {
              ...prev,
              connected: false,
              reconnectCount: prev.reconnectCount + 1,
              message: `Conexão perdida. Tentando reconectar (${prev.reconnectCount + 1}/5)...`
            };
          } else {
            // Limite de tentativas atingido
            return {
              ...prev,
              connected: false,
              error: 'Não foi possível manter a conexão WebSocket. Verifique o status manualmente.',
              message: 'Falha nas tentativas de reconexão.'
            };
          }
        });
      };
      
      // Armazenar referência do socket
      socketRef.current = socket;
      
    } catch (error) {
      console.error('[WebSocket] Erro ao estabelecer conexão:', error);
      setStatus(prev => ({
        ...prev,
        connected: false,
        error: 'Erro ao estabelecer conexão WebSocket',
        message: 'Falha ao conectar para atualizações em tempo real'
      }));
    }
  };
  
  // Verificar status pelo endpoint HTTP (fallback ou verificação manual)
  const checkStatusManually = async () => {
    try {
      const response = await fetch(`/api/task-status/${taskId}`);
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || 'Erro ao verificar status');
      }
      
      setStatus(prev => ({
        ...prev,
        progress: data.progress,
        message: data.message,
        status: data.status,
        result: data.result,
        error: data.error || null,
        lastUpdateTime: Date.now(),
        estimatedTimeRemaining: data.estimatedTime || 0
      }));
      
      // Se concluído, notificar
      if (data.status === 'completed') {
        if (data.result && data.result.jobId) {
          setFinalVideoId(data.result.jobId);
        }
        
        if (onComplete) {
          onComplete(data.result);
        }
      }
      
    } catch (error: any) {
      console.error('Erro ao verificar status manualmente:', error);
      
      setStatus(prev => ({
        ...prev,
        error: error.message || 'Erro ao verificar status',
        message: 'Falha ao verificar status do processamento'
      }));
    }
  };
  
  // Conectar ao WebSocket quando o componente montar
  useEffect(() => {
    if (autoConnect && taskId) {
      connectWebSocket();
      
      // Verificar status manualmente em paralelo (como backup)
      checkStatusManually();
    }
    
    // Limpeza ao desmontar
    return () => {
      if (socketRef.current) {
        socketRef.current.close();
      }
    };
  }, [taskId, autoConnect]);
  
  // Renderizar o status atual
  return (
    <div className="space-y-6">
      {status.error && (
        <Alert variant="destructive" className="mb-4">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Erro no processamento</AlertTitle>
          <AlertDescription>{status.error}</AlertDescription>
        </Alert>
      )}
      
      {status.status !== 'completed' && status.status !== 'failed' && (
        <div className="space-y-4">
          <div className="space-y-2">
            <div className="flex items-center justify-between mb-1">
              <span className="text-sm font-medium">
                Progresso: {Math.round(status.progress)}%
              </span>
              
              <div className="text-sm text-gray-500 flex items-center">
                <Clock className="h-3 w-3 mr-1" />
                <span>
                  Tempo estimado: {formatEstimatedTime(status.estimatedTimeRemaining)}
                </span>
              </div>
            </div>
            
            <Progress value={status.progress} className="h-2 w-full" />
            
            <div className="flex items-center">
              {status.connected ? (
                <div className="flex items-center text-sm text-green-600">
                  <div className="h-2 w-2 rounded-full bg-green-500 mr-2 animate-pulse"></div>
                  Conectado
                </div>
              ) : (
                <div className="flex items-center text-sm text-orange-600">
                  <div className="h-2 w-2 rounded-full bg-orange-500 mr-2"></div>
                  Desconectado
                </div>
              )}
              
              <p className="text-sm text-gray-600 ml-4">
                {status.message}
              </p>
            </div>
          </div>
          
          <Button 
            variant="outline"
            size="sm"
            onClick={status.connected ? checkStatusManually : connectWebSocket}
            className="w-full"
          >
            {status.connected ? (
              <><RefreshCw className="mr-2 h-4 w-4" /> Verificar status</>
            ) : (
              <><RefreshCw className="mr-2 h-4 w-4" /> Reconectar</>
            )}
          </Button>
        </div>
      )}
      
      {status.status === 'completed' && finalVideoId && (
        <div className="space-y-4">
          <Alert className="bg-green-50 border-green-200">
            <CheckCircle className="h-4 w-4 text-green-600" />
            <AlertTitle>Vídeo processado com sucesso!</AlertTitle>
            <AlertDescription>
              Seu vídeo foi processado e está pronto para visualização.
            </AlertDescription>
          </Alert>
          
          <VideoPlayer 
            videoId={finalVideoId} 
            autoCheck={true}
            showDownload={true}
          />
        </div>
      )}
    </div>
  );
}
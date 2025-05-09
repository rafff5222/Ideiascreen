import { useState, useEffect } from 'react';
import { FaBug, FaMemory, FaNetworkWired, FaTerminal } from 'react-icons/fa';

interface SystemStatus {
  memory: {
    heapUsed: number;
    heapTotal: number;
    external: number;
    rss: number;
  } | null;
  apiStatus: {
    elevenlabs: boolean;
    openai: boolean;
  };
  queue: {
    active: number;
    waiting: number;
    completed: number;
    failed: number;
    total: number;
  } | null;
  serverTime: string;
}

/**
 * Componente de ferramentas de debug avançado
 * Implementa monitoramento de API, simulação de erros e diagnóstico
 */
export default function DebugTools() {
  const [visible, setVisible] = useState(false);
  const [systemStatus, setSystemStatus] = useState<SystemStatus>({
    memory: null,
    apiStatus: {
      elevenlabs: false,
      openai: false
    },
    queue: null,
    serverTime: new Date().toISOString()
  });
  const [lastErrors, setLastErrors] = useState<Array<{message: string, timestamp: string}>>([]);
  
  // Verificar status do sistema periodicamente
  useEffect(() => {
    if (!visible) return;
    
    const checkSystemStatus = async () => {
      try {
        // Verificar status das APIs
        const apiResponse = await fetch('/api/sys-status');
        const apiData = await apiResponse.json();
        
        // Obter informações de uso de memória do servidor (endpoint a ser implementado)
        const statsResponse = await fetch('/api/server-stats');
        const statsData = await statsResponse.json();
        
        setSystemStatus({
          memory: statsData.memory,
          apiStatus: {
            elevenlabs: apiData.apis.elevenlabs.configured,
            openai: apiData.apis.openai.configured
          },
          serverTime: apiData.environment.timestamp
        });
      } catch (error) {
        console.error("Erro ao obter status do sistema:", error);
      }
    };
    
    // Verificar imediatamente e depois a cada 10 segundos
    checkSystemStatus();
    const interval = setInterval(checkSystemStatus, 10000);
    
    return () => clearInterval(interval);
  }, [visible]);
  
  // Monitorar erros globalmente
  useEffect(() => {
    if (!visible) return;
    
    const errorHandler = (event: ErrorEvent) => {
      setLastErrors(prev => [
        { message: event.message, timestamp: new Date().toISOString() },
        ...prev.slice(0, 4) // Manter apenas os 5 erros mais recentes
      ]);
    };
    
    window.addEventListener('error', errorHandler);
    
    return () => window.removeEventListener('error', errorHandler);
  }, [visible]);
  
  // Simulação de erros para testes
  const simulateError = (type: string) => {
    switch (type) {
      case 'api':
        console.error("Erro simulado: API indisponível");
        throw new Error("Erro simulado: API indisponível");
      case 'network':
        console.error("Erro simulado: Falha de rede");
        // Adicionar ao mock global para testes de UI
        (window as any).mockNetworkError = true;
        throw new Error("Erro simulado: Falha de rede");
      case 'validation':
        console.error("Erro simulado: Validação falhou");
        throw new Error("Erro simulado: Campo obrigatório ausente");
      default:
        console.error("Erro genérico simulado");
        throw new Error("Erro genérico simulado");
    }
  };
  
  // Formatar bytes para exibição amigável
  const formatBytes = (bytes?: number) => {
    if (!bytes) return 'N/A';
    
    const units = ['B', 'KB', 'MB', 'GB'];
    let value = bytes;
    let unitIndex = 0;
    
    while (value > 1024 && unitIndex < units.length - 1) {
      value /= 1024;
      unitIndex++;
    }
    
    return `${value.toFixed(2)} ${units[unitIndex]}`;
  };
  
  if (!visible) {
    return (
      <button 
        onClick={() => setVisible(true)}
        className="fixed bottom-4 right-4 p-2 bg-gray-800 text-gray-200 rounded-full shadow-lg opacity-70 hover:opacity-100 z-50"
        title="Ferramentas de Debug"
      >
        <FaBug />
      </button>
    );
  }
  
  return (
    <div className="fixed bottom-4 right-4 w-80 bg-gray-900 text-gray-100 p-4 rounded-lg shadow-xl z-50 text-xs">
      <div className="flex justify-between items-center mb-3">
        <h3 className="font-bold text-sm">Ferramentas de Debug</h3>
        <button 
          onClick={() => setVisible(false)}
          className="text-gray-400 hover:text-gray-200"
        >
          ✕
        </button>
      </div>
      
      {/* Status do Sistema */}
      <div className="mb-3 border-b border-gray-700 pb-3">
        <h4 className="font-semibold mb-2 flex items-center">
          <FaNetworkWired className="mr-1" /> Status das APIs
        </h4>
        <div className="grid grid-cols-2 gap-1">
          <div>
            <span className="text-gray-400">ElevenLabs:</span>{' '}
            <span className={systemStatus.apiStatus.elevenlabs ? "text-green-400" : "text-red-400"}>
              {systemStatus.apiStatus.elevenlabs ? "✓ Disponível" : "✗ Indisponível"}
            </span>
          </div>
          <div>
            <span className="text-gray-400">OpenAI:</span>{' '}
            <span className={systemStatus.apiStatus.openai ? "text-green-400" : "text-red-400"}>
              {systemStatus.apiStatus.openai ? "✓ Disponível" : "✗ Indisponível"}
            </span>
          </div>
        </div>
      </div>
      
      {/* Uso de Memória */}
      <div className="mb-3 border-b border-gray-700 pb-3">
        <h4 className="font-semibold mb-2 flex items-center">
          <FaMemory className="mr-1" /> Uso de Memória
        </h4>
        <div>
          <div className="grid grid-cols-2 gap-1">
            <div>
              <span className="text-gray-400">Heap:</span>{' '}
              {formatBytes(systemStatus.memory?.heapUsed)} / {formatBytes(systemStatus.memory?.heapTotal)}
            </div>
            <div>
              <span className="text-gray-400">RSS:</span>{' '}
              {formatBytes(systemStatus.memory?.rss)}
            </div>
          </div>
        </div>
      </div>
      
      {/* Últimos Erros */}
      <div className="mb-3 border-b border-gray-700 pb-3">
        <h4 className="font-semibold mb-2">Últimos Erros ({lastErrors.length})</h4>
        {lastErrors.length > 0 ? (
          <div className="max-h-24 overflow-y-auto">
            {lastErrors.map((error, index) => (
              <div key={index} className="text-red-300 mb-1 text-xs">
                <div className="text-gray-400 text-xs">{new Date(error.timestamp).toLocaleTimeString()}</div>
                {error.message}
              </div>
            ))}
          </div>
        ) : (
          <div className="text-gray-500">Nenhum erro registrado</div>
        )}
      </div>
      
      {/* Ferramentas de Simulação */}
      <div className="mb-3">
        <h4 className="font-semibold mb-2 flex items-center">
          <FaTerminal className="mr-1" /> Simulação de Erros
        </h4>
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => simulateError('api')}
            className="px-2 py-1 bg-red-800 text-white rounded text-xs hover:bg-red-700"
          >
            Erro API
          </button>
          <button
            onClick={() => simulateError('network')}
            className="px-2 py-1 bg-orange-800 text-white rounded text-xs hover:bg-orange-700"
          >
            Erro Rede
          </button>
          <button
            onClick={() => simulateError('validation')}
            className="px-2 py-1 bg-yellow-800 text-white rounded text-xs hover:bg-yellow-700"
          >
            Erro Validação
          </button>
        </div>
      </div>
      
      <div className="text-right text-gray-500 text-xs">
        Server time: {new Date(systemStatus.serverTime).toLocaleTimeString()}
      </div>
    </div>
  );
}
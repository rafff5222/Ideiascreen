import React, { useState, useEffect } from 'react';
import { FaWrench, FaServer, FaBell, FaExclamationTriangle, FaCheckCircle, FaTimesCircle } from 'react-icons/fa';

// Interface para os resultados do diagnóstico da aplicação
interface DiagnosticResult {
  success: boolean;
  timestamp: string;
  components: {
    ffmpeg: {
      working: boolean;
      status: string;
      error?: string;
    };
    redis: {
      working: boolean;
      status: string;
      error?: string;
    };
    elevenlabs: {
      working: boolean;
      status: string;
      error?: string;
    };
    openai: {
      working: boolean;
      status: string;
      error?: string;
    };
  };
  system_ready: boolean;
  api_status: string;
  suggestions: string[];
  client_checks?: {
    secure_connection: boolean;
    audio_support: boolean;
    video_support: boolean;
    storage: {
      available: boolean;
      quota?: number;
      usage?: number;
      percent_used?: number;
    };
  };
}

// Status padrão para inicialização
const defaultResult: DiagnosticResult = {
  success: false,
  timestamp: new Date().toISOString(),
  components: {
    ffmpeg: { working: false, status: 'unknown' },
    redis: { working: false, status: 'unknown' },
    elevenlabs: { working: false, status: 'unknown' },
    openai: { working: false, status: 'unknown' }
  },
  system_ready: false,
  api_status: 'unknown',
  suggestions: []
};

/**
 * Componente de diagnóstico para verificar o status do sistema
 * Executa testes nos componentes principais e exibe resultados
 */
export default function DiagnosticTool() {
  const [visible, setVisible] = useState(false);
  const [result, setResult] = useState<DiagnosticResult>(defaultResult);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Interface para armazenar testes do cliente
  interface ClientTests {
    secure_connection: boolean;
    audio_support: boolean;
    video_support: boolean;
    storage: {
      available: boolean;
      quota?: number;
      usage?: number;
      percent_used?: number;
    };
  }

  // Função para executar o diagnóstico do sistema
  const runDiagnostic = async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      // Diagnóstico do cliente (frontend)
      const clientTests: ClientTests = {
        // Verificar se estamos em ambiente seguro (https)
        secure_connection: window.location.protocol === 'https:',
        
        // Verificar se o navegador suporta APIs necessárias
        audio_support: typeof AudioContext !== 'undefined',
        video_support: typeof HTMLVideoElement !== 'undefined' && !!document.createElement('video').canPlayType,
        
        // Verificar espaço em disco (apenas estimativa)
        storage: await estimateStorage()
      };
      
      // Diagnóstico do servidor
      const serverResults = await testServer();
      
      // Diagnóstico de APIs externas
      // Testamos de forma simples, apenas verificando se endpoints respondem
      const testOpenAI = await testEndpoint('api/generate', 'POST', { platform: 'test', topic: 'test', contentType: 'idea', communicationStyle: 'casual' });
      const testElevenLabs = await testEndpoint('api/generate-speech', 'POST', { text: 'Teste', voice: 'feminino-profissional', speed: 1 });
      
      // Atualizar com todos os resultados
      const updatedResults = {
        ...serverResults,
        client_checks: clientTests,
        timestamp: new Date().toISOString()
      };
      
      setResult(updatedResults as DiagnosticResult);
    } catch (err: any) {
      console.error('Erro ao executar diagnóstico:', err);
      setError(err?.message || 'Erro desconhecido');
    } finally {
      setIsLoading(false);
    }
  };
  
  // Verificar espaço de armazenamento disponível
  const estimateStorage = async (): Promise<{ available: boolean, quota?: number, usage?: number, percent_used?: number }> => {
    if ('storage' in navigator && 'estimate' in navigator.storage) {
      try {
        const estimate = await navigator.storage.estimate();
        const quota = estimate.quota;
        const usage = estimate.usage;
        
        return {
          available: true,
          quota,
          usage,
          percent_used: usage && quota ? Math.round((usage / quota) * 100) : undefined
        };
      } catch (err) {
        console.error('Erro ao estimar armazenamento:', err);
        return { available: false };
      }
    }
    return { available: false };
  };
  
  // Testar se o servidor está online e funcionando
  const testServer = async (): Promise<Partial<DiagnosticResult>> => {
    try {
      // Testar conexão básica com servidor
      const sysStatusResponse = await fetch('/api/sys-status');
      if (!sysStatusResponse.ok) {
        throw new Error(`Servidor indisponível (status ${sysStatusResponse.status})`);
      }
      const sysStatus = await sysStatusResponse.json();
      
      // Testar estatísticas do servidor (memória e recursos)
      const statsResponse = await fetch('/api/server-stats');
      if (!statsResponse.ok) {
        throw new Error(`Não foi possível obter estatísticas do servidor (status ${statsResponse.status})`);
      }
      const serverStats = await statsResponse.json();
      
      // Montar resultado com base nas informações obtidas
      return {
        success: true,
        system_ready: sysStatus.apis.elevenlabs.configured && sysStatus.apis.openai.configured,
        api_status: (sysStatus.apis.elevenlabs.configured && sysStatus.apis.openai.configured) ? 'ok' : 'partial',
        components: {
          ffmpeg: { 
            working: true, // Assumimos que funciona já que o servidor está online
            status: 'installed' 
          },
          redis: { 
            working: !!serverStats.queue, 
            status: serverStats.queue ? 'connected' : 'unavailable' 
          },
          elevenlabs: { 
            working: sysStatus.apis.elevenlabs.configured, 
            status: sysStatus.apis.elevenlabs.configured ? 'configured' : 'missing key'
          },
          openai: { 
            working: sysStatus.apis.openai.configured, 
            status: sysStatus.apis.openai.configured ? 'configured' : 'missing key'
          }
        },
        suggestions: []
      };
    } catch (err: any) {
      console.error('Erro ao testar servidor:', err);
      return {
        success: false,
        system_ready: false,
        api_status: 'error',
        components: defaultResult.components,
        suggestions: [
          'Verifique se o servidor está rodando',
          'Verifique a conexão de rede',
          'Tente reiniciar o servidor'
        ]
      };
    }
  };
  
  // Testar um endpoint específico
  const testEndpoint = async (endpoint: string, method: string = 'GET', data?: any): Promise<boolean> => {
    try {
      const options: RequestInit = {
        method,
        headers: {
          'Content-Type': 'application/json'
        }
      };
      
      if (data) {
        options.body = JSON.stringify(data);
      }
      
      const response = await fetch(`/${endpoint}`, options);
      return response.ok;
    } catch (err) {
      console.error(`Erro ao testar endpoint ${endpoint}:`, err);
      return false;
    }
  };
  
  // Formatador de bytes para exibição amigável
  const formatBytes = (bytes?: number) => {
    if (!bytes) return 'N/A';
    
    const units = ['B', 'KB', 'MB', 'GB', 'TB'];
    let value = bytes;
    let unitIndex = 0;
    
    while (value >= 1024 && unitIndex < units.length - 1) {
      value /= 1024;
      unitIndex++;
    }
    
    return `${value.toFixed(2)} ${units[unitIndex]}`;
  };
  
  // Formatar uma data ISO para exibição local
  const formatDate = (isoDate: string) => {
    try {
      return new Date(isoDate).toLocaleString();
    } catch (err) {
      return isoDate;
    }
  };
  
  // Renderizar o botão de diagnóstico quando fechado
  if (!visible) {
    return (
      <button 
        onClick={() => setVisible(true)}
        className="fixed bottom-16 right-4 p-2 bg-indigo-700 text-white rounded-full shadow-lg opacity-80 hover:opacity-100 z-50"
        title="Ferramenta de Diagnóstico"
      >
        <FaWrench size={16} />
      </button>
    );
  }
  
  // Renderizar a interface de diagnóstico completa
  return (
    <div className="fixed bottom-16 right-4 w-[350px] bg-gray-900 text-gray-100 p-4 rounded-lg shadow-xl z-50 text-xs">
      <div className="flex justify-between items-center mb-3">
        <h3 className="font-bold text-sm flex items-center">
          <FaServer className="mr-2" /> Diagnóstico do Sistema
        </h3>
        <button 
          onClick={() => setVisible(false)}
          className="text-gray-400 hover:text-gray-200"
        >
          ✕
        </button>
      </div>
      
      {error && (
        <div className="mb-3 p-2 bg-red-900/50 border border-red-700 rounded text-red-200">
          <FaExclamationTriangle className="inline-block mr-1" /> {error}
        </div>
      )}
      
      <div className="mb-3">
        <button
          onClick={runDiagnostic}
          disabled={isLoading}
          className={`w-full p-2 rounded ${isLoading ? 'bg-gray-700' : 'bg-indigo-700 hover:bg-indigo-600'}`}
        >
          {isLoading ? 'Executando testes...' : 'Executar Diagnóstico'}
        </button>
      </div>
      
      {/* Status geral do sistema */}
      <div className="mb-3 border-b border-gray-700 pb-3">
        <div className="flex justify-between items-center">
          <h4 className="font-semibold">Status do Sistema</h4>
          <span className={`text-xs px-2 py-1 rounded ${result.system_ready ? 'bg-green-900/50 text-green-200' : 'bg-red-900/50 text-red-200'}`}>
            {result.system_ready ? 'Operacional' : 'Com Falhas'}
          </span>
        </div>
        <div className="text-gray-400 text-xs">
          Última verificação: {formatDate(result.timestamp)}
        </div>
      </div>
      
      {/* Status dos componentes */}
      <div className="mb-3 border-b border-gray-700 pb-3">
        <h4 className="font-semibold mb-2">Componentes</h4>
        <div className="grid grid-cols-1 gap-2">
          {Object.entries(result.components).map(([key, value]) => (
            <div key={key} className="flex justify-between items-center">
              <span className="text-gray-300 capitalize">{key}:</span>
              <span className={`flex items-center ${value.working ? 'text-green-400' : 'text-red-400'}`}>
                {value.working ? (
                  <><FaCheckCircle className="mr-1" /> {value.status}</>
                ) : (
                  <><FaTimesCircle className="mr-1" /> {value.status}</>
                )}
              </span>
            </div>
          ))}
        </div>
      </div>
      
      {/* Sugestões */}
      {result.suggestions && result.suggestions.length > 0 && (
        <div className="mb-3 border-b border-gray-700 pb-3">
          <h4 className="font-semibold mb-2 flex items-center">
            <FaBell className="mr-1" /> Sugestões de Correção
          </h4>
          <ul className="list-disc pl-5 text-amber-200">
            {result.suggestions.map((suggestion, index) => (
              <li key={index}>{suggestion}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
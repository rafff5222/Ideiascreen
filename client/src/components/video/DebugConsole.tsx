import React, { useState, useEffect, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Terminal, XCircle, ArrowDown, Copy, CheckCircle } from 'lucide-react';

interface LogEntry {
  id: string;
  timestamp: Date;
  message: string;
  type: 'info' | 'error' | 'warning' | 'success';
}

interface DebugConsoleProps {
  logs?: LogEntry[];
  maxHeight?: string;
  showControls?: boolean;
  title?: string;
}

export default function DebugConsole({
  logs: externalLogs,
  maxHeight = '200px',
  showControls = true,
  title = 'Console de Depuração'
}: DebugConsoleProps) {
  const [logs, setLogs] = useState<LogEntry[]>(externalLogs || []);
  const [expanded, setExpanded] = useState(false);
  const [copied, setCopied] = useState(false);
  const consoleRef = useRef<HTMLDivElement>(null);
  
  // Efeito para rolar para o final quando novos logs são adicionados
  useEffect(() => {
    if (consoleRef.current) {
      consoleRef.current.scrollTop = consoleRef.current.scrollHeight;
    }
  }, [logs]);

  // Atualizar logs quando os props mudam
  useEffect(() => {
    if (externalLogs) {
      setLogs(externalLogs);
    }
  }, [externalLogs]);

  // Adicionar um log (para uso interno ou exposição como função)
  const addLog = (message: string, type: 'info' | 'error' | 'warning' | 'success' = 'info') => {
    const newLog: LogEntry = {
      id: Date.now().toString(),
      timestamp: new Date(),
      message,
      type
    };
    
    setLogs(prev => [...prev, newLog]);
  };

  // Limpar todos os logs
  const clearLogs = () => {
    setLogs([]);
  };

  // Copiar todos os logs para a área de transferência
  const copyLogs = () => {
    const formattedLogs = logs
      .map(log => `[${log.timestamp.toLocaleTimeString()}] [${log.type.toUpperCase()}] ${log.message}`)
      .join('\n');
    
    navigator.clipboard.writeText(formattedLogs)
      .then(() => {
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      })
      .catch(err => {
        console.error('Falha ao copiar logs:', err);
      });
  };

  // Exportar logs como arquivo de texto
  const exportLogs = () => {
    const formattedLogs = logs
      .map(log => `[${log.timestamp.toLocaleTimeString()}] [${log.type.toUpperCase()}] ${log.message}`)
      .join('\n');
    
    const blob = new Blob([formattedLogs], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `debug-logs-${new Date().toISOString().split('T')[0]}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  // Obter a cor baseada no tipo de log
  const getLogColor = (type: string): string => {
    switch (type) {
      case 'error':
        return 'text-red-500';
      case 'warning':
        return 'text-amber-500';
      case 'success':
        return 'text-green-500';
      default:
        return 'text-gray-300';
    }
  };

  return (
    <Card className="w-full">
      <CardHeader className="pb-2 flex flex-row items-center justify-between">
        <CardTitle className="text-sm flex items-center gap-2">
          <Terminal className="h-4 w-4 text-primary" />
          {title}
        </CardTitle>
        {showControls && (
          <div className="flex items-center gap-1">
            <Button
              variant="ghost"
              size="icon"
              className="h-6 w-6"
              onClick={() => setExpanded(!expanded)}
              title={expanded ? "Minimizar" : "Expandir"}
            >
              <ArrowDown className={`h-4 w-4 transition-transform ${expanded ? 'rotate-180' : ''}`} />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="h-6 w-6"
              onClick={copyLogs}
              title="Copiar Logs"
            >
              {copied ? (
                <CheckCircle className="h-4 w-4 text-green-500" />
              ) : (
                <Copy className="h-4 w-4" />
              )}
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="h-6 w-6"
              onClick={clearLogs}
              title="Limpar Console"
            >
              <XCircle className="h-4 w-4" />
            </Button>
          </div>
        )}
      </CardHeader>
      <CardContent>
        <div
          ref={consoleRef}
          className="font-mono text-xs bg-gray-900 rounded-md p-2 overflow-y-auto"
          style={{ maxHeight: expanded ? '400px' : maxHeight }}
        >
          {logs.length === 0 ? (
            <p className="text-gray-500 italic p-2">Nenhum log disponível.</p>
          ) : (
            logs.map((log) => (
              <div key={log.id} className="py-1 border-b border-gray-800 last:border-0">
                <span className="text-gray-500">[{log.timestamp.toLocaleTimeString()}]</span>{' '}
                <span className={getLogColor(log.type)}>[{log.type.toUpperCase()}]</span>{' '}
                <span className="text-gray-200">{log.message}</span>
              </div>
            ))
          )}
        </div>
        
        {logs.length > 0 && showControls && (
          <div className="flex justify-end mt-2">
            <Button 
              variant="outline" 
              size="sm" 
              onClick={exportLogs}
              className="text-xs"
            >
              Exportar Logs
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
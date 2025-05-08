import { useEffect } from 'react';
import { apiRequest } from '@/lib/queryClient';

/**
 * Componente para monitoramento contínuo de erros JavaScript
 * Registra erros no console e envia para um endpoint de log
 */
export default function ErrorMonitor() {
  useEffect(() => {
    // Handler para erros globais na aplicação
    const errorHandler = (event: ErrorEvent) => {
      const errorData = {
        message: event.message,
        source: event.filename,
        lineno: event.lineno,
        colno: event.colno,
        error: event.error ? event.error.toString() : 'Unknown error',
        stack: event.error?.stack || 'No stack trace available',
        url: window.location.href,
        userAgent: navigator.userAgent,
        timestamp: new Date().toISOString(),
        viewportSize: {
          width: window.innerWidth,
          height: window.innerHeight
        }
      };

      // Registra o erro no console para debug
      console.error('Erro detectado:', errorData);

      // Envia para endpoint de log de erros
      apiRequest('POST', '/api/error-log', errorData)
        .catch(err => {
          // Silenciosamente falha se não conseguir registrar o erro
          console.warn('Não foi possível registrar o erro:', err);
        });

      // Permite que outros handlers também processem o erro
      return false;
    };

    // Handler para promessas não tratadas
    const unhandledRejectionHandler = (event: PromiseRejectionEvent) => {
      const rejectionData = {
        message: event.reason?.message || 'Promise rejection',
        reason: event.reason ? event.reason.toString() : 'Unknown reason',
        stack: event.reason?.stack || 'No stack trace available',
        url: window.location.href,
        userAgent: navigator.userAgent,
        timestamp: new Date().toISOString()
      };

      // Registra a rejeição não tratada no console
      console.error('Promessa não tratada:', rejectionData);

      // Envia para endpoint de log de erros
      apiRequest('POST', '/api/error-log', {
        type: 'unhandledRejection',
        ...rejectionData
      }).catch(() => {
        // Ignorar falhas ao registrar
      });
    };

    // Adiciona os handlers
    window.addEventListener('error', errorHandler);
    window.addEventListener('unhandledrejection', unhandledRejectionHandler);

    // Registra o monitoramento
    console.log('Monitoramento de erros inicializado');

    // Cleanup
    return () => {
      window.removeEventListener('error', errorHandler);
      window.removeEventListener('unhandledrejection', unhandledRejectionHandler);
    };
  }, []);

  // Este componente não renderiza nada
  return null;
}
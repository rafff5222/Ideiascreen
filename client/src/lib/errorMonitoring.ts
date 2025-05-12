/**
 * Sistema simplificado de monitoramento de erros
 * Envia erros para o backend para registro e análise
 */

/**
 * Inicializa o sistema de monitoramento de erros
 */
export function initErrorMonitoring() {
  // Captura erros não tratados
  window.onerror = function(msg, url, line, column, error) {
    sendErrorToServer({
      type: 'js_error',
      message: msg?.toString() || 'Unknown error',
      source: url,
      line,
      column,
      stack: error?.stack,
      userAgent: navigator.userAgent,
      timestamp: new Date().toISOString()
    });
    
    // Permitir que o comportamento padrão ocorra
    return false;
  };
  
  // Captura rejeições de promise não tratadas
  window.addEventListener('unhandledrejection', function(event) {
    sendErrorToServer({
      type: 'unhandled_promise',
      message: event.reason?.message || 'Unhandled Promise Rejection',
      stack: event.reason?.stack,
      userAgent: navigator.userAgent,
      timestamp: new Date().toISOString()
    });
  });
  
  console.log('Monitoramento de erros inicializado');
}

/**
 * Envia o erro para o servidor
 */
function sendErrorToServer(errorData: any) {
  try {
    fetch('/api/error-log', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(errorData),
      // Não aguardar resposta para não atrasar
      keepalive: true
    }).catch(err => {
      console.error('Falha ao registrar erro:', err);
    });
  } catch (e) {
    // Evitar loops de erro
    console.error('Falha ao enviar erro para o servidor:', e);
  }
}

/**
 * Envia um erro manualmente
 */
export function logError(error: Error | string, context?: any) {
  const errorData = {
    type: 'manual',
    message: error instanceof Error ? error.message : error,
    stack: error instanceof Error ? error.stack : undefined,
    context,
    userAgent: navigator.userAgent,
    timestamp: new Date().toISOString()
  };
  
  sendErrorToServer(errorData);
}
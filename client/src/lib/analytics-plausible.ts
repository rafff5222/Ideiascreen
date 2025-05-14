/**
 * Analytics utilizando Plausible.io - alternativa leve e respeitosa com privacidade
 * Não requer cookies e é compatível com bloqueadores de anúncios
 */

// Interface para encapsular as funcionalidades do Plausible
interface PlausibleInterface {
  init: () => void;
  trackPageView: (url?: string) => void;
  trackEvent: (name: string, props?: Record<string, string | number | boolean>) => void;
}

// Função auxiliar para verificar se estamos em produção
const isProduction = (): boolean => {
  return window.location.hostname !== 'localhost' && 
         !window.location.hostname.includes('127.0.0.1') &&
         !window.location.hostname.includes('.repl.co');
};

// Implementação do Analytics
export const plausibleAnalytics: PlausibleInterface = {
  // Inicializa o Plausible
  init: () => {
    // Se não estiver em produção, apenas log para debug
    if (!isProduction()) {
      console.log('Plausible Analytics inicializado');
      return;
    }

    // Carrega o script do Plausible (versão hospedada pela própria página)
    const script = document.createElement('script');
    script.defer = true;
    script.dataset.domain = window.location.hostname;
    script.src = "https://plausible.io/js/script.js";
    document.head.appendChild(script);
  },

  // Rastreia visualização de página
  trackPageView: (url?: string) => {
    // Se não estiver em produção, apenas log para debug
    if (!isProduction()) {
      console.log(`Plausible: Página visualizada: ${url || window.location.pathname}`);
      return;
    }

    // Se o script do Plausible estiver carregado, rastreia a visualização
    if (window.plausible) {
      window.plausible('pageview', { u: url });
    }
  },

  // Rastreia evento personalizado
  trackEvent: (name: string, props?: Record<string, string | number | boolean>) => {
    // Se não estiver em produção, apenas log para debug
    if (!isProduction()) {
      console.log(`Plausible: Evento "${name}"`, props);
      return;
    }

    // Se o script do Plausible estiver carregado, rastreia o evento
    if (window.plausible) {
      window.plausible(name, { props });
    }
  }
};

// Adiciona o tipo ao objeto Window global
declare global {
  interface Window {
    plausible?: (event: string, options?: { u?: string, props?: Record<string, any> }) => void;
  }
}
import { useEffect } from 'react';
import { useLocation } from 'wouter';

// Definições de tipagem para interface global
declare global {
  interface Window {
    trackEvent?: (event: string, data?: Record<string, any>) => void;
  }
}

/**
 * Sistema de análise próprio que não depende de Google Analytics
 * - Rastreia navegação, eventos e interações
 * - Mantém dados do usuário sob seu controle
 * - Funciona sem cookies de terceiros
 */
export default function PrivateAnalytics() {
  const [location] = useLocation();

  // Rastreia eventos e métricas
  const trackEvent = (event: string, data: Record<string, any> = {}) => {
    try {
      // Em produção, aqui enviaríamos para uma API real
      // Simulação de envio para API
      console.log('Analytics:', {
        event,
        path: window.location.pathname,
        timestamp: new Date().toISOString(),
        ...data
      });
      
      // Aqui seria o fetch para uma API real:
      // fetch('/api/analytics', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify({
      //     event,
      //     path: window.location.pathname,
      //     timestamp: new Date().toISOString(),
      //     ...data
      //   })
      // });
    } catch (error) {
      console.error('Erro ao enviar evento de analytics:', error);
    }
  };

  // Rastreia mudança de página
  useEffect(() => {
    trackEvent('page_view', { 
      path: location,
      referrer: document.referrer,
      title: document.title
    });
  }, [location]);
  
  // Configura tracking de interação inicial
  useEffect(() => {
    // Rastreia primeiro clique (indicativo de engagement)
    const handleFirstClick = () => {
      trackEvent('first_engagement', { type: 'click' });
      document.removeEventListener('click', handleFirstClick);
    };
    
    // Rastreia scroll significativo
    const handleSignificantScroll = () => {
      // Apenas rastreia se o usuário rolou pelo menos 25% da página
      const scrollPercentage = Math.round(
        (window.scrollY / (document.body.scrollHeight - window.innerHeight)) * 100
      );
      
      if (scrollPercentage >= 25) {
        trackEvent('significant_scroll', { percentage: scrollPercentage });
        window.removeEventListener('scroll', handleSignificantScroll);
      }
    };
    
    // Rastreia tempo na página
    const startTime = Date.now();
    const handleBeforeUnload = () => {
      const timeSpentSeconds = Math.round((Date.now() - startTime) / 1000);
      trackEvent('session_duration', { seconds: timeSpentSeconds });
    };
    
    // Rastreia cliques em elementos importantes
    const handleElementClicks = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      
      // Detecta cliques em botões de CTA
      if (target.matches('button.btn-premium, .pricing-btn, a.cta-link')) {
        const buttonText = target.textContent?.trim();
        const buttonId = target.id || '';
        const classList = Array.from(target.classList).join(' ');
        
        trackEvent('cta_click', { 
          text: buttonText, 
          id: buttonId,
          classes: classList
        });
      }
      
      // Detecta cliques em planos
      if (target.closest('.plano-card')) {
        const planCard = target.closest('.plano-card') as HTMLElement;
        const planName = planCard.querySelector('h3')?.textContent?.trim() || 'desconhecido';
        
        trackEvent('plan_click', { plan: planName });
      }
    };
    
    // Adiciona todos os event listeners
    document.addEventListener('click', handleFirstClick, { once: true });
    window.addEventListener('scroll', handleSignificantScroll, { passive: true });
    window.addEventListener('beforeunload', handleBeforeUnload);
    document.addEventListener('click', handleElementClicks);
    
    // Rastreia carregamento inicial
    trackEvent('page_load', { 
      load_time: window.performance?.timing?.domContentLoadedEventEnd - 
                 window.performance?.timing?.navigationStart || 0
    });
    
    // Limpa event listeners
    return () => {
      document.removeEventListener('click', handleFirstClick);
      window.removeEventListener('scroll', handleSignificantScroll);
      window.removeEventListener('beforeunload', handleBeforeUnload);
      document.removeEventListener('click', handleElementClicks);
    };
  }, []);
  
  // Configura API pública para outros componentes
  useEffect(() => {
    // Expõe a função de tracking globalmente para outros componentes
    window.trackEvent = trackEvent;
    
    return () => {
      // @ts-ignore - Para evitar erro de tipagem ao fazer delete
      delete window.trackEvent;
    };
  }, []);
  
  // Este componente não renderiza nada visualmente
  return null;
}
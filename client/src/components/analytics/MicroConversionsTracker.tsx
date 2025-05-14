import { useEffect } from 'react';

// Definições de tipagem para interface global
declare global {
  interface Window {
    microConversionsInitialized?: boolean;
    trackMicroConversion?: (event: string, data: any) => void;
  }
}

/**
 * Componente aprimorado para rastreamento de micro-conversões
 * Monitora interações sutis que demonstram interesse, engajamento
 * e intenção de compra no site
 */
export default function MicroConversionsTracker() {
  useEffect(() => {
    // Configura endpoint para envio de eventos - precisa estar no escopo global do useEffect
    const analyticsEndpoint = '/api/analytics';
    
    // Configuração e inicialização do rastreador
    const initializeTracker = () => {
      // Evita duplicar o rastreamento
      if (window.microConversionsInitialized) return;
      window.microConversionsInitialized = true;
      
      // Rastreia tempo na página
      let pageLoadTime = Date.now();
      let lastTrackedTimeOnPage = 0;
      
      // Intervalo para rastrear tempo na página (a cada 30 segundos)
      setInterval(() => {
        const timeOnPageSeconds = Math.floor((Date.now() - pageLoadTime) / 1000);
        
        // Evita enviar o mesmo tempo múltiplas vezes
        if (timeOnPageSeconds > lastTrackedTimeOnPage + 25) {
          trackEvent('time_on_page', {
            path: window.location.pathname,
            seconds: timeOnPageSeconds
          });
          
          lastTrackedTimeOnPage = timeOnPageSeconds;
        }
      }, 30000);
      
      // Configura rastreamentos específicos
      trackPageView();
      trackScrollDepth();
      trackHovers();
      trackClicks();
      trackFormInteractions();
      trackTextSelection();
    };
    
    // Rastreia visualização de página
    const trackPageView = () => {
      trackEvent('page_viewed', {
        path: window.location.pathname
      });
    };
    
    // Rastreia profundidade de rolagem
    const trackScrollDepth = () => {
      let maxScrollPercentage = 0;
      let scrollDepthsTracked = new Set();
      
      window.addEventListener('scroll', () => {
        // Calcula a porcentagem de rolagem
        const scrollTop = window.scrollY;
        const docHeight = Math.max(
          document.body.scrollHeight, 
          document.body.offsetHeight, 
          document.documentElement.clientHeight,
          document.documentElement.scrollHeight, 
          document.documentElement.offsetHeight
        );
        const winHeight = window.innerHeight;
        const scrollPercent = (scrollTop / (docHeight - winHeight)) * 100;
        
        // Atualiza máximo scroll
        maxScrollPercentage = Math.max(maxScrollPercentage, scrollPercent);
        
        // Rastreia marcos específicos (25%, 50%, 75%, 90%)
        const scrollThresholds = [25, 50, 75, 90];
        
        scrollThresholds.forEach(threshold => {
          if (scrollPercent >= threshold && !scrollDepthsTracked.has(threshold)) {
            scrollDepthsTracked.add(threshold);
            
            trackEvent('scroll_depth', {
              path: window.location.pathname,
              depth: `${threshold}%`
            });
          }
        });
      }, { passive: true });
      
      // Rastreio ao sair da página
      window.addEventListener('beforeunload', () => {
        // Arredonda para o valor mais próximo
        const finalDepth = Math.round(maxScrollPercentage);
        
        // Envia evento apenas se for significativamente diferente do último
        if (finalDepth > 0 && !scrollDepthsTracked.has(finalDepth)) {
          // Use sendBeacon para garantir que o evento seja enviado mesmo ao sair
          navigator.sendBeacon(analyticsEndpoint, JSON.stringify({
            event: 'final_scroll_depth',
            data: {
              path: window.location.pathname,
              depth: `${finalDepth}%`
            },
            timestamp: new Date().toISOString()
          }));
        }
      });
    };
    
    // Rastreia hoveres em elementos importantes
    const trackHovers = () => {
      // Elementos importantes para rastrear hover
      const importantSelectors = [
        '.cta-button', 
        '.buy-button', 
        '.hero-cta',
        '.plan-card',
        '.premium-plan',
        '.feature-card',
        '.pricing-table'
      ];
      
      // Cria o seletor combinado
      const combinedSelector = importantSelectors.join(', ');
      
      // Elementos rastreados (para evitar duplicatas)
      const hoveredElements = new Set();
      
      // Delega eventos de hover
      document.addEventListener('mouseover', (e) => {
        const target = e.target as HTMLElement;
        const importantElement = target.closest(combinedSelector) as HTMLElement;
        
        if (importantElement && !hoveredElements.has(importantElement)) {
          // Adiciona à lista de elementos rastreados
          hoveredElements.add(importantElement);
          
          // Identifica o tipo do elemento
          let elementType = 'unknown';
          if (importantElement.classList.contains('cta-button') || 
              importantElement.classList.contains('buy-button') ||
              importantElement.classList.contains('hero-cta')) {
            elementType = 'cta';
          } else if (importantElement.classList.contains('plan-card') ||
                     importantElement.classList.contains('premium-plan') ||
                     importantElement.classList.contains('pricing-table')) {
            elementType = 'pricing';
          } else if (importantElement.classList.contains('feature-card')) {
            elementType = 'feature';
          }
          
          // Rastreia o evento
          trackEvent('element_hover', {
            element_type: elementType,
            element_id: importantElement.id || undefined,
            element_text: importantElement.textContent?.trim().substring(0, 50) || undefined
          });
        }
      }, { passive: true });
    };
    
    // Rastreia cliques em elementos importantes
    const trackClicks = () => {
      // Primeiro clique rastreado separadamente como engajamento inicial
      let hasTrackedFirstClick = false;
      
      document.addEventListener('click', (e) => {
        // Rastrear primeiro engajamento
        if (!hasTrackedFirstClick) {
          hasTrackedFirstClick = true;
          trackEvent('first_engagement', {
            path: window.location.pathname,
            type: 'click'
          });
        }
        
        const target = e.target as HTMLElement;
        
        // Rastreamento específico para CTAs e botões de compra
        if (target.closest('.cta-button, .buy-button, .hero-cta, [data-cta="primary"]')) {
          trackEvent('cta_click', {
            button_text: target.textContent?.trim() || 'unknown',
            location: window.location.pathname
          });
        }
        
        // Rastreamento para cards de planos
        if (target.closest('.plan-card, .pricing-table, [data-plan]')) {
          const planElement = target.closest('.plan-card, .pricing-table, [data-plan]') as HTMLElement;
          let planName = 'unknown';
          
          // Tenta identificar o plano
          if (planElement.hasAttribute('data-plan')) {
            planName = planElement.getAttribute('data-plan') || 'unknown';
          } else if (planElement.classList.contains('premium-plan') || 
                    planElement.classList.contains('plan-premium')) {
            planName = 'premium';
          } else if (planElement.classList.contains('basic-plan') || 
                    planElement.classList.contains('plan-basic')) {
            planName = 'basic';
          } else if (planElement.classList.contains('ultimate-plan') || 
                    planElement.classList.contains('plan-ultimate')) {
            planName = 'ultimate';
          }
          
          trackEvent('plan_interest', {
            plan_name: planName,
            interaction_type: 'click'
          });
        }
      }, { passive: true });
    };
    
    // Rastreia interações com formulários
    const trackFormInteractions = () => {
      // Rastreia envios de formulário
      document.addEventListener('submit', (e) => {
        const form = e.target as HTMLFormElement;
        
        trackEvent('form_submit', {
          form_id: form.id || 'unnamed-form',
          form_action: form.action
        });
      });
      
      // Rastreia cliques em campos do formulário
      document.addEventListener('focus', (e) => {
        if (e.target instanceof HTMLInputElement || 
            e.target instanceof HTMLTextAreaElement || 
            e.target instanceof HTMLSelectElement) {
          
          const field = e.target;
          const form = field.closest('form');
          
          if (form) {
            trackEvent('form_field_focus', {
              form_id: form.id || 'unnamed-form',
              field_type: field.type,
              field_name: field.name || 'unnamed-field'
            });
          }
        }
      }, true);
    };
    
    // Rastreia seleção de texto (indica interesse no conteúdo)
    const trackTextSelection = () => {
      document.addEventListener('selectionchange', () => {
        const selection = document.getSelection();
        
        if (selection && selection.toString().trim().length > 10) {
          trackEvent('text_selection', {
            selection_length: selection.toString().length,
            path: window.location.pathname
          });
        }
      });
    };
    
    // Função para rastrear qualquer evento
    const trackEvent = (event: string, data: any) => {
      try {
        // Combina dados com timestamp
        const eventData = {
          ...data,
          timestamp: new Date().toISOString()
        };
        
        // Registra no console para debugging
        console.log('Micro Conversão:', {
          event,
          ...eventData
        });
        
        // Envia para o servidor - em produção, usaria o método POST com fetch
        fetch(analyticsEndpoint, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            event,
            data: eventData
          }),
          // Usa keepalive para garantir que a solicitação seja concluída
          keepalive: true
        }).catch(err => {
          console.error('Erro ao enviar evento de micro conversão:', err);
        });
      } catch (error) {
        console.error('Erro ao processar micro conversão:', error);
      }
    };
    
    // Adiciona para o objeto window no TypeScript
    declare global {
      interface Window {
        microConversionsInitialized: boolean;
        trackMicroConversion: (event: string, data: any) => void;
      }
    }
    
    // Exporta funções para uso externo
    window.trackMicroConversion = trackEvent;
    
    // Inicializa o rastreador
    initializeTracker();
    
    // Não é necessário cleanup pois queremos que o rastreamento continue
    // mesmo que o componente seja desmontado
  }, []);
  
  // Este componente não renderiza nada visualmente
  return null;
}
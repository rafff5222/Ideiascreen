import { useEffect } from 'react';

/**
 * Componente para rastreamento detalhado de micro-conversões
 * Monitora interações sutis que demonstram interesse e engajamento
 */
export default function MicroConversionTracker() {
  useEffect(() => {
    // Função de rastreamento principal
    const trackMicroConversion = (event: string, element?: HTMLElement, additionalData?: any) => {
      // Cria o objeto de evento
      const eventData = {
        event,
        timestamp: new Date().toISOString(),
        path: window.location.pathname,
        element: element ? element.tagName + (element.id ? `#${element.id}` : '') : undefined,
        ...additionalData
      };
      
      // Registra no console para debugging
      console.log('Micro Conversão:', eventData);
      
      // Envio para servidor (usando Beacon API para não bloquear navegação)
      if (navigator.sendBeacon) {
        navigator.sendBeacon('/api/analytics', JSON.stringify(eventData));
      } else {
        // Fallback para fetch
        fetch('/api/analytics', {
          method: 'POST',
          body: JSON.stringify(eventData),
          keepalive: true
        }).catch(err => console.error('Erro ao registrar evento:', err));
      }
      
      // Armazena localmente para análise do lado do cliente
      const localEvents = JSON.parse(localStorage.getItem('microConversions') || '[]');
      localEvents.push(eventData);
      localStorage.setItem('microConversions', JSON.stringify(localEvents.slice(-100))); // Mantém apenas os 100 últimos
    };
    
    // 1. Rastreamento de hover em elementos importantes
    const setupHoverTracking = () => {
      const importantElements = [
        { selector: '.video-demo', event: 'hover_video_demo' },
        { selector: '.feature-item', event: 'hover_feature' },
        { selector: '.testimonial-item', event: 'hover_testimonial' },
        { selector: '.btn-plan', event: 'hover_plan_button' },
        { selector: '.pricing-card', event: 'hover_pricing_card' }
      ];
      
      importantElements.forEach(({ selector, event }) => {
        document.querySelectorAll(selector).forEach(element => {
          element.addEventListener('mouseenter', () => {
            trackMicroConversion(event, element as HTMLElement);
          });
        });
      });
    };
    
    // 2. Rastreamento de tempo de leitura em textos longos
    const setupReadingTimeTracking = () => {
      const longTextElements = document.querySelectorAll('.long-text, article, .feature-description');
      
      longTextElements.forEach(element => {
        let inViewTime = 0;
        let interval: number | null = null;
        
        const startTracking = () => {
          if (interval) return;
          
          interval = window.setInterval(() => {
            inViewTime += 0.1;
            
            // Após 5 segundos de leitura, consideramos uma micro-conversão
            if (inViewTime >= 5 && inViewTime % 5 < 0.11) {
              trackMicroConversion('content_read', element as HTMLElement, {
                readTimeSeconds: Math.floor(inViewTime),
                contentType: element.classList.contains('feature-description') ? 'feature' : 'article'
              });
            }
          }, 100);
        };
        
        const stopTracking = () => {
          if (interval) {
            clearInterval(interval);
            interval = null;
          }
        };
        
        // Usar Intersection Observer para detectar quando o elemento está visível
        const observer = new IntersectionObserver((entries) => {
          entries.forEach(entry => {
            if (entry.isIntersecting) {
              startTracking();
            } else {
              stopTracking();
            }
          });
        }, { threshold: 0.5 });
        
        observer.observe(element);
      });
    };
    
    // 3. Rastreamento de scroll profundo
    const setupScrollDepthTracking = () => {
      let deepestScroll = 0;
      let lastReportedDepth = 0;
      
      window.addEventListener('scroll', () => {
        // Calcula a porcentagem de rolagem
        const scrollHeight = document.documentElement.scrollHeight - window.innerHeight;
        const scrollPercent = Math.round((window.scrollY / scrollHeight) * 100);
        
        // Atualiza a rolagem mais profunda
        if (scrollPercent > deepestScroll) {
          deepestScroll = scrollPercent;
          
          // Reporta a cada 25% de profundidade
          const currentDepthMilestone = Math.floor(deepestScroll / 25) * 25;
          if (currentDepthMilestone > lastReportedDepth) {
            lastReportedDepth = currentDepthMilestone;
            trackMicroConversion('scroll_depth', undefined, {
              depth: `${currentDepthMilestone}%`
            });
          }
        }
      });
    };
    
    // 4. Rastreamento de cliques em elementos específicos (não CTAs primários)
    const setupSecondaryClickTracking = () => {
      const secondaryElements = [
        { selector: '.read-more', event: 'click_read_more' },
        { selector: '.video-thumbnail', event: 'click_video_thumbnail' },
        { selector: '.faq-item', event: 'click_faq' },
        { selector: '.social-share', event: 'click_social_share' },
        { selector: '.related-content', event: 'click_related' }
      ];
      
      secondaryElements.forEach(({ selector, event }) => {
        document.querySelectorAll(selector).forEach(element => {
          element.addEventListener('click', () => {
            trackMicroConversion(event, element as HTMLElement);
          });
        });
      });
    };
    
    // 5. Rastreamento de formulários abandonados
    const setupFormAbandonmentTracking = () => {
      document.querySelectorAll('form').forEach(form => {
        const inputs = form.querySelectorAll('input, textarea, select');
        let interacted = false;
        
        inputs.forEach(input => {
          input.addEventListener('input', () => {
            if (!interacted) {
              interacted = true;
              trackMicroConversion('form_started', form as HTMLFormElement, {
                formType: form.getAttribute('id') || form.getAttribute('name') || 'unknown'
              });
            }
          });
        });
        
        document.addEventListener('visibilitychange', () => {
          if (document.visibilityState === 'hidden' && interacted) {
            // Usuário saiu da página com formulário parcialmente preenchido
            trackMicroConversion('form_abandoned', form as HTMLFormElement, {
              formType: form.getAttribute('id') || form.getAttribute('name') || 'unknown'
            });
          }
        });
      });
    };
    
    // 6. Tempo total na página
    const setupTimeOnPageTracking = () => {
      let startTime = Date.now();
      let lastTrackedTime = 0;
      
      // Reporta a cada 30 segundos
      const interval = setInterval(() => {
        const timeOnPageSeconds = Math.floor((Date.now() - startTime) / 1000);
        
        // Reporta a cada 30 segundos
        if (timeOnPageSeconds - lastTrackedTime >= 30) {
          lastTrackedTime = timeOnPageSeconds;
          trackMicroConversion('time_on_page', undefined, {
            seconds: timeOnPageSeconds
          });
        }
      }, 5000);
      
      // Limpa o intervalo quando o componente é desmontado
      return () => clearInterval(interval);
    };
    
    // Inicia todos os rastreamentos
    setupHoverTracking();
    setupReadingTimeTracking();
    setupScrollDepthTracking();
    setupSecondaryClickTracking();
    setupFormAbandonmentTracking();
    setupTimeOnPageTracking();
    
    // Registro único de visualização de página para análise futura
    trackMicroConversion('page_viewed');
    
    // Cleanup ao desmontar
    return () => {
      // Os event listeners serão limpos automaticamente quando o elemento for removido
      // Os intervalos são limpos em suas respectivas funções
    };
  }, []);
  
  // Este componente não renderiza nada visualmente
  return null;
}
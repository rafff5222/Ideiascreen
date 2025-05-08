import { useEffect } from 'react';

/**
 * Componente de Carregamento por Estágios
 * Otimiza o carregamento da página dando prioridade aos elementos críticos
 * e carregando elementos não-críticos conforme necessário
 */
export default function StagedLoading() {
  useEffect(() => {
    // Adiciona estilos para elementos lazy
    const addLazyLoadStyles = () => {
      if (document.getElementById('lazy-load-styles')) return;
      
      const styleElement = document.createElement('style');
      styleElement.id = 'lazy-load-styles';
      styleElement.textContent = `
        img.lazy, video.lazy, iframe.lazy {
          opacity: 0;
          transition: opacity 0.3s ease-in;
        }
        
        img.lazy.loaded, video.lazy.loaded, iframe.lazy.loaded {
          opacity: 1;
        }
        
        .lazy-section {
          opacity: 0;
          transform: translateY(20px);
          transition: opacity 0.5s ease, transform 0.5s ease;
        }
        
        .lazy-section.loaded {
          opacity: 1;
          transform: translateY(0);
        }
      `;
      document.head.appendChild(styleElement);
    };
    
    // Transforma imagens em lazy-load
    const setupLazyLoadImages = () => {
      const images = document.querySelectorAll('img:not(.lazy):not(.no-lazy)');
      
      images.forEach(img => {
        if (img.classList.contains('lazy') || img.classList.contains('no-lazy')) return;
        
        const src = img.getAttribute('src');
        if (!src) return;
        
        img.classList.add('lazy');
        img.setAttribute('data-src', src);
        img.setAttribute('src', 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAxMDAgMTAwIiBwcmVzZXJ2ZUFzcGVjdFJhdGlvPSJ4TWlkWU1pZCI+PGcgZmlsbD0ibm9uZSIgZmlsbC1ydWxlPSJub256ZXJvIiBzdHJva2U9Im5vbmUiIHN0cm9rZS13aWR0aD0iMSIgc3Ryb2tlLWxpbmVjYXA9ImJ1dHQiIHN0cm9rZS1saW5lam9pbj0ibWl0ZXIiIHN0cm9rZS1taXRlcmxpbWl0PSIxMCIgc3Ryb2tlLWRhc2hhcnJheT0iIiBzdHJva2UtZGFzaG9mZnNldD0iMCIgZm9udC1mYW1pbHk9Im5vbmUiIGZvbnQtd2VpZ2h0PSJub25lIiBmb250LXNpemU9Im5vbmUiIHRleHQtYW5jaG9yPSJub25lIiBzdHlsZT0ibWl4LWJsZW5kLW1vZGU6IG5vcm1hbCI+PHJlY3QgeD0iMCIgeT0iMCIgd2lkdGg9IjEwMCIgaGVpZ2h0PSIxMDAiIGZpbGw9IiNmM2YzZjMiPjwvcmVjdD48L2c+PC9zdmc+');
      });
      
      // Faz o mesmo para vídeos e iframes
      const videos = document.querySelectorAll('video:not(.lazy):not(.no-lazy)');
      videos.forEach(video => {
        if (video.classList.contains('lazy') || video.classList.contains('no-lazy')) return;
        
        const src = video.getAttribute('src');
        if (!src) return;
        
        video.classList.add('lazy');
        video.setAttribute('data-src', src);
        video.setAttribute('src', '');
      });
      
      const iframes = document.querySelectorAll('iframe:not(.lazy):not(.no-lazy)');
      iframes.forEach(iframe => {
        if (iframe.classList.contains('lazy') || iframe.classList.contains('no-lazy')) return;
        
        const src = iframe.getAttribute('src');
        if (!src) return;
        
        iframe.classList.add('lazy');
        iframe.setAttribute('data-src', src);
        iframe.setAttribute('src', 'about:blank');
      });
    };
    
    // Define seções como lazy-load
    const setupLazySections = () => {
      const nonCriticalSections = document.querySelectorAll('.section:not(:first-child), .testimonials, .faq, .footer');
      
      nonCriticalSections.forEach(section => {
        if (!section.classList.contains('lazy-section')) {
          section.classList.add('lazy-section');
        }
      });
    };
    
    // Carrega elementos conforme o scroll
    const lazyLoad = () => {
      // Carrega imagens
      const lazyImages = document.querySelectorAll('img.lazy:not(.loaded)');
      lazyImages.forEach(img => {
        if (isElementInViewport(img)) {
          const src = img.getAttribute('data-src');
          if (src) {
            img.setAttribute('src', src);
            img.classList.add('loaded');
          }
        }
      });
      
      // Carrega vídeos
      const lazyVideos = document.querySelectorAll('video.lazy:not(.loaded)');
      lazyVideos.forEach(video => {
        if (isElementInViewport(video)) {
          const src = video.getAttribute('data-src');
          if (src) {
            video.setAttribute('src', src);
            video.classList.add('loaded');
          }
        }
      });
      
      // Carrega iframes
      const lazyIframes = document.querySelectorAll('iframe.lazy:not(.loaded)');
      lazyIframes.forEach(iframe => {
        if (isElementInViewport(iframe)) {
          const src = iframe.getAttribute('data-src');
          if (src) {
            iframe.setAttribute('src', src);
            iframe.classList.add('loaded');
          }
        }
      });
      
      // Revela seções
      const lazySections = document.querySelectorAll('.lazy-section:not(.loaded)');
      lazySections.forEach(section => {
        if (isElementInViewport(section, -100)) {
          section.classList.add('loaded');
        }
      });
    };
    
    // Verifica se o elemento está visível na viewport
    const isElementInViewport = (el: Element, offset = 0): boolean => {
      const rect = el.getBoundingClientRect();
      return (
        rect.top <= (window.innerHeight || document.documentElement.clientHeight) + offset &&
        rect.left <= (window.innerWidth || document.documentElement.clientWidth) &&
        rect.bottom >= 0 - offset &&
        rect.right >= 0
      );
    };
    
    // Implementa carregamento por prioridade
    const implementPriorityLoading = () => {
      // Adiciona atributos de preload para recursos críticos
      const criticalResources = [
        { type: 'style', href: '/assets/css/main.css' },
        { type: 'script', href: '/assets/js/main.js' },
        { type: 'font', href: '/assets/fonts/inter.woff2' }
      ];
      
      criticalResources.forEach(resource => {
        if (document.querySelector(`link[href="${resource.href}"]`)) return;
        
        const link = document.createElement('link');
        link.rel = 'preload';
        link.href = resource.href;
        link.as = resource.type;
        
        if (resource.type === 'font') {
          link.setAttribute('crossorigin', 'anonymous');
          link.setAttribute('type', 'font/woff2');
        }
        
        document.head.appendChild(link);
      });
      
      // Adiciona DNS prefetch para domínios externos
      const externalDomains = [
        'fonts.googleapis.com',
        'fonts.gstatic.com',
        'cdn.jsdelivr.net',
        'api.stripe.com'
      ];
      
      externalDomains.forEach(domain => {
        if (document.querySelector(`link[href="https://${domain}"]`)) return;
        
        const link = document.createElement('link');
        link.rel = 'dns-prefetch';
        link.href = `https://${domain}`;
        document.head.appendChild(link);
        
        // Também adiciona preconnect para estabelecer conexão antecipada
        const preconnect = document.createElement('link');
        preconnect.rel = 'preconnect';
        preconnect.href = `https://${domain}`;
        preconnect.setAttribute('crossorigin', 'anonymous');
        document.head.appendChild(preconnect);
      });
    };
    
    // Inicializa o carregamento por estágios
    const initStagedLoading = () => {
      addLazyLoadStyles();
      setupLazyLoadImages();
      setupLazySections();
      implementPriorityLoading();
      
      // Executa o lazyLoad inicialmente e configura para executar durante o scroll
      lazyLoad();
      window.addEventListener('scroll', lazyLoad);
      window.addEventListener('resize', lazyLoad);
      
      // Registra o evento
      console.log('Carregamento por estágios inicializado');
    };
    
    // Executa a inicialização após o DOM estar completamente carregado
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', initStagedLoading);
    } else {
      initStagedLoading();
    }
    
    // Cleanup
    return () => {
      window.removeEventListener('scroll', lazyLoad);
      window.removeEventListener('resize', lazyLoad);
    };
  }, []);
  
  // Este componente não renderiza nada visualmente
  return null;
}
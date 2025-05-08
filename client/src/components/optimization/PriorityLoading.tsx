import { useEffect } from 'react';

/**
 * Componente de Carregamento Prioritário
 * Otimiza a performance da aplicação priorizando os recursos críticos
 * e utilizando técnicas avançadas de preloading e lazy loading
 */
export default function PriorityLoading() {
  useEffect(() => {
    // Adiciona preloads para recursos críticos
    const addPreloads = () => {
      // Evita duplicação
      if (document.getElementById('priority-loading-preloads')) return;
      
      // Cria elemento de marcação
      const marker = document.createElement('div');
      marker.id = 'priority-loading-preloads';
      marker.style.display = 'none';
      document.body.appendChild(marker);
      
      // Fonts importantes
      addPreconnect('https://fonts.gstatic.com');
      addPreconnect('https://fonts.googleapis.com');
      
      // Recursos estáticos críticos
      const criticalResources = [
        { url: '/assets/logo.svg', as: 'image' },
        { url: '/assets/hero-image.webp', as: 'image' }
      ];
      
      // Adiciona preloads para recursos críticos
      criticalResources.forEach(resource => {
        addPreload(resource.url, resource.as);
      });
      
      // Preload CSS crítico 
      addPreload('/assets/critical.css', 'style');
      
      // Registra o evento
      console.log('Recursos críticos pré-carregados');
    };
    
    // Adiciona preconnect para domínios importantes
    const addPreconnect = (url: string) => {
      // Evita duplicação
      if (document.querySelector(`link[rel="preconnect"][href="${url}"]`)) return;
      
      const link = document.createElement('link');
      link.rel = 'preconnect';
      link.href = url;
      link.crossOrigin = 'anonymous';
      
      document.head.appendChild(link);
    };
    
    // Adiciona preload para um recurso
    const addPreload = (url: string, as: string) => {
      // Evita duplicação
      if (document.querySelector(`link[rel="preload"][href="${url}"]`)) return;
      
      const link = document.createElement('link');
      link.rel = 'preload';
      link.href = url;
      link.as = as;
      
      document.head.appendChild(link);
    };
    
    // Otimiza carregamento de imagens com lazy loading
    const optimizeImages = () => {
      // Adiciona classe para estilização
      const styleElement = document.createElement('style');
      styleElement.id = 'priority-loading-styles';
      styleElement.textContent = `
        .lazy-image {
          opacity: 0;
          transition: opacity 0.3s ease-in-out;
        }
        
        .lazy-image.loaded {
          opacity: 1;
        }
        
        .lazy-placeholder {
          background: #F3F4F6;
          position: relative;
          overflow: hidden;
        }
        
        .lazy-placeholder::after {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background: linear-gradient(90deg, transparent, rgba(255,255,255,0.4), transparent);
          animation: shimmer 1.5s infinite;
          transform: translateX(-100%);
        }
        
        @keyframes shimmer {
          100% {
            transform: translateX(100%);
          }
        }
      `;
      document.head.appendChild(styleElement);
      
      // Configura lazy loading para imagens não críticas
      const images = document.querySelectorAll('img:not([loading="eager"])');
      
      images.forEach(img => {
        // Evita processar imagens já otimizadas
        if (img.hasAttribute('data-optimized')) return;
        img.setAttribute('data-optimized', 'true');
        
        // Armazena a URL original
        const originalSrc = img.getAttribute('src');
        const originalSrcset = img.getAttribute('srcset');
        
        if (originalSrc) {
          // Remove o src original para evitar carregamento imediato
          img.removeAttribute('src');
          img.setAttribute('data-src', originalSrc);
          
          // Adiciona placeholder
          img.classList.add('lazy-image');
          const parent = img.parentElement;
          
          // Envolve a imagem com um placeholder se ainda não tiver
          if (parent && !parent.classList.contains('lazy-placeholder')) {
            const wrapper = document.createElement('div');
            wrapper.className = 'lazy-placeholder';
            wrapper.style.width = img.getAttribute('width') || 'auto';
            wrapper.style.height = img.getAttribute('height') || 'auto';
            
            parent.insertBefore(wrapper, img);
            wrapper.appendChild(img);
          }
          
          // Adiciona atributo de lazy loading nativo
          img.setAttribute('loading', 'lazy');
        }
        
        if (originalSrcset) {
          img.removeAttribute('srcset');
          img.setAttribute('data-srcset', originalSrcset);
        }
      });
      
      // Configura IntersectionObserver para carregar imagens quando visíveis
      const lazyImageObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            const img = entry.target as HTMLImageElement;
            
            // Carrega a imagem
            const src = img.getAttribute('data-src');
            const srcset = img.getAttribute('data-srcset');
            
            if (src) img.src = src;
            if (srcset) img.srcset = srcset;
            
            // Adiciona evento para quando a imagem carregar
            img.onload = () => {
              img.classList.add('loaded');
              
              // Remove o placeholder após a transição
              setTimeout(() => {
                const parent = img.parentElement;
                if (parent && parent.classList.contains('lazy-placeholder')) {
                  parent.replaceWith(img);
                }
              }, 300);
            };
            
            // Para de observar após carregar
            lazyImageObserver.unobserve(img);
          }
        });
      }, {
        rootMargin: '200px 0px' // Começa a carregar quando estiver a 200px de distância
      });
      
      // Observa todas as imagens lazy
      document.querySelectorAll('.lazy-image').forEach(img => {
        lazyImageObserver.observe(img);
      });
    };
    
    // Implementa DNS prefetch para recursos de terceiros
    const setupDnsPrefetch = () => {
      const commonDomains = [
        'https://fonts.googleapis.com',
        'https://cdn.jsdelivr.net',
        'https://unpkg.com',
        'https://www.googletagmanager.com',
        'https://www.google-analytics.com'
      ];
      
      commonDomains.forEach(domain => {
        if (document.querySelector(`link[rel="dns-prefetch"][href="${domain}"]`)) return;
        
        const link = document.createElement('link');
        link.rel = 'dns-prefetch';
        link.href = domain;
        
        document.head.appendChild(link);
      });
    };
    
    // Prioriza o carregamento de scripts críticos
    const prioritizeScripts = () => {
      // Encontra todos os scripts
      const scripts = Array.from(document.querySelectorAll('script'));
      
      scripts.forEach(script => {
        // Evita processar scripts já otimizados
        if (script.hasAttribute('data-optimized')) return;
        script.setAttribute('data-optimized', 'true');
        
        const src = script.getAttribute('src');
        if (!src) return; // Ignora scripts inline
        
        // Detecta se o script é crítico ou não
        const isCritical = 
          src.includes('critical') || 
          src.includes('main') || 
          src.includes('runtime') ||
          src.includes('vendor');
        
        if (isCritical) {
          // Scripts críticos recebem maior prioridade
          script.setAttribute('fetchpriority', 'high');
        } else {
          // Scripts não críticos são carregados de forma assíncrona
          script.setAttribute('async', '');
          
          // Se já tiver defer, mantém apenas o async
          if (script.hasAttribute('defer')) {
            script.removeAttribute('defer');
          }
        }
      });
    };
    
    // Implementa precarregamento de páginas com base no hover
    const setupPagePreloading = () => {
      // Seleciona todos os links de navegação internos
      const links = document.querySelectorAll('a[href^="/"]:not([href^="/api"])');
      
      // Armazena páginas já pré-carregadas
      const preloadedPages = new Set();
      
      links.forEach(link => {
        // Evita processar links já otimizados
        if (link.hasAttribute('data-optimized')) return;
        link.setAttribute('data-optimized', 'true');
        
        // Adiciona listener para hover
        link.addEventListener('mouseenter', () => {
          const href = link.getAttribute('href');
          if (!href || preloadedPages.has(href)) return;
          
          // Marca como pré-carregada
          preloadedPages.add(href);
          
          // Preload da página
          const linkElement = document.createElement('link');
          linkElement.rel = 'prefetch';
          linkElement.href = href;
          
          document.head.appendChild(linkElement);
          
          console.log('Página pré-carregada:', href);
        });
      });
    };
    
    // Executa otimizações após o carregamento inicial
    // Para não impactar a renderização principal
    const runOptimizations = () => {
      // Prioridade 1: Recursos críticos
      addPreloads();
      setupDnsPrefetch();
      
      // Delay para otimizações de segunda prioridade
      setTimeout(() => {
        prioritizeScripts();
        optimizeImages();
        setupPagePreloading();
      }, 1000);
    };
    
    // Executa as otimizações quando a página carrega
    if (document.readyState === 'complete') {
      runOptimizations();
    } else {
      window.addEventListener('load', runOptimizations);
    }
    
    // Cleanup
    return () => {
      window.removeEventListener('load', runOptimizations);
    };
  }, []);
  
  // O componente não renderiza nada visualmente
  return null;
}
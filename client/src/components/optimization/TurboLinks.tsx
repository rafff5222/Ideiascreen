import { useEffect } from 'react';

/**
 * Implementa carregamento instantâneo de páginas (Turbo Links)
 * Substitui navegação padrão por AJAX para melhor experiência do usuário
 * 
 * Recursos adicionais:
 * - Pré-carregamento de assets críticos
 * - DNS prefetch para domínios externos
 * - Preconnect para APIs de terceiros
 */
export default function TurboLinks() {
  useEffect(() => {
    // Implementa pré-carregamento de assets críticos
    const preloadCriticalAssets = () => {
      const criticalAssets = [
        { href: '/assets/js/checkout.js', as: 'script' },
        { href: '/assets/img/hero-bg.webp', as: 'image' },
        { href: '/assets/fonts/inter.woff2', as: 'font', crossorigin: 'anonymous' }
      ];
      
      // Domínios para preconnect
      const preconnectDomains = [
        'https://api.stripe.com',
        'https://cdn.jsdelivr.net',
        'https://fonts.googleapis.com'
      ];
      
      // Adiciona os preloads
      criticalAssets.forEach(asset => {
        const link = document.createElement('link');
        link.rel = 'preload';
        link.href = asset.href;
        link.as = asset.as;
        if (asset.crossorigin) {
          link.crossOrigin = asset.crossorigin;
        }
        document.head.appendChild(link);
      });
      
      // Adiciona os preconnects
      preconnectDomains.forEach(domain => {
        const link = document.createElement('link');
        link.rel = 'preconnect';
        link.href = domain;
        link.crossOrigin = 'anonymous';
        document.head.appendChild(link);
      });
      
      console.log('Assets críticos pré-carregados');
    };
    
    // Executa pré-carregamento de assets
    preloadCriticalAssets();
    
    // Cache para páginas já carregadas
    const pageCache = new Map();
    
    // Pré-carrega as páginas nos links quando o mouse passa por cima
    const prefetchPage = (url: string) => {
      if (pageCache.has(url)) return;
      
      fetch(url)
        .then(response => response.text())
        .then(html => {
          pageCache.set(url, html);
          console.log(`Página pré-carregada: ${url}`);
        })
        .catch(error => console.error('Erro ao pré-carregar página:', error));
    };
    
    // Extrair o conteúdo principal da página carregada
    const extractContent = (html: string): string => {
      // Cria um DOM temporário para extrair apenas o conteúdo relevante
      const tempDOM = document.createElement('div');
      tempDOM.innerHTML = html;
      
      // Busca o elemento principal (ajuste conforme a estrutura do site)
      const mainContent = tempDOM.querySelector('main') || 
                          tempDOM.querySelector('#content') || 
                          tempDOM.querySelector('#app') ||
                          tempDOM.querySelector('body');
      
      return mainContent ? mainContent.innerHTML : html;
    };
    
    // Atualiza o título da página a partir do HTML
    const updatePageTitle = (html: string) => {
      const tempDOM = document.createElement('div');
      tempDOM.innerHTML = html;
      
      const titleTag = tempDOM.querySelector('title');
      if (titleTag) {
        document.title = titleTag.innerText;
      }
    };
    
    // Configura os event listeners para prefetching
    const setupPrefetching = () => {
      document.querySelectorAll('a').forEach(link => {
        // Pula links externos ou com atributo de download
        const href = link.getAttribute('href');
        if (!href || href.startsWith('http') || href.startsWith('#') || link.hasAttribute('download')) {
          return;
        }
        
        // Prefetch quando o mouse passar por cima
        link.addEventListener('mouseenter', () => {
          prefetchPage(href);
        });
      });
    };
    
    // Configura os event listeners para navegação AJAX
    const setupAjaxNavigation = () => {
      document.querySelectorAll('a').forEach(link => {
        // Pula links externos ou com atributo de download
        const href = link.getAttribute('href');
        if (!href || href.startsWith('http') || href.startsWith('#') || link.hasAttribute('download')) {
          return;
        }
        
        link.addEventListener('click', (e) => {
          e.preventDefault();
          
          // Mostra indicador de carregamento
          document.body.classList.add('page-loading');
          
          // Tenta usar a versão em cache primeiro
          if (pageCache.has(href)) {
            console.log(`Carregando página do cache: ${href}`);
            const html = pageCache.get(href);
            
            // Atualiza conteúdo, título e URL
            const mainElement = document.querySelector('main') || document.body;
            mainElement.innerHTML = extractContent(html);
            updatePageTitle(html);
            window.history.pushState({}, '', href);
            
            // Configura novamente os listeners em elementos novos
            setupPrefetching();
            setupAjaxNavigation();
            
            // Remove indicador de carregamento
            document.body.classList.remove('page-loading');
            
            // Scroll para o topo
            window.scrollTo(0, 0);
            
            // Registra no analytics
            console.log('Analytics:', {
              event: 'turbo_navigation',
              path: href,
              timestamp: new Date().toISOString(),
              source: 'cache'
            });
            
            return;
          }
          
          // Se não estiver em cache, faz a requisição
          fetch(href)
            .then(response => response.text())
            .then(html => {
              // Adiciona ao cache
              pageCache.set(href, html);
              
              // Atualiza conteúdo, título e URL
              const mainElement = document.querySelector('main') || document.body;
              mainElement.innerHTML = extractContent(html);
              updatePageTitle(html);
              window.history.pushState({}, '', href);
              
              // Configura novamente os listeners em elementos novos
              setupPrefetching();
              setupAjaxNavigation();
              
              // Registra no analytics
              console.log('Analytics:', {
                event: 'turbo_navigation',
                path: href,
                timestamp: new Date().toISOString(),
                source: 'fetch'
              });
            })
            .catch(error => {
              console.error('Erro ao carregar página:', error);
              
              // Fallback para navegação tradicional em caso de erro
              window.location.href = href;
            })
            .finally(() => {
              // Remove indicador de carregamento
              document.body.classList.remove('page-loading');
              
              // Scroll para o topo
              window.scrollTo(0, 0);
            });
        });
      });
    };
    
    // Adiciona indicador de carregamento
    const setupLoadingIndicator = () => {
      const styleElement = document.createElement('style');
      styleElement.textContent = `
        .page-loading::after {
          content: '';
          position: fixed;
          top: 0;
          left: 0;
          width: 100%;
          height: 3px;
          background: linear-gradient(to right, #EC4899, #8B5CF6);
          animation: loading-bar 1s infinite linear;
          z-index: 9999;
        }
        
        @keyframes loading-bar {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(100%); }
        }
      `;
      document.head.appendChild(styleElement);
    };
    
    // Inicializa
    setupLoadingIndicator();
    setupPrefetching();
    setupAjaxNavigation();
    
    // Alerta o usuário antes de navegar para fora se tiver mudanças não salvas
    window.addEventListener('beforeunload', (e) => {
      const hasUnsavedChanges = false; // Lógica para verificar mudanças não salvas
      
      if (hasUnsavedChanges) {
        e.preventDefault();
        e.returnValue = 'Você tem mudanças não salvas. Tem certeza que deseja sair?';
        return e.returnValue;
      }
    });
    
    // Para lidar com botões do navegador (voltar/avançar)
    window.addEventListener('popstate', () => {
      const currentPage = window.location.pathname;
      
      if (pageCache.has(currentPage)) {
        // Usa a versão em cache
        const html = pageCache.get(currentPage);
        const mainElement = document.querySelector('main') || document.body;
        mainElement.innerHTML = extractContent(html);
        updatePageTitle(html);
        
        // Reconfigura os listeners
        setupPrefetching();
        setupAjaxNavigation();
      } else {
        // Recarrega a página normalmente se não estiver em cache
        window.location.reload();
      }
    });
    
  }, []);
  
  // Este componente não renderiza nada visualmente
  return null;
}
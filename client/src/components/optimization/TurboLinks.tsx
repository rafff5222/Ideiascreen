import { useEffect } from 'react';

/**
 * Componente de Carregamento Instantâneo de Páginas (Turbo)
 * Pré-carrega páginas e conteúdo antecipadamente para criar uma experiência
 * de navegação instantânea para o usuário
 */
export default function TurboLinks() {
  useEffect(() => {
    // Cache para armazenar conteúdo pré-carregado
    const pageCache: Record<string, string> = {};
    
    // Rastreia quais links já estão sendo observados
    const observedLinks = new Set<string>();
    
    // Nomes das classes para páginas carregadas de forma "lazy"
    const lazySelectors = '.lazy-page, [data-lazy="page"], [data-turbo="true"]';
    
    // Verifica se a URL é válida para pré-carregamento
    const isValidURL = (url: string): boolean => {
      // Ignora URLs externas e recursos não-HTML
      if (!url || url.startsWith('#') || url.startsWith('http') || url.includes('mailto:') || url.includes('tel:')) {
        return false;
      }
      
      // Ignora urls de API ou recursos estáticos
      if (url.startsWith('/api/') || url.includes('.jpg') || url.includes('.png') || url.includes('.js') || url.includes('.css')) {
        return false;
      }
      
      return true;
    };
    
    // Pré-carrega uma página
    const preloadPage = (url: string): Promise<string> => {
      return new Promise((resolve, reject) => {
        // Se já estiver em cache, retorna do cache
        if (pageCache[url]) {
          resolve(pageCache[url]);
          return;
        }
        
        // Faz o fetch da página
        fetch(url)
          .then(response => {
            if (!response.ok) {
              throw new Error(`Failed to fetch ${url}: ${response.status}`);
            }
            return response.text();
          })
          .then(html => {
            // Armazena no cache
            pageCache[url] = html;
            
            // Registra no log
            console.log('Página pré-carregada:', url);
            
            resolve(html);
          })
          .catch(error => {
            console.error('Erro ao pré-carregar página:', error);
            reject(error);
          });
      });
    };
    
    // Extrai o conteúdo relevante de uma página HTML
    const extractPageContent = (html: string, selector: string = '.content'): string => {
      const parser = new DOMParser();
      const doc = parser.parseFromString(html, 'text/html');
      
      // Tenta encontrar o conteúdo principal
      const content = doc.querySelector(selector) || 
                      doc.querySelector('main') || 
                      doc.querySelector('#main-content') ||
                      doc.body;
      
      return content ? content.innerHTML : '';
    };
    
    // Configura a detecção de hover em links
    const setupLinkHoverPreloading = () => {
      // Usa event delegation para detectar hover em links
      document.addEventListener('mouseover', (e) => {
        const target = e.target as HTMLElement;
        const link = target.closest('a') as HTMLAnchorElement;
        
        if (link && link.href && isValidURL(link.pathname)) {
          // Evita pré-carregar a mesma página múltiplas vezes
          if (observedLinks.has(link.pathname)) return;
          
          // Adiciona à lista de links observados
          observedLinks.add(link.pathname);
          
          // Pré-carrega após um breve delay para evitar pré-carregamentos desnecessários
          const timer = setTimeout(() => {
            preloadPage(link.pathname)
              .catch(() => {
                // Remove da lista para permitir novas tentativas
                observedLinks.delete(link.pathname);
              });
          }, 150);
          
          // Cancela o pré-carregamento se o mouse sair rapidamente
          link.addEventListener('mouseout', () => {
            clearTimeout(timer);
          }, { once: true });
        }
      }, { passive: true });
    };
    
    // Configura pré-carregamento de lazy-pages
    const setupLazyPageLoading = () => {
      // Cria um observador para detectar quando elementos entram no viewport
      const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            const element = entry.target as HTMLElement;
            
            // Procura um link dentro do elemento
            const link = element.querySelector('a');
            if (link && isValidURL(link.pathname)) {
              // Pré-carrega o conteúdo
              preloadPage(link.pathname)
                .then(html => {
                  // Atualiza o conteúdo do elemento
                  const contentHTML = extractPageContent(html);
                  element.innerHTML = contentHTML;
                  
                  // Marca como carregado
                  element.setAttribute('data-loaded', 'true');
                  
                  // Para de observar
                  observer.unobserve(element);
                })
                .catch(error => {
                  console.error('Erro ao carregar conteúdo lazy:', error);
                });
            }
          }
        });
      }, {
        // Começa a carregar quando o elemento está a 200px de entrar no viewport
        rootMargin: '200px',
        threshold: 0.1
      });
      
      // Observe todas as lazy-pages
      document.querySelectorAll(lazySelectors).forEach(page => {
        observer.observe(page);
      });
      
      // Configura observer para detectar novas lazy-pages adicionadas dinamicamente
      const domObserver = new MutationObserver((mutations) => {
        mutations.forEach(mutation => {
          if (mutation.type === 'childList' && mutation.addedNodes.length > 0) {
            mutation.addedNodes.forEach(node => {
              if (node.nodeType === Node.ELEMENT_NODE) {
                const element = node as HTMLElement;
                
                // Verifica se o próprio elemento é uma lazy-page
                if (element.matches && element.matches(lazySelectors)) {
                  observer.observe(element);
                }
                
                // Verifica se contém lazy-pages
                if (element.querySelectorAll) {
                  element.querySelectorAll(lazySelectors).forEach(page => {
                    observer.observe(page);
                  });
                }
              }
            });
          }
        });
      });
      
      domObserver.observe(document.body, {
        childList: true,
        subtree: true
      });
      
      // Cleanup
      return () => {
        observer.disconnect();
        domObserver.disconnect();
      };
    };
    
    // Aprimoramento de navegação para páginas pré-carregadas
    const enhanceNavigation = () => {
      // Detecta cliques em links
      document.addEventListener('click', (e) => {
        const target = e.target as HTMLElement;
        const link = target.closest('a') as HTMLAnchorElement;
        
        if (link && link.href && isValidURL(link.pathname) && pageCache[link.pathname]) {
          // Previne a navegação padrão
          e.preventDefault();
          
          // Atualiza a URL
          window.history.pushState({}, '', link.pathname);
          
          // Extrai e insere o conteúdo da página
          const content = extractPageContent(pageCache[link.pathname]);
          
          // Encontra o container do conteúdo
          const contentContainer = document.querySelector('main') || 
                                   document.querySelector('#content') || 
                                   document.querySelector('.content');
          
          if (contentContainer) {
            // Insere o conteúdo com uma animação suave
            contentContainer.style.opacity = '0';
            contentContainer.style.transition = 'opacity 0.2s';
            
            setTimeout(() => {
              contentContainer.innerHTML = content;
              contentContainer.style.opacity = '1';
              
              // Scroll para o topo
              window.scrollTo(0, 0);
              
              // Executa scripts no conteúdo carregado
              const scripts = contentContainer.querySelectorAll('script');
              scripts.forEach(script => {
                const newScript = document.createElement('script');
                Array.from(script.attributes).forEach(attr => {
                  newScript.setAttribute(attr.name, attr.value);
                });
                newScript.textContent = script.textContent;
                script.parentNode?.replaceChild(newScript, script);
              });
              
              // Registra o evento de navegação
              console.log('Analytics:', {
                event: 'turbo_navigation',
                from: window.location.pathname,
                to: link.pathname,
                timestamp: new Date().toISOString()
              });
            }, 200);
          }
        }
      });
      
      // Lida com navegação do histórico (botões de voltar/avançar)
      window.addEventListener('popstate', () => {
        const path = window.location.pathname;
        
        // Se tiver em cache, carrega do cache
        if (pageCache[path]) {
          const content = extractPageContent(pageCache[path]);
          
          const contentContainer = document.querySelector('main') || 
                                   document.querySelector('#content') || 
                                   document.querySelector('.content');
          
          if (contentContainer) {
            contentContainer.innerHTML = content;
            window.scrollTo(0, 0);
          }
        } else {
          // Se não estiver em cache, deixa o navegador carregar normalmente
          window.location.reload();
        }
      });
    };
    
    // Executa as funções de aprimoramento
    setupLinkHoverPreloading();
    const cleanupLazyLoading = setupLazyPageLoading();
    enhanceNavigation();
    
    // Carrega página atual no cache
    pageCache[window.location.pathname] = document.documentElement.outerHTML;
    
    // Pré-carrega páginas importantes
    const importantPages = [
      '/',
      '/pricing',
      '/features',
      '/about',
      '/contact'
    ];
    
    // Adiciona à fila de carregamento com um pequeno atraso para não competir com recursos críticos
    setTimeout(() => {
      importantPages.forEach(page => {
        // Não recarrega a página atual
        if (page !== window.location.pathname) {
          preloadPage(page).catch(() => {}); // Ignora erros
        }
      });
    }, 3000);
    
    // Cleanup
    return () => {
      cleanupLazyLoading();
    };
  }, []);
  
  // Este componente não renderiza nada diretamente
  return null;
}
import { useEffect } from 'react';

/**
 * Componente de Comparador 3D de Planos
 * Visualização interativa dos benefícios de cada plano com efeito de flip
 */
export default function Comparador3DPlanos() {
  useEffect(() => {
    // Função para transformar os cartões de planos existentes em cartões 3D
    const setupComparador3D = () => {
      // Seleciona os cards de planos existentes
      const planoCards = document.querySelectorAll('.pricing-card, .plano-card, [id^="plano-"]');
      
      if (planoCards.length === 0) return;
      
      // Adiciona estilos CSS necessários para os efeitos 3D
      const addStyles = () => {
        const styleElement = document.createElement('style');
        styleElement.textContent = `
          .plano-card {
            perspective: 1000px;
            transition: transform 0.3s;
          }
          
          .plano-card:hover {
            transform: translateY(-10px);
          }
          
          .flip-card-inner {
            position: relative;
            width: 100%;
            height: 100%;
            text-align: center;
            transition: transform 0.6s;
            transform-style: preserve-3d;
          }
          
          .flip-card.virado .flip-card-inner {
            transform: rotateY(180deg);
          }
          
          .flip-card-front, .flip-card-back {
            position: absolute;
            width: 100%;
            height: 100%;
            -webkit-backface-visibility: hidden;
            backface-visibility: hidden;
            display: flex;
            flex-direction: column;
            justify-content: center;
            align-items: center;
            padding: 1rem;
          }
          
          .flip-card-front {
            background-color: inherit;
            color: inherit;
          }
          
          .flip-card-back {
            background-color: inherit;
            color: inherit;
            transform: rotateY(180deg);
          }
          
          .flip-trigger {
            cursor: pointer;
            position: absolute;
            top: 0.5rem;
            right: 0.5rem;
            z-index: 10;
            background-color: rgba(255, 255, 255, 0.2);
            border-radius: 9999px;
            width: 24px;
            height: 24px;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 12px;
          }
          
          .flip-badge {
            position: absolute;
            top: -8px;
            right: -8px;
            background: linear-gradient(45deg, #EC4899, #8B5CF6);
            color: white;
            font-size: 10px;
            font-weight: bold;
            padding: 2px 6px;
            border-radius: 10px;
            box-shadow: 0 2px 5px rgba(0,0,0,0.2);
            animation: pulse 2s infinite;
          }
          
          @keyframes pulse {
            0% {
              box-shadow: 0 0 0 0 rgba(236, 72, 153, 0.7);
            }
            70% {
              box-shadow: 0 0 0 5px rgba(236, 72, 153, 0);
            }
            100% {
              box-shadow: 0 0 0 0 rgba(236, 72, 153, 0);
            }
          }
          
          /* Adiciona sombra e estilo ao cartão virado */
          .flip-card.virado {
            z-index: 10;
          }
        `;
        document.head.appendChild(styleElement);
      };
      
      // Adiciona os estilos
      addStyles();
      
      // Processa cada cartão de plano
      planoCards.forEach((card, index) => {
        if (card.classList.contains('comparador-3d-processed')) return;
        card.classList.add('comparador-3d-processed');
        
        // Identifica o tipo de plano
        const isBasico = card.classList.contains('plano-basico') || 
                        card.textContent?.toLowerCase().includes('básico') ||
                        card.textContent?.toLowerCase().includes('basico');
        
        const isPremium = card.classList.contains('plano-premium') || 
                         card.textContent?.toLowerCase().includes('premium');
        
        const isUltimate = card.classList.contains('plano-ultimate') || 
                          card.textContent?.toLowerCase().includes('ultimate');
        
        const isPro = card.classList.contains('plano-pro') || 
                     card.textContent?.toLowerCase().includes('pro') && 
                     !card.textContent?.toLowerCase().includes('premium');
        
        // Determina o tipo de plano
        let planoTipo = 'outro';
        if (isBasico) planoTipo = 'basico';
        if (isPremium) planoTipo = 'premium';
        if (isUltimate) planoTipo = 'ultimate';
        if (isPro) planoTipo = 'pro';
        
        // Prepara o cartão para o efeito 3D
        card.classList.add('plano-card');
        card.setAttribute('data-plano', planoTipo);
        
        // Obtém o conteúdo atual do cartão
        const cardContent = card.innerHTML;
        
        // Prepara o conteúdo do verso do cartão (detalhes adicionais)
        const backContent = gerarConteudoVerso(planoTipo);
        
        // Cria a estrutura para o flip card
        const flipCardDiv = document.createElement('div');
        flipCardDiv.className = 'flip-card';
        flipCardDiv.innerHTML = `
          <div class="flip-trigger">i</div>
          <div class="flip-card-inner">
            <div class="flip-card-front">
              ${cardContent}
            </div>
            <div class="flip-card-back">
              ${backContent}
            </div>
          </div>
          ${isPremium ? '<div class="flip-badge">NOVO</div>' : ''}
        `;
        
        // Limpa o conteúdo original do cartão
        card.innerHTML = '';
        
        // Adiciona o flip card ao cartão
        card.appendChild(flipCardDiv);
        
        // Adiciona o evento de flip
        const trigger = card.querySelector('.flip-trigger');
        trigger?.addEventListener('click', (e) => {
          e.stopPropagation();
          flipCardDiv.classList.toggle('virado');
          
          // Registra o evento de analytics
          console.log('Analytics:', {
            event: 'plan_details_viewed',
            plan: planoTipo,
            timestamp: new Date().toISOString()
          });
        });
        
        // Opcional: Adiciona evento para voltar ao normal ao clicar fora
        document.addEventListener('click', (e) => {
          if (!card.contains(e.target as Node) && flipCardDiv.classList.contains('virado')) {
            flipCardDiv.classList.remove('virado');
          }
        });
      });
    };
    
    // Função para gerar o conteúdo verso do cartão com base no tipo de plano
    const gerarConteudoVerso = (tipo: string): string => {
      switch (tipo) {
        case 'basico':
          return `
            <h4 class="text-lg font-bold mb-3">Inclui:</h4>
            <ul class="text-sm space-y-2 text-left">
              <li class="flex items-start">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-green-500 mr-2 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
                </svg>
                <span>50 gerações de conteúdo/mês</span>
              </li>
              <li class="flex items-start">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-green-500 mr-2 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
                </svg>
                <span>Scripts e legendas</span>
              </li>
              <li class="flex items-start">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-red-500 mr-2 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
                <span class="text-gray-400">Sem geração de vídeos</span>
              </li>
              <li class="flex items-start">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-red-500 mr-2 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
                <span class="text-gray-400">Sem edição automática</span>
              </li>
            </ul>
          `;
        
        case 'premium':
          return `
            <h4 class="text-lg font-bold mb-3">Inclui:</h4>
            <ul class="text-sm space-y-2 text-left">
              <li class="flex items-start">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-green-500 mr-2 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
                </svg>
                <span>100 gerações de conteúdo/mês</span>
              </li>
              <li class="flex items-start">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-green-500 mr-2 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
                </svg>
                <span>Geração automática de vídeos</span>
              </li>
              <li class="flex items-start">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-green-500 mr-2 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
                </svg>
                <span>Edição com 1 clique</span>
              </li>
              <li class="flex items-start">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-green-500 mr-2 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
                </svg>
                <span>20 músicas sem copyright</span>
              </li>
            </ul>
            <div class="mt-4 text-xs text-purple-600 font-medium px-2 py-1 bg-purple-100 rounded-full">
              MAIS VENDIDO
            </div>
          `;
        
        case 'pro':
          return `
            <h4 class="text-lg font-bold mb-3">Inclui:</h4>
            <ul class="text-sm space-y-2 text-left">
              <li class="flex items-start">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-green-500 mr-2 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
                </svg>
                <span>300 gerações de conteúdo/mês</span>
              </li>
              <li class="flex items-start">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-green-500 mr-2 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
                </svg>
                <span>Geração avançada de vídeos</span>
              </li>
              <li class="flex items-start">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-green-500 mr-2 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
                </svg>
                <span>Edição profissional</span>
              </li>
              <li class="flex items-start">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-red-500 mr-2 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
                <span class="text-gray-400">Sem efeitos cinemáticos</span>
              </li>
            </ul>
          `;
        
        case 'ultimate':
          return `
            <h4 class="text-lg font-bold mb-3">Inclui:</h4>
            <ul class="text-sm space-y-2 text-left">
              <li class="flex items-start">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-green-500 mr-2 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
                </svg>
                <span>Gerações ilimitadas</span>
              </li>
              <li class="flex items-start">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-green-500 mr-2 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
                </svg>
                <span>Edição profissional de vídeos</span>
              </li>
              <li class="flex items-start">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-green-500 mr-2 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
                </svg>
                <span>Efeitos cinemáticos</span>
              </li>
              <li class="flex items-start">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-green-500 mr-2 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
                </svg>
                <span>Narração por IA</span>
              </li>
              <li class="flex items-start">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-green-500 mr-2 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
                </svg>
                <span>Acesso prioritário a novas features</span>
              </li>
            </ul>
            <div class="mt-4 text-xs text-green-600 font-medium px-2 py-1 bg-green-100 rounded-full">
              MELHOR VALOR
            </div>
          `;
        
        default:
          return `
            <h4 class="text-lg font-bold mb-3">Detalhes:</h4>
            <p class="text-sm mb-2">Clique para ver mais informações sobre este plano.</p>
            <button class="px-4 py-2 bg-blue-500 text-white rounded-lg text-sm mt-2">
              Saber mais
            </button>
          `;
      }
    };
    
    // Executa a configuração do comparador 3D
    setupComparador3D();
    
    // Verifica e reconfigura periodicamente (para páginas que carregam elementos dinamicamente)
    const setupInterval = setInterval(setupComparador3D, 2000);
    
    // Configura um observador para detectar quando a seção de planos é carregada
    const observer = new MutationObserver((mutations) => {
      for (const mutation of mutations) {
        if (mutation.type === 'childList' && mutation.addedNodes.length > 0) {
          setupComparador3D();
        }
      }
    });
    
    // Inicializa o observador
    observer.observe(document.body, { childList: true, subtree: true });
    
    // Limpa os intervalos e observadores ao desmontar o componente
    return () => {
      clearInterval(setupInterval);
      observer.disconnect();
    };
  }, []);
  
  // Este componente não renderiza nada visualmente
  return null;
}
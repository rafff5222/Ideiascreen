import { useEffect, useState } from 'react';

/**
 * Componente de personalização baseado no nível de engajamento do usuário
 * Monitora o tempo na página e oferece ajuda contextual no momento certo
 */
export default function EngagementPersonalization() {
  const [pageEngagement, setPageEngagement] = useState(0);
  const [chatbotShown, setChatbotShown] = useState(false);
  const [helpMessageShown, setHelpMessageShown] = useState(false);
  
  useEffect(() => {
    // Verificar se já foi mostrado nesta sessão
    const alreadyShown = sessionStorage.getItem('engagementChatShown');
    if (alreadyShown === 'true') {
      setChatbotShown(true);
      return;
    }
    
    // Monitora tempo na página (1 ponto a cada segundo)
    const timeInterval = setInterval(() => {
      setPageEngagement(prev => prev + 1);
    }, 1000);
    
    // Monitora cliques e interações (5 pontos por clique)
    const handleInteraction = () => {
      setPageEngagement(prev => prev + 5);
    };
    
    // Adiciona event listeners para várias interações do usuário
    document.addEventListener('click', handleInteraction);
    document.addEventListener('scroll', handleInteraction);
    document.addEventListener('mousemove', handleInteraction);
    
    // Verifica engajamento após 30 segundos
    const engagementCheck = setTimeout(() => {
      if (pageEngagement > 30 && !chatbotShown && !helpMessageShown) {
        showHelpMessage();
      }
    }, 30000);
    
    // Cleanup
    return () => {
      clearInterval(timeInterval);
      clearTimeout(engagementCheck);
      document.removeEventListener('click', handleInteraction);
      document.removeEventListener('scroll', handleInteraction);
      document.removeEventListener('mousemove', handleInteraction);
    };
  }, [pageEngagement, chatbotShown, helpMessageShown]);
  
  // Mostra mensagem de ajuda contextual
  const showHelpMessage = () => {
    // Verifica o contexto da página para personalizar a mensagem
    const pricingSection = document.querySelector('#planos');
    const isOnPricingSection = window.location.hash === '#planos' || 
                              (pricingSection && pricingSection.getBoundingClientRect().top < window.innerHeight);
    
    const featureSection = document.querySelector('#features');
    const isOnFeatureSection = featureSection && featureSection.getBoundingClientRect().top < window.innerHeight;
    
    // Define mensagem apropriada com base no contexto
    let message = "Precisa de ajuda para escolher seu plano?";
    
    if (isOnPricingSection) {
      message = "Dúvidas sobre qual plano escolher? Estamos aqui para ajudar!";
    } else if (isOnFeatureSection) {
      message = "Quer saber como essas funcionalidades podem ajudar seu negócio?";
    }
    
    // Verifica se existe um chatbot para ativar
    const existingChatbot = document.querySelector('.sales-chatbot') || 
                           document.querySelector('.ai-chatbot') || 
                           document.querySelector('.intercom-launcher');
    
    if (existingChatbot) {
      // Se encontrou um chatbot, ativa-o com a mensagem personalizada
      activateExistingChatbot(existingChatbot, message);
    } else {
      // Se não, cria um elemento flutuante de ajuda
      createHelpBubble(message);
    }
    
    // Marca como mostrado
    setHelpMessageShown(true);
    sessionStorage.setItem('engagementChatShown', 'true');
    
    // Registra o evento
    console.log('Analytics:', {
      event: 'help_offered',
      engagement_score: pageEngagement,
      message: message,
      timestamp: new Date().toISOString()
    });
  };
  
  // Ativa chatbot existente com mensagem personalizada
  const activateExistingChatbot = (chatbotElement: Element, message: string) => {
    // Tenta encontrar o método apropriado para abrir o chatbot
    if (chatbotElement.classList.contains('sales-chatbot')) {
      // Nosso próprio chatbot
      const chatbotContainer = document.querySelector('.chatbot-messages');
      if (chatbotContainer) {
        // Adiciona uma mensagem do sistema
        const systemMessage = document.createElement('div');
        systemMessage.className = 'message system-message';
        systemMessage.innerHTML = `
          <div class="message-content">${message}</div>
        `;
        chatbotContainer.appendChild(systemMessage);
        
        // Exibe o chatbot
        const chatWrapper = chatbotElement.closest('.chatbot-wrapper');
        if (chatWrapper) {
          chatWrapper.classList.add('open');
        }
      }
    } else {
      // Clica no elemento para abrir
      (chatbotElement as HTMLElement).click();
      
      // Tenta inserir a mensagem no campo de input do chatbot (se estiver disponível)
      setTimeout(() => {
        const chatInput = document.querySelector('.chatbot-input') as HTMLInputElement;
        if (chatInput) {
          chatInput.value = message;
        }
      }, 500);
    }
    
    setChatbotShown(true);
  };
  
  // Cria um elemento flutuante de ajuda
  const createHelpBubble = (message: string) => {
    // Verifica se já existe
    if (document.getElementById('engagement-help-bubble')) return;
    
    // Cria o elemento
    const helpBubble = document.createElement('div');
    helpBubble.id = 'engagement-help-bubble';
    helpBubble.className = 'fixed bottom-20 right-5 bg-white rounded-xl shadow-lg p-4 max-w-xs z-50 animate-fade-in';
    helpBubble.innerHTML = `
      <div class="flex items-start">
        <div class="flex-1">
          <p class="font-medium text-gray-800 mb-2">${message}</p>
          <div class="flex gap-2">
            <button class="help-yes px-3 py-1 bg-purple-600 text-white rounded-md text-sm hover:bg-purple-700 transition-colors">
              Sim, por favor
            </button>
            <button class="help-no px-3 py-1 bg-gray-200 text-gray-700 rounded-md text-sm hover:bg-gray-300 transition-colors">
              Não, obrigado
            </button>
          </div>
        </div>
        <button class="help-close text-gray-400 hover:text-gray-600">
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <line x1="18" y1="6" x2="6" y2="18"></line>
            <line x1="6" y1="6" x2="18" y2="18"></line>
          </svg>
        </button>
      </div>
    `;
    
    // Adiciona animação
    const style = document.createElement('style');
    style.textContent = `
      @keyframes fade-in {
        from { opacity: 0; transform: translateY(20px); }
        to { opacity: 1; transform: translateY(0); }
      }
      
      .animate-fade-in {
        animation: fade-in 0.3s ease forwards;
      }
    `;
    document.head.appendChild(style);
    
    // Adiciona ao DOM
    document.body.appendChild(helpBubble);
    
    // Adiciona event listeners aos botões
    const yesButton = helpBubble.querySelector('.help-yes');
    const noButton = helpBubble.querySelector('.help-no');
    const closeButton = helpBubble.querySelector('.help-close');
    
    if (yesButton) {
      yesButton.addEventListener('click', () => {
        // Redireciona para a seção de planos com uma âncora especial
        window.location.href = '#planos?help=true';
        helpBubble.remove();
        
        // Registra o evento
        console.log('Analytics:', {
          event: 'help_accepted',
          timestamp: new Date().toISOString()
        });
        
        // Mostra o chatbot após 1 segundo (se existir)
        setTimeout(() => {
          const chatbot = document.querySelector('.sales-chatbot');
          if (chatbot) {
            (chatbot as HTMLElement).click();
          }
        }, 1000);
      });
    }
    
    if (noButton) {
      noButton.addEventListener('click', () => {
        helpBubble.remove();
        
        // Registra o evento
        console.log('Analytics:', {
          event: 'help_rejected',
          timestamp: new Date().toISOString()
        });
      });
    }
    
    if (closeButton) {
      closeButton.addEventListener('click', () => {
        helpBubble.remove();
      });
    }
    
    // Auto-close após 20 segundos
    setTimeout(() => {
      if (document.body.contains(helpBubble)) {
        helpBubble.remove();
      }
    }, 20000);
  };

  // Este componente não renderiza nada visualmente
  return null;
}
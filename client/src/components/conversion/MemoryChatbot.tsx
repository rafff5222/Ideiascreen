import { useEffect, useState } from 'react';

/**
 * Componente de Chatbot de Vendas com Memória
 * Mantém histórico de interações para oferecer respostas mais contextuais
 */
export default function MemoryChatbot() {
  const [isVisible, setIsVisible] = useState(false);
  const [isMinimized, setIsMinimized] = useState(true);
  const [hasUserInteracted, setHasUserInteracted] = useState(false);
  
  useEffect(() => {
    // Adiciona estilos CSS
    const addStyles = () => {
      if (document.getElementById('memory-chatbot-styles')) return;
      
      const styleElement = document.createElement('style');
      styleElement.id = 'memory-chatbot-styles';
      styleElement.textContent = `
        .memory-chatbot {
          position: fixed;
          bottom: 20px;
          right: 20px;
          width: 320px;
          background: white;
          border-radius: 12px;
          box-shadow: 0 5px 25px rgba(0, 0, 0, 0.1);
          font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
          z-index: 9999;
          overflow: hidden;
          opacity: 0;
          transform: translateY(20px);
          transition: all 0.3s ease;
        }
        
        .memory-chatbot.visible {
          opacity: 1;
          transform: translateY(0);
        }
        
        .memory-chatbot.minimized {
          height: 60px;
        }
        
        .memory-chatbot-header {
          background: linear-gradient(90deg, #8B5CF6, #6366F1);
          color: white;
          padding: 15px;
          font-weight: 600;
          display: flex;
          justify-content: space-between;
          align-items: center;
          cursor: pointer;
        }
        
        .memory-chatbot-header-title {
          display: flex;
          align-items: center;
        }
        
        .memory-chatbot-header-title .bot-avatar {
          width: 30px;
          height: 30px;
          background: white;
          border-radius: 50%;
          margin-right: 10px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 16px;
        }
        
        .memory-chatbot-header-actions button {
          background: none;
          border: none;
          color: white;
          font-size: 16px;
          cursor: pointer;
          margin-left: 5px;
          padding: 0;
          opacity: 0.8;
          transition: opacity 0.2s;
        }
        
        .memory-chatbot-header-actions button:hover {
          opacity: 1;
        }
        
        .memory-chatbot-messages {
          height: 300px;
          overflow-y: auto;
          padding: 15px;
          display: flex;
          flex-direction: column;
        }
        
        .memory-chatbot-message {
          margin-bottom: 10px;
          max-width: 80%;
          padding: 10px 14px;
          border-radius: 15px;
          font-size: 14px;
          line-height: 1.4;
        }
        
        .memory-chatbot-message.bot {
          background: #F3F4F6;
          color: #374151;
          border-bottom-left-radius: 4px;
          align-self: flex-start;
        }
        
        .memory-chatbot-message.user {
          background: #8B5CF6;
          color: white;
          border-bottom-right-radius: 4px;
          align-self: flex-end;
        }
        
        .memory-chatbot-input {
          display: flex;
          border-top: 1px solid #E5E7EB;
          padding: 10px 15px;
        }
        
        .memory-chatbot-input input {
          flex: 1;
          border: none;
          padding: 10px;
          border-radius: 20px;
          background: #F3F4F6;
          font-size: 14px;
          outline: none;
        }
        
        .memory-chatbot-input button {
          background: #8B5CF6;
          border: none;
          color: white;
          border-radius: 50%;
          width: 40px;
          height: 40px;
          margin-left: 10px;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: background 0.2s;
        }
        
        .memory-chatbot-input button:hover {
          background: #7C3AED;
        }
        
        .memory-chatbot-triggers {
          display: none;
        }
        
        .memory-chatbot-typing {
          display: flex;
          align-self: flex-start;
          background: #F3F4F6;
          padding: 12px 14px;
          border-radius: 15px;
          border-bottom-left-radius: 4px;
          margin-bottom: 10px;
        }
        
        .memory-chatbot-typing span {
          height: 8px;
          width: 8px;
          background: #9CA3AF;
          border-radius: 50%;
          display: inline-block;
          margin-right: 3px;
          animation: typing 1.4s infinite;
        }
        
        .memory-chatbot-typing span:nth-child(2) {
          animation-delay: 0.2s;
        }
        
        .memory-chatbot-typing span:nth-child(3) {
          animation-delay: 0.4s;
        }
        
        @keyframes typing {
          0% {
            transform: translateY(0px);
            background: #9CA3AF;
          }
          28% {
            transform: translateY(-5px);
            background: #6B7280;
          }
          44% {
            transform: translateY(0px);
            background: #9CA3AF;
          }
        }
      `;
      document.head.appendChild(styleElement);
    };
    
    // Cria o chatbot no DOM
    const createChatbot = () => {
      if (document.getElementById('memory-chatbot')) return;
      
      const chatbot = document.createElement('div');
      chatbot.id = 'memory-chatbot';
      chatbot.className = 'memory-chatbot minimized';
      
      chatbot.innerHTML = `
        <div class="memory-chatbot-header">
          <div class="memory-chatbot-header-title">
            <div class="bot-avatar">🤖</div>
            <span>Assistente de Vendas</span>
          </div>
          <div class="memory-chatbot-header-actions">
            <button class="minimize-button">_</button>
            <button class="close-button">✕</button>
          </div>
        </div>
        <div class="memory-chatbot-messages" id="chat-messages">
          <!-- Mensagens serão adicionadas aqui -->
        </div>
        <div class="memory-chatbot-input">
          <input type="text" placeholder="Digite sua mensagem..." id="chat-input">
          <button id="send-button">→</button>
        </div>
        <div class="memory-chatbot-triggers">
          <!-- Gatilhos comportamentais -->
          <div data-trigger="exit-intent">Não perca essa oportunidade!</div>
          <div data-trigger="scroll-depth">Gostou do que viu até aqui?</div>
          <div data-trigger="time-on-page">Precisa de ajuda para decidir?</div>
          <div data-trigger="returning-visitor">Que bom ver você novamente!</div>
        </div>
      `;
      
      document.body.appendChild(chatbot);
      
      // Adiciona event listeners
      const header = chatbot.querySelector('.memory-chatbot-header');
      const minimizeButton = chatbot.querySelector('.minimize-button');
      const closeButton = chatbot.querySelector('.close-button');
      const sendButton = chatbot.querySelector('#send-button');
      const chatInput = chatbot.querySelector('#chat-input') as HTMLInputElement;
      
      if (header) {
        header.addEventListener('click', toggleChatbot);
      }
      
      if (minimizeButton) {
        minimizeButton.addEventListener('click', (e) => {
          e.stopPropagation(); // Evita trigger do header
          toggleChatbot();
        });
      }
      
      if (closeButton) {
        closeButton.addEventListener('click', (e) => {
          e.stopPropagation(); // Evita trigger do header
          hideChatbot();
          
          // Guarda preferência do usuário
          localStorage.setItem('chatbot_closed', 'true');
          localStorage.setItem('chatbot_closed_time', Date.now().toString());
        });
      }
      
      if (sendButton && chatInput) {
        sendButton.addEventListener('click', () => {
          sendMessage(chatInput.value);
          chatInput.value = '';
        });
        
        chatInput.addEventListener('keypress', (e) => {
          if (e.key === 'Enter') {
            sendMessage(chatInput.value);
            chatInput.value = '';
          }
        });
      }
    };
    
    // Armazena histórico de chat para contexto
    const chatHistory: string[] = [];
    
    // Adiciona mensagem ao chat
    const addToChat = (message: string, isUser: boolean) => {
      // Adiciona ao histórico
      chatHistory.push(`${isUser ? 'Usuário' : 'Bot'}: ${message}`);
      if (chatHistory.length > 10) chatHistory.shift(); // Limita histórico
      
      const messagesContainer = document.getElementById('chat-messages');
      if (!messagesContainer) return;
      
      // Cria elemento de mensagem
      const messageElement = document.createElement('div');
      messageElement.className = `memory-chatbot-message ${isUser ? 'user' : 'bot'}`;
      messageElement.innerHTML = message;
      
      // Adiciona ao container
      messagesContainer.appendChild(messageElement);
      
      // Scroll para a última mensagem
      messagesContainer.scrollTop = messagesContainer.scrollHeight;
      
      // Marca que o usuário já interagiu
      if (isUser) {
        setHasUserInteracted(true);
      }
      
      // Registra o evento
      console.log('Analytics:', {
        event: 'chatbot_message',
        is_user: isUser,
        message_length: message.length,
        timestamp: new Date().toISOString()
      });
    };
    
    // Mostra indicador de digitação
    const showTyping = () => {
      const messagesContainer = document.getElementById('chat-messages');
      if (!messagesContainer) return;
      
      const typingElement = document.createElement('div');
      typingElement.className = 'memory-chatbot-typing';
      typingElement.id = 'typing-indicator';
      typingElement.innerHTML = '<span></span><span></span><span></span>';
      
      messagesContainer.appendChild(typingElement);
      messagesContainer.scrollTop = messagesContainer.scrollHeight;
    };
    
    // Remove indicador de digitação
    const hideTyping = () => {
      const typingElement = document.getElementById('typing-indicator');
      if (typingElement) {
        typingElement.remove();
      }
    };
    
    // Processa envio de mensagem
    const sendMessage = (text: string) => {
      if (!text.trim()) return;
      
      // Adiciona mensagem do usuário
      addToChat(text, true);
      
      // Mostra indicador de digitação
      showTyping();
      
      // Simula tempo de resposta (entre 1 e 3 segundos)
      const responseTime = Math.floor(Math.random() * 2000) + 1000;
      
      setTimeout(() => {
        // Remove indicador de digitação
        hideTyping();
        
        // Gera resposta com base no histórico e mensagem atual
        const botResponse = generateResponse(text);
        
        // Adiciona resposta do bot
        addToChat(botResponse, false);
      }, responseTime);
    };
    
    // Gera resposta com base no contexto e histórico
    const generateResponse = (message: string): string => {
      // Palavras-chave para detecção de intenção
      const keywords = {
        greeting: ['oi', 'olá', 'ola', 'bom dia', 'boa tarde', 'boa noite', 'e aí', 'hey'],
        price: ['preço', 'preco', 'valor', 'quanto custa', 'planos', 'mensalidade', 'assinatura'],
        features: ['funciona', 'recursos', 'faz', 'funcionalidades', 'ferramentas', 'possibilidades'],
        comparison: ['diferença', 'diferente', 'melhor que', 'comparado', 'concorrente'],
        discount: ['desconto', 'cupom', 'promoção', 'oferta', 'mais barato'],
        help: ['ajuda', 'dúvida', 'duvida', 'como', 'funciona', 'suporte'],
        trial: ['teste', 'experimentar', 'grátis', 'gratuito', 'testar', 'trial'],
        thanks: ['obrigado', 'obrigada', 'valeu', 'agradeço', 'thanks']
      };
      
      // Normaliza a mensagem
      const normalizedMessage = message.toLowerCase();
      
      // Detecta a intenção principal
      let detectedIntent = '';
      let highestMatchCount = 0;
      
      Object.entries(keywords).forEach(([intent, words]) => {
        const matchCount = words.filter(word => normalizedMessage.includes(word)).length;
        if (matchCount > highestMatchCount) {
          highestMatchCount = matchCount;
          detectedIntent = intent;
        }
      });
      
      // Verifica o histórico para contexto adicional
      let hasGreetedBefore = chatHistory.some(msg => 
        msg.startsWith('Bot:') && keywords.greeting.some(word => msg.toLowerCase().includes(word))
      );
      
      let hasPriceContext = chatHistory.some(msg => 
        msg.includes('preço') || msg.includes('plano') || msg.includes('valor')
      );
      
      // Respostas personalizadas por intenção e contexto
      switch (detectedIntent) {
        case 'greeting':
          if (hasGreetedBefore) {
            return 'Como posso te ajudar hoje? Quer saber sobre funcionalidades ou preços?';
          } else {
            return 'Olá! 👋 Bem-vindo(a) à ContentAI! Sou o assistente virtual e estou aqui para ajudar você a criar conteúdo viral para suas redes sociais. Como posso te ajudar?';
          }
          
        case 'price':
          if (hasPriceContext) {
            return 'Temos vários planos disponíveis. O plano Premium por R$89/mês é o nosso mais vendido, com acesso a todas as funcionalidades essenciais. Posso te dar mais detalhes sobre o que está incluso em cada plano!';
          } else {
            return 'Temos 3 planos principais: Básico (R$59/mês), Premium (R$89/mês) e Ultimate (R$149/mês). Cada um tem benefícios específicos. Qual te interessa mais?';
          }
          
        case 'features':
          return 'A ContentAI permite criar scripts, legendas e ideias para TikTok e Instagram usando IA avançada. Nos planos Premium e Ultimate você também tem montagem automática de vídeos e edição com IA. Quer saber mais sobre alguma funcionalidade específica?';
          
        case 'comparison':
          return 'Diferente de outras ferramentas, a ContentAI é especializada em conteúdo para TikTok e Instagram, com foco em resultados virais e alta conversão. Nossa IA é treinada com análise de milhares de vídeos de sucesso, garantindo resultados superiores aos concorrentes!';
          
        case 'discount':
          return 'Estamos com uma oferta especial hoje! Use o cupom <strong>VIRAL20</strong> para ganhar 20% de desconto no plano anual. Isso representa uma economia de mais de R$400 por ano!';
          
        case 'help':
          return 'Claro, estou aqui para ajudar! Você tem dúvidas sobre como funciona a plataforma, preços ou funcionalidades específicas? Me conte mais para que eu possa te ajudar melhor.';
          
        case 'trial':
          return 'Sim! Oferecemos 7 dias de teste grátis em todos os planos. Você pode experimentar todos os recursos premium sem compromisso. Basta se cadastrar com seu e-mail. Quer que eu te mostre como começar?';
          
        case 'thanks':
          return 'Por nada! Estou aqui para ajudar. Tem mais alguma dúvida ou posso te auxiliar com mais alguma coisa?';
          
        default:
          // Fallback para quando não detecta uma intenção clara
          if (normalizedMessage.length < 10) {
            return 'Pode elaborar um pouco mais? Assim consigo te ajudar melhor!';
          } else {
            return 'Entendi! Acho que posso te ajudar com isso. A ContentAI é uma plataforma completa para criação de conteúdo para redes sociais. Você tem interesse em algum tipo específico de conteúdo ou rede social?';
          }
      }
    };
    
    // Toggle visibilidade do chatbot (minimiza/maximiza)
    const toggleChatbot = () => {
      const chatbot = document.getElementById('memory-chatbot');
      if (!chatbot) return;
      
      if (chatbot.classList.contains('minimized')) {
        // Maximiza o chatbot
        chatbot.classList.remove('minimized');
        setIsMinimized(false);
        
        // Se não tiver mensagens, adiciona a primeira
        const messagesContainer = document.getElementById('chat-messages');
        if (messagesContainer && messagesContainer.childElementCount === 0) {
          addToChat('Olá! 👋 Como posso te ajudar hoje com criação de conteúdo para suas redes sociais?', false);
        }
      } else {
        // Minimiza o chatbot
        chatbot.classList.add('minimized');
        setIsMinimized(true);
      }
    };
    
    // Mostra o chatbot
    const showChatbot = () => {
      const chatbot = document.getElementById('memory-chatbot');
      if (!chatbot) return;
      
      chatbot.classList.add('visible');
      setIsVisible(true);
    };
    
    // Esconde o chatbot
    const hideChatbot = () => {
      const chatbot = document.getElementById('memory-chatbot');
      if (!chatbot) return;
      
      chatbot.classList.remove('visible');
      setIsVisible(false);
    };
    
    // Configura gatilhos comportamentais
    const setupBehavioralTriggers = () => {
      // Evita mostrar o chatbot se o usuário fechou recentemente
      const wasClosed = localStorage.getItem('chatbot_closed') === 'true';
      const closedTime = parseInt(localStorage.getItem('chatbot_closed_time') || '0', 10);
      const now = Date.now();
      const hoursSinceClosed = (now - closedTime) / (1000 * 60 * 60);
      
      if (wasClosed && hoursSinceClosed < 1) {
        // Não mostra se foi fechado há menos de 1 hora
        return;
      }
      
      // Gatilho de tempo na página
      setTimeout(() => {
        if (!isVisible && !hasUserInteracted) {
          showChatbot();
          
          // Aguarda um pouco e então maximiza automaticamente
          setTimeout(() => {
            if (!isMinimized) return;
            
            toggleChatbot();
            addToChat('Vi que você está explorando nossa plataforma. Posso ajudar com informações sobre criação de conteúdo para redes sociais?', false);
          }, 2000);
        }
      }, 30000); // 30 segundos
      
      // Gatilho de profundidade de rolagem
      let hasTriggeredScrollDepth = false;
      window.addEventListener('scroll', () => {
        if (hasTriggeredScrollDepth || isVisible || hasUserInteracted) return;
        
        const scrollDepth = (window.scrollY / (document.body.scrollHeight - window.innerHeight)) * 100;
        
        if (scrollDepth > 70) { // Usuário rolou mais de 70% da página
          hasTriggeredScrollDepth = true;
          showChatbot();
          
          // Aguarda um pouco e então maximiza automaticamente
          setTimeout(() => {
            if (!isMinimized) return;
            
            toggleChatbot();
            addToChat('Vejo que você está interessado em nossa plataforma! Tem alguma dúvida sobre como a ContentAI pode te ajudar com suas redes sociais?', false);
          }, 2000);
        }
      });
      
      // Gatilho de intenção de saída
      document.addEventListener('mouseleave', (e) => {
        if (e.clientY <= 0 && !isVisible && !hasUserInteracted) {
          showChatbot();
          
          // Aguarda um pouco e então maximiza automaticamente
          setTimeout(() => {
            if (!isMinimized) return;
            
            toggleChatbot();
            addToChat('Antes de sair, posso te ajudar com alguma informação? Temos uma oferta especial hoje!', false);
          }, 1000);
        }
      });
    };
    
    // Inicializa o chatbot
    addStyles();
    createChatbot();
    
    // Mostra o chatbot (com atraso inicial)
    setTimeout(() => {
      showChatbot();
    }, 5000);
    
    // Configura gatilhos comportamentais
    setupBehavioralTriggers();
    
    // Cleanup
    return () => {
      const chatbot = document.getElementById('memory-chatbot');
      if (chatbot) {
        chatbot.remove();
      }
      
      const styles = document.getElementById('memory-chatbot-styles');
      if (styles) {
        styles.remove();
      }
    };
  }, [isVisible, isMinimized, hasUserInteracted]);
  
  // Este componente não renderiza nada visualmente (manipula o DOM diretamente)
  return null;
}
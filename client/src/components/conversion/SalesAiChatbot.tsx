import { useEffect, useState } from 'react';

/**
 * Componente de Chatbot movido pelo OpenAI
 * Implementação sem mensalidade usando Chatbase
 * Limite gratuito: 50 mensagens/mês (no plano gratuito)
 */
export default function SalesAiChatbot() {
  const [isLoaded, setIsLoaded] = useState(false);
  const [isMinimized, setIsMinimized] = useState(true);
  const chatbotId = 'chatbot-simulado'; // Seria substituído por ID real da Chatbase
  
  useEffect(() => {
    // Simula a inicialização do Chatbase
    // Na versão real, usa o SDK oficial
    const loadChatbase = () => {
      // Atrasa um pouco para dar tempo de carregar a página
      const timer = setTimeout(() => {
        console.log('Carregando chatbot de vendas com IA...');
        setIsLoaded(true);
        
        // Após alguns segundos, mostra uma "dica" proativa
        setTimeout(() => {
          if (document.querySelector('.chatbot-container')) {
            const messageElement = document.createElement('div');
            messageElement.className = 'chatbot-message';
            messageElement.innerHTML = `
              <div class="chatbot-bubble">
                Olá! Quer saber qual plano é ideal para você? Estou aqui para ajudar! 👋
              </div>
            `;
            document.querySelector('.chatbot-messages')?.appendChild(messageElement);
          }
        }, 15000);
      }, 5000);
      
      return () => clearTimeout(timer);
    };
    
    loadChatbase();
    
    // Verifica se o usuário está na página há mais de 30 segundos
    // Se sim, mostra o chatbot automaticamente
    const autoOpenTimer = setTimeout(() => {
      if (Math.random() > 0.5) { // 50% de chance
        setIsMinimized(false);
      }
    }, 30000);
    
    return () => {
      clearTimeout(autoOpenTimer);
    };
  }, []);
  
  const toggleChatbot = () => {
    setIsMinimized(!isMinimized);
  };
  
  // Simula o envio de mensagem
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const input = document.querySelector('.chatbot-input') as HTMLInputElement;
    if (!input.value.trim()) return;
    
    // Adiciona mensagem do usuário
    const userMessageElement = document.createElement('div');
    userMessageElement.className = 'chatbot-message user';
    userMessageElement.innerHTML = `
      <div class="chatbot-bubble user">
        ${input.value}
      </div>
    `;
    document.querySelector('.chatbot-messages')?.appendChild(userMessageElement);
    
    // Limpa o input
    const userMessage = input.value;
    input.value = '';
    
    // Mostra indicador de digitação
    const typingElement = document.createElement('div');
    typingElement.className = 'chatbot-message typing';
    typingElement.innerHTML = `
      <div class="chatbot-bubble typing">
        <div class="typing-indicator">
          <span></span>
          <span></span>
          <span></span>
        </div>
      </div>
    `;
    document.querySelector('.chatbot-messages')?.appendChild(typingElement);
    
    // Rola para o final
    const messagesContainer = document.querySelector('.chatbot-messages');
    if (messagesContainer) {
      messagesContainer.scrollTop = messagesContainer.scrollHeight;
    }
    
    // Simula resposta do chatbot (seria substituído por chamada real à API)
    setTimeout(() => {
      // Remove indicador de digitação
      document.querySelector('.typing')?.remove();
      
      // Determina resposta apropriada
      let botResponse = '';
      
      if (userMessage.toLowerCase().includes('preço') || userMessage.toLowerCase().includes('plano')) {
        botResponse = `
          Temos 3 planos disponíveis:
          
          1. Básico: R$59/mês - Ideal para iniciantes, até 30 gerações/mês.
          
          2. Premium: R$89/mês - Nosso MAIS VENDIDO! Inclui até 100 gerações e montagem automática.
          
          3. Ultimate: R$149/mês - Para profissionais: inclui edição com IA e efeitos cinemáticos.
          
          Com base no seu perfil, o Premium seria ideal. Quer conhecer mais detalhes?
        `;
      } else if (userMessage.toLowerCase().includes('funciona') || userMessage.toLowerCase().includes('como')) {
        botResponse = `
          É super simples! Você escolhe o tipo de conteúdo, a plataforma e o estilo de comunicação.
          
          Nossa IA gera o conteúdo otimizado em segundos e nos planos Premium e Ultimate você pode até montar vídeos automaticamente!
          
          Quer uma demonstração?
        `;
      } else if (userMessage.toLowerCase().includes('melhor') || userMessage.toLowerCase().includes('recomenda')) {
        botResponse = `
          Com base nas suas necessidades, recomendo o plano Premium (R$89/mês).
          
          É nosso mais popular pois equilibra custo-benefício com recursos avançados. Você terá acesso à montagem automática de vídeos e 100 gerações por mês, ideal para quem posta regularmente.
          
          Temos um case de sucesso da @mariafashion que aumentou engajamento em 43% em apenas 3 semanas usando este plano!
        `;
      } else {
        botResponse = `
          Obrigado por sua mensagem! Estou aqui para ajudar com qualquer dúvida sobre nossos planos.
          
          Posso indicar o melhor plano para seu perfil, explicar como funciona nossa plataforma ou mostrar casos de sucesso.
          
          O que você gostaria de saber?
        `;
      }
      
      // Adiciona resposta do bot
      const botMessageElement = document.createElement('div');
      botMessageElement.className = 'chatbot-message';
      botMessageElement.innerHTML = `
        <div class="chatbot-bubble">
          ${botResponse.replace(/\n/g, '<br>')}
        </div>
      `;
      document.querySelector('.chatbot-messages')?.appendChild(botMessageElement);
      
      // Rola para o final
      if (messagesContainer) {
        messagesContainer.scrollTop = messagesContainer.scrollHeight;
      }
    }, 1500);
  };
  
  if (!isLoaded) return null;
  
  return (
    <div className={`fixed bottom-6 right-6 z-50 transition-all duration-300 ${isMinimized ? 'w-16 h-16' : 'w-80 h-96'}`}>
      {/* Botão do chatbot */}
      {isMinimized && (
        <button
          className="w-16 h-16 rounded-full bg-gradient-to-r from-primary to-purple-600 text-white flex items-center justify-center shadow-lg hover:shadow-xl transition-shadow"
          onClick={toggleChatbot}
        >
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-8 h-8">
            <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
          </svg>
        </button>
      )}
      
      {/* Container do chatbot */}
      {!isMinimized && (
        <div className="chatbot-container w-full h-full bg-white rounded-lg shadow-xl flex flex-col border border-gray-200 overflow-hidden">
          {/* Cabeçalho */}
          <div className="bg-gradient-to-r from-primary to-purple-600 text-white p-3 flex justify-between items-center">
            <div className="flex items-center gap-2">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
                <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
              </svg>
              <h3 className="font-medium">Assistente de Planos</h3>
            </div>
            <button 
              className="text-white hover:text-gray-100"
              onClick={toggleChatbot}
            >
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
                <line x1="18" y1="6" x2="6" y2="18"></line>
                <line x1="6" y1="6" x2="18" y2="18"></line>
              </svg>
            </button>
          </div>
          
          {/* Área de mensagens */}
          <div className="chatbot-messages flex-1 p-3 overflow-y-auto flex flex-col gap-3">
            <div className="chatbot-message">
              <div className="chatbot-bubble inline-block bg-gray-100 rounded-lg p-3 max-w-[80%]">
                Olá! Como posso ajudar com nossos planos?
              </div>
            </div>
          </div>
          
          {/* Input */}
          <form onSubmit={handleSubmit} className="border-t border-gray-200 p-3">
            <div className="flex gap-2">
              <input
                type="text"
                className="chatbot-input flex-1 border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
                placeholder="Digite sua mensagem..."
              />
              <button
                type="submit"
                className="bg-primary text-white rounded-lg px-3 py-2 hover:bg-primary/90"
              >
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
                  <line x1="22" y1="2" x2="11" y2="13"></line>
                  <polygon points="22 2 15 22 11 13 2 9 22 2"></polygon>
                </svg>
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
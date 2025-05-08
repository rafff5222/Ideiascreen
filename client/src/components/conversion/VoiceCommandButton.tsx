import { useEffect, useState } from 'react';

/**
 * Componente Botão de Compra por Comando de Voz
 * Permite que o usuário realize ações como compra e navegação
 * utilizando comandos de voz
 */
export default function VoiceCommandButton() {
  const [isListening, setIsListening] = useState(false);
  const [supported, setSupported] = useState(false);
  
  useEffect(() => {
    // Verifica se o navegador suporta reconhecimento de voz
    const checkSupport = () => {
      return 'webkitSpeechRecognition' in window || 'SpeechRecognition' in window;
    };
    
    setSupported(checkSupport());
    
    // Adiciona estilos CSS
    const addStyles = () => {
      if (document.getElementById('voice-command-styles')) return;
      
      const styleElement = document.createElement('style');
      styleElement.id = 'voice-command-styles';
      styleElement.textContent = `
        .voice-command-button {
          position: fixed;
          bottom: 150px;
          right: 20px;
          width: 60px;
          height: 60px;
          border-radius: 50%;
          background: linear-gradient(135deg, #8B5CF6, #6366F1);
          display: flex;
          align-items: center;
          justify-content: center;
          color: white;
          box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
          cursor: pointer;
          z-index: 1000;
          transition: all 0.3s ease;
          border: none;
          font-size: 24px;
          opacity: 0;
          transform: translateY(20px) scale(0.9);
          animation: voice-button-appear 0.5s forwards 1s;
        }
        
        @keyframes voice-button-appear {
          to {
            opacity: 1;
            transform: translateY(0) scale(1);
          }
        }
        
        .voice-command-button:hover {
          transform: scale(1.05);
          box-shadow: 0 6px 15px rgba(0, 0, 0, 0.15);
        }
        
        .voice-command-button.listening {
          animation: pulse 1.5s infinite;
        }
        
        @keyframes pulse {
          0% {
            box-shadow: 0 0 0 0 rgba(139, 92, 246, 0.5);
          }
          70% {
            box-shadow: 0 0 0 15px rgba(139, 92, 246, 0);
          }
          100% {
            box-shadow: 0 0 0 0 rgba(139, 92, 246, 0);
          }
        }
        
        .voice-tooltip {
          position: fixed;
          bottom: 155px;
          right: 90px;
          background: white;
          padding: 10px 15px;
          border-radius: 8px;
          box-shadow: 0 3px 10px rgba(0, 0, 0, 0.1);
          font-size: 14px;
          color: #4B5563;
          max-width: 250px;
          opacity: 0;
          pointer-events: none;
          transition: all 0.3s ease;
          font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
        }
        
        .voice-tooltip.active {
          opacity: 1;
          pointer-events: all;
        }
        
        .voice-feedback {
          position: fixed;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          background: rgba(0, 0, 0, 0.8);
          color: white;
          padding: 20px 30px;
          border-radius: 12px;
          font-size: 20px;
          font-weight: 600;
          max-width: 80%;
          text-align: center;
          z-index: 1100;
          opacity: 0;
          pointer-events: none;
          transition: all 0.3s ease;
          font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
        }
        
        .voice-feedback.active {
          opacity: 1;
        }
        
        .voice-command-overlay {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(0, 0, 0, 0.5);
          z-index: 1050;
          opacity: 0;
          pointer-events: none;
          transition: opacity 0.3s ease;
        }
        
        .voice-command-overlay.active {
          opacity: 1;
          pointer-events: all;
        }
        
        .voice-command-popup {
          position: fixed;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%) scale(0.9);
          background: white;
          border-radius: 12px;
          padding: 20px;
          width: 320px;
          max-width: 90%;
          z-index: 1060;
          opacity: 0;
          pointer-events: none;
          transition: all 0.3s ease;
          font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
          text-align: center;
        }
        
        .voice-command-popup.active {
          opacity: 1;
          pointer-events: all;
          transform: translate(-50%, -50%) scale(1);
        }
        
        .voice-commands-list {
          margin: 15px 0;
          text-align: left;
        }
        
        .voice-command-item {
          padding: 8px 0;
          border-bottom: 1px solid #F3F4F6;
          display: flex;
          align-items: center;
        }
        
        .voice-command-item:last-child {
          border-bottom: none;
        }
        
        .voice-command-name {
          font-weight: 600;
          margin-right: 10px;
          color: #4B5563;
        }
        
        .voice-command-desc {
          font-size: 13px;
          color: #9CA3AF;
        }
        
        .voice-popup-actions {
          margin-top: 20px;
        }
        
        .voice-popup-button {
          background: #8B5CF6;
          color: white;
          border: none;
          padding: 8px 16px;
          border-radius: 8px;
          font-weight: 500;
          cursor: pointer;
          transition: background 0.2s;
        }
        
        .voice-popup-button:hover {
          background: #7C3AED;
        }
        
        .voice-listening-indicator {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 4px;
          margin-top: 15px;
        }
        
        .voice-listening-dot {
          width: 8px;
          height: 8px;
          background: #8B5CF6;
          border-radius: 50%;
        }
        
        .voice-listening-dot:nth-child(1) {
          animation: dot-bounce 1.4s -0.32s infinite ease-in-out;
        }
        
        .voice-listening-dot:nth-child(2) {
          animation: dot-bounce 1.4s -0.16s infinite ease-in-out;
        }
        
        .voice-listening-dot:nth-child(3) {
          animation: dot-bounce 1.4s 0s infinite ease-in-out;
        }
        
        @keyframes dot-bounce {
          0%, 80%, 100% {
            transform: scale(0);
          }
          40% {
            transform: scale(1);
          }
        }
      `;
      document.head.appendChild(styleElement);
    };
    
    // Cria o botão de comando de voz
    const createVoiceButton = () => {
      if (document.getElementById('voice-command-button')) return;
      
      const button = document.createElement('button');
      button.id = 'voice-command-button';
      button.className = 'voice-command-button';
      button.innerHTML = '<span>🎤</span>';
      button.title = 'Comandos de voz';
      
      document.body.appendChild(button);
      
      // Adiciona tooltip
      const tooltip = document.createElement('div');
      tooltip.id = 'voice-tooltip';
      tooltip.className = 'voice-tooltip';
      tooltip.textContent = 'Clique para usar comandos de voz';
      
      document.body.appendChild(tooltip);
      
      // Adiciona event listener
      button.addEventListener('mouseenter', () => {
        tooltip.classList.add('active');
      });
      
      button.addEventListener('mouseleave', () => {
        tooltip.classList.remove('active');
      });
      
      button.addEventListener('click', toggleVoiceRecognition);
    };
    
    // Cria o elemento de feedback
    const createFeedbackElement = () => {
      if (document.getElementById('voice-feedback')) return;
      
      const feedback = document.createElement('div');
      feedback.id = 'voice-feedback';
      feedback.className = 'voice-feedback';
      
      document.body.appendChild(feedback);
    };
    
    // Mostra feedback do comando
    const showFeedback = (text: string, duration: number = 3000) => {
      const feedback = document.getElementById('voice-feedback');
      if (!feedback) return;
      
      feedback.textContent = text;
      feedback.classList.add('active');
      
      setTimeout(() => {
        feedback.classList.remove('active');
      }, duration);
    };
    
    // Mostra o popup de comandos disponíveis
    const showCommandsPopup = () => {
      // Cria overlay
      const overlay = document.createElement('div');
      overlay.className = 'voice-command-overlay';
      document.body.appendChild(overlay);
      
      // Cria popup
      const popup = document.createElement('div');
      popup.className = 'voice-command-popup';
      
      // Lista de comandos disponíveis
      popup.innerHTML = `
        <h3 style="margin-top: 0;">Comandos de Voz Disponíveis</h3>
        <p style="font-size: 14px; color: #6B7280;">Clique no botão e diga um destes comandos:</p>
        
        <div class="voice-commands-list">
          <div class="voice-command-item">
            <div class="voice-command-name">"Comprar"</div>
            <div class="voice-command-desc">Ir para o checkout</div>
          </div>
          <div class="voice-command-item">
            <div class="voice-command-name">"Planos"</div>
            <div class="voice-command-desc">Ver todos os planos</div>
          </div>
          <div class="voice-command-item">
            <div class="voice-command-name">"Funcionalidades"</div>
            <div class="voice-command-desc">Ver recursos disponíveis</div>
          </div>
          <div class="voice-command-item">
            <div class="voice-command-name">"Premium"</div>
            <div class="voice-command-desc">Ver plano Premium</div>
          </div>
          <div class="voice-command-item">
            <div class="voice-command-name">"Ajuda"</div>
            <div class="voice-command-desc">Abrir suporte</div>
          </div>
        </div>
        
        <div class="voice-popup-actions">
          <button class="voice-popup-button">Entendi</button>
        </div>
      `;
      
      document.body.appendChild(popup);
      
      // Ativa com animação
      setTimeout(() => {
        overlay.classList.add('active');
        popup.classList.add('active');
      }, 10);
      
      // Adiciona handler de close
      const closeButton = popup.querySelector('.voice-popup-button');
      if (closeButton) {
        closeButton.addEventListener('click', () => {
          overlay.classList.remove('active');
          popup.classList.remove('active');
          
          setTimeout(() => {
            overlay.remove();
            popup.remove();
          }, 300);
        });
      }
      
      // Adiciona handler de clique no overlay
      overlay.addEventListener('click', () => {
        overlay.classList.remove('active');
        popup.classList.remove('active');
        
        setTimeout(() => {
          overlay.remove();
          popup.remove();
        }, 300);
      });
    };
    
    // Inicializa reconhecimento de voz
    const initSpeechRecognition = () => {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      if (!SpeechRecognition) return null;
      
      const recognition = new SpeechRecognition();
      
      // Configura o reconhecimento
      recognition.lang = 'pt-BR';
      recognition.continuous = false;
      recognition.interimResults = false;
      
      // Handler para resultados
      recognition.onresult = (event) => {
        const transcript = event.results[0][0].transcript.toLowerCase();
        processCommand(transcript);
      };
      
      // Handler para finalização
      recognition.onend = () => {
        setIsListening(false);
        
        // Atualiza classe do botão
        const button = document.getElementById('voice-command-button');
        if (button) {
          button.classList.remove('listening');
        }
        
        // Remove indicador de escuta
        const indicator = document.getElementById('voice-listening-indicator');
        if (indicator) {
          indicator.remove();
        }
      };
      
      // Handler para erros
      recognition.onerror = (event) => {
        console.error('Erro no reconhecimento de voz:', event.error);
        setIsListening(false);
        
        if (event.error === 'not-allowed') {
          showFeedback('Permissão de microfone negada');
        } else {
          showFeedback('Não foi possível entender o comando');
        }
      };
      
      return recognition;
    };
    
    // Processa comandos de voz
    const processCommand = (command: string) => {
      console.log('Comando de voz recebido:', command);
      
      // Mapeia comandos para ações
      if (command.includes('comprar')) {
        showFeedback('Redirecionando para o checkout...');
        setTimeout(() => {
          window.location.href = '/checkout';
        }, 1000);
      }
      else if (command.includes('planos') || command.includes('preços')) {
        showFeedback('Mostrando planos disponíveis...');
        scrollToSection('pricing');
      }
      else if (command.includes('funcionalidades') || command.includes('recursos')) {
        showFeedback('Mostrando funcionalidades...');
        scrollToSection('features');
      }
      else if (command.includes('premium')) {
        showFeedback('Destacando plano Premium...');
        highlightPremiumPlan();
      }
      else if (command.includes('ajuda') || command.includes('suporte')) {
        showFeedback('Abrindo ajuda...');
        openSupportChat();
      }
      else {
        showFeedback('Comando não reconhecido. Tente novamente.');
      }
      
      // Registra o evento para analytics
      logVoiceCommand(command);
    };
    
    // Registra comando para analytics
    const logVoiceCommand = (command: string) => {
      console.log('Analytics:', {
        event: 'voice_command',
        command: command,
        timestamp: new Date().toISOString()
      });
    };
    
    // Rola até uma seção da página
    const scrollToSection = (sectionId: string) => {
      const section = document.getElementById(sectionId) || 
                      document.querySelector(`.${sectionId}`) || 
                      document.querySelector(`[data-section="${sectionId}"]`);
      
      if (section) {
        section.scrollIntoView({ behavior: 'smooth' });
      }
    };
    
    // Destaca o plano Premium
    const highlightPremiumPlan = () => {
      const premiumPlan = document.querySelector('.plan-premium') || 
                          document.querySelector('[data-plan="premium"]') ||
                          document.querySelector('.premium-plan');
      
      if (premiumPlan) {
        // Adiciona efeito de destaque
        premiumPlan.classList.add('highlight-plan');
        
        // Adiciona estilos para destaque se não existirem
        if (!document.getElementById('highlight-plan-styles')) {
          const styleElement = document.createElement('style');
          styleElement.id = 'highlight-plan-styles';
          styleElement.textContent = `
            .highlight-plan {
              animation: highlight-pulse 2s;
              box-shadow: 0 0 20px rgba(139, 92, 246, 0.5);
              transform: scale(1.05);
              z-index: 1;
              transition: all 0.3s ease;
            }
            
            @keyframes highlight-pulse {
              0% {
                box-shadow: 0 0 0 0 rgba(139, 92, 246, 0.8);
              }
              70% {
                box-shadow: 0 0 0 15px rgba(139, 92, 246, 0);
              }
              100% {
                box-shadow: 0 0 20px rgba(139, 92, 246, 0.5);
              }
            }
          `;
          document.head.appendChild(styleElement);
        }
        
        // Scroll até o plano
        premiumPlan.scrollIntoView({ behavior: 'smooth', block: 'center' });
        
        // Remove o destaque após 5 segundos
        setTimeout(() => {
          premiumPlan.classList.remove('highlight-plan');
        }, 5000);
      }
    };
    
    // Abre o chat de suporte
    const openSupportChat = () => {
      // Verifica se existe um elemento de chat
      const chatButton = document.querySelector('#chat-button') || 
                         document.querySelector('.support-chat') ||
                         document.querySelector('[data-chat="support"]');
      
      if (chatButton && chatButton instanceof HTMLElement) {
        chatButton.click();
      } else {
        // Se não encontrar um chat, redireciona para a página de contato
        window.location.href = '/contato';
      }
    };
    
    // Controla o reconhecimento de voz
    const toggleVoiceRecognition = () => {
      if (isListening) {
        // Parar reconhecimento
        const recognition = window.voiceRecognition;
        if (recognition) {
          recognition.stop();
        }
        
        setIsListening(false);
      } else {
        // Iniciar reconhecimento
        if (!window.voiceRecognition) {
          window.voiceRecognition = initSpeechRecognition();
        }
        
        const recognition = window.voiceRecognition;
        if (recognition) {
          recognition.start();
          setIsListening(true);
          
          // Atualiza classe do botão
          const button = document.getElementById('voice-command-button');
          if (button) {
            button.classList.add('listening');
          }
          
          // Adiciona indicador de escuta
          if (!document.getElementById('voice-listening-indicator')) {
            const indicator = document.createElement('div');
            indicator.id = 'voice-listening-indicator';
            indicator.className = 'voice-listening-indicator';
            indicator.innerHTML = `
              <div class="voice-listening-dot"></div>
              <div class="voice-listening-dot"></div>
              <div class="voice-listening-dot"></div>
            `;
            
            // Adiciona próximo ao botão
            const button = document.getElementById('voice-command-button');
            if (button) {
              const buttonRect = button.getBoundingClientRect();
              indicator.style.position = 'fixed';
              indicator.style.bottom = 'calc(150px + 70px)';
              indicator.style.right = '20px';
              indicator.style.transform = 'translateX(-50%)';
              
              document.body.appendChild(indicator);
            }
          }
          
          // Mostra feedback
          showFeedback('Ouvindo... Diga um comando');
          
          // Se for a primeira vez, mostra o popup de comandos
          if (!localStorage.getItem('voice-commands-shown')) {
            localStorage.setItem('voice-commands-shown', 'true');
            showCommandsPopup();
          }
        } else {
          showFeedback('Seu navegador não suporta reconhecimento de voz');
        }
      }
    };
    
    // Inicializa o botão se o navegador for compatível
    if (supported) {
      addStyles();
      createVoiceButton();
      createFeedbackElement();
      
      // Adiciona ouvinte de "Carregar mais" após o carregamento inicial da página
      document.addEventListener('DOMContentLoaded', () => {
        // Mostra o botão após o carregamento completo
        const button = document.getElementById('voice-command-button');
        if (button) {
          button.style.visibility = 'visible';
        }
      });
    }
    
    // Adiciona propriedade window.voiceRecognition para global no TS 
    declare global {
      interface Window { 
        SpeechRecognition: typeof SpeechRecognition;
        webkitSpeechRecognition: typeof SpeechRecognition;
        voiceRecognition: any;
      }
    }
    
    // Cleanup
    return () => {
      if (window.voiceRecognition) {
        window.voiceRecognition.abort();
      }
      
      const button = document.getElementById('voice-command-button');
      if (button) {
        button.remove();
      }
      
      const tooltip = document.getElementById('voice-tooltip');
      if (tooltip) {
        tooltip.remove();
      }
      
      const feedback = document.getElementById('voice-feedback');
      if (feedback) {
        feedback.remove();
      }
      
      const indicator = document.getElementById('voice-listening-indicator');
      if (indicator) {
        indicator.remove();
      }
    };
  }, [isListening, supported]);
  
  // O componente não renderiza nada diretamente, manipulação via DOM
  return null;
}
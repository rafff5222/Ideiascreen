import { useEffect, useState } from 'react';

/**
 * Componente Botão de Atendimento Inteligente
 * Oferece ajuda contextual com base na página em que o usuário está navegando
 */
export default function SmartHelpButton() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  useEffect(() => {
    // Adiciona estilos CSS
    const addStyles = () => {
      if (document.getElementById('smart-help-styles')) return;
      
      const styleElement = document.createElement('style');
      styleElement.id = 'smart-help-styles';
      styleElement.textContent = `
        .smart-help-button {
          position: fixed;
          bottom: 20px;
          right: 20px;
          z-index: 999;
          background: linear-gradient(90deg, #8B5CF6, #EC4899);
          color: white;
          border: none;
          border-radius: 50px;
          padding: 12px 20px;
          font-weight: 600;
          font-size: 14px;
          cursor: pointer;
          box-shadow: 0 4px 10px rgba(0, 0, 0, 0.15);
          display: flex;
          align-items: center;
          transition: all 0.3s ease;
          font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
        }
        
        .smart-help-button:hover {
          transform: translateY(-2px);
          box-shadow: 0 6px 15px rgba(0, 0, 0, 0.2);
        }
        
        .smart-help-button .robot-icon {
          margin-right: 8px;
          font-size: 18px;
        }
        
        .smart-help-modal {
          position: fixed;
          bottom: 80px;
          right: 20px;
          background: white;
          border-radius: 12px;
          box-shadow: 0 5px 30px rgba(0, 0, 0, 0.15);
          width: 320px;
          max-width: 90vw;
          z-index: 1000;
          overflow: hidden;
          font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
          opacity: 0;
          transform: translateY(20px) scale(0.95);
          transition: all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275);
          pointer-events: none;
        }
        
        .smart-help-modal.open {
          opacity: 1;
          transform: translateY(0) scale(1);
          pointer-events: all;
        }
        
        .smart-help-header {
          padding: 16px;
          background: linear-gradient(90deg, #8B5CF6, #EC4899);
          color: white;
          display: flex;
          align-items: center;
          justify-content: space-between;
        }
        
        .smart-help-header h3 {
          font-size: 16px;
          font-weight: 600;
          margin: 0;
        }
        
        .smart-help-close {
          background: transparent;
          border: none;
          color: white;
          cursor: pointer;
          padding: 0;
          font-size: 16px;
          opacity: 0.8;
          transition: opacity 0.2s;
        }
        
        .smart-help-close:hover {
          opacity: 1;
        }
        
        .smart-help-content {
          padding: 16px;
          max-height: 300px;
          overflow-y: auto;
        }
        
        .smart-help-message {
          margin-bottom: 12px;
          font-size: 14px;
          line-height: 1.5;
          color: #333;
        }
        
        .smart-help-options {
          display: flex;
          flex-direction: column;
          gap: 8px;
          margin-top: 16px;
        }
        
        .smart-help-option {
          padding: 10px 12px;
          background: #f5f5f5;
          border: 1px solid #e0e0e0;
          border-radius: 6px;
          font-size: 14px;
          cursor: pointer;
          transition: all 0.2s;
          text-align: left;
        }
        
        .smart-help-option:hover {
          background: #eee;
          border-color: #ccc;
        }
        
        .smart-help-typing {
          display: flex;
          align-items: center;
          margin-top: 12px;
          font-size: 14px;
          color: #666;
        }
        
        .smart-help-typing span {
          margin-left: 8px;
        }
        
        .typing-dots {
          display: inline-flex;
        }
        
        .typing-dot {
          width: 6px;
          height: 6px;
          border-radius: 50%;
          background-color: #999;
          margin: 0 1px;
          animation: typing-dot 1.4s infinite;
        }
        
        .typing-dot:nth-child(2) {
          animation-delay: 0.2s;
        }
        
        .typing-dot:nth-child(3) {
          animation-delay: 0.4s;
        }
        
        @keyframes typing-dot {
          0%, 60%, 100% {
            transform: translateY(0);
          }
          30% {
            transform: translateY(-5px);
          }
        }
        
        .smart-help-footer {
          padding: 12px 16px;
          border-top: 1px solid #eee;
          display: flex;
          align-items: center;
          justify-content: space-between;
          font-size: 12px;
          color: #666;
        }
        
        .smart-help-footer a {
          color: #8B5CF6;
          text-decoration: none;
        }
        
        .smart-help-links {
          display: flex;
          gap: 10px;
        }
        
        @media (max-width: 768px) {
          .smart-help-button {
            padding: 10px 16px;
            font-size: 13px;
          }
        }
      `;
      document.head.appendChild(styleElement);
    };
    
    // Adiciona o botão de ajuda inteligente
    const createHelpButton = () => {
      if (document.getElementById('smart-help-button')) return;
      
      const button = document.createElement('button');
      button.id = 'smart-help-button';
      button.className = 'smart-help-button';
      button.innerHTML = `
        <span class="robot-icon">🤖</span>
        <span>Ajuda Instantânea</span>
      `;
      
      document.body.appendChild(button);
      
      // Adiciona event listener para o botão
      button.addEventListener('click', () => {
        openSmartHelp();
      });
    };
    
    // Cria o modal de ajuda inteligente
    const createHelpModal = () => {
      if (document.getElementById('smart-help-modal')) return;
      
      const modal = document.createElement('div');
      modal.id = 'smart-help-modal';
      modal.className = 'smart-help-modal';
      
      modal.innerHTML = `
        <div class="smart-help-header">
          <h3>Assistente ContentPro</h3>
          <button class="smart-help-close" id="smart-help-close">✕</button>
        </div>
        <div class="smart-help-content" id="smart-help-content">
          <div class="smart-help-typing" id="smart-help-typing">
            <div class="typing-dots">
              <div class="typing-dot"></div>
              <div class="typing-dot"></div>
              <div class="typing-dot"></div>
            </div>
            <span>Analisando contexto...</span>
          </div>
        </div>
        <div class="smart-help-footer">
          <span>Powered by IA</span>
          <div class="smart-help-links">
            <a href="#" id="smart-help-contact">Falar com humano</a>
          </div>
        </div>
      `;
      
      document.body.appendChild(modal);
      
      // Adiciona event listener para o botão de fechar
      const closeButton = document.getElementById('smart-help-close');
      if (closeButton) {
        closeButton.addEventListener('click', () => {
          closeSmartHelp();
        });
      }
      
      // Adiciona event listener para o link de contato
      const contactLink = document.getElementById('smart-help-contact');
      if (contactLink) {
        contactLink.addEventListener('click', (e) => {
          e.preventDefault();
          showContactOptions();
        });
      }
    };
    
    // Abre o modal de ajuda inteligente
    const openSmartHelp = () => {
      const modal = document.getElementById('smart-help-modal');
      if (!modal) return;
      
      modal.classList.add('open');
      setIsModalOpen(true);
      
      // Obtém o contexto da página atual
      const currentContext = getPageContext();
      
      // Simula o carregamento da resposta
      setTimeout(() => {
        const typingElement = document.getElementById('smart-help-typing');
        if (typingElement) {
          typingElement.style.display = 'none';
        }
        
        // Adiciona a mensagem contextual
        const contentElement = document.getElementById('smart-help-content');
        if (contentElement) {
          contentElement.innerHTML = `
            <div class="smart-help-message">
              ${currentContext.message}
            </div>
            <div class="smart-help-options">
              ${currentContext.options.map(option => `
                <button class="smart-help-option" data-action="${option.action}">${option.text}</button>
              `).join('')}
            </div>
          `;
          
          // Adiciona event listeners para as opções
          const optionButtons = contentElement.querySelectorAll('.smart-help-option');
          optionButtons.forEach(button => {
            button.addEventListener('click', (e) => {
              const action = (e.currentTarget as HTMLElement).getAttribute('data-action');
              handleOptionClick(action);
            });
          });
        }
      }, 1200);
      
      // Registra o evento
      console.log('Analytics:', {
        event: 'smart_help_opened',
        page_context: currentContext.context,
        timestamp: new Date().toISOString()
      });
    };
    
    // Fecha o modal de ajuda inteligente
    const closeSmartHelp = () => {
      const modal = document.getElementById('smart-help-modal');
      if (!modal) return;
      
      modal.classList.remove('open');
      setIsModalOpen(false);
      
      // Registra o evento
      console.log('Analytics:', {
        event: 'smart_help_closed',
        timestamp: new Date().toISOString()
      });
    };
    
    // Obtém o contexto da página atual
    const getPageContext = () => {
      const path = window.location.pathname;
      const hash = window.location.hash;
      
      // Mensagens específicas para cada página/seção
      const contextMap: Record<string, { 
        message: string; 
        options: Array<{ text: string; action: string }>; 
        context: string;
      }> = {
        '/': {
          message: 'Olá! Seja bem-vindo(a) à ContentPro. Como posso ajudar você hoje?',
          options: [
            { text: 'Como a ContentPro funciona?', action: 'how-it-works' },
            { text: 'Quais planos estão disponíveis?', action: 'show-plans' },
            { text: 'Quanto tempo leva para criar conteúdo?', action: 'content-time' }
          ],
          context: 'homepage'
        },
        '/planos': {
          message: 'Está avaliando nossos planos? Posso ajudar você a escolher a opção ideal para suas necessidades.',
          options: [
            { text: 'Qual plano é mais popular?', action: 'most-popular' },
            { text: 'Quais são as diferenças entre os planos?', action: 'plan-differences' },
            { text: 'Posso trocar de plano depois?', action: 'change-plan' }
          ],
          context: 'pricing'
        },
        '/generator': {
          message: 'Está usando nosso gerador de conteúdo? Tem alguma dúvida sobre como criar o conteúdo perfeito?',
          options: [
            { text: 'Como otimizar meu prompt?', action: 'optimize-prompt' },
            { text: 'Como editar o resultado?', action: 'edit-result' },
            { text: 'Posso salvar meus favoritos?', action: 'save-favorites' }
          ],
          context: 'generator'
        },
        '/dashboard': {
          message: 'Bem-vindo ao seu dashboard! Aqui você pode gerenciar todo o seu conteúdo e métricas.',
          options: [
            { text: 'Como exportar meu conteúdo?', action: 'export-content' },
            { text: 'Como interpretar as métricas?', action: 'interpret-metrics' },
            { text: 'Posso agendar publicações?', action: 'schedule-posts' }
          ],
          context: 'dashboard'
        }
      };
      
      // Verifica contexto específico por hash (para SPAs)
      if (hash === '#planos') {
        return contextMap['/planos'];
      }
      
      // Retorna o contexto da página atual ou o padrão se não encontrar
      return contextMap[path] || contextMap['/'];
    };
    
    // Manipula o clique em uma opção
    const handleOptionClick = (action: string | null) => {
      if (!action) return;
      
      // Simula o carregamento da resposta
      const contentElement = document.getElementById('smart-help-content');
      if (contentElement) {
        contentElement.innerHTML = `
          <div class="smart-help-typing">
            <div class="typing-dots">
              <div class="typing-dot"></div>
              <div class="typing-dot"></div>
              <div class="typing-dot"></div>
            </div>
            <span>Digitando...</span>
          </div>
        `;
      }
      
      // Respostas para cada ação
      const responses: Record<string, { 
        message: string; 
        options?: Array<{ text: string; action: string }>;
      }> = {
        'how-it-works': {
          message: 'A ContentPro usa inteligência artificial para criar conteúdo otimizado para redes sociais. Você escolhe o tipo de conteúdo (script, legenda, ideia), a plataforma (Instagram, TikTok) e o estilo de comunicação. Nossa IA faz o resto, gerando conteúdo pronto para publicar!',
          options: [
            { text: 'Que tipos de conteúdo posso criar?', action: 'content-types' },
            { text: 'Ver exemplos de conteúdo', action: 'see-examples' }
          ]
        },
        'show-plans': {
          message: 'Temos 3 planos principais: <br><br><b>Básico (R$59/mês)</b>: Ideal para criadores iniciantes. Inclui 50 gerações por mês.<br><br><b>Premium (R$89/mês)</b>: Nosso mais popular! Inclui 100 gerações mensais e montagem automática de vídeos.<br><br><b>Ultimate (R$149/mês)</b>: Para profissionais, com gerações ilimitadas, edição profissional e efeitos cinemáticos.',
          options: [
            { text: 'Ir para a página de planos', action: 'go-to-plans' },
            { text: 'Qual plano é melhor para mim?', action: 'best-plan-for-me' }
          ]
        },
        'most-popular': {
          message: 'Nosso plano <b>Premium</b> (R$89/mês) é o mais popular! Ele oferece o melhor equilíbrio entre preço e recursos. Inclui 100 gerações por mês e, o mais importante, a função de montagem automática de vídeos que economiza horas do seu tempo.',
          options: [
            { text: 'Como funciona a montagem de vídeos?', action: 'video-assembly' },
            { text: 'Quero experimentar o Premium', action: 'try-premium' }
          ]
        },
        'content-time': {
          message: 'Gerar conteúdo com a ContentPro é super rápido! Textos e legendas ficam prontos em segundos. Para vídeos nos planos Premium e Ultimate, a montagem automática leva aproximadamente 1-2 minutos para processar todos os elementos.',
          options: [
            { text: 'Posso editar depois de gerar?', action: 'edit-content' },
            { text: 'Ver exemplos de conteúdo', action: 'see-examples' }
          ]
        }
      };
      
      // Ações especiais (redirecionamentos, etc)
      const specialActions: Record<string, () => void> = {
        'go-to-plans': () => {
          window.location.href = '/#planos';
          closeSmartHelp();
        },
        'try-premium': () => {
          window.location.href = '/#planos';
          // Destaca o plano premium após um breve delay
          setTimeout(() => {
            const premiumPlan = document.querySelector('.plano-premium') || 
                             document.querySelector('[data-plano="premium"]');
            
            if (premiumPlan) {
              premiumPlan.classList.add('highlight-plan');
              setTimeout(() => premiumPlan.classList.remove('highlight-plan'), 2000);
            }
          }, 800);
          closeSmartHelp();
        }
      };
      
      // Executa ação especial se existir
      if (specialActions[action]) {
        setTimeout(() => {
          specialActions[action]();
        }, 800);
        return;
      }
      
      // Exibe a resposta após um delay para simular digitação
      setTimeout(() => {
        if (!contentElement) return;
        
        const response = responses[action] || {
          message: 'Desculpe, não tenho uma resposta específica para isso ainda. Posso ajudar com algo mais?'
        };
        
        contentElement.innerHTML = `
          <div class="smart-help-message">
            ${response.message}
          </div>
          ${response.options ? `
            <div class="smart-help-options">
              ${response.options.map(option => `
                <button class="smart-help-option" data-action="${option.action}">${option.text}</button>
              `).join('')}
            </div>
          ` : `
            <div class="smart-help-options">
              <button class="smart-help-option" data-action="back">Voltar ao início</button>
            </div>
          `}
        `;
        
        // Adiciona event listeners para as novas opções
        const optionButtons = contentElement.querySelectorAll('.smart-help-option');
        optionButtons.forEach(button => {
          button.addEventListener('click', (e) => {
            const actionValue = (e.currentTarget as HTMLElement).getAttribute('data-action');
            
            if (actionValue === 'back') {
              openSmartHelp(); // Reinicia o fluxo
            } else {
              handleOptionClick(actionValue);
            }
          });
        });
      }, 1200);
      
      // Registra o evento
      console.log('Analytics:', {
        event: 'smart_help_option_clicked',
        option: action,
        timestamp: new Date().toISOString()
      });
    };
    
    // Mostra opções de contato
    const showContactOptions = () => {
      const contentElement = document.getElementById('smart-help-content');
      if (!contentElement) return;
      
      contentElement.innerHTML = `
        <div class="smart-help-message">
          Prefere falar com nossa equipe? Escolha como entrar em contato:
        </div>
        <div class="smart-help-options">
          <button class="smart-help-option" data-action="contact-email">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="margin-right: 8px; vertical-align: text-bottom;">
              <rect x="2" y="4" width="20" height="16" rx="2" />
              <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
            </svg>
            Email (suporte@contentpro.ai)
          </button>
          <button class="smart-help-option" data-action="contact-whatsapp">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="margin-right: 8px; vertical-align: text-bottom;">
              <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
            </svg>
            WhatsApp (Horário comercial)
          </button>
        </div>
        <div class="smart-help-options" style="margin-top: 8px;">
          <button class="smart-help-option" data-action="back">Voltar ao assistente</button>
        </div>
      `;
      
      // Adiciona event listeners para as opções de contato
      const contactButtons = contentElement.querySelectorAll('.smart-help-option');
      contactButtons.forEach(button => {
        button.addEventListener('click', (e) => {
          const action = (e.currentTarget as HTMLElement).getAttribute('data-action');
          
          if (action === 'contact-email') {
            window.location.href = 'mailto:suporte@contentpro.ai';
          } else if (action === 'contact-whatsapp') {
            window.open('https://wa.me/5511912345678', '_blank');
          } else if (action === 'back') {
            openSmartHelp(); // Volta para o início
          }
        });
      });
      
      // Registra o evento
      console.log('Analytics:', {
        event: 'contact_options_displayed',
        timestamp: new Date().toISOString()
      });
    };
    
    // Inicializa o componente
    addStyles();
    createHelpButton();
    createHelpModal();
    
    // Cleanup
    return () => {
      const button = document.getElementById('smart-help-button');
      if (button) {
        button.remove();
      }
      
      const modal = document.getElementById('smart-help-modal');
      if (modal) {
        modal.remove();
      }
    };
  }, [isModalOpen]);
  
  // Este componente não renderiza nada visualmente
  return null;
}
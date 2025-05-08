import { useEffect, useState } from 'react';

/**
 * Componente de Upsell Pós-Interação
 * Oferece upgrades contextuais quando o usuário demonstra interesse
 * através de tempo na página, profundidade de scroll ou outras interações
 */
export default function PostInteractionUpsell() {
  const [shownUpsells, setShownUpsells] = useState<string[]>([]);
  
  useEffect(() => {
    // Adiciona estilos CSS
    const addStyles = () => {
      if (document.getElementById('upsell-styles')) return;
      
      const styleElement = document.createElement('style');
      styleElement.id = 'upsell-styles';
      styleElement.textContent = `
        .upsell-modal {
          position: fixed;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%) scale(0.9);
          background: white;
          box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1);
          border-radius: 10px;
          padding: 20px;
          z-index: 10000;
          max-width: 90%;
          width: 450px;
          opacity: 0;
          pointer-events: none;
          transition: all 0.3s ease-out;
          font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
        }
        
        .upsell-modal.active {
          opacity: 1;
          pointer-events: all;
          transform: translate(-50%, -50%) scale(1);
        }
        
        .upsell-overlay {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(0, 0, 0, 0.5);
          backdrop-filter: blur(2px);
          z-index: 9999;
          opacity: 0;
          pointer-events: none;
          transition: opacity 0.3s ease-out;
        }
        
        .upsell-overlay.active {
          opacity: 1;
          pointer-events: all;
        }
        
        .upsell-close {
          position: absolute;
          top: 15px;
          right: 15px;
          background: transparent;
          border: none;
          font-size: 16px;
          cursor: pointer;
          color: #6B7280;
          transition: color 0.2s;
        }
        
        .upsell-close:hover {
          color: #1F2937;
        }
        
        .upsell-header {
          text-align: center;
          margin-bottom: 15px;
        }
        
        .upsell-header h3 {
          font-size: 18px;
          font-weight: 600;
          margin: 0 0 5px 0;
          color: #1F2937;
        }
        
        .upsell-header p {
          font-size: 14px;
          color: #6B7280;
          margin: 0;
        }
        
        .upsell-content {
          display: flex;
          margin: 20px 0;
          border: 1px solid #E5E7EB;
          border-radius: 8px;
          padding: 15px;
        }
        
        .upsell-icon {
          font-size: 24px;
          margin-right: 15px;
        }
        
        .upsell-details {
          flex: 1;
        }
        
        .upsell-title {
          font-weight: 600;
          margin-bottom: 5px;
          color: #1F2937;
        }
        
        .upsell-description {
          font-size: 14px;
          color: #6B7280;
          margin-bottom: 10px;
        }
        
        .upsell-price {
          font-weight: 600;
          color: #059669;
        }
        
        .upsell-price s {
          color: #9CA3AF;
          font-weight: normal;
          margin-right: 5px;
        }
        
        .upsell-actions {
          display: flex;
          justify-content: center;
          gap: 10px;
          margin-top: 20px;
        }
        
        .upsell-btn {
          padding: 8px 16px;
          border-radius: 6px;
          font-weight: 500;
          font-size: 14px;
          cursor: pointer;
          transition: all 0.2s;
        }
        
        .upsell-btn-primary {
          background: #8B5CF6;
          color: white;
          border: none;
        }
        
        .upsell-btn-primary:hover {
          background: #7C3AED;
        }
        
        .upsell-btn-secondary {
          background: transparent;
          color: #6B7280;
          border: 1px solid #E5E7EB;
        }
        
        .upsell-btn-secondary:hover {
          background: #F9FAFB;
        }
        
        .upsell-timer {
          text-align: center;
          font-size: 12px;
          color: #EF4444;
          margin-top: 10px;
          font-weight: 600;
        }
        
        .upsell-badge {
          background: #FECACA;
          color: #B91C1C;
          font-size: 11px;
          padding: 2px 6px;
          border-radius: 10px;
          margin-left: 6px;
          font-weight: 600;
        }
        
        .upsell-features {
          margin-top: 10px;
          font-size: 13px;
        }
        
        .upsell-feature {
          display: flex;
          align-items: center;
          margin-bottom: 5px;
          color: #4B5563;
        }
        
        .upsell-feature-icon {
          color: #10B981;
          margin-right: 5px;
        }
        
        .upsell-tooltip {
          position: fixed;
          bottom: 20px;
          right: 20px;
          background: white;
          border-radius: 8px;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
          padding: 15px;
          z-index: 9998;
          max-width: 300px;
          opacity: 0;
          transform: translateY(10px);
          transition: all 0.3s ease;
          pointer-events: none;
          font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
        }
        
        .upsell-tooltip.active {
          opacity: 1;
          transform: translateY(0);
          pointer-events: all;
        }
        
        .upsell-tooltip-close {
          position: absolute;
          top: 5px;
          right: 5px;
          font-size: 12px;
          border: none;
          background: transparent;
          color: #9CA3AF;
          cursor: pointer;
        }
        
        .upsell-tooltip-title {
          font-weight: 600;
          margin-bottom: 5px;
          padding-right: 15px;
        }
        
        .upsell-tooltip-content {
          font-size: 13px;
          color: #6B7280;
        }
        
        .upsell-tooltip-actions {
          margin-top: 10px;
          display: flex;
          justify-content: flex-end;
        }
      `;
      document.head.appendChild(styleElement);
    };
    
    // Cria o modal de upsell
    const createUpsellModal = (title: string, description: string, features: string[], price: string, originalPrice: string, emoji: string, type: string) => {
      // Evita mostrar o mesmo tipo de upsell mais de uma vez
      if (shownUpsells.includes(type)) return;
      
      // Atualiza estado para rastrear upsells exibidos
      setShownUpsells(prev => [...prev, type]);
      
      // Cria o overlay
      const overlay = document.createElement('div');
      overlay.className = 'upsell-overlay';
      document.body.appendChild(overlay);
      
      // Cria o modal
      const modal = document.createElement('div');
      modal.className = 'upsell-modal';
      
      // Formata os recursos como lista
      const featuresList = features.map(feature => 
        `<div class="upsell-feature">
          <span class="upsell-feature-icon">✓</span>
          <span>${feature}</span>
        </div>`
      ).join('');
      
      // Define o conteúdo do modal
      modal.innerHTML = `
        <button class="upsell-close">✕</button>
        <div class="upsell-header">
          <h3>${title}</h3>
          <p>${description}</p>
        </div>
        <div class="upsell-content">
          <div class="upsell-icon">${emoji}</div>
          <div class="upsell-details">
            <div class="upsell-title">Plano Ultimate</div>
            <div class="upsell-description">Desbloqueie todos os recursos premium</div>
            <div class="upsell-features">
              ${featuresList}
            </div>
            <div class="upsell-price"><s>R$ ${originalPrice}</s> R$ ${price} <span class="upsell-badge">OFERTA</span></div>
          </div>
        </div>
        <div class="upsell-timer">Esta oferta expira em <span class="upsell-countdown">10:00</span></div>
        <div class="upsell-actions">
          <button class="upsell-btn upsell-btn-secondary">Não, obrigado</button>
          <button class="upsell-btn upsell-btn-primary">Aproveitar Oferta</button>
        </div>
      `;
      
      document.body.appendChild(modal);
      
      // Ativa o modal e overlay com delay para permitir a animação
      setTimeout(() => {
        modal.classList.add('active');
        overlay.classList.add('active');
      }, 100);
      
      // Adiciona handler para o botão de fechar
      const closeButton = modal.querySelector('.upsell-close');
      const noThanksButton = modal.querySelector('.upsell-btn-secondary');
      const acceptButton = modal.querySelector('.upsell-btn-primary');
      
      // Função para fechar o modal
      const closeModal = () => {
        modal.classList.remove('active');
        overlay.classList.remove('active');
        
        // Remove após a animação completar
        setTimeout(() => {
          modal.remove();
          overlay.remove();
        }, 300);
      };
      
      // Adiciona event listeners
      if (closeButton) {
        closeButton.addEventListener('click', closeModal);
      }
      
      if (noThanksButton) {
        noThanksButton.addEventListener('click', () => {
          closeModal();
          // Mostra tooltip de follow-up após 3 segundos
          setTimeout(() => {
            showFollowUpTooltip(type);
          }, 3000);
        });
      }
      
      if (acceptButton) {
        acceptButton.addEventListener('click', () => {
          // Redireciona para checkout com upgrade
          window.location.href = `/checkout?plan=ultimate&source=upsell-${type}`;
          closeModal();
        });
      }
      
      // Inicia o contador regressivo
      startCountdown(modal.querySelector('.upsell-countdown'), 10 * 60); // 10 minutos
      
      // Registra o evento de analytics
      console.log('Analytics:', {
        event: 'upsell_shown',
        upsell_type: type,
        title: title,
        price: price,
        original_price: originalPrice,
        timestamp: new Date().toISOString()
      });
    };
    
    // Mostra tooltip de follow-up
    const showFollowUpTooltip = (type: string) => {
      const tooltip = document.createElement('div');
      tooltip.className = 'upsell-tooltip';
      
      tooltip.innerHTML = `
        <button class="upsell-tooltip-close">✕</button>
        <div class="upsell-tooltip-title">Precisando de mais tempo?</div>
        <div class="upsell-tooltip-content">
          A oferta especial ainda está disponível por mais alguns minutos. 
          Tem alguma dúvida que podemos esclarecer?
        </div>
        <div class="upsell-tooltip-actions">
          <button class="upsell-btn upsell-btn-primary">Ver Oferta</button>
        </div>
      `;
      
      document.body.appendChild(tooltip);
      
      // Ativa o tooltip
      setTimeout(() => {
        tooltip.classList.add('active');
      }, 100);
      
      // Adiciona handler para fechar
      const closeButton = tooltip.querySelector('.upsell-tooltip-close');
      if (closeButton) {
        closeButton.addEventListener('click', () => {
          tooltip.classList.remove('active');
          setTimeout(() => tooltip.remove(), 300);
        });
      }
      
      // Adiciona handler para o botão de ação
      const actionButton = tooltip.querySelector('.upsell-btn-primary');
      if (actionButton) {
        actionButton.addEventListener('click', () => {
          tooltip.classList.remove('active');
          setTimeout(() => tooltip.remove(), 300);
          
          // Mostra o modal de upsell novamente
          if (type === 'time') {
            showTimeBasedUpsell();
          } else if (type === 'scroll') {
            showScrollBasedUpsell();
          } else if (type === 'exit') {
            showExitIntentUpsell();
          }
        });
      }
      
      // Auto-remove após 15 segundos
      setTimeout(() => {
        if (document.body.contains(tooltip)) {
          tooltip.classList.remove('active');
          setTimeout(() => tooltip.remove(), 300);
        }
      }, 15000);
    };
    
    // Inicia contador regressivo
    const startCountdown = (element: Element | null, totalSeconds: number) => {
      if (!element) return;
      
      const interval = setInterval(() => {
        totalSeconds--;
        
        if (totalSeconds <= 0) {
          clearInterval(interval);
          
          // Encontra e fecha o modal quando o tempo acabar
          const modal = document.querySelector('.upsell-modal.active');
          const overlay = document.querySelector('.upsell-overlay.active');
          
          if (modal) {
            modal.classList.remove('active');
            setTimeout(() => modal.remove(), 300);
          }
          
          if (overlay) {
            overlay.classList.remove('active');
            setTimeout(() => overlay.remove(), 300);
          }
          
          return;
        }
        
        // Formata e atualiza o tempo
        const minutes = Math.floor(totalSeconds / 60);
        const seconds = totalSeconds % 60;
        element.textContent = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
        
        // Destaca quando estiver acabando
        if (totalSeconds < 60) {
          element.style.animation = 'blink 0.5s infinite';
        }
      }, 1000);
      
      return interval;
    };
    
    // Upsell baseado em tempo na página
    const showTimeBasedUpsell = () => {
      createUpsellModal(
        'Oferta Especial por Tempo Limitado!',
        'Você parece interessado em nosso produto. Que tal um upgrade exclusivo?',
        [
          'Acesso vitalício a todas as atualizações',
          'Edição avançada com IA generativa',
          'Remoção personalizada de fundos',
          'Suporte prioritário 24/7'
        ],
        '129,90',
        '149,00',
        '⏰',
        'time'
      );
    };
    
    // Upsell baseado em profundidade de scroll
    const showScrollBasedUpsell = () => {
      createUpsellModal(
        'Você está explorando bastante!',
        'Aqui está uma oferta exclusiva para usuários engajados como você.',
        [
          'Recursos premium de edição de vídeo',
          'Geração automática de roteiros',
          'Templates exclusivos para TikTok e Instagram',
          'Redução de ruídos de áudio com IA'
        ],
        '129,90',
        '149,00',
        '🔍',
        'scroll'
      );
    };
    
    // Upsell baseado em intenção de saída
    const showExitIntentUpsell = () => {
      createUpsellModal(
        'Antes de sair!',
        'Temos uma oferta especial que não queremos que você perca.',
        [
          'Edição em lote de até 10 vídeos simultâneos',
          'Transcrição automática com 99% de precisão',
          'Efeitos cinemáticos premium',
          'Exportação em 4K sem marca d\'água'
        ],
        '129,90',
        '149,00',
        '🚀',
        'exit'
      );
    };
    
    // Configura gatilhos para upsells
    const setupUpsellTriggers = () => {
      // Variáveis de controle
      let timeOnPage = 0;
      let hasShownTimeBasedUpsell = false;
      let hasShownScrollBasedUpsell = false;
      let hasShownExitIntentUpsell = false;
      
      // Rastreia tempo na página
      const timeInterval = setInterval(() => {
        timeOnPage++;
        
        // Mostra upsell após 60 segundos (1 minuto)
        if (timeOnPage >= 60 && !hasShownTimeBasedUpsell) {
          hasShownTimeBasedUpsell = true;
          showTimeBasedUpsell();
        }
      }, 1000);
      
      // Rastreia profundidade de scroll
      const handleScroll = () => {
        // Calcula a porcentagem de scroll
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        const scrollHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
        const scrollPercentage = (scrollTop / scrollHeight) * 100;
        
        // Mostra upsell quando o usuário scrollar 70% da página
        if (scrollPercentage > 70 && !hasShownScrollBasedUpsell) {
          hasShownScrollBasedUpsell = true;
          showScrollBasedUpsell();
          
          // Remove o listener após mostrar o upsell
          window.removeEventListener('scroll', handleScroll);
        }
      };
      
      // Rastreia intenção de saída
      const handleExitIntent = (e: MouseEvent) => {
        // Detecta movimento do mouse para o topo da página
        if (e.clientY <= 5 && !hasShownExitIntentUpsell) {
          hasShownExitIntentUpsell = true;
          showExitIntentUpsell();
          
          // Remove o listener após mostrar o upsell
          document.removeEventListener('mouseleave', handleExitIntent);
        }
      };
      
      // Adiciona event listeners
      window.addEventListener('scroll', handleScroll);
      document.addEventListener('mouseleave', handleExitIntent);
      
      // Cleanup
      return () => {
        clearInterval(timeInterval);
        window.removeEventListener('scroll', handleScroll);
        document.removeEventListener('mouseleave', handleExitIntent);
      };
    };
    
    // Inicializa
    addStyles();
    const cleanupTriggers = setupUpsellTriggers();
    
    // Cleanup
    return () => {
      cleanupTriggers();
    };
  }, [shownUpsells]);
  
  // O componente não renderiza nada visualmente
  return null;
}
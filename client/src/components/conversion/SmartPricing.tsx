import { useEffect } from 'react';

/**
 * Componente Smart Pricing Dinâmico
 * Ajusta preços automaticamente com base em horário, demanda e comportamento do usuário
 * para otimizar taxas de conversão em diferentes contextos
 */
export default function SmartPricing() {
  useEffect(() => {
    // Adiciona estilos CSS
    const addStyles = () => {
      if (document.getElementById('smart-pricing-styles')) return;
      
      const styleElement = document.createElement('style');
      styleElement.id = 'smart-pricing-styles';
      styleElement.textContent = `
        .preco .destaque {
          font-weight: 700;
          color: #10B981;
          display: inline-block;
          position: relative;
          transform-origin: center left;
          animation: price-pulse 2s ease-in-out;
        }
        
        .preco .destaque::after {
          content: '';
          position: absolute;
          right: -20px;
          top: 50%;
          transform: translateY(-50%);
          background: #10B981;
          color: white;
          font-size: 10px;
          padding: 2px 5px;
          border-radius: 4px;
          white-space: nowrap;
        }
        
        .preco .label-oferta {
          font-size: 11px;
          background: #F43F5E;
          color: white;
          padding: 2px 6px;
          border-radius: 4px;
          margin-left: 8px;
          white-space: nowrap;
          font-weight: 600;
          display: inline-block;
          animation: blink 2s infinite;
        }
        
        .preco s {
          color: #9CA3AF;
          font-weight: normal;
        }
        
        @keyframes price-pulse {
          0% {
            transform: scale(1);
          }
          10% {
            transform: scale(1.1);
          }
          20% {
            transform: scale(1);
          }
        }
        
        @keyframes blink {
          0%, 100% {
            opacity: 1;
          }
          50% {
            opacity: 0.7;
          }
        }
      `;
      document.head.appendChild(styleElement);
    };
    
    // Smart Pricing - Ajusta preços com base no contexto
    const applyDynamicPrices = () => {
      // Indicadores que aumentam/diminuem preços
      const currentHour = new Date().getHours();
      const isWorkHours = currentHour >= 9 && currentHour <= 18;
      const isWeekend = [0, 6].includes(new Date().getDay()); // 0 = Domingo, 6 = Sábado
      const isEveningDiscount = currentHour >= 19 || currentHour <= 7;
      
      // Seleciona todos os elementos de preço na página
      const priceElements = document.querySelectorAll('.preco, [data-price], .plan-price, .price');
      
      // Aplica lógica de preço dinâmico
      priceElements.forEach(element => {
        // Evita reprocessar elementos já otimizados
        if (element.getAttribute('data-smart-priced') === 'true') return;
        element.setAttribute('data-smart-priced', 'true');
        
        // Obtém o preço original (de diferentes atributos possíveis)
        let originalPrice = 0;
        if (element.hasAttribute('data-original')) {
          originalPrice = parseFloat(element.getAttribute('data-original') || '0');
        } else if (element.hasAttribute('data-price')) {
          originalPrice = parseFloat(element.getAttribute('data-price') || '0');
        } else {
          // Tenta extrair o preço do texto (assumindo formato R$ XX,XX ou R$ XX.XX)
          const priceMatch = element.textContent?.match(/R\$\s*(\d+[,.]\d+)/);
          if (priceMatch && priceMatch[1]) {
            originalPrice = parseFloat(priceMatch[1].replace(',', '.'));
          }
        }
        
        // Verifica se foi possível determinar o preço original
        if (!originalPrice) return;
        
        // Armazena o preço original como atributo de dados
        element.setAttribute('data-original', originalPrice.toString());
        
        // Determina o novo preço baseado nas condições
        let discountPercentage = 0;
        let discountReason = '';
        
        // Baixa demanda = desconto maior
        if (isEveningDiscount) {
          discountPercentage = 15;
          discountReason = 'Oferta noturna';
        } else if (isWeekend) {
          discountPercentage = 10;
          discountReason = 'Especial de fim de semana';
        } else if (!isWorkHours) {
          discountPercentage = 12;
          discountReason = 'Oferta flash';
        }
        
        // Adiciona variabilidade para parecer mais natural
        const randomVariation = Math.floor(Math.random() * 3); // 0, 1, ou 2
        discountPercentage += randomVariation;
        
        // Aplica o desconto
        if (discountPercentage > 0) {
          const newPrice = (originalPrice * (1 - discountPercentage / 100)).toFixed(2).replace('.', ',');
          const originalFormatted = originalPrice.toFixed(2).replace('.', ',');
          
          // Atualiza o elemento HTML com o preço formatado
          element.innerHTML = `De <s>R$ ${originalFormatted}</s> Por <span class="destaque">R$ ${newPrice}</span><span class="label-oferta">${discountPercentage}% OFF</span>`;
          
          // Adiciona informação extra sobre a oferta
          const destaqueEl = element.querySelector('.destaque');
          if (destaqueEl) {
            destaqueEl.setAttribute('title', discountReason);
          }
          
          // Registra o evento para analytics
          console.log('Analytics:', {
            event: 'smart_pricing_applied',
            original_price: originalPrice,
            discount_percentage: discountPercentage,
            new_price: parseFloat(newPrice.replace(',', '.')),
            reason: discountReason,
            timestamp: new Date().toISOString()
          });
        }
      });
    };
    
    // Preços dinâmicos baseados em interação do usuário
    const setupInteractionBasedPricing = () => {
      // Configura tempos de permanência na página
      let timeOnPage = 0;
      let hasOfferedDiscount = false;
      
      // Incrementa tempo na página a cada segundo
      const timeInterval = setInterval(() => {
        timeOnPage++;
        
        // Oferece desconto após 60 segundos sem interagir com botão de compra
        if (timeOnPage >= 60 && !hasOfferedDiscount) {
          const hasClickedCTA = document.cookie.includes('clicked_cta=true');
          
          if (!hasClickedCTA) {
            applyIntentBasedDiscount();
            hasOfferedDiscount = true;
          }
        }
      }, 1000);
      
      // Monitora cliques nos CTAs de compra
      const ctaButtons = document.querySelectorAll('.cta-button, .buy-button, .hero-cta, [data-action="buy"]');
      ctaButtons.forEach(button => {
        button.addEventListener('click', () => {
          // Salva informação de clique em cookie
          document.cookie = 'clicked_cta=true; path=/; max-age=1800'; // 30 minutos
        });
      });
      
      // Cleanup
      return () => {
        clearInterval(timeInterval);
      };
    };
    
    // Aplica desconto baseado na intenção do usuário
    const applyIntentBasedDiscount = () => {
      // Seleciona preços do plano premium (normalmente o plano de destaque)
      const premiumPriceElements = document.querySelectorAll('.plano-premium .preco, .premium-plan .price, [data-plan="premium"] .price');
      
      premiumPriceElements.forEach(element => {
        const originalPrice = parseFloat(element.getAttribute('data-original') || '0');
        if (!originalPrice) return;
        
        // Aplica desconto especial por tempo limitado
        const specialDiscount = 25;
        const newPrice = (originalPrice * (1 - specialDiscount / 100)).toFixed(2).replace('.', ',');
        const originalFormatted = originalPrice.toFixed(2).replace('.', ',');
        
        // Atualiza o elemento HTML
        element.innerHTML = `De <s>R$ ${originalFormatted}</s> Por <span class="destaque">R$ ${newPrice}</span><span class="label-oferta">Oferta Exclusiva</span>`;
        
        // Adiciona contador regressivo
        const timerElement = document.createElement('div');
        timerElement.className = 'discount-timer';
        timerElement.innerHTML = `<span>Oferta expira em: </span><span class="timer">15:00</span>`;
        timerElement.style.fontSize = '12px';
        timerElement.style.marginTop = '8px';
        timerElement.style.fontWeight = '600';
        timerElement.style.color = '#F43F5E';
        
        // Insere após o elemento de preço
        element.parentNode?.insertBefore(timerElement, element.nextSibling);
        
        // Inicia contador regressivo
        let secondsLeft = 15 * 60; // 15 minutos
        
        const countdownInterval = setInterval(() => {
          secondsLeft--;
          
          if (secondsLeft <= 0) {
            clearInterval(countdownInterval);
            // Reverte para o preço original
            element.innerHTML = `R$ ${originalFormatted}`;
            timerElement.remove();
            return;
          }
          
          const minutes = Math.floor(secondsLeft / 60);
          const seconds = secondsLeft % 60;
          const formattedTime = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
          
          const timerSpan = timerElement.querySelector('.timer');
          if (timerSpan) {
            timerSpan.textContent = formattedTime;
            
            // Pisca quando tiver pouco tempo restante
            if (secondsLeft < 60) {
              timerSpan.style.animation = 'blink 0.5s infinite';
            }
          }
        }, 1000);
        
        // Registra o evento
        console.log('Analytics:', {
          event: 'intent_based_discount_offered',
          original_price: originalPrice,
          discount_percentage: specialDiscount,
          new_price: parseFloat(newPrice.replace(',', '.')),
          offer_duration_minutes: 15,
          timestamp: new Date().toISOString()
        });
      });
      
      // Cria um elemento de notificação
      const notification = document.createElement('div');
      notification.className = 'discount-notification';
      notification.style.position = 'fixed';
      notification.style.bottom = '20px';
      notification.style.left = '20px';
      notification.style.zIndex = '9999';
      notification.style.background = 'white';
      notification.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.15)';
      notification.style.borderRadius = '8px';
      notification.style.padding = '15px 20px';
      notification.style.animation = 'slideIn 0.3s forwards';
      
      // Define a mensagem da notificação
      notification.innerHTML = `
        <div style="display: flex; align-items: center;">
          <div style="color: #F43F5E; margin-right: 12px; font-size: 24px;">🎁</div>
          <div>
            <div style="font-weight: 600; margin-bottom: 4px;">Oferta Especial Para Você!</div>
            <div style="font-size: 14px;">Acabamos de aplicar 25% OFF no plano Premium!</div>
          </div>
          <div style="margin-left: 12px; cursor: pointer;" class="close-notification">✕</div>
        </div>
      `;
      
      // Adiciona animação CSS
      const notificationStyle = document.createElement('style');
      notificationStyle.textContent = `
        @keyframes slideIn {
          0% {
            transform: translateY(100px);
            opacity: 0;
          }
          100% {
            transform: translateY(0);
            opacity: 1;
          }
        }
      `;
      document.head.appendChild(notificationStyle);
      
      // Adiciona à página
      document.body.appendChild(notification);
      
      // Adiciona handler para fechar
      const closeButton = notification.querySelector('.close-notification');
      if (closeButton) {
        closeButton.addEventListener('click', () => {
          notification.remove();
        });
      }
      
      // Remove após 15 segundos
      setTimeout(() => {
        notification.style.animation = 'slideIn 0.3s reverse forwards';
        setTimeout(() => {
          notification.remove();
        }, 300);
      }, 15000);
    };
    
    // Executa as funções de Smart Pricing
    addStyles();
    applyDynamicPrices();
    const cleanupInteractions = setupInteractionBasedPricing();
    
    // Configura observador para ajustar preços em novos elementos
    const observer = new MutationObserver((mutations) => {
      let hasPriceElements = false;
      
      mutations.forEach(mutation => {
        if (mutation.type === 'childList' && mutation.addedNodes.length > 0) {
          mutation.addedNodes.forEach(node => {
            if (node.nodeType !== 1) return; // ELEMENT_NODE
            
            const element = node as HTMLElement;
            if (!element.querySelectorAll) return;
            
            const priceElements = element.querySelectorAll('.preco, [data-price], .plan-price, .price');
            if (priceElements.length > 0) {
              hasPriceElements = true;
            }
          });
        }
      });
      
      if (hasPriceElements) {
        applyDynamicPrices();
      }
    });
    
    // Observa mudanças no DOM
    observer.observe(document.body, {
      childList: true,
      subtree: true
    });
    
    // Cleanup
    return () => {
      observer.disconnect();
      cleanupInteractions();
    };
  }, []);
  
  // O componente não renderiza nada diretamente
  return null;
}
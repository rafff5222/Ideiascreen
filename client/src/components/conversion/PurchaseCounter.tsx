import { useEffect, useState } from 'react';

/**
 * Componente Contador de Compra Social em Tempo Real
 * Exibe atividade recente de compras para criar prova social e urgência
 */
export default function PurchaseCounter() {
  const [purchaseCount, setPurchaseCount] = useState<string>('');
  const [isVisible, setIsVisible] = useState(false);
  
  useEffect(() => {
    // Adiciona estilos CSS
    const addStyles = () => {
      if (document.getElementById('purchase-counter-styles')) return;
      
      const styleElement = document.createElement('style');
      styleElement.id = 'purchase-counter-styles';
      styleElement.textContent = `
        .purchase-counter {
          position: fixed;
          bottom: 80px;
          left: 20px;
          z-index: 999;
          background: rgba(139, 92, 246, 0.1);
          border-left: 3px solid #8B5CF6;
          padding: 12px 16px;
          border-radius: 8px;
          font-size: 14px;
          color: #333;
          font-weight: 500;
          max-width: 280px;
          box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
          animation: pulse 2s infinite;
          font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
          opacity: 0;
          transform: translateY(20px);
          transition: all 0.3s ease;
          pointer-events: none;
        }
        
        .purchase-counter.visible {
          opacity: 1;
          transform: translateY(0);
          pointer-events: all;
        }
        
        .purchase-counter .counter-close {
          position: absolute;
          top: 5px;
          right: 5px;
          background: transparent;
          border: none;
          color: #999;
          font-size: 12px;
          cursor: pointer;
          padding: 0;
          width: 16px;
          height: 16px;
          display: flex;
          align-items: center;
          justify-content: center;
          opacity: 0.7;
          transition: opacity 0.2s;
        }
        
        .purchase-counter .counter-close:hover {
          opacity: 1;
        }
        
        @keyframes pulse {
          0% { opacity: 0.8; }
          50% { opacity: 1; }
          100% { opacity: 0.8; }
        }
      `;
      document.head.appendChild(styleElement);
    };
    
    // Cria o elemento do contador
    const createCounterElement = () => {
      if (document.getElementById('purchase-counter')) return;
      
      const counter = document.createElement('div');
      counter.id = 'purchase-counter';
      counter.className = 'purchase-counter';
      counter.innerHTML = `
        <button class="counter-close">✕</button>
        <span>✨ Carregando atividade recente...</span>
      `;
      
      document.body.appendChild(counter);
      
      // Adiciona event listener para o botão de fechar
      const closeButton = counter.querySelector('.counter-close');
      if (closeButton) {
        closeButton.addEventListener('click', () => {
          hideCounter();
          
          // Armazena no localStorage para não mostrar novamente nesta sessão
          sessionStorage.setItem('purchase-counter-closed', 'true');
        });
      }
    };
    
    // Mostra o contador
    const showCounter = () => {
      const counter = document.getElementById('purchase-counter');
      if (!counter) return;
      
      counter.classList.add('visible');
      setIsVisible(true);
    };
    
    // Esconde o contador
    const hideCounter = () => {
      const counter = document.getElementById('purchase-counter');
      if (!counter) return;
      
      counter.classList.remove('visible');
      setIsVisible(false);
    };
    
    // Atualiza o contador com dados simulados
    const updateCounter = () => {
      // Lista de cidades comuns
      const cities = [
        'São Paulo', 'Rio de Janeiro', 'Belo Horizonte', 'Salvador', 'Brasília',
        'Curitiba', 'Fortaleza', 'Recife', 'Porto Alegre', 'Manaus', 'Campinas'
      ];
      
      // Gera um número aleatório entre 1 e 5
      const randomPurchases = Math.floor(Math.random() * 5) + 1;
      
      // Seleciona uma cidade aleatória
      const randomCity = cities[Math.floor(Math.random() * cities.length)];
      
      // Cria a mensagem de contagem
      const purchaseMessage = `✨ ${randomCity} - ${randomPurchases} ${randomPurchases > 1 ? 'compras' : 'compra'} nos últimos 10 minutos`;
      
      // Atualiza o estado e o elemento
      setPurchaseCount(purchaseMessage);
      
      const counter = document.getElementById('purchase-counter');
      if (counter) {
        counter.innerHTML = `
          <button class="counter-close">✕</button>
          <span>${purchaseMessage}</span>
        `;
        
        // Adiciona o event listener novamente para o botão recém-criado
        const closeButton = counter.querySelector('.counter-close');
        if (closeButton) {
          closeButton.addEventListener('click', () => {
            hideCounter();
            sessionStorage.setItem('purchase-counter-closed', 'true');
          });
        }
      }
      
      // Mostra o contador se não estiver visível
      if (!isVisible) {
        showCounter();
      }
      
      // Registra o evento
      console.log('Analytics:', {
        event: 'purchase_counter_updated',
        message: purchaseMessage,
        timestamp: new Date().toISOString()
      });
    };
    
    // Verifica se o contador foi fechado anteriormente
    const wasClosed = sessionStorage.getItem('purchase-counter-closed') === 'true';
    
    // Inicializa o contador apenas se não foi fechado anteriormente
    if (!wasClosed) {
      addStyles();
      createCounterElement();
      
      // Mostra o contador após um delay aleatório entre 30-60 segundos
      // para não parecer tão óbvio
      const initialDelay = Math.floor(Math.random() * 30000) + 30000;
      const initialTimer = setTimeout(() => {
        updateCounter();
      }, initialDelay);
      
      // Configura atualizações periódicas a cada 4-6 minutos
      // com variação para parecer mais natural
      const getRandomInterval = () => Math.floor(Math.random() * 120000) + 240000; // 4-6 minutos
      
      let updateInterval: number | null = null;
      
      const setupInterval = () => {
        updateInterval = window.setTimeout(() => {
          updateCounter();
          setupInterval(); // Configura o próximo intervalo
        }, getRandomInterval());
      };
      
      // Inicia as atualizações periódicas
      setupInterval();
      
      // Cleanup
      return () => {
        clearTimeout(initialTimer);
        if (updateInterval !== null) {
          clearTimeout(updateInterval);
        }
        
        const counter = document.getElementById('purchase-counter');
        if (counter) {
          counter.remove();
        }
      };
    }
  }, [isVisible]);
  
  // O componente não renderiza nada visualmente
  return null;
}
import { useEffect, useState } from 'react';

/**
 * Componente Barra de Progresso de Oferta
 * Cria um gatilho de urgência com contador regressivo e barra de progresso
 * que aumenta gradualmente para estimular conversões rápidas
 */
export default function OfferProgressBar() {
  const [timeRemaining, setTimeRemaining] = useState(262); // 4 minutos e 22 segundos
  const [progress, setProgress] = useState(72); // Porcentagem inicial
  const [isVisible, setIsVisible] = useState(true);
  
  useEffect(() => {
    // Adiciona estilos CSS
    const addStyles = () => {
      if (document.getElementById('offer-progress-styles')) return;
      
      const styleElement = document.createElement('style');
      styleElement.id = 'offer-progress-styles';
      styleElement.textContent = `
        .progress-bar-container {
          background: linear-gradient(90deg, #3B82F6, #6366F1);
          color: white;
          padding: 12px 20px;
          font-size: 15px;
          font-weight: 500;
          text-align: center;
          position: relative;
          overflow: hidden;
          z-index: 1000;
          width: 100%;
          font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
        }
        
        .progress-bar-container .text {
          position: relative;
          z-index: 2;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 6px;
        }
        
        .progress-bar-container .close-button {
          position: absolute;
          right: 15px;
          top: 50%;
          transform: translateY(-50%);
          background: transparent;
          border: none;
          color: white;
          font-size: 18px;
          cursor: pointer;
          opacity: 0.7;
          transition: opacity 0.2s;
          padding: 0;
          z-index: 3;
        }
        
        .progress-bar-container .close-button:hover {
          opacity: 1;
        }
        
        .progress-bar-container .progress {
          position: absolute;
          top: 0;
          left: 0;
          height: 100%;
          background: linear-gradient(90deg, rgba(255,255,255,0.1), rgba(255,255,255,0.2));
          z-index: 1;
          transition: width 1s ease;
        }
        
        .progress-bar-container #countdown {
          background: rgba(255,255,255,0.2);
          padding: 2px 6px;
          border-radius: 4px;
          display: inline-block;
          font-weight: 600;
          animation: pulse 2s infinite;
        }
        
        @keyframes pulse {
          0% {
            opacity: 0.8;
          }
          50% {
            opacity: 1;
          }
          100% {
            opacity: 0.8;
          }
        }
        
        .progress-bar-container.hidden {
          display: none;
        }
        
        .progress-bar-container .attention-icon {
          margin-right: 8px;
          font-size: 16px;
        }
      `;
      document.head.appendChild(styleElement);
    };
    
    // Cria a barra de progresso
    const createProgressBar = () => {
      // Evita duplicação
      if (document.getElementById('offer-progress-bar')) return;
      
      // Cria o elemento
      const progressBar = document.createElement('div');
      progressBar.id = 'offer-progress-bar';
      progressBar.className = 'progress-bar-container';
      
      // Define o conteúdo HTML
      progressBar.innerHTML = `
        <div class="progress" style="width: ${progress}%"></div>
        <div class="text">
          <span class="attention-icon">🔥</span>
          <span>${progress}% das vagas com desconto já foram preenchidas!</span>
          <span id="countdown">04:22</span>
        </div>
        <button class="close-button">✕</button>
      `;
      
      // Adiciona como primeiro elemento do body
      document.body.prepend(progressBar);
      
      // Adiciona event listener para o botão de fechar
      const closeButton = progressBar.querySelector('.close-button');
      if (closeButton) {
        closeButton.addEventListener('click', () => {
          setIsVisible(false);
          progressBar.classList.add('hidden');
          
          // Armazena a preferência do usuário
          localStorage.setItem('offer_bar_closed', 'true');
        });
      }
    };
    
    // Verifica se barra deve ser mostrada
    const shouldShowBar = () => {
      // Verifica se o usuário fechou a barra
      return localStorage.getItem('offer_bar_closed') !== 'true';
    };
    
    // Inicializa a barra se deve ser mostrada
    if (shouldShowBar()) {
      addStyles();
      createProgressBar();
      
      // Inicia o contador regressivo
      const timer = setInterval(() => {
        setTimeRemaining(prev => {
          const newTime = prev - 1;
          
          // Atualiza o texto do contador
          const minutes = Math.floor(newTime / 60);
          const seconds = newTime % 60;
          const formattedTime = `${minutes}:${seconds < 10 ? '0' + seconds : seconds}`;
          
          const countdownElement = document.getElementById('countdown');
          if (countdownElement) {
            countdownElement.textContent = formattedTime;
          }
          
          // Aumenta a barra de progresso gradualmente
          const newProgress = 72 + ((262 - newTime) / 10);
          setProgress(newProgress);
          
          // Atualiza a largura da barra visual
          const progressElement = document.querySelector('.progress') as HTMLElement;
          if (progressElement) {
            progressElement.style.width = `${newProgress}%`;
          }
          
          // Atualiza também o texto da porcentagem
          const textElement = document.querySelector('.progress-bar-container .text span:nth-child(2)');
          if (textElement) {
            textElement.textContent = `${Math.floor(newProgress)}% das vagas com desconto já foram preenchidas!`;
          }
          
          // Se o contador chegar a zero
          if (newTime <= 0) {
            clearInterval(timer);
            
            // Muda a mensagem para criar mais urgência
            const progressBar = document.getElementById('offer-progress-bar');
            if (progressBar) {
              progressBar.innerHTML = `
                <div class="progress" style="width: 100%"></div>
                <div class="text">
                  <span class="attention-icon">⚠️</span>
                  <span>Promoção encerrada! Últimas vagas disponíveis!</span>
                </div>
                <button class="close-button">✕</button>
              `;
              
              // Readiciona listener para o botão de fechar
              const closeButton = progressBar.querySelector('.close-button');
              if (closeButton) {
                closeButton.addEventListener('click', () => {
                  setIsVisible(false);
                  progressBar.classList.add('hidden');
                  localStorage.setItem('offer_bar_closed', 'true');
                });
              }
            }
            
            // Remove depois de um tempo quando encerrar
            setTimeout(() => {
              const progressBar = document.getElementById('offer-progress-bar');
              if (progressBar) {
                progressBar.classList.add('hidden');
              }
            }, 20000); // 20 segundos
          }
          
          return newTime;
        });
      }, 1000);
      
      // Registra o evento
      console.log('Analytics:', {
        event: 'offer_progress_bar_shown',
        initial_progress: progress,
        initial_time: timeRemaining,
        timestamp: new Date().toISOString()
      });
      
      // Cleanup
      return () => {
        clearInterval(timer);
      };
    }
  }, [progress, timeRemaining, isVisible]);
  
  // O componente não renderiza nada diretamente
  return null;
}
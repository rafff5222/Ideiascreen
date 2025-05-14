import { useEffect, useState } from 'react';

/**
 * Componente de Personalização por Fuso Horário
 * Exibe ofertas e mensagens personalizadas baseadas no horário local do usuário
 */
export default function TimeBasedOffers() {
  const [currentHour, setCurrentHour] = useState<number>(new Date().getHours());
  
  useEffect(() => {
    // Adiciona estilos CSS
    const addStyles = () => {
      if (document.getElementById('time-based-offers-styles')) return;
      
      const styleElement = document.createElement('style');
      styleElement.id = 'time-based-offers-styles';
      styleElement.textContent = `
        .time-based-banner {
          background: linear-gradient(90deg, #7F56D9, #C084FC);
          color: white;
          text-align: center;
          padding: 10px 20px;
          font-weight: 500;
          position: relative;
          overflow: hidden;
          animation: slideFadeIn 0.5s ease-out;
          z-index: 10;
        }
        
        @keyframes slideFadeIn {
          0% {
            opacity: 0;
            transform: translateY(-20px);
          }
          100% {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        .time-based-banner.morning {
          background: linear-gradient(90deg, #F59E0B, #F97316);
        }
        
        .time-based-banner.afternoon {
          background: linear-gradient(90deg, #0EA5E9, #7DD3FC);
        }
        
        .time-based-banner.evening {
          background: linear-gradient(90deg, #8B5CF6, #C084FC);
        }
        
        .time-based-banner.night {
          background: linear-gradient(90deg, #3B82F6, #1E3A8A);
        }
        
        .time-based-banner .banner-content {
          display: flex;
          align-items: center;
          justify-content: center;
          font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
        }
        
        .time-based-banner .banner-icon {
          margin-right: 10px;
          font-size: 18px;
        }
        
        .time-based-banner .highlight {
          font-weight: 700;
          padding: 2px 6px;
          margin: 0 4px;
          background: rgba(255, 255, 255, 0.2);
          border-radius: 4px;
        }
        
        .time-based-banner .banner-timer {
          background: rgba(255, 255, 255, 0.2);
          border-radius: 4px;
          padding: 2px 6px;
          margin-left: 6px;
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
        
        @media (max-width: 768px) {
          .time-based-banner {
            padding: 8px 15px;
            font-size: 14px;
          }
        }
      `;
      document.head.appendChild(styleElement);
    };
    
    // Cria ou atualiza o banner baseado no tempo
    const updateTimeBanner = () => {
      const hour = new Date().getHours();
      setCurrentHour(hour);
      
      let bannerClass = '';
      let icon = '';
      let message = '';
      let discount = '';
      let timeLimit = '';
      
      // Define a mensagem baseada no período do dia
      if (hour >= 5 && hour < 12) {
        // Manhã (5h - 11:59h)
        bannerClass = 'morning';
        icon = '☀️';
        discount = '10% OFF';
        timeLimit = '2 horas';
        message = `${icon} Bom dia! ${discount} para quem comprar nas próximas ${timeLimit}!`;
      } else if (hour >= 12 && hour < 18) {
        // Tarde (12h - 17:59h)
        bannerClass = 'afternoon';
        icon = '🌤️';
        discount = '8% OFF';
        timeLimit = '3 horas';
        message = `${icon} Boa tarde! Oferta relâmpago de ${discount} válida por ${timeLimit}!`;
      } else if (hour >= 18 && hour < 23) {
        // Noite (18h - 22:59h)
        bannerClass = 'evening';
        icon = '🌙';
        discount = '15% OFF';
        timeLimit = 'hoje';
        message = `${icon} Aproveite nossa promoção noturna - Edição Rápida com ${discount} até o fim do dia!`;
      } else {
        // Madrugada (23h - 4:59h)
        bannerClass = 'night';
        icon = '✨';
        discount = '20% OFF';
        timeLimit = 'até 5h';
        message = `${icon} Coruja da criação? Ganhe ${discount} no plano Ultimate - oferta válida ${timeLimit}!`;
      }
      
      // Cria ou atualiza o banner
      let bannerElement = document.getElementById('dynamic-time-banner');
      
      if (!bannerElement) {
        // Cria o banner se não existir
        bannerElement = document.createElement('div');
        bannerElement.id = 'dynamic-time-banner';
        bannerElement.className = `time-based-banner ${bannerClass}`;
        
        // Insere no topo do body com verificação mais segura
        try {
          document.body.prepend(bannerElement);
        } catch (error) {
          console.error('Erro ao inserir banner:', error);
        }
      } else {
        // Atualiza classes se já existir
        bannerElement.className = `time-based-banner ${bannerClass}`;
      }
      
      // Atualiza o conteúdo do banner com countdown
      bannerElement.innerHTML = `
        <div class="banner-content">
          <span class="banner-icon">${icon}</span>
          <span>${formatMessage(message, discount)}</span>
          <span class="banner-timer" id="time-banner-countdown">03:00:00</span>
        </div>
      `;
      
      // Inicia countdown
      startCountdown();
      
      // Registra o evento
      console.log('Analytics:', {
        event: 'time_based_offer_shown',
        hour: hour,
        offer_type: bannerClass,
        discount: discount,
        timestamp: new Date().toISOString()
      });
    };
    
    // Formata a mensagem para destacar o desconto
    const formatMessage = (message: string, discount: string): string => {
      return message.replace(discount, `<span class="highlight">${discount}</span>`);
    };
    
    // Inicia o contador regressivo
    const startCountdown = () => {
      const countdownElement = document.getElementById('time-banner-countdown');
      if (!countdownElement) return;
      
      // Define o tempo limite com base no período do dia
      let hours = 2;
      let minutes = 0;
      let seconds = 0;
      
      if (currentHour >= 12 && currentHour < 18) {
        hours = 3; // 3 horas para a tarde
      } else if (currentHour >= 18 && currentHour < 23) {
        // Calcula o tempo até meia-noite
        const now = new Date();
        const midnight = new Date();
        midnight.setHours(23, 59, 59, 999);
        
        const diffMs = midnight.getTime() - now.getTime();
        hours = Math.floor(diffMs / (1000 * 60 * 60));
        minutes = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));
        seconds = Math.floor((diffMs % (1000 * 60)) / 1000);
      } else if (currentHour >= 23 || currentHour < 5) {
        // Calcula o tempo até 5h da manhã
        const now = new Date();
        const fiveAM = new Date();
        
        if (now.getHours() < 5) {
          // Ainda é o mesmo dia
          fiveAM.setHours(5, 0, 0, 0);
        } else {
          // É após meia-noite, então 5h será amanhã
          fiveAM.setDate(fiveAM.getDate() + 1);
          fiveAM.setHours(5, 0, 0, 0);
        }
        
        const diffMs = fiveAM.getTime() - now.getTime();
        hours = Math.floor(diffMs / (1000 * 60 * 60));
        minutes = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));
        seconds = Math.floor((diffMs % (1000 * 60)) / 1000);
      }
      
      // Contador regressivo
      let totalSeconds = hours * 3600 + minutes * 60 + seconds;
      
      const updateCountdown = () => {
        if (totalSeconds <= 0) {
          // Quando o tempo acabar, atualiza o banner
          updateTimeBanner();
          return;
        }
        
        totalSeconds--;
        
        const displayHours = Math.floor(totalSeconds / 3600);
        const displayMinutes = Math.floor((totalSeconds % 3600) / 60);
        const displaySeconds = totalSeconds % 60;
        
        // Formata o tempo com leading zeros
        const formattedTime = 
          `${displayHours.toString().padStart(2, '0')}:${displayMinutes.toString().padStart(2, '0')}:${displaySeconds.toString().padStart(2, '0')}`;
        
        countdownElement.textContent = formattedTime;
      };
      
      // Atualiza inicialmente
      updateCountdown();
      
      // Configura o intervalo para atualizar a cada segundo
      const countdownInterval = setInterval(updateCountdown, 1000);
      
      // Limpeza quando o componente desmontar
      return () => clearInterval(countdownInterval);
    };
    
    // Adiciona estilos e cria o banner inicial
    addStyles();
    updateTimeBanner();
    
    // Atualiza o banner quando mudar a hora
    const hourlyCheck = setInterval(() => {
      const newHour = new Date().getHours();
      if (newHour !== currentHour) {
        updateTimeBanner();
      }
    }, 60000); // Verifica a cada minuto
    
    // Cleanup
    return () => {
      clearInterval(hourlyCheck);
      const banner = document.getElementById('dynamic-time-banner');
      if (banner) {
        banner.remove();
      }
    };
  }, [currentHour]);
  
  // Este componente não renderiza nada visualmente (manipula o DOM diretamente)
  return null;
}
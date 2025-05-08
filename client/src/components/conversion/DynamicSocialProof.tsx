import { useEffect, useState } from 'react';

/**
 * Componente Dynamic Social Proof
 * Mostra provas sociais dinâmicas, como notificações de compras recentes em tempo real
 */
export default function DynamicSocialProof() {
  const [notifications, setNotifications] = useState<{user: string; plan: string; time: Date}[]>([]);
  const [isVisible, setIsVisible] = useState(false);
  
  useEffect(() => {
    // Adiciona estilos CSS
    const addStyles = () => {
      if (document.getElementById('social-proof-styles')) return;
      
      const styleElement = document.createElement('style');
      styleElement.id = 'social-proof-styles';
      styleElement.textContent = `
        .social-proof-container {
          position: fixed;
          bottom: 20px;
          left: 20px;
          z-index: 100;
          max-width: 280px;
          font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
        }
        
        .proof-item {
          padding: 10px 15px;
          background: rgba(139, 92, 246, 0.1);
          border-left: 3px solid #8B5CF6;
          margin: 5px 0;
          border-radius: 4px;
          box-shadow: 0 2px 5px rgba(0, 0, 0, 0.05);
          animation: fadeInUp 0.5s forwards;
          transform: translateY(20px);
          opacity: 0;
          font-size: 14px;
          color: #333;
          width: 100%;
          display: flex;
          align-items: center;
        }
        
        .proof-item .proof-icon {
          margin-right: 10px;
          color: #8B5CF6;
          font-size: 16px;
        }
        
        .proof-item .user-name {
          font-weight: 600;
        }
        
        .proof-item .plan-name {
          font-weight: 700;
          color: #8B5CF6;
        }
        
        .proof-item .time-ago {
          font-size: 12px;
          color: #666;
          margin-top: 3px;
          display: block;
        }
        
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        @keyframes fadeOut {
          from {
            opacity: 1;
          }
          to {
            opacity: 0;
          }
        }
        
        .proof-item.fade-out {
          animation: fadeOut 0.5s forwards;
        }
      `;
      document.head.appendChild(styleElement);
    };
    
    // Adiciona o contêiner para as notificações
    const createContainer = () => {
      if (document.getElementById('social-proof-container')) return;
      
      const container = document.createElement('div');
      container.id = 'social-proof-container';
      container.className = 'social-proof-container';
      document.body.appendChild(container);
    };
    
    // Configura container e estilos
    addStyles();
    createContainer();
    
    // Dados para simulação
    const users = [
      'Ana_C', 'MarketingPro', 'Joao_Empreendedor', 'Carlos_Designer',
      'PatriciaV', 'RafaelMKT', 'LucianaC', 'BrunoSocial', 'PedroContent',
      'JuliaCreator', 'FernandoTech', 'IsabelaDigital'
    ];
    
    const plans = [
      { name: 'Premium', weight: 0.65 },
      { name: 'Ultimate', weight: 0.25 },
      { name: 'Básico', weight: 0.1 }
    ];
    
    // Função para escolher um plano baseado em pesos
    const getWeightedRandomPlan = () => {
      const random = Math.random();
      let sum = 0;
      
      for (const plan of plans) {
        sum += plan.weight;
        if (random < sum) return plan.name;
      }
      
      return plans[0].name;
    };
    
    // Simula compras recentes
    const simulateRecentPurchase = () => {
      const randomUser = users[Math.floor(Math.random() * users.length)];
      const randomPlan = getWeightedRandomPlan();
      
      // Adiciona nova notificação
      setNotifications(prev => [
        { user: randomUser, plan: randomPlan, time: new Date() },
        ...prev
      ].slice(0, 5)); // Mantém apenas as 5 mais recentes
      
      setIsVisible(true);
    };
    
    // Mostra uma notificação inicial após 30 segundos
    const initialTimer = setTimeout(() => {
      simulateRecentPurchase();
    }, 30000);
    
    // Configura intervalo para mostrar novas notificações a cada 3-5 minutos
    const interval = setInterval(() => {
      // Chance aleatória de mostrar ou não (para parecer mais natural)
      if (Math.random() > 0.3) {
        simulateRecentPurchase();
      }
    }, Math.floor(Math.random() * (300000 - 180000) + 180000)); // Entre 3 e 5 minutos
    
    // Cleanup
    return () => {
      clearTimeout(initialTimer);
      clearInterval(interval);
    };
  }, []);
  
  useEffect(() => {
    // Renderiza as notificações quando mudam
    if (notifications.length === 0) return;
    
    const container = document.getElementById('social-proof-container');
    if (!container) return;
    
    // Limpa o container
    container.innerHTML = '';
    
    // Adiciona cada notificação ao container
    notifications.forEach((notification, index) => {
      const notificationElement = document.createElement('div');
      notificationElement.className = 'proof-item';
      
      // Calcula tempo relativo
      const timeAgo = getTimeAgo(notification.time);
      
      notificationElement.innerHTML = `
        <span class="proof-icon">✨</span>
        <div>
          <span class="user-name">${notification.user}</span> acabou de assinar o plano
          <span class="plan-name">${notification.plan}</span>
          <span class="time-ago">${timeAgo}</span>
        </div>
      `;
      
      container.appendChild(notificationElement);
      
      // Auto-remove notificações mais antigas após algum tempo
      if (index > 0) {
        setTimeout(() => {
          notificationElement.classList.add('fade-out');
          setTimeout(() => {
            if (notificationElement.parentNode === container) {
              container.removeChild(notificationElement);
            }
          }, 500);
        }, 60000 + (index * 10000)); // A primeira notificação fica por 1 minuto, as outras um pouco mais
      }
    });
    
    // Aplica animação com delay
    const notificationElements = container.querySelectorAll('.proof-item');
    notificationElements.forEach((element, index) => {
      setTimeout(() => {
        element.classList.add('animated');
      }, index * 200);
    });
    
    // Registra o evento no analytics
    console.log('Analytics:', {
      event: 'social_proof_displayed',
      notifications_count: notifications.length,
      timestamp: new Date().toISOString()
    });
  }, [notifications]);
  
  // Função para formatar o tempo relativo
  const getTimeAgo = (date: Date): string => {
    const now = new Date();
    const seconds = Math.floor((now.getTime() - date.getTime()) / 1000);
    
    if (seconds < 60) {
      return 'Agora mesmo';
    } else if (seconds < 120) {
      return 'Há 1 minuto';
    } else if (seconds < 3600) {
      const minutes = Math.floor(seconds / 60);
      return `Há ${minutes} minutos`;
    } else if (seconds < 7200) {
      return 'Há 1 hora';
    } else {
      const hours = Math.floor(seconds / 3600);
      return `Há ${hours} horas`;
    }
  };
  
  // O componente não renderiza nada diretamente (manipula o DOM)
  return null;
}
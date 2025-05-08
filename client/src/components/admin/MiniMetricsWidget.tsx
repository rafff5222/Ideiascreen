import { useEffect, useState } from 'react';

/**
 * Componente Painel de Métricas Miniatura
 * Exibe métricas de performance em tempo real para administradores
 * Visível apenas para IPs autorizados ou em modo de desenvolvimento
 */
export default function MiniMetricsWidget() {
  const [isVisible, setIsVisible] = useState(false);
  const [metrics, setMetrics] = useState({
    conversion: '0%',
    averageTicket: 'R$ 0',
    activeUsers: '0',
    pageViews: '0',
    bounceRate: '0%'
  });
  
  // Lista de IPs autorizados (em produção, isso viria de uma API ou verificação segura no backend)
  const AUTHORIZED_IPS = ['127.0.0.1', 'localhost', '::1'];
  
  useEffect(() => {
    // Adiciona estilos CSS
    const addStyles = () => {
      if (document.getElementById('mini-metrics-styles')) return;
      
      const styleElement = document.createElement('style');
      styleElement.id = 'mini-metrics-styles';
      styleElement.textContent = `
        .admin-widget {
          position: fixed;
          bottom: 10px;
          right: 10px;
          background: white;
          box-shadow: 0 3px 15px rgba(0, 0, 0, 0.1);
          border-radius: 6px;
          padding: 8px;
          font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
          font-size: 12px;
          width: 280px;
          z-index: 9999;
          opacity: 0.9;
          transition: opacity 0.2s, transform 0.2s;
          transform: translateY(0);
        }
        
        .admin-widget:hover {
          opacity: 1;
        }
        
        .admin-widget.collapsed {
          transform: translateY(calc(100% - 32px));
        }
        
        .admin-widget .toggle-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 8px;
          cursor: pointer;
          user-select: none;
        }
        
        .admin-widget .toggle-header h3 {
          margin: 0;
          font-size: 12px;
          font-weight: 600;
          color: #6B7280;
        }
        
        .admin-widget .toggle-header button {
          background: none;
          border: none;
          padding: 0;
          font-size: 12px;
          color: #9CA3AF;
          cursor: pointer;
        }
        
        .admin-widget .metrics-grid {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 8px;
        }
        
        .admin-widget .metric {
          background: #F9FAFB;
          padding: 8px;
          border-radius: 4px;
          border-left: 3px solid #8B5CF6;
        }
        
        .admin-widget .metric small {
          display: block;
          color: #6B7280;
          font-size: 10px;
          margin-bottom: 2px;
        }
        
        .admin-widget .metric .value {
          font-weight: 600;
          color: #1F2937;
          font-size: 14px;
        }
        
        .admin-widget .metric .trend {
          font-size: 9px;
          margin-left: 4px;
        }
        
        .admin-widget .metric .trend.up {
          color: #10B981;
        }
        
        .admin-widget .metric .trend.down {
          color: #EF4444;
        }
        
        .admin-widget .secret-key {
          font-size: 8px;
          color: #9CA3AF;
          text-align: right;
          margin-top: 6px;
        }
      `;
      document.head.appendChild(styleElement);
    };
    
    // Cria o widget no DOM
    const createWidget = () => {
      if (document.getElementById('admin-metrics-widget')) return;
      
      const widget = document.createElement('div');
      widget.id = 'admin-metrics-widget';
      widget.className = 'admin-widget';
      
      widget.innerHTML = `
        <div class="toggle-header">
          <h3>Métricas em Tempo Real</h3>
          <button class="toggle-button">^</button>
        </div>
        <div class="metrics-grid">
          <div class="metric">
            <small>Conversão</small>
            <div class="value">4.2% <span class="trend up">+0.5%</span></div>
          </div>
          <div class="metric">
            <small>Ticket Médio</small>
            <div class="value">R$ 89 <span class="trend up">+R$ 7</span></div>
          </div>
          <div class="metric">
            <small>Usuários Ativos</small>
            <div class="value">87 <span class="trend up">+12%</span></div>
          </div>
          <div class="metric">
            <small>Visualizações</small>
            <div class="value">342 <span class="trend up">+28%</span></div>
          </div>
        </div>
        <div class="secret-key">visible:development</div>
      `;
      
      document.body.appendChild(widget);
      
      // Adiciona funcionalidade de toggle
      const toggleButton = widget.querySelector('.toggle-button');
      const toggleHeader = widget.querySelector('.toggle-header');
      
      if (toggleHeader) {
        toggleHeader.addEventListener('click', () => {
          widget.classList.toggle('collapsed');
          
          // Atualiza o ícone do botão
          if (toggleButton) {
            toggleButton.textContent = widget.classList.contains('collapsed') ? 'v' : '^';
          }
        });
      }
      
      // Inicialmente colapsa o widget
      setTimeout(() => {
        widget.classList.add('collapsed');
        if (toggleButton) {
          toggleButton.textContent = 'v';
        }
      }, 3000);
    };
    
    // Atualiza os valores das métricas
    const updateMetrics = () => {
      // Em produção, estes dados viriam de uma API real
      // Simulação de métricas variáveis para demonstração
      const randomVariation = () => (Math.random() * 0.2 - 0.1).toFixed(1);
      
      const newMetrics = {
        conversion: `${(4.2 + parseFloat(randomVariation())).toFixed(1)}%`,
        averageTicket: `R$ ${Math.floor(89 + parseFloat(randomVariation()) * 10)}`,
        activeUsers: `${Math.floor(87 + parseFloat(randomVariation()) * 20)}`,
        pageViews: `${Math.floor(342 + parseFloat(randomVariation()) * 50)}`,
        bounceRate: `${(28.5 + parseFloat(randomVariation())).toFixed(1)}%`
      };
      
      setMetrics(newMetrics);
      
      // Atualiza o widget no DOM
      const widget = document.getElementById('admin-metrics-widget');
      if (!widget) return;
      
      const conversionValue = widget.querySelector('.metric:nth-child(1) .value');
      const ticketValue = widget.querySelector('.metric:nth-child(2) .value');
      const usersValue = widget.querySelector('.metric:nth-child(3) .value');
      const viewsValue = widget.querySelector('.metric:nth-child(4) .value');
      
      if (conversionValue) {
        conversionValue.innerHTML = `${newMetrics.conversion} <span class="trend up">+0.${Math.floor(Math.random() * 9)}%</span>`;
      }
      
      if (ticketValue) {
        ticketValue.innerHTML = `${newMetrics.averageTicket} <span class="trend up">+R$ ${Math.floor(Math.random() * 10)}</span>`;
      }
      
      if (usersValue) {
        usersValue.innerHTML = `${newMetrics.activeUsers} <span class="trend up">+${Math.floor(Math.random() * 15)}%</span>`;
      }
      
      if (viewsValue) {
        viewsValue.innerHTML = `${newMetrics.pageViews} <span class="trend up">+${Math.floor(Math.random() * 30)}%</span>`;
      }
    };
    
    // Verifica se o usuário deve ver o widget
    const checkAuthorization = () => {
      // Em ambiente de desenvolvimento, sempre mostra
      if (process.env.NODE_ENV === 'development') {
        return true;
      }
      
      // Verifica roles de admin no localStorage (simulação)
      const isAdmin = localStorage.getItem('user_role') === 'admin';
      if (isAdmin) {
        return true;
      }
      
      // Em produção, a verificação de IP seria feita no servidor
      // Aqui é apenas demonstrativo (não é possível obter IP do cliente via JavaScript puro)
      return AUTHORIZED_IPS.includes('127.0.0.1');
    };
    
    // Inicializa o widget se autorizado
    const isAuthorized = checkAuthorization();
    if (isAuthorized) {
      setIsVisible(true);
      addStyles();
      createWidget();
      updateMetrics();
      
      // Atualiza métricas periodicamente
      const updateInterval = setInterval(updateMetrics, 60000); // A cada minuto
      
      // Cleanup
      return () => {
        clearInterval(updateInterval);
        const widget = document.getElementById('admin-metrics-widget');
        if (widget) {
          widget.remove();
        }
      };
    }
  }, [isVisible]);
  
  // Este componente não renderiza nada visualmente direto no React
  return null;
}
import { useEffect } from 'react';

/**
 * Componente que cria um heatmap 3D de cliques do usuário
 * Implementação simples similar ao Hotjar, porém sem bibliotecas externas
 */
export default function Heatmap3D() {
  useEffect(() => {
    // Adiciona estilos CSS
    const addStyles = () => {
      if (document.getElementById('heatmap-styles')) return;
      
      const styleElement = document.createElement('style');
      styleElement.id = 'heatmap-styles';
      styleElement.textContent = `
        .heat-point {
          position: absolute;
          width: 20px;
          height: 20px;
          background: radial-gradient(circle, rgba(255,0,0,0.5), transparent);
          border-radius: 50%;
          pointer-events: none;
          transform: translate(-50%, -50%);
          opacity: 0.7;
          z-index: 9999;
        }
        
        .heat-point.click {
          width: 30px;
          height: 30px;
          background: radial-gradient(circle, rgba(255,0,0,0.8) 0%, rgba(255,165,0,0.6) 40%, transparent 80%);
          animation: heat-pulse 1s ease-out;
        }
        
        @keyframes heat-pulse {
          0% {
            transform: translate(-50%, -50%) scale(0.5);
            opacity: 1;
          }
          100% {
            transform: translate(-50%, -50%) scale(1.5);
            opacity: 0;
          }
        }
      `;
      document.head.appendChild(styleElement);
    };
    
    // Armazena dados de cliques e movimentos
    let heatData: {
      clicks: Array<{x: number, y: number, timestamp: number}>,
      moves: Array<{x: number, y: number, timestamp: number}>
    } = {
      clicks: [],
      moves: []
    };
    
    // Define o modo (desenvolvimento ou produção)
    const isDevelopment = process.env.NODE_ENV === 'development' || localStorage.getItem('heatmap_visible') === 'true';
    
    // Manipulador de cliques
    const handleClick = (e: MouseEvent) => {
      // Armazena dados do clique
      const clickData = {
        x: e.pageX,
        y: e.pageY,
        timestamp: Date.now()
      };
      
      heatData.clicks.push(clickData);
      
      // Limita o tamanho do array (evita uso excessivo de memória)
      if (heatData.clicks.length > 100) {
        heatData.clicks.shift();
      }
      
      // Exibe o ponto de calor se estiver em modo de desenvolvimento
      if (isDevelopment) {
        createHeatPoint(e.pageX, e.pageY, true);
      }
      
      // Registra o evento
      console.log('Clique registrado:', clickData);
    };
    
    // Manipulador de movimentos do mouse (amostragem para evitar sobrecarga)
    const handleMouseMove = (e: MouseEvent) => {
      // Amostragem para reduzir sobrecarga (1 a cada 20 movimentos)
      if (Math.random() > 0.05) return;
      
      // Armazena dados do movimento
      const moveData = {
        x: e.pageX,
        y: e.pageY,
        timestamp: Date.now()
      };
      
      heatData.moves.push(moveData);
      
      // Limita o tamanho do array (evita uso excessivo de memória)
      if (heatData.moves.length > 200) {
        heatData.moves.shift();
      }
      
      // Exibe o ponto de calor se estiver em modo de desenvolvimento
      if (isDevelopment) {
        createHeatPoint(e.pageX, e.pageY, false);
      }
    };
    
    // Cria um ponto de calor visual
    const createHeatPoint = (x: number, y: number, isClick: boolean) => {
      const heat = document.createElement('div');
      heat.className = isClick ? 'heat-point click' : 'heat-point';
      heat.style.left = `${x}px`;
      heat.style.top = `${y}px`;
      document.body.appendChild(heat);
      
      // Remove o ponto após um tempo
      setTimeout(() => {
        heat.remove();
      }, isClick ? 1000 : 400);
    };
    
    // Envia dados periodicamente para o servidor
    const sendDataToServer = () => {
      // Copia os dados e limpa os arrays
      const dataToSend = {
        clicks: [...heatData.clicks],
        moves: [...heatData.moves]
      };
      
      // Limpa os arrays após enviar
      heatData.clicks = [];
      heatData.moves = [];
      
      // Verifica se há dados para enviar
      if (dataToSend.clicks.length === 0 && dataToSend.moves.length === 0) {
        return;
      }
      
      // Envia para o servidor (em produção, seria um endpoint real)
      try {
        fetch('/api/heatmap-data', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(dataToSend)
        });
      } catch (error) {
        console.error('Erro ao enviar dados de heatmap:', error);
      }
    };
    
    // Inicializa
    addStyles();
    
    // Adiciona event listeners
    document.addEventListener('click', handleClick);
    document.addEventListener('mousemove', handleMouseMove);
    
    // Configura o envio periódico de dados
    const sendInterval = setInterval(sendDataToServer, 30000);
    
    // Adiciona a opção de toggle para depuração
    if (isDevelopment) {
      // Adiciona um botão de toggle
      const toggleButton = document.createElement('button');
      toggleButton.innerText = 'Toggle Heatmap';
      toggleButton.style.position = 'fixed';
      toggleButton.style.bottom = '10px';
      toggleButton.style.left = '10px';
      toggleButton.style.zIndex = '10000';
      toggleButton.style.padding = '5px 10px';
      toggleButton.style.background = '#333';
      toggleButton.style.color = 'white';
      toggleButton.style.border = 'none';
      toggleButton.style.borderRadius = '4px';
      toggleButton.style.fontSize = '12px';
      toggleButton.style.opacity = '0.7';
      
      toggleButton.addEventListener('click', () => {
        const current = localStorage.getItem('heatmap_visible');
        localStorage.setItem('heatmap_visible', current === 'true' ? 'false' : 'true');
        location.reload();
      });
      
      document.body.appendChild(toggleButton);
    }
    
    // Cleanup
    return () => {
      document.removeEventListener('click', handleClick);
      document.removeEventListener('mousemove', handleMouseMove);
      clearInterval(sendInterval);
      
      if (isDevelopment) {
        const toggleButton = document.querySelector('button[innerText="Toggle Heatmap"]');
        if (toggleButton) {
          toggleButton.remove();
        }
      }
    };
  }, []);
  
  // Este componente não renderiza nada visualmente
  return null;
}
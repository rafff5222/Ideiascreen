import { useEffect, useState } from 'react';

type ClickData = {
  x: number;
  y: number;
  timestamp: number;
};

/**
 * Componente que rastreia cliques do usuário para criar um heatmap
 * Implementação própria sem dependências externas como Hotjar
 */
export default function ClickHeatmap() {
  const [clicks, setClicks] = useState<ClickData[]>([]);
  const [isEnabled, setIsEnabled] = useState(true);
  
  // Rastreia cliques quando o componente monta
  useEffect(() => {
    if (!isEnabled) return;
    
    // Handler para capturar cliques
    const handleClick = (e: MouseEvent) => {
      const newClick: ClickData = {
        x: e.pageX,
        y: e.pageY,
        timestamp: Date.now()
      };
      
      // Adiciona clique ao estado
      setClicks(prev => [...prev, newClick]);
      
      // Envia clique para API
      sendClickData(newClick);
      
      // Cria elemento visual temporário para o clique
      if (process.env.NODE_ENV === 'development') {
        createClickVisual(newClick.x, newClick.y);
      }
    };
    
    // Adiciona listener
    document.addEventListener('click', handleClick);
    
    // Remove listener na limpeza
    return () => {
      document.removeEventListener('click', handleClick);
    };
  }, [isEnabled]);
  
  // Envia dados de cliques para a API
  const sendClickData = async (clickData: ClickData) => {
    try {
      // Prepara dados mais completos para análise
      const enrichedClickData = {
        ...clickData,
        path: window.location.pathname,
        userAgent: navigator.userAgent,
        screenWidth: window.innerWidth,
        screenHeight: window.innerHeight,
        targetElement: document.elementFromPoint(clickData.x, clickData.y)?.tagName || 'unknown',
        targetElementId: (document.elementFromPoint(clickData.x, clickData.y) as HTMLElement)?.id || '',
        targetElementClass: (document.elementFromPoint(clickData.x, clickData.y) as HTMLElement)?.className || ''
      };
      
      // Log para debug
      console.log('Clique registrado:', clickData);
      
      // Usa sendBeacon para envios não-bloqueantes (funciona mesmo se a página for fechada)
      if (navigator.sendBeacon) {
        const blob = new Blob([JSON.stringify(enrichedClickData)], { type: 'application/json' });
        navigator.sendBeacon('/api/clicks', blob);
      } else {
        // Fallback para fetch se sendBeacon não estiver disponível
        await fetch('/api/clicks', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(enrichedClickData)
        });
      }
    } catch (error) {
      console.error('Erro ao enviar dados de clique:', error);
    }
  };
  
  // Cria elemento visual para o clique (apenas em desenvolvimento)
  const createClickVisual = (x: number, y: number) => {
    try {
      // Cria elemento visual
      const visual = document.createElement('div');
      visual.style.position = 'absolute';
      visual.style.left = `${x}px`;
      visual.style.top = `${y}px`;
      visual.style.width = '10px';
      visual.style.height = '10px';
      visual.style.borderRadius = '50%';
      visual.style.backgroundColor = 'rgba(255, 0, 0, 0.5)';
      visual.style.pointerEvents = 'none';
      visual.style.zIndex = '9999';
      visual.style.transform = 'translate(-50%, -50%)';
      
      // Adiciona ao documento
      document.body.appendChild(visual);
      
      // Efeito de fade-out
      visual.animate(
        [
          { opacity: 1, transform: 'translate(-50%, -50%) scale(1)' },
          { opacity: 0, transform: 'translate(-50%, -50%) scale(2)' }
        ],
        {
          duration: 1000,
          easing: 'ease-out'
        }
      );
      
      // Remove após a animação
      setTimeout(() => {
        // Verifica se o elemento ainda existe no DOM
        if (document.body.contains(visual)) {
          document.body.removeChild(visual);
        }
      }, 1000);
    } catch (error) {
      console.error("Erro ao criar visualização de clique:", error);
    }
  };
  
  // Componente não renderiza nada visualmente
  return null;
}
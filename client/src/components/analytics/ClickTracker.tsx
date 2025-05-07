import { useEffect } from 'react';

/**
 * Componente para rastrear cliques do usuário na página
 * Implementação simples similar ao Hotjar, porém sem bibliotecas externas
 */
export default function ClickTracker() {
  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      // Só rastreia cliques no modo de desenvolvimento
      if (process.env.NODE_ENV === 'development' || localStorage.getItem('enableClickTracking') === 'true') {
        // Cria o ponto vermelho onde o usuário clicou
        const dot = document.createElement('div');
        dot.style.position = 'fixed';
        dot.style.left = `${e.clientX - 5}px`;
        dot.style.top = `${e.clientY - 5}px`;
        dot.style.width = '10px';
        dot.style.height = '10px';
        dot.style.backgroundColor = 'rgba(255,0,0,0.5)';
        dot.style.borderRadius = '50%';
        dot.style.zIndex = '9999';
        
        // Adiciona à página
        document.body.appendChild(dot);
        
        // Registra no console para análise
        console.log(`Click recorded at: X=${e.clientX}, Y=${e.clientY}, Element:`, e.target);
        
        // Remove o ponto após um segundo (efeito visual temporário)
        setTimeout(() => dot.remove(), 1000);
        
        // Opcional: salvar os dados para análise posterior
        const clicks = JSON.parse(localStorage.getItem('clickData') || '[]');
        clicks.push({
          x: e.clientX,
          y: e.clientY,
          path: e.composedPath().slice(0, 3).map((el: any) => 
            el.id || el.className || el.tagName
          ),
          timestamp: new Date().toISOString()
        });
        localStorage.setItem('clickData', JSON.stringify(clicks.slice(-100))); // Mantém apenas os últimos 100 cliques
      }
    };

    // Adiciona o event listener
    document.addEventListener('click', handleClick);
    
    // Limpa o event listener quando o componente é desmontado
    return () => {
      document.removeEventListener('click', handleClick);
    };
  }, []);

  // Este componente não renderiza nada visualmente
  return null;
}
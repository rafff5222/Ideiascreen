import { useEffect } from 'react';

/**
 * Componente de Comparação de Planos Interativa
 * Permite que o usuário visualize o custo-benefício em relação ao seu uso
 * através de um controle deslizante interativo
 */
export default function InteractiveComparison() {
  useEffect(() => {
    // Adiciona estilos CSS
    const addStyles = () => {
      if (document.getElementById('interactive-comparison-styles')) return;
      
      const styleElement = document.createElement('style');
      styleElement.id = 'interactive-comparison-styles';
      styleElement.textContent = `
        .comparison-tool {
          background: white;
          border-radius: 12px;
          box-shadow: 0 4px 15px rgba(0, 0, 0, 0.05);
          padding: 20px;
          margin: 30px 0;
          max-width: 600px;
          margin-left: auto;
          margin-right: auto;
          font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
        }
        
        .comparison-tool h3 {
          text-align: center;
          margin-top: 0;
          margin-bottom: 20px;
          color: #1F2937;
          font-weight: 600;
        }
        
        .comparison-tool .slider-container {
          padding: 0 10px;
          margin-bottom: 30px;
        }
        
        .comparison-tool .slider {
          width: 100%;
          height: 8px;
          background: #E5E7EB;
          outline: none;
          border-radius: 8px;
          -webkit-appearance: none;
          appearance: none;
        }
        
        .comparison-tool .slider::-webkit-slider-thumb {
          -webkit-appearance: none;
          appearance: none;
          width: 24px;
          height: 24px;
          border-radius: 50%;
          background: #8B5CF6;
          cursor: pointer;
          box-shadow: 0 2px 5px rgba(0, 0, 0, 0.2);
          transition: all 0.2s;
        }
        
        .comparison-tool .slider::-webkit-slider-thumb:hover {
          box-shadow: 0 0 0 8px rgba(139, 92, 246, 0.2);
        }
        
        .comparison-tool .slider::-moz-range-thumb {
          width: 24px;
          height: 24px;
          border-radius: 50%;
          background: #8B5CF6;
          cursor: pointer;
          box-shadow: 0 2px 5px rgba(0, 0, 0, 0.2);
          border: none;
          transition: all 0.2s;
        }
        
        .comparison-tool .slider::-moz-range-thumb:hover {
          box-shadow: 0 0 0 8px rgba(139, 92, 246, 0.2);
        }
        
        .comparison-tool .usage-label {
          display: flex;
          justify-content: space-between;
          font-size: 14px;
          color: #6B7280;
          margin-top: 8px;
        }
        
        .comparison-tool .results {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 16px;
        }
        
        .comparison-tool .plano-result {
          background: #F9FAFB;
          border-radius: 8px;
          padding: 15px;
          text-align: center;
          transition: all 0.3s ease;
        }
        
        .comparison-tool .plano-result:hover {
          transform: translateY(-4px);
          box-shadow: 0 6px 12px rgba(0, 0, 0, 0.05);
        }
        
        .comparison-tool .plano-result[data-plano="premium"] {
          border: 2px solid #8B5CF6;
          background: linear-gradient(rgba(139, 92, 246, 0.05), rgba(139, 92, 246, 0.02));
        }
        
        .comparison-tool .plano-result h4 {
          margin-top: 0;
          margin-bottom: 10px;
          color: #1F2937;
          font-weight: 600;
        }
        
        .comparison-tool .plano-result .economy {
          display: flex;
          flex-direction: column;
          align-items: center;
        }
        
        .comparison-tool .plano-result .economy span {
          font-size: 28px;
          font-weight: 700;
          color: #10B981;
          margin: 5px 0;
        }
        
        .comparison-tool .plano-result .time-saved {
          font-size: 14px;
          color: #6B7280;
          margin-top: 10px;
        }
        
        .comparison-tool .plano-result .time-saved span {
          font-weight: 600;
          color: #1F2937;
        }
        
        .comparison-tool .value-label {
          font-size: 13px;
          text-transform: uppercase;
          margin-bottom: 5px;
          letter-spacing: 0.5px;
          color: #6B7280;
        }
        
        .comparison-tool .selected-usage {
          text-align: center;
          margin-bottom: 20px;
          font-weight: 500;
          color: #1F2937;
        }
        
        .comparison-tool .selected-usage span {
          font-weight: 600;
          color: #8B5CF6;
        }
      `;
      document.head.appendChild(styleElement);
    };
    
    // Função para inserir ou localizar a ferramenta de comparação
    const insertComparisonTool = () => {
      // Verifica se já existe
      if (document.getElementById('interactive-comparison-tool')) return;
      
      // Procura por um bom local para inserir a ferramenta de comparação
      const pricingSections = document.querySelectorAll(
        '.pricing, #pricing, .pricing-section, [data-section="pricing"], .plans-section'
      );
      
      let targetElement = null;
      
      if (pricingSections.length > 0) {
        // Insere após a primeira seção de preços encontrada
        targetElement = pricingSections[0];
        
        // Cria o elemento de comparação
        const compareTool = document.createElement('div');
        compareTool.id = 'interactive-comparison-tool';
        compareTool.className = 'comparison-tool';
        
        // Define o conteúdo HTML
        compareTool.innerHTML = `
          <h3>Compare a economia com cada plano</h3>
          
          <div class="selected-usage">
            Crie <span id="usage-value">50</span> vídeos por mês
          </div>
          
          <div class="slider-container">
            <input type="range" min="10" max="100" value="50" class="slider" id="usageSlider">
            <div class="usage-label">
              <span>10 vídeos</span>
              <span>100 vídeos</span>
            </div>
          </div>
          
          <div class="results">
            <div class="plano-result" data-plano="basico">
              <h4>Básico</h4>
              <div class="value-label">Economia mensal</div>
              <div class="economy">R$ <span>160</span></div>
              <div class="time-saved">Tempo economizado: <span>10 horas</span></div>
            </div>
            <div class="plano-result" data-plano="premium">
              <h4>Premium</h4>
              <div class="value-label">Economia mensal</div>
              <div class="economy">R$ <span>320</span></div>
              <div class="time-saved">Tempo economizado: <span>25 horas</span></div>
            </div>
          </div>
        `;
        
        // Insere após o elemento alvo
        targetElement.parentNode?.insertBefore(compareTool, targetElement.nextSibling);
        
        // Adiciona a lógica interativa
        setupSliderInteraction();
      }
    };
    
    // Configura a interação do slider
    const setupSliderInteraction = () => {
      const slider = document.getElementById('usageSlider') as HTMLInputElement;
      if (!slider) return;
      
      const updateValues = () => {
        const value = parseInt(slider.value);
        
        // Atualiza o display de valor selecionado
        const usageValueElement = document.getElementById('usage-value');
        if (usageValueElement) {
          usageValueElement.textContent = value.toString();
        }
        
        // Calcula economias com base no uso
        // Basico: R$100 por hora de trabalho, 12 minutos por vídeo
        // Premium: R$100 por hora de trabalho, 30 minutos por vídeo
        const hourlyRate = 100;
        
        // Tempo para criar vídeo manualmente (em horas)
        const manualTime = value * (2/3); // 40 minutos (2/3 hora) por vídeo
        
        // Tempo com plano Básico (em horas)
        const basicTime = value * (1/5); // 12 minutos (1/5 hora) por vídeo
        
        // Tempo com plano Premium (em horas)
        const premiumTime = value * (1/15); // 4 minutos (1/15 hora) por vídeo
        
        // Calcula economia financeira
        const basicEconomy = Math.floor((manualTime - basicTime) * hourlyRate);
        const premiumEconomy = Math.floor((manualTime - premiumTime) * hourlyRate);
        
        // Calcula tempo economizado (em horas)
        const basicTimeSaved = Math.floor(manualTime - basicTime);
        const premiumTimeSaved = Math.floor(manualTime - premiumTime);
        
        // Atualiza os valores na interface
        const basicEconomyElement = document.querySelector('[data-plano="basico"] .economy span');
        const premiumEconomyElement = document.querySelector('[data-plano="premium"] .economy span');
        
        const basicTimeElement = document.querySelector('[data-plano="basico"] .time-saved span');
        const premiumTimeElement = document.querySelector('[data-plano="premium"] .time-saved span');
        
        if (basicEconomyElement) basicEconomyElement.textContent = basicEconomy.toString();
        if (premiumEconomyElement) premiumEconomyElement.textContent = premiumEconomy.toString();
        
        if (basicTimeElement) basicTimeElement.textContent = `${basicTimeSaved} horas`;
        if (premiumTimeElement) premiumTimeElement.textContent = `${premiumTimeSaved} horas`;
        
        // Registra o evento para analytics
        console.log('Analytics:', {
          event: 'interactive_comparison_used',
          usage_value: value,
          basic_economy: basicEconomy,
          premium_economy: premiumEconomy,
          timestamp: new Date().toISOString()
        });
      };
      
      // Inicializa com os valores padrão
      updateValues();
      
      // Adiciona listener para atualizar enquanto o usuário move o slider
      slider.addEventListener('input', updateValues);
    };
    
    // Adiciona estilos e insere a ferramenta na página
    addStyles();
    
    // Tenta inserir imediatamente
    insertComparisonTool();
    
    // Se não conseguiu inserir (talvez porque a seção de preços ainda não foi carregada)
    // observa mudanças no DOM para tentar novamente
    if (!document.getElementById('interactive-comparison-tool')) {
      const observer = new MutationObserver((mutations) => {
        if (document.getElementById('interactive-comparison-tool')) {
          observer.disconnect();
          return;
        }
        
        for (const mutation of mutations) {
          if (mutation.type === 'childList' && mutation.addedNodes.length > 0) {
            // Verifica se a seção de preços foi adicionada
            const pricingSectionsAdded = Array.from(mutation.addedNodes).some(node => {
              if (node.nodeType !== Node.ELEMENT_NODE) return false;
              const element = node as HTMLElement;
              
              return element.classList.contains('pricing') || 
                     element.id === 'pricing' ||
                     element.classList.contains('pricing-section') ||
                     element.dataset.section === 'pricing' ||
                     element.classList.contains('plans-section');
            });
            
            if (pricingSectionsAdded) {
              insertComparisonTool();
              observer.disconnect();
              break;
            }
          }
        }
      });
      
      observer.observe(document.body, {
        childList: true,
        subtree: true
      });
      
      // Cleanup
      return () => {
        observer.disconnect();
      };
    }
  }, []);
  
  // Este componente não renderiza nada diretamente (manipula o DOM)
  return null;
}
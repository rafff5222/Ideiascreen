import { useEffect } from 'react';

/**
 * Componente de Comparação com Concorrentes
 * Adiciona uma tabela de comparação que destaca vantagens sobre a concorrência
 */
export default function CompetitorComparison() {
  useEffect(() => {
    // Verifica se já está na página de planos/preços
    const isPricingPage = () => {
      return (
        window.location.pathname.includes('planos') ||
        window.location.pathname.includes('precos') ||
        window.location.pathname.includes('pricing') ||
        document.getElementById('planos') !== null ||
        document.querySelector('.pricing-section') !== null
      );
    };
    
    // Injetar a comparação na página de planos
    const injectComparison = () => {
      // Encontrar o contêiner onde adicionar a tabela (após a seção de preços)
      const pricingSection = document.getElementById('planos') || 
                            document.querySelector('.pricing-section');
      
      if (!pricingSection) return false;
      
      // Verifica se a comparação já existe
      if (document.getElementById('competitor-comparison')) return true;
      
      // Cria o contêiner da comparação
      const comparisonContainer = document.createElement('div');
      comparisonContainer.id = 'competitor-comparison';
      comparisonContainer.className = 'comparison-container';
      
      // HTML da tabela de comparação
      comparisonContainer.innerHTML = `
        <div class="comparison-header">
          <h3>Por que escolher a ContentPro?</h3>
          <p>Veja como nos comparamos com outras soluções do mercado</p>
        </div>
        <div class="comparison-table-wrapper">
          <table class="comparison-table">
            <thead>
              <tr>
                <th>Recurso</th>
                <th>Outros</th>
                <th class="highlight">ContentPro</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>Vídeos Automáticos</td>
                <td>❌</td>
                <td class="highlight">✅</td>
              </tr>
              <tr>
                <td>Montagem com IA</td>
                <td>Limitado</td>
                <td class="highlight">Completo</td>
              </tr>
              <tr>
                <td>Conteúdo otimizado por nicho</td>
                <td>❌</td>
                <td class="highlight">✅</td>
              </tr>
              <tr>
                <td>Efeitos Cinemáticos</td>
                <td>Extra $$$</td>
                <td class="highlight">Incluído</td>
              </tr>
              <tr>
                <td>Suporte ao usuário</td>
                <td>Email</td>
                <td class="highlight">24/7 Chat</td>
              </tr>
              <tr>
                <td>Preço Mensal</td>
                <td>R$ 149+</td>
                <td class="highlight">A partir de R$ 59</td>
              </tr>
            </tbody>
          </table>
        </div>
        
        <div class="comparison-cta">
          <p class="comparison-guarantee">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M12 22s8-4 8-10V4H4v8c0 6 8 10 8 10z"></path>
            </svg>
            Garantia de 7 dias ou seu dinheiro de volta, sem perguntas
          </p>
          <button class="comparison-button">Comece agora com 7 dias grátis</button>
        </div>
      `;
      
      // Adiciona após a seção de preços
      pricingSection.parentNode?.insertBefore(
        comparisonContainer, 
        pricingSection.nextSibling
      );
      
      // Adiciona estilos CSS
      addComparisonStyles();
      
      // Adiciona event listener para o botão
      const ctaButton = comparisonContainer.querySelector('.comparison-button');
      if (ctaButton) {
        ctaButton.addEventListener('click', () => {
          // Rola para a seção de planos
          const pricingTop = pricingSection.getBoundingClientRect().top + window.pageYOffset - 100;
          window.scrollTo({ top: pricingTop, behavior: 'smooth' });
          
          // Destaca o plano premium após um breve delay
          setTimeout(() => {
            const premiumPlan = document.querySelector('.plano-premium') || 
                             document.querySelector('[data-plano="premium"]');
            
            if (premiumPlan) {
              premiumPlan.classList.add('highlight-plan');
              setTimeout(() => premiumPlan.classList.remove('highlight-plan'), 2000);
            }
          }, 800);
          
          // Registra o evento de analytics
          console.log('Analytics:', {
            event: 'comparison_cta_clicked',
            timestamp: new Date().toISOString()
          });
        });
      }
      
      // Registra o evento
      console.log('Analytics:', {
        event: 'competitor_comparison_displayed',
        timestamp: new Date().toISOString()
      });
      
      return true;
    };
    
    // Adiciona os estilos CSS para a comparação
    const addComparisonStyles = () => {
      if (document.getElementById('competitor-comparison-styles')) return;
      
      const styleElement = document.createElement('style');
      styleElement.id = 'competitor-comparison-styles';
      styleElement.textContent = `
        .comparison-container {
          max-width: 900px;
          margin: 60px auto;
          padding: 0 20px;
          font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
        }
        
        .comparison-header {
          text-align: center;
          margin-bottom: 30px;
        }
        
        .comparison-header h3 {
          font-size: 28px;
          font-weight: 700;
          margin-bottom: 10px;
          background: linear-gradient(90deg, #8B5CF6, #EC4899);
          -webkit-background-clip: text;
          background-clip: text;
          -webkit-text-fill-color: transparent;
        }
        
        .comparison-header p {
          color: #666;
          font-size: 16px;
        }
        
        .comparison-table-wrapper {
          overflow-x: auto;
          border-radius: 8px;
          box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
        }
        
        .comparison-table {
          width: 100%;
          border-collapse: collapse;
          text-align: left;
          background: white;
        }
        
        .comparison-table th, .comparison-table td {
          padding: 16px 24px;
          border-bottom: 1px solid #f0f0f0;
        }
        
        .comparison-table th {
          font-weight: 600;
          font-size: 16px;
          background: #f9f9f9;
        }
        
        .comparison-table th.highlight {
          background: rgba(139, 92, 246, 0.15);
          color: #8B5CF6;
        }
        
        .comparison-table td {
          font-size: 15px;
        }
        
        .comparison-table td.highlight {
          background-color: rgba(139, 92, 246, 0.05);
          font-weight: 500;
          color: #8B5CF6;
        }
        
        .comparison-cta {
          display: flex;
          flex-direction: column;
          align-items: center;
          margin-top: 30px;
          text-align: center;
        }
        
        .comparison-guarantee {
          display: flex;
          align-items: center;
          color: #666;
          font-size: 14px;
          margin-bottom: 20px;
        }
        
        .comparison-guarantee svg {
          color: #10B981;
          margin-right: 8px;
        }
        
        .comparison-button {
          padding: 12px 28px;
          background: linear-gradient(90deg, #8B5CF6, #EC4899);
          color: white;
          border: none;
          border-radius: 30px;
          font-weight: 600;
          font-size: 16px;
          cursor: pointer;
          transition: all 0.3s ease;
          box-shadow: 0 4px 12px rgba(139, 92, 246, 0.25);
        }
        
        .comparison-button:hover {
          transform: translateY(-2px);
          box-shadow: 0 6px 16px rgba(139, 92, 246, 0.3);
        }
        
        @media (max-width: 768px) {
          .comparison-table th, .comparison-table td {
            padding: 12px 16px;
          }
          
          .comparison-header h3 {
            font-size: 24px;
          }
        }
        
        @keyframes highlight-pulse {
          0% {
            box-shadow: 0 0 0 0 rgba(139, 92, 246, 0.7);
            transform: scale(1);
          }
          50% {
            box-shadow: 0 0 20px 10px rgba(139, 92, 246, 0.5);
            transform: scale(1.03);
          }
          100% {
            box-shadow: 0 0 0 0 rgba(139, 92, 246, 0);
            transform: scale(1);
          }
        }
        
        .highlight-plan {
          animation: highlight-pulse 2s ease;
        }
      `;
      document.head.appendChild(styleElement);
    };
    
    // Tenta injetar inicialmente
    let injected = false;
    if (isPricingPage()) {
      injected = injectComparison();
    }
    
    // Se não injetou inicialmente, configura um observador para detectar quando
    // a seção de preços for carregada
    if (!injected) {
      const observer = new MutationObserver((mutations) => {
        if (isPricingPage() && !document.getElementById('competitor-comparison')) {
          injectComparison();
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
  
  // Este componente não renderiza nada visualmente
  return null;
}
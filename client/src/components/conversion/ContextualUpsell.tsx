import { useEffect, useState } from 'react';
import { Button } from "@/components/ui/button";

/**
 * Componente de upsell contextual que aparece após o usuário rolar a página
 * Oferece recursos adicionais baseados no comportamento de navegação
 */
export default function ContextualUpsell() {
  const [isVisible, setIsVisible] = useState(false);
  const [featureInterest, setFeatureInterest] = useState<string>('');
  const [scrolledPastPlans, setScrolledPastPlans] = useState(false);
  
  useEffect(() => {
    // Detecta interesses baseados no comportamento
    const detectInterests = () => {
      // Lista de features e seus seletores na página
      const featureMap = [
        { id: 'video-generation', name: 'Geração automática de vídeos', selector: '.feature-video' },
        { id: 'captions', name: 'Legendas otimizadas', selector: '.feature-caption' },
        { id: 'scripts', name: 'Scripts de conteúdo', selector: '.feature-script' },
        { id: 'trends', name: 'Análise de tendências', selector: '.feature-trends' }
      ];
      
      // Rastreia hover em cada feature
      const storedHoverTimes = sessionStorage.getItem('featureHoverTimes');
      let hoverTimes: Record<string, number> = {};
      
      if (storedHoverTimes) {
        try {
          hoverTimes = JSON.parse(storedHoverTimes);
        } catch (e) {
          console.error('Erro ao analisar dados de features:', e);
        }
      }
      
      featureMap.forEach(feature => {
        const elements = document.querySelectorAll(feature.selector);
        elements.forEach(element => {
          element.addEventListener('mouseenter', () => {
            const featureId = feature.id;
            hoverTimes[featureId] = (hoverTimes[featureId] || 0) + 1;
            sessionStorage.setItem('featureHoverTimes', JSON.stringify(hoverTimes));
            
            // Se o usuário deu hover mais de 3 vezes, assumimos interesse
            if (hoverTimes[featureId] >= 3) {
              setFeatureInterest(feature.name);
            }
          });
        });
      });
    };
    
    // Scroll listener para detectar quando o usuário passou pela seção de planos
    const handleScroll = () => {
      const plansSection = document.querySelector('#planos');
      if (plansSection) {
        const plansSectionBottom = plansSection.getBoundingClientRect().bottom;
        if (plansSectionBottom < 0 && !scrolledPastPlans) {
          setScrolledPastPlans(true);
          setTimeout(() => {
            setIsVisible(true);
          }, 1000); // Espera um segundo após passar a seção para mostrar o upsell
        }
      }
    };
    
    // Inicializa
    detectInterests();
    window.addEventListener('scroll', handleScroll);
    
    // Detecta feature de interesse com base nos cliques anteriores (fallback)
    if (!featureInterest) {
      const storedData = sessionStorage.getItem('featureHoverTimes');
      let hoverData: Record<string, number> = {};
      
      if (storedData) {
        try {
          hoverData = JSON.parse(storedData);
        } catch (e) {
          console.error('Erro ao analisar dados de hover:', e);
        }
      }
      
      const entries = Object.entries(hoverData);
      const mostInterested = entries.length > 0 ? entries.sort((a, b) => b[1] - a[1])[0] : null;
      
      if (mostInterested) {
        const featureId = mostInterested[0];
        if (featureId === 'video-generation') {
          setFeatureInterest('Geração automática de vídeos');
        } else if (featureId === 'captions') {
          setFeatureInterest('Legendas otimizadas');
        } else if (featureId === 'scripts') {
          setFeatureInterest('Scripts de conteúdo');
        } else if (featureId === 'trends') {
          setFeatureInterest('Análise de tendências');
        }
      } else {
        // Valor padrão se nada for detectado
        setFeatureInterest('Geração automática de vídeos');
      }
    }
    
    // Cleanup
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [featureInterest]);
  
  const handleUpsellClick = () => {
    // Adiciona o upsell à compra
    console.log('Upsell adicionado:', featureInterest);
    // Registra o evento de conversão
    const analyticsEvent = {
      event: 'upsell_click',
      feature: featureInterest,
      timestamp: new Date().toISOString()
    };
    console.log('Analytics:', analyticsEvent);
    
    // Fecha o upsell com feedback visual
    const upsellElement = document.querySelector('.upsell-contextual');
    if (upsellElement instanceof HTMLElement) {
      upsellElement.classList.add('added');
      setTimeout(() => {
        setIsVisible(false);
      }, 2000);
    }
  };
  
  if (!isVisible) return null;
  
  return (
    <div className="upsell-contextual fixed bottom-5 left-1/2 transform -translate-x-1/2 max-w-xl w-full mx-auto bg-white rounded-xl shadow-lg z-40 overflow-hidden">
      <div className="border-l-4 border-purple-500 p-4">
        <div className="flex items-start">
          <div className="flex-1">
            <p className="text-sm text-gray-600 mb-2">
              🔍 <strong>Você estava olhando:</strong> {featureInterest}
            </p>
            
            <div className="bg-purple-50 p-3 rounded-lg">
              <span className="text-gray-800 font-medium">
                Leve o <strong className="text-purple-600">Pacote Viral+</strong> por R$ 19/mês e ganhe:
              </span>
              <ul className="text-sm mt-2 space-y-1">
                <li className="flex items-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-green-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  +100 músicas sem copyright
                </li>
                <li className="flex items-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-green-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  10 templates exclusivos
                </li>
                <li className="flex items-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-green-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  Acesso a efeitos premium
                </li>
              </ul>
            </div>
            
            <div className="mt-3 text-center">
              <Button 
                className="btn-upsell bg-gradient-to-r from-pink-500 to-purple-500 text-white px-6 py-2 rounded-full text-sm font-medium"
                onClick={handleUpsellClick}
              >
                QUERO POTENCIALIZAR
              </Button>
              
              <button 
                className="block mx-auto text-xs text-gray-500 mt-2 hover:underline"
                onClick={() => setIsVisible(false)}
              >
                Não, obrigado
              </button>
            </div>
          </div>
          
          <button 
            className="text-gray-400 hover:text-gray-600" 
            onClick={() => setIsVisible(false)}
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
      </div>
      
      <style>{`
        .upsell-contextual {
          animation: slide-up 0.5s ease;
          box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1);
        }
        
        .upsell-contextual.added {
          animation: pulse-success 2s ease;
          background-color: #f0fdf4;
          border-color: #10b981;
        }
        
        @keyframes slide-up {
          from { transform: translate(-50%, 100%); }
          to { transform: translate(-50%, 0); }
        }
        
        @keyframes pulse-success {
          0% { box-shadow: 0 0 0 0 rgba(16, 185, 129, 0.7); }
          70% { box-shadow: 0 0 0 10px rgba(16, 185, 129, 0); }
          100% { box-shadow: 0 0 0 0 rgba(16, 185, 129, 0); }
        }
        
        .btn-upsell {
          transition: all 0.3s ease;
        }
        
        .btn-upsell:hover {
          transform: scale(1.05);
          box-shadow: 0 4px 10px rgba(236, 72, 153, 0.3);
        }
      `}</style>
    </div>
  );
}
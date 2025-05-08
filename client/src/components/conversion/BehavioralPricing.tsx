import { useEffect, useState } from 'react';

/**
 * Componente que implementa preços dinâmicos baseados no comportamento do usuário
 * - Detecta padrões de navegação e interesse
 * - Oferece descontos personalizados para usuários hesitantes
 * - Aumenta a taxa de conversão capturando usuários indecisos
 */
export default function BehavioralPricing() {
  const [pricingPageViews, setPricingPageViews] = useState(0);
  const [featuresTime, setFeaturesTime] = useState(0);
  const [offerApplied, setOfferApplied] = useState(false);
  
  useEffect(() => {
    // Inicializa com valores do sessionStorage (para persistência entre renders)
    const storedViews = sessionStorage.getItem('pricingPageViews');
    const storedTime = sessionStorage.getItem('featuresTime');
    const storedOffer = sessionStorage.getItem('offerApplied');
    
    if (storedViews) setPricingPageViews(parseInt(storedViews));
    if (storedTime) setFeaturesTime(parseFloat(storedTime));
    if (storedOffer) setOfferApplied(storedOffer === 'true');
    
    // 1. Contador de visualizações da seção de preços
    const pricingViewInterval = setInterval(() => {
      if (window.location.hash === '#planos') {
        const newViews = pricingPageViews + 1;
        setPricingPageViews(newViews);
        sessionStorage.setItem('pricingPageViews', newViews.toString());
      }
    }, 10000); // Incrementa a cada 10 segundos que o usuário fica na seção
    
    // 2. Rastreador de tempo gasto na seção de recursos
    const featuresTimeInterval = setInterval(() => {
      const featuresElement = document.querySelector('#features');
      if (featuresElement) {
        const featuresBounds = featuresElement.getBoundingClientRect();
        const isVisible = (
          featuresBounds.top >= 0 &&
          featuresBounds.left >= 0 &&
          featuresBounds.bottom <= window.innerHeight &&
          featuresBounds.right <= window.innerWidth
        );
        
        if (isVisible) {
          const newTime = featuresTime + 0.5;
          setFeaturesTime(newTime);
          sessionStorage.setItem('featuresTime', newTime.toString());
        }
      }
    }, 500); // Incrementa a cada 0.5 segundos
    
    // 3. Aplicar a oferta quando condições forem atendidas
    const checkOfferConditions = setInterval(() => {
      if ((pricingPageViews > 2 || featuresTime > 15) && !offerApplied) {
        applySpecialOffer();
      }
    }, 1000);
    
    // Cleanup
    return () => {
      clearInterval(pricingViewInterval);
      clearInterval(featuresTimeInterval);
      clearInterval(checkOfferConditions);
    };
  }, [pricingPageViews, featuresTime, offerApplied]);
  
  /**
   * Aplica oferta especial modificando a DOM
   */
  const applySpecialOffer = () => {
    // Evita aplicar múltiplas vezes
    if (offerApplied) return;
    
    const premiumPriceElements = document.querySelectorAll('.plano-premium .preco');
    
    if (premiumPriceElements.length > 0) {
      premiumPriceElements.forEach(element => {
        // Verifica se já não foi modificado
        if (!element.querySelector('.riscado')) {
          const originalHTML = element.innerHTML;
          element.innerHTML = `
            <span class="riscado" style="text-decoration: line-through; font-size: 0.9em; color: #666;">R$ 89</span>
            <span class="destaque" style="font-size: 1.2em; font-weight: bold; color: #8B5CF6;">R$ 69/mês</span>
            <span class="badge" style="background: linear-gradient(45deg, #EC4899, #8B5CF6); color: white; font-size: 0.6em; padding: 2px 6px; border-radius: 10px; margin-left: 5px;">OFERTA PESSOAL</span>
          `;
          
          // Adiciona contador regressivo
          const countdownElement = document.createElement('div');
          countdownElement.className = 'countdown';
          countdownElement.style.fontSize = '0.7em';
          countdownElement.style.marginTop = '5px';
          countdownElement.style.color = '#EC4899';
          element.appendChild(countdownElement);
          
          // Inicia contador regressivo de 15 minutos
          let secondsLeft = 15 * 60;
          const countdownInterval = setInterval(() => {
            secondsLeft--;
            if (secondsLeft <= 0) {
              clearInterval(countdownInterval);
              // Restaura o preço original após o tempo acabar
              element.innerHTML = originalHTML;
            } else {
              const minutes = Math.floor(secondsLeft / 60);
              const seconds = secondsLeft % 60;
              countdownElement.textContent = `Oferta expira em: ${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
            }
          }, 1000);
          
          // Adiciona animação pulsante para chamar atenção
          element.classList.add('pulse-animation');
          const style = document.createElement('style');
          style.textContent = `
            .pulse-animation {
              animation: pulse 2s infinite;
            }
            @keyframes pulse {
              0% {
                transform: scale(1);
              }
              50% {
                transform: scale(1.05);
              }
              100% {
                transform: scale(1);
              }
            }
          `;
          document.head.appendChild(style);
          
          // Registra evento de analytics
          console.log('Oferta personalizada aplicada com base no comportamento do usuário');
          
          // Marca como aplicado
          setOfferApplied(true);
          sessionStorage.setItem('offerApplied', 'true');
        }
      });
    }
  };
  
  // Este componente não renderiza nada visualmente, apenas modifica a DOM via efeitos
  return null;
}
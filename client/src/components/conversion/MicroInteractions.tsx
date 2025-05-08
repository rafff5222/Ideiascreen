import { useEffect } from 'react';

/**
 * Componente que adiciona micro-interações a elementos da página
 * Aumenta engagement e conversão com animações sutis
 */
export default function MicroInteractions() {
  useEffect(() => {
    // Aplica efeito de hover nos botões premium
    const applyPremiumButtonEffects = () => {
      const premiumButtons = document.querySelectorAll('.btn-premium');
      
      premiumButtons.forEach(button => {
        // Adiciona classes para efeitos CSS
        button.classList.add('transition-all');
        button.classList.add('duration-400');
        
        // Adiciona eventos de hover
        button.addEventListener('mouseenter', () => {
          button.classList.add('scale-105');
          button.classList.add('rotate-1');
          button.classList.add('shadow-lg');
          button.classList.add('shadow-primary/20');
        });
        
        button.addEventListener('mouseleave', () => {
          button.classList.remove('scale-105');
          button.classList.remove('rotate-1');
          button.classList.remove('shadow-lg');
          button.classList.remove('shadow-primary/20');
        });
      });
    };
    
    // Aplica efeito de clique nos cards de planos
    const applyPlanCardEffects = () => {
      const planCards = document.querySelectorAll('.plano-card');
      
      planCards.forEach(card => {
        card.addEventListener('click', function() {
          // Efeito de "afundamento" ao clicar
          card.classList.add('scale-98');
          card.classList.add('transition-transform');
          card.classList.add('duration-200');
          
          // Remove o efeito após 200ms
          setTimeout(() => {
            card.classList.remove('scale-98');
          }, 200);
        });
      });
    };
    
    // Aplica efeito de destaque em recursos premium
    const applyFeatureHighlightEffects = () => {
      const features = document.querySelectorAll('.feature-highlight');
      
      features.forEach(feature => {
        // Adiciona observador de interseção para animar quando visível
        const observer = new IntersectionObserver((entries) => {
          entries.forEach(entry => {
            if (entry.isIntersecting) {
              feature.classList.add('animate-feature-highlight');
              observer.unobserve(feature); // Observa apenas primeira vez
            }
          });
        }, { threshold: 0.3 });
        
        observer.observe(feature);
      });
    };
    
    // Aplica efeito de pulse em tags e badges
    const applyPulseEffects = () => {
      const pulseTags = document.querySelectorAll('.pulse-tag');
      
      pulseTags.forEach(tag => {
        // Adiciona classes para animação
        tag.classList.add('animate-pulse-subtle');
      });
    };
    
    // Aplica todos os efeitos
    const applyAllEffects = () => {
      applyPremiumButtonEffects();
      applyPlanCardEffects();
      applyFeatureHighlightEffects();
      applyPulseEffects();
      
      console.log('Micro-interações aplicadas aos elementos da página');
    };
    
    // Executa as animações apenas depois que a página carregar completamente
    if (document.readyState === 'complete') {
      applyAllEffects();
    } else {
      window.addEventListener('load', applyAllEffects);
    }
    
    // Limpeza ao desmontar
    return () => {
      window.removeEventListener('load', applyAllEffects);
    };
  }, []);
  
  // Este componente não renderiza nada visualmente
  return null;
}
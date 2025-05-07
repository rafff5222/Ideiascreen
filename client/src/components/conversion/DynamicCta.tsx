import { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { ArrowRight, Timer, Sparkles } from "lucide-react";

/**
 * Componente inteligente que adapta o CTA (Call to Action) baseado no comportamento do usuário
 * - Muda o texto após um tempo de permanência
 * - Adapta com base na profundidade de rolagem
 * - Animações para aumentar o destaque
 */
export default function DynamicCta() {
  const [ctaState, setCtaState] = useState<'default' | 'engaged' | 'urgent'>('default');
  const [animate, setAnimate] = useState(false);
  
  useEffect(() => {
    // 1. Tempo na página: após 30 segundos, muda para estado "engaged"
    const timer = setTimeout(() => {
      setCtaState(prev => prev === 'default' ? 'engaged' : prev);
      pulseAnimation();
    }, 30000);
    
    // 2. Profundidade de rolagem: após rolar 70% da página, fica "urgent"
    const handleScroll = () => {
      const scrollPosition = window.scrollY;
      const totalHeight = document.body.scrollHeight - window.innerHeight;
      const scrollPercentage = (scrollPosition / totalHeight) * 100;
      
      if (scrollPercentage > 70) {
        if (ctaState !== 'urgent') {
          setCtaState('urgent');
          pulseAnimation();
        }
      }
    };
    
    window.addEventListener('scroll', handleScroll);
    
    // Aplica animação para chamar atenção
    function pulseAnimation() {
      setAnimate(true);
      setTimeout(() => setAnimate(false), 1200);
    }
    
    // Inicia a animação quando o componente for montado (após um pequeno atraso)
    const initialAnimationTimer = setTimeout(() => {
      pulseAnimation();
    }, 2000);
    
    // Limpa event listeners e timers
    return () => {
      clearTimeout(timer);
      clearTimeout(initialAnimationTimer);
      window.removeEventListener('scroll', handleScroll);
    };
  }, [ctaState]);
  
  // Define os textos e estilos com base no estado
  const ctaContent = {
    default: {
      text: 'Começar agora',
      icon: <ArrowRight size={20} className="ml-2" />,
      classes: 'bg-gradient-to-r from-primary to-purple-600 hover:brightness-110'
    },
    engaged: {
      text: 'Criar primeiro conteúdo',
      icon: <Sparkles size={20} className="ml-2" />,
      classes: 'bg-gradient-to-r from-primary to-purple-600 hover:brightness-110'
    },
    urgent: {
      text: '92% das vagas preenchidas',
      icon: <Timer size={20} className="ml-2" />,
      classes: 'bg-gradient-to-r from-amber-500 to-red-600 hover:brightness-110'
    }
  };
  
  const currentCta = ctaContent[ctaState];
  
  return (
    <Button 
      className={`btn-premium text-lg px-6 py-6 flex items-center transition-all 
        ${currentCta.classes} 
        ${animate ? 'animate-text-blink scale-105' : ''}`}
      onClick={() => window.location.href = '#planos'}
    >
      {currentCta.text}
      {currentCta.icon}
    </Button>
  );
}
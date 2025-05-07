import { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { ArrowRight, Clock, AlertTriangle } from "lucide-react";

/**
 * Componente inteligente que adapta o CTA (Call to Action) baseado no comportamento do usuário
 * - Muda o texto após um tempo de permanência
 * - Adapta com base na profundidade de rolagem
 * - Animações para aumentar o destaque
 */
export default function DynamicCta() {
  const [ctaText, setCtaText] = useState("Começar agora");
  const [ctaIcon, setCtaIcon] = useState(<ArrowRight size={20} className="ml-2" />);
  const [hasSpecialOffer, setHasSpecialOffer] = useState(false);
  const [isUrgent, setIsUrgent] = useState(false);

  useEffect(() => {
    // Detecta a profundidade de rolagem
    const handleScroll = () => {
      const scrollPosition = window.scrollY;
      const documentHeight = document.body.scrollHeight - window.innerHeight;
      const scrollDepth = (scrollPosition / documentHeight) * 100;
      
      // Se o usuário rolou mais de 60% da página, mostra um CTA de urgência
      if (scrollDepth > 60 && !isUrgent) {
        setCtaText("⚠️ ÚLTIMAS VAGAS! Quero meu desconto");
        setIsUrgent(true);
      }
    };
    
    // Após 30 segundos, mostra uma oferta relâmpago
    const timer = setTimeout(() => {
      setCtaText("🔥 OFERTA RELÂMPAGO: 60% OFF nas próximas 2h!");
      setCtaIcon(<Clock size={20} className="ml-2 animate-pulse" />);
      setHasSpecialOffer(true);
    }, 30000);
    
    // Registra o listener de scroll
    window.addEventListener('scroll', handleScroll);
    
    return () => {
      window.removeEventListener('scroll', handleScroll);
      clearTimeout(timer);
    };
  }, [isUrgent]);

  // Classe CSS dinâmica baseada no estado do CTA
  const ctaClass = `
    btn-premium text-lg px-6 py-6 flex items-center transition-all
    ${hasSpecialOffer ? 'animate-pulse scale-105' : ''}
    ${isUrgent ? 'bg-red-600 hover:bg-red-700' : ''}
  `;

  return (
    <Button 
      id="main-cta"
      className={ctaClass}
      onClick={() => window.location.href = '#planos'}
    >
      <span 
        className={hasSpecialOffer ? 'animate-text-blink' : ''}
        dangerouslySetInnerHTML={{ __html: ctaText }}
      />
      {ctaIcon}
    </Button>
  );
}
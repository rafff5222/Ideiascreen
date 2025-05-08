import React, { useEffect, useState } from 'react';
import { Button } from "@/components/ui/button";

type MagicButtonProps = {
  className?: string;
  onClick?: () => void;
  defaultText?: string;
};

/**
 * Componente de botão inteligente que adapta seu texto com base no nicho do usuário
 * Detecta automaticamente o nicho pela URL (se vier de campanhas específicas)
 */
export default function MagicButton({ className = "", onClick, defaultText = "Quero vídeos automáticos" }: MagicButtonProps) {
  const [buttonText, setButtonText] = useState(defaultText);

  useEffect(() => {
    // Detecta nicho pelo referral (ex: ?niche=fitness)
    const urlParams = new URLSearchParams(window.location.search);
    const niche = urlParams.get('niche') || localStorage.getItem('user_niche') || 'geral';
    
    // Armazena o nicho para uso em futuras visitas
    if (niche !== 'geral') {
      localStorage.setItem('user_niche', niche);
    }
    
    // Textos específicos para diferentes nichos
    const ctaTexts: Record<string, string> = {
      fitness: "💪 GANHE MUSCULOSA COM VÍDEOS VIRAIS!",
      finanças: "💰 VÍDEOS QUE GERAM R$10k/MÊS",
      ecommerce: "🛒 AUMENTE SUAS VENDAS COM VÍDEOS!",
      beleza: "✨ TRANSFORME SEGUIDORES EM CLIENTES!",
      geral: defaultText
    };
    
    // Atualiza o texto do botão baseado no nicho
    setButtonText(ctaTexts[niche] || defaultText);
    
    // Analytics - rastreia a segmentação de nicho (para implementação futura)
    console.log(`Nicho detectado: ${niche}`);
  }, [defaultText]);
  
  return (
    <Button 
      id="magic-button"
      className={`py-6 text-lg font-semibold ${className}`}
      onClick={onClick}
    >
      {buttonText}
    </Button>
  );
}
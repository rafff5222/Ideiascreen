import { useState, useEffect } from 'react';
import { useToast } from "@/hooks/use-toast";

type DynamicPricingProps = {
  originalPrice: number;
  discountedPrice: number;
  className?: string;
  timeout?: number;
  pageViewThreshold?: number;
};

/**
 * Componente que ajusta preços em tempo real com base no comportamento do usuário
 * - Detecta tempo na página e número de visualizações
 * - Oferece desconto especial para usuários hesitantes
 * - Cria urgência com badges e animações
 */
export default function DynamicPricing({
  originalPrice,
  discountedPrice,
  className = "",
  timeout = 30000,
  pageViewThreshold = 3
}: DynamicPricingProps) {
  const [showDiscount, setShowDiscount] = useState(false);
  const [pageViews, setPageViews] = useState(0);
  const { toast } = useToast();

  useEffect(() => {
    // Incrementa a contagem de visualizações de página
    const incrementPageViews = () => {
      setPageViews(prev => {
        const newCount = prev + 1;
        return newCount;
      });
    };

    // Mostra o desconto se o usuário estiver hesitante (muitas visualizações)
    const timer = setTimeout(() => {
      incrementPageViews();
      
      if (pageViews >= pageViewThreshold && !showDiscount) {
        setShowDiscount(true);
        
        // Notifica o usuário sobre o desconto especial
        toast({
          title: "Oferta Especial Desbloqueada!",
          description: `Detectamos seu interesse! Aproveite R$${originalPrice - discountedPrice} de desconto por tempo limitado.`,
          variant: "default",
        });
      }
    }, timeout);

    return () => clearTimeout(timer);
  }, [pageViews, pageViewThreshold, showDiscount, originalPrice, discountedPrice, timeout, toast]);

  if (!showDiscount) {
    return null;
  }

  return (
    <div className={`dynamic-price-container ${className}`}>
      <div className="flex items-center mb-1">
        <span className="old-price text-gray-500 line-through mr-2">
          R${originalPrice}
        </span>
        <span className="new-price text-red-500 font-bold text-lg">
          R${discountedPrice}
        </span>
        <span className="discount-badge bg-red-500 text-white text-xs font-bold px-2 py-1 rounded ml-2 animate-pulse">
          OFERTA ESPECIAL!
        </span>
      </div>
      <div className="expiry-info text-xs text-gray-500">
        Oferta expira em breve
      </div>
    </div>
  );
}
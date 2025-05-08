import React, { useEffect, useState } from 'react';

type PriceAnchoringProps = {
  originalPrice: number;
  currentPrice: number;
  className?: string;
};

/**
 * Componente que exibe o desconto em tempo real com animação pulsante
 * Cria um "gatilho" visual para incentivar a compra
 */
export default function PriceAnchoring({ originalPrice, currentPrice, className = "" }: PriceAnchoringProps) {
  const [discount, setDiscount] = useState(0);
  
  useEffect(() => {
    // Calcula o percentual de desconto
    const discountPercentage = Math.round(((originalPrice - currentPrice) / originalPrice) * 100);
    setDiscount(discountPercentage);
  }, [originalPrice, currentPrice]);
  
  return (
    <div className={`discount-badge flex items-center gap-3 ${className}`}>
      <span className="original-price text-gray-500 line-through">
        R$ {originalPrice.toLocaleString('pt-BR')}
      </span>
      <span className="current-price font-bold">
        R$ {currentPrice.toLocaleString('pt-BR')}
      </span>
      <div className="pulse-animation bg-red-500 text-white text-sm font-medium px-3 py-1 rounded-full">
        ECONOMIZE {discount}%
      </div>
    </div>
  );
}
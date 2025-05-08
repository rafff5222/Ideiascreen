import { useState, useEffect } from 'react';

type AnnualPriceAnchorProps = {
  monthlyPrice: number;
  annualDiscount?: number;  // Porcentagem de desconto no plano anual
  className?: string;
};

/**
 * Componente que destaca a economia ao escolher o plano anual
 * Cria uma âncora de preço que faz o valor mensal parecer mais caro
 */
export default function AnnualPriceAnchor({
  monthlyPrice,
  annualDiscount = 20,  // 20% de desconto por padrão
  className = ""
}: AnnualPriceAnchorProps) {
  const [showBadge, setShowBadge] = useState(false);

  // Cálculos de preço e economia
  const annualPricePerMonth = monthlyPrice * (1 - annualDiscount / 100);
  const annualTotalPrice = Math.round(annualPricePerMonth * 12);
  const annualSavings = Math.round((monthlyPrice * 12) - annualTotalPrice);

  // Mostra o badge de economia após um pequeno delay para chamar atenção
  useEffect(() => {
    const timer = setTimeout(() => {
      setShowBadge(true);
    }, 1500);
    
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className={`economia-anual ${className}`}>
      <div className="flex items-center gap-2 mb-1">
        <p className="text-sm text-gray-600">
          Economize <strong className="text-green-600">R$ {annualSavings}</strong> com o plano anual:
        </p>
        
        {showBadge && (
          <span className="inline-block bg-green-100 text-green-800 text-xs px-2 py-0.5 rounded-full animate-pulse">
            Melhor valor
          </span>
        )}
      </div>
      
      <div className="comparador flex items-center text-sm gap-2">
        <span className="text-gray-500">
          Mensal: R$ {monthlyPrice}/mês
        </span>
        
        <svg 
          xmlns="http://www.w3.org/2000/svg" 
          width="16" 
          height="16" 
          viewBox="0 0 24 24" 
          fill="none" 
          stroke="currentColor" 
          strokeWidth="2" 
          strokeLinecap="round" 
          strokeLinejoin="round" 
          className="text-gray-400"
        >
          <path d="M5 12h14" />
          <path d="m12 5 7 7-7 7" />
        </svg>
        
        <span className="destaque bg-green-500 text-white px-2 py-0.5 rounded font-medium">
          Anual: R$ {annualPricePerMonth.toFixed(0)}/mês
        </span>
      </div>
    </div>
  );
}
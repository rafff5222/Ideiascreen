import React, { useState, useEffect } from 'react';

/**
 * Componente de badges de urgência específico para o plano Premium
 * Cria senso de escassez para aumentar conversões
 */
export default function PremiumUrgencyBadge() {
  const [remainingSpots, setRemainingSpots] = useState(7);
  const [progressWidth, setProgressWidth] = useState(30);

  useEffect(() => {
    // Recupera o valor do localStorage se existir
    const savedSpots = localStorage.getItem('premium-spots');
    if (savedSpots) {
      const spots = parseInt(savedSpots);
      setRemainingSpots(spots);
      // Define a largura da barra de progresso com base nas vagas restantes (de 7 vagas totais)
      setProgressWidth(100 - (spots / 7) * 100);
    } else {
      // Se não existir, define o valor inicial
      localStorage.setItem('premium-spots', '7');
    }

    // Reduz o número de vagas disponíveis a cada 30 segundos (para demonstração)
    // Em produção, seria a cada 5-10 minutos
    const interval = setInterval(() => {
      setRemainingSpots(prevSpots => {
        if (prevSpots <= 1) return 1; // Nunca abaixo de 1
        
        // 40% de chance de reduzir uma vaga
        const reduceSpot = Math.random() < 0.4;
        const newSpots = reduceSpot ? prevSpots - 1 : prevSpots;
        
        // Atualiza o localStorage
        localStorage.setItem('premium-spots', newSpots.toString());
        
        // Atualiza a largura da barra de progresso
        setProgressWidth(100 - (newSpots / 7) * 100);
        
        return newSpots;
      });
    }, 30000);

    return () => clearInterval(interval);
  }, []);

  // Determina se deve mostrar uma mensagem de "última vaga"
  const showLastChance = remainingSpots <= 2;

  return (
    <div className="mt-2">
      <div 
        className="bg-red-50 text-red-600 p-2 rounded-md text-sm font-semibold border border-red-100"
      >
        <div className="flex items-center">
          <span className="mr-1">🔥</span> 
          {showLastChance ? (
            <span className="animate-pulse">ÚLTIMA CHANCE!</span>
          ) : (
            <span>
              Apenas <span id="remaining-spots">{remainingSpots}</span> {remainingSpots === 1 ? 'vaga' : 'vagas'} com 24% OFF!
            </span>
          )}
        </div>
        <div className="w-full h-1 bg-red-100 mt-1.5 rounded-full overflow-hidden">
          <div 
            className="h-full bg-red-500 transition-all duration-700 ease-out"
            style={{ width: `${progressWidth}%` }}
          ></div>
        </div>
      </div>
    </div>
  );
}
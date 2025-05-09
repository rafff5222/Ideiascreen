import React, { useState, useEffect } from 'react';

/**
 * Componente de barra de progresso de oferta - Gatilho de urgência
 * Mostra uma barra de progresso e contador regressivo para gerar senso de urgência
 */
export default function ProgressBarOffer() {
  const [time, setTime] = useState(262); // 4 minutos e 22 segundos
  const [progressWidth, setProgressWidth] = useState(72); // Começa com 72% preenchido
  
  useEffect(() => {
    // Recupera o tempo salvo do sessionStorage (para persistir entre renderizações)
    const savedTime = sessionStorage.getItem('offer-countdown');
    const initialTime = savedTime ? parseInt(savedTime) : 262;
    setTime(initialTime);
    
    // Calcula a porcentagem inicial da barra
    const initialProgress = 72 + (262 - initialTime) / 10;
    setProgressWidth(initialProgress > 100 ? 100 : initialProgress);
    
    // Configura o intervalo para atualizar a cada segundo
    const interval = setInterval(() => {
      setTime(prevTime => {
        const newTime = prevTime > 0 ? prevTime - 1 : 0;
        
        // Salva no sessionStorage
        sessionStorage.setItem('offer-countdown', newTime.toString());
        
        // Atualiza a largura da barra
        const newProgress = 72 + (262 - newTime) / 10;
        setProgressWidth(newProgress > 100 ? 100 : newProgress);
        
        return newTime;
      });
    }, 1000);
    
    return () => clearInterval(interval);
  }, []);
  
  // Formata o tempo para exibição (MM:SS)
  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60);
    const seconds = time % 60;
    return `${minutes}:${seconds < 10 ? '0' + seconds : seconds}`;
  };
  
  return (
    <div className="bg-gradient-to-r from-amber-50 to-amber-100 p-2 border-b border-amber-200">
      <div className="max-w-7xl mx-auto relative">
        <div className="relative h-6 bg-gray-200 rounded-full overflow-hidden">
          <div 
            className="h-full bg-gradient-to-r from-red-500 to-amber-500 rounded-full transition-all duration-1000 ease-linear"
            style={{ width: `${progressWidth}%` }}
          ></div>
        </div>
        <div className="absolute inset-0 flex items-center justify-center text-sm font-medium text-gray-800">
          <span>
            {progressWidth >= 95 ? 
              "ÚLTIMA CHANCE! Oferta quase acabando" : 
              `${Math.round(progressWidth)}% das vagas com desconto já foram preenchidas!`
            }
            {time > 0 ? 
              <span className="ml-2 bg-red-600 text-white px-2 py-0.5 rounded-sm animate-pulse">{formatTime(time)}</span> : 
              <span className="ml-2 bg-red-600 text-white px-2 py-0.5 rounded-sm">EXPIRANDO</span>
            }
          </span>
        </div>
      </div>
    </div>
  );
}
import { useState, useEffect } from 'react';

export default function CountdownSpots() {
  // Estado para controlar a quantidade de vagas restantes
  const [spotsLeft, setSpotsLeft] = useState(8);
  // Capacidade total (fictícia) do programa
  const totalSpots = 100;
  // Porcentagem de vagas preenchidas
  const percentFilled = Math.round(((totalSpots - spotsLeft) / totalSpots) * 100);
  
  useEffect(() => {
    // Verificamos se o usuário já tem um cookie que indica o número de vagas
    // para manter consistência entre carregamentos
    const savedSpots = localStorage.getItem('spotsLeft');
    
    if (savedSpots) {
      setSpotsLeft(parseInt(savedSpots));
    } else {
      // Se não tiver, grava o valor inicial
      localStorage.setItem('spotsLeft', spotsLeft.toString());
    }
    
    // A cada 10-30 segundos, temos uma chance de reduzir o número de vagas
    // para criar a ilusão de outras pessoas comprando
    const interval = setInterval(() => {
      if (Math.random() < 0.3 && spotsLeft > 1) { // 30% de chance
        const newSpotsLeft = spotsLeft - 1;
        setSpotsLeft(newSpotsLeft);
        localStorage.setItem('spotsLeft', newSpotsLeft.toString());
      }
    }, 15000 + Math.random() * 15000); // Intervalo entre 15 e 30 segundos
    
    return () => clearInterval(interval);
  }, [spotsLeft]);
  
  return (
    <div className="urgent-badge mt-2 text-center">
      <div className="flex items-center mb-1">
        <span className="flex-shrink-0 w-2 h-2 bg-red-600 rounded-full mr-2 animate-pulse"></span>
        <span>
          <strong>{percentFilled}% PREENCHIDO</strong> - apenas <strong>{spotsLeft} vagas</strong> restantes!
        </span>
      </div>
      <div className="w-full bg-red-200 rounded-full h-1.5">
        <div 
          className="progress-bar transition-all duration-1000" 
          style={{ width: `${percentFilled}%` }}>
        </div>
      </div>
    </div>
  );
}
import { useEffect, useState } from 'react';

export default function CountdownSpots() {
  const [spots, setSpots] = useState(7);

  useEffect(() => {
    // Recupera o valor atual de spots do localStorage se existir
    const savedSpots = localStorage.getItem('remainingSpots');
    if (savedSpots) {
      setSpots(parseInt(savedSpots));
    } else {
      // Inicializa com o valor padrão
      localStorage.setItem('remainingSpots', spots.toString());
    }

    // Recupera o timestamp da última redução
    const lastReduction = localStorage.getItem('lastSpotReduction');
    const now = new Date().getTime();

    // Se passou mais de 5 minutos desde a última redução e ainda tem spots
    if (lastReduction && spots > 1) {
      const timePassed = now - parseInt(lastReduction);
      const fiveMinutes = 5 * 60 * 1000;
      const reductionsToApply = Math.floor(timePassed / fiveMinutes);
      
      if (reductionsToApply > 0) {
        const newSpots = Math.max(1, spots - reductionsToApply);
        setSpots(newSpots);
        localStorage.setItem('remainingSpots', newSpots.toString());
        localStorage.setItem('lastSpotReduction', now.toString());
      }
    } else if (!lastReduction) {
      // Primeira visita, salva o timestamp atual
      localStorage.setItem('lastSpotReduction', now.toString());
    }

    // Configura o intervalo para reduzir spots a cada 5 minutos
    const interval = setInterval(() => {
      setSpots(prevSpots => {
        if (prevSpots <= 1) return prevSpots; // Não reduz abaixo de 1
        
        const newSpots = prevSpots - 1;
        localStorage.setItem('remainingSpots', newSpots.toString());
        localStorage.setItem('lastSpotReduction', new Date().getTime().toString());
        return newSpots;
      });
    }, 5 * 60 * 1000); // 300000 ms = 5 minutos

    return () => clearInterval(interval);
  }, []);

  return spots;
}
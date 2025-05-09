import React, { useEffect, useState } from 'react';

const ProgressBarOffer = () => {
  const [timeLeft, setTimeLeft] = useState(262); // 4:22 em segundos
  const [progress, setProgress] = useState(72);
  
  useEffect(() => {
    // Recupera do localStorage se existir
    const savedTime = localStorage.getItem('offer-timer');
    const savedProgress = localStorage.getItem('offer-progress');
    
    if (savedTime && savedProgress) {
      setTimeLeft(parseInt(savedTime));
      setProgress(parseFloat(savedProgress));
    } else {
      // Persistência no localStorage
      localStorage.setItem('offer-timer', timeLeft.toString());
      localStorage.setItem('offer-progress', progress.toString());
    }
    
    // Contador regressivo
    const timer = setInterval(() => {
      setTimeLeft(prevTime => {
        const newTime = prevTime > 0 ? prevTime - 1 : 0;
        localStorage.setItem('offer-timer', newTime.toString());
        return newTime;
      });
      
      // Aumenta a barra progressivamente
      setProgress(prevProgress => {
        // Garantir que não ultrapasse 100%
        const newProgress = prevProgress < 99 ? prevProgress + 0.1 : 99;
        localStorage.setItem('offer-progress', newProgress.toString());
        return newProgress;
      });
    }, 1000);
    
    return () => clearInterval(timer);
  }, []);
  
  // Formata o tempo para exibição mm:ss
  const formatTime = (seconds: number): string => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds < 10 ? '0' : ''}${remainingSeconds}`;
  };
  
  return (
    <div className="bg-gradient-to-r from-purple-600 to-indigo-600 text-white py-2 px-4 fixed top-0 left-0 right-0 z-50">
      <div className="max-w-6xl mx-auto relative">
        <div className="relative pt-1 z-10">
          <div className="overflow-hidden h-2 text-xs flex rounded bg-purple-300 bg-opacity-30">
            <div 
              style={{ width: `${progress}%` }} 
              className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-white"
            ></div>
          </div>
        </div>
        <div className="text-center text-sm mt-1 font-medium">
          {progress.toFixed(0)}% das vagas com desconto já foram preenchidas! <span className="bg-white text-purple-700 px-2 py-0.5 rounded-full text-xs font-bold ml-1">{formatTime(timeLeft)}</span>
        </div>
      </div>
    </div>
  );
};

export default ProgressBarOffer;
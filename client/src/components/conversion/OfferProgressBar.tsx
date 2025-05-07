import { useState, useEffect } from 'react';
import { Clock, AlertTriangle } from "lucide-react";

/**
 * Barra de progresso que mostra o avanço de uma oferta e countdown
 * Cria um gatilho FOMO (Fear of Missing Out) para incentivar ação imediata
 */
export default function OfferProgressBar() {
  const [progress, setProgress] = useState(65);
  const [timeLeft, setTimeLeft] = useState(4 * 60 + 32); // 4min e 32s
  const [showAlert, setShowAlert] = useState(false);
  
  // Formata o tempo no formato MM:SS
  const formatTime = (timeInSeconds: number) => {
    const minutes = Math.floor(timeInSeconds / 60);
    const seconds = timeInSeconds % 60;
    return `${minutes}:${seconds < 10 ? '0' + seconds : seconds}`;
  };
  
  useEffect(() => {
    // Inicia o contador regressivo
    const timer = setInterval(() => {
      setTimeLeft(prevTime => {
        if (prevTime <= 1) {
          clearInterval(timer);
          return 0;
        }
        return prevTime - 1;
      });
      
      // Aumenta progressivamente a porcentagem preenchida
      setProgress(prevProgress => {
        // Calcula uma nova porcentagem que aumenta mais rápido
        // quanto menor o tempo restante
        const increment = (100 - prevProgress) / 200;
        
        // Garante que não ultrapasse 95% (para manter sensação de urgência)
        return Math.min(95, prevProgress + increment);
      });
      
      // Quando o tempo estiver acabando, mostra um alerta especial
      if (timeLeft < 60 && !showAlert) {
        setShowAlert(true);
      }
      
    }, 1000);
    
    return () => clearInterval(timer);
  }, [timeLeft, showAlert]);
  
  return (
    <div className="fixed top-0 left-0 right-0 z-50 bg-gradient-to-r from-purple-900 to-purple-700 text-white py-2 px-4 shadow-lg">
      <div className="container mx-auto">
        <div className="flex flex-col sm:flex-row items-center justify-between">
          <div className="flex items-center mb-2 sm:mb-0">
            <Clock className="h-4 w-4 mr-2 animate-pulse" />
            <span className="text-sm font-medium">
              Oferta especial termina em: <span className="font-bold">{formatTime(timeLeft)}</span>
            </span>
          </div>
          
          <div className="flex items-center">
            <span className="text-sm mr-2 whitespace-nowrap">
              <span className="font-bold">{Math.round(progress)}%</span> das vagas já preenchidas
            </span>
            <div className="w-32 sm:w-48 bg-white/20 rounded-full h-2">
              <div 
                className="bg-white rounded-full h-2 transition-all duration-1000 ease-in-out"
                style={{ width: `${progress}%` }}
              ></div>
            </div>
          </div>
        </div>
        
        {/* Alerta para quando o tempo estiver acabando */}
        {showAlert && (
          <div className="mt-1 flex items-center justify-center text-yellow-300 animate-pulse">
            <AlertTriangle className="h-4 w-4 mr-1" />
            <span className="text-xs font-bold">Estamos quase no limite! Aproveite enquanto há vagas!</span>
          </div>
        )}
      </div>
    </div>
  );
}
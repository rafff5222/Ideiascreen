import { useState, useEffect } from 'react';
import { Clock, AlertTriangle } from "lucide-react";

/**
 * Barra de progresso que mostra o avanço de uma oferta e countdown
 * Cria um gatilho FOMO (Fear of Missing Out) para incentivar ação imediata
 */
export default function OfferProgressBar() {
  const [progress, setProgress] = useState(82);
  const [timeLeft, setTimeLeft] = useState(3600); // 1 hora em segundos
  const [isVisible, setIsVisible] = useState(false);
  const [isFloating, setIsFloating] = useState(false);
  
  useEffect(() => {
    // Mostra a barra após um breve atraso
    const showTimer = setTimeout(() => {
      setIsVisible(true);
    }, 3000);
    
    // Faz a barra começar a flutuar após scroll
    const handleScroll = () => {
      if (window.scrollY > 300) {
        setIsFloating(true);
      } else {
        setIsFloating(false);
      }
    };
    
    window.addEventListener('scroll', handleScroll);
    
    // Incrementa o progresso gradualmente para simular outras pessoas comprando
    const progressInterval = setInterval(() => {
      setProgress(prev => {
        // Aumenta o progresso até 94% (mantém uma sensação de urgência, mas ainda com vagas)
        if (prev < 94) {
          return prev + Math.random();
        }
        return prev;
      });
    }, 45000); // A cada 45 segundos
    
    // Contador regressivo
    const countdownInterval = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 0) return 0;
        return prev - 1;
      });
    }, 1000);
    
    return () => {
      clearTimeout(showTimer);
      clearInterval(progressInterval);
      clearInterval(countdownInterval);
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);
  
  // Formata o tempo restante em HH:MM:SS
  const formatTime = (seconds: number): string => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };
  
  if (!isVisible) return null;
  
  return (
    <div className={`${isFloating ? 'floating-bar visible shadow-md' : 'relative'} bg-gradient-to-r from-yellow-50 to-amber-50 border-b border-amber-100 py-3 transition-all duration-300`}>
      <div className="container mx-auto px-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <AlertTriangle size={18} className="text-amber-500" />
            <p className="text-sm font-medium text-amber-900">
              Promoção de lançamento: <span className="font-semibold text-red-600">{Math.floor(progress)}%</span> das vagas preenchidas
            </p>
          </div>
          
          <div className="flex items-center gap-2">
            <Clock size={16} className="text-amber-500" />
            <p className="text-sm font-medium text-amber-900">
              Oferta expira em: <span className="font-semibold">{formatTime(timeLeft)}</span>
            </p>
          </div>
        </div>
        
        <div className="offer-bar mt-2">
          <div className="progress" style={{ width: `${progress}%` }}></div>
        </div>
      </div>
    </div>
  );
}
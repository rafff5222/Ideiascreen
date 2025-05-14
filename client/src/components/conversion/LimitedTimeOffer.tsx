import React, { useState, useEffect } from 'react';
import { X, Clock, Zap } from 'lucide-react';
import { Link } from 'wouter';

export default function LimitedTimeOffer() {
  const [isVisible, setIsVisible] = useState(false);
  const [timeLeft, setTimeLeft] = useState({
    hours: 24,
    minutes: 0,
    seconds: 0
  });
  
  // Função para fechar o banner
  const closeBanner = () => {
    setIsVisible(false);
    localStorage.setItem('offerBannerClosed', 'true');
    localStorage.setItem('offerClosedTime', new Date().toString());
  };
  
  // Verificar se o banner já foi fechado nas últimas 24 horas
  useEffect(() => {
    const closedTime = localStorage.getItem('offerClosedTime');
    const wasClosed = localStorage.getItem('offerBannerClosed');
    
    if (wasClosed && closedTime) {
      const timeDiff = new Date().getTime() - new Date(closedTime).getTime();
      const hoursDiff = timeDiff / (1000 * 60 * 60);
      
      // Se passou menos de 24 horas desde o fechamento, mantenha fechado
      if (hoursDiff < 24) {
        setIsVisible(false);
      } else {
        // Já se passaram mais de 24 horas, mostrar novamente
        localStorage.removeItem('offerBannerClosed');
        localStorage.removeItem('offerClosedTime');
        setIsVisible(true);
      }
    } else {
      // Nunca foi fechado, então mostrar
      setIsVisible(true);
    }
  }, []);
  
  // Atualizar o contador regressivo
  useEffect(() => {
    const interval = setInterval(() => {
      setTimeLeft(prev => {
        let { hours, minutes, seconds } = prev;
        
        if (seconds > 0) {
          seconds--;
        } else {
          seconds = 59;
          if (minutes > 0) {
            minutes--;
          } else {
            minutes = 59;
            if (hours > 0) {
              hours--;
            } else {
              // Tempo esgotado
              clearInterval(interval);
              return { hours: 0, minutes: 0, seconds: 0 };
            }
          }
        }
        
        return { hours, minutes, seconds };
      });
    }, 1000);
    
    return () => clearInterval(interval);
  }, []);
  
  if (!isVisible) return null;
  
  return (
    <div className="fixed top-0 left-0 right-0 bg-gradient-to-r from-amber-500 to-orange-500 text-black z-50 shadow-lg shadow-black/20">
      <div className="container mx-auto px-4 py-3 relative">
        <div className="flex flex-col md:flex-row items-center justify-center">
          <div className="flex items-center mr-0 md:mr-6 mb-2 md:mb-0">
            <Clock className="w-5 h-5 mr-2 animate-pulse" />
            <div className="text-sm font-bold">Oferta expira em:</div>
            <div className="ml-2 font-mono font-bold">
              {String(timeLeft.hours).padStart(2, '0')}:{String(timeLeft.minutes).padStart(2, '0')}:{String(timeLeft.seconds).padStart(2, '0')}
            </div>
          </div>
          
          <div className="text-sm md:text-base font-medium text-center md:text-left mb-2 md:mb-0">
            <span className="font-bold bg-black/10 px-2 py-1 rounded">30% OFF</span> no plano anual com o cupom <span className="font-mono bg-white/20 px-2 py-1 rounded">IDEIAPROMO</span>
          </div>
          
          <Link href="/plans" onClick={(e) => { e.stopPropagation(); }}>
            <button className="ml-4 bg-black text-white px-4 py-1 rounded flex items-center text-sm font-bold transition-all hover:bg-black/80">
              <Zap className="w-4 h-4 mr-1" /> Aproveitar
            </button>
          </Link>
        </div>
        
        <button 
          onClick={closeBanner}
          className="absolute right-2 top-1/2 transform -translate-y-1/2 text-black p-1 rounded-full hover:bg-black/10 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
}
import React, { useState, useEffect } from 'react';

/**
 * Componente de alerta de escassez
 * Exibe um contador de vagas disponíveis que diminui com o tempo
 * para criar senso de urgência para decisão de compra
 */
export default function ScarcityAlert() {
  const [vagas, setVagas] = useState(12);
  const [progressWidth, setProgressWidth] = useState(30);
  
  useEffect(() => {
    // Recupera vagas do localStorage para manter entre sessões
    const savedVagas = localStorage.getItem('vagas-restantes');
    const initialVagas = savedVagas ? parseInt(savedVagas) : 12;
    
    // Se for a primeira visita ou as vagas foram resetadas
    if (!savedVagas || initialVagas <= 0) {
      setVagas(12);
      localStorage.setItem('vagas-restantes', '12');
      setProgressWidth(30);
    } else {
      setVagas(initialVagas);
      setProgressWidth(100 - (initialVagas/12)*100);
    }
    
    // Configura o intervalo para atualizar a cada 30s (demonstração)
    // No site real, seria a cada 3-5 minutos
    const interval = setInterval(() => {
      setVagas(prev => {
        // Diminui em 0 ou 1 vaga
        const decrease = Math.random() > 0.7 ? 1 : 0;
        const newVagas = Math.max(1, prev - decrease); // Nunca abaixo de 1
        
        // Salva no localStorage
        localStorage.setItem('vagas-restantes', newVagas.toString());
        
        // Atualiza a largura da barra de progresso
        setProgressWidth(100 - (newVagas/12)*100);
        
        return newVagas;
      });
    }, 30000);
    
    return () => clearInterval(interval);
  }, []);
  
  // Se as vagas estão acabando (3 ou menos), adiciona uma classe de urgência
  const urgencyClass = vagas <= 3 ? 'bg-red-50 border-red-200 text-red-700' : 'bg-amber-50 border-amber-200 text-amber-700';
  
  return (
    <div className={`rounded-lg p-3 mb-4 ${urgencyClass}`}>
      <p className="text-center font-medium">
        {vagas <= 3 ? 
          <>⚠️ <span className="font-bold text-red-600">ÚLTIMA CHANCE!</span> Apenas <span id="vagas-restantes" className="font-bold">{vagas}</span> {vagas === 1 ? 'vaga' : 'vagas'} com desconto!</> : 
          <>⚠️ Apenas <span id="vagas-restantes" className="font-bold">{vagas}</span> {vagas === 1 ? 'vaga' : 'vagas'} com desconto disponíveis</>
        }
      </p>
      <div className="w-full h-2 bg-gray-200 rounded-full mt-2 overflow-hidden">
        <div 
          className={`h-full rounded-full ${vagas <= 3 ? 'bg-red-500' : 'bg-amber-500'} transition-all duration-1000 ease-out`}
          style={{ width: `${progressWidth}%` }}
        ></div>
      </div>
    </div>
  );
}
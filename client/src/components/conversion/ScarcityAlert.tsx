import React, { useState, useEffect } from 'react';

/**
 * Componente de alerta de escassez
 * Exibe um contador de vagas disponíveis que diminui com o tempo
 * para criar senso de urgência para decisão de compra
 */
export default function ScarcityAlert() {
  const [vagasRestantes, setVagasRestantes] = useState(12);
  const [progresso, setProgresso] = useState(30);
  
  useEffect(() => {
    // Verifica se já existe um valor armazenado para persistência
    const vagasSalvas = localStorage.getItem('vagas-restantes');
    const progressoSalvo = localStorage.getItem('progresso-vagas');
    
    if (vagasSalvas && progressoSalvo) {
      setVagasRestantes(parseInt(vagasSalvas));
      setProgresso(parseInt(progressoSalvo));
    } else {
      // Salva valores iniciais
      localStorage.setItem('vagas-restantes', vagasRestantes.toString());
      localStorage.setItem('progresso-vagas', progresso.toString());
    }
    
    // Atualiza a cada 45 segundos (para demonstração)
    // Em produção seria a cada 3-5 minutos
    const interval = setInterval(() => {
      // 20% de chance de reduzir o número de vagas
      if (Math.random() < 0.2) {
        setVagasRestantes(prev => {
          const novoValor = Math.max(1, prev - 1); // Nunca abaixo de 1
          localStorage.setItem('vagas-restantes', novoValor.toString());
          return novoValor;
        });
        
        // Atualiza a barra de progresso
        setProgresso(prev => {
          const novoProgresso = Math.min(95, 100 - (vagasRestantes / 12) * 100);
          localStorage.setItem('progresso-vagas', novoProgresso.toString());
          return novoProgresso;
        });
      }
    }, 45000);
    
    return () => clearInterval(interval);
  }, [vagasRestantes]);
  
  return (
    <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 mb-8 max-w-lg mx-auto">
      <div className="flex items-center justify-center mb-2">
        <span className="text-amber-600 mr-1">⚠️</span>
        <p className="text-amber-800 font-medium">
          Apenas <span id="vagas-restantes" className="font-bold">{vagasRestantes}</span> vagas com desconto restantes!
        </p>
      </div>
      
      <div className="w-full bg-amber-200 rounded-full h-2.5 mb-1">
        <div 
          className="bg-amber-600 h-2.5 rounded-full transition-all duration-1000 ease-out"
          style={{ width: `${progresso}%` }}
        ></div>
      </div>
      
      <p className="text-xs text-center text-amber-700 mt-1">
        Oferta por tempo limitado. Garanta seu acesso antes que acabe!
      </p>
    </div>
  );
}
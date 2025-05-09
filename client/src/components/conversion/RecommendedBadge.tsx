import React from 'react';

/**
 * Componente que exibe um selo de "Recomendado" com animação de pulso
 * Cria destaque visual para o plano Premium
 */
export default function RecommendedBadge() {
  return (
    <div className="absolute top-[-15px] right-5 z-10">
      <div className="bg-gradient-to-r from-purple-600 to-pink-500 text-white px-3 py-1.5 rounded-full text-xs font-bold flex items-center">
        <span>⚡ MAIS VENDIDO</span>
        <div className="w-2 h-2 bg-white rounded-full ml-2 pulse-animation"></div>
        
        {/* Animação de pulso em CSS */}
        <style>{`
          .pulse-animation {
            animation: pulse 1.5s infinite;
          }
          @keyframes pulse {
            0% { transform: scale(1); opacity: 1; }
            70% { transform: scale(2); opacity: 0.7; }
            100% { transform: scale(1); opacity: 0; }
          }
        `}</style>
      </div>
    </div>
  );
}
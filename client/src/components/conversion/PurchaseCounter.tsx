import React, { useState, useEffect } from 'react';

/**
 * Componente que exibe um contador de compras em tempo real
 * Cria senso de prova social mostrando atividade recente
 */
export default function PurchaseCounter() {
  const [message, setMessage] = useState('✨ Carregando atividade recente...');
  
  useEffect(() => {
    // Função para simular compras (em um ambiente real, usaríamos uma API websocket)
    function updatePurchaseInfo() {
      const cities = [
        'São Paulo', 'Rio de Janeiro', 'Belo Horizonte', 'Curitiba', 
        'Porto Alegre', 'Brasília', 'Salvador', 'Recife', 'Fortaleza'
      ];
      
      const randomCity = cities[Math.floor(Math.random() * cities.length)];
      const purchaseCount = Math.floor(Math.random() * 5) + 1;
      const timeFrame = Math.floor(Math.random() * 15) + 5; // Entre 5 e 20 minutos
      
      setMessage(`✨ ${randomCity} - ${purchaseCount} ${purchaseCount > 1 ? 'compras' : 'compra'} nos últimos ${timeFrame} minutos`);
    }
    
    // Atualiza imediatamente
    updatePurchaseInfo();
    
    // E depois a cada intervalo (entre 30s e 2 minutos em um site real)
    // Usando 10s para fins de demonstração
    const interval = setInterval(() => {
      updatePurchaseInfo();
    }, 10000);
    
    return () => clearInterval(interval);
  }, []);
  
  return (
    <div className="fixed bottom-4 left-4 z-50 max-w-xs">
      <div 
        className="bg-white border border-purple-200 shadow-md rounded-lg px-4 py-2 text-sm animate-pulse"
        style={{
          animationDuration: '3s',
          background: 'linear-gradient(to right, rgba(139, 92, 246, 0.05), rgba(139, 92, 246, 0.1))'
        }}
      >
        {message}
      </div>
    </div>
  );
}
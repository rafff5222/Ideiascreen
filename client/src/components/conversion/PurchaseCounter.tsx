import React, { useEffect, useState } from 'react';

const PurchaseCounter = () => {
  const [purchaseCount, setPurchaseCount] = useState<string | null>(null);
  
  useEffect(() => {
    // Configuração inicial
    const cities = [
      'São Paulo', 'Rio de Janeiro', 'Belo Horizonte', 'Curitiba', 
      'Porto Alegre', 'Recife', 'Salvador', 'Brasília', 'Fortaleza'
    ];
    
    // Gera estatística inicial
    const initialCity = cities[Math.floor(Math.random() * cities.length)];
    const initialCount = Math.floor(Math.random() * 5) + 2; // 2-6 compras
    setPurchaseCount(`${initialCity} - ${initialCount} compras nos últimos 10 minutos`);
    
    // Atualiza a cada 45 segundos (em produção seria a cada 5min)
    const interval = setInterval(() => {
      // 30% de chance de mudar o contador
      if (Math.random() < 0.3) {
        const randomCity = cities[Math.floor(Math.random() * cities.length)];
        const purchaseNumber = Math.floor(Math.random() * 5) + 1; // 1-5 compras
        setPurchaseCount(`${randomCity} - ${purchaseNumber} compras nos últimos 10 minutos`);
      }
    }, 45000);
    
    return () => clearInterval(interval);
  }, []);
  
  if (!purchaseCount) return null;
  
  return (
    <div className="fixed left-4 bottom-4 z-40">
      <div className="bg-gradient-to-r from-purple-50 to-indigo-50 border border-purple-100 rounded-lg shadow-md px-4 py-2 text-sm text-gray-700 max-w-xs animate-pulse">
        <span className="inline-block mr-1">✨</span>
        {purchaseCount}
      </div>
    </div>
  );
};

export default PurchaseCounter;
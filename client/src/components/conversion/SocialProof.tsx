import React, { useEffect, useState } from 'react';

type Purchase = {
  id: number;
  name: string;
  plan: string;
  timeAgo: string;
};

/**
 * Componente que exibe notificações de compras recentes
 * Cria prova social e urgência mostrando que outras pessoas estão comprando
 */
export default function SocialProof() {
  const [purchases, setPurchases] = useState<Purchase[]>([]);
  const [visible, setVisible] = useState(false);
  
  // Nomes brasileiros comuns para simulação de compras
  const names = [
    'Ana', 'Carlos', 'Julia', 'Pedro', 'Mariana', 
    'Lucas', 'Camila', 'Rafael', 'Fernanda', 'Bruno',
    'Larissa', 'Guilherme', 'Beatriz', 'Thiago', 'Gabriela'
  ];
  
  // Planos disponíveis
  const plans = ['Premium', 'Ultimate'];
  
  // Função para gerar uma compra aleatória
  const generateRandomPurchase = (): Purchase => {
    const randomName = names[Math.floor(Math.random() * names.length)];
    const randomPlan = plans[Math.floor(Math.random() * plans.length)];
    const minutes = Math.floor(Math.random() * 10) + 1; // Entre 1 e 10 minutos atrás
    
    return {
      id: Date.now(),
      name: randomName,
      plan: randomPlan,
      timeAgo: `${minutes} minutos`
    };
  };
  
  // Efeito para adicionar novas compras periodicamente
  useEffect(() => {
    // Inicializa com algumas compras
    const initialPurchases = Array(3).fill(null).map(() => generateRandomPurchase());
    setPurchases(initialPurchases);
    
    // Intervalo para adicionar novas compras (entre 1-3 minutos)
    const interval = setInterval(() => {
      const randomPurchase = generateRandomPurchase();
      
      setPurchases(prev => {
        // Mantém apenas as últimas 3 compras
        const updated = [randomPurchase, ...prev.slice(0, 2)];
        return updated;
      });
      
      // Mostra a notificação
      setVisible(true);
      
      // Esconde após 5 segundos
      setTimeout(() => {
        setVisible(false);
      }, 5000);
    }, Math.floor(Math.random() * 120000) + 60000); // Entre 1 e 3 minutos
    
    return () => clearInterval(interval);
  }, []);
  
  return (
    <div className={`fixed bottom-5 left-5 z-50 transition-transform duration-500 ${visible ? 'translate-x-0' : '-translate-x-full'}`}>
      {purchases.length > 0 && (
        <div className="purchase-notification bg-white rounded-lg shadow-lg p-4 max-w-xs">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-primary/20 rounded-full flex items-center justify-center text-primary font-bold">
              {purchases[0].name.charAt(0)}
            </div>
            <div>
              <p className="text-sm font-medium">
                <span className="font-bold">{purchases[0].name}</span> assinou o plano {' '}
                <span className="text-primary font-bold">{purchases[0].plan}</span>
              </p>
              <p className="text-xs text-gray-500">há {purchases[0].timeAgo} 🎉</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
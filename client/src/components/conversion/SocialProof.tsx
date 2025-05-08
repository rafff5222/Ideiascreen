import { useState, useEffect } from 'react';
import { AlertCircle, Users, ShoppingCart } from 'lucide-react';

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
  const [isVisible, setIsVisible] = useState(false);
  const [currentPurchase, setCurrentPurchase] = useState<Purchase | null>(null);
  const [visitorsCount] = useState(Math.floor(Math.random() * 20) + 35); // 35-55 visitantes
  
  // Gera uma compra aleatória para exibição
  const generateRandomPurchase = (): Purchase => {
    const names = [
      "André S.", "Bruno M.", "Carla L.", "Daniela R.", "Eduardo P.", 
      "Fabiana C.", "Gabriel T.", "Helena V.", "Igor M.", "Júlia N.", 
      "Luciana K.", "Marcelo F.", "Natália B.", "Otávio C.", "Paula R.",
      "Ricardo L.", "Sandra M.", "Thiago N.", "Vanessa C.", "Wagner P."
    ];
    
    const plans = ["Básico", "Premium", "Ultimate"];
    const timeAgo = ["agora mesmo", "há 2 min", "há 5 min", "há 12 min", "há 30 min", "há 1 hora"];
    
    return {
      id: Math.floor(Math.random() * 1000),
      name: names[Math.floor(Math.random() * names.length)],
      plan: plans[Math.floor(Math.random() * plans.length)],
      timeAgo: timeAgo[Math.floor(Math.random() * timeAgo.length)]
    };
  };
  
  // Exibe notificações em intervalos aleatórios
  useEffect(() => {
    // Primeira notificação após 10-20 segundos
    const firstTimeout = setTimeout(() => {
      const purchase = generateRandomPurchase();
      setCurrentPurchase(purchase);
      setIsVisible(true);
      
      // Esconde a notificação após 5 segundos
      setTimeout(() => setIsVisible(false), 5000);
    }, Math.random() * 10000 + 10000);
    
    // Configura intervalo para notificações subsequentes
    const interval = setInterval(() => {
      // Mostra apenas se a anterior não estiver visível
      if (!isVisible) {
        const purchase = generateRandomPurchase();
        setCurrentPurchase(purchase);
        setIsVisible(true);
        
        // Esconde após 5 segundos
        setTimeout(() => setIsVisible(false), 5000);
      }
    }, Math.random() * 20000 + 25000); // A cada 25-45 segundos
    
    return () => {
      clearTimeout(firstTimeout);
      clearInterval(interval);
    };
  }, [isVisible]);
  
  // Renderiza notificação de visitantes ativos
  const renderVisitorsNotification = () => {
    return (
      <div className="fixed bottom-5 left-5 bg-white shadow-lg rounded-lg p-3 max-w-xs z-30 flex items-center border border-gray-200 animate-fade-in">
        <div className="bg-blue-100 rounded-full p-2 mr-3">
          <Users size={16} className="text-blue-600" />
        </div>
        <div>
          <p className="text-sm font-medium text-gray-800">
            <span className="font-bold text-blue-600">{visitorsCount}</span> pessoas estão vendo esta página
          </p>
          <p className="text-xs text-gray-500">Nos últimos 15 minutos</p>
        </div>
      </div>
    );
  };
  
  // Se não houver compra ou não estiver visível, retorna null
  if (!isVisible || !currentPurchase) {
    return null;
  }
  
  return (
    <div className="fixed bottom-5 right-5 bg-white shadow-lg rounded-lg p-3 max-w-xs z-30 flex items-center border border-gray-200 animate-slide-in">
      <div className="bg-green-100 rounded-full p-2 mr-3">
        <ShoppingCart size={16} className="text-green-600" />
      </div>
      <div>
        <p className="text-sm font-medium text-gray-800">
          <span className="font-bold">{currentPurchase.name}</span> comprou
        </p>
        <p className="text-xs">
          <span className="font-medium text-green-600">Plano {currentPurchase.plan}</span>
          <span className="text-gray-500"> • {currentPurchase.timeAgo}</span>
        </p>
      </div>
    </div>
  );
}
import { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Target } from "lucide-react";

/**
 * Componente de Checkout Invisível para usuários recorrentes
 * Permite a compra em um clique sem precisar preencher informações novamente
 */
export default function OneClickCheckout() {
  const [isVisible, setIsVisible] = useState(false);
  
  useEffect(() => {
    // Verifica se é um usuário recorrente
    const isReturningUser = localStorage.getItem('isReturningUser');
    
    if (isReturningUser) {
      setIsVisible(true);
    } else {
      // Para fins de demonstração, vamos simular que é um usuário recorrente
      // Em produção, isto seria removido e apenas usuários que realmente fizeram uma compra
      // veriam este componente
      const hasSeenDemo = sessionStorage.getItem('hasSeenDemo');
      
      if (!hasSeenDemo) {
        // Após 60 segundos, simula um usuário recorrente para demonstração
        const timer = setTimeout(() => {
          localStorage.setItem('isReturningUser', 'true');
          setIsVisible(true);
          sessionStorage.setItem('hasSeenDemo', 'true');
        }, 60000);
        
        return () => clearTimeout(timer);
      }
    }
  }, []);
  
  const handlePurchase = () => {
    // Aqui seria a lógica para processar a compra diretamente
    alert('Renovação automática processada com sucesso! Obrigado pela sua compra.');
    
    // Redireciona para uma página de agradecimento
    window.location.href = '/obrigado';
  };
  
  if (!isVisible) {
    return null;
  }
  
  return (
    <div 
      className="fixed bottom-4 right-4 bg-white rounded-lg shadow-xl p-4 border border-gray-200 z-50 max-w-sm animate-slide-up"
    >
      <div className="flex items-center gap-3 mb-2">
        <div className="bg-green-100 p-2 rounded-full">
          <Target className="h-5 w-5 text-green-600" />
        </div>
        <h3 className="font-bold text-lg">Checkout Rápido</h3>
      </div>
      
      <p className="text-gray-600 mb-4 text-sm">
        Vimos que você já é nosso cliente! Renove seu plano sem preencher tudo novamente.
      </p>
      
      <Button 
        className="w-full bg-gradient-to-r from-green-500 to-emerald-600 hover:brightness-110 font-bold"
        onClick={handlePurchase}
      >
        🎯 Renovar automaticamente 
      </Button>
      
      <p className="text-xs text-gray-500 mt-2 text-center">
        Usaremos os mesmos dados do seu último pagamento
      </p>
      
      <button 
        className="absolute top-2 right-2 text-gray-400 hover:text-gray-600"
        onClick={() => setIsVisible(false)}
      >
        ✕
      </button>
    </div>
  );
}
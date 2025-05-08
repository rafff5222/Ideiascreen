import { useState, useEffect } from 'react';
import { useToast } from "@/hooks/use-toast";

/**
 * Componente de Checkout Rápido/One-Click para aumentar conversão
 * Implementa botões para Apple Pay, Google Pay e PIX para reduzir fricção
 */
export default function OneClickCheckout() {
  const [isVisible, setIsVisible] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState<string | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    // Monitora cliques em botões de compra
    const handlePricingClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      const pricingBtn = target.closest('.pricing-btn');
      
      if (pricingBtn) {
        e.preventDefault();
        
        // Pega o plano selecionado através do atributo data-plan
        const planType = pricingBtn.getAttribute('data-plan');
        if (planType) {
          setSelectedPlan(planType);
          setIsVisible(true);
        }
      }
    };

    // Adiciona listener para os botões de preço
    document.addEventListener('click', handlePricingClick);

    return () => {
      document.removeEventListener('click', handlePricingClick);
    };
  }, []);

  const handleClose = () => {
    setIsVisible(false);
  };

  const handlePaymentMethod = (method: string) => {
    // Simula processamento de pagamento
    toast({
      title: `Processando pagamento via ${method}...`,
      description: "Estamos preparando sua conta...",
    });
    
    // Fecha modal após seleção
    setTimeout(() => {
      setIsVisible(false);
      
      // Simula pagamento bem sucedido
      toast({
        title: "Pagamento processado com sucesso!",
        description: "Bem-vindo! Seu acesso já está disponível.",
        variant: "default",
      });
    }, 2000);
  };

  if (!isVisible) return null;

  const getPlanName = () => {
    switch (selectedPlan) {
      case 'premium': return 'Premium';
      case 'pro': return 'Pro';
      case 'ultimate': return 'Ultimate';
      default: return 'Básico';
    }
  };

  const getPlanPrice = () => {
    switch (selectedPlan) {
      case 'premium': return 'R$ 89';
      case 'pro': return 'R$ 119';
      case 'ultimate': return 'R$ 149';
      default: return 'R$ 59';
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/70 z-50">
      <div className="bg-white rounded-xl p-6 shadow-2xl w-full max-w-md">
        <h3 className="text-2xl font-bold mb-4">Checkout Rápido</h3>
        <p className="text-gray-600 mb-6">
          Finalizar compra do plano <span className="font-bold">{getPlanName()}</span> por <span className="text-primary font-bold">{getPlanPrice()}</span> mensal
        </p>
        
        <div className="space-y-3">
          <button
            onClick={() => handlePaymentMethod('Apple Pay')}
            className="w-full py-3 px-4 bg-black text-white rounded-lg font-medium flex items-center justify-center"
          >
            <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24" fill="currentColor">
              <path d="M18.07 13.54C17.93 14.49 17.67 15.43 16.89 16.2C16.28 16.86 15.83 17.14 15.13 17.14C14.43 17.14 14.03 16.8 13.24 16.8C12.47 16.8 11.77 17.14 11.33 17.14C10.38 17.18 9.9 16.8 9.24 16.11C7.99 14.82 7.45 12.3 8.3 10.53C8.79 9.36 9.79 8.61 10.82 8.61C11.65 8.61 12.32 9.06 13.11 9.06C13.9 9.06 14.5 8.61 15.4 8.61C16.21 8.61 17.06 9.19 17.53 10.08C16.14 10.9 16.37 12.87 18.07 13.54M13.69 7.11C13.43 6.17 14.08 5.25 14.5 4.7C15.07 4.05 15.92 3.67 16.56 3.67C16.65 4.67 16.31 5.58 15.81 6.23C15.33 6.87 14.5 7.3 13.69 7.11Z" />
            </svg>
            Pagar com Apple Pay
          </button>
          
          <button
            onClick={() => handlePaymentMethod('Google Pay')}
            className="w-full py-3 px-4 bg-white border border-gray-300 rounded-lg font-medium flex items-center justify-center"
          >
            <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24" fill="#4285F4">
              <path d="M21.35 11.1h-9.17v2.73h6.51c-.33 3.81-3.5 5.44-6.5 5.44C8.36 19.27 5 16.25 5 12c0-4.1 3.2-7.27 7.2-7.27 3.09 0 4.9 1.97 4.9 1.97L19 4.72S16.56 2 12.1 2C6.42 2 2.03 6.8 2.03 12c0 5.05 4.13 10 10.22 10 5.35 0 9.25-3.67 9.25-9.09 0-1.15-.15-1.81-.15-1.81z" />
            </svg>
            Pagar com Google Pay
          </button>
          
          <button
            onClick={() => handlePaymentMethod('PIX')}
            className="w-full py-3 px-4 bg-[#32BCAD] text-white rounded-lg font-medium flex items-center justify-center"
          >
            <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24" fill="currentColor">
              <path d="M9.5 1.5C7.8 2.7 7 4.2 7 6V6.4L5.9 7.5C4.1 9.1 4 9.3 4 12C4 14.7 4.1 14.9 5.9 16.5L7 17.6V18C7 19.9 7.8 21.3 9.5 22.5L10.4 23H13.6L14.5 22.5C16.2 21.3 17 19.9 17 18V17.6L18.1 16.5C19.9 14.9 20 14.7 20 12C20 9.3 19.9 9.1 18.1 7.5L17 6.4V6C17 4.1 16.2 2.7 14.5 1.5L13.6 1H10.4L9.5 1.5M10.7 3.5H13.3C14.9 4.3 15.5 5.1 15.5 6.5V7H13V6C13 5.2 12.8 4.6 12.5 4C12.2 3.4 11.7 3 10.7 3.5M7.2 9H8.5L10.6 11.1L12.7 9H14L11.2 11.9L14 15H12.7L10.6 12.7L8.5 15H7.2L10 11.9L7.2 9Z" />
            </svg>
            Pagar com PIX
          </button>
        </div>
        
        <div className="text-center mt-6">
          <button 
            onClick={handleClose}
            className="text-gray-500 text-sm hover:text-gray-700"
          >
            Voltar
          </button>
        </div>
        
        <div className="mt-6 pt-4 border-t border-gray-200">
          <div className="flex items-center justify-center text-xs text-gray-500">
            <svg className="w-4 h-4 mr-1" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
            </svg>
            <span>Pagamento 100% seguro via SSL</span>
          </div>
        </div>
      </div>
    </div>
  );
}
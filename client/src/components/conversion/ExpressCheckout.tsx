import { useEffect, useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";

/**
 * Componente de Checkout Express em 1 Passo
 * Formulário simplificado para maximizar taxas de conversão
 */
export default function ExpressCheckout() {
  const [isVisible, setIsVisible] = useState(false);
  const [email, setEmail] = useState('');
  const [termsAccepted, setTermsAccepted] = useState(true);
  const [loading, setLoading] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState<string | null>(null);
  
  useEffect(() => {
    // Intercepta cliques em botões de planos
    const interceptPlanButtons = () => {
      const planButtons = document.querySelectorAll('.btn-plan, .plan-cta, .btn-get-plan');
      
      planButtons.forEach(button => {
        // Pula se já foi processado
        if (button.getAttribute('data-express-checkout')) return;
        button.setAttribute('data-express-checkout', 'true');
        
        // Substitui o comportamento padrão
        button.addEventListener('click', (e) => {
          e.preventDefault();
          e.stopPropagation();
          
          // Identifica qual plano foi selecionado
          const planCard = (button as HTMLElement).closest('.plano-card, .pricing-card');
          
          if (planCard) {
            // Determina o tipo de plano
            let planType = 'básico';
            if (planCard.classList.contains('plano-premium') || planCard.textContent?.includes('Premium')) {
              planType = 'premium';
            } else if (planCard.classList.contains('plano-ultimate') || planCard.textContent?.includes('Ultimate')) {
              planType = 'ultimate';
            } else if (planCard.classList.contains('plano-pro') || planCard.textContent?.includes('Pro')) {
              planType = 'pro';
            }
            
            // Salva o plano selecionado
            setSelectedPlan(planType);
            
            // Mostra o checkout express
            showExpressCheckout();
          }
        });
      });
    };
    
    // Tenta interceptar os botões inicialmente e depois a cada 2 segundos
    interceptPlanButtons();
    const interval = setInterval(interceptPlanButtons, 2000);
    
    // Configurar observador para detectar dinamicamente novos botões
    const observer = new MutationObserver((mutations) => {
      for (const mutation of mutations) {
        if (mutation.type === 'childList' && mutation.addedNodes.length > 0) {
          interceptPlanButtons();
        }
      }
    });
    
    observer.observe(document.body, { childList: true, subtree: true });
    
    // Cleanup
    return () => {
      clearInterval(interval);
      observer.disconnect();
    };
  }, []);
  
  // Mostra o checkout express
  const showExpressCheckout = () => {
    setIsVisible(true);
    
    // Registra evento
    console.log('Analytics:', {
      event: 'express_checkout_opened',
      plan: selectedPlan,
      timestamp: new Date().toISOString()
    });
  };
  
  // Fecha o checkout
  const closeCheckout = () => {
    setIsVisible(false);
  };
  
  // Processa o pagamento
  const processPayment = () => {
    // Validação básica
    if (!email || !email.includes('@')) {
      alert('Por favor, insira um e-mail válido');
      return;
    }
    
    if (!termsAccepted) {
      alert('Você precisa aceitar os termos de uso');
      return;
    }
    
    // Inicia o processo de pagamento
    setLoading(true);
    
    // Simula uma integração com Stripe (em produção conectaria com a API real)
    console.log('Iniciando pagamento com Stripe para:', {
      email,
      plan: selectedPlan
    });
    
    // Registra o evento
    console.log('Analytics:', {
      event: 'payment_initiated',
      plan: selectedPlan,
      email_provided: true,
      timestamp: new Date().toISOString()
    });
    
    // Em produção, aqui chamaríamos a API para criar um payment intent
    // e redirecionaríamos para o checkout do Stripe
    
    // Simula redirecionamento para Stripe após 1.5 segundos
    setTimeout(() => {
      window.location.href = `/checkout?plan=${selectedPlan}&email=${encodeURIComponent(email)}`;
    }, 1500);
  };
  
  // Se não estiver visível, não renderiza nada
  if (!isVisible) return null;
  
  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 bg-black/60">
      <div className="checkout-express bg-white rounded-xl shadow-xl max-w-md w-full mx-4 overflow-hidden relative">
        {/* Cabeçalho */}
        <div className="p-6 bg-gradient-to-r from-purple-600 to-pink-500 text-white">
          <h3 className="text-2xl font-bold mb-1">Quase lá!</h3>
          <p className="opacity-90">Preencha para concluir sua assinatura do plano {selectedPlan}</p>
          
          <button 
            className="absolute top-4 right-4 text-white/80 hover:text-white"
            onClick={closeCheckout}
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
          </button>
        </div>
        
        {/* Formulário */}
        <div className="p-6">
          <div className="mb-4">
            <Label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
              Seu email
            </Label>
            <Input
              id="email"
              type="email"
              placeholder="seuemail@exemplo.com"
              className="w-full py-3 px-4"
              autoFocus
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              autoComplete="email"
            />
          </div>
          
          {/* Opções de pagamento */}
          <div className="space-y-3 mb-6">
            <Button 
              className="w-full py-6 flex items-center justify-center space-x-2 bg-purple-600 hover:bg-purple-700"
              onClick={processPayment}
              disabled={loading}
            >
              {loading ? (
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
              ) : (
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-2">
                  <rect x="1" y="4" width="22" height="16" rx="2" ry="2"></rect>
                  <line x1="1" y1="10" x2="23" y2="10"></line>
                </svg>
              )}
              <span>{loading ? 'Processando...' : 'Pagar com Cartão'}</span>
            </Button>
            
            <Button 
              variant="outline"
              className="w-full py-6 flex items-center justify-center space-x-2 bg-white"
              disabled={loading}
            >
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="20" height="20" className="mr-2">
                <rect width="24" height="24" rx="4" fill="#000000"/>
                <path d="M17.0602 12.7142C17.0575 11.9848 17.2715 11.2738 17.6776 10.6685C18.0837 10.0631 18.6655 9.58828 19.3474 9.3C18.9708 8.7434 18.45 8.29629 17.836 7.9998C17.2219 7.7033 16.5347 7.56177 15.8389 7.59116C14.0897 7.45655 12.4949 8.76929 11.601 8.76929C10.6915 8.76929 9.39286 7.6029 7.87093 7.63487C7.0283 7.65676 6.20248 7.86437 5.4647 8.2395C4.72692 8.61463 4.09913 9.1483 3.63978 9.79611C2.09213 12.238 3.22501 15.7956 4.70627 17.7846C5.44685 18.7609 6.30575 19.8596 7.41805 19.8117C8.50445 19.7598 8.93995 19.0772 10.2455 19.0772C11.5356 19.0772 11.9441 19.8117 13.0795 19.7818C14.2559 19.7598 14.9984 18.7828 15.7161 17.7965C16.2572 17.0978 16.6713 16.3064 16.9402 15.4597C16.0879 15.11 15.3963 14.4901 14.9863 13.7116C14.5763 12.9331 14.4733 12.0418 14.6956 11.1975C15.3556 11.1975 16.3704 11.8163 17.0602 12.7142Z" fill="white"/>
                <path d="M14.1113 6.14541C14.7616 5.35556 15.0508 4.33897 14.9058 3.33301C13.9332 3.44044 13.0521 3.93721 12.4519 4.71654C12.1618 5.09314 11.9506 5.52635 11.83 5.9881C11.7094 6.44984 11.6816 6.93105 11.7482 7.40409C12.2372 7.41482 12.7232 7.31456 13.1672 7.11049C13.6113 6.90641 14.0019 6.60401 14.3113 6.22777C14.2547 6.19875 14.2052 6.16087 14.1666 6.11611C14.128 6.07135 14.1008 6.0206 14.0868 5.96612C14.0729 5.91165 14.0724 5.85488 14.0854 5.80025C14.0985 5.74562 14.1249 5.69456 14.1629 5.64935C14.2008 5.60415 14.2497 5.56576 14.3057 5.53664C14.3618 5.50753 14.4239 5.48831 14.4881 5.4801C14.5524 5.47188 14.6172 5.47486 14.6798 5.48887C14.7424 5.50288 14.8012 5.52761 14.8528 5.56161C14.8528 5.75682 14.9303 5.94391 15.0681 6.08163C15.2058 6.21935 15.3929 6.2969 15.5881 6.2969C15.7834 6.2969 15.9705 6.21935 16.1082 6.08163C16.246 5.94391 16.3235 5.75682 16.3235 5.56161C16.3235 5.3664 16.246 5.17931 16.1082 5.04159C15.9705 4.90387 15.7834 4.82632 15.5881 4.82632C15.5317 4.82619 15.4754 4.83299 15.4207 4.84653C15.2472 4.28886 14.9141 3.7966 14.4688 3.43041C14.4688 3.43041 14.1113 4.62748 12.9618 5.00499C12.9618 5.00499 12.7825 5.05673 12.8155 5.20198C12.8155 5.20198 13.4064 5.31042 14.1113 6.14541Z" fill="white"/>
              </svg>
              <span>Pagar com Apple Pay</span>
            </Button>
            
            <Button 
              variant="outline"
              className="w-full py-6 flex items-center justify-center space-x-2 bg-white"
              disabled={loading}
            >
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" width="20" height="20" className="mr-2">
                <rect width="24" height="24" rx="4" fill="#ffffff"/>
                <path d="M346.7 74.3V74c0-15.7-12.7-28.3-28.3-28.3h-240C62.7 45.7 50 58.3 50 74v182.3h296.7V74.3z" fill="#3F4040"/>
                <path d="M305 228H91.7c-8.3 0-15-6.7-15-15v-7.7H320v7.7c0 8.3-6.7 15-15 15z" fill="#00C8FF"/>
                <path d="M346.7 256.3H50V348c0 15.7 12.7 28.3 28.3 28.3h240c15.7 0 28.3-12.7 28.3-28.3v-91.7z" fill="#FFBC00"/>
                <path d="M462 211h-60.3c-27.3 0-49.7 22-49.7 49.7v107c0 27.3 22 49.7 49.7 49.7H462c27.3 0 49.7-22 49.7-49.7v-107c0-27.7-22.3-49.7-49.7-49.7z" fill="#84BD47"/>
                <path d="M462 242.3c-9.7 0-18 3.7-24.7 9.7-6.7-6-15-9.7-24.7-9.7-20 0-36.3 16.3-36.3 36.3s16.3 36.3 36.3 36.3c9.7 0 18-3.7 24.7-9.7 6.7 6 15 9.7 24.7 9.7 20 0 36.3-16.3 36.3-36.3s-16.3-36.3-36.3-36.3z" fill="#FFF"/>
                <path d="M435.7 318.7h52.7c1.7 0 3-1.3 3-3s-1.3-3-3-3h-52.7c-1.7 0-3 1.3-3 3s1.3 3 3 3zm0 18.6h52.7c1.7 0 3-1.3 3-3s-1.3-3-3-3h-52.7c-1.7 0-3 1.3-3 3s1.3 3 3 3zm0 18.7h52.7c1.7 0 3-1.3 3-3s-1.3-3-3-3h-52.7c-1.7 0-3 1.3-3 3s1.3 3 3 3z" fill="#FFF"/>
              </svg>
              <span>Pagar com PIX</span>
            </Button>
          </div>
          
          {/* Termos e condições */}
          <div className="termos flex items-start space-x-2">
            <Checkbox
              id="termos"
              checked={termsAccepted}
              onCheckedChange={(checked) => setTermsAccepted(checked as boolean)}
              className="mt-1"
            />
            <Label htmlFor="termos" className="text-sm text-gray-600">
              Aceito os <a href="/termos" className="text-purple-600 hover:underline" target="_blank" rel="noopener noreferrer">termos de uso</a> e <a href="/privacidade" className="text-purple-600 hover:underline" target="_blank" rel="noopener noreferrer">política de privacidade</a>
            </Label>
          </div>
          
          {/* Extras */}
          <div className="mt-6 pt-4 border-t border-gray-200">
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm text-gray-600">Plano Selecionado:</span>
              <span className="font-medium">{selectedPlan}</span>
            </div>
            
            <div className="flex items-center justify-center mt-4 text-xs text-gray-500 space-x-4">
              <div className="flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-green-500 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
                <span>Pagamento seguro</span>
              </div>
              <div className="flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-green-500 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span>Garantia de 7 dias</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
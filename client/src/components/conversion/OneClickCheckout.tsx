import { useState, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { Check, CreditCard, Zap } from "lucide-react";

/**
 * Componente de Checkout Invisível para usuários recorrentes
 * Permite a compra em um clique sem precisar preencher informações novamente
 */
export default function OneClickCheckout() {
  const [open, setOpen] = useState(false);
  const [hasSeenBefore, setHasSeenBefore] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState<string | null>(null);
  const [processing, setProcessing] = useState(false);
  const { toast } = useToast();
  
  // Verifica se o usuário é recorrente (normalmente seria feito via API)
  useEffect(() => {
    // Simula um cliente retornando ao site
    const checkReturningUser = () => {
      const returningUserInfo = localStorage.getItem('returningUser');
      
      if (returningUserInfo) {
        setHasSeenBefore(true);
      } else {
        // Para simular um usuário de primeira vez agora tornando-se recorrente
        // salvamos a informação para futuras visitas
        localStorage.setItem('returningUser', JSON.stringify({
          lastVisit: new Date().toISOString(),
          hasCompletedPurchase: false
        }));
      }
    };
    
    checkReturningUser();
  }, []);
  
  // Detecta cliques em botões de compra e oferece checkout rápido para usuários recorrentes
  useEffect(() => {
    if (!hasSeenBefore) return;
    
    const handlePricingClick = (e: MouseEvent) => {
      // Busca pelo elemento mais próximo que seja um botão de plano
      const targetElement = e.target as HTMLElement;
      const button = targetElement.closest('.pricing-btn');
      
      if (button) {
        // Previne o comportamento padrão
        e.preventDefault();
        
        // Identifica o plano selecionado
        const plan = button.getAttribute('data-plan');
        if (plan) {
          setSelectedPlan(plan);
          setOpen(true);
        }
      }
    };
    
    // Adiciona o listener a toda a seção de preços
    const pricingSection = document.getElementById('planos');
    if (pricingSection) {
      pricingSection.addEventListener('click', handlePricingClick, true);
    }
    
    return () => {
      if (pricingSection) {
        pricingSection.removeEventListener('click', handlePricingClick, true);
      }
    };
  }, [hasSeenBefore]);
  
  const handleOneClickPurchase = () => {
    setProcessing(true);
    
    // Simula o processamento do pagamento
    setTimeout(() => {
      setProcessing(false);
      setOpen(false);
      
      toast({
        title: "Compra concluída com sucesso!",
        description: `Seu plano ${selectedPlan} foi ativado instantaneamente.`,
        variant: "default",
      });
      
      // Redireciona para a página de agradecimento
      window.location.href = '/obrigado';
    }, 1500);
  };
  
  if (!hasSeenBefore) return null;
  
  const planInfo = {
    basico: {
      nome: "Básico",
      preco: "R$ 59/mês",
      descricao: "Até 30 gerações por mês"
    },
    premium: {
      nome: "Premium",
      preco: "R$ 89/mês",
      descricao: "Até 100 gerações + montagem automática"
    },
    ultimate: {
      nome: "Ultimate",
      preco: "R$ 149/mês",
      descricao: "Recursos profissionais + efeitos cinemáticos"
    }
  };
  
  const plano = selectedPlan ? planInfo[selectedPlan as keyof typeof planInfo] : null;
  
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="max-w-md mx-auto">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold flex items-center gap-2">
            <Zap className="text-yellow-500" size={24} />
            Checkout Express
          </DialogTitle>
          <DialogDescription>
            Concluir compra usando os dados salvos
          </DialogDescription>
        </DialogHeader>
        
        <div className="py-4">
          {plano && (
            <div className="bg-gray-50 rounded-lg p-4 mb-4">
              <h3 className="font-bold text-lg">{plano.nome}</h3>
              <p className="text-xl font-bold text-primary mb-1">{plano.preco}</p>
              <p className="text-gray-600 text-sm">{plano.descricao}</p>
            </div>
          )}
          
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <Check size={18} className="text-green-500" />
              <span className="text-sm">Cartão terminado em 4582</span>
            </div>
            
            <div className="flex items-center gap-2">
              <Check size={18} className="text-green-500" />
              <span className="text-sm">Acesso instantâneo, sem formulários</span>
            </div>
            
            <div className="flex items-center gap-2">
              <Check size={18} className="text-green-500" />
              <span className="text-sm">Cancele quando quiser, sem burocracia</span>
            </div>
          </div>
        </div>
        
        <DialogFooter className="flex gap-3">
          <Button 
            variant="outline" 
            onClick={() => setOpen(false)}
          >
            Checkout padrão
          </Button>
          
          <Button 
            onClick={handleOneClickPurchase}
            className="bg-gradient-to-r from-primary to-purple-600 hover:brightness-110"
            disabled={processing}
          >
            {processing ? (
              <span className="flex items-center gap-2">
                <div className="animate-spin w-4 h-4 border-2 border-white border-t-transparent rounded-full" />
                Processando...
              </span>
            ) : (
              <span className="flex items-center gap-2">
                <CreditCard size={18} />
                Comprar em 1-clique
              </span>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
import { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { useQuery } from '@tanstack/react-query';
import { useLocation } from 'wouter';
import { useSubscription } from '@/contexts/SubscriptionContext';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import "./plans-new.css";

interface PlanFeature {
  name: string;
  included: boolean;
}

interface Plan {
  id: string;
  name: string;
  price: number;
  monthlyPrice?: number;
  description: string;
  features: PlanFeature[];
  popular?: boolean;
  requestLimit: number;
  exportFormats: string[];
  badge?: string;
}

interface PricingData {
  plans: Plan[];
  currency: string;
  vatIncluded: boolean;
}

export default function PlansNewPage() {
  const { toast } = useToast();
  const [, setLocation] = useLocation();
  const { user, updateUser } = useSubscription();
  
  // Estados para diálogo de confirmação
  const [showDialog, setShowDialog] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState<Plan | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  
  // Também precisamos do modal de upgrade para planos pagos
  const [showUpgradeModal, setShowUpgradeModal] = useState(false);

  // Buscar dados de planos da API
  const { data: plansData } = useQuery<PricingData>({
    queryKey: ['/api/pricing-data'],
  });

  // Planos padrão (fallback se a API falhar)
  const defaultPlans = [
    {
      id: 'free',
      name: 'Grátis',
      price: 0,
      description: 'Para testadores e estudantes',
      requestLimit: 3,
      exportFormats: ['txt'],
      features: [
        { name: 'Geração básica de roteiros', included: true },
        { name: '3 roteiros por mês', included: true },
        { name: 'Exportação em TXT', included: true },
        { name: 'Salvar roteiros localmente', included: true },
        { name: 'Personalização básica', included: true },
        { name: 'Modos criativos', included: false },
        { name: 'Exportação profissional (PDF/FDX)', included: false },
        { name: 'Análise de roteiro com IA', included: false },
      ]
    },
    {
      id: 'starter',
      name: 'Iniciante',
      price: 2790,
      description: 'Para autores independentes',
      popular: true,
      badge: 'MAIS POPULAR',
      requestLimit: 30,
      exportFormats: ['txt', 'pdf'],
      features: [
        { name: 'Geração avançada de roteiros', included: true },
        { name: '30 roteiros por mês', included: true },
        { name: 'Exportação em TXT e PDF', included: true },
        { name: 'Salvar roteiros localmente', included: true },
        { name: 'Personalização avançada', included: true },
        { name: 'Modos criativos', included: false },
        { name: 'Exportação profissional (FDX)', included: false },
        { name: 'Análise de roteiro com IA', included: true },
      ]
    },
    {
      id: 'pro',
      name: 'Profissional',
      price: 7990,
      description: 'Para roteiristas freelancers',
      badge: 'DESCONTO DE 25%',
      requestLimit: Infinity,
      exportFormats: ['txt', 'pdf', 'fdx'],
      features: [
        { name: 'Geração avançada de roteiros', included: true },
        { name: 'Roteiros ilimitados', included: true },
        { name: 'Exportação em TXT, PDF e FDX', included: true },
        { name: 'Salvar roteiros localmente', included: true },
        { name: 'Personalização avançada', included: true },
        { name: 'Modos criativos especiais', included: true },
        { name: 'Exportação profissional (FDX)', included: true },
        { name: 'Análise de roteiro com IA', included: true },
      ]
    }
  ];

  // Usar os planos da API ou fallback para os planos padrão
  const plans = plansData?.plans || defaultPlans;

  // Manipula o clique em um plano
  const handlePlanSelect = (planId: string) => {
    if (planId === 'free') {
      // Se o plano for gratuito, atualiza o usuário diretamente
      updateUser({ plan: planId });
      toast({
        title: "Plano Gratuito Selecionado",
        description: "Você está usando o plano gratuito com 3 roteiros por mês.",
      });
    } else {
      // Se for plano pago, mostra o modal
      const plan = plans.find(p => p.id === planId);
      setSelectedPlan(plan || null);
      setShowDialog(true);
    }
  };

  // Confirma a mudança de plano
  const confirmPlanChange = async () => {
    if (!selectedPlan) return;
    
    setIsLoading(true);
    
    try {
      // Normalmente aqui teria integração com sistema de pagamento
      // Como é uma simulação, apenas atualizamos o plano do usuário
      
      await new Promise(resolve => setTimeout(resolve, 1000)); // Simular delay
      
      updateUser({ plan: selectedPlan.id });
      
      toast({
        title: "Plano Atualizado",
        description: `Você agora está no plano ${selectedPlan.name}. Aproveite!`,
      });
      
      setShowDialog(false);
    } catch (error) {
      toast({
        title: "Erro ao atualizar plano",
        description: "Ocorreu um erro ao tentar atualizar seu plano. Tente novamente.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div>
      <Helmet>
        <title>IdeiaScreen - Escolha seu plano</title>
        <meta 
          name="description" 
          content="Escolha o plano ideal para suas necessidades de criação de roteiros com IA."
        />
      </Helmet>

      <div className="bg-gradient-to-b from-gray-900 to-gray-800 min-h-screen">
        <div className="container mx-auto px-4 py-16">
          <div className="header">
            <h1>Gerador de Roteiros</h1>
            <p>Crie roteiros incríveis com inteligência artificial.</p>
          </div>

          <div className="plans-section">
            {/* Plano Grátis */}
            <div className="plan-column" style={{backgroundColor: '#282c34', color: 'white'}}>
              <h2>Grátis</h2>
              <p><strong>R$ 0,00 /mês</strong></p>
              <p>Para testadores e estudantes</p>
              <ul>
                <li>✅ 3 roteiros/mês</li>
                <li>✅ 5 gêneros básicos</li>
                <li>✅ Exportação em TXT</li>
                <li>❌ Análise avançada com IA</li>
                <li>❌ Exportação .FDX</li>
              </ul>
              {user.plan === 'free' ? (
                <button className="btn btn-secondary">Plano Atual</button>
              ) : (
                <button className="btn btn-secondary" onClick={() => handlePlanSelect('free')}>Mudar para Grátis</button>
              )}
            </div>

            {/* Plano Iniciante */}
            <div className="plan-column" style={{backgroundColor: '#282c34', color: 'white'}}>
              <h2>Iniciante</h2>
              <p><strong>R$ 27,90 /mês</strong></p>
              <p>ou <strong>R$ 268,80/ano</strong> (<strong>≈ R$ 22,40/mês</strong>)</p>
              <p><span style={{backgroundColor: '#FFC107', color: 'black', padding: '5px', borderRadius: '5px'}}>MAIS POPULAR</span></p>
              <p>Para autores independentes</p>
              <ul>
                <li>✅ 30 roteiros/mês</li>
                <li>✅ Todos os gêneros</li>
                <li>✅ Exportação em PDF</li>
                <li>✅ Análise básica de roteiro</li>
                <li>❌ Modos criativos</li>
              </ul>
              {user.plan === 'starter' ? (
                <button className="btn btn-secondary">Plano Atual</button>
              ) : (
                <button className="btn btn-primary" onClick={() => handlePlanSelect('starter')}>Assinar Agora</button>
              )}
            </div>

            {/* Plano Profissional */}
            <div className="plan-column" style={{backgroundColor: '#282c34', color: 'white'}}>
              <h2>Profissional</h2>
              <p><strong>R$ 79,90 /mês</strong></p>
              <p>ou <strong>R$ 767,00/ano</strong> (<strong>≈ R$ 63,90/mês</strong>)</p>
              <p><span style={{backgroundColor: '#FFC107', color: 'black', padding: '5px', borderRadius: '5px'}}>DESCONTO DE 25%</span></p>
              <p>Para roteiristas freelancers</p>
              <ul>
                <li>✅ Roteiros ilimitados</li>
                <li>✅ Combinações de gêneros</li>
                <li>✅ Exportação em TXT, PDF, FDX</li>
                <li>✅ Análise avançada com IA</li>
                <li>✅ Modos criativos</li>
              </ul>
              {user.plan === 'pro' ? (
                <button className="btn btn-secondary">Plano Atual</button>
              ) : (
                <button className="btn btn-primary" onClick={() => handlePlanSelect('pro')}>Assinar Agora</button>
              )}
            </div>
          </div>
          
          <div className="text-center text-sm text-gray-400 mt-12">
            <p>Todos os planos incluem acesso ao gerador de roteiros, atualizações regulares e suporte por email.</p>
            <p className="mt-2">Dúvidas? Entre em contato conosco: suporte@ideiascreen.com</p>
          </div>
        </div>
      </div>
      
      {showDialog && (
        <Dialog open={showDialog} onOpenChange={setShowDialog}>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>Confirmar Assinatura</DialogTitle>
              <DialogDescription>
                Você está prestes a assinar o plano {selectedPlan?.name}. Sua conta será modificada imediatamente.
              </DialogDescription>
            </DialogHeader>
            <div className="flex flex-col gap-4 py-4">
              <div className="flex justify-between items-center">
                <div className="font-medium">Plano</div>
                <div>{selectedPlan?.name}</div>
              </div>
              <div className="flex justify-between items-center">
                <div className="font-medium">Preço</div>
                <div>
                  {selectedPlan && new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(selectedPlan.price / 100)}/mês
                </div>
              </div>
              <div className="flex justify-between items-center">
                <div className="font-medium">Roteiros</div>
                <div>
                  {selectedPlan?.id === 'free' ? '3 por mês' : 
                   selectedPlan?.id === 'starter' ? '30 por mês' : 
                   'Ilimitados'}
                </div>
              </div>
            </div>
            <DialogFooter>
              <Button variant="ghost" onClick={() => setShowDialog(false)}>
                Cancelar
              </Button>
              <Button onClick={confirmPlanChange} className="bg-primary hover:bg-primary/90">
                {isLoading ? "Processando..." : "Confirmar"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}
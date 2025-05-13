import { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { useQuery } from '@tanstack/react-query';
import { useLocation } from 'wouter';
import { useSubscription } from '@/contexts/SubscriptionContext';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import "./plans-table.css";

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

export default function PlansTablePage() {
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
      badge: 'MAIS POPULAR',
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
    },
    {
      id: 'studio',
      name: 'Estúdio',
      price: 24990,
      description: 'Para agências e estúdios',
      badge: '',
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
        { name: 'Acesso para 5 usuários', included: true },
        { name: 'Suporte prioritário', included: true },
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
  
  // Formatação de preço para reais
  const formatPrice = (priceInCents: number) => {
    return new Intl.NumberFormat('pt-BR', { 
      style: 'currency', 
      currency: 'BRL' 
    }).format(priceInCents / 100);
  };

  return (
    <div>
      <Helmet>
        <title>PLOTMACHINE - Planos e Preços</title>
        <meta 
          name="description" 
          content="Escolha o plano ideal para suas necessidades de criação de roteiros com IA."
        />
      </Helmet>

      <div className="bg-gradient-to-b from-gray-900 to-gray-800 min-h-screen">
        <div className="container mx-auto px-4 py-16">
          <section className="pricing-section">
            <div className="pricing-header">
              <h2>Planos e Preços</h2>
              <p>Escolha o plano ideal para seu projeto criativo</p>
            </div>

            <table className="pricing-table">
              <thead>
                <tr>
                  <th>Plano</th>
                  <th>Mensal</th>
                  <th>Anual</th>
                  <th>Economia</th>
                  <th>Destaques</th>
                  <th>Público-Alvo</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td><strong>Grátis</strong></td>
                  <td>R$ 0</td>
                  <td>-</td>
                  <td>-</td>
                  <td>
                    ✓ <span className="feature-highlight">3 roteiros/mês</span><br />
                    ✓ <span className="feature-highlight">5 gêneros básicos</span><br />
                    ✓ <span className="feature-highlight">Exportação rápida em TXT</span>
                  </td>
                  <td>Testadores, estudantes</td>
                </tr>
                <tr className="popular">
                  <td><strong>Iniciante</strong><br /><small>🚀 Mais Popular</small></td>
                  <td>R$ 27,90/mês</td>
                  <td><strong>R$ 268,80/ano</strong><br />(≈R$22,40/mês)</td>
                  <td><span className="savings-badge">Economize 24%</span></td>
                  <td>
                    ✓ <span className="feature-highlight">30 roteiros/mês</span><br />
                    ✓ <span className="feature-highlight">Acesso a todos os 37+ gêneros</span><br />
                    ✓ <span className="feature-highlight">Exportação profissional em PDF</span>
                  </td>
                  <td>Autores independentes, pequenos projetos</td>
                </tr>
                <tr>
                  <td><strong>Profissional</strong><br /><small>🎯 Recomendado</small></td>
                  <td>R$ 79,90/mês</td>
                  <td><strong>R$ 767,00/ano</strong><br />(≈R$63,90/mês)</td>
                  <td><span className="savings-badge">Economize R$ 192/ano</span></td>
                  <td>
                    ✓ <span className="feature-highlight">Roteiros ilimitados</span><br />
                    ✓ <span className="feature-highlight">Exportação em formato .FDX profissional</span><br />
                    ✓ <span className="feature-highlight">Análise avançada de estrutura narrativa</span>
                  </td>
                  <td>Freelancers, roteiristas profissionais</td>
                </tr>
                <tr>
                  <td><strong>Estúdio</strong></td>
                  <td>R$ 249,90/mês</td>
                  <td><strong>R$ 2.399,00/ano</strong><br />(≈R$199,90/mês)</td>
                  <td><span className="savings-badge">Economize R$ 600/ano</span></td>
                  <td>
                    ✓ <span className="feature-highlight">Acesso para 5 usuários simultâneos</span><br />
                    ✓ <span className="feature-highlight">Suporte prioritário 24/7</span><br />
                    ✓ <span className="feature-highlight">Funcionalidades exclusivas para equipes</span>
                  </td>
                  <td>Agências, produtoras de conteúdo</td>
                </tr>
              </tbody>
            </table>
            
            <div className="pricing-cta">
              {user.plan === 'free' ? (
                <button className="btn-pricing" onClick={() => handlePlanSelect('starter')}>
                  Fazer Upgrade Agora
                </button>
              ) : (
                <button className="btn-pricing" onClick={() => setLocation('/roteiros')}>
                  Voltar para Roteiros
                </button>
              )}
            </div>
          </section>
          
          <div className="text-center text-sm text-gray-400 mt-12">
            <p>Todos os planos incluem acesso ao gerador de roteiros, atualizações regulares e suporte por email.</p>
            <p className="mt-2">Dúvidas? Entre em contato conosco: suporte@plotmachine.com</p>
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
                  {selectedPlan && formatPrice(selectedPlan.price)}/mês
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
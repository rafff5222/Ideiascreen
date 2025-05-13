import { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Check, AlertCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useQuery } from '@tanstack/react-query';
import { useLocation } from 'wouter';
import { useSubscription } from '@/contexts/SubscriptionContext';
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

export default function PlansPage() {
  const [selectedPlan, setSelectedPlan] = useState<string | null>(null);
  const [showUpgradeModal, setShowUpgradeModal] = useState(false);
  const { toast } = useToast();
  const [, navigate] = useLocation();
  
  // Recupera os dados de planos da API
  const { data: plansData, isLoading, error } = useQuery<PricingData>({
    queryKey: ['/api/pricing-data'],
    refetchOnWindowFocus: false,
  });

  // Usar o contexto de assinatura para acessar e modificar os dados do usuário
  const { user, updateUser, getRemainingRequests } = useSubscription();

  // Planos disponíveis (cairia para este fallback apenas se a API falhar)
  const defaultPlans: Plan[] = [
    {
      id: 'free',
      name: 'Gratuito',
      price: 0,
      description: 'Para criadores iniciantes',
      badge: '',
      requestLimit: 3,
      exportFormats: ['txt'],
      features: [
        { name: 'Geração básica de roteiros', included: true },
        { name: 'Até 3 roteiros por mês', included: true },
        { name: 'Exportação em TXT', included: true },
        { name: 'Salvar roteiros localmente', included: true },
        { name: 'Personalização avançada', included: false },
        { name: 'Modos criativos especiais', included: false },
        { name: 'Exportação profissional (PDF, FDX)', included: false },
        { name: 'Análise de roteiro com IA', included: false },
      ]
    },
    {
      id: 'starter',
      name: 'Iniciante',
      price: 27.9,
      description: 'Para criadores regulares',
      popular: true,
      badge: 'Mais Popular',
      requestLimit: 30,
      exportFormats: ['txt', 'pdf'],
      features: [
        { name: 'Geração avançada de roteiros', included: true },
        { name: 'Até 30 roteiros por mês', included: true },
        { name: 'Exportação em TXT e PDF', included: true },
        { name: 'Salvar roteiros localmente', included: true },
        { name: 'Personalização avançada', included: true },
        { name: 'Modos criativos especiais', included: true },
        { name: 'Exportação profissional (FDX)', included: false },
        { name: 'Análise de roteiro com IA', included: false },
      ]
    },
    {
      id: 'pro',
      name: 'Profissional',
      price: 79.9,
      monthlyPrice: 99.9,
      description: 'Para criadores profissionais',
      badge: 'Desconto de 20%',
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

  // Atualiza o plano selecionado com base no plano do usuário atual
  useEffect(() => {
    setSelectedPlan(user.plan);
  }, [user]);

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
      setSelectedPlan(planId);
      setShowUpgradeModal(true);
    }
  };

  // Para o modal de upgrade
  const closeModal = () => {
    setShowUpgradeModal(false);
  };

  // Manipula a tentativa de upgrade
  const handleUpgradeAttempt = () => {
    toast({
      title: "Em breve!",
      description: "Estamos finalizando o sistema de pagamentos. Envie um e-mail para contato@plotmachine.com para acesso antecipado.",
    });
    closeModal();
  };

  // Formato para preço
  const formatPrice = (price: number) => {
    return price.toLocaleString('pt-BR', {
      style: 'currency',
      currency: 'BRL',
      minimumFractionDigits: 2
    });
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-amber-500"></div>
      </div>
    );
  }

  return (
    <>
      <Helmet>
        <title>Planos e Preços | PLOTMACHINE</title>
        <meta name="description" content="Escolha o plano ideal para suas necessidades de criação de roteiros com PLOTMACHINE. Opções gratuitas e premium disponíveis." />
      </Helmet>

      <div className="bg-gradient-to-b from-gray-900 to-gray-800 min-h-screen">
        <div className="container mx-auto px-4 py-16">
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-black text-white mb-2">
              PLOTMACHINE
            </h1>
            <h2 className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-amber-400 to-amber-600 bg-clip-text text-transparent mb-4">
              Planos e Preços
            </h2>
            <p className="text-lg text-gray-300 max-w-2xl mx-auto mb-6">
              Escolha o plano ideal para suas necessidades de criação de roteiros
            </p>
            
            {user.plan !== 'free' ? (
              <div className="mt-4 inline-block bg-amber-500/10 text-amber-400 px-4 py-2 rounded-full text-sm">
                <span className="font-medium">Seu plano atual: </span> 
                {plans.find((p: Plan) => p.id === user.plan)?.name || 'Gratuito'}
              </div>
            ) : (
              <div className="mt-4 inline-block bg-blue-500/10 text-blue-400 px-4 py-2 rounded-full text-sm">
                <span className="font-medium">Roteiros restantes: </span> 
                {getRemainingRequests()} de {plans.find((p: Plan) => p.id === 'free')?.requestLimit || 3}
              </div>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {plans.map((plan: Plan) => (
              <div 
                key={plan.id}
                className={`plan-card relative rounded-xl overflow-hidden ${
                  plan.popular ? 'highlight border-2 border-amber-500 shadow-lg shadow-amber-500/20' : 
                  plan.id === 'free' ? 'free border border-gray-700' : 
                  'professional border border-amber-500'
                } bg-gray-800 transition-all hover:translate-y-[-4px]`}
              >
                {plan.badge && (
                  <div className="badge absolute top-0 right-5 bg-amber-500 text-white py-1 px-3 text-xs uppercase font-semibold rounded-b-md">
                    {plan.badge}
                  </div>
                )}
                
                <div className="p-6">
                  <h3 className="text-xl font-bold text-white mb-1">{plan.name}</h3>
                  <p className="subtitle text-sm text-gray-400 mb-4">
                    {plan.id === 'free' ? 'Para testadores e estudantes' : 
                     plan.id === 'starter' ? 'Para autores independentes' : 
                     'Para roteiristas freelancers'}
                  </p>
                  
                  <div className="price text-2xl font-bold text-white mb-3">
                    {formatPrice(plan.price)}<span className="text-sm font-normal text-gray-400">/mês</span>
                    
                    {plan.id !== 'free' && (
                      <div className="annual text-sm text-gray-400 mt-1">
                        ou {formatPrice(plan.price * 9.6)}/ano <span className="text-green-500">(24% off)</span>
                      </div>
                    )}
                  </div>
                  
                  {plan.monthlyPrice && (
                    <div className="discount text-sm text-green-500 font-medium mb-4">
                      Economize {formatPrice(plan.monthlyPrice - plan.price)}
                    </div>
                  )}
                  
                  <ul className="features space-y-3 mb-6">
                    <li className="included flex items-start">
                      <span className="text-green-500 mr-2">✓</span>
                      <span>{plan.id === 'free' ? '3 roteiros/mês' : 
                             plan.id === 'starter' ? '30 roteiros/mês' :
                             'Roteiros ilimitados'}</span>
                    </li>
                    
                    <li className={plan.id === 'free' ? 'included' : 'included'}>
                      <span className="text-green-500 mr-2">✓</span>
                      <span>{plan.id === 'free' ? '5 gêneros básicos' : 
                             plan.id === 'starter' ? 'Todos os gêneros (37+)' :
                             'Combinações de gêneros'}</span>
                    </li>
                    
                    <li className="included">
                      <span className="text-green-500 mr-2">✓</span>
                      <span>Exportação em {
                        plan.id === 'free' ? 'TXT' : 
                        plan.id === 'starter' ? 'TXT, PDF' :
                        'TXT, PDF, FDX'
                      }</span>
                    </li>
                    
                    <li className={plan.id === 'free' ? 'excluded' : 'included'}>
                      <span className={plan.id === 'free' ? 'text-red-500 mr-2' : 'text-green-500 mr-2'}>
                        {plan.id === 'free' ? '×' : '✓'}
                      </span>
                      <span>{plan.id === 'starter' ? 'Análise básica de roteiro' : 'Análise avançada com IA'}</span>
                    </li>
                    
                    {plan.id === 'pro' && (
                      <li className="included">
                        <span className="text-green-500 mr-2">✓</span>
                        <span>Modos criativos especiais</span>
                      </li>
                    )}
                    
                    <li className={plan.id === 'free' || plan.id === 'starter' ? 'excluded' : 'included'}>
                      <span className={plan.id === 'free' || plan.id === 'starter' ? 'text-red-500 mr-2' : 'text-green-500 mr-2'}>
                        {plan.id === 'free' || plan.id === 'starter' ? '×' : '✓'}
                      </span>
                      <span>Exportação .FDX</span>
                    </li>
                  </ul>
                  
                  <Button
                    className={`w-full ${
                      plan.id === user.plan 
                        ? 'bg-gray-700 hover:bg-gray-700' 
                        : plan.popular 
                          ? 'bg-amber-500 hover:bg-amber-600' 
                          : plan.id === 'free' 
                            ? 'bg-blue-600 hover:bg-blue-700' 
                            : 'bg-amber-500 hover:bg-amber-600'
                    } text-white py-3 rounded-lg font-medium text-center`}
                    onClick={() => handlePlanSelect(plan.id)}
                    disabled={plan.id === user.plan}
                  >
                    {plan.id === user.plan 
                      ? 'Plano Atual' 
                      : plan.id === 'free' 
                        ? 'Selecionar' 
                        : 'Assinar Agora'}
                  </Button>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-16 text-center text-gray-400 max-w-2xl mx-auto">
            <h3 className="text-xl font-bold text-white mb-4">
              Perguntas Frequentes
            </h3>
            <div className="space-y-6 text-left">
              <div>
                <h4 className="font-semibold text-white">Como funcionam os limites de roteiros?</h4>
                <p>Cada plano tem um limite mensal de roteiros que você pode gerar. O plano gratuito permite até 3 roteiros por mês, o plano Iniciante até 30, e o plano Profissional oferece geração ilimitada.</p>
              </div>
              <div>
                <h4 className="font-semibold text-white">Posso cancelar minha assinatura a qualquer momento?</h4>
                <p>Sim, você pode cancelar sua assinatura quando quiser. Você continuará com acesso ao plano atual até o final do período pago.</p>
              </div>
              <div>
                <h4 className="font-semibold text-white">Quais são os formatos de exportação disponíveis?</h4>
                <p>O plano Gratuito permite exportar em TXT, o plano Iniciante adiciona exportação em PDF, e o plano Profissional inclui o formato FDX para software profissional de roteirização.</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Modal de upgrade */}
      {showUpgradeModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-gray-800 rounded-lg p-6 max-w-md w-full">
            <h3 className="text-xl font-bold mb-4">Em breve!</h3>
            <p className="mb-4">Estamos finalizando o sistema de pagamentos.</p>
            <p className="mb-6">Envie um e-mail para <span className="text-amber-400">contato@plotmachine.com</span> para acesso antecipado ao plano {plans.find(p => p.id === selectedPlan)?.name}.</p>
            
            <div className="flex justify-end space-x-4">
              <Button variant="outline" onClick={closeModal}>Fechar</Button>
              <Button onClick={handleUpgradeAttempt}>Solicitar Acesso</Button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
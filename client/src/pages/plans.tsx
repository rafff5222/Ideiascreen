import { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Check, AlertCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useQuery } from '@tanstack/react-query';
import { useLocation } from 'wouter';

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

  // Usuário atual (simulado, seria obtido de um contexto de autenticação real)
  const [currentUser, setCurrentUser] = useState({
    plan: 'free',
    requestsUsed: 2, // Número de requisições já usadas no ciclo atual
  });

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
    setSelectedPlan(currentUser.plan);
  }, [currentUser]);

  // Manipula o clique em um plano
  const handlePlanSelect = (planId: string) => {
    if (planId === 'free') {
      // Se o plano for gratuito, atualiza o usuário diretamente
      setCurrentUser(prev => ({ ...prev, plan: planId }));
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

  // Exibe o número de requisições restantes para o usuário
  const getRequestsRemaining = () => {
    const currentPlan = plans.find((p: Plan) => p.id === currentUser.plan);
    if (!currentPlan) return 0;
    
    if (currentPlan.requestLimit === Infinity) {
      return "ilimitado";
    }
    
    return Math.max(0, currentPlan.requestLimit - currentUser.requestsUsed);
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
            <h1 className="text-3xl md:text-4xl font-black bg-gradient-to-r from-amber-400 to-amber-600 bg-clip-text text-transparent mb-4">
              Planos e Preços
            </h1>
            <p className="text-lg text-gray-300 max-w-2xl mx-auto">
              Escolha o plano ideal para suas necessidades de criação de roteiros
            </p>
            
            {currentUser.plan !== 'free' ? (
              <div className="mt-4 inline-block bg-amber-500/10 text-amber-400 px-4 py-2 rounded-full text-sm">
                <span className="font-medium">Seu plano atual: </span> 
                {plans.find((p: Plan) => p.id === currentUser.plan)?.name || 'Gratuito'}
              </div>
            ) : (
              <div className="mt-4 inline-block bg-blue-500/10 text-blue-400 px-4 py-2 rounded-full text-sm">
                <span className="font-medium">Roteiros restantes: </span> 
                {getRequestsRemaining()} de {plans.find((p: Plan) => p.id === 'free')?.requestLimit || 3}
              </div>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {plans.map((plan: Plan) => (
              <Card 
                key={plan.id} 
                className={`relative border ${
                  plan.popular 
                    ? 'border-amber-500 shadow-lg shadow-amber-500/20' 
                    : 'border-gray-700'
                } transition-all hover:translate-y-[-4px]`}
              >
                {plan.badge && (
                  <Badge className="absolute top-4 right-4 bg-amber-500 text-white">
                    {plan.badge}
                  </Badge>
                )}
                <CardHeader>
                  <CardTitle className="text-xl">{plan.name}</CardTitle>
                  <CardDescription>{plan.description}</CardDescription>
                  <div className="mt-2">
                    <span className="text-3xl font-bold">{formatPrice(plan.price)}</span>
                    <span className="text-gray-400">/mês</span>
                    
                    {plan.monthlyPrice && (
                      <div className="text-sm text-gray-400 mt-1">
                        <span className="line-through">{formatPrice(plan.monthlyPrice)}</span>
                        <span className="text-green-500 ml-1">Economize {formatPrice(plan.monthlyPrice - plan.price)}</span>
                      </div>
                    )}
                  </div>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    {plan.features.map((feature: PlanFeature, idx: number) => (
                      <li key={idx} className="flex items-start">
                        {feature.included ? (
                          <Check className="h-5 w-5 text-green-500 mt-0.5 mr-2 flex-shrink-0" />
                        ) : (
                          <AlertCircle className="h-5 w-5 text-gray-400 mt-0.5 mr-2 flex-shrink-0" />
                        )}
                        <span className={feature.included ? "text-gray-100" : "text-gray-400"}>
                          {feature.name}
                        </span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
                <CardFooter>
                  <Button 
                    className={`w-full ${
                      plan.popular 
                        ? 'bg-amber-500 hover:bg-amber-600' 
                        : plan.id === 'free' 
                          ? 'bg-gray-700 hover:bg-gray-600' 
                          : 'bg-gray-800 hover:bg-gray-700'
                    }`}
                    onClick={() => handlePlanSelect(plan.id)}
                    disabled={plan.id === currentUser.plan}
                  >
                    {plan.id === currentUser.plan 
                      ? 'Plano Atual' 
                      : plan.id === 'free' 
                        ? 'Selecionar' 
                        : 'Assinar Agora'}
                  </Button>
                </CardFooter>
              </Card>
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
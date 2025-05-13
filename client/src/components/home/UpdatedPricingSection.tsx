import { Check, Info } from "lucide-react";
import { Link } from "wouter";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import "./UpdatedPricing.css";

export default function UpdatedPricingSection() {
  // Planos atualizados conforme o exemplo fornecido
  const plans = [
    {
      name: "Grátis",
      price: "R$ 0",
      period: "mês",
      description: "Para experimentar a plataforma e testar nossos recursos básicos.",
      features: [
        "3 roteiros/mês",
        "Acesso a 5 gêneros essenciais",
        "Exportação instantânea para TXT"
      ],
      cta: "Começar Agora",
      ctaLink: "/roteiros",
      highlight: false,
      popular: false
    },
    {
      name: "Iniciante",
      price: "R$ 27,90",
      yearlyPrice: "R$ 268,80",
      yearlyMonthlyEquiv: "R$ 22,40",
      period: "mês",
      description: "Ideal para criadores de conteúdo que precisam de mais roteiros com qualidade profissional.",
      features: [
        "30 roteiros/mês",
        "Biblioteca completa com 37+ gêneros",
        "Exportação profissional em PDF",
        "Revisões ilimitadas"
      ],
      cta: "Assinar Agora",
      ctaLink: "/planos",
      highlight: true,
      popular: true
    },
    {
      name: "Profissional",
      price: "R$ 79,90",
      yearlyPrice: "R$ 767,00",
      yearlyMonthlyEquiv: "R$ 63,90", 
      period: "mês",
      description: "Solução completa para profissionais que dependem de roteiros de alta qualidade sem limitações.",
      features: [
        "Roteiros ilimitados",
        "Exportação em formato .FDX profissional",
        "Análise avançada de estrutura narrativa",
        "Modo Diretor com feedback detalhado"
      ],
      cta: "Assinar Agora",
      ctaLink: "/planos",
      highlight: false,
      recommended: true,
      popular: false
    },
    {
      name: "Estúdio",
      price: "R$ 249,90",
      yearlyPrice: "R$ 2.399,00",
      yearlyMonthlyEquiv: "R$ 199,90",
      period: "mês",
      description: "Ideal para equipes e agências que precisam de colaboração e recursos premium para múltiplos usuários.",
      features: [
        "Acesso para 5 usuários simultâneos",
        "Suporte prioritário 24/7",
        "Ferramentas avançadas de colaboração",
        "Consultoria personalizada de roteiros"
      ],
      cta: "Contatar Vendas",
      ctaLink: "/contato",
      highlight: false,
      popular: false
    }
  ];

  return (
    <section className="py-16 md:py-24 bg-gray-50" id="pricing">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4 text-gray-900">
            Planos para Todos os Criadores
          </h2>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            Desde criadores iniciantes até estúdios profissionais, temos o plano perfeito para suas necessidades.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {plans.map((plan, index) => (
            <div 
              key={index} 
              className={`plan-card rounded-xl p-6 border transition-all duration-300 hover:shadow-xl flex flex-col h-full relative
              ${plan.highlight 
                ? 'bg-white border-amber-500 shadow-lg popular' 
                : plan.recommended 
                  ? 'bg-white border-amber-300 shadow-md recommended'
                  : 'bg-white border-gray-200'
              }`}
            >
              {plan.popular && (
                <div className="popular-tag bg-amber-500 text-white font-semibold text-sm px-4 py-1 rounded-full">
                  <span className="pulse mr-1"></span>
                  MAIS POPULAR
                </div>
              )}
              
              {plan.recommended && (
                <div className="recommended-tag bg-amber-500 text-white font-semibold text-sm px-4 py-1 rounded-full">
                  <span className="pulse mr-1"></span>
                  RECOMENDADO
                </div>
              )}
              
              <h3 className="text-xl font-bold text-gray-900 mt-4 mb-2">{plan.name}</h3>
              
              <div className="mb-2">
                <div className="flex items-end">
                  <span className="text-3xl font-bold text-gray-900">{plan.price}</span>
                  <span className="text-gray-500 ml-1">/{plan.period}</span>
                </div>
                
                {plan.yearlyPrice && (
                  <div className="text-sm text-gray-600 mt-1">
                    ou <strong>{plan.yearlyPrice} / ano</strong> (<strong>≈ {plan.yearlyMonthlyEquiv}/mês</strong>)
                    <div className="savings-badge mt-2">
                      Economize até 20% no plano anual
                    </div>
                  </div>
                )}
              </div>
              
              <p className="text-gray-600 mb-6">{plan.description}</p>
              
              <div className="flex-grow">
                <ul className="space-y-3 mb-8">
                  {plan.features.map((feature, idx) => (
                    <li key={idx} className="flex items-start">
                      <Check className="w-5 h-5 text-amber-500 mr-2 flex-shrink-0 mt-0.5" />
                      <span className="text-gray-700">{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>
              
              <Link href={plan.ctaLink}>
                <div className={`w-full py-3 rounded-lg font-medium text-center cursor-pointer transition-all duration-300
                  ${plan.highlight || plan.recommended
                    ? 'btn-gradient' 
                    : 'bg-gray-900 text-white hover:bg-gray-800'
                  }`}
                >
                  {plan.cta}
                </div>
              </Link>
            </div>
          ))}
        </div>
        
        <div className="mt-12 text-center">
          <p className="text-gray-600 text-sm">
            Todos os planos incluem armazenamento local e sem limite de caracteres.
            <br />
            Precisa de um plano personalizado? <Link href="/contato"><span className="text-amber-600 hover:underline cursor-pointer">Entre em contato</span></Link>.
          </p>
        </div>
      </div>
    </section>
  );
}
import { Check, Zap } from "lucide-react";
import { Link } from "wouter";

export default function SimplifiedPricingTable() {
  const plans = [
    {
      name: "Free",
      price: "R$ 0",
      period: "para sempre",
      description: "Para experimentar a plataforma",
      features: [
        "3 roteiros por mês",
        "Acesso a 10 modelos básicos",
        "Exportação TXT",
        "Sem marca d'água"
      ],
      cta: "Começar Agora",
      ctaLink: "/roteiros",
      highlight: false,
      popular: false
    },
    {
      name: "Profissional",
      price: "R$ 37",
      period: "por mês",
      description: "Para criadores de conteúdo",
      features: [
        "Roteiros ilimitados",
        "Acesso a todos os 37 modelos",
        "Exportação TXT, PDF e Copy",
        "Modo Diretor (análise profissional)",
        "5 versões alternativas por roteiro",
        "Suporte prioritário"
      ],
      cta: "Assinar Agora",
      ctaLink: "/planos",
      highlight: true,
      popular: true,
      discount: "Economize 20% no plano anual",
    },
    {
      name: "Studio",
      price: "R$ 97",
      period: "por mês",
      description: "Para equipes e estúdios",
      features: [
        "Tudo do plano Profissional",
        "10 usuários incluídos",
        "Acesso à API",
        "Modo Crítico de Cinema",
        "Versões ilimitadas por roteiro",
        "Onboarding personalizado"
      ],
      cta: "Contatar Vendas",
      ctaLink: "/contato",
      highlight: false,
      popular: false
    }
  ];

  return (
    <section className="py-16 md:py-24 bg-gray-800">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4 text-white">
            <span className="bg-gradient-to-r from-amber-400 to-amber-600 bg-clip-text text-transparent">
              Planos para Todos os Criadores
            </span>
          </h2>
          <p className="text-lg text-gray-400 max-w-3xl mx-auto">
            Desde criadores iniciantes até estúdios profissionais, temos o plano perfeito para suas necessidades.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {plans.map((plan, index) => (
            <div 
              key={index} 
              className={`rounded-xl p-6 border transition-all duration-300 hover:shadow-xl flex flex-col h-full
              ${plan.highlight 
                ? 'bg-gradient-to-b from-amber-900/40 to-gray-800 border-amber-500' 
                : 'bg-gray-800/80 border-gray-700 hover:border-gray-600'
              }`}
            >
              {plan.popular && (
                <div className="bg-amber-500 text-gray-900 font-medium text-sm px-3 py-1 rounded-full mb-4 self-start">
                  Mais Popular
                </div>
              )}
              
              <h3 className="text-2xl font-bold text-white mb-2">{plan.name}</h3>
              
              <div className="mb-4 flex items-end">
                <span className="text-3xl md:text-4xl font-bold text-white">{plan.price}</span>
                <span className="text-gray-400 ml-2">{plan.period}</span>
              </div>
              
              <p className="text-gray-400 mb-6">{plan.description}</p>
              
              <div className="flex-grow">
                <ul className="space-y-3 mb-8">
                  {plan.features.map((feature, idx) => (
                    <li key={idx} className="flex items-start">
                      <Check className="w-5 h-5 text-amber-500 mr-2 flex-shrink-0 mt-0.5" />
                      <span className="text-gray-300">{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>
              
              {plan.discount && (
                <div className="text-amber-400 text-sm mb-4">
                  {plan.discount}
                </div>
              )}
              
              <Link href={plan.ctaLink}>
                <div className={`w-full py-3 rounded-lg font-medium text-center cursor-pointer transition-all duration-300
                  ${plan.highlight 
                    ? 'bg-gradient-to-r from-amber-500 to-amber-600 text-white hover:shadow-lg hover:shadow-amber-500/20 transform hover:-translate-y-1' 
                    : 'bg-gray-700 text-white hover:bg-gray-600'
                  }`}
                >
                  {plan.cta}
                </div>
              </Link>
            </div>
          ))}
        </div>
        
        <div className="mt-12 text-center">
          <p className="text-gray-400 text-sm">
            Todos os planos incluem armazenamento local e sem limite de caracteres.
            <br />
            Precisa de um plano personalizado? <Link href="/contato"><span className="text-amber-400 hover:underline cursor-pointer">Entre em contato</span></Link>.
          </p>
        </div>
      </div>
    </section>
  );
}
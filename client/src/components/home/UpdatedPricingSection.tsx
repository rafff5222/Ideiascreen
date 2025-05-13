import { Link } from "wouter";
import "./PricingStyles.css";

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
    <section className="pricing-section" id="pricing">
      <div className="container mx-auto px-4">
        <div className="pricing-header text-center mb-16">
          <h2>Planos para Todos os Criadores</h2>
          <p>Desde criadores iniciantes até estúdios profissionais, temos o plano perfeito para suas necessidades.</p>
        </div>

        <div className="plans-container">
          {plans.map((plan, index) => (
            <div 
              key={index} 
              className={`plan-card
              ${plan.highlight 
                ? 'popular' 
                : plan.recommended 
                  ? 'recommended'
                  : ''
              }`}
            >
              {plan.popular && (
                <div className="popular-tag">
                  <span className="pulse mr-1"></span>
                  MAIS POPULAR
                </div>
              )}
              
              {plan.recommended && (
                <div className="recommended-tag">
                  <span className="pulse mr-1"></span>
                  RECOMENDADO
                </div>
              )}
              
              <h3 className="mt-4 mb-2">{plan.name}</h3>
              
              <div className="mb-2">
                <p className="price-display">
                  <strong>{plan.price}</strong>/{plan.period}
                </p>
                
                {plan.yearlyPrice && (
                  <div className="mt-1">
                    <p>ou <strong>{plan.yearlyPrice} / ano</strong></p>
                    <p>(<strong>≈ {plan.yearlyMonthlyEquiv}/mês</strong>)</p>
                    <div className="savings-badge mt-2">
                      Economize até 20% no plano anual
                    </div>
                  </div>
                )}
              </div>
              
              <p className="mb-6">{plan.description}</p>
              
              <div className="flex-grow">
                <ul className="space-y-3 mb-8">
                  {plan.features.map((feature, idx) => (
                    <li key={idx}>{feature}</li>
                  ))}
                </ul>
              </div>
              
              <Link href={plan.ctaLink}>
                <button className={plan.highlight || plan.recommended ? 'btn btn-primary' : 'btn btn-secondary'}>
                  {plan.cta}
                </button>
              </Link>
            </div>
          ))}
        </div>
        
        <div className="mt-12 text-center">
          <p>
            Todos os planos incluem armazenamento local e sem limite de caracteres.
            <br />
            Precisa de um plano personalizado? <Link href="/contato"><span style={{color: '#FFC107'}}>Entre em contato</span></Link>.
          </p>
        </div>
      </div>
    </section>
  );
}
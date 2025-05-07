import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Check, X, Zap, Rocket, Shield } from "lucide-react";
import { cn } from "@/lib/utils";

export default function Pricing() {
  const pricingPlans = [
    {
      name: "Básico",
      price: 59,
      tagline: "Ideal para testes e pequenos criadores",
      description: "Ideal para iniciantes que querem criar conteúdo de qualidade",
      features: [
        { title: "Geração de Roteiros", value: "50 créditos/mês", highlight: true },
        { title: "Descrições & Hashtags", value: "Simples" },
        { title: "Vídeos Automáticos", included: false },
        { title: "Estilo de Vídeo", value: "-" },
        { title: "Áudio", value: "-" },
        { title: "Prioridade", value: "-" },
        { title: "Suporte", value: "48h" },
      ],
      cta: "COMEÇAR AGORA",
      popular: false,
      headerClass: "bg-gray-50",
      priceClass: "text-gray-600",
      buttonClass: "bg-gray-200 text-gray-700"
    },
    {
      name: "Premium",
      price: 89,
      tagline: "🚀 Melhor custo-benefício",
      icon: <Rocket className="h-5 w-5" />,
      description: "De roteiro a Reel em 1 clique! Nossa IA edita vídeos com cortes automáticos, legendas sincronizadas e áudios virais.",
      features: [
        { title: "Geração de Roteiros", value: "150 créditos/mês", highlight: true },
        { title: "Descrições & Hashtags", value: "Otimizadas por IA", highlight: true },
        { title: "Vídeos Automáticos", value: "Auto-montagem (IA)", highlight: true },
        { title: "Estilo de Vídeo", value: "5 templates básicos" },
        { title: "Áudio", value: "Banco de áudios virais", highlight: true },
        { title: "Prioridade", value: "Geração 2x mais rápida" },
        { title: "Suporte", value: "24h" },
      ],
      cta: "🚀 QUERO VÍDEOS AUTOMÁTICOS",
      popular: true,
      headerClass: "bg-gradient-to-r from-green-50 to-green-100",
      priceClass: "text-green-600",
      buttonClass: "bg-gradient-to-r from-green-500 to-green-600",
      borderClass: "border-green-500 border-2"
    },
    {
      name: "Ultimate",
      price: 149,
      tagline: "Para profissionais e agências",
      icon: <Zap className="h-5 w-5" />,
      description: "Vídeos com qualidade de agência (sem pagar R$ 500/edição)! Templates exclusivos e voz idêntica à humana.",
      features: [
        { title: "Geração de Roteiros", value: "Créditos ilimitados", highlight: true },
        { title: "Descrições & Hashtags", value: "Premium + estratégias", highlight: true },
        { title: "Vídeos Automáticos", value: "Edição Avançada (IA)", highlight: true },
        { title: "Estilo de Vídeo", value: "+20 templates profissionais", highlight: true },
        { title: "Áudio", value: "Voz humana artificial (ElevenLabs) + trilhas exclusivas", highlight: true },
        { title: "Prioridade", value: "Fila zero (processamento imediato)" },
        { title: "Suporte", value: "12h + tutoriais exclusivos" },
      ],
      cta: "⚡ QUERO EDIÇÃO PROFISSIONAL",
      popular: false,
      headerClass: "bg-gradient-to-r from-purple-50 to-purple-100",
      priceClass: "text-purple-600",
      buttonClass: "bg-gradient-to-r from-purple-500 to-purple-600"
    }
  ];

  return (
    <section id="precos" className="section bg-gradient-to-br from-primary/5 to-accent/5 py-20">
      <div className="container">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-5xl font-bold mb-6">Planos ContentPro</h2>
          <p className="text-gray-700 max-w-2xl mx-auto text-lg">100% Automatizados por IA - Escolha o plano ideal para suas necessidades</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {pricingPlans.map((plan, index) => (
            <div 
              key={index} 
              className={cn(
                "bg-white rounded-2xl shadow-lg overflow-hidden border border-gray-100 relative h-full flex flex-col transition-transform hover:scale-[1.02] duration-300",
                plan.borderClass
              )}
            >
              {plan.popular && (
                <div className="absolute -right-12 top-7 rotate-45 z-10">
                  <div className="bg-gradient-to-r from-green-500 to-green-600 text-white text-xs font-bold py-1 px-12 shadow-lg w-40 text-center">
                    🔥 MAIS VENDIDO
                  </div>
                </div>
              )}
              
              <div className={cn("p-6 text-center", plan.headerClass)}>
                <h3 className="font-poppins font-bold text-xl mb-1 flex items-center justify-center gap-2">
                  {plan.icon && plan.icon}
                  {plan.name}
                  {plan.icon && plan.name === "Premium" && <span className="text-green-500">🚀</span>}
                  {plan.icon && plan.name === "Ultimate" && <span>⚡</span>}
                </h3>
                <p className="text-sm text-gray-600 mb-3">{plan.tagline}</p>
                <div className="flex items-center justify-center mb-4">
                  <span className={cn("text-4xl font-bold", plan.priceClass)}>R$ {plan.price}</span>
                  <span className="text-gray-600 ml-2">/mês</span>
                </div>
                <p className="text-gray-600 text-sm">{plan.description}</p>
              </div>
              
              <div className="p-6 flex-grow">
                <ul className="space-y-4">
                  {plan.features.map((feature, fIndex) => (
                    <li key={fIndex} className="flex items-start text-sm">
                      {'included' in feature && feature.included === false ? (
                        <X className="text-gray-400 mr-3 min-w-[20px] mt-0.5" size={18} />
                      ) : (
                        <Check className="text-green-500 mr-3 min-w-[20px] mt-0.5" size={18} />
                      )}
                      <div>
                        <span className="font-medium">{feature.title}:</span>{" "}
                        <span className={feature.highlight ? "font-semibold text-gray-800" : "text-gray-600"}>
                          {feature.value || ''}
                        </span>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
              
              <div className="p-6">
                <Link href="/dashboard">
                  <div className={cn(
                    "w-full hover:opacity-90 text-white font-medium py-3 rounded-lg text-center cursor-pointer transition shadow-md",
                    plan.buttonClass
                  )}>
                    {plan.cta}
                  </div>
                </Link>
                {plan.popular && (
                  <div className="mt-4 bg-green-50 rounded-lg p-3 text-center border border-green-100">
                    <p className="text-sm font-medium text-green-600">Teste Grátis: 3 vídeos automáticos (7 dias)</p>
                  </div>
                )}
                <p className="text-center text-sm text-gray-500 mt-4 flex items-center justify-center gap-1">
                  <Shield className="h-4 w-4 text-gray-400" />
                  7 dias de garantia de devolução do dinheiro
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

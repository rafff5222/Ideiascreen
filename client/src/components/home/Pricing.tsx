import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Check, X, Zap, Rocket } from "lucide-react";
import { cn } from "@/lib/utils";

export default function Pricing() {
  const pricingPlans = [
    {
      name: "Básico",
      price: 59,
      description: "Ideal para iniciantes que querem criar conteúdo de qualidade",
      features: [
        { title: "Geração de Roteiros", value: "50 créditos/mês" },
        { title: "Descrições & Hashtags", value: "Simples" },
        { title: "Vídeos Automáticos", included: false },
        { title: "Estilo de Vídeo", value: "-" },
        { title: "Áudio", value: "-" },
        { title: "Prioridade", value: "-" },
        { title: "Suporte", value: "48h" },
      ],
      cta: "COMEÇAR AGORA",
      popular: false,
      headerClass: "bg-primary/10",
      priceClass: "text-primary",
      buttonClass: "bg-primary"
    },
    {
      name: "Premium",
      price: 89,
      icon: <Rocket className="h-5 w-5" />,
      description: "De roteiro a Reel em 1 clique! Nossa IA edita vídeos com cortes automáticos, legendas sincronizadas e áudios virais.",
      features: [
        { title: "Geração de Roteiros", value: "150 créditos/mês" },
        { title: "Descrições & Hashtags", value: "Otimizadas por IA" },
        { title: "Vídeos Automáticos", value: "Auto-montagem (IA)" },
        { title: "Estilo de Vídeo", value: "5 templates básicos" },
        { title: "Áudio", value: "Banco de áudios virais" },
        { title: "Prioridade", value: "Geração 2x mais rápida" },
        { title: "Suporte", value: "24h" },
      ],
      cta: "🚀 QUERO VÍDEOS AUTOMÁTICOS",
      popular: true,
      headerClass: "bg-accent/10",
      priceClass: "text-accent",
      buttonClass: "bg-gradient-to-r from-accent to-primary",
      borderClass: "border-accent border-2"
    },
    {
      name: "Ultimate",
      price: 149,
      icon: <Zap className="h-5 w-5" />,
      description: "Vídeos que parecem feitos por um editor humano! Efeitos cinematográficos, voz realista e templates exclusivos.",
      features: [
        { title: "Geração de Roteiros", value: "Créditos ilimitados" },
        { title: "Descrições & Hashtags", value: "Premium + estratégias" },
        { title: "Vídeos Automáticos", value: "Edição Avançada (IA)" },
        { title: "Estilo de Vídeo", value: "+20 templates profissionais" },
        { title: "Áudio", value: "Voz humana artificial (ElevenLabs) + trilhas exclusivas" },
        { title: "Prioridade", value: "Fila zero (processamento imediato)" },
        { title: "Suporte", value: "12h + tutoriais exclusivos" },
      ],
      cta: "⚡ QUERO EDIÇÃO PROFISSIONAL",
      popular: false,
      headerClass: "bg-secondary/10",
      priceClass: "text-secondary",
      buttonClass: "bg-secondary"
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
                <div className="absolute top-0 right-0">
                  <div className="bg-accent text-white text-xs font-bold px-4 py-1 rounded-bl-lg shadow-lg">
                    RECOMENDADO
                  </div>
                </div>
              )}
              
              <div className={cn("p-6 text-center", plan.headerClass)}>
                <h3 className="font-poppins font-bold text-xl mb-2 flex items-center justify-center gap-2">
                  {plan.icon && plan.icon}
                  {plan.name}
                  {plan.icon && plan.name === "Premium" && <span className="text-accent">🚀</span>}
                  {plan.icon && plan.name === "Ultimate" && <span>⚡</span>}
                </h3>
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
                        <X className="text-gray-400 mr-3 min-w-[20px]" size={20} />
                      ) : (
                        <Check className="text-green-500 mr-3 min-w-[20px]" size={20} />
                      )}
                      <div>
                        <span className="font-medium">{feature.title}: </span>
                        <span className="text-gray-600">{feature.value || ''}</span>
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
                  <div className="mt-4 bg-accent/10 rounded-lg p-3 text-center">
                    <p className="text-sm font-medium text-accent">Teste Grátis: 3 vídeos automáticos (7 dias)</p>
                  </div>
                )}
                <p className="text-center text-sm text-gray-500 mt-4">7 dias de garantia de devolução do dinheiro</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

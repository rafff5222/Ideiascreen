import { Button } from "@/components/ui/button";
import { Check, AlertTriangle } from "lucide-react";
import CountdownSpots from "./CountdownSpots";

export default function Pricing() {
  return (
    <section id="planos" className="py-20 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Planos que se adaptam às suas necessidades
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Escolha o plano ideal para o seu negócio e comece a crescer suas redes sociais hoje mesmo
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          {/* Plano Basic */}
          <div className="plano-card bg-white rounded-xl shadow-md p-6 border border-gray-200 flex flex-col">
            <div className="mb-8">
              <h3 className="text-2xl font-bold mb-2">Básico</h3>
              <div className="flex items-start mb-4">
                <span className="text-3xl font-bold">R$</span>
                <span className="text-5xl font-bold">59</span>
                <span className="text-lg text-gray-500 mt-1">/mês</span>
              </div>
              <p className="text-gray-600 mb-6">Ideal para criadores de conteúdo iniciantes.</p>
              
              <Button 
                className="btn-basic w-full py-6 text-lg font-semibold" 
                variant="outline"
              >
                Selecionar plano
              </Button>
            </div>
            
            <div className="space-y-4 flex-grow">
              <div className="flex items-start">
                <Check className="text-green-500 mt-1 flex-shrink-0" size={18} />
                <span className="ml-3 text-gray-700">
                  <strong>50</strong> gerações de conteúdo por mês
                </span>
              </div>
              <div className="flex items-start">
                <Check className="text-green-500 mt-1 flex-shrink-0" size={18} />
                <span className="ml-3 text-gray-700">
                  Scripts para Stories e Reels
                </span>
              </div>
              <div className="flex items-start">
                <Check className="text-green-500 mt-1 flex-shrink-0" size={18} />
                <span className="ml-3 text-gray-700">
                  Legendas otimizadas para engajamento
                </span>
              </div>
              <div className="flex items-start opacity-50">
                <AlertTriangle className="text-gray-400 mt-1 flex-shrink-0" size={18} />
                <span className="ml-3 text-gray-400">
                  Montagem automática de vídeos
                </span>
              </div>
              <div className="flex items-start opacity-50">
                <AlertTriangle className="text-gray-400 mt-1 flex-shrink-0" size={18} />
                <span className="ml-3 text-gray-400">
                  Biblioteca de templates premium
                </span>
              </div>
            </div>
          </div>
          
          {/* Plano Premium (Mais vendido) */}
          <div className="plano-card bg-white rounded-xl shadow-xl p-6 border-2 border-primary relative flex flex-col transform scale-105">
            <div className="recommended-tag">
              <span className="pulse mr-1"></span>
              MAIS VENDIDO
            </div>
            
            <div className="mb-8">
              <h3 className="text-2xl font-bold mb-2">Premium</h3>
              <div className="flex items-start mb-4">
                <span className="text-3xl font-bold">R$</span>
                <span className="text-5xl font-bold">89</span>
                <span className="text-lg text-gray-500 mt-1">/mês</span>
              </div>
              <p className="text-gray-600 mb-4">Ideal para criadores que desejam automação.</p>
              
              <CountdownSpots />
              
              <Button 
                className="btn-premium w-full py-6 text-lg font-semibold mt-5" 
              >
                Obter Premium agora
              </Button>
            </div>
            
            <div className="space-y-4 flex-grow">
              <div className="flex items-start">
                <Check className="text-green-500 mt-1 flex-shrink-0" size={18} />
                <span className="ml-3 text-gray-700">
                  <strong>150</strong> gerações de conteúdo por mês
                </span>
              </div>
              <div className="flex items-start">
                <Check className="text-green-500 mt-1 flex-shrink-0" size={18} />
                <span className="ml-3 text-gray-700">
                  Scripts, legendas e hashtags otimizadas
                </span>
              </div>
              <div className="flex items-start">
                <Check className="text-green-500 mt-1 flex-shrink-0" size={18} />
                <span className="ml-3 text-gray-700">
                  <strong>Montagem automática</strong> de vídeos
                </span>
              </div>
              <div className="flex items-start">
                <Check className="text-green-500 mt-1 flex-shrink-0" size={18} />
                <span className="ml-3 text-gray-700">
                  Edição com 1-clique (Beta)
                </span>
              </div>
              <div className="flex items-start opacity-50">
                <AlertTriangle className="text-gray-400 mt-1 flex-shrink-0" size={18} />
                <span className="ml-3 text-gray-400">
                  Efeitos e transitions profissionais
                </span>
              </div>
            </div>
          </div>
          
          {/* Plano Ultimate */}
          <div className="plano-card bg-white rounded-xl shadow-md p-6 border border-gray-200 flex flex-col">
            <div className="mb-8">
              <h3 className="text-2xl font-bold mb-2">Ultimate</h3>
              <div className="flex items-start mb-4">
                <span className="text-3xl font-bold">R$</span>
                <span className="text-5xl font-bold">149</span>
                <span className="text-lg text-gray-500 mt-1">/mês</span>
              </div>
              <p className="text-gray-600 mb-6">Para profissionais e agências de marketing.</p>
              
              <Button 
                className="btn-ultimate w-full py-6 text-lg font-semibold" 
              >
                Selecionar plano
              </Button>
            </div>
            
            <div className="space-y-4 flex-grow">
              <div className="flex items-start">
                <Check className="text-green-500 mt-1 flex-shrink-0" size={18} />
                <span className="ml-3 text-gray-700">
                  <strong>500</strong> gerações de conteúdo por mês
                </span>
              </div>
              <div className="flex items-start">
                <Check className="text-green-500 mt-1 flex-shrink-0" size={18} />
                <span className="ml-3 text-gray-700">
                  Tudo do plano Premium
                </span>
              </div>
              <div className="flex items-start">
                <Check className="text-green-500 mt-1 flex-shrink-0" size={18} />
                <span className="ml-3 text-gray-700">
                  <strong>Edição profissional</strong> com IA
                </span>
              </div>
              <div className="flex items-start">
                <Check className="text-green-500 mt-1 flex-shrink-0" size={18} />
                <span className="ml-3 text-gray-700">
                  Efeitos e transitions cinemáticas
                </span>
              </div>
              <div className="flex items-start">
                <Check className="text-green-500 mt-1 flex-shrink-0" size={18} />
                <span className="ml-3 text-gray-700">
                  Vozes realistas com IA
                </span>
              </div>
            </div>
          </div>
        </div>
        
        {/* Garantia e segurança */}
        <div className="mt-16 text-center">
          <div className="inline-flex items-center gap-2 bg-green-50 px-4 py-2 rounded-full text-green-700 mb-4">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
            </svg>
            <span className="font-medium">Garantia de 7 dias ou seu dinheiro de volta</span>
          </div>
          
          <p className="text-sm text-gray-500 max-w-xl mx-auto">
            Todos os planos são cobrados mensalmente. Você pode cancelar a qualquer momento.
            Os preços não incluem impostos que podem ser aplicáveis.
          </p>
        </div>
      </div>
    </section>
  );
}
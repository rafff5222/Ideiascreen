import { Button } from "@/components/ui/button";
import { Check, AlertTriangle, Calculator, DollarSign } from "lucide-react";
import CountdownSpots from "./CountdownSpots";
import PriceAnchoring from "@/components/conversion/PriceAnchoring";
import DynamicPricing from "@/components/conversion/DynamicPricing";
import { useState, useEffect } from "react";

export default function Pricing() {
  const [videoCount, setVideoCount] = useState(15);
  const [savings, setSavings] = useState("1.275");
  const [hoursPerMonth, setHoursPerMonth] = useState(30);
  
  // Calcula economia
  useEffect(() => {
    // Custo médio por vídeo editado R$85
    const costPerVideo = 85;
    // Calcula economia total (formatado como BR currency)
    const totalSavings = (videoCount * costPerVideo).toLocaleString('pt-BR');
    setSavings(totalSavings);
    
    // Calcula horas economizadas (2h por vídeo em média)
    const hoursPerVideo = 2;
    const totalHours = videoCount * hoursPerVideo;
    setHoursPerMonth(totalHours);
  }, [videoCount]);
  
  // Manipula mudança no controle deslizante de vídeos
  const handleVideoCountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setVideoCount(parseInt(e.target.value));
  };
  
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
        
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 max-w-6xl mx-auto">
          {/* Plano Basic */}
          <div className="plano-card bg-white rounded-xl shadow-md p-6 border border-gray-200 flex flex-col">
            <div className="mb-8">
              <h3 className="text-2xl font-bold mb-2">Básico</h3>
              <div className="flex flex-col mb-4">
                <PriceAnchoring originalPrice={97} currentPrice={59} className="mb-2" />
                <div className="flex items-start">
                  <span className="text-3xl font-bold">R$</span>
                  <span className="text-5xl font-bold">59</span>
                  <span className="text-lg text-gray-500 mt-1">/mês</span>
                </div>
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
              <div className="flex flex-col mb-4">
                <PriceAnchoring originalPrice={197} currentPrice={89} className="mb-2" />
                <DynamicPricing 
                  originalPrice={89} 
                  discountedPrice={79} 
                  pageViewThreshold={2}
                  timeout={15000}
                  className="mb-1"
                />
                <div className="flex items-start">
                  <span className="text-3xl font-bold">R$</span>
                  <span className="text-5xl font-bold">89</span>
                  <span className="text-lg text-gray-500 mt-1">/mês</span>
                </div>
              </div>
              <p className="text-gray-600 mb-4">Ideal para criadores que desejam automação.</p>
              
              <CountdownSpots />
              
              <Button 
                className="btn-premium w-full py-6 text-lg font-semibold mt-5 pricing-btn"
                data-plan="premium" 
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
          
          {/* Plano Pro (Decoy/Isca) */}
          <div className="plano-card decoy bg-white rounded-xl shadow-md p-6 border border-gray-200 flex flex-col opacity-90">
            <div className="mb-8">
              <h3 className="text-2xl font-bold mb-2">Pro</h3>
              <div className="flex flex-col mb-4">
                <PriceAnchoring originalPrice={197} currentPrice={119} className="mb-2" />
                <div className="flex items-start">
                  <span className="text-3xl font-bold">R$</span>
                  <span className="text-5xl font-bold">119</span>
                  <span className="text-lg text-gray-500 mt-1">/mês</span>
                </div>
              </div>
              <p className="text-gray-600 mb-6">Para produtores de conteúdo profissionais.</p>
              
              <Button 
                className="btn-pro w-full py-6 text-lg font-semibold pricing-btn"
                data-plan="pro"
              >
                Selecionar plano
              </Button>
            </div>
            
            <div className="space-y-4 flex-grow">
              <div className="flex items-start">
                <Check className="text-green-500 mt-1 flex-shrink-0" size={18} />
                <span className="ml-3 text-gray-700">
                  <strong>200</strong> gerações de conteúdo por mês
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
                  Edição avançada com IA
                </span>
              </div>
              <div className="flex items-start text-red-500">
                <AlertTriangle className="text-red-500 mt-1 flex-shrink-0" size={18} />
                <span className="ml-3 text-red-500">
                  <strong>Não inclui</strong> templates premium
                </span>
              </div>
            </div>
          </div>
          
          {/* Plano Ultimate */}
          <div className="plano-card bg-white rounded-xl shadow-md p-6 border border-gray-200 flex flex-col">
            <div className="mb-8">
              <h3 className="text-2xl font-bold mb-2">Ultimate</h3>
              <div className="flex flex-col mb-4">
                <PriceAnchoring originalPrice={297} currentPrice={149} className="mb-2" />
                <div className="flex items-start">
                  <span className="text-3xl font-bold">R$</span>
                  <span className="text-5xl font-bold">149</span>
                  <span className="text-lg text-gray-500 mt-1">/mês</span>
                </div>
              </div>
              <p className="text-gray-600 mb-6">Para profissionais e agências de marketing.</p>
              
              <Button 
                className="btn-ultimate w-full py-6 text-lg font-semibold pricing-btn" 
                data-plan="ultimate"
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

        {/* Calculadora de ROI */}
        <div className="max-w-2xl mx-auto mt-20 bg-white rounded-xl shadow-lg overflow-hidden">
          <div className="p-6 bg-gradient-to-r from-primary/10 to-purple-500/10">
            <div className="flex items-center gap-3 mb-4">
              <div className="bg-primary/20 rounded-full p-2">
                <Calculator className="text-primary h-6 w-6" />
              </div>
              <h3 className="text-2xl font-bold">Calculadora de Economia</h3>
            </div>
            
            <div className="space-y-6">
              <div className="roi-calculator">
                <p className="text-lg font-medium mb-2">Se eu criar <span id="count" className="text-primary font-bold">{videoCount}</span> vídeos por mês:</p>
                
                <input
                  type="range"
                  id="videoCount"
                  min="5"
                  max="50"
                  value={videoCount}
                  onChange={handleVideoCountChange}
                  className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-primary"
                />
                
                <div className="flex justify-between text-sm text-gray-500 mt-1">
                  <span>5 vídeos</span>
                  <span>50 vídeos</span>
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
                <div className="resultado p-4 bg-white rounded-lg border-2 border-primary/20 flex items-center">
                  <div className="bg-primary/10 rounded-full p-2 mr-3">
                    <DollarSign className="text-primary h-5 w-5" />
                  </div>
                  <div>
                    <span className="block text-sm font-medium text-gray-500">Economizo:</span>
                    <span className="block text-2xl font-bold text-primary">R$ <span id="economia">{savings}</span></span>
                    <span className="text-xs text-gray-500">em custos de edição</span>
                  </div>
                </div>
                
                <div className="resultado p-4 bg-white rounded-lg border-2 border-purple-500/20 flex items-center">
                  <div className="bg-purple-500/10 rounded-full p-2 mr-3">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-purple-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <circle cx="12" cy="12" r="10" />
                      <polyline points="12 6 12 12 16 14" />
                    </svg>
                  </div>
                  <div>
                    <span className="block text-sm font-medium text-gray-500">Economizo:</span>
                    <span className="block text-2xl font-bold text-purple-600">{hoursPerMonth} horas</span>
                    <span className="text-xs text-gray-500">de trabalho por mês</span>
                  </div>
                </div>
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
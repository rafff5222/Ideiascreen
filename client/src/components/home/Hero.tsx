import { Button } from "@/components/ui/button";
import { Sparkles } from "lucide-react";
import DynamicCta from "@/components/conversion/DynamicCta";
import SocialProof from "@/components/conversion/SocialProof";
import ScriptGeneratorButton from "./ScriptGeneratorButton";

export default function Hero() {
  return (
    <section className="hero-section bg-gradient-to-b from-gray-50 to-white py-16 md:py-20">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Texto do Hero */}
          <div className="max-w-xl">
            <div className="inline-flex items-center px-3 py-1 text-sm rounded-full bg-primary/10 text-primary mb-5">
              <Sparkles size={16} className="mr-2" />
              <span>Novo: Gerador de Roteiros Profissionais</span>
            </div>
            
            <h1 className="hero-title text-4xl md:text-5xl lg:text-6xl font-extrabold mb-4 bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent">
              Transforme ideias em <span className="gradient-text">roteiros cinematográficos</span>
            </h1>
            
            <p className="hero-description text-lg md:text-xl text-gray-700 mb-6">
              IA especializada em narrativa + estrutura profissional
            </p>
            
            <div className="badges flex flex-wrap gap-3 mb-6">
              <span className="inline-flex items-center px-3 py-1 text-sm rounded-full bg-primary/10 text-primary">
                ⚡ 2.400+ roteiros gerados
              </span>
              <span className="inline-flex items-center px-3 py-1 text-sm rounded-full bg-primary/10 text-primary">
                🎬 37 gêneros
              </span>
            </div>
            
            <div className="flex flex-wrap items-center gap-4 mb-8">
              {/* Botão para o gerador de roteiros */}
              <ScriptGeneratorButton />
              
              <div className="text-sm text-gray-500 flex items-center">
                <svg 
                  viewBox="0 0 24 24" 
                  className="w-5 h-5 text-yellow-400 mr-1"
                  fill="currentColor"
                >
                  <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
                </svg>
                <span>Avaliado por <strong>2.783</strong> clientes</span>
              </div>
            </div>
            
            <div className="flex flex-wrap gap-6">
              <div className="flex -space-x-2">
                <img 
                  src="https://i.pravatar.cc/100?img=1" 
                  className="w-8 h-8 rounded-full border-2 border-white" 
                  alt="Usuário" 
                />
                <img 
                  src="https://i.pravatar.cc/100?img=2" 
                  className="w-8 h-8 rounded-full border-2 border-white" 
                  alt="Usuário" 
                />
                <img 
                  src="https://i.pravatar.cc/100?img=3" 
                  className="w-8 h-8 rounded-full border-2 border-white" 
                  alt="Usuário" 
                />
                <div className="w-8 h-8 rounded-full border-2 border-white bg-primary flex items-center justify-center text-xs text-white font-bold">
                  +82
                </div>
              </div>
              
              <p className="text-sm text-gray-600">
                <span className="font-semibold">85 pessoas</span> assinaram nos últimos 30 minutos
              </p>
            </div>
          </div>
          
          {/* Ilustração de roteiro */}
          <div className="lg:ml-auto">
            <div className="bg-white rounded-lg shadow-xl p-6 border border-gray-200">
              <div className="flex items-center mb-4">
                <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center text-primary mr-3">
                  <Sparkles size={20} />
                </div>
                <h3 className="font-bold text-xl">Exemplo de Roteiro</h3>
              </div>
              
              <div className="space-y-4">
                <div className="h-3 bg-gray-200 rounded w-3/4"></div>
                <div className="h-3 bg-gray-200 rounded"></div>
                <div className="h-3 bg-gray-200 rounded w-5/6"></div>
                <div className="h-3 bg-gray-200 rounded w-4/5"></div>
                <div className="h-3 bg-gray-200 rounded w-2/3"></div>
                
                <div className="pt-2">
                  <div className="h-3 bg-primary/20 rounded w-full"></div>
                  <div className="h-3 bg-primary/20 rounded w-full mt-2"></div>
                </div>
                
                <div className="pt-2">
                  <div className="h-3 bg-gray-200 rounded w-3/4"></div>
                  <div className="h-3 bg-gray-200 rounded w-5/6 mt-2"></div>
                  <div className="h-3 bg-gray-200 rounded w-4/5 mt-2"></div>
                </div>
                
                <div className="pt-2">
                  <div className="h-3 bg-primary/20 rounded w-full"></div>
                  <div className="h-3 bg-primary/20 rounded w-full mt-2"></div>
                </div>
              </div>
              
              <div className="mt-8 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-gray-200"></div>
                  <div className="h-3 bg-gray-200 rounded w-20"></div>
                </div>
                <div className="flex gap-2">
                  <div className="h-8 bg-primary/20 rounded-md w-16"></div>
                  <div className="h-8 bg-primary rounded-md w-16"></div>
                </div>
              </div>
            </div>
            
            {/* Decoração de fundo */}
            <div className="absolute -z-10 -bottom-6 -right-6 w-full h-full bg-gradient-to-br from-purple-200 to-primary/20 rounded-lg"></div>
            <div className="absolute -z-20 -bottom-12 -right-12 w-full h-full bg-gradient-to-br from-primary/5 to-purple-100 rounded-lg"></div>
          </div>
        </div>
      </div>
    </section>
  );
}
import { Button } from "@/components/ui/button";
import VideoMockup from "./VideoMockup";
import { ArrowRight, Sparkles } from "lucide-react";
import DynamicCta from "@/components/conversion/DynamicCta";

export default function Hero() {
  return (
    <section className="hero-section bg-gradient-to-b from-gray-50 to-white py-16 md:py-20">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Texto do Hero */}
          <div className="max-w-xl">
            <div className="inline-flex items-center px-3 py-1 text-sm rounded-full bg-primary/10 text-primary mb-5">
              <Sparkles size={16} className="mr-2" />
              <span>Novo: Geração de Reels em 1-clique</span>
            </div>
            
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold mb-4 bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent">
              Crie conteúdo viral com IA
            </h1>
            
            <p className="text-lg md:text-xl text-gray-700 mb-6">
              Deixe a inteligência artificial gerar seus scripts, legendas e ideias para vídeos. Cresça no Instagram e TikTok sem esforço.
            </p>
            
            <div className="flex flex-wrap items-center gap-4 mb-8">
              {/* Substituído o botão estático pelo CTA dinâmico */}
              <DynamicCta />
              
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
          
          {/* Mockup de vídeo interativo */}
          <div className="lg:ml-auto">
            <VideoMockup />
          </div>
        </div>
      </div>
    </section>
  );
}
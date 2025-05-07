import { Link } from "wouter";
import { Sparkles, Play } from "lucide-react";
import VideoMockup from "./VideoMockup";

export default function Hero() {
  return (
    <section className="hero-section bg-gradient-to-br from-primary/5 to-accent/5 pt-16 pb-24 px-4">
      <div className="container mx-auto">
        <div className="flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="md:w-1/2 max-w-lg">
            <h1 className="font-poppins font-bold text-5xl md:text-7xl leading-tight mb-4">
              Crie Vídeos Virais <span className="text-purple-600 font-black">com IA</span>
            </h1>
            <h2 className="text-xl md:text-2xl font-bold mb-6">
              Do roteiro à edição final <span className="bg-gradient-to-r from-primary to-accent text-transparent bg-clip-text">em 1 minuto</span> – sem habilidades técnicas!
            </h2>
            <p className="text-gray-800 text-lg mb-8">
              Gere roteiros profissionais, vídeos editados automaticamente e descrições otimizadas sem precisar de editor ou conhecimentos técnicos.
            </p>
            <div className="flex flex-col sm:flex-row items-center gap-4">
              <Link href="/dashboard">
                <div className="btn-premium w-full sm:w-auto text-center flex items-center justify-center gap-2 cursor-pointer">
                  <Sparkles className="h-5 w-5" />
                  <span className="whitespace-nowrap">🚀 QUERO COMEÇAR</span>
                </div>
              </Link>
              <a href="#como-funciona" className="w-full sm:w-auto flex items-center justify-center gap-2 font-medium text-gray-900 hover:text-purple-600 transition text-center">
                <Play className="h-5 w-5 fill-gray-700" />
                Ver demonstração
              </a>
            </div>
            
            {/* Social Proof */}
            <div className="flex items-center mt-8 px-5 py-4 bg-white/80 backdrop-blur-sm rounded-lg shadow-md border border-gray-100">
              <div className="flex -space-x-3 mr-4">
                <img className="w-10 h-10 rounded-full border-2 border-purple-100" src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&auto=format&fit=crop&w=100&h=100" alt="Avatar de usuário" />
                <img className="w-10 h-10 rounded-full border-2 border-purple-100" src="https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?ixlib=rb-1.2.1&auto=format&fit=crop&w=100&h=100" alt="Avatar de usuário" />
                <img className="w-10 h-10 rounded-full border-2 border-purple-100" src="https://images.unsplash.com/photo-1544005313-94ddf0286df2?ixlib=rb-1.2.1&auto=format&fit=crop&w=100&h=100" alt="Avatar de usuário" />
              </div>
              <p className="text-sm text-gray-700">
                <span className="font-bold text-purple-600 bg-purple-50 px-3 py-1 rounded-full">+12.500 criadores</span>{" "}
                <span className="hidden sm:inline">já estão economizando tempo com o ContentPro</span>
              </p>
            </div>
          </div>
          
          {/* Mockup de vídeo interativo */}
          <div className="md:w-1/2 relative">
            <div className="absolute -top-10 -left-10 w-40 h-40 bg-purple-400/10 rounded-full blur-2xl"></div>
            <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-primary/10 rounded-full blur-2xl"></div>
            
            {/* Vídeo mockup interativo com botão de play */}
            <VideoMockup />
          </div>
        </div>
      </div>
    </section>
  );
}

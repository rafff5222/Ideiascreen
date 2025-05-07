import { Link } from "wouter";
import { Sparkles, Play } from "lucide-react";

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
          
          {/* Mockup de vídeo */}
          <div className="md:w-1/2 relative">
            <div className="absolute -top-10 -left-10 w-40 h-40 bg-purple-400/10 rounded-full blur-2xl"></div>
            <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-primary/10 rounded-full blur-2xl"></div>
            
            <div className="relative bg-gradient-to-br from-gray-900 to-gray-800 p-3 rounded-2xl shadow-2xl border border-gray-700">
              <div className="rounded-lg overflow-hidden">
                <img 
                  src="https://images.unsplash.com/photo-1498050108023-c5249f4df085?ixlib=rb-1.2.1&auto=format&fit=crop&w=1352&q=80" 
                  alt="Vídeo sendo gerado no ContentPro" 
                  className="w-full h-auto rounded-lg"
                />
                
                {/* Overlay de "exemplo de geração de vídeo" */}
                <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-t from-black/70 to-transparent flex flex-col justify-end p-5">
                  <div className="bg-white/20 backdrop-blur-md rounded-lg p-3 mb-3 w-3/4">
                    <div className="h-2 bg-purple-500 rounded-full w-2/3 mb-2"></div>
                    <div className="h-2 bg-purple-400/80 rounded-full w-1/2"></div>
                  </div>
                  <div className="flex justify-between items-center">
                    <div className="text-white text-xs font-medium">Gerando vídeo com IA...</div>
                    <div className="text-xs font-bold bg-gradient-to-r from-purple-500 to-pink-500 text-white px-3 py-1 rounded-full">85% concluído</div>
                  </div>
                </div>
              </div>
              
              {/* Mockup de controles */}
              <div className="flex justify-between items-center mt-3 px-2">
                <div className="flex gap-2">
                  <div className="w-3 h-3 rounded-full bg-red-500"></div>
                  <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                  <div className="w-3 h-3 rounded-full bg-green-500"></div>
                </div>
                <div className="text-xs text-white/80 font-medium">ContentPro • Gerador de Vídeo</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

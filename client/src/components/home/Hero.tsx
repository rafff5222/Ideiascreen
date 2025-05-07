import { Link } from "wouter";
import { Sparkles } from "lucide-react";

export default function Hero() {
  return (
    <section className="bg-gradient-to-br from-primary/5 to-accent/5 pt-12 pb-24 px-4">
      <div className="container mx-auto">
        <div className="flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="md:w-1/2 max-w-lg">
            <h1 className="font-poppins font-bold text-5xl md:text-7xl leading-tight mb-4">
              <span className="text-primary font-black"># ContentPro</span>
            </h1>
            <h2 className="text-2xl md:text-3xl font-bold mb-6 bg-gradient-to-r from-primary to-accent text-transparent bg-clip-text">
              Crie vídeos virais com IA em 1 minuto – do roteiro à edição final!
            </h2>
            <p className="text-gray-800 text-lg mb-8">
              Gere roteiros profissionais, descrições otimizadas e ideias de conteúdo em segundos. Economize tempo e aumente seu engajamento nas redes sociais.
            </p>
            <div className="flex flex-col sm:flex-row items-center gap-4">
              <Link href="/dashboard">
                <div className="w-full sm:w-auto bg-gradient-to-r from-accent via-primary to-accent hover:opacity-90 text-white font-medium px-6 py-3 rounded-lg transition text-center flex items-center justify-center gap-2 shadow-lg cursor-pointer">
                  <Sparkles className="h-5 w-5" />
                  Experimentar Agora
                </div>
              </Link>
              <a href="#como-funciona" className="w-full sm:w-auto flex items-center justify-center gap-2 font-medium text-gray-900 hover:text-primary transition text-center">
                <i className="ri-play-circle-line text-xl"></i>
                Ver como funciona
              </a>
            </div>
            <div className="flex items-center mt-8 px-5 py-4 bg-white rounded-lg shadow-md border border-gray-100">
              <div className="flex -space-x-2 mr-4">
                <img className="w-8 h-8 rounded-full border-2 border-white" src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&auto=format&fit=crop&w=100&h=100" alt="Avatar de usuário" />
                <img className="w-8 h-8 rounded-full border-2 border-white" src="https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?ixlib=rb-1.2.1&auto=format&fit=crop&w=100&h=100" alt="Avatar de usuário" />
                <img className="w-8 h-8 rounded-full border-2 border-white" src="https://images.unsplash.com/photo-1544005313-94ddf0286df2?ixlib=rb-1.2.1&auto=format&fit=crop&w=100&h=100" alt="Avatar de usuário" />
              </div>
              <p className="text-sm text-gray-700">
                <span className="font-bold text-accent bg-accent/10 px-3 py-1 rounded-full">+12.500 criadores</span> já estão economizando tempo com o ContentPro
              </p>
            </div>
          </div>
          <div className="md:w-1/2">
            <img 
              src="https://pixabay.com/get/gaa25ee73132dc337447ed1dbdaaaee9398b0f06789133cf3025fdc9e3928ccdf08112233aad840284097adfe053dfa6d0803200b713d3befa093e5cd18e3d0e6_1280.jpg" 
              alt="Criador de conteúdo trabalhando" 
              className="w-full h-auto rounded-lg shadow-xl"
            />
          </div>
        </div>
      </div>
    </section>
  );
}

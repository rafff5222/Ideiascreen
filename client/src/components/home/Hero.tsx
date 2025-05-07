import { Link } from "wouter";

export default function Hero() {
  return (
    <section className="bg-gradient-to-br from-primary/5 to-accent/5 pt-12 pb-24 px-4">
      <div className="container mx-auto">
        <div className="flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="md:w-1/2 max-w-lg">
            <h1 className="font-poppins font-bold text-4xl md:text-5xl leading-tight mb-4">
              Crie conteúdo <span className="text-primary">viral</span> com IA para Instagram e TikTok
            </h1>
            <p className="text-gray-600 text-lg mb-8">
              Gere roteiros, descrições e ideias de conteúdo em segundos. Economize tempo e aumente seu engajamento nas redes sociais.
            </p>
            <div className="flex flex-col sm:flex-row items-center gap-4">
              <Link href="/dashboard">
                <a className="w-full sm:w-auto bg-primary hover:bg-opacity-90 text-white font-medium px-6 py-3 rounded-lg transition text-center">
                  Experimentar Agora
                </a>
              </Link>
              <a href="#como-funciona" className="w-full sm:w-auto flex items-center justify-center gap-2 font-medium text-gray-900 hover:text-primary transition text-center">
                <i className="ri-play-circle-line text-xl"></i>
                Ver como funciona
              </a>
            </div>
            <div className="flex items-center mt-8 px-4 py-3 bg-white rounded-lg shadow-sm">
              <div className="flex -space-x-2 mr-3">
                <img className="w-8 h-8 rounded-full border-2 border-white" src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&auto=format&fit=crop&w=100&h=100" alt="Avatar de usuário" />
                <img className="w-8 h-8 rounded-full border-2 border-white" src="https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?ixlib=rb-1.2.1&auto=format&fit=crop&w=100&h=100" alt="Avatar de usuário" />
                <img className="w-8 h-8 rounded-full border-2 border-white" src="https://images.unsplash.com/photo-1544005313-94ddf0286df2?ixlib=rb-1.2.1&auto=format&fit=crop&w=100&h=100" alt="Avatar de usuário" />
              </div>
              <p className="text-sm text-gray-600">
                <span className="font-semibold">+2.500 criadores</span> já estão economizando tempo com o ContentPro
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

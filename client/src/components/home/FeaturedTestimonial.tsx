import { Star } from "lucide-react";

export default function FeaturedTestimonial() {
  return (
    <section className="py-16 md:py-24 bg-gray-900">
      <div className="container mx-auto px-4">
        <div className="max-w-5xl mx-auto bg-gradient-to-br from-gray-800 to-gray-900 rounded-2xl shadow-2xl overflow-hidden">
          <div className="grid md:grid-cols-2 gap-0">
            <div className="p-8 md:p-12 flex flex-col justify-center">
              <div className="flex mb-6">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-5 h-5 text-amber-400 fill-amber-400" />
                ))}
              </div>
              
              <blockquote className="mb-8">
                <p className="text-xl md:text-2xl font-medium text-white italic leading-relaxed">
                  "O IdeiaScreen transformou meu processo criativo. Consigo gerar roteiros em minutos com qualidade surpreendente. O Modo Diretor é como ter um mentor experiente avaliando meu trabalho."
                </p>
              </blockquote>
              
              <div className="flex items-center">
                <img
                  src="https://i.pravatar.cc/100?img=11"
                  alt="Foto de Márcia Silva"
                  className="w-14 h-14 rounded-full object-cover mr-4 border-2 border-amber-500"
                />
                <div>
                  <p className="text-white font-semibold">Márcia Silva</p>
                  <p className="text-gray-400">Produtora de Conteúdo, Canal "Em Foco"</p>
                </div>
              </div>
            </div>
            
            <div className="bg-gradient-to-br from-amber-900/20 to-gray-900/80 p-8 md:p-12 flex flex-col justify-center">
              <h3 className="text-xl md:text-2xl font-bold text-white mb-6">
                Resultados Comprovados
              </h3>
              
              <div className="space-y-8">
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-gray-300">Tempo economizado</span>
                    <span className="text-amber-400 font-semibold">87%</span>
                  </div>
                  <div className="w-full bg-gray-700 rounded-full h-2">
                    <div className="bg-amber-500 h-2 rounded-full w-[87%]"></div>
                  </div>
                </div>
                
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-gray-300">Aumento de engajamento</span>
                    <span className="text-amber-400 font-semibold">62%</span>
                  </div>
                  <div className="w-full bg-gray-700 rounded-full h-2">
                    <div className="bg-amber-500 h-2 rounded-full w-[62%]"></div>
                  </div>
                </div>
                
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-gray-300">Crescimento do canal</span>
                    <span className="text-amber-400 font-semibold">43%</span>
                  </div>
                  <div className="w-full bg-gray-700 rounded-full h-2">
                    <div className="bg-amber-500 h-2 rounded-full w-[43%]"></div>
                  </div>
                </div>
              </div>
              
              <p className="text-gray-400 text-sm mt-8">
                Resultados reportados por clientes após 3 meses de uso da plataforma.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
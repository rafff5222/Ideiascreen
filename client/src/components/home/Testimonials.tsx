import { Star } from "lucide-react";

export default function Testimonials() {
  return (
    <section id="depoimentos" className="section bg-white py-20">
      <div className="container">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-5xl font-bold mb-6">Histórias de Sucesso</h2>
          <p className="text-gray-600 max-w-2xl mx-auto text-lg">Veja como o ContentPro está transformando perfis comuns em contas virais com conteúdo gerado por IA.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {/* Testimonial 1 */}
          <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl p-6 shadow-md border border-gray-200 transition-transform hover:scale-[1.03] duration-300">
            <div className="flex items-center gap-4 mb-4">
              <img 
                src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?ixlib=rb-4.0.3&auto=format&fit=crop&w=80&h=80&q=80" 
                alt="Foto de Amanda Silva" 
                className="w-16 h-16 rounded-full border-2 border-primary/20"
              />
              <div>
                <h4 className="font-semibold text-lg">Amanda Silva</h4>
                <p className="text-sm text-accent">@amanda.criadora</p>
              </div>
            </div>
            <div className="bg-white/60 p-4 rounded-lg mb-4 relative shadow-sm">
              <div className="absolute -top-3 -left-2 text-primary text-4xl opacity-30">❝</div>
              <p className="text-gray-700 relative z-10">
                ✨ <span className="font-medium">"Gerou meu primeiro vídeo viral em 2 minutos!"</span> Economizo pelo menos 5 horas por semana e meu engajamento aumentou 40%. Vale cada centavo!
              </p>
            </div>
            <div className="flex text-yellow-500">
              <Star className="h-5 w-5 fill-yellow-500" />
              <Star className="h-5 w-5 fill-yellow-500" />
              <Star className="h-5 w-5 fill-yellow-500" />
              <Star className="h-5 w-5 fill-yellow-500" />
              <Star className="h-5 w-5 fill-yellow-500" />
            </div>
          </div>

          {/* Testimonial 2 */}
          <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl p-6 shadow-md border border-gray-200 transition-transform hover:scale-[1.03] duration-300">
            <div className="flex items-center gap-4 mb-4">
              <img 
                src="https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?ixlib=rb-4.0.3&auto=format&fit=crop&w=80&h=80&q=80" 
                alt="Foto de Rafael Mendes" 
                className="w-16 h-16 rounded-full border-2 border-primary/20"
              />
              <div>
                <h4 className="font-semibold text-lg">Rafael Mendes</h4>
                <p className="text-sm text-accent">Loja Moda Jovem</p>
              </div>
            </div>
            <div className="bg-white/60 p-4 rounded-lg mb-4 relative shadow-sm">
              <div className="absolute -top-3 -left-2 text-primary text-4xl opacity-30">❝</div>
              <p className="text-gray-700 relative z-10">
                ✨ <span className="font-medium">"Conversão da loja online aumentou 23%!"</span> Como pequeno empresário, nunca tive tempo para criar conteúdo de qualidade. O ContentPro mudou isso.
              </p>
            </div>
            <div className="flex text-yellow-500">
              <Star className="h-5 w-5 fill-yellow-500" />
              <Star className="h-5 w-5 fill-yellow-500" />
              <Star className="h-5 w-5 fill-yellow-500" />
              <Star className="h-5 w-5 fill-yellow-500" />
              <Star className="h-5 w-5 fill-yellow-500 stroke-yellow-500" strokeWidth={1} fillOpacity={0.3} />
            </div>
          </div>

          {/* Testimonial 3 */}
          <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl p-6 shadow-md border border-gray-200 transition-transform hover:scale-[1.03] duration-300">
            <div className="flex items-center gap-4 mb-4">
              <img 
                src="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?ixlib=rb-4.0.3&auto=format&fit=crop&w=80&h=80&q=80" 
                alt="Foto de Carla Ferreira" 
                className="w-16 h-16 rounded-full border-2 border-primary/20"
              />
              <div>
                <h4 className="font-semibold text-lg">Carla Ferreira</h4>
                <p className="text-sm text-accent">@carla.fitness</p>
              </div>
            </div>
            <div className="bg-white/60 p-4 rounded-lg mb-4 relative shadow-sm">
              <div className="absolute -top-3 -left-2 text-primary text-4xl opacity-30">❝</div>
              <p className="text-gray-700 relative z-10">
                ✨ <span className="font-medium">"De 5 mil para 20 mil seguidores em 6 semanas!"</span> Os vídeos automáticos do plano Premium são incríveis, parecem feitos por uma agência profissional.
              </p>
            </div>
            <div className="flex text-yellow-500">
              <Star className="h-5 w-5 fill-yellow-500" />
              <Star className="h-5 w-5 fill-yellow-500" />
              <Star className="h-5 w-5 fill-yellow-500" />
              <Star className="h-5 w-5 fill-yellow-500" />
              <Star className="h-5 w-5 fill-yellow-500" />
            </div>
          </div>
        </div>
        
        {/* Guarantee Banner */}
        <div className="mt-20 max-w-4xl mx-auto bg-gradient-to-r from-green-50 to-green-100 rounded-xl p-6 shadow-md border border-green-200 text-center">
          <div className="flex items-center justify-center gap-3 mb-3">
            <div className="text-3xl">🛡️</div>
            <h3 className="text-xl font-bold text-green-800">7 DIAS DE GARANTIA – SEM RISCO!</h3>
          </div>
          <p className="text-green-700 max-w-xl mx-auto">
            Se não gostar dos resultados por qualquer motivo, devolvemos 100% do seu dinheiro. Experimente o ContentPro sem preocupações.
          </p>
        </div>
      </div>
    </section>
  );
}

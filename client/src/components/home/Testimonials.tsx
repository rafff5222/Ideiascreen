export default function Testimonials() {
  return (
    <section id="depoimentos" className="section bg-white">
      <div className="container">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl mb-4">O que nossos clientes dizem</h2>
          <p className="text-gray-600 max-w-2xl mx-auto">Junte-se a milhares de criadores de conteúdo que confiam no ContentPro para impulsionar seus perfis nas redes sociais.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Testimonial 1 */}
          <div className="bg-gray-50 rounded-xl p-6 shadow-sm border border-gray-100">
            <div className="flex items-center gap-4 mb-4">
              <img 
                src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?ixlib=rb-4.0.3&auto=format&fit=crop&w=80&h=80&q=80" 
                alt="Foto de Amanda Silva" 
                className="w-12 h-12 rounded-full"
              />
              <div>
                <h4 className="font-medium">Amanda Silva</h4>
                <p className="text-sm text-gray-500">@amanda.criadora</p>
              </div>
            </div>
            <p className="text-gray-600 mb-4">"O ContentPro mudou minha estratégia de conteúdo! Economizo pelo menos 5 horas por semana e meu engajamento aumentou 40%. Vale cada centavo!"</p>
            <div className="flex text-yellow-400">
              <i className="ri-star-fill"></i>
              <i className="ri-star-fill"></i>
              <i className="ri-star-fill"></i>
              <i className="ri-star-fill"></i>
              <i className="ri-star-fill"></i>
            </div>
          </div>

          {/* Testimonial 2 */}
          <div className="bg-gray-50 rounded-xl p-6 shadow-sm border border-gray-100">
            <div className="flex items-center gap-4 mb-4">
              <img 
                src="https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?ixlib=rb-4.0.3&auto=format&fit=crop&w=80&h=80&q=80" 
                alt="Foto de Rafael Mendes" 
                className="w-12 h-12 rounded-full"
              />
              <div>
                <h4 className="font-medium">Rafael Mendes</h4>
                <p className="text-sm text-gray-500">Loja Moda Jovem</p>
              </div>
            </div>
            <p className="text-gray-600 mb-4">"Como dono de pequena empresa, nunca tive tempo para criar conteúdo de qualidade. O ContentPro me dá ideias que realmente funcionam para minha loja."</p>
            <div className="flex text-yellow-400">
              <i className="ri-star-fill"></i>
              <i className="ri-star-fill"></i>
              <i className="ri-star-fill"></i>
              <i className="ri-star-fill"></i>
              <i className="ri-star-half-fill"></i>
            </div>
          </div>

          {/* Testimonial 3 */}
          <div className="bg-gray-50 rounded-xl p-6 shadow-sm border border-gray-100">
            <div className="flex items-center gap-4 mb-4">
              <img 
                src="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?ixlib=rb-4.0.3&auto=format&fit=crop&w=80&h=80&q=80" 
                alt="Foto de Carla Ferreira" 
                className="w-12 h-12 rounded-full"
              />
              <div>
                <h4 className="font-medium">Carla Ferreira</h4>
                <p className="text-sm text-gray-500">@carla.fitness</p>
              </div>
            </div>
            <p className="text-gray-600 mb-4">"Desde que comecei a usar o ContentPro, meu perfil de fitness ganhou mais de 15 mil seguidores! Os roteiros são perfeitos para meu nicho."</p>
            <div className="flex text-yellow-400">
              <i className="ri-star-fill"></i>
              <i className="ri-star-fill"></i>
              <i className="ri-star-fill"></i>
              <i className="ri-star-fill"></i>
              <i className="ri-star-fill"></i>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

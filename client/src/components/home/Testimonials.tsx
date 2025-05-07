import { Star } from "lucide-react";

export default function Testimonials() {
  return (
    <section id="depoimentos" className="section bg-white py-20">
      <div className="container">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-5xl font-bold mb-6">
            ✨ <span className="text-pink-500">12.500 criadores</span> já viralizaram com a gente!
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto text-lg">Veja como o ContentPro está transformando perfis comuns em contas virais com conteúdo gerado por IA.</p>
          
          {/* Barra de progresso de assinaturas - cria senso de urgência */}
          <div className="max-w-md mx-auto mt-8 bg-gray-100 rounded-full h-4 overflow-hidden">
            <div 
              className="bg-gradient-to-r from-purple-500 to-pink-500 h-full rounded-full" 
              style={{ width: "92%" }}
            ></div>
          </div>
          <p className="text-sm text-gray-500 mt-2">92% das vagas do plano Premium já foram preenchidas este mês! 🚀</p>
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
                <h4 className="font-semibold text-lg">Amanda S.</h4>
                <div className="flex items-center gap-2">
                  <p className="text-sm text-accent">@amanda.criadora</p>
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" fill="currentColor" className="w-4 h-4 text-accent">
                    <path d="M8 0C5.829 0 5.556.01 4.703.048 3.85.088 3.269.222 2.76.42a3.917 3.917 0 0 0-1.417.923A3.927 3.927 0 0 0 .42 2.76C.222 3.268.087 3.85.048 4.7.01 5.555 0 5.827 0 8.001c0 2.172.01 2.444.048 3.297.04.852.174 1.433.372 1.942.205.526.478.972.923 1.417.444.445.89.719 1.416.923.51.198 1.09.333 1.942.372C5.555 15.99 5.827 16 8 16s2.444-.01 3.298-.048c.851-.04 1.434-.174 1.943-.372a3.916 3.916 0 0 0 1.416-.923c.445-.445.718-.891.923-1.417.197-.509.332-1.09.372-1.942C15.99 10.445 16 10.173 16 8s-.01-2.445-.048-3.299c-.04-.851-.175-1.433-.372-1.941a3.926 3.926 0 0 0-.923-1.417A3.911 3.911 0 0 0 13.24.42c-.51-.198-1.092-.333-1.943-.372C10.443.01 10.172 0 7.998 0h.003zm-.717 1.442h.718c2.136 0 2.389.007 3.232.046.78.035 1.204.166 1.486.275.373.145.64.319.92.599.28.28.453.546.598.92.11.281.24.705.275 1.485.039.843.047 1.096.047 3.231s-.008 2.389-.047 3.232c-.035.78-.166 1.203-.275 1.485a2.47 2.47 0 0 1-.599.919c-.28.28-.546.453-.92.598-.28.11-.704.24-1.485.276-.843.038-1.096.047-3.232.047s-2.39-.009-3.233-.047c-.78-.036-1.203-.166-1.485-.276a2.478 2.478 0 0 1-.92-.598 2.48 2.48 0 0 1-.6-.92c-.109-.281-.24-.705-.275-1.485-.038-.843-.046-1.096-.046-3.233 0-2.136.008-2.388.046-3.231.036-.78.166-1.204.276-1.486.145-.373.319-.64.599-.92.28-.28.546-.453.92-.598.282-.11.705-.24 1.485-.276.738-.034 1.024-.044 2.515-.045v.002zm4.988 1.328a.96.96 0 1 0 0 1.92.96.96 0 0 0 0-1.92zm-4.27 1.122a4.109 4.109 0 1 0 0 8.217 4.109 4.109 0 0 0 0-8.217zm0 1.441a2.667 2.667 0 1 1 0 5.334 2.667 2.667 0 0 1 0-5.334z"/>
                  </svg>
                </div>
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
                <h4 className="font-semibold text-lg">Rafael M.</h4>
                <div className="flex items-center gap-2">
                  <p className="text-sm text-accent">Loja Moda Jovem</p>
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" fill="currentColor" className="w-4 h-4 text-accent">
                    <path d="M16 8.049c0-4.446-3.582-8.05-8-8.05C3.58 0-.002 3.603-.002 8.05c0 4.017 2.926 7.347 6.75 7.951v-5.625h-2.03V8.05H6.75V6.275c0-2.017 1.195-3.131 3.022-3.131.876 0 1.791.157 1.791.157v1.98h-1.009c-.993 0-1.303.621-1.303 1.258v1.51h2.218l-.354 2.326H9.25V16c3.824-.604 6.75-3.934 6.75-7.951z"/>
                  </svg>
                </div>
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
                <h4 className="font-semibold text-lg">Carla F.</h4>
                <div className="flex items-center gap-2">
                  <p className="text-sm text-accent">@carla.fitness</p>
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" fill="currentColor" className="w-4 h-4 text-accent">
                    <path d="M5.026 15c6.038 0 9.341-5.003 9.341-9.334 0-.14 0-.282-.006-.422A6.685 6.685 0 0 0 16 3.542a6.658 6.658 0 0 1-1.889.518 3.301 3.301 0 0 0 1.447-1.817 6.533 6.533 0 0 1-2.087.793A3.286 3.286 0 0 0 7.875 6.03a9.325 9.325 0 0 1-6.767-3.429 3.289 3.289 0 0 0 1.018 4.382A3.323 3.323 0 0 1 .64 6.575v.045a3.288 3.288 0 0 0 2.632 3.218 3.203 3.203 0 0 1-.865.115 3.23 3.23 0 0 1-.614-.057 3.283 3.283 0 0 0 3.067 2.277A6.588 6.588 0 0 1 .78 13.58a6.32 6.32 0 0 1-.78-.045A9.344 9.344 0 0 0 5.026 15z"/>
                  </svg>
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" fill="currentColor" className="w-4 h-4 text-accent">
                    <path d="M8 0C5.829 0 5.556.01 4.703.048 3.85.088 3.269.222 2.76.42a3.917 3.917 0 0 0-1.417.923A3.927 3.927 0 0 0 .42 2.76C.222 3.268.087 3.85.048 4.7.01 5.555 0 5.827 0 8.001c0 2.172.01 2.444.048 3.297.04.852.174 1.433.372 1.942.205.526.478.972.923 1.417.444.445.89.719 1.416.923.51.198 1.09.333 1.942.372C5.555 15.99 5.827 16 8 16s2.444-.01 3.298-.048c.851-.04 1.434-.174 1.943-.372a3.916 3.916 0 0 0 1.416-.923c.445-.445.718-.891.923-1.417.197-.509.332-1.09.372-1.942C15.99 10.445 16 10.173 16 8s-.01-2.445-.048-3.299c-.04-.851-.175-1.433-.372-1.941a3.926 3.926 0 0 0-.923-1.417A3.911 3.911 0 0 0 13.24.42c-.51-.198-1.092-.333-1.943-.372C10.443.01 10.172 0 7.998 0h.003zm-.717 1.442h.718c2.136 0 2.389.007 3.232.046.78.035 1.204.166 1.486.275.373.145.64.319.92.599.28.28.453.546.598.92.11.281.24.705.275 1.485.039.843.047 1.096.047 3.231s-.008 2.389-.047 3.232c-.035.78-.166 1.203-.275 1.485a2.47 2.47 0 0 1-.599.919c-.28.28-.546.453-.92.598-.28.11-.704.24-1.485.276-.843.038-1.096.047-3.232.047s-2.39-.009-3.233-.047c-.78-.036-1.203-.166-1.485-.276a2.478 2.478 0 0 1-.92-.598 2.48 2.48 0 0 1-.6-.92c-.109-.281-.24-.705-.275-1.485-.038-.843-.046-1.096-.046-3.233 0-2.136.008-2.388.046-3.231.036-.78.166-1.204.276-1.486.145-.373.319-.64.599-.92.28-.28.546-.453.92-.598.282-.11.705-.24 1.485-.276.738-.034 1.024-.044 2.515-.045v.002zm4.988 1.328a.96.96 0 1 0 0 1.92.96.96 0 0 0 0-1.92zm-4.27 1.122a4.109 4.109 0 1 0 0 8.217 4.109 4.109 0 0 0 0-8.217zm0 1.441a2.667 2.667 0 1 1 0 5.334 2.667 2.667 0 0 1 0-5.334z"/>
                  </svg>
                </div>
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

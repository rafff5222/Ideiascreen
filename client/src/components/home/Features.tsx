export default function Features() {
  return (
    <section id="recursos" className="section bg-white">
      <div className="container">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl mb-4">Transforme suas ideias em conteúdo viral</h2>
          <p className="text-gray-600 max-w-2xl mx-auto">Nossas ferramentas de IA ajudam você a criar conteúdo envolvente para seu público em minutos, não em horas.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Feature 1 */}
          <div className="bg-gray-50 rounded-xl p-6 transition-all hover:shadow-md">
            <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
              <i className="ri-file-text-line text-2xl text-primary"></i>
            </div>
            <h3 className="font-poppins font-semibold text-xl mb-3">Roteiros Envolventes</h3>
            <p className="text-gray-600">Gere roteiros otimizados para Instagram e TikTok que capturam a atenção nos primeiros segundos.</p>
          </div>

          {/* Feature 2 */}
          <div className="bg-gray-50 rounded-xl p-6 transition-all hover:shadow-md">
            <div className="w-12 h-12 bg-secondary/10 rounded-lg flex items-center justify-center mb-4">
              <i className="ri-chat-3-line text-2xl text-secondary"></i>
            </div>
            <h3 className="font-poppins font-semibold text-xl mb-3">Legendas Cativantes</h3>
            <p className="text-gray-600">Crie descrições e legendas otimizadas que aumentam o engajamento e alcance do seu conteúdo.</p>
          </div>

          {/* Feature 3 */}
          <div className="bg-gray-50 rounded-xl p-6 transition-all hover:shadow-md">
            <div className="w-12 h-12 bg-accent/10 rounded-lg flex items-center justify-center mb-4">
              <i className="ri-lightbulb-line text-2xl text-accent"></i>
            </div>
            <h3 className="font-poppins font-semibold text-xl mb-3">Ideias Criativas</h3>
            <p className="text-gray-600">Nunca fique sem ideias de conteúdo com nossas sugestões personalizadas para seu nicho.</p>
          </div>
        </div>

        <div className="mt-16 grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Feature 4 */}
          <div className="bg-gray-50 rounded-xl p-6 flex gap-6 transition-all hover:shadow-md">
            <div className="w-12 h-12 bg-primary/10 rounded-lg flex-shrink-0 flex items-center justify-center">
              <i className="ri-save-line text-2xl text-primary"></i>
            </div>
            <div>
              <h3 className="font-poppins font-semibold text-xl mb-2">Salve e Organize</h3>
              <p className="text-gray-600">Mantenha todo o seu conteúdo gerado em um só lugar para fácil acesso e edição.</p>
            </div>
          </div>

          {/* Feature 5 */}
          <div className="bg-gray-50 rounded-xl p-6 flex gap-6 transition-all hover:shadow-md">
            <div className="w-12 h-12 bg-secondary/10 rounded-lg flex-shrink-0 flex items-center justify-center">
              <i className="ri-edit-2-line text-2xl text-secondary"></i>
            </div>
            <div>
              <h3 className="font-poppins font-semibold text-xl mb-2">Personalização Total</h3>
              <p className="text-gray-600">Adapte facilmente o conteúdo gerado para que combine perfeitamente com a sua voz e sua marca.</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

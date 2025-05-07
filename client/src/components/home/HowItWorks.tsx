export default function HowItWorks() {
  return (
    <section id="como-funciona" className="section bg-gradient-to-br from-primary/5 to-accent/5">
      <div className="container">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl mb-4">Como funciona</h2>
          <p className="text-gray-600 max-w-2xl mx-auto">Três etapas simples para transformar suas ideias em conteúdo viral para suas redes sociais.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Step 1 */}
          <div className="bg-white rounded-xl p-8 shadow-sm relative">
            <div className="w-10 h-10 bg-primary rounded-full text-white flex items-center justify-center font-bold absolute -top-5 left-8">1</div>
            <h3 className="font-poppins font-semibold text-xl mb-4 mt-2">Escolha o tipo de conteúdo</h3>
            <p className="text-gray-600 mb-4">Selecione entre roteiros, legendas ou ideias de conteúdo para Instagram ou TikTok.</p>
            <img 
              src="https://images.unsplash.com/photo-1611162618071-b39a2ec055fb?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&h=200&q=80" 
              alt="Escolhendo tipo de conteúdo" 
              className="w-full h-auto rounded-lg"
            />
          </div>

          {/* Step 2 */}
          <div className="bg-white rounded-xl p-8 shadow-sm relative">
            <div className="w-10 h-10 bg-primary rounded-full text-white flex items-center justify-center font-bold absolute -top-5 left-8">2</div>
            <h3 className="font-poppins font-semibold text-xl mb-4 mt-2">Detalhe seu nicho</h3>
            <p className="text-gray-600 mb-4">Informe seu nicho, estilo e preferências para obter conteúdo personalizado.</p>
            <img 
              src="https://images.unsplash.com/photo-1552581234-26160f608093?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&h=200&q=80" 
              alt="Detalhando nicho e preferências" 
              className="w-full h-auto rounded-lg"
            />
          </div>

          {/* Step 3 */}
          <div className="bg-white rounded-xl p-8 shadow-sm relative">
            <div className="w-10 h-10 bg-primary rounded-full text-white flex items-center justify-center font-bold absolute -top-5 left-8">3</div>
            <h3 className="font-poppins font-semibold text-xl mb-4 mt-2">Gere e personalize</h3>
            <p className="text-gray-600 mb-4">Receba resultados instantâneos que você pode editar, salvar ou exportar facilmente.</p>
            <img 
              src="https://images.unsplash.com/photo-1661956602153-23384936a1d3?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&h=200&q=80" 
              alt="Gerando e personalizando conteúdo" 
              className="w-full h-auto rounded-lg"
            />
          </div>
        </div>
      </div>
    </section>
  );
}

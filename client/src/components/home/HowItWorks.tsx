import { FileText, Sparkles, Send } from "lucide-react";

export default function HowItWorks() {
  return (
    <section className="bg-gray-900 py-20">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4 text-white">
            Como <span className="text-amber-400">Funciona</span>
          </h2>
          <p className="text-gray-400 max-w-2xl mx-auto">
            Transforme suas ideias em roteiros profissionais em apenas três passos simples
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Passo 1 */}
          <div className="bg-gray-800 rounded-xl p-8 border border-gray-700 relative hover:shadow-lg hover:shadow-amber-500/10 transition-all duration-300 hover:-translate-y-1">
            <div className="absolute -top-5 left-8 bg-amber-500 w-10 h-10 rounded-full flex items-center justify-center text-black font-bold shadow-lg">
              1
            </div>
            <div className="h-14 w-14 bg-gray-700 rounded-full flex items-center justify-center mb-6 mt-4">
              <FileText className="h-6 w-6 text-amber-400" />
            </div>
            <h3 className="text-xl font-semibold mb-4 text-white">Descreva sua ideia</h3>
            <p className="text-gray-400">
              Forneça uma breve descrição da sua ideia, escolha o gênero e defina o tom da narrativa que deseja criar.
            </p>
          </div>
          
          {/* Passo 2 */}
          <div className="bg-gray-800 rounded-xl p-8 border border-gray-700 relative hover:shadow-lg hover:shadow-amber-500/10 transition-all duration-300 hover:-translate-y-1">
            <div className="absolute -top-5 left-8 bg-amber-500 w-10 h-10 rounded-full flex items-center justify-center text-black font-bold shadow-lg">
              2
            </div>
            <div className="h-14 w-14 bg-gray-700 rounded-full flex items-center justify-center mb-6 mt-4">
              <Sparkles className="h-6 w-6 text-amber-400" />
            </div>
            <h3 className="text-xl font-semibold mb-4 text-white">IA gera seu roteiro</h3>
            <p className="text-gray-400">
              Nossa IA avançada transforma sua ideia em um roteiro estruturado com personagens memoráveis e narrativa profissional.
            </p>
          </div>
          
          {/* Passo 3 */}
          <div className="bg-gray-800 rounded-xl p-8 border border-gray-700 relative hover:shadow-lg hover:shadow-amber-500/10 transition-all duration-300 hover:-translate-y-1">
            <div className="absolute -top-5 left-8 bg-amber-500 w-10 h-10 rounded-full flex items-center justify-center text-black font-bold shadow-lg">
              3
            </div>
            <div className="h-14 w-14 bg-gray-700 rounded-full flex items-center justify-center mb-6 mt-4">
              <Send className="h-6 w-6 text-amber-400" />
            </div>
            <h3 className="text-xl font-semibold mb-4 text-white">Exporte e compartilhe</h3>
            <p className="text-gray-400">
              Faça ajustes se necessário, exporte em diversos formatos (PDF, TXT) ou copie diretamente para usar em qualquer plataforma.
            </p>
          </div>
        </div>
        
        {/* CTA Button */}
        <div className="text-center mt-12">
          <a 
            href="/script-generator" 
            className="inline-block px-8 py-4 bg-gradient-to-r from-amber-500 to-amber-600 text-white rounded-lg font-semibold transition-all hover:shadow-lg hover:shadow-amber-500/20 hover:-translate-y-1"
          >
            Comece a criar agora
          </a>
        </div>
      </div>
    </section>
  );
}
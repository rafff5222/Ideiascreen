import { FileText, Sparkles, Send } from "lucide-react";

export default function HowItWorks() {
  return (
    <section className="bg-gray-900 py-20 relative overflow-hidden">
      {/* Background Patterns */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute -top-24 -right-24 w-96 h-96 bg-amber-500 rounded-full filter blur-3xl"></div>
        <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-indigo-500 rounded-full filter blur-3xl"></div>
      </div>
      
      <div className="container mx-auto px-4 relative z-10">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-5xl font-bold mb-4 text-white">
            Como <span className="bg-clip-text text-transparent bg-gradient-to-r from-amber-400 to-amber-600">Funciona</span>
          </h2>
          <div className="w-24 h-1 bg-gradient-to-r from-amber-400 to-amber-600 mx-auto my-6 rounded-full"></div>
          <p className="text-gray-300 max-w-2xl mx-auto text-lg">
            Transforme suas ideias em roteiros profissionais em apenas três passos simples
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-12">
          {/* Passo 1 */}
          <div className="bg-gray-800/80 backdrop-blur-sm rounded-xl p-8 border border-gray-700/50 relative hover:shadow-xl hover:shadow-amber-500/20 transition-all duration-500 hover:-translate-y-2 group">
            {/* Número com gradiente */}
            <div className="absolute -top-6 left-1/2 -translate-x-1/2 bg-gradient-to-br from-amber-400 to-amber-600 w-12 h-12 rounded-full flex items-center justify-center text-black font-bold shadow-lg shadow-amber-500/30 group-hover:scale-110 transition-transform duration-300">
              1
            </div>
            
            {/* Linha conectora */}
            <div className="hidden md:block absolute top-6 left-full w-full h-0.5 bg-gradient-to-r from-amber-500 to-transparent -z-10 transform translate-x-4"></div>
            
            {/* Ícone com gradiente de fundo */}
            <div className="h-20 w-20 mx-auto bg-gradient-to-br from-gray-700 to-gray-800 rounded-2xl flex items-center justify-center mb-6 mt-8 shadow-lg shadow-amber-900/5 group-hover:shadow-amber-500/10 transition-all duration-300">
              <FileText className="h-8 w-8 text-amber-400 group-hover:scale-110 transition-transform duration-300" />
            </div>
            
            <h3 className="text-2xl font-semibold mb-4 text-white text-center">Descreva sua ideia</h3>
            <p className="text-gray-300 text-center">
              Forneça uma breve descrição da sua ideia, escolha o gênero e defina o tom da narrativa que deseja criar.
            </p>
          </div>
          
          {/* Passo 2 */}
          <div className="bg-gray-800/80 backdrop-blur-sm rounded-xl p-8 border border-gray-700/50 relative hover:shadow-xl hover:shadow-amber-500/20 transition-all duration-500 hover:-translate-y-2 group mt-8 md:mt-0">
            {/* Número com gradiente */}
            <div className="absolute -top-6 left-1/2 -translate-x-1/2 bg-gradient-to-br from-amber-400 to-amber-600 w-12 h-12 rounded-full flex items-center justify-center text-black font-bold shadow-lg shadow-amber-500/30 group-hover:scale-110 transition-transform duration-300">
              2
            </div>
            
            {/* Linha conectora */}
            <div className="hidden md:block absolute top-6 left-full w-full h-0.5 bg-gradient-to-r from-amber-500 to-transparent -z-10 transform translate-x-4"></div>
            
            {/* Ícone com gradiente de fundo e animação */}
            <div className="h-20 w-20 mx-auto bg-gradient-to-br from-gray-700 to-gray-800 rounded-2xl flex items-center justify-center mb-6 mt-8 shadow-lg shadow-amber-900/5 group-hover:shadow-amber-500/10 transition-all duration-300 relative overflow-hidden">
              <div className="absolute inset-0 opacity-0 group-hover:opacity-20 bg-amber-400 transition-opacity duration-500"></div>
              <Sparkles className="h-8 w-8 text-amber-400 group-hover:scale-110 transition-transform duration-300 animate-pulse" />
            </div>
            
            <h3 className="text-2xl font-semibold mb-4 text-white text-center">IA gera seu roteiro</h3>
            <p className="text-gray-300 text-center">
              Nossa IA avançada transforma sua ideia em um roteiro estruturado com personagens memoráveis e narrativa profissional.
            </p>
          </div>
          
          {/* Passo 3 */}
          <div className="bg-gray-800/80 backdrop-blur-sm rounded-xl p-8 border border-gray-700/50 relative hover:shadow-xl hover:shadow-amber-500/20 transition-all duration-500 hover:-translate-y-2 group mt-8 md:mt-0">
            {/* Número com gradiente */}
            <div className="absolute -top-6 left-1/2 -translate-x-1/2 bg-gradient-to-br from-amber-400 to-amber-600 w-12 h-12 rounded-full flex items-center justify-center text-black font-bold shadow-lg shadow-amber-500/30 group-hover:scale-110 transition-transform duration-300">
              3
            </div>
            
            {/* Ícone com gradiente de fundo */}
            <div className="h-20 w-20 mx-auto bg-gradient-to-br from-gray-700 to-gray-800 rounded-2xl flex items-center justify-center mb-6 mt-8 shadow-lg shadow-amber-900/5 group-hover:shadow-amber-500/10 transition-all duration-300">
              <Send className="h-8 w-8 text-amber-400 group-hover:scale-110 group-hover:translate-x-1 transition-all duration-300" />
            </div>
            
            <h3 className="text-2xl font-semibold mb-4 text-white text-center">Exporte e compartilhe</h3>
            <p className="text-gray-300 text-center">
              Faça ajustes se necessário, exporte em diversos formatos (PDF, TXT) ou copie diretamente para usar em qualquer plataforma.
            </p>
          </div>
        </div>
        
        {/* CTA Button */}
        <div className="text-center mt-12">
          <a 
            href="/script-generator" 
            className="inline-block px-8 py-4 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-lg font-semibold transition-all hover:shadow-lg hover:shadow-green-500/30 hover:-translate-y-1 relative overflow-hidden group"
          >
            {/* Efeito de brilho animado */}
            <div className="absolute inset-0 w-1/4 h-full bg-white opacity-20 transform -skew-x-12 -translate-x-full group-hover:translate-x-[400%] transition-transform duration-1000 ease-in-out"></div>
            
            <span className="flex items-center justify-center relative z-10">
              <Sparkles className="w-5 h-5 mr-2 text-yellow-300" />
              Comece a criar agora
            </span>
          </a>
        </div>
      </div>
    </section>
  );
}
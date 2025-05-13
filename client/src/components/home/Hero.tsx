import { Button } from "@/components/ui/button";
import { Sparkles } from "lucide-react";
import { Link } from "wouter";
import DynamicCta from "@/components/conversion/DynamicCta";
import SocialProof from "@/components/conversion/SocialProof";
import ScriptGeneratorButton from "./ScriptGeneratorButton";

export default function Hero() {
  return (
    <section className="hero-section bg-gradient-to-b from-gray-800 to-gray-900 text-white py-20 md:py-28">
      <div className="container mx-auto px-4">
        {/* Seção Hero Principal */}
        <div className="text-center mb-16 max-w-4xl mx-auto">
          <h1 className="mb-6 text-5xl md:text-6xl font-extrabold">
            <span className="block text-white">Ideia</span>
            <span className="text-amber-400">Screen</span>
          </h1>
          
          <p className="text-xl md:text-2xl text-gray-300 mb-10 max-w-2xl mx-auto">
            Crie roteiros incríveis com inteligência artificial.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-4">
            <Link href="/roteiros">
              <div className="btn btn-primary bg-gradient-to-r from-amber-500 to-amber-600 text-white px-8 py-3 rounded-lg font-semibold text-lg shadow-lg hover:shadow-amber-500/20 transition-all duration-300 inline-block transform hover:-translate-y-1 cursor-pointer">
                Começar Grátis
              </div>
            </Link>
            <Link href="/planos">
              <div className="btn btn-secondary bg-gray-700 hover:bg-gray-600 text-white px-8 py-3 rounded-lg font-semibold text-lg inline-block transition-all duration-300 cursor-pointer">
                Ver Planos
              </div>
            </Link>
          </div>
          
          <p className="text-sm text-gray-400">Sem cartão. Sem burocracia.</p>
        </div>
        
        {/* Grid de 3 colunas: Como Funciona */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-20">
          <div className="bg-gray-800 p-6 rounded-xl border border-gray-700 hover:border-amber-500/50 transition-all duration-300">
            <div className="w-12 h-12 bg-amber-500/20 rounded-full flex items-center justify-center mb-4">
              <span className="text-2xl">1</span>
            </div>
            <h3 className="text-xl font-bold mb-3">Escolha o Tipo</h3>
            <p className="text-gray-400">Selecione entre mais de 30 formatos de roteiros para qualquer necessidade.</p>
          </div>
          
          <div className="bg-gray-800 p-6 rounded-xl border border-gray-700 hover:border-amber-500/50 transition-all duration-300">
            <div className="w-12 h-12 bg-amber-500/20 rounded-full flex items-center justify-center mb-4">
              <span className="text-2xl">2</span>
            </div>
            <h3 className="text-xl font-bold mb-3">Customize</h3>
            <p className="text-gray-400">Informe o tema, estilo narrativo e nível de detalhamento desejado.</p>
          </div>
          
          <div className="bg-gray-800 p-6 rounded-xl border border-gray-700 hover:border-amber-500/50 transition-all duration-300">
            <div className="w-12 h-12 bg-amber-500/20 rounded-full flex items-center justify-center mb-4">
              <span className="text-2xl">3</span>
            </div>
            <h3 className="text-xl font-bold mb-3">Gere e Exporte</h3>
            <p className="text-gray-400">Obtenha seu roteiro em segundos e exporte em PDF, TXT ou copie para sua ferramenta.</p>
          </div>
        </div>
        
        {/* Depoimentos/Exemplos */}
        <div className="bg-gray-800/50 rounded-2xl p-8 border border-gray-700">
          <h2 className="text-center text-2xl font-bold mb-10">O que nossos usuários estão criando</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="bg-gray-800 p-6 rounded-xl border border-gray-700">
              <div className="flex items-center mb-4">
                <img src="https://i.pravatar.cc/48?img=3" className="w-10 h-10 rounded-full mr-3" alt="Avatar" />
                <div>
                  <p className="font-semibold">Amanda S.</p>
                  <p className="text-sm text-gray-400">Produtora de Conteúdo</p>
                </div>
              </div>
              <p className="text-gray-300 italic">"Economizo pelo menos 5 horas por semana. Meu último vídeo feito com o IdeiaScreen ultrapassou 50 mil visualizações!"</p>
            </div>
            
            <div className="bg-gray-800 p-6 rounded-xl border border-gray-700">
              <div className="flex items-center mb-4">
                <img src="https://i.pravatar.cc/48?img=5" className="w-10 h-10 rounded-full mr-3" alt="Avatar" />
                <div>
                  <p className="font-semibold">Carlos M.</p>
                  <p className="text-sm text-gray-400">Roteirista Independente</p>
                </div>
              </div>
              <p className="text-gray-300 italic">"O 'Modo Diretor' me dá insights que nunca teria pensado. O roteiro parece ter sido analisado por um profissional experiente."</p>
            </div>
          </div>
        </div>
        
        {/* Badges e Diferenciais */}
        <div className="mt-16 flex flex-wrap justify-center gap-6">
          <div className="flex items-center bg-gray-800/70 px-4 py-2 rounded-full">
            <span className="text-amber-400 mr-2">⚡</span>
            <span className="text-sm">2.400+ roteiros gerados</span>
          </div>
          
          <div className="flex items-center bg-gray-800/70 px-4 py-2 rounded-full">
            <span className="text-amber-400 mr-2">🎬</span>
            <span className="text-sm">37 gêneros disponíveis</span>
          </div>
          
          <div className="flex items-center bg-gray-800/70 px-4 py-2 rounded-full">
            <span className="text-amber-400 mr-2">⭐</span>
            <span className="text-sm">4.9/5 de satisfação</span>
          </div>
          
          <div className="flex items-center bg-gray-800/70 px-4 py-2 rounded-full">
            <span className="text-amber-400 mr-2">🚀</span>
            <span className="text-sm">Roteiro pronto em 30 segundos</span>
          </div>
        </div>
      </div>
    </section>
  );
}
import { Button } from "@/components/ui/button";
import { Sparkles } from "lucide-react";
import { Link } from "wouter";
import DynamicCta from "@/components/conversion/DynamicCta";
import SocialProof from "@/components/conversion/SocialProof";
import ScriptGeneratorButton from "./ScriptGeneratorButton";

// Importando imagens dos depoimentos
import amandaAvatar from "@/assets/testimonials/amanda.svg";
import carlosAvatar from "@/assets/testimonials/carlos.svg";
import julianaAvatar from "@/assets/testimonials/juliana.svg";

export default function Hero() {
  return (
    <section className="hero-section bg-gradient-to-b from-gray-800 to-gray-900 text-white py-20 md:py-28 relative overflow-hidden">
      {/* Elementos decorativos */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden opacity-10">
        <div className="absolute top-20 left-10 w-32 h-32 rounded-full bg-amber-400 blur-3xl"></div>
        <div className="absolute bottom-40 right-10 w-40 h-40 rounded-full bg-blue-600 blur-3xl"></div>
        <div className="absolute top-1/2 left-1/3 w-20 h-20 rounded-full bg-purple-500 blur-3xl"></div>
      </div>
      
      <div className="container mx-auto px-4 relative z-10">
        {/* Seção Hero Principal */}
        <div className="text-center mb-16 max-w-4xl mx-auto">
          <div className="inline-block mb-6 p-2 bg-gray-800/50 rounded-full border border-gray-700">
            <span className="text-amber-400 px-4 py-1 bg-amber-400/10 rounded-full text-sm font-medium">✨ Sua melhor ferramenta para roteiros</span>
          </div>
          
          <h1 className="mb-6 text-5xl md:text-7xl font-extrabold tracking-tight">
            <span className="block text-white">Ideia</span>
            <span className="text-amber-400 relative">
              Screen
              <span className="absolute -bottom-2 left-0 right-0 h-1 bg-gradient-to-r from-amber-500 to-amber-300 rounded-full transform translate-y-2 opacity-70"></span>
            </span>
          </h1>
          
          <p className="text-xl md:text-2xl text-gray-300 mb-10 max-w-2xl mx-auto leading-relaxed">
            Transforme ideias em roteiros <span className="font-semibold text-amber-300">cinematográficos</span> prontos em <span className="font-semibold text-amber-300">segundos</span>. Com estrutura narrativa profissional e análise de especialistas.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-5">
            <Link href="/roteiros">
              <div className="btn btn-primary bg-gradient-to-r from-amber-500 to-amber-600 text-white px-8 py-4 rounded-lg font-semibold text-lg shadow-lg hover:shadow-amber-500/20 transition-all duration-300 inline-block transform hover:-translate-y-1 cursor-pointer">
                <span className="flex items-center justify-center">
                  <Sparkles className="w-5 h-5 mr-2" />
                  Começar Grátis
                </span>
              </div>
            </Link>
            <Link href="/plans">
              <div className="btn btn-secondary bg-gray-700 hover:bg-gray-600 text-white px-8 py-4 rounded-lg font-semibold text-lg inline-block transition-all duration-300 cursor-pointer">
                Ver Planos
              </div>
            </Link>
          </div>
          
          <p className="text-sm text-gray-400 mb-4">Sem cartão. Sem burocracia. Comece a criar agora.</p>
          
          <div className="flex flex-wrap justify-center gap-3 items-center mt-6">
            <div className="flex -space-x-2">
              <img src="https://i.pravatar.cc/48?img=1" className="w-8 h-8 rounded-full border-2 border-gray-800" alt="Avatar" />
              <img src="https://i.pravatar.cc/48?img=2" className="w-8 h-8 rounded-full border-2 border-gray-800" alt="Avatar" />
              <img src="https://i.pravatar.cc/48?img=3" className="w-8 h-8 rounded-full border-2 border-gray-800" alt="Avatar" />
            </div>
            <p className="text-sm text-gray-400">+2.400 roteiros gerados hoje</p>
          </div>
        </div>
        
        {/* Como Funciona - Seção com título */}
        <div id="como-funciona" className="mb-24">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Como Funciona</h2>
            <p className="text-gray-400 max-w-2xl mx-auto">O IdeiaScreen torna a criação de roteiros profissionais tão simples quanto 1-2-3. Veja como a mágica acontece:</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
            {/* Linha conectora (apenas para desktop) */}
            <div className="hidden md:block absolute top-16 left-0 w-full h-1 bg-gradient-to-r from-amber-500/0 via-amber-500/50 to-amber-500/0 -z-1"></div>
            
            <div className="bg-gray-800/80 p-8 rounded-xl border border-gray-700 hover:border-amber-500/50 transition-all duration-300 hover:shadow-lg hover:shadow-amber-600/10 relative">
              {/* Ícone com efeito de brilho */}
              <div className="w-14 h-14 bg-amber-500/20 rounded-full flex items-center justify-center mb-5 mx-auto relative">
                <span className="text-2xl font-bold">1</span>
                <div className="absolute inset-0 rounded-full bg-amber-400/20 animate-pulse"></div>
              </div>
              <h3 className="text-xl font-bold mb-3 text-center">Escolha o Tipo</h3>
              <p className="text-gray-300 text-center">Selecione entre mais de 30 formatos de roteiros para qualquer necessidade criativa.</p>
              <ul className="mt-4 text-gray-400 text-sm space-y-2">
                <li className="flex items-start">
                  <span className="text-amber-400 mr-2">✓</span>
                  <span>Roteiros para vídeos curtos</span>
                </li>
                <li className="flex items-start">
                  <span className="text-amber-400 mr-2">✓</span>
                  <span>Scripts para podcasts</span>
                </li>
                <li className="flex items-start">
                  <span className="text-amber-400 mr-2">✓</span>
                  <span>Narrativas para conteúdo longo</span>
                </li>
              </ul>
            </div>
            
            <div className="bg-gray-800/80 p-8 rounded-xl border border-gray-700 hover:border-amber-500/50 transition-all duration-300 hover:shadow-lg hover:shadow-amber-600/10 relative">
              <div className="w-14 h-14 bg-amber-500/20 rounded-full flex items-center justify-center mb-5 mx-auto relative">
                <span className="text-2xl font-bold">2</span>
                <div className="absolute inset-0 rounded-full bg-amber-400/20 animate-pulse"></div>
              </div>
              <h3 className="text-xl font-bold mb-3 text-center">Customize</h3>
              <p className="text-gray-300 text-center">Personalize cada aspecto do seu roteiro para criar uma narrativa única e cativante.</p>
              <ul className="mt-4 text-gray-400 text-sm space-y-2">
                <li className="flex items-start">
                  <span className="text-amber-400 mr-2">✓</span>
                  <span>Defina o tom e estilo narrativo</span>
                </li>
                <li className="flex items-start">
                  <span className="text-amber-400 mr-2">✓</span>
                  <span>Escolha o nível de detalhamento</span>
                </li>
                <li className="flex items-start">
                  <span className="text-amber-400 mr-2">✓</span>
                  <span>Personalize personagens e cenários</span>
                </li>
              </ul>
            </div>
            
            <div className="bg-gray-800/80 p-8 rounded-xl border border-gray-700 hover:border-amber-500/50 transition-all duration-300 hover:shadow-lg hover:shadow-amber-600/10 relative">
              <div className="w-14 h-14 bg-amber-500/20 rounded-full flex items-center justify-center mb-5 mx-auto relative">
                <span className="text-2xl font-bold">3</span>
                <div className="absolute inset-0 rounded-full bg-amber-400/20 animate-pulse"></div>
              </div>
              <h3 className="text-xl font-bold mb-3 text-center">Gere e Exporte</h3>
              <p className="text-gray-300 text-center">Obtenha seu roteiro em segundos e compartilhe-o no formato que preferir.</p>
              <ul className="mt-4 text-gray-400 text-sm space-y-2">
                <li className="flex items-start">
                  <span className="text-amber-400 mr-2">✓</span>
                  <span>Exporte como PDF ou TXT</span>
                </li>
                <li className="flex items-start">
                  <span className="text-amber-400 mr-2">✓</span>
                  <span>Copie diretamente para sua ferramenta</span>
                </li>
                <li className="flex items-start">
                  <span className="text-amber-400 mr-2">✓</span>
                  <span>Salve diferentes versões do roteiro</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
        
        {/* Depoimentos/Exemplos */}
        <div className="mb-24">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Histórias de Sucesso</h2>
            <p className="text-gray-400 max-w-2xl mx-auto">Veja o que nossos usuários estão conquistando com o IdeiaScreen</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="bg-gray-800/80 p-8 rounded-xl border border-gray-700 hover:border-amber-500/30 transition-all duration-300 relative group">
              {/* Marcas de aspas decorativas */}
              <div className="absolute top-4 left-4 text-5xl text-amber-500/20 font-serif">"</div>
              <div className="absolute bottom-4 right-4 text-5xl text-amber-500/20 font-serif rotate-180">"</div>
              
              <div className="flex items-center mb-6">
                <div className="relative">
                  <img src={amandaAvatar} className="w-16 h-16 rounded-full mr-4 border-2 border-amber-500/30 group-hover:border-amber-500 transition-all duration-300" alt="Avatar de Amanda" />
                  <div className="absolute -top-1 -right-1 bg-amber-500 w-6 h-6 rounded-full flex items-center justify-center">
                    <span className="text-xs">⭐</span>
                  </div>
                </div>
                <div>
                  <p className="font-bold text-lg">Amanda S.</p>
                  <p className="text-sm text-gray-400">Produtora de Conteúdo</p>
                  <div className="flex mt-1">
                    <span className="text-amber-400">★★★★★</span>
                  </div>
                </div>
              </div>
              <p className="text-gray-300 italic leading-relaxed">"Economizo pelo menos 5 horas por semana com o IdeiaScreen. Os roteiros são incrivelmente profissionais e meu último vídeo ultrapassou 50 mil visualizações! É como ter um roteirista profissional na minha equipe."</p>
              
              <div className="mt-6 flex justify-between items-center">
                <span className="text-amber-400 text-sm">Instagram: @amanda.creator</span>
                <span className="bg-amber-500/10 text-amber-400 text-xs px-3 py-1 rounded-full">Plano Premium</span>
              </div>
            </div>
            
            <div className="bg-gray-800/80 p-8 rounded-xl border border-gray-700 hover:border-amber-500/30 transition-all duration-300 relative group">
              <div className="absolute top-4 left-4 text-5xl text-amber-500/20 font-serif">"</div>
              <div className="absolute bottom-4 right-4 text-5xl text-amber-500/20 font-serif rotate-180">"</div>
              
              <div className="flex items-center mb-6">
                <div className="relative">
                  <img src={carlosAvatar} className="w-16 h-16 rounded-full mr-4 border-2 border-amber-500/30 group-hover:border-amber-500 transition-all duration-300" alt="Avatar de Carlos" />
                  <div className="absolute -top-1 -right-1 bg-amber-500 w-6 h-6 rounded-full flex items-center justify-center">
                    <span className="text-xs">⭐</span>
                  </div>
                </div>
                <div>
                  <p className="font-bold text-lg">Carlos M.</p>
                  <p className="text-sm text-gray-400">Roteirista Independente</p>
                  <div className="flex mt-1">
                    <span className="text-amber-400">★★★★★</span>
                  </div>
                </div>
              </div>
              <p className="text-gray-300 italic leading-relaxed">"O 'Modo Diretor' é revolucionário! Me dá insights sobre a narrativa que eu nunca teria pensado. É como ter um mentor profissional analisando meu trabalho. Minha produtividade triplicou."</p>
              
              <div className="mt-6 flex justify-between items-center">
                <span className="text-amber-400 text-sm">YouTube: CarlosRoteiros</span>
                <span className="bg-amber-500/10 text-amber-400 text-xs px-3 py-1 rounded-full">Plano Profissional</span>
              </div>
            </div>
            
            <div className="bg-gray-800/80 p-8 rounded-xl border border-gray-700 hover:border-amber-500/30 transition-all duration-300 relative group md:col-span-2 lg:col-span-1">
              <div className="absolute top-4 left-4 text-5xl text-amber-500/20 font-serif">"</div>
              <div className="absolute bottom-4 right-4 text-5xl text-amber-500/20 font-serif rotate-180">"</div>
              
              <div className="flex items-center mb-6">
                <div className="relative">
                  <img src={julianaAvatar} className="w-16 h-16 rounded-full mr-4 border-2 border-amber-500/30 group-hover:border-amber-500 transition-all duration-300" alt="Avatar de Juliana" />
                  <div className="absolute -top-1 -right-1 bg-amber-500 w-6 h-6 rounded-full flex items-center justify-center">
                    <span className="text-xs">⭐</span>
                  </div>
                </div>
                <div>
                  <p className="font-bold text-lg">Juliana R.</p>
                  <p className="text-sm text-gray-400">Podcaster</p>
                  <div className="flex mt-1">
                    <span className="text-amber-400">★★★★★</span>
                  </div>
                </div>
              </div>
              <p className="text-gray-300 italic leading-relaxed">"Meu podcast ganhou estrutura profissional desde que comecei a usar o IdeiaScreen. Consigo planejar episódios com histórias cativantes e pontos de interesse que realmente prendem a atenção do ouvinte do início ao fim."</p>
              
              <div className="mt-6 flex justify-between items-center">
                <span className="text-amber-400 text-sm">Podcast: Tecnologia Diária</span>
                <span className="bg-amber-500/10 text-amber-400 text-xs px-3 py-1 rounded-full">Plano Starter</span>
              </div>
            </div>
          </div>
        </div>
        
        {/* Diferenciais em grade destacada */}
        <div className="mb-20">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Por Que Escolher o IdeiaScreen</h2>
            <p className="text-gray-400 max-w-2xl mx-auto">Uma ferramenta completa para criadores de conteúdo que valorizam qualidade e eficiência</p>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-xl p-6 border border-gray-700 hover:border-amber-500/30 transition-all duration-300 hover:shadow-lg hover:shadow-amber-600/5 group">
              <div className="w-12 h-12 bg-amber-500/10 rounded-full flex items-center justify-center mb-4 group-hover:bg-amber-500/20 transition-all duration-300">
                <span className="text-2xl">⚡</span>
              </div>
              <h3 className="font-bold text-lg mb-1">Velocidade</h3>
              <p className="text-gray-400">Roteiros prontos em menos de 30 segundos</p>
            </div>
            
            <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-xl p-6 border border-gray-700 hover:border-amber-500/30 transition-all duration-300 hover:shadow-lg hover:shadow-amber-600/5 group">
              <div className="w-12 h-12 bg-amber-500/10 rounded-full flex items-center justify-center mb-4 group-hover:bg-amber-500/20 transition-all duration-300">
                <span className="text-2xl">🎬</span>
              </div>
              <h3 className="font-bold text-lg mb-1">Versatilidade</h3>
              <p className="text-gray-400">37 gêneros diferentes para escolher</p>
            </div>
            
            <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-xl p-6 border border-gray-700 hover:border-amber-500/30 transition-all duration-300 hover:shadow-lg hover:shadow-amber-600/5 group">
              <div className="w-12 h-12 bg-amber-500/10 rounded-full flex items-center justify-center mb-4 group-hover:bg-amber-500/20 transition-all duration-300">
                <span className="text-2xl">⭐</span>
              </div>
              <h3 className="font-bold text-lg mb-1">Satisfação</h3>
              <p className="text-gray-400">4.9/5 estrelas de avaliação pelos usuários</p>
            </div>
            
            <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-xl p-6 border border-gray-700 hover:border-amber-500/30 transition-all duration-300 hover:shadow-lg hover:shadow-amber-600/5 group">
              <div className="w-12 h-12 bg-amber-500/10 rounded-full flex items-center justify-center mb-4 group-hover:bg-amber-500/20 transition-all duration-300">
                <span className="text-2xl">🔄</span>
              </div>
              <h3 className="font-bold text-lg mb-1">Flexibilidade</h3>
              <p className="text-gray-400">Exportação para múltiplos formatos</p>
            </div>
          </div>
        </div>
        
        {/* Chamada para ação final */}
        <div className="text-center py-16 px-4 bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 rounded-2xl border border-gray-700 mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">Comece Agora a Criar Roteiros Incríveis</h2>
          <p className="text-xl text-gray-300 mb-8 max-w-3xl mx-auto">
            Junte-se a milhares de criadores que estão economizando tempo e produzindo conteúdo de qualidade profissional
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/roteiros">
              <div className="btn btn-primary bg-gradient-to-r from-amber-500 to-amber-600 text-white px-10 py-4 rounded-lg font-semibold text-lg shadow-lg hover:shadow-amber-500/20 transition-all duration-300 inline-block transform hover:-translate-y-1 cursor-pointer">
                <span className="flex items-center justify-center">
                  <Sparkles className="w-5 h-5 mr-2" />
                  Começar Grátis
                </span>
              </div>
            </Link>
          </div>
          
          <p className="text-sm text-gray-400 mt-4">Não é necessário cartão de crédito</p>
        </div>
        
        {/* Contador e estatísticas sociais */}
        <div className="flex flex-wrap justify-center gap-6 mb-8">
          <div className="flex items-center bg-gray-800/70 px-5 py-3 rounded-full border border-gray-700">
            <span className="text-amber-400 mr-3 text-xl">⚡</span>
            <span className="text-sm font-medium">2.400+ roteiros gerados hoje</span>
          </div>
          
          <div className="flex items-center bg-gray-800/70 px-5 py-3 rounded-full border border-gray-700">
            <span className="text-amber-400 mr-3 text-xl">👥</span>
            <span className="text-sm font-medium">870+ usuários ativos agora</span>
          </div>
          
          <div className="flex items-center bg-gray-800/70 px-5 py-3 rounded-full border border-gray-700">
            <span className="text-amber-400 mr-3 text-xl">🚀</span>
            <span className="text-sm font-medium">Atualizações semanais</span>
          </div>
        </div>
      </div>
    </section>
  );
}
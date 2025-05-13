import { CheckCircle, Code, Zap, BarChart3, Cpu, Clock, FileText, Star } from "lucide-react";
import { Link } from "wouter";

export default function Diferenciais() {
  const features = [
    {
      icon: <Zap className="w-8 h-8 text-amber-500" />,
      title: "Gere Roteiros em Segundos",
      description: "Transforme suas ideias em roteiros completos com apenas algumas instruções simples."
    },
    {
      icon: <Star className="w-8 h-8 text-amber-500" />,
      title: "Modo Diretor",
      description: "Análise profissional do seu roteiro com sugestões de melhoria narrativa e estrutural."
    },
    {
      icon: <FileText className="w-8 h-8 text-amber-500" />,
      title: "Formatos de Exportação",
      description: "Exporte em TXT, PDF ou formatos profissionais como FDX para softwares de roteiro."
    },
    {
      icon: <BarChart3 className="w-8 h-8 text-amber-500" />,
      title: "Análise Narrativa",
      description: "Métricas detalhadas sobre ritmo, estrutura e desenvolvimento de personagens."
    },
    {
      icon: <Cpu className="w-8 h-8 text-amber-500" />,
      title: "Acesso Offline",
      description: "Continue trabalhando mesmo sem conexão com internet com o modo offline."
    },
    {
      icon: <Clock className="w-8 h-8 text-amber-500" />,
      title: "Versões Alternativas",
      description: "Compare diferentes abordagens para a mesma ideia com sistema de versões."
    }
  ];

  return (
    <section className="py-16 md:py-24 bg-gray-900">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            <span className="bg-gradient-to-r from-amber-400 to-amber-600 bg-clip-text text-transparent">
              Por que escolher o IdeiaScreen?
            </span>
          </h2>
          <p className="text-lg text-gray-400 max-w-3xl mx-auto">
            O gerador de roteiros mais completo do mercado, com recursos exclusivos para roteiristas, criadores de conteúdo e profissionais do audiovisual.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <div 
              key={index}
              className="bg-gray-800 rounded-xl p-6 border border-gray-700 hover:border-amber-500/30 transition-all duration-300 hover:shadow-lg hover:shadow-amber-500/5"
            >
              <div className="flex flex-col h-full">
                <div className="mb-4">{feature.icon}</div>
                <h3 className="text-xl font-bold mb-2 text-white">{feature.title}</h3>
                <p className="text-gray-400 flex-grow">{feature.description}</p>
                
                <div className="mt-6 pt-4 border-t border-gray-700">
                  <span className="text-amber-400 text-sm font-medium flex items-center">
                    <CheckCircle className="w-4 h-4 mr-2" />
                    Disponível em todos os planos
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-16 text-center">
          <Link href="/roteiros" className="inline-block">
            <div className="bg-gradient-to-r from-amber-500 to-amber-600 text-white px-8 py-3 rounded-lg font-semibold text-lg shadow-lg hover:shadow-amber-500/20 transition-all duration-300 transform hover:-translate-y-1 cursor-pointer">
              Experimente Agora
            </div>
          </Link>
        </div>
      </div>
    </section>
  );
}
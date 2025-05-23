import {
  BookText,
  Sparkles,
  PenTool,
  FileText,
  BarChart2,
  Clock,
  Film,
  Zap,
  ThumbsUp,
  Download,
  History,
  Save,
  PieChart,
  Lightbulb,
  FileCheck,
  Video,
  Bookmark,
  Brain
} from "lucide-react";

export default function Features() {
  const features = [
    {
      icon: <BookText className="h-10 w-10 text-amber-400" />,
      title: "Geração de Scripts",
      description: "Crie roteiros envolventes para Stories e Reels com a nossa IA treinada para gerar conteúdo viral."
    },
    {
      icon: <Lightbulb className="h-10 w-10 text-amber-400" />,
      title: "Ideias de Conteúdo",
      description: "Nunca mais fique sem ideias. Nossa IA sugere tópicos relevantes para seu nicho e público-alvo."
    },
    {
      icon: <FileText className="h-10 w-10 text-amber-400" />,
      title: "Legendas Otimizadas",
      description: "Aumente seu engajamento com legendas criadas para maximizar comentários, curtidas e compartilhamentos."
    },
    {
      icon: <Bookmark className="h-10 w-10 text-amber-400" />,
      title: "Hashtags Estratégicas",
      description: "Conjuntos de hashtags personalizadas para cada tipo de conteúdo, aumentando seu alcance orgânico."
    },
    {
      icon: <Brain className="h-10 w-10 text-amber-400" />,
      title: "Modo Diretor",
      description: "Análise cinematográfica profissional que aprimora seus roteiros com sugestões de estrutura narrativa."
    },
    {
      icon: <Clock className="h-10 w-10 text-amber-400" />,
      title: "Economia de Tempo",
      description: "Reduza em até 80% o tempo gasto criando conteúdo para suas redes sociais."
    },
    {
      icon: <FileCheck className="h-10 w-10 text-amber-400" />,
      title: "Templates Premium",
      description: "Biblioteca com dezenas de templates profissionais para Stories, Reels e vídeos verticais."
    },
    {
      icon: <PieChart className="h-10 w-10 text-amber-400" />,
      title: "Cronograma Inteligente",
      description: "Sugestões de calendário editorial baseadas nos melhores horários para seu público específico."
    }
  ];

  return (
    <section id="recursos" className="py-20 bg-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-14">
          <h2 className="text-4xl md:text-5xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-amber-500 to-purple-600">
            CRIE CONTEÚDO VIRAL COM O PODER DA IA
          </h2>
          <p className="text-xl text-gray-700 max-w-2xl mx-auto font-medium">
            Economize tempo e aumente seu engajamento com nossas ferramentas inteligentes
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, index) => (
            <div 
              key={index} 
              className="bg-gray-50 rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow duration-300"
            >
              <div className="mb-4">{feature.icon}</div>
              <h3 className="text-2xl font-bold mb-3 text-primary">{feature.title}</h3>
              <p className="text-gray-600">
                {feature.description.split(' ').map((word, idx, arr) => {
                  // Destaca algumas palavras-chave para facilitar a leitura
                  const isKeyword = ['IA', 'Stories', 'Reels', 'templates', 'roteiros', 'cinematográfica', 'calendário'].includes(word);
                  return (
                    <span key={idx} className={isKeyword ? 'font-semibold text-gray-800' : ''}>
                      {word}{idx < arr.length - 1 ? ' ' : ''}
                    </span>
                  );
                })}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
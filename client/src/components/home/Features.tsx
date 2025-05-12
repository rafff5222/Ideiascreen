import {
  Camera,
  Edit3,
  Compass,
  Zap,
  BarChart2,
  Clock,
  Film,
  AlarmClock
} from "lucide-react";
import FakeDoorTest from "@/components/conversion/FakeDoorTest";

export default function Features() {
  const features = [
    {
      icon: <Edit3 className="h-10 w-10 text-primary" />,
      title: "Geração de Scripts",
      description: "Crie roteiros envolventes para Stories e Reels com a nossa IA treinada para gerar conteúdo viral."
    },
    {
      icon: <Compass className="h-10 w-10 text-primary" />,
      title: "Ideias de Conteúdo",
      description: "Nunca mais fique sem ideias. Nossa IA sugere tópicos relevantes para seu nicho e público-alvo."
    },
    {
      icon: <Zap className="h-10 w-10 text-primary" />,
      title: "Legendas Otimizadas",
      description: "Aumente seu engajamento com legendas criadas para maximizar comentários, curtidas e compartilhamentos."
    },
    {
      icon: <BarChart2 className="h-10 w-10 text-primary" />,
      title: "Hashtags Estratégicas",
      description: "Conjuntos de hashtags personalizadas para cada tipo de conteúdo, aumentando seu alcance orgânico."
    },
    {
      icon: <Film className="h-10 w-10 text-primary" />,
      title: "Modo Diretor",
      description: "Análise cinematográfica profissional que aprimora seus roteiros com sugestões de estrutura narrativa."
    },
    {
      icon: <AlarmClock className="h-10 w-10 text-primary" />,
      title: "Economia de Tempo",
      description: "Reduza em até 80% o tempo gasto criando conteúdo para suas redes sociais."
    },
    {
      icon: <Camera className="h-10 w-10 text-primary" />,
      title: "Templates Premium",
      description: "Biblioteca com dezenas de templates profissionais para Stories, Reels e vídeos verticais."
    },
    {
      icon: <Clock className="h-10 w-10 text-primary" />,
      title: "Cronograma Inteligente",
      description: "Sugestões de calendário editorial baseadas nos melhores horários para seu público específico."
    }
  ];

  return (
    <section className="py-20 bg-white">
      <div className="container mx-auto px-4">
        <FakeDoorTest 
          featureName="Edição por Editores Humanos"
          featureDescription="Receba edição de profissionais especialistas em redes sociais"
          buttonText="Quero ser beta tester"
          className="mb-12 mx-auto max-w-2xl"
        />
        
        <div className="text-center mb-14">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Crie conteúdo viral com o poder da IA
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
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
              <h3 className="text-xl font-bold mb-2">{feature.title}</h3>
              <p className="text-gray-600">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
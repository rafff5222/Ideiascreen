import { CheckCircle2 } from "lucide-react";

export default function HowItWorks() {
  const steps = [
    {
      number: "01",
      title: "Escolha o tipo de conteúdo",
      description: "Selecione se deseja criar um script para Stories, Reels, ou obter ideias para novos vídeos."
    },
    {
      number: "02",
      title: "Defina o tema e estilo",
      description: "Escolha o tema e o estilo de comunicação que melhor representa sua marca e público."
    },
    {
      number: "03",
      title: "Receba conteúdo otimizado",
      description: "Nossa IA gera conteúdo pronto para uso em segundos, com estrutura otimizada para engajamento."
    },
    {
      number: "04",
      title: "Análise profissional (Premium)",
      description: "Aprimore seu roteiro com o Modo Diretor que fornece feedback profissional sobre sua narrativa."
    }
  ];

  return (
    <section id="como-funciona" className="py-20 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-purple-600 to-amber-500">
            COMO FUNCIONA NOSSA PLATAFORMA
          </h2>
          <p className="text-xl text-gray-700 max-w-2xl mx-auto font-medium">
            Processo simples e intuitivo para criar conteúdo engajante em poucos minutos
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
          {steps.map((step, index) => (
            <div 
              key={index} 
              className="bg-white rounded-xl p-6 shadow-md relative hover:shadow-lg transition-all duration-300 hover:-translate-y-1"
            >
              <div className="absolute -top-5 -left-3 w-12 h-12 bg-primary text-white rounded-full flex items-center justify-center text-xl font-bold">
                {step.number}
              </div>
              
              <h3 className="text-2xl font-bold mb-4 mt-5 text-primary">{step.title}</h3>
              <p className="text-gray-600">
                {step.description.split(' ').map((word, idx, arr) => {
                  // Destaca algumas palavras-chave para facilitar a leitura
                  const isKeyword = ['IA', 'Stories', 'Reels', 'Premium', 'Modo', 'Diretor', 'otimizada', 'engajamento', 'narrativa'].includes(word);
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
        
        <div className="bg-white rounded-xl p-8 shadow-lg">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h3 className="text-2xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-amber-500 to-amber-700">
                Por que criadores de conteúdo escolhem nossa plataforma?
              </h3>
              
              <div className="space-y-6 mb-6">
                <div className="flex items-start group">
                  <div className="mt-1 flex-shrink-0 transition-all duration-300 group-hover:scale-110">
                    <CheckCircle2 className="text-green-500" size={24} />
                  </div>
                  <p className="ml-3 text-gray-700">
                    <strong className="text-lg text-primary">Economia de tempo</strong> – Reduza o processo de criação de horas para minutos
                  </p>
                </div>
                
                <div className="flex items-start group">
                  <div className="mt-1 flex-shrink-0 transition-all duration-300 group-hover:scale-110">
                    <CheckCircle2 className="text-green-500" size={24} />
                  </div>
                  <p className="ml-3 text-gray-700">
                    <strong className="text-lg text-primary">Conteúdo que converte</strong> – Algoritmos treinados para maximizar engajamento
                  </p>
                </div>
                
                <div className="flex items-start group">
                  <div className="mt-1 flex-shrink-0 transition-all duration-300 group-hover:scale-110">
                    <CheckCircle2 className="text-green-500" size={24} />
                  </div>
                  <p className="ml-3 text-gray-700">
                    <strong className="text-lg text-primary">Aumente sua produtividade</strong> – Crie mais conteúdo de qualidade com menos esforço
                  </p>
                </div>
                
                <div className="flex items-start group">
                  <div className="mt-1 flex-shrink-0 transition-all duration-300 group-hover:scale-110">
                    <CheckCircle2 className="text-green-500" size={24} />
                  </div>
                  <p className="ml-3 text-gray-700">
                    <strong className="text-lg text-primary">Foco nos resultados</strong> – Dedique mais tempo à estratégia e menos à produção
                  </p>
                </div>
              </div>
            </div>
            
            <div className="relative aspect-video rounded-lg overflow-hidden shadow-xl">
              <img 
                src="https://images.unsplash.com/photo-1611162617213-7d7a39e9b1d7?ixlib=rb-4.0.3&auto=format&fit=crop&w=700&h=394&q=80" 
                alt="Criador de conteúdo usando um aplicativo de edição" 
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex items-end">
                <div className="p-6 text-white">
                  <p className="font-medium">
                    "O IdeiaScreen transformou meu processo criativo para roteiros!"
                  </p>
                  <p className="text-sm opacity-90 mt-1">
                    Maria S., Creator Digital
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
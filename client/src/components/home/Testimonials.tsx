import { Star, Sparkles } from "lucide-react";
import amandaAvatar from "@/assets/testimonials/amanda.svg";
import carlosAvatar from "@/assets/testimonials/carlos.svg";
import julianaAvatar from "@/assets/testimonials/juliana.svg";
import marciaAvatar from "@/assets/testimonials/marcia.svg";

// Tipo para os depoimentos
interface Testimonial {
  id: number;
  name: string;
  role: string;
  text: string;
  rating: number;
  avatar: string;
}

// Array de depoimentos
const testimonials: Testimonial[] = [
  {
    id: 1,
    name: "Amanda Santos",
    role: "Influenciadora Digital",
    text: "Criei roteiros incríveis em questão de minutos! Economizo pelo menos 5 horas por semana e meu engajamento aumentou 40%. Vale cada centavo!",
    rating: 5,
    avatar: amandaAvatar,
  },
  {
    id: 2,
    name: "Carlos Ferreira",
    role: "Produtor de Conteúdo",
    text: "Os roteiros gerados pelo plano Premium são incríveis, parecem escritos por um roteirista profissional. A análise do Modo Diretor me ajudou a melhorar a estrutura narrativa.",
    rating: 5,
    avatar: carlosAvatar,
  },
  {
    id: 3,
    name: "Juliana Mendes",
    role: "YouTuber",
    text: "O IdeiaScreen transformou minha produção de conteúdo. A funcionalidade de análise de narrativa do plano Profissional é fantástica para quem busca qualidade cinematográfica.",
    rating: 5,
    avatar: julianaAvatar,
  },
  {
    id: 4,
    name: "Márcia Silva",
    role: "Produtora de Conteúdo",
    text: "Nunca imaginei que poderia criar roteiros tão profissionais sem experiência prévia. O IdeiaScreen é uma ferramenta indispensável para qualquer criador de conteúdo.",
    rating: 5,
    avatar: marciaAvatar,
  },
];

export default function Testimonials() {
  return (
    <section className="py-20 bg-gray-900 relative overflow-hidden">
      {/* Background visual elements */}
      <div className="absolute inset-0 opacity-10">
        <svg xmlns="http://www.w3.org/2000/svg" width="100%" height="100%" className="absolute top-0 left-0 opacity-10">
          <defs>
            <pattern id="dots-pattern" x="0" y="0" width="50" height="50" patternUnits="userSpaceOnUse">
              <circle cx="2" cy="2" r="1" fill="white" />
            </pattern>
          </defs>
          <rect x="0" y="0" width="100%" height="100%" fill="url(#dots-pattern)" />
        </svg>
        
        {/* Gradient blobs */}
        <div className="absolute top-20 -right-32 w-96 h-96 bg-amber-600 opacity-20 rounded-full filter blur-3xl"></div>
        <div className="absolute -bottom-32 -left-32 w-96 h-96 bg-blue-600 opacity-20 rounded-full filter blur-3xl"></div>
      </div>
      
      <div className="container mx-auto px-4 relative z-10">
        <div className="text-center mb-16">
          <span className="inline-block px-3 py-1 bg-amber-900/30 text-amber-400 rounded-full text-sm font-medium mb-4">EXPERIÊNCIAS REAIS</span>
          <h2 className="text-3xl md:text-5xl font-bold mb-6 text-white">
            O que nossos <span className="bg-clip-text text-transparent bg-gradient-to-r from-amber-400 to-amber-600">clientes</span> dizem
          </h2>
          <div className="w-24 h-1 bg-gradient-to-r from-amber-400 to-amber-600 mx-auto mb-8 rounded-full"></div>
          <p className="text-gray-300 max-w-2xl mx-auto text-lg">
            Veja como o IdeiaScreen tem ajudado criadores de conteúdo a elevar a qualidade de seus roteiros
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {testimonials.map((testimonial) => (
            <div 
              key={testimonial.id} 
              className="bg-gray-800/80 backdrop-blur-sm rounded-xl p-8 border border-gray-700/50 transition-all duration-500 hover:shadow-xl hover:shadow-amber-500/20 hover:-translate-y-2 group relative overflow-hidden"
            >
              {/* Card decoration - corner accent */}
              <div className="absolute -top-1 -right-1 w-20 h-20">
                <div className="absolute transform rotate-45 bg-gradient-to-r from-amber-500 to-amber-600 text-xs text-black font-bold py-1 right-[-35px] top-[12px] w-[115px] text-center">
                  Verificado
                </div>
              </div>
              
              {/* Quote icon */}
              <div className="absolute top-4 right-6 text-amber-500/30 select-none text-6xl font-serif">"</div>
              
              {/* Avatar and user info with better styling */}
              <div className="flex items-center mb-5">
                <div className="relative">
                  <div className="w-16 h-16 rounded-full overflow-hidden border-2 border-amber-500/70 p-0.5 shadow-lg shadow-amber-500/10 mr-4">
                    <img 
                      src={testimonial.avatar} 
                      alt={`Avatar de ${testimonial.name}`} 
                      className="w-full h-full rounded-full object-cover"
                    />
                  </div>
                  <div className="absolute -bottom-1 -right-1 bg-green-500 w-5 h-5 rounded-full border-2 border-gray-800 flex items-center justify-center">
                    <div className="w-2 h-2 bg-green-300 rounded-full animate-pulse"></div>
                  </div>
                </div>
                <div>
                  <h4 className="text-white font-bold">{testimonial.name}</h4>
                  <p className="text-amber-400 text-sm">{testimonial.role}</p>
                </div>
              </div>

              <div className="flex mb-4">
                {[...Array(testimonial.rating)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 text-amber-400 fill-amber-400" />
                ))}
              </div>

              <p className="text-gray-300 text-sm leading-relaxed">
                "{testimonial.text}"
              </p>
            </div>
          ))}
        </div>

        <div className="text-center mt-12">
          <a 
            href="/script-generator" 
            className="inline-block px-8 py-4 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-lg font-semibold transition-all hover:shadow-lg hover:shadow-green-500/30 hover:-translate-y-1 relative overflow-hidden group"
          >
            {/* Efeito de brilho animado */}
            <div className="absolute inset-0 w-1/4 h-full bg-white opacity-20 transform -skew-x-12 -translate-x-full group-hover:translate-x-[400%] transition-transform duration-1000 ease-in-out"></div>
            
            <span className="flex items-center justify-center relative z-10">
              <Sparkles className="w-5 h-5 mr-2 text-yellow-300" />
              Experimente grátis
            </span>
          </a>
        </div>
      </div>
    </section>
  );
}
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
    <section className="py-20 bg-gray-900">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4 text-white">
            O que nossos <span className="text-amber-400">clientes</span> dizem
          </h2>
          <p className="text-gray-400 max-w-2xl mx-auto">
            Veja como o IdeiaScreen tem ajudado criadores de conteúdo a elevar a qualidade de seus roteiros
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {testimonials.map((testimonial) => (
            <div 
              key={testimonial.id} 
              className="bg-gray-800 rounded-xl p-6 border border-gray-700 transition-all duration-300 hover:shadow-lg hover:shadow-amber-500/10 hover:-translate-y-1"
            >
              <div className="flex items-center mb-4">
                <img 
                  src={testimonial.avatar} 
                  alt={`Avatar de ${testimonial.name}`} 
                  className="w-12 h-12 rounded-full mr-3 border-2 border-amber-500"
                />
                <div>
                  <h4 className="text-white font-semibold">{testimonial.name}</h4>
                  <p className="text-gray-400 text-sm">{testimonial.role}</p>
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
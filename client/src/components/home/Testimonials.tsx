import React from 'react';
import { FaStar, FaQuoteLeft } from 'react-icons/fa';
import './TestimonialsStyle.css';

interface TestimonialProps {
  name: string;
  profession: string;
  text: string;
  image: string;
  rating: number;
}

const Testimonial: React.FC<TestimonialProps> = ({ name, profession, text, image, rating }) => {
  return (
    <div className="bg-white rounded-lg p-6 shadow-lg border border-gray-100 flex flex-col h-full testimonial-card">
      <div className="flex items-center mb-4">
        <div className="w-12 h-12 rounded-full overflow-hidden mr-4 border-2 border-purple-100">
          <img src={image} alt={`Foto de ${name}`} className="w-full h-full object-cover testimonial-image" />
        </div>
        <div>
          <h3 className="font-bold text-gray-800">{name}</h3>
          <p className="text-gray-600 text-sm">{profession}</p>
        </div>
      </div>
      
      <div className="flex mb-4 testimonial-stars">
        {[...Array(5)].map((_, i) => (
          <FaStar 
            key={i} 
            className={`${i < rating ? 'star' : 'star-empty'} mr-1`} 
            size={16} 
          />
        ))}
      </div>
      
      <div className="flex-grow">
        <FaQuoteLeft className="testimonial-quote" size={24} />
        <p className="text-gray-700 italic">{text}</p>
      </div>
    </div>
  );
};

export default function Testimonials() {
  const testimonials: TestimonialProps[] = [
    {
      name: "Mariana Silva",
      profession: "Influenciadora de moda",
      text: "O ContentPro revolucionou a forma como produzo conteúdo. Economizo pelo menos 5 horas por semana e minhas taxas de engajamento aumentaram 32% no primeiro mês!",
      image: "https://randomuser.me/api/portraits/women/12.jpg",
      rating: 5
    },
    {
      name: "Pedro Almeida",
      profession: "Criador de conteúdo fitness",
      text: "Minha produtividade dobrou desde que comecei a usar a plataforma. Os roteiros gerados são incrivelmente bons e parecem escritos por alguém que entende do meu nicho.",
      image: "https://randomuser.me/api/portraits/men/32.jpg",
      rating: 4
    },
    {
      name: "Carla Mendes",
      profession: "Agência de marketing digital",
      text: "Gerenciamos contas de 15 clientes e o ContentPro é essencial para nossa operação. A ferramenta se paga em poucos dias e os resultados são consistentes.",
      image: "https://randomuser.me/api/portraits/women/65.jpg",
      rating: 5
    }
  ];

  return (
    <div className="py-12 px-4 sm:px-6 lg:px-8 bg-gray-50">
      <div className="text-center mb-12">
        <h2 className="text-3xl sm:text-4xl font-extrabold text-gray-900 mb-6">
          O que nossos clientes dizem
        </h2>
        <p className="text-xl text-gray-600 max-w-2xl mx-auto">
          Criadores de conteúdo como você estão transformando seus resultados
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
        {testimonials.map((testimonial, index) => (
          <Testimonial key={index} {...testimonial} />
        ))}
      </div>
    </div>
  );
}
import { FaStar, FaInstagram, FaTiktok, FaYoutube } from "react-icons/fa";

export default function Testimonials() {
  const testimonials = [
    {
      name: "Camila Moreira",
      role: "Creator & Influencer",
      image: "https://i.pravatar.cc/150?img=5",
      content: "Desde que comecei a usar o ContentAI, tenho consistentemente 40% mais engajamento nos meus Reels. Os roteiros são incríveis e a função de edição automática economiza horas do meu dia!",
      rating: 5,
      platform: "instagram",
      result: "+19.000 seguidores em 3 meses"
    },
    {
      name: "Rafael Costa",
      role: "Social Media Manager",
      image: "https://i.pravatar.cc/150?img=12",
      content: "Como gerencio 4 contas diferentes, preciso de eficiência. O ContentAI me permite criar conteúdo de qualidade em minutos para cada marca que represento, mantendo suas vozes autênticas.",
      rating: 5,
      platform: "tiktok",
      result: "Taxa de conversão aumentou 27%"
    },
    {
      name: "Júlia Santos",
      role: "Empreendedora Digital",
      image: "https://i.pravatar.cc/150?img=9",
      content: "Minha pequena loja online cresceu exponencialmente depois que comecei a usar a plataforma. As ideias de conteúdo são relevantes e os scripts vendem de forma natural, sem parecer forçado.",
      rating: 4,
      platform: "youtube",
      result: "Vendas aumentaram 58% no trimestre"
    }
  ];

  const renderPlatformIcon = (platform: string) => {
    switch (platform) {
      case 'instagram':
        return <FaInstagram size={20} className="text-pink-500" />;
      case 'tiktok':
        return <FaTiktok size={20} className="text-black" />;
      case 'youtube':
        return <FaYoutube size={20} className="text-red-600" />;
      default:
        return null;
    }
  };

  const renderStars = (rating: number) => {
    return Array(5).fill(0).map((_, index) => (
      <FaStar 
        key={index} 
        className={`${index < rating ? 'text-yellow-400' : 'text-gray-300'}`} 
      />
    ));
  };

  return (
    <section className="py-20 bg-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            O que nossos clientes estão dizendo
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Milhares de criadores de conteúdo já transformaram sua presença online com nossa plataforma
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <div 
              key={index} 
              className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl p-6 shadow-lg relative"
            >
              <div className="flex items-center mb-4">
                <img 
                  src={testimonial.image} 
                  alt={testimonial.name} 
                  className="w-14 h-14 rounded-full object-cover mr-4 border-2 border-white shadow-md"
                />
                <div>
                  <h3 className="font-bold text-lg">{testimonial.name}</h3>
                  <div className="flex items-center">
                    <span className="text-gray-600 text-sm mr-2">{testimonial.role}</span>
                    {renderPlatformIcon(testimonial.platform)}
                  </div>
                </div>
              </div>
              
              <div className="flex mb-4">
                {renderStars(testimonial.rating)}
              </div>
              
              <p className="text-gray-700 mb-4 italic">
                "{testimonial.content}"
              </p>
              
              <div className="bg-green-50 border border-green-100 rounded-lg p-2 flex items-center gap-2">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                <span className="text-sm font-medium text-green-700">
                  Resultado: {testimonial.result}
                </span>
              </div>
            </div>
          ))}
        </div>
        
        <div className="mt-16 text-center">
          <p className="text-gray-600 mb-4">Junte-se a milhares de criadores satisfeitos</p>
          <div className="flex justify-center space-x-8">
            <div className="flex flex-col items-center">
              <span className="text-3xl font-bold text-primary">2.783</span>
              <span className="text-sm text-gray-500">Usuários ativos</span>
            </div>
            <div className="flex flex-col items-center">
              <span className="text-3xl font-bold text-primary">4.9/5</span>
              <span className="text-sm text-gray-500">Média de avaliações</span>
            </div>
            <div className="flex flex-col items-center">
              <span className="text-3xl font-bold text-primary">93%</span>
              <span className="text-sm text-gray-500">Taxa de renovação</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
import React, { useState } from 'react';
import { FaChevronDown, FaChevronUp } from 'react-icons/fa';

interface FAQItemProps {
  question: string;
  answer: string;
}

const FAQItem: React.FC<FAQItemProps> = ({ question, answer }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="border-b border-gray-200 py-4">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex justify-between items-center w-full text-left font-medium text-gray-900 focus:outline-none"
      >
        <span className="text-lg">{question}</span>
        {isOpen ? 
          <FaChevronUp className="flex-shrink-0 ml-2 h-5 w-5 text-purple-600" /> : 
          <FaChevronDown className="flex-shrink-0 ml-2 h-5 w-5 text-purple-600" />
        }
      </button>
      {isOpen && (
        <div className="mt-3 pr-12">
          <p className="text-base text-gray-600">{answer}</p>
        </div>
      )}
    </div>
  );
};

export default function FAQ() {
  const faqItems: FAQItemProps[] = [
    {
      question: "Como funciona a geração de roteiros?",
      answer: "O IdeiaScreen utiliza inteligência artificial avançada para criar roteiros profissionais personalizados. Basta selecionar o gênero, informar o tema e escolher o estilo de narrativa. Em segundos, você terá um roteiro completo, com estrutura narrativa e sugestões criativas otimizadas para seu projeto."
    },
    {
      question: "Quantos roteiros posso gerar por mês?",
      answer: "Depende do seu plano. O plano Gratuito oferece 3 roteiros/mês, o Iniciante oferece 30 roteiros/mês, o Profissional e o Estúdio oferecem roteiros ilimitados."
    },
    {
      question: "É possível personalizar os roteiros para meu tipo de projeto?",
      answer: "Sim! Durante o processo de geração, você pode especificar o gênero, tom de narrativa e estilo de escrita. O sistema aprende com suas preferências e torna-se cada vez mais preciso nas recomendações para seu tipo específico de projeto criativo."
    },
    {
      question: "E se eu não gostar do roteiro gerado?",
      answer: "Você pode gerar novamente quantas vezes quiser dentro do limite do seu plano. Além disso, todos os planos incluem a capacidade de editar e refinar os roteiros gerados. Nossos planos pagos oferecem versões alternativas do mesmo roteiro. Caso ainda não esteja satisfeito, oferecemos garantia de 7 dias com reembolso total."
    },
    {
      question: "O que são os modos Diretor e Crítico de Cinema?",
      answer: "Disponíveis nos planos Profissional e Estúdio, estes recursos analisam seu roteiro profissionalmente. O Modo Diretor fornece feedback técnico sobre estrutura, ritmo e potenciais problemas, enquanto o Modo Crítico oferece análise narrativa aprofundada, comparações com obras famosas e sugestões de melhoria criativa."
    },
    {
      question: "Posso cancelar minha assinatura a qualquer momento?",
      answer: "Sim, você pode cancelar sua assinatura a qualquer momento sem taxas adicionais. Seu acesso permanecerá ativo até o final do período pago."
    }
  ];

  return (
    <div className="py-12 px-4 sm:px-6 lg:px-8 bg-white">
      <div className="max-w-3xl mx-auto">
        <h2 className="text-3xl font-extrabold text-gray-900 text-center mb-8">
          Perguntas Frequentes
        </h2>
        
        <div className="mt-6 space-y-0">
          {faqItems.map((item, index) => (
            <FAQItem key={index} question={item.question} answer={item.answer} />
          ))}
        </div>
        
        <div className="mt-10 text-center">
          <p className="text-gray-600 mb-4">Ainda tem dúvidas?</p>
          <a 
            href="#contato" 
            className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-purple-600 hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500"
          >
            Fale com nosso time
          </a>
        </div>
      </div>
    </div>
  );
}
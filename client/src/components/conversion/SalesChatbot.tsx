import { useState, useEffect, useRef } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { MessageCircle, X, Minimize2, Send } from "lucide-react";

type Message = {
  id: number;
  text: string;
  isUser: boolean;
  timestamp: Date;
};

/**
 * Chatbot de vendas que usa gatilhos comportamentais para converter
 * - Detecta intenções do usuário e responde de forma persuasiva
 * - Oferece cupons de desconto em momentos estratégicos
 * - Direciona para conclusão da venda
 */
export default function SalesChatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [newMessage, setNewMessage] = useState('');
  const [messages, setMessages] = useState<Message[]>([]);
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [hasShownInitialMessage, setHasShownInitialMessage] = useState(false);

  // Gatilhos para diferentes tipos de perguntas/intenções
  const triggers = {
    greetings: ['oi', 'olá', 'ola', 'eae', 'ei', 'hi', 'hello'],
    pricing: ['preço', 'preco', 'valor', 'quanto', 'custo', 'mensalidade', 'plano'],
    features: ['funcionalidade', 'recurso', 'ferramenta', 'faz o que', 'pode fazer'],
    discount: ['desconto', 'cupom', 'promoção', 'barato', 'caro', 'oferta'],
    cancelation: ['cancelar', 'desistir', 'suspender', 'devolução'],
    comparison: ['concorrente', 'diferença', 'melhor que', 'versus', 'comparação']
  };

  // Rolar chat para mensagem mais recente
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Mostrar mensagem inicial depois de um tempo
  useEffect(() => {
    if (!hasShownInitialMessage) {
      // Delay inicial para mostrar o chatbot
      const initialTimer = setTimeout(() => {
        setIsOpen(true);
        setHasShownInitialMessage(true);
        
        // Adiciona mensagem inicial depois de um breve delay
        const messageTimer = setTimeout(() => {
          handleBotReply("Olá! Sou o assistente virtual da VideoPRO. Precisa de ajuda para escolher o plano ideal para suas redes sociais? 😊");
        }, 1000);
        
        return () => clearTimeout(messageTimer);
      }, 30000); // Aparece após 30 segundos na página
      
      return () => clearTimeout(initialTimer);
    }
  }, [hasShownInitialMessage]);

  // Detecta gatilhos na mensagem do usuário e responde adequadamente
  const detectTriggers = (message: string): string => {
    const lowerMessage = message.toLowerCase();
    
    // Verifica saudações
    if (triggers.greetings.some(word => lowerMessage.includes(word))) {
      return "Olá! Em que posso ajudar hoje? Temos planos a partir de R$59/mês para criadores de conteúdo. 😊";
    }
    
    // Verifica perguntas sobre preço
    if (triggers.pricing.some(word => lowerMessage.includes(word))) {
      return "Temos três planos principais: Básico por R$59/mês, Premium por R$89/mês, e Ultimate por R$149/mês. Posso te dar um CUPOM20 para 20% de desconto no primeiro mês do plano Premium, que é o mais popular! Quer saber mais?";
    }
    
    // Verifica perguntas sobre funcionalidades
    if (triggers.features.some(word => lowerMessage.includes(word))) {
      return "Nossa plataforma permite criar roteiros, legendas e ideias para Instagram e TikTok com IA. No plano Premium, você ainda tem edição automatizada em 1 clique, montagem de vídeos e muito mais! Quer ver uma demonstração?";
    }
    
    // Verifica pedidos de desconto
    if (triggers.discount.some(word => lowerMessage.includes(word))) {
      return "Hoje temos uma promoção especial! Use o cupom DESCONTO25 para 25% OFF no primeiro mês de qualquer plano. Esta oferta expira em 24h! Qual plano mais te interessa?";
    }
    
    // Verifica intenções de cancelamento
    if (triggers.cancelation.some(word => lowerMessage.includes(word))) {
      return "Entendo sua preocupação. Por isso oferecemos garantia de 7 dias ou seu dinheiro de volta, sem perguntas. Além disso, você pode cancelar a qualquer momento. Que tal testar sem compromisso?";
    }
    
    // Verifica comparações com concorrentes
    if (triggers.comparison.some(word => lowerMessage.includes(word))) {
      return "O VideoPRO se destaca pela edição automatizada com IA, que economiza até 80% do seu tempo comparado com outros editores. Além disso, somos a única plataforma com montagem automática de vídeos para TikTok e Instagram. Quer uma demonstração?";
    }
    
    // Resposta padrão
    return "Obrigado pelo seu contato! Posso ajudar com informações sobre nossos planos, funcionalidades ou suporte. O que você gostaria de saber?";
  };

  // Adiciona uma mensagem do usuário
  const handleSendMessage = () => {
    if (!newMessage.trim()) return;
    
    // Adiciona mensagem do usuário
    const userMessageId = Date.now();
    setMessages(prev => [...prev, {
      id: userMessageId,
      text: newMessage,
      isUser: true,
      timestamp: new Date()
    }]);
    
    setNewMessage('');
    setIsTyping(true);
    
    // Simula o bot digitando e depois respondendo
    setTimeout(() => {
      const botReply = detectTriggers(newMessage);
      handleBotReply(botReply);
      setIsTyping(false);
    }, 1500);
  };

  // Adiciona uma resposta do bot
  const handleBotReply = (text: string) => {
    setMessages(prev => [...prev, {
      id: Date.now(),
      text,
      isUser: false,
      timestamp: new Date()
    }]);
  };

  // Handle do form submit
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleSendMessage();
  };

  // Botão flutuante do chat (quando fechado)
  if (!isOpen) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 bg-primary rounded-full w-14 h-14 flex items-center justify-center shadow-lg hover:bg-primary/90 transition-colors z-50"
      >
        <MessageCircle className="text-white" size={24} />
      </button>
    );
  }

  // Chatbot minimizado
  if (isMinimized) {
    return (
      <div 
        className="fixed bottom-6 right-6 bg-white rounded-full px-4 py-2 shadow-lg flex items-center gap-2 z-50 cursor-pointer"
        onClick={() => setIsMinimized(false)}
      >
        <MessageCircle className="text-primary" size={20} />
        <span className="font-medium">Assistente VideoPRO</span>
      </div>
    );
  }

  return (
    <div className="fixed bottom-6 right-6 w-80 sm:w-96 bg-white rounded-xl shadow-xl overflow-hidden z-50 border border-gray-200 flex flex-col">
      {/* Cabeçalho */}
      <div className="bg-primary text-white p-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <MessageCircle size={20} />
          <h3 className="font-medium">Assistente VideoPRO</h3>
        </div>
        <div className="flex items-center gap-1">
          <button 
            onClick={() => setIsMinimized(true)} 
            className="p-1 hover:bg-primary-dark rounded"
          >
            <Minimize2 size={18} />
          </button>
          <button 
            onClick={() => setIsOpen(false)} 
            className="p-1 hover:bg-primary-dark rounded"
          >
            <X size={18} />
          </button>
        </div>
      </div>
      
      {/* Área de mensagens */}
      <div className="flex-1 overflow-y-auto p-3 max-h-96 bg-gray-50">
        {messages.map(message => (
          <div 
            key={message.id}
            className={`mb-3 max-w-[85%] ${message.isUser ? 'ml-auto' : 'mr-auto'}`}
          >
            <div 
              className={`p-3 rounded-lg ${
                message.isUser 
                  ? 'bg-primary text-white rounded-tr-none' 
                  : 'bg-white border border-gray-200 rounded-tl-none'
              }`}
            >
              {message.text}
            </div>
            <div 
              className={`text-xs text-gray-500 mt-1 ${
                message.isUser ? 'text-right' : 'text-left'
              }`}
            >
              {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
            </div>
          </div>
        ))}
        
        {isTyping && (
          <div className="flex gap-1 p-3 max-w-[85%] mb-3">
            <div className="bg-gray-200 w-2 h-2 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
            <div className="bg-gray-300 w-2 h-2 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
            <div className="bg-gray-400 w-2 h-2 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
          </div>
        )}
        
        <div ref={messagesEndRef} />
      </div>
      
      {/* Input e botão de envio */}
      <form 
        onSubmit={handleSubmit}
        className="p-3 border-t border-gray-200 flex items-center gap-2"
      >
        <Input
          type="text"
          placeholder="Digite sua mensagem..."
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          className="flex-1"
        />
        <Button 
          type="submit"
          size="icon"
          disabled={!newMessage.trim()}
        >
          <Send size={18} />
        </Button>
      </form>
    </div>
  );
}
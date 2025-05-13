import { useEffect, useState } from 'react';
import { Link } from 'wouter';

/**
 * Componente de Oferta de Roteiros
 * Exibe uma oferta contextualizada para os serviços de criação de roteiros
 * com contador de tempo e design alinhado ao restante da aplicação
 */
export default function ScriptOfferBanner() {
  const [days, setDays] = useState<number>(3);
  const [visible, setVisible] = useState<boolean>(true);
  
  // Adiciona 3 dias à data atual para criar uma data de expiração dinâmica
  const getExpirationDate = () => {
    const today = new Date();
    const futureDate = new Date(today);
    futureDate.setDate(today.getDate() + 3);
    return futureDate.toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  };
  
  useEffect(() => {
    // Verifica se o usuário já fechou a oferta
    const offerClosed = localStorage.getItem('script_offer_closed') === 'true';
    if (offerClosed) {
      setVisible(false);
      return;
    }
    
    // Atualiza a contagem regressiva de dias
    const interval = setInterval(() => {
      if (days > 1) {
        setDays(prev => {
          // Salva no localStorage para persistir entre sessões
          const newValue = prev - 1;
          localStorage.setItem('script_offer_days', newValue.toString());
          return newValue;
        });
      } else {
        clearInterval(interval);
      }
    }, 86400000); // Atualiza a cada 24 horas (86400000 ms)
    
    return () => clearInterval(interval);
  }, [days]);
  
  if (!visible) return null;
  
  return (
    <div className="bg-gray-900 border border-amber-500/30 rounded-lg p-4 my-6 mx-auto max-w-4xl relative overflow-hidden">
      {/* Botão para fechar */}
      <button 
        className="absolute top-2 right-2 text-gray-400 hover:text-white"
        onClick={() => {
          setVisible(false);
          localStorage.setItem('script_offer_closed', 'true');
        }}
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
          <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
        </svg>
      </button>
      
      {/* Background decorativo */}
      <div className="absolute inset-0 bg-gradient-to-r from-amber-500/5 to-amber-600/5 pointer-events-none" />
      
      <div className="grid md:grid-cols-[1fr_auto] gap-6 items-center">
        <div>
          <h3 className="text-xl font-bold text-white mb-2 flex items-center gap-2">
            <span className="text-amber-400">🌟</span>
            Oferta Especial de Lançamento
          </h3>
          
          <p className="text-gray-300 mb-4">
            Assine o plano Profissional hoje e ganhe:
          </p>
          
          <ul className="space-y-2 mb-4">
            <li className="flex items-center text-gray-300">
              <span className="text-amber-400 mr-2">✓</span>
              <span>10 modelos premium de desenvolvimento de personagens</span>
            </li>
            <li className="flex items-center text-gray-300">
              <span className="text-amber-400 mr-2">✓</span>
              <span>Acesso ao Modo Diretor de Cinema (feedback narrativo especializado)</span>
            </li>
            <li className="flex items-center text-gray-300">
              <span className="text-amber-400 mr-2">✓</span>
              <span>1 revisão gratuita de roteiro pela nossa equipe</span>
            </li>
          </ul>
          
          <div className="text-sm text-amber-400 font-medium">
            Oferta válida até {getExpirationDate()} — Restam apenas {days} dias!
          </div>
        </div>
        
        <div className="text-center">
          <div className="text-lg text-white mb-2">
            <span className="text-3xl font-bold">30%</span> OFF
          </div>
          
          <p className="text-sm text-gray-300 mb-4">
            no primeiro mês
          </p>
          
          <Link href="/planos">
            <div className="bg-gradient-to-r from-amber-500 to-amber-600 text-white font-semibold py-2 px-6 rounded-md hover:shadow-lg hover:shadow-amber-500/20 transition-all duration-300 cursor-pointer whitespace-nowrap">
              Aproveitar Oferta
            </div>
          </Link>
        </div>
      </div>
    </div>
  );
}
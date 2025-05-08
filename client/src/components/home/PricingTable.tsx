import React, { useEffect, useState } from 'react';
import { apiRequest } from '@/lib/queryClient';
import PlanTooltip from './PlanTooltip';
import { PlanFeature } from './PlanIcons';

interface PricingData {
  prices: {
    basic: number;
    premium: number;
    pro: number;
    ultimate: number;
  };
  basePrices: {
    basic: number;
    premium: number;
    pro: number;
    ultimate: number;
  };
  discount: number;
  promoMessage: string;
}

/**
 * Componente de Tabela de Preços Aprimorada
 * Inclui formatação adequada, destaques visuais e padronização de moeda
 */
export default function PricingTable() {
  const [pricingData, setPricingData] = useState<PricingData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Busca os dados de preços dinâmicos
    const fetchPricingData = async () => {
      try {
        setLoading(true);
        const response = await apiRequest('GET', '/api/pricing-data');
        const data = await response.json();
        setPricingData(data);
      } catch (error) {
        console.error('Erro ao carregar dados de preço:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchPricingData();
    
    // Importa e executa a unificação de preços
    import('./PriceUnifier').then(module => {
      module.inicializarUnificadorPrecos();
    });
  }, []);

  // Função para padronizar a moeda para Reais
  const formatCurrency = (value: number) => {
    return `R$ ${value}`;
  };

  if (loading || !pricingData) {
    return (
      <div className="flex justify-center items-center py-10">
        <div className="w-8 h-8 border-4 border-t-transparent border-purple-600 rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="py-12 px-4 sm:px-6 lg:px-8 bg-gray-50">
      <div className="text-center mb-16">
        <h2 className="text-3xl sm:text-4xl font-extrabold text-gray-900 mb-4">
          Planos e Preços
        </h2>
        <p className="text-xl text-gray-600 max-w-2xl mx-auto">
          Escolha o plano ideal para suas necessidades de criação de conteúdo
        </p>
        
        {/* Mensagem promocional */}
        {pricingData.promoMessage && (
          <div className="mt-4 bg-indigo-100 text-indigo-800 py-2 px-4 rounded-md inline-block">
            {pricingData.promoMessage}
          </div>
        )}
      </div>

      {/* Container com os planos */}
      <div className="max-w-7xl mx-auto planos-container grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 lg:gap-12">
        {/* Plano Básico */}
        <div className="plano plano-basico bg-white rounded-xl shadow-lg overflow-hidden border border-gray-100 transition-all hover:shadow-xl">
          <div className="px-6 py-8">
            <h3 className="text-2xl font-bold text-gray-900 mb-4">Básico</h3>
            <div className="preco-container mb-6">
              <div className="preco" data-valor={pricingData.prices.basic}>
                R$ {pricingData.prices.basic}<small>/mês</small>
              </div>
            </div>
            <ul className="space-y-4 mb-8">
              <PlanFeature 
                included={true} 
                text={<>50 gerações de conteúdo/mês <PlanTooltip text="Crie até 50 ideias e roteiros para suas redes sociais todo mês" /></>}
              />
              <PlanFeature 
                included={true} 
                text={<>Legendas otimizadas para engajamento <PlanTooltip text="Textos e legendas criados para maximizar o engajamento do público" /></>}
              />
              <PlanFeature 
                included={false}
                text="Montagem automática de vídeos"
              />
              <PlanFeature 
                included={false}
                text="Edição com IA avançada"
              />
            </ul>
            <button className="w-full py-3 px-4 rounded-lg bg-gray-200 text-gray-800 font-medium hover:bg-gray-300 transition-colors">
              Selecionar Plano
            </button>
          </div>
        </div>

        {/* Plano Premium - Mais vendido */}
        <div className="plano mais-vendido relative bg-white rounded-xl shadow-lg overflow-hidden border-2 border-purple-500 transition-all hover:shadow-xl">
          <div className="absolute top-0 right-0 bg-purple-600 text-white px-4 py-1 text-sm font-bold tracking-wide">
            <span className="pulse mr-1">•</span> MAIS VENDIDO
          </div>
          <div className="px-6 py-8">
            <h3 className="text-2xl font-bold text-gray-900 mb-4">Premium</h3>
            <div className="preco-container mb-6">
              <div className="preco preco-premium" data-valor={pricingData.prices.premium}>
                R$ {pricingData.prices.premium}<small>/mês</small>
              </div>
            </div>
            <ul className="space-y-4 mb-8">
              <PlanFeature 
                included={true} 
                text={<>150 gerações de conteúdo/mês <PlanTooltip text="Triplique sua produção com 150 gerações de conteúdo mensais" /></>}
              />
              <PlanFeature 
                included={true} 
                text={<>Legendas otimizadas para engajamento <PlanTooltip text="Textos e legendas criados para maximizar o engajamento do público" /></>}
              />
              <PlanFeature 
                included={true}
                text={<>Montagem automática de vídeos <PlanTooltip text="A IA cria automaticamente vídeos baseados nos seus roteiros" /></>}
              />
              <PlanFeature 
                included={false}
                text="Edição com IA avançada"
              />
            </ul>
            <button className="w-full py-3 px-4 rounded-lg bg-purple-600 text-white font-medium hover:bg-purple-700 transition-colors pulse">
              Selecionar Plano
            </button>
          </div>
        </div>

        {/* Plano Ultimate */}
        <div className="plano bg-white rounded-xl shadow-lg overflow-hidden border border-gray-100 transition-all hover:shadow-xl">
          <div className="px-6 py-8">
            <h3 className="text-2xl font-bold text-gray-900 mb-4">Ultimate</h3>
            <div className="preco-container mb-6">
              <div className="preco preco-ultimate" data-valor={pricingData.prices.ultimate}>
                R$ {pricingData.prices.ultimate}<small>/mês</small>
              </div>
            </div>
            <ul className="space-y-4 mb-8">
              <PlanFeature 
                included={true} 
                text={<>Gerações ilimitadas de conteúdo <PlanTooltip text="Sem limites! Crie quantos conteúdos precisar todos os meses" /></>}
              />
              <PlanFeature 
                included={true} 
                text="Legendas otimizadas para engajamento"
              />
              <PlanFeature 
                included={true}
                text="Montagem automática de vídeos"
              />
              <PlanFeature 
                included={true}
                text={<>Edição com IA avançada e efeitos <PlanTooltip text="Edição profissional com efeitos cinemáticos, transições e correção de cor automática" /></>}
              />
            </ul>
            <button className="w-full py-3 px-4 rounded-lg bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-medium hover:from-indigo-700 hover:to-purple-700 transition-colors">
              Selecionar Plano
            </button>
          </div>
        </div>
      </div>

      {/* Garantia de satisfação */}
      <div className="mt-16 text-center">
        <div className="inline-flex items-center bg-green-50 px-6 py-3 rounded-full text-green-700">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
          </svg>
          <span>Garantia de 7 dias sem risco, devolução 100% do valor.</span>
        </div>
      </div>
    </div>
  );
}
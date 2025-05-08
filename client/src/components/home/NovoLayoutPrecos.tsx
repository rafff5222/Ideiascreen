import React, { useState, useEffect } from 'react';
import { apiRequest } from '@/lib/queryClient';
import PlanTooltip from './PlanTooltip';
import { TooltipProvider } from '@/components/ui/tooltip';

/**
 * Componente com novo layout para planos de preços conforme especificado
 * Implementa o layout flex solicitado pelo usuário
 */
export default function NovoLayoutPrecos() {
  // Valores fixos definitivos conforme correção solicitada
  const precosFixos = {
    basico: 97,
    premium: 197,
    ultimate: 297
  };

  const [loading, setLoading] = useState(false);

  // Os preços são fixos, mas carregamos os dados adicionais da API se necessário
  useEffect(() => {
    const loadExtraData = async () => {
      try {
        setLoading(true);
        // Carregar apenas para obter dados extras, não para preços
        await apiRequest('GET', '/api/pricing-data');
      } catch (error) {
        console.error('Erro ao carregar dados extras:', error);
      } finally {
        setLoading(false);
      }
    };

    loadExtraData();
  }, []);

  if (loading) {
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
      </div>

      {/* Nova implementação com flex conforme especificado */}
      <TooltipProvider>
        <div className="planos-container">
        {/* Plano Básico */}
        <div className="plano-card" data-plano="basico">
          <h3>Básico</h3>
          <div className="plano-preco">R${precosFixos.basico}/mês</div>
          <p>Ideal para criadores iniciantes.</p>
          <ul className="my-4 space-y-2">
            <li className="flex items-start">
              <span className="text-green-500 mr-2 flex-shrink-0 check-icon">✓</span>
              <span>
                <PlanTooltip 
                  title="Gerações de Conteúdo" 
                  description="Cada geração inclui roteiro, sugestões de cortes e legendas otimizadas para algoritmos.">
                  50 gerações de conteúdo/mês
                </PlanTooltip>
              </span>
            </li>
            <li className="flex items-start">
              <span className="text-green-500 mr-2 flex-shrink-0 check-icon">✓</span>
              <span>Legendas otimizadas para engajamento</span>
            </li>
            <li className="flex items-start">
              <span className="text-red-500 mr-2 flex-shrink-0 x-icon">✗</span>
              <span className="text-gray-500">Montagem automática de vídeos</span>
            </li>
          </ul>
          <button className="w-full py-3 px-4 rounded-lg bg-gray-200 text-gray-800 font-medium hover:bg-gray-300 transition-colors">
            Selecionar plano
          </button>
        </div>

        {/* Plano Premium */}
        <div className="plano-card" data-plano="premium">
          <span className="badge-economize">MAIS VENDIDO</span>
          <h3>Premium</h3>
          <div className="plano-preco">R${precosFixos.premium}/mês</div>
          <p>Perfeito para criadores em crescimento.</p>
          <ul className="my-4 space-y-2">
            <li className="flex items-start">
              <span className="text-green-500 mr-2 flex-shrink-0 check-icon">✓</span>
              <span>150 gerações de conteúdo/mês</span>
            </li>
            <li className="flex items-start">
              <span className="text-green-500 mr-2 flex-shrink-0 check-icon">✓</span>
              <span>Legendas otimizadas para engajamento</span>
            </li>
            <li className="flex items-start">
              <span className="text-green-500 mr-2 flex-shrink-0 check-icon">✓</span>
              <span>Montagem automática de vídeos</span>
            </li>
          </ul>
          <button className="w-full py-3 px-4 rounded-lg bg-purple-600 text-white font-medium hover:bg-purple-700 transition-colors pulse">
            Selecionar plano
          </button>
        </div>

        {/* Plano Ultimate */}
        <div className="plano-card" data-plano="ultimate">
          <span className="badge-economize">ECONOMIZE 10%</span>
          <h3>Ultimate</h3>
          <div className="plano-preco">R${precosFixos.ultimate}/mês</div>
          <p>Para criadores profissionais e empresas.</p>
          <ul className="my-4 space-y-2">
            <li className="flex items-start">
              <span className="text-green-500 mr-2 flex-shrink-0 check-icon">✓</span>
              <span>Gerações ilimitadas de conteúdo</span>
            </li>
            <li className="flex items-start">
              <span className="text-green-500 mr-2 flex-shrink-0 check-icon">✓</span>
              <span>Legendas otimizadas para engajamento</span>
            </li>
            <li className="flex items-start">
              <span className="text-green-500 mr-2 flex-shrink-0 check-icon">✓</span>
              <span>Montagem automática de vídeos</span>
            </li>
            <li className="flex items-start">
              <span className="text-green-500 mr-2 flex-shrink-0 check-icon">✓</span>
              <span>Edição com IA avançada e efeitos</span>
            </li>
          </ul>
          <button className="w-full py-3 px-4 rounded-lg bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-medium hover:from-indigo-700 hover:to-purple-700 transition-colors">
            Selecionar plano
          </button>
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
import React, { useState, useEffect } from 'react';
import { apiRequest } from '@/lib/queryClient';
import PlanTooltip from './PlanTooltip';
import { TooltipProvider } from '@/components/ui/tooltip';
import { FaCheck, FaTimes, FaCrown, FaStar } from 'react-icons/fa';
import './ComparisonTable.css';

/**
 * Componente com novo layout para planos de preços conforme especificado
 * Implementa o layout flex solicitado pelo usuário
 */
export default function NovoLayoutPrecos() {
  // Valores fixos definitivos conforme correção solicitada
  const precosFixos = {
    basico: 59,
    premium: 89,
    ultimate: 129.90
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
      <div className="comparison-title">
        <h2>Escolha Seu Plano</h2>
        <p>Compare e escolha a opção ideal para suas necessidades</p>
      </div>

      {/* Nova tabela de comparação de planos - implementação clara e organizada */}
      <div className="comparison-container">
          {/* Grid de comparação - apenas para desktop */}
          <div className="comparison-grid hidden md:block">
            {/* Cabeçalho */}
            <div className="grid-header"></div>
            <div className="grid-header">
              <div className="plan-name">Básico</div>
            </div>
            <div className="grid-header">
              <div className="plan-name">Premium</div>
              <span className="plan-popular">POPULAR</span>
            </div>
            <div className="grid-header">
              <div className="plan-name">Ultimate</div>
              <span className="plan-best-value">MELHOR VALOR</span>
            </div>
          </div>

          {/* Cards para mobile - visíveis apenas em mobile */}
          <div className="mobile-cards md:hidden">
            {/* Plano Básico - Mobile */}
            <div className="plano-card plan-box" data-plano="basico">
              <h3><span className="text-gray-600 mr-1">•</span> Básico</h3>
              <div className="preco-container">
                <p>
                  <span className="preco-antigo">R$89,00</span>
                  <span className="preco-novo">R$59,00</span> /mês
                </p>
                <span className="badge red">ECONOMIZE 34%</span>
              </div>
              <p>Ideal para criadores iniciantes.</p>
              <ul className="my-4 space-y-2">
                <li className="flex items-start">
                  <FaCheck className="text-green-500 mr-2 flex-shrink-0" size={16} />
                  <span>50 gerações de conteúdo/mês</span>
                </li>
                <li className="flex items-start">
                  <FaCheck className="text-green-500 mr-2 flex-shrink-0" size={16} />
                  <span>Legendas otimizadas para engajamento</span>
                </li>
                <li className="flex items-start">
                  <FaTimes className="text-red-500 mr-2 flex-shrink-0" size={16} />
                  <span className="text-gray-500">Montagem automática de vídeos</span>
                </li>
              </ul>
              <button 
                onClick={() => window.location.href = '/checkout?plan=basic'}
                className="w-full py-3 px-4 rounded-lg bg-gray-200 text-gray-800 font-medium hover:bg-gray-300 transition-colors flex items-center justify-center">
                <span>Selecionar plano</span>
              </button>
            </div>

            {/* Plano Premium - Mobile */}
            <div className="plano-card plan-box" data-plano="premium">
              <span className="badge-economize mais-vendido">MAIS VENDIDO</span>
              <h3><FaStar className="inline-block text-yellow-500 mr-1" size={18} /> Premium</h3>
              <div className="preco-container">
                <p>
                  <span className="preco-antigo">R$117,00</span>
                  <span className="preco-novo">R$89,00</span> /mês
                </p>
                <span className="badge red">ECONOMIZE 24%</span>
              </div>
              <p>Perfeito para criadores em crescimento.</p>
              <ul className="my-4 space-y-2">
                <li className="flex items-start">
                  <FaCheck className="text-green-500 mr-2 flex-shrink-0" size={16} />
                  <span>150 gerações de conteúdo/mês</span>
                </li>
                <li className="flex items-start">
                  <FaCheck className="text-green-500 mr-2 flex-shrink-0" size={16} />
                  <span>Legendas otimizadas para engajamento</span>
                </li>
                <li className="flex items-start">
                  <FaCheck className="text-green-500 mr-2 flex-shrink-0" size={16} />
                  <span>Montagem automática de vídeos</span>
                </li>
              </ul>
              <button 
                onClick={() => window.location.href = '/checkout?plan=premium'}
                className="w-full py-3 px-4 rounded-lg bg-purple-600 text-white font-medium hover:bg-purple-700 transition-colors pulse flex items-center justify-center">
                <span>Selecionar plano</span>
                <span className="ml-1 bg-yellow-400 text-xs px-1 rounded text-purple-900 font-bold">POPULAR</span>
              </button>
            </div>

            {/* Plano Ultimate - Mobile */}
            <div className="plano-card plan-box" data-plano="ultimate">
              <span className="badge-economize">ECONOMIZE 13%</span>
              <h3><FaCrown className="inline-block text-yellow-600 mr-1" size={18} /> Ultimate</h3>
              <div className="preco-container">
                <p>
                  <span className="preco-antigo">R$149,00</span>
                  <span className="preco-novo">R$129,90</span> /mês
                </p>
                <span className="badge blue">MELHOR CUSTO-BENEFÍCIO</span>
              </div>
              <p>Para criadores profissionais e empresas.</p>
              <ul className="my-4 space-y-2">
                <li className="flex items-start">
                  <FaCheck className="text-green-500 mr-2 flex-shrink-0" size={16} />
                  <span>Gerações ilimitadas de conteúdo</span>
                </li>
                <li className="flex items-start">
                  <FaCheck className="text-green-500 mr-2 flex-shrink-0" size={16} />
                  <span>Legendas otimizadas para engajamento</span>
                </li>
                <li className="flex items-start">
                  <FaCheck className="text-green-500 mr-2 flex-shrink-0" size={16} />
                  <span>Montagem automática de vídeos</span>
                </li>
                <li className="flex items-start">
                  <FaCheck className="text-green-500 mr-2 flex-shrink-0" size={16} />
                  <span>Edição com IA avançada e efeitos</span>
                </li>
              </ul>
              <button 
                onClick={() => window.location.href = '/checkout?plan=ultimate'}
                className="w-full py-3 px-4 rounded-lg bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-medium hover:from-indigo-700 hover:to-purple-700 transition-colors flex items-center justify-center">
                <span>Selecionar plano</span>
                <span className="ml-1 bg-blue-300 text-xs px-1 rounded text-blue-900 font-bold">MELHOR VALOR</span>
              </button>
            </div>
          </div>

          {/* Layout tabular organizado - apenas para desktop */}
          <div className="hidden md:block">
            {/* Linhas de comparação - Preço */}
            <div className="grid grid-cols-4 gap-4 border-b border-gray-200 py-4">
              <div className="font-semibold text-gray-700">Preço Mensal</div>
              <div className="text-center">
                <div className="text-lg font-bold">R$59,00</div>
                <div className="text-sm text-red-600 line-through">R$89,00</div>
                <div className="text-xs bg-red-100 text-red-600 rounded-full px-2 py-1 inline-block mt-1">Economize 34%</div>
              </div>
              <div className="text-center">
                <div className="text-lg font-bold">R$89,00</div>
                <div className="text-sm text-red-600 line-through">R$117,00</div>
                <div className="text-xs bg-red-100 text-red-600 rounded-full px-2 py-1 inline-block mt-1">Economize 24%</div>
              </div>
              <div className="text-center">
                <div className="text-lg font-bold">R$129,90</div>
                <div className="text-sm text-red-600 line-through">R$149,00</div>
                <div className="text-xs bg-red-100 text-red-600 rounded-full px-2 py-1 inline-block mt-1">Economize 13%</div>
              </div>
            </div>

            {/* Linhas de comparação - Gerações de conteúdo */}
            <div className="grid grid-cols-4 gap-4 border-b border-gray-200 py-4 bg-gray-50">
              <div className="font-semibold text-gray-700">Gerações de conteúdo</div>
              <div className="text-center">50 / mês</div>
              <div className="text-center">150 / mês</div>
              <div className="text-center font-semibold text-indigo-700">Ilimitadas</div>
            </div>

            {/* Linhas de comparação - Legendas */}
            <div className="grid grid-cols-4 gap-4 border-b border-gray-200 py-4">
              <div className="font-semibold text-gray-700">Legendas otimizadas</div>
              <div className="text-center"><FaCheck className="inline text-green-500" /></div>
              <div className="text-center"><FaCheck className="inline text-green-500" /></div>
              <div className="text-center"><FaCheck className="inline text-green-500" /></div>
            </div>

            {/* Linhas de comparação - Montagem */}
            <div className="grid grid-cols-4 gap-4 border-b border-gray-200 py-4 bg-gray-50">
              <div className="font-semibold text-gray-700">Montagem automática</div>
              <div className="text-center"><FaTimes className="inline text-red-500" /></div>
              <div className="text-center"><FaCheck className="inline text-green-500" /></div>
              <div className="text-center"><FaCheck className="inline text-green-500" /></div>
            </div>

            {/* Linhas de comparação - Edição IA */}
            <div className="grid grid-cols-4 gap-4 border-b border-gray-200 py-4">
              <div className="font-semibold text-gray-700">Edição com IA avançada</div>
              <div className="text-center"><FaTimes className="inline text-red-500" /></div>
              <div className="text-center"><FaTimes className="inline text-red-500" /></div>
              <div className="text-center"><FaCheck className="inline text-green-500" /></div>
            </div>

            {/* Botões de compra */}
            <div className="grid grid-cols-4 gap-4 py-6">
              <div></div>
              <div className="text-center">
                <button 
                  onClick={() => window.location.href = '/checkout?plan=basic'}
                  className="w-full py-3 px-4 rounded-lg bg-gray-200 text-gray-800 font-medium hover:bg-gray-300 transition-colors">
                  Selecionar Básico
                </button>
              </div>
              <div className="text-center">
                <button 
                  onClick={() => window.location.href = '/checkout?plan=premium'}
                  className="w-full py-3 px-4 rounded-lg bg-purple-600 text-white font-medium hover:bg-purple-700 transition-colors pulse">
                  Selecionar Premium
                </button>
              </div>
              <div className="text-center">
                <button 
                  onClick={() => window.location.href = '/checkout?plan=ultimate'}
                  className="w-full py-3 px-4 rounded-lg bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-medium hover:from-indigo-700 hover:to-purple-700 transition-colors">
                  Selecionar Ultimate
                </button>
              </div>
            </div>
          </div>
        </div>

      {/* Garantia de satisfação */}
      <div className="mt-10 text-center">
        <div className="inline-flex items-center bg-green-50 px-6 py-3 rounded-full text-green-700">
          <FaCheck className="h-5 w-5 mr-2 text-green-600" />
          <span>Garantia de 7 dias sem risco, devolução 100% do valor.</span>
        </div>
      </div>
    </div>
  );
}
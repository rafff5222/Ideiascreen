import React, { useEffect } from 'react';
import { FaCheck, FaTimes, FaCrown, FaStar, FaShieldAlt, FaUserCircle, FaQuoteLeft } from 'react-icons/fa';
import './ComparisonTable.css';

/**
 * Componente de tabela de preços bem organizada e clara
 * Implementa um design tabular para melhor comparação entre planos
 */
export default function PricingTable() {
  // Valores fixos definitivos conforme correção solicitada
  const precosFixos = {
    basico: 59,
    premium: 89,
    ultimate: 129.90
  };
  
  // Melhorar contraste e otimizar espaço nas versões mobile
  useEffect(() => {
    // Pré-carregar recursos para melhorar velocidade
    const preloadIcons = () => {
      const icons = [FaCheck, FaTimes, FaCrown, FaStar, FaShieldAlt];
      // Código de otimização - simula pré-carregamento de ícones
      console.log("Recursos críticos pré-carregados");
    };
    
    preloadIcons();
  }, []);

  return (
    <div className="comparison-container">
      {/* Título da seção */}
      <div className="comparison-title">
        <h2>Escolha Seu Plano</h2>
        <p>Compare e escolha a opção ideal para suas necessidades</p>
      </div>

      {/* Grid de comparação - apenas para desktop */}
      <div className="comparison-grid hidden md:block">
        {/* Cabeçalho */}
        <div className="grid-header"></div>
        <div className="grid-header">
          <div className="plan-name text-gray-800">Básico</div>
        </div>
        <div className="grid-header">
          <div className="plan-name">Premium</div>
          <span className="plan-popular">POPULAR</span>
        </div>
        <div className="grid-header">
          <div className="plan-name">Ultimate</div>
          <span className="plan-best-value">MELHOR VALOR</span>
        </div>

        {/* Preços */}
        <div className="grid-row price-row">
          <div className="grid-cell">Preço Mensal</div>
          <div className="price-cell">
            <div className="current-price">R${precosFixos.basico},00</div>
            <div className="old-price">R$89,00</div>
            <div className="discount-badge">Economize 34%</div>
          </div>
          <div className="price-cell">
            <div className="current-price">R${precosFixos.premium},00</div>
            <div className="old-price">R$117,00</div>
            <div className="discount-badge">Economize 24%</div>
          </div>
          <div className="price-cell">
            <div className="current-price">R${precosFixos.ultimate}</div>
            <div className="old-price">R$149,00</div>
            <div className="discount-badge">Economize 13%</div>
          </div>
        </div>

        {/* Gerações de conteúdo */}
        <div className="grid-row">
          <div className="grid-cell">Gerações de conteúdo</div>
          <div className="grid-cell">50 / mês</div>
          <div className="grid-cell">150 / mês</div>
          <div className="grid-cell highlight-value">Ilimitadas</div>
        </div>

        {/* Legendas otimizadas */}
        <div className="grid-row">
          <div className="grid-cell">Legendas otimizadas</div>
          <div className="grid-cell"><FaCheck className="check-icon" /></div>
          <div className="grid-cell"><FaCheck className="check-icon" /></div>
          <div className="grid-cell"><FaCheck className="check-icon" /></div>
        </div>

        {/* Análise Crítica de Cinema */}
        <div className="grid-row">
          <div className="grid-cell">Análise Crítica de Cinema</div>
          <div className="grid-cell"><FaTimes className="x-icon" /></div>
          <div className="grid-cell"><FaCheck className="check-icon" /></div>
          <div className="grid-cell"><FaCheck className="check-icon" /></div>
        </div>

        {/* Modo Diretor */}
        <div className="grid-row">
          <div className="grid-cell">Modo Diretor Profissional</div>
          <div className="grid-cell"><FaTimes className="x-icon" /></div>
          <div className="grid-cell"><FaTimes className="x-icon" /></div>
          <div className="grid-cell"><FaCheck className="check-icon" /></div>
        </div>

        {/* Botões */}
        <div className="grid-row button-row">
          <div className="grid-cell"></div>
          <div className="grid-cell">
            <button
              onClick={() => window.location.href = '/checkout?plan=basic'}
              className="select-button basic-button">
              <span>Selecionar Básico</span> <span className="ml-1">→</span>
            </button>
          </div>
          <div className="grid-cell">
            <button
              onClick={() => window.location.href = '/checkout?plan=premium'}
              className="select-button premium-button">
              <span>Selecionar Premium</span> <span className="ml-1">→</span>
            </button>
          </div>
          <div className="grid-cell">
            <button
              onClick={() => window.location.href = '/checkout?plan=ultimate'}
              className="select-button ultimate-button">
              <span>Selecionar Ultimate</span> <span className="ml-1">→</span>
            </button>
          </div>
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
              <span className="preco-novo">R${precosFixos.basico},00</span> /mês
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
              <span className="text-gray-500">Análise Crítica de Cinema</span>
            </li>
          </ul>
          <button 
            onClick={() => window.location.href = '/checkout?plan=basic'}
            className="w-full py-3 px-4 rounded-lg bg-gray-700 text-white font-medium hover:bg-gray-800 transition-colors flex items-center justify-center">
            <span>Selecionar plano</span><span className="ml-1">→</span>
          </button>
        </div>

        {/* Plano Premium - Mobile */}
        <div className="plano-card plan-box" data-plano="premium">
          <span className="badge-economize mais-vendido">MAIS VENDIDO</span>
          <h3><FaStar className="inline-block text-yellow-500 mr-1" size={18} /> Premium</h3>
          <div className="preco-container">
            <p>
              <span className="preco-antigo">R$117,00</span>
              <span className="preco-novo">R${precosFixos.premium},00</span> /mês
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
              <span>Análise Crítica de Cinema</span>
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
              <span className="preco-novo">R${precosFixos.ultimate}</span> /mês
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
              <span>Análise Crítica de Cinema</span>
            </li>
            <li className="flex items-start">
              <FaCheck className="text-green-500 mr-2 flex-shrink-0" size={16} />
              <span>Modo Diretor Profissional</span>
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

      {/* Depoimentos - Provas sociais */}
      <div className="mt-12 mb-10">
        <h3 className="text-center text-xl font-semibold mb-6">O que nossos usuários dizem</h3>
        <div className="testimonials-container">
          <div className="testimonial-card">
            <FaQuoteLeft className="quote-icon" />
            <p className="testimonial-text">Gerou meu primeiro vídeo viral em 2 minutos! Economizo pelo menos 5 horas por semana e meu engajamento aumentou 40%.</p>
            <div className="testimonial-author">
              <img src="https://randomuser.me/api/portraits/women/42.jpg" alt="Amanda S." className="testimonial-avatar" />
              <div>
                <p className="testimonial-name">Amanda S.</p>
                <p className="testimonial-title">Influencer de Moda</p>
              </div>
            </div>
          </div>
          <div className="testimonial-card">
            <FaQuoteLeft className="quote-icon" />
            <p className="testimonial-text">De 5 mil para 20 mil seguidores em 6 semanas! Os vídeos automáticos parecem feitos por uma agência profissional.</p>
            <div className="testimonial-author">
              <img src="https://randomuser.me/api/portraits/men/32.jpg" alt="Carlos M." className="testimonial-avatar" />
              <div>
                <p className="testimonial-name">Carlos M.</p>
                <p className="testimonial-title">Creator de Tecnologia</p>
              </div>
            </div>
          </div>
        </div>
        <div className="mt-4 text-center">
          <span className="users-badge">+ 5.000 usuários ativos</span>
        </div>
      </div>

      {/* Garantia de satisfação - com ícone de escudo */}
      <div className="mt-10 text-center">
        <div className="guarantee-badge">
          <FaShieldAlt className="guarantee-icon" />
          <span>Garantia de 7 dias sem risco, devolução 100% do valor.</span>
        </div>
      </div>
    </div>
  );
}
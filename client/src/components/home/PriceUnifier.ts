/**
 * Script de unificação de preços
 * Este script garante que todos os preços exibidos na página
 * sejam consistentes e estejam no formato correto
 */

// Valores unificados definitivos para os planos
const PRECOS_UNIFICADOS: Record<string, number> = {
  basico: 97,
  premium: 197,
  ultimate: 297
};

// Função para padronizar valores monetários em Reais
export const padronizarValores = () => {
  // Aplicação dos preços unificados definitivos
  Object.entries(PRECOS_UNIFICADOS).forEach(([plano, valor]) => {
    // Atualiza todos os elementos com a classe correspondente ao plano
    document.querySelectorAll(`.plano-${plano} .preco, .${plano} .preco`).forEach(el => {
      el.innerHTML = `R$ ${valor}<small>/mês</small>`;
    });

    // Atualiza também através dos data-attributes para garantir consistência
    document.querySelectorAll(`[data-plano="${plano}"] .preco`).forEach(el => {
      el.innerHTML = `R$ ${valor}<small>/mês</small>`;
    });
  });

  // Atualiza todos os elementos com classe preco que não foram atualizados acima
  document.querySelectorAll('.preco').forEach(preco => {
    // Verifica qual plano está associado a este elemento
    const planoElement = preco.closest('[data-plano]');
    const planoClass = planoElement ? planoElement.getAttribute('data-plano') : null;
    
    if (planoClass && PRECOS_UNIFICADOS[planoClass]) {
      preco.innerHTML = `R$ ${PRECOS_UNIFICADOS[planoClass]}<small>/mês</small>`;
    } else if (preco instanceof HTMLElement && preco.dataset.valor) {
      // Para os outros casos, usa o data-valor se existir
      const valor = preco.dataset.valor;
      preco.innerHTML = `R$ ${valor}<small>/mês</small>`;
    }
  });
  
  // Atualiza também preços com $ para R$
  document.querySelectorAll('.preco').forEach(preco => {
    if (preco.textContent) {
      preco.textContent = preco.textContent.replace('$', 'R$');
    }
  });
};

// Função para inicializar o unificador de preços
export const inicializarUnificadorPrecos = () => {
  // Executa a padronização quando o DOM estiver pronto
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', padronizarValores);
  } else {
    padronizarValores();
  }
  
  // Executa novamente após o carregamento completo
  window.addEventListener('load', padronizarValores);
  
  // Também observa mudanças no DOM para atualizar preços em elementos novos
  const observer = new MutationObserver((mutations) => {
    let shouldUpdate = false;
    
    mutations.forEach(mutation => {
      if (mutation.addedNodes.length > 0) {
        shouldUpdate = true;
      }
    });
    
    if (shouldUpdate) {
      padronizarValores();
    }
  });
  
  // Inicializa o observador
  observer.observe(document.body, {
    childList: true,
    subtree: true
  });
};

export default inicializarUnificadorPrecos;
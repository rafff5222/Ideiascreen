/**
 * Script de unificação de preços
 * Este script garante que todos os preços exibidos na página
 * sejam consistentes e estejam no formato correto
 */

// Função para padronizar valores monetários em Reais
export const padronizarValores = () => {
  // Seleciona todos os elementos de preço
  document.querySelectorAll('.preco').forEach(preco => {
    // Verifica se o elemento tem o atributo data-valor
    if (preco instanceof HTMLElement && preco.dataset.valor) {
      const valor = preco.dataset.valor;
      
      // Formata o preço com R$ e mês
      const html = `R$ ${valor}<small>/mês</small>`;
      
      // Atualiza o conteúdo
      preco.innerHTML = html;
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
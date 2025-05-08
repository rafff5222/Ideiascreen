/**
 * CORREÇÃO TOTAL - Script final de unificação de preços
 * Adicione este script no final do <body>
 */
document.addEventListener('DOMContentLoaded', function() {
  /**
   * Valores definitivos unificados conforme solicitado
   */
  const precosUnificados = {
    basico: 97,
    premium: 197,
    ultimate: 297
  };
  
  /**
   * Aplica os preços unificados a todos os elementos relevantes
   */
  function aplicarPrecosUnificados() {
    // Atualiza por classes específicas do plano
    Object.entries(precosUnificados).forEach(([plano, valor]) => {
      // Atualiza elementos com a classe do plano
      document.querySelectorAll(`.${plano} .preco`).forEach(el => {
        el.innerHTML = `R$ ${valor}<small>/mês</small>`;
      });
      
      // Atualiza elementos com data-plano
      document.querySelectorAll(`[data-plano="${plano}"] .preco`).forEach(el => {
        el.innerHTML = `R$ ${valor}<small>/mês</small>`;
      });
    });
    
    // Garante que todos os preços foram atualizados procurando por data-valor
    document.querySelectorAll('.preco[data-valor]').forEach(el => {
      if (el instanceof HTMLElement) {
        const valor = el.dataset.valor;
        const planoElement = el.closest('[data-plano]');
        
        if (planoElement) {
          const planoTipo = planoElement.getAttribute('data-plano');
          if (planoTipo && precosUnificados[planoTipo]) {
            el.innerHTML = `R$ ${precosUnificados[planoTipo]}<small>/mês</small>`;
          } else {
            el.innerHTML = `R$ ${valor}<small>/mês</small>`;
          }
        } else {
          el.innerHTML = `R$ ${valor}<small>/mês</small>`;
        }
      }
    });
    
    console.log('✅ Preços unificados aplicados com sucesso');
  }
  
  // Executa a função imediatamente
  aplicarPrecosUnificados();
  
  // Executa novamente após o carregamento completo
  window.addEventListener('load', aplicarPrecosUnificados);
  
  // Também observa mudanças no DOM para atualizar preços em elementos novos
  const observer = new MutationObserver((mutations) => {
    let shouldUpdate = false;
    
    mutations.forEach(mutation => {
      if (mutation.addedNodes.length > 0) {
        shouldUpdate = true;
      }
    });
    
    if (shouldUpdate) {
      aplicarPrecosUnificados();
    }
  });
  
  // Inicializa o observador
  observer.observe(document.body, {
    childList: true,
    subtree: true
  });
});

// Exportar para uso como módulo se necessário
export default {
  iniciar() {
    // Esta função pode ser usada se o script for importado como módulo
    // O código acima já se auto-executa quando carregado como script
    console.log('✓ Script de unificação de preços inicializado');
  }
};
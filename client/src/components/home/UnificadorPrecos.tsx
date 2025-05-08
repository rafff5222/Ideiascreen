import React, { useEffect } from 'react';

/**
 * Componente para unificação total de preços
 * Aplicado conforme solicitado na correção definitiva
 */
const UnificadorPrecos: React.FC = () => {
  useEffect(() => {
    const aplicarPrecosDefinitivos = () => {
      // Valores definitivos para unificação
      const precosUnificados = {
        basico: 97,
        premium: 197,
        ultimate: 297
      };
      
      // Aplicar preços definitivos
      Object.entries(precosUnificados).forEach(([plano, valor]) => {
        document.querySelectorAll(`.${plano} .preco`).forEach(el => {
          el.innerHTML = `R$ ${valor}<small>/mês</small>`;
        });
      });
    };

    // Aplicar imediatamente
    aplicarPrecosDefinitivos();
    
    // Aplicar novamente após carregamento completo
    window.addEventListener('load', aplicarPrecosDefinitivos);
    
    // Configurar observador de mudanças no DOM
    const observer = new MutationObserver((mutations) => {
      let shouldUpdate = false;
      
      mutations.forEach(mutation => {
        if (mutation.addedNodes.length > 0) {
          shouldUpdate = true;
        }
      });
      
      if (shouldUpdate) {
        aplicarPrecosDefinitivos();
      }
    });
    
    // Iniciar observação
    observer.observe(document.body, {
      childList: true,
      subtree: true
    });
    
    // Limpeza ao desmontar componente
    return () => {
      window.removeEventListener('load', aplicarPrecosDefinitivos);
      observer.disconnect();
    };
  }, []);

  // Este componente não renderiza nada visível
  return null;
};

export default UnificadorPrecos;
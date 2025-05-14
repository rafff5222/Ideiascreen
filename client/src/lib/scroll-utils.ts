/**
 * Função utilitária para rolagem suave até um elemento com ID específico
 * 
 * @param {string} targetId - O ID do elemento para onde rolar a página
 * @param {Object} options - Opções de configuração para a rolagem
 * @param {string} options.block - Posição do alinhamento vertical ('start', 'center', 'end', 'nearest')
 * @param {number} options.offsetY - Deslocamento vertical opcional em pixels (para compensar cabeçalhos fixos, etc.)
 */
export function smoothScrollToElement(
  targetId: string, 
  options: { block?: ScrollLogicalPosition; offsetY?: number } = {}
) {
  const { block = 'start', offsetY = 0 } = options;
  
  // Encontra o elemento pelo ID
  const targetElement = document.getElementById(targetId);
  
  if (targetElement) {
    // Rola até o elemento com comportamento suave
    const targetPosition = targetElement.getBoundingClientRect().top + window.pageYOffset;
    
    // Aplica o offset, se fornecido
    const offsetPosition = targetPosition - offsetY;
    
    // Realiza a rolagem
    window.scrollTo({
      top: offsetPosition,
      behavior: 'smooth'
    });
    
    // Foco opcional no elemento (útil para acessibilidade)
    targetElement.focus({ preventScroll: true });
    
    return true;
  }
  
  return false;
}

/**
 * Configura os manipuladores de eventos para links de âncora
 * Isso permite rolagem suave para todos os links que apontam para IDs na página
 * 
 * @param {number} headerOffset - Offset para compensar cabeçalhos fixos
 */
export function setupSmoothScrolling(headerOffset: number = 0) {
  // Seleciona todos os links que começam com "#" e não são "#" sozinhos
  const anchorLinks = document.querySelectorAll('a[href^="#"]:not([href="#"])');
  
  anchorLinks.forEach(anchor => {
    anchor.addEventListener('click', (e) => {
      e.preventDefault();
      
      // Obtém o ID do alvo a partir do href
      const targetId = anchor.getAttribute('href')?.substring(1);
      
      if (targetId) {
        smoothScrollToElement(targetId, { offsetY: headerOffset });
      }
    });
  });
}
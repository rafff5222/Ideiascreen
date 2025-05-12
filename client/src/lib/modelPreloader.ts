/**
 * Sistema de pré-carregamento de modelos de IA
 * Melhora a experiência do usuário iniciando o carregamento dos modelos em background
 */

/**
 * Inicia o pré-carregamento do modelo em background
 * Reduz o tempo de espera ao gerar o primeiro roteiro
 */
export function preloadAIModel() {
  console.log('Iniciando pré-carregamento de modelo de IA...');
  
  // Fazemos uma solicitação leve para iniciar o carregamento do modelo
  fetch('/api/preload-model', { 
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ action: 'preload', modelType: 'script-generator' })
  })
  .then(response => {
    if (response.ok) {
      console.log('Pré-carregamento de modelo iniciado com sucesso');
    }
  })
  .catch(err => {
    // Silenciamos erros pois isso é apenas uma otimização
    console.error('Erro no pré-carregamento (não crítico):', err);
  });
}

/**
 * Inicializa o sistema de pré-carregamento em momentos estratégicos
 */
export function initModelPreloader() {
  // Iniciar após a página principal carregar completamente
  window.addEventListener('load', () => {
    // Aguardamos um tempo após o carregamento para não concorrer com recursos
    setTimeout(() => {
      preloadAIModel();
    }, 3000); // 3 segundos após o carregamento
  });
  
  // Também pré-carregamos quando o mouse passa sobre o botão de gerar
  document.addEventListener('mouseover', (e) => {
    const target = e.target as HTMLElement;
    if (target && (
      target.id === 'generate-btn' || 
      target.closest('#generate-form') ||
      target.closest('.script-generator-link')
    )) {
      preloadAIModel();
    }
  });
}
import { useEffect, useState } from 'react';

/**
 * Componente de Teste A/B Automatizado para CTAs
 * Testa diferentes variações de texto em Call-to-Actions para otimizar conversões
 * Não utiliza bibliotecas externas, implementação própria
 */
export default function ABTestCTA() {
  // Armazena a variação do CTA escolhida para este usuário
  const [selectedVariation, setSelectedVariation] = useState<string | null>(null);
  
  useEffect(() => {
    // Possíveis variações de texto para os CTAs
    const ctaVariations = [
      "Quero meus vídeos automáticos!",
      "Gerar vídeos com IA agora",
      "Experimente grátis por 7 dias",
      "Crie seu primeiro vídeo grátis",
      "Começar a criar vídeos com IA"
    ];
    
    // Checa se o usuário já tem uma variação atribuída
    const checkExistingVariation = () => {
      const storedVariation = localStorage.getItem('cta-variation');
      
      if (storedVariation && ctaVariations.includes(storedVariation)) {
        setSelectedVariation(storedVariation);
        return storedVariation;
      }
      
      return null;
    };
    
    // Seleciona uma variação aleatória e a armazena
    const selectRandomVariation = () => {
      const randomIndex = Math.floor(Math.random() * ctaVariations.length);
      const variation = ctaVariations[randomIndex];
      
      // Armazena no localStorage para manter consistência entre visitas
      localStorage.setItem('cta-variation', variation);
      setSelectedVariation(variation);
      
      return variation;
    };
    
    // Aplica a variação aos botões CTA
    const applyVariation = (variation: string) => {
      // Seleciona todos os CTAs principais
      const mainCTAs = document.querySelectorAll(
        '.main-cta, .primary-cta, .hero-cta, .cta-primary, [data-ab-test="cta"]'
      );
      
      if (mainCTAs.length === 0) return false;
      
      // Aplica a variação a cada CTA encontrado
      mainCTAs.forEach(cta => {
        // Evita reprocessar CTAs que já foram modificados
        if (cta.getAttribute('data-ab-processed') === 'true') return;
        
        // Marca como processado
        cta.setAttribute('data-ab-processed', 'true');
        
        // Armazena o texto original para referência
        const originalText = cta.textContent;
        cta.setAttribute('data-original-text', originalText || '');
        
        // Altera o texto do CTA
        cta.textContent = variation;
        
        // Adiciona listener para rastrear cliques
        cta.addEventListener('click', trackCTAClick);
      });
      
      return mainCTAs.length > 0;
    };
    
    // Rastreia cliques nos CTAs
    const trackCTAClick = (e: Event) => {
      const cta = e.currentTarget as HTMLElement;
      
      // Registra a variação e o clique no localStorage
      localStorage.setItem('cta-clicked', selectedVariation || '');
      localStorage.setItem('cta-click-timestamp', new Date().toISOString());
      
      // Registra o evento de analytics
      console.log('Analytics:', {
        event: 'ab_test_cta_click',
        variation: selectedVariation,
        element_id: cta.id,
        element_class: cta.className,
        timestamp: new Date().toISOString()
      });
    };
    
    // Inicializa o Teste A/B
    const initABTest = () => {
      // Verifica se já existe uma variação
      const existingVariation = checkExistingVariation();
      
      // Usa a variação existente ou seleciona uma nova
      const variation = existingVariation || selectRandomVariation();
      
      // Aplica a variação aos CTAs existentes
      const applied = applyVariation(variation);
      
      if (applied) {
        // Registra o evento de analytics
        console.log('Analytics:', {
          event: 'ab_test_initialized',
          variation: variation,
          timestamp: new Date().toISOString()
        });
      }
      
      return applied;
    };
    
    // Inicializa o teste A/B
    let initialized = initABTest();
    
    // Se não conseguiu inicializar (possivelmente porque os CTAs ainda não foram carregados)
    // configura um observador para tentar novamente quando o DOM mudar
    if (!initialized) {
      const observer = new MutationObserver((mutations) => {
        for (const mutation of mutations) {
          if (mutation.type === 'childList' && mutation.addedNodes.length > 0) {
            // Verifica se agora pode aplicar a variação
            if (initABTest()) {
              // Se aplicou com sucesso, desconecta o observador
              observer.disconnect();
              initialized = true;
              break;
            }
          }
        }
      });
      
      // Observa mudanças em todo o documento
      observer.observe(document.body, {
        childList: true,
        subtree: true
      });
      
      // Cleanup
      return () => {
        observer.disconnect();
      };
    }
  }, [selectedVariation]);
  
  // Este componente não renderiza nada visualmente
  return null;
}
import { useEffect } from 'react';
import { useLocation } from 'wouter';

/**
 * Componente para detectar intenções de cancelamento
 * Intercepta cliques em botões/links de cancelamento e exibe ofertas de retenção
 */
export default function RetentionPixel() {
  const [location, navigate] = useLocation();
  
  useEffect(() => {
    // Detecta páginas onde é mais provável que o usuário esteja considerando cancelar
    if (location.includes('/configuracoes') || 
        location.includes('/conta') || 
        location.includes('/settings') || 
        location.includes('/perfil')) {
      
      // Função para interceptar cliques em links de cancelamento
      const handleCancelLinks = (e: MouseEvent) => {
        const target = e.target as HTMLElement;
        const closestLink = target.closest('a');
        
        // Verifica se o link ou seus pais contêm termos relacionados a cancelamento
        if (closestLink) {
          const href = closestLink.getAttribute('href') || '';
          const text = closestLink.textContent?.toLowerCase() || '';
          
          if (href.includes('cancelar') || 
              href.includes('cancel') || 
              text.includes('cancelar') || 
              text.includes('excluir') || 
              text.includes('remover') ||
              text.includes('delete') ||
              text.includes('cancel') ||
              text.includes('remove')) {
            
            // Previne o comportamento padrão
            e.preventDefault();
            
            // Exibe mensagem de retenção
            const confirmed = window.confirm(
              "Antes de ir... Que tal 15 dias GRÁTIS para testar nosso novo recurso de edição automática?\n\n" +
              "👉 'OK' para aproveitar esta oferta especial\n" +
              "👉 'Cancelar' para continuar com o cancelamento"
            );
            
            if (confirmed) {
              // Redireciona para a oferta de retenção
              navigate('/oferta-retencao');
            } else {
              // Continua com o cancelamento
              window.location.href = href;
            }
          }
        }
      };
      
      // Adiciona evento para monitorar cliques em toda a página
      document.addEventListener('click', handleCancelLinks);
      
      return () => {
        document.removeEventListener('click', handleCancelLinks);
      };
    }
  }, [location, navigate]);

  // Componente não renderiza nada visualmente
  return null;
}
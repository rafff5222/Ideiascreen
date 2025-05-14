import { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';

interface PortalProps {
  children: React.ReactNode;
  container?: HTMLElement;
}

/**
 * Componente Portal para renderizar conteúdo fora da hierarquia do DOM
 * Útil para notificações, modais, tooltips, etc.
 */
export function Portal({ children, container }: PortalProps) {
  const [mounted, setMounted] = useState(false);
  
  useEffect(() => {
    setMounted(true);
    return () => setMounted(false);
  }, []);

  // Se componente não está montado, não renderize nada
  if (!mounted) return null;
  
  // Usa o container fornecido ou o body como fallback
  const targetElement = container || document.body;
  
  return createPortal(children, targetElement);
}
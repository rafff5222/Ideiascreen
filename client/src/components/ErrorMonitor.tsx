import { useEffect } from 'react';
import { initErrorMonitoring } from '@/lib/errorMonitoring';

/**
 * Componente que inicializa o monitoramento de erros na aplicação
 * Não possui interface visual, apenas funcionalidade
 */
export default function ErrorMonitor() {
  useEffect(() => {
    initErrorMonitoring();
  }, []);
  
  return null;
}
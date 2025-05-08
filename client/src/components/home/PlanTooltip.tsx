import React from 'react';
import { InfoIcon } from 'lucide-react';

interface TooltipProps {
  text: string;
  className?: string;
}

/**
 * Componente de tooltip para exibir informações adicionais sobre recursos dos planos
 */
export const PlanTooltip: React.FC<TooltipProps> = ({ text, className = '' }) => {
  return (
    <span className={`pricing-tooltip ${className}`}>
      <InfoIcon className="tooltip-icon h-4 w-4 inline-block" />
      <span className="tooltip-text">{text}</span>
    </span>
  );
};

export default PlanTooltip;
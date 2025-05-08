import { CheckCircle, XCircle } from "lucide-react";

interface PlanFeatureProps {
  included: boolean;
  text: string;
}

/**
 * Componente para exibir características de plano com ícones adequados
 * Usa ✓ para funções incluídas e ✗ para funções não incluídas
 */
export const PlanFeature = ({ included, text }: PlanFeatureProps) => {
  return (
    <li className="flex items-start mt-2">
      {included ? (
        <span className="text-green-500 mr-2 flex-shrink-0">✓</span>
      ) : (
        <span className="text-red-500 mr-2 flex-shrink-0">✗</span>
      )}
      <span className={`${!included ? 'text-gray-500' : 'text-gray-800'}`}>
        {text}
      </span>
    </li>
  );
};

/**
 * Versão alternativa usando ícones do Lucide com melhor acessibilidade
 */
export const PlanFeatureIcon = ({ included, text }: PlanFeatureProps) => {
  return (
    <li className="flex items-start mt-2">
      {included ? (
        <CheckCircle className="text-green-500 mr-2 h-5 w-5 flex-shrink-0" />
      ) : (
        <XCircle className="text-red-500 mr-2 h-5 w-5 flex-shrink-0" />
      )}
      <span className={`${!included ? 'text-gray-500' : 'text-gray-800'}`}>
        {text}
      </span>
    </li>
  );
};
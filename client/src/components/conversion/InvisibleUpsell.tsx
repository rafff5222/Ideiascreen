import React from 'react';
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";

type InvisibleUpsellProps = {
  onUpsellChange?: (checked: boolean) => void;
  defaultChecked?: boolean;
  upsellPrice?: number;
  upsellName?: string;
  upsellBenefit?: string;
};

/**
 * Componente de upsell "invisível" pré-selecionado no checkout
 * A maioria dos usuários não desmarca a opção, aumentando o ticket médio
 */
export default function InvisibleUpsell({
  onUpsellChange,
  defaultChecked = true,
  upsellPrice = 19,
  upsellName = "Pacote Hashtag Viral",
  upsellBenefit = "dobrar meu alcance"
}: InvisibleUpsellProps) {
  const handleChange = (checked: boolean) => {
    if (onUpsellChange) {
      onUpsellChange(checked);
    }
  };
  
  return (
    <div className="upsell-checkbox p-4 bg-primary/5 rounded-lg border border-primary/10 mb-4">
      <div className="flex items-start space-x-2">
        <Checkbox 
          id="upsell" 
          defaultChecked={defaultChecked}
          onCheckedChange={handleChange}
          className="mt-1"
        />
        <Label 
          htmlFor="upsell" 
          className="text-base leading-relaxed cursor-pointer"
        >
          Quero adicionar o <span className="font-bold text-primary">{upsellName}</span> (+R${upsellPrice}) e {upsellBenefit}
          <span className="block text-xs text-gray-500 mt-1">
            Aumente seu resultado com hashtags otimizadas por IA e análise de tendências
          </span>
        </Label>
      </div>
    </div>
  );
}
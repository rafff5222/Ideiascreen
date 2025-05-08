import React, { useState } from "react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface PlanTooltipProps {
  title: string;
  description: string;
  children: React.ReactNode;
}

/**
 * Componente de tooltip para planos
 * Exibe informações adicionais sobre recursos dos planos
 */
export default function PlanTooltip({ title, description, children }: PlanTooltipProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <Tooltip open={isOpen} onOpenChange={setIsOpen}>
      <TooltipTrigger asChild>
        <span className="cursor-help underline decoration-dotted underline-offset-2">
          {children}
        </span>
      </TooltipTrigger>
      <TooltipContent className="max-w-[280px] text-sm bg-white p-3 rounded-lg shadow-lg" sideOffset={5}>
        <div className="font-medium mb-1">{title}</div>
        <p className="text-gray-600">{description}</p>
      </TooltipContent>
    </Tooltip>
  );
}
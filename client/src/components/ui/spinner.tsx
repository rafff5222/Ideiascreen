import React from "react";
import { cn } from "@/lib/utils";

interface SpinnerProps extends React.HTMLAttributes<HTMLDivElement> {
  size?: "sm" | "md" | "lg";
}

/**
 * Componente Spinner para indicação de carregamento
 */
export function Spinner({ 
  className,
  size = "md", 
  ...props 
}: SpinnerProps) {
  // Determina tamanho com base no prop size
  const sizeClasses = {
    sm: "w-4 h-4 border-2",
    md: "w-8 h-8 border-3",
    lg: "w-12 h-12 border-4"
  };

  return (
    <div
      className={cn(
        "animate-spin rounded-full border-solid border-current border-t-transparent",
        sizeClasses[size],
        className
      )}
      {...props}
    >
      <span className="sr-only">Carregando...</span>
    </div>
  );
}
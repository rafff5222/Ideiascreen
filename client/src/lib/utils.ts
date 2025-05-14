import { ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

/**
 * Utilitário para combinar classes do Tailwind de forma otimizada
 * Usa clsx para combinar classes e twMerge para resolver conflitos do Tailwind
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
import { ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

/**
 * Utilitário para combinar classes do Tailwind de forma otimizada
 * Usa clsx para combinar classes e twMerge para resolver conflitos do Tailwind
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Plataformas suportadas para geração de conteúdo
 */
export const platforms = [
  { id: 'instagram', label: 'Instagram' },
  { id: 'tiktok', label: 'TikTok' },
  { id: 'youtube', label: 'YouTube' },
  { id: 'facebook', label: 'Facebook' },
  { id: 'linkedin', label: 'LinkedIn' },
  { id: 'twitter', label: 'Twitter' }
];

/**
 * Estilos de comunicação disponíveis
 */
export const communicationStyles = [
  { id: 'casual', label: 'Casual' },
  { id: 'formal', label: 'Formal' },
  { id: 'humoristico', label: 'Humorístico' },
  { id: 'dramatico', label: 'Dramático' },
  { id: 'informativo', label: 'Informativo' },
  { id: 'persuasivo', label: 'Persuasivo' },
  { id: 'motivacional', label: 'Motivacional' },
  { id: 'storytelling', label: 'Storytelling' }
];
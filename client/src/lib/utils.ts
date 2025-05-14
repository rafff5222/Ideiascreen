import { ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import { format, formatDistanceToNow } from "date-fns";
import { ptBR } from "date-fns/locale";

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

/**
 * Tipos de conteúdo disponíveis
 */
export const contentTypes = [
  { id: 'roteiro', label: 'Roteiro' },
  { id: 'legenda', label: 'Legenda' },
  { id: 'script', label: 'Script' },
  { id: 'storyboard', label: 'Storyboard' },
  { id: 'ideia', label: 'Ideia de conteúdo' }
];

/**
 * Formata data para exibição
 * @param date - Data para formatar
 * @param formatStr - String de formato (opcional)
 */
export function formatDate(date: Date | string | number, formatStr = 'dd/MM/yyyy') {
  if (!date) return '';
  return format(new Date(date), formatStr, { locale: ptBR });
}

/**
 * Formata data relativa (ex: "há 5 minutos")
 * @param date - Data para formatar
 */
export function formatRelativeDate(date: Date | string | number) {
  if (!date) return '';
  return formatDistanceToNow(new Date(date), { 
    addSuffix: true,
    locale: ptBR
  });
}

/**
 * Formata número para moeda (BRL)
 * @param value - Valor para formatar
 */
export function formatCurrency(value: number) {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL'
  }).format(value);
}

/**
 * Trunca um texto com ... se exceder o tamanho máximo
 * @param text - Texto para truncar
 * @param maxLength - Tamanho máximo
 */
export function truncateText(text: string, maxLength: number) {
  if (!text) return '';
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength) + '...';
}
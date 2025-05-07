import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatDate(date: Date) {
  return new Intl.DateTimeFormat("pt-BR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  }).format(date);
}

export const contentTypes = [
  { id: "script", label: "Roteiro", icon: "ri-file-text-line" },
  { id: "caption", label: "Legenda", icon: "ri-chat-3-line" },
  { id: "idea", label: "Ideia", icon: "ri-lightbulb-line" },
];

export const platforms = [
  { id: "instagram", label: "Instagram", icon: "ri-instagram-line" },
  { id: "tiktok", label: "TikTok", icon: "ri-tiktok-line" },
  { id: "reels", label: "Reels", icon: "ri-play-circle-line" },
];

export const communicationStyles = [
  { id: "casual", label: "Descontraído" },
  { id: "professional", label: "Profissional" },
  { id: "educational", label: "Educativo" },
  { id: "motivational", label: "Motivacional" },
  { id: "humorous", label: "Humorístico" },
  { id: "inspirational", label: "Inspirador" },
];

export function truncateText(text: string, maxLength: number = 100): string {
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength) + "...";
}

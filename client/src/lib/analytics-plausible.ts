/**
 * Integração com Plausible Analytics 
 * Uma alternativa ao Google Analytics que respeita privacidade
 * e não requer consentimento de cookies
 */

// Definição do tipo de envio para o Plausible Analytics
interface PlausibleEvent {
  n: string; // nome do evento
  u: string; // URL
  d?: string; // domínio (opcional)
  r?: string; // referenciador (opcional)
  p?: any; // propriedades personalizadas (opcional)
}

// Configuração
const PLAUSIBLE_URL = 'https://plausible.io/api/event';
const DOMAIN = window.location.hostname;

// Inicializa o script Plausible
export function initPlausible(): void {
  if (document.getElementById('plausible-script')) return;
  
  // Adiciona o script ao head
  const script = document.createElement('script');
  script.id = 'plausible-script';
  script.defer = true;
  script.dataset.domain = DOMAIN;
  script.src = 'https://plausible.io/js/script.js';
  
  document.head.appendChild(script);
  
  console.log('Plausible Analytics inicializado');
}

// Envia um evento personalizado para o Plausible
export function trackPlausibleEvent(eventName: string, props?: Record<string, any>): void {
  // Tenta encontrar o objeto plausible global injetado pelo script
  const plausible = (window as any).plausible;
  
  if (typeof plausible === 'function') {
    // Se o script estiver carregado, usa o método oficial
    plausible(eventName, { props });
    return;
  }
  
  // Implementação de fallback enviando diretamente para a API
  try {
    const eventData: PlausibleEvent = {
      n: eventName,
      u: window.location.href,
      d: DOMAIN,
      r: document.referrer || undefined
    };
    
    // Adiciona propriedades personalizadas se existirem
    if (props) {
      eventData.p = props;
    }
    
    // Envia o evento para a API do Plausible
    navigator.sendBeacon(
      PLAUSIBLE_URL,
      JSON.stringify(eventData)
    );
  } catch (error) {
    console.error('Erro ao enviar evento para Plausible:', error);
  }
}

// Rastreia visualização de página
export function trackPageView(): void {
  trackPlausibleEvent('pageview');
}

// Rastreia conversões e objetivos
export function trackConversion(goal: string, value?: number): void {
  trackPlausibleEvent('conversion', { goal, value });
}

// Rastreia engajamento
export function trackEngagement(type: string, data?: any): void {
  trackPlausibleEvent('engagement', { type, ...data });
}

// Rastreia cliques em CTA
export function trackCTAClick(ctaId: string, ctaText: string): void {
  trackPlausibleEvent('CTA Click', { id: ctaId, text: ctaText });
}

// Rastreia eventos de compra
export function trackPurchase(planId: string, price: number, currency: string = 'BRL'): void {
  trackPlausibleEvent('purchase', { planId, price, currency });
}

// Exporta um único objeto com todos os métodos
export const plausibleAnalytics = {
  init: initPlausible,
  trackEvent: trackPlausibleEvent,
  trackPageView,
  trackConversion,
  trackEngagement,
  trackCTAClick,
  trackPurchase
};

export default plausibleAnalytics;
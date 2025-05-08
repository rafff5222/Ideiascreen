import { useEffect, useState } from 'react';

/**
 * Componente de personalização de conteúdo em tempo real baseado no nicho do usuário
 * - Detecta nicho por parâmetro de URL (?niche=fitness)
 * - Adapta títulos, descrições e CTAs para o nicho específico
 * - Aumenta relevância e taxa de conversão
 */
export default function NichePersonalization() {
  const [detectedNiche, setDetectedNiche] = useState<string>('geral');
  
  useEffect(() => {
    // Detecta o nicho do visitante (ex: ?niche=marketing)
    const urlParams = new URLSearchParams(window.location.search);
    const niche = urlParams.get('niche') || getDefaultNiche();
    setDetectedNiche(niche);
    
    // Registra o nicho detectado
    console.log('Nicho detectado:', niche);
    
    // Personaliza o conteúdo da página
    customizeContent(niche);
    
    // Adiciona ao localStorage para persistência entre páginas
    localStorage.setItem('user_niche', niche);
  }, []);
  
  /**
   * Tenta detectar o nicho do usuário com base em referenciador ou histórico
   */
  function getDefaultNiche(): string {
    // Primeiro verifica o localStorage (para retornos)
    const storedNiche = localStorage.getItem('user_niche');
    if (storedNiche) return storedNiche;
    
    // Depois tenta detectar pelo referenciador
    const referrer = document.referrer.toLowerCase();
    
    // Detecta com base em redes sociais ou sites de nicho
    if (referrer.includes('instagram.com') || referrer.includes('tiktok.com')) {
      return 'social_media';
    }
    
    if (referrer.includes('marketing') || referrer.includes('vendas')) {
      return 'marketing';
    }
    
    if (referrer.includes('design') || referrer.includes('criativo')) {
      return 'design';
    }
    
    if (referrer.includes('academia') || referrer.includes('fitness')) {
      return 'fitness';
    }
    
    if (referrer.includes('blog') || referrer.includes('escrita')) {
      return 'blog';
    }
    
    // Se não conseguir detectar, retorna o padrão
    return 'geral';
  }
  
  /**
   * Personaliza elementos da página com base no nicho
   */
  function customizeContent(niche: string) {
    // Aguarda o DOM estar pronto
    document.addEventListener('DOMContentLoaded', () => {
      // Elementos a serem personalizados
      const heroTitle = document.querySelector('.hero-title');
      const heroDescription = document.querySelector('.hero-description');
      const heroCta = document.querySelector('.btn-cta');
      const testimonialHeading = document.querySelector('.testimonial-heading');
      
      // Personalização com base no nicho
      switch (niche) {
        case 'marketing':
          if (heroTitle) {
            heroTitle.innerHTML = `🚀 <span style="color:#EC4899">CONTEÚDO VIRAL</span> PARA MARKETING DIGITAL`;
          }
          if (heroDescription) {
            heroDescription.textContent = 'Aumente seus leads e conversões com conteúdo gerado por IA que vende por você.';
          }
          if (heroCta) {
            heroCta.textContent = 'AUMENTAR CONVERSÕES';
          }
          if (testimonialHeading) {
            testimonialHeading.textContent = 'O que profissionais de marketing dizem';
          }
          break;
          
        case 'social_media':
          if (heroTitle) {
            heroTitle.innerHTML = `✨ <span style="color:#EC4899">VIRAL EM 24H</span> NO INSTAGRAM E TIKTOK`;
          }
          if (heroDescription) {
            heroDescription.textContent = 'Vire referência nas redes sociais com conteúdo de alta performance e engajamento.';
          }
          if (heroCta) {
            heroCta.textContent = 'CRESCER MEU PERFIL';
          }
          break;
          
        case 'fitness':
          if (heroTitle) {
            heroTitle.innerHTML = `🔥 <span style="color:#EC4899">VÍDEOS VIRAIS</span> PARA SEU PERSONAL TRAINER DIGITAL`;
          }
          if (heroDescription) {
            heroDescription.textContent = 'Conquiste mais alunos online com conteúdo fitness que inspira e converte.';
          }
          if (heroCta) {
            heroCta.textContent = 'GANHAR CLIENTES COM IA';
          }
          break;
          
        case 'design':
          if (heroTitle) {
            heroTitle.innerHTML = `🎨 <span style="color:#EC4899">CONTEÚDO VISUAL</span> QUE IMPRESSIONA`;
          }
          if (heroDescription) {
            heroDescription.textContent = 'Crie artes e vídeos de impacto para seu portfólio criativo que atraem clientes.';
          }
          if (heroCta) {
            heroCta.textContent = 'POTENCIALIZAR CRIAÇÕES';
          }
          break;
          
        case 'blog':
          if (heroTitle) {
            heroTitle.innerHTML = `📝 <span style="color:#EC4899">CONTEÚDO QUE</span> ENGAJA LEITORES`;
          }
          if (heroDescription) {
            heroDescription.textContent = 'Transforme sua audiência em assinantes fiéis com conteúdo cativante para seu blog.';
          }
          if (heroCta) {
            heroCta.textContent = 'ESCALAR MEU BLOG';
          }
          break;
          
        default:
          // Mantém o padrão
          break;
      }
    });
  }
  
  // Este componente não renderiza nada visível
  return null;
}
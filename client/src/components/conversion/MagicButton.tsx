import { useEffect, useState } from 'react';
import { Button } from "@/components/ui/button";

/**
 * MagicButton com Reconhecimento de Nicho usando IA
 * Personaliza o CTA com base no comportamento do usuário para maximizar conversões
 */
export default function MagicButton() {
  const [userNiche, setUserNiche] = useState<string | null>(null);
  const [initialized, setInitialized] = useState(false);
  
  useEffect(() => {
    // Evita inicialização duplicada
    if (initialized) return;
    setInitialized(true);
    
    // Detecta tipo de dispositivo do usuário
    const isMobileDevice = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
    const isTablet = /iPad|Android(?!.*Mobile)/i.test(navigator.userAgent);
    const deviceType = isTablet ? 'tablet' : (isMobileDevice ? 'mobile' : 'desktop');
    
    // Detecta o nicho do usuário com base no comportamento
    const detectUserNiche = () => {
      // Possíveis nichos de usuários
      const niches = [
        'criadores-video',
        'influenciadores',
        'marcas',
        'empreendedores',
        'agencias',
        'iniciantes',
        'tiktok',
        'instagram',
        'marketing'
      ];
      
      // Busca por indicadores de interesse no histórico de navegação
      // (apenas para domínios próprios, respeitando privacidade)
      const referrer = document.referrer;
      const urlParams = new URLSearchParams(window.location.search);
      
      // Analisa parâmetros de UTM
      const utmSource = urlParams.get('utm_source');
      const utmMedium = urlParams.get('utm_medium');
      const utmCampaign = urlParams.get('utm_campaign');
      
      // Verifica UTMs para identificar nicho
      if (utmCampaign?.includes('tiktok') || utmSource?.includes('tiktok')) {
        return 'tiktok';
      }
      
      if (utmCampaign?.includes('insta') || utmSource?.includes('insta')) {
        return 'instagram';
      }
      
      if (utmMedium?.includes('influencer') || utmCampaign?.includes('influencer')) {
        return 'influenciadores';
      }
      
      // Verifica referrer para detectar origem
      if (referrer.includes('tiktok.com')) {
        return 'tiktok';
      }
      
      if (referrer.includes('instagram.com')) {
        return 'instagram';
      }
      
      // Analisa comportamento de navegação
      const detectBehaviorNiche = () => {
        // Palavras-chave indicadoras de cada nicho
        const nicheKeywords: Record<string, string[]> = {
          'criadores-video': ['editar', 'vídeo', 'editor', 'montage', 'corte', 'transição', 'cinematic'],
          'influenciadores': ['seguidores', 'engajamento', 'audiência', 'monetizar', 'patrocínio'],
          'marcas': ['marca', 'branding', 'empresa', 'produto', 'serviço', 'vendas'],
          'empreendedores': ['negócio', 'empresa', 'lucro', 'cliente', 'vendas', 'leads'],
          'agencias': ['cliente', 'agência', 'campanha', 'gerenciar', 'escala', 'resultado'],
          'iniciantes': ['começar', 'iniciante', 'básico', 'tutorial', 'aprender', 'primeiro'],
          'tiktok': ['tiktok', 'trend', 'viral', 'dueto', 'stitch', 'som'],
          'instagram': ['instagram', 'reels', 'stories', 'feed', 'carousel', 'filtro'],
          'marketing': ['marketing', 'conversão', 'leads', 'anúncio', 'tráfego', 'campanha']
        };
        
        // Analisa o conteúdo da página, texto selecionado e cliques recentes
        const pageText = document.body.innerText.toLowerCase();
        const selectedText = window.getSelection()?.toString().toLowerCase() || '';
        
        // Contagem de correspondências para cada nicho
        const nicheScores: Record<string, number> = {};
        
        // Inicializa contagens
        niches.forEach(niche => {
          nicheScores[niche] = 0;
        });
        
        // Calcula pontuação para cada nicho com base no conteúdo da página
        for (const niche in nicheKeywords) {
          nicheKeywords[niche].forEach(keyword => {
            // Verifica no conteúdo da página
            const regex = new RegExp(keyword, 'gi');
            const matches = (pageText.match(regex) || []).length;
            nicheScores[niche] += matches;
            
            // Dá peso extra para texto selecionado
            const selectedMatches = (selectedText.match(regex) || []).length;
            nicheScores[niche] += selectedMatches * 3;
          });
        }
        
        // Verifica elementos visualizados (seções da página)
        const checkVisibleSections = () => {
          // Mapeia IDs/classes de seções para nichos
          const sectionNicheMap: Record<string, string> = {
            'instagram-section': 'instagram',
            'tiktok-section': 'tiktok',
            'brands-section': 'marcas',
            'agencies-section': 'agencias',
            'creator-section': 'criadores-video',
            'influencer-benefits': 'influenciadores',
            'beginner-tutorials': 'iniciantes',
            'marketing-results': 'marketing'
          };
          
          // Verifica seções visíveis
          Object.entries(sectionNicheMap).forEach(([selector, niche]) => {
            const element = document.querySelector(`.${selector}`) || document.querySelector(`#${selector}`);
            if (element && isElementInViewport(element as HTMLElement)) {
              nicheScores[niche] += 5; // Dá peso para elementos visíveis
            }
          });
        };
        
        // Executa verificação de elementos visíveis
        checkVisibleSections();
        
        // Determina o nicho com maior pontuação
        let topNiche = niches[0];
        let maxScore = 0;
        
        for (const niche in nicheScores) {
          if (nicheScores[niche] > maxScore) {
            maxScore = nicheScores[niche];
            topNiche = niche;
          }
        }
        
        // Se nenhum nicho tem pontuação significativa, retorna null
        return maxScore > 2 ? topNiche : null;
      };
      
      // Detecta nicho por comportamento
      const behaviorNiche = detectBehaviorNiche();
      if (behaviorNiche) {
        return behaviorNiche;
      }
      
      // Fallback para nicho padrão se nada for detectado
      return null;
    };
    
    // Verifica se o elemento está visível na viewport
    const isElementInViewport = (el: HTMLElement) => {
      const rect = el.getBoundingClientRect();
      return (
        rect.top >= 0 &&
        rect.left >= 0 &&
        rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
        rect.right <= (window.innerWidth || document.documentElement.clientWidth)
      );
    };
    
    // Aplica MagicButton aos botões CTA existentes
    const applyMagicButtons = () => {
      // Detecta o nicho do usuário
      const detectedNiche = detectUserNiche();
      setUserNiche(detectedNiche);
      
      // Registra o nicho detectado
      console.log('Nicho detectado:', detectedNiche || 'geral');
      
      // Mensagens personalizadas por nicho e dispositivo
      const deviceMessages: Record<string, Record<string, string>> = {
        'mobile': {
          'criadores-video': '📱 Crie vídeos no seu celular',
          'influenciadores': '📱 Aumente engajamento onde estiver',
          'marcas': '📱 Gerencie sua marca pelo celular',
          'empreendedores': '📱 Cresça seu negócio pelo celular',
          'agencias': '📱 Conteúdo para clientes em tempo real',
          'iniciantes': '📱 Crie do zero direto do celular',
          'tiktok': '📱 Gerar TikToks direto no celular',
          'instagram': '📱 Crie Reels direto do celular',
          'marketing': '📱 Marketing no seu bolso',
          'default': '📱 Gerar Vídeos Direto do Celular'
        },
        'tablet': {
          'criadores-video': '✨ Crie vídeos no seu tablet',
          'influenciadores': '✨ Produza conteúdo em qualquer lugar',
          'marcas': '✨ Gerencie sua marca em dispositivos móveis',
          'empreendedores': '✨ Cresça seu negócio em movimento',
          'agencias': '✨ Atenda seus clientes em qualquer lugar',
          'iniciantes': '✨ Comece a criar onde estiver',
          'tiktok': '✨ Gere TikToks em qualquer lugar',
          'instagram': '✨ Produza Reels em qualquer lugar',
          'marketing': '✨ Marketing em qualquer dispositivo',
          'default': '✨ Crie Vídeos em Qualquer Lugar'
        },
        'desktop': {
          'criadores-video': '💻 Crie vídeos profissionais em minutos',
          'influenciadores': '💻 Aumente seu engajamento em 3x',
          'marcas': '💻 Multiplique resultados da sua marca',
          'empreendedores': '💻 Atraia mais clientes para seu negócio',
          'agencias': '💻 Escale conteúdo para todos seus clientes',
          'iniciantes': '💻 Comece a criar conteúdo de qualidade',
          'tiktok': '💻 Crie trends virais para TikTok',
          'instagram': '💻 Gere Reels que convertem seguidores',
          'marketing': '💻 Maximize conversões com conteúdo estratégico',
          'default': '💻 Criar Conteúdo Profissional Agora'
        }
      };
      
      // Seleciona a mensagem baseada no nicho e dispositivo
      const getMessage = (niche: string | null) => {
        const nicheKey = niche || 'default';
        return deviceMessages[deviceType][nicheKey] || deviceMessages[deviceType]['default'];
      };
      
      // Seleciona todos os botões CTA principais na página
      const ctaButtons = document.querySelectorAll('.cta-button, .hero-cta, .primary-button, .btn-cta, [data-cta="primary"]');
      
      // Personaliza cada botão encontrado
      ctaButtons.forEach(button => {
        // Evita processar botões já modificados
        if (button.getAttribute('data-magic-processed') === 'true') return;
        button.setAttribute('data-magic-processed', 'true');
        
        // Escolhe a mensagem baseada no nicho e dispositivo
        const message = getMessage(detectedNiche);
        
        // Aplica a nova mensagem ao botão
        if (button.tagName.toLowerCase() === 'a' || button.tagName.toLowerCase() === 'button') {
          button.textContent = message;
          
          // Adiciona classe de ênfase visual e animação sutil
          button.classList.add('magic-button-enhanced');
          
          // Adiciona estilos para o botão melhorado
          const style = document.createElement('style');
          style.textContent = `
            .magic-button-enhanced {
              position: relative;
              overflow: hidden;
              transition: all 0.3s ease;
            }
            
            .magic-button-enhanced:before {
              content: '';
              position: absolute;
              top: 0;
              left: -100%;
              width: 100%;
              height: 100%;
              background: linear-gradient(
                90deg,
                rgba(255, 255, 255, 0) 0%,
                rgba(255, 255, 255, 0.2) 50%,
                rgba(255, 255, 255, 0) 100%
              );
              transition: all 0.6s ease;
            }
            
            .magic-button-enhanced:hover:before {
              left: 100%;
            }
            
            @keyframes magic-pulse {
              0% {
                box-shadow: 0 0 0 0 rgba(139, 92, 246, 0.4);
              }
              70% {
                box-shadow: 0 0 0 10px rgba(139, 92, 246, 0);
              }
              100% {
                box-shadow: 0 0 0 0 rgba(139, 92, 246, 0);
              }
            }
            
            .magic-button-enhanced.pulse {
              animation: magic-pulse 2s infinite;
            }
          `;
          document.head.appendChild(style);
          
          // Adiciona efeito de pulse após 3 segundos para chamar atenção
          setTimeout(() => {
            button.classList.add('pulse');
          }, 3000);
        }
      });
      
      // Registra o evento
      console.log('Analytics:', {
        event: 'magic_button_applied',
        detected_niche: detectedNiche || 'geral',
        buttons_modified: ctaButtons.length,
        timestamp: new Date().toISOString()
      });
    };
    
    // Executa inicialmente
    applyMagicButtons();
    
    // Configura um observador para detectar novos botões dinamicamente
    const observer = new MutationObserver((mutations) => {
      // Verifica se novos botões foram adicionados
      let hasNewButtons = false;
      
      mutations.forEach(mutation => {
        if (mutation.type === 'childList' && mutation.addedNodes.length > 0) {
          mutation.addedNodes.forEach(node => {
            if (node.nodeType === 1) { // Element node
              const element = node as HTMLElement;
              
              // Verifica se o elemento adicionado contém botões CTA
              if (element && typeof element.querySelectorAll === 'function') {
                const buttons = element.querySelectorAll('.cta-button, .hero-cta, .primary-button, .btn-cta, [data-cta="primary"]');
                
                if (buttons && buttons.length > 0) {
                  hasNewButtons = true;
                }
              }
            }
          });
        }
      });
      
      // Se novos botões foram adicionados, aplica MagicButton novamente
      if (hasNewButtons) {
        applyMagicButtons();
      }
    });
    
    // Inicia observação de mudanças no DOM
    observer.observe(document.body, {
      childList: true,
      subtree: true
    });
    
    // Cleanup
    return () => {
      observer.disconnect();
    };
  }, [initialized]);
  
  // Este componente não renderiza nada visualmente
  return null;
}
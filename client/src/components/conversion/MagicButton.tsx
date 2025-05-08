import { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";

type MagicButtonProps = {
  className?: string;
  onClick?: () => void;
  defaultText?: string;
};

/**
 * Componente de botão inteligente que adapta seu texto com base no nicho do usuário
 * Detecta automaticamente o nicho pela URL (se vier de campanhas específicas)
 */
export default function MagicButton({ 
  className = "", 
  onClick, 
  defaultText = "Quero vídeos automáticos" 
}: MagicButtonProps) {
  const [buttonText, setButtonText] = useState(defaultText);
  const [detectedNiche, setDetectedNiche] = useState("geral");
  
  // Detecta o nicho do usuário com base em diversos fatores
  useEffect(() => {
    // Tenta detectar nicho a partir da URL (parâmetros utm_*)
    const detectNicheFromURL = () => {
      const urlParams = new URLSearchParams(window.location.search);
      const source = urlParams.get('utm_source') || '';
      const campaign = urlParams.get('utm_campaign') || '';
      const medium = urlParams.get('utm_medium') || '';
      const content = urlParams.get('utm_content') || '';
      
      // Mapeamento de nichos por parâmetros de URL
      const nicheMapping: Record<string, string[]> = {
        'moda': ['instagram-moda', 'fashion', 'roupas', 'estilo'],
        'gastronomia': ['food', 'receitas', 'restaurante', 'culinaria'],
        'fitness': ['academia', 'workout', 'personal', 'treino', 'gym'],
        'tecnologia': ['tech', 'programacao', 'codigo', 'dev', 'software'],
        'educacao': ['professor', 'escola', 'curso', 'aula', 'ensino'],
        'marketing': ['agencia', 'afiliados', 'leads', 'vendas', 'trafego'],
        'beleza': ['makeup', 'maquiagem', 'skin', 'cabelo', 'estetica']
      };
      
      // Parâmetros em uma única string para facilitar busca
      const allParams = `${source} ${campaign} ${medium} ${content}`.toLowerCase();
      
      // Busca por indícios de nicho
      for (const [niche, keywords] of Object.entries(nicheMapping)) {
        if (keywords.some(keyword => allParams.includes(keyword))) {
          return niche;
        }
      }
      
      // Se não encontrou nada, retorna 'geral'
      return 'geral';
    };
    
    // Detecta nicho a partir do histórico de navegação (simulado)
    const detectNicheFromHistory = (): string => {
      // Em um caso real, analisaríamos comportamento do usuário
      // Aqui simulamos um nicho aleatório, mas apenas para demonstração
      
      // Em produção, isso seria substituído por uma análise real:
      // - Cookies anteriores
      // - Tempo gasto em determinadas páginas
      // - Comportamento de clique
      
      return 'geral';
    };
    
    // Detecta nicho com diferentes estratégias
    const niche = detectNicheFromURL() || detectNicheFromHistory() || 'geral';
    setDetectedNiche(niche);
    console.log("Nicho detectado:", niche);
    
    // Personaliza o texto do botão com base no nicho
    const nicheTexts: Record<string, string> = {
      'moda': "Quero vídeos de moda que vendem",
      'gastronomia': "Quero receitas que viralizam",
      'fitness': "Quero treinos que engajam",
      'tecnologia': "Quero conteúdo tech que converte",
      'educacao': "Quero aulas que impactam",
      'marketing': "Quero campanhas de alto ROI",
      'beleza': "Quero tutoriais irresistíveis",
      'geral': defaultText
    };
    
    setButtonText(nicheTexts[niche] || defaultText);
  }, [defaultText]);
  
  const handleClick = () => {
    // Registra conversão com o nicho detectado (para analytics)
    try {
      console.log(`Conversão de botão para nicho: ${detectedNiche}`);
    } catch (error) {
      console.error("Erro ao registrar conversão:", error);
    }
    
    // Executa o callback de clique, se fornecido
    if (onClick) onClick();
  };
  
  return (
    <Button 
      className={`magic-button bg-gradient-to-r from-primary to-purple-600 font-bold ${className}`}
      onClick={handleClick}
    >
      {buttonText}
    </Button>
  );
}
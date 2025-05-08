import { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { LockIcon, Check, CircleCheck } from "lucide-react";

type ContentPreviewProps = {
  prompt?: string;
  platform?: string;
  style?: string;
};

/**
 * Componente que exibe um preview de conteúdo gerado pela IA
 * Mostra versões parciais para usuários não-premium, com CTA para desbloqueio
 */
export default function ContentPreview({
  prompt = "Como ganhar seguidores no Instagram",
  platform = "instagram",
  style = "direto"
}: ContentPreviewProps) {
  const [versions, setVersions] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Gera previews de conteúdo
  useEffect(() => {
    const generatePreviewContent = () => {
      setIsLoading(true);
      
      // Simula tempo de geração pela IA
      setTimeout(() => {
        // Exemplos de conteúdo para preview
        const previewVersions = [
          `👋 Ei pessoal! Hoje vou compartilhar 5 estratégias COMPROVADAS para ganhar seguidores no Instagram.
           
           1️⃣ Poste consistentemente - no mínimo 3x por semana
           2️⃣ Use hashtags relevantes e específicas do nicho
           3️⃣ Interaja com contas semelhantes à sua...`,
           
          `Quer aumentar seus seguidores no Instagram? 🔥
           
           Aqui está o segredo que ninguém conta:
           
           ➡️ 80% do crescimento vem da CONSISTÊNCIA, não do conteúdo
           ➡️ Implemente uma estratégia de reels diários por 21 dias
           ➡️ Foque em nicho específico...`,
           
          `🚀 GUIA DEFINITIVO: COMO GANHAR 1000 SEGUIDORES EM 30 DIAS
          
           O que você precisa fazer:
           
           ✅ Publique 1 reel por dia usando trending sounds
           ✅ Dedique 30 minutos diários para comentar em posts relevantes
           ✅ Use a técnica do "gancho nos primeiros 3 segundos"...`
        ];
        
        setVersions(previewVersions);
        setIsLoading(false);
      }, 1500);
    };
    
    generatePreviewContent();
  }, [prompt, platform, style]);

  if (isLoading) {
    return (
      <div className="bg-gray-50 rounded-xl p-6 my-6">
        <div className="flex flex-col items-center justify-center h-64">
          <div className="w-12 h-12 border-t-2 border-b-2 border-primary rounded-full animate-spin"></div>
          <p className="mt-4 text-gray-500">Gerando ideias com IA...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white border rounded-xl shadow-sm my-6 overflow-hidden">
      <div className="p-4 bg-gray-50 border-b">
        <h3 className="text-lg font-medium">Conteúdo gerado para: <span className="text-primary">{prompt}</span></h3>
        <p className="text-sm text-gray-500">Plataforma: {platform} • Estilo: {style}</p>
      </div>
      
      <div className="p-4 grid grid-cols-1 md:grid-cols-3 gap-4">
        {versions.map((content, index) => (
          <div 
            key={index} 
            className="script-version border rounded-lg overflow-hidden shadow-sm flex flex-col"
          >
            <div className="p-3 bg-gray-50 border-b">
              <h4 className="font-medium">Versão {index + 1}: {getVersionStyle(index)}</h4>
            </div>
            
            <div className="p-4 flex-grow relative">
              <div className={`${index === 0 ? 'h-auto' : 'h-32'} overflow-hidden`}>
                <p className="whitespace-pre-line text-sm text-gray-700">{content}</p>
              </div>
              
              {index > 0 && (
                <div className="preview-lock absolute inset-0 flex flex-col items-center justify-center bg-white/90">
                  <LockIcon className="text-primary mb-2" size={24} />
                  <p className="font-medium text-center mb-2">Conteúdo Bloqueado</p>
                  <Button size="sm" className="mt-2">
                    Desbloqueie no Premium
                  </Button>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
      
      <div className="p-4 bg-gradient-to-r from-gray-50 to-gray-100 border-t">
        <h3 className="font-medium mb-2 text-center">O que você ganha no plano Premium:</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mt-3">
          <div className="flex items-start">
            <Check className="text-green-500 mt-1 flex-shrink-0" size={18} />
            <span className="ml-2 text-sm text-gray-700">
              <strong>100+</strong> formatos de conteúdo otimizados
            </span>
          </div>
          <div className="flex items-start">
            <Check className="text-green-500 mt-1 flex-shrink-0" size={18} />
            <span className="ml-2 text-sm text-gray-700">
              <strong>Geração ilimitada</strong> de ideias para seus vídeos
            </span>
          </div>
          <div className="flex items-start">
            <Check className="text-green-500 mt-1 flex-shrink-0" size={18} />
            <span className="ml-2 text-sm text-gray-700">
              <strong>Edição automática</strong> com um clique
            </span>
          </div>
        </div>
        
        <div className="mt-4 flex justify-center">
          <Button className="w-full max-w-xs">
            Iniciar Plano Premium
          </Button>
        </div>
      </div>
    </div>
  );
}

// Retorna o estilo da versão para o título
function getVersionStyle(index: number): string {
  switch(index) {
    case 0: return "Direto ao Ponto";
    case 1: return "Persuasivo";
    case 2: return "Impactante";
    default: return "Padrão";
  }
}
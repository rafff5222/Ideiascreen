import { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { LockIcon, Check, CircleCheck, Copy, CheckCircle2, AlertCircle } from "lucide-react";
import { toast } from '@/hooks/use-toast';

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
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);
  const [showGenerationSuccess, setShowGenerationSuccess] = useState(true);

  // Gera previews de conteúdo
  useEffect(() => {
    const generatePreviewContent = () => {
      setIsLoading(true);
      
      // Simula tempo de geração pela IA
      setTimeout(() => {
        // Exemplos de conteúdo para preview - agora com mais variações e exemplos
        const previewVersions = [
          `👋 Ei pessoal! Hoje vou compartilhar 5 estratégias COMPROVADAS para ganhar seguidores no Instagram.
           
           1️⃣ Poste consistentemente - no mínimo 3x por semana
           2️⃣ Use hashtags relevantes e específicas do nicho
           3️⃣ Interaja com contas semelhantes à sua
           4️⃣ Crie conteúdo de valor que resolva problemas do público
           5️⃣ Utilize stories para gerar engajamento diário
           
           💯 BÔNUS: Faça análise de métricas semanalmente para entender o que mais engaja seu público!`,
           
          `Quer aumentar seus seguidores no Instagram? 🔥
           
           Aqui está o segredo que ninguém conta:
           
           ➡️ 80% do crescimento vem da CONSISTÊNCIA, não do conteúdo
           ➡️ Implemente uma estratégia de reels diários por 21 dias
           ➡️ Foque em nicho específico e não tente agradar a todos
           ➡️ Engaje genuinamente antes de esperar engajamento
           
           🎯 Estratégia avançada: Utilize a técnica do "conteúdo em pirâmide" - um vídeo principal transforma-se em 5-7 conteúdos menores.`,
           
          `🚀 GUIA DEFINITIVO: COMO GANHAR 1000 SEGUIDORES EM 30 DIAS
          
           O que você precisa fazer:
           
           ✅ Publique 1 reel por dia usando trending sounds
           ✅ Dedique 30 minutos diários para comentar em posts relevantes
           ✅ Use a técnica do "gancho nos primeiros 3 segundos"
           ✅ Crie uma estética visual consistente em todo seu feed
           ✅ Estabeleça parcerias estratégicas com criadores do mesmo tamanho
           
           ❌ Evite comprar seguidores - isso prejudica o alcance
           ❌ Não faça spam nos comentários de contas grandes
           
           ✨ Lembre-se: crescimento orgânico traz seguidores que realmente se importam com seu conteúdo!`
        ];
        
        setVersions(previewVersions);
        setIsLoading(false);
      }, 1500);
    };
    
    generatePreviewContent();
  }, [prompt, platform, style]);

  // Função para copiar conteúdo para a área de transferência
  const copyToClipboard = (text: string, index: number) => {
    navigator.clipboard.writeText(text)
      .then(() => {
        setCopiedIndex(index);
        toast({
          title: "Conteúdo copiado!",
          description: "O roteiro foi copiado para a área de transferência.",
          variant: "default",
        });
        
        // Resetar o estado de cópia após 3 segundos
        setTimeout(() => {
          setCopiedIndex(null);
        }, 3000);
      })
      .catch(() => {
        toast({
          title: "Erro ao copiar",
          description: "Não foi possível copiar o conteúdo. Tente novamente.",
          variant: "destructive",
        });
      });
  };

  // Esconde a mensagem de sucesso após 6 segundos
  useEffect(() => {
    if (showGenerationSuccess) {
      const timer = setTimeout(() => {
        setShowGenerationSuccess(false);
      }, 6000);
      
      return () => clearTimeout(timer);
    }
  }, [showGenerationSuccess]);

  if (isLoading) {
    return (
      <div className="bg-gray-50 rounded-xl p-6 my-6">
        <div className="flex flex-col items-center justify-center h-64">
          <div className="w-12 h-12 border-t-2 border-b-2 border-amber-500 rounded-full animate-spin"></div>
          <p className="mt-4 text-gray-600 text-lg">Gerando roteiros profissionais com IA...</p>
          <p className="mt-2 text-gray-400 text-sm max-w-md text-center">
            Estamos aplicando técnicas narrativas para criar conteúdo otimizado para {platform}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white border rounded-xl shadow-sm my-6 overflow-hidden">
      {/* Mostrar feedback de sucesso após a geração */}
      {showGenerationSuccess && (
        <div className="bg-green-50 border-b border-green-100 p-4 flex items-start">
          <CheckCircle2 className="h-5 w-5 text-green-500 mr-3 mt-0.5 flex-shrink-0" />
          <div>
            <h4 className="text-green-700 font-medium text-sm">Roteiros gerados com sucesso!</h4>
            <p className="text-green-600 text-xs mt-1">
              Seu roteiro foi adaptado para <strong>{platform}</strong> com estilo <strong>{style}</strong>.
              Você pode copiar qualquer versão clicando no botão de cópia.
            </p>
          </div>
        </div>
      )}
      
      <div className="p-4 bg-gray-50 border-b">
        <h3 className="text-lg font-medium">Conteúdo gerado para: <span className="text-amber-500">{prompt}</span></h3>
        <p className="text-sm text-gray-500">Plataforma: {platform} • Estilo: {style}</p>
      </div>
      
      <div className="p-4 grid grid-cols-1 md:grid-cols-3 gap-6">
        {versions.map((content, index) => (
          <div 
            key={index} 
            className="script-version border rounded-lg overflow-hidden shadow-sm flex flex-col hover:shadow-md transition-shadow duration-200"
          >
            <div className="p-3 bg-gray-50 border-b flex justify-between items-center">
              <h4 className="font-medium text-gray-800">Versão {index + 1}: {getVersionStyle(index)}</h4>
              
              {/* Botão de cópia - visível apenas para a versão gratuita ou assinantes */}
              {index === 0 && (
                <button 
                  className="p-1.5 rounded-md text-gray-500 hover:bg-gray-200 transition-colors"
                  onClick={() => copyToClipboard(content, index)}
                  aria-label="Copiar conteúdo"
                  title="Copiar conteúdo"
                >
                  {copiedIndex === index ? (
                    <CheckCircle2 className="h-4 w-4 text-green-500" />
                  ) : (
                    <Copy className="h-4 w-4" />
                  )}
                </button>
              )}
            </div>
            
            <div className="p-4 flex-grow relative bg-white">
              <div className={`${index === 0 ? 'max-h-[600px]' : 'h-48'} overflow-auto pr-1`}>
                <p className="whitespace-pre-line text-sm text-gray-700">{content}</p>
              </div>
              
              {/* Versões bloqueadas (premium) */}
              {index > 0 && (
                <div className="preview-lock absolute inset-0 flex flex-col items-center justify-center bg-white/90">
                  <div className="w-16 h-16 rounded-full bg-amber-50 flex items-center justify-center mb-3">
                    <LockIcon className="text-amber-500" size={24} />
                  </div>
                  <p className="font-medium text-center mb-2 text-gray-800">Versão Premium</p>
                  <p className="text-gray-500 text-sm text-center max-w-[200px] mb-3">
                    Desbloqueie versões adicionais de roteiros com uma assinatura.
                  </p>
                  <Button size="sm" className="mt-2 bg-amber-500 hover:bg-amber-600">
                    Obter Premium
                  </Button>
                </div>
              )}
              
              {/* Badge para a versão gratuita */}
              {index === 0 && (
                <div className="absolute top-0 right-0 bg-green-500 text-white text-xs px-2 py-1 rounded-bl-md">
                  Grátis
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
import { useState, useEffect } from 'react';
import { useLocation } from 'wouter';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { ArrowRight, Check, Gift } from "lucide-react";

/**
 * Sequência de Upsell Automatizada (Sistema de 3 etapas)
 * - Etapa 1: Oferta imediata após compra (hashtags virais)
 * - Etapa 2: Acesso VIP a templates (mostrado após o primeiro, ou 2 dias depois)
 * - Etapa 3: Curso de edição profissional (última oferta)
 */
export default function UpsellModal() {
  const [open, setOpen] = useState(false);
  const [location] = useLocation();
  const [upsellStep, setUpsellStep] = useState(1);
  const [hasSeenUpsell, setHasSeenUpsell] = useState(false);
  
  useEffect(() => {
    // Verifica se o usuário está na página de agradecimento
    const isThankYouPage = location.includes('/obrigado') || 
                          location.includes('/success') || 
                          location.includes('/thank-you');
    
    // Verifica se já viu o upsell antes
    const upsellHistory = localStorage.getItem('upsellHistory');
    
    if (isThankYouPage) {
      // Apenas mostra se for a primeira vez vendo a página de agradecimento
      if (!upsellHistory) {
        // Atrasa a exibição para dar tempo de ler a mensagem principal
        const timer = setTimeout(() => {
          setOpen(true);
          setUpsellStep(1); // Começa pela primeira oferta
          localStorage.setItem('upsellHistory', JSON.stringify({
            firstSeen: new Date().toISOString(),
            lastStep: 1
          }));
        }, 5000);
        
        return () => clearTimeout(timer);
      } else {
        // Se já viu antes, verifica qual foi a última etapa
        try {
          const history = JSON.parse(upsellHistory);
          // Se já viu a etapa 1 mas não a 2, mostra a etapa 2
          if (history.lastStep === 1) {
            const timer = setTimeout(() => {
              setOpen(true);
              setUpsellStep(2);
              history.lastStep = 2;
              localStorage.setItem('upsellHistory', JSON.stringify(history));
            }, 3000);
            
            return () => clearTimeout(timer);
          }
          // Se já viu a etapa 2 mas não a 3, mostra a etapa 3
          else if (history.lastStep === 2) {
            const timer = setTimeout(() => {
              setOpen(true);
              setUpsellStep(3);
              history.lastStep = 3;
              localStorage.setItem('upsellHistory', JSON.stringify(history));
            }, 3000);
            
            return () => clearTimeout(timer);
          }
        } catch (e) {
          console.error('Erro ao processar histórico de upsell:', e);
        }
      }
    } else {
      // Se não está na página de agradecimento mas tem histórico
      // verifica se já passou 2 dias desde a última visita
      if (upsellHistory) {
        try {
          const history = JSON.parse(upsellHistory);
          const firstSeen = new Date(history.firstSeen);
          const twoDaysLater = new Date(firstSeen);
          twoDaysLater.setDate(twoDaysLater.getDate() + 2);
          
          if (new Date() > twoDaysLater && history.lastStep < 3) {
            // Passou 2 dias e não viu todas as ofertas
            const timer = setTimeout(() => {
              setOpen(true);
              setUpsellStep(history.lastStep + 1);
              history.lastStep += 1;
              localStorage.setItem('upsellHistory', JSON.stringify(history));
            }, 10000); // Mostra após 10 segundos na sessão
            
            return () => clearTimeout(timer);
          }
        } catch (e) {
          console.error('Erro ao processar histórico de upsell:', e);
        }
      }
    }
  }, [location]);
  
  const handleAccept = () => {
    // Processa a compra do upsell atual
    console.log(`Upsell ${upsellStep} accepted!`);
    
    // Diferentes URLs de checkout dependendo do upsell
    const checkoutURLs: Record<number, string> = {
      1: '/checkout/hashtags-virais',
      2: '/checkout/templates-vip',
      3: '/checkout/curso-edicao'
    };
    
    // Redireciona para a página de checkout específica
    window.location.href = checkoutURLs[upsellStep];
    setOpen(false);
  };
  
  const handleReject = () => {
    console.log(`Upsell ${upsellStep} rejected`);
    setOpen(false);
  };

  // Conteúdo dinâmico baseado na etapa atual
  const upsellContent: Record<number, {
    title: string;
    color: string;
    description: React.ReactNode;
    acceptText: string;
    acceptColor: string;
  }> = {
    // Etapa 1: Hashtags Virais
    1: {
      title: "🎁 Quer 100 Hashtags Virais por apenas R$9,90?",
      color: "from-purple-600 to-pink-500",
      description: (
        <>
          <p className="mb-4">
            <span className="font-bold text-black">Parabéns pela sua compra!</span> Que tal aumentar ainda mais seu alcance?
          </p>
          
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-4">
            <h4 className="font-bold text-xl mb-2 text-black">Pacote Hashtag Viral</h4>
            <p className="mb-1">✅ 100+ hashtags otimizadas por nicho</p>
            <p className="mb-1">✅ Guia de timing perfeito para postagens</p>
            <p className="mb-1">✅ Acesso ao grupo VIP de criadores</p>
            
            <div className="flex items-center mt-4">
              <span className="line-through text-gray-500 mr-2">R$ 97</span>
              <span className="bg-red-500 text-white text-xs px-2 py-1 rounded">90% OFF</span>
              <span className="text-xl font-bold ml-2 text-black">R$ 9,90</span>
            </div>
          </div>
          
          <p className="text-sm text-gray-500 italic">Esta oferta é válida apenas agora e não estará disponível posteriormente.</p>
        </>
      ),
      acceptText: "SIM, QUERO BOMBAR MINHAS REDES! 🚀",
      acceptColor: "from-green-500 to-green-600"
    },
    
    // Etapa 2: Templates Premium
    2: {
      title: "🔓 Acesso VIP a 200 templates por R$29/mês",
      color: "from-blue-600 to-cyan-500",
      description: (
        <>
          <p className="mb-4">
            <span className="font-bold text-black">Oferta Exclusiva!</span> Para você que já é nosso cliente:
          </p>
          
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
            <h4 className="font-bold text-xl mb-2 text-black">Clube VIP de Templates</h4>
            <p className="mb-1">✅ 200+ templates profissionais atualizados mensalmente</p>
            <p className="mb-1">✅ Categorias específicas para cada plataforma</p>
            <p className="mb-1">✅ Personalizáveis em 1-clique para sua marca</p>
            <p className="mb-1">✅ Prioridade no suporte técnico</p>
            
            <div className="flex items-center mt-4">
              <span className="line-through text-gray-500 mr-2">R$ 97/mês</span>
              <span className="bg-red-500 text-white text-xs px-2 py-1 rounded">70% OFF</span>
              <span className="text-xl font-bold ml-2 text-black">R$ 29/mês</span>
            </div>
          </div>
          
          <p className="text-sm text-gray-500 italic">Você pode cancelar a qualquer momento. Oferta válida por 48h.</p>
        </>
      ),
      acceptText: "QUERO ACESSO VIP AGORA ✨",
      acceptColor: "from-blue-500 to-blue-600"
    },
    
    // Etapa 3: Curso de Edição Profissional
    3: {
      title: "🎬 Curso de Edição Profissional com 50% OFF",
      color: "from-orange-500 to-amber-500",
      description: (
        <>
          <p className="mb-4">
            <span className="font-bold text-black">Última Chance!</span> Aprenda a editar como um profissional:
          </p>
          
          <div className="bg-orange-50 border border-orange-200 rounded-lg p-4 mb-4">
            <h4 className="font-bold text-xl mb-2 text-black">Masterclass de Edição</h4>
            <p className="mb-1">✅ 12 aulas completas com exercícios práticos</p>
            <p className="mb-1">✅ Acesso vitalício ao conteúdo e atualizações</p>
            <p className="mb-1">✅ 50+ efeitos e transições prontas</p>
            <p className="mb-1">✅ Certificado de conclusão</p>
            
            <div className="flex items-center mt-4">
              <span className="line-through text-gray-500 mr-2">R$ 397</span>
              <span className="bg-red-500 text-white text-xs px-2 py-1 rounded">50% OFF</span>
              <span className="text-xl font-bold ml-2 text-black">R$ 197</span>
            </div>
          </div>
          
          <div className="flex items-center gap-2 mt-4 bg-green-50 p-3 rounded-lg">
            <div className="flex-shrink-0 w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
              <Gift className="w-4 h-4 text-green-600" />
            </div>
            <p className="text-sm text-green-800">
              <strong>BÔNUS:</strong> 5 licenças de música sem royalties para seus vídeos!
            </p>
          </div>
        </>
      ),
      acceptText: "QUERO VIRAR UM EDITOR PROFISSIONAL 🎥",
      acceptColor: "from-orange-500 to-red-600"
    }
  };
  
  // Conteúdo atual baseado na etapa
  const currentContent = upsellContent[upsellStep];

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="max-w-md mx-auto bg-white p-0 rounded-lg overflow-hidden">
        <div className={`w-full bg-gradient-to-r ${currentContent.color} py-3 px-4`}>
          <DialogTitle className="text-xl text-white font-bold flex items-center gap-2">
            {currentContent.title}
          </DialogTitle>
        </div>
        
        <div className="p-6">
          <DialogDescription className="text-gray-700 mb-6 text-base">
            {currentContent.description}
          </DialogDescription>
          
          <DialogFooter className="flex flex-col sm:flex-row gap-3">
            <Button 
              className={`bg-gradient-to-r ${currentContent.acceptColor} hover:brightness-110 text-white font-bold w-full py-6 text-lg`}
              onClick={handleAccept}
            >
              {currentContent.acceptText}
            </Button>
            
            <Button 
              variant="outline" 
              className="text-gray-500 hover:text-gray-700 w-full"
              onClick={handleReject}
            >
              Não, obrigado
            </Button>
          </DialogFooter>
        </div>
      </DialogContent>
    </Dialog>
  );
}
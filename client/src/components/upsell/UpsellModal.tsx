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

/**
 * Modal de upsell exibido após a conclusão do pagamento
 * Oferece um produto complementar com desconto especial
 */
export default function UpsellModal() {
  const [open, setOpen] = useState(false);
  const [location] = useLocation();
  
  useEffect(() => {
    // Exibe o modal se estiver na página de agradecimento/obrigado
    if (location.includes('/obrigado') || location.includes('/success') || location.includes('/thank-you')) {
      // Atrasa a exibição para dar tempo de ler a mensagem principal
      const timer = setTimeout(() => {
        setOpen(true);
      }, 3000);
      
      return () => clearTimeout(timer);
    }
  }, [location]);
  
  const handleAccept = () => {
    // Aqui seria redirecionado para a página de checkout do upsell
    // ou adicionaria diretamente ao carrinho
    console.log('Upsell accepted!');
    window.location.href = '/checkout/upsell';
    setOpen(false);
  };
  
  const handleReject = () => {
    console.log('Upsell rejected');
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="max-w-md mx-auto bg-white p-0 rounded-lg overflow-hidden">
        <div className="w-full bg-gradient-to-r from-purple-600 to-pink-500 py-3 px-4">
          <DialogTitle className="text-xl text-white font-bold flex items-center gap-2">
            🎁 Presente especial para você!
          </DialogTitle>
        </div>
        
        <div className="p-6">
          <DialogDescription className="text-gray-700 mb-6 text-base">
            <p className="mb-4">
              <span className="font-bold text-black">Parabéns pela sua compra!</span> Temos uma oferta exclusiva para novos clientes:
            </p>
            
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-4">
              <h4 className="font-bold text-xl mb-2 text-black">Pacote Hashtag Viral</h4>
              <p className="mb-1">✅ 200+ hashtags otimizadas por nicho</p>
              <p className="mb-1">✅ Guia de timing perfeito para postagens</p>
              <p className="mb-1">✅ 3 templates de descrição de alta conversão</p>
              <p className="mb-1">✅ Acesso ao grupo VIP de criadores</p>
              
              <div className="flex items-center mt-4">
                <span className="line-through text-gray-500 mr-2">R$ 197</span>
                <span className="bg-red-500 text-white text-xs px-2 py-1 rounded">90% OFF</span>
                <span className="text-xl font-bold ml-2 text-black">R$ 19</span>
              </div>
            </div>
            
            <p className="text-sm text-gray-500 italic">Esta oferta é válida apenas agora e não estará disponível posteriormente.</p>
          </DialogDescription>
          
          <DialogFooter className="flex flex-col sm:flex-row gap-3">
            <Button 
              className="bg-gradient-to-r from-green-500 to-green-600 hover:brightness-110 text-white font-bold w-full py-6 text-lg"
              onClick={handleAccept}
            >
              SIM, QUERO BOMBAR MINHAS REDES! 🚀
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
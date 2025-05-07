import { useState, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

export default function ExitPopup() {
  const [open, setOpen] = useState(false);
  const [alreadyShown, setAlreadyShown] = useState(false);
  
  useEffect(() => {
    // Verifica se o popup já foi mostrado nesta sessão
    const popupShown = sessionStorage.getItem('exitPopupShown');
    if (popupShown) {
      setAlreadyShown(true);
    }
    
    const handleMouseLeave = (e: MouseEvent) => {
      // Se o mouse sair do documento pela parte superior
      if (
        e.clientY <= 5 && // Quase no topo da página
        !alreadyShown && // Não mostrou ainda nesta sessão
        document.body.scrollTop > 100 // Já rolou um pouco
      ) {
        setOpen(true);
        sessionStorage.setItem('exitPopupShown', 'true');
        setAlreadyShown(true);
      }
    };
    
    // Só adiciona o listener depois de 10 segundos para evitar mostrar logo que a pessoa entrou
    const timer = setTimeout(() => {
      document.addEventListener('mouseleave', handleMouseLeave);
    }, 10000);
    
    return () => {
      clearTimeout(timer);
      document.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, [alreadyShown]);
  
  const handleAccept = () => {
    // Gera um código promocional temporário
    const discountCode = `VOLTE${Math.floor(Math.random() * 1000)}`;
    
    // Salva o código no storage
    localStorage.setItem('discountCode', discountCode);
    
    // Fecha o popup
    setOpen(false);
    
    // Redireciona para a página de checkout com desconto
    window.location.href = '/checkout?discount=true';
  };
  
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="max-w-md mx-auto bg-white p-0 rounded-lg overflow-hidden">
        <div className="w-full bg-gradient-to-r from-blue-600 to-indigo-500 py-3 px-4">
          <DialogTitle className="text-2xl text-white font-bold">
            ESPERE! 🎁
          </DialogTitle>
        </div>
        
        <div className="p-6">
          <DialogDescription className="text-gray-700 mb-6 text-lg">
            <p className="mb-4 text-xl font-semibold text-black">
              Antes de sair...
            </p>
            
            <p className="mb-4">
              Sabemos que tomar uma decisão nem sempre é fácil, por isso 
              preparamos um <span className="font-bold">desconto exclusivo</span> de:
            </p>
            
            <div className="bg-red-50 border border-red-100 rounded-lg p-4 mb-4 text-center">
              <span className="text-3xl font-bold text-red-600">20% OFF</span>
              <p className="text-gray-600 text-sm mt-1">Válido apenas hoje!</p>
            </div>
            
            <p className="text-sm text-gray-500 italic">
              Esta oferta é exclusiva e não será exibida novamente.
            </p>
          </DialogDescription>
          
          <DialogFooter className="flex flex-col gap-3">
            <Button 
              className="bg-gradient-to-r from-green-500 to-green-600 hover:brightness-110 text-white font-bold w-full py-5 text-lg"
              onClick={handleAccept}
            >
              QUERO APROVEITAR O DESCONTO AGORA!
            </Button>
            
            <Button 
              variant="link" 
              className="text-gray-400 hover:text-gray-600"
              onClick={() => setOpen(false)}
            >
              Não, obrigado
            </Button>
          </DialogFooter>
        </div>
      </DialogContent>
    </Dialog>
  );
}
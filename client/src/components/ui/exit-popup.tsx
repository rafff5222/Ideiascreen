import { useEffect, useState } from "react";
import { X } from "lucide-react";
import { Button } from "./button";

export default function ExitPopup() {
  const [showPopup, setShowPopup] = useState(false);
  const [hasTriggered, setHasTriggered] = useState(false);

  const handleMouseLeave = (e: MouseEvent) => {
    // Se o mouse sair pela parte superior da página e ainda não tiver exibido o popup
    if (e.clientY <= 0 && !hasTriggered) {
      setShowPopup(true);
      setHasTriggered(true);
    }
  };

  useEffect(() => {
    // Adiciona o event listener apenas após 5 segundos na página
    // (evita que o popup seja exibido imediatamente ao entrar)
    const timer = setTimeout(() => {
      document.addEventListener("mouseleave", handleMouseLeave);
    }, 5000);

    return () => {
      clearTimeout(timer);
      document.removeEventListener("mouseleave", handleMouseLeave);
    };
  }, [hasTriggered]);

  if (!showPopup) return null;

  return (
    <>
      {/* Overlay */}
      <div className="fixed inset-0 bg-black/60 z-[100] backdrop-blur-sm" />
      
      {/* Popup */}
      <div className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white z-[101] 
                     rounded-xl shadow-2xl w-[90%] max-w-md p-8 border-4 border-purple-500">
        <button 
          onClick={() => setShowPopup(false)} 
          className="absolute top-3 right-3 text-gray-500 hover:text-gray-800"
        >
          <X className="h-6 w-6" />
        </button>

        <div className="text-center mb-6">
          <div className="text-4xl mb-2">🚨</div>
          <h3 className="text-2xl font-bold mb-2">Espere! Temos uma oferta especial para você!</h3>
          <div className="bg-yellow-100 p-3 rounded-lg mb-4">
            <p className="text-yellow-800 font-bold">
              20% DE DESCONTO
            </p>
            <p className="text-sm text-yellow-700">
              no plano Premium hoje
            </p>
          </div>
          <p className="text-gray-600 mb-4">Não perca esta oportunidade única! Esta oferta é válida apenas por hoje.</p>
          
          <div className="flex flex-col gap-3">
            <Button 
              className="bg-gradient-to-r from-purple-600 to-pink-500 text-white font-bold px-6 py-3 rounded-lg shadow-lg hover:brightness-110 hover:scale-105 transition duration-300"
              onClick={() => setShowPopup(false)}
            >
              QUERO MEU DESCONTO AGORA
            </Button>
            
            <button 
              onClick={() => setShowPopup(false)} 
              className="text-sm text-gray-500 hover:text-gray-700"
            >
              Não, obrigado
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
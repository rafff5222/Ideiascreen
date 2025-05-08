import { useEffect, useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { ShieldCheck, CreditCard, Smartphone, Clock3, AlertCircle, Camera, X } from "lucide-react";

/**
 * Componente de checkout avançado com múltiplas opções de pagamento
 * Inclui inovação experimental: pagamento com reconhecimento facial
 */
export default function AdvancedCheckout() {
  const [showPaymentOptions, setShowPaymentOptions] = useState(false);
  const [showCamera, setShowCamera] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  
  useEffect(() => {
    // Listener para abrir painel de pagamento
    const handleCheckoutClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      
      // Verifica se é um botão de checkout ou plano
      if (
        target.classList.contains('checkout-button') || 
        target.closest('.checkout-button') ||
        target.classList.contains('btn-plan') ||
        target.closest('.btn-plan')
      ) {
        e.preventDefault();
        setShowPaymentOptions(true);
      }
    };
    
    // Adiciona listener global
    document.addEventListener('click', handleCheckoutClick);
    
    // Cleanup
    return () => {
      document.removeEventListener('click', handleCheckoutClick);
      stopCamera();
    };
  }, []);
  
  // Inicia a câmera para reconhecimento facial
  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: { 
          width: { ideal: 1280 },
          height: { ideal: 720 },
          facingMode: "user"
        } 
      });
      
      streamRef.current = stream;
      
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        setShowCamera(true);
      }
      
      // Simulação: após 3 segundos, processa o "reconhecimento" e fecha
      setTimeout(() => {
        processFacialPayment();
      }, 3000);
      
    } catch (error) {
      console.error("Erro ao acessar câmera:", error);
      alert("Não foi possível acessar sua câmera. Por favor, use outro método de pagamento.");
    }
  };
  
  // Para a câmera e limpa recursos
  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }
    setShowCamera(false);
  };
  
  // Processa pagamento facial (simulado)
  const processFacialPayment = () => {
    stopCamera();
    setShowPaymentOptions(false);
    
    // Feedback visual de sucesso
    const successElement = document.createElement('div');
    successElement.className = 'fixed inset-0 flex items-center justify-center bg-black/70 z-50';
    successElement.innerHTML = `
      <div class="bg-white p-8 rounded-lg shadow-lg text-center max-w-md">
        <div class="w-20 h-20 mx-auto mb-4 rounded-full bg-green-100 flex items-center justify-center">
          <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="text-green-600">
            <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
            <polyline points="22 4 12 14.01 9 11.01"></polyline>
          </svg>
        </div>
        <h3 class="text-2xl font-bold text-gray-900 mb-2">Identidade Confirmada!</h3>
        <p class="text-lg text-gray-700 mb-6">Pagamento processado com sucesso.</p>
        <button class="px-6 py-3 bg-primary text-white rounded-lg shadow-lg hover:bg-primary/90 transition-colors">
          Continuar
        </button>
      </div>
    `;
    
    document.body.appendChild(successElement);
    
    // Remove o elemento após 3 segundos
    setTimeout(() => {
      document.body.removeChild(successElement);
    }, 3000);
  };
  
  // Fecha modal de pagamento
  const closePaymentModal = () => {
    setShowPaymentOptions(false);
    stopCamera();
  };
  
  if (!showPaymentOptions) {
    return null;
  }
  
  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-xl max-w-md w-full p-6 relative">
        <button 
          onClick={closePaymentModal}
          className="absolute top-3 right-3 text-gray-500 hover:text-gray-700"
        >
          <X size={24} />
        </button>
        
        <h3 className="text-2xl font-bold mb-6 text-center">
          Finalizar Assinatura
        </h3>
        
        {showCamera ? (
          <div className="mb-6">
            <div className="relative overflow-hidden rounded-lg bg-gray-100">
              <video 
                ref={videoRef}
                autoPlay 
                playsInline
                className="w-full h-64 object-cover"
              />
              
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-40 h-40 border-2 border-primary rounded-full"></div>
              </div>
              
              <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-black/70 to-transparent p-4 text-white">
                <div className="animate-pulse flex items-center justify-center">
                  <span className="mr-2">Escaneando identidade</span>
                  <span className="flex space-x-1">
                    <span className="inline-block w-2 h-2 bg-white rounded-full"></span>
                    <span className="inline-block w-2 h-2 bg-white rounded-full animate-bounce"></span>
                    <span className="inline-block w-2 h-2 bg-white rounded-full"></span>
                  </span>
                </div>
              </div>
            </div>
            
            <Button 
              className="w-full mt-4" 
              variant="outline" 
              onClick={stopCamera}
            >
              Cancelar escaneamento
            </Button>
          </div>
        ) : (
          <>
            <div className="mb-6 p-4 bg-primary/10 rounded-lg">
              <div className="flex justify-between mb-4">
                <span className="text-gray-600">Plano Premium</span>
                <span className="font-semibold">R$ 89,00/mês</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Economia anual</span>
                <span className="text-green-600 font-medium">R$ 240,00</span>
              </div>
              <div className="mt-4 pt-4 border-t border-gray-200">
                <div className="flex justify-between font-bold">
                  <span>Total hoje</span>
                  <span>R$ 89,00</span>
                </div>
              </div>
            </div>
            
            <div className="space-y-3 mb-6">
              <div className="text-sm text-gray-500 mb-2">Escolha como pagar:</div>
              
              <Button className="w-full justify-start gap-3 bg-white border hover:bg-gray-50 text-gray-800">
                <CreditCard size={20} />
                <span>Cartão de Crédito</span>
              </Button>
              
              <Button className="w-full justify-start gap-3 bg-white border hover:bg-gray-50 text-gray-800">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" width="20" height="20">
                  <path d="M346.7 74.3V74c0-15.7-12.7-28.3-28.3-28.3h-240C62.7 45.7 50 58.3 50 74v182.3h296.7V74.3z" fill="#3F4040"/>
                  <path d="M305 228H91.7c-8.3 0-15-6.7-15-15v-7.7H320v7.7c0 8.3-6.7 15-15 15z" fill="#00C8FF"/>
                  <path d="M346.7 256.3H50V348c0 15.7 12.7 28.3 28.3 28.3h240c15.7 0 28.3-12.7 28.3-28.3v-91.7z" fill="#FFBC00"/>
                  <path d="M462 211h-60.3c-27.3 0-49.7 22-49.7 49.7v107c0 27.3 22 49.7 49.7 49.7H462c27.3 0 49.7-22 49.7-49.7v-107c0-27.7-22.3-49.7-49.7-49.7z" fill="#84BD47"/>
                  <path d="M462 242.3c-9.7 0-18 3.7-24.7 9.7-6.7-6-15-9.7-24.7-9.7-20 0-36.3 16.3-36.3 36.3s16.3 36.3 36.3 36.3c9.7 0 18-3.7 24.7-9.7 6.7 6 15 9.7 24.7 9.7 20 0 36.3-16.3 36.3-36.3s-16.3-36.3-36.3-36.3z" fill="#FFF"/>
                  <path d="M435.7 318.7h52.7c1.7 0 3-1.3 3-3s-1.3-3-3-3h-52.7c-1.7 0-3 1.3-3 3s1.3 3 3 3zm0 18.6h52.7c1.7 0 3-1.3 3-3s-1.3-3-3-3h-52.7c-1.7 0-3 1.3-3 3s1.3 3 3 3zm0 18.7h52.7c1.7 0 3-1.3 3-3s-1.3-3-3-3h-52.7c-1.7 0-3 1.3-3 3s1.3 3 3 3z" fill="#FFF"/>
                </svg>
                <span>PIX</span>
              </Button>
              
              <Button className="w-full justify-start gap-3 bg-white border hover:bg-gray-50 text-gray-800">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <rect width="24" height="24" rx="4" fill="#000000"/>
                  <path d="M17.0602 12.7142C17.0575 11.9848 17.2715 11.2738 17.6776 10.6685C18.0837 10.0631 18.6655 9.58828 19.3474 9.3C18.9708 8.7434 18.45 8.29629 17.836 7.9998C17.2219 7.7033 16.5347 7.56177 15.8389 7.59116C14.0897 7.45655 12.4949 8.76929 11.601 8.76929C10.6915 8.76929 9.39286 7.6029 7.87093 7.63487C7.0283 7.65676 6.20248 7.86437 5.4647 8.2395C4.72692 8.61463 4.09913 9.1483 3.63978 9.79611C2.09213 12.238 3.22501 15.7956 4.70627 17.7846C5.44685 18.7609 6.30575 19.8596 7.41805 19.8117C8.50445 19.7598 8.93995 19.0772 10.2455 19.0772C11.5356 19.0772 11.9441 19.8117 13.0795 19.7818C14.2559 19.7598 14.9984 18.7828 15.7161 17.7965C16.2572 17.0978 16.6713 16.3064 16.9402 15.4597C16.0879 15.11 15.3963 14.4901 14.9863 13.7116C14.5763 12.9331 14.4733 12.0418 14.6956 11.1975C15.3556 11.1975 16.3704 11.8163 17.0602 12.7142Z" fill="white"/>
                  <path d="M14.1113 6.14541C14.7616 5.35556 15.0508 4.33897 14.9058 3.33301C13.9332 3.44044 13.0521 3.93721 12.4519 4.71654C12.1618 5.09314 11.9506 5.52635 11.83 5.9881C11.7094 6.44984 11.6816 6.93105 11.7482 7.40409C12.2372 7.41482 12.7232 7.31456 13.1672 7.11049C13.6113 6.90641 14.0019 6.60401 14.3113 6.22777C14.2547 6.19875 14.2052 6.16087 14.1666 6.11611C14.128 6.07135 14.1008 6.0206 14.0868 5.96612C14.0729 5.91165 14.0724 5.85488 14.0854 5.80025C14.0985 5.74562 14.1249 5.69456 14.1629 5.64935C14.2008 5.60415 14.2497 5.56576 14.3057 5.53664C14.3618 5.50753 14.4239 5.48831 14.4881 5.4801C14.5524 5.47188 14.6172 5.47486 14.6798 5.48887C14.7424 5.50288 14.8012 5.52761 14.8528 5.56161C14.8528 5.75682 14.9303 5.94391 15.0681 6.08163C15.2058 6.21935 15.3929 6.2969 15.5881 6.2969C15.7834 6.2969 15.9705 6.21935 16.1082 6.08163C16.246 5.94391 16.3235 5.75682 16.3235 5.56161C16.3235 5.3664 16.246 5.17931 16.1082 5.04159C15.9705 4.90387 15.7834 4.82632 15.5881 4.82632C15.5317 4.82619 15.4754 4.83299 15.4207 4.84653C15.2472 4.28886 14.9141 3.7966 14.4688 3.43041C14.4688 3.43041 14.1113 4.62748 12.9618 5.00499C12.9618 5.00499 12.7825 5.05673 12.8155 5.20198C12.8155 5.20198 13.4064 5.31042 14.1113 6.14541Z" fill="white"/>
                </svg>
                <span>Apple Pay</span>
              </Button>
              
              <Button 
                className="w-full justify-start gap-3 bg-white border hover:bg-gray-50 text-gray-800"
                onClick={startCamera}
              >
                <div className="relative">
                  <Camera size={20} />
                  <span className="absolute -top-1 -right-1 bg-green-400 rounded-full w-2 h-2"></span>
                </div>
                <span>Pagar com Reconhecimento Facial</span>
                <div className="ml-auto rounded bg-purple-100 text-purple-800 text-xs px-1.5 py-0.5">Novo</div>
              </Button>
            </div>
            
            <div className="flex items-center text-sm text-gray-500 gap-2 mb-4">
              <ShieldCheck size={16} className="text-green-600" />
              <span>Pagamento 100% seguro com criptografia SSL</span>
            </div>
            
            <div className="flex justify-between text-xs text-gray-400">
              <div className="flex items-center gap-1">
                <Clock3 size={12} />
                <span>2 min para finalizar</span>
              </div>
              <div className="flex items-center gap-1">
                <AlertCircle size={12} />
                <span>Suporte por e-mail/WhatsApp</span>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
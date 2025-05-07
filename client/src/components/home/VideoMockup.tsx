import { useState, useRef } from 'react';

// Componente para mockup de vídeo interativo com botão de play
export default function VideoMockup() {
  const [isMuted, setIsMuted] = useState(true);
  const [isHovered, setIsHovered] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  // Função para reproduzir o vídeo com som quando o usuário clicar no botão
  const handlePlayWithSound = () => {
    if (videoRef.current) {
      // Remove o mute e atualize o estado
      videoRef.current.muted = false;
      setIsMuted(false);
      
      // Se o vídeo estiver pausado, inicie a reprodução
      if (videoRef.current.paused) {
        videoRef.current.play();
      }
    }
  };

  return (
    <div 
      className="relative bg-gradient-to-br from-gray-900 to-gray-800 p-3 rounded-2xl shadow-2xl border border-gray-700 hero-mockup"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="rounded-lg overflow-hidden relative">
        {/* Vídeo em loop que começa silencioso */}
        <video 
          ref={videoRef}
          autoPlay 
          muted={isMuted}
          loop 
          playsInline
          className="w-full h-auto rounded-lg"
        >
          {/* Como não temos um vídeo real aqui, usaremos um placeholder */}
          <source 
            src="https://storage.googleapis.com/gtv-videos-bucket/sample/ForBiggerFun.mp4" 
            type="video/mp4" 
          />
          Seu navegador não suporta vídeos HTML5.
        </video>
        
        {/* Botão grande de play no centro, visível quando houver pausa ou hover */}
        {(isMuted || isHovered) && (
          <div 
            className="play-button absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 
                       w-16 h-16 bg-white/30 hover:bg-white/50 backdrop-blur-md rounded-full 
                       flex items-center justify-center cursor-pointer transition-all duration-300
                       shadow-lg border border-white/30"
            onClick={handlePlayWithSound}
          >
            <div className="w-0 h-0 border-t-[12px] border-t-transparent border-l-[20px] border-l-white border-b-[12px] border-b-transparent ml-1"></div>
          </div>
        )}
        
        {/* Texto sobreposto indicando exemplo de vídeo sendo gerado */}
        {isMuted && (
          <div className="absolute bottom-0 left-0 w-full bg-gradient-to-t from-black/70 to-transparent flex flex-col justify-end p-5">
            <div className="bg-white/20 backdrop-blur-md rounded-lg p-3 mb-3 w-3/4">
              <div className="h-2 bg-purple-500 rounded-full w-2/3 mb-2"></div>
              <div className="h-2 bg-purple-400/80 rounded-full w-1/2"></div>
            </div>
            <div className="flex justify-between items-center">
              <div className="text-white text-xs font-medium">Vídeo gerado com ContentPro</div>
              <div className="text-xs font-bold bg-gradient-to-r from-purple-500 to-pink-500 text-white px-3 py-1 rounded-full">
                Pronto para uso
              </div>
            </div>
          </div>
        )}
      </div>
      
      {/* Mockup de controles da interface */}
      <div className="flex justify-between items-center mt-3 px-2">
        <div className="flex gap-2">
          <div className="w-3 h-3 rounded-full bg-red-500"></div>
          <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
          <div className="w-3 h-3 rounded-full bg-green-500"></div>
        </div>
        <div className="text-xs text-white/80 font-medium">ContentPro • Vídeo Pronto</div>
      </div>
    </div>
  );
}
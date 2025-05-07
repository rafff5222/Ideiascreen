import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Play } from "lucide-react";

export default function VideoMockup() {
  const [playing, setPlaying] = useState(false);
  
  return (
    <div className="hero-mockup w-full overflow-hidden">
      <div className="relative aspect-video">
        {/* Exibe placeholder quando não estiver reproduzindo */}
        {!playing && (
          <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-black/40 to-black/80 z-10">
            <Button 
              onClick={() => setPlaying(true)}
              className="w-16 h-16 rounded-full bg-white text-primary-500 hover:bg-white/90 hover:scale-110 transition duration-300"
              aria-label="Reproduzir vídeo"
            >
              <Play size={28} className="ml-1" />
            </Button>
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent pointer-events-none"></div>
            <div className="absolute bottom-4 left-4 right-4 text-white">
              <h3 className="text-xl font-bold">Veja como funciona</h3>
              <p className="text-sm text-white/80">Aprenda a usar o poder da IA para criar conteúdo viral em minutos</p>
            </div>
          </div>
        )}
        
        {/* Iframe do vídeo */}
        <iframe
          className={`w-full h-full ${playing ? 'z-20' : 'z-0'}`}
          src={`https://www.youtube.com/embed/dQw4w9WgXcQ?autoplay=${playing ? 1 : 0}&controls=${playing ? 1 : 0}`}
          title="Demo do produto"
          frameBorder="0"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
        ></iframe>
      </div>
      
      {/* Indicadores na parte inferior */}
      <div className="bg-gradient-to-r from-gray-900 to-gray-800 p-3 flex justify-between items-center">
        <div className="flex items-center">
          <div className="w-3 h-3 rounded-full bg-red-500 animate-pulse mr-2"></div>
          <span className="text-gray-300 text-xs">GRAVANDO</span>
        </div>
        
        <div className="flex gap-2">
          <div className="h-1 w-12 bg-gray-700 rounded-full"></div>
          <div className="h-1 w-8 bg-gray-700 rounded-full"></div>
          <div className="h-1 w-10 bg-gray-700 rounded-full"></div>
        </div>
      </div>
    </div>
  );
}
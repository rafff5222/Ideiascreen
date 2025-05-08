import { useState } from 'react';
import ContentPreview from '@/components/content-generator/ContentPreview';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { platforms, communicationStyles } from '@/lib/utils';

export default function Generator() {
  const [prompt, setPrompt] = useState('');
  const [platform, setPlatform] = useState('instagram');
  const [style, setStyle] = useState('casual');
  const [showPreview, setShowPreview] = useState(false);

  const handleGenerate = () => {
    if (!prompt) {
      return;
    }
    
    setShowPreview(true);
  };

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-3xl md:text-4xl font-bold mb-4">
            Gerador de Conteúdo Para Redes Sociais
          </h1>
          <p className="text-lg text-gray-600">
            Gere scripts, legendas e ideias para suas redes sociais em segundos
          </p>
        </div>

        <div className="bg-white rounded-xl shadow-md p-6 mb-8">
          <h2 className="text-xl font-bold mb-6">O que você deseja criar?</h2>
          
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="platform">Plataforma</Label>
                <Select
                  value={platform}
                  onValueChange={setPlatform}
                >
                  <SelectTrigger id="platform">
                    <SelectValue placeholder="Selecione a plataforma" />
                  </SelectTrigger>
                  <SelectContent>
                    {platforms.map((item) => (
                      <SelectItem key={item.id} value={item.id}>
                        {item.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <Label htmlFor="style">Estilo de comunicação</Label>
                <Select
                  value={style}
                  onValueChange={setStyle}
                >
                  <SelectTrigger id="style">
                    <SelectValue placeholder="Selecione o estilo" />
                  </SelectTrigger>
                  <SelectContent>
                    {communicationStyles.map((item) => (
                      <SelectItem key={item.id} value={item.id}>
                        {item.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            
            <div>
              <Label htmlFor="prompt">O que seu conteúdo deve abordar?</Label>
              <Input
                id="prompt"
                placeholder="Ex: Como ganhar seguidores no Instagram, Dicas para crescer no TikTok..."
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                className="mt-1"
              />
            </div>
            
            <div className="pt-4">
              <Button 
                onClick={handleGenerate}
                className="w-full py-6 text-lg"
                disabled={!prompt}
              >
                Gerar Conteúdo Agora
              </Button>
            </div>
          </div>
        </div>

        {showPreview && (
          <ContentPreview 
            prompt={prompt} 
            platform={platform} 
            style={style}
          />
        )}
        
        <div className="bg-gray-50 border border-gray-200 rounded-xl p-6 mt-12">
          <h2 className="text-xl font-bold mb-4">Por que usar nosso gerador de conteúdo?</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white p-4 rounded-lg shadow-sm">
              <div className="text-primary font-bold text-lg mb-2">Economize tempo</div>
              <p className="text-gray-600">Gere conteúdo de qualidade em segundos ao invés de horas</p>
            </div>
            
            <div className="bg-white p-4 rounded-lg shadow-sm">
              <div className="text-primary font-bold text-lg mb-2">Aumente engajamento</div>
              <p className="text-gray-600">Conteúdo otimizado para cada plataforma e algoritmo</p>
            </div>
            
            <div className="bg-white p-4 rounded-lg shadow-sm">
              <div className="text-primary font-bold text-lg mb-2">Nunca fique sem ideias</div>
              <p className="text-gray-600">Centenas de formatos e abordagens para seu nicho</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
import { useState } from 'react';
import ContentPreview from '@/components/content-generator/ContentPreview';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { platforms, communicationStyles } from '@/lib/utils';
import { Info, MessageSquare, Monitor, Sparkles, Film, Zap } from 'lucide-react';

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
        <div className="text-center mb-10">
          <h1 className="text-3xl md:text-5xl font-bold mb-4 text-white">
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-amber-400 to-amber-600">IDEIA</span>
            <span className="text-white">SCREEN</span>
          </h1>
          <p className="text-lg md:text-xl text-gray-300 max-w-2xl mx-auto">
            Transforme suas ideias em roteiros profissionais com estrutura cinematográfica
          </p>
          
          {/* Indicadores de benefícios */}
          <div className="flex flex-wrap justify-center gap-4 mt-4">
            <div className="flex items-center text-gray-300 text-sm">
              <Sparkles className="w-4 h-4 text-amber-400 mr-1" />
              <span>Narrativa Profissional</span>
            </div>
            <div className="flex items-center text-gray-300 text-sm">
              <Film className="w-4 h-4 text-amber-400 mr-1" />
              <span>Estrutura Cinematográfica</span>
            </div>
            <div className="flex items-center text-gray-300 text-sm">
              <Zap className="w-4 h-4 text-amber-400 mr-1" />
              <span>Geração em Segundos</span>
            </div>
          </div>
        </div>

        <div className="bg-gray-800/80 backdrop-blur-sm rounded-xl border border-gray-700/50 shadow-xl shadow-black/20 p-8 mb-8 relative overflow-hidden">
          {/* Efeito visual de fundo */}
          <div className="absolute -top-24 -right-24 w-64 h-64 bg-amber-500 rounded-full filter blur-3xl opacity-5 pointer-events-none"></div>
          
          <h2 className="text-2xl font-bold mb-6 text-white flex items-center">
            <MessageSquare className="w-6 h-6 mr-2 text-amber-400" />
            Criar Roteiro
          </h2>
          
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="relative">
                <Label htmlFor="platform" className="text-white mb-2 block">
                  Plataforma
                  <span className="ml-1 text-amber-400 text-xs">(obrigatório)</span>
                </Label>
                <div className="relative">
                  <Select
                    value={platform}
                    onValueChange={setPlatform}
                  >
                    <SelectTrigger id="platform" className="bg-gray-900 border-gray-700 text-white focus:ring-amber-500">
                      <SelectValue placeholder="Escolha a rede social" />
                    </SelectTrigger>
                    <SelectContent className="bg-gray-900 border-gray-700 text-white">
                      {platforms.map((item) => (
                        <SelectItem key={item.id} value={item.id} className="focus:bg-amber-500/20 focus:text-amber-400">
                          {item.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  
                  {/* Ícone ilustrativo */}
                  <div className="absolute right-12 top-1/2 -translate-y-1/2 pointer-events-none">
                    <Monitor className="w-5 h-5 text-gray-500" />
                  </div>
                </div>
                <p className="text-gray-400 text-xs mt-1">Escolha a rede social para o seu roteiro</p>
              </div>
              
              <div>
                <Label htmlFor="style" className="text-white mb-2 block">
                  Estilo de Comunicação
                </Label>
                <Select
                  value={style}
                  onValueChange={setStyle}
                >
                  <SelectTrigger id="style" className="bg-gray-900 border-gray-700 text-white focus:ring-amber-500">
                    <SelectValue placeholder="Escolha o gênero ou tema" />
                  </SelectTrigger>
                  <SelectContent className="bg-gray-900 border-gray-700 text-white">
                    {communicationStyles.map((item) => (
                      <SelectItem key={item.id} value={item.id} className="focus:bg-amber-500/20 focus:text-amber-400">
                        {item.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <p className="text-gray-400 text-xs mt-1">Define o tom e estilo da narrativa</p>
              </div>
            </div>
            
            <div>
              <Label htmlFor="prompt" className="text-white mb-2 block">
                Descreva sua ideia
                <span className="ml-1 text-amber-400 text-xs">(obrigatório)</span>
              </Label>
              <div className="relative">
                <Input
                  id="prompt"
                  placeholder="Digite sua ideia ou tópico (ex: 'Como ganhar seguidores no Instagram')"
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  className="bg-gray-900 border-gray-700 text-white h-12 pl-4 pr-12 focus:ring-amber-500 placeholder-gray-500"
                />
                
                {/* Botão de informação */}
                <div className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 cursor-help group">
                  <Info className="w-4 h-4" />
                  <div className="absolute hidden group-hover:block right-0 top-full mt-2 p-3 bg-gray-900 text-white text-xs rounded-md w-60 border border-gray-700 z-10">
                    Quanto mais detalhada for sua descrição, melhor será o roteiro gerado. Inclua informações como público-alvo, tom desejado e principais tópicos.
                  </div>
                </div>
              </div>
              <p className="text-gray-400 text-xs mt-1">Uma descrição completa ajuda a gerar um roteiro mais preciso</p>
            </div>
            
            <div className="pt-4">
              <Button 
                onClick={handleGenerate}
                className="w-full py-6 text-lg bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-black font-bold relative overflow-hidden group"
                disabled={!prompt}
              >
                {/* Efeito de brilho animado */}
                <div className="absolute inset-0 w-1/4 h-full bg-white opacity-20 transform -skew-x-12 -translate-x-full group-hover:translate-x-[400%] transition-transform duration-1000 ease-in-out"></div>
                
                <span className="relative z-10 flex items-center justify-center">
                  <Sparkles className="w-6 h-6 mr-2 text-yellow-900" />
                  Gerar Roteiro Agora
                </span>
              </Button>
              <p className="text-center text-gray-400 text-xs mt-2">
                O processo é instantâneo e não requer instalação de nenhum software
              </p>
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
        
        <div className="bg-gray-800/80 backdrop-blur-sm rounded-xl border border-gray-700/50 p-8 mt-12 relative overflow-hidden">
          {/* Efeito visual de fundo */}
          <div className="absolute -bottom-24 -left-24 w-64 h-64 bg-blue-500 rounded-full filter blur-3xl opacity-5 pointer-events-none"></div>
          
          <h2 className="text-2xl font-bold mb-6 text-white flex items-center">
            <Info className="w-6 h-6 mr-2 text-amber-400" />
            Por que escolher o IDEIASCREEN?
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-gray-900/50 p-6 rounded-xl border border-gray-700/50 shadow-lg transition-all duration-300 hover:-translate-y-1 hover:shadow-amber-500/5 group">
              <div className="w-12 h-12 bg-amber-500/20 rounded-full flex items-center justify-center mb-4 group-hover:bg-amber-500/30 transition-colors">
                <Film className="w-6 h-6 text-amber-400" />
              </div>
              <div className="text-amber-400 font-bold text-lg mb-2">Estrutura cinemática</div>
              <p className="text-gray-300">Roteiros com estrutura profissional de início, meio e fim, com arcos narrativos bem definidos</p>
              
              {/* Exemplo visual */}
              <div className="mt-4 h-1 w-full bg-gray-800 rounded overflow-hidden">
                <div className="flex">
                  <div className="h-1 w-1/3 bg-amber-600/40"></div>
                  <div className="h-1 w-1/3 bg-amber-600/70"></div>
                  <div className="h-1 w-1/3 bg-amber-600/40"></div>
                </div>
              </div>
            </div>
            
            <div className="bg-gray-900/50 p-6 rounded-xl border border-gray-700/50 shadow-lg transition-all duration-300 hover:-translate-y-1 hover:shadow-amber-500/5 group">
              <div className="w-12 h-12 bg-amber-500/20 rounded-full flex items-center justify-center mb-4 group-hover:bg-amber-500/30 transition-colors">
                <Sparkles className="w-6 h-6 text-amber-400" />
              </div>
              <div className="text-amber-400 font-bold text-lg mb-2">Personalização total</div>
              <p className="text-gray-300">Controle completo sobre o tom, estilo e abordagem de suas narrativas para qualquer plataforma</p>
              
              {/* Ilustração de opções */}
              <div className="mt-4 flex space-x-2">
                <div className="h-6 w-6 rounded-full bg-amber-500/30"></div>
                <div className="h-6 w-6 rounded-full bg-amber-500/60"></div>
                <div className="h-6 w-6 rounded-full bg-amber-500/90"></div>
              </div>
            </div>
            
            <div className="bg-gray-900/50 p-6 rounded-xl border border-gray-700/50 shadow-lg transition-all duration-300 hover:-translate-y-1 hover:shadow-amber-500/5 group">
              <div className="w-12 h-12 bg-amber-500/20 rounded-full flex items-center justify-center mb-4 group-hover:bg-amber-500/30 transition-colors">
                <Zap className="w-6 h-6 text-amber-400" />
              </div>
              <div className="text-amber-400 font-bold text-lg mb-2">Produtividade máxima</div>
              <p className="text-gray-300">De 2 horas para 2 minutos: gere roteiros profissionais sem bloqueio criativo</p>
              
              {/* Ilustração de economia de tempo */}
              <div className="mt-4 flex items-center space-x-2">
                <div className="h-2 w-16 bg-red-500/50 rounded"></div>
                <div className="text-xs text-gray-500">vs</div>
                <div className="h-2 w-2 bg-green-500/50 rounded"></div>
                <div className="text-xs text-gray-400 ml-1">Economize até 99% do seu tempo</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
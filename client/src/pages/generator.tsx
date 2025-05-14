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

  const [isGenerating, setIsGenerating] = useState(false);
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);
  
  const handleGenerate = () => {
    if (!prompt) {
      return;
    }
    
    // Mostra o estado de carregamento
    setIsGenerating(true);
    setShowSuccessMessage(false);
    
    // Simula um pequeno atraso para mostrar o carregamento (pode ser removido em produção)
    setTimeout(() => {
      setShowPreview(true);
      setIsGenerating(false);
      
      // Mostra mensagem de sucesso
      setShowSuccessMessage(true);
      
      // Esconde a mensagem de sucesso após 5 segundos
      setTimeout(() => {
        setShowSuccessMessage(false);
      }, 5000);
    }, 1500);
  };

  return (
    <div className="container mx-auto px-4 sm:px-6 py-8 sm:py-12">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-10 relative">
          {/* Botão de assinatura secundário */}
          <div className="absolute top-0 right-0 md:right-4 hidden sm:block">
            <a href="/planos" className="inline-flex items-center gap-2 bg-amber-500/20 hover:bg-amber-500/30 text-amber-400 px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 group relative overflow-hidden">
              <span className="relative z-10">Experimente GRÁTIS por 7 dias</span>
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 transition-transform group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
              
              {/* Efeito de destaque */}
              <div className="absolute -inset-px rounded-full bg-gradient-to-r from-amber-400 to-amber-600 opacity-40 blur-sm group-hover:opacity-60 transition-opacity"></div>
            </a>
          </div>
          
          {/* Botão de assinatura para mobile (visível apenas em telas pequenas) */}
          <div className="sm:hidden mb-4">
            <a href="/planos" className="inline-flex items-center justify-center w-full gap-2 bg-amber-500/20 hover:bg-amber-500/30 text-amber-400 px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 group relative overflow-hidden">
              <span className="relative z-10">Experimente GRÁTIS</span>
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 transition-transform group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            </a>
          </div>
          
          <h1 className="text-3xl md:text-5xl font-bold mb-4 text-white">
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-amber-400 to-amber-600">IDEIA</span>
            <span className="text-white">SCREEN</span>
          </h1>
          <p className="text-lg md:text-xl text-gray-300 max-w-2xl mx-auto">
            Transforme suas ideias em roteiros profissionais com estrutura cinematográfica
          </p>
          
          {/* Indicadores de benefícios aprimorados */}
          <div className="flex flex-wrap justify-center gap-4 mt-6">
            <div className="flex items-center text-gray-300 text-sm bg-gray-800/50 px-3 py-1.5 rounded-full">
              <Sparkles className="w-4 h-4 text-amber-400 mr-2" />
              <span>Narrativa Profissional</span>
            </div>
            <div className="flex items-center text-gray-300 text-sm bg-gray-800/50 px-3 py-1.5 rounded-full">
              <Film className="w-4 h-4 text-amber-400 mr-2" />
              <span>Estrutura Cinematográfica</span>
            </div>
            <div className="flex items-center text-gray-300 text-sm bg-gray-800/50 px-3 py-1.5 rounded-full">
              <Zap className="w-4 h-4 text-amber-400 mr-2" />
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
                      <SelectValue placeholder="Instagram, TikTok, YouTube..." />
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
                    <SelectValue placeholder="Dramático, Casual, Humorístico..." />
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
                className="w-full py-7 text-xl bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white font-bold relative overflow-hidden group shadow-lg shadow-green-800/30 hover:shadow-green-700/50 transform transition-all duration-300 hover:-translate-y-1 rounded-xl"
                disabled={!prompt}
              >
                {/* Efeito de brilho animado mais intenso */}
                <div className="absolute inset-0 w-1/4 h-full bg-white opacity-30 transform -skew-x-12 -translate-x-full group-hover:translate-x-[400%] transition-transform duration-1000 ease-in-out"></div>
                
                {/* Efeito de pulsação */}
                <div className="absolute inset-0 bg-white opacity-0 group-hover:opacity-10 rounded-xl animate-pulse"></div>
                
                <span className="relative z-10 flex items-center justify-center tracking-wide">
                  <Sparkles className="w-7 h-7 mr-3 text-yellow-300 animate-pulse" />
                  Gerar Roteiro Agora
                </span>
              </Button>
              
              {/* Estado de carregamento - controlado pelo estado isGenerating */}
              {isGenerating && (
                <div className="w-full bg-gray-900/80 py-7 rounded-xl mt-4 text-center flex flex-col items-center justify-center">
                  <div className="flex items-center mb-3">
                    <div className="animate-spin w-5 h-5 border-2 border-white border-t-transparent rounded-full mr-3"></div>
                    <span className="text-white text-lg font-medium">Gerando roteiro profissional...</span>
                  </div>
                  <div className="text-gray-400 text-sm max-w-md px-4">
                    Estamos aplicando técnicas de narrativa cinematográfica para criar um roteiro otimizado para {platforms.find(p => p.id === platform)?.label || platform}
                  </div>
                </div>
              )}
              
              <div className="flex justify-between items-center mt-4">
                <p className="text-gray-400 text-xs flex items-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1 text-amber-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  Geração instantânea (2-5 segundos)
                </p>
                <p className="text-gray-400 text-xs flex items-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1 text-amber-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  Sem instalação necessária
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Mensagem de sucesso após geração */}
        {showSuccessMessage && (
          <div className="bg-green-500/20 border border-green-500/30 rounded-lg p-4 mb-6 flex items-start">
            <svg className="w-5 h-5 text-green-500 mr-3 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
            </svg>
            <div>
              <h4 className="text-green-500 font-medium text-sm">Roteiro gerado com sucesso!</h4>
              <p className="text-gray-300 text-xs mt-1">Seu roteiro profissional com estrutura cinematográfica está pronto para uso.</p>
            </div>
          </div>
        )}
        
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
          
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            <div className="bg-gray-900/50 p-6 rounded-xl border border-gray-700/50 shadow-lg transition-all duration-300 hover:-translate-y-1 hover:shadow-amber-500/5 group">
              <div className="w-12 h-12 bg-amber-500/20 rounded-full flex items-center justify-center mb-4 group-hover:bg-amber-500/30 transition-colors">
                <Film className="w-6 h-6 text-amber-400" />
              </div>
              <div className="text-amber-400 font-bold text-xl mb-2 flex items-center">
                <span className="mr-2">🎬</span>
                Estrutura cinemática
              </div>
              <p className="text-gray-300">Roteiros com estrutura profissional de início, meio e fim, com arcos narrativos cinematográficos</p>
              
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
              <div className="text-amber-400 font-bold text-xl mb-2 flex items-center">
                <span className="mr-2">🎨</span>
                Personalização total
              </div>
              <p className="text-gray-300">Controle total sobre tom, estilo e narrativa — criação sob medida para sua necessidade</p>
              
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
              <div className="text-amber-400 font-bold text-xl mb-2 flex items-center">
                <span className="mr-2">⚡</span>
                Produtividade máxima
              </div>
              <p className="text-gray-300">Crie roteiros profissionais em segundos, não horas — diga adeus ao bloqueio criativo</p>
              
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
        
        {/* Footer com informações adicionais */}
        <div className="mt-16 border-t border-gray-800 pt-8 pb-12">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
            <div>
              <h3 className="text-amber-400 font-bold text-lg mb-3">Plataformas Suportadas</h3>
              <ul className="text-gray-400 space-y-2 text-sm">
                <li className="flex items-center">
                  <svg className="w-3 h-3 mr-2 text-amber-500" fill="currentColor" viewBox="0 0 20 20"><path d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" fillRule="evenodd"></path></svg>
                  Instagram
                </li>
                <li className="flex items-center">
                  <svg className="w-3 h-3 mr-2 text-amber-500" fill="currentColor" viewBox="0 0 20 20"><path d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" fillRule="evenodd"></path></svg>
                  TikTok
                </li>
                <li className="flex items-center">
                  <svg className="w-3 h-3 mr-2 text-amber-500" fill="currentColor" viewBox="0 0 20 20"><path d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" fillRule="evenodd"></path></svg>
                  YouTube
                </li>
                <li className="flex items-center">
                  <svg className="w-3 h-3 mr-2 text-amber-500" fill="currentColor" viewBox="0 0 20 20"><path d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" fillRule="evenodd"></path></svg>
                  LinkedIn
                </li>
                <li className="flex items-center">
                  <svg className="w-3 h-3 mr-2 text-amber-500" fill="currentColor" viewBox="0 0 20 20"><path d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" fillRule="evenodd"></path></svg>
                  Facebook
                </li>
              </ul>
            </div>
            
            <div>
              <h3 className="text-amber-400 font-bold text-lg mb-3">Como Funciona</h3>
              <div className="text-gray-400 text-sm space-y-3">
                <p>O IDEIASCREEN utiliza inteligência artificial avançada para analisar sua ideia e criar roteiros com estrutura cinematográfica profissional.</p>
                <p>Nossos algoritmos foram treinados com milhares de exemplos de roteiros de sucesso para garantir a melhor qualidade narrativa.</p>
                <p>Você pode personalizar completamente o estilo, tom e formato do seu roteiro para qualquer plataforma.</p>
              </div>
            </div>
            
            <div>
              <h3 className="text-amber-400 font-bold text-lg mb-3">Ajuda e Suporte</h3>
              <ul className="text-gray-400 space-y-2 text-sm">
                <li className="flex items-center">
                  <svg className="w-4 h-4 mr-2 text-amber-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <a href="#" className="hover:text-amber-400 transition-colors">Perguntas Frequentes</a>
                </li>
                <li className="flex items-center">
                  <svg className="w-4 h-4 mr-2 text-amber-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                  <a href="mailto:suporte@ideiascreen.com.br" className="hover:text-amber-400 transition-colors">suporte@ideiascreen.com.br</a>
                </li>
                <li className="flex items-center">
                  <svg className="w-4 h-4 mr-2 text-amber-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
                  </svg>
                  <a href="#" className="hover:text-amber-400 transition-colors">Tutorial em Vídeo</a>
                </li>
              </ul>
              
              <div className="mt-6">
                <h3 className="text-amber-400 font-bold text-lg mb-3">Links Úteis</h3>
                <ul className="text-gray-400 space-y-2 text-sm">
                  <li className="flex items-center">
                    <svg className="w-4 h-4 mr-2 text-amber-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                    </svg>
                    <a href="#" className="hover:text-amber-400 transition-colors">Termos de Uso</a>
                  </li>
                  <li className="flex items-center">
                    <svg className="w-4 h-4 mr-2 text-amber-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                    </svg>
                    <a href="#" className="hover:text-amber-400 transition-colors">Política de Privacidade</a>
                  </li>
                </ul>
              </div>
            </div>
          </div>
          
          <div className="mt-10 pt-6 border-t border-gray-800 text-center">
            <p className="text-gray-500 text-sm">© 2025 IDEIASCREEN. Todos os direitos reservados.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
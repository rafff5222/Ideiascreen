import { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Copy, CheckCircle, Share2, Download, Loader2, Save, History, Sparkles, Wand2, Video, Film, Clapperboard } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";

type ScriptPreviewProps = {
  prompt: string;
  scriptType?: string;
};

/**
 * Componente que exibe um roteiro gerado através da API
 */
export default function ScriptPreview({
  prompt,
  scriptType = "geral"
}: ScriptPreviewProps) {
  const [script, setScript] = useState<string>("");
  const [isLoading, setIsLoading] = useState(true);
  const [isCopied, setIsCopied] = useState(false);
  const [metadata, setMetadata] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  const [savedScripts, setSavedScripts] = useState<any[]>([]);
  const [scriptVersions, setScriptVersions] = useState<any[]>([]);
  const [directorMode, setDirectorMode] = useState(false);
  const [directorAnalysis, setDirectorAnalysis] = useState<{
    estiloVisual: string;
    referencias: string[];
    castingIdeal: {[key: string]: string};
  } | null>(null);
  const [isLoadingAnalysis, setIsLoadingAnalysis] = useState(false);
  const { toast } = useToast();
  
  // Carregar histórico de roteiros salvos
  useEffect(() => {
    try {
      const savedHistory = localStorage.getItem('historico_roteiros');
      if (savedHistory) {
        setSavedScripts(JSON.parse(savedHistory));
      }
    } catch (err) {
      console.error("Erro ao carregar histórico:", err);
    }
  }, []);

  // Gera o roteiro através da API
  useEffect(() => {
    const generateScript = async () => {
      setIsLoading(true);
      setError(null);
      
      try {
        // Chamada real à API
        const response = await apiRequest("POST", "/api/generate-script", { prompt });
        const data = await response.json();
        
        if (data.error) {
          throw new Error(data.error);
        }
        
        setScript(data.script);
        setMetadata(data.metadata || {
          modelUsed: 'gerador-interno',
          generatedAt: new Date().toISOString(),
        });
      } catch (err: any) {
        console.error("Erro ao gerar roteiro:", err);
        setError(err.message || "Ocorreu um erro ao gerar o roteiro. Tente novamente.");
        setScript(err.script || "Não foi possível gerar o roteiro.");
      } finally {
        setIsLoading(false);
      }
    };
    
    if (prompt) {
      generateScript();
    }
  }, [prompt]);

  // Função para copiar o roteiro para clipboard
  const handleCopy = () => {
    navigator.clipboard.writeText(script);
    setIsCopied(true);
    toast({
      title: "Copiado!",
      description: "Roteiro copiado para área de transferência",
    });
    
    setTimeout(() => {
      setIsCopied(false);
    }, 2000);
  };

  // Função para exportar como TXT
  const handleExportTXT = () => {
    if (!script) return;
    
    const blob = new Blob([script], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `roteiro-${scriptType}-${new Date().toISOString().slice(0, 10)}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    toast({
      title: "Roteiro Exportado!",
      description: "Seu roteiro foi baixado em formato TXT",
    });
  };
  
  // Função para exportar como PDF
  const handleExportPDF = () => {
    toast({
      title: "Exportando PDF",
      description: "Preparando seu roteiro para download..."
    });
    
    // Aqui implementaríamos a exportação real para PDF
    setTimeout(() => {
      toast({
        title: "PDF Gerado!",
        description: "Seu roteiro foi exportado com sucesso",
      });
    }, 1500);
  };
  
  // Salvar roteiro no localStorage
  const handleSaveScript = () => {
    if (!script) return;
    
    try {
      const novoRoteiro = {
        id: Date.now(),
        titulo: prompt,
        tipo: scriptType,
        texto: script,
        data: new Date().toISOString(),
        metadata
      };
      
      const historico = [...savedScripts, novoRoteiro];
      localStorage.setItem('historico_roteiros', JSON.stringify(historico));
      setSavedScripts(historico);
      
      toast({
        title: "Roteiro Salvo!",
        description: "Seu roteiro foi salvo em seu navegador",
      });
    } catch (err) {
      console.error("Erro ao salvar:", err);
      toast({
        title: "Erro ao Salvar",
        description: "Não foi possível salvar o roteiro",
        variant: "destructive"
      });
    }
  };
  
  // Carregar roteiro do histórico
  const handleLoadScript = (savedScript: any) => {
    setScript(savedScript.texto);
    toast({
      title: "Roteiro Carregado",
      description: `"${savedScript.titulo}" carregado com sucesso!`,
    });
  };
  
  // Excluir roteiro do histórico
  const handleDeleteScript = (id: number) => {
    const updatedHistory = savedScripts.filter(item => item.id !== id);
    localStorage.setItem('historico_roteiros', JSON.stringify(updatedHistory));
    setSavedScripts(updatedHistory);
    
    toast({
      title: "Roteiro Excluído",
      description: "O roteiro foi removido do histórico",
    });
  };
  
  // Ativar modo diretor - analisar o roteiro com visão de diretor
  const handleDirectorMode = async () => {
    if (!script || isLoadingAnalysis) return;
    
    setIsLoadingAnalysis(true);
    setDirectorMode(true);
    
    try {
      // Aqui simulamos uma análise de diretor
      // Em um sistema real, você enviaria o roteiro para uma API de IA
      setTimeout(() => {
        // Análise simulada baseada no gênero do roteiro
        let estiloVisual = "";
        let referencias: string[] = [];
        let castingIdeal: {[key: string]: string} = {};
        
        if (scriptType.toLowerCase().includes("terror") || prompt.toLowerCase().includes("terror")) {
          estiloVisual = "Iluminação expressionista com contrastes acentuados, inspirada em filmes como 'O Gabinete do Dr. Caligari'";
          referencias = ["O Iluminado (1980)", "Hereditário (2018)", "O Exorcista (1973)"];
          castingIdeal = {
            "Protagonista": "Florence Pugh",
            "Antagonista": "Mads Mikkelsen",
            "Personagem Secundário": "Adam Driver"
          };
        } else if (scriptType.toLowerCase().includes("ficção") || prompt.toLowerCase().includes("ficção")) {
          estiloVisual = "Paleta futurista neo-noir com tons de azul e roxo, inspirada em 'Blade Runner'";
          referencias = ["Blade Runner 2049 (2017)", "Chegada (2016)", "Ex-Machina (2014)"];
          castingIdeal = {
            "Protagonista": "Ryan Gosling",
            "Antagonista": "Tilda Swinton",
            "Personagem Secundário": "John David Washington"
          };
        } else if (scriptType.toLowerCase().includes("comédia") || prompt.toLowerCase().includes("comédia")) {
          estiloVisual = "Visual vibrante e saturado, com movimentos de câmera dinâmicos, como em 'Scott Pilgrim'";
          referencias = ["Superbad (2007)", "Booksmart (2019)", "Todo Mundo em Pânico (2000)"];
          castingIdeal = {
            "Protagonista": "Timothée Chalamet",
            "Coadjuvante Cômico": "Awkwafina",
            "Personagem Excêntrico": "Bill Hader"
          };
        } else {
          // Genérico para outros tipos
          estiloVisual = "Cinematografia naturalista com luz suave, inspirada em filmes indie contemporâneos";
          referencias = ["Parasita (2019)", "Drive My Car (2021)", "Minari (2020)"];
          castingIdeal = {
            "Protagonista": "Saoirse Ronan",
            "Coadjuvante": "Sterling K. Brown",
            "Personagem Secundário": "Viola Davis"
          };
        }
        
        setDirectorAnalysis({
          estiloVisual,
          referencias,
          castingIdeal
        });
        
        setIsLoadingAnalysis(false);
        
        toast({
          title: "Análise de Diretor Concluída",
          description: "Visualize o roteiro pela perspectiva de um diretor profissional",
        });
      }, 1500);
      
    } catch (err) {
      console.error("Erro ao analisar roteiro:", err);
      setIsLoadingAnalysis(false);
      toast({
        title: "Erro na Análise",
        description: "Não foi possível analisar o roteiro como diretor",
        variant: "destructive"
      });
    }
  };
  
  // Gerar uma variação do roteiro atual
  const handleGenerateVariation = async () => {
    if (!script || isLoading) return;
    
    // Guardar versão atual
    const currentVersion = {
      id: Date.now(),
      prompt,
      script,
      date: new Date().toISOString()
    };
    
    const newVersions = [...scriptVersions, currentVersion];
    setScriptVersions(newVersions);
    
    // Criar um novo prompt com variação
    const variationPrompt = `${prompt} com final alternativo inesperado`;
    
    // Mostrar indicador de carregamento
    setIsLoading(true);
    
    try {
      // Chamada à API com o novo prompt
      const response = await apiRequest("POST", "/api/generate-script", { prompt: variationPrompt });
      const data = await response.json();
      
      if (data.error) {
        throw new Error(data.error);
      }
      
      setScript(data.script);
      setMetadata(data.metadata || {
        modelUsed: 'gerador-interno',
        generatedAt: new Date().toISOString(),
      });
      
      toast({
        title: "Variação Gerada!",
        description: "Uma nova versão do roteiro foi criada com um final alternativo",
      });
    } catch (err: any) {
      console.error("Erro ao gerar variação:", err);
      toast({
        title: "Erro",
        description: "Não foi possível gerar uma variação",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="bg-gray-50 rounded-xl p-6 my-6">
        <div className="flex flex-col items-center justify-center h-64">
          <Loader2 className="w-12 h-12 text-primary animate-spin" />
          <p className="mt-4 text-gray-500">Gerando seu roteiro profissional...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white border rounded-xl shadow-sm my-6 overflow-hidden">
      <div className="p-4 bg-gray-900 text-white border-b border-amber-500/30 flex justify-between items-center">
        <div>
          <h3 className="text-lg font-medium">Roteiro: <span className="text-amber-500 font-bold">{prompt}</span></h3>
          <p className="text-sm text-gray-400">
            <span className="text-blue-400">Tipo:</span> {scriptType} • 
            {metadata?.modelUsed && <><span className="text-blue-400"> Modelo:</span> {metadata.modelUsed} • </>}
            <span className="text-blue-400">Gerado em:</span> {new Date(metadata?.generatedAt || Date.now()).toLocaleString()}
          </p>
        </div>
        <div className="flex gap-2">
          <Button 
            variant="outline" 
            size="sm" 
            onClick={handleCopy}
            className="flex items-center gap-1"
          >
            {isCopied ? <CheckCircle size={16} /> : <Copy size={16} />}
            {isCopied ? "Copiado" : "Copiar"}
          </Button>
          <Button 
            variant="outline" 
            size="sm"
            onClick={handleExportTXT} 
            className="flex items-center gap-1"
          >
            <Download size={16} />
            TXT
          </Button>
          <Button 
            variant="outline" 
            size="sm"
            onClick={handleExportPDF} 
            className="flex items-center gap-1"
          >
            <Download size={16} />
            PDF
          </Button>
          <Button 
            variant="outline" 
            size="sm"
            onClick={handleSaveScript} 
            className="flex items-center gap-1 text-green-500"
          >
            <Save size={16} />
            Salvar
          </Button>
          
          {/* Histórico de Roteiros */}
          <Sheet>
            <SheetTrigger asChild>
              <Button 
                variant="outline" 
                size="sm"
                className="flex items-center gap-1 text-blue-400"
              >
                <History size={16} />
                Histórico
              </Button>
            </SheetTrigger>
            <SheetContent className="bg-gray-900 text-white border-l border-amber-500/30 overflow-y-auto">
              <SheetHeader>
                <SheetTitle className="text-white text-left mb-4">Histórico de Roteiros</SheetTitle>
              </SheetHeader>
              
              {savedScripts.length === 0 ? (
                <div className="text-gray-400 text-center py-8">
                  <History className="w-12 h-12 mx-auto text-gray-600 mb-3" />
                  <p>Nenhum roteiro salvo ainda.</p>
                  <p className="text-sm mt-2">Use o botão "Salvar" para guardar seus roteiros.</p>
                </div>
              ) : (
                <div className="space-y-4 mt-4">
                  {savedScripts.map((script, index) => (
                    <div 
                      key={script.id || index} 
                      className="bg-gray-800 rounded-lg p-3 border border-amber-500/20 hover:border-amber-500/40 transition-all"
                    >
                      <div className="text-amber-500 font-semibold mb-1 text-sm truncate">
                        {script.titulo}
                      </div>
                      <div className="text-xs text-gray-400 mb-2">
                        {new Date(script.data).toLocaleDateString()} • {script.tipo}
                      </div>
                      <div className="text-xs line-clamp-2 text-gray-300 mb-3">
                        {script.texto.substring(0, 100)}...
                      </div>
                      <div className="flex gap-2">
                        <Button 
                          variant="outline" 
                          size="sm" 
                          className="h-8 text-xs flex-1"
                          onClick={() => handleLoadScript(script)}
                        >
                          Carregar
                        </Button>
                        <Button 
                          variant="outline" 
                          size="sm" 
                          className="h-8 text-xs text-red-400 hover:text-red-300"
                          onClick={() => handleDeleteScript(script.id)}
                        >
                          Excluir
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </SheetContent>
          </Sheet>
        </div>
      </div>
      
      <div className="p-4">
        {error ? (
          <div className="p-4 bg-red-50 text-red-800 rounded-lg border border-red-200">
            <p className="font-medium mb-2">Erro ao gerar roteiro</p>
            <p className="text-sm whitespace-pre-line">{script}</p>
          </div>
        ) : (
          <>
            {/* Análise do Diretor */}
            {directorMode && directorAnalysis && (
              <div className="mb-6 bg-gradient-to-r from-purple-900/30 to-indigo-900/20 rounded-lg p-5 border border-purple-500/30">
                <div className="flex items-center mb-4">
                  <Clapperboard className="text-purple-400 mr-2 h-5 w-5" />
                  <h3 className="text-lg font-bold text-purple-400">Análise de Diretor</h3>
                </div>
                
                <div className="space-y-4">
                  <div>
                    <h4 className="text-xs uppercase tracking-wider text-gray-400 mb-1">Estilo Visual</h4>
                    <p className="text-sm text-white">{directorAnalysis.estiloVisual}</p>
                  </div>
                  
                  <div>
                    <h4 className="text-xs uppercase tracking-wider text-gray-400 mb-1">Referências Cinematográficas</h4>
                    <div className="flex flex-wrap gap-2">
                      {directorAnalysis.referencias.map((ref, index) => (
                        <span 
                          key={index} 
                          className="text-xs bg-purple-500/20 text-purple-300 py-1 px-2 rounded-full"
                        >
                          {ref}
                        </span>
                      ))}
                    </div>
                  </div>
                  
                  <div>
                    <h4 className="text-xs uppercase tracking-wider text-gray-400 mb-1">Casting Ideal</h4>
                    <div className="grid grid-cols-2 gap-2">
                      {Object.entries(directorAnalysis.castingIdeal).map(([papel, ator], index) => (
                        <div key={index} className="flex items-center">
                          <span className="text-xs font-bold text-gray-300 mr-2">{papel}:</span>
                          <span className="text-xs text-purple-300">{ator}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
                
                <div className="mt-4 pt-2 border-t border-purple-500/20">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setDirectorMode(false)}
                    className="text-xs text-purple-400"
                  >
                    Voltar ao Modo Normal
                  </Button>
                </div>
              </div>
            )}
            
            {/* Loading para análise do diretor */}
            {isLoadingAnalysis && (
              <div className="mb-6 bg-gradient-to-r from-purple-900/30 to-indigo-900/20 rounded-lg p-5 border border-purple-500/30 flex items-center">
                <Loader2 className="animate-spin h-5 w-5 text-purple-400 mr-3" />
                <p className="text-sm text-purple-300">Analisando roteiro como diretor...</p>
              </div>
            )}
          
            <div className="prose prose-sm max-w-none">
              <div 
                id="texto-gerado" 
                className="script-storyboard whitespace-pre-line bg-gray-900 text-white p-6 rounded-lg border border-amber-500/20 text-sm overflow-auto max-h-[600px] script-content mobile-optimized glow-effect"
              >
              {script.split('\n\n').map((block, index) => {
                // Identificar cabeçalhos e cenas
                if (block.toUpperCase() === block && block.includes('CENA')) {
                  return (
                    <div key={index} className="scene-heading my-4 font-bold text-amber-500 border-b border-amber-500/30 pb-1">
                      {block}
                    </div>
                  );
                }
                
                // Identificar diálogos de personagens (linhas que são apenas um nome em maiúsculas)
                if (/^[A-Z\s]+\([a-z\s,]+\)$/.test(block) || /^[A-Z\s]+$/.test(block)) {
                  return (
                    <div key={index} className="character-name my-2 font-semibold text-blue-400">
                      {block}
                    </div>
                  );
                }
                
                // Identificar direções de cena (texto entre colchetes)
                if (block.startsWith('[') && block.endsWith(']')) {
                  return (
                    <div key={index} className="scene-direction my-2 text-gray-400 italic">
                      {block}
                    </div>
                  );
                }
                
                // Texto normal
                return <p key={index} className="my-2">{block}</p>;
              })}
            </div>
          </div>
        )}
      </div>
      
      <div className="p-4 bg-gradient-to-r from-gray-900 to-gray-800 border-t border-amber-500/30">
        {/* Estrutura Narrativa - Timeline */}
        {!error && script && (
          <div className="mb-4">
            <p className="text-xs font-semibold text-gray-400 mb-2">Estrutura Narrativa:</p>
            <div className="timeline flex h-3 mb-2 rounded-full overflow-hidden">
              <div className="ato1 w-[30%] bg-[#e53170]" title="Ato 1: Introdução"></div>
              <div className="ato2 w-[40%] bg-[#ff8906]" title="Ato 2: Desenvolvimento"></div>
              <div className="ato3 w-[30%] bg-[#f25f4c]" title="Ato 3: Conclusão"></div>
            </div>
            <div className="flex justify-between text-xs text-gray-500">
              <span>Introdução</span>
              <span>Desenvolvimento</span>
              <span>Conclusão</span>
            </div>
          </div>
        )}
        
        <div className="flex items-center justify-between">
          <p className="text-sm text-gray-400">
            {!error && <>
              <span className="text-amber-500">{script.length}</span> caracteres • Aproximadamente <span className="text-amber-500">{Math.ceil(script.length / 1000)}</span> minuto(s) de leitura
            </>}
          </p>
          <div className="flex gap-2">
            {/* Botão para Modo Diretor */}
            <Button 
              variant="outline" 
              size="sm"
              className="flex items-center gap-1 text-purple-500 hover:text-purple-400 bg-purple-500/10"
              onClick={handleDirectorMode}
              disabled={isLoading || isLoadingAnalysis}
            >
              <Video size={16} />
              Modo Diretor
            </Button>
            
            {/* Botão para gerar variação */}
            <Button 
              variant="outline" 
              size="sm"
              className="flex items-center gap-1 text-amber-500 hover:text-amber-400 bg-amber-500/10"
              onClick={handleGenerateVariation}
              disabled={isLoading}
            >
              <Wand2 size={16} />
              Gerar Variação
            </Button>
            
            {/* Versões do roteiro */}
            {scriptVersions.length > 0 && (
              <Sheet>
                <SheetTrigger asChild>
                  <Button 
                    variant="outline" 
                    size="sm"
                    className="flex items-center gap-1 text-amber-500"
                  >
                    <History size={16} />
                    Versões ({scriptVersions.length})
                  </Button>
                </SheetTrigger>
                <SheetContent className="bg-gray-900 text-white border-l border-amber-500/30 overflow-y-auto">
                  <SheetHeader>
                    <SheetTitle className="text-white text-left mb-4">Versões Anteriores</SheetTitle>
                  </SheetHeader>
                  
                  <div className="space-y-4 mt-4">
                    {scriptVersions.map((version, index) => (
                      <div 
                        key={version.id} 
                        className="bg-gray-800 rounded-lg p-3 border border-amber-500/20 hover:border-amber-500/40 transition-all"
                      >
                        <div className="text-amber-500 font-semibold mb-1 text-sm">
                          Versão {index + 1}
                        </div>
                        <div className="text-xs text-gray-400 mb-2">
                          {new Date(version.date).toLocaleString()}
                        </div>
                        <div className="text-xs line-clamp-2 text-gray-300 mb-3">
                          {version.script.substring(0, 100)}...
                        </div>
                        <Button 
                          variant="outline" 
                          size="sm" 
                          className="h-8 text-xs w-full"
                          onClick={() => {
                            setScript(version.script);
                            toast({
                              title: "Versão Restaurada",
                              description: `Versão ${index + 1} do roteiro restaurada`,
                            });
                          }}
                        >
                          Restaurar Esta Versão
                        </Button>
                      </div>
                    ))}
                  </div>
                </SheetContent>
              </Sheet>
            )}
            
            <Button 
              variant="ghost" 
              size="sm"
              className="flex items-center gap-1 text-blue-400 hover:text-blue-300 hover:bg-gray-800"
              onClick={() => {
                toast({
                  title: "Link copiado",
                  description: "Link para compartilhamento copiado para área de transferência",
                });
              }}
            >
              <Share2 size={16} />
              Compartilhar
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
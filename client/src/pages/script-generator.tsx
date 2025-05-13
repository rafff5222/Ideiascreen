import { useState } from 'react';
import ScriptPreview from '@/components/content-generator/ScriptPreview';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Sparkles, MessageSquare } from "lucide-react";
import { Helmet } from "react-helmet";
import { useSubscription } from "@/contexts/SubscriptionContext";
import { LimitReachedModal } from "@/components/subscription/LimitReachedModal";

// Tipos de roteiros suportados
const scriptTypes = [
  { id: 'youtube', label: 'Vídeo para YouTube' },
  { id: 'podcast', label: 'Episódio de Podcast' },
  { id: 'tutorial', label: 'Tutorial Passo-a-Passo' },
  { id: 'storytelling', label: 'Narrativa/Storytelling' },
  { id: 'apresentacao', label: 'Apresentação Formal' },
  { id: 'entrevista', label: 'Entrevista' },
  { id: 'documentario', label: 'Documentário' },
  { id: 'filme', label: 'Roteiro de Filme' },
  { id: 'peça', label: 'Peça de Teatro' },
  { id: 'stand-up', label: 'Stand-up Comedy' },
  { id: 'geral', label: 'Roteiro Geral' },
];

// Níveis de detalhe
const detailLevels = [
  { id: 'basico', label: 'Esboço Básico', description: 'Roteiro simples e direto' },
  { id: 'padrao', label: 'Padrão', description: 'Nível médio de detalhamento' },
  { id: 'detalhado', label: 'Roteiro Detalhado', description: 'Com atos, cenas e diálogos completos' },
];

// Tons de comunicação
const toneOptions = [
  { id: 'profissional', label: 'Profissional' },
  { id: 'casual', label: 'Casual' },
  { id: 'humoristico', label: 'Humorístico' },
  { id: 'dramatico', label: 'Dramático' },
  { id: 'poetico', label: 'Poético' },
  { id: 'sarcastico', label: 'Sarcástico' },
  { id: 'inspirador', label: 'Inspirador' },
  { id: 'educativo', label: 'Educativo' },
];

// Modos criativos especiais
const creativeModes = [
  { id: 'padrao', label: 'Padrão', description: 'Geração regular de roteiro' },
  { id: 'maluco', label: 'Roteiro Maluco', description: 'Combina gêneros absurdos, como "Faroeste Espacial"' },
  { id: 'curta', label: 'Curta-Metragem', description: 'História com 1 cenário e poucos personagens' },
  { id: 'twist', label: 'Plot Twist', description: 'Inclui uma reviravolta inesperada no roteiro' },
  { id: 'alternativo', label: 'Final Alternativo', description: 'Inclui dois finais possíveis para a história' },
  { id: 'generos', label: 'Multi-Gênero', description: 'Mistura elementos de diferentes gêneros narrativos' },
];

// Arcos narrativos
const narrativeArcs = [
  { id: 'padrao', label: 'Estrutura Padrão' },
  { id: 'jornada-heroi', label: 'Jornada do Herói' },
  { id: 'tres-atos', label: 'Três Atos Clássicos' },
  { id: 'comedia', label: 'Estrutura de Comédia' },
  { id: 'tragedia', label: 'Tragédia Shakespeariana' },
  { id: 'narrativa-paralela', label: 'Narrativas Paralelas' },
];

export default function ScriptGenerator() {
  const [prompt, setPrompt] = useState('');
  const [scriptType, setScriptType] = useState('geral');
  const [detailLevel, setDetailLevel] = useState('padrao');
  const [tone, setTone] = useState('profissional');
  const [narrativeArc, setNarrativeArc] = useState('padrao');
  const [creativeMode, setCreativeMode] = useState('padrao');
  const [characters, setCharacters] = useState('');
  const [setting, setSetting] = useState('');
  const [reference, setReference] = useState('');
  const [surpriseMe, setSurpriseMe] = useState(false);
  const [generateDialogue, setGenerateDialogue] = useState(false);
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  const [examples] = useState([
    "Um roteiro de podcast sobre empreendedorismo digital",
    "Um tutorial passo-a-passo de como preparar lasanha",
    "Um storytelling sobre uma pessoa que descobre um segredo antigo",
    "Um roteiro de filme sobre uma viagem no tempo",
    "Uma peça de teatro sobre conflitos familiares",
  ]);

  // Função para gerar combinações aleatórias para a pílula criativa
  const generateSurpriseElements = () => {
    const randomGenres = [
      'ficção científica', 'comédia romântica', 'terror psicológico', 
      'faroeste futurista', 'fantasia medieval', 'drama histórico',
      'thriller cyberpunk', 'policial noir', 'aventura steampunk',
      'distopia pós-apocalíptica', 'suspense sobrenatural'
    ];
    
    const randomSettings = [
      'em uma estação espacial abandonada', 'em um reino subaquático',
      'em uma cidade flutuante', 'durante o colapso da civilização',
      'em um labirinto infinito', 'em uma dimensão paralela',
      'na Era Vitoriana alternativa', 'em um deserto com criaturas alienígenas',
      'em um castelo mal-assombrado', 'em um teatro mágico'
    ];
    
    const randomTwists = [
      'onde o vilão é na verdade o herói do passado', 
      'onde o tempo flui ao contrário',
      'onde todos compartilham uma consciência coletiva',
      'onde a realidade é uma simulação',
      'onde ninguém pode mentir',
      'onde os objetos ganham vida',
      'onde sonhos afetam a realidade',
      'onde memórias podem ser transferidas entre pessoas'
    ];
    
    return {
      genre: randomGenres[Math.floor(Math.random() * randomGenres.length)],
      setting: randomSettings[Math.floor(Math.random() * randomSettings.length)],
      twist: randomTwists[Math.floor(Math.random() * randomTwists.length)]
    };
  };

  const handleGenerate = () => {
    if (!prompt) {
      return;
    }
    
    let finalPrompt = prompt;
    let selectedCharacters = characters;
    let selectedSetting = setting;
    let selectedReference = reference;
    let selectedTone = tone;
    let selectedCreativeMode = creativeMode;
    
    // Aplicar pílula criativa se ativada
    if (surpriseMe) {
      const surpriseElements = generateSurpriseElements();
      
      finalPrompt = `${prompt} (ELEMENTOS SURPRESA: Misture elementos de ${surpriseElements.genre} ${surpriseElements.setting}, e inclua uma reviravolta onde ${surpriseElements.twist})`;
      
      // Alterar também modo criativo
      selectedCreativeMode = 'maluco';
    }
    
    // Adicionar diálogos extras se solicitado
    const dialogueInstruction = generateDialogue 
      ? "IMPORTANTE: Após o roteiro principal, adicione uma seção de DIÁLOGOS EXTRAS com pelo menos 3 conversas cativantes entre os personagens principais, mostrando suas personalidades distintas."
      : "";
    
    // Construir um prompt enriquecido com todos os parâmetros
    const enrichedPrompt = {
      prompt: finalPrompt + (dialogueInstruction ? " " + dialogueInstruction : ""),
      scriptType,
      detailLevel,
      tone: selectedTone,
      narrativeArc,
      creativeMode: selectedCreativeMode,
      characters: selectedCharacters.trim() ? selectedCharacters : undefined,
      setting: selectedSetting.trim() ? selectedSetting : undefined,
      reference: selectedReference.trim() ? selectedReference : undefined,
      surpriseMe,
      generateDialogue
    };
    
    console.log('Gerando roteiro com configurações:', enrichedPrompt);
    setShowPreview(true);
  };

  // Seleciona um exemplo e preenche o campo de prompt
  const handleSelectExample = (example: string) => {
    setPrompt(example);
  };

  return (
    <>
      <Helmet>
        <title>PLOTMACHINE | Gerador de Roteiros Profissionais com IA</title>
        <meta name="description" content="Gerador de roteiros com IA: crie histórias para filmes, séries e games em segundos. 37 gêneros, análise narrativa e exportação profissional." />
        <meta name="keywords" content="gerador de roteiros, roteiros para filmes, roteiro de série, script generator, ai script writing, roteiro com inteligência artificial" />
        <meta property="og:title" content="PLOTMACHINE - Gerador de Roteiros Profissionais" />
        <meta property="og:description" content="Crie roteiros profissionais em segundos com IA avançada. Ideal para videomakers, podcasters e criadores de conteúdo." />
        <meta property="og:type" content="website" />
        <meta property="og:url" content={window.location.href} />
        <meta property="og:image" content="/plot-machine-preview.jpg" />
        
        {/* Schema.org Markup for Rich Results */}
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "WebApplication",
            "name": "PLOTMACHINE",
            "applicationCategory": "CreativeApplication",
            "offers": {
              "@type": "Offer",
              "price": "0",
              "priceCurrency": "USD"
            },
            "operatingSystem": "All",
            "description": "Gerador de roteiros profissionais usando inteligência artificial. Crie conteúdo para filmes, séries, podcasts e muito mais."
          })}
        </script>
      </Helmet>
    
      <div className="container mx-auto px-4 py-12 bg-gray-900 min-h-screen">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <div className="flex items-center justify-center mb-2">
              <div className="text-4xl md:text-5xl font-black mr-2">🎬</div>
              <h1 className="text-3xl md:text-4xl font-black bg-gradient-to-r from-amber-500 to-amber-600 bg-clip-text text-transparent tracking-tight">
                PLOTMACHINE
              </h1>
            </div>
            <div className="bg-gray-800 text-white text-xs uppercase tracking-widest py-1 px-3 rounded-full inline-block mb-4 font-medium">
              Gerador de Roteiros Profissionais
            </div>
            <p className="text-lg text-gray-400 max-w-xl mx-auto">
              Transforme suas ideias em roteiros cinematográficos, podcasts, tutoriais e histórias cativantes em segundos
            </p>
          </div>

          <Card className="mb-8">
            <CardContent className="pt-6">
              <h2 className="text-xl font-bold mb-6">Qual roteiro você deseja criar?</h2>
              
              <div className="space-y-6">
                <div>
                  <Label htmlFor="scriptType">Tipo de Roteiro</Label>
                  <Select
                    value={scriptType}
                    onValueChange={setScriptType}
                  >
                    <SelectTrigger id="scriptType" className="mt-1">
                      <SelectValue placeholder="Selecione o tipo de roteiro" />
                    </SelectTrigger>
                    <SelectContent>
                      {scriptTypes.map((item) => (
                        <SelectItem key={item.id} value={item.id}>
                          {item.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                <div>
                  <Label htmlFor="prompt">Descreva seu roteiro</Label>
                  <Textarea
                    id="prompt"
                    placeholder="Ex: Um roteiro para vídeo do YouTube sobre inteligência artificial e seus impactos na sociedade"
                    value={prompt}
                    onChange={(e) => setPrompt(e.target.value)}
                    className="mt-1 h-32"
                  />
                </div>
                
                {/* Features Especiais "Matadoras" */}
                <div className="mt-6 space-y-4">
                  <h3 className="text-base font-semibold">Features Criativas</h3>
                  
                  <div className="flex items-center justify-between bg-gradient-to-r from-yellow-500/10 to-amber-500/5 p-3 rounded-lg border border-amber-500/20">
                    <div className="flex items-center space-x-3">
                      <Sparkles className="w-5 h-5 text-amber-500" />
                      <div>
                        <Label htmlFor="surpriseMe" className="font-medium text-amber-500">Pílula Criativa</Label>
                        <p className="text-xs text-muted-foreground">Mistura gêneros aleatórios e adiciona reviravoltas surpreendentes!</p>
                      </div>
                    </div>
                    <Switch
                      id="surpriseMe"
                      checked={surpriseMe}
                      onCheckedChange={setSurpriseMe}
                      className="data-[state=checked]:bg-amber-500"
                    />
                  </div>
                  
                  <div className="flex items-center justify-between bg-gradient-to-r from-blue-500/10 to-indigo-500/5 p-3 rounded-lg border border-blue-500/20">
                    <div className="flex items-center space-x-3">
                      <MessageSquare className="w-5 h-5 text-blue-400" />
                      <div>
                        <Label htmlFor="generateDialogue" className="font-medium text-blue-400">Gerador de Diálogos</Label>
                        <p className="text-xs text-muted-foreground">Adiciona conversas cativantes entre os personagens!</p>
                      </div>
                    </div>
                    <Switch
                      id="generateDialogue"
                      checked={generateDialogue}
                      onCheckedChange={setGenerateDialogue}
                      className="data-[state=checked]:bg-blue-500"
                    />
                  </div>
                </div>
                
                <div>
                  <Label htmlFor="detailLevel">Nível de Detalhe</Label>
                  <Select
                    value={detailLevel}
                    onValueChange={setDetailLevel}
                  >
                    <SelectTrigger id="detailLevel" className="mt-1">
                      <SelectValue placeholder="Selecione o nível de detalhe" />
                    </SelectTrigger>
                    <SelectContent>
                      {detailLevels.map((item) => (
                        <SelectItem key={item.id} value={item.id}>
                          {item.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <p className="text-xs text-muted-foreground mt-1">
                    {detailLevels.find(level => level.id === detailLevel)?.description}
                  </p>
                </div>
                
                <div>
                  <Button 
                    type="button" 
                    variant="outline" 
                    onClick={() => setShowAdvanced(!showAdvanced)}
                    className="w-full"
                  >
                    {showAdvanced ? "Ocultar Opções Avançadas" : "Mostrar Opções Avançadas"}
                  </Button>
                </div>
                
                {showAdvanced && (
                  <div className="space-y-4 border border-gray-200 rounded-lg p-4 bg-gray-50">
                    <h3 className="font-semibold text-lg">Opções Avançadas</h3>
                    
                    <div>
                      <Label htmlFor="tone">Tom de Comunicação</Label>
                      <Select
                        value={tone}
                        onValueChange={setTone}
                      >
                        <SelectTrigger id="tone" className="mt-1">
                          <SelectValue placeholder="Selecione o tom" />
                        </SelectTrigger>
                        <SelectContent>
                          {toneOptions.map((item) => (
                            <SelectItem key={item.id} value={item.id}>
                              {item.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div>
                      <Label htmlFor="creativeMode">Modo Criativo</Label>
                      <Select
                        value={creativeMode}
                        onValueChange={setCreativeMode}
                      >
                        <SelectTrigger id="creativeMode" className="mt-1">
                          <SelectValue placeholder="Selecione o modo criativo" />
                        </SelectTrigger>
                        <SelectContent>
                          {creativeModes.map((item) => (
                            <SelectItem key={item.id} value={item.id}>
                              {item.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <p className="text-xs text-muted-foreground mt-1">
                        {creativeModes.find(mode => mode.id === creativeMode)?.description}
                      </p>
                    </div>
                    
                    <div>
                      <Label htmlFor="narrativeArc">Estrutura Narrativa</Label>
                      <Select
                        value={narrativeArc}
                        onValueChange={setNarrativeArc}
                      >
                        <SelectTrigger id="narrativeArc" className="mt-1">
                          <SelectValue placeholder="Selecione a estrutura" />
                        </SelectTrigger>
                        <SelectContent>
                          {narrativeArcs.map((item) => (
                            <SelectItem key={item.id} value={item.id}>
                              {item.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div>
                      <Label htmlFor="characters">Personagens (opcional)</Label>
                      <Input
                        id="characters"
                        placeholder="Ex: João, Maria, Dr. Silva (protagonista)"
                        value={characters}
                        onChange={(e) => setCharacters(e.target.value)}
                        className="mt-1"
                      />
                    </div>
                    
                    <div>
                      <Label htmlFor="setting">Cenário/Ambiente (opcional)</Label>
                      <Input
                        id="setting"
                        placeholder="Ex: Paris em 2050, Uma mansão abandonada"
                        value={setting}
                        onChange={(e) => setSetting(e.target.value)}
                        className="mt-1"
                      />
                    </div>
                    
                    <div>
                      <Label htmlFor="reference">Referência/Inspiração (opcional)</Label>
                      <Input
                        id="reference"
                        placeholder="Ex: No estilo de Black Mirror, Inspirado em Ted Lasso"
                        value={reference}
                        onChange={(e) => setReference(e.target.value)}
                        className="mt-1"
                      />
                    </div>
                  </div>
                )}
                
                <div>
                  <Label className="block mb-2">Ideias de roteiros</Label>
                  <div className="flex flex-wrap gap-2">
                    {examples.map((example, index) => (
                      <Button 
                        key={index} 
                        variant="outline" 
                        size="sm"
                        onClick={() => handleSelectExample(example)}
                        className="text-xs"
                      >
                        {example.length > 40 ? example.substring(0, 40) + '...' : example}
                      </Button>
                    ))}
                  </div>
                </div>
                
                <div className="pt-4">
                  <Button 
                    onClick={handleGenerate}
                    className="w-full py-6 text-lg bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700 btn-pulsante pulse shadow-lg"
                    disabled={!prompt}
                  >
                    <span className="mr-2">✨</span> Criar Minha Obra-Prima
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {showPreview && (
            <ScriptPreview 
              prompt={`${prompt}${
                showAdvanced ? `
                Tipo: ${scriptTypes.find(type => type.id === scriptType)?.label}
                Nível de Detalhe: ${detailLevels.find(level => level.id === detailLevel)?.label}
                Tom: ${toneOptions.find(t => t.id === tone)?.label}
                Modo Criativo: ${creativeModes.find(mode => mode.id === creativeMode)?.label}
                Estrutura Narrativa: ${narrativeArcs.find(arc => arc.id === narrativeArc)?.label}
                ${characters ? `Personagens: ${characters}` : ''}
                ${setting ? `Cenário/Ambiente: ${setting}` : ''}
                ${reference ? `Referência/Inspiração: ${reference}` : ''}` 
                : ''
              }`} 
              scriptType={scriptType}
            />
          )}
          
          <Card className="mt-12">
            <CardContent className="pt-6">
              <h2 className="text-xl font-bold mb-4">Por que usar nosso gerador de roteiros?</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-gray-50 p-4 rounded-lg shadow-sm hover:shadow-md transition-shadow">
                  <div className="text-primary font-bold text-lg mb-2">Personalização Avançada</div>
                  <p className="text-gray-600">Controle o nível de detalhe, tom, estrutura narrativa e outros elementos do seu roteiro</p>
                </div>
                
                <div className="bg-gray-50 p-4 rounded-lg shadow-sm hover:shadow-md transition-shadow">
                  <div className="text-primary font-bold text-lg mb-2">Estrutura Profissional</div>
                  <p className="text-gray-600">Roteiros formatados de acordo com padrões profissionais para diversos formatos de mídia</p>
                </div>
                
                <div className="bg-gray-50 p-4 rounded-lg shadow-sm hover:shadow-md transition-shadow">
                  <div className="text-primary font-bold text-lg mb-2">Múltiplos Formatos</div>
                  <p className="text-gray-600">Suporte para vídeos, podcasts, narrativas, documentários, filmes e muito mais</p>
                </div>
                
                <div className="bg-gray-50 p-4 rounded-lg shadow-sm hover:shadow-md transition-shadow">
                  <div className="text-primary font-bold text-lg mb-2">Exportação Facilitada</div>
                  <p className="text-gray-600">Exporte seus roteiros em PDF ou copie diretamente para seus documentos</p>
                </div>
                
                <div className="bg-gray-50 p-4 rounded-lg shadow-sm hover:shadow-md transition-shadow">
                  <div className="text-primary font-bold text-lg mb-2">Arcos Narrativos</div>
                  <p className="text-gray-600">Escolha entre diferentes estruturas como Jornada do Herói ou Três Atos Clássicos</p>
                </div>
                
                <div className="bg-gray-50 p-4 rounded-lg shadow-sm hover:shadow-md transition-shadow">
                  <div className="text-primary font-bold text-lg mb-2">Inspiração Contextual</div>
                  <p className="text-gray-600">Encontre inspiração com exemplos pré-definidos e referências personalizáveis</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <div className="mt-12 mb-16">
            <h2 className="text-2xl font-bold mb-6 text-center">
              <span className="bg-gradient-to-r from-amber-500 to-amber-600 bg-clip-text text-transparent">
                Roteiros Incríveis Gerados por Usuários
              </span>
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-gray-900 border border-amber-500/20 rounded-lg p-4 hover:shadow-lg transition-shadow">
                <div className="text-amber-500 font-semibold mb-2">"O Mistério da Caverna Esquecida"</div>
                <p className="text-gray-400 text-sm mb-3">Roteiro de curta-metragem sobre exploradores que encontram uma porta para outra dimensão.</p>
                <div className="flex justify-between text-xs text-gray-500">
                  <span>Por: Marcela F.</span>
                  <span>Estilo: Ficção Científica</span>
                </div>
              </div>
              
              <div className="bg-gray-900 border border-amber-500/20 rounded-lg p-4 hover:shadow-lg transition-shadow">
                <div className="text-amber-500 font-semibold mb-2">"Café da Manhã com Aliens"</div>
                <p className="text-gray-400 text-sm mb-3">Roteiro de comédia onde uma família suburbana descobre que seus novos vizinhos são extraterrestres disfarçados.</p>
                <div className="flex justify-between text-xs text-gray-500">
                  <span>Por: Ricardo T.</span>
                  <span>Estilo: Comédia/Sci-Fi</span>
                </div>
              </div>
              
              <div className="bg-gray-900 border border-amber-500/20 rounded-lg p-4 hover:shadow-lg transition-shadow">
                <div className="text-amber-500 font-semibold mb-2">"Vidas em Código"</div>
                <p className="text-gray-400 text-sm mb-3">Roteiro para podcast sobre como a programação transforma vidas em comunidades carentes.</p>
                <div className="flex justify-between text-xs text-gray-500">
                  <span>Por: Amanda L.</span>
                  <span>Estilo: Documentário</span>
                </div>
              </div>
            </div>
          </div>
          
          <div className="mt-8 text-center text-sm text-gray-400 border-t border-gray-800 pt-6">
            <p>O PLOTMACHINE utiliza inteligência artificial para criar conteúdo original. Revise sempre o conteúdo gerado antes de publicação.</p>
          </div>
        </div>
      </div>
    </>
  );
}
import { useState } from 'react';
import ScriptPreview from '@/components/content-generator/ScriptPreview';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";
import { Helmet } from "react-helmet";

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
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  const [examples] = useState([
    "Um roteiro de podcast sobre empreendedorismo digital",
    "Um tutorial passo-a-passo de como preparar lasanha",
    "Um storytelling sobre uma pessoa que descobre um segredo antigo",
    "Um roteiro de filme sobre uma viagem no tempo",
    "Uma peça de teatro sobre conflitos familiares",
  ]);

  const handleGenerate = () => {
    if (!prompt) {
      return;
    }
    
    // Construir um prompt enriquecido com todos os parâmetros
    const enrichedPrompt = {
      prompt,
      scriptType,
      detailLevel,
      tone,
      narrativeArc,
      creativeMode,
      characters: characters.trim() ? characters : undefined,
      setting: setting.trim() ? setting : undefined,
      reference: reference.trim() ? reference : undefined
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
        <title>Gerador de Roteiros Profissionais | Roteiros para diversos formatos</title>
        <meta name="description" content="Crie roteiros profissionais para vídeos, podcasts, tutoriais e storytelling em segundos usando nossa ferramenta de geração por IA. Exporte facilmente em PDF." />
      </Helmet>
    
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-3xl md:text-4xl font-bold mb-4 bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
              Gerador de Roteiros Profissionais
            </h1>
            <p className="text-lg text-gray-600">
              Crie roteiros para vídeos, podcasts, tutoriais e storytelling em segundos
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
                    className="w-full py-6 text-lg bg-gradient-to-r from-primary to-purple-600 hover:from-primary/90 hover:to-purple-700"
                    disabled={!prompt}
                  >
                    Gerar Roteiro Profissional
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
          
          <div className="mt-8 text-center text-sm text-gray-500">
            <p>O gerador de roteiros utiliza inteligência artificial para criar conteúdo original. Revise sempre o conteúdo gerado.</p>
          </div>
        </div>
      </div>
    </>
  );
}
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
  { id: 'geral', label: 'Roteiro Geral' },
];

export default function ScriptGenerator() {
  const [prompt, setPrompt] = useState('');
  const [scriptType, setScriptType] = useState('geral');
  const [showPreview, setShowPreview] = useState(false);
  const [examples] = useState([
    "Um roteiro de podcast sobre empreendedorismo digital",
    "Um tutorial passo-a-passo de como preparar lasanha",
    "Um storytelling sobre uma pessoa que descobre um segredo antigo",
    "Um roteiro de vídeo para YouTube sobre mitos e verdades da IA",
    "Uma entrevista com um especialista em marketing digital",
  ]);

  const handleGenerate = () => {
    if (!prompt) {
      return;
    }
    
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
                    className="w-full py-6 text-lg"
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
              prompt={prompt} 
              scriptType={scriptType}
            />
          )}
          
          <Card className="mt-12">
            <CardContent className="pt-6">
              <h2 className="text-xl font-bold mb-4">Por que usar nosso gerador de roteiros?</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-gray-50 p-4 rounded-lg">
                  <div className="text-primary font-bold text-lg mb-2">Economize tempo</div>
                  <p className="text-gray-600">Gere roteiros profissionais em segundos ao invés de horas de trabalho manual</p>
                </div>
                
                <div className="bg-gray-50 p-4 rounded-lg">
                  <div className="text-primary font-bold text-lg mb-2">Estrutura profissional</div>
                  <p className="text-gray-600">Todos os roteiros seguem formatos profissionais específicos para cada meio</p>
                </div>
                
                <div className="bg-gray-50 p-4 rounded-lg">
                  <div className="text-primary font-bold text-lg mb-2">Fácil exportação</div>
                  <p className="text-gray-600">Exporte seus roteiros em PDF ou copie diretamente para seus documentos</p>
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
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { useToast } from '@/hooks/use-toast';
import { ProcessingProgress } from '@/components/ProcessingProgress';
import { Loader2, Video, Play } from 'lucide-react';

export default function GenerationDemo() {
  const [script, setScript] = useState('');
  const [voice, setVoice] = useState('pt-BR-Female-Professional');
  const [speed, setSpeed] = useState(1.0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [taskId, setTaskId] = useState<string | null>(null);
  const [result, setResult] = useState<any | null>(null);
  const { toast } = useToast();
  
  // Iniciar geração de vídeo
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!script.trim()) {
      toast({
        variant: 'destructive',
        title: 'Roteiro obrigatório',
        description: 'Por favor, insira um roteiro para gerar o vídeo.'
      });
      return;
    }
    
    try {
      setIsSubmitting(true);
      setResult(null);
      
      // Fazer requisição para iniciar processamento assíncrono
      const response = await fetch('/api/process-video', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          script,
          voice,
          speed,
          transitions: [],
          outputFormat: 'mp4'
        })
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || 'Falha ao iniciar processamento');
      }
      
      // Armazenar o ID da tarefa para acompanhamento
      setTaskId(data.taskId);
      
      toast({
        title: 'Processamento iniciado',
        description: 'Acompanhe o progresso na tela.'
      });
      
    } catch (error: any) {
      toast({
        variant: 'destructive',
        title: 'Erro ao iniciar processamento',
        description: error.message || 'Ocorreu um erro inesperado'
      });
    } finally {
      setIsSubmitting(false);
    }
  };
  
  // Lidar com conclusão do processamento
  const handleProcessingComplete = (processingResult: any) => {
    setResult(processingResult);
    
    toast({
      title: 'Processamento concluído',
      description: 'Seu vídeo foi gerado com sucesso!'
    });
  };
  
  // Lidar com erros de processamento
  const handleProcessingError = (error: string) => {
    toast({
      variant: 'destructive',
      title: 'Erro no processamento',
      description: error || 'Ocorreu um erro durante o processamento'
    });
  };
  
  return (
    <div className="container mx-auto py-8 max-w-4xl">
      <div className="mb-8 text-center">
        <h1 className="text-3xl font-bold mb-2 bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
          Geração de Vídeo com IA
        </h1>
        <p className="text-gray-600 max-w-2xl mx-auto">
          Transforme seus roteiros em vídeos profissionais. Experimente o novo sistema
          de processamento assíncrono com atualizações em tempo real do progresso.
        </p>
      </div>
      
      <div className="grid md:grid-cols-2 gap-6">
        <div>
          <Card>
            <CardHeader>
              <CardTitle>Roteiro e Configurações</CardTitle>
              <CardDescription>
                Digite seu roteiro e escolha as opções de narração
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} id="generation-form">
                <div className="mb-4">
                  <Label htmlFor="script" className="mb-2 block">Roteiro</Label>
                  <Textarea
                    id="script"
                    placeholder="Digite seu roteiro aqui..."
                    value={script}
                    onChange={(e) => setScript(e.target.value)}
                    rows={6}
                    className="resize-none"
                  />
                  <div className="text-xs text-gray-500 mt-1 text-right">
                    {script.length} caracteres
                  </div>
                </div>
                
                <div className="grid gap-4">
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="voice" className="mb-2 block">Voz</Label>
                      <Select 
                        value={voice} 
                        onValueChange={setVoice}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Selecione uma voz" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="pt-BR-Female-Professional">Feminina Profissional</SelectItem>
                          <SelectItem value="pt-BR-Male-Professional">Masculina Profissional</SelectItem>
                          <SelectItem value="pt-BR-Female-Young">Feminina Jovem</SelectItem>
                          <SelectItem value="pt-BR-Male-Young">Masculina Jovem</SelectItem>
                          <SelectItem value="pt-BR-Neutral">Neutra</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div>
                      <Label htmlFor="speed" className="mb-2 block">
                        Velocidade da fala: {speed.toFixed(1)}x
                      </Label>
                      <Slider
                        id="speed"
                        min={0.5}
                        max={2.0}
                        step={0.1}
                        value={[speed]}
                        onValueChange={(values) => setSpeed(values[0])}
                        className="mt-3"
                      />
                    </div>
                  </div>
                </div>
              </form>
            </CardContent>
            <CardFooter>
              <Button 
                type="submit" 
                form="generation-form" 
                disabled={isSubmitting || !script.trim()}
                className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700"
              >
                {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                {isSubmitting ? 'Processando...' : 'Gerar Vídeo'}
              </Button>
            </CardFooter>
          </Card>
        </div>
        
        <div>
          <div className="space-y-4">
            {taskId && (
              <ProcessingProgress 
                taskId={taskId} 
                onComplete={handleProcessingComplete}
                onError={handleProcessingError}
              />
            )}
            
            {result && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Video className="mr-2 h-5 w-5 text-blue-600" />
                    Vídeo Gerado
                  </CardTitle>
                  <CardDescription>
                    Vídeo processado com sucesso
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="bg-gray-100 border border-gray-200 rounded-md p-4 text-center">
                    {/* Aqui seria mostrado o vídeo ou imagens do resultado */}
                    {result.resources?.imageUrls && (
                      <div className="grid grid-cols-2 gap-2 mb-3">
                        {result.resources.imageUrls.slice(0, 4).map((url: string, index: number) => (
                          <div key={index} className="aspect-video bg-gray-200 rounded-md overflow-hidden">
                            <img src={url} alt={`Geração ${index + 1}`} className="w-full h-full object-cover" />
                          </div>
                        ))}
                      </div>
                    )}
                    
                    {result.resources?.audioData && (
                      <div className="mt-2">
                        <audio 
                          controls 
                          src={result.resources.audioData} 
                          className="w-full"
                        />
                      </div>
                    )}
                    
                    <div className="mt-4">
                      <Button className="bg-green-600 hover:bg-green-700">
                        <Play className="mr-2 h-4 w-4" />
                        Baixar Vídeo
                      </Button>
                    </div>
                  </div>
                  
                  <div className="mt-4">
                    <h4 className="font-semibold mb-2 text-sm">Metadados do Vídeo</h4>
                    <div className="text-xs text-gray-600 space-y-1">
                      <div className="flex justify-between">
                        <span>Duração:</span>
                        <span>{result.metadata?.duration || 0} segundos</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Segmentos:</span>
                        <span>{result.metadata?.segments || 0}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Imagens:</span>
                        <span>{result.resources?.imageUrls?.length || 0}</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}
            
            {!taskId && !result && (
              <Card className="bg-gray-50">
                <CardContent className="pt-6 pb-4 flex flex-col items-center justify-center text-center min-h-[300px]">
                  <Video className="h-16 w-16 text-gray-300 mb-4" />
                  <h3 className="text-lg font-medium text-gray-700">Nenhum vídeo gerado</h3>
                  <p className="text-gray-500 text-sm mt-1 max-w-xs">
                    Preencha o formulário e clique em "Gerar Vídeo" para criar seu primeiro vídeo com IA.
                  </p>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
      
      <div className="mt-8">
        <Separator className="my-4" />
        <div className="text-sm text-gray-500 text-center">
          <p>Este demo utiliza WebSocket para atualizações em tempo real do progresso do processamento.</p>
          <p className="mt-1">O tempo estimado de processamento é de aproximadamente 5 minutos.</p>
        </div>
      </div>
    </div>
  );
}
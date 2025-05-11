import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Separator } from '@/components/ui/separator';
import { Progress } from '@/components/ui/progress';
import { AlertCircle, FolderCheck } from 'lucide-react';
import { apiRequest } from '@/lib/queryClient';
import { Loader2, Video, CheckCircle, AlertTriangle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import APIStatusChecker from '@/components/APIStatusChecker';

export default function VideoTester() {
  const [script, setScript] = useState<string>('Este é um teste de geração de vídeo com detecção de silêncio. A pausa entre frases será detectada automaticamente. Isso permite criar vídeos mais naturais e sincronizados.');
  const [voice, setVoice] = useState<string>('FEMININO_PROFISSIONAL');
  const [topic, setTopic] = useState<string>('tecnologia digital business');
  const [detectSilence, setDetectSilence] = useState<boolean>(true);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [taskId, setTaskId] = useState<string | null>(null);
  const [progress, setProgress] = useState<number>(0);
  const [status, setStatus] = useState<string>('');
  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  const [ensureDirectories, setEnsureDirectories] = useState<{
    success: boolean;
    directories?: { 
      tmp: string;
      output: string;
      images: string;
    };
    error?: string;
  } | null>(null);
  const [isEnsuring, setIsEnsuring] = useState<boolean>(false);
  const { toast } = useToast();
  
  // Função para garantir que os diretórios necessários existem
  const handleEnsureDirectories = async () => {
    try {
      setIsEnsuring(true);
      const response = await apiRequest('GET', '/api/ensure-directories');
      const data = await response.json();
      
      setEnsureDirectories(data);
      
      if (data.success) {
        toast({
          title: "Diretórios verificados",
          description: "Todos os diretórios necessários estão prontos para uso.",
        });
      } else {
        toast({
          title: "Erro ao verificar diretórios",
          description: data.error || "Não foi possível garantir a existência dos diretórios necessários.",
          variant: "destructive",
        });
      }
    } catch (error: any) {
      toast({
        title: "Erro na comunicação",
        description: "Não foi possível verificar os diretórios. Tente novamente.",
        variant: "destructive",
      });
    } finally {
      setIsEnsuring(false);
    }
  };

  // Verificar o status do processamento periodicamente
  React.useEffect(() => {
    let interval: NodeJS.Timeout;
    
    if (taskId && (status !== 'completed' && status !== 'failed')) {
      interval = setInterval(async () => {
        try {
          const response = await apiRequest('GET', `/api/task-status/${taskId}`);
          const data = await response.json();
          
          if (data.success) {
            setProgress(data.task.progress);
            setStatus(data.task.status);
            
            if (data.task.error) {
              setError(data.task.error);
            }
            
            if (data.task.result) {
              setResult(data.task.result);
            }
            
            // Se o processamento terminou, limpar o intervalo
            if (data.task.status === 'completed' || data.task.status === 'failed') {
              clearInterval(interval);
              
              if (data.task.status === 'completed') {
                toast({
                  title: "Vídeo gerado com sucesso!",
                  description: "Seu vídeo foi processado e está pronto para visualização.",
                  variant: "default",
                });
              } else if (data.task.status === 'failed') {
                toast({
                  title: "Falha na geração do vídeo",
                  description: data.task.error || "Ocorreu um erro durante o processamento.",
                  variant: "destructive",
                });
              }
            }
          }
        } catch (err) {
          console.error('Erro ao verificar status:', err);
        }
      }, 1500);
    }
    
    return () => {
      if (interval) {
        clearInterval(interval);
      }
    };
  }, [taskId, status, toast]);

  // Função para enviar o script e gerar o vídeo
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      setIsSubmitting(true);
      setError(null);
      setTaskId(null);
      setProgress(0);
      setStatus('');
      setResult(null);
      
      const response = await apiRequest('POST', '/api/test-video-generator', {
        script,
        options: {
          voz: voice,
          topico: topic,
          detectarSilencio: detectSilence,
          transicoes: ['fade', 'zoom'],
          resolucao: '720p'
        }
      });
      
      const data = await response.json();
      
      if (data.success) {
        setTaskId(data.taskId);
        setStatus('pending');
        toast({
          title: "Processamento iniciado",
          description: "A geração do vídeo foi iniciada. Aguarde enquanto processamos seu conteúdo.",
        });
      } else {
        setError(data.error || 'Ocorreu um erro ao iniciar o processamento');
        toast({
          title: "Erro na solicitação",
          description: data.error || "Não foi possível iniciar o processamento do vídeo.",
          variant: "destructive",
        });
      }
    } catch (err: any) {
      setError(err.message || 'Erro ao enviar solicitação');
      toast({
        title: "Erro na comunicação",
        description: "Houve um problema na comunicação com o servidor.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="container mx-auto py-8">
      <Card className="w-full max-w-4xl mx-auto mb-8">
        <CardHeader>
          <CardTitle className="text-2xl">Gerador de Vídeo com IA</CardTitle>
          <CardDescription>
            Teste nosso novo sistema de geração de vídeo com detecção automática de silêncio para cortes
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="script">Script (roteiro)</Label>
              <Textarea
                id="script"
                value={script}
                onChange={(e) => setScript(e.target.value)}
                placeholder="Digite o roteiro do seu vídeo aqui..."
                className="min-h-32"
                required
              />
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="voice">Voz</Label>
                <Select value={voice} onValueChange={setVoice}>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione uma voz" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      <SelectLabel>Vozes Brasileiras</SelectLabel>
                      <SelectItem value="FEMININO_PROFISSIONAL">Feminina Profissional</SelectItem>
                      <SelectItem value="MASCULINO_PROFISSIONAL">Masculina Profissional</SelectItem>
                      <SelectItem value="FEMININO_JOVEM">Feminina Jovem</SelectItem>
                      <SelectItem value="MASCULINO_JOVEM">Masculina Jovem</SelectItem>
                      <SelectItem value="NEUTRO">Neutra</SelectItem>
                    </SelectGroup>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="topic">Tópico para Imagens</Label>
                <Input
                  id="topic"
                  value={topic}
                  onChange={(e) => setTopic(e.target.value)}
                  placeholder="Tópico para buscar imagens"
                />
              </div>
            </div>
            
            <div className="flex items-center space-x-2">
              <Checkbox 
                id="detectSilence" 
                checked={detectSilence}
                onCheckedChange={(checked) => setDetectSilence(checked as boolean)}
              />
              <Label htmlFor="detectSilence">
                Usar detecção de silêncio para cortes automáticos
              </Label>
            </div>
            
            <Button 
              type="submit" 
              className="w-full bg-gradient-to-r from-blue-600 to-indigo-700 hover:from-blue-700 hover:to-indigo-800"
              disabled={isSubmitting || (!!taskId && status !== 'completed' && status !== 'failed')}
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Processando...
                </>
              ) : (
                'Gerar Vídeo com IA'
              )}
            </Button>
          </form>
        </CardContent>
      </Card>
      
      {error && (
        <Alert variant="destructive" className="max-w-4xl mx-auto mb-8">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}
      
      {taskId && (
        <Card className="w-full max-w-4xl mx-auto">
          <CardHeader>
            <CardTitle className="flex items-center">
              {status === 'completed' ? (
                <>
                  <CheckCircle className="h-5 w-5 mr-2 text-green-500" />
                  Vídeo Gerado com Sucesso
                </>
              ) : status === 'failed' ? (
                <>
                  <AlertTriangle className="h-5 w-5 mr-2 text-red-500" />
                  Falha na Geração
                </>
              ) : (
                <>
                  <Video className="h-5 w-5 mr-2" />
                  Processamento do Vídeo
                </>
              )}
            </CardTitle>
            <CardDescription>
              ID da tarefa: {taskId}
            </CardDescription>
          </CardHeader>
          <CardContent>
            {(status === 'pending' || status === 'processing') && (
              <div className="space-y-2">
                <div className="flex justify-between text-sm mb-1">
                  <span>Progresso</span>
                  <span>{progress}%</span>
                </div>
                <Progress value={progress} className="h-2" />
                <p className="text-center mt-4 text-sm text-muted-foreground">
                  {status === 'pending' ? 'Aguardando início do processamento...' : 'Processando seu vídeo...'}
                </p>
              </div>
            )}
            
            {result && (
              <div className="mt-4">
                <Separator className="my-4" />
                <h3 className="text-lg font-medium mb-2">Resultado</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm font-medium">Tamanho do arquivo</p>
                    <p className="text-sm text-muted-foreground">
                      {Math.round(result.size / 1024 / 1024 * 100) / 100} MB
                    </p>
                  </div>
                  <div>
                    <p className="text-sm font-medium">Data de criação</p>
                    <p className="text-sm text-muted-foreground">
                      {new Date(result.createdAt).toLocaleString()}
                    </p>
                  </div>
                </div>
                
                <div className="mt-6">
                  <Button
                    variant="outline"
                    onClick={() => {
                      window.open(`/api/video/${result.videoPath}`, '_blank');
                    }}
                  >
                    <Video className="h-4 w-4 mr-2" />
                    Visualizar Vídeo
                  </Button>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
}
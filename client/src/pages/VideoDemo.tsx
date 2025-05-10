import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { Loader2 } from 'lucide-react';
import { ProcessingProgress } from '@/components/ProcessingProgress';
import VideoPlayer from '@/components/VideoPlayer';
import APIStatusChecker from '@/components/APIStatusChecker';

/**
 * Página de demonstração da verificação de status de vídeo
 * Permite testar a verificação do processamento e a reprodução dos vídeos
 */
export default function VideoDemo() {
  const [jobId, setJobId] = useState<string>('');
  const [processingTaskId, setProcessingTaskId] = useState<string | null>(null);
  const [manualVideoId, setManualVideoId] = useState<string>('');
  const [showVideoPlayer, setShowVideoPlayer] = useState<boolean>(false);
  const [submitting, setSubmitting] = useState<boolean>(false);
  const { toast } = useToast();
  
  // Iniciar um novo processamento
  const startProcessing = async () => {
    try {
      setSubmitting(true);
      
      // Chamada para iniciar processamento
      const response = await fetch('/api/process-video', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          script: 'Este é um vídeo de teste para demonstração da funcionalidade de verificação de processamento e reprodução.',
          voice: 'pt-BR-Female-Professional',
          outputFormat: 'mp4'
        })
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || 'Erro ao iniciar processamento');
      }
      
      if (!data.success) {
        throw new Error(data.error || 'Erro ao iniciar processamento');
      }
      
      // Atualizar estado com o ID da tarefa
      setProcessingTaskId(data.taskId);
      
      toast({
        title: 'Processamento iniciado',
        description: 'O processamento do vídeo foi iniciado com sucesso.',
        variant: 'default'
      });
      
    } catch (error: any) {
      console.error('Erro ao iniciar processamento:', error);
      
      toast({
        title: 'Erro ao iniciar processamento',
        description: error.message || 'Ocorreu um erro ao iniciar o processamento do vídeo.',
        variant: 'destructive'
      });
    } finally {
      setSubmitting(false);
    }
  };
  
  // Verificar manualmente um vídeo existente
  const checkExistingVideo = () => {
    if (!manualVideoId) {
      toast({
        title: 'ID não informado',
        description: 'Por favor, informe o ID do vídeo para verificar.',
        variant: 'destructive'
      });
      return;
    }
    
    setJobId(manualVideoId);
    setShowVideoPlayer(true);
  };
  
  return (
    <div className="container py-8 max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">Demonstração de Verificação de Vídeo</h1>
      
      <APIStatusChecker />
      
      <Tabs defaultValue="process" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="process">Processar Novo Vídeo</TabsTrigger>
          <TabsTrigger value="check">Verificar Vídeo Existente</TabsTrigger>
        </TabsList>
        
        <TabsContent value="process" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle>Processar Novo Vídeo</CardTitle>
              <CardDescription>
                Inicie um novo processamento de vídeo para testar a verificação do status e a reprodução.
              </CardDescription>
            </CardHeader>
            
            <CardContent>
              {processingTaskId ? (
                <ProcessingProgress 
                  taskId={processingTaskId} 
                  autoConnect={true}
                  onComplete={(result: any) => {
                    if (result && result.jobId) {
                      setJobId(result.jobId);
                    }
                  }}
                />
              ) : (
                <div className="space-y-4">
                  <p className="text-sm text-gray-600">
                    Clique no botão abaixo para iniciar um novo processamento de vídeo de teste.
                    Isso iniciará o processo de geração com um script simples para demonstração.
                  </p>
                  
                  <Button
                    onClick={startProcessing}
                    disabled={submitting}
                    className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700"
                  >
                    {submitting ? (
                      <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Iniciando processamento...</>
                    ) : (
                      'Iniciar Processamento'
                    )}
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="check" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle>Verificar Vídeo Existente</CardTitle>
              <CardDescription>
                Informe o ID de um vídeo existente para verificar seu status e visualizá-lo.
              </CardDescription>
            </CardHeader>
            
            <CardContent>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="video-id">ID do Vídeo</Label>
                  <div className="flex">
                    <Input
                      id="video-id"
                      placeholder="Informe o ID do vídeo"
                      value={manualVideoId}
                      onChange={(e) => setManualVideoId(e.target.value)}
                      className="rounded-r-none"
                    />
                    <Button 
                      onClick={checkExistingVideo}
                      className="rounded-l-none"
                      variant="secondary"
                    >
                      Verificar
                    </Button>
                  </div>
                  <p className="text-xs text-gray-500">
                    Informe o ID do job de processamento de vídeo que deseja verificar.
                  </p>
                </div>
                
                {showVideoPlayer && jobId && (
                  <div className="mt-6">
                    <h3 className="text-lg font-semibold mb-2">Resultado da Verificação</h3>
                    <VideoPlayer 
                      videoId={jobId} 
                      autoCheck={true}
                      showDownload={true}
                    />
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
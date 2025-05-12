import React, { useState, useEffect } from 'react';
import { Container } from '@/components/ui/container';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { apiRequest } from '@/lib/queryClient';
import { useToast } from '@/hooks/use-toast';
import { Separator } from '@/components/ui/separator';
import { ServiceStatusDisplay } from '@/components/ui/service-status-display';
import { AlertCircle, CheckCircle, Settings as SettingsIcon, RefreshCw } from 'lucide-react';

type ServicePreferences = {
  useOpenAI: boolean;
  useElevenLabs: boolean;
  usePexels: boolean;
};

export default function Settings() {
  const [preferences, setPreferences] = useState<ServicePreferences>({
    useOpenAI: true,
    useElevenLabs: true,
    usePexels: true,
  });
  const [loading, setLoading] = useState(false);
  const [statusChecking, setStatusChecking] = useState(false);
  const [serviceStatus, setServiceStatus] = useState<any>(null);
  const { toast } = useToast();

  useEffect(() => {
    // Carregar preferências salvas
    const savedPrefs = localStorage.getItem('service_preferences');
    if (savedPrefs) {
      try {
        const parsed = JSON.parse(savedPrefs);
        setPreferences(prev => ({
          ...prev,
          useOpenAI: parsed.useOpenAI !== undefined ? parsed.useOpenAI : prev.useOpenAI,
          useElevenLabs: parsed.useElevenLabs !== undefined ? parsed.useElevenLabs : prev.useElevenLabs,
          usePexels: parsed.usePexels !== undefined ? parsed.usePexels : prev.usePexels,
        }));
      } catch (e) {
        console.error('Erro ao carregar preferências:', e);
      }
    }
    
    // Verificar status inicial dos serviços
    checkServiceStatus();
  }, []);

  const handleToggleChange = (key: keyof ServicePreferences) => {
    setPreferences(prev => {
      const updated = { ...prev, [key]: !prev[key] };
      
      // Salvar no localStorage
      localStorage.setItem('service_preferences', JSON.stringify(updated));
      
      return updated;
    });
  };

  const checkServiceStatus = async () => {
    setStatusChecking(true);
    try {
      const response = await apiRequest('GET', '/api/check-all-services');
      const data = await response.json();
      setServiceStatus(data);
    } catch (error) {
      console.error('Erro ao verificar status dos serviços:', error);
      toast({
        title: 'Erro',
        description: 'Não foi possível verificar o status dos serviços.',
        variant: 'destructive',
      });
    } finally {
      setStatusChecking(false);
    }
  };

  const savePreferences = async () => {
    setLoading(true);
    try {
      const response = await apiRequest('POST', '/api/update-service-preferences', preferences);
      const data = await response.json();
      
      if (data.success) {
        toast({
          title: 'Configurações salvas',
          description: 'Suas preferências foram atualizadas com sucesso.',
        });
        
        // Recarregar status dos serviços
        checkServiceStatus();
      } else {
        throw new Error(data.error || 'Erro ao salvar preferências');
      }
    } catch (error: any) {
      toast({
        title: 'Erro',
        description: error.message || 'Ocorreu um erro ao salvar as configurações.',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container>
      <div className="flex flex-col space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold">Configurações</h1>
          <Button 
            variant="outline" 
            size="sm" 
            onClick={checkServiceStatus}
            disabled={statusChecking}
          >
            <RefreshCw className={`h-4 w-4 mr-2 ${statusChecking ? 'animate-spin' : ''}`} />
            Verificar Status
          </Button>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="md:col-span-2">
            <Tabs defaultValue="services">
              <TabsList className="mb-4">
                <TabsTrigger value="services">Serviços</TabsTrigger>
                <TabsTrigger value="appearance">Aparência</TabsTrigger>
                <TabsTrigger value="advanced">Avançado</TabsTrigger>
              </TabsList>
              
              <TabsContent value="services" className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <SettingsIcon className="h-5 w-5" />
                      Configurações de Serviços
                    </CardTitle>
                    <CardDescription>
                      Configure quais serviços você deseja utilizar. Serviços pagos oferecem melhor qualidade, 
                      enquanto serviços gratuitos são ótimos para testes.
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="space-y-4">
                      <div className="flex flex-col space-y-2">
                        <div className="flex items-center justify-between">
                          <div>
                            <Label htmlFor="openai-toggle" className="font-medium">
                              Usar OpenAI
                            </Label>
                            <p className="text-sm text-muted-foreground">
                              Para geração de texto e scripts. Alternativa gratuita: HuggingFace
                            </p>
                          </div>
                          <div className="flex items-center gap-3">
                            {serviceStatus?.services?.paid?.openai?.working ? (
                              <Badge variant="success" className="mr-2">
                                <CheckCircle className="h-3 w-3 mr-1" />
                                Disponível
                              </Badge>
                            ) : (
                              <Badge variant="outline" className="mr-2 border-red-200 text-red-600">
                                <AlertCircle className="h-3 w-3 mr-1" />
                                Indisponível
                              </Badge>
                            )}
                            <Switch
                              id="openai-toggle"
                              checked={preferences.useOpenAI}
                              onCheckedChange={() => handleToggleChange('useOpenAI')}
                            />
                          </div>
                        </div>
                      </div>
                      
                      <Separator />
                      
                      <div className="flex flex-col space-y-2">
                        <div className="flex items-center justify-between">
                          <div>
                            <Label htmlFor="elevenlabs-toggle" className="font-medium">
                              Usar ElevenLabs
                            </Label>
                            <p className="text-sm text-muted-foreground">
                              Para narração com vozes realistas. Alternativa gratuita: Edge TTS
                            </p>
                          </div>
                          <div className="flex items-center gap-3">
                            {serviceStatus?.services?.paid?.elevenlabs?.working ? (
                              <Badge variant="success" className="mr-2">
                                <CheckCircle className="h-3 w-3 mr-1" />
                                Disponível
                              </Badge>
                            ) : (
                              <Badge variant="outline" className="mr-2 border-red-200 text-red-600">
                                <AlertCircle className="h-3 w-3 mr-1" />
                                Indisponível
                              </Badge>
                            )}
                            <Switch
                              id="elevenlabs-toggle"
                              checked={preferences.useElevenLabs}
                              onCheckedChange={() => handleToggleChange('useElevenLabs')}
                            />
                          </div>
                        </div>
                      </div>
                      
                      <Separator />
                      
                      <div className="flex flex-col space-y-2">
                        <div className="flex items-center justify-between">
                          <div>
                            <Label htmlFor="pexels-toggle" className="font-medium">
                              Usar Pexels
                            </Label>
                            <p className="text-sm text-muted-foreground">
                              Para imagens de alta qualidade. Alternativas gratuitas: Pixabay, Unsplash
                            </p>
                          </div>
                          <div className="flex items-center gap-3">
                            {serviceStatus?.services?.paid?.pexels?.working ? (
                              <Badge variant="success" className="mr-2">
                                <CheckCircle className="h-3 w-3 mr-1" />
                                Disponível
                              </Badge>
                            ) : (
                              <Badge variant="outline" className="mr-2 border-red-200 text-red-600">
                                <AlertCircle className="h-3 w-3 mr-1" />
                                Indisponível
                              </Badge>
                            )}
                            <Switch
                              id="pexels-toggle"
                              checked={preferences.usePexels}
                              onCheckedChange={() => handleToggleChange('usePexels')}
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                  <CardFooter>
                    <Button 
                      onClick={savePreferences} 
                      disabled={loading}
                      className="w-full"
                    >
                      {loading ? 'Salvando...' : 'Salvar Configurações'}
                    </Button>
                  </CardFooter>
                </Card>
                
                <Card>
                  <CardHeader>
                    <CardTitle>Serviços Alternativos Gratuitos</CardTitle>
                    <CardDescription>
                      O sistema suporta as seguintes alternativas gratuitas para os serviços pagos
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="space-y-2">
                        <h3 className="font-medium">Texto/IA</h3>
                        <div className="rounded-lg border p-3">
                          <Badge variant="success">Gratuito</Badge>
                          <p className="mt-2 font-medium">HuggingFace</p>
                          <p className="text-sm text-muted-foreground">
                            API gratuita para geração de texto
                          </p>
                        </div>
                      </div>
                      
                      <div className="space-y-2">
                        <h3 className="font-medium">Áudio/Voz</h3>
                        <div className="rounded-lg border p-3">
                          <Badge variant="success">Gratuito</Badge>
                          <p className="mt-2 font-medium">Edge TTS</p>
                          <p className="text-sm text-muted-foreground">
                            Serviço de texto para voz da Microsoft
                          </p>
                        </div>
                      </div>
                      
                      <div className="space-y-2">
                        <h3 className="font-medium">Imagens</h3>
                        <div className="rounded-lg border p-3">
                          <Badge variant="success">Gratuito</Badge>
                          <p className="mt-2 font-medium">Pixabay/Unsplash</p>
                          <p className="text-sm text-muted-foreground">
                            Bancos de imagens gratuitos com APIs robustas
                          </p>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
              
              <TabsContent value="appearance">
                <Card>
                  <CardHeader>
                    <CardTitle>Configurações de Aparência</CardTitle>
                    <CardDescription>
                      Personalize a aparência da interface
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground">
                      Configurações de aparência serão implementadas em breve.
                    </p>
                  </CardContent>
                </Card>
              </TabsContent>
              
              <TabsContent value="advanced">
                <Card>
                  <CardHeader>
                    <CardTitle>Configurações Avançadas</CardTitle>
                    <CardDescription>
                      Configurações avançadas para usuários experientes
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground">
                      Configurações avançadas serão implementadas em breve.
                    </p>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
          
          <div className="space-y-6">
            <ServiceStatusDisplay />
            
            <Card>
              <CardHeader className="py-3">
                <CardTitle className="text-sm">Documentação</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2 text-sm">
                <p>
                  <a href="/API-ALTERNATIVAS-GRATUITAS.md" target="_blank" className="text-blue-500 hover:underline">
                    Ver documentação de API alternativas
                  </a>
                </p>
                <p>
                  <a href="https://github.com/microsoft/azureml-examples/tree/main/cli/jobs/pipelines-with-components/mnist/pipeline.yml" target="_blank" className="text-blue-500 hover:underline">
                    Exemplos de configuração avançada
                  </a>
                </p>
                <p>
                  <a href="https://console.elevenlabs.io" target="_blank" className="text-blue-500 hover:underline">
                    Portal ElevenLabs
                  </a>
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </Container>
  );
}
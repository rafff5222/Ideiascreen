import { useState } from 'react';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { Eye, EyeOff, CheckCircle2, Loader2 } from 'lucide-react';
import APIStatusChecker from './APIStatusChecker';
import { requestSecrets } from '@/lib/secrets';

export default function APIConfigPanel() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showOpenAI, setShowOpenAI] = useState(false);
  const [showElevenLabs, setShowElevenLabs] = useState(false);
  const [openAIKey, setOpenAIKey] = useState('');
  const [elevenLabsKey, setElevenLabsKey] = useState('');
  const [isConfigured, setIsConfigured] = useState(false);
  const { toast } = useToast();

  // Função para testar uma chave de API
  const testAPIKey = async (api: 'openai' | 'elevenlabs') => {
    try {
      const response = await fetch(`/api/test-api-connection/${api}`);
      const data = await response.json();
      
      if (data.success && data.connection?.working) {
        toast({
          title: 'Conexão bem-sucedida',
          description: `A chave da ${api === 'openai' ? 'OpenAI' : 'ElevenLabs'} está funcionando corretamente.`,
          variant: 'default'
        });
        return true;
      } else {
        const errorMsg = data.connection?.message || `Erro ao conectar à API da ${api === 'openai' ? 'OpenAI' : 'ElevenLabs'}`;
        toast({
          title: 'Erro de conexão',
          description: errorMsg,
          variant: 'destructive'
        });
        return false;
      }
    } catch (error) {
      console.error(`Erro ao testar chave ${api}:`, error);
      toast({
        title: 'Erro de teste',
        description: `Não foi possível testar a conexão com a ${api === 'openai' ? 'OpenAI' : 'ElevenLabs'}.`,
        variant: 'destructive'
      });
      return false;
    }
  };

  // Função para salvar as chaves de API
  const handleSaveKeys = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!openAIKey && !elevenLabsKey) {
      toast({
        variant: 'destructive',
        title: 'Chaves não informadas',
        description: 'Por favor, informe pelo menos uma chave de API.'
      });
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      // Solicitar configuração das chaves de API via Replit
      const missingKeys: string[] = [];
      const messages: string[] = [];
      
      if (openAIKey) {
        missingKeys.push('OPENAI_API_KEY');
        messages.push(`OPENAI_API_KEY=${openAIKey}`);
      }
      
      if (elevenLabsKey) {
        missingKeys.push('ELEVENLABS_API_KEY');
        messages.push(`ELEVENLABS_API_KEY=${elevenLabsKey}`);
      }
      
      // Chamar a função de solicitação de segredos com as chaves informadas
      await requestSecrets(
        missingKeys, 
        'Configure estas chaves de API:\n\n' + messages.join('\n')
      );
      
      toast({
        title: 'Chaves de API enviadas',
        description: 'Suas chaves estão sendo configuradas. Aguarde um momento e clique em "Verificar novamente".'
      });
      
      // Limpar campos
      setOpenAIKey('');
      setElevenLabsKey('');
      
      // Aguardar um pouco e verificar se as chaves foram configuradas
      setTimeout(async () => {
        let openaiOk = false;
        let elevenlabsOk = false;
        
        if (missingKeys.includes('OPENAI_API_KEY')) {
          openaiOk = await testAPIKey('openai');
        }
        
        if (missingKeys.includes('ELEVENLABS_API_KEY')) {
          elevenlabsOk = await testAPIKey('elevenlabs');
        }
        
        if (openaiOk || elevenlabsOk) {
          setIsConfigured(true);
        }
      }, 3000);
      
    } catch (error) {
      console.error('Erro ao salvar chaves:', error);
      toast({
        variant: 'destructive',
        title: 'Erro ao salvar chaves',
        description: 'Ocorreu um erro ao armazenar suas chaves de API.'
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Solicitar chaves de API via Replit requestSecrets
  const requestAPIKeys = async () => {
    try {
      setIsSubmitting(true);
      
      // Preparar array de chaves faltantes
      const missingKeys = [];
      if (!openAIKey) missingKeys.push('OPENAI_API_KEY');
      if (!elevenLabsKey) missingKeys.push('ELEVENLABS_API_KEY');
      
      if (missingKeys.length === 0) {
        toast({
          title: 'Chaves já informadas',
          description: 'Você já informou todas as chaves necessárias.'
        });
        return;
      }
      
      // Chamar a função de solicitação de segredos
      await requestSecrets(
        missingKeys, 
        'Configure suas chaves de API para utilizar todas as funcionalidades de geração de vídeo'
      );
      
      toast({
        title: 'Chaves de API solicitadas',
        description: 'Verifique o painel do Replit para informar suas chaves de API.'
      });
      
    } catch (error) {
      console.error('Erro ao solicitar chaves:', error);
      toast({
        variant: 'destructive',
        title: 'Erro ao solicitar chaves',
        description: 'Ocorreu um erro ao solicitar suas chaves de API.'
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-4">
      <APIStatusChecker 
        onStatusChange={(status) => {
          // Se ambas as APIs estiverem configuradas, marcar como configurado
          if (status.openai === 'configured' && status.elevenlabs === 'configured') {
            setIsConfigured(true);
          }
        }}
      />
      
      <Card>
        <CardHeader>
          <CardTitle>Configuração de APIs</CardTitle>
          <CardDescription>
            Configure suas chaves de API para utilizar todos os recursos do aplicativo.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form id="api-keys-form" onSubmit={handleSaveKeys}>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="openai-key" className="flex items-center justify-between">
                  <span>OpenAI API Key</span>
                  <Button 
                    type="button" 
                    variant="ghost" 
                    size="sm" 
                    onClick={() => setShowOpenAI(!showOpenAI)}
                    className="h-6 px-2"
                  >
                    {showOpenAI ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </Button>
                </Label>
                <div className="relative">
                  <div className="flex">
                    <Input
                      id="openai-key"
                      type={showOpenAI ? "text" : "password"}
                      placeholder="sk-..."
                      value={openAIKey}
                      onChange={(e) => setOpenAIKey(e.target.value)}
                      className="rounded-r-none"
                    />
                    <Button 
                      type="button" 
                      variant="outline"
                      size="sm"
                      className="rounded-l-none border-l-0"
                      disabled={!openAIKey || isSubmitting}
                      onClick={() => {
                        if (openAIKey) {
                          setIsSubmitting(true);
                          handleSaveKeys(new Event('submit') as any);
                        }
                      }}
                    >
                      Testar
                    </Button>
                  </div>
                </div>
                <p className="text-xs text-gray-500">
                  Obtenha sua chave em{" "}
                  <a 
                    href="https://platform.openai.com/account/api-keys" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:underline"
                  >
                    platform.openai.com/account/api-keys
                  </a>
                </p>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="elevenlabs-key" className="flex items-center justify-between">
                  <span>ElevenLabs API Key</span>
                  <Button 
                    type="button" 
                    variant="ghost" 
                    size="sm" 
                    onClick={() => setShowElevenLabs(!showElevenLabs)}
                    className="h-6 px-2"
                  >
                    {showElevenLabs ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </Button>
                </Label>
                <div className="relative">
                  <div className="flex">
                    <Input
                      id="elevenlabs-key"
                      type={showElevenLabs ? "text" : "password"}
                      placeholder="xxxxxxxx..."
                      value={elevenLabsKey}
                      onChange={(e) => setElevenLabsKey(e.target.value)}
                      className="rounded-r-none"
                    />
                    <Button 
                      type="button" 
                      variant="outline"
                      size="sm"
                      className="rounded-l-none border-l-0"
                      disabled={!elevenLabsKey || isSubmitting}
                      onClick={() => {
                        if (elevenLabsKey) {
                          setIsSubmitting(true);
                          handleSaveKeys(new Event('submit') as any);
                        }
                      }}
                    >
                      Testar
                    </Button>
                  </div>
                </div>
                <p className="text-xs text-gray-500">
                  Obtenha sua chave em{" "}
                  <a 
                    href="https://elevenlabs.io/app/account" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:underline"
                  >
                    elevenlabs.io/app/account
                  </a>
                </p>
              </div>
            </div>
          </form>
        </CardContent>
        <CardFooter className="flex justify-between">
          <Button 
            variant="outline" 
            onClick={requestAPIKeys}
            disabled={isSubmitting}
          >
            {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Solicitar via Replit
          </Button>
          <Button 
            type="submit" 
            form="api-keys-form"
            disabled={isSubmitting || (!openAIKey && !elevenLabsKey)}
            className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700"
          >
            {isSubmitting ? (
              <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Salvando...</>
            ) : isConfigured ? (
              <><CheckCircle2 className="mr-2 h-4 w-4" /> Atualizar chaves</>
            ) : (
              'Salvar chaves'
            )}
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
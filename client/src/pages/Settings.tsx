import React from 'react';
import { Container } from '@/components/ui/container';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ServiceSwitcher } from '@/components/ui/service-switcher';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { AlertTriangle, Info, PlusCircle } from 'lucide-react';
import { Helmet } from 'react-helmet';

export default function Settings() {
  return (
    <Container>
      <Helmet>
        <title>Configurações | Gerador de Vídeos</title>
        <meta name="description" content="Configure suas preferências para o gerador de vídeos com IA" />
      </Helmet>

      <div className="py-10 space-y-8">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Configurações</h1>
          <p className="text-muted-foreground mt-2">
            Gerencie suas preferências, serviços e API keys para personalizar sua experiência.
          </p>
        </div>

        <Tabs defaultValue="services">
          <TabsList className="grid w-full grid-cols-3 mb-8">
            <TabsTrigger value="services">Serviços</TabsTrigger>
            <TabsTrigger value="api-keys">API Keys</TabsTrigger>
            <TabsTrigger value="preferences">Preferências</TabsTrigger>
          </TabsList>
          
          <TabsContent value="services" className="space-y-6">
            <ServiceSwitcher />
            
            <Card>
              <CardHeader className="pb-3">
                <CardTitle>Informações sobre Serviços Gratuitos</CardTitle>
                <CardDescription>
                  Saiba mais sobre as alternativas gratuitas disponíveis
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="rounded-lg border p-4">
                  <div className="flex gap-3">
                    <Info className="h-5 w-5 text-blue-500 flex-shrink-0 mt-0.5" />
                    <div>
                      <h3 className="font-medium">Alternativas Gratuitas às APIs Pagas</h3>
                      <p className="text-sm text-muted-foreground mt-1">
                        Nossa aplicação oferece alternativas 100% gratuitas para todas as APIs pagas utilizadas no sistema.
                        Consulte o documento <a href="/API-ALTERNATIVAS-GRATUITAS.md" className="text-blue-600 hover:underline" target="_blank">API-ALTERNATIVAS-GRATUITAS.md</a> na raiz do projeto para instruções detalhadas.
                      </p>
                      
                      <div className="grid gap-3 mt-4">
                        <div className="rounded-md bg-blue-50 p-3">
                          <h4 className="text-sm font-medium text-blue-900">Microsoft Edge TTS (Alternativa ao ElevenLabs)</h4>
                          <p className="text-xs text-blue-800">
                            Oferece vozes de alta qualidade em português brasileiro completamente gratuitas.
                            Instale com <code className="bg-blue-100 px-1 py-0.5 rounded">npm install -g edge-tts</code>
                          </p>
                        </div>
                        
                        <div className="rounded-md bg-blue-50 p-3">
                          <h4 className="text-sm font-medium text-blue-900">Ollama (Alternativa ao OpenAI)</h4>
                          <p className="text-xs text-blue-800">
                            Modelos de IA executados 100% localmente, sem necessidade de API key.
                            Baixe em <a href="https://ollama.com" className="text-blue-600 hover:underline" target="_blank">ollama.com</a>
                          </p>
                        </div>
                        
                        <div className="rounded-md bg-blue-50 p-3">
                          <h4 className="text-sm font-medium text-blue-900">Pixabay (Alternativa ao Pexels)</h4>
                          <p className="text-xs text-blue-800">
                            Oferece 5.000 requisições/hora gratuitamente para imagens de alta qualidade.
                            Registre-se em <a href="https://pixabay.com/api/docs/" className="text-blue-600 hover:underline" target="_blank">pixabay.com</a>
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="rounded-lg border border-amber-200 bg-amber-50 p-4">
                  <div className="flex gap-3">
                    <AlertTriangle className="h-5 w-5 text-amber-600 flex-shrink-0 mt-0.5" />
                    <div>
                      <h3 className="font-medium text-amber-900">Limites de APIs gratuitas</h3>
                      <p className="text-sm text-amber-800 mt-1">
                        Mesmo serviços gratuitos têm limites de uso. Você pode alternar entre diferentes serviços quando atingir esses limites.
                      </p>
                      <ul className="text-xs text-amber-800 mt-2 space-y-1 list-disc list-inside">
                        <li>Pixabay: 5.000 requisições/hora</li>
                        <li>Unsplash: 50 requisições/hora</li>
                        <li>HuggingFace: Varia por modelo</li>
                        <li>Ollama: Sem limites (execução local)</li>
                        <li>Edge TTS: Sem limites conhecidos</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="api-keys" className="space-y-6">
            <Card>
              <CardHeader className="pb-3">
                <CardTitle>Chaves de API</CardTitle>
                <CardDescription>
                  Configure suas chaves de API para os serviços
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* OpenAI */}
                <div className="space-y-2">
                  <Label htmlFor="openai-key">
                    <div className="flex items-center gap-2">
                      <span>OpenAI API Key</span>
                      <Badge variant="secondary" className="text-xs">Pago</Badge>
                    </div>
                  </Label>
                  <div className="flex gap-2">
                    <Input id="openai-key" type="password" placeholder="sk-..." className="flex-1" />
                    <Button variant="outline" className="shrink-0">Salvar</Button>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Obtenha sua chave em <a href="https://platform.openai.com/api-keys" className="text-blue-600 hover:underline" target="_blank">platform.openai.com</a>
                  </p>
                </div>
                
                {/* ElevenLabs */}
                <div className="space-y-2">
                  <Label htmlFor="elevenlabs-key">
                    <div className="flex items-center gap-2">
                      <span>ElevenLabs API Key</span>
                      <Badge variant="secondary" className="text-xs">Pago</Badge>
                    </div>
                  </Label>
                  <div className="flex gap-2">
                    <Input id="elevenlabs-key" type="password" placeholder="..." className="flex-1" />
                    <Button variant="outline" className="shrink-0">Salvar</Button>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Obtenha sua chave em <a href="https://elevenlabs.io/app/account" className="text-blue-600 hover:underline" target="_blank">elevenlabs.io</a>. ~10.000 caracteres/mês grátis.
                  </p>
                </div>
                
                {/* Pexels */}
                <div className="space-y-2">
                  <Label htmlFor="pexels-key">
                    <div className="flex items-center gap-2">
                      <span>Pexels API Key</span>
                      <Badge variant="secondary" className="text-xs">Pago</Badge>
                    </div>
                  </Label>
                  <div className="flex gap-2">
                    <Input id="pexels-key" type="password" placeholder="..." className="flex-1" />
                    <Button variant="outline" className="shrink-0">Salvar</Button>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Obtenha sua chave em <a href="https://www.pexels.com/api/new/" className="text-blue-600 hover:underline" target="_blank">pexels.com</a>. 200 requisições/hora grátis.
                  </p>
                </div>
                
                <div className="border-t pt-6">
                  <h3 className="text-lg font-medium mb-4">APIs Alternativas Gratuitas</h3>
                  
                  {/* HuggingFace */}
                  <div className="space-y-2 mb-4">
                    <Label htmlFor="huggingface-key">
                      <div className="flex items-center gap-2">
                        <span>HuggingFace API Key</span>
                        <Badge variant="success" className="text-xs bg-green-100 text-green-800">Gratuito</Badge>
                      </div>
                    </Label>
                    <div className="flex gap-2">
                      <Input id="huggingface-key" type="password" placeholder="hf_..." className="flex-1" />
                      <Button variant="outline" className="shrink-0">Salvar</Button>
                    </div>
                    <p className="text-xs text-muted-foreground">
                      Obtenha sua chave em <a href="https://huggingface.co/settings/tokens" className="text-blue-600 hover:underline" target="_blank">huggingface.co</a>
                    </p>
                  </div>
                  
                  {/* Pixabay */}
                  <div className="space-y-2 mb-4">
                    <Label htmlFor="pixabay-key">
                      <div className="flex items-center gap-2">
                        <span>Pixabay API Key</span>
                        <Badge variant="success" className="text-xs bg-green-100 text-green-800">Gratuito</Badge>
                      </div>
                    </Label>
                    <div className="flex gap-2">
                      <Input id="pixabay-key" type="password" placeholder="..." className="flex-1" />
                      <Button variant="outline" className="shrink-0">Salvar</Button>
                    </div>
                    <p className="text-xs text-muted-foreground">
                      Obtenha sua chave em <a href="https://pixabay.com/api/docs/" className="text-blue-600 hover:underline" target="_blank">pixabay.com</a>. 5.000 requisições/hora grátis.
                    </p>
                  </div>
                  
                  {/* Unsplash */}
                  <div className="space-y-2">
                    <Label htmlFor="unsplash-key">
                      <div className="flex items-center gap-2">
                        <span>Unsplash API Key</span>
                        <Badge variant="success" className="text-xs bg-green-100 text-green-800">Gratuito</Badge>
                      </div>
                    </Label>
                    <div className="flex gap-2">
                      <Input id="unsplash-key" type="password" placeholder="..." className="flex-1" />
                      <Button variant="outline" className="shrink-0">Salvar</Button>
                    </div>
                    <p className="text-xs text-muted-foreground">
                      Obtenha sua chave em <a href="https://unsplash.com/developers" className="text-blue-600 hover:underline" target="_blank">unsplash.com</a>. 50 requisições/hora grátis.
                    </p>
                  </div>
                </div>
                
                <div className="border-t pt-6">
                  <Button variant="outline" className="w-full flex items-center gap-2">
                    <PlusCircle className="h-4 w-4" />
                    <span>Adicionar outra chave de API</span>
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="preferences" className="space-y-6">
            <Card>
              <CardHeader className="pb-3">
                <CardTitle>Preferências Gerais</CardTitle>
                <CardDescription>
                  Personalize sua experiência com o gerador de vídeos
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="default-voice">Voz Padrão</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione uma voz padrão" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="feminino-profissional">Feminino Profissional</SelectItem>
                      <SelectItem value="masculino-profissional">Masculino Profissional</SelectItem>
                      <SelectItem value="feminino-jovem">Feminino Jovem</SelectItem>
                      <SelectItem value="masculino-jovem">Masculino Jovem</SelectItem>
                      <SelectItem value="neutro">Neutro</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="default-transition">Transição Padrão</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione uma transição padrão" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="dissolve">Dissolve</SelectItem>
                      <SelectItem value="fade">Fade</SelectItem>
                      <SelectItem value="zoom">Zoom</SelectItem>
                      <SelectItem value="slide">Slide</SelectItem>
                      <SelectItem value="wipe">Wipe</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="default-format">Formato de Vídeo Padrão</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione um formato padrão" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="mp4_horizontal">Horizontal (16:9)</SelectItem>
                      <SelectItem value="mp4_vertical">Vertical (9:16)</SelectItem>
                      <SelectItem value="mp4_square">Quadrado (1:1)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="border-t pt-6">
                  <Button className="w-full">Salvar Preferências</Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </Container>
  );
}

import { Badge } from '@/components/ui/badge';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
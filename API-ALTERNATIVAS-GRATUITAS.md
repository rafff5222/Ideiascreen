# Guia de Alternativas Gratuitas às APIs Pagas

Este documento explica como utilizar alternativas gratuitas às APIs pagas em nossa aplicação de geração de conteúdo, permitindo economizar custos e manter todas as funcionalidades mesmo quando as APIs pagas atingirem seus limites.

## Visão Geral

Nossa aplicação pode utilizar diferentes serviços para cada funcionalidade principal:

| Funcionalidade | Serviço Pago | Alternativa Gratuita | Configuração |
|----------------|--------------|----------------------|--------------|
| Geração de Texto | OpenAI | HuggingFace ou Ollama (local) | `AI_SERVICE_PROVIDER=huggingface` |
| Geração de Voz | ElevenLabs | Microsoft Edge TTS (100% grátis) | `VOICE_SERVICE_PROVIDER=edge-tts` |
| Busca de Imagens | Pexels | Pixabay ou Unsplash | `IMAGE_SERVICE_PROVIDER=pixabay` |

## Como Configurar

1. Copie o arquivo `.env.example` para `.env` e configure as preferências:

```bash
# Configurações de Serviços
# Use 'openai', 'huggingface', ou 'ollama'
AI_SERVICE_PROVIDER=huggingface          
# Use 'elevenlabs' ou 'edge-tts'
VOICE_SERVICE_PROVIDER=edge-tts   
# Use 'pexels', 'pixabay', ou 'unsplash'
IMAGE_SERVICE_PROVIDER=pixabay
```

2. Instale as ferramentas necessárias para alternativas gratuitas:

```bash
# Instalar Edge TTS (alternativa gratuita ao ElevenLabs)
npm install -g edge-tts

# Instalar Ollama (alternativa local gratuita ao OpenAI)
# Visite: https://ollama.com/download
```

Também oferecemos um script de instalação automatizada:

```bash
# Executar o script de instalação de ferramentas gratuitas
npx tsx server/install-free-tools.ts
```

## Alternativas por Serviço

### 1. Geração de Texto (Alternativas ao OpenAI)

#### Opção A: HuggingFace (API Gratuita com Limite Generoso)

1. Crie uma conta em [huggingface.co](https://huggingface.co)
2. Obtenha sua chave API em [huggingface.co/settings/tokens](https://huggingface.co/settings/tokens)
3. Configure em seu `.env`:

```
HUGGINGFACE_API_KEY=sua_chave_aqui
AI_SERVICE_PROVIDER=huggingface
```

#### Opção B: Ollama (100% Local e Gratuito)

1. Instale o Ollama do [site oficial](https://ollama.com)
2. Execute `ollama run llama2` para baixar um modelo inicial
3. Configure em seu `.env`:

```
AI_SERVICE_PROVIDER=ollama
```

### 2. Geração de Voz (Alternativa ao ElevenLabs)

Microsoft Edge TTS oferece vozes de alta qualidade em português brasileiro totalmente gratuitas:

1. Instale o Edge TTS: `npm install -g edge-tts`
2. Configure em seu `.env`:

```
VOICE_SERVICE_PROVIDER=edge-tts
```

Vozes disponíveis:
- `pt-BR-FranciscaNeural` (Feminino Profissional)
- `pt-BR-AntonioNeural` (Masculino Profissional)
- `pt-BR-GiovannaNeural` (Feminino Jovem)
- `pt-BR-BrendanNeural` (Masculino Jovem)
- `pt-BR-JulioNeural` (Neutro)

### 3. Busca de Imagens (Alternativas ao Pexels)

#### Opção A: Pixabay (5.000 requisições/hora gratuitamente)

1. Crie uma conta em [pixabay.com](https://pixabay.com/api/docs/)
2. Obtenha sua chave API na sua conta
3. Configure em seu `.env`:

```
PIXABAY_API_KEY=sua_chave_aqui
IMAGE_SERVICE_PROVIDER=pixabay
```

#### Opção B: Unsplash (50 requisições/hora gratuitamente)

1. Crie uma conta em [unsplash.com/developers](https://unsplash.com/developers)
2. Crie um aplicativo para obter sua chave API
3. Configure em seu `.env`:

```
UNSPLASH_API_KEY=sua_chave_aqui
IMAGE_SERVICE_PROVIDER=unsplash
```

## Modo de Fallback Automático

Nossa aplicação é projetada com um sistema de fallback inteligente que tentará automaticamente usar alternativas quando um serviço falhar:

1. Se ElevenLabs falhar, tentará Edge TTS
2. Se Edge TTS falhar, tentará OpenAI TTS
3. Se OpenAI falhar, tentará HuggingFace
4. Se HuggingFace falhar, tentará Ollama local
5. Se todos falharem, usará o modo de demonstração local

## Verificação de Status dos Serviços

Você pode verificar o status de todos os serviços acessando:

```
http://localhost:5000/api/check-all-services
```

Esta rota retornará o status de todos os serviços, tanto pagos quanto gratuitos, e fornecerá recomendações sobre como configurar suas alternativas gratuitas.

## Solução de Problemas

### Edge TTS não está funcionando

Verifique se o Edge TTS está instalado corretamente:

```bash
edge-tts --version
```

Se não estiver instalado, instale com:

```bash
npm install -g edge-tts
```

### Ollama não está disponível

Certifique-se de que o Ollama está instalado e em execução:

```bash
ollama list
```

Se não estiver instalado, baixe do [site oficial](https://ollama.com/download).

### Erro nas APIs de imagem

Verifique se suas chaves de API estão configuradas corretamente no arquivo `.env`. Para testar:

```bash
# Teste Pixabay
curl "https://pixabay.com/api/?key=YOUR_API_KEY&q=nature&per_page=1"

# Teste Unsplash
curl -H "Authorization: Client-ID YOUR_API_KEY" https://api.unsplash.com/photos/random
```
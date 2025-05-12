# Sistema de Geração de Roteiros com IA

## Visão Geral

Este sistema permite a geração de roteiros profissionais para diversos formatos de conteúdo (vídeos, podcasts, histórias) usando Inteligência Artificial. A plataforma foi desenvolvida com foco em:

- **Confiabilidade**: Sistema de fallback em múltiplas camadas
- **Performance**: Geração rápida de conteúdo
- **Acessibilidade**: Alternativas gratuitas às APIs pagas

## Características Principais

- Geração de roteiros personalizados para diferentes formatos
- Detecção automática do tipo de conteúdo (YouTube, podcast, storytelling)
- Sistema de fallback em cascata para garantir a disponibilidade
- Interface intuitiva e responsiva
- Estrutura de roteiros profissionais

## Tecnologias

- **Frontend**: React com TypeScript
- **Backend**: Node.js com Express
- **IA**: HuggingFace (principal) com sistema de fallback interno
- **Comunicação em tempo real**: WebSockets

## Arquitetura do Sistema

### Geração de Roteiros

O sistema de geração de roteiros segue uma arquitetura em cascata:

1. **Nível 1**: Modelos avançados via HuggingFace
   - Zephyr 7B (principal)
   - OPT 1.3B (secundário)
   - GPT-2 (terciário)
   - DistilGPT-2 (quaternário)

2. **Nível 2**: Gerador de fallback interno
   - Modelos de roteiros específicos por tipo de conteúdo
   - Sistema independente de APIs externas

### Detecção de Tipo de Conteúdo

O sistema detecta automaticamente o tipo de conteúdo para gerar roteiros apropriados:

- **Vídeos para YouTube**: Otimizados para engajamento com hooks e segmentação clara
- **Episódios de Podcast**: Estruturados para conversação fluida
- **Tutoriais**: Formato passo-a-passo com explicações claras
- **Storytelling**: Narrativas com estrutura dramática

## Instalação e Configuração

### Requisitos

- Node.js 18 ou superior
- Conta no HuggingFace (gratuita)

### Configuração das Chaves API

1. Crie uma conta no [HuggingFace](https://huggingface.co/)
2. Obtenha uma chave API em [https://huggingface.co/settings/tokens](https://huggingface.co/settings/tokens)
3. Configure a chave no arquivo `.env`:

```
USE_HUGGINGFACE=true
HUGGINGFACE_API_KEY=sua_chave_aqui
```

### Instalação

```bash
# Instalar dependências
npm install

# Iniciar o servidor de desenvolvimento
npm run dev
```

## Uso

### Geração de Roteiros

**Endpoint**: `POST /api/generate-script`

**Corpo da requisição**:
```json
{
  "prompt": "Um roteiro para vídeo do YouTube sobre inteligência artificial"
}
```

**Resposta**:
```json
{
  "script": "TÍTULO DO VÍDEO: \"INTELIGÊNCIA ARTIFICIAL | Tudo o que você precisa saber\"...",
  "metadata": {
    "modelUsed": "HuggingFaceH4/zephyr-7b-beta",
    "generatedAt": "2025-05-12T22:28:18.314Z",
    "promptTokens": 59,
    "outputTokens": 1500
  }
}
```

### Fallback Manual

**Endpoint**: `POST /api/generate-script/fallback`

Use este endpoint para acessar diretamente o gerador de roteiros interno, sem tentar as APIs externas.

## Extensões Futuras

- Sistema de feedback e melhoria contínua
- Mais formatos especializados (roteiros para redes sociais específicas)
- Geração de elementos visuais complementares
- Sistema de templates personalizáveis
# Alternativas Gratuitas às APIs Pagas

Este documento descreve as alternativas gratuitas implementadas neste projeto para substituir serviços pagos como OpenAI.

## Hugging Face em vez de OpenAI

### Por que Hugging Face?

O Hugging Face oferece uma plataforma aberta com acesso a milhares de modelos de IA pré-treinados, muitos deles gratuitos para uso. Embora existam limites de uso, a plataforma permite:

- Acesso a modelos SOTA (State-of-the-Art) sem custo inicial
- Comunidade ativa e constante atualização de modelos
- Flexibilidade para escolher modelos baseados em necessidades específicas

### Modelos Implementados

Implementamos uma cascata de modelos, do mais avançado ao mais simples, para garantir que sempre haja uma opção disponível:

1. **HuggingFaceH4/zephyr-7b-beta**
   - Modelo avançado similar ao GPT em qualidade
   - Excelente para geração de texto criativo e estruturado
   - Requer mais créditos da API

2. **facebook/opt-1.3b**
   - Modelo de tamanho médio com boa qualidade
   - Balanceamento entre performance e consumo de recursos
   - Bom para textos mais curtos

3. **gpt2**
   - Modelo clássico e confiável
   - Menor consumo de recursos
   - Qualidade suficiente para muitos casos de uso

4. **distilgpt2**
   - Versão compacta do GPT-2
   - Mínimo consumo de recursos
   - Útil como último recurso

### Implementação de Fallback

Nosso sistema tenta cada modelo em sequência até encontrar um que funcione. Se todos falharem (por exemplo, por limite de créditos), ativamos nosso sistema de fallback interno.

## Sistema de Fallback Interno

Implementamos um sistema totalmente independente que funciona sem necessidade de APIs externas:

### Características

- Templates específicos por tipo de conteúdo
- Personalização baseada em palavras-chave do prompt
- Estrutura profissional para diferentes formatos (YouTube, Podcast, Tutorial, etc.)
- Zero dependência externa

### Vantagens

- Disponibilidade garantida mesmo sem conexão ou créditos
- Tempo de resposta consistente
- Independência de provedores externos

## Configuração Recomendada

Para maximizar o uso gratuito do Hugging Face:

1. **Conta Gratuita**: Crie uma conta em [huggingface.co](https://huggingface.co/)
2. **Token API**: Gere um token de API com permissões de leitura
3. **Distribuição de Uso**: Use o token em horários diferentes para evitar atingir limites
4. **Monitoramento**: Acompanhe o uso pela dashboard do Hugging Face

## Limitações Conhecidas

- Os modelos gratuitos do Hugging Face têm cotas mensais limitadas
- Possíveis atrasos durante horários de pico
- Qualidade variável entre os diferentes modelos

## Teste de Integração

Para testar a integração Hugging Face:

```bash
curl -X POST http://localhost:5000/api/generate-script -H "Content-Type: application/json" -d '{"prompt": "Um roteiro curto sobre inteligência artificial"}'
```

Para testar o sistema de fallback interno:

```bash
curl -X POST http://localhost:5000/api/generate-script/fallback -H "Content-Type: application/json" -d '{"prompt": "Um roteiro curto sobre inteligência artificial"}'
```
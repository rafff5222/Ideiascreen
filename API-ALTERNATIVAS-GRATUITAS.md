# Alternativas Gratuitas para APIs

Este documento explica as alternativas gratuitas implementadas no sistema para reduzir a dependência de serviços pagos como OpenAI, ElevenLabs e Pexels.

## Serviços de Texto/IA (Alternativas para OpenAI)

### HuggingFace (Gratuito)
- **Benefícios:** API 100% gratuita, diversos modelos disponíveis
- **Limitações:** Modelos podem ser um pouco menos potentes que GPT-4
- **Implementação:** Arquivo `server/huggingface-service.ts`
- **Como usar:** Desative a opção "Usar OpenAI" nas configurações

### Ollama (Gratuito, Local)
- **Benefícios:** Completamente gratuito, execução local (sem custo por token)
- **Limitações:** Requer instalação local, consome recursos do sistema
- **Implementação:** Em desenvolvimento

## Serviços de Voz/TTS (Alternativas para ElevenLabs)

### Microsoft Edge TTS (Gratuito)
- **Benefícios:** 100% gratuito, sem limites de uso, qualidade muito boa
- **Limitações:** Vozes menos naturais que ElevenLabs
- **Implementação:** Arquivo `server/edge-tts-service.ts`
- **Como usar:** Desative a opção "Usar ElevenLabs" nas configurações

### Vozes disponíveis no Edge TTS:
- Feminino Profissional (pt-BR-FranciscaNeural)
- Masculino Profissional (pt-BR-AntonioNeural)
- Feminino Jovem (pt-BR-GiovannaNeural)
- Masculino Jovem (pt-BR-BrendanNeural)
- Neutro (pt-BR-JulioNeural)

## Serviços de Imagens (Alternativas para Pexels)

### Pixabay (Gratuito)
- **Benefícios:** API gratuita com limite de 5.000 requisições por hora/dia
- **Limitações:** Algumas imagens podem ser menos profissionais
- **Implementação:** Arquivo `server/free-image-service.ts`
- **Como usar:** Desative a opção "Usar Pexels" nas configurações

### Unsplash (Gratuito)
- **Benefícios:** API gratuita com imagens de alta qualidade
- **Limitações:** Limite de 50 requisições por hora
- **Implementação:** Arquivo `server/free-image-service.ts` (fallback automático do Pixabay)
- **Como usar:** É usado automaticamente como fallback se o Pixabay falhar

## Sistema de Fallback Automático

O sistema implementa um mecanismo de fallback automático que funciona da seguinte forma:

1. Tenta usar o serviço pago se estiver configurado nas preferências do usuário
2. Se falhar ou não estiver disponível, tenta a primeira alternativa gratuita
3. Se essa também falhar, tenta a próxima alternativa disponível
4. Em último caso, usa um modo de demonstração para garantir que o usuário sempre tenha uma experiência funcional

## Monitoramento de Serviços

O sistema inclui um endpoint `/api/check-all-services` que verifica o status de todos os serviços, tanto pagos quanto gratuitos. Isso é útil para:

1. Mostrar ao usuário quais serviços estão disponíveis
2. Tomar decisões automatizadas sobre qual serviço usar
3. Oferecer transparência sobre o que está sendo utilizado

## Como Contribuir com Mais Alternativas

Se você conhece outras alternativas gratuitas que podem ser implementadas, sinta-se à vontade para sugerir. O sistema foi projetado para ser extensível, permitindo a adição de novos serviços com facilidade.
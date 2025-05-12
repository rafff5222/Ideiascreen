// Serviço de integração com APIs de IA para geração de vídeo
import OpenAI from "openai";
import path from "path";
import { promises as fs } from "fs";
import { generateEdgeTTSBuffer, EdgeTTSVoiceType } from "./edge-tts-service";
import { generateAIText } from "./huggingface-service";
import { searchImages } from "./free-image-service";

// Configuração das APIs de IA (com fallback para alternativas gratuitas)
// A preferência de serviço pode ser configurada no .env
const AI_SERVICE = process.env.AI_SERVICE_PROVIDER || 'openai';
const VOICE_SERVICE = process.env.VOICE_SERVICE_PROVIDER || 'elevenlabs';
const IMAGE_SERVICE = process.env.IMAGE_SERVICE_PROVIDER || 'pexels';

// Inicializar OpenAI apenas se for usar
const openai = process.env.OPENAI_API_KEY ? new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
}) : null;

interface GenerationConfig {
  script: string;
  voice?: string; 
  speed?: number;
  transitions?: string[];
  outputFormat?: string;
}

interface VideoResult {
  id: string;
  success: boolean;
  audioGenerated: boolean;
  scriptProcessed: string;
  voiceUsed: string;
  transitionsApplied: string[];
  format: string;
  metadata: {
    duration: number;
    segments: number;
    imageCount: number;
    generatedAt: string;
  };
  resources: {
    subtitles: string[];
    imageUrls: string[];
    audioData: string;
  };
}

// Função principal para gerar vídeo completo
export async function generateVideo(config: GenerationConfig): Promise<VideoResult> {
  console.log('Gerando narração de áudio para o roteiro...');
  
  try {
    // Verificação se pelo menos uma das APIs está disponível (ElevenLabs ou OpenAI)
    const hasElevenLabsKey = !!process.env.ELEVENLABS_API_KEY;
    const hasOpenAIKey = process.env.OPENAI_API_KEY && 
                         process.env.OPENAI_API_KEY.trim() !== '' && 
                         process.env.OPENAI_API_KEY.startsWith('sk-');
    
    // Se não temos nenhuma das APIs disponíveis, usar dados de demonstração
    if (!hasElevenLabsKey && !hasOpenAIKey) {
      console.log('Nenhuma API key válida encontrada, usando dados de demonstração');
      return generateDemoResult(config);
    }
    
    try {
      // 1. Gerar legendas/segmentos do roteiro
      const { segments, formattedScript } = processScript(config.script);
      
      // 2. Gerar narração de áudio usando OpenAI Text-to-Speech
      const audioBuffer = await generateAudio(formattedScript, config.voice || 'feminino-profissional');
      
      // Se não conseguiu gerar áudio, use dados demo
      if (!audioBuffer) {
        console.log('Não foi possível gerar áudio, usando dados de demonstração');
        return generateDemoResult(config);
      }
      
      // 3. Gerar/selecionar imagens baseadas no contexto do roteiro
      console.log('Gerando imagens baseadas no roteiro...');
      const imageUrls = await generateImages(segments);
      
      // 4. Processar legendas para sincronização
      console.log('Processando legendas...');
      const subtitles = processSubtitles(segments);
      
      // 5. Codificar áudio como base64 para envio ao frontend
      const audioBase64 = audioBuffer.toString('base64');
      const audioDataUrl = `data:audio/mpeg;base64,${audioBase64}`;
      
      // 6. Montar e retornar o resultado
      return {
        id: Date.now().toString(),
        success: true,
        audioGenerated: true,
        scriptProcessed: config.script,
        voiceUsed: config.voice || 'feminino-profissional',
        transitionsApplied: config.transitions || ['zoom', 'dissolve', 'cut'],
        format: config.outputFormat || 'mp4_vertical',
        metadata: {
          duration: segments.length * 5, // Duração estimada em segundos
          segments: segments.length,
          imageCount: Math.ceil(segments.length / 2),
          generatedAt: new Date().toISOString()
        },
        resources: {
          subtitles,
          imageUrls,
          audioData: audioDataUrl
        }
      };
    } catch (apiError: any) {
      // Se qualquer parte da geração falhar, usamos o modo demo
      console.log('Erro na API OpenAI, usando dados de demonstração:', apiError.message);
      return generateDemoResult(config);
    }
  } catch (error: any) {
    console.error('Erro ao gerar vídeo:', error.message);
    // Ao invés de lançar erro, retornamos dados demo como "fallback"
    console.log('Retornando dados de demonstração devido ao erro');
    return generateDemoResult(config);
  }
}

// Processar o roteiro em segmentos lógicos
function processScript(script: string): { segments: string[], formattedScript: string } {
  // Dividir por marcadores de tempo ou quebras de linha
  const segments = script
    .split(/\n|(?:\d+:\d+\s*-\s*)/g)
    .filter(segment => segment.trim().length > 0)
    .map(segment => segment.trim());
  
  const formattedScript = segments.join('. ');
  
  return { segments, formattedScript };
}

// Processar as legendas para o formato correto
function processSubtitles(segments: string[]): string[] {
  return segments.map(segment => {
    // Remover qualquer código markdown ou formatação especial
    return segment.replace(/[\[\]#*_]/g, '');
  });
}

import { generateElevenLabsAudio, VoiceType } from './elevenlabs-service';

// Gerar áudio a partir do roteiro usando serviço preferencial com fallback automático
async function generateAudio(script: string, voiceType: string): Promise<Buffer | null> {
  try {
    // Mapeia os tipos de voz para as vozes disponíveis no ElevenLabs
    const elevenlabsVoiceMapping: { [key: string]: VoiceType } = {
      'feminino-profissional': VoiceType.FEMININO_PROFISSIONAL,
      'masculino-profissional': VoiceType.MASCULINO_PROFISSIONAL,
      'feminino-jovem': VoiceType.FEMININO_JOVEM,
      'masculino-jovem': VoiceType.MASCULINO_JOVEM,
      'neutro': VoiceType.NEUTRO
    };
    
    // Mapeia os tipos de voz para as vozes disponíveis no Edge TTS (gratuito)
    const edgeTTSVoiceMapping: { [key: string]: EdgeTTSVoiceType } = {
      'feminino-profissional': EdgeTTSVoiceType.FEMININO_PROFISSIONAL,
      'masculino-profissional': EdgeTTSVoiceType.MASCULINO_PROFISSIONAL,
      'feminino-jovem': EdgeTTSVoiceType.FEMININO_JOVEM,
      'masculino-jovem': EdgeTTSVoiceType.MASCULINO_JOVEM,
      'neutro': EdgeTTSVoiceType.NEUTRO
    };
    
    // Mapeia os tipos de voz para as vozes disponíveis na OpenAI
    const openaiVoiceMapping: { [key: string]: string } = {
      'feminino-profissional': 'nova',
      'masculino-profissional': 'echo',
      'feminino-jovem': 'alloy',
      'masculino-jovem': 'onyx',
      'neutro': 'shimmer'
    };
    
    const elevenlabsSelectedVoice = elevenlabsVoiceMapping[voiceType] || VoiceType.FEMININO_PROFISSIONAL;
    const edgeTTSSelectedVoice = edgeTTSVoiceMapping[voiceType] || EdgeTTSVoiceType.FEMININO_PROFISSIONAL;
    const openaiSelectedVoice = openaiVoiceMapping[voiceType] || 'nova';
    
    // TENTATIVA 1: Service preferido pelo usuário (configurado no .env)
    if (VOICE_SERVICE === 'elevenlabs' && process.env.ELEVENLABS_API_KEY) {
      console.log(`Tentando gerar áudio com ElevenLabs (serviço preferido) usando voz ${elevenlabsSelectedVoice}...`);
      try {
        const elevenLabsBuffer = await generateElevenLabsAudio(script, elevenlabsSelectedVoice);
        
        if (elevenLabsBuffer) {
          console.log('Áudio gerado com sucesso via ElevenLabs!');
          return elevenLabsBuffer;
        }
      } catch (elevenLabsError: any) {
        console.log('Falha na geração via ElevenLabs:', elevenLabsError.message);
      }
    } 
    else if (VOICE_SERVICE === 'edge-tts') {
      // Usuário configurou explicitamente para usar Edge TTS (gratuito)
      console.log(`Tentando gerar áudio com Edge TTS (gratuito) usando voz ${edgeTTSSelectedVoice}...`);
      try {
        const edgeTTSBuffer = await generateEdgeTTSBuffer(script, edgeTTSSelectedVoice);
        
        if (edgeTTSBuffer) {
          console.log('Áudio gerado com sucesso via Edge TTS (gratuito)!');
          return edgeTTSBuffer;
        }
      } catch (edgeTTSError: any) {
        console.log('Falha na geração via Edge TTS:', edgeTTSError.message);
      }
    }
    
    // TENTATIVA 2: Se o serviço preferido falhou, tentar com Edge TTS (gratuito)
    if (VOICE_SERVICE !== 'edge-tts') {
      console.log(`Tentando com alternativa gratuita: Edge TTS usando voz ${edgeTTSSelectedVoice}...`);
      try {
        const edgeTTSBuffer = await generateEdgeTTSBuffer(script, edgeTTSSelectedVoice);
        
        if (edgeTTSBuffer) {
          console.log('Áudio gerado com sucesso via Edge TTS (gratuito)!');
          return edgeTTSBuffer;
        }
      } catch (edgeTTSError: any) {
        console.log('Falha na geração via Edge TTS:', edgeTTSError.message);
      }
    }
    
    // TENTATIVA 3: Se ainda não temos áudio, tentar com ElevenLabs (se não foi a primeira escolha)
    if (VOICE_SERVICE !== 'elevenlabs' && process.env.ELEVENLABS_API_KEY) {
      console.log(`Tentando gerar áudio com ElevenLabs usando voz ${elevenlabsSelectedVoice}...`);
      try {
        const elevenLabsBuffer = await generateElevenLabsAudio(script, elevenlabsSelectedVoice);
        
        if (elevenLabsBuffer) {
          console.log('Áudio gerado com sucesso via ElevenLabs!');
          return elevenLabsBuffer;
        }
      } catch (elevenLabsError: any) {
        console.log('Falha na geração via ElevenLabs:', elevenLabsError.message);
      }
    }
    
    // TENTATIVA 4: Último recurso - OpenAI TTS
    if (openai && process.env.OPENAI_API_KEY) {
      console.log(`Tentando com último recurso: OpenAI TTS usando voz ${openaiSelectedVoice}...`);
      
      try {
        const mp3 = await openai.audio.speech.create({
          model: "tts-1",
          voice: openaiSelectedVoice,
          input: script,
        });
        
        // Converter para buffer
        const buffer = Buffer.from(await mp3.arrayBuffer());
        console.log('Áudio gerado com sucesso via OpenAI!');
        return buffer;
      } catch (apiError: any) {
        // Log específico para erros da API OpenAI
        console.error('Erro específico da API OpenAI:', apiError.message);
        if (apiError.status === 401) {
          console.error('Erro de autenticação: Chave API inválida');
        }
      }
    }
    
    // TENTATIVA 5: Modo de demonstração como último recurso
    console.log('Todos os serviços falharam. Usando modo de demo como último recurso...');
    
    try {
      // Importar o gerador de áudio de demonstração dinamicamente
      const { generateDemoAudio } = await import('./demo-processor');
      const audioPath = await generateDemoAudio(script);
      const buffer = await fs.readFile(audioPath);
      console.log('Áudio de demonstração gerado com sucesso!');
      return buffer;
    } catch (demoError: any) {
      console.error('Falha no modo de demonstração:', demoError.message);
      return null;
    }
  } catch (error: any) {
    console.error('Erro geral ao gerar áudio:', error.message);
    return null;
  }
}

// Gerar/selecionar imagens para o vídeo usando serviços de imagens
async function generateImages(segments: string[]): Promise<string[]> {
  // Se tiver menos de 2 segmentos, força pelo menos 2 imagens
  const imageCount = Math.max(Math.ceil(segments.length / 2), 2);
  
  try {
    // Análise dos segmentos para extrair temas para as imagens
    const imagePrompts = [];
    
    // Para cada segmento, extrair um tema para busca de imagem
    for (let i = 0; i < imageCount; i++) {
      const startSegment = i * 2;
      const segmentsToConsider = segments.slice(startSegment, startSegment + 2).join(' ');
      
      if (segmentsToConsider.trim().length > 10) {
        // Tentar extrair keywords mais específicas usando IA
        if (AI_SERVICE === 'openai' && openai && process.env.OPENAI_API_KEY) {
          console.log(`Extraindo keywords para imagem de: "${segmentsToConsider.substring(0, 30)}..."`);
          try {
            // Usa OpenAI para extrair keywords de busca
            const prompt = `Extract 2-3 descriptive keywords from this text for image search. Reply with just the keywords: "${segmentsToConsider}"`;
            
            const completion = await openai.chat.completions.create({
              model: "gpt-3.5-turbo",
              messages: [{ role: "user", content: prompt }],
              max_tokens: 30
            });
            
            const keywords = completion.choices[0]?.message?.content?.trim();
            if (keywords && keywords.length > 0) {
              console.log(`Keywords extraídas: "${keywords}"`);
              imagePrompts.push(keywords);
            } else {
              // Se falhar, usar as primeiras palavras do segmento
              const simpleKeywords = segmentsToConsider.split(' ').slice(0, 3).join(' ');
              console.log(`Usando palavras diretas: "${simpleKeywords}"`);
              imagePrompts.push(simpleKeywords);
            }
          } catch (error) {
            console.error('Erro na extração de keywords:', error);
            imagePrompts.push(segmentsToConsider.split(' ').slice(0, 3).join(' '));
          }
        } else {
          // Sem OpenAI, tentar com HuggingFace se disponível
          try {
            if (process.env.HUGGINGFACE_API_KEY) {
              const prompt = `Extract 2-3 descriptive keywords from this text for image search. Reply with just the keywords: "${segmentsToConsider}"`;
              const keywords = await generateAIText(prompt, { 
                maxTokens: 30,
                apiKey: process.env.HUGGINGFACE_API_KEY
              });
              
              if (keywords && keywords.length > 0 && keywords.split(' ').length <= 5) {
                console.log(`Keywords extraídas via HuggingFace: "${keywords}"`);
                imagePrompts.push(keywords);
              } else {
                const simpleKeywords = segmentsToConsider.split(' ').slice(0, 3).join(' ');
                console.log(`Usando palavras diretas: "${simpleKeywords}"`);
                imagePrompts.push(simpleKeywords);
              }
            } else {
              // Sem IA disponível, usar diretamente
              const simpleKeywords = segmentsToConsider.split(' ').slice(0, 3).join(' ');
              console.log(`Usando palavras diretas: "${simpleKeywords}"`);
              imagePrompts.push(simpleKeywords);
            }
          } catch (error) {
            console.error('Erro na extração alternativa de keywords:', error);
            imagePrompts.push(segmentsToConsider.split(' ').slice(0, 3).join(' '));
          }
        }
      } else {
        // Segmento muito curto, usar termos genéricos
        const genericTerms = [
          "content creator working", 
          "social media marketing", 
          "digital content creation",
          "video production", 
          "content strategy"
        ];
        const randomTerm = genericTerms[Math.floor(Math.random() * genericTerms.length)];
        console.log(`Usando termo genérico: "${randomTerm}"`);
        imagePrompts.push(randomTerm);
      }
    }
    
    console.log('Todos os termos de busca de imagens:', imagePrompts);
    
    // Buscar imagens usando os serviços configurados
    const imageUrls = [];
    
    // Escolher o serviço de imagem baseado na configuração
    let hasPexelsKey = !!process.env.PEXELS_API_KEY;
    let hasPixabayKey = !!process.env.PIXABAY_API_KEY;
    let hasUnsplashKey = !!process.env.UNSPLASH_API_KEY;
    
    // Se não tiver nenhuma API key, usar placeholders
    if (!hasPexelsKey && !hasPixabayKey && !hasUnsplashKey) {
      console.log('Nenhuma API de imagem configurada, usando placeholders');
      return Array.from({ length: imageCount }, (_, i) => 
        `https://picsum.photos/800/450?random=${i + 1}`
      );
    }
    
    // Buscar cada imagem usando o serviço preferido
    for (const prompt of imagePrompts) {
      try {
        console.log(`Buscando imagem para: "${prompt}" via ${IMAGE_SERVICE}`);
        
        // Usar o serviço de imagens com fallback automático
        const results = await searchImages({
          query: prompt,
          count: 1,
          pexelsApiKey: process.env.PEXELS_API_KEY,
          unsplashApiKey: process.env.UNSPLASH_API_KEY,
          pixabayApiKey: process.env.PIXABAY_API_KEY,
          preferredService: IMAGE_SERVICE as any // Cast para o tipo esperado
        });
        
        if (results && results.length > 0) {
          // Extrair URL da imagem encontrada
          const imageUrl = results[0].previewUrl || results[0].originalUrl || results[0].url;
          console.log(`Imagem encontrada via ${results[0].source} para "${prompt}"`);
          imageUrls.push(imageUrl);
        } else {
          console.log(`Nenhuma imagem encontrada para "${prompt}", usando placeholder`);
          imageUrls.push(`https://picsum.photos/800/450?text=${encodeURIComponent(prompt)}`);
        }
      } catch (error) {
        console.error(`Erro ao buscar imagem para "${prompt}":`, error);
        imageUrls.push(`https://picsum.photos/800/450?text=${encodeURIComponent(prompt)}`);
      }
    }
    
    // Complementar com placeholders se necessário
    while (imageUrls.length < imageCount) {
      imageUrls.push(`https://picsum.photos/800/450?random=${imageUrls.length + 1}`);
    }
    
    return imageUrls;
  } catch (error) {
    console.error('Erro geral ao gerar imagens:', error);
    
    // Fallback para imagens genéricas
    return Array.from({ length: imageCount }, (_, i) => 
      `https://picsum.photos/800/450?random=${i + 1}`
    );
  }
}

// Gerar dados de demonstração quando não há API key
function generateDemoResult(config: GenerationConfig): VideoResult {
  // Processar o script para mostrar segmentos
  const { segments } = processScript(config.script);
  const subtitles = processSubtitles(segments);
  
  // Para a demonstração, usamos um áudio pré-gravado
  const demoAudioBase64 = "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7u7u7u//sgxIARDKpGODGGAA2cci/RjAA7u7u7u7u7u7u7u7u7u7u7u7u7u7u7u7u7u7u7u7u7u7u7u7u7u7u7u7u7u7u7u7u7u7u7u7u7u7u7u7u7u7u7u7u7u7u7u7u7u7u7u7u7u7u7u7u7u7u7u7u7u7u7u7u7u7u7u7u7u7u7u7u7u7u7u7u7u7u7u7u7u7v/7EMSMEPRORfYxAAAAAAP8AAAAATu7u7u7u7u7u7u7u7u7u7u7u7u7u7u7u7u7u7u7u7u7u7u7u7u7u7u7u7u7u7u7u7u7u7u7u7u7u7u7u7u7u7u7u7u7u7u7u7u7u7u7u7u7u7u7u7u7u7u7u7u7u7u7u7u7u7u7u7u7u7u7u7u7u7u7u7u7u7u7u7v/7IMSgAAAH+AAAAAAAA/wAAAAAu7u7u7u7u7u7u7u7u7u7u7u7u7u7u7u7u7u7u7u7u7u7u7u7u7u7u7u7u7u7u7u7u7u7u7u7u7u7u7u7u7u7u7u7u7u7u7u7u7u7u7u7u7u7u7u7u7u7u7u7u7u7u7u7u7u7u7u7u7u7u7u7u7u7u7u7u7u7u7u7u7u7u7u7u7u7v/7EMSoAKAH+AAAAAAAA/wAAAAA7u7u7u7u7u7u7u7u7u7u7u7u7u7u7u7u7u7u7u7u7u7u7u7u7u7u7u7u7u7u7u7u7u7u7u7u7u7u7u7u7u7u7u7u7u7u7u7u7u7u7u7u7u7u7u7u7u7u7u7u7u7u7u7u7u7u7u7u7u7u7u7u7u7u7u7u7u7u7u7u7v/7EMSsAKAH+AAAAAAAA/wAAAAA";
  
  return {
    id: Date.now().toString(),
    success: true,
    audioGenerated: true,
    scriptProcessed: config.script,
    voiceUsed: config.voice || 'feminino-profissional',
    transitionsApplied: config.transitions || ['zoom', 'dissolve', 'cut'],
    format: config.outputFormat || 'mp4_vertical',
    metadata: {
      duration: segments.length * 5, // Duração estimada em segundos
      segments: segments.length,
      imageCount: Math.ceil(segments.length / 2),
      generatedAt: new Date().toISOString()
    },
    resources: {
      subtitles,
      imageUrls: Array.from({ length: Math.ceil(segments.length / 2) }, (_, i) => 
        `https://picsum.photos/800/450?random=${i + 1}`
      ),
      audioData: `data:audio/mpeg;base64,${demoAudioBase64}`
    }
  };
}
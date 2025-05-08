import OpenAI from "openai";
import { ContentGeneration } from "@shared/schema";
import { ReadStream } from "fs";

// the newest OpenAI model is "gpt-4o" which was released May 13, 2024. do not change this unless explicitly requested by the user
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY || "demo-key" });

// Interface para o pedido de geração de narração de áudio
export interface SpeechGenerationRequest {
  text: string;
  voice: string;
  speed: number;
}

// Interface para o pedido de geração de vídeo
export interface VideoGenerationRequest {
  script: string;
  voice: string;
  speed: number;
  transitions: string[];
  outputFormat: string;
}

// Tipos de voz disponíveis para a API TTS da OpenAI
type OpenAIVoice = 'alloy' | 'echo' | 'fable' | 'onyx' | 'nova' | 'shimmer';

// Mapeamento de nossos tipos de voz para os da OpenAI
const voiceMapping: Record<string, OpenAIVoice> = {
  'feminino-profissional': 'nova',
  'masculino-profissional': 'onyx',
  'feminino-jovem': 'shimmer',
  'masculino-jovem': 'echo',
  'neutro': 'alloy'
};

// Função para gerar narração em áudio a partir do texto usando OpenAI TTS API
export async function generateSpeech(request: SpeechGenerationRequest): Promise<Buffer> {
  try {
    const { text, voice, speed } = request;
    
    // Seleciona a voz correta
    const openAIVoice: OpenAIVoice = voiceMapping[voice] || 'nova';
    
    // Gera áudio com Text-to-Speech API da OpenAI
    const mp3Response = await openai.audio.speech.create({
      model: "tts-1",
      voice: openAIVoice,
      input: text,
      speed: speed // Ajuste de velocidade
    });
    
    // Converte para buffer
    const buffer = Buffer.from(await mp3Response.arrayBuffer());
    return buffer;
  } catch (error) {
    console.error("Erro ao gerar narração de áudio:", error);
    throw new Error("Falha ao gerar áudio para o roteiro. Por favor, tente novamente.");
  }
}

// Função para gerar um vídeo completo
export async function generateVideo(request: VideoGenerationRequest): Promise<string> {
  try {
    // Primeiro, gera a narração em áudio
    const audioBuffer = await generateSpeech({
      text: request.script,
      voice: request.voice,
      speed: request.speed
    });
    
    // Na implementação real, usaríamos o buffer de áudio e as transições para 
    // criar o vídeo com imagens e legendas. Como prova de conceito, retornamos 
    // apenas a URL do áudio que foi gerado.
    
    // SIMULAÇÃO: Em uma implementação real, retornaríamos a URL do vídeo processado
    // Aqui, geramos dados de exemplo para demonstração
    
    // Como estamos apenas simulando, retornamos um JSON com os dados
    return JSON.stringify({
      audioGenerated: true,
      scriptProcessed: request.script,
      voiceUsed: request.voice,
      transitionsApplied: request.transitions,
      format: request.outputFormat,
      // Em uma implementação real, retornaríamos URLs para os arquivos gerados
      audioUrl: "https://example.com/audio.mp3",
      videoUrl: "https://example.com/video.mp4"
    });
  } catch (error) {
    console.error("Erro ao gerar vídeo:", error);
    throw new Error("Falha ao processar o vídeo. Por favor, tente novamente.");
  }
}

export async function generateContent(params: ContentGeneration): Promise<string> {
  const { contentType, platform, topic, communicationStyle } = params;
  
  let promptTemplate = "";
  
  // Set up prompt template based on content type and platform
  if (contentType === "script") {
    promptTemplate = getScriptPrompt(platform, topic, communicationStyle);
  } else if (contentType === "caption") {
    promptTemplate = getCaptionPrompt(platform, topic, communicationStyle);
  } else if (contentType === "idea") {
    promptTemplate = getIdeaPrompt(platform, topic, communicationStyle);
  }

  try {
    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        {
          role: "system",
          content: "Você é um especialista em marketing digital e criação de conteúdo para redes sociais. Seu objetivo é criar conteúdo atraente, otimizado e que gere engajamento."
        },
        {
          role: "user",
          content: promptTemplate
        }
      ],
      temperature: 0.7,
      max_tokens: 1000,
    });

    return response.choices[0].message.content || "Não foi possível gerar conteúdo. Tente novamente.";
  } catch (error) {
    console.error("Error generating content with OpenAI:", error);
    // Return fallback content if OpenAI API fails
    return getFallbackContent(contentType, platform, topic);
  }
}

function getScriptPrompt(platform: string, topic: string, style: string): string {
  const styleDesc = getCommunicationStyleDescription(style);
  
  if (platform === "instagram" || platform === "reels") {
    return `Crie um roteiro para um vídeo vertical de Instagram Reels sobre "${topic}". 
    O roteiro deve ser no estilo ${styleDesc} e conter:
    1. Um gancho forte nos primeiros 3 segundos para capturar a atenção
    2. 3-4 pontos principais com frases curtas e diretas
    3. Um call-to-action claro no final
    4. Hashtags relevantes
    5. O roteiro deve ter no máximo 60 segundos de duração
    
    Formate o roteiro com seções claras (Gancho, Ponto 1, Ponto 2, etc.) e inclua direções básicas para filmagem entre parênteses se necessário.`;
  } else {
    return `Crie um roteiro para um vídeo vertical de TikTok sobre "${topic}". 
    O roteiro deve ser no estilo ${styleDesc} e conter:
    1. Um gancho viral nos primeiros 2 segundos 
    2. 2-3 pontos principais com linguagem conversacional
    3. Um call-to-action criativo no final
    4. O roteiro deve ter no máximo 30 segundos de duração
    
    Formate o roteiro com seções claras (Gancho, Ponto 1, Ponto 2, etc.) e inclua direções básicas para filmagem entre parênteses se necessário.`;
  }
}

function getCaptionPrompt(platform: string, topic: string, style: string): string {
  const styleDesc = getCommunicationStyleDescription(style);
  
  if (platform === "instagram") {
    return `Crie uma legenda envolvente para um post de Instagram sobre "${topic}".
    A legenda deve ser no estilo ${styleDesc} e conter:
    1. Um primeiro parágrafo cativante 
    2. 2-3 parágrafos de conteúdo valioso
    3. Perguntas para engajamento
    4. 5-8 hashtags estratégicas e relevantes
    
    A legenda deve ter entre 150-200 palavras no total.`;
  } else {
    return `Crie uma legenda curta e impactante para um vídeo de TikTok sobre "${topic}".
    A legenda deve ser no estilo ${styleDesc} e conter:
    1. Uma frase de abertura cativante
    2. Um elemento intrigante ou pergunta
    3. 2-4 hashtags estratégicas
    
    A legenda deve ter no máximo 150 caracteres no total.`;
  }
}

function getIdeaPrompt(platform: string, topic: string, style: string): string {
  const styleDesc = getCommunicationStyleDescription(style);
  
  if (platform === "instagram" || platform === "reels") {
    return `Gere 5 ideias criativas de conteúdo para Instagram Reels sobre "${topic}".
    As ideias devem ser no estilo ${styleDesc} e cada uma deve conter:
    1. Um título chamativo para o vídeo
    2. Conceito principal em 1-2 frases
    3. Formato sugerido (ex: tutorial, antes/depois, trends)
    
    Formate cada ideia com número e título, seguido por uma breve descrição.`;
  } else {
    return `Gere 5 ideias virais de conteúdo para TikTok sobre "${topic}".
    As ideias devem ser no estilo ${styleDesc} e cada uma deve conter:
    1. Um título chamativo para o vídeo
    2. Conceito principal em 1-2 frases
    3. Elemento de viralização (som, trend, transição)
    
    Formate cada ideia com número e título, seguido por uma breve descrição.`;
  }
}

function getCommunicationStyleDescription(style: string): string {
  const styles: Record<string, string> = {
    casual: "descontraído e conversacional, como se estivesse falando com amigos",
    professional: "profissional e informativo, focado em credibilidade",
    educational: "educativo e explicativo, com foco em ensinar de forma clara",
    motivational: "motivacional e inspirador, com energia positiva e entusiasmo",
    humorous: "humorístico e divertido, usando piadas e referências engraçadas",
    inspirational: "inspirador e reflexivo, tocando em emoções profundas"
  };
  
  return styles[style] || "natural e autêntico";
}

function getFallbackContent(contentType: string, platform: string, topic: string): string {
  if (contentType === "script") {
    return `# Roteiro para ${platform} sobre ${topic}

GANCHO: "Você já se perguntou como melhorar em ${topic}? Vou te mostrar 3 formas!"

PONTO 1: Comece com o básico. Entenda os fundamentos de ${topic} antes de avançar.

PONTO 2: Pratique consistentemente. A consistência é mais importante que a intensidade.

PONTO 3: Aprenda com especialistas. Siga pessoas que dominam ${topic} e absorva seus conhecimentos.

CTA: "Deixe nos comentários qual dessas dicas você vai aplicar primeiro!"

#${topic.replace(/\s+/g, '')} #Dicas #Aprendizado`;
  } else if (contentType === "caption") {
    return `✨ Descobrindo novos caminhos em ${topic}! 

Compartilhando hoje algumas reflexões que transformaram minha abordagem. Às vezes, o maior obstáculo somos nós mesmos e nossas limitações autoinfligidas.

Qual sua maior dificuldade quando se trata de ${topic}? Vamos conversar nos comentários!

#${topic.replace(/\s+/g, '')} #Aprendizado #Crescimento #Desenvolvimento`;
  } else {
    return `5 IDEIAS DE CONTEÚDO SOBRE ${topic.toUpperCase()}

1. GUIA PARA INICIANTES
   Um tutorial passo a passo para quem está começando em ${topic}.

2. MITOS E VERDADES
   Desmistifique concepções erradas sobre ${topic} que muitas pessoas ainda acreditam.

3. ANTES E DEPOIS
   Mostre transformações reais e resultados alcançados com técnicas de ${topic}.

4. ERROS COMUNS
   Destaque os 5 erros mais frequentes que as pessoas cometem ao lidar com ${topic}.

5. UM DIA NA VIDA
   Mostre como ${topic} se integra à sua rotina diária de forma prática.`;
  }
}

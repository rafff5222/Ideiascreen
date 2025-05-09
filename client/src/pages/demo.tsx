import React, { useState, useEffect } from 'react';

// Ampliar o tipo de Window para incluir nossas propriedades personalizadas
declare global {
  interface Window {
    startVideoPlayback: () => void;
    videoData: {
      subtitles: string[];
      images: string[];
    };
  }
}
import { FaCheck, FaRocket, FaVideo, FaMagic, FaArrowRight, FaPlayCircle, FaCog, FaVolumeUp, FaUsers, FaUserAlt } from 'react-icons/fa';

// Adiciona CSS específico para animações e otimização mobile
const styles = `
@keyframes pulse {
  0% { transform: scale(1); }
  50% { transform: scale(1.05); }
  100% { transform: scale(1); }
}

.cta-pulse {
  animation: pulse 2s infinite;
}

.cta-demo {
  background: linear-gradient(90deg, #FF4D4D, #F9CB28);
  box-shadow: 0 4px 20px rgba(255, 77, 77, 0.4);
  transform: scale(1.05);
  transition: all 0.3s;
}

.cta-demo:hover {
  transform: scale(1.1);
}

#live-demo {
  border: 1px solid #e5e7eb;
  border-radius: 0.5rem;
  overflow: hidden;
  margin-top: 1rem;
}

#live-demo video {
  width: 100%;
  aspect-ratio: 9/16;
  background: #000;
}

#live-demo .code-preview {
  padding: 0.75rem;
  background: #f9fafb;
  border-top: 1px solid #e5e7eb;
}

#live-demo .code-preview span {
  color: #6b7280;
  font-size: 0.75rem;
  display: block;
  margin-bottom: 0.25rem;
}

#live-demo .code-preview code {
  font-family: monospace;
  color: #111827;
  font-size: 0.875rem;
}

.results-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  gap: 1rem;
  margin-top: 1.5rem;
}

.result-card {
  border-radius: 0.5rem;
  overflow: hidden;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  background: white;
}

.result-card p {
  padding: 0.5rem;
  font-size: 0.875rem;
  font-weight: 500;
  background: #f3f4f6;
  border-bottom: 1px solid #e5e7eb;
}

.result-card video {
  width: 100%;
  aspect-ratio: 9/16;
  background: #000;
}

@media (max-width: 768px) {
  .demo-container {
    padding: 15px !important;
  }
  .cta-mobile {
    position: fixed;
    bottom: 20px;
    width: 90%;
    left: 5%;
    z-index: 100;
  }
}
`;

export default function DemoPage() {
  const [scriptText, setScriptText] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [videoGenerated, setVideoGenerated] = useState<boolean>(false);
  const [showMessage, setShowMessage] = useState<boolean>(false);
  const [subtitles, setSubtitles] = useState<string[]>([]);
  const [voiceType, setVoiceType] = useState<string>('feminino-profissional');
  const [speed, setSpeed] = useState<number>(1.2);
  const [transitions, setTransitions] = useState<string[]>(['zoom', 'dissolve', 'cut']);
  const [outputFormat, setOutputFormat] = useState<string>('mp4_vertical');
  
  // Exemplo de roteiro otimizado
  const exampleScript = `0:00 - [GANCHO] Você sabe como dobrar seus seguidores? #tutorial
0:03 - [DICA] Use 3 hashtags nichadas para #trend
0:07 - [CTA] Comente 'QUERO' para a parte 2! #viral`;

  // Preencher com o exemplo quando a página carrega
  useEffect(() => {
    setScriptText(exampleScript);
  }, []);

  // Função para reproduzir vídeo com imagens e legendas
  window.startVideoPlayback = function() {
    // Obter referências aos elementos
    const audioElement = document.getElementById('demo-audio') as HTMLAudioElement;
    const imageElement = document.getElementById('current-image') as HTMLImageElement;
    const captionElement = document.getElementById('current-caption') as HTMLElement;
    
    if (!window.videoData || !audioElement || !imageElement || !captionElement) {
      console.error('Elementos necessários não encontrados');
      return;
    }
    
    const { images, subtitles } = window.videoData;
    
    if (!subtitles || subtitles.length === 0) {
      captionElement.textContent = "Legendas não disponíveis";
      return;
    }
    
    // Configurar estado inicial
    let currentImageIndex = 0;
    let currentSubtitleIndex = 0;
    
    // Exibir primeira legenda e imagem
    captionElement.textContent = subtitles[0];
    if (images && images.length > 0) {
      imageElement.src = images[0];
    }
    
    // Atualizar legendas e imagens com base no tempo do áudio
    const updateMedia = () => {
      if (audioElement.paused || audioElement.ended) return;
      
      // Calcular o índice da legenda com base no tempo atual
      const totalDuration = audioElement.duration;
      const currentTime = audioElement.currentTime;
      const segmentDuration = totalDuration / subtitles.length;
      
      // Determinar qual legenda deve ser exibida
      const newSubtitleIndex = Math.min(
        Math.floor(currentTime / segmentDuration),
        subtitles.length - 1
      );
      
      // Atualizar legenda se necessário
      if (newSubtitleIndex !== currentSubtitleIndex) {
        currentSubtitleIndex = newSubtitleIndex;
        captionElement.textContent = subtitles[currentSubtitleIndex];
        
        // Trocar imagem a cada duas legendas
        if (images && images.length > 0) {
          const newImageIndex = Math.min(
            Math.floor(currentSubtitleIndex / 2),
            images.length - 1
          );
          
          if (newImageIndex !== currentImageIndex) {
            currentImageIndex = newImageIndex;
            imageElement.src = images[currentImageIndex];
          }
        }
      }
      
      // Continuar atualizando
      requestAnimationFrame(updateMedia);
    };
    
    // Iniciar a atualização quando o áudio começar
    audioElement.addEventListener('play', updateMedia);
    
    // Se já estiver tocando, inicie a atualização
    if (!audioElement.paused) {
      updateMedia();
    }
  };

  // Sistema robusto de geração com tratamento de erros e rate limiting
  class VideoGenerator {
    private retryCount: number;
    private maxRetries: number;
    
    constructor() {
      this.retryCount = 0;
      this.maxRetries = 3;
    }

    async generate(script: string, config: {
      voice: string;
      speed: number;
      transitions: string[];
      outputFormat: string;
    }): Promise<any> {
      try {
        // Mostrar estado de carregamento
        setIsLoading(true);
        
        // Processa o roteiro para criar legendas
        const lines = script.split(/[.!?]/).filter(line => line.trim().length > 0).map(line => line.trim());
        setSubtitles(lines);
        
        console.log('Enviando requisição para gerar vídeo integrado...');
        
        // Usar o novo endpoint simplificado primeiro
        let videoData;
        try {
          const result = await this.callSimpleEndpoint(script);
          videoData = result;
        } catch (simpleError) {
          console.log('Erro no endpoint simplificado, tentando alternativa:', simpleError);
          
          // Se falhar, tentar o endpoint completo
          try {
            const result = await this.callFullEndpoint(script, config);
            videoData = result;
          } catch (fullError) {
            console.error('Ambos os endpoints falharam:', fullError);
            throw new Error('Não foi possível gerar o vídeo. Tente novamente.');
          }
        }
        
        console.log('Vídeo integrado gerado com sucesso:', videoData);
        
        if (!videoData.resources || !videoData.resources.audioData) {
          throw new Error('Dados incompletos recebidos do servidor');
        }
        
        this.setupVideoPlayback(videoData, lines);
        return videoData;
      } catch (error: any) {
        console.error('Erro durante geração:', error);
        
        // Tenta recuperar de certos tipos de erro
        if (this.retryCount < this.maxRetries && 
            error.message && (error.message.includes('timeout') || error.message.includes('network'))) {
          return await this.handleRateLimit(script, config);
        }
        
        this.displayError(error);
        return null;
      } finally {
        if (this.retryCount >= this.maxRetries) {
          setIsLoading(false);
        }
      }
    }
    
    // Chama o endpoint simplificado /generate
    private async callSimpleEndpoint(script: string): Promise<any> {
      try {
        const controller = new AbortController();
        const timeout = setTimeout(() => controller.abort(), 30000); // 30 segundos de timeout
        
        // Limitar texto para evitar problemas com a API
        const limitedScript = script.length > 500 ? script.substring(0, 500) + "..." : script;
        
        console.log("Status: Conectando ao endpoint /generate");
        const response = await fetch('/generate', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'X-Client-Version': '1.0.0'
          },
          body: JSON.stringify({ script: limitedScript }),
          signal: controller.signal
        });
        
        clearTimeout(timeout);
        
        // Tratamento para rate limiting
        if (response.status === 429) {
          throw new Error('RATE_LIMIT');
        }
        
        if (!response.ok) {
          console.error(`Erro HTTP: ${response.status} - ${response.statusText}`);
          throw new Error(`Falha na API (${response.status}): ${response.statusText}`);
        }
        
        console.log("Status: Recebendo dados da API");
        const rawText = await response.text();
        console.log("Resposta crua:", rawText.substring(0, 150) + "..."); // Log parcial para debug
        
        try {
          const data = JSON.parse(rawText);
          
          // Validar os campos principais
          if (!data.videoUrl) {
            console.error("Resposta sem videoUrl:", data);
            throw new Error("Dados incompletos: videoUrl ausente na resposta");
          }
          
          return data;
        } catch (error) {
          const jsonError = error as Error;
          console.error("Erro ao processar JSON:", jsonError);
          throw new Error(`Resposta inválida do servidor: ${jsonError.message}`);
        }
      } catch (error: any) {
        if (error.name === 'AbortError') {
          throw new Error("Timeout da requisição após 30 segundos");
        }
        throw error;
      }
    }
    
    // Chama o endpoint completo /api/generate-video
    private async callFullEndpoint(script: string, config: any): Promise<any> {
      try {
        const controller = new AbortController();
        const timeout = setTimeout(() => controller.abort(), 60000); // 60 segundos de timeout (endpoint mais lento)
        
        // Limitar texto para evitar problemas com a API
        const limitedScript = script.length > 500 ? script.substring(0, 500) + "..." : script;
        
        console.log("Status: Conectando ao endpoint completo /api/generate-video");
        const response = await fetch('/api/generate-video', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'X-Client-Version': '1.0.0',
            'X-Request-Type': 'full-generation'
          },
          body: JSON.stringify({
            script: limitedScript,
            voice: config.voice,
            speed: config.speed,
            transitions: config.transitions,
            outputFormat: config.outputFormat
          }),
          signal: controller.signal
        });
        
        clearTimeout(timeout);
        
        // Tratamento para rate limiting
        if (response.status === 429) {
          throw new Error('RATE_LIMIT');
        }
        
        if (!response.ok) {
          console.error(`Erro HTTP: ${response.status} - ${response.statusText}`);
          throw new Error(`Falha na API completa (${response.status}): ${response.statusText}`);
        }
        
        console.log("Status: Recebendo dados do endpoint completo");
        const rawText = await response.text();
        console.log("Resposta crua (completa):", rawText.substring(0, 150) + "..."); // Log parcial para debug
        
        try {
          const data = JSON.parse(rawText);
          
          // Validar os campos principais
          if (!data.resources || !data.resources.audioData) {
            console.error("Resposta incompleta:", data);
            throw new Error("Dados incompletos: recursos de áudio ausentes na resposta");
          }
          
          // Modificamos o formato para compatibilidade com o endpoint simplificado
          return {
            videoUrl: data.resources.audioData,
            subtitles: data.resources.subtitles,
            imageUrls: data.resources.imageUrls,
            success: data.success
          };
        } catch (error) {
          const jsonError = error as Error;
          console.error("Erro ao processar JSON completo:", jsonError);
          throw new Error(`Resposta inválida do servidor: ${jsonError.message}`);
        }
      } catch (error: any) {
        if (error.name === 'AbortError') {
          throw new Error("Timeout da requisição após 60 segundos");
        }
        throw error;
      }
    }

    async handleRateLimit(script: string, config: {
      voice: string;
      speed: number;
      transitions: string[];
      outputFormat: string;
    }): Promise<any> {
      this.retryCount++;
      // Espera exponencial (1s, 2s, 4s...)
      const delay = Math.pow(2, this.retryCount - 1) * 1000;
      
      // UI feedback
      const errorMessage = document.getElementById('error-message');
      if (!errorMessage) {
        const div = document.createElement('div');
        div.id = 'error-message';
        div.className = 'p-2 bg-yellow-100 text-sm rounded-md text-yellow-800 border border-yellow-300 mt-2';
        div.innerHTML = `Servidor ocupado. Tentando novamente em ${delay/1000}s... (${this.retryCount}/${this.maxRetries})`;
        
        const container = document.querySelector('.error-container');
        if (container) container.appendChild(div);
      } else {
        errorMessage.innerHTML = `Servidor ocupado. Tentando novamente em ${delay/1000}s... (${this.retryCount}/${this.maxRetries})`;
      }
      
      await new Promise(resolve => setTimeout(resolve, delay));
      
      // Remove a mensagem de erro
      const errorElement = document.getElementById('error-message');
      if (errorElement) errorElement.remove();
      
      // Nova tentativa
      return this.generate(script, config);
    }

    setupVideoPlayback(videoData: any, lines: string[]) {
      // Configurar dados para reprodução sincronizada
      window.videoData = {
        subtitles: videoData.resources.subtitles || lines,
        images: videoData.resources.imageUrls || [
          "https://picsum.photos/800/450?random=1",
          "https://picsum.photos/800/450?random=2",
          "https://picsum.photos/800/450?random=3"
        ]
      };
      
      // Configurar o elemento de áudio
      const audioElement = document.getElementById('demo-audio') as HTMLAudioElement;
      if (audioElement) {
        audioElement.src = videoData.resources.audioData;
        
        // Lidar com erros de áudio
        audioElement.onerror = (e) => {
          console.error('Erro ao carregar áudio:', e);
          this.displayError(new Error('Falha ao carregar áudio. Tente novamente.'));
        };
      }
      
      // Configurar o link de download
      const downloadLink = document.getElementById('download-link') as HTMLAnchorElement;
      if (downloadLink) {
        downloadLink.href = videoData.resources.audioData;
        downloadLink.download = "audio-narrado.mp3";
      }
      
      // Atualizar a interface
      setIsLoading(false);
      setVideoGenerated(true);
      setShowMessage(true);
      
      // Esconder a mensagem após 5 segundos
      setTimeout(() => {
        setShowMessage(false);
      }, 5000);
    }

    displayError(error: Error) {
      console.error('Erro ao gerar vídeo:', error);
      
      // Log detalhado para depuração
      console.group("Detalhes do erro de geração de vídeo");
      console.error("Mensagem:", error.message);
      console.error("Stack trace:", error.stack);
      console.error("Tipo:", error.constructor.name);
      console.groupEnd();
      
      // Registro no servidor
      fetch('/api/error-log', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          component: 'VideoGenerator',
          message: error.message,
          stack: error.stack,
          timestamp: new Date().toISOString()
        })
      }).catch(logErr => console.error("Falha ao registrar erro:", logErr));
      
      setIsLoading(false);
      
      // Mostrar erro no overlay do vídeo
      const videoResult = document.getElementById('video-result');
      const errorMessage = document.getElementById('error-message');
      const errorText = document.getElementById('error-text');
      
      if (videoResult && errorMessage && errorText) {
        errorText.textContent = error.message || 'Erro ao processar o vídeo';
        videoResult.style.display = 'block';
        errorMessage.style.display = 'block';
      }
      
      // Verificar se é um erro de API com informações extras
      let errorDetails = "";
      try {
        // Tentar extrair informações adicionais de erro de API
        if (error.message.includes('status code') || error.message.includes('RATE_LIMIT')) {
          errorDetails = `
            <div class="mt-2 text-xs bg-red-100 p-1 rounded">
              Detalhes técnicos: ${error.message}
            </div>
          `;
        }
      } catch (e) {
        // Ignorar erros na extração de detalhes
      }
      
      // UI rica para erros na área de formulário também
      const errorContainer = document.querySelector('.error-container');
      if (errorContainer) {
        const errorDiv = document.createElement('div');
        errorDiv.className = 'p-3 bg-red-50 text-sm rounded-md text-red-800 border border-red-200 mt-3 mb-3';
        errorDiv.innerHTML = `
          <div class="flex items-center">
            <svg class="w-5 h-5 text-red-600 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
            </svg>
            <span class="font-medium">Erro: ${error.message || 'Falha ao processar o vídeo'}</span>
          </div>
          ${errorDetails}
          <div class="mt-2 text-xs">
            <p>Por favor, tente novamente ou contate o suporte se o problema persistir.</p>
            <p class="mt-1 text-gray-700">
              <strong>Dica:</strong> Verifique se as chaves de API estão configuradas corretamente.
            </p>
          </div>
          <div class="mt-2 flex gap-2">
            <button class="bg-red-100 hover:bg-red-200 text-red-800 text-xs px-3 py-1 rounded-md try-again-btn">
              Tentar Novamente
            </button>
            <button class="bg-gray-100 hover:bg-gray-200 text-gray-800 text-xs px-3 py-1 rounded-md check-api-btn">
              Verificar APIs
            </button>
            <button class="bg-gray-100 hover:bg-gray-200 text-gray-800 text-xs px-3 py-1 rounded-md close-btn">
              Fechar
            </button>
          </div>
        `;
        
        // Remover mensagens de erro anteriores
        const oldErrors = errorContainer.querySelectorAll('[class*="bg-red-50"]');
        oldErrors.forEach(el => el.remove());
        
        errorContainer.appendChild(errorDiv);
      } else {
        // Fallback para alert se não encontrar o container
        alert(`Falha ao processar: ${error.message || 'Erro desconhecido'}. Por favor, tente novamente.`);
      }
    }
  }

  // Instância do gerador
  const videoGenerator = new VideoGenerator();

  // Verifica o status das APIs antes de tentar gerar o vídeo
  async function checkAPIStatus(): Promise<{elevenlabs: boolean, openai: boolean}> {
    try {
      const response = await fetch('/api/sys-status');
      const data = await response.json();
      
      console.log("Status das APIs:", data);
      
      return {
        elevenlabs: data.apis.elevenlabs.configured,
        openai: data.apis.openai.configured
      };
    } catch (error) {
      console.error("Erro ao verificar status das APIs:", error);
      return {
        elevenlabs: false,
        openai: false
      };
    }
  }
  
  // Função para geração com retry automático
  async function generateWithRetry(script: string, config: any, retries = 3): Promise<any> {
    // Verificar status das APIs antes de tentar
    const apiStatus = await checkAPIStatus();
    
    // Verificar se pelo menos uma API está disponível
    if (!apiStatus.elevenlabs && !apiStatus.openai) {
      throw new Error("As APIs ElevenLabs e OpenAI não estão configuradas. Entre em contato com o suporte.");
    }
    
    for (let i = 0; i < retries; i++) {
      try {
        console.log(`Tentativa ${i + 1}/${retries} de gerar vídeo...`);
        const data = await videoGenerator.generate(script, config);
        
        if (data && (data.videoUrl || (data.resources && data.resources.audioData))) {
          console.log("Geração bem-sucedida na tentativa", i + 1);
          return data;
        }
        
        throw new Error("Resposta sem dados de vídeo/áudio");
      } catch (error: any) {
        console.warn(`Falha na tentativa ${i + 1}:`, error.message);
        
        // Na última tentativa, não aguardamos mais
        if (i === retries - 1) {
          throw error;
        }
        
        // Backoff exponencial antes da próxima tentativa
        const delayMs = 1000 * Math.pow(2, i);
        console.log(`Aguardando ${delayMs}ms antes da próxima tentativa...`);
        
        // Feedback visual para o usuário
        const statusElement = document.getElementById('retry-status');
        if (statusElement) {
          statusElement.textContent = `Tentativa ${i+1} falhou. Tentando novamente em ${delayMs/1000}s...`;
          statusElement.style.display = 'block';
        }
        
        await new Promise(resolve => setTimeout(resolve, delayMs));
      }
    }
    
    throw new Error("Todas as tentativas de geração falharam");
  }

  // Função de geração de vídeo usando a classe
  const generateVideo = async () => {
    if (!scriptText.trim()) {
      alert('Por favor, adicione um roteiro de vídeo primeiro!');
      return;
    }

    const config = {
      voice: voiceType,
      speed: speed,
      transitions: transitions,
      outputFormat: outputFormat
    };
    
    try {
      // Criar elemento de status para retries se não existir
      let statusElement = document.getElementById('retry-status');
      if (!statusElement) {
        statusElement = document.createElement('div');
        statusElement.id = 'retry-status';
        statusElement.className = 'mt-2 p-2 bg-blue-50 text-sm text-blue-700 rounded-md';
        statusElement.style.display = 'none';
        
        const container = document.querySelector('.error-container');
        if (container) container.appendChild(statusElement);
      }
      
      // Verificar status das APIs
      const apiStatus = await checkAPIStatus();
      if (!apiStatus.elevenlabs && !apiStatus.openai) {
        throw new Error("As APIs de geração de voz (ElevenLabs e OpenAI) não estão configuradas. Contate o suporte para resolver este problema.");
      }
      
      // Exibir quais APIs estão disponíveis
      statusElement.textContent = `${apiStatus.elevenlabs ? "✓ ElevenLabs disponível" : "✗ ElevenLabs indisponível"} | ${apiStatus.openai ? "✓ OpenAI disponível" : "✗ OpenAI indisponível"}`;
      statusElement.style.display = 'block';
      
      // Usar o sistema de retry automático
      await generateWithRetry(scriptText, config, 3);
      
      // Esconder status após sucesso
      if (statusElement) statusElement.style.display = 'none';
    } catch (error: any) {
      console.error("Falha após todas as tentativas:", error);
      videoGenerator.displayError(error);
    }
  };
  
  // Função para gerar um arquivo VTT de legendas a partir do roteiro
  const generateVTT = (lines: string[]): string => {
    let vtt = 'WEBVTT\n\n';
    let startTime = 0;
    
    lines.forEach((line, index) => {
      // Calculamos tempos para cada linha do roteiro
      const duration = Math.max(2, line.length / 15); // Duração baseada no comprimento do texto
      const endTime = startTime + duration;
      
      // Formatamos os tempos no formato VTT (HH:MM:SS.mmm)
      const startFormatted = formatTime(startTime);
      const endFormatted = formatTime(endTime);
      
      // Adicionamos a legenda
      vtt += `${index + 1}\n`;
      vtt += `${startFormatted} --> ${endFormatted}\n`;
      vtt += `${line}\n\n`;
      
      // Atualizamos o tempo de início para a próxima legenda
      startTime = endTime + 0.2; // Pequena pausa entre as legendas
    });
    
    return vtt;
  };
  
  // Formata segundos para o formato VTT de tempo
  const formatTime = (seconds: number): string => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = Math.floor(seconds % 60);
    const ms = Math.floor((seconds % 1) * 1000);
    
    return `${pad(hours)}:${pad(minutes)}:${pad(secs)}.${pad(ms, 3)}`;
  };
  
  // Adiciona zeros à esquerda
  const pad = (num: number, length: number = 2): string => {
    return num.toString().padStart(length, '0');
  };

  // Função para pré-visualização de roteiro em tempo real
  const handleScriptChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const texto = e.target.value;
    setScriptText(texto);
    
    // Atualizamos a pré-visualização
    const previewElement = document.getElementById('preview-video');
    if (previewElement) {
      previewElement.innerHTML = texto.length > 0 
        ? `Pré-visualização: ${texto.substring(0, 50)}${texto.length > 50 ? '...' : ''}`
        : 'Digite um roteiro para ver a pré-visualização';
    }
    
    // Detectar #tags no texto para sugerir assets
    const keywords = texto.match(/\#\w+/g) || [];
    if (keywords.length > 0) {
      // Mostrar sugestões baseadas nas hashtags encontradas
      console.log("Tags detectadas:", keywords);
      suggestAssets(keywords);
    }
  };
  
  // Função para sugerir assets (templates, sons) baseados nas tags
  const suggestAssets = (tags: string[]) => {
    // Aqui implementaríamos a lógica completa para sugerir assets
    // Com base nas tags detectadas no roteiro
    
    // Exemplo simples de mostrar um popup ou highlight quando detectamos uma tag
    const assetSuggestions: {[key: string]: string} = {
      '#trend': 'Template viral para trending topics',
      '#tutorial': 'Formato passo-a-passo com legendas numeradas',
      '#produto': 'Template de showcase com zoom in/out',
      '#review': 'Formato comparativo antes/depois',
      '#viral': 'Áudio trending no TikTok incluído automaticamente'
    };
    
    // Verificar se existe alguma sugestão para as tags presentes
    let foundSuggestions = false;
    const suggestionDiv = document.createElement('div');
    suggestionDiv.className = 'p-2 bg-yellow-50 text-sm border border-yellow-200 rounded-md mt-2';
    
    tags.forEach(tag => {
      const tagWithoutHash = tag.substring(1).toLowerCase();
      Object.keys(assetSuggestions).forEach(key => {
        if (key.substring(1).toLowerCase().includes(tagWithoutHash)) {
          foundSuggestions = true;
          const suggestion = document.createElement('p');
          suggestion.innerHTML = `<span class="font-medium text-yellow-700">${key}:</span> ${assetSuggestions[key]}`;
          suggestionDiv.appendChild(suggestion);
        }
      });
    });
    
    if (foundSuggestions) {
      // Mostrar as sugestões
      const container = document.querySelector('.preview-container');
      const existingSuggestions = document.getElementById('asset-suggestions');
      
      if (existingSuggestions) {
        existingSuggestions.remove();
      }
      
      suggestionDiv.id = 'asset-suggestions';
      
      // Adicionar título
      const title = document.createElement('div');
      title.className = 'font-medium text-yellow-800 mb-1';
      title.textContent = '✨ Sugestões de templates detectadas:';
      suggestionDiv.prepend(title);
      
      // Adicionar ao container ou após o textarea
      const editorElement = document.getElementById('editor-roteiro');
      if (editorElement && editorElement.parentNode) {
        editorElement.parentNode.insertBefore(suggestionDiv, editorElement.nextSibling);
      }
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white py-16 demo-container">
      <style dangerouslySetInnerHTML={{ __html: styles }} />
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h1 className="text-3xl md:text-4xl font-bold mb-4 text-gray-900">
            Transforme <span className="bg-clip-text text-transparent bg-gradient-to-r from-purple-600 to-indigo-600">Roteiros em Vídeos</span> Automaticamente
          </h1>
          <p className="text-lg text-gray-700 max-w-2xl mx-auto">
            Nosso recurso exclusivo transforma seu roteiro em um vídeo completo com edição profissional em apenas alguns segundos.
          </p>
        </div>

        <div className="max-w-4xl mx-auto bg-white rounded-xl shadow-lg overflow-hidden mb-10">
          <div className="p-6 md:p-8">
            <div className="flex flex-col md:flex-row gap-8">
              <div className="w-full md:w-1/2">
                <h2 className="text-xl font-semibold mb-4 flex items-center">
                  <FaRocket className="text-indigo-600 mr-2" /> 
                  Seu Roteiro
                </h2>
                <div className="error-container"></div>
                <textarea
                  id="editor-roteiro"
                  value={scriptText}
                  onChange={handleScriptChange}
                  placeholder="Cole ou escreva seu roteiro aqui. Use #tags para sugestões de templates (ex: #tutorial, #trend, #produto)"
                  className="w-full h-64 p-4 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 focus:outline-none resize-none font-medium"
                ></textarea>
                
                {/* Pré-visualização interativa */}
                <div className="mt-2 bg-gray-100 p-3 rounded-md border border-gray-200 text-sm">
                  <p className="text-gray-500 font-medium mb-1">Pré-visualização em tempo real:</p>
                  <div id="preview-video" className="text-gray-800 font-medium">
                    {scriptText.length > 0 
                      ? `Pré-visualização: ${scriptText.substring(0, 50)}${scriptText.length > 50 ? '...' : ''}`
                      : 'Digite um roteiro para ver a pré-visualização'}
                  </div>
                </div>
                
                {/* Opções de configuração */}
                <div className="mt-4 mb-4 bg-gray-50 rounded-md p-4 border border-gray-200">
                  <div className="mb-3">
                    <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center">
                      <FaVolumeUp className="mr-1 text-indigo-500" /> Voz e Narração
                    </label>
                    <div className="grid grid-cols-2 gap-2">
                      <select 
                        className="p-2 border border-gray-300 rounded-md text-sm"
                        value={voiceType}
                        onChange={(e) => setVoiceType(e.target.value)}
                      >
                        <option value="feminino-profissional">Feminina Profissional</option>
                        <option value="masculino-profissional">Masculina Profissional</option>
                        <option value="feminino-jovem">Feminina Jovem</option>
                        <option value="masculino-jovem">Masculina Jovem</option>
                        <option value="neutro">Neutra</option>
                      </select>
                      <select 
                        className="p-2 border border-gray-300 rounded-md text-sm"
                        value={speed}
                        onChange={(e) => setSpeed(parseFloat(e.target.value))}
                      >
                        <option value="0.8">Velocidade: Lenta</option>
                        <option value="1">Velocidade: Normal</option>
                        <option value="1.2">Velocidade: Rápida</option>
                        <option value="1.5">Velocidade: Muito Rápida</option>
                      </select>
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center">
                      <FaCog className="mr-1 text-indigo-500" /> Estilo de Transição
                    </label>
                    <div className="flex flex-wrap gap-2">
                      <button
                        type="button"
                        className={`px-3 py-1 text-xs rounded-full ${transitions.includes('zoom') ? 'bg-indigo-100 text-indigo-700 border border-indigo-300' : 'bg-gray-100 text-gray-700 border border-gray-300'}`}
                        onClick={() => setTransitions(prev => 
                          prev.includes('zoom') 
                            ? prev.filter(t => t !== 'zoom') 
                            : [...prev, 'zoom']
                        )}
                      >
                        Zoom
                      </button>
                      <button
                        type="button"
                        className={`px-3 py-1 text-xs rounded-full ${transitions.includes('dissolve') ? 'bg-indigo-100 text-indigo-700 border border-indigo-300' : 'bg-gray-100 text-gray-700 border border-gray-300'}`}
                        onClick={() => setTransitions(prev => 
                          prev.includes('dissolve') 
                            ? prev.filter(t => t !== 'dissolve') 
                            : [...prev, 'dissolve']
                        )}
                      >
                        Dissolve
                      </button>
                      <button
                        type="button"
                        className={`px-3 py-1 text-xs rounded-full ${transitions.includes('cut') ? 'bg-indigo-100 text-indigo-700 border border-indigo-300' : 'bg-gray-100 text-gray-700 border border-gray-300'}`}
                        onClick={() => setTransitions(prev => 
                          prev.includes('cut') 
                            ? prev.filter(t => t !== 'cut') 
                            : [...prev, 'cut']
                        )}
                      >
                        Corte Seco
                      </button>
                      <button
                        type="button"
                        className={`px-3 py-1 text-xs rounded-full ${transitions.includes('slide') ? 'bg-indigo-100 text-indigo-700 border border-indigo-300' : 'bg-gray-100 text-gray-700 border border-gray-300'}`}
                        onClick={() => setTransitions(prev => 
                          prev.includes('slide') 
                            ? prev.filter(t => t !== 'slide') 
                            : [...prev, 'slide']
                        )}
                      >
                        Deslize
                      </button>
                      <button
                        type="button"
                        className={`px-3 py-1 text-xs rounded-full ${transitions.includes('fade') ? 'bg-indigo-100 text-indigo-700 border border-indigo-300' : 'bg-gray-100 text-gray-700 border border-gray-300'}`}
                        onClick={() => setTransitions(prev => 
                          prev.includes('fade') 
                            ? prev.filter(t => t !== 'fade') 
                            : [...prev, 'fade']
                        )}
                      >
                        Fade
                      </button>
                    </div>
                  </div>
                </div>
                
                <button
                  onClick={generateVideo}
                  disabled={isLoading}
                  className="cta-pulse mt-2 cta-demo text-white py-4 px-6 rounded-md font-bold hover:from-orange-500 hover:to-yellow-500 transition-all shadow-md w-full flex flex-col items-center justify-center"
                  style={{animation: 'pulse 2s infinite'}}
                >
                  {isLoading ? (
                    <>
                      <div className="animate-spin w-5 h-5 border-2 border-white border-t-transparent rounded-full mb-1"></div>
                      <span>Processando...</span>
                    </>
                  ) : (
                    <>
                      <span className="flex items-center"><FaMagic className="mr-2" /> 🚀 Transformar em Vídeo <FaArrowRight className="ml-2" /></span>
                      <small className="text-xs mt-1 opacity-90">Pronto em 30 segundos, sem esperas!</small>
                    </>
                  )}
                </button>
                
                <div className="mt-3 text-center text-xs text-gray-500">
                  <span className="font-medium text-green-600">💰 Custo:</span> Menos de R$ 0,50 por vídeo | 
                  <span className="font-medium text-green-600"> ⏱️ Tempo:</span> Pronto em 30 segundos
                </div>
              </div>
              
              <div className="w-full md:w-1/2">
                <h2 className="text-xl font-semibold mb-4 flex items-center">
                  <FaVideo className="text-indigo-600 mr-2" /> 
                  Vídeo Resultante
                </h2>
                <div className="bg-gray-100 h-64 rounded-md flex items-center justify-center relative">
                  {videoGenerated ? (
                    <>
                      <div className="absolute inset-0 rounded-md bg-gradient-to-br from-gray-800 to-gray-900 flex items-center justify-center overflow-hidden">
                        {/* Componente de vídeo com imagens sincronizadas */}
                        <div id="video-container" className="w-full h-full relative">
                          {/* Elemento de áudio para a narração */}
                          <audio 
                            id="demo-audio" 
                            controls
                            className="absolute bottom-0 left-0 right-0 z-20 w-full bg-gray-900 bg-opacity-70"
                          >
                            {/* O source será preenchido dinamicamente */}
                            Seu navegador não suporta o elemento de áudio.
                          </audio>
                          
                          {/* Container para a imagem atual */}
                          <div id="current-image-container" className="absolute inset-0 flex items-center justify-center">
                            <img 
                              id="current-image" 
                              src="https://picsum.photos/800/450?random=1" 
                              alt="Imagem do vídeo" 
                              className="max-w-full max-h-full object-contain"
                            />
                          </div>
                          
                          {/* Legendas */}
                          <div id="caption-container" className="absolute bottom-12 left-0 right-0 text-center p-2 z-10">
                            <div id="current-caption" className="bg-black bg-opacity-70 text-white p-2 rounded-md inline-block text-lg font-medium">
                              {/* Será preenchido dinamicamente */}
                            </div>
                          </div>
                          
                          {/* Área para mostrar erros e oferecer retry */}
                          <div id="video-result" className="absolute inset-0 flex items-center justify-center z-40" style={{display: 'none'}}>
                            <div id="error-message" className="bg-red-800 bg-opacity-90 text-white p-6 rounded-lg shadow-lg max-w-sm text-center" style={{display: 'none'}}>
                              <div className="text-3xl mb-3">🚨</div>
                              <h3 className="text-lg font-semibold mb-2">Erro na Geração</h3>
                              <p id="error-text" className="mb-4">Ocorreu um erro ao processar o vídeo.</p>
                              <button 
                                onClick={generateVideo}
                                className="px-4 py-2 bg-red-700 hover:bg-red-600 text-white rounded-md shadow-sm transition-colors"
                              >
                                Tentar Novamente
                              </button>
                              <p className="mt-3 text-xs text-red-200">
                                Dica: Verifique as chaves de API nas configurações
                              </p>
                            </div>
                          </div>
                        </div>
                        
                        {/* Ícone de play que desaparece ao clicar */}
                        <div id="play-overlay" className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-40 cursor-pointer z-30" onClick={() => {
                          const audio = document.getElementById('demo-audio') as HTMLAudioElement;
                          const overlay = document.getElementById('play-overlay');
                          if (audio && overlay) {
                            audio.play();
                            overlay.style.display = 'none';
                            
                            // Iniciar a troca de imagens e legendas sincronizadas com o áudio
                            window.startVideoPlayback();
                          }
                        }}>
                          <FaPlayCircle className="text-6xl text-white opacity-90 hover:opacity-100 hover:text-indigo-400 transition-all" />
                        </div>
                      </div>
                    </>
                  ) : (
                    <p className="text-gray-500 text-center p-4">
                      {isLoading 
                        ? "Criando seu vídeo com IA..." 
                        : "Seu vídeo aparecerá aqui após a geração"}
                    </p>
                  )}
                </div>
                
                {videoGenerated && (
                  <div className="mt-4">
                    <a 
                      id="download-link"
                      href="#"
                      download="audio-narrado.mp3"
                      className="bg-green-600 text-white py-2.5 px-4 rounded-md font-medium hover:bg-green-700 transition-all shadow-md w-full flex items-center justify-center"
                    >
                      <FaCheck className="mr-2" /> Baixar Áudio Narrado
                    </a>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {showMessage && (
          <div className="bg-gradient-to-r from-green-50 to-teal-50 border border-green-200 rounded-lg p-4 mb-12 mx-auto max-w-2xl">
            <div className="flex items-start">
              <FaCheck className="text-green-500 flex-shrink-0 mt-1" />
              <div className="ml-3">
                <p className="text-green-800 font-medium">Vídeo gerado com sucesso!</p>
                <p className="text-green-700 text-sm">Esta é uma versão demo. Para acessar recursos avançados, assine um de nossos planos.</p>
              </div>
            </div>
          </div>
        )}
        
        {/* Mostrar as legendas processadas do roteiro */}
        {videoGenerated && subtitles.length > 0 && (
          <div className="bg-white border border-gray-200 rounded-lg p-6 mb-12 mx-auto max-w-2xl">
            <h3 className="text-lg font-semibold mb-3 flex items-center">
              <span className="bg-indigo-100 text-indigo-700 p-1 rounded-full mr-2 flex items-center justify-center" style={{width: '24px', height: '24px'}}>
                <span className="text-xs">CC</span>
              </span>
              Legendas geradas automaticamente do seu roteiro:
            </h3>
            <div className="bg-gray-50 rounded-md p-3 overflow-auto max-h-40">
              {subtitles.map((line, index) => (
                <div key={index} className="mb-2 last:mb-0 p-2 border-l-2 border-indigo-300">
                  <div className="text-xs text-gray-500 mb-1">TEMPO {index + 1}</div>
                  <div>{line}</div>
                </div>
              ))}
            </div>
            <p className="text-sm text-gray-500 mt-3">
              Estas legendas são incorporadas automaticamente no vídeo. Cada frase do seu roteiro é sincronizada com o vídeo.
            </p>
          </div>
        )}

        {/* Seção "Resultados Reais" (Social Proof) */}
        <div className="max-w-3xl mx-auto mb-16">
          <h2 className="text-2xl font-bold mb-6 text-center flex items-center justify-center">
            <FaUsers className="text-indigo-600 mr-2" />
            Resultados Reais dos Nossos Usuários
          </h2>
          
          <div className="results-grid">
            <div className="result-card">
              <p>@maria_social: +32k views</p>
              <div className="aspect-video bg-gray-100 flex items-center justify-center text-gray-400">Vídeo resultado</div>
            </div>
            <div className="result-card">
              <p>@marketing_now: +280% engajamento</p>
              <div className="aspect-video bg-gray-100 flex items-center justify-center text-gray-400">Vídeo resultado</div>
            </div>
            <div className="result-card">
              <p>@tech_br: 15K seguidores em 30 dias</p>
              <div className="aspect-video bg-gray-100 flex items-center justify-center text-gray-400">Vídeo resultado</div>
            </div>
          </div>
        </div>

        <div className="max-w-3xl mx-auto">
          <h2 className="text-2xl font-bold mb-6 text-center">Como funciona?</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white p-6 rounded-lg shadow-md border border-gray-100 hover:shadow-lg transition-all">
              <div className="flex items-center justify-center h-12 w-12 rounded-md bg-gradient-to-r from-purple-500 to-indigo-600 text-white mb-4 mx-auto">
                <span className="font-bold">1</span>
              </div>
              <h3 className="text-lg font-medium text-center mb-2">Cole seu roteiro</h3>
              <p className="text-gray-600 text-center text-sm">Você escreve ou cola um roteiro que deseja transformar em vídeo (ou use nosso gerador por IA).</p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-md border border-gray-100 hover:shadow-lg transition-all">
              <div className="flex items-center justify-center h-12 w-12 rounded-md bg-gradient-to-r from-purple-500 to-indigo-600 text-white mb-4 mx-auto">
                <span className="font-bold">2</span>
              </div>
              <h3 className="text-lg font-medium text-center mb-2">Personalize</h3>
              <p className="text-gray-600 text-center text-sm">Escolha o estilo de transição, voz com 5 sotaques em PT-BR, e ajuste a velocidade da narração.</p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-md border border-gray-100 hover:shadow-lg transition-all">
              <div className="flex items-center justify-center h-12 w-12 rounded-md bg-gradient-to-r from-purple-500 to-indigo-600 text-white mb-4 mx-auto">
                <span className="font-bold">3</span>
              </div>
              <h3 className="text-lg font-medium text-center mb-2">Renderize</h3>
              <p className="text-gray-600 text-center text-sm">Vídeo pronto em 30 segundos! Menos de R$ 0,50 por vídeo com qualidade profissional.</p>
            </div>
          </div>
        </div>
        
        {/* Vídeo demonstrativo com social proof */}
        <div className="max-w-3xl mx-auto mt-16 mb-12">
          <h2 className="text-2xl font-bold mb-6 text-center flex items-center justify-center">
            <FaUsers className="text-indigo-600 mr-2" />
            Como 1.200+ criadores usam o ContentPro
          </h2>
          
          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            <div className="relative">
              <div className="aspect-video bg-gradient-to-br from-indigo-900 to-purple-900 flex items-center justify-center">
                <div className="text-center p-6">
                  <div className="inline-flex items-center mb-4 bg-black bg-opacity-50 px-4 py-2 rounded-full">
                    <div className="w-2 h-2 rounded-full bg-red-500 mr-2"></div>
                    <span className="text-white text-sm">Demo em tempo real</span>
                  </div>
                  <div className="flex flex-col items-center justify-center">
                    <FaPlayCircle className="text-6xl text-white opacity-80 hover:opacity-100 hover:text-indigo-400 transition-all cursor-pointer" />
                    <p className="text-white mt-2">Veja o processo completo</p>
                    <p className="text-gray-300 text-sm">30 segundos do roteiro até o vídeo final</p>
                  </div>
                </div>
                
                {/* Depoimento em overlay */}
                <div className="absolute bottom-4 right-4 bg-white rounded-lg shadow-lg p-3 max-w-xs">
                  <div className="flex items-start">
                    <div className="flex-shrink-0 mr-2">
                      <div className="w-10 h-10 rounded-full bg-gray-300 overflow-hidden">
                        <img 
                          src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=120" 
                          alt="Maria Criadora"
                          className="w-full h-full object-cover"
                        />
                      </div>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-900">@maria_criadora</p>
                      <p className="text-xs text-gray-600">"Economizei 10h/semana na produção de conteúdo!"</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="p-4 bg-gray-50 border-t border-gray-200">
              <div className="flex justify-between items-center">
                <div className="flex items-center">
                  <div className="w-8 h-8 bg-indigo-100 rounded-full flex items-center justify-center text-indigo-700 font-medium">
                    1
                  </div>
                  <div className="mx-2 text-gray-300">→</div>
                  <div className="w-8 h-8 bg-indigo-100 rounded-full flex items-center justify-center text-indigo-700 font-medium">
                    2
                  </div>
                  <div className="mx-2 text-gray-300">→</div>
                  <div className="w-8 h-8 bg-indigo-100 rounded-full flex items-center justify-center text-indigo-700 font-medium">
                    3
                  </div>
                </div>
                <div className="text-right">
                  <span className="text-xs font-medium text-green-600">15.7K visualizações • 423 comentários</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Código para implementação */}
        <div className="max-w-3xl mx-auto mt-16 mb-12">
          <h2 className="text-2xl font-bold mb-6 text-center">Funcionalidades Técnicas Implementadas</h2>
          <div className="bg-gray-900 rounded-lg shadow-lg overflow-hidden">
            <div className="flex items-center px-4 py-2 bg-gray-800">
              <div className="flex space-x-1 mr-4">
                <div className="w-3 h-3 rounded-full bg-red-500"></div>
                <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                <div className="w-3 h-3 rounded-full bg-green-500"></div>
              </div>
              <div className="text-gray-400 text-sm">code.js</div>
            </div>
            <div className="p-4 overflow-auto text-sm" style={{maxHeight: '300px'}}>
              <pre className="text-green-400">
                <code>{`// Função de renderização automática
function renderizarVideo(roteiro) {
  const config = {
    voz: 'feminino-profissional', // Opções: masculino, feminino, jovem
    velocidade: 1.2, // 0.8x a 1.5x
    transicoes: ['zoom', 'dissolve', 'cut'], 
    formatoSaida: 'mp4_vertical' // Para Reels/TikTok
  };
  
  return IA.renderizar(roteiro, config);
}

// Integração automática de áudio com o vídeo
function sincronizarAudioVideo(roteiro, config) {
  // Dividir o roteiro em frases
  const frases = roteiro.split(/[.!?]/).filter(f => f.trim().length > 0);
  
  // Gerar áudio para cada frase
  const clipsAudio = frases.map((frase, index) => {
    return {
      texto: frase.trim(),
      inicio: calcularInicio(index, frases),
      duracao: calcularDuracao(frase),
      voz: config.voz
    };
  });
  
  // Aplicar legendas sincronizadas
  const legendas = gerarLegendasSincronizadas(clipsAudio);
  
  return {
    clipsFrases: clipsAudio,
    legendas: legendas,
    duracao: clipsAudio.reduce((total, clip) => total + clip.duracao, 0)
  };
}`}</code>
              </pre>
            </div>
          </div>
        </div>

        {/* Seção CSS/Design Recomendado */}
        <div className="max-w-3xl mx-auto mt-16 mb-12">
          <h2 className="text-2xl font-bold mb-6 text-center">Design Recomendado para Botões</h2>
          <div className="bg-gray-900 rounded-lg shadow-lg overflow-hidden">
            <div className="flex items-center px-4 py-2 bg-gray-800">
              <div className="flex space-x-1 mr-4">
                <div className="w-3 h-3 rounded-full bg-red-500"></div>
                <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                <div className="w-3 h-3 rounded-full bg-green-500"></div>
              </div>
              <div className="text-gray-400 text-sm">styles.css</div>
            </div>
            <div className="p-4 overflow-auto text-sm" style={{maxHeight: '200px'}}>
              <pre className="text-blue-400">
                <code>{`.botao-render {
  background: linear-gradient(90deg, #EC4899, #8B5CF6);
  color: white;
  padding: 12px 24px;
  border-radius: 8px;
  font-weight: bold;
  animation: pulse 2s infinite;
}

@keyframes pulse {
  0% { transform: scale(1); }
  50% { transform: scale(1.05); }
  100% { transform: scale(1); }
}`}</code>
              </pre>
            </div>
          </div>
        </div>

        <div className="mt-8 text-center">
          <h2 className="text-2xl font-bold mb-4">Pronto para criar vídeos profissionais?</h2>
          <p className="text-lg text-gray-700 mb-6 max-w-2xl mx-auto">
            Experimente a funcionalidade completa assinando agora mesmo!
          </p>
          
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 max-w-xl mx-auto">
            <a 
              href="/" 
              className="cta-pulse w-full sm:w-auto inline-block bg-gradient-to-r from-pink-500 to-purple-600 text-white py-4 px-8 rounded-md font-bold hover:from-pink-600 hover:to-purple-700 transition-all shadow-md animate-pulse"
              style={{animation: 'pulse 2s infinite'}}
            >
              🚀 Experimente Grátis por 7 Dias
              <small className="block text-xs mt-1 opacity-90">Sem necessidade de cartão</small>
            </a>
            <a 
              href="/generator" 
              className="w-full sm:w-auto inline-block bg-white border-2 border-purple-500 text-purple-700 py-3 px-8 rounded-md font-medium hover:bg-purple-50 transition-all"
            >
              Testar Gerador de Roteiros
            </a>
          </div>
          
          <p className="text-sm text-gray-500 mt-4">
            Menos de R$ 0,50 por vídeo | Fácil de usar | Sem limites de criatividade
          </p>
          
          {/* Upsell Estratégico */}
          <div className="max-w-2xl mx-auto mt-12 bg-gradient-to-r from-indigo-50 to-purple-50 p-6 rounded-lg border border-purple-200 shadow-sm">
            <div className="flex flex-col sm:flex-row items-center">
              <div className="sm:w-3/4 text-left mb-4 sm:mb-0">
                <h3 className="text-lg font-bold text-purple-800">Gostou da demo? <span className="text-pink-600">Libere 50 vídeos grátis</span> ao assinar hoje!</h3>
                <p className="text-sm text-gray-600 mt-1">Oferta por tempo limitado: dobre seu pacote mensal no primeiro mês.</p>
              </div>
              <div className="sm:w-1/4 text-center">
                <button className="bg-pink-600 text-white py-2 px-4 rounded-md font-medium hover:bg-pink-700 transition-all shadow-sm">
                  Quero Meu Bônus
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
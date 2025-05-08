import React, { useState, useEffect } from 'react';
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
  const exampleScript = `0:00 - [GANCHO] Você sabe como dobrar seus seguidores?
0:03 - [DICA] Use 3 hashtags nichadas
0:07 - [CTA] Comente 'QUERO' para a parte 2!`;

  // Preencher com o exemplo quando a página carrega
  useEffect(() => {
    setScriptText(exampleScript);
  }, []);

  const generateVideo = async () => {
    if (!scriptText.trim()) {
      alert('Por favor, adicione um roteiro de vídeo primeiro!');
      return;
    }

    setIsLoading(true);
    
    try {
      // Processa o roteiro para criar legendas
      const lines = scriptText.split(/[.!?]/).filter(line => line.trim().length > 0).map(line => line.trim());
      setSubtitles(lines);
      
      // Fazer requisição para a API para gerar narração com a voz selecionada
      console.log('Enviando requisição para gerar áudio...');
      const speechResponse = await fetch('/api/generate-speech', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          text: scriptText,
          voice: voiceType,
          speed: speed
        }),
      });

      if (!speechResponse.ok) {
        throw new Error('Falha ao gerar áudio de narração');
      }

      const audioBlob = await speechResponse.blob();
      const audioUrl = URL.createObjectURL(audioBlob);
      
      console.log('Áudio gerado com sucesso:', audioUrl);
      
      // Fazer a requisição para gerar o vídeo completo
      console.log('Enviando requisição para gerar vídeo...');
      const videoResponse = await fetch('/api/generate-video', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          script: scriptText,
          voice: voiceType,
          speed: speed,
          transitions: transitions,
          outputFormat: outputFormat
        }),
      });

      if (!videoResponse.ok) {
        throw new Error('Falha ao gerar vídeo');
      }

      const videoData = await videoResponse.json();
      console.log('Vídeo gerado com sucesso:', videoData);
      
      // Atualizar a interface com os resultados
      setIsLoading(false);
      setVideoGenerated(true);
      setShowMessage(true);
      
      // Configurar o elemento de vídeo com o áudio gerado
      const videoElement = document.getElementById('demo-video') as HTMLVideoElement;
      if (videoElement) {
        // Substituir a fonte de áudio/vídeo pelo áudio gerado pela API
        videoElement.src = audioUrl;
        
        // Adicionar legendas
        const track = document.createElement('track');
        track.kind = 'subtitles';
        track.label = 'Português';
        track.srclang = 'pt-br';
        track.default = true;
        
        // Gerar VTT para legendas
        const webvtt = generateVTT(lines);
        const blob = new Blob([webvtt], { type: 'text/vtt' });
        const vttUrl = URL.createObjectURL(blob);
        track.src = vttUrl;
        
        // Adicionar ao vídeo
        videoElement.appendChild(track);
        
        // Configurar para mostrar legendas
        videoElement.textTracks[0].mode = 'showing';
      }
      
      // Esconder a mensagem após 5 segundos
      setTimeout(() => {
        setShowMessage(false);
      }, 5000);
    } catch (error: any) {
      console.error('Erro ao gerar vídeo:', error);
      setIsLoading(false);
      alert(`Falha ao processar: ${error.message || 'Erro desconhecido'}. Por favor, tente novamente.`);
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
                <textarea
                  id="editor-roteiro"
                  value={scriptText}
                  onChange={handleScriptChange}
                  placeholder="Cole ou escreva seu roteiro aqui com timings específicos (0:00 - [HOOK] texto...)"
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
                  className="cta-pulse mt-2 bg-gradient-to-r from-pink-500 to-purple-600 text-white py-4 px-6 rounded-md font-bold hover:from-pink-600 hover:to-purple-700 transition-all shadow-md w-full flex flex-col items-center justify-center"
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
                        {/* Vídeo simulado - usando um vídeo real para demonstração */}
                        <video 
                          id="demo-video" 
                          className="w-full h-full object-cover opacity-80"
                          controls
                          poster="https://images.unsplash.com/photo-1517404215738-15263e9f9178?w=500"
                        >
                          {/* O source será substituído pelo áudio gerado */}
                          Seu navegador não suporta o elemento de vídeo.
                        </video>
                        
                        {/* Ícone de play que desaparece ao clicar */}
                        <div id="play-overlay" className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-40 cursor-pointer" onClick={() => {
                          const video = document.getElementById('demo-video') as HTMLVideoElement;
                          const overlay = document.getElementById('play-overlay');
                          if (video && overlay) {
                            video.play();
                            overlay.style.display = 'none';
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
                      download="video-gerado.mp3"
                      className="bg-green-600 text-white py-2.5 px-4 rounded-md font-medium hover:bg-green-700 transition-all shadow-md w-full flex items-center justify-center"
                      onClick={(e) => {
                        // Pegar a URL do áudio do elemento de vídeo
                        const video = document.getElementById('demo-video') as HTMLVideoElement;
                        if (video && video.src) {
                          const downloadLink = document.getElementById('download-link') as HTMLAnchorElement;
                          downloadLink.href = video.src;
                          // Deixa o link funcionar normalmente
                        } else {
                          e.preventDefault();
                          alert('Não foi possível preparar o download. Tente novamente.');
                        }
                      }}
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
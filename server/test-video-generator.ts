import path from 'path';
import fs from 'fs/promises';
import crypto from 'crypto';
import { processAudioToVideo } from './video-processor';
import * as audioAnalyzer from './audio-analyzer';
import * as pexelsService from './pexels-service';
import * as elevenLabsService from './elevenlabs-service';

// Flag para modo debug/depuração
const DEBUG_MODE = true;
// Função para logs de debug
function debugLog(...args: any[]) {
  if (DEBUG_MODE) {
    console.log('[DEBUG]', ...args);
  }
}

/**
 * Função de teste para gerar um vídeo com o processador
 * @returns Caminho do vídeo gerado
 */
export async function testeGerarVideo(
  scriptText: string = 'Este é um teste de geração de vídeo com detecção de silêncio. A pausa entre frases será detectada automaticamente. Isso permite criar vídeos mais naturais e com melhor sincronização.',
  opcoes: {
    voz?: string;
    detectarSilencio?: boolean;
    topico?: string;
    transicoes?: string[];
    resolucao?: string;
    useDemoMode?: boolean;
  } = {}
): Promise<string> {
  try {
    debugLog('Iniciando teste de geração de vídeo com opções:', JSON.stringify(opcoes));
    console.log('Iniciando teste de geração de vídeo...');
    
    // Gerar ID único para este processamento
    const processingId = crypto.randomUUID();
    const tmpAudioPath = path.join(process.cwd(), 'tmp', `audio_test_${processingId}.mp3`);
    debugLog('ID de processamento gerado:', processingId);
    debugLog('Caminho de áudio temporário:', tmpAudioPath);
    
    // Garantir que o diretório existe
    const tmpDir = path.join(process.cwd(), 'tmp');
    try {
      await fs.access(tmpDir);
      debugLog('Diretório tmp já existe');
    } catch (e) {
      debugLog('Criando diretório tmp');
      await fs.mkdir(tmpDir, { recursive: true });
    }
    
    // Gerar áudio a partir do texto usando ElevenLabs
    console.log('Gerando áudio a partir do texto...');
    debugLog('Script para áudio:', scriptText.substring(0, 100) + '...');
    
    const voz = opcoes.voz || 'pt-BR-Female-Professional';
    debugLog('Voz selecionada:', voz);
    
    // Dividir o texto em frases para melhor processamento
    const frases = scriptText
      .split(/[.!?]+/)
      .map(frase => frase.trim())
      .filter(frase => frase.length > 0);
    
    console.log(`Texto dividido em ${frases.length} frases`);
    debugLog('Primeiras frases:', frases.slice(0, 3));
    
    // Verificar se o usuário solicitou explicitamente o modo de demonstração
    if (opcoes.useDemoMode === true) {
      debugLog('Modo de demonstração solicitado pelo usuário. Usando gerador de áudio demo.');
      console.log('Usando modo de demonstração conforme solicitado pelo usuário.');
      
      // Importar o gerador de demonstração
      const { processTextToDemoVideo } = await import('./demo-processor');
      const demoVideoPath = await processTextToDemoVideo(scriptText);
      
      debugLog('Vídeo de demonstração gerado em:', demoVideoPath);
      return demoVideoPath;
    }
    
    // Gerar o áudio com ElevenLabs
    debugLog('Iniciando chamada para ElevenLabs');
    const voiceType = elevenLabsService.VoiceType[voz as keyof typeof elevenLabsService.VoiceType] || elevenLabsService.VoiceType.FEMININO_PROFISSIONAL;
    debugLog('Tipo de voz mapeado:', voiceType);
    
    const audioBuffer = await elevenLabsService.generateElevenLabsAudio(
      scriptText, 
      voiceType
    );
    
    if (!audioBuffer) {
      debugLog('Falha ao gerar áudio - buffer nulo retornado');
      
      // Se falhar, informamos que estamos usando o modo de demonstração como fallback
      console.log('Falha ao gerar áudio com API externa. Usando modo de demonstração como fallback.');
      debugLog('Usando processador de demonstração como fallback');
      
      // Importar o gerador de demonstração
      const { processTextToDemoVideo } = await import('./demo-processor');
      const demoVideoPath = await processTextToDemoVideo(scriptText);
      
      debugLog('Vídeo de demonstração gerado em:', demoVideoPath);
      return demoVideoPath;
    }
    
    debugLog('Áudio gerado com sucesso, tamanho do buffer:', audioBuffer.length);
    
    // Salvar o áudio no arquivo temporário
    await fs.writeFile(tmpAudioPath, audioBuffer);
    console.log(`Áudio gerado e salvo em ${tmpAudioPath}`);
    
    // Verificar se o arquivo foi criado corretamente
    try {
      const audioStat = await fs.stat(tmpAudioPath);
      debugLog('Arquivo de áudio verificado, tamanho:', audioStat.size);
      
      if (audioStat.size < 1000) {
        debugLog('ALERTA: Arquivo de áudio parece muito pequeno');
      }
    } catch (e) {
      debugLog('Erro ao verificar arquivo de áudio:', e);
      throw new Error('Falha ao verificar arquivo de áudio');
    }
    
    // Definir opções para processamento de vídeo
    const videoOptions = {
      detectSilence: opcoes.detectarSilencio !== undefined ? opcoes.detectarSilencio : true,
      silenceThreshold: -35,  // dB, mais sensível para captar pausas naturais
      topic: opcoes.topico || 'tecnologia digital negócios',
      transitions: opcoes.transicoes || ['fade'],
      resolution: opcoes.resolucao || '720p'
    };
    
    debugLog('Opções de vídeo configuradas:', videoOptions);
    
    // Realizar busca de imagens relacionadas ao tópico via Pexels
    console.log(`Buscando imagens para o tópico: ${videoOptions.topic}`);
    debugLog('Iniciando busca de imagens via Pexels');
    
    const imageUrls = await pexelsService.searchImages(videoOptions.topic, 5);
    debugLog('Imagens retornadas:', imageUrls.length, 'primeira URL:', imageUrls[0]?.substring(0, 50) + '...');
    
    // Processar o áudio em vídeo com as imagens e legendas
    console.log('Processando áudio para vídeo...');
    debugLog('Iniciando processamento de áudio para vídeo');
    
    const videoPath = await processAudioToVideo(
      tmpAudioPath,
      imageUrls,
      frases,
      videoOptions
    );
    
    debugLog('Processo de vídeo concluído, caminho:', videoPath);
    console.log(`Vídeo gerado com sucesso: ${videoPath}`);
    
    // Verificar se o vídeo foi gerado corretamente
    try {
      const videoStat = await fs.stat(videoPath);
      debugLog('Arquivo de vídeo verificado, tamanho:', videoStat.size);
      
      if (videoStat.size < 10000) {
        debugLog('ALERTA: Arquivo de vídeo parece muito pequeno');
      }
    } catch (e) {
      debugLog('Erro ao verificar arquivo de vídeo:', e);
      throw new Error('Falha ao verificar arquivo de vídeo');
    }
    
    return videoPath;
    
  } catch (err) {
    const error = err instanceof Error ? err : new Error(String(err));
    debugLog('ERRO na geração de vídeo:', error.message, error.stack);
    console.error('Erro no teste de geração de vídeo:', error.message);
    throw error;
  }
}

// Para executar o teste diretamente, importe e chame esta função
// Não podemos usar require.main em módulos ESM
// Se você quiser rodar este teste, use:
// import { testeGerarVideo } from './test-video-generator.js';
// testeGerarVideo().then(...).catch(...);

// Função auxiliar para executar o teste (não é chamada automaticamente)
export async function runTest() {
  try {
    const videoPath = await testeGerarVideo();
    console.log(`\nTeste concluído com sucesso! Vídeo disponível em: ${videoPath}`);
    return videoPath;
  } catch (error) {
    console.error('\nTeste falhou com erro:', error);
    throw error;
  }
}
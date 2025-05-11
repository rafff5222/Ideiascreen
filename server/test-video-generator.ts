import path from 'path';
import fs from 'fs/promises';
import crypto from 'crypto';
import { processAudioToVideo } from './video-processor';
import * as audioAnalyzer from './audio-analyzer';
import * as pexelsService from './pexels-service';
import * as elevenLabsService from './elevenlabs-service';

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
  } = {}
): Promise<string> {
  try {
    console.log('Iniciando teste de geração de vídeo...');
    
    // Gerar ID único para este processamento
    const processingId = crypto.randomUUID();
    const tmpAudioPath = path.join(process.cwd(), 'tmp', `audio_test_${processingId}.mp3`);
    
    // Garantir que o diretório existe
    const tmpDir = path.join(process.cwd(), 'tmp');
    try {
      await fs.access(tmpDir);
    } catch (e) {
      await fs.mkdir(tmpDir, { recursive: true });
    }
    
    // Gerar áudio a partir do texto usando ElevenLabs
    console.log('Gerando áudio a partir do texto...');
    
    const voz = opcoes.voz || 'pt-BR-Female-Professional';
    
    // Dividir o texto em frases para melhor processamento
    const frases = scriptText
      .split(/[.!?]+/)
      .map(frase => frase.trim())
      .filter(frase => frase.length > 0);
    
    console.log(`Texto dividido em ${frases.length} frases`);
    
    // Gerar o áudio com ElevenLabs
    const audioBuffer = await elevenLabsService.generateElevenLabsAudio(
      scriptText, 
      elevenLabsService.VoiceType[voz as keyof typeof elevenLabsService.VoiceType] || elevenLabsService.VoiceType.FEMININO_PROFISSIONAL
    );
    
    if (!audioBuffer) {
      throw new Error('Falha ao gerar áudio com ElevenLabs');
    }
    
    // Salvar o áudio no arquivo temporário
    await fs.writeFile(tmpAudioPath, audioBuffer);
    console.log(`Áudio gerado e salvo em ${tmpAudioPath}`);
    
    // Definir opções para processamento de vídeo
    const videoOptions = {
      detectSilence: opcoes.detectarSilencio !== undefined ? opcoes.detectarSilencio : true,
      silenceThreshold: -35,  // dB, mais sensível para captar pausas naturais
      topic: opcoes.topico || 'tecnologia digital negócios',
      transitions: opcoes.transicoes || ['fade'],
      resolution: opcoes.resolucao || '720p'
    };
    
    // Realizar busca de imagens relacionadas ao tópico via Pexels
    console.log(`Buscando imagens para o tópico: ${videoOptions.topic}`);
    const imageUrls = await pexelsService.searchImages(videoOptions.topic, 5);
    
    // Processar o áudio em vídeo com as imagens e legendas
    console.log('Processando áudio para vídeo...');
    const videoPath = await processAudioToVideo(
      tmpAudioPath,
      imageUrls,
      frases,
      videoOptions
    );
    
    console.log(`Vídeo gerado com sucesso: ${videoPath}`);
    return videoPath;
    
  } catch (err) {
    const error = err instanceof Error ? err : new Error(String(err));
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
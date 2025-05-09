import fetch from 'node-fetch';
import { execSync } from 'child_process';
import { OpenAI } from 'openai';

// Verificar funcionamento das APIs
async function testApis() {
  console.log('Teste de diagnóstico de APIs');
  console.log('============================');
  
  try {
    // Testar conexão com servidor
    console.log('\n1. Testando configuração do sistema...');
    const sysStatusResponse = await fetch('http://localhost:5000/api/sys-status');
    const sysStatus = await sysStatusResponse.json();
    console.log('Status do sistema:', JSON.stringify(sysStatus, null, 2));
    
    // Testar verificação de APIs
    console.log('\n2. Testando as chaves de API diretamente...');
    console.log(`OPENAI_API_KEY: ${process.env.OPENAI_API_KEY ? 'Configurada (valor oculto)' : 'Não configurada'}`);
    console.log(`ELEVENLABS_API_KEY: ${process.env.ELEVENLABS_API_KEY ? 'Configurada (valor oculto)' : 'Não configurada'}`);
    
    // Testar OpenAI
    console.log('\n3. Testando API da OpenAI...');
    try {
      const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
      console.log('Cliente da OpenAI inicializado');
      
      try {
        const response = await openai.chat.completions.create({
          model: "gpt-4o",
          messages: [
            { role: "user", content: "API test" }
          ],
          max_tokens: 5
        });
        console.log(`✅ OpenAI funcionando: resposta recebida`);
      } catch (apiErr) {
        console.error('❌ Erro ao usar OpenAI:', apiErr.message);
      }
    } catch (err) {
      console.error('❌ Erro ao inicializar cliente da OpenAI:', err.message);
    }
    
    // Testar FFmpeg
    console.log('\n4. Testando FFmpeg...');
    try {
      const ffmpegVersion = execSync('ffmpeg -version').toString().split('\n')[0];
      console.log(`✅ FFmpeg instalado: ${ffmpegVersion}`);
    } catch (err) {
      console.error('❌ Erro com FFmpeg:', err.message);
    }
    
    // Testar Redis usando fetch para acessar o endpoint de diagnóstico
    console.log('\n5. Testando conexão Redis via API...');
    try {
      const redisStatusResponse = await fetch('http://localhost:5000/api/diagnose');
      const redisStatusText = await redisStatusResponse.text();
      console.log('Resposta do diagnóstico:', redisStatusText.substring(0, 500) + '...');
    } catch (err) {
      console.error('❌ Erro ao verificar Redis:', err.message);
    }
    
  } catch (error) {
    console.error('Erro geral no teste:', error);
  }
}

testApis().catch(console.error);
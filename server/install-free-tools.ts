/**
 * Script para instalar ferramentas gratuitas localmente
 * Facilita a instalação de Edge TTS, Ollama e outras alternativas
 * Execute com: ts-node server/install-free-tools.ts
 */

import { spawn, exec } from 'child_process';
import { promisify } from 'util';
import readline from 'readline';
import os from 'os';

const execAsync = promisify(exec);

// Interface para ler input do usuário
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

function askQuestion(question: string): Promise<string> {
  return new Promise((resolve) => {
    rl.question(question, (answer) => {
      resolve(answer);
    });
  });
}

async function installEdgeTTS(): Promise<void> {
  console.log('\n🔊 Instalando Microsoft Edge TTS (alternativa gratuita ao ElevenLabs)...');
  
  try {
    // Verificar se o Edge TTS já está instalado
    try {
      await execAsync('edge-tts --version');
      console.log('✅ Microsoft Edge TTS já está instalado!');
      return;
    } catch (err) {
      console.log('Microsoft Edge TTS não encontrado, instalando...');
    }
    
    // Instalar com pip
    const command = spawn('pip', ['install', 'edge-tts']);
    
    command.stdout.on('data', (data) => {
      console.log(data.toString());
    });
    
    command.stderr.on('data', (data) => {
      console.error(data.toString());
    });
    
    await new Promise<void>((resolve, reject) => {
      command.on('close', (code) => {
        if (code === 0) {
          console.log('✅ Microsoft Edge TTS instalado com sucesso!');
          resolve();
        } else {
          console.error(`❌ Erro ao instalar Edge TTS (código: ${code})`);
          reject();
        }
      });
    });
  } catch (error) {
    console.error('❌ Erro ao instalar Edge TTS:', error);
    console.log('Tente instalar manualmente com: pip install edge-tts');
  }
}

async function checkOllamaInstallation(): Promise<boolean> {
  try {
    await execAsync('ollama --version');
    return true;
  } catch (err) {
    return false;
  }
}

async function installOllama(): Promise<void> {
  console.log('\n🧠 Verificando Ollama (alternativa gratuita à OpenAI)...');
  
  // Verificar se o Ollama já está instalado
  if (await checkOllamaInstallation()) {
    console.log('✅ Ollama já está instalado!');
    return;
  }
  
  console.log('Ollama não encontrado. Instruções de instalação:');
  
  const platform = os.platform();
  
  if (platform === 'darwin') {
    // macOS
    console.log(`
    Para instalar o Ollama no macOS:
    1. Baixe o instalador em: https://ollama.com/download/Ollama-darwin.zip
    2. Descompacte e instale o aplicativo
    3. Inicie o aplicativo Ollama
    `);
  } else if (platform === 'linux') {
    // Linux
    console.log(`
    Para instalar o Ollama no Linux:
    Execute o seguinte comando:
    
    curl -fsSL https://ollama.com/install.sh | sh
    
    Depois inicie o serviço com:
    ollama serve
    `);
  } else if (platform === 'win32') {
    // Windows
    console.log(`
    Para instalar o Ollama no Windows:
    1. Baixe o instalador em: https://ollama.com/download/OllamaSetup.exe
    2. Execute o instalador
    3. Inicie o aplicativo Ollama
    `);
  } else {
    console.log(`
    Para instalar o Ollama:
    Visite https://ollama.com/download e siga as instruções para sua plataforma.
    `);
  }
}

async function installHuggingFaceCLI(): Promise<void> {
  console.log('\n🤗 Instalando Hugging Face CLI...');
  
  try {
    try {
      await execAsync('huggingface-cli --version');
      console.log('✅ Hugging Face CLI já está instalado!');
      return;
    } catch (err) {
      console.log('Hugging Face CLI não encontrado, instalando...');
    }
    
    // Instalar com pip
    const command = spawn('pip', ['install', 'huggingface_hub']);
    
    command.stdout.on('data', (data) => {
      console.log(data.toString());
    });
    
    command.stderr.on('data', (data) => {
      console.error(data.toString());
    });
    
    await new Promise<void>((resolve, reject) => {
      command.on('close', (code) => {
        if (code === 0) {
          console.log('✅ Hugging Face CLI instalado com sucesso!');
          resolve();
        } else {
          console.error(`❌ Erro ao instalar Hugging Face CLI (código: ${code})`);
          reject();
        }
      });
    });
  } catch (error) {
    console.error('❌ Erro ao instalar Hugging Face CLI:', error);
    console.log('Tente instalar manualmente com: pip install huggingface_hub');
  }
}

async function showApiLinks(): Promise<void> {
  console.log('\n🔑 Links para obter chaves de API gratuitas:');
  
  console.log(`
  Pixabay API (alternativa gratuita ao Pexels):
  - Cadastre-se em: https://pixabay.com/api/docs/
  - Limite gratuito: 5.000 requisições por hora
  
  Unsplash API (alternativa gratuita ao Pexels):
  - Cadastre-se em: https://unsplash.com/developers
  - Limite gratuito: 50 requisições por hora
  
  Hugging Face API (alternativa gratuita à OpenAI):
  - Cadastre-se em: https://huggingface.co/settings/tokens
  - Limite gratuito: Varia por modelo, mas geralmente generoso
  `);
}

async function main() {
  console.log('=================================================');
  console.log('🚀 Instalador de ferramentas gratuitas para geração de conteúdo');
  console.log('=================================================');
  
  console.log('\nEste script ajuda a instalar e configurar alternativas gratuitas às APIs pagas:');
  console.log('• Edge TTS (alternativa gratuita ao ElevenLabs)');
  console.log('• Ollama (alternativa gratuita à OpenAI, executada localmente)');
  console.log('• Hugging Face CLI (alternativa gratuita à OpenAI, via API)');
  
  const answer = await askQuestion('\nDeseja continuar com a instalação? (s/n): ');
  
  if (answer.toLowerCase() !== 's' && answer.toLowerCase() !== 'sim') {
    console.log('Instalação cancelada.');
    rl.close();
    return;
  }
  
  try {
    await installEdgeTTS();
    await installOllama();
    await installHuggingFaceCLI();
    await showApiLinks();
    
    console.log('\n✅ Instalação concluída!');
    console.log('\nAgora você pode usar alternativas gratuitas para geração de conteúdo!');
    console.log('Configure as chaves de API no arquivo .env ou use as ferramentas locais.');
    
  } catch (error) {
    console.error('\n❌ Erro durante a instalação:', error);
  } finally {
    rl.close();
  }
}

main().catch(console.error);
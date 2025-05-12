// Seleção dinâmica do servidor com base na configuração
// Para usar o servidor Hugging Face, defina: USE_HUGGINGFACE=true

import dotenv from 'dotenv';
dotenv.config();

// Determinar qual servidor usar
const useHuggingFace = process.env.USE_HUGGINGFACE === 'true';

if (useHuggingFace) {
  console.log('🤗 Iniciando servidor com Hugging Face (modelo gratuito)');
  import('./huggingface-server.js');
} else {
  console.log('🔄 Iniciando servidor com OpenAI');
  import('./simple-server.js');
}

console.log('⚙️ Configurações do servidor:');
console.log(`- API: ${useHuggingFace ? 'Hugging Face (gratuito)' : 'OpenAI'}`);
console.log(`- Porta: ${process.env.PORT || 3000}`);
console.log('📝 Acesse o gerador de roteiros em http://localhost:3000');
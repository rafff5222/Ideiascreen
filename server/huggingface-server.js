import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import fetch from 'node-fetch';

// Configurações do diretório
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const publicDir = path.join(__dirname, '../client/public');

// Inicializar Express
const app = express();
app.use(express.json());
app.use(express.static(publicDir));

// Verificar API key (opcional para alguns modelos no Hugging Face)
const HUGGINGFACE_API_KEY = process.env.HUGGINGFACE_API_KEY || '';

// Configurar rotas
app.get('/', (req, res) => {
  res.sendFile(path.join(publicDir, 'index.html'));
});

// Rota para gerar roteiro usando Hugging Face
app.post('/api/generate-script', async (req, res) => {
  try {
    const { prompt } = req.body;
    
    if (!prompt) {
      return res.status(400).json({ error: 'Prompt é obrigatório' });
    }
    
    // Definir o sistema prompt para roteiros
    const systemPrompt = "Você é um roteirista profissional especializado em criar roteiros detalhados e formatados.";
    
    // Formatar o prompt para o modelo
    const formattedPrompt = `${systemPrompt}\n\n${prompt}\n\nCrie um roteiro detalhado com diálogos, cenas e direções de câmera. Formate corretamente como um roteiro profissional.`;
    
    // URL do modelo no Hugging Face (usando modelo gratuito)
    // Vamos usar o Falcon-7B-Instruct que é open source e gratuito
    const apiUrl = "https://api-inference.huggingface.co/models/tiiuae/falcon-7b-instruct";
    
    // Configurar solicitação para a API
    const response = await fetch(apiUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...(HUGGINGFACE_API_KEY && { "Authorization": `Bearer ${HUGGINGFACE_API_KEY}` })
      },
      body: JSON.stringify({
        inputs: formattedPrompt,
        parameters: {
          max_new_tokens: 1000,
          temperature: 0.7,
          top_p: 0.95,
          do_sample: true,
        }
      }),
    });
    
    if (!response.ok) {
      const errorData = await response.text();
      console.error('Erro na resposta da API Hugging Face:', errorData);
      throw new Error(`API respondeu com status ${response.status}: ${errorData}`);
    }
    
    const result = await response.json();
    
    // Extrair o texto gerado da resposta
    let generatedScript;
    if (Array.isArray(result) && result.length > 0) {
      generatedScript = result[0].generated_text;
    } else if (result.generated_text) {
      generatedScript = result.generated_text;
    } else {
      // Resposta alternativa se não tivermos o formato esperado
      generatedScript = "FORMATO DE SCRIPT:\n\n" + 
        "CENA 1 - INTERIOR - DIA\n\n" +
        "Uma resposta simplificada foi gerada devido a limitações do modelo gratuito. " +
        "Para resultados mais elaborados, considere usar um modelo diferente ou a API da OpenAI.";
    }
    
    // Limpar o prompt do texto gerado
    const cleanedScript = generatedScript.replace(formattedPrompt, '').trim();
    
    // Retornar o roteiro gerado
    res.json({ script: cleanedScript });
  } catch (error) {
    console.error('Erro ao gerar roteiro:', error);
    res.status(500).json({ 
      error: `Erro ao gerar roteiro: ${error.message}`,
      script: "DEMONSTRAÇÃO: Este é um roteiro de exemplo criado devido a um erro na API.\n\nCENA 1 - EXTERIOR - DIA\n\nUma pessoa está sentada em um banco de parque, contemplando o horizonte. A câmera se aproxima lentamente."
    });
  }
});

// Iniciar servidor
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Servidor rodando em http://localhost:${PORT}`);
});

export default app;
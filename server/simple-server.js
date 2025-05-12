import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import { OpenAI } from 'openai';

// Configurações do diretório
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const publicDir = path.join(__dirname, '../client/public');

// Inicializar Express
const app = express();
app.use(express.json());
app.use(express.static(publicDir));

// Verificar API key
const OPENAI_API_KEY = process.env.OPENAI_API_KEY;
if (!OPENAI_API_KEY) {
  console.warn('Aviso: OPENAI_API_KEY não está definida. O gerador de roteiros pode não funcionar corretamente.');
}

// Inicializar OpenAI
const openai = new OpenAI({
  apiKey: OPENAI_API_KEY
});

// Configurar rotas
app.get('/', (req, res) => {
  res.sendFile(path.join(publicDir, 'index.html'));
});

// Rota para gerar roteiro
app.post('/api/generate-script', async (req, res) => {
  try {
    const { prompt } = req.body;
    
    if (!prompt) {
      return res.status(400).json({ error: 'Prompt é obrigatório' });
    }
    
    // Verificar se a API está configurada
    if (!OPENAI_API_KEY) {
      return res.status(500).json({ 
        error: 'API OpenAI não configurada', 
        script: 'DEMO: Este é um roteiro de demonstração. Configure a API_KEY da OpenAI para gerar roteiros reais.' 
      });
    }

    // Gerar roteiro usando OpenAI
    const completion = await openai.chat.completions.create({
      model: "gpt-4o", // o mais novo modelo da OpenAI, lançado em 13 de maio de 2024
      messages: [
        {
          role: "system",
          content: "Você é um roteirista profissional especializado em criar roteiros detalhados e formatados para diversos formatos de mídia."
        },
        {
          role: "user",
          content: `${prompt}\n\nCrie um roteiro detalhado com diálogos, cenas e direções de câmera. Formate corretamente como um roteiro profissional.`
        }
      ],
      max_tokens: 2000
    });

    // Retornar o roteiro gerado
    const generatedScript = completion.choices[0].message.content;
    res.json({ script: generatedScript });
  } catch (error) {
    console.error('Erro ao gerar roteiro:', error);
    res.status(500).json({ error: `Erro ao gerar roteiro: ${error.message}` });
  }
});

// Iniciar servidor
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Servidor rodando em http://localhost:${PORT}`);
});

export default app;
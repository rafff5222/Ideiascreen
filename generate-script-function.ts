import type { Request, Response } from "express";

// Rota para geração de roteiros - Versão simplificada usando Hugging Face
export async function generateScript(req: Request, res: Response) {
  try {
    const { prompt } = req.body;
    
    if (!prompt) {
      return res.status(400).json({ error: 'Prompt é obrigatório' });
    }
    
    // Usaremos apenas Hugging Face
    const HUGGINGFACE_API_KEY = process.env.HUGGINGFACE_API_KEY;
    
    // Log para depuração
    console.log('Configuração da API:', { 
      tipoAPI: 'Usando API do Hugging Face (inferência de texto)',
      huggingfaceKeyConfigured: !!HUGGINGFACE_API_KEY
    });
    
    // Formatar o prompt para o modelo - ajustado para melhores resultados
    const scriptType = prompt.toLowerCase().includes("youtube") ? "vídeo para YouTube" : 
                      prompt.toLowerCase().includes("podcast") ? "episódio de podcast" : 
                      "roteiro profissional";
    
    const systemPrompt = `Você é um roteirista profissional especializado em criar ${scriptType}s detalhados e formatados. 
Siga estas diretrizes:
- Crie diálogos naturais e envolventes
- Inclua descrições claras de cenas e ambientes
- Adicione direções para câmera e atores quando apropriado
- Formate corretamente como um roteiro profissional
- Use formatação adequada ao tipo de conteúdo`;

    const formattedPrompt = `${systemPrompt}

Prompt do usuário: ${prompt}

Responda APENAS com o roteiro completo, sem introduções ou conclusões.`;
    
    const fetch = (await import('node-fetch')).default;
    
    // Preparar os headers
    const headers: Record<string, string> = {
      "Content-Type": "application/json",
    };
    
    // Adicionar o token de API se disponível
    if (HUGGINGFACE_API_KEY) {
      headers["Authorization"] = `Bearer ${HUGGINGFACE_API_KEY}`;
    }
    
    let generatedScript = '';
    const modelUsed = 'HuggingFaceH4/zephyr-7b-beta';
    
    try {
      // Endpoint de inferência de texto - mais simples e confiável
      const response = await fetch("https://api-inference.huggingface.co/models/HuggingFaceH4/zephyr-7b-beta", {
        method: "POST",
        headers,
        body: JSON.stringify({
          inputs: formattedPrompt,
          parameters: {
            max_new_tokens: 1000,
            temperature: 0.7,
            return_full_text: false
          }
        }),
      });
      
      if (!response.ok) {
        const errorText = await response.text();
        console.error(`Erro na resposta da API:`, errorText);
        throw new Error(`API respondeu com status ${response.status}: ${errorText}`);
      }
      
      const result = await response.json();
      console.log('Resposta da API:', JSON.stringify(result).slice(0, 150) + '...');
      
      // Extrair o texto gerado da resposta
      if (Array.isArray(result) && result.length > 0 && result[0].generated_text) {
        generatedScript = result[0].generated_text;
      } else if (result && typeof result === 'object' && 'generated_text' in result) {
        generatedScript = result.generated_text as string;
      } else if (typeof result === 'string') {
        generatedScript = result;
      } else {
        console.error('Formato de resposta inesperado:', result);
        generatedScript = JSON.stringify(result);
      }
      
      // Limpar o prompt do texto gerado se necessário
      if (generatedScript.includes(formattedPrompt)) {
        generatedScript = generatedScript.replace(formattedPrompt, '').trim();
      }
      
      // Se o script estiver vazio ou muito curto, usar o resultado bruto
      if (!generatedScript || generatedScript.length < 50) {
        generatedScript = `Não foi possível gerar um roteiro adequado. 
Aqui está a resposta bruta da API para você avaliar:

${JSON.stringify(result, null, 2)}`;
      }
    } catch (apiError: any) {
      console.error('Erro ao chamar API Hugging Face:', apiError);
      throw new Error(`Erro ao gerar roteiro com Hugging Face: ${apiError.message}`);
    }
    
    // Retornar o roteiro gerado com metadata
    return res.json({ 
      script: generatedScript,
      metadata: {
        modelUsed,
        generatedAt: new Date().toISOString(),
        promptTokens: prompt.length,
        outputTokens: generatedScript.length
      }
    });
    
  } catch (error: any) {
    console.error('Erro ao gerar roteiro:', error);
    
    // Formatar mensagem de erro com informações úteis
    let errorTips = `Ocorreu um erro ao processar seu pedido.\n\n`;
    errorTips += `Detalhes do erro: ${error.message}\n\n`;
    errorTips += `Possíveis causas e soluções:\n`;
    errorTips += `• Os servidores da API estão ocupados ou indisponíveis\n`;
    errorTips += `• Tente novamente em alguns minutos\n`;
    errorTips += `• Tente um prompt mais simples ou direto\n`;
    errorTips += `• Verifique sua conexão com a internet`;
    
    return res.status(500).json({ 
      error: `Erro ao gerar roteiro: ${error.message}`,
      script: errorTips
    });
  }
}
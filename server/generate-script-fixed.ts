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
    let modelUsed = '';
    
    // Lista de modelos para tentar em ordem de preferência (do melhor para o mais simples)
    const modelsToTry = [
      { 
        model: 'HuggingFaceH4/zephyr-7b-beta', 
        endpoint: 'https://api-inference.huggingface.co/models/HuggingFaceH4/zephyr-7b-beta' 
      },
      { 
        model: 'facebook/opt-1.3b', 
        endpoint: 'https://api-inference.huggingface.co/models/facebook/opt-1.3b' 
      },
      { 
        model: 'gpt2', 
        endpoint: 'https://api-inference.huggingface.co/models/gpt2' 
      },
      { 
        model: 'distilgpt2', 
        endpoint: 'https://api-inference.huggingface.co/models/distilgpt2' 
      }
    ];
    
    let lastError: Error | null = null;
    let result: any = null;
    
    // Tentar cada modelo na lista até um funcionar
    for (const modelInfo of modelsToTry) {
      try {
        console.log(`Tentando modelo: ${modelInfo.model}`);
        
        const response = await fetch(modelInfo.endpoint, {
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
          console.error(`Erro no modelo ${modelInfo.model}:`, errorText);
          throw new Error(`API respondeu com status ${response.status}: ${errorText}`);
        }
        
        result = await response.json();
        modelUsed = modelInfo.model;
        console.log(`Sucesso com o modelo: ${modelUsed}`);
        break; // Sai do loop se encontrou um modelo que funciona
      } catch (error: any) {
        console.error(`Falha no modelo ${modelInfo.model}:`, error.message);
        lastError = error;
        // Continua para o próximo modelo
      }
    }
    
    // Se chegamos aqui sem um resultado, todos os modelos falharam
    if (!result) {
      throw lastError || new Error('Todos os modelos falharam');
    }
    
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
    
    // Verificar se o erro está relacionado ao limite de créditos
    if (error.message && error.message.includes('exceeded your monthly included credits')) {
      // Tentar o fallback
      const { fallbackScriptGeneration } = await import('./fallback-generator');
      try {
        return await fallbackScriptGeneration(req, res);
      } catch (fallbackError) {
        console.error('Fallback também falhou:', fallbackError);
      }
    }
    
    return res.status(500).json({ 
      error: `Erro ao gerar roteiro: ${error.message}`,
      script: errorTips
    });
  }
}
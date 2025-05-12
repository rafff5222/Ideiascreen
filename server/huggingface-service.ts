/**
 * Serviço de IA usando Hugging Face como alternativa gratuita ao OpenAI
 */

import axios from 'axios';
import { spawn } from 'child_process';
import { writeFile, readFile } from 'fs/promises';
import path from 'path';
import os from 'os';

// Modelos disponíveis gratuitamente na Hugging Face
export enum HuggingFaceModel {
  TEXT_GENERATION = 'gpt2',
  MISTRAL = 'mistralai/Mistral-7B-Instruct-v0.1',
  LLAMA2 = 'meta-llama/Llama-2-7b-chat-hf',
  FALCON_INSTRUCT = 'tiiuae/falcon-7b-instruct',
  FLAN_T5 = 'google/flan-t5-large',
  BLENDER_BOT = 'facebook/blenderbot-400M-distill',
}

interface HuggingFaceOptions {
  model?: HuggingFaceModel | string;
  prompt: string;
  maxTokens?: number;
  temperature?: number;
  apiKey?: string;
}

interface HuggingFaceResult {
  text: string;
  model: string;
  error?: string;
}

/**
 * Verifica se o Ollama está disponível localmente
 */
export async function checkOllamaAvailability(): Promise<boolean> {
  return new Promise((resolve) => {
    const process = spawn('ollama', ['list']);
    
    process.on('error', () => {
      resolve(false);
    });
    
    process.on('close', (code) => {
      resolve(code === 0);
    });
  });
}

/**
 * Gera texto usando um modelo local via Ollama
 * @param model Nome do modelo
 * @param prompt Texto de entrada
 * @returns Texto gerado
 */
export async function generateWithOllama(model: string, prompt: string): Promise<string> {
  // Criar arquivo temporário para o prompt
  const timestamp = Date.now();
  const tempPromptFile = path.join(os.tmpdir(), `ollama_prompt_${timestamp}.txt`);
  const tempOutputFile = path.join(os.tmpdir(), `ollama_output_${timestamp}.txt`);
  
  await writeFile(tempPromptFile, prompt);
  
  return new Promise((resolve, reject) => {
    // Chamar ollama com o modelo especificado
    const process = spawn('ollama', ['run', model], {
      stdio: ['pipe', 'pipe', 'pipe']
    });
    
    let output = '';
    
    // Escrever o prompt no stdin do processo
    process.stdin.write(prompt);
    process.stdin.end();
    
    process.stdout.on('data', (data) => {
      output += data.toString();
    });
    
    process.on('error', (err) => {
      reject(new Error(`Erro ao executar Ollama: ${err.message}`));
    });
    
    process.on('close', async (code) => {
      try {
        await writeFile(tempOutputFile, output);
        
        if (code === 0) {
          resolve(output.trim());
        } else {
          reject(new Error(`Falha ao gerar texto com Ollama (código de saída: ${code})`));
        }
      } catch (err) {
        reject(err);
      } finally {
        // Limpeza dos arquivos temporários
        try {
          await Promise.all([
            tempPromptFile, 
            tempOutputFile
          ].map(file => readFile(file).catch(() => {})));
        } catch (e) {
          // Ignorar erros de limpeza
        }
      }
    });
  });
}

/**
 * Gera texto usando a API da Hugging Face
 * @param options Opções para geração de texto
 * @returns Resultado da geração
 */
export async function generateWithHuggingFace(options: HuggingFaceOptions): Promise<HuggingFaceResult> {
  const { 
    model = HuggingFaceModel.BLENDER_BOT, 
    prompt, 
    maxTokens = 100, 
    temperature = 0.7,
    apiKey 
  } = options;
  
  // Verificar se temos uma API key
  if (!apiKey) {
    // Tentar usar Ollama localmente como alternativa
    try {
      const isOllamaAvailable = await checkOllamaAvailability();
      if (isOllamaAvailable) {
        // Se Ollama está disponível, usar modelo local
        const ollamaModel = 'llama2'; // Modelo padrão, pode ser configurado
        const text = await generateWithOllama(ollamaModel, prompt);
        return { 
          text, 
          model: `ollama/${ollamaModel}`
        };
      }
    } catch (error) {
      console.error('Erro ao verificar disponibilidade do Ollama:', error);
    }
    
    // Se não temos API key e Ollama não está disponível, retornar resposta de fallback
    return { 
      text: `Não foi possível gerar texto pois não há API key da Hugging Face configurada e não foi possível usar o Ollama localmente. Instale o Ollama ou configure uma API key para usar essa funcionalidade.

Como alternativa simplificada, aqui está uma resposta genérica:

${prompt}

Esta é uma resposta genérica para sua solicitação. Para respostas mais elaboradas, configure uma API key da Hugging Face ou instale o Ollama.`,
      model: 'fallback',
      error: 'No API key and no local models available'
    };
  }
  
  try {
    // Chamar a API da Hugging Face
    const response = await axios.post(
      `https://api-inference.huggingface.co/models/${model}`,
      {
        inputs: prompt,
        parameters: {
          max_new_tokens: maxTokens,
          temperature: temperature,
          do_sample: temperature > 0,
          return_full_text: false
        }
      },
      {
        headers: {
          'Authorization': `Bearer ${apiKey}`,
          'Content-Type': 'application/json'
        }
      }
    );
    
    // Processar resposta
    if (response.data && Array.isArray(response.data) && response.data.length > 0) {
      // A resposta pode variar dependendo do modelo
      let generatedText = '';
      
      if (typeof response.data[0] === 'string') {
        generatedText = response.data[0];
      } else if (response.data[0].generated_text) {
        generatedText = response.data[0].generated_text;
      } else if (response.data[0].text) {
        generatedText = response.data[0].text;
      }
      
      return {
        text: generatedText.trim(),
        model: model.toString()
      };
    }
    
    // Resposta inesperada
    return {
      text: 'Não foi possível processar a resposta do modelo.',
      model: model.toString(),
      error: 'Unexpected API response format'
    };
  } catch (error) {
    console.error('Erro ao chamar a API da Hugging Face:', error);
    
    return {
      text: `Erro ao gerar texto: ${error.message}`,
      model: model.toString(),
      error: error.message
    };
  }
}

/**
 * Função simplificada para geração de texto
 * Tenta usar as diferentes opções disponíveis, com fallbacks automáticos
 */
export async function generateAIText(
  prompt: string, 
  options: { 
    maxTokens?: number; 
    temperature?: number; 
    apiKey?: string;
    model?: string;
  } = {}
): Promise<string> {
  // Primeiro tenta usar a OpenAI se disponível
  try {
    const { openai } = await import('./openai');
    
    const response = await openai.chat.completions.create({
      model: "gpt-4o", // o modelo mais recente da OpenAI é "gpt-4o" lançado em 13 de maio de 2024
      messages: [{ role: "user", content: prompt }],
      max_tokens: options.maxTokens || 500,
      temperature: options.temperature || 0.7,
    });
    
    if (response.choices && response.choices.length > 0) {
      return response.choices[0].message.content || '';
    }
  } catch (error) {
    console.log('Fallback para Hugging Face ou Ollama devido a:', error.message);
    // Se OpenAI falhar, continuar com as alternativas
  }
  
  // Tentar Hugging Face ou Ollama como alternativa
  const result = await generateWithHuggingFace({
    prompt,
    maxTokens: options.maxTokens,
    temperature: options.temperature,
    apiKey: options.apiKey,
    model: options.model
  });
  
  return result.text;
}

// Exportar um serviço singleton para uso em toda a aplicação
export const huggingfaceService = {
  generateText: generateWithHuggingFace,
  generateSimple: generateAIText,
  checkOllama: checkOllamaAvailability
};
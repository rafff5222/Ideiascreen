import { createClient } from 'pexels';
import axios from 'axios';
import fs from 'fs/promises';
import path from 'path';
import crypto from 'crypto';

// Diretório para armazenar imagens baixadas
const IMAGES_DIR = path.join(process.cwd(), 'tmp', 'images');

// Garantir que o diretório de imagens exista
async function ensureImageDirectoryExists() {
  try {
    await fs.access(IMAGES_DIR);
  } catch (e) {
    // Diretório não existe, criar
    await fs.mkdir(IMAGES_DIR, { recursive: true });
  }
}

/**
 * Busca imagens relacionadas a um tópico específico
 * @param topic Tópico para busca de imagens
 * @param count Quantidade de imagens para buscar
 * @returns Lista de URLs das imagens
 */
export async function searchImages(topic: string, count: number = 5): Promise<string[]> {
  // Verificar se uma chave API foi fornecida
  const pexelsApiKey = process.env.PEXELS_API_KEY;
  
  // Se não houver chave API, retornar URLs de placeholder
  if (!pexelsApiKey) {
    console.log('Chave API do Pexels não encontrada, usando placeholders');
    return generatePlaceholderImageUrls(topic, count);
  }
  
  try {
    // Criar cliente do Pexels
    const client = createClient(pexelsApiKey);
    
    // Buscar fotos relacionadas ao tópico
    const response: any = await client.photos.search({ 
      query: topic, 
      per_page: count,
      orientation: 'landscape'
    });
    
    // Extrair URLs das imagens em tamanho médio
    const imageUrls = response.photos.map((photo: any) => photo.src.medium);
    
    console.log(`Encontradas ${imageUrls.length} imagens para o tópico "${topic}"`);
    return imageUrls;
  } catch (error) {
    console.error('Erro ao buscar imagens no Pexels:', error);
    // Em caso de erro, retornar placeholder images
    return generatePlaceholderImageUrls(topic, count);
  }
}

/**
 * Baixa uma imagem de uma URL e a salva localmente
 * @param imageUrl URL da imagem para baixar
 * @returns Caminho local da imagem baixada
 */
export async function downloadImage(imageUrl: string): Promise<string> {
  await ensureImageDirectoryExists();
  
  try {
    // Gerar nome único para a imagem
    const imageName = `${crypto.randomUUID()}.jpg`;
    const imagePath = path.join(IMAGES_DIR, imageName);
    
    // Baixar a imagem
    const response = await axios({
      method: 'GET',
      url: imageUrl,
      responseType: 'arraybuffer'
    });
    
    // Salvar no sistema de arquivos
    await fs.writeFile(imagePath, response.data);
    
    console.log(`Imagem baixada com sucesso: ${imagePath}`);
    return imagePath;
  } catch (error) {
    console.error('Erro ao baixar imagem:', error);
    throw new Error(`Falha ao baixar imagem de ${imageUrl}: ${error.message}`);
  }
}

/**
 * Baixa múltiplas imagens de URLs e retorna os caminhos locais
 * @param imageUrls Lista de URLs de imagens para baixar
 * @returns Lista de caminhos locais das imagens baixadas
 */
export async function downloadMultipleImages(imageUrls: string[]): Promise<string[]> {
  try {
    // Baixar imagens em paralelo
    const downloadPromises = imageUrls.map(url => downloadImage(url));
    const localPaths = await Promise.all(downloadPromises);
    
    return localPaths;
  } catch (error) {
    console.error('Erro ao baixar múltiplas imagens:', error);
    throw error;
  }
}

/**
 * Gera URLs de imagens placeholder usando serviços como Picsum
 * @param topic Tópico para incluir como parâmetro de busca
 * @param count Quantidade de URLs a gerar
 * @returns Lista de URLs de imagens placeholder
 */
function generatePlaceholderImageUrls(topic: string, count: number): string[] {
  // Usando Lorem Picsum para gerar placeholders
  return Array.from({ length: count }, (_, i) => 
    `https://picsum.photos/800/450?random=${i+1}`
  );
}
import fetch from 'node-fetch';

// Verificar se a API key está definida
const PEXELS_API_KEY = process.env.PEXELS_API_KEY;

// Interface para imagens retornadas pelo Pexels
interface PexelsPhoto {
  id: number;
  width: number;
  height: number;
  url: string;
  photographer: string;
  photographer_url: string;
  photographer_id: number;
  avg_color: string;
  src: {
    original: string;
    large2x: string;
    large: string;
    medium: string;
    small: string;
    portrait: string;
    landscape: string;
    tiny: string;
  };
  liked: boolean;
  alt: string;
}

interface PexelsResponse {
  page: number;
  per_page: number;
  photos: PexelsPhoto[];
  total_results: number;
  next_page: string;
}

// Interface para respostas de vídeo da API Pexels
interface PexelsVideoResponse {
  page: number;
  per_page: number;
  total_results: number;
  videos: {
    id: number;
    width: number;
    height: number;
    url: string;
    image: string;
    duration: number;
    user: {
      id: number;
      name: string;
      url: string;
    };
    video_files: {
      id: number;
      quality: string;
      file_type: string;
      width: number;
      height: number;
      link: string;
    }[];
  }[];
}

/**
 * Busca imagens na API do Pexels com base no tópico fornecido
 * @param topic Tópico para busca de imagens
 * @param count Número de imagens a serem retornadas
 * @returns Array com informações das imagens
 */
export async function searchImages(topic: string, count: number = 10): Promise<any[]> {
  if (!PEXELS_API_KEY) {
    console.error('PEXELS_API_KEY não está definida no ambiente');
    throw new Error('API key do Pexels não configurada');
  }

  try {
    const url = `https://api.pexels.com/v1/search?query=${encodeURIComponent(topic)}&per_page=${count}&locale=pt-BR`;
    
    const response = await fetch(url, {
      headers: {
        'Authorization': PEXELS_API_KEY
      }
    });

    if (!response.ok) {
      throw new Error(`Erro na API do Pexels: ${response.status} ${response.statusText}`);
    }

    const data = await response.json() as PexelsResponse;
    
    // Mapear os resultados para um formato simplificado
    return data.photos.map(photo => ({
      id: photo.id,
      src: photo.src.large,
      thumbnail: photo.src.medium,
      small: photo.src.small,
      original: photo.src.original,
      alt: photo.alt || `Imagem relacionada a ${topic}`,
      source: 'Pexels',
      photographer: photo.photographer,
      url: photo.url
    }));
  } catch (error: any) {
    console.error('Erro ao buscar imagens do Pexels:', error);
    throw new Error(`Falha ao buscar imagens: ${error.message}`);
  }
}

/**
 * Busca um vídeo aleatório na API do Pexels com base no tópico fornecido
 * @param topic Tópico para busca de vídeos
 * @returns Informações do vídeo
 */
export async function getRandomVideo(topic: string): Promise<any> {
  if (!PEXELS_API_KEY) {
    throw new Error('API key do Pexels não configurada');
  }

  try {
    const url = `https://api.pexels.com/videos/search?query=${encodeURIComponent(topic)}&per_page=1&locale=pt-BR`;
    
    const response = await fetch(url, {
      headers: {
        'Authorization': PEXELS_API_KEY
      }
    });

    if (!response.ok) {
      throw new Error(`Erro na API do Pexels: ${response.status} ${response.statusText}`);
    }

    const data = await response.json() as PexelsVideoResponse;
    
    if (!data.videos || data.videos.length === 0) {
      throw new Error('Nenhum vídeo encontrado');
    }
    
    return {
      id: data.videos[0].id,
      url: data.videos[0].url,
      image: data.videos[0].image,
      duration: data.videos[0].duration,
      videoFiles: data.videos[0].video_files
    };
  } catch (error: any) {
    console.error('Erro ao buscar vídeo do Pexels:', error);
    throw new Error(`Falha ao buscar vídeo: ${error.message}`);
  }
}

/**
 * Verifica se a API do Pexels está funcionando corretamente
 * @returns Status da API
 */
export async function checkApiStatus(): Promise<{ working: boolean; status: string; }> {
  if (!PEXELS_API_KEY) {
    return { 
      working: false, 
      status: 'API key do Pexels não configurada'
    };
  }

  try {
    // Usando uma busca simples para verificar o status
    const url = 'https://api.pexels.com/v1/search?query=nature&per_page=1';
    
    const response = await fetch(url, {
      headers: {
        'Authorization': PEXELS_API_KEY
      }
    });

    if (response.ok) {
      const data = await response.json() as PexelsResponse;
      return { 
        working: true, 
        status: `API funcionando, ${data.total_results} resultados disponíveis para "nature"` 
      };
    } else {
      return { 
        working: false, 
        status: `Erro na API: ${response.status} ${response.statusText}` 
      };
    }
  } catch (error: any) {
    return { 
      working: false, 
      status: `Erro de conexão: ${error.message}` 
    };
  }
}
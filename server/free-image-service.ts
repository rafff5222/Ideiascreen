/**
 * Serviço de busca de imagens e vídeos usando APIs gratuitas como alternativa ao Pexels
 * Suporta Pixabay e Unsplash que oferecem planos gratuitos com limites generosos
 */

import axios from 'axios';

// Tipos de serviços de imagem
export enum ImageServiceType {
  PIXABAY = 'pixabay',
  UNSPLASH = 'unsplash',
  PEXELS = 'pexels'
}

// Opções de busca
interface SearchOptions {
  query: string;
  count?: number;
  page?: number;
  orientation?: 'landscape' | 'portrait' | 'all';
  minWidth?: number;
  minHeight?: number;
  apiKey?: string;
}

interface ImageResult {
  id: string;
  width: number;
  height: number;
  url: string;
  previewUrl: string;
  originalUrl: string;
  photographer: string;
  photographerUrl: string;
  description: string;
  source: ImageServiceType;
}

interface VideoResult {
  id: string;
  width: number;
  height: number;
  url: string;
  previewUrl: string;
  videoUrl: string;
  duration: number;
  user: {
    name: string;
    url: string;
  };
  source: ImageServiceType;
}

/**
 * Busca imagens no Pixabay
 * API gratuita com limite de 5.000 requisições por hora/dia
 * https://pixabay.com/api/docs/
 */
export async function searchPixabayImages(options: SearchOptions): Promise<ImageResult[]> {
  const { 
    query, 
    count = 10, 
    page = 1, 
    orientation = 'all',
    minWidth = 0,
    minHeight = 0,
    apiKey 
  } = options;
  
  if (!apiKey) {
    console.warn('API key do Pixabay não fornecida. Use search() para alternativas automáticas.');
    return [];
  }
  
  try {
    const response = await axios.get('https://pixabay.com/api/', {
      params: {
        key: apiKey,
        q: query,
        per_page: count,
        page,
        orientation: orientation === 'all' ? undefined : orientation,
        min_width: minWidth > 0 ? minWidth : undefined,
        min_height: minHeight > 0 ? minHeight : undefined,
        image_type: 'photo',
        safesearch: true
      }
    });
    
    if (response.data && response.data.hits) {
      return response.data.hits.map((hit: any) => ({
        id: hit.id.toString(),
        width: hit.imageWidth,
        height: hit.imageHeight,
        url: hit.pageURL,
        previewUrl: hit.webformatURL,
        originalUrl: hit.largeImageURL,
        photographer: hit.user,
        photographerUrl: hit.userImageURL,
        description: hit.tags,
        source: ImageServiceType.PIXABAY
      }));
    }
    
    return [];
  } catch (error) {
    console.error('Erro ao buscar imagens no Pixabay:', error);
    return [];
  }
}

/**
 * Busca vídeos no Pixabay
 * Também gratuito com os mesmos limites
 */
export async function searchPixabayVideos(options: SearchOptions): Promise<VideoResult[]> {
  const { 
    query, 
    count = 10, 
    page = 1,
    apiKey 
  } = options;
  
  if (!apiKey) {
    console.warn('API key do Pixabay não fornecida. Use searchVideos() para alternativas automáticas.');
    return [];
  }
  
  try {
    const response = await axios.get('https://pixabay.com/api/videos/', {
      params: {
        key: apiKey,
        q: query,
        per_page: count,
        page
      }
    });
    
    if (response.data && response.data.hits) {
      return response.data.hits.map((hit: any) => {
        // Encontrar a melhor versão do vídeo disponível
        const videos = hit.videos;
        const bestVideo = videos.large || videos.medium || videos.small || videos.tiny;
        
        return {
          id: hit.id.toString(),
          width: bestVideo?.width || 0,
          height: bestVideo?.height || 0,
          url: hit.pageURL,
          previewUrl: hit.pictureId ? `https://i.vimeocdn.com/video/${hit.pictureId}_640x360.jpg` : '',
          videoUrl: bestVideo?.url || '',
          duration: 0, // Pixabay não fornece duração
          user: {
            name: hit.user,
            url: hit.userImageURL
          },
          source: ImageServiceType.PIXABAY
        };
      });
    }
    
    return [];
  } catch (error) {
    console.error('Erro ao buscar vídeos no Pixabay:', error);
    return [];
  }
}

/**
 * Busca imagens no Unsplash
 * API gratuita com limite de 50 requisições por hora
 * https://unsplash.com/documentation
 */
export async function searchUnsplashImages(options: SearchOptions): Promise<ImageResult[]> {
  const { 
    query, 
    count = 10, 
    page = 1, 
    orientation = 'all',
    apiKey 
  } = options;
  
  if (!apiKey) {
    console.warn('API key do Unsplash não fornecida. Use search() para alternativas automáticas.');
    return [];
  }
  
  try {
    const response = await axios.get('https://api.unsplash.com/search/photos', {
      params: {
        query,
        per_page: count,
        page,
        orientation: orientation === 'all' ? undefined : orientation
      },
      headers: {
        'Authorization': `Client-ID ${apiKey}`
      }
    });
    
    if (response.data && response.data.results) {
      return response.data.results.map((photo: any) => ({
        id: photo.id,
        width: photo.width,
        height: photo.height,
        url: photo.links.html,
        previewUrl: photo.urls.small,
        originalUrl: photo.urls.full,
        photographer: photo.user.name,
        photographerUrl: photo.user.links.html,
        description: photo.description || photo.alt_description || '',
        source: ImageServiceType.UNSPLASH
      }));
    }
    
    return [];
  } catch (error) {
    console.error('Erro ao buscar imagens no Unsplash:', error);
    return [];
  }
}

/**
 * Busca imagens em vários serviços, com fallback automático
 * Tenta primeiramente o Pexels, depois Unsplash, depois Pixabay
 */
export async function searchImages(options: {
  query: string;
  count?: number;
  orientation?: 'landscape' | 'portrait' | 'all';
  pexelsApiKey?: string;
  unsplashApiKey?: string;
  pixabayApiKey?: string;
  preferredService?: ImageServiceType;
}): Promise<ImageResult[]> {
  const { 
    query, 
    count = 10, 
    orientation = 'all',
    pexelsApiKey, 
    unsplashApiKey, 
    pixabayApiKey,
    preferredService = ImageServiceType.PEXELS
  } = options;
  
  // Lista de serviços a tentar, na ordem de preferência
  let services = [
    { type: ImageServiceType.PEXELS, key: pexelsApiKey },
    { type: ImageServiceType.UNSPLASH, key: unsplashApiKey },
    { type: ImageServiceType.PIXABAY, key: pixabayApiKey }
  ];
  
  // Reordenar baseado na preferência do usuário
  if (preferredService !== ImageServiceType.PEXELS) {
    services = services.sort((a, b) => {
      if (a.type === preferredService) return -1;
      if (b.type === preferredService) return 1;
      return 0;
    });
  }
  
  // Filtrar serviços sem chave
  const availableServices = services.filter(service => service.key);
  
  if (availableServices.length === 0) {
    console.warn('Nenhuma API key fornecida para serviços de imagem. Retornando lista vazia.');
    return [];
  }
  
  // Tentar cada serviço em ordem
  for (const service of availableServices) {
    try {
      let results: ImageResult[] = [];
      
      switch (service.type) {
        case ImageServiceType.PEXELS:
          // Importar dinamicamente o serviço Pexels
          const { searchImages } = await import('./pexels-service');
          results = await searchImages(query, count)
            .then(items => items.map(item => ({
              id: item.id.toString(),
              width: item.width,
              height: item.height,
              url: item.url,
              previewUrl: item.src.medium,
              originalUrl: item.src.original,
              photographer: item.photographer,
              photographerUrl: item.photographer_url,
              description: item.alt || '',
              source: ImageServiceType.PEXELS
            })))
            .catch(error => {
              console.error('Erro ao buscar imagens no Pexels:', error);
              return [];
            });
          break;
          
        case ImageServiceType.UNSPLASH:
          results = await searchUnsplashImages({
            query,
            count,
            orientation,
            apiKey: service.key
          });
          break;
          
        case ImageServiceType.PIXABAY:
          results = await searchPixabayImages({
            query,
            count,
            orientation,
            apiKey: service.key
          });
          break;
      }
      
      if (results.length > 0) {
        return results;
      }
    } catch (error) {
      console.error(`Erro ao buscar imagens em ${service.type}:`, error);
      // Continue para o próximo serviço
    }
  }
  
  // Nenhum serviço funcionou
  return [];
}

/**
 * Busca vídeos em vários serviços, com fallback automático
 */
export async function searchVideos(options: {
  query: string;
  count?: number;
  pexelsApiKey?: string;
  pixabayApiKey?: string;
  preferredService?: ImageServiceType;
}): Promise<VideoResult[]> {
  const { 
    query, 
    count = 10,
    pexelsApiKey, 
    pixabayApiKey,
    preferredService = ImageServiceType.PEXELS
  } = options;
  
  // Lista de serviços a tentar, na ordem de preferência
  let services = [
    { type: ImageServiceType.PEXELS, key: pexelsApiKey },
    { type: ImageServiceType.PIXABAY, key: pixabayApiKey }
  ];
  
  // Reordenar baseado na preferência do usuário
  if (preferredService !== ImageServiceType.PEXELS) {
    services = services.sort((a, b) => {
      if (a.type === preferredService) return -1;
      if (b.type === preferredService) return 1;
      return 0;
    });
  }
  
  // Filtrar serviços sem chave
  const availableServices = services.filter(service => service.key);
  
  if (availableServices.length === 0) {
    console.warn('Nenhuma API key fornecida para serviços de vídeo. Retornando lista vazia.');
    return [];
  }
  
  // Tentar cada serviço em ordem
  for (const service of availableServices) {
    try {
      let results: VideoResult[] = [];
      
      switch (service.type) {
        case ImageServiceType.PEXELS:
          // Importar dinamicamente o serviço Pexels
          const { getRandomVideo } = await import('./pexels-service');
          const video = await getRandomVideo(query).catch(() => null);
          
          if (video) {
            // Encontrar o melhor arquivo de vídeo disponível
            const bestVideoFile = video.video_files.reduce((best, current) => {
              if (!best || current.width > best.width) {
                return current;
              }
              return best;
            }, null);
            
            results = [{
              id: video.id.toString(),
              width: video.width,
              height: video.height,
              url: video.url,
              previewUrl: video.image,
              videoUrl: bestVideoFile?.link || '',
              duration: video.duration,
              user: {
                name: video.user.name,
                url: video.user.url
              },
              source: ImageServiceType.PEXELS
            }];
          }
          break;
          
        case ImageServiceType.PIXABAY:
          results = await searchPixabayVideos({
            query,
            count,
            apiKey: service.key
          });
          break;
      }
      
      if (results.length > 0) {
        return results;
      }
    } catch (error) {
      console.error(`Erro ao buscar vídeos em ${service.type}:`, error);
      // Continue para o próximo serviço
    }
  }
  
  // Nenhum serviço funcionou
  return [];
}

// Exportar um serviço singleton para uso em toda a aplicação
export const freeImageService = {
  searchImages,
  searchVideos,
  searchPixabayImages,
  searchPixabayVideos,
  searchUnsplashImages
};
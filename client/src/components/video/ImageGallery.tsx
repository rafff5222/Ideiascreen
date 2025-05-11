import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Loader2, Search, Image, Check, Download, X } from 'lucide-react';
import { apiRequest } from '@/lib/queryClient';
import { useToast } from '@/hooks/use-toast';

interface ImageItem {
  id: string;
  url: string;
  thumbnail: string;
  alt: string;
  source: string;
}

interface ImageGalleryProps {
  onSelectImages: (images: ImageItem[]) => void;
  initialTopic?: string;
  maxImages?: number;
}

export default function ImageGallery({ 
  onSelectImages,
  initialTopic = '',
  maxImages = 5
}: ImageGalleryProps) {
  const [searchTerm, setSearchTerm] = useState(initialTopic);
  const [isSearching, setIsSearching] = useState(false);
  const [images, setImages] = useState<ImageItem[]>([]);
  const [selectedImages, setSelectedImages] = useState<ImageItem[]>([]);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  // Buscar imagens quando o componente montar se houver um tópico inicial
  useEffect(() => {
    if (initialTopic) {
      handleSearch();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Buscar imagens da API
  const handleSearch = async () => {
    if (!searchTerm.trim()) {
      setError("Digite um tema para buscar imagens");
      return;
    }

    setIsSearching(true);
    setError(null);

    try {
      const response = await apiRequest('GET', `/api/search-images?topic=${encodeURIComponent(searchTerm)}&count=12`);
      const data = await response.json();

      if (data.success) {
        // Transformar os URLs em objetos de imagem
        const imageObjects: ImageItem[] = data.imageUrls.map((url: string, index: number) => ({
          id: `img-${index}-${Date.now()}`,
          url: url,
          thumbnail: url,
          alt: `${searchTerm} imagem ${index + 1}`,
          source: 'Pexels'
        }));
        
        setImages(imageObjects);
        
        if (imageObjects.length === 0) {
          setError("Nenhuma imagem encontrada para este tema");
        }
      } else {
        setError(data.error || "Erro ao buscar imagens");
      }
    } catch (err) {
      console.error('Erro ao buscar imagens:', err);
      setError("Falha na comunicação com o servidor");
    } finally {
      setIsSearching(false);
    }
  };

  // Selecionar ou deselecionar uma imagem
  const toggleImageSelection = (image: ImageItem) => {
    const isSelected = selectedImages.some(img => img.id === image.id);
    
    if (isSelected) {
      // Remover imagem da seleção
      setSelectedImages(prev => prev.filter(img => img.id !== image.id));
    } else {
      // Verificar se já atingiu o limite máximo
      if (selectedImages.length >= maxImages) {
        toast({
          title: 'Limite atingido',
          description: `Você já selecionou ${maxImages} imagens, que é o máximo permitido.`,
          variant: 'destructive',
        });
        return;
      }
      
      // Adicionar imagem à seleção
      setSelectedImages(prev => [...prev, image]);
    }
  };

  // Confirmar a seleção de imagens
  const confirmSelection = () => {
    onSelectImages(selectedImages);
    toast({
      title: 'Imagens selecionadas',
      description: `${selectedImages.length} imagens foram adicionadas ao seu vídeo.`,
    });
  };

  // Limpar seleção
  const clearSelection = () => {
    setSelectedImages([]);
  };

  return (
    <Card className="w-full">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg flex items-center gap-2">
          <Image className="h-5 w-5 text-primary" />
          Galeria de Imagens
        </CardTitle>
        <CardDescription>
          Busque e selecione imagens para seu vídeo
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Busca */}
        <div className="flex gap-2">
          <Input
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Digite um tema para buscar imagens..."
            className="flex-1"
            onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
          />
          <Button 
            onClick={handleSearch} 
            disabled={isSearching}
            variant="outline"
          >
            {isSearching ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Search className="h-4 w-4" />
            )}
          </Button>
        </div>

        {/* Mensagem de erro */}
        {error && (
          <div className="text-red-500 text-sm flex items-center gap-1.5">
            <X className="h-4 w-4" />
            <span>{error}</span>
          </div>
        )}

        {/* Contador de seleção */}
        {selectedImages.length > 0 && (
          <div className="bg-primary/10 text-primary text-sm rounded-md p-2 flex justify-between items-center">
            <span>
              {selectedImages.length} de {maxImages} imagens selecionadas
            </span>
            <div className="flex gap-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={clearSelection}
              >
                Limpar
              </Button>
              <Button
                size="sm"
                onClick={confirmSelection}
              >
                Confirmar
              </Button>
            </div>
          </div>
        )}

        {/* Grid de imagens */}
        {images.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2">
            {images.map((image) => {
              const isSelected = selectedImages.some(img => img.id === image.id);
              
              return (
                <div
                  key={image.id}
                  className={`relative aspect-video rounded-md overflow-hidden cursor-pointer transition-all border-2 ${
                    isSelected ? 'border-primary ring-2 ring-primary/20' : 'border-transparent hover:border-gray-300'
                  }`}
                  onClick={() => toggleImageSelection(image)}
                >
                  <img
                    src={image.thumbnail}
                    alt={image.alt}
                    className="w-full h-full object-cover"
                  />
                  {isSelected && (
                    <div className="absolute top-1 right-1 bg-primary text-white rounded-full p-1">
                      <Check className="h-3.5 w-3.5" />
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        ) : !isSearching && !error ? (
          <div className="bg-gray-50 rounded-md p-6 text-center text-gray-500">
            <Image className="h-10 w-10 mx-auto mb-2 text-gray-300" />
            <p>
              Busque por um tema para encontrar imagens
            </p>
            <p className="text-xs mt-1">
              Imagens fornecidas pela API Pexels
            </p>
          </div>
        ) : null}

        {/* Estado de carregamento */}
        {isSearching && (
          <div className="flex justify-center py-8">
            <div className="flex flex-col items-center">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
              <p className="mt-2 text-sm text-gray-500">
                Buscando imagens relacionadas a "{searchTerm}"...
              </p>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
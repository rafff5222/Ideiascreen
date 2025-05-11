import { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Separator } from '@/components/ui/separator';
import { Checkbox } from '@/components/ui/checkbox';
import { Loader2, Search, Image as ImageIcon } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';

// Interface para representar uma imagem
export interface ImageItem {
  id: string;
  url: string;
  thumbnail: string;
  alt: string;
  source: string;
}

// Props do componente
interface ImageGalleryProps {
  onSelectImages: (images: ImageItem[]) => void;
  initialTopic?: string;
  maxImages?: number;
}

export default function ImageGallery({ 
  onSelectImages, 
  initialTopic = '', 
  maxImages = 10 
}: ImageGalleryProps) {
  // Estados
  const [searchTerm, setSearchTerm] = useState<string>(initialTopic);
  const [isSearching, setIsSearching] = useState<boolean>(false);
  const [images, setImages] = useState<ImageItem[]>([]);
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [error, setError] = useState<string | null>(null);
  
  const { toast } = useToast();
  
  // Efeito para carregar imagens iniciais com o tópico fornecido
  useEffect(() => {
    if (initialTopic) {
      setSearchTerm(initialTopic);
      searchImages(initialTopic);
    }
  }, [initialTopic]);
  
  // Função para buscar imagens
  const searchImages = async (topic: string) => {
    if (!topic.trim()) {
      setError("Digite um tema para buscar imagens");
      return;
    }
    
    setIsSearching(true);
    setError(null);
    
    try {
      const response = await fetch(`/api/search-images?topic=${encodeURIComponent(topic)}&count=20`);
      
      if (!response.ok) {
        throw new Error("Falha ao buscar imagens");
      }
      
      const data = await response.json();
      
      if (!data.success) {
        throw new Error(data.error || "Erro ao buscar imagens");
      }
      
      // Transformar os dados recebidos em objetos ImageItem
      const imageItems = data.imageUrls.map((item: any, index: number) => ({
        id: `${item.id || index}`,
        url: item.src || item.url || item.original || "",
        thumbnail: item.thumbnail || item.small || item.src || item.url || "",
        alt: item.alt || item.description || `Imagem para ${topic}`,
        source: item.source || "Pexels"
      }));
      
      setImages(imageItems);
      
      // Se não encontrou imagens
      if (imageItems.length === 0) {
        setError("Nenhuma imagem encontrada para este tema");
      }
    } catch (err: any) {
      console.error("Erro ao buscar imagens:", err);
      setError(err.message || "Erro ao buscar imagens");
      toast({
        title: "Erro",
        description: "Não foi possível buscar imagens. Tente novamente.",
        variant: "destructive"
      });
    } finally {
      setIsSearching(false);
    }
  };
  
  // Manipulador para seleção de imagem
  const toggleImageSelection = (image: ImageItem) => {
    const newSelectedIds = new Set(selectedIds);
    
    if (newSelectedIds.has(image.id)) {
      newSelectedIds.delete(image.id);
    } else {
      // Verificar se já atingiu o limite de seleção
      if (newSelectedIds.size >= maxImages) {
        toast({
          title: "Limite atingido",
          description: `Você pode selecionar no máximo ${maxImages} imagens.`,
          variant: "destructive"
        });
        return;
      }
      newSelectedIds.add(image.id);
    }
    
    setSelectedIds(newSelectedIds);
    
    // Passar as imagens selecionadas para o callback
    const selectedImages = images.filter(img => newSelectedIds.has(img.id));
    onSelectImages(selectedImages);
  };
  
  // Manipulador para busca
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    searchImages(searchTerm);
  };
  
  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <ImageIcon className="h-5 w-5" />
          Banco de Imagens
        </CardTitle>
        <CardDescription>
          Busque e selecione imagens para seu vídeo
        </CardDescription>
      </CardHeader>
      
      <CardContent>
        {/* Formulário de busca */}
        <form onSubmit={handleSearch} className="flex gap-2 mb-4">
          <Input
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Digite um tema para buscar imagens..."
            className="flex-1"
          />
          <Button type="submit" disabled={isSearching}>
            {isSearching ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <Search className="h-4 w-4 mr-2" />}
            Buscar
          </Button>
        </form>
        
        {/* Status de seleção */}
        <div className="flex items-center justify-between mb-3">
          <p className="text-sm text-muted-foreground">
            {selectedIds.size > 0 
              ? `${selectedIds.size} ${selectedIds.size === 1 ? 'imagem selecionada' : 'imagens selecionadas'}`
              : 'Selecione as imagens para seu vídeo'}
          </p>
          {selectedIds.size > 0 && (
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => {
                setSelectedIds(new Set());
                onSelectImages([]);
              }}
            >
              Limpar seleção
            </Button>
          )}
        </div>
        
        <Separator className="my-2" />
        
        {/* Mensagem de erro */}
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 p-3 rounded-md mb-3">
            <p className="text-sm">{error}</p>
          </div>
        )}
        
        {/* Grid de imagens */}
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mt-3">
          {isSearching ? (
            // Estado de carregamento
            <>
              {[1, 2, 3, 4, 5, 6].map(num => (
                <div 
                  key={num} 
                  className="aspect-video bg-muted animate-pulse rounded-md"
                />
              ))}
            </>
          ) : (
            // Exibir imagens carregadas
            <>
              {images.map(image => (
                <div 
                  key={image.id}
                  className={`relative aspect-video rounded-md overflow-hidden border-2 
                    ${selectedIds.has(image.id) 
                      ? 'border-primary ring-2 ring-primary ring-opacity-50' 
                      : 'border-transparent hover:border-gray-300'} 
                    transition-all cursor-pointer`}
                  onClick={() => toggleImageSelection(image)}
                >
                  {/* Imagem */}
                  <img 
                    src={image.thumbnail} 
                    alt={image.alt}
                    className="w-full h-full object-cover"
                    loading="lazy"
                  />
                  
                  {/* Checkbox de seleção */}
                  <div className="absolute top-2 left-2">
                    <Checkbox 
                      checked={selectedIds.has(image.id)}
                      className="h-5 w-5 bg-white/90 border-primary"
                    />
                  </div>
                  
                  {/* Badge da fonte */}
                  <Badge 
                    variant="secondary" 
                    className="absolute bottom-2 right-2 bg-black/60 text-white text-xs"
                  >
                    {image.source}
                  </Badge>
                </div>
              ))}
            </>
          )}
        </div>
        
        {/* Mensagem de resultado vazio */}
        {!isSearching && images.length === 0 && !error && (
          <div className="flex flex-col items-center justify-center py-8 text-center">
            <ImageIcon className="h-12 w-12 text-muted-foreground mb-2" />
            <p className="text-muted-foreground">
              Busque um tema para encontrar imagens
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
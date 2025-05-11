import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';

export default function VideoPreview() {
  const [videoUrl, setVideoUrl] = useState<string>('');
  const [previewUrl, setPreviewUrl] = useState<string>('');
  const { toast } = useToast();

  // Verificar se há parâmetro de URL na inicialização
  React.useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const urlFromParam = urlParams.get('url');
    if (urlFromParam) {
      setVideoUrl(urlFromParam);
      setPreviewUrl(urlFromParam);
    }
  }, []);

  const handlePreview = () => {
    if (!videoUrl.trim()) {
      toast({
        title: "URL obrigatória",
        description: "Por favor, insira a URL do vídeo para pré-visualizar.",
        variant: "destructive",
      });
      return;
    }

    setPreviewUrl(videoUrl);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setVideoUrl(e.target.value);
  };

  return (
    <div className="container mx-auto py-8">
      <Card className="w-full">
        <CardHeader>
          <CardTitle className="text-xl">Pré-visualização de Vídeo</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex space-x-2">
              <Input 
                placeholder="Digite a URL completa do vídeo (ex: /api/video-stream/video_123456.mp4)"
                value={videoUrl}
                onChange={handleInputChange}
                className="flex-1"
              />
              <Button onClick={handlePreview}>Pré-visualizar</Button>
            </div>

            {previewUrl && (
              <div className="mt-4">
                <h3 className="text-lg font-semibold mb-2">Vídeo:</h3>
                <div className="border rounded-md p-4 bg-black">
                  <video 
                    src={previewUrl} 
                    controls
                    className="w-full rounded-md max-h-[500px]"
                    controlsList="nodownload"
                    autoPlay
                  />
                </div>

                <div className="mt-4">
                  <h3 className="text-lg font-semibold mb-2">Detalhes Técnicos:</h3>
                  <div className="border rounded-md p-4 bg-gray-50">
                    <pre className="text-xs overflow-auto whitespace-pre-wrap">
                      URL: {previewUrl}
                    </pre>
                  </div>
                </div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
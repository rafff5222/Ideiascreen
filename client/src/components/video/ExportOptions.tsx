import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { 
  Download, 
  Instagram, 
  Youtube, 
  AlignVerticalDistributeCenter,
  MonitorSmartphone,
  Smartphone,
  Monitor 
} from 'lucide-react';

interface ExportOptionsProps {
  onExport: (platform: string, format: string) => void;
  isLoading?: boolean;
  showExportDetails?: boolean;
}

export default function ExportOptions({ 
  onExport, 
  isLoading = false,
  showExportDetails = false
}: ExportOptionsProps) {
  const [selectedPlatform, setSelectedPlatform] = React.useState('generic');
  const [selectedFormat, setSelectedFormat] = React.useState('mp4');
  
  const handleExport = () => {
    onExport(selectedPlatform, selectedFormat);
  };
  
  // Informações sobre formatos para cada plataforma
  const platformInfo = {
    tiktok: {
      title: 'TikTok',
      icon: <Smartphone className="h-5 w-5" />,
      description: 'Formato vertical otimizado para TikTok (9:16)',
      resolution: '1080x1920',
      maxDuration: '60 segundos recomendado'
    },
    instagram: {
      title: 'Instagram',
      icon: <Instagram className="h-5 w-5" />,
      description: 'Formato quadrado otimizado para Instagram (1:1)',
      resolution: '1080x1080',
      maxDuration: '60 segundos recomendado'
    },
    youtube: {
      title: 'YouTube',
      icon: <Youtube className="h-5 w-5" />,
      description: 'Formato paisagem para YouTube (16:9)',
      resolution: '1920x1080',
      maxDuration: 'Sem limite'
    },
    generic: {
      title: 'Formato Padrão',
      icon: <Monitor className="h-5 w-5" />,
      description: 'Formato paisagem padrão (16:9)',
      resolution: '1280x720',
      maxDuration: 'Sem limite'
    }
  };
  
  return (
    <Card className="h-full">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg flex items-center gap-2">
          <Download className="h-5 w-5 text-primary" />
          Exportar Vídeo
        </CardTitle>
        <CardDescription>
          Escolha o formato ideal para sua plataforma
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label className="text-sm font-medium">Plataforma</Label>
          <RadioGroup 
            value={selectedPlatform} 
            onValueChange={setSelectedPlatform} 
            className="grid grid-cols-2 gap-2"
          >
            {Object.entries(platformInfo).map(([key, info]) => (
              <Label 
                key={key}
                htmlFor={`platform-${key}`}
                className={`flex items-center space-x-2 border rounded-md p-3 cursor-pointer hover:bg-gray-50 transition-colors ${selectedPlatform === key ? 'border-primary bg-primary/5' : 'border-gray-200'}`}
              >
                <RadioGroupItem value={key} id={`platform-${key}`} className="sr-only" />
                <div className="flex items-center gap-2">
                  {info.icon}
                  <span>{info.title}</span>
                </div>
              </Label>
            ))}
          </RadioGroup>
        </div>
        
        {showExportDetails && (
          <>
            <div className="space-y-2">
              <Label className="text-sm font-medium">Formato</Label>
              <RadioGroup 
                value={selectedFormat} 
                onValueChange={setSelectedFormat} 
                className="grid grid-cols-3 gap-2"
              >
                <Label 
                  htmlFor="format-mp4"
                  className={`flex justify-center border rounded-md p-2 cursor-pointer hover:bg-gray-50 transition-colors ${selectedFormat === 'mp4' ? 'border-primary bg-primary/5' : 'border-gray-200'}`}
                >
                  <RadioGroupItem value="mp4" id="format-mp4" className="sr-only" />
                  <span>MP4</span>
                </Label>
                <Label 
                  htmlFor="format-webm"
                  className={`flex justify-center border rounded-md p-2 cursor-pointer hover:bg-gray-50 transition-colors ${selectedFormat === 'webm' ? 'border-primary bg-primary/5' : 'border-gray-200'}`}
                >
                  <RadioGroupItem value="webm" id="format-webm" className="sr-only" />
                  <span>WebM</span>
                </Label>
                <Label 
                  htmlFor="format-gif"
                  className={`flex justify-center border rounded-md p-2 cursor-pointer hover:bg-gray-50 transition-colors ${selectedFormat === 'gif' ? 'border-primary bg-primary/5' : 'border-gray-200'}`}
                >
                  <RadioGroupItem value="gif" id="format-gif" className="sr-only" />
                  <span>GIF</span>
                </Label>
              </RadioGroup>
            </div>
            
            <div className="bg-gray-50 p-3 rounded-md">
              <h3 className="text-sm font-medium mb-1">Especificações</h3>
              <div className="space-y-1">
                <p className="text-xs text-gray-600">
                  <span className="font-medium">Resolução:</span> {platformInfo[selectedPlatform as keyof typeof platformInfo].resolution}
                </p>
                <p className="text-xs text-gray-600">
                  <span className="font-medium">Duração:</span> {platformInfo[selectedPlatform as keyof typeof platformInfo].maxDuration}
                </p>
                <p className="text-xs text-gray-600">
                  <span className="font-medium">Formato:</span> {selectedFormat.toUpperCase()}
                </p>
              </div>
            </div>
          </>
        )}
        
        <Button 
          onClick={handleExport}
          disabled={isLoading}
          className="w-full bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700"
        >
          {isLoading ? (
            <>
              <AlignVerticalDistributeCenter className="mr-2 h-4 w-4 animate-pulse" />
              Exportando...
            </>
          ) : (
            <>
              <Download className="mr-2 h-4 w-4" />
              Exportar Vídeo
            </>
          )}
        </Button>
        
        {!showExportDetails && (
          <div className="bg-blue-50 p-3 rounded-md border border-blue-100">
            <p className="text-xs text-blue-700">
              Seu vídeo será otimizado automaticamente para a plataforma escolhida com as melhores configurações.
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
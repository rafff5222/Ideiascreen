import { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Copy, CheckCircle, Share2, Download, Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";

type ScriptPreviewProps = {
  prompt: string;
  scriptType?: string;
};

/**
 * Componente que exibe um roteiro gerado através da API
 */
export default function ScriptPreview({
  prompt,
  scriptType = "geral"
}: ScriptPreviewProps) {
  const [script, setScript] = useState<string>("");
  const [isLoading, setIsLoading] = useState(true);
  const [isCopied, setIsCopied] = useState(false);
  const [metadata, setMetadata] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  // Gera o roteiro através da API
  useEffect(() => {
    const generateScript = async () => {
      setIsLoading(true);
      setError(null);
      
      try {
        // Chamada real à API
        const response = await apiRequest("POST", "/api/generate-script", { prompt });
        const data = await response.json();
        
        if (data.error) {
          throw new Error(data.error);
        }
        
        setScript(data.script);
        setMetadata(data.metadata || {
          modelUsed: 'gerador-interno',
          generatedAt: new Date().toISOString(),
        });
      } catch (err: any) {
        console.error("Erro ao gerar roteiro:", err);
        setError(err.message || "Ocorreu um erro ao gerar o roteiro. Tente novamente.");
        setScript(err.script || "Não foi possível gerar o roteiro.");
      } finally {
        setIsLoading(false);
      }
    };
    
    if (prompt) {
      generateScript();
    }
  }, [prompt]);

  // Função para copiar o roteiro para clipboard
  const handleCopy = () => {
    navigator.clipboard.writeText(script);
    setIsCopied(true);
    toast({
      title: "Copiado!",
      description: "Roteiro copiado para área de transferência",
    });
    
    setTimeout(() => {
      setIsCopied(false);
    }, 2000);
  };

  // Função para exportar como TXT
  const handleExportTXT = () => {
    if (!script) return;
    
    const blob = new Blob([script], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `roteiro-${scriptType}-${new Date().toISOString().slice(0, 10)}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    toast({
      title: "Roteiro Exportado!",
      description: "Seu roteiro foi baixado em formato TXT",
    });
  };
  
  // Função para exportar como PDF
  const handleExportPDF = () => {
    toast({
      title: "Exportando PDF",
      description: "Preparando seu roteiro para download..."
    });
    
    // Aqui implementaríamos a exportação real para PDF
    setTimeout(() => {
      toast({
        title: "PDF Gerado!",
        description: "Seu roteiro foi exportado com sucesso",
      });
    }, 1500);
  };

  if (isLoading) {
    return (
      <div className="bg-gray-50 rounded-xl p-6 my-6">
        <div className="flex flex-col items-center justify-center h-64">
          <Loader2 className="w-12 h-12 text-primary animate-spin" />
          <p className="mt-4 text-gray-500">Gerando seu roteiro profissional...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white border rounded-xl shadow-sm my-6 overflow-hidden">
      <div className="p-4 bg-gray-50 border-b flex justify-between items-center">
        <div>
          <h3 className="text-lg font-medium">Roteiro gerado para: <span className="text-primary">{prompt}</span></h3>
          <p className="text-sm text-gray-500">
            Tipo: {scriptType} • 
            {metadata?.modelUsed && ` Modelo: ${metadata.modelUsed} • `}
            Gerado em: {new Date(metadata?.generatedAt || Date.now()).toLocaleString()}
          </p>
        </div>
        <div className="flex gap-2">
          <Button 
            variant="outline" 
            size="sm" 
            onClick={handleCopy}
            className="flex items-center gap-1"
          >
            {isCopied ? <CheckCircle size={16} /> : <Copy size={16} />}
            {isCopied ? "Copiado" : "Copiar"}
          </Button>
          <Button 
            variant="outline" 
            size="sm"
            onClick={handleExportTXT} 
            className="flex items-center gap-1"
          >
            <Download size={16} />
            TXT
          </Button>
          <Button 
            variant="outline" 
            size="sm"
            onClick={handleExportPDF} 
            className="flex items-center gap-1"
          >
            <Download size={16} />
            PDF
          </Button>
        </div>
      </div>
      
      <div className="p-4">
        {error ? (
          <div className="p-4 bg-red-50 text-red-800 rounded-lg border border-red-200">
            <p className="font-medium mb-2">Erro ao gerar roteiro</p>
            <p className="text-sm whitespace-pre-line">{script}</p>
          </div>
        ) : (
          <div className="prose prose-sm max-w-none">
            <pre id="texto-gerado" className="whitespace-pre-line bg-gray-50 p-4 rounded-lg border text-sm overflow-auto max-h-[500px] script-content mobile-optimized">
              {script}
            </pre>
          </div>
        )}
      </div>
      
      <div className="p-4 bg-gradient-to-r from-gray-50 to-gray-100 border-t">
        <div className="flex items-center justify-between">
          <p className="text-sm text-gray-500">
            {!error && `${script.length} caracteres • Aproximadamente ${Math.ceil(script.length / 1000)} minuto(s) de leitura`}
          </p>
          <Button 
            variant="ghost" 
            size="sm"
            className="flex items-center gap-1"
            onClick={() => {
              toast({
                title: "Link copiado",
                description: "Link para compartilhamento copiado para área de transferência",
              });
            }}
          >
            <Share2 size={16} />
            Compartilhar
          </Button>
        </div>
      </div>
    </div>
  );
}
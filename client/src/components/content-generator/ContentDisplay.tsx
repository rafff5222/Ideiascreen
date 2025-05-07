import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CheckIcon, CopyIcon, SaveIcon } from "lucide-react";

interface ContentDisplayProps {
  className?: string;
}

export default function ContentDisplay({ className }: ContentDisplayProps) {
  const [copied, setCopied] = useState(false);
  const [editing, setEditing] = useState(false);
  const [editedContent, setEditedContent] = useState("");
  const { toast } = useToast();

  // Fetch current generated content or use the one from the cache
  const { data: content } = useQuery({
    queryKey: ["currentGeneratedContent"],
    enabled: false, // This query will not run automatically, only set by the form
  });

  // Save content to history
  const saveContent = async () => {
    if (!content) return;
    
    try {
      const contentToSave = editing ? editedContent : content.content;
      await apiRequest("POST", "/api/content/save", {
        ...content,
        content: contentToSave
      });
      
      toast({
        title: "Conteúdo salvo!",
        description: "Você pode encontrá-lo na aba de histórico.",
      });
    } catch (error) {
      toast({
        title: "Erro ao salvar",
        description: "Não foi possível salvar o conteúdo.",
        variant: "destructive",
      });
    }
  };

  // Copy content to clipboard
  const copyToClipboard = async () => {
    if (!content) return;
    
    const textToCopy = editing ? editedContent : content.content;
    
    try {
      await navigator.clipboard.writeText(textToCopy);
      setCopied(true);
      
      toast({
        title: "Copiado!",
        description: "Conteúdo copiado para a área de transferência.",
      });
      
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      toast({
        title: "Erro ao copiar",
        description: "Não foi possível copiar o conteúdo.",
        variant: "destructive",
      });
    }
  };

  // Enable editing
  const handleEdit = () => {
    if (!content) return;
    
    if (!editing) {
      setEditedContent(content.content);
      setEditing(true);
    } else {
      setEditing(false);
    }
  };

  // If content was just generated, show it immediately
  if (content) {
    return (
      <Card className={`h-full ${className}`}>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle>Conteúdo Gerado</CardTitle>
          <div className="flex space-x-2">
            <Button 
              variant="outline" 
              size="sm"
              onClick={handleEdit}
            >
              {editing ? "Cancelar" : "Editar"}
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={copyToClipboard}
              disabled={!content}
            >
              {copied ? <CheckIcon className="h-4 w-4" /> : <CopyIcon className="h-4 w-4" />}
            </Button>
            <Button
              variant="default"
              size="sm"
              onClick={saveContent}
              disabled={!content}
            >
              <SaveIcon className="h-4 w-4 mr-1" /> Salvar
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="mb-3 flex justify-between items-center">
            <div>
              <span className="text-sm font-medium">
                Tipo: <span className="font-normal">{content.contentType}</span>
              </span>
              <span className="text-sm font-medium ml-4">
                Plataforma: <span className="font-normal">{content.platform}</span>
              </span>
            </div>
          </div>
          
          {editing ? (
            <Textarea
              value={editedContent}
              onChange={(e) => setEditedContent(e.target.value)}
              className="min-h-[300px] font-medium"
            />
          ) : (
            <div className="bg-gray-50 rounded-lg p-4 min-h-[300px] whitespace-pre-line">
              {content.content}
            </div>
          )}
        </CardContent>
      </Card>
    );
  }

  // Default state when no content has been generated yet
  return (
    <Card className={`h-full ${className}`}>
      <CardHeader>
        <CardTitle>Conteúdo Gerado</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col items-center justify-center text-center h-[300px] space-y-3">
          <i className="ri-file-text-line text-4xl text-gray-300"></i>
          <p className="text-gray-500">
            Preencha o formulário e clique em "Gerar Conteúdo" para criar o seu conteúdo para redes sociais
          </p>
        </div>
      </CardContent>
    </Card>
  );
}

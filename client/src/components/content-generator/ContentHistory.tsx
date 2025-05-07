import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { useQueryClient } from "@tanstack/react-query";
import { formatDate, truncateText } from "@/lib/utils";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { CheckIcon, CopyIcon, EditIcon, Trash2Icon } from "lucide-react";

interface ContentHistoryProps {
  content: ContentItem[];
}

interface ContentItem {
  id: number;
  contentType: string;
  platform: string;
  topic: string;
  communicationStyle: string;
  content: string;
  createdAt: string;
}

export default function ContentHistory({ content }: ContentHistoryProps) {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [copiedId, setCopiedId] = useState<number | null>(null);

  const copyToClipboard = async (id: number, text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedId(id);
      toast({
        title: "Copiado!",
        description: "Conteúdo copiado para a área de transferência.",
      });
      setTimeout(() => setCopiedId(null), 2000);
    } catch (error) {
      toast({
        title: "Erro ao copiar",
        description: "Não foi possível copiar o conteúdo.",
        variant: "destructive",
      });
    }
  };

  const deleteContent = async (id: number) => {
    try {
      await apiRequest("DELETE", `/api/content/${id}`, undefined);
      queryClient.invalidateQueries({ queryKey: ["/api/content-history"] });
      toast({
        title: "Conteúdo excluído",
        description: "O item foi removido do seu histórico.",
      });
    } catch (error) {
      toast({
        title: "Erro ao excluir",
        description: "Não foi possível excluir o conteúdo.",
        variant: "destructive",
      });
    }
  };

  const loadInEditor = (item: ContentItem) => {
    queryClient.setQueryData(["currentGeneratedContent"], item);
    toast({
      title: "Conteúdo carregado",
      description: "O conteúdo foi carregado no editor.",
    });
  };

  if (content.length === 0) {
    return (
      <div className="text-center py-12">
        <i className="ri-history-line text-4xl text-gray-300 mb-2"></i>
        <h3 className="text-lg font-medium mb-1">Seu histórico está vazio</h3>
        <p className="text-gray-500">
          Os conteúdos que você gerar e salvar aparecerão aqui.
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {content.map((item) => (
        <Card key={item.id} className="overflow-hidden">
          <CardContent className="p-0">
            <div className="bg-gradient-to-r from-primary/5 to-accent/5 p-3 flex justify-between items-center">
              <div>
                <p className="font-medium text-sm capitalize">{item.contentType}</p>
                <p className="text-xs text-gray-500">{formatDate(new Date(item.createdAt))}</p>
              </div>
              <div className="flex space-x-1">
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        className="h-8 w-8" 
                        onClick={() => loadInEditor(item)}
                      >
                        <EditIcon className="h-4 w-4" />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Editar</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>

                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        className="h-8 w-8" 
                        onClick={() => copyToClipboard(item.id, item.content)}
                      >
                        {copiedId === item.id ? (
                          <CheckIcon className="h-4 w-4" />
                        ) : (
                          <CopyIcon className="h-4 w-4" />
                        )}
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Copiar</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>

                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button variant="ghost" size="icon" className="h-8 w-8">
                      <Trash2Icon className="h-4 w-4" />
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Excluir conteúdo?</AlertDialogTitle>
                      <AlertDialogDescription>
                        Esta ação não pode ser desfeita. Este item será removido permanentemente do seu histórico.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancelar</AlertDialogCancel>
                      <AlertDialogAction onClick={() => deleteContent(item.id)}>
                        Excluir
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </div>
            </div>
            <div className="p-4">
              <div className="flex flex-wrap gap-2 mb-2">
                <span className="inline-flex items-center px-2 py-1 bg-primary/10 text-primary text-xs rounded-full">
                  <i className={`${item.platform === 'instagram' ? 'ri-instagram-line' : 'ri-tiktok-line'} mr-1`}></i>
                  {item.platform}
                </span>
                <span className="inline-flex items-center px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded-full">
                  {item.topic}
                </span>
              </div>
              <p className="text-sm text-gray-700 line-clamp-3">{truncateText(item.content, 150)}</p>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

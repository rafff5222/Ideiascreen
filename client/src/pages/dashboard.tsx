import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import ContentForm from "@/components/content-generator/ContentForm";
import ContentDisplay from "@/components/content-generator/ContentDisplay";
import ContentHistory from "@/components/content-generator/ContentHistory";
import { useQuery } from "@tanstack/react-query";
import { Loader2 } from "lucide-react";

export default function Dashboard() {
  const [activeTab, setActiveTab] = useState("create");
  const { toast } = useToast();

  // Fetch user's content history
  const { data: contentHistory, isLoading: historyLoading } = useQuery({
    queryKey: ["/api/content-history"],
    staleTime: 1000 * 60, // 1 minute
  });

  return (
    <div className="bg-gradient-to-br from-primary/5 to-accent/5 min-h-screen py-8 px-4">
      <div className="container max-w-6xl mx-auto">
        <h1 className="text-3xl mb-6">Dashboard</h1>
        
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-2 mb-8">
            <TabsTrigger value="create">Criar Conteúdo</TabsTrigger>
            <TabsTrigger value="history">Meu Histórico</TabsTrigger>
          </TabsList>
          
          <TabsContent value="create" className="space-y-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <ContentForm />
              <ContentDisplay />
            </div>
          </TabsContent>
          
          <TabsContent value="history">
            {historyLoading ? (
              <div className="flex justify-center items-center py-12">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
              </div>
            ) : (
              <ContentHistory content={contentHistory || []} />
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}

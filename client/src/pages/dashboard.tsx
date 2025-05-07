import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import ContentForm from "@/components/content-generator/ContentForm";
import ContentDisplay from "@/components/content-generator/ContentDisplay";
import ContentHistory from "@/components/content-generator/ContentHistory";
import { useQuery } from "@tanstack/react-query";
import { Loader2, Rocket, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";

export default function Dashboard() {
  const [activeTab, setActiveTab] = useState("create");
  const [showUpgradePrompt, setShowUpgradePrompt] = useState(true);
  const { toast } = useToast();

  // For demo, let's assume user is on Basic plan
  const userPlan = "basic";

  // Fetch user's content history
  const { data: contentHistory, isLoading: historyLoading } = useQuery({
    queryKey: ["/api/content-history"],
    staleTime: 1000 * 60, // 1 minute
  });

  const handleDismissUpgrade = () => {
    setShowUpgradePrompt(false);
  };

  return (
    <div className="bg-gradient-to-br from-primary/5 to-accent/5 min-h-screen py-8 px-4">
      <div className="container max-w-6xl mx-auto">
        {userPlan === "basic" && showUpgradePrompt && (
          <div className="bg-gradient-to-r from-accent/20 to-primary/20 rounded-xl p-4 mb-8 shadow-md relative border border-accent/30">
            <button 
              className="absolute top-3 right-3 text-gray-500 hover:text-gray-700"
              onClick={handleDismissUpgrade}
            >
              <X size={18} />
            </button>
            <div className="flex flex-col md:flex-row items-center gap-4">
              <div className="flex-1">
                <h3 className="text-lg font-bold flex items-center gap-2">
                  <Rocket className="h-5 w-5 text-accent" />
                  Atualize para o Premium e tenha muito mais!
                </h3>
                <p className="text-gray-700 mt-1">
                  Atualize para o plano Premium e ganhe <span className="font-bold">10 vídeos grátis</span> esta semana! 
                  Edição automática com IA, legendas sincronizadas e áudios virais.
                </p>
              </div>
              <Link href="#premium">
                <div className="bg-gradient-to-r from-accent to-primary text-white px-4 py-2 rounded-lg font-medium cursor-pointer shadow-md hover:opacity-90 transition whitespace-nowrap">
                  Upgrade para Premium
                </div>
              </Link>
            </div>
          </div>
        )}

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
              <ContentHistory content={Array.isArray(contentHistory) ? contentHistory : []} />
            )}
          </TabsContent>
        </Tabs>

        {/* Remaining credits display for Basic plan */}
        {userPlan === "basic" && (
          <div className="mt-8 bg-white p-4 rounded-lg shadow-sm border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-medium text-gray-800">Plano Básico</h3>
                <p className="text-sm text-gray-600">Créditos restantes este mês: <span className="font-bold text-primary">32/50</span></p>
              </div>
              <Link href="#premium">
                <div className="text-sm text-accent hover:underline cursor-pointer">
                  Ver planos de upgrade
                </div>
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

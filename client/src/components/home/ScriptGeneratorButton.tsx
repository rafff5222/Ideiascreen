import { useLocation } from 'wouter';
import { Button } from "@/components/ui/button";
import { ArrowRight, Sparkles } from "lucide-react";

/**
 * Botão para direcionar ao gerador de roteiros com animação
 */
export default function ScriptGeneratorButton() {
  const [location, setLocation] = useLocation();
  
  // Redireciona para a página do gerador de roteiros
  const handleClick = () => {
    setLocation("/roteiros");
  };

  return (
    <Button 
      onClick={handleClick}
      className="bg-gradient-to-r from-primary to-purple-600 hover:from-primary/90 hover:to-purple-700 text-white py-6 px-8 text-lg transition-all relative overflow-hidden group"
    >
      <span className="flex items-center gap-2">
        <Sparkles className="w-5 h-5" />
        <span>Criar Roteiro Profissional Agora</span>
        <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
      </span>
      <span className="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></span>
    </Button>
  );
}
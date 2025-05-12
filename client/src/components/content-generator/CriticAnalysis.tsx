import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Loader2, Film, Star, ThumbsUp, ThumbsDown } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";

interface CriticAnalysisProps {
  script: string;
}

interface AnalysisResult {
  forcas: string[];
  falhas: string[];
  comparacao: string;
  pontuacao: number;
}

export default function CriticAnalysis({ script }: CriticAnalysisProps) {
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysis, setAnalysis] = useState<AnalysisResult | null>(null);
  const { toast } = useToast();

  const handleRequestAnalysis = async () => {
    if (!script) {
      toast({
        title: "Erro",
        description: "Não há roteiro para analisar",
        variant: "destructive",
      });
      return;
    }

    setIsAnalyzing(true);

    try {
      const response = await apiRequest("POST", "/api/analyze-script", {
        script: script,
      });

      const data = await response.json();

      if (data.error) {
        throw new Error(data.error);
      }

      setAnalysis(data);
      toast({
        title: "Análise Completa",
        description: "Confira a análise do crítico de cinema",
      });
    } catch (err: any) {
      console.error("Erro na análise de crítico:", err);
      toast({
        title: "Falha na Análise",
        description: err.message || "Não foi possível realizar a análise crítica",
        variant: "destructive",
      });
    } finally {
      setIsAnalyzing(false);
    }
  };

  // Renderizar a análise formatada
  const renderStars = (rating: number) => {
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating - fullStars >= 0.5;
    const stars = [];

    for (let i = 0; i < fullStars; i++) {
      stars.push(
        <Star key={`full-${i}`} className="w-4 h-4 fill-amber-500 text-amber-500" />
      );
    }

    if (hasHalfStar) {
      stars.push(
        <Star key="half" className="w-4 h-4 text-amber-500 fill-amber-500/50" />
      );
    }

    const emptyStars = 10 - stars.length;
    for (let i = 0; i < emptyStars; i++) {
      stars.push(
        <Star key={`empty-${i}`} className="w-4 h-4 text-gray-300" />
      );
    }

    return stars;
  };

  if (isAnalyzing) {
    return (
      <div className="bg-gray-800 rounded-lg p-5 mt-4 border border-indigo-500/20 flex items-center justify-center space-x-3">
        <Loader2 className="animate-spin h-5 w-5 text-indigo-400" />
        <p className="text-indigo-300">Analisando seu roteiro como crítico de cinema...</p>
      </div>
    );
  }

  if (!analysis) {
    return (
      <div className="bg-gradient-to-r from-gray-800 to-gray-800/80 rounded-lg p-5 mt-4 border border-indigo-500/20">
        <div className="flex items-center mb-4">
          <Film className="text-indigo-400 mr-2" />
          <h3 className="text-lg font-bold text-indigo-300">Análise de Crítico de Cinema</h3>
        </div>
        <p className="text-gray-300 text-sm mb-4">
          Obtenha uma análise profissional do seu roteiro, destacando pontos fortes, oportunidades de
          melhoria e comparações com obras consagradas do cinema.
        </p>
        <Button
          variant="outline"
          onClick={handleRequestAnalysis}
          className="w-full bg-indigo-500/10 border-indigo-500/30 text-indigo-300 hover:bg-indigo-500/20"
        >
          Analisar como Crítico de Cinema
        </Button>
      </div>
    );
  }

  return (
    <div className="bg-gradient-to-r from-gray-800 to-gray-800/80 rounded-lg p-5 mt-4 border border-indigo-500/20">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center">
          <Film className="text-indigo-400 mr-2" />
          <h3 className="text-lg font-bold text-indigo-300">Análise Crítica</h3>
        </div>
        <div className="flex items-center">
          <span className="text-gray-300 mr-2 text-sm">Avaliação:</span>
          <div className="flex">{renderStars(analysis.pontuacao)}</div>
        </div>
      </div>
      
      <div className="mb-4">
        <h4 className="text-indigo-300 text-sm font-medium mb-2">Pontos Fortes</h4>
        <ul className="space-y-1">
          {analysis.forcas.map((ponto, idx) => (
            <li key={`forca-${idx}`} className="flex items-start">
              <ThumbsUp className="text-green-400 w-4 h-4 mr-2 mt-1 shrink-0" />
              <span className="text-gray-200 text-sm">{ponto}</span>
            </li>
          ))}
        </ul>
      </div>
      
      <div className="mb-4">
        <h4 className="text-indigo-300 text-sm font-medium mb-2">Oportunidades de Melhoria</h4>
        <ul className="space-y-1">
          {analysis.falhas.map((falha, idx) => (
            <li key={`falha-${idx}`} className="flex items-start">
              <ThumbsDown className="text-red-400 w-4 h-4 mr-2 mt-1 shrink-0" />
              <span className="text-gray-200 text-sm">{falha}</span>
            </li>
          ))}
        </ul>
      </div>
      
      <div className="bg-gray-700/30 p-4 rounded-lg mt-4 border border-gray-600">
        <h4 className="text-indigo-300 text-sm font-medium mb-1">Comparação Cinematográfica</h4>
        <p className="text-gray-200 text-sm italic">"{analysis.comparacao}"</p>
      </div>
      
      <div className="mt-4 pt-3 border-t border-gray-700">
        <Button
          variant="ghost"
          onClick={() => setAnalysis(null)}
          className="text-xs text-gray-400"
          size="sm"
        >
          Solicitar Nova Análise
        </Button>
      </div>
    </div>
  );
}
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Star, TrendingUp, BarChart3, Video, Clock } from 'lucide-react';

// Definir interface para as estatísticas de engajamento
interface EngagementStatsProps {
  score: number;
  rhythm?: number;
  emphasis?: number;
  transitions?: number;
  duration?: number;
  description?: string;
}

export function EngagementScore({ 
  score, 
  rhythm = 0, 
  emphasis = 0, 
  transitions = 0, 
  duration = 0,
  description 
}: EngagementStatsProps) {
  // Função para determinar a cor baseada na pontuação
  const getScoreColor = (value: number): string => {
    if (value >= 80) return 'bg-green-500';
    if (value >= 60) return 'bg-blue-500';
    if (value >= 40) return 'bg-yellow-500';
    if (value >= 20) return 'bg-orange-500';
    return 'bg-red-500';
  };

  // Função para gerar estrelas baseada na pontuação
  const getStarRating = (value: number): JSX.Element => {
    const starCount = Math.round(value / 20); // 0-5 estrelas
    return (
      <div className="flex items-center gap-0.5">
        {Array.from({ length: 5 }).map((_, i) => (
          <Star
            key={i}
            className={`h-4 w-4 ${i < starCount ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'}`}
          />
        ))}
      </div>
    );
  };

  return (
    <Card className="h-full">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg flex items-center gap-2">
          <TrendingUp className="h-5 w-5 text-primary" />
          Análise de Engajamento
        </CardTitle>
        <CardDescription>
          Métricas de qualidade do vídeo
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-5">
        {/* Pontuação geral */}
        <div className="space-y-1">
          <div className="flex justify-between items-center mb-1">
            <span className="text-sm font-medium">Pontuação Geral</span>
            <span className="text-sm font-medium">{score}/100</span>
          </div>
          <Progress value={score} className={getScoreColor(score)} />
          <div className="flex justify-between mt-1">
            <span className="text-xs text-gray-500">{description}</span>
            {getStarRating(score)}
          </div>
        </div>
        
        <div className="grid grid-cols-2 gap-3">
          {/* Ritmo */}
          <div className="bg-gray-50 p-3 rounded-md">
            <div className="flex items-center gap-1.5 mb-1">
              <BarChart3 className="h-4 w-4 text-primary" />
              <h3 className="text-sm font-medium">Ritmo</h3>
            </div>
            <Progress value={rhythm} className="h-1.5 mt-1" />
            <p className="text-xs text-gray-600 mt-1">
              {rhythm >= 70 ? 'Dinâmico' : rhythm >= 40 ? 'Equilibrado' : 'Monótono'}
            </p>
          </div>
          
          {/* Ênfase */}
          <div className="bg-gray-50 p-3 rounded-md">
            <div className="flex items-center gap-1.5 mb-1">
              <Star className="h-4 w-4 text-primary" />
              <h3 className="text-sm font-medium">Ênfase</h3>
            </div>
            <Progress value={emphasis} className="h-1.5 mt-1" />
            <p className="text-xs text-gray-600 mt-1">
              {emphasis >= 70 ? 'Forte' : emphasis >= 40 ? 'Moderada' : 'Leve'}
            </p>
          </div>
          
          {/* Transições */}
          <div className="bg-gray-50 p-3 rounded-md">
            <div className="flex items-center gap-1.5 mb-1">
              <Video className="h-4 w-4 text-primary" />
              <h3 className="text-sm font-medium">Transições</h3>
            </div>
            <Progress value={transitions} className="h-1.5 mt-1" />
            <p className="text-xs text-gray-600 mt-1">
              {transitions >= 70 ? 'Criativas' : transitions >= 40 ? 'Suaves' : 'Básicas'}
            </p>
          </div>
          
          {/* Duração */}
          <div className="bg-gray-50 p-3 rounded-md">
            <div className="flex items-center gap-1.5 mb-1">
              <Clock className="h-4 w-4 text-primary" />
              <h3 className="text-sm font-medium">Duração</h3>
            </div>
            <p className="text-sm font-medium mt-1">{duration}s</p>
            <p className="text-xs text-gray-600 mt-1">
              {duration <= 30 ? 'Ideal para redes' : duration <= 60 ? 'Média' : 'Longa'}
            </p>
          </div>
        </div>
        
        <div className="bg-blue-50 p-3 rounded-md border border-blue-100">
          <p className="text-xs text-blue-700">
            <span className="font-semibold">Dica de Pro:</span> Vídeos com pontuação acima de 75 
            têm 3x mais chances de serem compartilhados nas redes sociais.
          </p>
        </div>
      </CardContent>
    </Card>
  );
}

export default EngagementScore;
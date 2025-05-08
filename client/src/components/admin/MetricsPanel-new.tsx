import { useEffect, useState } from 'react';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer,
  BarChart,
  Bar
} from 'recharts';

/**
 * Painel de métricas em tempo real (visível apenas para admins)
 * Exibe estatísticas como taxa de conversão, ticket médio, etc.
 */
export default function MetricsPanel() {
  const [isAdmin, setIsAdmin] = useState(false);
  const [activeView, setActiveView] = useState("overview");
  
  // Métricas de negócio com metas
  const businessMetrics = {
    conversion: {
      current: 3.2,
      target: 5.0,
      previousPeriod: 2.8
    },
    mrr: {
      current: 154328,
      target: 250000,
      previousPeriod: 137400
    },
    cac: {
      current: 112,
      target: 80,
      previousPeriod: 125
    },
    churn: {
      current: 4.2,
      target: 3.0,
      previousPeriod: 4.8
    }
  };
  
  // Dados simulados para gráficos
  const conversionData = [
    { dia: 'Seg', taxa: 2.3 },
    { dia: 'Ter', taxa: 2.1 },
    { dia: 'Qua', taxa: 3.2 },
    { dia: 'Qui', taxa: 3.5 },
    { dia: 'Sex', taxa: 3.1 },
    { dia: 'Sáb', taxa: 4.2 },
    { dia: 'Dom', taxa: 3.9 },
  ];
  
  const revenueData = [
    { dia: 'Seg', valor: 3200 },
    { dia: 'Ter', valor: 2800 },
    { dia: 'Qua', valor: 3500 },
    { dia: 'Qui', valor: 4200 },
    { dia: 'Sex', valor: 4100 },
    { dia: 'Sáb', valor: 3800 },
    { dia: 'Dom', valor: 4500 },
  ];
  
  const planData = [
    { nome: 'Básico', usuarios: 840 },
    { nome: 'Premium', usuarios: 1450 },
    { nome: 'Pro', usuarios: 280 },
    { nome: 'Ultimate', usuarios: 350 },
  ];
  
  // Verifica se é administrador (simples simulação)
  useEffect(() => {
    // Em um caso real, checaria cookies, localStorage ou estado global
    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.get('admin') === 'true') {
      setIsAdmin(true);
    }
  }, []);
  
  // Função para renderizar os medidores de progresso (gauges)
  const renderGauge = (metric: any, title: string, format: (value: number) => string) => {
    const percentage = (metric.current / metric.target) * 100;
    const angle = Math.min(180, (percentage / 100) * 180);
    const color = percentage >= 100 ? '#10B981' : percentage >= 70 ? '#8B5CF6' : '#EF4444';
    const previousChange = ((metric.current - metric.previousPeriod) / metric.previousPeriod) * 100;
    const isPositiveChange = 
      (title === 'Taxa de Conversão' || title === 'Receita Mensal') ? previousChange > 0 : 
      (title === 'CAC' || title === 'Churn') ? previousChange < 0 : 
      previousChange > 0;
    
    return (
      <Card>
        <CardHeader className="p-4 pb-0">
          <CardDescription>{title}</CardDescription>
          <CardTitle className="text-2xl font-bold">
            {format(metric.current)}
          </CardTitle>
          <div className="text-xs">
            <span>Meta: {format(metric.target)}</span>
          </div>
        </CardHeader>
        <CardContent className="p-4">
          <div className="w-full">
            <svg viewBox="0 0 100 50" className="w-full">
              {/* Background path */}
              <path 
                d="M10,45 A40,40 0 0 1 90,45" 
                fill="none" 
                stroke="#eee" 
                strokeWidth="6"
                strokeLinecap="round"
              />
              {/* Foreground path (progress) */}
              <path 
                d={`M10,45 A40,40 0 0 1 ${50 + 40 * Math.cos((angle - 90) * Math.PI / 180)},${45 + 40 * Math.sin((angle - 90) * Math.PI / 180)}`}
                fill="none" 
                stroke={color} 
                strokeWidth="6"
                strokeLinecap="round"
              />
              {/* Center text */}
              <text 
                x="50" 
                y="65" 
                textAnchor="middle" 
                fontSize="12" 
                fill="#666"
              >
                {Math.round(percentage)}%
              </text>
            </svg>
          </div>
        </CardContent>
        <CardFooter className="p-4 pt-0 flex justify-between items-center">
          <span className={`text-xs ${isPositiveChange ? 'text-green-600' : 'text-red-600'}`}>
            {isPositiveChange ? '↑' : '↓'} {Math.abs(previousChange).toFixed(1)}% vs período anterior
          </span>
          <div className="w-2 h-2 rounded-full" style={{ backgroundColor: color }}></div>
        </CardFooter>
      </Card>
    );
  };
  
  if (!isAdmin) {
    return null;
  }
  
  return (
    <div className="fixed bottom-5 right-5 w-[650px] bg-white shadow-xl rounded-xl border z-40">
      <CardHeader className="pb-2">
        <div className="flex justify-between items-center">
          <CardTitle className="text-lg font-bold">Painel de Saúde do Negócio</CardTitle>
          <span className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full">
            Ao vivo
          </span>
        </div>
        <CardDescription>Visão geral e métricas em tempo real para tomada de decisão</CardDescription>
      </CardHeader>
      
      <Tabs defaultValue="overview" value={activeView} onValueChange={setActiveView}>
        <div className="px-6">
          <TabsList className="w-full">
            <TabsTrigger value="overview" className="flex-1">Visão Geral</TabsTrigger>
            <TabsTrigger value="growth" className="flex-1">Crescimento</TabsTrigger>
            <TabsTrigger value="insights" className="flex-1">Insights</TabsTrigger>
          </TabsList>
        </div>
        
        <CardContent className="pt-4">
          <TabsContent value="overview" className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              {renderGauge(
                businessMetrics.conversion, 
                'Taxa de Conversão', 
                (value) => `${value.toFixed(1)}%`
              )}
              
              {renderGauge(
                businessMetrics.mrr, 
                'Receita Mensal', 
                (value) => `R$ ${value.toLocaleString()}`
              )}
              
              {renderGauge(
                businessMetrics.cac, 
                'CAC', 
                (value) => `R$ ${value.toFixed(0)}`
              )}
              
              {renderGauge(
                businessMetrics.churn, 
                'Churn', 
                (value) => `${value.toFixed(1)}%`
              )}
            </div>
            
            <Card>
              <CardHeader className="p-4 pb-2">
                <CardTitle className="text-md">Usuários por Plano</CardTitle>
              </CardHeader>
              <CardContent className="px-0">
                <ResponsiveContainer width="100%" height={180}>
                  <BarChart data={planData} margin={{ top: 10, right: 30, left: 0, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="nome" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="usuarios" fill="#8B5CF6" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="growth">
            <div className="space-y-4">
              <Card>
                <CardHeader className="p-4 pb-2">
                  <CardTitle className="text-md">Taxa de Conversão (7 dias)</CardTitle>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={200}>
                    <LineChart data={conversionData} margin={{ top: 10, right: 30, left: 0, bottom: 5 }}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="dia" />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      <Line type="monotone" dataKey="taxa" stroke="#8B5CF6" activeDot={{ r: 8 }} />
                    </LineChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="p-4 pb-2">
                  <CardTitle className="text-md">Receita (7 dias)</CardTitle>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={200}>
                    <LineChart data={revenueData} margin={{ top: 10, right: 30, left: 0, bottom: 5 }}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="dia" />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      <Line type="monotone" dataKey="valor" stroke="#10B981" activeDot={{ r: 8 }} />
                    </LineChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
          
          <TabsContent value="insights">
            <Card>
              <CardHeader className="p-4 pb-2">
                <CardTitle className="text-md">Insights de IA para Aumento de Conversão</CardTitle>
              </CardHeader>
              <CardContent className="p-4">
                <ul className="space-y-2">
                  <li className="flex items-start gap-2">
                    <div className="rounded-full bg-purple-100 p-1 mt-0.5">
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-purple-600">
                        <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"></polygon>
                      </svg>
                    </div>
                    <div>
                      <p className="text-sm font-medium">Otimização de Call-to-Action</p>
                      <p className="text-xs text-gray-500">A versão "Começar Agora" está convertendo 28% melhor que "Teste Grátis"</p>
                    </div>
                  </li>
                  
                  <li className="flex items-start gap-2">
                    <div className="rounded-full bg-purple-100 p-1 mt-0.5">
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-purple-600">
                        <path d="M20.42 4.58a5.4 5.4 0 0 0-7.65 0l-.77.78-.77-.78a5.4 5.4 0 0 0-7.65 0C1.46 6.7 1.33 10.28 4 13l8 8 8-8c2.67-2.72 2.54-6.3.42-8.42z"></path>
                      </svg>
                    </div>
                    <div>
                      <p className="text-sm font-medium">Segmento com Maior Engajamento</p>
                      <p className="text-xs text-gray-500">Usuários do nicho de "Marketing Digital" tem 3.7x mais conversão</p>
                    </div>
                  </li>
                  
                  <li className="flex items-start gap-2">
                    <div className="rounded-full bg-purple-100 p-1 mt-0.5">
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-purple-600">
                        <circle cx="12" cy="12" r="10"></circle>
                        <path d="M8 14s1.5 2 4 2 4-2 4-2"></path>
                        <line x1="9" y1="9" x2="9.01" y2="9"></line>
                        <line x1="15" y1="9" x2="15.01" y2="9"></line>
                      </svg>
                    </div>
                    <div>
                      <p className="text-sm font-medium">Oportunidade de Melhoria</p>
                      <p className="text-xs text-gray-500">65% dos abandonos ocorrem no formulário de checkout - simplificar pode aumentar conversão em 14%</p>
                    </div>
                  </li>
                </ul>
              </CardContent>
            </Card>
          </TabsContent>
        </CardContent>
      </Tabs>
      
      <CardFooter className="text-xs text-gray-500 border-t p-4">
        Última atualização: 2 minutos atrás • <span className="text-purple-600 cursor-pointer">Gerar relatório completo</span>
      </CardFooter>
    </div>
  );
}
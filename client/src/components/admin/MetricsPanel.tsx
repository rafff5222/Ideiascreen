import { useEffect, useState } from 'react';

/**
 * Painel de métricas em tempo real (visível apenas para admins)
 * Exibe estatísticas como taxa de conversão, ticket médio, etc.
 */
export default function MetricsPanel() {
  const [isVisible, setIsVisible] = useState(false);
  const [metrics, setMetrics] = useState({
    conversionRate: '3.2%',
    averageTicket: 'R$ 87,50',
    premiumShare: '68%',
    recentSales: 5,
    returningUsers: '24%',
    upsellConversion: '32%',
    engagementScore: '74/100'
  });
  
  // Simulação de atualização de métricas em tempo real
  useEffect(() => {
    // Atualiza as métricas a cada 5 minutos
    const updateMetrics = () => {
      setMetrics({
        conversionRate: (Math.random() * 2 + 2.5).toFixed(1) + '%',
        averageTicket: 'R$ ' + (Math.random() * 40 + 70).toFixed(2),
        premiumShare: (Math.random() * 20 + 60).toFixed(0) + '%',
        recentSales: Math.floor(Math.random() * 8) + 1,
        returningUsers: (Math.random() * 15 + 15).toFixed(0) + '%',
        upsellConversion: (Math.random() * 20 + 25).toFixed(0) + '%',
        engagementScore: Math.floor(Math.random() * 20 + 65) + '/100'
      });
    };
    
    const timer = setInterval(updateMetrics, 300000); // 5 minutos
    
    // Verifica se o usuário atual é admin
    // Isso seria substituído por uma verificação real usando autenticação
    const checkAdmin = () => {
      // Secret admin URL param
      if (window.location.search.includes('admin=true')) {
        setIsVisible(true);
      }
      
      // Atalho de teclado (Ctrl+Shift+M)
      document.addEventListener('keydown', (e) => {
        if (e.ctrlKey && e.shiftKey && e.key === 'M') {
          setIsVisible(prev => !prev);
        }
      });
    };
    
    checkAdmin();
    
    return () => {
      clearInterval(timer);
    };
  }, []);
  
  if (!isVisible) return null;
  
  return (
    <div className="admin-dashboard fixed bottom-4 left-4 z-50 bg-white shadow-xl rounded-lg border border-gray-200 w-72 overflow-hidden">
      <div className="bg-gray-900 text-white p-3 flex justify-between items-center">
        <h3 className="font-bold text-sm">Métricas de Conversão (Admin)</h3>
        <button 
          className="text-gray-300 hover:text-white"
          onClick={() => setIsVisible(false)}
        >×</button>
      </div>
      
      <div className="p-4 grid grid-cols-2 gap-4">
        <div className="metric">
          <h4 className="text-xs text-gray-500 font-medium uppercase">Conversão Hoje</h4>
          <p id="conversion-rate" className="font-bold text-lg">{metrics.conversionRate}</p>
        </div>
        
        <div className="metric">
          <h4 className="text-xs text-gray-500 font-medium uppercase">Ticket Médio</h4>
          <p id="average-ticket" className="font-bold text-lg">{metrics.averageTicket}</p>
        </div>
        
        <div className="metric">
          <h4 className="text-xs text-gray-500 font-medium uppercase">% Premium</h4>
          <p className="font-bold text-lg">{metrics.premiumShare}</p>
        </div>
        
        <div className="metric">
          <h4 className="text-xs text-gray-500 font-medium uppercase">Vendas Recentes</h4>
          <p className="font-bold text-lg">{metrics.recentSales}</p>
        </div>
        
        <div className="metric">
          <h4 className="text-xs text-gray-500 font-medium uppercase">Usuários Recorrentes</h4>
          <p className="font-bold text-lg">{metrics.returningUsers}</p>
        </div>
        
        <div className="metric">
          <h4 className="text-xs text-gray-500 font-medium uppercase">Conversão Upsell</h4>
          <p className="font-bold text-lg">{metrics.upsellConversion}</p>
        </div>
        
        <div className="metric col-span-2">
          <h4 className="text-xs text-gray-500 font-medium uppercase">Score de Engajamento</h4>
          <div className="w-full bg-gray-200 h-2 rounded-full mt-2">
            <div 
              className="bg-gradient-to-r from-yellow-500 to-red-500 h-2 rounded-full" 
              style={{ width: metrics.engagementScore.split('/')[0] + '%' }}
            ></div>
          </div>
          <p className="text-right text-xs mt-1">{metrics.engagementScore}</p>
        </div>
      </div>
      
      <div className="p-3 bg-gray-50 border-t border-gray-200 flex justify-between items-center text-xs">
        <span className="text-gray-500">Última atualização: {new Date().toLocaleTimeString()}</span>
        <button 
          className="text-primary hover:underline"
          onClick={() => window.open('/admin/analytics', '_blank')}
        >
          Ver detalhes
        </button>
      </div>
    </div>
  );
}
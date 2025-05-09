import React, { useState, useEffect } from 'react';

/**
 * Componente que mostra prova social dinâmica com atualizações em tempo real
 * Exibe notificações de pessoas que assinaram recentemente os planos
 */
export default function DynamicSocialProof() {
  const [proofs, setProofs] = useState<string[]>([]);
  
  useEffect(() => {
    // Lista de usuários fictícios (em produção, viria da API)
    const users = [
      'Ana_C', 'MarketingPro', 'Joao_Empreendedor', 'LucasAgencia', 
      'Camila_Social', 'Fernanda_Content', 'Gustavo_Digital', 'Bruno_Mkt',
      'ConteudoExpress', 'MarketingDigital22', 'Empreender2025'
    ];
    
    const plans = ['Premium', 'Ultimate'];
    const times = ['há 14 minutos', 'há 32 minutos', 'há 1 hora', 'há 2 horas', 'nesta semana'];
    
    // Adiciona algumas provas sociais iniciais
    const initialProofs = [
      `✨ ${users[0]} assinou o plano ${plans[0]} ${times[2]}`,
      `✨ ${users[3]} assinou o plano ${plans[1]} ${times[0]}`,
    ];
    setProofs(initialProofs);
    
    // A cada intervalo (3 min em produção), adiciona nova prova social
    // Usando 20s para demonstração
    const interval = setInterval(() => {
      const randomUser = users[Math.floor(Math.random() * users.length)];
      const randomPlan = plans[Math.floor(Math.random() * plans.length)];
      const randomTime = times[Math.floor(Math.random() * 2)]; // Apenas os tempos mais recentes
      
      setProofs(prevProofs => {
        // Mantém apenas os últimos 5 itens para não sobrecarregar a tela
        const newProofs = [...prevProofs, `✨ ${randomUser} assinou o plano ${randomPlan} ${randomTime}`];
        if (newProofs.length > 5) {
          return newProofs.slice(newProofs.length - 5);
        }
        return newProofs;
      });
    }, 20000);
    
    return () => clearInterval(interval);
  }, []);
  
  if (proofs.length === 0) return null;
  
  return (
    <div className="fixed bottom-4 right-4 z-50 max-w-xs">
      <div className="bg-white rounded-lg shadow-lg p-3 border border-purple-100">
        <h4 className="text-sm font-medium mb-2 text-purple-800">Atividade recente</h4>
        <div className="space-y-2">
          {proofs.map((proof, index) => (
            <div 
              key={index}
              className="py-1.5 px-3 bg-purple-50 border-l-2 border-purple-500 text-xs text-gray-800 rounded"
              style={{
                animation: 'fadeIn 0.5s',
                animationDelay: `${index * 0.1}s`
              }}
            >
              {proof}
            </div>
          ))}
        </div>
        <style>{`
          @keyframes fadeIn {
            from { opacity: 0; transform: translateY(5px); }
            to { opacity: 1; transform: translateY(0); }
          }
        `}</style>
      </div>
    </div>
  );
}
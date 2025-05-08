import { useEffect, useState } from 'react';

/**
 * Componente de Gatilho de Escassez em Tempo Real
 * Cria urgência com contador decrescente de vagas disponíveis
 */
export default function RealTimeScarcity() {
  const [vagasRestantes, setVagasRestantes] = useState(12);
  const [lastReducedTime, setLastReducedTime] = useState(Date.now());
  const [initialized, setInitialized] = useState(false);
  
  useEffect(() => {
    // Verifica se já existe valor salvo
    const savedVagas = sessionStorage.getItem('vagasRestantes');
    const savedTime = sessionStorage.getItem('lastReducedTime');
    
    if (savedVagas && savedTime) {
      setVagasRestantes(parseInt(savedVagas));
      setLastReducedTime(parseInt(savedTime));
      setInitialized(true);
    } else {
      // Inicializa com valor padrão
      sessionStorage.setItem('vagasRestantes', '12');
      sessionStorage.setItem('lastReducedTime', Date.now().toString());
      setInitialized(true);
    }
    
    // Função para reduzir vagas
    const reduceVagas = () => {
      // Verifica se já passou tempo suficiente desde a última redução (3 minutos)
      const now = Date.now();
      const minutesPassed = (now - lastReducedTime) / (1000 * 60);
      
      if (minutesPassed >= 3) {
        // Reduz entre 0 e 1 vagas
        setVagasRestantes(prev => {
          const newValue = Math.max(1, prev - Math.floor(Math.random() * 2));
          sessionStorage.setItem('vagasRestantes', newValue.toString());
          return newValue;
        });
        
        // Atualiza o timestamp da última redução
        setLastReducedTime(now);
        sessionStorage.setItem('lastReducedTime', now.toString());
      }
    };
    
    // Reduz vagas a cada 3 minutos
    const interval = setInterval(reduceVagas, 180000); // 3 minutos
    
    // Inicializa a contagem regressiva para a próxima redução
    const checkInterval = setInterval(() => {
      // Apenas para atualizar a interface quando o tempo estiver próximo
      if (Date.now() - lastReducedTime > 170000) { // Faltando 10 segundos
        setLastReducedTime(prev => prev); // Força re-render
      }
    }, 10000); // Verifica a cada 10 segundos
    
    // Cleanup
    return () => {
      clearInterval(interval);
      clearInterval(checkInterval);
    };
  }, [lastReducedTime]);
  
  useEffect(() => {
    if (!initialized) return;
    
    // Adiciona o alerta na seção de planos quando o componente for montado
    const insertScarcityAlert = () => {
      const planosSection = document.querySelector('#planos .pricing-header') || 
                           document.querySelector('.pricing-header') ||
                           document.querySelector('#planos h2')?.parentElement;
      
      if (planosSection && !document.querySelector('.alerta-vagas')) {
        // Cria o elemento de alerta
        const alertElement = document.createElement('div');
        alertElement.className = 'alerta-vagas';
        alertElement.innerHTML = `
          <p class="flex items-center justify-center text-amber-700 font-medium text-sm">
            <span class="text-amber-600 mr-1">⚠️</span> 
            <span id="vagas-restantes">${vagasRestantes}</span> vagas com desconto restantes!
          </p>
          <div class="barra-progresso bg-amber-100 h-2 rounded-full overflow-hidden w-full max-w-xs mx-auto mt-1">
            <div class="progresso-vagas bg-amber-500 h-full rounded-full" style="width: ${100 - (vagasRestantes/12)*100}%;"></div>
          </div>
        `;
        
        // Adiciona antes do primeiro elemento filho
        planosSection.prepend(alertElement);
        
        // Adiciona animação pulsante
        const style = document.createElement('style');
        style.textContent = `
          .alerta-vagas {
            background-color: #fffbeb;
            border: 1px solid #fcd34d;
            border-radius: 0.5rem;
            padding: 0.75rem;
            margin-bottom: 1.5rem;
            animation: pulse-warning 2s infinite;
          }
          
          @keyframes pulse-warning {
            0% {
              box-shadow: 0 0 0 0 rgba(245, 158, 11, 0.4);
            }
            70% {
              box-shadow: 0 0 0 10px rgba(245, 158, 11, 0);
            }
            100% {
              box-shadow: 0 0 0 0 rgba(245, 158, 11, 0);
            }
          }
          
          .barra-progresso {
            transition: all 0.3s ease;
          }
          
          .progresso-vagas {
            transition: width 0.5s ease;
          }
        `;
        document.head.appendChild(style);
      }
    };
    
    // Tenta inserir o alerta logo após o componente ser montado
    insertScarcityAlert();
    
    // Configura um observador para monitorar mudanças na DOM e inserir o alerta
    // quando a seção de planos for carregada (útil para SPAs)
    const observer = new MutationObserver((mutations) => {
      for (const mutation of mutations) {
        if (mutation.type === 'childList' && mutation.addedNodes.length > 0) {
          insertScarcityAlert();
        }
      }
    });
    
    // Inicia a observação
    observer.observe(document.body, { childList: true, subtree: true });
    
    // Cleanup
    return () => {
      observer.disconnect();
    };
  }, [vagasRestantes, initialized]);
  
  // Atualiza o elemento quando vagasRestantes mudar
  useEffect(() => {
    if (!initialized) return;
    
    const vagasElement = document.getElementById('vagas-restantes');
    const progressoElement = document.querySelector('.progresso-vagas') as HTMLElement;
    
    if (vagasElement) {
      vagasElement.textContent = vagasRestantes.toString();
    }
    
    if (progressoElement) {
      progressoElement.style.width = `${100 - (vagasRestantes/12)*100}%`;
    }
  }, [vagasRestantes, initialized]);
  
  // Este componente não renderiza nada diretamente
  return null;
}
import { useEffect, useState } from 'react';
import { Button } from "@/components/ui/button";
import { Mic, MicOff } from "lucide-react";

/**
 * Componente Assistente de Compra por Voz
 * Permite navegação e compras usando comandos de voz
 */
export default function VoiceAssistant() {
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [isSupported, setIsSupported] = useState(true);
  
  useEffect(() => {
    // Verifica se o navegador suporta a API de reconhecimento de voz
    const checkSupport = () => {
      // @ts-ignore
      return 'webkitSpeechRecognition' in window || 'SpeechRecognition' in window;
    };
    
    setIsSupported(checkSupport());
    
    // Adiciona o botão de reconhecimento de voz à página
    const addVoiceButton = () => {
      if (!document.getElementById('voice-assistant-btn')) {
        const button = document.createElement('button');
        button.id = 'voice-assistant-btn';
        button.className = 'fixed bottom-5 left-5 bg-gradient-to-r from-pink-500 to-purple-600 text-white p-3 rounded-full shadow-lg z-40 flex items-center justify-center';
        button.innerHTML = `
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3Z"></path>
            <path d="M19 10v2a7 7 0 0 1-14 0v-2"></path>
            <line x1="12" x2="12" y1="19" y2="22"></line>
          </svg>
          <span class="ml-2 hidden sm:inline">Comando de voz</span>
        `;
        
        // Adiciona tooltip
        const tooltip = document.createElement('div');
        tooltip.className = 'absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-3 py-1 bg-gray-900 text-white text-xs rounded whitespace-nowrap opacity-0 transition-opacity';
        tooltip.textContent = 'Experimente dizer: "Quero o plano premium"';
        tooltip.style.pointerEvents = 'none';
        button.appendChild(tooltip);
        
        // Mostra tooltip ao passar o mouse
        button.addEventListener('mouseenter', () => {
          tooltip.style.opacity = '1';
        });
        
        button.addEventListener('mouseleave', () => {
          tooltip.style.opacity = '0';
        });
        
        document.body.appendChild(button);
        
        // Adiciona listener de clique
        button.addEventListener('click', () => {
          startVoiceRecognition();
        });
      }
    };
    
    if (isSupported) {
      addVoiceButton();
      
      // Status de feedback
      const addStatusElement = () => {
        if (!document.getElementById('voice-status')) {
          const statusElement = document.createElement('div');
          statusElement.id = 'voice-status';
          statusElement.className = 'fixed bottom-20 left-5 bg-gray-900/80 text-white px-4 py-2 rounded-lg text-sm transform scale-0 transition-transform';
          statusElement.textContent = 'Ouvindo...';
          document.body.appendChild(statusElement);
        }
      };
      
      addStatusElement();
    }
    
    // Cleanup
    return () => {
      const button = document.getElementById('voice-assistant-btn');
      if (button) {
        button.remove();
      }
      
      const status = document.getElementById('voice-status');
      if (status) {
        status.remove();
      }
    };
  }, []);
  
  /**
   * Inicia o reconhecimento de voz
   */
  const startVoiceRecognition = () => {
    if (!isSupported) return;
    
    // @ts-ignore
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    const recognition = new SpeechRecognition();
    
    recognition.lang = 'pt-BR';
    recognition.continuous = false;
    recognition.interimResults = false;
    
    // Atualiza status visual
    setIsListening(true);
    const statusElement = document.getElementById('voice-status');
    if (statusElement) {
      statusElement.style.transform = 'scale(1)';
      statusElement.textContent = 'Ouvindo...';
    }
    
    // Efeito visual no botão
    const button = document.getElementById('voice-assistant-btn');
    if (button) {
      button.classList.add('pulse-recording');
      
      // Adiciona estilo de animação para o botão
      if (!document.getElementById('voice-animation-style')) {
        const style = document.createElement('style');
        style.id = 'voice-animation-style';
        style.textContent = `
          @keyframes pulse-recording {
            0% {
              box-shadow: 0 0 0 0 rgba(236, 72, 153, 0.7);
            }
            70% {
              box-shadow: 0 0 0 10px rgba(236, 72, 153, 0);
            }
            100% {
              box-shadow: 0 0 0 0 rgba(236, 72, 153, 0);
            }
          }
          
          .pulse-recording {
            animation: pulse-recording 1.5s infinite;
          }
        `;
        document.head.appendChild(style);
      }
    }
    
    // Configura handlers de eventos
    recognition.onresult = (event: any) => {
      const comando = event.results[0][0].transcript.toLowerCase();
      setTranscript(comando);
      
      // Log do comando para debug
      console.log('Comando de voz detectado:', comando);
      
      // Processa o comando recebido
      processarComando(comando);
      
      // Atualiza status
      if (statusElement) {
        statusElement.textContent = `"${comando}"`;
        
        // Esconde após 3 segundos
        setTimeout(() => {
          if (statusElement) {
            statusElement.style.transform = 'scale(0)';
          }
        }, 3000);
      }
    };
    
    recognition.onend = () => {
      setIsListening(false);
      
      // Remove efeito do botão
      if (button) {
        button.classList.remove('pulse-recording');
      }
    };
    
    recognition.onerror = (event: any) => {
      console.error('Erro no reconhecimento de voz:', event.error);
      setIsListening(false);
      
      // Atualiza status de erro
      if (statusElement) {
        statusElement.textContent = 'Erro ao reconhecer voz';
        statusElement.classList.add('bg-red-600/80');
        
        // Esconde após 3 segundos
        setTimeout(() => {
          if (statusElement) {
            statusElement.style.transform = 'scale(0)';
            statusElement.classList.remove('bg-red-600/80');
          }
        }, 3000);
      }
      
      // Remove efeito do botão
      if (button) {
        button.classList.remove('pulse-recording');
      }
    };
    
    // Inicia o reconhecimento
    recognition.start();
  };
  
  /**
   * Processa o comando de voz recebido
   */
  const processarComando = (comando: string) => {
    // Comandos para navegação na página
    if (comando.includes('rolar para baixo') || comando.includes('descer')) {
      window.scrollBy({ top: 300, behavior: 'smooth' });
    } else if (comando.includes('rolar para cima') || comando.includes('subir')) {
      window.scrollBy({ top: -300, behavior: 'smooth' });
    }
    
    // Comandos para planos
    if (comando.includes('mostrar planos') || comando.includes('ver planos')) {
      const planosElement = document.querySelector('#planos') || 
                           document.querySelector('.pricing-section');
      
      if (planosElement) {
        planosElement.scrollIntoView({ behavior: 'smooth' });
      }
    }
    
    // Comandos específicos para cada plano
    if (comando.includes('plano básico') || comando.includes('plano basico')) {
      const planoBasico = document.querySelector('.plano-basico') || 
                         document.querySelector('[data-plano="basico"]');
      
      if (planoBasico) {
        planoBasico.scrollIntoView({ behavior: 'smooth' });
        // Highlight com animação
        planoBasico.classList.add('highlight-plan');
        setTimeout(() => planoBasico.classList.remove('highlight-plan'), 2000);
      }
    }
    
    if (comando.includes('plano premium') || comando.includes('quero premium')) {
      const planoPremium = document.querySelector('.plano-premium') || 
                          document.querySelector('[data-plano="premium"]');
      
      if (planoPremium) {
        planoPremium.scrollIntoView({ behavior: 'smooth' });
        // Highlight com animação
        planoPremium.classList.add('highlight-plan');
        setTimeout(() => planoPremium.classList.remove('highlight-plan'), 2000);
        
        // Anima o botão de compra deste plano após um pequeno delay
        setTimeout(() => {
          const button = planoPremium.querySelector('button') || 
                        planoPremium.querySelector('a.button') ||
                        planoPremium.querySelector('a.btn');
          
          if (button) {
            button.classList.add('pulse-button');
            // Remove a classe após a animação
            setTimeout(() => button.classList.remove('pulse-button'), 2000);
          }
        }, 1000);
      }
    }
    
    if (comando.includes('plano ultimate') || comando.includes('plano profissional')) {
      const planoUltimate = document.querySelector('.plano-ultimate') || 
                           document.querySelector('[data-plano="ultimate"]');
      
      if (planoUltimate) {
        planoUltimate.scrollIntoView({ behavior: 'smooth' });
        // Highlight com animação
        planoUltimate.classList.add('highlight-plan');
        setTimeout(() => planoUltimate.classList.remove('highlight-plan'), 2000);
      }
    }
    
    // Adiciona estilos para o highlight se ainda não existir
    if (!document.getElementById('voice-highlight-style')) {
      const style = document.createElement('style');
      style.id = 'voice-highlight-style';
      style.textContent = `
        .highlight-plan {
          animation: highlight-pulse 2s ease;
        }
        
        @keyframes highlight-pulse {
          0% {
            box-shadow: 0 0 0 0 rgba(139, 92, 246, 0.7);
            transform: scale(1);
          }
          50% {
            box-shadow: 0 0 20px 10px rgba(139, 92, 246, 0.5);
            transform: scale(1.03);
          }
          100% {
            box-shadow: 0 0 0 0 rgba(139, 92, 246, 0);
            transform: scale(1);
          }
        }
        
        .pulse-button {
          animation: button-attention 1s ease infinite;
        }
        
        @keyframes button-attention {
          0% {
            transform: scale(1);
          }
          50% {
            transform: scale(1.1);
          }
          100% {
            transform: scale(1);
          }
        }
      `;
      document.head.appendChild(style);
    }
    
    // Comandos de checkout
    if (comando.includes('comprar') || comando.includes('assinar')) {
      // Se especificou o plano, redireciona para o botão de compra desse plano
      let planoSelecionado;
      
      if (comando.includes('básico') || comando.includes('basico')) {
        planoSelecionado = document.querySelector('.plano-basico') || 
                          document.querySelector('[data-plano="basico"]');
      } else if (comando.includes('premium')) {
        planoSelecionado = document.querySelector('.plano-premium') || 
                          document.querySelector('[data-plano="premium"]');
      } else if (comando.includes('ultimate') || comando.includes('profissional')) {
        planoSelecionado = document.querySelector('.plano-ultimate') || 
                          document.querySelector('[data-plano="ultimate"]');
      }
      
      if (planoSelecionado) {
        planoSelecionado.scrollIntoView({ behavior: 'smooth' });
        
        // Simula clique no botão após um pequeno delay
        setTimeout(() => {
          const button = planoSelecionado?.querySelector('button') || 
                       planoSelecionado?.querySelector('a.button') ||
                       planoSelecionado?.querySelector('a.btn');
          
          if (button && button instanceof HTMLElement) {
            button.click();
          }
        }, 1000);
      }
    }
    
    // Outros comandos úteis
    if (comando.includes('voltar')) {
      window.history.back();
    }
    
    if (comando.includes('home') || comando.includes('início')) {
      window.location.href = '/';
    }
    
    // Registra o comando no analytics
    console.log('Analytics:', {
      event: 'voice_command',
      command: comando,
      timestamp: new Date().toISOString()
    });
  };
  
  // Este componente não renderiza nada diretamente (usa manipulação de DOM)
  return null;
}
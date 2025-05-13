import { useEffect, useState } from 'react';
import { Link } from 'wouter';

/**
 * Componente Popup de Oferta de Roteiros
 * Exibe uma oferta contextualizada para os serviços de criação de roteiros
 * em um popup modal com animação de entrada
 */
export default function ScriptOfferPopup() {
  const [visible, setVisible] = useState(false);
  
  // Adiciona 7 dias à data atual para criar uma data de expiração dinâmica
  const getExpirationDate = () => {
    const today = new Date();
    const futureDate = new Date(today);
    futureDate.setDate(today.getDate() + 7);
    return futureDate.toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  };
  
  useEffect(() => {
    // Verifica se o popup já foi fechado nesta sessão
    const popupClosed = sessionStorage.getItem('offer_popup_closed') === 'true';
    
    if (!popupClosed) {
      // Exibe o popup automaticamente após alguns segundos
      const timer = setTimeout(() => {
        setVisible(true);
      }, 3000); // Aparece após 3 segundos
      
      return () => clearTimeout(timer);
    }
  }, []);
  
  const closePopup = () => {
    setVisible(false);
    // Armazena que o popup foi fechado para não exibi-lo novamente na mesma sessão
    sessionStorage.setItem('offer_popup_closed', 'true');
  };
  
  if (!visible) return null;
  
  return (
    <div className="oferta-popup" id="ofertaPopup">
      <div className="oferta-conteudo">
        <span className="fechar" onClick={closePopup}>×</span>
        <h2>🔥 OFERTA ESPECIAL</h2>
        <p><strong>Crie Roteiros Profissionais com IA – Oferta Especial!</strong></p>
        <ul>
          <li>✅ Modelo profissional de estrutura narrativa</li>
          <li>✅ Template de personagem completo</li>
          <li>✅ Revisão gratuita de 1 roteiro curto pela equipe</li>
        </ul>
        <p>📅 Promoção válida até <strong>{getExpirationDate()}</strong></p>
        <Link href="/planos">
          <div className="btn-oferta">Ver Planos</div>
        </Link>
      </div>
    </div>
  );
}
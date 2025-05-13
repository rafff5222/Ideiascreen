import { useState, useEffect } from 'react';
import { useSubscription } from '@/contexts/SubscriptionContext';
import { Button } from '@/components/ui/button';
import { useLocation } from 'wouter';

interface LimitReachedModalProps {
  show: boolean;
  onClose: () => void;
}

/**
 * Modal that appears when a user reaches their request limit
 * Informs them of their current plan limits and offers the option to upgrade
 */
export function LimitReachedModal({ show, onClose }: LimitReachedModalProps) {
  const { user } = useSubscription();
  const [, setLocation] = useLocation();

  // If not shown, return null
  if (!show) {
    return null;
  }

  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
      <div className="bg-gray-800 rounded-lg p-6 max-w-md w-full">
        <div className="mb-4">
          <h3 className="text-xl font-bold text-white mb-2">Limite de Roteiros Atingido</h3>
          <div className="w-16 h-1 bg-amber-500 mb-4"></div>
          
          <p className="mb-3 text-gray-300">
            Você atingiu o limite de {user.requestLimit} roteiros do seu plano {user.plan === 'free' ? 'Gratuito' : user.plan}.
          </p>
          
          <p className="text-gray-300 mb-6">
            Faça um upgrade para continuar gerando roteiros incríveis e desbloquear mais recursos.
          </p>
        </div>
        
        <div className="grid grid-cols-2 gap-4">
          <Button variant="outline" onClick={onClose}>
            Mais tarde
          </Button>
          <Button 
            className="bg-amber-500 hover:bg-amber-600" 
            onClick={() => {
              setLocation('/plans');
              onClose();
            }}
          >
            Ver Planos
          </Button>
        </div>
      </div>
    </div>
  );
}
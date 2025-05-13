import React, { createContext, useState, useContext, useEffect } from 'react';

interface SubscriptionUser {
  plan: string;
  requestsUsed: number;
  requestLimit: number;
  name?: string;
  email?: string;
  exportFormats: string[];
}

interface SubscriptionContextType {
  user: SubscriptionUser;
  updateUser: (data: Partial<SubscriptionUser>) => void;
  incrementRequestCount: () => void;
  getRemainingRequests: () => number | string;
  canMakeRequest: () => boolean;
  resetRequestCount: () => void;
}

const defaultUser: SubscriptionUser = {
  plan: 'free',
  requestsUsed: 0,
  requestLimit: 3,
  exportFormats: ['txt']
};

const SubscriptionContext = createContext<SubscriptionContextType | undefined>(undefined);

export const SubscriptionProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<SubscriptionUser>(() => {
    // Carregar do localStorage se disponível
    const storedUser = localStorage.getItem('user_subscription');
    if (storedUser) {
      try {
        return JSON.parse(storedUser);
      } catch (e) {
        console.error('Erro ao parsear dados de assinatura:', e);
      }
    }
    return defaultUser;
  });

  // Salvar no localStorage quando mudar
  useEffect(() => {
    localStorage.setItem('user_subscription', JSON.stringify(user));
  }, [user]);

  const updateUser = (data: Partial<SubscriptionUser>) => {
    setUser(prev => {
      // Ao mudar de plano, atualizar o limite de requisições
      const newData = { ...prev, ...data };
      
      // Atualizar o limite de requisições com base no plano
      if (data.plan && data.plan !== prev.plan) {
        switch (data.plan) {
          case 'free':
            newData.requestLimit = 3;
            newData.exportFormats = ['txt'];
            break;
          case 'starter':
            newData.requestLimit = 30;
            newData.exportFormats = ['txt', 'pdf'];
            break;
          case 'pro':
            newData.requestLimit = Infinity;
            newData.exportFormats = ['txt', 'pdf', 'fdx'];
            break;
        }
      }
      
      return newData;
    });
  };

  const incrementRequestCount = () => {
    setUser(prev => ({
      ...prev,
      requestsUsed: prev.requestsUsed + 1
    }));
  };

  const resetRequestCount = () => {
    setUser(prev => ({
      ...prev,
      requestsUsed: 0
    }));
  };

  const getRemainingRequests = () => {
    if (user.requestLimit === Infinity) {
      return 'ilimitado';
    }
    return Math.max(0, user.requestLimit - user.requestsUsed);
  };

  const canMakeRequest = () => {
    if (user.requestLimit === Infinity) return true;
    return user.requestsUsed < user.requestLimit;
  };

  return (
    <SubscriptionContext.Provider 
      value={{ 
        user, 
        updateUser, 
        incrementRequestCount, 
        getRemainingRequests, 
        canMakeRequest,
        resetRequestCount 
      }}
    >
      {children}
    </SubscriptionContext.Provider>
  );
};

export const useSubscription = () => {
  const context = useContext(SubscriptionContext);
  if (context === undefined) {
    throw new Error('useSubscription deve ser usado dentro de um SubscriptionProvider');
  }
  return context;
};
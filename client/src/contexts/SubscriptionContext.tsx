import React, { createContext, useContext, useState, useEffect } from 'react';
import { apiRequest } from '@/lib/queryClient';
import { useToast } from '@/hooks/use-toast';

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

// Default values for the subscription context
const defaultUser: SubscriptionUser = {
  plan: 'free',
  requestsUsed: 0,
  requestLimit: 3,
  exportFormats: ['txt'],
};

const SubscriptionContext = createContext<SubscriptionContextType | undefined>(undefined);

export const SubscriptionProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<SubscriptionUser>(defaultUser);
  const { toast } = useToast();
  
  // Load user subscription data from localStorage on mount
  useEffect(() => {
    const storedUser = localStorage.getItem('subscription');
    if (storedUser) {
      try {
        const parsedUser = JSON.parse(storedUser);
        setUser(parsedUser);
      } catch (error) {
        console.error('Failed to parse stored subscription data:', error);
      }
    }
    
    // Try to load user data from the server if available
    fetchUserSubscription();
  }, []);
  
  // Save user subscription data to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('subscription', JSON.stringify(user));
  }, [user]);
  
  // Fetch user subscription data from the server
  const fetchUserSubscription = async () => {
    try {
      const response = await apiRequest('GET', '/api/user/subscription');
      if (response.ok) {
        const data = await response.json();
        setUser((prevUser) => ({
          ...prevUser,
          ...data,
        }));
      }
    } catch (error) {
      console.error('Failed to fetch user subscription:', error);
    }
  };
  
  // Update user data
  const updateUser = (data: Partial<SubscriptionUser>) => {
    setUser((prevUser) => ({
      ...prevUser,
      ...data,
    }));
  };
  
  // Increment the request count
  const incrementRequestCount = () => {
    // Don't increment if on pro plan (unlimited)
    if (user.plan === 'pro') {
      return;
    }
    
    setUser((prevUser) => ({
      ...prevUser,
      requestsUsed: prevUser.requestsUsed + 1,
    }));
  };
  
  // Reset the request count
  const resetRequestCount = () => {
    setUser((prevUser) => ({
      ...prevUser,
      requestsUsed: 0,
    }));
  };
  
  // Calculate remaining requests
  const getRemainingRequests = () => {
    if (user.plan === 'pro') {
      return '∞';
    }
    
    return Math.max(0, user.requestLimit - user.requestsUsed);
  };
  
  // Check if the user can make a request
  const canMakeRequest = () => {
    // Pro plan has unlimited requests
    if (user.plan === 'pro') {
      return true;
    }
    
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
        resetRequestCount,
      }}
    >
      {children}
    </SubscriptionContext.Provider>
  );
};

export const useSubscription = () => {
  const context = useContext(SubscriptionContext);
  if (context === undefined) {
    throw new Error('useSubscription must be used within a SubscriptionProvider');
  }
  return context;
};
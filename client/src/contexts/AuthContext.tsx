import React, { createContext, useContext, useState, useEffect } from 'react';
import { useLocation } from 'wouter';

// Defina o tipo do usuário
interface User {
  id: number;
  username: string;
  name: string | null;
  email: string;
  profileImageUrl: string | null;
  planType: string;
  requestsUsed?: number;
  requestsLimit?: number;
}

// Defina o tipo do contexto de autenticação
interface AuthContextType {
  isAuthenticated: boolean;
  user: User | null;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
}

// Crie o contexto de autenticação
const AuthContext = createContext<AuthContextType>({
  isAuthenticated: false,
  user: null,
  login: async () => false,
  logout: () => {},
});

// Hook personalizado para usar o contexto de autenticação
export const useAuth = () => useContext(AuthContext);

// Provedor do contexto de autenticação
export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [user, setUser] = useState<User | null>(null);
  const [, setLocation] = useLocation();

  // Verificar se o usuário está autenticado ao carregar a página
  useEffect(() => {
    const fetchCurrentUser = async () => {
      try {
        // Primeiro verificar se há usuário armazenado localmente para UI rápida
        const storedUser = localStorage.getItem('user');
        if (storedUser) {
          try {
            const parsedUser = JSON.parse(storedUser);
            setUser(parsedUser);
            setIsAuthenticated(true);
          } catch (error) {
            console.error('Erro ao analisar usuário armazenado:', error);
            localStorage.removeItem('user');
          }
        }
        
        // Verificar com o servidor para garantir que a sessão ainda é válida
        const response = await fetch('/api/auth/me', {
          credentials: 'include', // Importante para cookies de sessão
        });
        
        if (response.ok) {
          const data = await response.json();
          if (data.success && data.user) {
            // Atualizar o usuário com dados do servidor
            localStorage.setItem('user', JSON.stringify(data.user));
            setUser(data.user);
            setIsAuthenticated(true);
          } else {
            // Se o servidor não reconhecer o usuário, fazer logout local
            localStorage.removeItem('user');
            setUser(null);
            setIsAuthenticated(false);
          }
        } else {
          // Se houver erro de autenticação no servidor
          if (response.status === 401) {
            localStorage.removeItem('user');
            setUser(null);
            setIsAuthenticated(false);
          }
          // Outros erros: manter estado atual, tentar novamente mais tarde
        }
      } catch (error) {
        console.error('Erro ao verificar autenticação:', error);
        // Em caso de erro de rede, manter o estado atual do usuário
      }
    };
    
    fetchCurrentUser();
  }, []);

  // Função de login
  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      // Fazer a chamada à API real
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
        credentials: 'include', // Importante para cookies de sessão
      });
      
      // Verificar se a resposta foi bem-sucedida
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Falha na autenticação');
      }
      
      // Obter dados do usuário da resposta
      const data = await response.json();
      
      if (data.success && data.user) {
        // Armazenar usuário no localStorage para persistência entre refreshes
        localStorage.setItem('user', JSON.stringify(data.user));
        
        // Atualizar o estado
        setUser(data.user);
        setIsAuthenticated(true);
        
        return true;
      } else {
        throw new Error('Dados de usuário inválidos na resposta');
      }
    } catch (error) {
      console.error('Erro de login:', error);
      return false;
    }
  };

  // Função de logout
  const logout = async () => {
    try {
      // Chamar a API para fazer logout
      const response = await fetch('/api/auth/logout', {
        method: 'POST',
        credentials: 'include', // Importante para cookies de sessão
      });
      
      if (!response.ok) {
        console.error('Erro ao fazer logout na API');
      }
    } catch (error) {
      console.error('Erro ao fazer logout:', error);
    } finally {
      // Mesmo que a API falhe, limpar a sessão localmente
      localStorage.removeItem('user');
      setUser(null);
      setIsAuthenticated(false);
      setLocation('/login');
    }
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

// Componente de redirecionamento para páginas protegidas
export const RequireAuth: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isAuthenticated } = useAuth();
  const [, setLocation] = useLocation();

  useEffect(() => {
    if (!isAuthenticated) {
      setLocation('/login');
    }
  }, [isAuthenticated, setLocation]);

  return isAuthenticated ? <>{children}</> : null;
};
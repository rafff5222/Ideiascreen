import React, { createContext, useContext, useState, useEffect } from 'react';
import { useLocation } from 'wouter';

// Defina o tipo do usuário
interface User {
  id?: string;
  name?: string;
  email?: string;
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
  }, []);

  // Função de login
  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      // Em um aplicativo real, você faria uma chamada à API aqui
      // Este é apenas um mock para fins de demonstração
      
      // Simula um atraso de 1 segundo para parecer uma chamada à API
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Simula um usuário autenticado (para desenvolvimento)
      const mockUser = {
        id: '123',
        name: email.split('@')[0], // Usa a parte do e-mail antes do @ como nome
        email,
      };
      
      // Armazena o usuário no localStorage para persistência
      localStorage.setItem('user', JSON.stringify(mockUser));
      
      // Atualiza o estado
      setUser(mockUser);
      setIsAuthenticated(true);
      
      return true;
    } catch (error) {
      console.error('Erro de login:', error);
      return false;
    }
  };

  // Função de logout
  const logout = () => {
    localStorage.removeItem('user');
    setUser(null);
    setIsAuthenticated(false);
    setLocation('/login');
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
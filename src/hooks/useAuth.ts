// hooks/useAuth.ts
import React, { useState, useEffect, createContext, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '@/libs/api';

// Criar e exportar o contexto
export const AuthContext = createContext({} as any);

// Provider usando createElement
export function AuthProvider(props: { children: any }) {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    try {
      const authResponse = await api.get('/v1/Auth/CheckAuth');
      
      if (authResponse.data.authenticated) {
        const userResponse = await api.get('/v1/Users/Me');
        const userData = userResponse.data.data;
        
        if (userData.role === 0) {
          setUser(userData);
          setIsAuthenticated(true);
        } else {
          await logout();
        }
      }
    } catch (error) {
      console.error('Erro ao verificar autenticação:', error);
      await logout();
    } finally {
      setIsLoading(false);
    }
  };

  const login = async (email: string, password: string) => {
    try {
      setIsLoading(true);
      
      const normalizedEmail = email.toLowerCase();
      
      const response = await api.post('/v1/Auth/Login', {
        email: normalizedEmail,
        password
      });

      const userData = response.data.data;

      if (userData.role !== 0) {
        throw new Error('Email ou senha inválidos');
      }

      setUser(userData);
      setIsAuthenticated(true);
      navigate('/analytics');
      return true;
    } catch (error: any) {
      if (error.response?.status === 401) {
        throw new Error('Email ou senha inválidos');
      } else {
        throw error;
      }
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    try {
      setIsLoading(true);
      
      // Chamar endpoint de logout
      await api.post('/v1/Auth/Logout');
      
      console.log('Logout realizado com sucesso');
      
    } catch (error: any) {
      console.error('Erro ao fazer logout na API:', error);
      // Mesmo se a API falhar, continuamos com o logout local
    } finally {
      // Sempre limpar o estado local
      setUser(null);
      setIsAuthenticated(false);
      setIsLoading(false);
      
      // Redirecionar para login
      navigate('/login', { replace: true });
    }
  };

  const value = {
    user,
    login,
    logout,
    isLoading,
    isAuthenticated,
  };

  // Usar createElement em vez de JSX
  return React.createElement(
    AuthContext.Provider,
    { value },
    props.children
  );
}

// Hook
export function useAuth() {
  return useContext(AuthContext);
}

// Helper function
export function getUserInitials(user: any) {
  if (!user) return 'US';
  return `${user.firstName?.charAt(0) || ''}${user.lastName?.charAt(0) || ''}`.toUpperCase();
}
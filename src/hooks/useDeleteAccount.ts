// hooks/useDeleteAccount.ts
import { useState, useCallback } from 'react';
import api from '@/libs/api';

interface DeleteAccountResponse {
  code: number;
  message: string;
}

interface ApiError {
  response?: {
    data?: {
      message?: string;
    };
  };
  message?: string;
}

export const useDeleteAccount = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const resetState = useCallback(() => {
    setError(null);
    setSuccess(false);
    setIsLoading(false);
  }, []);

  // Função para fazer logout
  const performLogout = async (): Promise<boolean> => {
    try {
      await api.post('/v1/Auth/Logout');
      console.log('Logout realizado com sucesso após exclusão da conta');
      return true;
    } catch (error) {
      console.error('Erro ao fazer logout:', error);
      // Mesmo se o logout falhar, consideramos sucesso na exclusão
      return true;
    }
  };

  // Função para verificar se está autenticado
  const checkAuthStatus = async (): Promise<boolean> => {
    try {
      const response = await api.get<{ authenticated: boolean }>('/v1/Auth/CheckAuth');
      return response.data.authenticated;
    } catch (error) {
      console.error('Erro ao verificar status de autenticação:', error);
      return false;
    }
  };

  const deleteAccount = async (userId: string): Promise<boolean> => {
    if (!userId) {
      setError('ID do usuário não fornecido');
      return false;
    }

    setIsLoading(true);
    setError(null);
    setSuccess(false);

    try {
      // Primeiro verifica se está autenticado
      const isAuthenticated = await checkAuthStatus();
      
      // Faz a requisição para excluir a conta
      const response = await api.delete<DeleteAccountResponse>(`/v1/Users/Delete?Id=${userId}`);
      
      if (response.data.code === 200) {
        setSuccess(true);
        
        // Se estava autenticado, faz logout automaticamente
        if (isAuthenticated) {
          console.log('Usuário estava autenticado, realizando logout automático...');
          await performLogout();
        }
        
        return true;
      } else {
        setError(response.data.message || 'Erro ao excluir conta');
        return false;
      }
    } catch (err: unknown) {
      const error = err as ApiError;
      
      if (error.response?.data?.message) {
        setError(error.response.data.message);
      } else if (error.message?.includes('Network Error')) {
        setError('Erro de conexão. Verifique sua internet e tente novamente.');
      } else {
        setError('Erro interno do servidor. Tente novamente mais tarde.');
      }
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    deleteAccount,
    isLoading,
    error,
    success,
    resetState,
  };
};
// hooks/useUpdatePassword.ts
import { useState, useCallback } from 'react';
import api from '@/libs/api';

interface UpdatePasswordData {
  id: string;
  currentPassword: string;
  newPassword: string;
  confirmNewPassword: string;
}

interface UpdatePasswordResponse {
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

export const useUpdatePassword = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const resetState = useCallback(() => {
    setError(null);
    setSuccess(false);
  }, []);

  const updatePassword = async (data: UpdatePasswordData): Promise<boolean> => {
    setIsLoading(true);
    setError(null);
    setSuccess(false);

    try {
      // Validação básica
      if (data.newPassword !== data.confirmNewPassword) {
        setError('As senhas não coincidem');
        return false;
      }

      if (data.newPassword.length < 6) {
        setError('A nova senha deve ter pelo menos 6 caracteres');
        return false;
      }

      // ✅ CORREÇÃO: Usando POST em vez de PATCH e endpoint correto
      const response = await api.post<UpdatePasswordResponse>('/v1/Password/Change', {
        id: data.id,
        currentPassword: data.currentPassword,
        newPassword: data.newPassword,
        confirmNewPassword: data.confirmNewPassword
      });

      if (response.data.code === 200) {
        setSuccess(true);
        return true;
      } else {
        setError(response.data.message || 'Erro ao atualizar senha');
        return false;
      }
    } catch (error: unknown) {
      const apiError = error as ApiError;
      
      if (apiError.response?.data?.message) {
        setError(apiError.response.data.message);
      } else if (apiError.message?.includes('Network Error')) {
        setError('Erro de conexão. Tente novamente.');
      } else {
        setError('Erro ao atualizar senha. Tente novamente.');
      }
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    updatePassword,
    isLoading,
    error,
    success,
    resetState,
  };
};
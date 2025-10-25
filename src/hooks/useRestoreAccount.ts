// src/hooks/useRestoreAccount.ts
import { useState } from 'react';
import api from '@/libs/api';

interface RestoreAccountResponse {
  code: number;
  message: string;
}

export const useRestoreAccount = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const restoreAccount = async (userId: string): Promise<boolean> => {
    // Reset states no início
    setIsLoading(true);
    setError(null);
    setSuccess(false);

    try {
      const response = await api.patch<RestoreAccountResponse>(`/v1/Users/Restore?Id=${userId}`);
      
      if (response.data.code === 200) {
        setSuccess(true);
        return true;
      } else {
        setError(response.data.message || 'Erro ao restaurar conta');
        return false;
      }
    } catch (error: any) {
      console.error('Erro ao restaurar conta:', error);
      
      const errorMessage = error.response?.data?.message 
        || error.response?.data 
        || error.message 
        || 'Erro ao restaurar conta. Tente novamente.';
      
      setError(errorMessage);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const resetState = () => {
    setError(null);
    setSuccess(false);
    setIsLoading(false);
  };

  return {
    restoreAccount,
    isLoading,
    error,
    success,
    resetState,
  };
};
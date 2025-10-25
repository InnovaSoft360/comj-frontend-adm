// src/hooks/useEnableRejected.ts
import { useState } from 'react';
import api from '@/libs/api';

interface EnableRejectedResponse {
  code: number;
  message: string;
}

export const useEnableRejected = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const enableRejected = async (applicationId: string): Promise<boolean> => {
    setIsLoading(true);
    setError(null);
    setSuccess(false);

    try {
      const response = await api.patch<EnableRejectedResponse>(
        `/v1/Applications/EnableRejected?applicationId=${applicationId}`
      );
      
      if (response.data.code === 200) {
        setSuccess(true);
        return true;
      } else {
        setError(response.data.message || 'Erro ao permitir edição');
        return false;
      }
    } catch (error: any) {
      console.error('Erro ao permitir edição:', error);
      
      const errorMessage = error.response?.data?.message 
        || error.message 
        || 'Erro ao permitir edição. Tente novamente.';
      
      setError(errorMessage);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const resetState = () => {
    setError(null);
    setSuccess(false);
  };

  return {
    enableRejected,
    isLoading,
    error,
    success,
    resetState,
  };
};
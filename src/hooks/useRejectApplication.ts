// src/hooks/useRejectApplication.ts
import { useState } from 'react';
import api from '@/libs/api';

interface RejectApplicationRequest {
  applicationId: string;
  comentario: string;
}

interface RejectApplicationResponse {
  code: number;
  message: string;
}

export const useRejectApplication = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const rejectApplication = async (applicationId: string, comentario: string): Promise<boolean> => {
    setIsLoading(true);
    setError(null);
    setSuccess(false);

    try {
      const response = await api.patch<RejectApplicationResponse>(
        '/v1/Applications/Reject',
        {
          applicationId: applicationId,
          comentario: comentario
        } as RejectApplicationRequest
      );
      
      if (response.data.code === 200) {
        setSuccess(true);
        return true;
      } else {
        setError(response.data.message || 'Erro ao rejeitar candidatura');
        return false;
      }
    } catch (error: any) {
      console.error('Erro ao rejeitar candidatura:', error);
      
      const errorMessage = error.response?.data?.message 
        || error.message 
        || 'Erro ao rejeitar candidatura. Tente novamente.';
      
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
    rejectApplication,
    isLoading,
    error,
    success,
    resetState,
  };
};
// src/hooks/useApproveApplication.ts
import { useState } from 'react';
import api from '@/libs/api';

interface ApproveApplicationRequest {
  applicationId: string;
}

interface ApproveApplicationResponse {
  code: number;
  message: string;
}

export const useApproveApplication = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const approveApplication = async (applicationId: string): Promise<boolean> => {
    setIsLoading(true);
    setError(null);
    setSuccess(false);

    try {
      const response = await api.post<ApproveApplicationResponse>(
        '/v1/Applications/Approve',
        {
          applicationId: applicationId
        } as ApproveApplicationRequest
      );
      
      if (response.data.code === 200) {
        setSuccess(true);
        return true;
      } else {
        setError(response.data.message || 'Erro ao aprovar candidatura');
        return false;
      }
    } catch (error: any) {
      console.error('Erro ao aprovar candidatura:', error);
      
      const errorMessage = error.response?.data?.message 
        || error.message 
        || 'Erro ao aprovar candidatura. Tente novamente.';
      
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
    approveApplication,
    isLoading,
    error,
    success,
    resetState,
  };
};
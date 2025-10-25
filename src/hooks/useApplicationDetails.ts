// src/hooks/useApplicationDetails.ts
import { useState } from 'react';
import api from '@/libs/api';

export interface ApplicationDetails {
  id: string;
  userId: string;
  status: number;
  documentIdCardUrl: string;
  documentSalaryDeclarationUrl: string;
  documentBankStatementUrl: string;
  documentLastBankReceiptUrl: string;
  allowRejectedEdit: boolean;
  createdAt: string;
  updatedAt: string;
  remainingDays: number;
  reviewComments: string[];
  lastReviewComment: string | null;
}

interface ApplicationDetailsResponse {
  code: number;
  message: string;
  data: ApplicationDetails;
}

export const useApplicationDetails = () => {
  const [application, setApplication] = useState<ApplicationDetails | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const getApplicationDetails = async (applicationId: string): Promise<ApplicationDetails | null> => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await api.get<ApplicationDetailsResponse>(
        `/v1/Applications/GetById?Id=${applicationId}`
      );
      
      if (response.data.code === 200) {
        setApplication(response.data.data);
        return response.data.data;
      } else {
        setError(response.data.message || 'Erro ao carregar detalhes da candidatura');
        return null;
      }
    } catch (error: any) {
      console.error('Erro ao carregar detalhes da candidatura:', error);
      
      const errorMessage = error.response?.data?.message 
        || error.message 
        || 'Erro ao carregar detalhes da candidatura';
      
      setError(errorMessage);
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  const resetState = () => {
    setApplication(null);
    setError(null);
  };

  return {
    application,
    isLoading,
    error,
    getApplicationDetails,
    resetState,
  };
};
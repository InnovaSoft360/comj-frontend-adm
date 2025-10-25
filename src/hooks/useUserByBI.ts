// src/hooks/useUserByBI.ts
import { useState } from 'react';
import api from '@/libs/api';
import type { User } from './useUsers';

interface UserByBIResponse {
  code: number;
  message: string;
  data: User;
}

export const useUserByBI = () => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const searchUserByBI = async (bi: string): Promise<User | null> => {
    if (!bi || bi.length < 14) {
      setError('BI deve ter 14 caracteres');
      return null;
    }

    try {
      setIsLoading(true);
      setError(null);
      setUser(null);

      const response = await api.get<UserByBIResponse>(`/v1/Users/GetByBI?BI=${bi}`);
      
      if (response.data.code === 200 && response.data.data) {
        setUser(response.data.data);
        return response.data.data;
      } else {
        setError('Usuário não encontrado');
        return null;
      }
    } catch (error: any) {
      console.error('Erro ao buscar usuário por BI:', error);
      
      if (error.response?.status === 404) {
        setError('Usuário não encontrado');
      } else if (error.response?.data?.message) {
        setError(error.response.data.message);
      } else {
        setError('Erro ao buscar usuário');
      }
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  const clearSearch = () => {
    setUser(null);
    setError(null);
  };

  return {
    user,
    isLoading,
    error,
    searchUserByBI,
    clearSearch
  };
};
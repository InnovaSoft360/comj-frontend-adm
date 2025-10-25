// src/hooks/useUsers.ts
import { useState, useEffect } from 'react';
import api from '@/libs/api';

export interface User {
  id: string;
  firstName: string;
  lastName: string;
  photoUrl: string;
  bi: string;
  email: string;
  role: number;
}

interface UsersResponse {
  code: number;
  message: string | null;
  data: User[];
}

export const useUsers = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadUsers = async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      const response = await api.get<UsersResponse>('/v1/Users/GetAll');
      
      if (response.data.code === 200) {
        setUsers(response.data.data);
      }
    } catch (error: any) {
      console.error('Erro ao carregar usuários:', error);
      setError('Erro ao carregar usuários. Tente novamente.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadUsers();
  }, []);

  return {
    users,
    isLoading,
    error,
    loadUsers
  };
};
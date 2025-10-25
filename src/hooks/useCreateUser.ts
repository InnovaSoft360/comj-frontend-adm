// src/hooks/useCreateUser.ts
import { useState } from 'react';
import api from '@/libs/api';
import { useAlert } from '@/components/ui/customAlert';

interface CreateUserForm {
  firstName: string;
  lastName: string;
  email: string;
  bi: string;
  password: string;
  confirmPassword: string;
}

interface UseCreateUserReturn {
  isLoading: boolean;
  createUser: (userData: CreateUserForm) => Promise<boolean>;
}

export const useCreateUser = (): UseCreateUserReturn => {
  const [isLoading, setIsLoading] = useState(false);
  const { showAlert } = useAlert();

  const createUser = async (userData: CreateUserForm): Promise<boolean> => {
    setIsLoading(true);
    
    try {
      const response = await api.post('/v1/Auth/RegisterAdm', {
        firstName: userData.firstName,
        lastName: userData.lastName,
        bi: userData.bi,
        email: userData.email,
        password: userData.password,
        confirmPassword: userData.confirmPassword
      });

      if (response.data.code === 200) {
        showAlert('Usuário criado com sucesso!', 'success');
        return true;
      } else {
        showAlert(response.data.message || 'Erro ao criar usuário', 'error');
        return false;
      }
    } catch (error: any) {
      console.error('Erro ao criar usuário:', error);
      
      if (error.response?.data?.message) {
        showAlert(error.response.data.message, 'error');
      } else if (error.response?.data?.errors) {
        const firstError = Object.values(error.response.data.errors)[0];
        showAlert(Array.isArray(firstError) ? firstError[0] : String(firstError), 'error');
      } else if (error.request) {
        showAlert('Erro de conexão. Verifique sua internet.', 'error');
      } else {
        showAlert('Erro ao criar usuário. Tente novamente.', 'error');
      }
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    isLoading,
    createUser
  };
};
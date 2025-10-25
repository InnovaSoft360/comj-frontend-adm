// components/modals/UpdatePasswordModal.tsx
import { useState, useEffect } from 'react';
import { FaTimes, FaEye, FaEyeSlash, FaKey, FaCheck } from 'react-icons/fa';
import { useUpdatePassword } from '@/hooks/useUpdatePassword';
import { useAuth } from '@/hooks/useAuth';

interface UpdatePasswordModalProps {
  isOpen: boolean;
  onClose: () => void;
  onPasswordUpdated: () => void;
}

export default function UpdatePasswordModal({ isOpen, onClose, onPasswordUpdated }: UpdatePasswordModalProps) {
  const [formData, setFormData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmNewPassword: '' // ✅ Mudado para confirmNewPassword
  });
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  
  const { updatePassword, isLoading, error, success, resetState } = useUpdatePassword();
  const { user } = useAuth(); // ✅ Pegando o usuário para ter o ID

  // Reset form quando modal abrir
  useEffect(() => {
    if (isOpen) {
      resetState();
      setFormData({
        currentPassword: '',
        newPassword: '',
        confirmNewPassword: ''
      });
      setShowCurrentPassword(false);
      setShowNewPassword(false);
      setShowConfirmPassword(false);
    }
  }, [isOpen, resetState]);

  // Função para validar senha
  const validatePassword = (password: string): boolean => {
    return password.length >= 6 && 
           /[a-z]/.test(password) && // pelo menos uma minúscula
           /[A-Z]/.test(password) && // pelo menos uma maiúscula  
           /\d/.test(password);      // pelo menos um número
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user) {
      alert('Usuário não encontrado');
      return;
    }

    // Validações
    if (formData.newPassword.length < 6) {
      alert("A nova senha deve ter pelo menos 6 caracteres.");
      return;
    }

    if (!validatePassword(formData.newPassword)) {
      alert("A senha deve conter letra maiúscula, minúscula e número.");
      return;
    }

    if (formData.newPassword !== formData.confirmNewPassword) {
      alert("As senhas não coincidem!");
      return;
    }

    const success = await updatePassword({
      id: user.id, // ✅ Agora envia o ID do usuário
      currentPassword: formData.currentPassword,
      newPassword: formData.newPassword,
      confirmNewPassword: formData.confirmNewPassword // ✅ Nome correto
    });

    if (success) {
      setTimeout(() => {
        onPasswordUpdated();
        onClose();
      }, 1500);
    }
  };

  const handleChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  // Fechar modal ao pressionar ESC
  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEsc);
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('keydown', handleEsc);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50 backdrop-blur-sm">
      <div 
        className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl w-full max-w-md transform transition-all duration-300 scale-100 opacity-100"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-orange-100 dark:bg-orange-900 rounded-lg">
              <FaKey className="w-5 h-5 text-orange-600 dark:text-orange-400" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                Alterar Senha
              </h2>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Digite sua senha atual e a nova senha
              </p>
            </div>
          </div>
          
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
            disabled={isLoading}
          >
            <FaTimes className="w-5 h-5 text-gray-500 dark:text-gray-400" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {/* Mensagem de Sucesso */}
          {success && (
            <div className="p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg flex items-center space-x-3">
              <FaCheck className="w-5 h-5 text-green-600 dark:text-green-400 flex-shrink-0" />
              <div>
                <p className="text-green-800 dark:text-green-300 font-medium">
                  Senha alterada com sucesso!
                </p>
              </div>
            </div>
          )}

          {/* Mensagem de Erro */}
          {error && !success && (
            <div className="p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
              <p className="text-red-800 dark:text-red-300 text-sm">
                {error === 'Current password is incorrect' && 'Senha atual incorreta'}
                {error === 'New password must be different from current password' && 'A nova senha deve ser diferente da senha atual'}
                {error === 'Password must be at least 6 characters' && 'A senha deve ter pelo menos 6 caracteres'}
                {error === 'Passwords do not match' && 'As senhas não coincidem'}
                {![
                  'Current password is incorrect',
                  'New password must be different from current password', 
                  'Password must be at least 6 characters',
                  'Passwords do not match'
                ].includes(error || '') && (error || 'Erro ao alterar senha')}
              </p>
            </div>
          )}

          {/* Senha Atual */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Senha Atual *
            </label>
            <div className="relative">
              <input
                type={showCurrentPassword ? "text" : "password"}
                required
                value={formData.currentPassword}
                onChange={(e) => handleChange('currentPassword', e.target.value)}
                className="w-full px-4 py-3 pr-10 border-2 border-gray-200 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 focus:outline-none focus:border-orange-500 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                placeholder="Digite sua senha atual"
                disabled={isLoading || success}
              />
              <button
                type="button"
                onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors disabled:opacity-50"
                disabled={isLoading || success}
              >
                {showCurrentPassword ? <FaEyeSlash className="w-4 h-4" /> : <FaEye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {/* Nova Senha */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Nova Senha *
            </label>
            <div className="relative">
              <input
                type={showNewPassword ? "text" : "password"}
                required
                value={formData.newPassword}
                onChange={(e) => handleChange('newPassword', e.target.value)}
                className="w-full px-4 py-3 pr-10 border-2 border-gray-200 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 focus:outline-none focus:border-orange-500 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                placeholder="Digite a nova senha"
                disabled={isLoading || success}
              />
              <button
                type="button"
                onClick={() => setShowNewPassword(!showNewPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors disabled:opacity-50"
                disabled={isLoading || success}
              >
                {showNewPassword ? <FaEyeSlash className="w-4 h-4" /> : <FaEye className="w-4 h-4" />}
              </button>
            </div>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
              Mínimo 6 caracteres, letra maiúscula, minúscula e número
            </p>
          </div>

          {/* Confirmar Nova Senha */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Confirmar Nova Senha *
            </label>
            <div className="relative">
              <input
                type={showConfirmPassword ? "text" : "password"}
                required
                value={formData.confirmNewPassword}
                onChange={(e) => handleChange('confirmNewPassword', e.target.value)}
                className="w-full px-4 py-3 pr-10 border-2 border-gray-200 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 focus:outline-none focus:border-orange-500 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                placeholder="Confirme a nova senha"
                disabled={isLoading || success}
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors disabled:opacity-50"
                disabled={isLoading || success}
              >
                {showConfirmPassword ? <FaEyeSlash className="w-4 h-4" /> : <FaEye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {/* Validação de senha em tempo real */}
          {formData.newPassword && (
            <div className="p-3 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
              <p className="text-sm font-medium text-blue-800 dark:text-blue-300 mb-2">
                Requisitos da senha:
              </p>
              <ul className="text-xs text-blue-700 dark:text-blue-400 space-y-1">
                <li className={`flex items-center ${formData.newPassword.length >= 6 ? 'text-green-600' : ''}`}>
                  {formData.newPassword.length >= 6 ? '✅' : '❌'} Mínimo 6 caracteres
                </li>
                <li className={`flex items-center ${/[A-Z]/.test(formData.newPassword) ? 'text-green-600' : ''}`}>
                  {/[A-Z]/.test(formData.newPassword) ? '✅' : '❌'} Pelo menos uma letra maiúscula
                </li>
                <li className={`flex items-center ${/[a-z]/.test(formData.newPassword) ? 'text-green-600' : ''}`}>
                  {/[a-z]/.test(formData.newPassword) ? '✅' : '❌'} Pelo menos uma letra minúscula
                </li>
                <li className={`flex items-center ${/\d/.test(formData.newPassword) ? 'text-green-600' : ''}`}>
                  {/\d/.test(formData.newPassword) ? '✅' : '❌'} Pelo menos um número
                </li>
              </ul>
            </div>
          )}

          {/* Botões */}
          <div className="flex space-x-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              disabled={isLoading}
              className="flex-1 px-4 py-3 border-2 border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-xl font-medium hover:bg-gray-50 dark:hover:bg-gray-700 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Cancelar
            </button>
            
            <button
              type="submit"
              disabled={isLoading || success || 
                formData.newPassword.length < 6 ||
                formData.newPassword !== formData.confirmNewPassword ||
                !validatePassword(formData.newPassword)
              }
              className="flex-1 px-4 py-3 bg-gradient-to-r from-orange-500 to-red-600 text-white rounded-xl font-medium hover:from-orange-600 hover:to-red-700 transition-all duration-200 disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
            >
              {isLoading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  <span>Alterando...</span>
                </>
              ) : success ? (
                <>
                  <FaCheck className="w-4 h-4" />
                  <span>Sucesso!</span>
                </>
              ) : (
                <span>Alterar Senha</span>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
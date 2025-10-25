// components/modals/DeleteAccountModal.tsx
import { useState, useEffect } from 'react';
import { FaTimes, FaExclamationTriangle, FaCheck, FaSignOutAlt } from 'react-icons/fa';
import { useDeleteAccount } from '@/hooks/useDeleteAccount';

interface DeleteAccountModalProps {
  isOpen: boolean;
  onClose: () => void;
  userId: string;
  onAccountDeleted: () => void;
}

export default function DeleteAccountModal({ 
  isOpen, 
  onClose, 
  userId, 
  onAccountDeleted 
}: DeleteAccountModalProps) {
  const [confirmationText, setConfirmationText] = useState('');
  const [isConfirmed, setIsConfirmed] = useState(false);
  
  const { deleteAccount, isLoading, error, success, resetState } = useDeleteAccount();

  const requiredText = "EXCLUIR MINHA CONTA";

  // Reset state quando modal abrir
  useEffect(() => {
    if (isOpen) {
      resetState();
      setConfirmationText('');
      setIsConfirmed(false);
    }
  }, [isOpen, resetState]);

  // Verificar confirmação
  useEffect(() => {
    setIsConfirmed(confirmationText === requiredText);
  }, [confirmationText, requiredText]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!isConfirmed || isLoading) {
      return;
    }

    const deleted = await deleteAccount(userId);

    if (deleted) {
      setTimeout(() => {
        onAccountDeleted();
        onClose();
        
        // Redirecionar para login após exclusão (opcional)
        // window.location.href = '/login';
      }, 2000);
    }
  };

  // Fechar com ESC e controlar scroll
  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && !isLoading) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEsc);
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('keydown', handleEsc);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, onClose, isLoading]);

  // Não renderizar se não estiver aberto
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50 backdrop-blur-sm">
      <div 
        className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl w-full max-w-md transform transition-all duration-300 scale-100 opacity-100"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-red-200 dark:border-red-800">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-red-100 dark:bg-red-900 rounded-lg">
              <FaExclamationTriangle className="w-5 h-5 text-red-600 dark:text-red-400" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                Excluir Conta
              </h2>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Ação irreversível - Tenha cuidado
              </p>
            </div>
          </div>
          
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors disabled:opacity-50"
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
                  Conta excluída com sucesso!
                </p>
                <p className="text-green-700 dark:text-green-400 text-sm">
                  Você foi desconectado automaticamente.
                </p>
              </div>
            </div>
          )}

          {/* Mensagem de Erro */}
          {error && !success && (
            <div className="p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
              <p className="text-red-800 dark:text-red-300 text-sm">
                {error}
              </p>
            </div>
          )}

          {!success && (
            <>
              {/* Avisos Importantes */}
              <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4">
                <h3 className="font-semibold text-red-800 dark:text-red-300 mb-2">
                  ⚠️ Atenção: Esta ação é irreversível!
                </h3>
                <ul className="text-sm text-red-700 dark:text-red-400 space-y-1">
                  <li>• Todos os seus dados serão permanentemente excluídos</li>
                  <li>• Sua candidatura será cancelada</li>
                  <li>• Não será possível recuperar a conta</li>
                  <li>• Você será desconectado automaticamente</li>
                  <li>• Esta ação não pode ser desfeita</li>
                </ul>
              </div>

              {/* Confirmação por Texto */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Digite <span className="font-bold text-red-600">{requiredText}</span> para confirmar:
                </label>
                <input
                  type="text"
                  value={confirmationText}
                  onChange={(e) => setConfirmationText(e.target.value)}
                  className="w-full px-4 py-3 border-2 border-gray-200 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 focus:outline-none focus:border-red-500 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                  placeholder={`Digite "${requiredText}"`}
                  disabled={isLoading}
                  autoComplete="off"
                  spellCheck="false"
                />
                {confirmationText && !isConfirmed && (
                  <p className="text-red-600 text-sm mt-1">
                    O texto deve corresponder exatamente
                  </p>
                )}
              </div>
            </>
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
              disabled={isLoading || !isConfirmed}
              className="flex-1 px-4 py-3 bg-red-600 text-white rounded-xl font-medium hover:bg-red-700 disabled:bg-red-400 disabled:cursor-not-allowed transition-all duration-200 flex items-center justify-center space-x-2"
            >
              {isLoading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  <span>Excluindo...</span>
                </>
              ) : (
                <>
                  <FaSignOutAlt className="w-4 h-4" />
                  <span>Excluir e Sair</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
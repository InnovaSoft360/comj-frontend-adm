// src/components/modals/RestoreAccountModal.tsx
'use client';

import { useState, useEffect, useRef } from 'react';
import { FaTimes, FaCheck, FaRedo, FaExclamationTriangle } from 'react-icons/fa';
import { useRestoreAccount } from '@/hooks/useRestoreAccount';

interface RestoreAccountModalProps {
  isOpen: boolean;
  onClose: () => void;
  userId: string;
  userName: string;
  userBI: string;
  onAccountRestored: () => void;
}

export default function RestoreAccountModal({ 
  isOpen, 
  onClose, 
  userId, 
  userName, 
  userBI,
  onAccountRestored 
}: RestoreAccountModalProps) {
  const [confirmationText, setConfirmationText] = useState('');
  const [isConfirmed, setIsConfirmed] = useState(false);
  const [hasOpened, setHasOpened] = useState(false);
  
  const { restoreAccount, isLoading, error, success, resetState } = useRestoreAccount();

  const requiredText = "RESTAURAR CONTA";
  const inputRef = useRef<HTMLInputElement>(null);

  // Só executa uma vez quando o modal abre pela primeira vez
  useEffect(() => {
    if (isOpen && !hasOpened) {
      resetState();
      setConfirmationText('');
      setIsConfirmed(false);
      setHasOpened(true);
      
      // Foca no input após um pequeno delay
      setTimeout(() => {
        inputRef.current?.focus();
      }, 100);
    }
  }, [isOpen, hasOpened, resetState]);

  // Reseta o hasOpened quando o modal fecha
  useEffect(() => {
    if (!isOpen) {
      setHasOpened(false);
    }
  }, [isOpen]);

  useEffect(() => {
    setIsConfirmed(confirmationText === requiredText);
  }, [confirmationText]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!isConfirmed) {
      return;
    }

    const restored = await restoreAccount(userId);

    if (restored) {
      setTimeout(() => {
        onAccountRestored();
        handleClose();
      }, 2000);
    }
  };

  // Função melhorada para fechar o modal
  const handleClose = () => {
    if (!isLoading) {
      setConfirmationText('');
      setIsConfirmed(false);
      onClose();
    }
  };

  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && !isLoading) {
        handleClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEsc);
      document.body.style.overflow = 'hidden';
      
      // Foca no input quando o modal abre
      setTimeout(() => {
        inputRef.current?.focus();
      }, 300);
    }

    return () => {
      document.removeEventListener('keydown', handleEsc);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, isLoading]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50 backdrop-blur-sm">
      <div 
        className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl w-full max-w-md transform transition-all duration-300 scale-100 opacity-100"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-green-200 dark:border-green-800">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-green-100 dark:bg-green-900 rounded-lg">
              <FaRedo className="w-5 h-5 text-green-600 dark:text-green-400" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                Restaurar Conta
              </h2>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Reativar conta de usuário
              </p>
            </div>
          </div>
          
          <button
            onClick={handleClose}
            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
            disabled={isLoading}
          >
            <FaTimes className="w-5 h-5 text-gray-500 dark:text-gray-400" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {/* Informações do Usuário */}
          <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
            <h3 className="font-semibold text-blue-800 dark:text-blue-300 mb-2">
              Informações do Usuário
            </h3>
            <div className="text-sm text-blue-700 dark:text-blue-400 space-y-1">
              <p><strong>Nome:</strong> {userName}</p>
              <p><strong>BI:</strong> {userBI}</p>
              <p><strong>ID:</strong> {userId.substring(0, 8)}...</p>
            </div>
          </div>

          {/* Mensagem de Sucesso */}
          {success && (
            <div className="p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg flex items-center space-x-3">
              <FaCheck className="w-5 h-5 text-green-600 dark:text-green-400 flex-shrink-0" />
              <div>
                <p className="text-green-800 dark:text-green-300 font-medium">
                  Conta restaurada com sucesso!
                </p>
                <p className="text-green-700 dark:text-green-400 text-sm">
                  O usuário pode fazer login novamente.
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
              <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-4">
                <div className="flex items-start space-x-3">
                  <FaExclamationTriangle className="w-5 h-5 text-yellow-600 dark:text-yellow-400 flex-shrink-0 mt-0.5" />
                  <div>
                    <h3 className="font-semibold text-yellow-800 dark:text-yellow-300 mb-2">
                      Confirmação de Restauração
                    </h3>
                    <ul className="text-sm text-yellow-700 dark:text-yellow-400 space-y-1">
                      <li>• A conta será reativada no sistema</li>
                      <li>• O usuário poderá fazer login novamente</li>
                      <li>• Todos os dados serão preservados</li>
                    </ul>
                  </div>
                </div>
              </div>

              {/* Confirmação por Texto */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Digite <span className="font-bold text-green-600">{requiredText}</span> para confirmar:
                </label>
                <input
                  ref={inputRef} // ← Referência adicionada
                  type="text"
                  value={confirmationText}
                  onChange={(e) => setConfirmationText(e.target.value)}
                  className="w-full px-4 py-3 border-2 border-gray-200 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 focus:outline-none focus:border-green-500 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                  placeholder={`Digite "${requiredText}"`}
                  disabled={isLoading}
                  autoComplete="off"
                  spellCheck="false"
                  autoFocus // ← Auto focus adicionado
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
              onClick={handleClose}
              disabled={isLoading}
              className="flex-1 px-4 py-3 border-2 border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-xl font-medium hover:bg-gray-50 dark:hover:bg-gray-700 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Cancelar
            </button>
            
            <button
              type="submit"
              disabled={isLoading || !isConfirmed}
              className="flex-1 px-4 py-3 bg-green-600 text-white rounded-xl font-medium hover:bg-green-700 disabled:bg-green-400 disabled:cursor-not-allowed transition-all duration-200 flex items-center justify-center space-x-2"
            >
              {isLoading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  <span>Restaurando...</span>
                </>
              ) : (
                <>
                  <FaRedo className="w-4 h-4" />
                  <span>Restaurar Conta</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
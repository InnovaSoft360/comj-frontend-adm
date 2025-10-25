// src/components/modals/EnableEditModal.tsx
import { FaCheck, FaTimes, FaEdit } from 'react-icons/fa';

interface EnableEditModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (enableEdit: boolean) => void;
  isLoading?: boolean;
}

export default function EnableEditModal({
  isOpen,
  onClose,
  onConfirm,
  isLoading = false
}: EnableEditModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[80] flex items-center justify-center p-4 bg-black bg-opacity-50 backdrop-blur-sm">
      <div 
        className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl w-full max-w-md transform transition-all duration-300 scale-100 opacity-100"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center space-x-3 p-6 border-b border-blue-200 dark:border-blue-800">
          <div className="p-2 bg-blue-100 dark:bg-blue-900 rounded-lg">
            <FaEdit className="w-5 h-5 text-blue-600 dark:text-blue-400" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-gray-900 dark:text-white">
              Permitir Edição?
            </h2>
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
              Deseja permitir que o candidato edite a candidatura?
            </p>
          </div>
        </div>

        {/* Content */}
        <div className="p-6">
          <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
            <div className="flex items-start space-x-3">
              <FaEdit className="w-4 h-4 text-blue-600 dark:text-blue-400 flex-shrink-0 mt-0.5" />
              <div>
                <h3 className="font-semibold text-blue-800 dark:text-blue-300 mb-2">
                  O que isso significa?
                </h3>
                <ul className="text-sm text-blue-700 dark:text-blue-400 space-y-1">
                  <li>• O candidato poderá atualizar os documentos</li>
                  <li>• A candidatura voltará ao status "Pendente"</li>
                  <li>• O candidato receberá uma notificação</li>
                  <li>• Você poderá revisar novamente após as correções</li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex space-x-3 p-6 border-t border-gray-200 dark:border-gray-700">
          <button
            onClick={() => onConfirm(false)}
            disabled={isLoading}
            className="flex-1 px-4 py-3 border-2 border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-xl font-medium hover:bg-gray-50 dark:hover:bg-gray-700 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
          >
            <FaTimes className="w-4 h-4" />
            <span>Apenas Rejeitar</span>
          </button>
          
          <button
            onClick={() => onConfirm(true)}
            disabled={isLoading}
            className="flex-1 px-4 py-3 bg-green-600 text-white rounded-xl font-medium hover:bg-green-700 disabled:bg-green-400 disabled:cursor-not-allowed transition-all duration-200 flex items-center justify-center space-x-2"
          >
            {isLoading ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                <span>Processando...</span>
              </>
            ) : (
              <>
                <FaCheck className="w-4 h-4" />
                <span>Permitir Edição</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
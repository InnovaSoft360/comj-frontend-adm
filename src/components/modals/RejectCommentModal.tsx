// src/components/modals/RejectCommentModal.tsx
import { useState } from 'react';
import { FaTimes, FaExclamationTriangle } from 'react-icons/fa';

interface RejectCommentModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (comment: string) => void;
  isLoading?: boolean;
}

export default function RejectCommentModal({
  isOpen,
  onClose,
  onConfirm,
  isLoading = false
}: RejectCommentModalProps) {
  const [comment, setComment] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (comment.trim()) {
      onConfirm(comment.trim());
      setComment('');
    }
  };

  const handleClose = () => {
    setComment('');
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[70] flex items-center justify-center p-4 bg-black bg-opacity-50 backdrop-blur-sm">
      <div 
        className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl w-full max-w-md transform transition-all duration-300 scale-100 opacity-100"
        onClick={(e) => e.stopPropagation()}
      >
        <form onSubmit={handleSubmit}>
          {/* Header */}
          <div className="flex items-center space-x-3 p-6 border-b border-red-200 dark:border-red-800">
            <div className="p-2 bg-red-100 dark:bg-red-900 rounded-lg">
              <FaExclamationTriangle className="w-5 h-5 text-red-600 dark:text-red-400" />
            </div>
            <div className="flex-1">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                Motivo da Rejeição
              </h2>
              <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                Digite o motivo para rejeitar esta candidatura
              </p>
            </div>
            <button
              type="button"
              onClick={handleClose}
              className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
            >
              <FaTimes className="w-5 h-5 text-gray-500 dark:text-gray-400" />
            </button>
          </div>

          {/* Content */}
          <div className="p-6">
            <div className="space-y-4">
              <div>
                <label htmlFor="rejectComment" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Comentário *
                </label>
                <textarea
                  id="rejectComment"
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  placeholder="Explique o motivo da rejeição da candidatura..."
                  className="w-full px-4 py-3 border-2 border-gray-200 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 focus:outline-none focus:border-red-500 focus:ring-2 focus:ring-red-200 transition-all duration-200 resize-none"
                  rows={4}
                  required
                  disabled={isLoading}
                />
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                  Este comentário será visível para o candidato
                </p>
              </div>

              {comment.trim() && (
                <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-4">
                  <div className="flex items-start space-x-3">
                    <FaExclamationTriangle className="w-4 h-4 text-yellow-600 dark:text-yellow-400 flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="text-sm text-yellow-800 dark:text-yellow-300 font-medium">
                        Confirme o motivo da rejeição:
                      </p>
                      <p className="text-sm text-yellow-700 dark:text-yellow-400 mt-1">
                        "{comment}"
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Actions */}
          <div className="flex space-x-3 p-6 border-t border-gray-200 dark:border-gray-700">
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
              disabled={isLoading || !comment.trim()}
              className="flex-1 px-4 py-3 bg-red-600 text-white rounded-xl font-medium hover:bg-red-700 disabled:bg-red-400 disabled:cursor-not-allowed transition-all duration-200 flex items-center justify-center space-x-2"
            >
              {isLoading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  <span>Rejeitando...</span>
                </>
              ) : (
                <>
                  <FaTimes className="w-4 h-4" />
                  <span>Rejeitar</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
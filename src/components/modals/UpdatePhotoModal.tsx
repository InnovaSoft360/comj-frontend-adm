// components/modals/UpdatePhotoModal.tsx
import { useState, useEffect, useRef } from 'react';
import { FaTimes, FaCamera, FaCheck, FaUpload } from 'react-icons/fa';
import { useUpdatePhoto } from '@/hooks/useUpdatePhoto';

interface User {
  id: string;
  firstName: string;
  lastName: string;
  photoUrl?: string;
  email: string;
  bi: string;
  role: number;
}

interface UpdatePhotoModalProps {
  isOpen: boolean;
  onClose: () => void;
  user: User;
  onPhotoUpdated: () => void;
}

export default function UpdatePhotoModal({ isOpen, onClose, user, onPhotoUpdated }: UpdatePhotoModalProps) {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const { updatePhoto, isLoading, error, success, resetState } = useUpdatePhoto();

  useEffect(() => {
    if (isOpen) {
      resetState();
      setSelectedFile(null);
      setPreviewUrl(null);
    }
  }, [isOpen, resetState]);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Validar tipo de arquivo
      if (!file.type.startsWith('image/')) {
        alert('Por favor, selecione apenas imagens.');
        return;
      }

      // Validar tamanho (max 1MB)
      if (file.size > 1 * 1024 * 1024) {
        alert('A imagem deve ter no máximo 1MB.');
        return;
      }

      setSelectedFile(file);
      const objectUrl = URL.createObjectURL(file);
      setPreviewUrl(objectUrl);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!selectedFile) {
      alert('Por favor, selecione uma imagem.');
      return;
    }

    const success = await updatePhoto({
      Id: user.id,
      PhotoFile: selectedFile,
    });

    if (success) {
      setTimeout(() => {
        onPhotoUpdated();
        onClose();
      }, 1500);
    }
  };

  const handleClickUpload = () => {
    fileInputRef.current?.click();
  };

  // Cleanup preview URL
  useEffect(() => {
    return () => {
      if (previewUrl) {
        URL.revokeObjectURL(previewUrl);
      }
    };
  }, [previewUrl]);

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
              <FaCamera className="w-5 h-5 text-orange-600 dark:text-orange-400" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                Atualizar Foto
              </h2>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Escolha uma nova foto de perfil
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
                  Foto atualizada com sucesso!
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

          {/* Preview da Imagem */}
          <div className="flex justify-center">
            <div className="relative w-32 h-32 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden border-4 border-gray-300 dark:border-gray-600">
              {previewUrl ? (
                <img
                  src={previewUrl}
                  alt="Preview"
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="flex items-center justify-center w-full h-full text-gray-400">
                  <FaCamera className="w-8 h-8" />
                </div>
              )}
            </div>
          </div>

          {/* Upload Area */}
          <div>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleFileSelect}
              className="hidden"
              disabled={isLoading || success}
            />
            
            <button
              type="button"
              onClick={handleClickUpload}
              disabled={isLoading || success}
              className="w-full flex items-center justify-center space-x-2 px-4 py-3 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-xl text-gray-600 dark:text-gray-400 hover:border-orange-500 hover:text-orange-500 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <FaUpload className="w-4 h-4" />
              <span>{selectedFile ? 'Alterar imagem' : 'Selecionar imagem'}</span>
            </button>
            
            {selectedFile && (
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-2 text-center">
                {selectedFile.name} ({(selectedFile.size / 1024 / 1024).toFixed(2)} MB)
              </p>
            )}
            
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-2 text-center">
              Formatos: JPG, PNG, GIF • Máx: 1MB
            </p>
          </div>

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
              disabled={isLoading || success || !selectedFile}
              className="flex-1 px-4 py-3 bg-gradient-to-r from-orange-500 to-red-600 text-white rounded-xl font-medium hover:from-orange-600 hover:to-red-700 transition-all duration-200 disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
            >
              {isLoading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  <span>Enviando...</span>
                </>
              ) : success ? (
                <>
                  <FaCheck className="w-4 h-4" />
                  <span>Sucesso!</span>
                </>
              ) : (
                <span>Atualizar Foto</span>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
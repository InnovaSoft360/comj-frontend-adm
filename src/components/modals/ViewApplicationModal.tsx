// src/components/modals/ViewApplicationModal.tsx
import { useState, useEffect } from 'react';
import { 
  FaTimes, 
  FaDownload, 
  FaExternalLinkAlt, 
  FaChevronLeft, 
  FaChevronRight,
  FaCheck,
  FaTimes as FaTimesCircle,
  FaIdCard,
  FaFileInvoice,
  FaFileAlt,
  FaReceipt,
  FaStar,
  FaFilePdf
} from 'react-icons/fa';
import { useApplicationDetails } from '@/hooks/useApplicationDetails';
import { useApproveApplication } from '@/hooks/useApproveApplication';
import { useRejectApplication } from '@/hooks/useRejectApplication';
import { useEnableRejected } from '@/hooks/useEnableRejected';
import ConfirmActionModal from './ConfirmActionModal';
import RejectCommentModal from './RejectCommentModal';
import EnableEditModal from './EnableEditModal';

interface ViewApplicationModalProps {
  isOpen: boolean;
  onClose: () => void;
  applicationId: string | null;
  onStatusChange?: () => void;
}

interface Document {
  url: string;
  name: string;
  icon: React.ComponentType<{ className?: string }>;
}

export default function ViewApplicationModal({ 
  isOpen, 
  onClose, 
  applicationId,
  onStatusChange 
}: ViewApplicationModalProps) {
  const [activeDocumentIndex, setActiveDocumentIndex] = useState(0);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [showRejectCommentModal, setShowRejectCommentModal] = useState(false);
  const [showEnableEditModal, setShowEnableEditModal] = useState(false);
  const [pendingRejectComment, setPendingRejectComment] = useState<string>('');
  
  const { application, isLoading, error, getApplicationDetails, resetState } = useApplicationDetails();
  const { approveApplication, isLoading: isApproving, success: approveSuccess, resetState: resetApproveState } = useApproveApplication();
  const { rejectApplication, isLoading: isRejecting, success: rejectSuccess, resetState: resetRejectState } = useRejectApplication();
  const { enableRejected, isLoading: isEnabling, success: enableSuccess, resetState: resetEnableState } = useEnableRejected();

  // Construir URLs completas para os documentos
  const buildDocumentUrl = (relativeUrl: string): string => {
    if (!relativeUrl) return '';
    if (relativeUrl.startsWith('http')) return relativeUrl;
    const baseUrl = 'https://localhost:7209';
    return `${baseUrl}${relativeUrl}`;
  };

  const documents: Document[] = [
    { 
      url: buildDocumentUrl(application?.documentIdCardUrl || ''), 
      name: 'Documento de Identificação', 
      icon: FaIdCard 
    },
    { 
      url: buildDocumentUrl(application?.documentSalaryDeclarationUrl || ''), 
      name: 'Declaração de Remuneração', 
      icon: FaFileInvoice 
    },
    { 
      url: buildDocumentUrl(application?.documentBankStatementUrl || ''), 
      name: 'Extrato Bancário', 
      icon: FaFileAlt 
    },
    { 
      url: buildDocumentUrl(application?.documentLastBankReceiptUrl || ''), 
      name: 'Último Recibo Bancário', 
      icon: FaReceipt 
    },
  ].filter(doc => doc.url);

  useEffect(() => {
    if (isOpen && applicationId) {
      getApplicationDetails(applicationId);
      setActiveDocumentIndex(0);
      resetApproveState();
      resetRejectState();
      resetEnableState();
    } else {
      resetState();
      setActiveDocumentIndex(0);
      setShowConfirmModal(false);
      setShowRejectCommentModal(false);
      setShowEnableEditModal(false);
      setPendingRejectComment('');
    }
  }, [isOpen, applicationId]);

  useEffect(() => {
    if ((approveSuccess || rejectSuccess || enableSuccess) && applicationId) {
      // Recarregar os detalhes da aplicação para atualizar o status
      getApplicationDetails(applicationId);
      if (onStatusChange) {
        onStatusChange();
      }
      setShowConfirmModal(false);
      setShowRejectCommentModal(false);
      setShowEnableEditModal(false);
      setPendingRejectComment('');
    }
  }, [approveSuccess, rejectSuccess, enableSuccess, applicationId]);

  const nextDocument = () => {
    if (activeDocumentIndex < documents.length - 1) {
      setActiveDocumentIndex(activeDocumentIndex + 1);
    }
  };

  const previousDocument = () => {
    if (activeDocumentIndex > 0) {
      setActiveDocumentIndex(activeDocumentIndex - 1);
    }
  };

  const handleDownload = async (url: string, filename: string) => {
    try {
      const link = document.createElement('a');
      link.href = url;
      link.download = filename;
      link.target = '_blank';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (error) {
      console.error('Erro ao baixar arquivo:', error);
      window.open(url, '_blank');
    }
  };

  const handleApproveClick = () => {
    setShowConfirmModal(true);
  };

  const handleConfirmApprove = async () => {
    if (applicationId) {
      await approveApplication(applicationId);
    }
  };

  const handleRejectClick = () => {
    setShowRejectCommentModal(true);
  };

  const handleRejectConfirm = async (comment: string) => {
    if (applicationId) {
      setPendingRejectComment(comment);
      const success = await rejectApplication(applicationId, comment);
      if (success) {
        setShowEnableEditModal(true);
      }
    }
  };

  const handleEnableEditConfirm = async (enableEdit: boolean) => {
    if (applicationId && enableEdit) {
      await enableRejected(applicationId);
    } else {
      // Apenas fechar o modal se não quiser permitir edição
      setShowEnableEditModal(false);
    }
  };

  if (!isOpen) return null;

  return (
    <>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-black bg-opacity-60 backdrop-blur-md overflow-y-auto">
        <div 
          className="bg-white dark:bg-gray-800 rounded-3xl shadow-2xl w-full max-w-7xl my-4 flex flex-col min-h-[85vh] max-h-[95vh]"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header com Gradiente */}
          <div className="relative bg-gradient-to-r from-orange-500 to-red-600 rounded-t-3xl p-4 sm:p-6 text-white shrink-0">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3 sm:space-x-4">
                <div className="p-2 sm:p-3 bg-white/20 rounded-xl sm:rounded-2xl backdrop-blur-sm">
                  <FaFilePdf className="w-6 h-6 sm:w-8 sm:h-8" />
                </div>
                <div>
                  <h2 className="text-lg sm:text-xl lg:text-2xl font-bold">Avaliação de Candidatura</h2>
                  <p className="text-orange-100 opacity-90 text-xs sm:text-sm">
                    Revise os documentos e tome sua decisão
                  </p>
                </div>
              </div>
              
              <button
                onClick={onClose}
                className="p-2 sm:p-3 hover:bg-white/20 rounded-xl sm:rounded-2xl transition-all duration-200 hover:scale-110 backdrop-blur-sm"
              >
                <FaTimes className="w-5 h-5 sm:w-6 sm:h-6" />
              </button>
            </div>

            {/* Status Badge */}
            {application && (
              <div className="absolute -bottom-3 left-4 sm:left-6">
                <div className="bg-white dark:bg-gray-800 text-gray-900 dark:text-white px-3 py-1 sm:px-4 sm:py-2 rounded-full shadow-lg border border-orange-200 dark:border-orange-800">
                  <span className="flex items-center space-x-1 sm:space-x-2 text-xs sm:text-sm font-semibold">
                    <FaStar className="w-3 h-3 sm:w-4 sm:h-4 text-orange-500" />
                    <span>Status: {application.status === 1 ? 'Pendente' : application.status === 2 ? 'Aprovada' : 'Rejeitada'}</span>
                  </span>
                </div>
              </div>
            )}
          </div>

          {/* Content Principal com Scroll */}
          <div className="flex-1 overflow-hidden flex flex-col lg:flex-row min-h-0">
            {/* Sidebar - Documentos e Ações */}
            <div className="lg:w-1/3 xl:w-1/4 flex flex-col border-r border-gray-200 dark:border-gray-700 bg-gray-50/50 dark:bg-gray-900/30 min-h-0">
              {/* Lista de Documentos com Scroll */}
              <div className="flex-1 overflow-y-auto p-4 sm:p-6">
                <h3 className="font-bold text-gray-900 dark:text-white text-base sm:text-lg mb-4 flex items-center">
                  <FaFilePdf className="w-4 h-4 sm:w-5 sm:h-5 text-orange-500 mr-2" />
                  Documentos ({documents.length})
                </h3>
                
                <div className="space-y-2 sm:space-y-3">
                  {documents.map((doc, index) => {
                    const IconComponent = doc.icon;
                    const isActive = activeDocumentIndex === index;
                    
                    return (
                      <button
                        key={index}
                        onClick={() => setActiveDocumentIndex(index)}
                        className={`w-full flex items-center space-x-3 sm:space-x-4 p-3 sm:p-4 rounded-lg sm:rounded-xl transition-all duration-300 transform hover:scale-105 ${
                          isActive
                            ? 'bg-gradient-to-r from-orange-500 to-red-600 text-white shadow-lg'
                            : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-orange-50 dark:hover:bg-orange-900/20 border border-gray-200 dark:border-gray-600'
                        }`}
                      >
                        <div className={`p-2 sm:p-3 rounded-lg ${
                          isActive 
                            ? 'bg-white/20' 
                            : 'bg-orange-100 dark:bg-orange-900/30 text-orange-600 dark:text-orange-400'
                        }`}>
                          <IconComponent className="w-4 h-4 sm:w-5 sm:h-5" />
                        </div>
                        <span className="text-xs sm:text-sm font-semibold text-left flex-1">
                          {doc.name}
                        </span>
                      </button>
                    );
                  })}
                  
                  {documents.length === 0 && !isLoading && (
                    <div className="text-center py-8 sm:py-12 text-gray-500 dark:text-gray-400">
                      <FaFileAlt className="w-12 h-12 sm:w-16 sm:h-16 mx-auto mb-3 sm:mb-4 opacity-50" />
                      <p className="text-sm sm:text-lg font-medium mb-2">Nenhum documento</p>
                      <p className="text-xs sm:text-sm opacity-75">Documentos não disponíveis</p>
                    </div>
                  )}
                </div>
              </div>

              {/* Botões de Ação - Fixos na parte inferior */}
              {application?.status === 1 && (
                <div className="p-4 sm:p-6 border-t border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 shrink-0">
                  <h3 className="font-semibold text-gray-900 dark:text-white mb-3 sm:mb-4 text-center text-sm sm:text-base">
                    Tomar Decisão
                  </h3>
                  <div className="grid grid-cols-2 gap-2 sm:gap-3">
                    <button
                      onClick={handleApproveClick}
                      disabled={isApproving}
                      className="flex items-center justify-center space-x-1 sm:space-x-2 px-3 py-2 sm:px-4 sm:py-3 bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white rounded-lg sm:rounded-xl font-semibold transition-all duration-200 hover:scale-105 shadow-lg text-xs sm:text-sm disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <FaCheck className="w-3 h-3 sm:w-4 sm:h-4" />
                      <span>{isApproving ? 'Aprovando...' : 'Aprovar'}</span>
                    </button>
                    <button
                      onClick={handleRejectClick}
                      disabled={isRejecting}
                      className="flex items-center justify-center space-x-1 sm:space-x-2 px-3 py-2 sm:px-4 sm:py-3 bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white rounded-lg sm:rounded-xl font-semibold transition-all duration-200 hover:scale-105 shadow-lg text-xs sm:text-sm disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <FaTimesCircle className="w-3 h-3 sm:w-4 sm:h-4" />
                      <span>{isRejecting ? 'Rejeitando...' : 'Rejeitar'}</span>
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Área do Visualizador com Scroll */}
            <div className="lg:w-2/3 xl:w-3/4 flex flex-col min-h-0">
              {/* Header do Visualizador */}
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between p-4 sm:p-6 border-b border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 shrink-0 gap-3 sm:gap-0">
                <div className="flex items-center justify-between sm:justify-start space-x-2 sm:space-x-4 order-2 sm:order-1">
                  <button
                    onClick={previousDocument}
                    disabled={activeDocumentIndex === 0 || documents.length === 0}
                    className="p-2 sm:p-3 rounded-lg sm:rounded-xl bg-gradient-to-r from-orange-500 to-red-600 text-white disabled:from-gray-300 disabled:to-gray-400 disabled:cursor-not-allowed hover:from-orange-600 hover:to-red-700 transition-all duration-200 shadow-lg flex-shrink-0"
                  >
                    <FaChevronLeft className="w-4 h-4 sm:w-5 sm:h-5" />
                  </button>
                  
                  <div className="text-center min-w-0 flex-1 px-2">
                    <h3 className="text-base sm:text-lg lg:text-xl font-bold text-gray-900 dark:text-white truncate">
                      {documents[activeDocumentIndex]?.name || 'Nenhum documento'}
                    </h3>
                    <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400">
                      {documents.length > 0 ? 
                        `Documento ${activeDocumentIndex + 1} de ${documents.length}` : 
                        '0 documentos disponíveis'
                      }
                    </p>
                  </div>
                  
                  <button
                    onClick={nextDocument}
                    disabled={activeDocumentIndex === documents.length - 1 || documents.length === 0}
                    className="p-2 sm:p-3 rounded-lg sm:rounded-xl bg-gradient-to-r from-orange-500 to-red-600 text-white disabled:from-gray-300 disabled:to-gray-400 disabled:cursor-not-allowed hover:from-orange-600 hover:to-red-700 transition-all duration-200 shadow-lg flex-shrink-0"
                  >
                    <FaChevronRight className="w-4 h-4 sm:w-5 sm:h-5" />
                  </button>
                </div>

                <div className="flex items-center justify-end space-x-2 sm:space-x-3 order-1 sm:order-2">
                  {documents[activeDocumentIndex] && (
                    <>
                      <button
                        onClick={() => handleDownload(
                          documents[activeDocumentIndex].url,
                          `${documents[activeDocumentIndex].name.replace(/\s+/g, '_')}.pdf`
                        )}
                        className="flex items-center space-x-1 sm:space-x-2 px-3 py-2 sm:px-4 sm:py-3 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white rounded-lg sm:rounded-xl font-semibold transition-all duration-200 hover:scale-105 shadow-lg text-xs sm:text-sm"
                      >
                        <FaDownload className="w-3 h-3 sm:w-4 sm:h-4" />
                        <span>Download</span>
                      </button>
                      <a
                        href={documents[activeDocumentIndex].url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center space-x-1 sm:space-x-2 px-3 py-2 sm:px-4 sm:py-3 bg-gradient-to-r from-gray-600 to-gray-700 hover:from-gray-700 hover:to-gray-800 text-white rounded-lg sm:rounded-xl font-semibold transition-all duration-200 hover:scale-105 shadow-lg text-xs sm:text-sm"
                      >
                        <FaExternalLinkAlt className="w-3 h-3 sm:w-4 sm:h-4" />
                        <span>Abrir</span>
                      </a>
                    </>
                  )}
                </div>
              </div>

              {/* Visualizador de PDF com Scroll */}
              <div className="flex-1 overflow-hidden bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-900 dark:to-gray-800 p-3 sm:p-4 lg:p-6">
                <div className="bg-white dark:bg-gray-800 rounded-xl sm:rounded-2xl shadow-2xl h-full overflow-hidden border border-gray-300 dark:border-gray-600">
                  {isLoading ? (
                    <div className="flex items-center justify-center h-full">
                      <div className="text-center">
                        <div className="w-12 h-12 sm:w-16 sm:h-16 border-4 border-orange-500 border-t-transparent rounded-full animate-spin mx-auto mb-3 sm:mb-4"></div>
                        <p className="text-gray-600 dark:text-gray-400 text-sm sm:text-lg font-semibold">
                          Carregando documentos...
                        </p>
                      </div>
                    </div>
                  ) : error ? (
                    <div className="flex items-center justify-center h-full">
                      <div className="text-center text-red-600 dark:text-red-400 p-4 sm:p-8">
                        <FaTimesCircle className="w-12 h-12 sm:w-16 sm:h-16 mx-auto mb-3 sm:mb-4 opacity-75" />
                        <p className="text-lg sm:text-xl font-semibold mb-2">Erro ao carregar</p>
                        <p className="text-xs sm:text-sm opacity-75">{error}</p>
                      </div>
                    </div>
                  ) : documents.length > 0 ? (
                    <iframe
                      src={documents[activeDocumentIndex].url}
                      className="w-full h-full border-0"
                      title={documents[activeDocumentIndex].name}
                    />
                  ) : (
                    <div className="flex items-center justify-center h-full text-gray-500 dark:text-gray-400">
                      <div className="text-center p-4 sm:p-8">
                        <FaFileAlt className="w-16 h-16 sm:w-24 sm:h-24 mx-auto mb-4 sm:mb-6 opacity-50" />
                        <p className="text-xl sm:text-2xl font-bold mb-2 sm:mb-3">Nenhum documento</p>
                        <p className="text-sm sm:text-lg opacity-75">
                          Os documentos desta candidatura não estão disponíveis
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Modal de Confirmação para Aprovar */}
      <ConfirmActionModal
        isOpen={showConfirmModal}
        onClose={() => setShowConfirmModal(false)}
        onConfirm={handleConfirmApprove}
        title="Confirmar Aprovação"
        message="Tem certeza que deseja aprovar esta candidatura? Esta ação não pode ser desfeita."
        confirmText="Sim, Aprovar"
        cancelText="Cancelar"
        type="success"
        isLoading={isApproving}
      />

      {/* Modal para Comentário de Rejeição */}
      <RejectCommentModal
        isOpen={showRejectCommentModal}
        onClose={() => setShowRejectCommentModal(false)}
        onConfirm={handleRejectConfirm}
        isLoading={isRejecting}
      />

      {/* Modal para Permitir Edição */}
      <EnableEditModal
        isOpen={showEnableEditModal}
        onClose={() => setShowEnableEditModal(false)}
        onConfirm={handleEnableEditConfirm}
        isLoading={isEnabling}
      />
    </>
  );
}
// src/pages/identity/user/profile/index.tsx
import { useState } from 'react';
import { FaUser, FaEnvelope, FaAddressCard, FaEdit, FaKey, FaTrash, FaCamera, FaUserShield } from 'react-icons/fa';
import { useAuth, getUserInitials } from '@/hooks/useAuth';
import UpdatePhotoModal from '@/components/modals/UpdatePhotoModal';
import EditProfileModal from '@/components/modals/EditProfileModal';
import UpdatePasswordModal from '@/components/modals/UpdatePasswordModal';
import DeleteAccountModal from '@/components/modals/DeleteAccountModal';
import { API_CONFIG } from '@/libs/config';

export default function Profile() {
  const { user, logout } = useAuth();
  const [isUpdatePhotoModalOpen, setIsUpdatePhotoModalOpen] = useState(false);
  const [isEditProfileModalOpen, setIsEditProfileModalOpen] = useState(false);
  const [isUpdatePasswordModalOpen, setIsUpdatePasswordModalOpen] = useState(false);
  const [isDeleteAccountModalOpen, setIsDeleteAccountModalOpen] = useState(false);

  // Se não tiver user, mostra loading
  if (!user) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl lg:text-3xl font-bold text-gray-800 dark:text-white">
            Meu Perfil
          </h1>
          <p className="text-gray-600 dark:text-gray-300 mt-1">
            Carregando informações...
          </p>
        </div>
        
        <div className="bg-white dark:bg-gray-800 rounded-xl p-8 shadow-sm border border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-center space-x-3">
            <div className="w-6 h-6 border-2 border-orange-500 border-t-transparent rounded-full animate-spin"></div>
            <span className="text-gray-600 dark:text-gray-300">Carregando...</span>
          </div>
        </div>
      </div>
    );
  }

  const userInitials = getUserInitials(user);
  const userPhoto = user.photoUrl 
    ? `${API_CONFIG.baseURL}${user.photoUrl}`
    : null;
  const showImage = userPhoto && userPhoto.trim() !== '';

  // Funções para os modais
  const handleEditProfile = () => setIsEditProfileModalOpen(true);
  const handleChangePassword = () => setIsUpdatePasswordModalOpen(true);
  const handleUpdatePhoto = () => setIsUpdatePhotoModalOpen(true);
  const handleDeleteAccount = () => setIsDeleteAccountModalOpen(true);

  // Funções de callback dos modais
  const handlePhotoUpdated = () => window.location.reload();
  const handleProfileUpdated = () => window.location.reload();
  const handlePasswordUpdated = () => window.location.reload();
  const handleAccountDeleted = () => {
    console.log('Conta excluída com sucesso, fazendo logout...');
    logout();
  };

  const userInfo = [
    { 
      icon: FaUser, 
      label: 'Nome Completo', 
      value: `${user.firstName} ${user.lastName}` 
    },
    { 
      icon: FaEnvelope, 
      label: 'Email', 
      value: user.email 
    },
    { 
      icon: FaAddressCard, 
      label: 'BI/Identificação', 
      value: user.bi || 'Não informado' 
    },
    { 
      icon: FaUserShield,
      label: 'Tipo de Conta', 
      value: user.role === 0 ? 'Administrador' : 'Usuário' 
    }
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl lg:text-3xl font-bold text-gray-800 dark:text-white">
          Meu Perfil
        </h1>
        <p className="text-gray-600 dark:text-gray-300 mt-1">
          Gerencie suas informações pessoais
        </p>
      </div>

      {/* Card Principal */}
      <div className="bg-white dark:bg-gray-800 rounded-2xl lg:rounded-3xl shadow-xl border border-gray-200 dark:border-gray-700 overflow-hidden">
        
        {/* Banner com Gradiente e Foto */}
        <div className="relative">
          {/* Banner Gradiente */}
          <div className="h-32 lg:h-40 bg-gradient-to-r from-orange-500 via-red-500 to-orange-600 relative overflow-hidden">
            <div className="absolute inset-0 bg-black/10"></div>
            <div className="absolute -top-10 -left-10 w-40 h-40 bg-white/10 rounded-full"></div>
            <div className="absolute -bottom-20 -right-20 w-60 h-60 bg-white/5 rounded-full"></div>
          </div>

          {/* Foto do Perfil */}
          <div className="absolute -bottom-16 left-6 lg:left-8">
            <div 
              className="relative group cursor-pointer transform hover:scale-105 transition-all duration-300"
              onClick={handleUpdatePhoto}
            >
              {/* Container da Foto */}
              <div className="w-28 h-28 lg:w-32 lg:h-32 bg-gradient-to-br from-orange-500 to-red-600 rounded-2xl lg:rounded-3xl border-4 border-white dark:border-gray-800 shadow-2xl flex items-center justify-center text-white font-bold text-2xl lg:text-3xl overflow-hidden">
                {showImage ? (
                  <img 
                    src={userPhoto}
                    alt={`${user.firstName} ${user.lastName}`}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      e.currentTarget.style.display = 'none';
                    }}
                  />
                ) : (
                  <span className="transform hover:scale-110 transition-transform duration-300">
                    {userInitials}
                  </span>
                )}
              </div>
              
              {/* Overlay de Edição */}
              <div className="absolute inset-0 bg-black/40 rounded-2xl lg:rounded-3xl flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 backdrop-blur-sm">
                <div className="text-center text-white">
                  <FaCamera className="w-6 h-6 lg:w-8 lg:h-8 mx-auto mb-1" />
                  <span className="text-xs font-medium">Alterar</span>
                </div>
              </div>
              
              {/* Indicador Online */}
              <div className="absolute -bottom-1 -right-1 w-6 h-6 lg:w-7 lg:h-7 bg-green-500 rounded-full border-3 border-white dark:border-gray-800 shadow-lg">
                <div className="w-full h-full rounded-full bg-green-400 animate-pulse"></div>
              </div>
            </div>
          </div>
        </div>

        {/* Conteúdo do Perfil */}
        <div className="pt-20 lg:pt-24 px-6 lg:px-8 pb-6 lg:pb-8">
          
          {/* Header com Nome e Botões */}
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-8">
            <div className="text-center lg:text-left mb-6 lg:mb-0">
              <h2 className="text-2xl lg:text-3xl font-bold text-gray-800 dark:text-white mb-3">
                {user.firstName} {user.lastName}
              </h2>
              <div className="flex items-center justify-center lg:justify-start space-x-4">
                <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400">
                  <FaUserShield className="w-3 h-3 mr-1" />
                  {user.role === 0 ? 'Administrador' : 'Usuário'}
                </span>
                <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400">
                  <div className="w-2 h-2 bg-green-500 rounded-full mr-2 animate-pulse"></div>
                  Online
                </span>
              </div>
            </div>
            
            {/* Botões de Ação */}
            <div className="flex flex-col sm:flex-row gap-3 justify-center lg:justify-end">
              <button 
                onClick={handleEditProfile}
                className="flex items-center justify-center space-x-3 px-6 py-3 bg-gradient-to-r from-orange-500 to-red-600 text-white rounded-xl lg:rounded-2xl font-semibold shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 group"
              >
                <FaEdit className="w-4 h-4 lg:w-5 lg:h-5 group-hover:rotate-12 transition-transform duration-300" />
                <span>Editar Perfil</span>
              </button>
              
              <button 
                onClick={handleChangePassword}
                className="flex items-center justify-center space-x-3 px-6 py-3 bg-white dark:bg-gray-700 border-2 border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-xl lg:rounded-2xl font-semibold shadow-lg hover:shadow-xl hover:bg-gray-50 dark:hover:bg-gray-600 transform hover:scale-105 transition-all duration-300 group"
              >
                <FaKey className="w-4 h-4 lg:w-5 lg:h-5 group-hover:scale-110 transition-transform duration-300" />
                <span>Alterar Senha</span>
              </button>
            </div>
          </div>

          {/* Grid de Informações */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 lg:gap-6 mb-8">
            {userInfo.map((item, index) => {
              const IconComponent = item.icon;
              return (
                <div 
                  key={index}
                  className="group relative bg-gradient-to-br from-gray-50 to-white dark:from-gray-700 dark:to-gray-800 rounded-xl lg:rounded-2xl p-4 lg:p-6 shadow-lg border border-gray-200 dark:border-gray-600 hover:shadow-2xl transform hover:scale-105 transition-all duration-300 overflow-hidden"
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-orange-500/5 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
                  
                  <div className="flex items-start space-x-4 relative z-10">
                    <div className="p-3 bg-gradient-to-r from-orange-500 to-red-600 rounded-xl shadow-lg group-hover:scale-110 transition-transform duration-300">
                      <IconComponent className="w-5 h-5 lg:w-6 lg:h-6 text-white" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm lg:text-base font-semibold text-gray-600 dark:text-gray-400 mb-1 lg:mb-2">
                        {item.label}
                      </p>
                      <p className="text-lg lg:text-xl font-bold text-gray-800 dark:text-white truncate">
                        {item.value}
                      </p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Seção de Ações Perigosas */}
          <div className="mt-8 pt-6 lg:pt-8 border-t border-red-200 dark:border-red-800">
            <div className="bg-gradient-to-br from-red-50 to-red-100 dark:from-red-900/20 dark:to-red-800/20 rounded-xl lg:rounded-2xl p-6 lg:p-8 border border-red-200 dark:border-red-800">
              <div className="flex items-center space-x-3 mb-4">
                <div className="p-2 bg-red-100 dark:bg-red-900/30 rounded-lg">
                  <FaTrash className="w-5 h-5 lg:w-6 lg:h-6 text-red-600 dark:text-red-400" />
                </div>
                <div>
                  <h3 className="text-lg lg:text-xl font-bold text-red-800 dark:text-red-400">
                    Zona Perigosa
                  </h3>
                  <p className="text-sm text-red-700 dark:text-red-300 mt-1">
                    Ações irreversíveis - proceda com cuidado
                  </p>
                </div>
              </div>
              
              <p className="text-red-600 dark:text-red-400 text-sm lg:text-base mb-6">
                ⚠️ Esta ação não pode ser desfeita. Todos os seus dados serão permanentemente removidos do sistema.
              </p>
              
              <button 
                onClick={handleDeleteAccount}
                className="flex items-center justify-center space-x-3 px-6 py-3 bg-red-600 hover:bg-red-700 text-white rounded-xl lg:rounded-2xl font-semibold shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 group w-full lg:w-auto"
              >
                <FaTrash className="w-4 h-4 lg:w-5 lg:h-5 group-hover:shake transition-transform duration-300" />
                <span>Excluir Minha Conta</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Footer Info */}
      <div className="text-center">
        <p className="text-gray-500 dark:text-gray-400 text-sm">
          Última atualização do perfil • {new Date().toLocaleDateString('pt-BR')}
        </p>
      </div>

      {/* Modais */}
      {isUpdatePhotoModalOpen && (
        <UpdatePhotoModal
          isOpen={isUpdatePhotoModalOpen}
          onClose={() => setIsUpdatePhotoModalOpen(false)}
          user={user}
          onPhotoUpdated={handlePhotoUpdated}
        />
      )}

      {isEditProfileModalOpen && (
        <EditProfileModal
          isOpen={isEditProfileModalOpen}
          onClose={() => setIsEditProfileModalOpen(false)}
          user={user}
          onProfileUpdated={handleProfileUpdated}
        />
      )}

      {isUpdatePasswordModalOpen && (
        <UpdatePasswordModal
          isOpen={isUpdatePasswordModalOpen}
          onClose={() => setIsUpdatePasswordModalOpen(false)}
          onPasswordUpdated={handlePasswordUpdated}
        />
      )}

      {/* Modal de Exclusão de Conta */}
      {isDeleteAccountModalOpen && (
        <DeleteAccountModal
          isOpen={isDeleteAccountModalOpen}
          onClose={() => setIsDeleteAccountModalOpen(false)}
          userId={user.id}
          onAccountDeleted={handleAccountDeleted}
        />
      )}
    </div>
  );
}
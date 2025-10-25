// src/pages/identity/user/users/index.tsx
import { useState, useEffect } from 'react';
import { 
  FaSearch, 
  FaUserPlus, 
  FaIdCard, 
  FaEnvelope, 
  FaUser, 
  FaArrowLeft, 
  FaArrowRight,
  FaFilter,
  FaUsers,
  FaUserShield,
  FaUserCircle,
  FaTimes,
  FaRedo
} from 'react-icons/fa';
import CreateUserModal from '@/components/modals/CreateUserModal';
import RestoreAccountModal from '@/components/modals/RestoreAccountModal';
import { useUsers, type User } from '@/hooks/useUsers';
import { useUserByBI } from '@/hooks/useUserByBI';
import { useRestoreAccount } from '@/hooks/useRestoreAccount';

// Constantes para os roles
const ROLE_ADMIN = 0;
const ROLE_CLIENT = 1;

const ROLE_OPTIONS = [
  { value: null, label: 'Todos os usuários', icon: FaUsers },
  { value: ROLE_ADMIN, label: 'Administradores', icon: FaUserShield },
  { value: ROLE_CLIENT, label: 'Clientes', icon: FaUserCircle }
];

const getRoleBadge = (role: number) => {
  if (role === ROLE_ADMIN) {
    return { label: 'Admin', color: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200' };
  } else {
    return { label: 'Cliente', color: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200' };
  }
};

export default function Users() {
  const { 
    users, 
    isLoading, 
    error, 
    loadUsers 
  } = useUsers();
  
  const { 
    user: searchedUser, 
    isLoading: isSearching, 
    error: searchError, 
    searchUserByBI, 
    clearSearch 
  } = useUserByBI();

  const [filteredUsers, setFilteredUsers] = useState<User[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState<number | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isRestoreModalOpen, setIsRestoreModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [showSearchedUser, setShowSearchedUser] = useState(false);
  
  const itemsPerPage = 5;

  // Aplicar filtros quando searchTerm, roleFilter ou users mudar
  useEffect(() => {
    let filtered = [...users];

    // Filtro por role
    if (roleFilter !== null) {
      filtered = filtered.filter(user => user.role === roleFilter);
    }

    // Filtro por BI
    if (searchTerm && !showSearchedUser) {
      filtered = filtered.filter(user => 
        user.bi.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    setFilteredUsers(filtered);
    setCurrentPage(1);
  }, [searchTerm, roleFilter, users, showSearchedUser]);

  // Formatação do BI em tempo real
  const formatBI = (value: string) => {
    let cleaned = value.replace(/[^a-zA-Z0-9]/g, '');
    cleaned = cleaned.slice(0, 14);
    
    let formatted = '';
    
    for (let i = 0; i < cleaned.length; i++) {
      if (i < 9) {
        if (/[0-9]/.test(cleaned[i])) {
          formatted += cleaned[i];
        }
      } else if (i < 11) {
        if (/[a-zA-Z]/.test(cleaned[i])) {
          formatted += cleaned[i].toUpperCase();
        }
      } else {
        if (/[0-9]/.test(cleaned[i])) {
          formatted += cleaned[i];
        }
      }
    }
    
    return formatted;
  };

  const handleBISearch = (value: string) => {
    const formatted = formatBI(value);
    setSearchTerm(formatted);
    
    // Limpar busca anterior quando o usuário digitar
    if (showSearchedUser) {
      setShowSearchedUser(false);
      clearSearch();
    }
  };

  // Buscar usuário por BI quando o termo tiver 14 caracteres
  const handleBISearchSubmit = async () => {
    if (searchTerm.length === 14) {
      const user = await searchUserByBI(searchTerm);
      if (user) {
        setShowSearchedUser(true);
      }
    }
  };

  // Abrir modal de restauração
  const handleOpenRestoreModal = (user: User) => {
    setSelectedUser(user);
    setIsRestoreModalOpen(true);
  };

  // Fechar modal de restauração
  const handleCloseRestoreModal = () => {
    setIsRestoreModalOpen(false);
    setSelectedUser(null);
  };

  // Função chamada após restaurar conta
  const handleAccountRestored = () => {
    loadUsers(); // Recarrega a lista de usuários
    if (showSearchedUser) {
      // Se estava em modo de busca, recarrega também a busca
      handleBISearchSubmit();
    }
  };

  // Voltar para lista completa
  const handleBackToList = () => {
    setShowSearchedUser(false);
    clearSearch();
    setSearchTerm('');
  };

  // Paginação
  const totalPages = Math.ceil(filteredUsers.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentUsers = filteredUsers.slice(startIndex, startIndex + itemsPerPage);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const getUserInitials = (user: User) => {
    return `${user.firstName?.charAt(0) || ''}${user.lastName?.charAt(0) || ''}`.toUpperCase();
  };

  const handleUserCreated = () => {
    loadUsers();
  };

  // Estatísticas
  const totalAdmins = users.filter(user => user.role === ROLE_ADMIN).length;
  const totalClients = users.filter(user => user.role === ROLE_CLIENT).length;

  // Dados para exibição - usuário pesquisado ou lista filtrada
  const displayUsers = showSearchedUser && searchedUser ? [searchedUser] : currentUsers;
  const displayCount = showSearchedUser && searchedUser ? 1 : filteredUsers.length;

  if (isLoading) {
    return (
      <div className="space-y-6">
        {/* Header Skeleton */}
        <div className="flex items-center justify-between">
          <div>
            <div className="h-8 w-64 bg-gray-200 dark:bg-gray-700 rounded-lg animate-pulse mb-2"></div>
            <div className="h-4 w-48 bg-gray-200 dark:bg-gray-700 rounded-lg animate-pulse"></div>
          </div>
          <div className="h-12 w-48 bg-gray-200 dark:bg-gray-700 rounded-xl animate-pulse"></div>
        </div>

        {/* Table Skeleton */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl border border-gray-200 dark:border-gray-700 p-8">
          <div className="flex items-center justify-center space-x-3">
            <div className="w-6 h-6 border-2 border-orange-500 border-t-transparent rounded-full animate-spin"></div>
            <span className="text-gray-600 dark:text-gray-300">Carregando usuários...</span>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="space-y-6">
        <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-2xl p-6">
          <div className="text-center">
            <div className="text-red-600 dark:text-red-400 text-lg font-semibold mb-2">
              Erro ao carregar usuários
            </div>
            <p className="text-red-500 dark:text-red-300 mb-4">{error}</p>
            <button
              onClick={loadUsers}
              className="px-6 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg font-medium transition-colors"
            >
              Tentar Novamente
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
          <div className="mb-6 lg:mb-0">
            <h1 className="text-2xl lg:text-3xl font-bold text-gray-800 dark:text-white">
              Gestão de Usuários
            </h1>
            <p className="text-gray-600 dark:text-gray-300 mt-1">
              Gerencie todos os usuários do sistema
            </p>
          </div>
          
          <button 
            onClick={() => setIsCreateModalOpen(true)}
            className="flex items-center justify-center space-x-3 px-6 py-3 bg-gradient-to-r from-orange-500 to-red-600 text-white rounded-xl lg:rounded-2xl font-semibold shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 group"
          >
            <FaUserPlus className="w-4 h-4 lg:w-5 lg:h-5 group-hover:scale-110 transition-transform duration-300" />
            <span>Novo Usuário</span>
          </button>
        </div>

        {/* Estatísticas */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl border border-gray-200 dark:border-gray-700 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Total de Usuários</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white mt-1">{users.length}</p>
              </div>
              <div className="p-3 bg-blue-100 dark:bg-blue-900/30 rounded-xl">
                <FaUsers className="w-6 h-6 text-blue-600 dark:text-blue-400" />
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl border border-gray-200 dark:border-gray-700 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Administradores</p>
                <p className="text-2xl font-bold text-red-600 dark:text-red-400 mt-1">{totalAdmins}</p>
              </div>
              <div className="p-3 bg-red-100 dark:bg-red-900/30 rounded-xl">
                <FaUserShield className="w-6 h-6 text-red-600 dark:text-red-400" />
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl border border-gray-200 dark:border-gray-700 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Clientes</p>
                <p className="text-2xl font-bold text-blue-600 dark:text-blue-400 mt-1">{totalClients}</p>
              </div>
              <div className="p-3 bg-green-100 dark:bg-green-900/30 rounded-xl">
                <FaUserCircle className="w-6 h-6 text-green-600 dark:text-green-400" />
              </div>
            </div>
          </div>
        </div>

        {/* Filtros e Search Bar */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl border border-gray-200 dark:border-gray-700 p-6">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
            <div className="flex-1">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Filtro por Role */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    <FaFilter className="w-4 h-4 inline mr-2" />
                    Filtrar por Tipo
                  </label>
                  <select
                    value={roleFilter === null ? '' : roleFilter.toString()}
                    onChange={(e) => {
                      setRoleFilter(e.target.value === '' ? null : parseInt(e.target.value));
                      if (showSearchedUser) {
                        setShowSearchedUser(false);
                        clearSearch();
                      }
                    }}
                    disabled={showSearchedUser}
                    className="w-full px-4 py-3 border-2 border-gray-200 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-200 transition-all duration-200 disabled:opacity-50"
                  >
                    {ROLE_OPTIONS.map(option => (
                      <option key={option.value === null ? 'all' : option.value} value={option.value === null ? '' : option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Search por BI */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    <FaSearch className="w-4 h-4 inline mr-2" />
                    Pesquisar por BI
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      placeholder="Ex: 123456789LA098"
                      value={searchTerm}
                      onChange={(e) => handleBISearch(e.target.value)}
                      onKeyPress={(e) => {
                        if (e.key === 'Enter' && searchTerm.length === 14) {
                          handleBISearchSubmit();
                        }
                      }}
                      className="block w-full pl-4 pr-24 py-3 border-2 border-gray-200 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 focus:outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-200 transition-all duration-200 text-lg font-mono"
                      maxLength={14}
                    />
                    <div className="absolute right-2 top-1/2 transform -translate-y-1/2 flex space-x-2">
                      {searchTerm.length === 14 && !showSearchedUser && (
                        <button
                          onClick={handleBISearchSubmit}
                          disabled={isSearching}
                          className="px-3 py-1 bg-orange-500 hover:bg-orange-600 text-white rounded-lg text-sm font-medium transition-colors disabled:opacity-50"
                        >
                          {isSearching ? '...' : 'Buscar'}
                        </button>
                      )}
                      {showSearchedUser && (
                        <button
                          onClick={handleBackToList}
                          className="px-3 py-1 bg-gray-500 hover:bg-gray-600 text-white rounded-lg text-sm font-medium transition-colors"
                        >
                          <FaTimes className="w-3 h-3" />
                        </button>
                      )}
                    </div>
                  </div>
                  {searchError && (
                    <p className="text-red-500 text-sm mt-1">{searchError}</p>
                  )}
                </div>
              </div>
            </div>
            
            <div className="text-right">
              <div className="text-2xl font-bold text-orange-600">{displayCount}</div>
              <div className="text-sm text-gray-500 dark:text-gray-400">
                {showSearchedUser ? 'usuário encontrado' : 'usuários filtrados'}
              </div>
            </div>
          </div>
        </div>

        {/* Users Table */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl border border-gray-200 dark:border-gray-700 overflow-hidden">
          {/* Table Header */}
          <div className="px-6 py-5 border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900/50">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-orange-500 rounded-lg">
                  <FaUser className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-gray-800 dark:text-white">
                    {showSearchedUser ? 'Usuário Encontrado' : 'Lista de Usuários'}
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400 text-sm">
                    {displayCount} usuário(s) {showSearchedUser ? 'encontrado' : 'encontrado(s)'}
                  </p>
                </div>
              </div>
              {showSearchedUser && (
                <button
                  onClick={handleBackToList}
                  className="flex items-center space-x-2 px-4 py-2 text-sm text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 transition-colors"
                >
                  <FaArrowLeft className="w-4 h-4" />
                  <span>Voltar para lista</span>
                </button>
              )}
            </div>
          </div>

          {/* Table Content */}
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900/50">
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wider">
                    Usuário
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wider">
                    BI/Identificação
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wider">
                    Email
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wider">
                    Tipo
                  </th>
                  {/* Coluna de Ações só aparece quando está em modo de busca individual */}
                  {showSearchedUser && (
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wider">
                      Ações
                    </th>
                  )}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                {displayUsers.length > 0 ? (
                  displayUsers.map((user) => {
                    const roleBadge = getRoleBadge(user.role);
                    return (
                      <tr 
                        key={user.id}
                        className="hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-all duration-300 group"
                      >
                        <td className="px-6 py-5 whitespace-nowrap">
                          <div className="flex items-center space-x-4">
                            <div className="w-12 h-12 bg-gradient-to-br from-orange-500 to-red-600 rounded-xl flex items-center justify-center text-white font-bold text-sm shadow-lg">
                              {getUserInitials(user)}
                            </div>
                            <div>
                              <div className="text-lg font-bold text-gray-900 dark:text-white">
                                {user.firstName} {user.lastName}
                              </div>
                              <div className="text-xs text-gray-500 dark:text-gray-400 font-mono">
                                #{user.id.substring(0, 8)}
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-5 whitespace-nowrap">
                          <div className="flex items-center space-x-3">
                            <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
                              <FaIdCard className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                            </div>
                            <span className="text-lg font-mono font-bold text-gray-900 dark:text-white">
                              {user.bi}
                            </span>
                          </div>
                        </td>
                        <td className="px-6 py-5 whitespace-nowrap">
                          <div className="flex items-center space-x-3">
                            <div className="p-2 bg-green-100 dark:bg-green-900/30 rounded-lg">
                              <FaEnvelope className="w-4 h-4 text-green-600 dark:text-green-400" />
                            </div>
                            <span className="text-lg text-gray-900 dark:text-white">
                              {user.email}
                            </span>
                          </div>
                        </td>
                        <td className="px-6 py-5 whitespace-nowrap">
                          <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${roleBadge.color}`}>
                            {roleBadge.label}
                          </span>
                        </td>
                        {/* Botão de ação só aparece quando está em modo de busca individual */}
                        {showSearchedUser && (
                          <td className="px-6 py-5 whitespace-nowrap">
                            <button
                              onClick={() => handleOpenRestoreModal(user)}
                              className="flex items-center space-x-2 px-4 py-2 bg-green-500 hover:bg-green-600 text-white rounded-lg font-medium text-sm transition-colors"
                            >
                              <FaRedo className="w-4 h-4" />
                              <span>Restaurar Conta</span>
                            </button>
                          </td>
                        )}
                      </tr>
                    );
                  })
                ) : (
                  <tr>
                    <td colSpan={showSearchedUser ? 5 : 4} className="px-6 py-16 text-center">
                      <div className="flex flex-col items-center justify-center space-y-4">
                        <div className="w-20 h-20 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center">
                          <FaUser className="w-10 h-10 text-gray-400" />
                        </div>
                        <div>
                          <h4 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                            Nenhum usuário encontrado
                          </h4>
                          <p className="text-gray-600 dark:text-gray-400">
                            {searchTerm || roleFilter !== null
                              ? 'Tente ajustar os filtros para ver mais resultados.'
                              : 'Não há usuários cadastrados no sistema.'
                            }
                          </p>
                        </div>
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination - Só mostra se não estiver em modo de busca individual */}
          {!showSearchedUser && filteredUsers.length > 0 && (
            <div className="px-6 py-4 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900/50">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div className="text-sm text-gray-700 dark:text-gray-300">
                  Mostrando <span className="font-semibold">{startIndex + 1}</span> a{' '}
                  <span className="font-semibold">
                    {Math.min(startIndex + itemsPerPage, filteredUsers.length)}
                  </span> de{' '}
                  <span className="font-semibold">{filteredUsers.length}</span> resultados
                </div>
                
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => handlePageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                    className="flex items-center space-x-2 px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    <FaArrowLeft className="w-4 h-4" />
                    <span>Anterior</span>
                  </button>

                  <button
                    onClick={() => handlePageChange(currentPage + 1)}
                    disabled={currentPage === totalPages || totalPages === 0}
                    className="flex items-center space-x-2 px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    <span>Próxima</span>
                    <FaArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Create User Modal */}
      <CreateUserModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onUserCreated={handleUserCreated}
      />

      {/* Restore Account Modal */}
      {selectedUser && (
        <RestoreAccountModal
          isOpen={isRestoreModalOpen}
          onClose={handleCloseRestoreModal}
          userId={selectedUser.id}
          userName={`${selectedUser.firstName} ${selectedUser.lastName}`}
          userBI={selectedUser.bi}
          onAccountRestored={handleAccountRestored}
        />
      )}
    </>
  );
}
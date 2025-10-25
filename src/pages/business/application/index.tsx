// src/pages/identity/user/applications/index.tsx
import { useState, useEffect } from 'react';
import { FaSearch, FaFileAlt, FaEye, FaClock, FaCheck, FaTimes, FaFilter, FaArrowLeft, FaArrowRight, FaCopy } from 'react-icons/fa';
import api from '@/libs/api';

interface Application {
  id: string;
  userId: string;
  status: number;
  documentIdCardUrl: string;
  documentSalaryDeclarationUrl: string;
  documentBankStatementUrl: string;
  documentLastBankReceiptUrl: string;
  allowRejectedEdit: boolean;
  createdAt: string;
  updatedAt: string;
  reviewComments: string[];
  lastReviewComment: string | null;
}

interface ApplicationsResponse {
  code: number;
  message: string | null;
  data: Application[];
}

// Corrigindo a tipagem - usar string para os valores numéricos também
type StatusFilter = 'all' | '1' | '2' | '3';

export default function Applications() {
  const [applications, setApplications] = useState<Application[]>([]);
  const [filteredApplications, setFilteredApplications] = useState<Application[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<StatusFilter>('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const itemsPerPage = 5;

  useEffect(() => {
    loadApplications();
  }, []);

  useEffect(() => {
    filterApplications();
  }, [searchTerm, statusFilter, applications]);

  const loadApplications = async () => {
    try {
      setIsLoading(true);
      const response = await api.get<ApplicationsResponse>('/v1/Applications/GetAll');
      
      if (response.data.code === 200) {
        setApplications(response.data.data);
      }
    } catch (error) {
      console.error('Erro ao carregar candidaturas:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const filterApplications = () => {
    let filtered = [...applications];

    console.log('Total de aplicações:', applications.length);
    console.log('Filtro atual:', statusFilter);
    console.log('Termo de busca:', searchTerm);

    // Filtro por status - corrigindo a comparação
    if (statusFilter !== 'all') {
      const statusNumber = parseInt(statusFilter);
      filtered = filtered.filter(app => app.status === statusNumber);
      console.log(`Filtradas por status ${statusNumber}:`, filtered.length);
    }

    // Filtro por search (ID da candidatura ou ID do usuário)
    if (searchTerm.trim()) {
      filtered = filtered.filter(app => 
        app.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
        app.userId.toLowerCase().includes(searchTerm.toLowerCase())
      );
      console.log('Filtradas por busca:', filtered.length);
    }

    setFilteredApplications(filtered);
    setCurrentPage(1);
  };

  // Paginação
  const totalPages = Math.ceil(filteredApplications.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentApplications = filteredApplications.slice(startIndex, startIndex + itemsPerPage);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const getStatusBadge = (status: number) => {
    switch (status) {
      case 1: // Pending
        return (
          <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400">
            <FaClock className="w-3 h-3 mr-1" />
            Pendente
          </span>
        );
      case 2: // Approved
        return (
          <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400">
            <FaCheck className="w-3 h-3 mr-1" />
            Aprovada
          </span>
        );
      case 3: // Rejected
        return (
          <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400">
            <FaTimes className="w-3 h-3 mr-1" />
            Rejeitada
          </span>
        );
      default:
        return null;
    }
  };

  const getStatusCount = (status: number) => {
    return applications.filter(app => app.status === status).length;
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const handleViewApplication = (application: Application) => {
    console.log('Visualizar candidatura:', application.id);
    // Aqui você pode implementar a navegação para a página de detalhes
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text).then(() => {
      setCopiedId(text);
      setTimeout(() => setCopiedId(null), 2000);
    });
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        {/* Header Skeleton */}
        <div className="flex items-center justify-between">
          <div>
            <div className="h-8 w-64 bg-gray-200 dark:bg-gray-700 rounded-lg animate-pulse mb-2"></div>
            <div className="h-4 w-48 bg-gray-200 dark:bg-gray-700 rounded-lg animate-pulse"></div>
          </div>
        </div>

        {/* Table Skeleton */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl border border-gray-200 dark:border-gray-700 p-8">
          <div className="flex items-center justify-center space-x-3">
            <div className="w-6 h-6 border-2 border-orange-500 border-t-transparent rounded-full animate-spin"></div>
            <span className="text-gray-600 dark:text-gray-300">Carregando candidaturas...</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
        <div className="mb-6 lg:mb-0">
          <h1 className="text-2xl lg:text-3xl font-bold text-gray-800 dark:text-white">
            Gestão de Candidaturas
          </h1>
          <p className="text-gray-600 dark:text-gray-300 mt-1">
            Gerencie todas as candidaturas do sistema
          </p>
        </div>
      </div>

      {/* Estatísticas */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl border border-gray-200 dark:border-gray-700 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Total</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white mt-1">{applications.length}</p>
            </div>
            <div className="p-3 bg-blue-100 dark:bg-blue-900/30 rounded-xl">
              <FaFileAlt className="w-6 h-6 text-blue-600 dark:text-blue-400" />
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl border border-gray-200 dark:border-gray-700 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Pendentes</p>
              <p className="text-2xl font-bold text-yellow-600 dark:text-yellow-400 mt-1">{getStatusCount(1)}</p>
            </div>
            <div className="p-3 bg-yellow-100 dark:bg-yellow-900/30 rounded-xl">
              <FaClock className="w-6 h-6 text-yellow-600 dark:text-yellow-400" />
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl border border-gray-200 dark:border-gray-700 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Aprovadas</p>
              <p className="text-2xl font-bold text-green-600 dark:text-green-400 mt-1">{getStatusCount(2)}</p>
            </div>
            <div className="p-3 bg-green-100 dark:bg-green-900/30 rounded-xl">
              <FaCheck className="w-6 h-6 text-green-600 dark:text-green-400" />
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl border border-gray-200 dark:border-gray-700 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Rejeitadas</p>
              <p className="text-2xl font-bold text-red-600 dark:text-red-400 mt-1">{getStatusCount(3)}</p>
            </div>
            <div className="p-3 bg-red-100 dark:bg-red-900/30 rounded-xl">
              <FaTimes className="w-6 h-6 text-red-600 dark:text-red-400" />
            </div>
          </div>
        </div>
      </div>

      {/* Search and Filter Bar */}
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl border border-gray-200 dark:border-gray-700 p-6">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div className="flex-1">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Search */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  <FaSearch className="w-4 h-4 inline mr-2" />
                  Pesquisar
                </label>
                <div className="relative">
                  <input
                    type="text"
                    placeholder="ID da candidatura ou ID do usuário..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="block w-full pl-4 pr-3 py-3 border-2 border-gray-200 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 focus:outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-200 transition-all duration-200"
                  />
                </div>
              </div>

              {/* Filtro de Status */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  <FaFilter className="w-4 h-4 inline mr-2" />
                  Filtrar por Status
                </label>
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value as StatusFilter)}
                  className="w-full px-4 py-3 border-2 border-gray-200 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-200 transition-all duration-200"
                >
                  <option value="all">Todos os status</option>
                  <option value="1">Pendentes</option>
                  <option value="2">Aprovadas</option>
                  <option value="3">Rejeitadas</option>
                </select>
              </div>
            </div>
          </div>
          
          <div className="text-right">
            <div className="text-2xl font-bold text-orange-600">{filteredApplications.length}</div>
            <div className="text-sm text-gray-500 dark:text-gray-400">
              {filteredApplications.length === 1 ? 'candidatura' : 'candidaturas'} filtrada(s)
            </div>
          </div>
        </div>
      </div>

      {/* Applications Table */}
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl border border-gray-200 dark:border-gray-700 overflow-hidden">
        {/* Table Header */}
        <div className="px-6 py-5 border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900/50">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-orange-500 rounded-lg">
              <FaFileAlt className="w-5 h-5 text-white" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-gray-800 dark:text-white">
                Lista de Candidaturas
              </h3>
              <p className="text-gray-600 dark:text-gray-400 text-sm">
                {filteredApplications.length} candidatura(s) encontrada(s)
              </p>
            </div>
          </div>
        </div>

        {/* Table Content */}
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900/50">
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wider">
                  ID Candidatura
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wider">
                  ID Usuário
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wider">
                  Data de Criação
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wider">
                  Ações
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
              {currentApplications.length > 0 ? (
                currentApplications.map((application) => (
                  <tr 
                    key={application.id}
                    className="hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-all duration-300 group"
                  >
                    {/* ID da Candidatura */}
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center space-x-2 group/copy relative">
                        <div className="text-sm font-mono text-gray-900 dark:text-white bg-gray-100 dark:bg-gray-700 px-3 py-2 rounded-lg border border-gray-200 dark:border-gray-600 max-w-[200px] truncate">
                          {application.id}
                        </div>
                        <button
                          onClick={() => copyToClipboard(application.id)}
                          className="opacity-0 group-hover/copy:opacity-100 transition-opacity duration-200 p-1 hover:bg-gray-200 dark:hover:bg-gray-600 rounded"
                          title="Copiar ID"
                        >
                          <FaCopy className="w-3 h-3 text-gray-500" />
                        </button>
                        {copiedId === application.id && (
                          <div className="absolute -top-8 left-0 bg-green-500 text-white text-xs px-2 py-1 rounded">
                            Copiado!
                          </div>
                        )}
                      </div>
                    </td>

                    {/* ID do Usuário */}
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center space-x-2 group/copy relative">
                        <div className="text-sm font-mono text-gray-900 dark:text-white bg-gray-100 dark:bg-gray-700 px-3 py-2 rounded-lg border border-gray-200 dark:border-gray-600 max-w-[200px] truncate">
                          {application.userId}
                        </div>
                        <button
                          onClick={() => copyToClipboard(application.userId)}
                          className="opacity-0 group-hover/copy:opacity-100 transition-opacity duration-200 p-1 hover:bg-gray-200 dark:hover:bg-gray-600 rounded"
                          title="Copiar ID do Usuário"
                        >
                          <FaCopy className="w-3 h-3 text-gray-500" />
                        </button>
                        {copiedId === application.userId && (
                          <div className="absolute -top-8 left-0 bg-green-500 text-white text-xs px-2 py-1 rounded">
                            Copiado!
                          </div>
                        )}
                      </div>
                    </td>

                    <td className="px-6 py-4 whitespace-nowrap">
                      {getStatusBadge(application.status)}
                    </td>
                    
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900 dark:text-white">
                        {formatDate(application.createdAt)}
                      </div>
                    </td>
                    
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center space-x-2">
                        {/* Apenas candidaturas pendentes têm ação de visualizar */}
                        {application.status === 1 && (
                          <button
                            onClick={() => handleViewApplication(application)}
                            className="flex items-center space-x-2 px-3 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-all duration-200 hover:scale-105 group"
                            title="Visualizar Candidatura"
                          >
                            <FaEye className="w-4 h-4 group-hover:scale-110 transition-transform" />
                            <span className="text-sm font-medium">Visualizar</span>
                          </button>
                        )}
                        {application.status !== 1 && (
                          <span className="text-sm text-gray-500 dark:text-gray-400 italic">
                            Nenhuma ação
                          </span>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={5} className="px-6 py-16 text-center">
                    <div className="flex flex-col items-center justify-center space-y-4">
                      <div className="w-20 h-20 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center">
                        <FaFileAlt className="w-10 h-10 text-gray-400" />
                      </div>
                      <div>
                        <h4 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                          Nenhuma candidatura encontrada
                        </h4>
                        <p className="text-gray-600 dark:text-gray-400">
                          {searchTerm || statusFilter !== 'all' 
                            ? 'Tente ajustar os filtros de pesquisa.'
                            : 'Não há candidaturas cadastradas no sistema.'
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

        {/* Pagination */}
        {filteredApplications.length > 0 && (
          <div className="px-6 py-4 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900/50">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div className="text-sm text-gray-700 dark:text-gray-300">
                Mostrando <span className="font-semibold">{startIndex + 1}</span> a{' '}
                <span className="font-semibold">
                  {Math.min(startIndex + itemsPerPage, filteredApplications.length)}
                </span> de{' '}
                <span className="font-semibold">{filteredApplications.length}</span> resultados
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
  );
}
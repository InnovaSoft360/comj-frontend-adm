import { FaServer, FaDesktop, FaSync, FaCheckCircle, FaTimesCircle, FaMemory, FaClock, FaDatabase, FaThermometerHalf } from 'react-icons/fa';
import { useSystemHealth } from '@/hooks/useSystemHealth';
import { useState, useEffect } from 'react';

export default function System() {
  const { backend, frontend, connectionHealth, loading, refetch } = useSystemHealth();
  const [lastUpdate, setLastUpdate] = useState<string>('');

  // Atualiza o timestamp a cada atualização
  useEffect(() => {
    if (!loading && backend) {
      setLastUpdate(new Date().toLocaleTimeString());
    }
  }, [backend, loading]);

  if (loading) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl lg:text-3xl font-bold text-gray-800 dark:text-white">
            Monitoramento do Sistema
          </h1>
          <p className="text-gray-600 dark:text-gray-300 mt-1">
            Verificando status dos serviços...
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

  const StatusBadge = ({ status }: { status: string }) => (
    <span className={`px-3 py-1 rounded-full text-sm font-medium ${
      status === 'Healthy' || status === 'Connected' 
        ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400'
        : 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400'
    }`}>
      {status}
    </span>
  );

  const InfoCard = ({ icon, title, value, status }: { 
    icon: React.ReactNode; 
    title: string; 
    value: string; 
    status?: string;
  }) => (
    <div className="bg-white dark:bg-gray-800 rounded-xl p-4 shadow-sm border border-gray-200 dark:border-gray-700">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="p-2 rounded-lg bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300">
            {icon}
          </div>
          <div>
            <p className="text-sm font-medium text-gray-600 dark:text-gray-400">{title}</p>
            <p className="text-lg font-semibold text-gray-800 dark:text-white">{value}</p>
          </div>
        </div>
        {status && <StatusBadge status={status} />}
      </div>
    </div>
  );

  const getConnectionColor = (health: number) => {
    if (health >= 80) return 'from-green-500 to-emerald-500';
    if (health >= 60) return 'from-yellow-500 to-amber-500';
    if (health >= 40) return 'from-orange-500 to-red-500';
    return 'from-red-500 to-rose-500';
  };

  const getConnectionStatus = (health: number) => {
    if (health >= 80) return 'Excelente';
    if (health >= 60) return 'Boa';
    if (health >= 40) return 'Regular';
    return 'Ruim';
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
        <div>
          <h1 className="text-2xl lg:text-3xl font-bold text-gray-800 dark:text-white">
            Monitoramento do Sistema
          </h1>
          <p className="text-gray-600 dark:text-gray-300 mt-1">
            Status em tempo real • Atualiza automaticamente
          </p>
        </div>
        
        <div className="flex items-center space-x-4 mt-4 lg:mt-0">
          {lastUpdate && (
            <span className="text-sm text-gray-500 dark:text-gray-400">
              Última: {lastUpdate}
            </span>
          )}
          <button
            onClick={refetch}
            className="flex items-center space-x-2 px-4 py-2 bg-orange-500 hover:bg-orange-600 text-white rounded-lg transition-colors"
          >
            <FaSync className="w-4 h-4" />
            <span>Atualizar</span>
          </button>
        </div>
      </div>

      {/* Temperatura da Conexão */}
      <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700">
        <div className="flex items-center space-x-3 mb-6">
          <FaThermometerHalf className="w-6 h-6 text-orange-500" />
          <h2 className="text-xl font-semibold text-gray-800 dark:text-white">Saúde da Conexão</h2>
          <div className="flex items-center space-x-2 text-sm text-green-600 bg-green-100 dark:bg-green-900/30 dark:text-green-400 px-2 py-1 rounded-full">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
            <span>Auto-update</span>
          </div>
        </div>

        <div className="text-center">
          <div className="flex justify-center mb-4">
            <div className={`p-4 rounded-2xl bg-gradient-to-r ${getConnectionColor(connectionHealth)} text-white shadow-lg`}>
              <FaThermometerHalf className="w-8 h-8" />
            </div>
          </div>
          
          <h3 className="text-2xl font-bold text-gray-800 dark:text-white mb-2">
            {connectionHealth}%
          </h3>
          
          <p className="text-gray-600 dark:text-gray-300 mb-4">
            {getConnectionStatus(connectionHealth)}
          </p>
          
          <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3">
            <div 
              className={`h-3 rounded-full bg-gradient-to-r ${getConnectionColor(connectionHealth)} transition-all duration-500`}
              style={{ width: `${connectionHealth}%` }}
            ></div>
          </div>
        </div>
      </div>

      {/* Backend Section */}
      <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700">
        <div className="flex items-center space-x-3 mb-6">
          <FaServer className="w-6 h-6 text-blue-500" />
          <h2 className="text-xl font-semibold text-gray-800 dark:text-white">Backend - API</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <InfoCard
            icon={<FaCheckCircle className="w-4 h-4" />}
            title="Status"
            value={backend?.application || 'API'}
            status={backend?.status}
          />
          
          <InfoCard
            icon={<FaDesktop className="w-4 h-4" />}
            title="Versão"
            value={backend?.version || 'N/A'}
          />
          
          <InfoCard
            icon={<FaClock className="w-4 h-4" />}
            title="Uptime"
            value={backend?.uptime.replace(/\./g, ':').replace(/^00:/, '') || '00:00:00'}
          />
          
          <InfoCard
            icon={<FaMemory className="w-4 h-4" />}
            title="Memória"
            value={backend?.memoryUsage || '0 MB'}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
          <InfoCard
            icon={<FaServer className="w-4 h-4" />}
            title="Ambiente"
            value={backend?.environment || 'Unknown'}
          />
          
          <InfoCard
            icon={<FaServer className="w-4 h-4" />}
            title="Servidor"
            value={backend?.server || 'N/A'}
          />
          
          <InfoCard
            icon={<FaDatabase className="w-4 h-4" />}
            title="Database"
            value="Database"
            status={backend?.database}
          />
        </div>
      </div>

      {/* Frontend Section */}
      <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700">
        <div className="flex items-center space-x-3 mb-6">
          <FaDesktop className="w-6 h-6 text-green-500" />
          <h2 className="text-xl font-semibold text-gray-800 dark:text-white">Frontend - Admin</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <InfoCard
            icon={<FaCheckCircle className="w-4 h-4" />}
            title="Status"
            value={frontend?.application || 'Frontend'}
            status={frontend?.status}
          />
          
          <InfoCard
            icon={<FaDesktop className="w-4 h-4" />}
            title="Versão"
            value={frontend?.version || 'N/A'}
          />
          
          <InfoCard
            icon={<FaMemory className="w-4 h-4" />}
            title="Memória"
            value={frontend?.memoryUsage || 'N/A'}
          />
          
          <InfoCard
            icon={frontend?.online ? <FaCheckCircle className="w-4 h-4" /> : <FaTimesCircle className="w-4 h-4" />}
            title="Conexão"
            value={frontend?.online ? 'Online' : 'Offline'}
            status={frontend?.online ? 'Online' : 'Offline'}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
          <InfoCard
            icon={<FaServer className="w-4 h-4" />}
            title="Ambiente"
            value={frontend?.environment || 'development'}
          />
          
          <InfoCard
            icon={<FaDesktop className="w-4 h-4" />}
            title="Resolução"
            value={`${window.screen.width}x${window.screen.height}`}
          />
        </div>
      </div>
    </div>
  );
}
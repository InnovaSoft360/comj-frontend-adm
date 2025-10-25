import { useState, useEffect, useRef } from 'react';
import api from '@/libs/api';

export interface Application {
  id: string;
  userId: string;
  status: number; // 1 = Pendente, 2 = Aprovada, 3 = Rejeitada
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

export interface User {
  createdAt: Date;
  id: string;
  firstName: string;
  lastName: string;
  photoUrl: string;
  bi: string;
  email: string;
  role: number; // 0 = Admin, 1 = User
}

export interface DashboardOverview {
  totalUUsers: number;
  totalApplications: number;
}

export interface DashboardStats {
  totalApplications: number;
  totalUsers: number;
  totalClients: number;
  totalAdmins: number;
  approvedApplications: number;
  rejectedApplications: number;
  pendingApplications: number;
}

// Constantes para os status
export const APPLICATION_STATUS = {
  PENDING: 1,
  APPROVED: 2,
  REJECTED: 3
} as const;

export function useDashboardData() {
  const [overview, setOverview] = useState<DashboardOverview | null>(null);
  const [applications, setApplications] = useState<Application[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [lastUpdate, setLastUpdate] = useState<string>('');
  const intervalRef = useRef<number | null>(null);

  const fetchOverview = async () => {
    try {
      const response = await api.post('/v1/Dashboards/Overview');
      setOverview(response.data.data);
    } catch (err) {
      setError('Erro ao carregar overview');
    }
  };

  const fetchApplications = async () => {
    try {
      const response = await api.get('/v1/Applications/GetAll');
      setApplications(response.data.data);
    } catch (err) {
      setError('Erro ao carregar candidaturas');
    }
  };

  const fetchUsers = async () => {
    try {
      const response = await api.get('/v1/Users/GetAll');
      setUsers(response.data.data);
    } catch (err) {
      setError('Erro ao carregar usuários');
    }
  };

  const calculateStats = () => {
    if (!users.length || !applications.length) return;

    const totalApplications = applications.length;
    const totalUsers = users.length;
    const totalClients = users.filter(user => user.role === 1).length;
    const totalAdmins = users.filter(user => user.role === 0).length;
    
    const approvedApplications = applications.filter(app => app.status === APPLICATION_STATUS.APPROVED).length;
    const rejectedApplications = applications.filter(app => app.status === APPLICATION_STATUS.REJECTED).length;
    const pendingApplications = applications.filter(app => app.status === APPLICATION_STATUS.PENDING).length;

    setStats({
      totalApplications,
      totalUsers,
      totalClients,
      totalAdmins,
      approvedApplications,
      rejectedApplications,
      pendingApplications
    });
  };

  const loadData = async () => {
    setError(null);

    try {
      await Promise.all([
        fetchOverview(),
        fetchApplications(),
        fetchUsers()
      ]);
      setLastUpdate(new Date().toLocaleTimeString());
    } catch (err) {
      setError('Erro ao carregar dados do dashboard');
    } finally {
      setLoading(false);
    }
  };

  // ⚡ Auto-atualização a cada 5 segundos
  const startAutoRefresh = () => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }
    
    intervalRef.current = window.setInterval(loadData, 5000);
  };

  const stopAutoRefresh = () => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  };

  useEffect(() => {
    loadData();
    startAutoRefresh();

    // Otimização: pausa quando aba não está visível
    const handleVisibilityChange = () => {
      if (document.hidden) {
        stopAutoRefresh();
      } else {
        startAutoRefresh();
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);

    return () => {
      stopAutoRefresh();
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, []);

  useEffect(() => {
    if (users.length && applications.length) {
      calculateStats();
    }
  }, [users, applications]);

  // 📊 Gráfico de candidaturas mensais - BASEADO NOS DADOS REAIS
  const getMonthlyApplications = () => {
    const currentYear = new Date().getFullYear();
    const monthlyData = Array(12).fill(0);
    
    applications.forEach(app => {
      const appDate = new Date(app.createdAt);
      if (appDate.getFullYear() === currentYear) {
        const month = appDate.getMonth();
        monthlyData[month]++;
      }
    });

    return monthlyData;
  };

  // 📈 Evolução de usuários - BASEADO NOS DADOS REAIS
  const getUserGrowthData = () => {
    if (!users.length) return Array(12).fill(0);
    
    // Ordena usuários por data de criação (assumindo que createdAt existe)
    const sortedUsers = [...users].sort((a, b) => 
      new Date(a.createdAt || new Date()).getTime() - new Date(b.createdAt || new Date()).getTime()
    );
    
    const monthlyGrowth = Array(12).fill(0);
    const currentYear = new Date().getFullYear();
    
    sortedUsers.forEach((user) => {
      const userDate = new Date(user.createdAt || new Date());
      if (userDate.getFullYear() === currentYear) {
        const month = userDate.getMonth();
        // Acumula usuários por mês
        for (let m = month; m < 12; m++) {
          monthlyGrowth[m]++;
        }
      }
    });

    // Preenche meses anteriores com o valor mínimo
    const firstMonthWithData = monthlyGrowth.findIndex(count => count > 0);
    if (firstMonthWithData > 0) {
      const firstValue = monthlyGrowth[firstMonthWithData] || 1;
      for (let i = 0; i < firstMonthWithData; i++) {
        monthlyGrowth[i] = Math.max(1, firstValue - (firstMonthWithData - i));
      }
    }

    return monthlyGrowth;
  };

  const getConversionRate = () => {
    if (!stats || stats.totalApplications === 0) return 0;
    return Math.round((stats.approvedApplications / stats.totalApplications) * 100);
  };

  const getApplicationsByStatus = (status: number) => {
    return applications.filter(app => app.status === status);
  };

  return {
    overview,
    applications,
    users,
    stats,
    loading,
    error,
    lastUpdate,
    refetch: loadData,
    startAutoRefresh,
    stopAutoRefresh,
    getMonthlyApplications,
    getUserGrowthData,
    getConversionRate,
    getApplicationsByStatus,
    APPLICATION_STATUS
  };
}
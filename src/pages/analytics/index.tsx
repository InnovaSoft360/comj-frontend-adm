import { 
  Chart as ChartJS, 
  CategoryScale, 
  LinearScale, 
  BarElement, 
  LineElement, 
  PointElement, 
  ArcElement,
  Title, 
  Tooltip, 
  Legend 
} from 'chart.js';
import { Bar, Line, Doughnut } from 'react-chartjs-2';
import { 
  FaUsers, 
  FaUserTie, 
  FaUserShield, 
  FaCheckCircle, 
  FaTimesCircle, 
  FaPauseCircle,
  FaChartLine,
  FaChartBar,
  FaChartPie,
  FaArrowUp,
  FaArrowDown,
  FaSync
} from 'react-icons/fa';

// Registra os componentes do Chart.js
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  ArcElement,
  Title,
  Tooltip,
  Legend
);

export default function Analytics() {
  // Dados para os cards principais
  const mainStats = [
    { 
      title: 'Total de Usuários', 
      value: '2,548', 
      color: 'from-blue-500 to-cyan-500',
      icon: <FaUsers className="w-6 h-6" />,
      trend: '+12%',
      description: 'Usuários ativos'
    },
    { 
      title: 'Total de Clientes', 
      value: '1,892', 
      color: 'from-green-500 to-emerald-500',
      icon: <FaUserTie className="w-6 h-6" />,
      trend: '+8%',
      description: 'Clientes cadastrados'
    },
    { 
      title: 'Administradores', 
      value: '24', 
      color: 'from-purple-500 to-violet-500',
      icon: <FaUserShield className="w-6 h-6" />,
      trend: '+2',
      description: 'Equipe admin'
    },
  ];

  // Dados para os cards laterais
  const sideStats = [
    { 
      title: 'Aprovadas', 
      value: '856', 
      color: 'bg-gradient-to-r from-green-500 to-emerald-500',
      icon: <FaCheckCircle className="w-4 h-4" />,
      percentage: '+12%',
      trend: 'up'
    },
    { 
      title: 'Rejeitadas', 
      value: '342', 
      color: 'bg-gradient-to-r from-red-500 to-rose-500',
      icon: <FaTimesCircle className="w-4 h-4" />,
      percentage: '-5%',
      trend: 'down'
    },
    { 
      title: 'Pendentes', 
      value: '156', 
      color: 'bg-gradient-to-r from-yellow-500 to-amber-500',
      icon: <FaPauseCircle className="w-4 h-4" />,
      percentage: '+3%',
      trend: 'up'
    },
  ];

  // Dados para o gráfico de barras (Candidaturas por mês)
  const barData = {
    labels: ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'],
    datasets: [
      {
        label: 'Candidaturas Recebidas',
        data: [65, 78, 90, 81, 86, 95, 120, 110, 105, 98, 115, 130],
        backgroundColor: 'rgba(249, 115, 22, 0.8)',
        borderColor: 'rgb(249, 115, 22)',
        borderWidth: 2,
        borderRadius: 8,
        borderSkipped: false,
      },
    ],
  };

  // Opções SIMPLIFICADAS para evitar erros TypeScript
  const barOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top' as const,
      },
      title: {
        display: true,
        text: 'Candidaturas Mensais - 2024',
      },
    },
  };

  // Dados para o gráfico de linha (Evolução de usuários)
  const lineData = {
    labels: ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'],
    datasets: [
      {
        label: 'Novos Usuários',
        data: [120, 150, 180, 200, 240, 280, 320, 350, 380, 420, 460, 500],
        borderColor: 'rgb(59, 130, 246)',
        backgroundColor: 'rgba(59, 130, 246, 0.1)',
        borderWidth: 3,
        tension: 0.4,
        fill: true,
        pointBackgroundColor: 'rgb(59, 130, 246)',
        pointBorderColor: '#fff',
        pointBorderWidth: 2,
        pointRadius: 5,
        pointHoverRadius: 7,
      },
    ],
  };

  const lineOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top' as const,
      },
      title: {
        display: true,
        text: 'Evolução de Novos Usuários',
      },
    },
  };

  // Dados para o gráfico de pizza (Status das Candidaturas)
  const doughnutData = {
    labels: ['Aprovadas', 'Rejeitadas', 'Pendentes', 'Canceladas'],
    datasets: [
      {
        data: [45, 25, 20, 10],
        backgroundColor: [
          'rgba(34, 197, 94, 0.9)',
          'rgba(239, 68, 68, 0.9)',
          'rgba(59, 130, 246, 0.9)',
          'rgba(245, 158, 11, 0.9)',
        ],
        borderColor: [
          'rgb(34, 197, 94)',
          'rgb(239, 68, 68)',
          'rgb(59, 130, 246)',
          'rgb(245, 158, 11)',
        ],
        borderWidth: 3,
        borderRadius: 5,
        spacing: 2,
      },
    ],
  };

  const doughnutOptions = {
    responsive: true,
    maintainAspectRatio: false,
    cutout: '65%',
    plugins: {
      legend: {
        position: 'bottom' as const,
      },
    },
  };

  return (
    // ✅ REMOVIDO: <DashboardLayout>
    <div className="w-full max-w-full space-y-6">
      {/* Page Header */}
      <div className="text-center lg:text-left">
        <h1 className="text-3xl lg:text-4xl font-bold bg-gradient-to-r from-orange-600 to-red-600 bg-clip-text text-transparent">
          Dashboard Analytics
        </h1>
        <p className="text-gray-600 dark:text-gray-300 mt-2 text-lg">
          Visão geral completa em tempo real
        </p>
      </div>

      {/* Cards Principais - SUPER MODERNOS */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full">
        {mainStats.map((stat, index) => (
          <div 
            key={index}
            className="group relative bg-white dark:bg-gray-800 rounded-3xl p-6 shadow-2xl border border-gray-200/50 dark:border-gray-700/50 hover:shadow-3xl transition-all duration-500 hover:scale-105 backdrop-blur-sm overflow-hidden"
          >
            {/* Efeito de brilho no hover */}
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
            
            <div className="relative z-10">
              <div className="flex items-center justify-between mb-4">
                <div className={`p-3 rounded-2xl bg-gradient-to-r ${stat.color} shadow-lg`}>
                  <div className="text-white">
                    {stat.icon}
                  </div>
                </div>
                <div className={`flex items-center space-x-1 px-2 py-1 rounded-full text-xs font-semibold ${
                  stat.trend.startsWith('+') ? 'bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-400' : 'bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400'
                }`}>
                  {stat.trend.startsWith('+') ? <FaArrowUp className="w-3 h-3" /> : <FaArrowUp className="w-3 h-3" />}
                  <span>{stat.trend}</span>
                </div>
              </div>
              
              <div className="space-y-2">
                <p className="text-gray-500 dark:text-gray-400 text-sm font-medium">
                  {stat.title}
                </p>
                <p className="text-3xl font-bold bg-gradient-to-r bg-clip-text text-transparent bg-gradient-to-r from-gray-800 to-gray-600 dark:from-white dark:to-gray-300">
                  {stat.value}
                </p>
                <p className="text-xs text-gray-400 dark:text-gray-500">
                  {stat.description}
                </p>
              </div>

              {/* Barra de progresso gradiente */}
              <div className={`w-full h-1 bg-gradient-to-r ${stat.color} rounded-full mt-4 group-hover:h-2 transition-all duration-300`}></div>
            </div>
          </div>
        ))}
      </div>

      {/* Grid Principal - Gráficos e Cards Laterais */}
      <div className="grid grid-cols-1 xl:grid-cols-4 gap-6 w-full">
        {/* Coluna Principal - 3/4 da largura */}
        <div className="xl:col-span-3 space-y-6">
          {/* Gráfico de Barras - Candidaturas Mensais */}
          <div className="group bg-white dark:bg-gray-800 rounded-3xl p-6 shadow-2xl border border-gray-200/50 dark:border-gray-700/50 hover:shadow-3xl transition-all duration-500">
            <div className="flex items-center space-x-3 mb-6">
              <div className="p-2 rounded-xl bg-orange-100 dark:bg-orange-900/30 text-orange-600 dark:text-orange-400">
                <FaChartBar className="w-5 h-5" />
              </div>
              <h3 className="text-lg font-semibold text-gray-800 dark:text-white">Candidaturas Mensais</h3>
            </div>
            <div className="h-80">
              <Bar data={barData} options={barOptions} />
            </div>
          </div>

          {/* Grid de Gráficos Secundários */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Gráfico de Linha - Evolução de Usuários */}
            <div className="group bg-white dark:bg-gray-800 rounded-3xl p-6 shadow-2xl border border-gray-200/50 dark:border-gray-700/50 hover:shadow-3xl transition-all duration-500">
              <div className="flex items-center space-x-3 mb-6">
                <div className="p-2 rounded-xl bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400">
                  <FaChartLine className="w-5 h-5" />
                </div>
                <h3 className="text-lg font-semibold text-gray-800 dark:text-white">Evolução de Usuários</h3>
              </div>
              <div className="h-64">
                <Line data={lineData} options={lineOptions} />
              </div>
            </div>

            {/* Gráfico de Pizza - Status das Candidaturas */}
            <div className="group bg-white dark:bg-gray-800 rounded-3xl p-6 shadow-2xl border border-gray-200/50 dark:border-gray-700/50 hover:shadow-3xl transition-all duration-500">
              <div className="flex items-center space-x-3 mb-6">
                <div className="p-2 rounded-xl bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400">
                  <FaChartPie className="w-5 h-5" />
                </div>
                <h3 className="text-lg font-semibold text-gray-800 dark:text-white">Status das Candidaturas</h3>
              </div>
              <div className="h-64">
                <Doughnut data={doughnutData} options={doughnutOptions} />
              </div>
            </div>
          </div>
        </div>

        {/* Coluna Lateral - 1/4 da largura */}
        <div className="xl:col-span-1 space-y-6">
          {/* Cards Laterais - SUPER ESTILIZADOS */}
          {sideStats.map((stat, index) => (
            <div 
              key={index}
              className="group relative bg-white dark:bg-gray-800 rounded-3xl p-6 shadow-2xl border border-gray-200/50 dark:border-gray-700/50 hover:shadow-3xl transition-all duration-500 hover:scale-105 backdrop-blur-sm overflow-hidden"
            >
              <div className="relative z-10">
                <div className="flex items-center justify-between mb-4">
                  <div className={`p-2 rounded-xl ${stat.color} shadow-lg`}>
                    <div className="text-white">
                      {stat.icon}
                    </div>
                  </div>
                  <div className={`flex items-center space-x-1 px-2 py-1 rounded-full text-xs font-semibold ${
                    stat.trend === 'up' ? 'bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-400' : 'bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400'
                  }`}>
                    {stat.trend === 'up' ? <FaArrowUp className="w-2 h-2" /> : <FaArrowDown className="w-2 h-2" />}
                    <span>{stat.percentage}</span>
                  </div>
                </div>
                
                <p className="text-gray-500 dark:text-gray-400 text-sm font-medium mb-2">
                  {stat.title}
                </p>
                <p className="text-2xl font-bold text-gray-800 dark:text-white">
                  {stat.value}
                </p>
                
                {/* Barra de progresso */}
                <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-1.5 mt-3">
                  <div className={`h-1.5 rounded-full ${stat.color} transition-all duration-1000`} 
                       style={{ width: `${Math.random() * 80 + 20}%` }}></div>
                </div>
              </div>
            </div>
          ))}

          {/* Card de Taxa de Conversão - ESPECIAL */}
          <div className="group relative bg-gradient-to-br from-orange-500 to-red-600 rounded-3xl p-6 shadow-2xl text-white hover:shadow-3xl transition-all duration-500 hover:scale-105 overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent"></div>
            <div className="relative z-10 text-center">
              <div className="w-12 h-12 bg-white/20 rounded-2xl flex items-center justify-center mx-auto mb-4 backdrop-blur-sm">
                <FaSync className="w-6 h-6" />
              </div>
              <p className="text-sm font-medium mb-2 opacity-90">Taxa de Conversão</p>
              <p className="text-3xl font-bold mb-2">68%</p>
              <p className="text-xs opacity-80 mb-4">Aprovações vs Total</p>
              <div className="w-full bg-white/30 rounded-full h-2">
                <div className="bg-white rounded-full h-2 transition-all duration-1000" style={{ width: '68%' }}></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
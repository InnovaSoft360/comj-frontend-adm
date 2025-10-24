export default function Applications() {
  return (
    // ✅ REMOVIDO: <DashboardLayout>
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl lg:text-3xl font-bold text-gray-800 dark:text-white">
            Candidaturas
          </h1>
          <p className="text-gray-600 dark:text-gray-300 mt-1">
            Gerencie as candidaturas recebidas
          </p>
        </div>
        <button className="bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-lg transition-colors">
          Nova Candidatura
        </button>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700">
        <div className="text-center py-8">
          <div className="w-16 h-16 bg-gray-200 dark:bg-gray-700 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-2xl">📋</span>
          </div>
          <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-2">
            Gestão de Candidaturas
          </h3>
          <p className="text-gray-600 dark:text-gray-400">
            Página em desenvolvimento
          </p>
        </div>
      </div>
    </div>
  );
}
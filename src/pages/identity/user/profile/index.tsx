export default function Profile() {
  return (
    // ✅ REMOVIDO: <DashboardLayout>
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl lg:text-3xl font-bold text-gray-800 dark:text-white">
          Meu Perfil
        </h1>
        <p className="text-gray-600 dark:text-gray-300 mt-1">
          Gerencie suas informações pessoais
        </p>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700">
        <div className="text-center py-8">
          <div className="w-20 h-20 bg-gradient-to-r from-orange-500 to-red-600 rounded-full flex items-center justify-center text-white text-2xl font-bold mx-auto mb-4">
            DN
          </div>
          <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-2">
            Domingos Nascimento
          </h3>
          <p className="text-gray-600 dark:text-gray-400 mb-4">
            Administrador • admin@osvaldomj.com
          </p>
          <p className="text-gray-500 dark:text-gray-400 text-sm">
            Página de perfil em desenvolvimento
          </p>
        </div>
      </div>
    </div>
  );
}
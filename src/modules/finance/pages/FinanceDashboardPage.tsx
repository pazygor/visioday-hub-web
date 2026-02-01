export const FinanceDashboardPage = () => {
  return (
    <div className="space-y-6">
      {/* Welcome Section */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">
          VisionDay Finance - Gestão Financeira 💰
        </h1>
        <p className="text-gray-600">
          Plataforma completa para controle e gestão financeira
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <h3 className="text-sm font-medium text-gray-600 mb-2">Receitas do Mês</h3>
          <p className="text-3xl font-bold text-green-600">R$ 0,00</p>
        </div>

        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <h3 className="text-sm font-medium text-gray-600 mb-2">Despesas do Mês</h3>
          <p className="text-3xl font-bold text-red-600">R$ 0,00</p>
        </div>

        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <h3 className="text-sm font-medium text-gray-600 mb-2">Saldo Atual</h3>
          <p className="text-3xl font-bold text-gray-900">R$ 0,00</p>
        </div>

        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <h3 className="text-sm font-medium text-gray-600 mb-2">Contas a Pagar</h3>
          <p className="text-3xl font-bold text-gray-900">0</p>
        </div>
      </div>

      {/* Info */}
      <div className="bg-green-50 border border-green-200 rounded-lg p-6">
        <p className="text-green-800 font-medium">
          🚀 Sistema VisionDay Finance em construção
        </p>
        <p className="text-green-600 text-sm mt-2">
          Esta é a estrutura base do sistema de gestão financeira.
        </p>
      </div>
    </div>
  )
}

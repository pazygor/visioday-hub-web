export const CashFlowPage = () => {
  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Fluxo de Caixa</h1>
        <p className="text-gray-600">Acompanhe entradas e saídas em tempo real</p>
      </div>

      {/* Cards de Resumo */}
      <div className="grid gap-6 md:grid-cols-4 mb-6">
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <h3 className="text-sm font-medium text-gray-600 mb-2">Saldo Atual</h3>
          <p className="text-2xl font-bold text-gray-900">R$ 45.230,00</p>
          <p className="text-sm text-green-600 mt-1">+12,5% vs mês anterior</p>
        </div>

        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <h3 className="text-sm font-medium text-gray-600 mb-2">Entradas</h3>
          <p className="text-2xl font-bold text-green-600">R$ 18.500,00</p>
          <p className="text-sm text-gray-500 mt-1">Este mês</p>
        </div>

        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <h3 className="text-sm font-medium text-gray-600 mb-2">Saídas</h3>
          <p className="text-2xl font-bold text-red-600">R$ 12.300,00</p>
          <p className="text-sm text-gray-500 mt-1">Este mês</p>
        </div>

        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <h3 className="text-sm font-medium text-gray-600 mb-2">Lucro Líquido</h3>
          <p className="text-2xl font-bold text-blue-600">R$ 6.200,00</p>
          <p className="text-sm text-gray-500 mt-1">Este mês</p>
        </div>
      </div>

      {/* Gráfico de Fluxo */}
      <div className="bg-white rounded-lg border border-gray-200 p-6 mb-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Evolução Mensal</h2>
        <div className="h-64 flex items-center justify-center bg-gray-50 rounded-lg">
          <p className="text-gray-500">Gráfico de fluxo de caixa será implementado aqui</p>
        </div>
      </div>

      {/* Próximas Movimentações */}
      <div className="grid gap-6 md:grid-cols-2">
        <div className="bg-white rounded-lg border border-gray-200">
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900">Próximas Entradas</h2>
          </div>
          <div className="p-6">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium text-gray-900">Cliente ABC LTDA</p>
                  <p className="text-sm text-gray-500">Vence em 3 dias</p>
                </div>
                <p className="text-lg font-semibold text-green-600">R$ 2.500,00</p>
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium text-gray-900">Cliente XYZ S.A.</p>
                  <p className="text-sm text-gray-500">Vence em 5 dias</p>
                </div>
                <p className="text-lg font-semibold text-green-600">R$ 1.800,00</p>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg border border-gray-200">
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900">Próximas Saídas</h2>
          </div>
          <div className="p-6">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium text-gray-900">Aluguel</p>
                  <p className="text-sm text-gray-500">Vence em 2 dias</p>
                </div>
                <p className="text-lg font-semibold text-red-600">R$ 3.200,00</p>
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium text-gray-900">Fornecedor Tech</p>
                  <p className="text-sm text-gray-500">Vence em 7 dias</p>
                </div>
                <p className="text-lg font-semibold text-red-600">R$ 950,00</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export const InvoicesPage = () => {
  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Faturas</h1>
        <p className="text-gray-600">Gerencie e acompanhe todas as faturas emitidas</p>
      </div>

      {/* Cards de Resumo */}
      <div className="grid gap-6 md:grid-cols-4 mb-6">
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <h3 className="text-sm font-medium text-gray-600 mb-2">Total Faturas</h3>
          <p className="text-2xl font-bold text-gray-900">127</p>
          <p className="text-sm text-gray-500 mt-1">Este ano</p>
        </div>

        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <h3 className="text-sm font-medium text-gray-600 mb-2">Pagas</h3>
          <p className="text-2xl font-bold text-green-600">98</p>
          <p className="text-sm text-green-600 mt-1">77% do total</p>
        </div>

        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <h3 className="text-sm font-medium text-gray-600 mb-2">Pendentes</h3>
          <p className="text-2xl font-bold text-orange-600">23</p>
          <p className="text-sm text-orange-600 mt-1">18% do total</p>
        </div>

        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <h3 className="text-sm font-medium text-gray-600 mb-2">Vencidas</h3>
          <p className="text-2xl font-bold text-red-600">6</p>
          <p className="text-sm text-red-600 mt-1">5% do total</p>
        </div>
      </div>

      {/* Filtros e Ações */}
      <div className="bg-white rounded-lg border border-gray-200 mb-6">
        <div className="p-6 border-b border-gray-200">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <input
                type="text"
                placeholder="Buscar fatura..."
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#9B0310] focus:border-transparent"
              />
              
              <select className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#9B0310] focus:border-transparent">
                <option>Todos os status</option>
                <option>Paga</option>
                <option>Pendente</option>
                <option>Vencida</option>
                <option>Cancelada</option>
              </select>

              <select className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#9B0310] focus:border-transparent">
                <option>Todos os períodos</option>
                <option>Este mês</option>
                <option>Último mês</option>
                <option>Este ano</option>
              </select>
            </div>

            <button className="px-4 py-2 bg-[#9B0310] text-white rounded-lg hover:bg-[#7A0209] transition-colors cursor-pointer">
              + Nova Fatura
            </button>
          </div>
        </div>

        {/* Tabela de Faturas */}
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Nº Fatura
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Cliente
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Data Emissão
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Vencimento
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Valor
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Ações
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {/* Fatura Exemplo 1 - Paga */}
              <tr className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className="text-sm font-medium text-gray-900">#2026-001</span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div>
                    <div className="text-sm font-medium text-gray-900">Tech Solutions LTDA</div>
                    <div className="text-sm text-gray-500">tech@solutions.com</div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  15/01/2026
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  25/01/2026
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className="text-sm font-semibold text-gray-900">R$ 2.500,00</span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className="px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                    Paga
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  <button className="text-[#9B0310] hover:text-[#7A0209] mr-3 cursor-pointer">Ver</button>
                  <button className="text-gray-600 hover:text-gray-900 cursor-pointer">Download</button>
                </td>
              </tr>

              {/* Fatura Exemplo 2 - Pendente */}
              <tr className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className="text-sm font-medium text-gray-900">#2026-002</span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div>
                    <div className="text-sm font-medium text-gray-900">ABC Comércio S.A.</div>
                    <div className="text-sm text-gray-500">contato@abc.com.br</div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  20/01/2026
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  05/02/2026
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className="text-sm font-semibold text-gray-900">R$ 1.800,00</span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className="px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-orange-100 text-orange-800">
                    Pendente
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  <button className="text-[#9B0310] hover:text-[#7A0209] mr-3 cursor-pointer">Ver</button>
                  <button className="text-gray-600 hover:text-gray-900 cursor-pointer">Download</button>
                </td>
              </tr>

              {/* Fatura Exemplo 3 - Vencida */}
              <tr className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className="text-sm font-medium text-gray-900">#2026-003</span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div>
                    <div className="text-sm font-medium text-gray-900">XYZ Serviços</div>
                    <div className="text-sm text-gray-500">xyz@servicos.com</div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  10/01/2026
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-red-500 font-medium">
                  20/01/2026
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className="text-sm font-semibold text-gray-900">R$ 950,00</span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className="px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-red-100 text-red-800">
                    Vencida
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  <button className="text-[#9B0310] hover:text-[#7A0209] mr-3 cursor-pointer">Ver</button>
                  <button className="text-gray-600 hover:text-gray-900 cursor-pointer">Download</button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* Paginação */}
        <div className="px-6 py-4 border-t border-gray-200 flex items-center justify-between">
          <div className="text-sm text-gray-500">
            Mostrando <span className="font-medium">1</span> a <span className="font-medium">3</span> de{' '}
            <span className="font-medium">127</span> resultados
          </div>
          <div className="flex items-center gap-2">
            <button className="px-3 py-1 border border-gray-300 rounded-md text-sm hover:bg-gray-50 cursor-pointer">
              Anterior
            </button>
            <button className="px-3 py-1 bg-[#9B0310] text-white rounded-md text-sm cursor-pointer">1</button>
            <button className="px-3 py-1 border border-gray-300 rounded-md text-sm hover:bg-gray-50 cursor-pointer">2</button>
            <button className="px-3 py-1 border border-gray-300 rounded-md text-sm hover:bg-gray-50 cursor-pointer">3</button>
            <button className="px-3 py-1 border border-gray-300 rounded-md text-sm hover:bg-gray-50 cursor-pointer">
              Próximo
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

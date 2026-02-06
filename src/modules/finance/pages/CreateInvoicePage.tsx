export const CreateInvoicePage = () => {
  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Gerar Nova Fatura</h1>
        <p className="text-gray-600">Preencha os dados para emitir uma nova fatura</p>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Formulário Principal */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-6">Dados da Fatura</h2>

            <div className="space-y-6">
              {/* Cliente */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Cliente *
                </label>
                <select className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#9B0310] focus:border-transparent">
                  <option value="">Selecione um cliente</option>
                  <option>Tech Solutions LTDA</option>
                  <option>ABC Comércio S.A.</option>
                  <option>XYZ Serviços</option>
                </select>
              </div>

              {/* Data de Emissão e Vencimento */}
              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Data de Emissão *
                  </label>
                  <input
                    type="date"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#9B0310] focus:border-transparent"
                    defaultValue={new Date().toISOString().split('T')[0]}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Data de Vencimento *
                  </label>
                  <input
                    type="date"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#9B0310] focus:border-transparent"
                  />
                </div>
              </div>

              {/* Descrição */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Descrição/Observações
                </label>
                <textarea
                  rows={3}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#9B0310] focus:border-transparent"
                  placeholder="Informações adicionais sobre a fatura..."
                />
              </div>

              {/* Itens da Fatura */}
              <div>
                <div className="flex items-center justify-between mb-4">
                  <label className="block text-sm font-medium text-gray-700">
                    Itens da Fatura *
                  </label>
                  <button className="text-sm text-[#9B0310] hover:text-[#7A0209] font-medium">
                    + Adicionar Item
                  </button>
                </div>

                <div className="border border-gray-200 rounded-lg overflow-hidden">
                  <table className="w-full">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                          Descrição
                        </th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase w-24">
                          Qtd
                        </th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase w-32">
                          Valor Unit.
                        </th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase w-32">
                          Total
                        </th>
                        <th className="px-4 py-3 w-12"></th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      <tr>
                        <td className="px-4 py-3">
                          <input
                            type="text"
                            placeholder="Descrição do item"
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#9B0310] focus:border-transparent"
                          />
                        </td>
                        <td className="px-4 py-3">
                          <input
                            type="number"
                            placeholder="1"
                            defaultValue="1"
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#9B0310] focus:border-transparent"
                          />
                        </td>
                        <td className="px-4 py-3">
                          <input
                            type="text"
                            placeholder="0,00"
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#9B0310] focus:border-transparent"
                          />
                        </td>
                        <td className="px-4 py-3">
                          <span className="text-sm font-medium text-gray-900">R$ 0,00</span>
                        </td>
                        <td className="px-4 py-3">
                          <button className="text-red-500 hover:text-red-700">
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                            </svg>
                          </button>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Forma de Pagamento */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Forma de Pagamento
                </label>
                <select className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#9B0310] focus:border-transparent">
                  <option>Boleto Bancário</option>
                  <option>PIX</option>
                  <option>Transferência Bancária</option>
                  <option>Cartão de Crédito</option>
                  <option>Cartão de Débito</option>
                </select>
              </div>
            </div>
          </div>
        </div>

        {/* Resumo Lateral */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-lg border border-gray-200 p-6 sticky top-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-6">Resumo</h2>

            <div className="space-y-4 mb-6">
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Subtotal</span>
                <span className="font-medium text-gray-900">R$ 0,00</span>
              </div>
              
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Desconto</span>
                <input
                  type="text"
                  placeholder="0,00"
                  className="w-24 px-2 py-1 text-right border border-gray-300 rounded focus:ring-2 focus:ring-[#9B0310] focus:border-transparent"
                />
              </div>

              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Acréscimo</span>
                <input
                  type="text"
                  placeholder="0,00"
                  className="w-24 px-2 py-1 text-right border border-gray-300 rounded focus:ring-2 focus:ring-[#9B0310] focus:border-transparent"
                />
              </div>

              <div className="pt-4 border-t border-gray-200">
                <div className="flex justify-between">
                  <span className="text-base font-semibold text-gray-900">Total</span>
                  <span className="text-xl font-bold text-[#9B0310]">R$ 0,00</span>
                </div>
              </div>
            </div>

            <div className="space-y-3">
              <button className="w-full px-4 py-3 bg-[#9B0310] text-white rounded-lg hover:bg-[#7A0209] transition-colors font-medium">
                Gerar Fatura
              </button>
              <button className="w-full px-4 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium">
                Cancelar
              </button>
            </div>

            <div className="mt-6 p-4 bg-blue-50 rounded-lg">
              <div className="flex gap-3">
                <svg className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <div>
                  <p className="text-sm font-medium text-blue-900">Dica</p>
                  <p className="text-sm text-blue-700 mt-1">
                    Após gerar a fatura, você poderá enviá-la por email ou fazer o download em PDF.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

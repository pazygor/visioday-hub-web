export const FinanceSettingsPage = () => {
  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Configurações Financeiras</h1>
        <p className="text-gray-600">Gerencie preferências e configurações do sistema</p>
      </div>

      <div className="grid gap-6">
        {/* Informações da Empresa */}
        <div className="bg-white rounded-lg border border-gray-200">
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900">Informações da Empresa</h2>
            <p className="text-sm text-gray-500 mt-1">Dados que aparecerão nas faturas e documentos</p>
          </div>
          <div className="p-6">
            <div className="grid gap-6 md:grid-cols-2">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Razão Social
                </label>
                <input
                  type="text"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#9B0310] focus:border-transparent"
                  placeholder="Nome da empresa"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  CNPJ
                </label>
                <input
                  type="text"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#9B0310] focus:border-transparent"
                  placeholder="00.000.000/0000-00"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email
                </label>
                <input
                  type="email"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#9B0310] focus:border-transparent"
                  placeholder="contato@empresa.com"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Telefone
                </label>
                <input
                  type="tel"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#9B0310] focus:border-transparent"
                  placeholder="(00) 0000-0000"
                />
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Endereço
                </label>
                <input
                  type="text"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#9B0310] focus:border-transparent"
                  placeholder="Rua, número, complemento, cidade - UF"
                />
              </div>
            </div>
            <div className="mt-6 flex justify-end">
              <button className="px-6 py-2 bg-[#9B0310] text-white rounded-lg hover:bg-[#7A0209] transition-colors">
                Salvar Informações
              </button>
            </div>
          </div>
        </div>

        {/* Dados Bancários */}
        <div className="bg-white rounded-lg border border-gray-200">
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900">Dados Bancários</h2>
            <p className="text-sm text-gray-500 mt-1">Configure suas contas bancárias</p>
          </div>
          <div className="p-6">
            <div className="grid gap-6 md:grid-cols-2">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Banco
                </label>
                <input
                  type="text"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#9B0310] focus:border-transparent"
                  placeholder="Nome do banco"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Agência
                </label>
                <input
                  type="text"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#9B0310] focus:border-transparent"
                  placeholder="0000"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Conta
                </label>
                <input
                  type="text"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#9B0310] focus:border-transparent"
                  placeholder="00000-0"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Tipo de Conta
                </label>
                <select className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#9B0310] focus:border-transparent">
                  <option>Conta Corrente</option>
                  <option>Conta Poupança</option>
                </select>
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Chave PIX
                </label>
                <input
                  type="text"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#9B0310] focus:border-transparent"
                  placeholder="email@exemplo.com ou CNPJ"
                />
              </div>
            </div>
            <div className="mt-6 flex justify-end">
              <button className="px-6 py-2 bg-[#9B0310] text-white rounded-lg hover:bg-[#7A0209] transition-colors">
                Salvar Dados Bancários
              </button>
            </div>
          </div>
        </div>

        {/* Preferências de Faturamento */}
        <div className="bg-white rounded-lg border border-gray-200">
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900">Preferências de Faturamento</h2>
            <p className="text-sm text-gray-500 mt-1">Configure como as faturas são geradas</p>
          </div>
          <div className="p-6">
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-medium text-gray-900">Numeração Automática</h3>
                  <p className="text-sm text-gray-500">Gerar números de fatura automaticamente</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input type="checkbox" className="sr-only peer" defaultChecked />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-red-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#9B0310]"></div>
                </label>
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-medium text-gray-900">Envio Automático por Email</h3>
                  <p className="text-sm text-gray-500">Enviar fatura automaticamente após emissão</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input type="checkbox" className="sr-only peer" />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-red-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#9B0310]"></div>
                </label>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Prazo Padrão de Vencimento (dias)
                </label>
                <input
                  type="number"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#9B0310] focus:border-transparent"
                  defaultValue="30"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Observações Padrão nas Faturas
                </label>
                <textarea
                  rows={3}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#9B0310] focus:border-transparent"
                  placeholder="Texto que aparecerá em todas as faturas..."
                />
              </div>
            </div>
            <div className="mt-6 flex justify-end">
              <button className="px-6 py-2 bg-[#9B0310] text-white rounded-lg hover:bg-[#7A0209] transition-colors">
                Salvar Preferências
              </button>
            </div>
          </div>
        </div>

        {/* Notificações */}
        <div className="bg-white rounded-lg border border-gray-200">
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900">Notificações</h2>
            <p className="text-sm text-gray-500 mt-1">Configure quando você quer receber alertas</p>
          </div>
          <div className="p-6">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-medium text-gray-900">Contas a vencer</h3>
                  <p className="text-sm text-gray-500">Alertar X dias antes do vencimento</p>
                </div>
                <input
                  type="number"
                  className="w-20 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#9B0310] focus:border-transparent text-center"
                  defaultValue="3"
                />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-medium text-gray-900">Contas vencidas</h3>
                  <p className="text-sm text-gray-500">Notificar sobre contas em atraso</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input type="checkbox" className="sr-only peer" defaultChecked />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-red-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#9B0310]"></div>
                </label>
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-medium text-gray-900">Pagamentos recebidos</h3>
                  <p className="text-sm text-gray-500">Notificar quando receber um pagamento</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input type="checkbox" className="sr-only peer" defaultChecked />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-red-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#9B0310]"></div>
                </label>
              </div>
            </div>
            <div className="mt-6 flex justify-end">
              <button className="px-6 py-2 bg-[#9B0310] text-white rounded-lg hover:bg-[#7A0209] transition-colors">
                Salvar Notificações
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

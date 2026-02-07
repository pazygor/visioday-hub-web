import { useState, useEffect } from 'react';
import { Plus, Search, Edit2, Trash2, Mail, Phone, FileText, AlertCircle } from 'lucide-react';
import { financeApi, type FinanceCliente } from '@/services/api/finance.api';
import { ClientModal } from '@/modules/finance/components/ClientModal';
import toast from 'react-hot-toast';

export const ClientsPage = () => {
  const [clients, setClients] = useState<FinanceCliente[]>([]);
  const [filteredClients, setFilteredClients] = useState<FinanceCliente[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedClient, setSelectedClient] = useState<FinanceCliente | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [showInactive, setShowInactive] = useState(false);

  const fetchClients = async () => {
    try {
      setIsLoading(true);
      const data = await financeApi.clientes.list(showInactive);
      setClients(data);
      setFilteredClients(data);
    } catch (error: any) {
      toast.error(error.message || 'Erro ao carregar clientes');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchClients();
  }, [showInactive]);

  useEffect(() => {
    if (searchTerm.trim() === '') {
      setFilteredClients(clients);
    } else {
      const term = searchTerm.toLowerCase();
      const filtered = clients.filter(
        (client) =>
          client.nome.toLowerCase().includes(term) ||
          client.email?.toLowerCase().includes(term) ||
          client.cpfCnpj?.includes(term) ||
          client.telefone?.includes(term)
      );
      setFilteredClients(filtered);
    }
  }, [searchTerm, clients]);

  const handleCreate = () => {
    setSelectedClient(null);
    setIsModalOpen(true);
  };

  const handleEdit = (client: FinanceCliente) => {
    setSelectedClient(client);
    setIsModalOpen(true);
  };

  const handleDelete = async (client: FinanceCliente) => {
    if (!confirm(`Tem certeza que deseja excluir o cliente "${client.nome}"?`)) {
      return;
    }

    try {
      await financeApi.clientes.delete(client.id);
      toast.success('Cliente excluído com sucesso!');
      fetchClients();
    } catch (error: any) {
      toast.error(error.message || 'Erro ao excluir cliente');
    }
  };

  const handleSave = async () => {
    await fetchClients();
    setIsModalOpen(false);
    setSelectedClient(null);
  };

  const activeCount = clients.filter((c) => c.ativo).length;
  const inactiveCount = clients.filter((c) => !c.ativo).length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Clientes</h1>
          <p className="text-sm text-gray-500 mt-1">
            Gerencie seus clientes do Finance
          </p>
        </div>
        <button
          onClick={handleCreate}
          className="inline-flex items-center gap-2 px-4 py-2 bg-[#9B0310] text-white rounded-lg hover:bg-[#7A0209] transition-colors cursor-pointer"
        >
          <Plus className="w-5 h-5" />
          Novo Cliente
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white p-4 rounded-lg border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Total de Clientes</p>
              <p className="text-2xl font-bold text-gray-900">{clients.length}</p>
            </div>
            <FileText className="w-8 h-8 text-gray-400" />
          </div>
        </div>
        <div className="bg-white p-4 rounded-lg border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Clientes Ativos</p>
              <p className="text-2xl font-bold text-green-600">{activeCount}</p>
            </div>
            <FileText className="w-8 h-8 text-green-400" />
          </div>
        </div>
        <div className="bg-white p-4 rounded-lg border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Clientes Inativos</p>
              <p className="text-2xl font-bold text-gray-400">{inactiveCount}</p>
            </div>
            <FileText className="w-8 h-8 text-gray-300" />
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white p-4 rounded-lg border border-gray-200 space-y-4">
        <div className="flex flex-col sm:flex-row gap-4">
          {/* Search */}
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Buscar por nome, email, CPF/CNPJ ou telefone..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#9B0310] focus:border-transparent"
            />
          </div>

          {/* Toggle Inativos */}
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={showInactive}
              onChange={(e) => setShowInactive(e.target.checked)}
              className="w-4 h-4 text-[#9B0310] border-gray-300 rounded focus:ring-[#9B0310]"
            />
            <span className="text-sm text-gray-700">Mostrar inativos</span>
          </label>
        </div>

        {/* Results count */}
        <div className="text-sm text-gray-500">
          Exibindo {filteredClients.length} de {clients.length} clientes
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
        {isLoading ? (
          <div className="p-12 text-center">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-[#9B0310]"></div>
            <p className="mt-2 text-sm text-gray-500">Carregando clientes...</p>
          </div>
        ) : filteredClients.length === 0 ? (
          <div className="p-12 text-center">
            <AlertCircle className="w-12 h-12 text-gray-400 mx-auto mb-3" />
            <p className="text-gray-500">
              {searchTerm ? 'Nenhum cliente encontrado' : 'Nenhum cliente cadastrado'}
            </p>
            {!searchTerm && (
              <button
                onClick={handleCreate}
                className="mt-4 text-[#9B0310] hover:text-[#7A0209] font-medium text-sm cursor-pointer"
              >
                Cadastrar primeiro cliente
              </button>
            )}
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Cliente
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    CPF/CNPJ
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Contato
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Ações
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredClients.map((client) => (
                  <tr key={client.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="shrink-0 h-10 w-10 bg-[#9B0310] rounded-full flex items-center justify-center">
                          <span className="text-white font-medium text-sm">
                            {client.nome.charAt(0).toUpperCase()}
                          </span>
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">{client.nome}</div>
                          {client.email && (
                            <div className="text-sm text-gray-500 flex items-center gap-1 mt-1">
                              <Mail className="w-3 h-3" />
                              {client.email}
                            </div>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{client.cpfCnpj || '-'}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {client.telefone ? (
                        <div className="text-sm text-gray-900 flex items-center gap-1">
                          <Phone className="w-3 h-3 text-gray-400" />
                          {client.telefone}
                        </div>
                      ) : (
                        <span className="text-sm text-gray-400">-</span>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                          client.ativo
                            ? 'bg-green-100 text-green-800'
                            : 'bg-gray-100 text-gray-800'
                        }`}
                      >
                        {client.ativo ? 'Ativo' : 'Inativo'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => handleEdit(client)}
                          className="text-blue-600 hover:text-blue-900 p-1 hover:bg-blue-50 rounded transition-colors cursor-pointer"
                          title="Editar"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(client)}
                          className="text-red-600 hover:text-red-900 p-1 hover:bg-red-50 rounded transition-colors cursor-pointer"
                          title="Excluir"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Modal */}
      {isModalOpen && (
        <ClientModal
          client={selectedClient}
          isOpen={isModalOpen}
          onClose={() => {
            setIsModalOpen(false);
            setSelectedClient(null);
          }}
          onSave={handleSave}
        />
      )}
    </div>
  );
};

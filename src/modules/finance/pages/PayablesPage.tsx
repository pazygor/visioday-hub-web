import { useState, useEffect, useContext } from 'react';
import {
  Plus,
  Filter,
  Search,
  DollarSign,
  Edit,
  Trash2,
  RefreshCw,
} from 'lucide-react';
import {
  getContasPagar,
  getResumoContasPagar,
  deleteContaPagar,
  getCategorias,
  getFornecedores,
  type FinanceContaPagar,
  type FinanceCategoria,
  type FinanceFornecedor,
} from '../../../services/api/finance.api';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { PayableModal } from '../components/PayableModal';
import { PayablePaymentModal } from '../components/PayablePaymentModal';
import { ToastContext } from '../components/FinanceLayout';
import { ConfirmDialog, confirmDialog } from 'primereact/confirmdialog';

export const PayablesPage = () => {
  const toast = useContext(ToastContext);
  const [contas, setContas] = useState<FinanceContaPagar[]>([]);
  const [contasFiltradas, setContasFiltradas] = useState<FinanceContaPagar[]>([]);
  const [loading, setLoading] = useState(true);
  const [resumo, setResumo] = useState({
    totalPagar: 0,
    totalPago: 0,
    totalPendente: 0,
    totalVencidas: 0,
  });

  // Modals
  const [isPayableModalOpen, setIsPayableModalOpen] = useState(false);
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
  const [selectedPayable, setSelectedPayable] = useState<FinanceContaPagar | null>(null);

  // Filtros
  const [showFilters, setShowFilters] = useState(false);
  const [filtros, setFiltros] = useState({
    busca: '',
    status: '',
    fornecedorId: '',
    categoriaId: '',
    dataInicio: '',
    dataFim: '',
  });

  // Dados auxiliares
  const [categorias, setCategorias] = useState<FinanceCategoria[]>([]);
  const [fornecedores, setFornecedores] = useState<FinanceFornecedor[]>([]);

  useEffect(() => {
    carregarDados();
    carregarDadosAuxiliares();
  }, []);

  useEffect(() => {
    aplicarFiltros();
  }, [contas, filtros]);

  const carregarDados = async () => {
    try {
      setLoading(true);
      const [contasRes, resumoRes] = await Promise.all([
        getContasPagar(),
        getResumoContasPagar(),
      ]);
      setContas(contasRes);
      setResumo(resumoRes);
    } catch (error) {
      console.error('Erro ao carregar dados:', error);
      toast?.current?.show({ severity: 'error', summary: 'Erro', detail: 'Erro ao carregar contas a pagar', life: 3000 });
    } finally {
      setLoading(false);
    }
  };

  const carregarDadosAuxiliares = async () => {
    try {
      const [categoriasRes, fornecedoresRes] = await Promise.all([
        getCategorias('DESPESA'),
        getFornecedores(),
      ]);
      setCategorias(categoriasRes);
      setFornecedores(fornecedoresRes);
    } catch (error) {
      console.error('Erro ao carregar dados auxiliares:', error);
    }
  };

  const aplicarFiltros = () => {
    let resultado = [...contas];

    // Filtro de busca
    if (filtros.busca) {
      const busca = filtros.busca.toLowerCase();
      resultado = resultado.filter(
        (conta) =>
          conta.descricao.toLowerCase().includes(busca) ||
          conta.fornecedor?.nome.toLowerCase().includes(busca)
      );
    }

    // Filtro de status
    if (filtros.status) {
      resultado = resultado.filter((conta) => conta.status === filtros.status);
    }

    // Filtro de fornecedor
    if (filtros.fornecedorId) {
      resultado = resultado.filter(
        (conta) => conta.fornecedorId?.toString() === filtros.fornecedorId
      );
    }

    // Filtro de categoria
    if (filtros.categoriaId) {
      resultado = resultado.filter(
        (conta) => conta.categoriaId?.toString() === filtros.categoriaId
      );
    }

    // Filtro de data
    if (filtros.dataInicio) {
      resultado = resultado.filter(
        (conta) => new Date(conta.dataVencimento) >= new Date(filtros.dataInicio)
      );
    }
    if (filtros.dataFim) {
      resultado = resultado.filter(
        (conta) => new Date(conta.dataVencimento) <= new Date(filtros.dataFim)
      );
    }

    setContasFiltradas(resultado);
  };

  const limparFiltros = () => {
    setFiltros({
      busca: '',
      status: '',
      fornecedorId: '',
      categoriaId: '',
      dataInicio: '',
      dataFim: '',
    });
  };

  const handleNovaConta = () => {
    setSelectedPayable(null);
    setIsPayableModalOpen(true);
  };

  const handleEditarConta = (conta: FinanceContaPagar) => {
    setSelectedPayable(conta);
    setIsPayableModalOpen(true);
  };

  const handleRegistrarPagamento = (conta: FinanceContaPagar) => {
    setSelectedPayable(conta);
    setIsPaymentModalOpen(true);
  };

  const handleExcluir = (id: number, descricao: string) => {
    confirmDialog({
      message: `Tem certeza que deseja excluir a conta "${descricao}"? Esta ação não pode ser desfeita.`,
      header: 'Confirmar Exclusão',
      icon: 'pi pi-exclamation-triangle',
      defaultFocus: 'reject',
      acceptLabel: 'Sim, excluir',
      rejectLabel: 'Cancelar',
      acceptClassName: 'p-button-danger',
      accept: async () => {
        try {
          await deleteContaPagar(id);
          toast?.current?.show({ severity: 'success', summary: 'Sucesso', detail: 'Conta a pagar excluída com sucesso', life: 3000 });
          carregarDados();
        } catch (error) {
          console.error('Erro ao excluir conta:', error);
          toast?.current?.show({ severity: 'error', summary: 'Erro', detail: 'Erro ao excluir conta a pagar', life: 3000 });
        }
      },
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'PAGA':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'PENDENTE':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'VENCIDA':
        return 'bg-red-100 text-red-800 border-red-200';
      case 'PARCIALMENTE_PAGA':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getStatusLabel = (status: string) => {
    const labels: Record<string, string> = {
      PAGA: 'Paga',
      PENDENTE: 'Pendente',
      VENCIDA: 'Vencida',
      PARCIALMENTE_PAGA: 'Parcial',
      CANCELADA: 'Cancelada',
    };
    return labels[status] || status;
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Contas a Pagar</h1>
          <p className="text-gray-600 mt-1">Gerencie suas despesas e contas a pagar</p>
        </div>
        <div className="flex gap-3">
          <button
            onClick={() => carregarDados()}
            className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors flex items-center gap-2 cursor-pointer"
          >
            <RefreshCw className="w-4 h-4" />
            Atualizar
          </button>
          <button
            onClick={handleNovaConta}
            className="px-4 py-2 bg-[#9B0310] text-white rounded-lg hover:bg-[#7A0209] transition-colors flex items-center gap-2 cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            Nova Despesa
          </button>
        </div>
      </div>

      {/* Cards de Resumo */}
      <div className="grid gap-6 md:grid-cols-4">
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-sm font-medium text-gray-600">Total a Pagar</h3>
            <DollarSign className="w-5 h-5 text-blue-600" />
          </div>
          <p className="text-2xl font-bold text-gray-900">
            R$ {resumo.totalPagar.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </p>
        </div>

        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-sm font-medium text-gray-600">Total Pago</h3>
            <DollarSign className="w-5 h-5 text-green-600" />
          </div>
          <p className="text-2xl font-bold text-green-600">
            R$ {resumo.totalPago.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </p>
        </div>

        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-sm font-medium text-gray-600">Pendente</h3>
            <DollarSign className="w-5 h-5 text-orange-600" />
          </div>
          <p className="text-2xl font-bold text-orange-600">
            R$ {resumo.totalPendente.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </p>
        </div>

        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-sm font-medium text-gray-600">Vencidas</h3>
            <DollarSign className="w-5 h-5 text-red-600" />
          </div>
          <p className="text-2xl font-bold text-red-600">
            R$ {resumo.totalVencidas.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </p>
        </div>
      </div>

      {/* Barra de Busca e Filtros */}
      <div className="bg-white rounded-lg border border-gray-200 p-4">
        <div className="flex items-center gap-3">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Buscar por descrição ou fornecedor..."
              value={filtros.busca}
              onChange={(e) => setFiltros({ ...filtros, busca: e.target.value })}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
            />
          </div>
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors flex items-center gap-2"
          >
            <Filter className="w-4 h-4" />
            Filtros
          </button>
        </div>

        {/* Filtros Expandidos */}
        {showFilters && (
          <div className="grid grid-cols-4 gap-4 mt-4 pt-4 border-t">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
              <select
                value={filtros.status}
                onChange={(e) => setFiltros({ ...filtros, status: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500"
              >
                <option value="">Todos</option>
                <option value="PENDENTE">Pendente</option>
                <option value="PAGA">Paga</option>
                <option value="VENCIDA">Vencida</option>
                <option value="PARCIALMENTE_PAGA">Parcial</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Fornecedor</label>
              <select
                value={filtros.fornecedorId}
                onChange={(e) => setFiltros({ ...filtros, fornecedorId: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500"
              >
                <option value="">Todos</option>
                {fornecedores.map((fornecedor) => (
                  <option key={fornecedor.id} value={fornecedor.id}>
                    {fornecedor.nome}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Categoria</label>
              <select
                value={filtros.categoriaId}
                onChange={(e) => setFiltros({ ...filtros, categoriaId: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500"
              >
                <option value="">Todas</option>
                {categorias.map((categoria) => (
                  <option key={categoria.id} value={categoria.id}>
                    {categoria.nome}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex items-end gap-2">
              <button
                onClick={limparFiltros}
                className="w-full px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors border border-gray-300 rounded-lg"
              >
                Limpar
              </button>
            </div>

            <div className="col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">Data Inicial</label>
              <input
                type="date"
                value={filtros.dataInicio}
                onChange={(e) => setFiltros({ ...filtros, dataInicio: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500"
              />
            </div>

            <div className="col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">Data Final</label>
              <input
                type="date"
                value={filtros.dataFim}
                onChange={(e) => setFiltros({ ...filtros, dataFim: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500"
              />
            </div>
          </div>
        )}
      </div>

      {/* Tabela */}
      <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Descrição
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Fornecedor
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Vencimento
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Valor Total
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Ações
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {loading ? (
                <tr>
                  <td colSpan={6} className="px-6 py-8 text-center text-gray-500">
                    Carregando...
                  </td>
                </tr>
              ) : contasFiltradas.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-8 text-center text-gray-500">
                    Nenhuma conta a pagar encontrada
                  </td>
                </tr>
              ) : (
                contasFiltradas.map((conta) => (
                  <tr key={conta.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4">
                      <div>
                        <p className="font-medium text-gray-900">{conta.descricao}</p>
                        {conta.categoria && (
                          <p className="text-sm text-gray-500">{conta.categoria.nome}</p>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-900">
                      {conta.fornecedor?.nome || '-'}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-900">
                      {format(new Date(conta.dataVencimento), 'dd/MM/yyyy', { locale: ptBR })}
                    </td>
                    <td className="px-6 py-4 text-sm font-medium text-gray-900">
                      R$ {conta.valorTotal.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`inline-flex px-2.5 py-0.5 rounded-full text-xs font-medium border ${getStatusColor(conta.status)}`}
                      >
                        {getStatusLabel(conta.status)}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        {conta.status !== 'PAGA' && (
                          <button
                            onClick={() => handleRegistrarPagamento(conta)}
                            className="p-1.5 text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                            title="Registrar Pagamento"
                          >
                            <DollarSign className="w-4 h-4" />
                          </button>
                        )}
                        <button
                          onClick={() => handleEditarConta(conta)}
                          className="p-1.5 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                          title="Editar"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleExcluir(conta.id, conta.descricao)}
                          className="p-1.5 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                          title="Excluir"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modals */}
      <ConfirmDialog />
      
      <PayableModal
        isOpen={isPayableModalOpen}
        onClose={() => {
          setIsPayableModalOpen(false);
          setSelectedPayable(null);
        }}
        onSuccess={carregarDados}
        payable={selectedPayable}
      />

      <PayablePaymentModal
        isOpen={isPaymentModalOpen}
        onClose={() => {
          setIsPaymentModalOpen(false);
          setSelectedPayable(null);
        }}
        onSuccess={carregarDados}
        payable={selectedPayable}
      />
    </div>
  );
}

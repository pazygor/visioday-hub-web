import { useState, useEffect } from 'react';
import {
  Plus,
  Filter,
  Search,
  DollarSign,
  Calendar,
  Edit,
  Trash2,
  RefreshCw,
} from 'lucide-react';
import {
  getContasReceber,
  getResumoContasReceber,
  deleteContaReceber,
  getCategorias,
  getClientes,
  type FinanceContaReceber,
  type FinanceCategoria,
  type FinanceCliente,
} from '../../../services/api/finance.api';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { ReceivableModal } from '../components/ReceivableModal';
import { PaymentModal } from '../components/PaymentModal';

export const ReceivablesPage = () => {
  const [contas, setContas] = useState<FinanceContaReceber[]>([]);
  const [contasFiltradas, setContasFiltradas] = useState<FinanceContaReceber[]>([]);
  const [loading, setLoading] = useState(true);
  const [resumo, setResumo] = useState({
    totalMes: 0,
    totalPago: 0,
    totalPendente: 0,
    totalVencido: 0,
  });

  // Modals
  const [isReceivableModalOpen, setIsReceivableModalOpen] = useState(false);
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
  const [selectedReceivable, setSelectedReceivable] = useState<FinanceContaReceber | null>(null);

  // Filtros
  const [showFilters, setShowFilters] = useState(false);
  const [filtros, setFiltros] = useState({
    busca: '',
    status: '',
    clienteId: '',
    categoriaId: '',
    dataInicio: '',
    dataFim: '',
  });

  // Dados auxiliares
  const [categorias, setCategorias] = useState<FinanceCategoria[]>([]);
  const [clientes, setClientes] = useState<FinanceCliente[]>([]);

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
        getContasReceber(),
        getResumoContasReceber(),
      ]);
      setContas(contasRes);
      setResumo(resumoRes);
    } catch (error) {
      console.error('Erro ao carregar dados:', error);
      alert('Erro ao carregar contas a receber');
    } finally {
      setLoading(false);
    }
  };

  const carregarDadosAuxiliares = async () => {
    try {
      const [categoriasRes, clientesRes] = await Promise.all([
        getCategorias('RECEITA'),
        getClientes(),
      ]);
      setCategorias(categoriasRes);
      setClientes(clientesRes);
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
          conta.cliente?.nome.toLowerCase().includes(busca)
      );
    }

    // Filtro de status
    if (filtros.status) {
      resultado = resultado.filter((conta) => conta.status === filtros.status);
    }

    // Filtro de cliente
    if (filtros.clienteId) {
      resultado = resultado.filter(
        (conta) => conta.clienteId?.toString() === filtros.clienteId
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
      clienteId: '',
      categoriaId: '',
      dataInicio: '',
      dataFim: '',
    });
  };

  const handleNovaConta = () => {
    setSelectedReceivable(null);
    setIsReceivableModalOpen(true);
  };

  const handleEditarConta = (conta: FinanceContaReceber) => {
    setSelectedReceivable(conta);
    setIsReceivableModalOpen(true);
  };

  const handleRegistrarPagamento = (conta: FinanceContaReceber) => {
    setSelectedReceivable(conta);
    setIsPaymentModalOpen(true);
  };

  const handleExcluir = async (id: number, descricao: string) => {
    if (!confirm(`Deseja realmente excluir a conta "${descricao}"?`)) return;

    try {
      await deleteContaReceber(id);
      carregarDados();
    } catch (error) {
      console.error('Erro ao excluir conta:', error);
      alert('Erro ao excluir conta a receber');
    }
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
    };
    return labels[status] || status;
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(value);
  };

  const formatDate = (date: string) => {
    return format(new Date(date), 'dd/MM/yyyy', { locale: ptBR });
  };

  const contasAtivas = filtros.status || filtros.busca || filtros.clienteId || filtros.categoriaId || filtros.dataInicio || filtros.dataFim;

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Contas a Receber</h1>
          <p className="text-gray-600 mt-1">Gerencie suas receitas e valores a receber</p>
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
            className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center gap-2 cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            Nova Conta
          </button>
        </div>
      </div>

      {/* Cards de Resumo */}
      <div className="grid gap-6 md:grid-cols-4">
        <div className="bg-white rounded-lg border border-gray-200 p-6 hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-sm font-medium text-gray-600">Total a Receber</h3>
            <div className="p-2 bg-green-50 rounded-lg">
              <DollarSign className="w-5 h-5 text-green-600" />
            </div>
          </div>
          <p className="text-2xl font-bold text-gray-900">{formatCurrency(resumo.totalMes)}</p>
          <p className="text-sm text-gray-500 mt-1">Total do mês</p>
        </div>

        <div className="bg-white rounded-lg border border-gray-200 p-6 hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-sm font-medium text-gray-600">Recebido</h3>
            <div className="p-2 bg-blue-50 rounded-lg">
              <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
          </div>
          <p className="text-2xl font-bold text-gray-900">{formatCurrency(resumo.totalPago)}</p>
          <p className="text-sm text-gray-500 mt-1">Recebido no mês</p>
        </div>

        <div className="bg-white rounded-lg border border-gray-200 p-6 hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-sm font-medium text-gray-600">Pendente</h3>
            <div className="p-2 bg-yellow-50 rounded-lg">
              <Calendar className="w-5 h-5 text-yellow-600" />
            </div>
          </div>
          <p className="text-2xl font-bold text-gray-900">{formatCurrency(resumo.totalPendente)}</p>
          <p className="text-sm text-gray-500 mt-1">A receber</p>
        </div>

        <div className="bg-white rounded-lg border border-gray-200 p-6 hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-sm font-medium text-gray-600">Vencidas</h3>
            <div className="p-2 bg-red-50 rounded-lg">
              <svg className="w-5 h-5 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
          </div>
          <p className="text-2xl font-bold text-gray-900">{formatCurrency(resumo.totalVencido)}</p>
          <p className="text-sm text-gray-500 mt-1">Atrasadas</p>
        </div>
      </div>

      {/* Filtros e Busca */}
      <div className="bg-white rounded-lg border border-gray-200 p-4">
        <div className="flex gap-4 items-center flex-wrap">
          {/* Busca */}
          <div className="flex-1 min-w-[250px]">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Buscar por descrição ou cliente..."
                value={filtros.busca}
                onChange={(e) => setFiltros({ ...filtros, busca: e.target.value })}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              />
            </div>
          </div>

          {/* Botão de Filtros */}
          <button
            onClick={() => setShowFilters(!showFilters)}
            className={`px-4 py-2 border rounded-lg transition-colors flex items-center gap-2 cursor-pointer ${
              contasAtivas
                ? 'border-green-600 bg-green-50 text-green-700'
                : 'border-gray-300 text-gray-700 hover:bg-gray-50'
            }`}
          >
            <Filter className="w-4 h-4" />
            Filtros
            {contasAtivas && <span className="px-2 py-0.5 bg-green-600 text-white text-xs rounded-full">●</span>}
          </button>

          {contasAtivas && (
            <button
              onClick={limparFiltros}
              className="px-4 py-2 text-gray-600 hover:text-gray-900 transition-colors cursor-pointer"
            >
              Limpar filtros
            </button>
          )}
        </div>

        {/* Filtros Expandidos */}
        {showFilters && (
          <div className="mt-4 pt-4 border-t border-gray-200 grid grid-cols-1 md:grid-cols-4 gap-4">
            {/* Status */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
              <select
                value={filtros.status}
                onChange={(e) => setFiltros({ ...filtros, status: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              >
                <option value="">Todos</option>
                <option value="PENDENTE">Pendente</option>
                <option value="PAGA">Paga</option>
                <option value="VENCIDA">Vencida</option>
                <option value="PARCIALMENTE_PAGA">Parcial</option>
              </select>
            </div>

            {/* Cliente */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Cliente</label>
              <select
                value={filtros.clienteId}
                onChange={(e) => setFiltros({ ...filtros, clienteId: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              >
                <option value="">Todos</option>
                {clientes.map((cliente) => (
                  <option key={cliente.id} value={cliente.id}>
                    {cliente.nome}
                  </option>
                ))}
              </select>
            </div>

            {/* Categoria */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Categoria</label>
              <select
                value={filtros.categoriaId}
                onChange={(e) => setFiltros({ ...filtros, categoriaId: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              >
                <option value="">Todas</option>
                {categorias.map((categoria) => (
                  <option key={categoria.id} value={categoria.id}>
                    {categoria.nome}
                  </option>
                ))}
              </select>
            </div>

            {/* Data Início */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Data Início</label>
              <input
                type="date"
                value={filtros.dataInicio}
                onChange={(e) => setFiltros({ ...filtros, dataInicio: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
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
                  Cliente
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Descrição
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Categoria
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
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Ações
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {loading ? (
                <tr>
                  <td colSpan={7} className="px-6 py-12 text-center">
                    <div className="flex items-center justify-center">
                      <RefreshCw className="w-6 h-6 text-gray-400 animate-spin mr-2" />
                      <span className="text-gray-500">Carregando...</span>
                    </div>
                  </td>
                </tr>
              ) : contasFiltradas.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-6 py-12 text-center">
                    <div className="flex flex-col items-center">
                      <DollarSign className="w-12 h-12 text-gray-300 mb-2" />
                      <p className="text-gray-500">Nenhuma conta encontrada</p>
                      {contasAtivas && (
                        <button
                          onClick={limparFiltros}
                          className="mt-2 text-green-600 hover:text-green-700 cursor-pointer"
                        >
                          Limpar filtros
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ) : (
                contasFiltradas.map((conta) => (
                  <tr key={conta.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">
                        {conta.cliente?.nome || (
                          <span className="text-gray-400">Sem cliente</span>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-gray-900">{conta.descricao}</div>
                      {conta.numeroParcelas > 1 && (
                        <div className="text-xs text-gray-500 mt-1">
                          {conta.parcelas?.filter((p) => p.status === 'PAGA').length || 0}/
                          {conta.numeroParcelas} parcelas pagas
                        </div>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {conta.categoria ? (
                        <span
                          className="inline-flex items-center px-2 py-1 rounded text-xs font-medium"
                          style={{
                            backgroundColor: `${conta.categoria.cor}20`,
                            color: conta.categoria.cor,
                          }}
                        >
                          {conta.categoria.nome}
                        </span>
                      ) : (
                        <span className="text-gray-400 text-sm">-</span>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {formatDate(conta.dataVencimento)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">
                        {formatCurrency(conta.valorTotal)}
                      </div>
                      {conta.valorPago > 0 && (
                        <div className="text-xs text-green-600">
                          Pago: {formatCurrency(conta.valorPago)}
                        </div>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full border ${getStatusColor(
                          conta.status
                        )}`}
                      >
                        {getStatusLabel(conta.status)}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex justify-end gap-2">
                        {conta.status !== 'PAGA' && (
                          <button
                            onClick={() => handleRegistrarPagamento(conta)}
                            className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors cursor-pointer"
                            title="Registrar pagamento"
                          >
                            <DollarSign className="w-4 h-4" />
                          </button>
                        )}
                        <button
                          onClick={() => handleEditarConta(conta)}
                          className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors cursor-pointer"
                          title="Editar"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleExcluir(conta.id, conta.descricao)}
                          className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors cursor-pointer"
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

        {/* Footer com total de registros */}
        {contasFiltradas.length > 0 && (
          <div className="px-6 py-3 bg-gray-50 border-t border-gray-200">
            <p className="text-sm text-gray-500">
              Exibindo <span className="font-medium text-gray-900">{contasFiltradas.length}</span>{' '}
              {contasFiltradas.length === 1 ? 'resultado' : 'resultados'}
              {contas.length !== contasFiltradas.length && (
                <span> de <span className="font-medium text-gray-900">{contas.length}</span> total</span>
              )}
            </p>
          </div>
        )}
      </div>

      {/* Modals */}
      <ReceivableModal
        isOpen={isReceivableModalOpen}
        onClose={() => {
          setIsReceivableModalOpen(false);
          setSelectedReceivable(null);
        }}
        onSuccess={carregarDados}
        receivable={selectedReceivable}
      />

      <PaymentModal
        isOpen={isPaymentModalOpen}
        onClose={() => {
          setIsPaymentModalOpen(false);
          setSelectedReceivable(null);
        }}
        onSuccess={carregarDados}
        receivable={selectedReceivable}
      />
    </div>
  );
};

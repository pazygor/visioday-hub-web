import { useState, useEffect } from 'react';
import {
  getContasReceber,
  getResumoContasReceber,
  registrarPagamentoReceber,
  deleteContaReceber,
  type FinanceContaReceber,
} from '../../../services/api/finance.api';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

export const ReceivablesPage = () => {
  const [contas, setContas] = useState<FinanceContaReceber[]>([]);
  const [loading, setLoading] = useState(true);
  const [resumo, setResumo] = useState({
    totalReceber: 0,
    totalRecebido: 0,
    totalPendente: 0,
    totalVencidas: 0,
  });

  useEffect(() => {
    carregarDados();
  }, []);

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
    } finally {
      setLoading(false);
    }
  };

  const handleRegistrarPagamento = async (id: number) => {
    const valor = prompt('Digite o valor do pagamento:');
    if (!valor) return;

    try {
      await registrarPagamentoReceber(id, {
        valor: parseFloat(valor),
        dataPagamento: new Date().toISOString(),
      });
      carregarDados();
      alert('Pagamento registrado com sucesso!');
    } catch (error) {
      console.error('Erro ao registrar pagamento:', error);
      alert('Erro ao registrar pagamento');
    }
  };

  const handleExcluir = async (id: number) => {
    if (!confirm('Deseja realmente excluir esta conta?')) return;

    try {
      await deleteContaReceber(id);
      carregarDados();
    } catch (error) {
      console.error('Erro ao excluir conta:', error);
      alert('Erro ao excluir conta');
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'PAGA':
        return 'bg-green-100 text-green-800';
      case 'PENDENTE':
        return 'bg-yellow-100 text-yellow-800';
      case 'VENCIDA':
        return 'bg-red-100 text-red-800';
      case 'PARCIALMENTE_PAGA':
        return 'bg-blue-100 text-blue-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(value);
  };

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Contas a Receber</h1>
        <p className="text-gray-600">Gerencie suas receitas e valores a receber</p>
      </div>

      {/* Cards de Resumo */}
      <div className="grid gap-6 md:grid-cols-4 mb-6">
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-sm font-medium text-gray-600">Total a Receber</h3>
            <div className="p-2 bg-green-50 rounded-lg">
              <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
          </div>
          <p className="text-2xl font-bold text-gray-900">{formatCurrency(resumo.totalReceber)}</p>
          <p className="text-sm text-gray-500 mt-1">Total de receitas</p>
        </div>

        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-sm font-medium text-gray-600">Recebido</h3>
            <div className="p-2 bg-blue-50 rounded-lg">
              <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
          </div>
          <p className="text-2xl font-bold text-gray-900">{formatCurrency(resumo.totalRecebido)}</p>
          <p className="text-sm text-gray-500 mt-1">Pagamentos recebidos</p>
        </div>

        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-sm font-medium text-gray-600">Pendente</h3>
            <div className="p-2 bg-yellow-50 rounded-lg">
              <svg className="w-5 h-5 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
          </div>
          <p className="text-2xl font-bold text-gray-900">{formatCurrency(resumo.totalPendente)}</p>
          <p className="text-sm text-gray-500 mt-1">A receber</p>
        </div>

        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-sm font-medium text-gray-600">Vencidas</h3>
            <div className="p-2 bg-red-50 rounded-lg">
              <svg className="w-5 h-5 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
          </div>
          <p className="text-2xl font-bold text-gray-900">{formatCurrency(resumo.totalVencidas)}</p>
          <p className="text-sm text-gray-500 mt-1">Cobranças atrasadas</p>
        </div>
      </div>

      {/* Tabela de Contas a Receber */}
      <div className="bg-white rounded-lg border border-gray-200">
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-gray-900">Últimas Contas a Receber</h2>
            <button className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors">
              + Nova Cobrança
            </button>
          </div>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Cliente</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Descrição</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Vencimento</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Valor</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Pago</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Ações</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {loading ? (
                <tr>
                  <td colSpan={7} className="px-6 py-8 text-center text-gray-500">
                    Carregando...
                  </td>
                </tr>
              ) : contas.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-6 py-8 text-center text-gray-500">
                    Nenhuma conta a receber cadastrada
                  </td>
                </tr>
              ) : (
                contas.map((conta) => (
                  <tr key={conta.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">
                        {conta.cliente?.nome || 'Sem cliente'}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-gray-900">{conta.descricao}</div>
                      {conta.numeroParcelas > 1 && (
                        <div className="text-xs text-gray-500">
                          {conta.numeroParcelas}x - {conta.parcelas?.filter(p => p.status === 'PAGA').length}/{conta.numeroParcelas} pagas
                        </div>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {format(new Date(conta.dataVencimento), 'dd/MM/yyyy', { locale: ptBR })}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {formatCurrency(conta.valorTotal)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-green-600">
                      {formatCurrency(conta.valorPago)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(conta.status)}`}>
                        {conta.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex gap-2">
                        {conta.status !== 'PAGA' && (
                          <button
                            onClick={() => handleRegistrarPagamento(conta.id)}
                            className="text-green-600 hover:text-green-900"
                          >
                            Pagar
                          </button>
                        )}
                        <button
                          onClick={() => handleExcluir(conta.id)}
                          className="text-red-600 hover:text-red-900"
                        >
                          Excluir
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
    </div>
  );
};

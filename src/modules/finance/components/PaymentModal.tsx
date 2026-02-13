import { useState, useEffect, useContext } from 'react';
import { X, DollarSign } from 'lucide-react';
import {
  registrarPagamentoReceber,
  getFormasPagamento,
  getContasBancarias,
  type FinanceContaReceber,
  type FinanceFormaPagamento,
  type FinanceContaBancaria,
} from '../../../services/api/finance.api';
import { ToastContext } from './FinanceLayout';

interface PaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  receivable: FinanceContaReceber | null;
}

export const PaymentModal = ({ isOpen, onClose, onSuccess, receivable }: PaymentModalProps) => {
  const toast = useContext(ToastContext);
  const [loading, setLoading] = useState(false);
  const [formasPagamento, setFormasPagamento] = useState<FinanceFormaPagamento[]>([]);
  const [contasBancarias, setContasBancarias] = useState<FinanceContaBancaria[]>([]);
  const [formData, setFormData] = useState({
    valorPago: '',
    dataPagamento: new Date().toISOString().split('T')[0],
    formaPagamentoId: '',
    contaBancariaId: '',
    observacoes: '',
  });

  useEffect(() => {
    if (isOpen && receivable) {
      carregarDados();
      // Preenche com o valor restante a pagar
      const valorRestante = receivable.valorTotal - receivable.valorPago;
      setFormData((prev) => ({
        ...prev,
        valorPago: valorRestante.toFixed(2),
      }));
    }
  }, [isOpen, receivable]);

  const carregarDados = async () => {
    try {
      const [formasRes, contasRes] = await Promise.all([
        getFormasPagamento(),
        getContasBancarias(),
      ]);
      setFormasPagamento(formasRes);
      setContasBancarias(contasRes);
      
      // Seleciona a primeira forma de pagamento por padrão
      if (formasRes.length > 0) {
        setFormData(prev => ({ ...prev, formaPagamentoId: formasRes[0].id.toString() }));
      }
      
      // Seleciona a conta bancária principal por padrão
      const contaPrincipal = contasRes.find(c => c.principal);
      if (contaPrincipal) {
        setFormData(prev => ({ ...prev, contaBancariaId: contaPrincipal.id.toString() }));
      }
    } catch (error) {
      console.error('Erro ao carregar dados:', error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!receivable) return;

    setLoading(true);
    try {
      await registrarPagamentoReceber(receivable.id, {
        valor: parseFloat(formData.valorPago),
        dataPagamento: formData.dataPagamento,
        formaPagamentoId: formData.formaPagamentoId ? parseInt(formData.formaPagamentoId, 10) : undefined,
        contaBancariaId: formData.contaBancariaId ? parseInt(formData.contaBancariaId, 10) : undefined,
        observacoes: formData.observacoes || undefined,
      });

      toast?.current?.show({ severity: 'success', summary: 'Sucesso', detail: 'Pagamento registrado com sucesso', life: 3000 });
      onSuccess();
      handleClose();
    } catch (error) {
      console.error('Erro ao registrar pagamento:', error);
      toast?.current?.show({ severity: 'error', summary: 'Erro', detail: 'Erro ao registrar pagamento', life: 3000 });
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setFormData({
      valorPago: '',
      dataPagamento: new Date().toISOString().split('T')[0],
      formaPagamentoId: '',
      contaBancariaId: '',
      observacoes: '',
    });
    onClose();
  };

  if (!isOpen || !receivable) return null;

  const valorRestante = receivable.valorTotal - receivable.valorPago;
  const valorPagoNum = parseFloat(formData.valorPago) || 0;
  const valorFinal = receivable.valorPago + valorPagoNum;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-lg w-full">
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-green-100 rounded-lg">
              <DollarSign className="w-5 h-5 text-green-600" />
            </div>
            <h2 className="text-xl font-semibold text-gray-900">Registrar Pagamento</h2>
          </div>
          <button
            onClick={handleClose}
            className="text-gray-400 hover:text-gray-600 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {/* Informações da Conta */}
          <div className="bg-gray-50 rounded-lg p-4 space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Cliente:</span>
              <span className="font-medium text-gray-900">{receivable.cliente?.nome || 'Sem cliente'}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Descrição:</span>
              <span className="font-medium text-gray-900">{receivable.descricao}</span>
            </div>
            <div className="border-t border-gray-200 pt-2 mt-2">
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Valor Total:</span>
                <span className="font-bold text-gray-900">
                  {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(receivable.valorTotal)}
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Já Pago:</span>
                <span className="font-medium text-green-600">
                  {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(receivable.valorPago)}
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Restante:</span>
                <span className="font-bold text-red-600">
                  {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(valorRestante)}
                </span>
              </div>
            </div>
          </div>

          {/* Valor do Pagamento */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Valor do Pagamento *
            </label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">R$</span>
              <input
                type="number"
                required
                step="0.01"
                min="0.01"
                max={valorRestante}
                value={formData.valorPago}
                onChange={(e) => setFormData({ ...formData, valorPago: e.target.value })}
                className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                placeholder="0,00"
              />
            </div>
            {valorPagoNum > 0 && (
              <div className="mt-2 p-2 bg-blue-50 rounded text-sm text-blue-700">
                Após este pagamento: <span className="font-bold">
                  {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(valorFinal)}
                </span> de {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(receivable.valorTotal)}
              </div>
            )}
          </div>

          {/* Data do Pagamento */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Data do Pagamento *
            </label>
            <input
              type="date"
              required
              value={formData.dataPagamento}
              onChange={(e) => setFormData({ ...formData, dataPagamento: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
            />
          </div>

          {/* Forma de Pagamento */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Forma de Pagamento *
            </label>
            <select
              required
              value={formData.formaPagamentoId}
              onChange={(e) => setFormData({ ...formData, formaPagamentoId: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
            >
              <option value="">Selecione...</option>
              {formasPagamento.map((forma) => (
                <option key={forma.id} value={forma.id}>
                  {forma.nome}
                </option>
              ))}
            </select>
          </div>

          {/* Conta Bancária */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Conta Bancária *
            </label>
            <select
              required
              value={formData.contaBancariaId}
              onChange={(e) => setFormData({ ...formData, contaBancariaId: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
            >
              <option value="">Selecione...</option>
              {contasBancarias.map((conta) => (
                <option key={conta.id} value={conta.id}>
                  {conta.banco} - {conta.conta} {conta.principal && '(Principal)'}
                </option>
              ))}
            </select>
          </div>

          {/* Observações */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Observações
            </label>
            <textarea
              value={formData.observacoes}
              onChange={(e) => setFormData({ ...formData, observacoes: e.target.value })}
              rows={2}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              placeholder="Informações adicionais sobre o pagamento..."
            />
          </div>

          {/* Botões */}
          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={handleClose}
              className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors cursor-pointer"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
            >
              {loading ? 'Registrando...' : 'Confirmar Pagamento'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

import { useState, useEffect, useContext } from 'react';
import { X, DollarSign } from 'lucide-react';
import {
  registrarPagamentoPagar,
  type FinanceContaPagar,
} from '../../../services/api/finance.api';
import { ToastContext } from './FinanceLayout';

interface PayablePaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  payable: FinanceContaPagar | null;
}

export const PayablePaymentModal = ({ isOpen, onClose, onSuccess, payable }: PayablePaymentModalProps) => {
  const toast = useContext(ToastContext);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    valorPago: '',
    dataPagamento: new Date().toISOString().split('T')[0],
  });

  useEffect(() => {
    if (isOpen && payable) {
      // Preenche com o valor restante a pagar
      const valorRestante = payable.valorTotal - payable.valorPago;
      setFormData((prev) => ({
        ...prev,
        valorPago: valorRestante.toFixed(2),
      }));
    }
  }, [isOpen, payable]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!payable) return;

    setLoading(true);
    try {
      await registrarPagamentoPagar(payable.id, {
        valor: parseFloat(formData.valorPago),
        dataPagamento: formData.dataPagamento,
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
    });
    onClose();
  };

  if (!isOpen || !payable) return null;

  const valorRestante = payable.valorTotal - payable.valorPago;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-md mx-4">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b">
          <h2 className="text-xl font-semibold text-gray-900">Registrar Pagamento</h2>
          <button
            onClick={handleClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Informações da Conta */}
          <div className="bg-gray-50 rounded-lg p-4 space-y-2">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-sm text-gray-600">Descrição</p>
                <p className="font-medium text-gray-900">{payable.descricao}</p>
              </div>
              {payable.fornecedor && (
                <div className="text-right">
                  <p className="text-sm text-gray-600">Fornecedor</p>
                  <p className="font-medium text-gray-900">{payable.fornecedor.nome}</p>
                </div>
              )}
            </div>
            
            <div className="grid grid-cols-3 gap-4 pt-3 border-t border-gray-200">
              <div>
                <p className="text-xs text-gray-600">Valor Total</p>
                <p className="font-semibold text-gray-900">
                  R$ {payable.valorTotal.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </p>
              </div>
              <div>
                <p className="text-xs text-gray-600">Já Pago</p>
                <p className="font-semibold text-green-600">
                  R$ {payable.valorPago.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </p>
              </div>
              <div>
                <p className="text-xs text-gray-600">Restante</p>
                <p className="font-semibold text-orange-600">
                  R$ {valorRestante.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </p>
              </div>
            </div>
          </div>

          {/* Valor do Pagamento */}
          <div>
            <label htmlFor="valorPago" className="block text-sm font-medium text-gray-700 mb-2">
              Valor do Pagamento *
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <DollarSign className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="number"
                id="valorPago"
                value={formData.valorPago}
                onChange={(e) => setFormData({ ...formData, valorPago: e.target.value })}
                step="0.01"
                min="0.01"
                max={valorRestante}
                required
                className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-green-500 focus:border-green-500"
                placeholder="0,00"
              />
            </div>
            <p className="mt-1 text-xs text-gray-500">
              Valor máximo: R$ {valorRestante.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </p>
          </div>

          {/* Data do Pagamento */}
          <div>
            <label htmlFor="dataPagamento" className="block text-sm font-medium text-gray-700 mb-2">
              Data do Pagamento *
            </label>
            <input
              type="date"
              id="dataPagamento"
              value={formData.dataPagamento}
              onChange={(e) => setFormData({ ...formData, dataPagamento: e.target.value })}
              required
              className="block w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-green-500 focus:border-green-500"
            />
          </div>

          {/* Buttons */}
          <div className="flex gap-3 pt-4 border-t">
            <button
              type="button"
              onClick={handleClose}
              className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
              disabled={loading}
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={loading || !formData.valorPago || parseFloat(formData.valorPago) <= 0}
              className="flex-1 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Processando...
                </>
              ) : (
                'Confirmar Pagamento'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

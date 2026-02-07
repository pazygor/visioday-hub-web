import { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import {
  createContaReceber,
  updateContaReceber,
  getCategorias,
  getClientes,
  type FinanceContaReceber,
  type FinanceCategoria,
  type FinanceCliente,
} from '../../../services/api/finance.api';

interface ReceivableModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  receivable?: FinanceContaReceber | null;
}

export const ReceivableModal = ({ isOpen, onClose, onSuccess, receivable }: ReceivableModalProps) => {
  const [loading, setLoading] = useState(false);
  const [categorias, setCategorias] = useState<FinanceCategoria[]>([]);
  const [clientes, setClientes] = useState<FinanceCliente[]>([]);
  const [formData, setFormData] = useState({
    descricao: '',
    valorTotal: '',
    dataVencimento: '',
    clienteId: '',
    categoriaId: '',
    observacoes: '',
    recorrente: false,
    diaVencimentoRecorrente: '',
  });

  useEffect(() => {
    if (isOpen) {
      carregarDados();
      if (receivable) {
        setFormData({
          descricao: receivable.descricao,
          valorTotal: receivable.valorTotal.toString(),
          dataVencimento: receivable.dataVencimento.split('T')[0],
          clienteId: receivable.clienteId?.toString() || '',
          categoriaId: receivable.categoriaId?.toString() || '',
          observacoes: receivable.observacoes || '',
          recorrente: receivable.recorrente || false,
          diaVencimentoRecorrente: receivable.diaVencimentoRecorrente?.toString() || '',
        });
      }
    }
  }, [isOpen, receivable]);

  const carregarDados = async () => {
    try {
      const [categoriasRes, clientesRes] = await Promise.all([
        getCategorias('RECEITA'),
        getClientes(),
      ]);
      setCategorias(categoriasRes);
      setClientes(clientesRes);
    } catch (error) {
      console.error('Erro ao carregar dados:', error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const data = {
        descricao: formData.descricao,
        valorTotal: parseFloat(formData.valorTotal),
        dataVencimento: formData.dataVencimento,
        clienteId: formData.clienteId ? parseInt(formData.clienteId) : undefined,
        categoriaId: formData.categoriaId ? parseInt(formData.categoriaId) : undefined,
        observacoes: formData.observacoes || undefined,
        recorrente: formData.recorrente,
        diaVencimentoRecorrente: formData.diaVencimentoRecorrente ? parseInt(formData.diaVencimentoRecorrente) : undefined,
      };

      if (receivable) {
        await updateContaReceber(receivable.id, data);
      } else {
        await createContaReceber(data);
      }

      onSuccess();
      handleClose();
    } catch (error) {
      console.error('Erro ao salvar conta:', error);
      alert('Erro ao salvar conta a receber');
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setFormData({
      descricao: '',
      valorTotal: '',
      dataVencimento: '',
      clienteId: '',
      categoriaId: '',
      observacoes: '',
      recorrente: false,
      diaVencimentoRecorrente: '',
    });
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900">
            {receivable ? 'Editar Conta a Receber' : 'Nova Conta a Receber'}
          </h2>
          <button
            onClick={handleClose}
            className="text-gray-400 hover:text-gray-600 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Cliente */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Cliente
              </label>
              <select
                value={formData.clienteId}
                onChange={(e) => setFormData({ ...formData, clienteId: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              >
                <option value="">Selecione um cliente</option>
                {clientes.map((cliente) => (
                  <option key={cliente.id} value={cliente.id}>
                    {cliente.nome}
                  </option>
                ))}
              </select>
            </div>

            {/* Categoria */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Categoria
              </label>
              <select
                value={formData.categoriaId}
                onChange={(e) => setFormData({ ...formData, categoriaId: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              >
                <option value="">Selecione uma categoria</option>
                {categorias.map((categoria) => (
                  <option key={categoria.id} value={categoria.id}>
                    {categoria.nome}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Descrição */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Descrição *
            </label>
            <input
              type="text"
              required
              value={formData.descricao}
              onChange={(e) => setFormData({ ...formData, descricao: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              placeholder="Ex: Pagamento de serviços prestados"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Valor */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Valor Total *
              </label>
              <input
                type="number"
                required
                step="0.01"
                min="0"
                value={formData.valorTotal}
                onChange={(e) => setFormData({ ...formData, valorTotal: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                placeholder="0,00"
              />
            </div>

            {/* Data de Vencimento */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Data de Vencimento *
              </label>
              <input
                type="date"
                required
                value={formData.dataVencimento}
                onChange={(e) => setFormData({ ...formData, dataVencimento: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              />
            </div>
          </div>

          {/* Recorrência */}
          <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={formData.recorrente}
                onChange={(e) => setFormData({ ...formData, recorrente: e.target.checked })}
                className="w-4 h-4 text-green-600 border-gray-300 rounded focus:ring-green-500"
              />
              <span className="text-sm font-medium text-gray-700">Recorrente (mensal)</span>
            </label>

            {formData.recorrente && (
              <div className="flex items-center gap-2">
                <label className="text-sm text-gray-700">Dia do vencimento:</label>
                <input
                  type="number"
                  min="1"
                  max="31"
                  value={formData.diaVencimentoRecorrente}
                  onChange={(e) => setFormData({ ...formData, diaVencimentoRecorrente: e.target.value })}
                  className="w-20 px-2 py-1 border border-gray-300 rounded focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  placeholder="5"
                />
              </div>
            )}
          </div>

          {/* Observações */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Observações
            </label>
            <textarea
              value={formData.observacoes}
              onChange={(e) => setFormData({ ...formData, observacoes: e.target.value })}
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              placeholder="Informações adicionais..."
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
              {loading ? 'Salvando...' : receivable ? 'Atualizar' : 'Criar'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

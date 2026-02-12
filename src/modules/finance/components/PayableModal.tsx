import { useState, useEffect, useContext } from 'react';
import { Dialog } from 'primereact/dialog';
import { InputText } from 'primereact/inputtext';
import { InputNumber } from 'primereact/inputnumber';
import { Dropdown } from 'primereact/dropdown';
import { Calendar } from 'primereact/calendar';
import { InputTextarea } from 'primereact/inputtextarea';
import { InputSwitch } from 'primereact/inputswitch';
import { Button } from 'primereact/button';
import { Accordion, AccordionTab } from 'primereact/accordion';
import {
  createContaPagar,
  updateContaPagar,
  getCategorias,
  getFornecedores,
  getContasBancarias,
  getFormasPagamento,
  type FinanceContaPagar,
  type FinanceCategoria,
  type FinanceFornecedor,
  type FinanceContaBancaria,
  type FinanceFormaPagamento,
} from '../../../services/api/finance.api';
import { ToastContext } from './FinanceLayout';

interface PayableModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  payable?: FinanceContaPagar | null;
}

export const PayableModal = ({ isOpen, onClose, onSuccess, payable }: PayableModalProps) => {
  const toast = useContext(ToastContext);
  const [loading, setLoading] = useState(false);
  const [categorias, setCategorias] = useState<FinanceCategoria[]>([]);
  const [fornecedores, setFornecedores] = useState<FinanceFornecedor[]>([]);
  const [contasBancarias, setContasBancarias] = useState<FinanceContaBancaria[]>([]);
  const [formasPagamento, setFormasPagamento] = useState<FinanceFormaPagamento[]>([]);

  const [formData, setFormData] = useState({
    descricao: '',
    valorTotal: 0,
    dataEmissao: new Date(),
    dataVencimento: new Date(),
    fornecedorId: null as number | null,
    categoriaId: null as number | null,
    contaBancariaId: null as number | null,
    formaPagamentoId: null as number | null,
    numeroParcelas: 1,
    numeroDocumento: '',
    observacoes: '',
    recorrente: false,
    frequenciaRecorrencia: null as string | null,
  });

  useEffect(() => {
    if (isOpen) {
      carregarDados();
      if (payable) {
        setFormData({
          descricao: payable.descricao,
          valorTotal: Number(payable.valorTotal),
          dataEmissao: new Date(payable.dataEmissao),
          dataVencimento: new Date(payable.dataVencimento),
          fornecedorId: payable.fornecedorId || null,
          categoriaId: payable.categoriaId || null,
          contaBancariaId: payable.contaBancariaId || null,
          formaPagamentoId: payable.formaPagamentoId || null,
          numeroParcelas: payable.numeroParcelas || 1,
          numeroDocumento: payable.numeroDocumento || '',
          observacoes: payable.observacoes || '',
          recorrente: payable.recorrente || false,
          frequenciaRecorrencia: payable.frequenciaRecorrencia || null,
        });
      } else {
        // Reset form for new entry
        setFormData({
          descricao: '',
          valorTotal: 0,
          dataEmissao: new Date(),
          dataVencimento: new Date(),
          fornecedorId: null,
          categoriaId: null,
          contaBancariaId: null,
          formaPagamentoId: null,
          numeroParcelas: 1,
          numeroDocumento: '',
          observacoes: '',
          recorrente: false,
          frequenciaRecorrencia: null,
        });
      }
    }
  }, [isOpen, payable]);

  const carregarDados = async () => {
    try {
      const [categoriasRes, fornecedoresRes, contasRes, formasRes] = await Promise.all([
        getCategorias('DESPESA'),
        getFornecedores(),
        getContasBancarias(),
        getFormasPagamento(),
      ]);
      setCategorias(categoriasRes);
      setFornecedores(fornecedoresRes);
      setContasBancarias(contasRes);
      setFormasPagamento(formasRes);
    } catch (error) {
      console.error('Erro ao carregar dados:', error);
    }
  };

  const handleSubmit = async () => {
    // Validações
    if (!formData.descricao.trim()) {
      toast?.current?.show({ severity: 'warn', summary: 'Atenção', detail: 'Descrição é obrigatória', life: 3000 });
      return;
    }

    if (formData.valorTotal <= 0) {
      toast?.current?.show({ severity: 'warn', summary: 'Atenção', detail: 'Valor deve ser maior que zero', life: 3000 });
      return;
    }

    setLoading(true);

    try {
      const data: any = {
        descricao: formData.descricao,
        valorTotal: formData.valorTotal,
        dataEmissao: formData.dataEmissao.toISOString(),
        dataVencimento: formData.dataVencimento.toISOString(),
        fornecedorId: formData.fornecedorId || undefined,
        categoriaId: formData.categoriaId || undefined,
        contaBancariaId: formData.contaBancariaId || undefined,
        formaPagamentoId: formData.formaPagamentoId || undefined,
        numeroParcelas: formData.numeroParcelas,
        numeroDocumento: formData.numeroDocumento || undefined,
        observacoes: formData.observacoes || undefined,
        recorrente: formData.recorrente,
        frequenciaRecorrencia: formData.recorrente ? (formData.frequenciaRecorrencia || 'MENSAL') : undefined,
      };

      if (payable) {
        await updateContaPagar(payable.id, data);
        toast?.current?.show({ severity: 'success', summary: 'Sucesso', detail: 'Conta a pagar atualizada com sucesso', life: 3000 });
      } else {
        await createContaPagar(data);
        toast?.current?.show({ severity: 'success', summary: 'Sucesso', detail: 'Conta a pagar criada com sucesso', life: 3000 });
      }

      onSuccess();
      onClose();
    } catch (error) {
      console.error('Erro ao salvar conta:', error);
      toast?.current?.show({ severity: 'error', summary: 'Erro', detail: 'Erro ao salvar conta a pagar', life: 3000 });
    } finally {
      setLoading(false);
    }
  };

  const footerContent = (
    <div className="flex justify-end gap-3 pt-4 border-t">
      <Button
        label="Cancelar"
        icon="pi pi-times"
        onClick={onClose}
        className="p-button-text"
        disabled={loading}
      />
      <Button
        label={payable ? 'Atualizar' : 'Criar'}
        icon="pi pi-check"
        onClick={handleSubmit}
        loading={loading}
        className="p-button-success"
      />
    </div>
  );

  return (
    <Dialog
      header={payable ? 'Editar Conta a Pagar' : 'Nova Conta a Pagar'}
      visible={isOpen}
      onHide={onClose}
      style={{ width: '60vw' }}
      breakpoints={{ '1280px': '75vw', '960px': '90vw', '640px': '100vw' }}
      footer={footerContent}
      modal
      className="p-fluid"
    >
      <div className="space-y-4">
        {/* Descrição */}
        <div className="field">
          <label htmlFor="descricao" className="block text-sm font-medium text-gray-700 mb-2">
            Descrição *
          </label>
          <InputText
            id="descricao"
            value={formData.descricao}
            onChange={(e) => setFormData({ ...formData, descricao: e.target.value })}
            placeholder="Ex: Aluguel escritório, Energia elétrica..."
            className="w-full"
          />
        </div>

        {/* Fornecedor */}
        <div className="field">
          <label htmlFor="fornecedor" className="block text-sm font-medium text-gray-700 mb-2">
            Fornecedor
          </label>
          <Dropdown
            id="fornecedor"
            value={formData.fornecedorId}
            options={fornecedores}
            onChange={(e) => setFormData({ ...formData, fornecedorId: e.value })}
            optionLabel="nome"
            optionValue="id"
            placeholder="Selecione um fornecedor"
            filter
            filterBy="nome"
            emptyMessage="Nenhum fornecedor cadastrado"
            showClear
            className="w-full"
          />
        </div>

        {/* Valor e Parcelas */}
        <div className="grid grid-cols-2 gap-4">
          <div className="field">
            <label htmlFor="valor" className="block text-sm font-medium text-gray-700 mb-2">
              Valor Total *
            </label>
            <InputNumber
              id="valor"
              value={formData.valorTotal}
              onValueChange={(e) => setFormData({ ...formData, valorTotal: e.value || 0 })}
              mode="currency"
              currency="BRL"
              locale="pt-BR"
              minFractionDigits={2}
              className="w-full"
            />
          </div>

          <div className="field">
            <label htmlFor="parcelas" className="block text-sm font-medium text-gray-700 mb-2">
              Número de Parcelas
            </label>
            <InputNumber
              id="parcelas"
              value={formData.numeroParcelas}
              onValueChange={(e) => setFormData({ ...formData, numeroParcelas: e.value || 1 })}
              min={1}
              max={120}
              showButtons
              className="w-full"
            />
          </div>
        </div>

        {/* Datas */}
        <div className="grid grid-cols-2 gap-4">
          <div className="field">
            <label htmlFor="dataEmissao" className="block text-sm font-medium text-gray-700 mb-2">
              Data de Emissão *
            </label>
            <Calendar
              id="dataEmissao"
              value={formData.dataEmissao}
              onChange={(e) => setFormData({ ...formData, dataEmissao: e.value as Date })}
              dateFormat="dd/mm/yy"
              locale="pt-BR"
              showButtonBar
              className="w-full"
            />
          </div>

          <div className="field">
            <label htmlFor="dataVencimento" className="block text-sm font-medium text-gray-700 mb-2">
              Data de Vencimento *
            </label>
            <Calendar
              id="dataVencimento"
              value={formData.dataVencimento}
              onChange={(e) => setFormData({ ...formData, dataVencimento: e.value as Date })}
              dateFormat="dd/mm/yy"
              locale="pt-BR"
              showButtonBar
              className="w-full"
            />
          </div>
        </div>

        {/* Categoria */}
        <div className="field">
          <label htmlFor="categoria" className="block text-sm font-medium text-gray-700 mb-2">
            Categoria
          </label>
          <Dropdown
            id="categoria"
            value={formData.categoriaId}
            options={categorias}
            onChange={(e) => setFormData({ ...formData, categoriaId: e.value })}
            optionLabel="nome"
            optionValue="id"
            placeholder="Selecione uma categoria"
            filter
            filterBy="nome"
            emptyMessage="Nenhuma categoria cadastrada"
            showClear
            className="w-full"
          />
        </div>

        {/* Recorrência */}
        <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg">
          <InputSwitch
            checked={formData.recorrente}
            onChange={(e) => setFormData({ ...formData, recorrente: e.value })}
          />
          <div>
            <label className="block text-sm font-medium text-gray-700">Conta Recorrente</label>
            <p className="text-xs text-gray-500">A conta será gerada automaticamente nos próximos períodos</p>
          </div>
        </div>

        {formData.recorrente && (
          <div className="field">
            <label htmlFor="frequencia" className="block text-sm font-medium text-gray-700 mb-2">
              Frequência
            </label>
            <Dropdown
              id="frequencia"
              value={formData.frequenciaRecorrencia}
              options={[
                { label: 'Mensal', value: 'MENSAL' },
                { label: 'Trimestral', value: 'TRIMESTRAL' },
                { label: 'Semestral', value: 'SEMESTRAL' },
                { label: 'Anual', value: 'ANUAL' },
              ]}
              onChange={(e) => setFormData({ ...formData, frequenciaRecorrencia: e.value })}
              placeholder="Selecione a frequência"
              className="w-full"
            />
          </div>
        )}

        {/* Accordion para campos avançados */}
        <Accordion>
          <AccordionTab header="Informações Adicionais">
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="field">
                  <label htmlFor="formaPagamento" className="block text-sm font-medium text-gray-700 mb-2">
                    Forma de Pagamento
                  </label>
                  <Dropdown
                    id="formaPagamento"
                    value={formData.formaPagamentoId}
                    options={formasPagamento}
                    onChange={(e) => setFormData({ ...formData, formaPagamentoId: e.value })}
                    optionLabel="nome"
                    optionValue="id"
                    placeholder="Selecione"
                    filter
                    showClear
                    className="w-full"
                  />
                </div>

                <div className="field">
                  <label htmlFor="contaBancaria" className="block text-sm font-medium text-gray-700 mb-2">
                    Conta Bancária
                  </label>
                  <Dropdown
                    id="contaBancaria"
                    value={formData.contaBancariaId}
                    options={contasBancarias}
                    onChange={(e) => setFormData({ ...formData, contaBancariaId: e.value })}
                    optionLabel="nome"
                    optionValue="id"
                    placeholder="Selecione"
                    filter
                    showClear
                    className="w-full"
                  />
                </div>
              </div>

              <div className="field">
                <label htmlFor="numeroDocumento" className="block text-sm font-medium text-gray-700 mb-2">
                  Número do Documento
                </label>
                <InputText
                  id="numeroDocumento"
                  value={formData.numeroDocumento}
                  onChange={(e) => setFormData({ ...formData, numeroDocumento: e.target.value })}
                  placeholder="Nota Fiscal, Boleto, Recibo..."
                  className="w-full"
                />
              </div>

              <div className="field">
                <label htmlFor="observacoes" className="block text-sm font-medium text-gray-700 mb-2">
                  Observações
                </label>
                <InputTextarea
                  id="observacoes"
                  value={formData.observacoes}
                  onChange={(e) => setFormData({ ...formData, observacoes: e.target.value })}
                  rows={3}
                  placeholder="Informações adicionais sobre esta conta..."
                  className="w-full"
                />
              </div>
            </div>
          </AccordionTab>
        </Accordion>
      </div>
    </Dialog>
  );
};

import { useState, useEffect, useContext } from 'react';
import { Dialog } from 'primereact/dialog';
import { InputText } from 'primereact/inputtext';
import { InputNumber } from 'primereact/inputnumber';
import { Dropdown } from 'primereact/dropdown';
import { Calendar } from 'primereact/calendar';
import { InputTextarea } from 'primereact/inputtextarea';
import { InputSwitch } from 'primereact/inputswitch';
import { Button } from 'primereact/button';
import { Divider } from 'primereact/divider';
import { Accordion, AccordionTab } from 'primereact/accordion';
import {
  User, 
  Briefcase, 
  DollarSign, 
  Home, 
  Car, 
  TrendingUp, 
  Gift, 
  FileText 
} from 'lucide-react';
import {
  createContaReceber,
  updateContaReceber,
  getCategorias,
  getClientes,
  getContasBancarias,
  getFormasPagamento,
  type FinanceContaReceber,
  type FinanceCategoria,
  type FinanceCliente,
  type FinanceContaBancaria,
  type FinanceFormaPagamento,
} from '../../../services/api/finance.api';
import { ToastContext } from './FinanceLayout';

interface ReceivableModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  receivable?: FinanceContaReceber | null;
}

// Tipos de receita com ícones
const TIPOS_RECEITA = [
  { value: 'CLIENTE', label: 'Cliente (B2B)', icon: <User className="w-4 h-4" /> },
  { value: 'SALARIO', label: 'Salário', icon: <Briefcase className="w-4 h-4" /> },
  { value: 'FREELANCE', label: 'Freelance/Autônomo', icon: <DollarSign className="w-4 h-4" /> },
  { value: 'ALUGUEL', label: 'Aluguel Recebido', icon: <Home className="w-4 h-4" /> },
  { value: 'VENDA', label: 'Venda de Bem', icon: <Car className="w-4 h-4" /> },
  { value: 'INVESTIMENTO', label: 'Investimento Resgatado', icon: <TrendingUp className="w-4 h-4" /> },
  { value: 'BONIFICACAO', label: 'Bonificação/Prêmio', icon: <Gift className="w-4 h-4" /> },
  { value: 'OUTRO', label: 'Outro', icon: <FileText className="w-4 h-4" /> },
];

// Template para renderizar opções do dropdown com ícone
const tipoReceitaTemplate = (option: typeof TIPOS_RECEITA[0]) => {
  return (
    <div className="flex items-center gap-2">
      {option.icon}
      <span>{option.label}</span>
    </div>
  );
};

export const ReceivableModal = ({ isOpen, onClose, onSuccess, receivable }: ReceivableModalProps) => {
  const toast = useContext(ToastContext);
  const [loading, setLoading] = useState(false);
  const [categorias, setCategorias] = useState<FinanceCategoria[]>([]);
  const [clientes, setClientes] = useState<FinanceCliente[]>([]);
  const [contasBancarias, setContasBancarias] = useState<FinanceContaBancaria[]>([]);
  const [formasPagamento, setFormasPagamento] = useState<FinanceFormaPagamento[]>([]);

  const [formData, setFormData] = useState({
    tipo: 'CLIENTE',
    descricao: '',
    valorTotal: 0,
    dataEmissao: new Date(),
    dataVencimento: new Date(),
    clienteId: null as number | null,
    categoriaId: null as number | null,
    contaBancariaId: null as number | null,
    formaPagamentoId: null as number | null,
    numeroParcelas: 1,
    numeroDocumento: '',
    observacoes: '',
    recorrente: false,
    frequenciaRecorrencia: null as string | null,
    diaVencimentoRecorrente: null as number | null,
  });

  useEffect(() => {
    if (isOpen) {
      carregarDados();
      if (receivable) {
        setFormData({
          tipo: receivable.tipo || 'CLIENTE',
          descricao: receivable.descricao,
          valorTotal: Number(receivable.valorTotal),
          dataEmissao: new Date(receivable.dataEmissao),
          dataVencimento: new Date(receivable.dataVencimento),
          clienteId: receivable.clienteId || null,
          categoriaId: receivable.categoriaId || null,
          contaBancariaId: receivable.contaBancariaId || null,
          formaPagamentoId: receivable.formaPagamentoId || null,
          numeroParcelas: receivable.numeroParcelas || 1,
          numeroDocumento: receivable.numeroDocumento || '',
          observacoes: receivable.observacoes || '',
          recorrente: receivable.recorrente || false,
          frequenciaRecorrencia: receivable.frequenciaRecorrencia || null,
          diaVencimentoRecorrente: receivable.diaVencimentoRecorrente || null,
        });
      } else {
        // Reset form for new entry
        setFormData({
          tipo: 'CLIENTE',
          descricao: '',
          valorTotal: 0,
          dataEmissao: new Date(),
          dataVencimento: new Date(),
          clienteId: null,
          categoriaId: null,
          contaBancariaId: null,
          formaPagamentoId: null,
          numeroParcelas: 1,
          numeroDocumento: '',
          observacoes: '',
          recorrente: false,
          frequenciaRecorrencia: null,
          diaVencimentoRecorrente: null,
        });
      }
    }
  }, [isOpen, receivable]);

  const carregarDados = async () => {
    try {
      const [categoriasRes, clientesRes, contasRes, formasRes] = await Promise.all([
        getCategorias('RECEITA'),
        getClientes(),
        getContasBancarias(),
        getFormasPagamento(),
      ]);
      setCategorias(categoriasRes);
      setClientes(clientesRes);
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

    if (formData.tipo === 'CLIENTE' && !formData.clienteId) {
      toast?.current?.show({ severity: 'warn', summary: 'Atenção', detail: 'Selecione um cliente para receitas do tipo Cliente', life: 3000 });
      return;
    }

    if (formData.valorTotal <= 0) {
      toast?.current?.show({ severity: 'warn', summary: 'Atenção', detail: 'Valor deve ser maior que zero', life: 3000 });
      return;
    }

    setLoading(true);

    try {
      const data: any = {
        tipo: formData.tipo,
        descricao: formData.descricao,
        valorTotal: formData.valorTotal,
        dataEmissao: formData.dataEmissao.toISOString(),
        dataVencimento: formData.dataVencimento.toISOString(),
        clienteId: formData.tipo === 'CLIENTE' ? formData.clienteId : undefined,
        categoriaId: formData.categoriaId || undefined,
        contaBancariaId: formData.contaBancariaId || undefined,
        formaPagamentoId: formData.formaPagamentoId || undefined,
        numeroParcelas: formData.numeroParcelas,
        numeroDocumento: formData.numeroDocumento || undefined,
        observacoes: formData.observacoes || undefined,
        recorrente: formData.recorrente,
        frequenciaRecorrencia: formData.recorrente ? (formData.frequenciaRecorrencia || 'MENSAL') : undefined,
        diaVencimentoRecorrente: formData.recorrente ? formData.diaVencimentoRecorrente : undefined,
      };

      if (receivable) {
        await updateContaReceber(receivable.id, data);
        toast?.current?.show({ severity: 'success', summary: 'Sucesso', detail: 'Conta a receber atualizada com sucesso', life: 3000 });
      } else {
        await createContaReceber(data);
        toast?.current?.show({ severity: 'success', summary: 'Sucesso', detail: 'Conta a receber criada com sucesso', life: 3000 });
      }

      onSuccess();
      onClose();
    } catch (error) {
      console.error('Erro ao salvar conta:', error);
      toast?.current?.show({ severity: 'error', summary: 'Erro', detail: 'Erro ao salvar conta a receber', life: 3000 });
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
        className="p-button-text p-button-secondary"
        disabled={loading}
      />
      <Button
        label={receivable ? 'Atualizar' : 'Criar'}
        icon={receivable ? 'pi pi-check' : 'pi pi-plus'}
        onClick={handleSubmit}
        loading={loading}
        className="p-button-success"
      />
    </div>
  );

  return (
    <Dialog
      header={
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-green-100 flex items-center justify-center">
            <DollarSign className="w-5 h-5 text-green-600" />
          </div>
          <div>
            <h3 className="text-xl font-semibold text-gray-900">
              {receivable ? 'Editar Conta a Receber' : 'Nova Conta a Receber'}
            </h3>
            <p className="text-sm text-gray-500 mt-0.5">
              {receivable ? 'Atualize as informações da receita' : 'Registre uma nova receita no sistema'}
            </p>
          </div>
        </div>
      }
      visible={isOpen}
      onHide={onClose}
      style={{ width: '700px', maxWidth: '95vw' }}
      breakpoints={{ '960px': '85vw', '641px': '95vw' }}
      footer={footerContent}
      modal
      draggable={false}
      resizable={false}
      className="p-dialog-custom"
    >
      <div className="flex flex-col gap-6 p-1">
        {/* Seção: Tipo de Receita */}
        <div className="bg-linear-to-br from-green-50 to-emerald-50 p-5 rounded-lg border border-green-200">
          <label htmlFor="tipo" className="block text-sm font-semibold text-gray-700 mb-3">
            <span className="flex items-center gap-2">
              Tipo de Receita <span className="text-red-500">*</span>
              <span className="text-xs font-normal text-gray-500">(Selecione a origem da receita)</span>
            </span>
          </label>
          <Dropdown
            id="tipo"
            value={formData.tipo}
            options={TIPOS_RECEITA}
            onChange={(e) => setFormData({ ...formData, tipo: e.value, clienteId: e.value !== 'CLIENTE' ? null : formData.clienteId })}
            optionLabel="label"
            optionValue="value"
            itemTemplate={tipoReceitaTemplate}
            valueTemplate={(option) => {
              if (option) {
                const selected = TIPOS_RECEITA.find(t => t.value === option);
                return selected ? tipoReceitaTemplate(selected) : null;
              }
              return <span>Selecione o tipo</span>;
            }}
            placeholder="Selecione o tipo de receita"
            className="w-full"
            panelClassName="tipo-receita-panel"
          />
          <div className="mt-3 flex items-start gap-2 bg-white/60 rounded-md p-3 border border-green-100">
            <i className="pi pi-info-circle text-green-600 text-sm mt-0.5"></i>
            <small className="text-xs text-gray-600 leading-relaxed">
              {formData.tipo === 'CLIENTE' && '💼 Para faturamento de clientes B2B e serviços prestados'}
              {formData.tipo === 'SALARIO' && '💰 Para salário recebido de empregador'}
              {formData.tipo === 'FREELANCE' && '👨‍💻 Para trabalhos autônomos e projetos freelance'}
              {formData.tipo === 'ALUGUEL' && '🏠 Para aluguel de imóveis ou propriedades'}
              {formData.tipo === 'VENDA' && '🚗 Para venda de bens móveis (carro, móveis, equipamentos)'}
              {formData.tipo === 'INVESTIMENTO' && '📈 Para resgate de investimentos ou dividendos'}
              {formData.tipo === 'BONIFICACAO' && '🎁 Para bônus, premiações e bonificações'}
              {formData.tipo === 'OUTRO' && '📝 Para outros tipos de receita não categorizados'}
            </small>
          </div>
        </div>

        {/* Cliente Condicional */}
        {formData.tipo === 'CLIENTE' && (
          <>
            <Divider className="my-2" />
            <div className="flex flex-col gap-2">
              <label htmlFor="cliente" className="text-sm font-semibold text-gray-700">
                Cliente <span className="text-red-500">*</span>
              </label>
              <Dropdown
                id="cliente"
                value={formData.clienteId}
                options={clientes}
                onChange={(e) => setFormData({ ...formData, clienteId: e.value })}
                optionLabel="nome"
                optionValue="id"
                placeholder="Selecione um cliente"
                filter
                filterPlaceholder="Buscar cliente..."
                emptyMessage="Nenhum cliente encontrado"
                className="w-full"
              />
            </div>
          </>
        )}

        <Divider className="my-2" />

        {/* Informações Principais */}
        <div className="flex flex-col gap-4">
          {/* Descrição */}
          <div className="flex flex-col gap-2">
            <label htmlFor="descricao" className="text-sm font-semibold text-gray-700">
              Descrição <span className="text-red-500">*</span>
            </label>
            <InputText
              id="descricao"
              value={formData.descricao}
              onChange={(e) => setFormData({ ...formData, descricao: e.target.value })}
              placeholder="Ex: Desenvolvimento de Website, Salário Janeiro 2026..."
              className="w-full"
            />
          </div>

          {/* Valor e Parcelas */}
          <div className="grid grid-cols-2 gap-4">
            <div className="flex flex-col gap-2">
              <label htmlFor="valorTotal" className="text-sm font-semibold text-gray-700">
                Valor Total <span className="text-red-500">*</span>
              </label>
              <InputNumber
                id="valorTotal"
                value={formData.valorTotal}
                onValueChange={(e) => setFormData({ ...formData, valorTotal: e.value || 0 })}
                mode="currency"
                currency="BRL"
                locale="pt-BR"
                minFractionDigits={2}
                className="w-full"
                inputClassName="text-lg font-semibold"
              />
            </div>

            <div className="flex flex-col gap-2">
              <label htmlFor="parcelas" className="text-sm font-semibold text-gray-700">
                Parcelas
              </label>
              <InputNumber
                id="parcelas"
                value={formData.numeroParcelas}
                onValueChange={(e) => setFormData({ ...formData, numeroParcelas: e.value || 1 })}
                min={1}
                max={12}
                showButtons
                buttonLayout="horizontal"
                decrementButtonClassName="p-button-outlined"
                incrementButtonClassName="p-button-outlined"
                className="w-full"
              />
            </div>
          </div>

          {/* Datas */}
          <div className="grid grid-cols-2 gap-4">
            <div className="flex flex-col gap-2">
              <label htmlFor="dataEmissao" className="text-sm font-semibold text-gray-700">
                Data de Emissão
              </label>
              <Calendar
                id="dataEmissao"
                value={formData.dataEmissao}
                onChange={(e) => setFormData({ ...formData, dataEmissao: e.value as Date })}
                dateFormat="dd/mm/yy"
                showIcon
                locale="pt-BR"
                className="w-full"
              />
            </div>

            <div className="flex flex-col gap-2">
              <label htmlFor="dataVencimento" className="text-sm font-semibold text-gray-700">
                Vencimento <span className="text-red-500">*</span>
              </label>
              <Calendar
                id="dataVencimento"
                value={formData.dataVencimento}
                onChange={(e) => setFormData({ ...formData, dataVencimento: e.value as Date })}
                dateFormat="dd/mm/yy"
                showIcon
                minDate={new Date()}
                locale="pt-BR"
                className="w-full"
              />
            </div>
          </div>

          {/* Categoria */}
          <div className="flex flex-col gap-2">
            <label htmlFor="categoria" className="text-sm font-semibold text-gray-700">
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
              showClear
              emptyMessage="Nenhuma categoria encontrada"
              className="w-full"
            />
          </div>
        </div>

        {/* Opções Avançadas */}
        <Accordion className="mt-2">
          <AccordionTab 
            header={
              <span className="flex items-center gap-2 font-semibold">
                <i className="pi pi-cog"></i>
                Opções Avançadas
              </span>
            }
          >
            <div className="flex flex-col gap-4 pt-4">
              {/* Forma de Pagamento */}
              <div className="flex flex-col gap-2">
                <label htmlFor="formaPagamento" className="text-sm font-semibold text-gray-700">
                  Forma de Pagamento
                </label>
                <Dropdown
                  id="formaPagamento"
                  value={formData.formaPagamentoId}
                  options={formasPagamento}
                  onChange={(e) => setFormData({ ...formData, formaPagamentoId: e.value })}
                  optionLabel="nome"
                  optionValue="id"
                  placeholder="Selecione a forma de pagamento"
                  showClear
                  className="w-full"
                />
              </div>

              {/* Conta Bancária */}
              <div className="flex flex-col gap-2">
                <label htmlFor="contaBancaria" className="text-sm font-semibold text-gray-700">
                  Conta Bancária (destino)
                </label>
                <Dropdown
                  id="contaBancaria"
                  value={formData.contaBancariaId}
                  options={contasBancarias}
                  onChange={(e) => setFormData({ ...formData, contaBancariaId: e.value })}
                  optionLabel="banco"
                  optionValue="id"
                  placeholder="Selecione a conta bancária"
                  showClear
                  itemTemplate={(option) => (
                    <div className="flex flex-col gap-1 py-2">
                      <div className="font-semibold text-gray-900">{option.banco}</div>
                      <small className="text-gray-500">
                        Ag {option.agencia} • Conta {option.conta}
                      </small>
                    </div>
                  )}
                  valueTemplate={(option) => {
                    if (option) {
                      const conta = contasBancarias.find(c => c.id === option);
                      return conta ? `${conta.banco} - Ag ${conta.agencia} | Conta ${conta.conta}` : '';
                    }
                    return 'Selecione a conta';
                  }}
                  className="w-full"
                />
              </div>

              {/* Número do Documento */}
              <div className="flex flex-col gap-2">
                <label htmlFor="numeroDocumento" className="text-sm font-semibold text-gray-700">
                  Número do Documento
                  <span className="text-xs font-normal text-gray-500 ml-2">(NF, Recibo, Boleto)</span>
                </label>
                <InputText
                  id="numeroDocumento"
                  value={formData.numeroDocumento}
                  onChange={(e) => setFormData({ ...formData, numeroDocumento: e.target.value })}
                  placeholder="Ex: NF 12345, Recibo 001/2026"
                  className="w-full"
                />
              </div>

              {/* Recorrência */}
              <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <InputSwitch
                      checked={formData.recorrente}
                      onChange={(e) => setFormData({ 
                        ...formData, 
                        recorrente: e.value,
                        frequenciaRecorrencia: e.value ? 'MENSAL' : null,
                        diaVencimentoRecorrente: e.value ? formData.dataVencimento.getDate() : null
                      })}
                    />
                    <div>
                      <label className="font-semibold text-gray-900 text-sm">
                        Receita Recorrente
                      </label>
                      <p className="text-xs text-gray-600 mt-0.5">
                        Será gerada automaticamente todo mês
                      </p>
                    </div>
                  </div>
                </div>

                {formData.recorrente && (
                  <div className="flex flex-col gap-2 mt-4 pt-4 border-t border-blue-200">
                    <label htmlFor="diaVencimento" className="text-sm font-semibold text-gray-700">
                      Dia do Vencimento
                    </label>
                    <InputNumber
                      id="diaVencimento"
                      value={formData.diaVencimentoRecorrente}
                      onValueChange={(e) => setFormData({ ...formData, diaVencimentoRecorrente: e.value || null })}
                      min={1}
                      max={31}
                      showButtons
                      className="w-full"
                    />
                    <small className="text-xs text-blue-700 flex items-start gap-2 mt-2">
                      <i className="pi pi-calendar text-xs mt-0.5"></i>
                      <span>
                        Esta receita será criada automaticamente todo dia <strong>{formData.diaVencimentoRecorrente}</strong> de cada mês
                      </span>
                    </small>
                  </div>
                )}
              </div>

              {/* Observações */}
              <div className="flex flex-col gap-2">
                <label htmlFor="observacoes" className="text-sm font-semibold text-gray-700">
                  Observações
                </label>
                <InputTextarea
                  id="observacoes"
                  value={formData.observacoes}
                  onChange={(e) => setFormData({ ...formData, observacoes: e.target.value })}
                  rows={4}
                  placeholder="Informações adicionais sobre esta receita..."
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

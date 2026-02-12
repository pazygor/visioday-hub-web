import httpClient from '../httpClient';

// Helper para obter token
const getToken = () => {
  const token = localStorage.getItem('token');
  if (!token) {
    throw new Error('Token não encontrado. Faça login novamente.');
  }
  return token;
};

// Helper para criar cliente autenticado
const authClient = () => httpClient.withAuth(getToken());

// Tipos
export interface FinanceCategoria {
  id: number;
  nome: string;
  tipo: 'RECEITA' | 'DESPESA';
  cor?: string;
  icone?: string;
  descricao?: string;
  usuarioId: number | null;
}

export interface FinanceFormaPagamento {
  id: number;
  nome: string;
  tipo: 'A_VISTA' | 'PARCELADO' | 'RECORRENTE';
  ativo: boolean;
}

export interface FinanceContaBancaria {
  id: number;
  banco: string;
  agencia: string;
  conta: string;
  tipoConta: 'CORRENTE' | 'POUPANCA' | 'INVESTIMENTO';
  saldoInicial: number;
  saldoAtual: number;
  chavePix?: string;
  principal: boolean;
}

export interface FinanceCliente {
  id: number;
  nome: string;
  cpfCnpj?: string;
  email?: string;
  telefone?: string;
  endereco?: string;
  observacoes?: string;
  ativo: boolean;
  createdAt: string;
  updatedAt: string;
  contasReceber?: any[];
  faturas?: any[];
}

export interface FinanceFornecedor {
  id: number;
  nome: string;
  cpfCnpj?: string;
  email?: string;
  telefone?: string;
  endereco?: string;
  observacoes?: string;
  contasPagar?: any[];
}

export interface FinanceParcela {
  id: number;
  numeroParcela: number;
  valorParcela: number;
  dataVencimento: string;
  dataPagamento?: string;
  status: string;
}

export interface FinanceContaReceber {
  id: number;
  tipo: 'CLIENTE' | 'SALARIO' | 'FREELANCE' | 'ALUGUEL' | 'VENDA' | 'INVESTIMENTO' | 'BONIFICACAO' | 'OUTRO';
  descricao: string;
  valorTotal: number;
  valorPago: number;
  valorPendente: number;
  dataEmissao: string;
  dataVencimento: string;
  dataPagamento?: string;
  status: string;
  numeroParcelas: number;
  numeroDocumento?: string;
  recorrente: boolean;
  frequenciaRecorrencia?: string;
  diaVencimentoRecorrente?: number;
  observacoes?: string;
  clienteId?: number;
  categoriaId?: number;
  contaBancariaId?: number;
  formaPagamentoId?: number;
  cliente?: FinanceCliente;
  categoria?: FinanceCategoria;
  contaBancaria?: FinanceContaBancaria;
  formaPagamento?: FinanceFormaPagamento;
  parcelas?: FinanceParcela[];
}

export interface FinanceContaPagar {
  id: number;
  descricao: string;
  valorTotal: number;
  valorPago: number;
  valorPendente: number;
  dataEmissao: string;
  dataVencimento: string;
  dataPagamento?: string;
  status: string;
  numeroParcelas: number;
  recorrente: boolean;
  frequenciaRecorrencia?: string;
  observacoes?: string;
  fornecedor?: FinanceFornecedor;
  categoria?: FinanceCategoria;
  contaBancaria?: FinanceContaBancaria;
  formaPagamento?: FinanceFormaPagamento;
  parcelas?: FinanceParcela[];
}

export interface FinanceItemFatura {
  descricao: string;
  quantidade: number;
  valorUnitario: number;
  valorTotal?: number;
}

export interface FinanceFatura {
  id: number;
  numeroFatura: string;
  dataEmissao: string;
  dataVencimento: string;
  valorTotal: number;
  desconto: number;
  acrescimo: number;
  valorFinal: number;
  status: string;
  observacoes?: string;
  cliente?: FinanceCliente;
  itens?: FinanceItemFatura[];
  contaReceber?: FinanceContaReceber;
}

export interface FinanceConfiguracaoAlerta {
  contasVencerAtivo: boolean;
  contasVencerDias: number;
  contasVencidasAtivo: boolean;
  limiteContaBancariaAtivo: boolean;
  limiteContaBancariaValor?: number;
  emailNotificacao: boolean;
  notificacaoSistema: boolean;
}

export interface FinanceAlerta {
  id: number;
  tipo: string;
  titulo: string;
  mensagem: string;
  severidade: string;
  lido: boolean;
  createdAt: string;
}

// API - Categorias
export const getCategorias = (tipo?: 'RECEITA' | 'DESPESA') => {
  const query = tipo ? `?tipo=${tipo}` : '';
  return authClient().get<FinanceCategoria[]>(`/finance/categorias${query}`);
};

export const getCategoria = (id: number) => {
  return authClient().get<FinanceCategoria>(`/finance/categorias/${id}`);
};

export const createCategoria = (data: Omit<FinanceCategoria, 'id' | 'usuarioId'>) => {
  return authClient().post<FinanceCategoria>('/finance/categorias', data);
};

export const updateCategoria = (id: number, data: Partial<FinanceCategoria>) => {
  return authClient().patch<FinanceCategoria>(`/finance/categorias/${id}`, data);
};

export const deleteCategoria = (id: number) => {
  return authClient().delete(`/finance/categorias/${id}`);
};

// API - Formas de Pagamento
export const getFormasPagamento = () => {
  return authClient().get<FinanceFormaPagamento[]>('/finance/formas-pagamento');
};

export const getFormaPagamento = (id: number) => {
  return authClient().get<FinanceFormaPagamento>(`/finance/formas-pagamento/${id}`);
};

export const createFormaPagamento = (data: Omit<FinanceFormaPagamento, 'id'>) => {
  return authClient().post<FinanceFormaPagamento>('/finance/formas-pagamento', data);
};

export const updateFormaPagamento = (id: number, data: Partial<FinanceFormaPagamento>) => {
  return authClient().patch<FinanceFormaPagamento>(`/finance/formas-pagamento/${id}`, data);
};

export const deleteFormaPagamento = (id: number) => {
  return authClient().delete(`/finance/formas-pagamento/${id}`);
};

// API - Contas Bancárias
export const getContasBancarias = () => {
  return authClient().get<FinanceContaBancaria[]>('/finance/contas-bancarias');
};

export const getContaBancariaPrincipal = () => {
  return authClient().get<FinanceContaBancaria>('/finance/contas-bancarias/principal');
};

export const getContaBancaria = (id: number) => {
  return authClient().get<FinanceContaBancaria>(`/finance/contas-bancarias/${id}`);
};

export const createContaBancaria = (data: Omit<FinanceContaBancaria, 'id' | 'saldoAtual'>) => {
  return authClient().post<FinanceContaBancaria>('/finance/contas-bancarias', data);
};

export const updateContaBancaria = (id: number, data: Partial<FinanceContaBancaria>) => {
  return authClient().patch<FinanceContaBancaria>(`/finance/contas-bancarias/${id}`, data);
};

export const deleteContaBancaria = (id: number) => {
  return authClient().delete(`/finance/contas-bancarias/${id}`);
};

// API - Clientes
const clientesApi = {
  list: (incluirInativos = false) => {
    const query = incluirInativos ? '?todos=true' : '';
    return authClient().get<FinanceCliente[]>(`/finance/clientes${query}`);
  },

  search: (q: string) => {
    return authClient().get<FinanceCliente[]>(`/finance/clientes/buscar?q=${encodeURIComponent(q)}`);
  },

  getById: (id: number) => {
    return authClient().get<FinanceCliente>(`/finance/clientes/${id}`);
  },

  create: (data: Omit<FinanceCliente, 'id' | 'contasReceber' | 'faturas' | 'createdAt' | 'updatedAt'>) => {
    return authClient().post<FinanceCliente>('/finance/clientes', data);
  },

  update: (id: number, data: Partial<FinanceCliente>) => {
    return authClient().patch<FinanceCliente>(`/finance/clientes/${id}`, data);
  },

  delete: (id: number) => {
    return authClient().delete(`/finance/clientes/${id}`);
  },
};

// Manter backward compatibility
export const getClientes = () => clientesApi.list();
export const buscarClientes = (q: string) => clientesApi.search(q);
export const getCliente = (id: number) => clientesApi.getById(id);
export const createCliente = (data: Omit<FinanceCliente, 'id' | 'contasReceber' | 'faturas' | 'createdAt' | 'updatedAt'>) => clientesApi.create(data);
export const updateCliente = (id: number, data: Partial<FinanceCliente>) => clientesApi.update(id, data);
export const deleteCliente = (id: number) => clientesApi.delete(id);

// API - Fornecedores
export const getFornecedores = () => {
  return authClient().get<FinanceFornecedor[]>('/finance/fornecedores');
};

export const buscarFornecedores = (q: string) => {
  return authClient().get<FinanceFornecedor[]>(`/finance/fornecedores/buscar?q=${encodeURIComponent(q)}`);
};

export const getFornecedor = (id: number) => {
  return authClient().get<FinanceFornecedor>(`/finance/fornecedores/${id}`);
};

export const createFornecedor = (data: Omit<FinanceFornecedor, 'id' | 'contasPagar'>) => {
  return authClient().post<FinanceFornecedor>('/finance/fornecedores', data);
};

export const updateFornecedor = (id: number, data: Partial<FinanceFornecedor>) => {
  return authClient().patch<FinanceFornecedor>(`/finance/fornecedores/${id}`, data);
};

export const deleteFornecedor = (id: number) => {
  return authClient().delete(`/finance/fornecedores/${id}`);
};

// API - Contas a Receber
export const getContasReceber = (filtros?: {
  categoriaId?: number;
  status?: string;
  clienteId?: number;
  dataInicio?: string;
  dataFim?: string;
}) => {
  const queryParams = new URLSearchParams();
  if (filtros?.categoriaId) queryParams.append('categoriaId', filtros.categoriaId.toString());
  if (filtros?.status) queryParams.append('status', filtros.status);
  if (filtros?.clienteId) queryParams.append('clienteId', filtros.clienteId.toString());
  if (filtros?.dataInicio) queryParams.append('dataInicio', filtros.dataInicio);
  if (filtros?.dataFim) queryParams.append('dataFim', filtros.dataFim);
  
  const query = queryParams.toString() ? `?${queryParams.toString()}` : '';
  return authClient().get<FinanceContaReceber[]>(`/finance/contas-receber${query}`);
};

export const getResumoContasReceber = () => {
  return authClient().get<{
    totalPendente: number;
    totalPago: number;
    totalVencido: number;
    totalMes: number;
    contasPendentes: number;
    contasVencidas: number;
    contasPagas: number;
    proximosRecebimentos: any[];
  }>('/finance/contas-receber/resumo');
};

export const getContaReceber = (id: number) => {
  return authClient().get<FinanceContaReceber>(`/finance/contas-receber/${id}`);
};

export const createContaReceber = (data: any) => {
  return authClient().post<FinanceContaReceber>('/finance/contas-receber', data);
};

export const updateContaReceber = (id: number, data: any) => {
  return authClient().put<FinanceContaReceber>(`/finance/contas-receber/${id}`, data);
};

export const registrarPagamentoReceber = (
  id: number, 
  data: { 
    valor: number; 
    dataPagamento: string;
    formaPagamentoId?: number;
    contaBancariaId?: number;
    observacoes?: string;
  }
) => {
  return authClient().post<FinanceContaReceber>(`/finance/contas-receber/${id}/pagamento`, data);
};

export const deleteContaReceber = (id: number) => {
  return authClient().delete(`/finance/contas-receber/${id}`);
};

// API - Contas a Pagar
export const getContasPagar = (filtros?: {
  categoriaId?: number;
  status?: string;
  fornecedorId?: number;
  dataInicio?: string;
  dataFim?: string;
}) => {
  const queryParams = new URLSearchParams();
  if (filtros?.categoriaId) queryParams.append('categoriaId', filtros.categoriaId.toString());
  if (filtros?.status) queryParams.append('status', filtros.status);
  if (filtros?.fornecedorId) queryParams.append('fornecedorId', filtros.fornecedorId.toString());
  if (filtros?.dataInicio) queryParams.append('dataInicio', filtros.dataInicio);
  if (filtros?.dataFim) queryParams.append('dataFim', filtros.dataFim);
  
  const query = queryParams.toString() ? `?${queryParams.toString()}` : '';
  return authClient().get<FinanceContaPagar[]>(`/finance/contas-pagar${query}`);
};

export const getResumoContasPagar = () => {
  return authClient().get<{
    totalPagar: number;
    totalPago: number;
    totalPendente: number;
    totalVencidas: number;
  }>('/finance/contas-pagar/resumo');
};

export const getContaPagar = (id: number) => {
  return authClient().get<FinanceContaPagar>(`/finance/contas-pagar/${id}`);
};

export const createContaPagar = (data: any) => {
  return authClient().post<FinanceContaPagar>('/finance/contas-pagar', data);
};

export const updateContaPagar = (id: number, data: any) => {
  return authClient().patch<FinanceContaPagar>(`/finance/contas-pagar/${id}`, data);
};

export const registrarPagamentoPagar = (id: number, data: { valor: number; dataPagamento: string }) => {
  return authClient().post<FinanceContaPagar>(`/finance/contas-pagar/${id}/pagamento`, data);
};

export const deleteContaPagar = (id: number) => {
  return authClient().delete(`/finance/contas-pagar/${id}`);
};

// API - Faturas
export const getFaturas = (filtros?: {
  status?: string;
  clienteId?: number;
  dataInicio?: string;
  dataFim?: string;
}) => {
  const queryParams = new URLSearchParams();
  if (filtros?.status) queryParams.append('status', filtros.status);
  if (filtros?.clienteId) queryParams.append('clienteId', filtros.clienteId.toString());
  if (filtros?.dataInicio) queryParams.append('dataInicio', filtros.dataInicio);
  if (filtros?.dataFim) queryParams.append('dataFim', filtros.dataFim);
  
  const query = queryParams.toString() ? `?${queryParams.toString()}` : '';
  return authClient().get<FinanceFatura[]>(`/finance/faturas${query}`);
};

export const getFatura = (id: number) => {
  return authClient().get<FinanceFatura>(`/finance/faturas/${id}`);
};

export const createFatura = (data: {
  clienteId: number;
  dataEmissao: string;
  dataVencimento: string;
  itens: FinanceItemFatura[];
  desconto?: number;
  acrescimo?: number;
  observacoes?: string;
  categoriaId?: number;
  contaBancariaId?: number;
  formaPagamentoId?: number;
}) => {
  return authClient().post<FinanceFatura>('/finance/faturas', data);
};

export const updateFatura = (id: number, data: any) => {
  return authClient().patch<FinanceFatura>(`/finance/faturas/${id}`, data);
};

export const deleteFatura = (id: number) => {
  return authClient().delete(`/finance/faturas/${id}`);
};

// API - Alertas
export const getAlertas = (apenasNaoLidos?: boolean) => {
  const query = apenasNaoLidos ? '?apenasNaoLidos=true' : '';
  return authClient().get<FinanceAlerta[]>(`/finance/alertas${query}`);
};

export const getContadorAlertasNaoLidos = () => {
  return authClient().get<number>('/finance/alertas/contador-nao-lidos');
};

export const getConfiguracaoAlerta = () => {
  return authClient().get<FinanceConfiguracaoAlerta>('/finance/alertas/configuracao');
};

export const createConfiguracaoAlerta = (data: FinanceConfiguracaoAlerta) => {
  return authClient().post<FinanceConfiguracaoAlerta>('/finance/alertas/configuracao', data);
};

export const updateConfiguracaoAlerta = (data: Partial<FinanceConfiguracaoAlerta>) => {
  return authClient().patch<FinanceConfiguracaoAlerta>('/finance/alertas/configuracao', data);
};

export const marcarAlertaComoLido = (id: number) => {
  return authClient().patch(`/finance/alertas/${id}/marcar-lido`);
};

export const marcarTodosAlertasComoLidos = () => {
  return authClient().patch('/finance/alertas/marcar-todos-lidos');
};

export const deleteAlerta = (id: number) => {
  return authClient().delete(`/finance/alertas/${id}`);
};

export const gerarAlertas = () => {
  return authClient().post('/finance/alertas/gerar');
};

// Export API organizada
export const financeApi = {
  clientes: clientesApi,
};

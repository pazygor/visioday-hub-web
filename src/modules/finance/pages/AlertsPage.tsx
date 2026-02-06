import { useState, useEffect } from 'react';
import { getAlertas, marcarAlertaComoLido, marcarTodosAlertasComoLidos, type FinanceAlerta } from '../../../services/api/finance.api';

export const AlertsPage = () => {
  const [alertas, setAlertas] = useState<FinanceAlerta[]>([]);
  const [loading, setLoading] = useState(true);
  const [filtroLido, setFiltroLido] = useState(false);

  useEffect(() => {
    carregarAlertas();
  }, [filtroLido]);

  const carregarAlertas = async () => {
    try {
      setLoading(true);
      const response = await getAlertas(filtroLido);
      setAlertas(response);
    } catch (error) {
      console.error('Erro ao carregar alertas:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleMarcarLido = async (id: number) => {
    try {
      await marcarAlertaComoLido(id);
      carregarAlertas();
    } catch (error) {
      console.error('Erro ao marcar alerta como lido:', error);
    }
  };

  const handleMarcarTodosLidos = async () => {
    try {
      await marcarTodosAlertasComoLidos();
      carregarAlertas();
    } catch (error) {
      console.error('Erro ao marcar todos como lidos:', error);
    }
  };

  const getSeveridadeStyle = (severidade: string) => {
    switch (severidade) {
      case 'CRITICO':
        return { bg: 'bg-red-100', text: 'text-red-800', icon: 'bg-red-100 text-red-600' };
      case 'AVISO':
        return { bg: 'bg-yellow-100', text: 'text-yellow-800', icon: 'bg-yellow-100 text-yellow-600' };
      case 'INFO':
        return { bg: 'bg-blue-100', text: 'text-blue-800', icon: 'bg-blue-100 text-blue-600' };
      default:
        return { bg: 'bg-gray-100', text: 'text-gray-800', icon: 'bg-gray-100 text-gray-600' };
    }
  };

  const formatarDataRelativa = (data: string) => {
    const agora = new Date();
    const dataAlerta = new Date(data);
    const diferencaMs = agora.getTime() - dataAlerta.getTime();
    const diferencaHoras = Math.floor(diferencaMs / (1000 * 60 * 60));
    const diferencaDias = Math.floor(diferencaMs / (1000 * 60 * 60 * 24));

    if (diferencaHoras < 1) return 'Agora';
    if (diferencaHoras < 24) return `Há ${diferencaHoras} hora${diferencaHoras > 1 ? 's' : ''}`;
    return `Há ${diferencaDias} dia${diferencaDias > 1 ? 's' : ''}`;
  };

  const alertasNaoLidos = alertas.filter(a => !a.lido);
  const alertasHoje = alertas.filter(a => {
    const dataAlerta = new Date(a.createdAt);
    const hoje = new Date();
    return dataAlerta.toDateString() === hoje.toDateString();
  });

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Alertas Financeiros</h1>
        <p className="text-gray-600">Configure e monitore alertas importantes</p>
      </div>

      {/* Estatísticas de Alertas */}
      <div className="grid gap-6 md:grid-cols-3 mb-6">
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-sm font-medium text-gray-600">Alertas Ativos</h3>
            {alertasNaoLidos.length > 0 && (
              <span className="flex h-3 w-3 relative">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3 w-3 bg-red-500"></span>
              </span>
            )}
          </div>
          <p className="text-2xl font-bold text-gray-900">{alertasNaoLidos.length}</p>
          <p className="text-sm text-gray-500 mt-1">Requerem atenção</p>
        </div>

        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-sm font-medium text-gray-600">Alertas Hoje</h3>
            <div className="p-2 bg-orange-50 rounded-lg">
              <svg className="w-5 h-5 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
              </svg>
            </div>
          </div>
          <p className="text-2xl font-bold text-gray-900">{alertasHoje.length}</p>
          <p className="text-sm text-gray-500 mt-1">Novos alertas</p>
        </div>

        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-sm font-medium text-gray-600">Total</h3>
            <div className="p-2 bg-green-50 rounded-lg">
              <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
          </div>
          <p className="text-2xl font-bold text-gray-900">{alertas.length}</p>
          <p className="text-sm text-gray-500 mt-1">Todos os alertas</p>
        </div>
      </div>

      {/* Lista de Alertas */}
      <div className="bg-white rounded-lg border border-gray-200">
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div className="flex items-center gap-4">
              <h2 className="text-lg font-semibold text-gray-900">Alertas Recentes</h2>
              <div className="flex gap-2">
                <button
                  onClick={() => setFiltroLido(false)}
                  className={`px-3 py-1 text-sm rounded-lg transition-colors ${
                    !filtroLido
                      ? 'bg-[#9B0310] text-white'
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  Não Lidos
                </button>
                <button
                  onClick={() => setFiltroLido(true)}
                  className={`px-3 py-1 text-sm rounded-lg transition-colors ${
                    filtroLido
                      ? 'bg-[#9B0310] text-white'
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  Todos
                </button>
              </div>
            </div>
            <div className="flex gap-2">
              <button
                onClick={handleMarcarTodosLidos}
                className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
              >
                Marcar Todos Lidos
              </button>
              <button className="px-4 py-2 bg-[#9B0310] text-white rounded-lg hover:bg-[#7A0209] transition-colors">
                Configurar Alertas
              </button>
            </div>
          </div>
        </div>
        
        <div className="divide-y divide-gray-200">
          {loading ? (
            <div className="p-12 text-center text-gray-500">Carregando alertas...</div>
          ) : alertas.length === 0 ? (
            <div className="p-12 text-center text-gray-500">Nenhum alerta encontrado</div>
          ) : (
            alertas.map((alerta) => {
              const style = getSeveridadeStyle(alerta.severidade);
              return (
                <div
                  key={alerta.id}
                  className={`p-6 hover:bg-gray-50 transition-colors ${alerta.lido ? 'opacity-60' : ''}`}
                >
                  <div className="flex items-start gap-4">
                    <div className={`p-2 ${style.icon} rounded-lg flex-shrink-0`}>
                      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        {alerta.severidade === 'CRITICO' && (
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                        )}
                        {alerta.severidade === 'AVISO' && (
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        )}
                        {alerta.severidade === 'INFO' && (
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        )}
                      </svg>
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-1">
                        <h3 className="font-semibold text-gray-900">{alerta.titulo}</h3>
                        <div className="flex items-center gap-2">
                          <span className={`px-3 py-1 ${style.bg} ${style.text} text-xs font-medium rounded-full`}>
                            {alerta.severidade === 'CRITICO' && 'Crítico'}
                            {alerta.severidade === 'AVISO' && 'Aviso'}
                            {alerta.severidade === 'INFO' && 'Info'}
                          </span>
                          {!alerta.lido && (
                            <button
                              onClick={() => handleMarcarLido(alerta.id)}
                              className="text-sm text-blue-600 hover:text-blue-800"
                            >
                              Marcar como lido
                            </button>
                          )}
                        </div>
                      </div>
                      <p className="text-gray-600 text-sm mb-2">{alerta.mensagem}</p>
                      <div className="flex items-center gap-4 text-sm text-gray-500">
                        <span>{formatarDataRelativa(alerta.createdAt)}</span>
                        {alerta.lido && (
                          <>
                            <span>•</span>
                            <span className="text-green-600">✓ Lido</span>
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
};

import { useAuth } from '@/modules/auth/hooks/useAuth'

export const DashboardPage = () => {
  const { user } = useAuth()

  return (
    <div className="space-y-6">
      {/* Welcome Section */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">
          Bem-vindo de volta, {user?.name}! 👋
        </h1>
        <p className="text-gray-600">
          Aqui está um resumo do seu sistema de gestão de abertura PJ.
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-medium text-gray-600">Prospecção</h3>
            <div className="w-10 h-10 rounded-lg bg-red-100 flex items-center justify-center">
              <span className="text-red-600 text-xl">📊</span>
            </div>
          </div>
          <p className="text-3xl font-bold text-gray-900">124</p>
          <p className="text-xs text-gray-500 mt-1">Empresas em prospecção</p>
        </div>

        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-medium text-gray-600">Pré-Aprovados</h3>
            <div className="w-10 h-10 rounded-lg bg-green-100 flex items-center justify-center">
              <span className="text-green-600 text-xl">✓</span>
            </div>
          </div>
          <p className="text-3xl font-bold text-gray-900">48</p>
          <p className="text-xs text-gray-500 mt-1">Aprovações pendentes</p>
        </div>

        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-medium text-gray-600">Em Abordagem</h3>
            <div className="w-10 h-10 rounded-lg bg-purple-100 flex items-center justify-center">
              <span className="text-purple-600 text-xl">💬</span>
            </div>
          </div>
          <p className="text-3xl font-bold text-gray-900">32</p>
          <p className="text-xs text-gray-500 mt-1">Contatos ativos</p>
        </div>

        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-medium text-gray-600">Aberturas</h3>
            <div className="w-10 h-10 rounded-lg bg-orange-100 flex items-center justify-center">
              <span className="text-orange-600 text-xl">📁</span>
            </div>
          </div>
          <p className="text-3xl font-bold text-gray-900">18</p>
          <p className="text-xs text-gray-500 mt-1">Processos em andamento</p>
        </div>
      </div>

      {/* Quick Info */}
      <div className="grid gap-6 md:grid-cols-2">
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Seu Perfil</h3>
          <dl className="space-y-3">
            <div>
              <dt className="text-sm text-gray-500">Nome</dt>
              <dd className="text-sm font-medium text-gray-900 mt-1">{user?.name}</dd>
            </div>
            <div>
              <dt className="text-sm text-gray-500">Email</dt>
              <dd className="text-sm font-medium text-gray-900 mt-1">{user?.email}</dd>
            </div>
            <div>
              <dt className="text-sm text-gray-500">Função</dt>
              <dd className="text-sm font-medium text-gray-900 mt-1 capitalize">{user?.role}</dd>
            </div>
          </dl>
        </div>

        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Status do Sistema</h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Autenticação</span>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-green-500" />
                <span className="text-sm font-medium text-gray-900">Ativo</span>
              </div>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">API</span>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-green-500" />
                <span className="text-sm font-medium text-gray-900">Online</span>
              </div>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Sincronização</span>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-green-500" />
                <span className="text-sm font-medium text-gray-900">Ativa</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

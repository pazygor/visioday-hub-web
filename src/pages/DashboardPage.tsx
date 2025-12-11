import { useAuth } from '@/modules/auth/hooks/useAuth'
import { Button } from '@/components/ui/Button'
import { LogOut } from 'lucide-react'

export const DashboardPage = () => {
  const { user, logout } = useAuth()

  return (
    <div className="min-h-screen bg-background p-8">
      <div className="max-w-4xl mx-auto">
        {/* Header com Logo */}
        <div className="flex justify-between items-center mb-8">
          <div className="flex items-center gap-4">
            <img 
              src="/images/logos/logo-visionday.png" 
              alt="VisionDay Hub" 
              className="h-10 w-auto object-contain"
            />
            <div className="border-l border-border pl-4">
              <h1 className="text-3xl font-bold text-foreground">Dashboard</h1>
              <p className="text-muted-foreground mt-1">
                Bem-vindo de volta, {user?.name}!
              </p>
            </div>
          </div>

          <Button variant="outline" onClick={logout} className="gap-2">
            <LogOut className="h-4 w-4" />
            Sair
          </Button>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          <div className="rounded-lg border bg-card p-6">
            <h3 className="font-semibold text-foreground mb-2">Perfil</h3>
            <dl className="space-y-1 text-sm">
              <div>
                <dt className="text-muted-foreground">Nome:</dt>
                <dd className="font-medium text-foreground">{user?.name}</dd>
              </div>
              <div>
                <dt className="text-muted-foreground">Email:</dt>
                <dd className="font-medium text-foreground">{user?.email}</dd>
              </div>
              <div>
                <dt className="text-muted-foreground">Função:</dt>
                <dd className="font-medium text-foreground capitalize">{user?.role}</dd>
              </div>
            </dl>
          </div>

          <div className="rounded-lg border bg-card p-6">
            <h3 className="font-semibold text-foreground mb-2">Status</h3>
            <div className="flex items-center gap-2">
              <div className="h-2 w-2 rounded-full bg-success" />
              <span className="text-sm text-muted-foreground">Autenticado</span>
            </div>
          </div>

          <div className="rounded-lg border bg-card p-6">
            <h3 className="font-semibold text-foreground mb-2">Próximos passos</h3>
            <p className="text-sm text-muted-foreground">
              Aqui será o conteúdo principal da aplicação.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

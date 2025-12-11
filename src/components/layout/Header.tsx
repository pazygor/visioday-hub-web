import { useState, useRef, useEffect } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { ChevronRight, User, Settings, LogOut, Menu } from 'lucide-react'
import { useAuth } from '@/modules/auth/hooks/useAuth'

interface BreadcrumbItem {
  label: string
  path?: string
  icon?: React.ReactNode
}

const routeConfig: Record<string, BreadcrumbItem[]> = {
  '/dashboard': [
    { label: 'Home', path: '/dashboard' }
  ],
  '/prospecting': [
    { label: 'Home', path: '/dashboard' },
    { label: 'Etapa 1: Prospecção' }
  ],
  '/pre-approval': [
    { label: 'Home', path: '/dashboard' },
    { label: 'Etapa 2: Pré-Aprovados' }
  ],
  '/approach': [
    { label: 'Home', path: '/dashboard' },
    { label: 'Etapa 3: Abordagem' }
  ],
  '/opening': [
    { label: 'Home', path: '/dashboard' },
    { label: 'Etapa 4: Abertura' }
  ],
  '/flowchart': [
    { label: 'Home', path: '/dashboard' },
    { label: 'Fluxograma' }
  ],
  '/functional-design': [
    { label: 'Home', path: '/dashboard' },
    { label: 'Desenho Funcional' }
  ]
}

interface HeaderProps {
  onMenuClick: () => void
}

export const Header = ({ onMenuClick }: HeaderProps) => {
  const location = useLocation()
  const { user, logout } = useAuth()
  const [dropdownOpen, setDropdownOpen] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)

  const breadcrumbs = routeConfig[location.pathname] || [{ label: 'Home', path: '/dashboard' }]

  // Gerar iniciais do usuário
  const getInitials = (name: string) => {
    const names = name.trim().split(' ')
    if (names.length === 1) return names[0].substring(0, 2).toUpperCase()
    return (names[0][0] + names[names.length - 1][0]).toUpperCase()
  }

  // Fechar dropdown ao clicar fora
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setDropdownOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  return (
    <header className="h-16 bg-[#F9FAFB] border-b border-gray-200 flex items-center justify-between px-4 md:px-6 fixed top-0 left-0 lg:left-64 right-0 z-40">
      {/* Left side - Menu + Breadcrumbs */}
      <div className="flex items-center gap-4">
        {/* Botão Menu Hambúrguer (mobile/tablet) */}
        <button
          onClick={onMenuClick}
          className="lg:hidden text-gray-600 hover:text-[#0066B1] p-2 hover:bg-gray-100 rounded-lg transition-colors"
          aria-label="Abrir menu"
        >
          <Menu className="w-6 h-6" />
        </button>

        {/* Breadcrumbs */}
        <nav className="flex items-center gap-2 text-sm">
          {breadcrumbs.map((item, index) => (
            <div key={index} className="flex items-center gap-2">
              {index > 0 && <ChevronRight className="w-4 h-4 text-gray-400" />}
              {item.path ? (
                <Link
                  to={item.path}
                  className="text-gray-600 hover:text-[#0066B1] transition-colors hidden sm:inline"
                >
                  {item.label}
                </Link>
              ) : (
                <span className="text-gray-900 font-medium truncate max-w-[150px] sm:max-w-none">
                  {item.label}
                </span>
              )}
            </div>
          ))}
        </nav>
      </div>

      {/* User Menu */}
      <div className="relative" ref={dropdownRef}>
        <button
          onClick={() => setDropdownOpen(!dropdownOpen)}
          className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-gray-100 transition-colors"
        >
          {/* Avatar com iniciais */}
          <div className="w-10 h-10 rounded-full bg-[#0066B1] flex items-center justify-center text-white font-semibold text-sm">
            {user ? getInitials(user.name) : 'U'}
          </div>
          
          {/* Nome e Email */}
          <div className="text-left hidden md:block">
            <p className="text-sm font-medium text-gray-900">{user?.name || 'Usuário'}</p>
            <p className="text-xs text-gray-500">{user?.email || 'user@email.com'}</p>
          </div>
        </button>

        {/* Dropdown Menu */}
        {dropdownOpen && (
          <div className="absolute right-0 mt-2 w-64 bg-white rounded-lg shadow-lg border border-gray-200 py-2">
            {/* User Info */}
            <div className="px-4 py-3 border-b border-gray-100">
              <p className="text-sm font-medium text-gray-900">{user?.name || 'Usuário'}</p>
              <p className="text-xs text-gray-500">{user?.email || 'user@email.com'}</p>
              <p className="text-xs text-gray-400 mt-1 capitalize">
                {user?.role || 'admin'}
              </p>
            </div>

            {/* Menu Items */}
            <div className="py-2">
              <Link
                to="/profile"
                className="flex items-center gap-3 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                onClick={() => setDropdownOpen(false)}
              >
                <User className="w-4 h-4" />
                Meu Perfil
              </Link>
              
              <Link
                to="/settings"
                className="flex items-center gap-3 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                onClick={() => setDropdownOpen(false)}
              >
                <Settings className="w-4 h-4" />
                Configurações
              </Link>
            </div>

            {/* Logout */}
            <div className="border-t border-gray-100 pt-2">
              <button
                onClick={() => {
                  setDropdownOpen(false)
                  logout()
                }}
                className="w-full flex items-center gap-3 px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors"
              >
                <LogOut className="w-4 h-4" />
                Sair
              </button>
            </div>
          </div>
        )}
      </div>
    </header>
  )
}

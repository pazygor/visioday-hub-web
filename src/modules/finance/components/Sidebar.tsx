import { Link, useLocation } from 'react-router-dom'
import { useState } from 'react'
import { 
  Home, 
  DollarSign, 
  TrendingDown, 
  TrendingUp, 
  Bell, 
  Tag, 
  FileText, 
  FilePlus,
  ChevronDown,
  ChevronRight,
  Settings, 
  LogOut, 
  X,
  Users
} from 'lucide-react'
import { useAuth } from '@/modules/auth/hooks/useAuth'

interface SidebarProps {
  isOpen: boolean
  onClose: () => void
}

interface MenuItem {
  id: string
  label: string
  icon: JSX.Element
  path?: string
  submenu?: {
    id: string
    label: string
    path: string
  }[]
}

const menuItems: MenuItem[] = [
  // Menu Financeiro
  {
    id: 'financeiro',
    label: 'Financeiro',
    icon: <DollarSign className="w-5 h-5" />,
    submenu: [
      { id: 'dashboard', label: 'Dashboard', path: '/finance/dashboard' },
      { id: 'receivables', label: 'Contas a Receber', path: '/finance/receivables' },
      { id: 'payables', label: 'Contas a Pagar', path: '/finance/payables' },
      { id: 'cashflow', label: 'Fluxo de Caixa', path: '/finance/cashflow' },
      { id: 'alerts', label: 'Alertas', path: '/finance/alerts' },
      { id: 'categories', label: 'Categorias', path: '/finance/categories' },
    ],
  },
  // Menu Faturamento
  {
    id: 'faturamento',
    label: 'Faturamento',
    icon: <FileText className="w-5 h-5" />,
    submenu: [
      { id: 'invoices', label: 'Faturas', path: '/finance/invoices' },
      { id: 'create-invoice', label: 'Gerar Fatura', path: '/finance/invoices/create' },
    ],
  },
  // Menu Cadastro
  {
    id: 'cadastro',
    label: 'Cadastro',
    icon: <Users className="w-5 h-5" />,
    submenu: [
      { id: 'clients', label: 'Clientes', path: '/finance/clients' },
    ],
  },
  // Configurações (sem submenu)
  {
    id: 'settings',
    label: 'Configurações',
    icon: <Settings className="w-5 h-5" />,
    path: '/finance/settings',
  },
]

export const Sidebar = ({ isOpen, onClose }: SidebarProps) => {
  const location = useLocation()
  const { logout } = useAuth()
  const [expandedMenus, setExpandedMenus] = useState<string[]>(['financeiro', 'faturamento', 'cadastro'])

  const isActive = (path: string) => location.pathname === path
  
  const isMenuExpanded = (menuId: string) => expandedMenus.includes(menuId)
  
  const toggleMenu = (menuId: string) => {
    setExpandedMenus(prev =>
      prev.includes(menuId)
        ? prev.filter(id => id !== menuId)
        : [...prev, menuId]
    )
  }

  const handleLinkClick = () => {
    if (window.innerWidth < 1024) {
      onClose()
    }
  }

  return (
    <>
      {/* Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`
          w-64 h-screen bg-[#9B0310] text-white flex flex-col fixed left-0 top-0 z-50 transition-transform duration-300
          ${isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
        `}
      >
        {/* Header */}
        <div className="p-6 space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <img 
                src="/images/logos/logo-visionday-no-bg.png" 
                alt="VisionDay" 
                className="h-8 w-auto object-contain brightness-0 invert"
              />
            </div>
            <button
              onClick={onClose}
              className="lg:hidden text-white hover:bg-white/10 p-2 rounded-lg transition-colors cursor-pointer"
              aria-label="Fechar menu"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
          <div>
            <h2 className="text-lg font-bold text-white">VisionDay Finance</h2>
            <p className="text-sm text-white/80">Gestão Financeira</p>
          </div>
        </div>

        <div className="border-t border-white/20 mx-4" />

        {/* Menu Items */}
        <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
          {menuItems.map((item) => (
            <div key={item.id}>
              {/* Menu com submenu */}
              {item.submenu ? (
                <>
                  <button
                    onClick={() => toggleMenu(item.id)}
                    className="w-full flex items-center justify-between gap-3 px-4 py-3 rounded-lg text-white/90 hover:bg-white/10 hover:text-white transition-all duration-200 cursor-pointer"
                  >
                    <div className="flex items-center gap-3">
                      {item.icon}
                      <span className="text-sm font-medium">{item.label}</span>
                    </div>
                    {isMenuExpanded(item.id) ? (
                      <ChevronDown className="w-4 h-4" />
                    ) : (
                      <ChevronRight className="w-4 h-4" />
                    )}
                  </button>
                  
                  {/* Submenu */}
                  {isMenuExpanded(item.id) && (
                    <div className="ml-4 mt-1 space-y-1">
                      {item.submenu.map((subItem) => (
                        <Link
                          key={subItem.id}
                          to={subItem.path}
                          onClick={handleLinkClick}
                          className={`
                            flex items-center gap-3 px-4 py-2 rounded-lg transition-all duration-200 text-sm
                            ${isActive(subItem.path)
                              ? 'bg-[#7A0209] text-white font-medium'
                              : 'text-white/80 hover:bg-white/10 hover:text-white'
                            }
                          `}
                        >
                          <span>{subItem.label}</span>
                        </Link>
                      ))}
                    </div>
                  )}
                </>
              ) : (
                /* Menu simples sem submenu */
                <Link
                  to={item.path!}
                  onClick={handleLinkClick}
                  className={`
                    flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200
                    ${isActive(item.path!)
                      ? 'bg-[#7A0209] text-white font-medium'
                      : 'text-white/90 hover:bg-white/10 hover:text-white'
                    }
                  `}
                >
                  {item.icon}
                  <span className="text-sm">{item.label}</span>
                </Link>
              )}
            </div>
          ))}
        </nav>

        <div className="border-t border-white/20 mx-4" />

        {/* Botão Sair */}
        <div className="p-4">
          <button
            onClick={logout}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-white/90 hover:bg-white/10 hover:text-white transition-all duration-200 cursor-pointer"
          >
            <LogOut className="w-5 h-5" />
            <span className="text-sm font-medium">Sair</span>
          </button>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-white/20">
          <p className="text-xs text-white/60 text-center">
            © 2026 VisionDay Finance
          </p>
        </div>
      </aside>
    </>
  )
}

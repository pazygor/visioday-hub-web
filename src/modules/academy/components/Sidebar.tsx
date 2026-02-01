import { Link, useLocation } from 'react-router-dom'
import { Home, BookOpen, Video, Award, Calendar, Settings, LogOut, X } from 'lucide-react'
import { useAuth } from '@/modules/auth/hooks/useAuth'

interface SidebarProps {
  isOpen: boolean
  onClose: () => void
}

const menuItems = [
  { id: 'dashboard', label: 'Dashboard', icon: <Home className="w-5 h-5" />, path: '/academy/dashboard' },
  { id: 'courses', label: 'Meus Cursos', icon: <BookOpen className="w-5 h-5" />, path: '/academy/courses' },
  { id: 'catalog', label: 'Catálogo', icon: <Video className="w-5 h-5" />, path: '/academy/catalog' },
  { id: 'certificates', label: 'Certificados', icon: <Award className="w-5 h-5" />, path: '/academy/certificates' },
  { id: 'schedule', label: 'Agenda', icon: <Calendar className="w-5 h-5" />, path: '/academy/schedule' },
  { id: 'settings', label: 'Configurações', icon: <Settings className="w-5 h-5" />, path: '/academy/settings' },
]

export const Sidebar = ({ isOpen, onClose }: SidebarProps) => {
  const location = useLocation()
  const { logout } = useAuth()

  const isActive = (path: string) => location.pathname === path

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
              className="lg:hidden text-white hover:bg-white/10 p-2 rounded-lg transition-colors"
              aria-label="Fechar menu"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
          <div>
            <h2 className="text-lg font-bold text-white">VisionDay Academy</h2>
            <p className="text-sm text-white/80">Educação</p>
          </div>
        </div>

        <div className="border-t border-white/20 mx-4" />

        {/* Menu Items */}
        <nav className="flex-1 px-3 py-4 space-y-1">
          {menuItems.map((item) => (
            <Link
              key={item.id}
              to={item.path}
              onClick={handleLinkClick}
              className={`
                flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200
                ${isActive(item.path)
                  ? 'bg-[#7A0209] text-white font-medium'
                  : 'text-white/90 hover:bg-white/10 hover:text-white'
                }
              `}
            >
              {item.icon}
              <span className="text-sm">{item.label}</span>
            </Link>
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
            © 2026 VisionDay Academy
          </p>
        </div>
      </aside>
    </>
  )
}

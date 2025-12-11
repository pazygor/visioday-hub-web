import { useState } from 'react'
import type { ReactNode } from 'react'
import { Sidebar } from './Sidebar'
import { Header } from './Header'

interface AppLayoutProps {
  children: ReactNode
}

export const AppLayout = ({ children }: AppLayoutProps) => {
  const [sidebarOpen, setSidebarOpen] = useState(false)

  return (
    <div className="min-h-screen bg-[#F9FAFB]">
      {/* Sidebar fixa à esquerda (responsiva com menu hambúrguer) */}
      <Sidebar 
        isOpen={sidebarOpen} 
        onClose={() => setSidebarOpen(false)} 
      />

      {/* Container principal com margem para sidebar */}
      <div className="lg:ml-64">
        {/* Header fixo no topo */}
        <Header onMenuClick={() => setSidebarOpen(true)} />

        {/* Conteúdo principal com margem para header */}
        <main className="mt-16 p-4 md:p-6">
          {children}
        </main>
      </div>
    </div>
  )
}

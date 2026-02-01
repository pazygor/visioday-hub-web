import { Outlet } from 'react-router-dom'
import { AcademyProvider } from '../contexts/AcademyContext'
import { Sidebar } from './Sidebar'
import { Header } from '@/components/layout/Header'
import { useState } from 'react'

export const AcademyLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false)

  return (
    <AcademyProvider>
      <div className="min-h-screen bg-[#F9FAFB]">
        <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
        <Header onMenuClick={() => setSidebarOpen(true)} />
        
        <main className="lg:ml-64 pt-16">
          <div className="p-4 md:p-6 lg:p-8">
            <Outlet />
          </div>
        </main>
      </div>
    </AcademyProvider>
  )
}

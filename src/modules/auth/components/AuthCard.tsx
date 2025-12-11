import type { ReactNode } from 'react'
import { cn } from '@/utils/cn'

interface AuthCardProps {
  children: ReactNode
  className?: string
}

export const AuthCard = ({ children, className }: AuthCardProps) => {
  return (
    <div
      className={cn(
        'w-full bg-card rounded-lg lg:rounded-2xl shadow-sm lg:shadow-xl p-6 md:p-8 border border-border',
        className
      )}
    >
      {children}
    </div>
  )
}

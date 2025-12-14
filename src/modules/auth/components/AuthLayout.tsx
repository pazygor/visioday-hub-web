import type { ReactNode } from 'react'

interface AuthLayoutProps {
  children: ReactNode
  imageContent?: ReactNode
}

export const AuthLayout = ({ children, imageContent }: AuthLayoutProps) => {
  return (
    <div className="min-h-screen flex flex-col lg:flex-row bg-background">
      {/* Imagem lateral - apenas desktop */}
      {imageContent && (
        <div className="hidden lg:flex lg:w-1/2 bg-[#9B0310] flex-col items-center justify-center p-12">
          {/* Logo no topo da sidebar */}
          <div className="absolute top-8 left-8">
            <img 
              src="/images/logos/logo-visionday-no-bg.png" 
              alt="VisionDay Hub" 
              className="h-10 w-auto object-contain brightness-0 invert"
            />
          </div>
          
          {/* Conteúdo centralizado */}
          {imageContent}
        </div>
      )}

      {/* Conteúdo principal */}
      <div className="flex-1 flex items-center justify-center p-4 md:p-8 lg:p-12">
        <div className="w-full max-w-md">{children}</div>
      </div>
    </div>
  )
}

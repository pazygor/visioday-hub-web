interface AuthHeaderProps {
  title: string
  subtitle?: string
  showLogo?: boolean
}

export const AuthHeader = ({ title, subtitle, showLogo = true }: AuthHeaderProps) => {
  return (
    <div className="text-center mb-8">
      {showLogo && (
        <div className="mb-6 flex justify-center">
          <img 
            src="/images/logos/logo-mttechne.png" 
            alt="Mttechne DataHub" 
            className="h-12 w-auto object-contain"
          />
        </div>
      )}

      <h2 className="text-2xl font-bold text-foreground mb-2">{title}</h2>

      {subtitle && <p className="text-muted-foreground text-sm">{subtitle}</p>}
    </div>
  )
}

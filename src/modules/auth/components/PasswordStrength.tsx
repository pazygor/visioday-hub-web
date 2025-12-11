import { useMemo } from 'react'
import { Check, X } from 'lucide-react'
import { cn } from '@/utils/cn'

interface PasswordStrengthProps {
  password: string
  showRequirements?: boolean
}

export const PasswordStrength = ({ password, showRequirements = true }: PasswordStrengthProps) => {
  const strength = useMemo(() => {
    if (!password) return { score: 0, label: '', color: '' }

    let score = 0

    // Critérios de força
    if (password.length >= 8) score++
    if (password.length >= 12) score++
    if (/[a-z]/.test(password)) score++
    if (/[A-Z]/.test(password)) score++
    if (/\d/.test(password)) score++
    if (/[@$!%*?&]/.test(password)) score++

    // Classificação
    if (score <= 2) return { score: 20, label: 'Muito fraca', color: 'bg-red-500' }
    if (score === 3) return { score: 40, label: 'Fraca', color: 'bg-orange-500' }
    if (score === 4) return { score: 60, label: 'Média', color: 'bg-yellow-500' }
    if (score === 5) return { score: 80, label: 'Forte', color: 'bg-green-400' }
    return { score: 100, label: 'Muito forte', color: 'bg-green-600' }
  }, [password])

  const requirements = useMemo(() => {
    return [
      { met: password.length >= 8, label: 'Mínimo 8 caracteres' },
      { met: /[A-Z]/.test(password), label: '1 letra maiúscula' },
      { met: /[a-z]/.test(password), label: '1 letra minúscula' },
      { met: /\d/.test(password), label: '1 número' },
      { met: /[@$!%*?&]/.test(password), label: '1 caractere especial (!@#$%...)' }
    ]
  }, [password])

  if (!password) return null

  return (
    <div className="space-y-3">
      {/* Barra de progresso */}
      <div className="space-y-2">
        <div className="h-2 w-full bg-muted rounded-full overflow-hidden">
          <div
            className={cn('h-full transition-all duration-300', strength.color)}
            style={{ width: `${strength.score}%` }}
          />
        </div>
        <p className="text-sm font-medium text-foreground">{strength.label}</p>
      </div>

      {/* Requisitos */}
      {showRequirements && (
        <div className="space-y-1.5">
          <p className="text-sm font-medium text-foreground">Requisitos:</p>
          {requirements.map((req, index) => (
            <div key={index} className="flex items-center gap-2 text-sm">
              {req.met ? (
                <Check className="h-4 w-4 text-success flex-shrink-0" />
              ) : (
                <X className="h-4 w-4 text-muted-foreground flex-shrink-0" />
              )}
              <span className={cn(req.met ? 'text-foreground' : 'text-muted-foreground')}>
                {req.label}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

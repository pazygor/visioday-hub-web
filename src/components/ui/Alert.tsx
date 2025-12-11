import { AlertCircle, CheckCircle2, Info, X, XCircle } from 'lucide-react'
import { cn } from '@/utils/cn'

export interface AlertProps {
  variant: 'success' | 'error' | 'warning' | 'info'
  title?: string
  description: string
  onClose?: () => void
  className?: string
}

const Alert = ({ variant, title, description, onClose, className }: AlertProps) => {
  const variants = {
    success: {
      container: 'bg-success/10 text-success border-success/20',
      icon: CheckCircle2
    },
    error: {
      container: 'bg-destructive/10 text-destructive border-destructive/20',
      icon: XCircle
    },
    warning: {
      container: 'bg-warning/10 text-warning border-warning/20',
      icon: AlertCircle
    },
    info: {
      container: 'bg-info/10 text-info border-info/20',
      icon: Info
    }
  }

  const { container, icon: Icon } = variants[variant]

  return (
    <div
      role="alert"
      aria-live="assertive"
      className={cn(
        'relative w-full rounded-lg border p-4',
        'flex items-start gap-3',
        container,
        className
      )}
    >
      <Icon className="h-5 w-5 flex-shrink-0 mt-0.5" aria-hidden="true" />

      <div className="flex-1 space-y-1">
        {title && <h5 className="font-semibold text-sm leading-none">{title}</h5>}
        <p className="text-sm leading-relaxed opacity-90">{description}</p>
      </div>

      {onClose && (
        <button
          type="button"
          onClick={onClose}
          className="flex-shrink-0 opacity-70 hover:opacity-100 transition-opacity focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 rounded"
          aria-label="Fechar alerta"
        >
          <X className="h-4 w-4" />
        </button>
      )}
    </div>
  )
}

Alert.displayName = 'Alert'

export { Alert }

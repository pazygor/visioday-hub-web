import { forwardRef } from 'react'
import { Check } from 'lucide-react'
import { cn } from '@/utils/cn'

export interface CheckboxProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'type'> {
  label?: string | React.ReactNode
  error?: string
}

const Checkbox = forwardRef<HTMLInputElement, CheckboxProps>(
  ({ className, label, error, id, ...props }, ref) => {
    const checkboxId = id || `checkbox-${Math.random().toString(36).substr(2, 9)}`
    const errorId = error ? `${checkboxId}-error` : undefined

    return (
      <div className="w-full">
        <div className="flex items-start gap-2">
          <div className="relative flex items-center">
            <input
              ref={ref}
              type="checkbox"
              id={checkboxId}
              aria-invalid={!!error}
              aria-describedby={errorId}
              className={cn(
                'peer h-5 w-5 shrink-0 appearance-none rounded border-2 cursor-pointer',
                'transition-all duration-200',
                'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2',
                'disabled:cursor-not-allowed disabled:opacity-50',
                'hover:border-primary/70',
                error
                  ? 'border-destructive'
                  : 'border-input hover:border-primary',
                'checked:bg-primary checked:border-primary',
                className
              )}
              {...props}
            />
            <Check
              className={cn(
                'absolute left-0.5 top-0.5 h-4 w-4 text-primary-foreground pointer-events-none',
                'opacity-0 peer-checked:opacity-100 transition-opacity'
              )}
              strokeWidth={3}
            />
          </div>

          {label && (
            <label
              htmlFor={checkboxId}
              className="text-sm text-foreground leading-snug cursor-pointer select-none peer-disabled:cursor-not-allowed peer-disabled:opacity-50"
            >
              {label}
            </label>
          )}
        </div>

        {error && (
          <p id={errorId} role="alert" className="mt-1.5 text-sm text-destructive ml-7">
            {error}
          </p>
        )}
      </div>
    )
  }
)

Checkbox.displayName = 'Checkbox'

export { Checkbox }

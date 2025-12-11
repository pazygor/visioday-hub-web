import { forwardRef, useState } from 'react'
import { Eye, EyeOff } from 'lucide-react'
import { Input } from './Input'
import type { InputProps } from './Input'

export interface PasswordInputProps extends Omit<InputProps, 'type' | 'rightIcon'> {
  showStrength?: boolean
}

const PasswordInput = forwardRef<HTMLInputElement, PasswordInputProps>(
  ({ className, showStrength = false, ...props }, ref) => {
    const [showPassword, setShowPassword] = useState(false)

    const togglePasswordVisibility = () => {
      setShowPassword((prev) => !prev)
    }

    const rightIcon = (
      <button
        type="button"
        onClick={togglePasswordVisibility}
        className="text-muted-foreground hover:text-foreground transition-colors focus:outline-none cursor-pointer"
        tabIndex={-1}
        aria-label={showPassword ? 'Ocultar senha' : 'Mostrar senha'}
      >
        {showPassword ? (
          <EyeOff className="h-5 w-5" aria-hidden="true" />
        ) : (
          <Eye className="h-5 w-5" aria-hidden="true" />
        )}
      </button>
    )

    return (
      <Input
        ref={ref}
        type={showPassword ? 'text' : 'password'}
        rightIcon={rightIcon}
        className={className}
        {...props}
      />
    )
  }
)

PasswordInput.displayName = 'PasswordInput'

export { PasswordInput }

import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { AlertCircle, Loader2 } from 'lucide-react'
import { AuthLayout } from '../components/AuthLayout'
import { AuthCard } from '../components/AuthCard'
import { AuthHeader } from '../components/AuthHeader'
import { PasswordStrength } from '../components/PasswordStrength'
import { Button } from '@/components/ui/Button'
import { PasswordInput } from '@/components/ui/PasswordInput'
import { Alert } from '@/components/ui/Alert'
import { useResetPassword } from '../hooks/useResetPassword'
import { authService } from '../services/authService'
import { resetPasswordSchema, type ResetPasswordFormData } from '../schemas/resetPasswordSchema'

export const ResetPasswordPage = () => {
  const { token } = useParams<{ token: string }>()
  const { resetPassword, isLoading, error } = useResetPassword()
  const [isValidatingToken, setIsValidatingToken] = useState(true)
  const [tokenValid, setTokenValid] = useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch
  } = useForm<ResetPasswordFormData>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: {
      password: '',
      confirmPassword: ''
    }
  })

  const password = watch('password')

  useEffect(() => {
    const validateToken = async () => {
      if (!token) {
        setIsValidatingToken(false)
        return
      }

      try {
        const result = await authService.validateResetToken(token)
        setTokenValid(result.valid)
      } catch {
        setTokenValid(false)
      } finally {
        setIsValidatingToken(false)
      }
    }

    validateToken()
  }, [token])

  const onSubmit = (data: ResetPasswordFormData) => {
    if (!token) return
    resetPassword(token, data.password)
  }

  if (isValidatingToken) {
    return (
      <AuthLayout>
        <AuthCard>
          <div className="text-center py-8 space-y-4">
            <Loader2 className="h-8 w-8 animate-spin mx-auto text-primary" />
            <p className="text-muted-foreground">Validando link...</p>
          </div>
        </AuthCard>
      </AuthLayout>
    )
  }

  if (!token || !tokenValid) {
    return (
      <AuthLayout>
        <AuthCard>
          <div className="text-center space-y-6">
            <div className="flex justify-center">
              <div className="w-16 h-16 rounded-full bg-destructive/10 flex items-center justify-center">
                <AlertCircle className="w-8 h-8 text-destructive" />
              </div>
            </div>

            <div className="space-y-2">
              <h2 className="text-2xl font-bold text-foreground">Link inválido ou expirado</h2>
              <p className="text-muted-foreground">
                Este link de recuperação é inválido ou já expirou.
              </p>
            </div>

            <div className="space-y-3">
              <Link to="/forgot-password">
                <Button fullWidth>Solicitar novo link</Button>
              </Link>
              <Link
                to="/login"
                className="block text-sm text-primary hover:text-primary/80 hover:underline transition-colors cursor-pointer focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 rounded px-1"
              >
                Voltar para login
              </Link>
            </div>
          </div>
        </AuthCard>
      </AuthLayout>
    )
  }

  return (
    <AuthLayout>
      <AuthCard>
        <AuthHeader
          title="Criar nova senha"
          subtitle="Crie uma senha forte e segura para sua conta"
          showLogo={false}
        />

        {error && <Alert variant="error" description={error} className="mb-6" />}

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <PasswordInput
            label="Nova senha"
            placeholder="••••••••"
            autoComplete="new-password"
            error={errors.password?.message}
            {...register('password')}
          />

          {password && (
            <div className="mt-3">
              <PasswordStrength password={password} />
            </div>
          )}

          <PasswordInput
            label="Confirmar senha"
            placeholder="••••••••"
            autoComplete="new-password"
            error={errors.confirmPassword?.message}
            {...register('confirmPassword')}
          />

          <Button type="submit" fullWidth isLoading={isLoading}>
            {isLoading ? 'Redefinindo...' : 'Redefinir senha'}
          </Button>
        </form>

        <p className="text-center text-sm text-muted-foreground mt-6">
          Lembrou sua senha?{' '}
          <Link
            to="/login"
            className="text-primary font-medium hover:text-primary/80 hover:underline transition-colors cursor-pointer focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 rounded px-1"
          >
            Fazer login
          </Link>
        </p>
      </AuthCard>
    </AuthLayout>
  )
}

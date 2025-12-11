import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { ArrowLeft, Mail, CheckCircle2 } from 'lucide-react'
import { AuthLayout } from '../components/AuthLayout'
import { AuthCard } from '../components/AuthCard'
import { AuthHeader } from '../components/AuthHeader'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Alert } from '@/components/ui/Alert'
import { useForgotPassword } from '../hooks/useForgotPassword'
import { forgotPasswordSchema, type ForgotPasswordFormData } from '../schemas/forgotPasswordSchema'

export const ForgotPasswordPage = () => {
  const { forgotPassword, isLoading, error, success } = useForgotPassword()
  const [resendTimer, setResendTimer] = useState(0)

  const {
    register,
    handleSubmit,
    formState: { errors },
    getValues
  } = useForm<ForgotPasswordFormData>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: {
      email: ''
    }
  })

  useEffect(() => {
    if (resendTimer > 0) {
      const timer = setTimeout(() => setResendTimer(resendTimer - 1), 1000)
      return () => clearTimeout(timer)
    }
  }, [resendTimer])

  const onSubmit = (data: ForgotPasswordFormData) => {
    forgotPassword(data.email)
    setResendTimer(60)
  }

  const handleResend = () => {
    const email = getValues('email')
    forgotPassword(email)
    setResendTimer(60)
  }

  if (success) {
    return (
      <AuthLayout>
        <AuthCard>
          <div className="text-center space-y-6">
            <div className="flex justify-center">
              <div className="w-16 h-16 rounded-full bg-success/10 flex items-center justify-center">
                <CheckCircle2 className="w-8 h-8 text-success" />
              </div>
            </div>

            <div className="space-y-2">
              <h2 className="text-2xl font-bold text-foreground">Email enviado!</h2>
              <p className="text-muted-foreground">
                Enviamos as instruções de recuperação para:
              </p>
              <p className="font-medium text-foreground">{getValues('email')}</p>
            </div>

            <Alert
              variant="info"
              description="Verifique sua caixa de entrada e a pasta de spam. O link expira em 1 hora."
            />

            <div className="space-y-3">
              <Link to="/login">
                <Button fullWidth>Voltar para login</Button>
              </Link>

              {resendTimer > 0 ? (
                <p className="text-sm text-muted-foreground">
                  Reenviar email em {resendTimer}s
                </p>
              ) : (
                <button
                  type="button"
                  onClick={handleResend}
                  className="text-sm text-primary hover:text-primary/80 hover:underline transition-colors cursor-pointer focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 rounded px-1"
                >
                  Não recebeu? Reenviar email
                </button>
              )}
            </div>
          </div>
        </AuthCard>
      </AuthLayout>
    )
  }

  return (
    <AuthLayout>
      <AuthCard>
        <Link
          to="/login"
          className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors cursor-pointer mb-6 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 rounded px-1"
        >
          <ArrowLeft className="h-4 w-4" />
          Voltar para login
        </Link>

        <AuthHeader
          title="Esqueceu sua senha?"
          subtitle="Sem problemas! Digite seu email e enviaremos as instruções de recuperação."
          showLogo={false}
        />

        {error && <Alert variant="error" description={error} className="mb-6" />}

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <Input
            label="Email"
            type="email"
            placeholder="seu@email.com"
            autoComplete="email"
            leftIcon={<Mail className="h-5 w-5" />}
            error={errors.email?.message}
            {...register('email')}
          />

          <Button type="submit" fullWidth isLoading={isLoading}>
            {isLoading ? 'Enviando...' : 'Enviar link de recuperação'}
          </Button>
        </form>
      </AuthCard>
    </AuthLayout>
  )
}

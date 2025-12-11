import { Link } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Mail, User } from 'lucide-react'
import { AuthLayout } from '../components/AuthLayout'
import { AuthCard } from '../components/AuthCard'
import { AuthHeader } from '../components/AuthHeader'
import { Divider } from '../components/Divider'
import { SocialLogin } from '../components/SocialLogin'
import { PasswordStrength } from '../components/PasswordStrength'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { PasswordInput } from '@/components/ui/PasswordInput'
import { Checkbox } from '@/components/ui/Checkbox'
import { Alert } from '@/components/ui/Alert'
import { useRegister } from '../hooks/useRegister'
import { registerSchema, type RegisterFormData } from '../schemas/registerSchema'

export const RegisterPage = () => {
  const { register: registerUser, isLoading, error } = useRegister()

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      name: '',
      email: '',
      password: '',
      confirmPassword: '',
      acceptTerms: false
    }
  })

  const password = watch('password')
  const acceptTerms = watch('acceptTerms')

  const onSubmit = (data: RegisterFormData) => {
    registerUser({
      name: data.name,
      email: data.email,
      password: data.password
    })
  }

  const imageContent = (
    <div className="text-white space-y-6 max-w-md">
      <h2 className="text-4xl font-bold text-white">Junte-se ao VisionDay Hub</h2>
      <p className="text-lg text-white/95">Crie sua conta e tenha acesso aos benefícios:</p>
      <ul className="space-y-4">
        <li className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-primary/30 flex items-center justify-center text-white font-bold">✓</div>
          <span className="text-white">Acesso completo à plataforma</span>
        </li>
        <li className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-primary/30 flex items-center justify-center text-white font-bold">✓</div>
          <span className="text-white">Gestão contábil digital</span>
        </li>
        <li className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-primary/30 flex items-center justify-center text-white font-bold">✓</div>
          <span className="text-white">Relatórios e analytics</span>
        </li>
        <li className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-primary/30 flex items-center justify-center text-white font-bold">✓</div>
          <span className="text-white">Suporte dedicado</span>
        </li>
      </ul>
    </div>
  )

  return (
    <AuthLayout imageContent={imageContent}>
      <AuthCard>
        <AuthHeader title="Criar sua conta" subtitle="Junte-se ao VisionDay Hub" />

        {error && <Alert variant="error" description={error} className="mb-6" />}

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <Input
            label="Nome completo"
            type="text"
            placeholder="João da Silva"
            autoComplete="name"
            leftIcon={<User className="h-5 w-5" />}
            error={errors.name?.message}
            {...register('name')}
          />

          <Input
            label="Email"
            type="email"
            placeholder="seu@email.com"
            autoComplete="email"
            leftIcon={<Mail className="h-5 w-5" />}
            error={errors.email?.message}
            {...register('email')}
          />

          <div className="space-y-3">
            <PasswordInput
              label="Senha"
              placeholder="••••••••"
              autoComplete="new-password"
              error={errors.password?.message}
              {...register('password')}
            />

            {password && <PasswordStrength password={password} />}
          </div>

          <PasswordInput
            label="Confirmar senha"
            placeholder="••••••••"
            autoComplete="new-password"
            error={errors.confirmPassword?.message}
            {...register('confirmPassword')}
          />

          <Checkbox
            label={
              <span className="text-sm">
                Aceito os{' '}
                <a href="/terms" target="_blank" className="text-primary hover:underline">
                  Termos de Uso
                </a>{' '}
                e{' '}
                <a href="/privacy" target="_blank" className="text-primary hover:underline">
                  Política de Privacidade
                </a>
              </span>
            }
            checked={acceptTerms}
            error={errors.acceptTerms?.message}
            {...register('acceptTerms')}
          />

          <Button type="submit" fullWidth isLoading={isLoading}>
            {isLoading ? 'Criando conta...' : 'Criar conta'}
          </Button>
        </form>

        <Divider />

        <SocialLogin />

        <p className="text-center text-sm text-muted-foreground mt-6">
          Já tem uma conta?{' '}
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

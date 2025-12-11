import { Link } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Mail } from 'lucide-react'
import { AuthLayout } from '../components/AuthLayout'
import { AuthCard } from '../components/AuthCard'
import { AuthHeader } from '../components/AuthHeader'
import { Divider } from '../components/Divider'
import { SocialLogin } from '../components/SocialLogin'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { PasswordInput } from '@/components/ui/PasswordInput'
import { Checkbox } from '@/components/ui/Checkbox'
import { Alert } from '@/components/ui/Alert'
import { useLogin } from '../hooks/useLogin'
import { loginSchema, type LoginFormData } from '../schemas/loginSchema'

export const LoginPage = () => {
  const { login, isLoading, error } = useLogin()

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: '',
      rememberMe: false
    }
  })

  const rememberMe = watch('rememberMe')

  const onSubmit = (data: LoginFormData) => {
    login(data)
  }

  const imageContent = (
    <div className="text-white space-y-6 max-w-md">
      <h2 className="text-4xl font-bold text-white">Bem-vindo ao VisionDay Hub</h2>
      <p className="text-lg text-white/95">
        Sua plataforma completa de contabilidade digital
      </p>
      <ul className="space-y-4">
        <li className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-primary/30 flex items-center justify-center text-white font-bold">✓</div>
          <span className="text-white">Gestão financeira completa</span>
        </li>
        <li className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-primary/30 flex items-center justify-center text-white font-bold">✓</div>
          <span className="text-white">Documentos fiscais digitais</span>
        </li>
        <li className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-primary/30 flex items-center justify-center text-white font-bold">✓</div>
          <span className="text-white">Relatórios e dashboards</span>
        </li>
      </ul>
    </div>
  )

  return (
    <AuthLayout imageContent={imageContent}>
      <AuthCard>
        <AuthHeader title="Bem-vindo de volta" subtitle="Acesse sua conta para continuar" />

        {error && <Alert variant="error" description={error} className="mb-6" />}

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <Input
            label="Email"
            type="email"
            placeholder="seu@email.com"
            autoComplete="email"
            leftIcon={<Mail className="h-5 w-5" />}
            error={errors.email?.message}
            {...register('email')}
          />

          <PasswordInput
            label="Senha"
            placeholder="••••••••"
            autoComplete="current-password"
            error={errors.password?.message}
            {...register('password')}
          />

          <div className="flex items-center justify-between">
            <Checkbox label="Lembrar-me" checked={rememberMe} {...register('rememberMe')} />

            <Link
              to="/forgot-password"
              className="text-sm text-primary hover:text-primary/80 hover:underline transition-colors cursor-pointer focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 rounded px-1"
            >
              Esqueci minha senha
            </Link>
          </div>

          <Button type="submit" fullWidth isLoading={isLoading}>
            {isLoading ? 'Entrando...' : 'Entrar'}
          </Button>
        </form>

        <Divider />

        <SocialLogin />

        <p className="text-center text-sm text-muted-foreground mt-6">
          Não tem uma conta?{' '}
          <Link
            to="/register"
            className="text-primary font-medium hover:text-primary/80 hover:underline transition-colors cursor-pointer focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 rounded px-1"
          >
            Criar conta
          </Link>
        </p>
      </AuthCard>
    </AuthLayout>
  )
}

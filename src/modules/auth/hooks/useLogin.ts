import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { authService } from '../services/authService'
import { useAuth } from './useAuth'
import toast from 'react-hot-toast'
import type { LoginRequest } from '../types/auth.types'

export const useLogin = () => {
  const navigate = useNavigate()
  const { setUser, setToken } = useAuth()
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const login = async (data: LoginRequest) => {
    try {
      setIsLoading(true)
      setError(null)

      const response = await authService.login(data)

      setUser(response.user)
      setToken(response.token)

      // Salvar refreshToken se "lembrar-me" estiver marcado
      if (data.rememberMe && response.refreshToken) {
        localStorage.setItem('refreshToken', response.refreshToken)
      }

      toast.success('Login realizado com sucesso!')

      // Redirecionar baseado nos sistemas que o usuário tem acesso
      const userSystems = response.user.systems || []
      
      if (userSystems.length === 0) {
        toast.error('Usuário sem acesso a sistemas')
        return
      }
      
      if (userSystems.length === 1) {
        // Se tem apenas 1 sistema, redireciona direto
        const system = userSystems[0]
        navigate(`/${system}/dashboard`)
      } else {
        // Se tem mais de 1 sistema, vai para tela de escolha
        navigate('/choose-system')
      }
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Erro ao fazer login'
      setError(message)
      toast.error(message)
    } finally {
      setIsLoading(false)
    }
  }

  return { login, isLoading, error }
}

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
      navigate('/dashboard')
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

import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { authService } from '../services/authService'
import { useAuth } from './useAuth'
import toast from 'react-hot-toast'
import type { RegisterRequest } from '../types/auth.types'

export const useRegister = () => {
  const navigate = useNavigate()
  const { setUser, setToken } = useAuth()
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const register = async (data: RegisterRequest) => {
    try {
      setIsLoading(true)
      setError(null)

      const response = await authService.register(data)

      setUser(response.user)
      setToken(response.token)

      if (response.refreshToken) {
        localStorage.setItem('refreshToken', response.refreshToken)
      }

      toast.success('Conta criada com sucesso!')
      navigate('/dashboard')
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Erro ao criar conta'
      setError(message)
      toast.error(message)
    } finally {
      setIsLoading(false)
    }
  }

  return { register, isLoading, error }
}

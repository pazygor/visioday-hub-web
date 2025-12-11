import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { authService } from '../services/authService'
import toast from 'react-hot-toast'

export const useResetPassword = () => {
  const navigate = useNavigate()
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const resetPassword = async (token: string, password: string) => {
    try {
      setIsLoading(true)
      setError(null)

      await authService.resetPassword({ token, password })

      toast.success('Senha redefinida com sucesso!')
      navigate('/login')
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Erro ao redefinir senha'
      setError(message)
      toast.error(message)
    } finally {
      setIsLoading(false)
    }
  }

  return { resetPassword, isLoading, error }
}

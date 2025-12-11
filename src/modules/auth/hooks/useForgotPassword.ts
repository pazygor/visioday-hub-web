import { useState } from 'react'
import { authService } from '../services/authService'
import toast from 'react-hot-toast'

export const useForgotPassword = () => {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)

  const forgotPassword = async (email: string) => {
    try {
      setIsLoading(true)
      setError(null)
      setSuccess(false)

      await authService.forgotPassword({ email })

      setSuccess(true)
      toast.success('Email enviado com sucesso!')
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Erro ao enviar email'
      setError(message)
      toast.error(message)
    } finally {
      setIsLoading(false)
    }
  }

  const reset = () => {
    setError(null)
    setSuccess(false)
  }

  return { forgotPassword, isLoading, error, success, reset }
}

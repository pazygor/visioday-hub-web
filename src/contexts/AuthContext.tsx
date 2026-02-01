import { createContext, useState, useEffect, useCallback, type ReactNode } from 'react'
import type { User, SystemType } from '@/modules/auth/types/auth.types'

interface AuthContextData {
  user: User | null
  token: string | null
  isAuthenticated: boolean
  isLoading: boolean
  setUser: (user: User | null) => void
  setToken: (token: string | null) => void
  setCurrentSystem: (system: SystemType) => void
  logout: () => void
}

export const AuthContext = createContext<AuthContextData>({} as AuthContextData)

interface AuthProviderProps {
  children: ReactNode
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [user, setUser] = useState<User | null>(null)
  const [token, setToken] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  // Carrega dados do localStorage ao iniciar
  useEffect(() => {
    const loadStoredAuth = () => {
      try {
        const storedToken = localStorage.getItem('token')
        const storedUser = localStorage.getItem('user')

        if (storedToken && storedUser) {
          setToken(storedToken)
          setUser(JSON.parse(storedUser))
        }
      } catch (error) {
        console.error('Erro ao carregar autenticação:', error)
        localStorage.removeItem('token')
        localStorage.removeItem('user')
        localStorage.removeItem('refreshToken')
      } finally {
        setIsLoading(false)
      }
    }

    loadStoredAuth()
  }, [])

  // Atualiza localStorage quando token muda
  useEffect(() => {
    if (token) {
      localStorage.setItem('token', token)
    } else {
      localStorage.removeItem('token')
    }
  }, [token])

  // Atualiza localStorage quando user muda
  useEffect(() => {
    if (user) {
      localStorage.setItem('user', JSON.stringify(user))
    } else {
      localStorage.removeItem('user')
    }
  }, [user])

  const setCurrentSystem = useCallback((system: SystemType) => {
    if (user) {
      const updatedUser = { ...user, currentSystem: system }
      setUser(updatedUser)
    }
  }, [user])

  const logout = useCallback(() => {
    setUser(null)
    setToken(null)
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    localStorage.removeItem('refreshToken')
  }, [])

  const value = {
    user,
    token,
    isAuthenticated: !!user && !!token,
    isLoading,
    setUser,
    setToken,
    setCurrentSystem,
    logout
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

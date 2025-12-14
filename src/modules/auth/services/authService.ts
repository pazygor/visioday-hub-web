import type {
  LoginRequest,
  LoginResponse,
  RegisterRequest,
  ForgotPasswordRequest,
  ResetPasswordRequest
} from '../types/auth.types'

// Mock de usuário válido
const MOCK_USER = {
  email: 'dayane_paz@gmail.com',
  password: 'Pazygor080@',
  user: {
    id: '1',
    name: 'Dayane Paz',
    email: 'dayane_paz@gmail.com',
    role: 'admin'
  }
}

// Simula delay de rede
const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms))

// Flag para controlar se deve usar API real ou mock
const USE_MOCK = true // Mude para false quando tiver a API real
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api'

export const authService = {
  /**
   * Login do usuário
   * Mock: valida credenciais contra MOCK_USER
   * API: POST /auth/login
   */
  login: async (data: LoginRequest): Promise<LoginResponse> => {
    if (USE_MOCK) {
      await delay(800) // Simula latência

      if (data.email === MOCK_USER.email && data.password === MOCK_USER.password) {
        return {
          token: 'mock-jwt-token-' + Date.now(),
          refreshToken: 'mock-refresh-token-' + Date.now(),
          user: MOCK_USER.user
        }
      } else {
        throw new Error('Email ou senha incorretos')
      }
    } else {
      // Implementação real com API
      const response = await fetch(`${API_URL}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.message || 'Erro ao fazer login')
      }

      return response.json()
    }
  },

  /**
   * Cadastro de novo usuário
   * Mock: aceita qualquer cadastro e retorna sucesso
   * API: POST /auth/register
   */
  register: async (data: RegisterRequest): Promise<LoginResponse> => {
    if (USE_MOCK) {
      await delay(1000)

      // Simula validação de email duplicado
      if (data.email === MOCK_USER.email) {
        throw new Error('Este email já está cadastrado')
      }

      return {
        token: 'mock-jwt-token-' + Date.now(),
        refreshToken: 'mock-refresh-token-' + Date.now(),
        user: {
          id: Math.random().toString(36).substr(2, 9),
          name: data.name,
          email: data.email,
          role: 'user'
        }
      }
    } else {
      const response = await fetch(`${API_URL}/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.message || 'Erro ao criar conta')
      }

      return response.json()
    }
  },

  /**
   * Solicitar recuperação de senha
   * Mock: sempre retorna sucesso
   * API: POST /auth/forgot-password
   */
  forgotPassword: async (data: ForgotPasswordRequest): Promise<void> => {
    if (USE_MOCK) {
      await delay(800)
      // Mock sempre retorna sucesso
      return
    } else {
      const response = await fetch(`${API_URL}/auth/forgot-password`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.message || 'Erro ao enviar email')
      }
    }
  },

  /**
   * Redefinir senha com token
   * Mock: sempre retorna sucesso
   * API: POST /auth/reset-password
   */
  resetPassword: async (data: ResetPasswordRequest): Promise<void> => {
    if (USE_MOCK) {
      await delay(800)
      // Mock sempre retorna sucesso
      return
    } else {
      const response = await fetch(`${API_URL}/auth/reset-password`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.message || 'Erro ao redefinir senha')
      }
    }
  },

  /**
   * Validar token de reset de senha
   * Mock: sempre retorna válido
   * API: GET /auth/validate-reset-token/:token
   */
  validateResetToken: async (token: string): Promise<{ valid: boolean }> => {
    if (USE_MOCK) {
      await delay(500)
      return { valid: true }
    } else {
      const response = await fetch(`${API_URL}/auth/validate-reset-token/${token}`)

      if (!response.ok) {
        return { valid: false }
      }

      return response.json()
    }
  },

  /**
   * Logout do usuário
   * Mock: apenas limpa o storage local
   * API: POST /auth/logout
   */
  logout: async (): Promise<void> => {
    if (USE_MOCK) {
      await delay(300)
      // Mock apenas simula
      return
    } else {
      const token = localStorage.getItem('token')
      await fetch(`${API_URL}/auth/logout`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        }
      })
    }
  },

  /**
   * Refresh token
   * Mock: retorna novo token mockado
   * API: POST /auth/refresh
   */
  refreshToken: async (refreshToken: string): Promise<{ token: string }> => {
    if (USE_MOCK) {
      await delay(500)
      return { token: 'mock-jwt-token-refreshed-' + Date.now() }
    } else {
      const response = await fetch(`${API_URL}/auth/refresh`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ refreshToken })
      })

      if (!response.ok) {
        throw new Error('Token expirado')
      }

      return response.json()
    }
  }
}

export type SystemType = 'digital' | 'finance' | 'academy'

export interface SystemAccess {
  id: SystemType
  name: string
  description: string
  icon: string
  enabled: boolean
}

export interface User {
  id: string
  name: string
  email: string
  role: string
  systems: SystemType[] // Sistemas que o usuário tem acesso
  currentSystem?: SystemType // Sistema atualmente selecionado
}

export interface LoginRequest {
  email: string
  password: string
  rememberMe?: boolean
}

export interface LoginResponse {
  token: string
  refreshToken: string
  user: User
}

export interface RegisterRequest {
  name: string
  email: string
  password: string
}

export interface ForgotPasswordRequest {
  email: string
}

export interface ResetPasswordRequest {
  token: string
  password: string
}

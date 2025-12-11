export interface User {
  id: string
  name: string
  email: string
  role: string
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

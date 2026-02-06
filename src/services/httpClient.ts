import environment from '@/config/environment'

interface RequestOptions extends RequestInit {
  timeout?: number
}

/**
 * Cliente HTTP configurado com base URL e timeout
 */
class HttpClient {
  private baseURL: string
  private defaultTimeout: number

  constructor(baseURL: string, timeout: number = 30000) {
    this.baseURL = baseURL
    this.defaultTimeout = timeout
  }

  /**
   * Requisição genérica com timeout
   */
  private async request<T>(
    endpoint: string,
    options: RequestOptions = {}
  ): Promise<T> {
    const { timeout = this.defaultTimeout, ...fetchOptions } = options
    
    const controller = new AbortController()
    const timeoutId = setTimeout(() => controller.abort(), timeout)

    try {
      const url = `${this.baseURL}${endpoint}`
      
      const response = await fetch(url, {
        ...fetchOptions,
        signal: controller.signal,
        headers: {
          'Content-Type': 'application/json',
          ...fetchOptions.headers,
        },
      })

      clearTimeout(timeoutId)

      if (!response.ok) {
        const error = await response.json().catch(() => ({ message: 'Erro na requisição' }))
        throw new Error(error.message || `Erro ${response.status}`)
      }

      return response.json()
    } catch (error) {
      clearTimeout(timeoutId)
      
      if (error instanceof Error) {
        if (error.name === 'AbortError') {
          throw new Error('Tempo de requisição excedido')
        }
        throw error
      }
      
      throw new Error('Erro desconhecido')
    }
  }

  /**
   * GET request
   */
  async get<T>(endpoint: string, options?: RequestOptions): Promise<T> {
    return this.request<T>(endpoint, { ...options, method: 'GET' })
  }

  /**
   * POST request
   */
  async post<T>(endpoint: string, data?: unknown, options?: RequestOptions): Promise<T> {
    return this.request<T>(endpoint, {
      ...options,
      method: 'POST',
      body: JSON.stringify(data),
    })
  }

  /**
   * PUT request
   */
  async put<T>(endpoint: string, data?: unknown, options?: RequestOptions): Promise<T> {
    return this.request<T>(endpoint, {
      ...options,
      method: 'PUT',
      body: JSON.stringify(data),
    })
  }

  /**
   * PATCH request
   */
  async patch<T>(endpoint: string, data?: unknown, options?: RequestOptions): Promise<T> {
    return this.request<T>(endpoint, {
      ...options,
      method: 'PATCH',
      body: JSON.stringify(data),
    })
  }

  /**
   * DELETE request
   */
  async delete<T>(endpoint: string, options?: RequestOptions): Promise<T> {
    return this.request<T>(endpoint, { ...options, method: 'DELETE' })
  }

  /**
   * Adiciona token de autorização
   */
  withAuth(token: string) {
    return {
      get: <T>(endpoint: string, options?: RequestOptions) =>
        this.get<T>(endpoint, {
          ...options,
          headers: { ...options?.headers, Authorization: `Bearer ${token}` },
        }),
      post: <T>(endpoint: string, data?: unknown, options?: RequestOptions) =>
        this.post<T>(endpoint, data, {
          ...options,
          headers: { ...options?.headers, Authorization: `Bearer ${token}` },
        }),
      put: <T>(endpoint: string, data?: unknown, options?: RequestOptions) =>
        this.put<T>(endpoint, data, {
          ...options,
          headers: { ...options?.headers, Authorization: `Bearer ${token}` },
        }),
      patch: <T>(endpoint: string, data?: unknown, options?: RequestOptions) =>
        this.patch<T>(endpoint, data, {
          ...options,
          headers: { ...options?.headers, Authorization: `Bearer ${token}` },
        }),
      delete: <T>(endpoint: string, options?: RequestOptions) =>
        this.delete<T>(endpoint, {
          ...options,
          headers: { ...options?.headers, Authorization: `Bearer ${token}` },
        }),
    }
  }
}

// Instância principal da API
export const api = new HttpClient(
  environment.api.baseURL,
  environment.api.timeout
)

// Instância para futuras APIs (quando necessário)
// export const api2 = new HttpClient(
//   environment.api2?.baseURL || '',
//   environment.api2?.timeout || 30000
// )

export default api

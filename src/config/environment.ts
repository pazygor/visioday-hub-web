/**
 * Configuração centralizada de ambientes e APIs
 */

interface Environment {
  mode: 'development' | 'production' | 'test'
  api: {
    baseURL: string
    timeout: number
  }
  // Futuras APIs podem ser adicionadas aqui
  api2?: {
    baseURL: string
    timeout: number
  }
}

const environment: Environment = {
  mode: (import.meta.env.MODE as Environment['mode']) || 'development',
  
  api: {
    baseURL: import.meta.env.VITE_API_URL || 'http://localhost:3000/api',
    timeout: 30000, // 30 segundos
  },
  
  // Exemplo de segunda API (quando necessário)
  // api2: {
  //   baseURL: import.meta.env.VITE_API2_URL || 'http://localhost:4000/api',
  //   timeout: 30000,
  // },
}

export default environment

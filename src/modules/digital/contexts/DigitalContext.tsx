import { createContext, useContext, useState, useEffect, type ReactNode } from 'react'

interface DigitalContextData {
  // Adicione aqui os estados e funções específicas do sistema Digital
  activeClients: number
  setActiveClients: (count: number) => void
}

const DigitalContext = createContext<DigitalContextData>({} as DigitalContextData)

export const DigitalProvider = ({ children }: { children: ReactNode }) => {
  const [activeClients, setActiveClients] = useState(0)

  // Inicialização ou carregamento de dados
  useEffect(() => {
    // Aqui você pode carregar dados iniciais do sistema Digital
    console.log('Digital System initialized')
  }, [])

  return (
    <DigitalContext.Provider
      value={{
        activeClients,
        setActiveClients
      }}
    >
      {children}
    </DigitalContext.Provider>
  )
}

export const useDigital = () => {
  const context = useContext(DigitalContext)
  if (!context) {
    throw new Error('useDigital must be used within DigitalProvider')
  }
  return context
}

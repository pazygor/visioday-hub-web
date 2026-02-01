import { createContext, useContext, useState, useEffect, type ReactNode } from 'react'

interface FinanceContextData {
  // Adicione aqui os estados e funções específicas do sistema Finance
  totalRevenue: number
  setTotalRevenue: (amount: number) => void
}

const FinanceContext = createContext<FinanceContextData>({} as FinanceContextData)

export const FinanceProvider = ({ children }: { children: ReactNode }) => {
  const [totalRevenue, setTotalRevenue] = useState(0)

  useEffect(() => {
    console.log('Finance System initialized')
  }, [])

  return (
    <FinanceContext.Provider
      value={{
        totalRevenue,
        setTotalRevenue
      }}
    >
      {children}
    </FinanceContext.Provider>
  )
}

export const useFinance = () => {
  const context = useContext(FinanceContext)
  if (!context) {
    throw new Error('useFinance must be used within FinanceProvider')
  }
  return context
}

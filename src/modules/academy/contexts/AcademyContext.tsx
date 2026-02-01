import { createContext, useContext, useState, useEffect, type ReactNode } from 'react'

interface AcademyContextData {
  // Adicione aqui os estados e funções específicas do sistema Academy
  enrolledCourses: number
  setEnrolledCourses: (count: number) => void
}

const AcademyContext = createContext<AcademyContextData>({} as AcademyContextData)

export const AcademyProvider = ({ children }: { children: ReactNode }) => {
  const [enrolledCourses, setEnrolledCourses] = useState(0)

  useEffect(() => {
    console.log('Academy System initialized')
  }, [])

  return (
    <AcademyContext.Provider
      value={{
        enrolledCourses,
        setEnrolledCourses
      }}
    >
      {children}
    </AcademyContext.Provider>
  )
}

export const useAcademy = () => {
  const context = useContext(AcademyContext)
  if (!context) {
    throw new Error('useAcademy must be used within AcademyProvider')
  }
  return context
}

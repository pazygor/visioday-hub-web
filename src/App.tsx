import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import { ThemeProvider } from '@/contexts/ThemeContext'
import { AuthProvider } from '@/contexts/AuthContext'
import { PrivateRoute } from '@/components/PrivateRoute'
import { AppLayout } from '@/components/layout/AppLayout'

// Auth Pages
import { LoginPage } from '@/modules/auth/pages/LoginPage'
import { RegisterPage } from '@/modules/auth/pages/RegisterPage'
import { ForgotPasswordPage } from '@/modules/auth/pages/ForgotPasswordPage'
import { ResetPasswordPage } from '@/modules/auth/pages/ResetPasswordPage'

// Dashboard
import { DashboardPage } from '@/modules/dashboard/pages/DashboardPage'

function App() {
  return (
    <ThemeProvider defaultTheme="light" storageKey="datahub-theme">
      <AuthProvider>
        <BrowserRouter>
          <Routes>
            {/* Public Routes */}
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/forgot-password" element={<ForgotPasswordPage />} />
            <Route path="/reset-password/:token" element={<ResetPasswordPage />} />

            {/* Protected Routes with Layout */}
            <Route element={<PrivateRoute />}>
              <Route path="/dashboard" element={<AppLayout><DashboardPage /></AppLayout>} />
              <Route path="/prospecting" element={<AppLayout><div>Prospecção em breve</div></AppLayout>} />
              <Route path="/pre-approval" element={<AppLayout><div>Pré-Aprovados em breve</div></AppLayout>} />
              <Route path="/approach" element={<AppLayout><div>Abordagem em breve</div></AppLayout>} />
              <Route path="/opening" element={<AppLayout><div>Abertura em breve</div></AppLayout>} />
              <Route path="/flowchart" element={<AppLayout><div>Fluxograma em breve</div></AppLayout>} />
              <Route path="/functional-design" element={<AppLayout><div>Desenho Funcional em breve</div></AppLayout>} />
            </Route>

            {/* Redirect */}
            <Route path="/" element={<Navigate to="/dashboard" replace />} />
            <Route path="*" element={<Navigate to="/dashboard" replace />} />
          </Routes>

          {/* Toast Notifications */}
          <Toaster
            position="top-right"
            toastOptions={{
              duration: 4000,
              style: {
                background: 'hsl(var(--card))',
                color: 'hsl(var(--foreground))',
                border: '1px solid hsl(var(--border))'
              },
              success: {
                iconTheme: {
                  primary: 'hsl(var(--success))',
                  secondary: 'white'
                }
              },
              error: {
                iconTheme: {
                  primary: 'hsl(var(--destructive))',
                  secondary: 'white'
                }
              }
            }}
          />
        </BrowserRouter>
      </AuthProvider>
    </ThemeProvider>
  )
}

export default App

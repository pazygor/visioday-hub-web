import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import { ThemeProvider } from '@/contexts/ThemeContext'
import { AuthProvider } from '@/contexts/AuthContext'
import { PrivateRoute } from '@/components/PrivateRoute'

// Auth Pages
import { LoginPage } from '@/modules/auth/pages/LoginPage'
import { RegisterPage } from '@/modules/auth/pages/RegisterPage'
import { ForgotPasswordPage } from '@/modules/auth/pages/ForgotPasswordPage'
import { ResetPasswordPage } from '@/modules/auth/pages/ResetPasswordPage'

// Choose System
import { ChooseSystemPage } from '@/modules/choose-system/pages/ChooseSystemPage'

// Digital System
import { DigitalLayout } from '@/modules/digital/components/DigitalLayout'
import { DigitalDashboardPage } from '@/modules/digital/pages/DigitalDashboardPage'

// Finance System
import { FinanceLayout } from '@/modules/finance/components/FinanceLayout'
import { 
  FinanceDashboardPage,
  ReceivablesPage,
  PayablesPage,
  CashFlowPage,
  AlertsPage,
  CategoriesPage,
  InvoicesPage,
  CreateInvoicePage,
  FinanceSettingsPage,
  ClientsPage
} from '@/modules/finance/pages'

// Academy System
import { AcademyLayout } from '@/modules/academy/components/AcademyLayout'
import { AcademyDashboardPage } from '@/modules/academy/pages/AcademyDashboardPage'

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

            {/* Choose System */}
            <Route element={<PrivateRoute />}>
              <Route path="/choose-system" element={<ChooseSystemPage />} />
            </Route>

            {/* Digital System Routes */}
            <Route element={<PrivateRoute />}>
              <Route path="/digital" element={<DigitalLayout />}>
                <Route path="dashboard" element={<DigitalDashboardPage />} />
                <Route path="clients" element={<div>Clientes em breve</div>} />
                <Route path="documents" element={<div>Documentos em breve</div>} />
                <Route path="taxes" element={<div>Obrigações em breve</div>} />
                <Route path="settings" element={<div>Configurações em breve</div>} />
              </Route>
            </Route>

            {/* Finance System Routes */}
            <Route element={<PrivateRoute />}>
              <Route path="/finance" element={<FinanceLayout />}>
                <Route path="dashboard" element={<FinanceDashboardPage />} />
                <Route path="receivables" element={<ReceivablesPage />} />
                <Route path="payables" element={<PayablesPage />} />
                <Route path="cashflow" element={<CashFlowPage />} />
                <Route path="alerts" element={<AlertsPage />} />
                <Route path="categories" element={<CategoriesPage />} />
                <Route path="clients" element={<ClientsPage />} />
                <Route path="invoices" element={<InvoicesPage />} />
                <Route path="invoices/create" element={<CreateInvoicePage />} />
                <Route path="settings" element={<FinanceSettingsPage />} />
              </Route>
            </Route>

            {/* Academy System Routes */}
            <Route element={<PrivateRoute />}>
              <Route path="/academy" element={<AcademyLayout />}>
                <Route path="dashboard" element={<AcademyDashboardPage />} />
                <Route path="courses" element={<div>Meus Cursos em breve</div>} />
                <Route path="catalog" element={<div>Catálogo em breve</div>} />
                <Route path="certificates" element={<div>Certificados em breve</div>} />
                <Route path="schedule" element={<div>Agenda em breve</div>} />
                <Route path="settings" element={<div>Configurações em breve</div>} />
              </Route>
            </Route>

            {/* Redirect */}
            <Route path="/" element={<Navigate to="/login" replace />} />
            <Route path="*" element={<Navigate to="/login" replace />} />
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

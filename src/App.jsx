import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom'
import { useEffect } from 'react'
import { ThemeProvider }   from './context/ThemeContext'
import { AuthProvider }    from './context/AuthContext'
import { AppProvider }     from './context/AppContext'
import { ToastProvider }   from './context/ToastContext'
import { NotificationProvider } from './context/NotificationContext'
import ProtectedRoute      from './components/ProtectedRoute'

import Login           from './pages/Login'
import ForgotPassword  from './pages/ForgotPassword'
import NewInstall      from './pages/NewInstallation'
import InstallRecords from './pages/InstallRecords'
import InstallDetail  from './pages/InstallDetail'
import Settings       from './pages/Settings'

function Guard({ children }) {
  return <ProtectedRoute>{children}</ProtectedRoute>
}

function ScrollToTop() {
  const { pathname } = useLocation()
  useEffect(() => {
    // Disable browser scroll restoration
    if ('scrollRestoration' in window.history) {
      window.history.scrollRestoration = 'manual'
    }
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' })
    document.documentElement.scrollTop = 0
    document.body.scrollTop = 0
  }, [pathname])
  return null
}

export default function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <AppProvider>
          <ToastProvider>
            <NotificationProvider>
            <BrowserRouter>
              <ScrollToTop />
              <Routes>
                <Route path="/login"           element={<Login />} />
                <Route path="/forgot-password" element={<ForgotPassword />} />
                <Route path="/"                element={<Navigate to="/login" replace />} />

                <Route path="/installations/new"  element={<Guard><NewInstall /></Guard>} />
                <Route path="/install-records"    element={<Guard><InstallRecords /></Guard>} />
                <Route path="/install-records/:id"element={<Guard><InstallDetail /></Guard>} />
                <Route path="/settings"           element={<Guard><Settings /></Guard>} />

                <Route path="*" element={<Navigate to="/login" replace />} />
              </Routes>
            </BrowserRouter>
            </NotificationProvider>
          </ToastProvider>
        </AppProvider>
      </AuthProvider>
    </ThemeProvider>
  )
}

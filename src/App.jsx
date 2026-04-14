import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
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

export default function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <AppProvider>
          <ToastProvider>
            <NotificationProvider>
            <BrowserRouter>
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

import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { ThemeProvider }   from './context/ThemeContext'
import { AuthProvider }    from './context/AuthContext'
import { AppProvider }     from './context/AppContext'
import { ToastProvider }   from './context/ToastContext'
import ProtectedRoute      from './components/ProtectedRoute'

import Login          from './pages/Login'
import SignUp         from './pages/SignUp'
import Dashboard      from './pages/Dashboard'
import NewInstall     from './pages/NewInstallation'
import InstallRecords from './pages/InstallRecords'
import InstallDetail  from './pages/InstallDetail'
import Devices        from './pages/Devices'
import DeviceDetail   from './pages/DeviceDetail'
import Sites          from './pages/Sites'
import Photos         from './pages/Photos'
import Reports        from './pages/Reports'
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
            <BrowserRouter>
              <Routes>
                <Route path="/login"  element={<Login />} />
                <Route path="/signup" element={<SignUp />} />
                <Route path="/"       element={<Navigate to="/login" replace />} />

                <Route path="/dashboard"          element={<Guard><Dashboard /></Guard>} />
                <Route path="/installations/new"  element={<Guard><NewInstall /></Guard>} />
                <Route path="/install-records"    element={<Guard><InstallRecords /></Guard>} />
                <Route path="/install-records/:id"element={<Guard><InstallDetail /></Guard>} />
                <Route path="/devices"            element={<Guard><Devices /></Guard>} />
                <Route path="/devices/:id"        element={<Guard><DeviceDetail /></Guard>} />
                <Route path="/sites"              element={<Guard><Sites /></Guard>} />
                <Route path="/photos"             element={<Guard><Photos /></Guard>} />
                <Route path="/reports"            element={<Guard><Reports /></Guard>} />
                <Route path="/settings"           element={<Guard><Settings /></Guard>} />

                <Route path="*" element={<Navigate to="/login" replace />} />
              </Routes>
            </BrowserRouter>
          </ToastProvider>
        </AppProvider>
      </AuthProvider>
    </ThemeProvider>
  )
}

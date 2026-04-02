import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { ThemeProvider } from './context/ThemeContext'
import { AuthProvider } from './context/AuthContext'
import { AlertProvider } from './context/AlertContext'
import { AppDataProvider } from './context/AppDataContext'
import Sidebar from './components/Sidebar'
import AlertToast from './components/AlertToast'
import ProtectedRoute from './components/ProtectedRoute'
import SignIn from './pages/SignIn'
import Dashboard from './pages/Dashboard'
import NewInstallation from './pages/NewInstallation'
import InstallRecords from './pages/InstallRecords'
import InstallDetail from './pages/InstallDetail'
import Devices from './pages/Devices'
import DeviceDashboard from './pages/DeviceDashboard'
import Sites from './pages/Sites'
import Photos from './pages/Photos'
import Reports from './pages/Reports'
import Settings from './pages/Settings'
import './App.css'

function AppShell({ children }) {
  return (
    <div className="flex min-h-screen transition-colors duration-200" style={{ background: 'var(--bg-base)' }}>
      <Sidebar />
      <div className="flex-1 flex flex-col ml-[232px] min-h-screen overflow-hidden" style={{ background: 'var(--bg-base)' }}>
        {children}
      </div>
    </div>
  )
}

function Guard({ children }) {
  return (
    <ProtectedRoute>
      <AppShell>{children}</AppShell>
    </ProtectedRoute>
  )
}

export default function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <AlertProvider>
          <AppDataProvider>
            <BrowserRouter>
              <AlertToast />
              <Routes>
                {/* Public */}
                <Route path="/login"  element={<SignIn />} />
                <Route path="/signin" element={<Navigate to="/login" replace />} />
                <Route path="/"       element={<Navigate to="/login" replace />} />

                {/* Protected */}
                <Route path="/dashboard"           element={<Guard><Dashboard /></Guard>} />
                <Route path="/installations/new"   element={<Guard><NewInstallation /></Guard>} />
                <Route path="/new-installation"    element={<Navigate to="/installations/new" replace />} />
                <Route path="/install-records"     element={<Guard><InstallRecords /></Guard>} />
                <Route path="/install-records/:id" element={<Guard><InstallDetail /></Guard>} />
                <Route path="/devices"             element={<Guard><Devices /></Guard>} />
                <Route path="/devices/:id"         element={<Guard><DeviceDashboard /></Guard>} />
                <Route path="/sites"               element={<Guard><Sites /></Guard>} />
                <Route path="/photos"              element={<Guard><Photos /></Guard>} />
                <Route path="/reports"             element={<Guard><Reports /></Guard>} />
                <Route path="/settings"            element={<Guard><Settings /></Guard>} />

                {/* Catch-all */}
                <Route path="*" element={<Navigate to="/login" replace />} />
              </Routes>
            </BrowserRouter>
          </AppDataProvider>
        </AlertProvider>
      </AuthProvider>
    </ThemeProvider>
  )
}

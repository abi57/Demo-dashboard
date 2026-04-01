import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext'
import { AlertProvider } from './context/AlertContext'
import Navbar from './components/Navbar'
import AlertToast from './components/AlertToast'
import ProtectedRoute from './components/ProtectedRoute'
import SignIn from './pages/SignIn'
import Home from './pages/Home'
import Dashboard from './pages/Dashboard'
import Viotel from './pages/Viotel'
import './App.css'

function App() {
  return (
    <AuthProvider>
      <AlertProvider>
        <BrowserRouter>
          <Navbar />
          <AlertToast />
          <Routes>
            <Route path="/signin" element={<SignIn />} />
            <Route path="/" element={
              <ProtectedRoute><Home /></ProtectedRoute>
            } />
            <Route path="/dashboard" element={
              <ProtectedRoute><Dashboard /></ProtectedRoute>
            } />
            <Route path="/viotel" element={
              <ProtectedRoute><Viotel /></ProtectedRoute>
            } />
          </Routes>
        </BrowserRouter>
      </AlertProvider>
    </AuthProvider>
  )
}

export default App

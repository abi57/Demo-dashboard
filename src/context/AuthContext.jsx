import { createContext, useContext, useState } from 'react'

const USERS = [
  { email: 'admin@viotel.io', password: 'admin123', role: 'admin', name: 'Admin User' },
  { email: 'engineer@viotel.io', password: 'user123', role: 'user', name: 'James Okafor' },
]

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    const saved = sessionStorage.getItem('viotel_user')
    return saved ? JSON.parse(saved) : null
  })

  function login(email, password) {
    const match = USERS.find(u => u.email === email && u.password === password)
    if (!match) return { ok: false, error: 'Invalid email or password' }
    const { password: _, ...safe } = match
    setUser(safe)
    sessionStorage.setItem('viotel_user', JSON.stringify(safe))
    return { ok: true }
  }

  function logout() {
    setUser(null)
    sessionStorage.removeItem('viotel_user')
  }

  return (
    <AuthContext.Provider value={{ user, login, logout, isAdmin: user?.role === 'admin' }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext)

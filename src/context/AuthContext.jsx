import { createContext, useContext, useState } from 'react'

// Demo credentials
const USERS = [
  { username: 'admin', password: 'admin123', role: 'admin', name: 'Admin User' },
  { username: 'user',  password: 'user123',  role: 'user',  name: 'John Doe'   },
]

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    const saved = sessionStorage.getItem('viotel_user')
    return saved ? JSON.parse(saved) : null
  })

  function login(username, password) {
    const match = USERS.find(u => u.username === username && u.password === password)
    if (!match) return { ok: false, error: 'Invalid username or password' }
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

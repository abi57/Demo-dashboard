import { createContext, useContext, useState } from 'react'
import { apiLogin } from '../api'

const Ctx = createContext(null)
const SESSION_KEY = 'vio_session'
const TOKEN_KEY = 'vio_token'

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    try { return JSON.parse(localStorage.getItem(SESSION_KEY) ?? 'null') }
    catch { return null }
  })

  async function login(company, password) {
    try {
      const data = await apiLogin(company, password)
      const session = { id: data.company_id, company: data.company_name }
      localStorage.setItem(TOKEN_KEY, data.token)
      localStorage.setItem(SESSION_KEY, JSON.stringify(session))
      setUser(session)
      return { ok: true }
    } catch (err) {
      return { ok: false, error: err.message || 'Invalid company name or password.' }
    }
  }

  function logout() {
    setUser(null)
    localStorage.removeItem(SESSION_KEY)
    localStorage.removeItem(TOKEN_KEY)
  }

  return <Ctx.Provider value={{ user, login, logout }}>{children}</Ctx.Provider>
}

export const useAuth = () => useContext(Ctx)

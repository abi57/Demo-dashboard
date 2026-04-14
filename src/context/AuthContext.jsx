import { createContext, useContext, useState } from 'react'

const Ctx = createContext(null)
const KEY = 'vio_session'

const SEED_USERS = [
  { id: 'u1', name: 'Wade Hooper', company: 'Titanium Services Group', email: 'wade@titanium.co.nz', password: 'engineer123' },
  { id: 'u2', name: 'Matt Siddells', company: 'All Heights Ltd', email: 'matt@allheights.co.nz', password: 'engineer123' },
  { id: 'u3', name: 'Alfredo Celles Jr', company: 'Downer', email: 'alfredo@downer.com', password: 'engineer123' },
]

function getUsers() {
  try { return JSON.parse(localStorage.getItem('vio_users') ?? 'null') ?? SEED_USERS }
  catch { return SEED_USERS }
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    try { return JSON.parse(localStorage.getItem(KEY) ?? 'null') }
    catch { return null }
  })

  function login(company, password) {
    const users = getUsers()
    const match = users.find(u => u.company.toLowerCase() === company.toLowerCase() && u.password === password)
    if (!match) return { ok: false, error: 'Invalid company name or password.' }
    const { password: _, ...safe } = match
    setUser(safe)
    localStorage.setItem(KEY, JSON.stringify(safe))
    return { ok: true }
  }

  function logout() {
    setUser(null)
    localStorage.removeItem(KEY)
  }

  return <Ctx.Provider value={{ user, login, logout }}>{children}</Ctx.Provider>
}

export const useAuth = () => useContext(Ctx)

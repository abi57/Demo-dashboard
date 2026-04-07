import { createContext, useContext, useEffect, useState } from 'react'

const Ctx = createContext(null)

export function ThemeProvider({ children }) {
  const [theme, setTheme] = useState(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('vio_theme') ?? 'light'
    }
    return 'light'
  })

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme)
    localStorage.setItem('vio_theme', theme)
  }, [theme])

  // Apply immediately on mount to avoid flash
  useEffect(() => {
    const saved = localStorage.getItem('vio_theme') ?? 'light'
    document.documentElement.setAttribute('data-theme', saved)
  }, [])

  const toggle = () => setTheme(t => t === 'light' ? 'dark' : 'light')

  return <Ctx.Provider value={{ theme, toggle, isDark: theme === 'dark' }}>{children}</Ctx.Provider>
}

export const useTheme = () => useContext(Ctx)

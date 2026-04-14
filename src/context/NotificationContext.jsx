import { createContext, useContext, useState, useCallback } from 'react'

const Ctx = createContext(null)

export function NotificationProvider({ children }) {
  const [items, setItems] = useState([])

  const add = useCallback((message, type = 'info') => {
    const id = Date.now() + Math.random()
    setItems(prev => [{ id, message, type, time: new Date().toLocaleTimeString('en-NZ', { hour: '2-digit', minute: '2-digit', hour12: true }) }, ...prev])
  }, [])

  const remove = useCallback((id) => {
    setItems(prev => prev.filter(n => n.id !== id))
  }, [])

  const clearAll = useCallback(() => setItems([]), [])

  return <Ctx.Provider value={{ items, add, remove, clearAll }}>{children}</Ctx.Provider>
}

export const useNotifications = () => useContext(Ctx)

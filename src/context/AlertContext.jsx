import { createContext, useContext, useState, useCallback } from 'react'

const AlertContext = createContext(null)

export function AlertProvider({ children }) {
  const [alerts, setAlerts] = useState([])

  const push = useCallback((message, type = 'info') => {
    const id = Date.now() + Math.random()
    setAlerts(prev => [...prev, { id, message, type }])
    setTimeout(() => setAlerts(prev => prev.filter(a => a.id !== id)), 4000)
  }, [])

  const dismiss = useCallback((id) => {
    setAlerts(prev => prev.filter(a => a.id !== id))
  }, [])

  return (
    <AlertContext.Provider value={{ alerts, push, dismiss }}>
      {children}
    </AlertContext.Provider>
  )
}

export const useAlert = () => useContext(AlertContext)

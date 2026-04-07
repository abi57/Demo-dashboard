import { createContext, useContext, useState, useCallback } from 'react'
import { CheckCircle, XCircle, Info, X } from 'lucide-react'

const Ctx = createContext(null)

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([])

  const push = useCallback((message, type = 'success') => {
    const id = Date.now() + Math.random()
    setToasts(p => [...p, { id, message, type }])
    setTimeout(() => setToasts(p => p.filter(t => t.id !== id)), 3500)
  }, [])

  const dismiss = useCallback(id => setToasts(p => p.filter(t => t.id !== id)), [])

  const ICON = { success: CheckCircle, error: XCircle, info: Info }
  const CLS  = { success: 'vio-toast-success', error: 'vio-toast-error', info: 'vio-toast-info' }

  return (
    <Ctx.Provider value={{ push }}>
      {children}
      <div className="vio-toast-container">
        {toasts.map(t => {
          const Icon = ICON[t.type] ?? Info
          return (
            <div key={t.id} className={`vio-toast ${CLS[t.type] ?? 'vio-toast-info'}`}>
              <Icon size={16} style={{ flexShrink: 0, marginTop: 1 }} />
              <span style={{ flex: 1 }}>{t.message}</span>
              <button onClick={() => dismiss(t.id)} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0, color: 'inherit', opacity: 0.6, display: 'flex' }}>
                <X size={14} />
              </button>
            </div>
          )
        })}
      </div>
    </Ctx.Provider>
  )
}

export const useToast = () => useContext(Ctx)

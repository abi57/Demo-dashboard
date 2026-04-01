import { useAlert } from '../context/AlertContext'

const STYLES = {
  info:    { bar: 'bg-blue-500',   icon: 'ℹ️',  text: 'text-blue-400',   bg: 'bg-blue-500/10   border-blue-500/20'   },
  success: { bar: 'bg-green-500',  icon: '✅',  text: 'text-green-400',  bg: 'bg-green-500/10  border-green-500/20'  },
  warning: { bar: 'bg-yellow-500', icon: '⚠️',  text: 'text-yellow-400', bg: 'bg-yellow-500/10 border-yellow-500/20' },
  error:   { bar: 'bg-red-500',    icon: '🚨',  text: 'text-red-400',    bg: 'bg-red-500/10    border-red-500/20'    },
}

export default function AlertToast() {
  const { alerts, dismiss } = useAlert()

  return (
    <div className="fixed top-16 right-4 z-[200] flex flex-col gap-2 w-80 pointer-events-none">
      {alerts.map(alert => {
        const s = STYLES[alert.type] ?? STYLES.info
        return (
          <div
            key={alert.id}
            className={`pointer-events-auto relative overflow-hidden flex items-start gap-3 px-4 py-3 rounded-xl border backdrop-blur-xl shadow-xl ${s.bg} animate-slide-in`}
          >
            {/* accent bar */}
            <div className={`absolute left-0 top-0 bottom-0 w-1 ${s.bar}`} />
            <span className="text-lg mt-0.5 ml-1">{s.icon}</span>
            <p className={`flex-1 text-sm font-medium ${s.text}`}>{alert.message}</p>
            <button
              onClick={() => dismiss(alert.id)}
              className="text-slate-500 hover:text-white text-lg leading-none mt-0.5 transition-colors"
            >
              ×
            </button>
          </div>
        )
      })}
    </div>
  )
}

import { useAlert } from '../context/AlertContext'

const META = {
  info:    { bar: '#60a5fa', icon: 'ℹ', text: '#60a5fa', bg: 'rgba(96,165,250,0.08)',  border: 'rgba(96,165,250,0.2)'  },
  success: { bar: '#34d399', icon: '✓', text: '#34d399', bg: 'rgba(52,211,153,0.08)',  border: 'rgba(52,211,153,0.2)'  },
  warning: { bar: '#fbbf24', icon: '▲', text: '#fbbf24', bg: 'rgba(251,191,36,0.08)',  border: 'rgba(251,191,36,0.2)'  },
  error:   { bar: '#f87171', icon: '✕', text: '#f87171', bg: 'rgba(248,113,113,0.08)', border: 'rgba(248,113,113,0.2)' },
}

export default function AlertToast() {
  const { alerts, dismiss } = useAlert()
  return (
    <div className="fixed top-4 right-4 z-[200] flex flex-col gap-2 w-80 pointer-events-none">
      {alerts.map(alert => {
        const m = META[alert.type] ?? META.info
        return (
          <div key={alert.id}
            className="pointer-events-auto relative overflow-hidden flex items-start gap-3 px-4 py-3 rounded-xl shadow-2xl animate-slide-in"
            style={{ background: 'var(--bg-surface)', border: `1px solid ${m.border}`, backdropFilter: 'blur(16px)' }}
          >
            <div className="absolute left-0 top-0 bottom-0 w-[3px]" style={{ background: m.bar }} />
            <span className="text-[13px] font-bold ml-1 mt-0.5 flex-shrink-0" style={{ color: m.text }}>{m.icon}</span>
            <p className="flex-1 text-[13px]" style={{ color: 'var(--text-secondary)' }}>{alert.message}</p>
            <button onClick={() => dismiss(alert.id)}
              className="text-lg leading-none mt-0.5 transition-colors flex-shrink-0"
              style={{ color: 'var(--text-faint)' }}
              onMouseEnter={e => e.currentTarget.style.color = 'var(--text-primary)'}
              onMouseLeave={e => e.currentTarget.style.color = 'var(--text-faint)'}
            >×</button>
          </div>
        )
      })}
    </div>
  )
}

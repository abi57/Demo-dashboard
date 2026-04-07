import { useAlert } from '../context/AlertContext'

const META = {
  success: { bg: '#f0fdf4', border: '#bbf7d0', color: '#15803d', icon: '✓' },
  info:    { bg: '#eff6ff', border: '#bfdbfe', color: '#1d4ed8', icon: 'ℹ' },
  warning: { bg: '#fffbeb', border: '#fde68a', color: '#d97706', icon: '▲' },
  error:   { bg: '#fef2f2', border: '#fecaca', color: '#dc2626', icon: '✕' },
}

export default function AlertToast() {
  const { alerts, dismiss } = useAlert()
  return (
    <div style={{ position: 'fixed', top: 72, right: 16, zIndex: 200, display: 'flex', flexDirection: 'column', gap: 8, width: 320, pointerEvents: 'none' }}>
      {alerts.map(a => {
        const m = META[a.type] ?? META.info
        return (
          <div
            key={a.id}
            className="animate-fade-up"
            style={{
              pointerEvents: 'auto',
              display: 'flex', alignItems: 'flex-start', gap: 10,
              padding: '10px 14px',
              borderRadius: 8,
              background: m.bg,
              border: `1px solid ${m.border}`,
              boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
            }}
          >
            <span style={{ fontSize: 13, fontWeight: 700, color: m.color, flexShrink: 0, marginTop: 1 }}>{m.icon}</span>
            <p style={{ flex: 1, fontSize: 13, color: m.color }}>{a.message}</p>
            <button
              onClick={() => dismiss(a.id)}
              style={{ background: 'none', border: 'none', cursor: 'pointer', color: m.color, fontSize: 16, lineHeight: 1, padding: 0, opacity: 0.6 }}
            >×</button>
          </div>
        )
      })}
    </div>
  )
}

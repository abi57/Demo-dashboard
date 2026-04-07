import { useViotel } from '../context/ViotelContext'

const SEV_BORDER = { critical: '#dc2626', warning: '#f59e0b', info: '#1b7a5e' }
const SEV_ICON   = { critical: '🔴', warning: '🟡', info: '🔵' }

export default function AlertFeed() {
  const { assetAlerts, acknowledgeAlert, lastSync } = useViotel()
  const syncStr = lastSync.toLocaleTimeString('en-AU', { hour: '2-digit', minute: '2-digit', second: '2-digit' })

  return (
    <div className="vt-card overflow-hidden">
      <div style={{ padding: '12px 16px', borderBottom: '0.5px solid #dde4e7', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <p style={{ fontSize: 13, fontWeight: 500, color: '#0b3d4a' }}>Alert Feed</p>
        <span className="vt-caption">Refreshed {syncStr}</span>
      </div>

      <div style={{ padding: '8px' }}>
        {assetAlerts.length === 0 ? (
          <div style={{ padding: '24px', textAlign: 'center' }}>
            <div style={{ fontSize: 24, marginBottom: 8 }}>✅</div>
            <p style={{ fontSize: 13, color: '#16a34a', fontWeight: 500 }}>No active alerts</p>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
            {assetAlerts.slice(0, 5).map(a => (
              <div
                key={a.id}
                style={{
                  display: 'flex',
                  alignItems: 'flex-start',
                  gap: 10,
                  padding: '10px 12px',
                  borderRadius: 8,
                  background: a.ack ? '#fafafa' : '#fff',
                  border: '0.5px solid #dde4e7',
                  borderLeft: `3px solid ${SEV_BORDER[a.severity] ?? '#9ca3af'}`,
                  opacity: a.ack ? 0.5 : 1,
                }}
              >
                <span style={{ fontSize: 13, flexShrink: 0, marginTop: 1 }}>{SEV_ICON[a.severity]}</span>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6, flexWrap: 'wrap' }}>
                    <span className="vt-mono" style={{ fontSize: 11, fontWeight: 600, color: '#0b3d4a' }}>{a.node}</span>
                    <span style={{ fontSize: 11, color: '#6b7280' }}>·</span>
                    <span style={{ fontSize: 11, color: '#374151' }}>{a.metric}</span>
                    <span style={{ fontSize: 11, fontWeight: 600, color: SEV_BORDER[a.severity] }}>{a.value}</span>
                    <span style={{ fontSize: 11, color: '#9ca3af' }}>/ {a.threshold}</span>
                  </div>
                  <p style={{ fontSize: 11, color: '#9ca3af', marginTop: 2 }}>{a.time}</p>
                </div>
                {!a.ack && (
                  <button
                    onClick={() => acknowledgeAlert(a.id)}
                    className="vt-btn vt-btn-ghost"
                    style={{ height: 24, padding: '0 8px', fontSize: 11, flexShrink: 0 }}
                  >
                    Ack
                  </button>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

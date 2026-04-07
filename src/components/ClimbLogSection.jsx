const FIELDS = [
  { key: 'upStart',    label: 'Up Start'    },
  { key: 'upFinish',   label: 'Up Finish'   },
  { key: 'downStart',  label: 'Down Start'  },
  { key: 'downFinish', label: 'Down Finish' },
]

export default function ClimbLogSection({ climbs, onChange, readOnly = false }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
      {climbs.map((c, i) => (
        <div key={i} style={{ borderRadius: 8, padding: '12px 14px', background: '#f8fcfd', border: '0.5px solid #dde4e7' }}>
          <p style={{ fontSize: 11, fontWeight: 500, letterSpacing: '0.08em', textTransform: 'uppercase', color: '#0b3d4a', marginBottom: 10 }}>
            {c.label ?? `Climb ${i + 1}`}
          </p>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 10 }}>
            {FIELDS.map(f => (
              <div key={f.key}>
                <p style={{ fontSize: 10, fontWeight: 500, letterSpacing: '0.08em', textTransform: 'uppercase', color: '#9ca3af', marginBottom: 4 }}>{f.label}</p>
                {readOnly ? (
                  <p style={{ fontSize: 13, fontFamily: 'ui-monospace,monospace', color: c[f.key] ? '#374151' : '#9ca3af' }}>
                    {c[f.key] || 'not recorded'}
                  </p>
                ) : (
                  <input
                    type="time"
                    value={c[f.key] || ''}
                    onChange={e => onChange(i, f.key, e.target.value)}
                    className="vt-input"
                    style={{ height: 34, fontSize: 12 }}
                  />
                )}
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  )
}

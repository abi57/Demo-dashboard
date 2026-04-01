const FIELDS = [
  { key: 'upStart',    label: 'Up Start'    },
  { key: 'upFinish',   label: 'Up Finish'   },
  { key: 'downStart',  label: 'Down Start'  },
  { key: 'downFinish', label: 'Down Finish' },
]

export default function ClimbLogSection({ climbs, onChange, readOnly = false }) {
  return (
    <div className="flex flex-col gap-3">
      {climbs.map((c, i) => (
        <div key={i} className="rounded-xl p-4" style={{ background: 'var(--bg-elevated)', border: '1px solid var(--border)' }}>
          <p className="text-[11px] font-semibold uppercase tracking-[0.08em] mb-3" style={{ color: 'var(--accent)' }}>
            {c.label ?? `Climb ${i + 1}`}
          </p>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {FIELDS.map(f => (
              <div key={f.key}>
                <p className="text-[10px] font-semibold uppercase tracking-wider mb-1.5" style={{ color: 'var(--text-faint)' }}>
                  {f.label}
                </p>
                {readOnly ? (
                  <p className="text-[13px] font-medium" style={{ color: 'var(--text-primary)' }}>{c[f.key] || '—'}</p>
                ) : (
                  <input
                    type="time"
                    value={c[f.key] || ''}
                    onChange={e => onChange(i, f.key, e.target.value)}
                    className="w-full rounded-lg px-3 py-2 text-[13px] outline-none transition-all"
                    style={{
                      background: 'var(--bg-surface)',
                      border: '1px solid var(--border)',
                      color: 'var(--text-primary)',
                    }}
                    onFocus={e => e.target.style.borderColor = 'var(--accent-border)'}
                    onBlur={e => e.target.style.borderColor = 'var(--border)'}
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

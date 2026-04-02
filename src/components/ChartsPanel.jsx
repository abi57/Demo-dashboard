import { useState, useEffect } from 'react'

function Sparkline({ data, color = '#00bcd4', height = 56 }) {
  if (!data || data.length < 2) return null
  const min = Math.min(...data)
  const max = Math.max(...data)
  const range = max - min || 1
  const W = 200, H = height
  const pts = data.map((v, i) => {
    const x = (i / (data.length - 1)) * W
    const y = H - ((v - min) / range) * (H - 12) - 6
    return `${x},${y}`
  })
  const line = pts.join(' ')
  const fill = `0,${H} ${line} ${W},${H}`

  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="w-full" style={{ height }} preserveAspectRatio="none">
      <defs>
        <linearGradient id={`g${color.replace('#','')}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%"   stopColor={color} stopOpacity="0.18"/>
          <stop offset="100%" stopColor={color} stopOpacity="0"/>
        </linearGradient>
      </defs>
      <polygon points={fill} fill={`url(#g${color.replace('#','')})`}/>
      <polyline points={line} fill="none" stroke={color} strokeWidth="1.6"
        strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  )
}

function seed(base, drift, len = 24) {
  const a = [base]
  for (let i = 1; i < len; i++)
    a.push(parseFloat((a[i-1] + (Math.random() - 0.5) * drift * 2).toFixed(2)))
  return a
}

export default function ChartsPanel({ sensors }) {
  const [hist, setHist] = useState(() =>
    Object.fromEntries(sensors.map(s => [s.id, seed(s.value, s.drift ?? 1)]))
  )

  useEffect(() => {
    const t = setInterval(() => {
      setHist(prev => {
        const next = { ...prev }
        sensors.forEach(s => {
          const arr = prev[s.id] ?? []
          const last = arr[arr.length - 1] ?? s.value
          next[s.id] = [...arr.slice(-23),
            parseFloat((last + (Math.random() - 0.5) * (s.drift ?? 1) * 2).toFixed(2))]
        })
        return next
      })
    }, 3000)
    return () => clearInterval(t)
  }, [sensors])

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
      {sensors.map(s => {
        const data    = hist[s.id] ?? []
        const current = data[data.length - 1] ?? s.value
        const prev    = data[data.length - 2] ?? current
        const delta   = parseFloat((current - prev).toFixed(2))
        const up      = delta > 0

        return (
          <div
            key={s.id}
            className="overflow-hidden transition-all"
            style={{
              borderRadius: 12,
              background: 'var(--bg-surface)',
              border: '1px solid var(--border)',
              boxShadow: 'var(--shadow-sm)',
            }}
            onMouseEnter={e => e.currentTarget.style.boxShadow = 'var(--shadow-md)'}
            onMouseLeave={e => e.currentTarget.style.boxShadow = 'var(--shadow-sm)'}
          >
            {/* Header */}
            <div className="flex items-center justify-between px-5 pt-4 pb-3">
              <div className="flex items-center gap-2">
                <span style={{ fontSize: 16 }}>{s.icon}</span>
                <span style={{ fontSize: 'var(--t-h4)', fontWeight: 'var(--fw-semibold)', color: 'var(--text-secondary)' }}>
                  {s.title}
                </span>
              </div>
              <div className="flex items-center gap-2.5">
                {delta !== 0 && (
                  <span style={{
                    fontSize: 'var(--t-micro)',
                    fontWeight: 'var(--fw-semibold)',
                    color: up ? 'var(--success)' : 'var(--danger)',
                  }}>
                    {up ? '▲' : '▼'} {Math.abs(delta)}
                  </span>
                )}
                <span style={{
                  fontSize: 'var(--t-data-lg)',
                  fontWeight: 'var(--fw-bold)',
                  letterSpacing: 'var(--ls-tight)',
                  lineHeight: 1,
                  fontVariantNumeric: 'tabular-nums',
                  color: s.accent,
                }}>
                  {current}
                  <span style={{ fontSize: 'var(--t-caption)', fontWeight: 'var(--fw-medium)', marginLeft: 3, color: 'var(--text-muted)' }}>
                    {s.unit}
                  </span>
                </span>
              </div>
            </div>

            {/* Chart */}
            <Sparkline data={data} color={s.accent} />

            {/* Footer */}
            <div
              className="flex items-center justify-between px-5 py-2.5"
              style={{ borderTop: '1px solid var(--border-soft)' }}
            >
              <span style={{ fontSize: 'var(--t-micro)', color: 'var(--text-faint)' }}>24 readings</span>
              <div className="flex items-center gap-1.5">
                <span className="rounded-full animate-pulse" style={{ width: 5, height: 5, background: 'var(--success)' }} />
                <span style={{ fontSize: 'var(--t-micro)', color: 'var(--text-faint)' }}>Live · 3s</span>
              </div>
            </div>
          </div>
        )
      })}
    </div>
  )
}

import { useState, useEffect } from 'react'

function Sparkline({ data, color = '#1b7a5e', height = 52 }) {
  if (!data || data.length < 2) return null
  const min = Math.min(...data)
  const max = Math.max(...data)
  const range = max - min || 1
  const W = 200, H = height
  const pts = data.map((v, i) => {
    const x = (i / (data.length - 1)) * W
    const y = H - ((v - min) / range) * (H - 10) - 5
    return `${x},${y}`
  })
  const line = pts.join(' ')
  const fill = `0,${H} ${line} ${W},${H}`
  return (
    <svg viewBox={`0 0 ${W} ${H}`} style={{ width: '100%', height, display: 'block' }} preserveAspectRatio="none">
      <defs>
        <linearGradient id={`cg${color.replace('#','')}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%"   stopColor={color} stopOpacity="0.15"/>
          <stop offset="100%" stopColor={color} stopOpacity="0"/>
        </linearGradient>
      </defs>
      <polygon points={fill} fill={`url(#cg${color.replace('#','')})`}/>
      <polyline points={line} fill="none" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
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
          next[s.id] = [...arr.slice(-23), parseFloat((last + (Math.random() - 0.5) * (s.drift ?? 1) * 2).toFixed(2))]
        })
        return next
      })
    }, 3000)
    return () => clearInterval(t)
  }, [sensors])

  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2,1fr)', gap: 10 }}>
      {sensors.map(s => {
        const data    = hist[s.id] ?? []
        const current = data[data.length - 1] ?? s.value
        const prev    = data[data.length - 2] ?? current
        const delta   = parseFloat((current - prev).toFixed(2))
        const up      = delta > 0
        const color   = s.accent ?? '#1b7a5e'

        return (
          <div key={s.id} className="vt-card" style={{ overflow: 'hidden' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px 14px 8px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                <span style={{ fontSize: 15 }}>{s.icon}</span>
                <span style={{ fontSize: 12, fontWeight: 500, color: '#374151' }}>{s.title}</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                {delta !== 0 && (
                  <span style={{ fontSize: 10, fontWeight: 500, color: up ? '#16a34a' : '#dc2626' }}>
                    {up ? '▲' : '▼'} {Math.abs(delta)}
                  </span>
                )}
                <span style={{ fontSize: 18, fontWeight: 500, color, fontVariantNumeric: 'tabular-nums', lineHeight: 1 }}>
                  {current}
                  <span style={{ fontSize: 11, fontWeight: 400, marginLeft: 2, color: '#9ca3af' }}>{s.unit}</span>
                </span>
              </div>
            </div>
            <Sparkline data={data} color={color} />
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '5px 14px 8px', borderTop: '0.5px solid #f0f4f5' }}>
              <span style={{ fontSize: 10, color: '#9ca3af' }}>24 readings</span>
              <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                <span style={{ width: 5, height: 5, borderRadius: '50%', background: '#16a34a', display: 'inline-block' }} />
                <span style={{ fontSize: 10, color: '#9ca3af' }}>Live · 3s</span>
              </div>
            </div>
          </div>
        )
      })}
    </div>
  )
}

import { useState, useEffect } from 'react'

function Sparkline({ data, color = '#22d3ee', height = 52 }) {
  if (!data || data.length < 2) return null
  const min = Math.min(...data)
  const max = Math.max(...data)
  const range = max - min || 1
  const w = 200; const h = height
  const pts = data.map((v, i) => {
    const x = (i / (data.length - 1)) * w
    const y = h - ((v - min) / range) * (h - 10) - 5
    return `${x},${y}`
  }).join(' ')
  const fillPts = `0,${h} ${pts} ${w},${h}`

  return (
    <svg viewBox={`0 0 ${w} ${h}`} className="w-full" style={{ height }}>
      <defs>
        <linearGradient id={`grad-${color.replace('#','')}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={color} stopOpacity="0.2"/>
          <stop offset="100%" stopColor={color} stopOpacity="0"/>
        </linearGradient>
      </defs>
      <polygon points={fillPts} fill={`url(#grad-${color.replace('#','')})`}/>
      <polyline points={pts} fill="none" stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  )
}

function generateHistory(base, drift, len = 24) {
  const arr = [base]
  for (let i = 1; i < len; i++)
    arr.push(parseFloat((arr[i-1] + (Math.random() - 0.5) * drift * 2).toFixed(2)))
  return arr
}

export default function ChartsPanel({ sensors }) {
  const [histories, setHistories] = useState(() =>
    Object.fromEntries(sensors.map(s => [s.id, generateHistory(s.value, s.drift ?? 1)]))
  )

  useEffect(() => {
    const t = setInterval(() => {
      setHistories(prev => {
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
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
      {sensors.map(s => {
        const hist = histories[s.id] ?? []
        const current = hist[hist.length - 1] ?? s.value
        const prev = hist[hist.length - 2] ?? current
        const delta = current - prev
        return (
          <div
            key={s.id}
            className="rounded-2xl p-5 transition-colors"
            style={{ background: 'var(--bg-surface)', border: '1px solid var(--border)' }}
          >
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <span className="text-base">{s.icon}</span>
                <span className="text-[13px] font-medium" style={{ color: 'var(--text-secondary)' }}>{s.title}</span>
              </div>
              <div className="flex items-center gap-2">
                {delta !== 0 && (
                  <span className="text-[10px] font-medium" style={{ color: delta > 0 ? '#34d399' : '#f87171' }}>
                    {delta > 0 ? '▲' : '▼'} {Math.abs(delta).toFixed(2)}
                  </span>
                )}
                <span className="text-[18px] font-bold tabular-nums" style={{ color: s.accent }}>
                  {current}<span className="text-[11px] font-normal ml-0.5" style={{ color: 'var(--text-muted)' }}>{s.unit}</span>
                </span>
              </div>
            </div>
            <Sparkline data={hist} color={s.accent} />
            <div className="flex justify-between mt-2">
              <span className="text-[10px]" style={{ color: 'var(--text-faint)' }}>24 readings</span>
              <span className="text-[10px]" style={{ color: 'var(--text-faint)' }}>Live · 3s</span>
            </div>
          </div>
        )
      })}
    </div>
  )
}

const PALETTE = {
  cyan:    { accent: '#00bcd4', border: 'rgba(0,188,212,0.16)',  bg: 'rgba(0,188,212,0.06)'  },
  emerald: { accent: '#10b981', border: 'rgba(16,185,129,0.16)', bg: 'rgba(16,185,129,0.06)' },
  amber:   { accent: '#f59e0b', border: 'rgba(245,158,11,0.16)', bg: 'rgba(245,158,11,0.06)' },
  blue:    { accent: '#3b82f6', border: 'rgba(59,130,246,0.16)', bg: 'rgba(59,130,246,0.06)' },
  purple:  { accent: '#8b5cf6', border: 'rgba(139,92,246,0.16)', bg: 'rgba(139,92,246,0.06)' },
  red:     { accent: '#ef4444', border: 'rgba(239,68,68,0.16)',  bg: 'rgba(239,68,68,0.06)'  },
}

export default function SummaryCard({ label, value, icon, trend, color = 'cyan' }) {
  const c = PALETTE[color] ?? PALETTE.cyan
  return (
    <div
      className="flex flex-col cursor-default transition-all"
      style={{
        padding: '18px 20px',
        borderRadius: 12,
        background: 'var(--bg-surface)',
        border: `1px solid ${c.border}`,
        boxShadow: 'var(--shadow-card)',
      }}
      onMouseEnter={e => e.currentTarget.style.boxShadow = 'var(--shadow-md)'}
      onMouseLeave={e => e.currentTarget.style.boxShadow = 'var(--shadow-card)'}
    >
      <div className="flex items-center justify-between mb-4">
        <p className="font-semibold uppercase" style={{ fontSize: 10.5, letterSpacing: '0.09em', color: 'var(--text-faint)' }}>
          {label}
        </p>
        <div className="flex items-center justify-center rounded-lg flex-shrink-0"
          style={{ width: 30, height: 30, background: c.bg, border: `1px solid ${c.border}`, color: c.accent, fontSize: 14 }}>
          {icon}
        </div>
      </div>
      <p className="font-bold leading-none tabular-nums" style={{ fontSize: 30, letterSpacing: '-0.03em', color: c.accent }}>
        {value}
      </p>
      {trend && (
        <div className="flex items-center gap-1.5 mt-2.5">
          <span className="rounded-full" style={{ width: 4, height: 4, background: c.accent, opacity: 0.5 }} />
          <p style={{ fontSize: 11, color: 'var(--text-faint)' }}>{trend}</p>
        </div>
      )}
    </div>
  )
}

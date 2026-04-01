const PALETTE = {
  cyan:    { accent: '#22d3ee', border: 'rgba(34,211,238,0.2)',   bg: 'rgba(34,211,238,0.06)'   },
  emerald: { accent: '#34d399', border: 'rgba(52,211,153,0.2)',   bg: 'rgba(52,211,153,0.06)'   },
  amber:   { accent: '#fbbf24', border: 'rgba(251,191,36,0.2)',   bg: 'rgba(251,191,36,0.06)'   },
  blue:    { accent: '#60a5fa', border: 'rgba(96,165,250,0.2)',   bg: 'rgba(96,165,250,0.06)'   },
  purple:  { accent: '#a78bfa', border: 'rgba(167,139,250,0.2)',  bg: 'rgba(167,139,250,0.06)'  },
  red:     { accent: '#f87171', border: 'rgba(248,113,113,0.2)',  bg: 'rgba(248,113,113,0.06)'  },
}

export default function SummaryCard({ label, value, icon, trend, color = 'cyan' }) {
  const c = PALETTE[color] ?? PALETTE.cyan
  return (
    <div
      className="rounded-2xl p-5 flex flex-col gap-4 transition-all cursor-default hover:brightness-105"
      style={{
        background: `color-mix(in srgb, var(--bg-surface) 85%, ${c.accent}10)`,
        border: `1px solid ${c.border}`,
      }}
    >
      <div className="flex items-center justify-between">
        <p className="text-[11px] font-semibold uppercase tracking-[0.08em]" style={{ color: 'var(--text-faint)' }}>
          {label}
        </p>
        <span className="text-[18px] opacity-60">{icon}</span>
      </div>
      <div>
        <p className="text-[34px] font-bold leading-none tracking-tight" style={{ color: c.accent }}>
          {value}
        </p>
        {trend && (
          <div className="flex items-center gap-1.5 mt-2">
            <span className="w-1.5 h-1.5 rounded-full" style={{ background: c.accent }} />
            <p className="text-[11px]" style={{ color: 'var(--text-faint)' }}>{trend}</p>
          </div>
        )}
      </div>
    </div>
  )
}

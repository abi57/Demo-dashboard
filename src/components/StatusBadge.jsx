const MAP = {
  Confirmed:        { color: '#22c55e', bg: 'rgba(34,197,94,0.08)',   border: 'rgba(34,197,94,0.2)'   },
  Online:           { color: '#22c55e', bg: 'rgba(34,197,94,0.08)',   border: 'rgba(34,197,94,0.2)'   },
  Pending:          { color: '#f59e0b', bg: 'rgba(245,158,11,0.08)',  border: 'rgba(245,158,11,0.2)'  },
  Warning:          { color: '#f59e0b', bg: 'rgba(245,158,11,0.08)',  border: 'rgba(245,158,11,0.2)'  },
  Offline:          { color: '#ef4444', bg: 'rgba(239,68,68,0.08)',   border: 'rgba(239,68,68,0.2)'   },
  Good:             { color: '#22c55e', bg: 'rgba(34,197,94,0.08)',   border: 'rgba(34,197,94,0.2)'   },
  'Check Required': { color: '#f59e0b', bg: 'rgba(245,158,11,0.08)',  border: 'rgba(245,158,11,0.2)'  },
}
const DEFAULT = { color: '#64748b', bg: 'rgba(100,116,139,0.08)', border: 'rgba(100,116,139,0.2)' }

export default function StatusBadge({ status, pulse = false }) {
  const s = MAP[status] ?? DEFAULT
  return (
    <span
      className="inline-flex items-center gap-[5px] rounded-md"
      style={{
        fontSize: 'var(--t-micro)',
        fontWeight: 'var(--fw-semibold)',
        letterSpacing: '0.04em',
        padding: '3px 8px',
        color: s.color,
        background: s.bg,
        border: `1px solid ${s.border}`,
      }}
    >
      <span
        className={`rounded-full flex-shrink-0 ${pulse ? 'animate-pulse' : ''}`}
        style={{ width: 5, height: 5, background: s.color }}
      />
      {status}
    </span>
  )
}

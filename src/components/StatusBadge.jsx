const MAP = {
  Confirmed:        { text: 'text-emerald-400', bg: 'bg-emerald-400/[0.1]',  border: 'border-emerald-400/20', dot: 'bg-emerald-400' },
  Online:           { text: 'text-emerald-400', bg: 'bg-emerald-400/[0.1]',  border: 'border-emerald-400/20', dot: 'bg-emerald-400' },
  Pending:          { text: 'text-amber-400',   bg: 'bg-amber-400/[0.1]',    border: 'border-amber-400/20',   dot: 'bg-amber-400'   },
  Warning:          { text: 'text-amber-400',   bg: 'bg-amber-400/[0.1]',    border: 'border-amber-400/20',   dot: 'bg-amber-400'   },
  Offline:          { text: 'text-red-400',     bg: 'bg-red-400/[0.1]',      border: 'border-red-400/20',     dot: 'bg-red-400'     },
  Good:             { text: 'text-emerald-400', bg: 'bg-emerald-400/[0.1]',  border: 'border-emerald-400/20', dot: 'bg-emerald-400' },
  'Check Required': { text: 'text-amber-400',   bg: 'bg-amber-400/[0.1]',    border: 'border-amber-400/20',   dot: 'bg-amber-400'   },
}
const DEFAULT = { text: 'text-slate-400', bg: 'bg-slate-400/[0.1]', border: 'border-slate-400/20', dot: 'bg-slate-400' }

export default function StatusBadge({ status, pulse = false }) {
  const s = MAP[status] ?? DEFAULT
  return (
    <span className={`inline-flex items-center gap-1.5 text-[11px] font-medium px-2 py-[3px] rounded-md border ${s.text} ${s.bg} ${s.border}`}>
      <span className={`w-[5px] h-[5px] rounded-full flex-shrink-0 ${s.dot} ${pulse ? 'animate-pulse' : ''}`} />
      {status}
    </span>
  )
}

export default function SensorCard({ title, value, unit, icon, accent = '#22d3ee' }) {
  return (
    <div
      className="rounded-2xl p-5 flex items-center gap-4 transition-all hover:brightness-105 cursor-default"
      style={{
        background: 'var(--bg-surface)',
        border: `1px solid ${accent}25`,
      }}
    >
      <div
        className="w-11 h-11 rounded-xl flex items-center justify-center text-xl flex-shrink-0"
        style={{ background: `${accent}12` }}
      >
        {icon}
      </div>
      <div className="min-w-0">
        <p className="text-[11px] font-semibold uppercase tracking-[0.08em] mb-1" style={{ color: 'var(--text-faint)' }}>
          {title}
        </p>
        <p className="text-[24px] font-bold leading-none tabular-nums" style={{ color: accent }}>
          {value}
          {unit && <span className="text-[13px] font-normal ml-1" style={{ color: 'var(--text-muted)' }}>{unit}</span>}
        </p>
      </div>
    </div>
  )
}

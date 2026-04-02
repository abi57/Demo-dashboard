export default function SensorCard({ title, value, unit, icon, accent = '#00bcd4' }) {
  return (
    <div
      className="flex items-center gap-4 cursor-default transition-all"
      style={{
        padding: '18px 20px',
        borderRadius: 12,
        background: 'var(--bg-surface)',
        border: `1px solid ${accent}22`,
        boxShadow: 'var(--shadow-sm)',
      }}
      onMouseEnter={e => e.currentTarget.style.boxShadow = 'var(--shadow-md)'}
      onMouseLeave={e => e.currentTarget.style.boxShadow = 'var(--shadow-sm)'}
    >
      <div
        className="flex items-center justify-center flex-shrink-0"
        style={{ width: 42, height: 42, borderRadius: 10, background: `${accent}10`, border: `1px solid ${accent}20`, fontSize: 20 }}
      >
        {icon}
      </div>
      <div className="min-w-0 flex-1">
        <p style={{
          fontSize: 'var(--t-label)',
          fontWeight: 'var(--fw-semibold)',
          letterSpacing: 'var(--ls-label)',
          textTransform: 'uppercase',
          color: 'var(--text-faint)',
          marginBottom: 6,
        }}>
          {title}
        </p>
        <p style={{
          fontSize: 'var(--t-data-md)',
          fontWeight: 'var(--fw-bold)',
          letterSpacing: 'var(--ls-tight)',
          lineHeight: 1,
          fontVariantNumeric: 'tabular-nums',
          color: accent,
        }}>
          {value}
          {unit && (
            <span style={{ fontSize: 'var(--t-body-sm)', fontWeight: 'var(--fw-medium)', marginLeft: 4, color: 'var(--text-muted)' }}>
              {unit}
            </span>
          )}
        </p>
      </div>
    </div>
  )
}

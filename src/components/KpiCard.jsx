export default function KPICard({ label, value, sub, icon: Icon, iconColor, dot, dotColor }) {
  return (
    <div className="vio-card" style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <span className="vio-label">{label}</span>
        {Icon && <Icon size={18} color={iconColor ?? 'var(--vio-primary)'} />}
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
        {dot && (
          <span style={{ width: 8, height: 8, borderRadius: '50%', background: dotColor ?? 'var(--vio-status-green)', flexShrink: 0 }} />
        )}
        <span className="vio-kpi">{value}</span>
      </div>
      {sub && <span style={{ fontSize: 12, color: 'var(--vio-text-muted)' }}>{sub}</span>}
    </div>
  )
}

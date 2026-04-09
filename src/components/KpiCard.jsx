import { TrendingUp } from 'lucide-react'

const COLORS = {
  green:  { border: '#16a34a', bg: '#f0fdf4', icon: '#16a34a', value: '#16a34a' },
  amber:  { border: '#f59e0b', bg: '#fffbeb', icon: '#f59e0b', value: '#f59e0b' },
  red:    { border: '#dc2626', bg: '#fef2f2', icon: '#dc2626', value: '#dc2626' },
  grey:   { border: '#9ca3af', bg: '#f9fafb', icon: '#9ca3af', value: '#6b7280' },
  blue:   { border: '#3b82f6', bg: '#eff6ff', icon: '#3b82f6', value: '#3b82f6' },
  teal:   { border: '#0b3d4a', bg: '#f0f9ff', icon: '#0b3d4a', value: '#0b3d4a' },
  pink:   { border: '#e84393', bg: '#fdf2f8', icon: '#e84393', value: '#e84393' },
}

export default function KPICard({ label, value, sub, icon: Icon, color = 'teal', dot }) {
  const c = COLORS[color] ?? COLORS.teal

  return (
    <div style={{
      background: '#ffffff',
      border: '1px solid #e5e7eb',
      borderLeft: `4px solid ${c.border}`,
      borderRadius: 12,
      padding: '18px 20px',
      display: 'flex', flexDirection: 'column', gap: 6,
      minWidth: 0,
    }}>
      {/* Top row — icon + label */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
        {Icon ? (
          <Icon size={16} color={c.icon} strokeWidth={2} />
        ) : dot ? (
          <span style={{ width: 10, height: 10, borderRadius: '50%', background: c.border, flexShrink: 0 }} />
        ) : null}
        <span style={{
          fontSize: 13, fontWeight: 500, color: '#6b7280',
          overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
        }}>
          {label}
        </span>
      </div>

      {/* Value */}
      <div style={{
        fontSize: 32, fontWeight: 800, color: c.value,
        lineHeight: 1, fontVariantNumeric: 'tabular-nums',
        letterSpacing: '-0.02em',
      }}>
        {value}
      </div>

      {/* Subtitle */}
      {sub && (
        <span style={{ fontSize: 12, color: '#9ca3af', lineHeight: 1.3 }}>
          {sub}
        </span>
      )}
    </div>
  )
}

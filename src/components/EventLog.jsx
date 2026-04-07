import { useState } from 'react'

const SEV_CLASS = { critical: 'vt-badge vt-badge-alert', warning: 'vt-badge vt-badge-warn', info: 'vt-badge vt-badge-ok' }
const SEV_LABEL = { critical: 'Critical', warning: 'Warning', info: 'Info' }
const PAGE_SIZE = 20

export default function EventLog({ events }) {
  const [sevFilter, setSevFilter] = useState('all')
  const [page, setPage] = useState(0)

  const filtered = events.filter(e => sevFilter === 'all' || e.severity === sevFilter)
  const total = filtered.length
  const pages = Math.ceil(total / PAGE_SIZE)
  const rows = filtered.slice(page * PAGE_SIZE, (page + 1) * PAGE_SIZE)

  return (
    <div className="vt-card overflow-hidden">
      <div style={{ padding: '12px 16px', borderBottom: '0.5px solid #dde4e7', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 8, flexWrap: 'wrap' }}>
        <p style={{ fontSize: 13, fontWeight: 500, color: '#0b3d4a' }}>Event Log</p>
        <div style={{ display: 'flex', gap: 6 }}>
          {['all', 'critical', 'warning', 'info'].map(s => (
            <button
              key={s}
              onClick={() => { setSevFilter(s); setPage(0) }}
              style={{
                height: 26, padding: '0 10px', borderRadius: 99, fontSize: 11, fontWeight: 500,
                border: '1px solid',
                borderColor: sevFilter === s ? '#0b3d4a' : '#dde4e7',
                background: sevFilter === s ? '#0b3d4a' : 'transparent',
                color: sevFilter === s ? '#fff' : '#6b7280',
                cursor: 'pointer',
                textTransform: 'capitalize',
              }}
            >
              {s === 'all' ? 'All' : SEV_LABEL[s]}
            </button>
          ))}
        </div>
      </div>

      <div style={{ overflowX: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ background: '#f4f7f8' }}>
              {['Timestamp', 'Node ID', 'Asset', 'Metric', 'Value', 'Threshold', 'Severity'].map(h => (
                <th key={h} className="vt-label" style={{ padding: '8px 12px', textAlign: 'left', borderBottom: '0.5px solid #dde4e7', whiteSpace: 'nowrap' }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((e, i) => (
              <tr key={e.id} style={{ background: i % 2 === 0 ? '#fff' : '#fafcfc', borderBottom: '0.5px solid #f0f4f5' }}>
                <td className="vt-mono" style={{ padding: '9px 12px', fontSize: 11, color: '#6b7280', whiteSpace: 'nowrap' }}>{e.ts}</td>
                <td className="vt-mono" style={{ padding: '9px 12px', fontSize: 11, fontWeight: 600, color: '#0b3d4a', whiteSpace: 'nowrap' }}>{e.node}</td>
                <td style={{ padding: '9px 12px', fontSize: 12, color: '#374151', whiteSpace: 'nowrap' }}>{e.asset}</td>
                <td style={{ padding: '9px 12px', fontSize: 12, color: '#374151' }}>{e.metric}</td>
                <td className="vt-mono" style={{ padding: '9px 12px', fontSize: 12, fontWeight: 500, color: e.severity === 'critical' ? '#dc2626' : e.severity === 'warning' ? '#d97706' : '#0b3d4a' }}>{e.value}</td>
                <td className="vt-mono" style={{ padding: '9px 12px', fontSize: 12, color: '#9ca3af' }}>{e.threshold}</td>
                <td style={{ padding: '9px 12px' }}>
                  <span className={SEV_CLASS[e.severity]}>{SEV_LABEL[e.severity]}</span>
                </td>
              </tr>
            ))}
            {rows.length === 0 && (
              <tr><td colSpan={7} style={{ padding: '24px', textAlign: 'center', color: '#9ca3af', fontSize: 13 }}>No events</td></tr>
            )}
          </tbody>
        </table>
      </div>

      {pages > 1 && (
        <div style={{ padding: '10px 16px', borderTop: '0.5px solid #dde4e7', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <span style={{ fontSize: 12, color: '#9ca3af' }}>{total} events</span>
          <div style={{ display: 'flex', gap: 4 }}>
            <button className="vt-btn vt-btn-ghost" style={{ height: 28, padding: '0 10px', fontSize: 12 }} disabled={page === 0} onClick={() => setPage(p => p - 1)}>← Prev</button>
            <span style={{ fontSize: 12, color: '#6b7280', padding: '0 8px', lineHeight: '28px' }}>{page + 1} / {pages}</span>
            <button className="vt-btn vt-btn-ghost" style={{ height: 28, padding: '0 10px', fontSize: 12 }} disabled={page >= pages - 1} onClick={() => setPage(p => p + 1)}>Next →</button>
          </div>
        </div>
      )}
    </div>
  )
}

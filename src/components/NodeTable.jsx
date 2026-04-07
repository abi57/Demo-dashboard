import { useState, Fragment } from 'react'
import { SENSOR_TYPES } from '../data/viotelData'

const STATUS_CLASS = {
  online:  'vt-badge vt-badge-ok',
  warning: 'vt-badge vt-badge-warn',
  alert:   'vt-badge vt-badge-alert',
  offline: 'vt-badge vt-badge-offline',
}
const STATUS_LABEL = { online: 'Online', warning: 'Degraded', alert: 'Alert', offline: 'Offline' }

function BatteryBar({ pct }) {
  const color = pct < 20 ? '#dc2626' : pct < 40 ? '#f59e0b' : '#16a34a'
  return (
    <div className="flex items-center gap-1.5">
      <div style={{ width: 40, height: 6, borderRadius: 3, background: '#e5e7eb', overflow: 'hidden' }}>
        <div style={{ width: `${pct}%`, height: '100%', background: color, borderRadius: 3 }} />
      </div>
      <span className="vt-caption" style={{ color: pct < 20 ? '#dc2626' : '#6b7280' }}>{pct}%</span>
    </div>
  )
}

export default function NodeTable({ nodes }) {
  const [search, setSearch] = useState('')
  const [expanded, setExpanded] = useState(null)

  const filtered = nodes.filter(n => {
    const q = search.toLowerCase()
    return !q || n.id.toLowerCase().includes(q) || n.type.includes(q) || n.status.includes(q)
  })

  return (
    <div className="vt-card overflow-hidden">
      <div style={{ padding: '12px 16px', borderBottom: '0.5px solid #dde4e7', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 8 }}>
        <p style={{ fontSize: 13, fontWeight: 500, color: '#0b3d4a' }}>Sensor Nodes</p>
        <input
          className="vt-input"
          style={{ width: 180, height: 30, fontSize: 12 }}
          placeholder="Search nodes…"
          value={search}
          onChange={e => setSearch(e.target.value)}
        />
      </div>

      <div style={{ overflowX: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ background: '#f4f7f8' }}>
              {['Node ID', 'Type', 'Status', 'Reading', 'Battery', 'Signal', 'Last Seen'].map(h => (
                <th key={h} className="vt-label" style={{ padding: '8px 12px', textAlign: 'left', borderBottom: '0.5px solid #dde4e7', whiteSpace: 'nowrap' }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filtered.map((n, i) => {
              const st = SENSOR_TYPES[n.type]
              const isExp = expanded === n.id
              const rowBg = n.status === 'alert' ? '#fef2f2' : n.status === 'warning' ? '#fffbeb' : i % 2 === 0 ? '#fff' : '#fafcfc'
              return (
                <Fragment key={n.id}>
                  <tr
                    key={n.id}
                    style={{ background: rowBg, cursor: 'pointer', borderBottom: '0.5px solid #f0f4f5' }}
                    onClick={() => setExpanded(isExp ? null : n.id)}
                  >
                    <td style={{ padding: '10px 12px', whiteSpace: 'nowrap' }}>
                      <div className="flex items-center gap-2">
                        <span className="rounded-full flex-shrink-0" style={{ width: 7, height: 7, background: st.dot }} />
                        <span className="vt-mono" style={{ fontSize: 12, fontWeight: 500, color: '#0b3d4a' }}>{n.id}</span>
                      </div>
                    </td>
                    <td style={{ padding: '10px 12px' }}>
                      <span className="vt-caption">{st.label}</span>
                    </td>
                    <td style={{ padding: '10px 12px' }}>
                      <span className={STATUS_CLASS[n.status]}>
                        <span className="rounded-full" style={{ width: 5, height: 5, background: 'currentColor', display: 'inline-block' }} />
                        {STATUS_LABEL[n.status]}
                      </span>
                    </td>
                    <td style={{ padding: '10px 12px' }}>
                      <span className="vt-mono" style={{ fontSize: 12, color: n.status === 'alert' ? '#dc2626' : n.status === 'warning' ? '#d97706' : '#0b3d4a', fontWeight: 500 }}>
                        {n.reading}
                      </span>
                    </td>
                    <td style={{ padding: '10px 12px' }}><BatteryBar pct={n.battery} /></td>
                    <td style={{ padding: '10px 12px' }}>
                      <span className="vt-caption">{n.signal > 0 ? `${n.signal}%` : '—'}</span>
                    </td>
                    <td style={{ padding: '10px 12px' }}>
                      <span className="vt-caption">{n.lastSeen}</span>
                    </td>
                  </tr>
                  {isExp && (
                    <tr style={{ background: '#f4f7f8' }}>
                      <td colSpan={7} style={{ padding: '12px 16px', borderBottom: '0.5px solid #dde4e7' }}>
                        <div className="flex items-center gap-6 flex-wrap">
                          <div>
                            <p className="vt-label mb-1">Node ID</p>
                            <p className="vt-mono" style={{ fontSize: 13, color: '#0b3d4a' }}>{n.id}</p>
                          </div>
                          <div>
                            <p className="vt-label mb-1">Sensor Type</p>
                            <p className="vt-body">{st.label}</p>
                          </div>
                          <div>
                            <p className="vt-label mb-1">Primary Reading</p>
                            <p className="vt-mono" style={{ fontSize: 13, fontWeight: 500, color: '#0b3d4a' }}>{n.reading}</p>
                          </div>
                          <div>
                            <p className="vt-label mb-1">Battery</p>
                            <BatteryBar pct={n.battery} />
                          </div>
                          <div>
                            <p className="vt-label mb-1">Signal</p>
                            <p className="vt-body">{n.signal > 0 ? `${n.signal}%` : 'No signal'}</p>
                          </div>
                          <div>
                            <p className="vt-label mb-1">Last Seen</p>
                            <p className="vt-body">{n.lastSeen}</p>
                          </div>
                          <button className="vt-btn vt-btn-outline" style={{ height: 28, fontSize: 12, marginLeft: 'auto' }}>
                            View full history →
                          </button>
                        </div>
                      </td>
                    </tr>
                  )}
                </Fragment>
              )
            })}
            {filtered.length === 0 && (
              <tr>
                <td colSpan={7} style={{ padding: '24px', textAlign: 'center', color: '#9ca3af', fontSize: 13 }}>
                  No nodes match your search
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}

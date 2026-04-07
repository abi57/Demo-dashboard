import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Search } from 'lucide-react'
import AppShell from '../components/AppShell'
import StatusBadge from '../components/StatusBadge'
import { useApp } from '../context/AppContext'
import { SENSOR_TYPES } from '../data/seed'

function BatteryBar({ pct }) {
  const color = pct < 20 ? '#dc2626' : pct < 40 ? '#f59e0b' : '#16a34a'
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
      <div style={{ width: 48, height: 5, borderRadius: 3, background: 'var(--vio-card-border)', overflow: 'hidden' }}>
        <div style={{ width: `${pct}%`, height: '100%', background: color, borderRadius: 3 }} />
      </div>
      <span style={{ fontSize: 11, color: pct < 20 ? '#dc2626' : 'var(--vio-text-muted)' }}>{pct}%</span>
    </div>
  )
}

export default function Devices() {
  const { devices } = useApp()
  const navigate = useNavigate()
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [typeFilter, setTypeFilter] = useState('all')

  const filtered = devices.filter(d => {
    const q = search.toLowerCase()
    const matchSearch = !q || d.serial.toLowerCase().includes(q) || d.siteOwner.toLowerCase().includes(q) || d.towerId.toLowerCase().includes(q)
    const matchStatus = statusFilter === 'all' || d.status === statusFilter
    const matchType   = typeFilter === 'all' || d.sensorType === typeFilter
    return matchSearch && matchStatus && matchType
  })

  return (
    <AppShell title="Devices">
      {/* Filter bar */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 20, flexWrap: 'wrap' }}>
        <div style={{ position: 'relative', flex: '1 1 240px', maxWidth: 300 }}>
          <Search size={14} style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: 'var(--vio-text-muted)', pointerEvents: 'none' }} />
          <input className="vio-input" style={{ paddingLeft: 36 }} placeholder="Search serial, site, tower…"
            value={search} onChange={e => setSearch(e.target.value)} />
        </div>
        <div style={{ display: 'flex', gap: 6 }}>
          {['all','online','degraded','alert','offline'].map(s => (
            <button key={s} onClick={() => setStatusFilter(s)}
              className={`vio-btn vio-btn-sm ${statusFilter === s ? 'vio-btn-primary' : 'vio-btn-ghost'}`}
              style={{ textTransform: 'capitalize' }}>
              {s === 'all' ? 'All Status' : s}
            </button>
          ))}
        </div>
        <select className="vio-input" style={{ width: 160, height: 34, fontSize: 13 }} value={typeFilter} onChange={e => setTypeFilter(e.target.value)}>
          <option value="all">All Types</option>
          {Object.entries(SENSOR_TYPES).map(([k, v]) => <option key={k} value={k}>{v.label}</option>)}
        </select>
      </div>

      {filtered.length === 0 ? (
        <div style={{ textAlign: 'center', padding: 64 }}>
          <p style={{ fontSize: 18, color: 'var(--vio-text-muted)' }}>No devices match your filters.</p>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 16 }}>
          {filtered.map(d => {
            const st = SENSOR_TYPES[d.sensorType] ?? SENSOR_TYPES.smart
            return (
              <div key={d.serial} className="vio-card" style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <span style={{ width: 10, height: 10, borderRadius: '50%', background: st.color, flexShrink: 0 }} title={st.label} />
                    <span className="vio-mono" style={{ fontSize: 13, fontWeight: 600, color: 'var(--vio-primary)' }}>{d.serial}</span>
                  </div>
                  <StatusBadge status={d.status} />
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span className="vio-label">Site Owner</span>
                    <span style={{ fontSize: 13, color: 'var(--vio-text-secondary)' }}>{d.siteOwner}</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span className="vio-label">Tower ID</span>
                    <span className="vio-mono" style={{ fontSize: 12, color: 'var(--vio-text-secondary)' }}>{d.towerId}</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span className="vio-label">Height</span>
                    <span style={{ fontSize: 13, color: 'var(--vio-text-secondary)' }}>{d.heightAGL} m</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span className="vio-label">Installed</span>
                    <span style={{ fontSize: 13, color: 'var(--vio-text-secondary)' }}>{d.dateInstalled}</span>
                  </div>
                </div>
                <BatteryBar pct={d.battery} />
                <button className="vio-btn vio-btn-primary" style={{ width: '100%' }} onClick={() => navigate(`/devices/${d.serial}`)}>
                  View Dashboard →
                </button>
              </div>
            )
          })}
        </div>
      )}
    </AppShell>
  )
}

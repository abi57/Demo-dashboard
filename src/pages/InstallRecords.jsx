import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Search, Edit3, ChevronDown, ChevronUp, Camera, Video } from 'lucide-react'
import AppShell from '../components/AppShell'
import StatusBadge from '../components/StatusBadge'
import { useApp } from '../context/AppContext'

export default function InstallRecords() {
  const { installations, loading } = useApp()
  const navigate = useNavigate()
  const [search, setSearch] = useState('')
  const [expanded, setExpanded] = useState({})

  const toggleExpand = (id) => {
    setExpanded(prev => ({ ...prev, [id]: !prev[id] }))
  }

  const filtered = installations.filter(r => {
    const q = search.toLowerCase()
    if (!q) return true
    return [r.installer_name, r.tower_id, r.site_owner, r.company_name, r.sensor_serials]
      .some(v => v?.toLowerCase().includes(q))
  })

  const mediaCount = (r, type) => (r.media || []).filter(m => m.media_type === type).length

  return (
    <AppShell title="Completed Installations">
      <div style={{ position: 'relative', maxWidth: 400, marginBottom: 24 }}>
        <Search size={16} style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', color: 'var(--vio-text-muted)', pointerEvents: 'none' }} />
        <input className="vio-input" style={{ paddingLeft: 40, height: 44 }} placeholder="Search by installer, tower ID, site owner…"
          value={search} onChange={e => setSearch(e.target.value)} />
      </div>

      {loading ? (
        <div style={{ textAlign: 'center', padding: 64, color: 'var(--vio-text-muted)' }}>Loading…</div>
      ) : filtered.length === 0 ? (
        <div style={{ textAlign: 'center', padding: 64 }}>
          <p style={{ fontSize: 18, color: 'var(--vio-text-muted)' }}>
            {search ? 'No installations match your search.' : 'No completed installations yet.'}
          </p>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {filtered.map(r => {
            const isExpanded = expanded[r.id]
            const serialPhotos = mediaCount(r, 'serial_photo')
            const installPhotos = mediaCount(r, 'install_photo')
            const videos = mediaCount(r, 'video') + mediaCount(r, 'video_position_1') + mediaCount(r, 'video_position_2')

            return (
              <div key={r.id} className="vio-card" style={{ padding: '16px 18px' }}>
                {/* Header row: Tower ID + Status + Edit */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    <span style={{ fontSize: 17, fontWeight: 700, color: 'var(--vio-text-primary)' }}>{r.tower_id}</span>
                    <StatusBadge status={r.status} />
                  </div>
                  <button className="vio-btn vio-btn-secondary" style={{ gap: 6, flexShrink: 0, padding: '6px 12px', fontSize: 13 }}
                    onClick={() => navigate(`/install-records/${r.id}`)}>
                    <Edit3 size={14} /> Edit
                  </button>
                </div>

                {/* Compact summary grid - always visible */}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '6px 16px', marginBottom: 10 }}>
                  <CompactDetail label="Site" value={r.site_owner} />
                  <CompactDetail label="Installer" value={r.installer_name} />
                  <CompactDetail label="Date" value={r.date_installed} />
                  <CompactDetail label="Height" value={`${r.height_agl} m`} />
                </div>

                {/* Media counts inline */}
                {(serialPhotos > 0 || installPhotos > 0 || videos > 0) && (
                  <div style={{ display: 'flex', gap: 12, marginBottom: 10, flexWrap: 'wrap' }}>
                    {serialPhotos > 0 && (
                      <span style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: 12, color: 'var(--vio-text-muted)' }}>
                        <Camera size={13} /> {serialPhotos} serial
                      </span>
                    )}
                    {installPhotos > 0 && (
                      <span style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: 12, color: 'var(--vio-text-muted)' }}>
                        <Camera size={13} /> {installPhotos} install
                      </span>
                    )}
                    {videos > 0 && (
                      <span style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: 12, color: 'var(--vio-text-muted)' }}>
                        <Video size={13} /> {videos}
                      </span>
                    )}
                  </div>
                )}

                {/* Expand/collapse for more details */}
                <button
                  onClick={() => toggleExpand(r.id)}
                  style={{
                    display: 'flex', alignItems: 'center', gap: 4,
                    background: 'none', border: 'none', cursor: 'pointer',
                    fontSize: 13, fontWeight: 500, color: 'var(--vio-primary)',
                    padding: '4px 0',
                  }}
                >
                  {isExpanded ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
                  {isExpanded ? 'Less details' : 'More details'}
                </button>

                {/* Expanded details */}
                {isExpanded && (
                  <div style={{ marginTop: 10, paddingTop: 10, borderTop: '1px solid var(--vio-border)' }}>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '6px 16px' }}>
                      <CompactDetail label="Company" value={r.company_name} />
                      <CompactDetail label="Serials" value={r.sensor_serials} />
                      <CompactDetail label="Accel. Orient." value={r.accel_orientation != null ? `${r.accel_orientation}°` : '—'} />
                      <CompactDetail label="Accel. Facing" value={r.accel_facing_direction != null ? `${r.accel_facing_direction}°` : '—'} />
                      <CompactDetail label="Wind Orient." value={r.wind_orientation != null ? `${r.wind_orientation}°` : '—'} />
                      <CompactDetail label="Wind Height" value={r.wind_height_agl != null ? `${r.wind_height_agl} m` : '—'} />
                      <CompactDetail label="Structure" value={r.structural_element} />
                      <CompactDetail label="Power" value={r.power_source || '—'} />
                      <CompactDetail label="Battery" value={r.battery_voltage || '—'} />
                      <CompactDetail label="DC Output" value={r.dc_output || '—'} />
                      <CompactDetail label="Secure Fix" value={r.secure_fixing ? 'Yes' : 'No'} />
                      <CompactDetail label="Data Flow" value={r.data_flow ? 'Yes' : 'No'} />
                    </div>
                  </div>
                )}
              </div>
            )
          })}
        </div>
      )}

      <p style={{ fontSize: 15, color: 'var(--vio-text-muted)', marginTop: 20 }}>
        {filtered.length} installation{filtered.length !== 1 ? 's' : ''}
      </p>
    </AppShell>
  )
}

function CompactDetail({ label, value }) {
  return (
    <div style={{ display: 'flex', alignItems: 'baseline', gap: 8, minWidth: 0 }}>
      <span style={{ fontSize: 13, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.04em', color: 'var(--vio-text-muted)', flexShrink: 0 }}>{label}</span>
      <span style={{ fontSize: 15, fontWeight: 500, color: 'var(--vio-text-primary)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{value || '—'}</span>
    </div>
  )
}

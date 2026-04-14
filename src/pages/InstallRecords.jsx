import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Search, Edit3 } from 'lucide-react'
import AppShell from '../components/AppShell'
import StatusBadge from '../components/StatusBadge'
import { useApp } from '../context/AppContext'

export default function InstallRecords() {
  const { installations } = useApp()
  const navigate = useNavigate()
  const [search, setSearch] = useState('')

  const filtered = installations.filter(r => {
    if (!r.isNew) return false
    const q = search.toLowerCase()
    if (!q) return true
    return [r.installerName, r.towerId, r.siteOwner, r.company, ...r.sensorSerials]
      .some(v => v?.toLowerCase().includes(q))
  })

  return (
    <AppShell title="Completed Installations">
      {/* Search */}
      <div style={{ position: 'relative', maxWidth: 400, marginBottom: 24 }}>
        <Search size={16} style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', color: 'var(--vio-text-muted)', pointerEvents: 'none' }} />
        <input className="vio-input" style={{ paddingLeft: 40, height: 44 }} placeholder="Search by installer, tower ID, site owner…"
          value={search} onChange={e => setSearch(e.target.value)} />
      </div>

      {filtered.length === 0 ? (
        <div style={{ textAlign: 'center', padding: 64 }}>
          <p style={{ fontSize: 16, color: 'var(--vio-text-muted)' }}>
            {search ? 'No installations match your search.' : 'No completed installations yet.'}
          </p>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {filtered.map(r => (
            <div key={r.id} className="vio-card" style={{ padding: '20px 24px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 16 }}>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8 }}>
                    <span style={{ fontSize: 15, fontWeight: 600, color: 'var(--vio-text-primary)' }}>{r.towerId}</span>
                    <StatusBadge status={r.status} />
                  </div>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: 8 }}>
                    <Detail label="Site Owner" value={r.siteOwner} />
                    <Detail label="Installer" value={r.installerName} />
                    <Detail label="Company" value={r.company} />
                    <Detail label="Date" value={r.dateInstalled} />
                    <Detail label="Height" value={`${r.heightAGL} m`} />
                    <Detail label="Serials" value={r.sensorSerials.join(', ')} />
                    <Detail label="Accel. Orientation" value={r.accelOrientation != null ? `${r.accelOrientation}°` : '—'} />
                    <Detail label="Wind Sensor" value={r.windOrientation != null ? `${r.windOrientation}°` : 'N/A'} />
                    <Detail label="Serial Photos" value={r.serialPhotos?.length ? `${r.serialPhotos.length} photo${r.serialPhotos.length !== 1 ? 's' : ''}` : '—'} />
                    <Detail label="Install Photos" value={r.photos?.length ? `${r.photos.length} photo${r.photos.length !== 1 ? 's' : ''}` : '—'} />
                  </div>
                </div>
                <button
                  className="vio-btn vio-btn-secondary"
                  style={{ gap: 8, flexShrink: 0 }}
                  onClick={() => navigate(`/install-records/${r.id}`)}
                >
                  <Edit3 size={15} /> Edit
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      <p style={{ fontSize: 13, color: 'var(--vio-text-muted)', marginTop: 20 }}>
        {filtered.length} installation{filtered.length !== 1 ? 's' : ''}
      </p>
    </AppShell>
  )
}

function Detail({ label, value }) {
  return (
    <div>
      <span style={{ fontSize: 11, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.06em', color: 'var(--vio-text-muted)' }}>{label}</span>
      <p style={{ fontSize: 13, color: 'var(--vio-text-primary)', marginTop: 2 }}>{value || '—'}</p>
    </div>
  )
}

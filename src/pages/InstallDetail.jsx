import { useParams, useNavigate } from 'react-router-dom'
import { CheckCircle, XCircle, ArrowLeft, ExternalLink } from 'lucide-react'
import AppShell from '../components/AppShell'
import StatusBadge from '../components/StatusBadge'
import SerialBadge from '../components/SerialBadge'
import { useApp } from '../context/AppContext'
import { normTime, climbDuration } from '../data/seed'

function InfoRow({ label, value, mono }) {
  return (
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', padding: '8px 0', borderBottom: '0.5px solid var(--vio-card-border)' }}>
      <span className="vio-label" style={{ flexShrink: 0, marginRight: 16 }}>{label}</span>
      <span style={{ fontSize: 14, color: 'var(--vio-text-primary)', textAlign: 'right', fontFamily: mono ? 'ui-monospace,monospace' : undefined }}>{value ?? '—'}</span>
    </div>
  )
}

function ConfirmRow({ label, value }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '10px 0', borderBottom: '0.5px solid var(--vio-card-border)' }}>
      <span style={{ fontSize: 14, color: 'var(--vio-text-secondary)' }}>{label}</span>
      <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
        {value
          ? <><CheckCircle size={16} color="#16a34a" /><span style={{ fontSize: 13, fontWeight: 600, color: '#16a34a' }}>Confirmed</span></>
          : <><XCircle size={16} color="#dc2626" /><span style={{ fontSize: 13, fontWeight: 600, color: '#dc2626' }}>Not confirmed</span></>
        }
      </div>
    </div>
  )
}

export default function InstallDetail() {
  const { id } = useParams()
  const { installations } = useApp()
  const navigate = useNavigate()
  const rec = installations.find(i => i.id === id)

  if (!rec) return (
    <AppShell title="Installation Detail">
      <div style={{ textAlign: 'center', padding: 64 }}>
        <p style={{ fontSize: 18, color: 'var(--vio-text-muted)' }}>Installation not found.</p>
        <button className="vio-btn vio-btn-primary" style={{ marginTop: 16 }} onClick={() => navigate('/install-records')}>Back to records</button>
      </div>
    </AppShell>
  )

  return (
    <AppShell title={`Installation ${rec.id}`}>
      <button className="vio-btn vio-btn-ghost vio-btn-sm" style={{ marginBottom: 20, gap: 6 }} onClick={() => navigate('/install-records')}>
        <ArrowLeft size={14} /> Back to records
      </button>

      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: 20, alignItems: 'start' }}>
        {/* Left */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          {/* Installer & Site */}
          <div className="vio-card">
            <p className="vio-section-label">Installer & Site</p>
            <InfoRow label="Installer" value={rec.installerName} />
            <InfoRow label="Company" value={rec.company} />
            <InfoRow label="Submitted" value={rec.submitted} />
            <InfoRow label="Date Installed" value={rec.dateInstalled} />
          </div>

          {/* Asset & Sensor */}
          <div className="vio-card">
            <p className="vio-section-label">Asset & Sensor</p>
            <InfoRow label="Site Owner" value={rec.siteOwner} />
            <InfoRow label="Tower ID" value={rec.towerId} mono />
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '8px 0', borderBottom: '0.5px solid var(--vio-card-border)' }}>
              <span className="vio-label">Sensor Serial(s)</span>
              <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', justifyContent: 'flex-end' }}>
                {rec.sensorSerials.map(s => <SerialBadge key={s} serial={s} />)}
              </div>
            </div>
            <InfoRow label="Install Height" value={`${rec.heightAGL} m AGL`} />
            <InfoRow label="Accel. Orientation" value={rec.accelOrientation != null ? `${rec.accelOrientation}° North` : 'N/A'} />
            <InfoRow label="Wind Orientation" value={rec.windOrientation != null ? `${rec.windOrientation}° North` : 'N/A'} />
            <InfoRow label="Structural Element" value={rec.structuralElement} />
            <InfoRow label="Power" value={rec.batteryVoltage ? `Battery ${rec.batteryVoltage}` : rec.dcOutput ? `DC ${rec.dcOutput}` : '—'} />
          </div>

          {/* Confirmation */}
          <div className="vio-card">
            <p className="vio-section-label">Confirmation Status</p>
            <ConfirmRow label="Secure Fixing" value={rec.secureFixing} />
            <ConfirmRow label="Data Flow (myViotel)" value={rec.dataFlow} />
          </div>

          {/* Climb log */}
          <div className="vio-card">
            <p className="vio-section-label">Climb Log</p>
            {rec.climbs.length === 0 ? (
              <p style={{ color: 'var(--vio-text-muted)', fontSize: 13 }}>No climb data recorded.</p>
            ) : (
              <div style={{ overflowX: 'auto' }}>
                <table className="vio-table">
                  <thead>
                    <tr>
                      {['Climb', 'Up Start', 'Up Finish', 'Duration ↑', 'Down Start', 'Down Finish', 'Duration ↓'].map(h => <th key={h}>{h}</th>)}
                    </tr>
                  </thead>
                  <tbody>
                    {rec.climbs.map((c, i) => {
                      const us = normTime(c.upStart), uf = normTime(c.upFinish)
                      const ds = normTime(c.downStart), df = normTime(c.downFinish)
                      const upD = climbDuration(us, uf), dnD = climbDuration(ds, df)
                      const cell = t => t ? <span className="vio-mono" style={{ fontSize: 12 }}>{t}</span> : <span style={{ color: 'var(--vio-text-muted)' }}>—</span>
                      return (
                        <tr key={i}>
                          <td className="vio-cell" style={{ fontWeight: 600 }}>#{i + 1}</td>
                          <td>{cell(us)}</td><td>{cell(uf)}</td>
                          <td className="vio-cell">{upD ? `${upD} min` : '—'}</td>
                          <td>{cell(ds)}</td><td>{cell(df)}</td>
                          <td className="vio-cell">{dnD ? `${dnD} min` : '—'}</td>
                        </tr>
                      )
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>

        {/* Right sidebar */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          {/* Photos */}
          <div className="vio-card">
            <p className="vio-section-label">{rec.photos?.length ?? 0} Install Photographs</p>
            {!rec.photos?.length ? (
              <div style={{ textAlign: 'center', padding: '24px 0', color: 'var(--vio-text-muted)', fontSize: 13 }}>No photos uploaded</div>
            ) : (
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 8 }}>
                {rec.photos.map((p, i) => (
                  <div key={i} style={{ aspectRatio: '1', borderRadius: 8, overflow: 'hidden', background: 'var(--vio-page-bg)', border: '0.5px solid var(--vio-card-border)', cursor: 'pointer' }}>
                    <img src={p.url ?? p} alt={`Photo ${i+1}`} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Device links */}
          <div className="vio-card">
            <p className="vio-section-label">Device Links</p>
            {rec.sensorSerials.map(s => (
              <div key={s} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '8px 0', borderBottom: '0.5px solid var(--vio-card-border)' }}>
                <SerialBadge serial={s} />
                <button className="vio-btn vio-btn-ghost vio-btn-sm" style={{ gap: 4 }} onClick={() => navigate(`/devices/${s}`)}>
                  View device <ExternalLink size={12} />
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </AppShell>
  )
}

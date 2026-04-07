import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useViotel } from '../context/ViotelContext'
import { normTime, climbDuration } from '../data/installationData'

const SEV = { true: { cls: 'vt-badge vt-badge-ok', label: 'Yes' }, false: { cls: 'vt-badge vt-badge-alert', label: 'No' } }

function ClimbTable({ climbs }) {
  return (
    <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 12 }}>
      <thead>
        <tr style={{ background: '#f4f7f8' }}>
          {['Climb', 'Up Start', 'Up Finish', 'Up Duration', 'Down Start', 'Down Finish', 'Down Duration'].map(h => (
            <th key={h} style={{ padding: '6px 10px', textAlign: 'left', fontSize: 10, fontWeight: 500, letterSpacing: '0.08em', textTransform: 'uppercase', color: '#9ca3af', borderBottom: '0.5px solid #dde4e7' }}>{h}</th>
          ))}
        </tr>
      </thead>
      <tbody>
        {climbs.map((c, i) => {
          const us = normTime(c.upStart), uf = normTime(c.upFinish)
          const ds = normTime(c.downStart), df = normTime(c.downFinish)
          const upDur = climbDuration(us, uf), dnDur = climbDuration(ds, df)
          return (
            <tr key={i} style={{ borderBottom: '0.5px solid #f0f4f5' }}>
              <td style={{ padding: '7px 10px', fontWeight: 500, color: '#0b3d4a' }}>#{i + 1}</td>
              {[us, uf].map((t, j) => <td key={j} style={{ padding: '7px 10px', fontFamily: 'ui-monospace,monospace', color: t ? '#374151' : '#9ca3af' }}>{t ?? 'not recorded'}</td>)}
              <td style={{ padding: '7px 10px', color: upDur ? '#1b7a5e' : '#9ca3af' }}>{upDur ? `${upDur} min` : '—'}</td>
              {[ds, df].map((t, j) => <td key={j} style={{ padding: '7px 10px', fontFamily: 'ui-monospace,monospace', color: t ? '#374151' : '#9ca3af' }}>{t ?? 'not recorded'}</td>)}
              <td style={{ padding: '7px 10px', color: dnDur ? '#1b7a5e' : '#9ca3af' }}>{dnDur ? `${dnDur} min` : '—'}</td>
            </tr>
          )
        })}
      </tbody>
    </table>
  )
}

function DetailPanel({ rec, onClose }) {
  return (
    <div style={{ position: 'fixed', top: 0, right: 0, bottom: 0, width: 520, background: '#fff', borderLeft: '0.5px solid #dde4e7', zIndex: 100, overflowY: 'auto', boxShadow: '-4px 0 16px rgba(0,0,0,0.06)' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '16px 20px', borderBottom: '0.5px solid #dde4e7', position: 'sticky', top: 0, background: '#fff', zIndex: 1 }}>
        <div>
          <p style={{ fontSize: 14, fontWeight: 500, color: '#0b3d4a' }}>Installation {rec.id}</p>
          <p style={{ fontSize: 11, color: '#9ca3af', marginTop: 2 }}>Submitted {rec.submitted}</p>
        </div>
        <button onClick={onClose} style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: 20, color: '#9ca3af', lineHeight: 1 }}>×</button>
      </div>

      <div style={{ padding: '20px' }}>
        {/* Installer */}
        <Section title="Installer Details">
          <Row label="Full Name" value={rec.installerName} />
          <Row label="Company" value={rec.company} />
          <Row label="Date Installed" value={rec.dateInstalled} />
          <Row label="Submitted" value={rec.submitted} />
        </Section>

        {/* Asset & Sensor */}
        <Section title="Asset & Sensor">
          <Row label="Site Owner" value={rec.siteOwner} />
          <Row label="Tower ID / Asset Tag" value={rec.towerId} mono />
          <div style={{ marginBottom: 10 }}>
            <p style={lblStyle}>Sensor Serial(s)</p>
            <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginTop: 4 }}>
              {rec.sensorSerials.map(s => (
                <span key={s} style={{ padding: '2px 10px', borderRadius: 99, background: '#e8f4f6', border: '1px solid #b2d8e0', fontSize: 12, fontFamily: 'ui-monospace,monospace', color: '#0b3d4a' }}>{s}</span>
              ))}
            </div>
          </div>
          <Row label="Install Height" value={`${rec.heightAGL} m AGL`} />
          <Row label="Accel. Orientation" value={rec.accelOrientation != null ? `${rec.accelOrientation}° N` : 'N/A'} />
          <Row label="Wind Orientation" value={rec.windOrientation != null ? `${rec.windOrientation}° N` : 'N/A'} />
          <Row label="Structural Element" value={rec.structuralElement} />
          <Row label="Power" value={rec.batteryVoltage ? `Battery ${rec.batteryVoltage}` : rec.dcOutput ? `DC ${rec.dcOutput}` : '—'} />
        </Section>

        {/* Confirmation */}
        <Section title="Confirmation Checks">
          <div style={{ display: 'flex', gap: 24 }}>
            <div>
              <p style={lblStyle}>Secure Fixing</p>
              <span className={SEV[rec.secureFixing].cls} style={{ marginTop: 4, display: 'inline-flex' }}>
                {rec.secureFixing ? '✓' : '✕'} {SEV[rec.secureFixing].label}
              </span>
            </div>
            <div>
              <p style={lblStyle}>Data Flow (myViotel)</p>
              <span className={SEV[rec.dataFlow].cls} style={{ marginTop: 4, display: 'inline-flex' }}>
                {rec.dataFlow ? '✓' : '✕'} {rec.dataFlow ? 'Confirmed' : 'Failed'}
              </span>
            </div>
          </div>
        </Section>

        {/* Photos */}
        <Section title={`Install Photographs (${rec.photos.length})`}>
          {rec.photos.length === 0 ? (
            <p style={{ fontSize: 12, color: '#9ca3af' }}>No photographs uploaded</p>
          ) : (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 8 }}>
              {rec.photos.map((p, i) => (
                <a key={i} href={p.driveUrl} target="_blank" rel="noreferrer"
                  style={{ aspectRatio: '1', borderRadius: 6, background: '#f4f7f8', border: '0.5px solid #dde4e7', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden', textDecoration: 'none' }}>
                  {p.thumb ? <img src={p.thumb} alt={p.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} /> : (
                    <div style={{ textAlign: 'center', padding: 4 }}>
                      <div style={{ fontSize: 18, marginBottom: 2 }}>📷</div>
                      <p style={{ fontSize: 9, color: '#9ca3af', wordBreak: 'break-all' }}>{p.name}</p>
                    </div>
                  )}
                </a>
              ))}
            </div>
          )}
        </Section>

        {/* Climb log */}
        <Section title={`Climb Log (${rec.climbs.length} climb${rec.climbs.length !== 1 ? 's' : ''})`}>
          {rec.climbs.length === 0 ? (
            <p style={{ fontSize: 12, color: '#9ca3af' }}>No climb data recorded</p>
          ) : (
            <div style={{ overflowX: 'auto' }}>
              <ClimbTable climbs={rec.climbs} />
            </div>
          )}
        </Section>
      </div>
    </div>
  )
}

const lblStyle = { fontSize: 11, fontWeight: 500, letterSpacing: '0.08em', textTransform: 'uppercase', color: '#9ca3af', marginBottom: 2 }

function Section({ title, children }) {
  return (
    <div style={{ marginBottom: 20 }}>
      <p style={{ fontSize: 11, fontWeight: 500, letterSpacing: '0.08em', textTransform: 'uppercase', color: '#9ca3af', paddingBottom: 8, borderBottom: '0.5px solid #dde4e7', marginBottom: 12 }}>{title}</p>
      {children}
    </div>
  )
}

function Row({ label, value, mono }) {
  return (
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 8, gap: 12 }}>
      <p style={lblStyle}>{label}</p>
      <p style={{ fontSize: 13, color: '#374151', textAlign: 'right', fontFamily: mono ? 'ui-monospace,monospace' : undefined }}>{value || '—'}</p>
    </div>
  )
}

export default function Installations() {
  const { installations } = useViotel()
  const navigate = useNavigate()
  const [search, setSearch] = useState('')
  const [selected, setSelected] = useState(null)
  const [page, setPage] = useState(0)
  const PAGE = 20

  const filtered = installations.filter(r => {
    const q = search.toLowerCase()
    return !q || [r.installerName, r.company, r.siteOwner, r.towerId, ...r.sensorSerials].some(v => v?.toLowerCase().includes(q))
  })

  const pages = Math.ceil(filtered.length / PAGE)
  const rows = filtered.slice(page * PAGE, (page + 1) * PAGE)

  return (
    <div style={{ padding: '20px 24px 32px' }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
        <div>
          <h2 style={{ fontSize: 18, fontWeight: 500, color: '#0b3d4a', margin: 0 }}>Installation Records</h2>
          <p style={{ fontSize: 12, color: '#9ca3af', marginTop: 2 }}>{installations.length} records · field commissioning data</p>
        </div>
        <div style={{ display: 'flex', gap: 8 }}>
          <input
            className="vt-input" style={{ width: 240 }}
            placeholder="Search installer, company, tower ID…"
            value={search}
            onChange={e => { setSearch(e.target.value); setPage(0) }}
          />
          <button className="vt-btn vt-btn-ghost" style={{ whiteSpace: 'nowrap' }}>Export CSV</button>
          <button className="vt-btn vt-btn-primary" onClick={() => navigate('/installations/new')} style={{ whiteSpace: 'nowrap' }}>
            + Add Installation
          </button>
        </div>
      </div>

      {/* Table */}
      <div className="vt-card" style={{ overflow: 'hidden' }}>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ background: '#f4f7f8' }}>
                {['Submitted', 'Date Installed', 'Installer', 'Company', 'Site Owner', 'Tower ID', 'Sensor Serial(s)', 'Height', 'Secure Fixing', 'Data Flow', 'Photos', 'Climbs'].map(h => (
                  <th key={h} style={{ padding: '9px 12px', textAlign: 'left', fontSize: 10, fontWeight: 500, letterSpacing: '0.08em', textTransform: 'uppercase', color: '#9ca3af', borderBottom: '0.5px solid #dde4e7', whiteSpace: 'nowrap' }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {rows.map((r, i) => (
                <tr key={r.id}
                  onClick={() => setSelected(r)}
                  style={{ background: i % 2 === 0 ? '#fff' : '#fafcfc', borderBottom: '0.5px solid #f0f4f5', cursor: 'pointer' }}
                  onMouseEnter={e => e.currentTarget.style.background = '#f0f8fa'}
                  onMouseLeave={e => e.currentTarget.style.background = i % 2 === 0 ? '#fff' : '#fafcfc'}
                >
                  <td style={{ padding: '10px 12px', fontSize: 12, color: '#9ca3af', whiteSpace: 'nowrap' }}>{r.submitted}</td>
                  <td style={{ padding: '10px 12px', fontSize: 12, color: '#374151', whiteSpace: 'nowrap' }}>{r.dateInstalled}</td>
                  <td style={{ padding: '10px 12px', fontSize: 13, fontWeight: 500, color: '#0b3d4a', whiteSpace: 'nowrap' }}>{r.installerName}</td>
                  <td style={{ padding: '10px 12px', fontSize: 12, color: '#374151', whiteSpace: 'nowrap' }}>{r.company}</td>
                  <td style={{ padding: '10px 12px', fontSize: 12, color: '#374151', whiteSpace: 'nowrap' }}>{r.siteOwner}</td>
                  <td style={{ padding: '10px 12px', fontFamily: 'ui-monospace,monospace', fontSize: 12, fontWeight: 500, color: '#0b3d4a', whiteSpace: 'nowrap' }}>{r.towerId}</td>
                  <td style={{ padding: '10px 12px' }}>
                    <div style={{ display: 'flex', gap: 4, flexWrap: 'wrap' }}>
                      {r.sensorSerials.map(s => (
                        <span key={s} style={{ padding: '1px 7px', borderRadius: 99, background: '#e8f4f6', border: '1px solid #b2d8e0', fontSize: 11, fontFamily: 'ui-monospace,monospace', color: '#0b3d4a', whiteSpace: 'nowrap' }}>{s}</span>
                      ))}
                    </div>
                  </td>
                  <td style={{ padding: '10px 12px', fontSize: 12, color: '#374151', whiteSpace: 'nowrap' }}>{r.heightAGL} m</td>
                  <td style={{ padding: '10px 12px' }}><span className={SEV[r.secureFixing].cls}>{SEV[r.secureFixing].label}</span></td>
                  <td style={{ padding: '10px 12px' }}><span className={r.dataFlow ? 'vt-badge vt-badge-ok' : 'vt-badge vt-badge-alert'}>{r.dataFlow ? 'Confirmed' : 'Failed'}</span></td>
                  <td style={{ padding: '10px 12px' }}>
                    {r.photos.length > 0 ? (
                      <span style={{ fontSize: 12, color: '#0b3d4a', fontWeight: 500 }}>{r.photos.length} photos</span>
                    ) : <span style={{ fontSize: 12, color: '#9ca3af' }}>—</span>}
                  </td>
                  <td style={{ padding: '10px 12px' }}>
                    <span style={{ fontSize: 12, color: '#374151' }}>{r.climbs.length}</span>
                  </td>
                </tr>
              ))}
              {rows.length === 0 && (
                <tr><td colSpan={12} style={{ padding: '32px', textAlign: 'center', fontSize: 13, color: '#9ca3af' }}>No records match your search</td></tr>
              )}
            </tbody>
          </table>
        </div>
        {pages > 1 && (
          <div style={{ padding: '10px 16px', borderTop: '0.5px solid #dde4e7', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <span style={{ fontSize: 12, color: '#9ca3af' }}>{filtered.length} records</span>
            <div style={{ display: 'flex', gap: 4 }}>
              <button className="vt-btn vt-btn-ghost" style={{ height: 28, padding: '0 10px', fontSize: 12 }} disabled={page === 0} onClick={() => setPage(p => p - 1)}>← Prev</button>
              <span style={{ fontSize: 12, color: '#6b7280', padding: '0 8px', lineHeight: '28px' }}>{page + 1} / {pages}</span>
              <button className="vt-btn vt-btn-ghost" style={{ height: 28, padding: '0 10px', fontSize: 12 }} disabled={page >= pages - 1} onClick={() => setPage(p => p + 1)}>Next →</button>
            </div>
          </div>
        )}
      </div>

      {/* Detail panel */}
      {selected && (
        <>
          <div onClick={() => setSelected(null)} style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.15)', zIndex: 99 }} />
          <DetailPanel rec={selected} onClose={() => setSelected(null)} />
        </>
      )}
    </div>
  )
}

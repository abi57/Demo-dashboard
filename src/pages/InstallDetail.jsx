import { useParams, useNavigate } from 'react-router-dom'
import Header from '../components/Header'
import StatusBadge from '../components/StatusBadge'
import ClimbLogSection from '../components/ClimbLogSection'
import PhotoUpload from '../components/PhotoUpload'
import { useAppData } from '../context/AppDataContext'

const InfoBlock = ({ label, value, mono = false, accent }) => (
  <div>
    <p className="t-label mb-2" style={{ color: 'var(--text-faint)' }}>{label}</p>
    <p className={`t-body-sm font-medium ${mono ? 'font-mono' : ''}`} style={{ color: accent ?? 'var(--text-secondary)' }}>
      {value ?? '—'}
    </p>
  </div>
)

const Panel = ({ title, children }) => (
  <div className="rounded-xl overflow-hidden" style={{ background: 'var(--bg-surface)', border: '1px solid var(--border)' }}>
    <div className="px-6 py-4" style={{ borderBottom: '1px solid var(--border)' }}>
      <h4 style={{ color: 'var(--text-primary)' }}>{title}</h4>
    </div>
    <div className="p-6">{children}</div>
  </div>
)

export default function InstallDetail() {
  const { id } = useParams()
  const { installations } = useAppData()
  const navigate = useNavigate()
  const rec = installations.find(i => i.id === id)

  if (!rec) return (
    <div className="flex-1 flex items-center justify-center" style={{ background: 'var(--bg-base)' }}>
      <div className="text-center">
        <p className="text-5xl mb-4 opacity-20">🔍</p>
        <p className="t-body" style={{ color: 'var(--text-muted)' }}>Installation not found</p>
        <button onClick={() => navigate('/install-records')} className="mt-4 t-body-sm" style={{ color: 'var(--accent)' }}>
          ← Back to records
        </button>
      </div>
    </div>
  )

  return (
    <div className="flex-1 flex flex-col min-h-0" style={{ background: 'var(--bg-base)' }}>
      <Header
        title={`Installation ${rec.id}`}
        subtitle={`${rec.date} · ${rec.installer} · ${rec.company}`}
        action={
          <div className="flex items-center gap-2">
            <StatusBadge status={rec.status} />
            <button
              onClick={() => navigate('/install-records')}
              className="t-nav px-3 py-1.5 rounded-lg transition-all"
              style={{ color: 'var(--text-muted)', border: '1px solid var(--border)', background: 'var(--bg-elevated)' }}
              onMouseEnter={e => e.currentTarget.style.color = 'var(--text-primary)'}
              onMouseLeave={e => e.currentTarget.style.color = 'var(--text-muted)'}
            >
              ← Back
            </button>
          </div>
        }
      />
      <div className="flex-1 overflow-y-auto p-8">
        <div className="max-w-4xl mx-auto flex flex-col gap-5">

          {/* Identity strip */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {[
              { label: 'Tower ID',      value: rec.towerId,             accent: 'var(--accent)',       mono: true  },
              { label: 'Sensor Serial', value: rec.sensorSerial,        accent: '#a78bfa',             mono: true  },
              { label: 'Height AGL',    value: `${rec.installHeight}m`, accent: 'var(--text-primary)', mono: false },
              { label: 'Device Type',   value: rec.deviceType,          accent: '#34d399',             mono: false },
            ].map(s => (
              <div key={s.label} className="rounded-xl px-4 py-4"
                style={{ background: 'var(--bg-surface)', border: '1px solid var(--border)' }}>
                <p className="t-label mb-2" style={{ color: 'var(--text-faint)' }}>{s.label}</p>
                <p className={`t-data-sm ${s.mono ? 'font-mono' : ''}`} style={{ color: s.accent }}>{s.value}</p>
              </div>
            ))}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
            <Panel title="Installer Details">
              <div className="grid grid-cols-2 gap-5">
                <InfoBlock label="Full Name"  value={rec.installer} />
                <InfoBlock label="Company"    value={rec.company} />
                <InfoBlock label="Date"       value={rec.date} />
                <InfoBlock label="Site Owner" value={rec.siteOwner} />
              </div>
            </Panel>
            <Panel title="Installation Setup">
              <div className="grid grid-cols-2 gap-5">
                <InfoBlock label="Structural Element"        value={rec.structuralElement} />
                <InfoBlock label="Accelerometer Orientation" value={rec.accelerometerOrientation} />
                <InfoBlock label="Wind Sensor Orientation"   value={rec.windSensorOrientation} />
                <InfoBlock label="Asset Tag"                 value={rec.assetTag} mono />
              </div>
            </Panel>
          </div>

          <Panel title="Validation & Electrical">
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-5">
              <div>
                <p className="t-label mb-2" style={{ color: 'var(--text-faint)' }}>Secure Fixing</p>
                <StatusBadge status={rec.secureFixing ? 'Confirmed' : 'Warning'} />
              </div>
              <div>
                <p className="t-label mb-2" style={{ color: 'var(--text-faint)' }}>Data Flow</p>
                <StatusBadge status={rec.dataFlowConfirmed ? 'Confirmed' : 'Pending'} />
              </div>
              <InfoBlock label="Battery Voltage" value={`${rec.batteryVoltage}V`} />
              <InfoBlock label="DC Output"       value={`${rec.dcOutput}V`} />
            </div>
          </Panel>

          <Panel title={`Climb Logs · ${rec.climbs?.length ?? 0} recorded`}>
            {rec.climbs?.length
              ? <ClimbLogSection climbs={rec.climbs} readOnly />
              : <p className="t-body" style={{ color: 'var(--text-faint)' }}>No climb logs recorded</p>
            }
          </Panel>

          <Panel title="Site Photos">
            <PhotoUpload photos={rec.photos ?? []} readOnly />
          </Panel>

          <div className="flex justify-end pb-2">
            <button
              onClick={() => navigate(`/devices/${rec.sensorSerial}`)}
              className="t-body-sm flex items-center gap-2 px-5 py-2.5 rounded-xl font-medium transition-all"
              style={{ background: 'var(--accent-bg)', border: '1px solid var(--accent-border)', color: 'var(--accent)' }}
              onMouseEnter={e => e.currentTarget.style.background = 'var(--accent-border)'}
              onMouseLeave={e => e.currentTarget.style.background = 'var(--accent-bg)'}
            >
              ◉ Open Device Dashboard →
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

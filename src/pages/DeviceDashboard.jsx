import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import Header from '../components/Header'
import SensorCard from '../components/SensorCard'
import ChartsPanel from '../components/ChartsPanel'
import StatusBadge from '../components/StatusBadge'
import { useAppData } from '../context/AppDataContext'
import { DEVICE_SENSOR_DATA } from '../data/mockData'
import { drift } from '../data/sensors'

export default function DeviceDashboard() {
  const { id } = useParams()
  const { devices, installations } = useAppData()
  const navigate = useNavigate()

  const device = devices.find(d => d.id === id)
  const installation = installations.find(i => i.sensorSerial === id)
  const baseSensors = DEVICE_SENSOR_DATA[device?.deviceType] ?? DEVICE_SENSOR_DATA.environmental
  const [sensors, setSensors] = useState(baseSensors)

  useEffect(() => {
    setSensors(DEVICE_SENSOR_DATA[device?.deviceType] ?? DEVICE_SENSOR_DATA.environmental)
  }, [device?.deviceType])

  useEffect(() => {
    const t = setInterval(() => {
      setSensors(prev => prev.map(s => ({ ...s, value: drift(s.value, s.drift ?? 1) })))
    }, 3000)
    return () => clearInterval(t)
  }, [])

  const alerts = sensors.filter(s =>
    (s.id === 'vibration' && s.value > 0.08) ||
    (s.id === 'temp' && s.value > 35) ||
    (s.id === 'battery' && s.value < 20)
  )

  if (!device) return (
    <div className="flex-1 flex items-center justify-center transition-colors duration-200" style={{ background: 'var(--bg-base)' }}>
      <div className="text-center">
        <p className="text-5xl mb-4 opacity-20">📡</p>
        <p className="text-[14px]" style={{ color: 'var(--text-muted)' }}>Device not found</p>
        <button onClick={() => navigate('/devices')} className="mt-4 text-[13px] transition-colors" style={{ color: 'var(--accent)' }}>
          ← Back to devices
        </button>
      </div>
    </div>
  )

  return (
    <div className="flex-1 flex flex-col min-h-0 transition-colors duration-200" style={{ background: 'var(--bg-base)' }}>
      <Header
        title={device.serial}
        subtitle={`${device.site} · ${device.tower} · ${device.deviceType} sensor`}
        action={
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg"
              style={{ background: 'var(--bg-elevated)', border: '1px solid var(--border)' }}>
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              <span className="text-[11px]" style={{ color: 'var(--text-muted)' }}>Live · 3s</span>
            </div>
            <StatusBadge status={device.status} pulse={device.status === 'Online'} />
            <button
              onClick={() => navigate('/devices')}
              className="text-[12px] px-3 py-1.5 rounded-lg transition-all"
              style={{ color: 'var(--text-muted)', border: '1px solid var(--border)', background: 'var(--bg-elevated)' }}
              onMouseEnter={e => e.currentTarget.style.color = 'var(--text-primary)'}
              onMouseLeave={e => e.currentTarget.style.color = 'var(--text-muted)'}
            >
              ← Devices
            </button>
          </div>
        }
      />
      <div className="flex-1 overflow-y-auto p-8 flex flex-col gap-6">

        {/* Meta strip */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {[
            { label: 'Tower',     value: device.tower,       mono: true  },
            { label: 'Site',      value: device.site,        mono: false },
            { label: 'Installed', value: device.installDate, mono: false },
            { label: 'Engineer',  value: device.installer,   mono: false },
          ].map(s => (
            <div key={s.label} className="rounded-xl px-4 py-3.5 transition-colors"
              style={{ background: 'var(--bg-surface)', border: '1px solid var(--border)' }}>
              <p className="text-[10px] font-semibold uppercase tracking-[0.08em] mb-1.5" style={{ color: 'var(--text-faint)' }}>{s.label}</p>
              <p className={`text-[13px] ${s.mono ? 'font-mono' : ''}`} style={{ color: 'var(--text-secondary)' }}>{s.value}</p>
            </div>
          ))}
        </div>

        {/* Alerts */}
        {alerts.length > 0 && (
          <div className="rounded-2xl p-5" style={{ background: 'rgba(248,113,113,0.06)', border: '1px solid rgba(248,113,113,0.2)' }}>
            <p className="text-[11px] font-semibold uppercase tracking-[0.08em] mb-3" style={{ color: '#f87171' }}>Active Alerts</p>
            <div className="flex flex-col gap-2">
              {alerts.map(a => (
                <div key={a.id} className="flex items-center gap-3 text-[13px]" style={{ color: '#fca5a5' }}>
                  <span style={{ color: '#f87171' }}>▲</span>
                  <span>{a.title} is outside normal range: <strong className="font-mono">{a.value}{a.unit}</strong></span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Sensor cards */}
        <div>
          <p className="text-[11px] font-semibold uppercase tracking-[0.08em] mb-3" style={{ color: 'var(--text-faint)' }}>
            Live Readings
          </p>
          <div className="grid grid-cols-2 xl:grid-cols-4 gap-4">
            {sensors.map(s => (
              <SensorCard key={s.id} title={s.title} value={s.value} unit={s.unit} icon={s.icon} accent={s.accent} />
            ))}
          </div>
        </div>

        {/* Charts */}
        <div>
          <p className="text-[11px] font-semibold uppercase tracking-[0.08em] mb-3" style={{ color: 'var(--text-faint)' }}>
            Trend Analysis
          </p>
          <ChartsPanel sensors={sensors} />
        </div>

        {installation && (
          <div className="flex justify-end pb-2">
            <button
              onClick={() => navigate(`/install-records/${installation.id}`)}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-[13px] transition-all"
              style={{ background: 'var(--bg-elevated)', border: '1px solid var(--border)', color: 'var(--text-muted)' }}
              onMouseEnter={e => { e.currentTarget.style.color = 'var(--text-primary)'; e.currentTarget.style.borderColor = 'var(--border)' }}
              onMouseLeave={e => { e.currentTarget.style.color = 'var(--text-muted)' }}
            >
              📋 View Installation Record →
            </button>
          </div>
        )}
      </div>
    </div>
  )
}

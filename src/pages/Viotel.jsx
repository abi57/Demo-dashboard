import { useState, useEffect, useRef } from 'react'
import SensorCard from '../components/SensorCard'
import { SENSOR_DATA, drift } from '../data/sensors'
import { useAuth } from '../context/AuthContext'
import { useAlert } from '../context/AlertContext'

// ── Device list ────────────────────────────────────────────────────────────────
const INITIAL_DEVICES = [
  { id: 1, name: 'Temp Sensor A1',   status: 'Online',  signal: 92, icon: '🌡️' },
  { id: 2, name: 'Motion Sensor B2', status: 'Online',  signal: 78, icon: '🔍' },
  { id: 3, name: 'Door Lock C3',     status: 'Warning', signal: 45, icon: '🔒' },
  { id: 4, name: 'Air Quality D4',   status: 'Offline', signal: 0,  icon: '💨' },
  { id: 5, name: 'Camera E5',        status: 'Online',  signal: 88, icon: '📷' },
  { id: 6, name: 'Humidity F6',      status: 'Warning', signal: 51, icon: '💧' },
]

const STATUSES = ['Online', 'Online', 'Online', 'Warning', 'Offline']

function simulateDevice(device) {
  if (device.status === 'Offline' && Math.random() > 0.2) return device
  const newStatus = Math.random() > 0.85
    ? STATUSES[Math.floor(Math.random() * STATUSES.length)]
    : device.status
  const signalDelta = Math.floor((Math.random() - 0.5) * 12)
  const newSignal = newStatus === 'Offline'
    ? 0
    : Math.min(100, Math.max(5, device.signal + signalDelta))
  return { ...device, status: newStatus, signal: newSignal }
}

// Drift ranges per sensor id
const DRIFT_RANGE = { temp: 0.6, humidity: 2, pressure: 3, co2: 8 }

// ── Status styles ──────────────────────────────────────────────────────────────
const STATUS = {
  Online:  { dot: 'bg-green-400',  badge: 'text-green-400  bg-green-400/10  border-green-400/30'  },
  Offline: { dot: 'bg-red-400',    badge: 'text-red-400    bg-red-400/10    border-red-400/30'    },
  Warning: { dot: 'bg-yellow-400', badge: 'text-yellow-400 bg-yellow-400/10 border-yellow-400/30' },
}
const SIGNAL_COLOR = { Online: 'bg-green-400', Offline: 'bg-red-400', Warning: 'bg-yellow-400' }

// ── Live logs ──────────────────────────────────────────────────────────────────
const LOG_SOURCES = ['Temp Sensor A1', 'Motion Sensor B2', 'Door Lock C3', 'Camera E5', 'Humidity F6']
const LOG_EVENTS  = [
  'Heartbeat received', 'Data packet sent', 'Signal strength updated',
  'Config sync complete', 'Threshold alert triggered', 'Connection re-established',
]
const LOG_LEVELS  = ['INFO', 'INFO', 'INFO', 'WARN', 'ERROR']
const LEVEL_STYLE = {
  INFO:  'text-blue-400   bg-blue-400/10',
  WARN:  'text-yellow-400 bg-yellow-400/10',
  ERROR: 'text-red-400    bg-red-400/10',
}

function makeLog() {
  return {
    id:     Date.now() + Math.random(),
    time:   new Date().toLocaleTimeString(),
    level:  LOG_LEVELS[Math.floor(Math.random() * LOG_LEVELS.length)],
    source: LOG_SOURCES[Math.floor(Math.random() * LOG_SOURCES.length)],
    event:  LOG_EVENTS[Math.floor(Math.random() * LOG_EVENTS.length)],
  }
}

// ── Component ──────────────────────────────────────────────────────────────────
export default function Viotel() {
  const { user, isAdmin } = useAuth()
  const { push } = useAlert()
  const [devices, setDevices] = useState(INITIAL_DEVICES)
  const [sensors, setSensors] = useState(SENSOR_DATA)
  const [logs, setLogs]       = useState(() => Array.from({ length: 8 }, makeLog))
  const [latency, setLatency] = useState(24)
  const logRef = useRef(null)

  // Device status + signal — every 3s
  useEffect(() => {
    const t = setInterval(() => {
      setDevices(prev => {
        const updated = prev.map(simulateDevice)
        // Fire alerts for status changes
        updated.forEach((d, i) => {
          const old = prev[i]
          if (old.status !== d.status) {
            if (d.status === 'Offline')
              push(`${d.name} went Offline`, 'error')
            else if (d.status === 'Warning')
              push(`${d.name} is in Warning state`, 'warning')
            else if (d.status === 'Online' && old.status !== 'Online')
              push(`${d.name} is back Online`, 'success')
          }
        })
        return updated
      })
    }, 3000)
    return () => clearInterval(t)
  }, [push])

  // Sensor readings — every 3s (same cadence, separate concern)
  useEffect(() => {
    const t = setInterval(() => {
      setSensors(prev =>
        prev.map(s => ({ ...s, value: drift(s.value, DRIFT_RANGE[s.id] ?? 1) }))
      )
    }, 3000)
    return () => clearInterval(t)
  }, [])

  // Live logs + latency — every 2s
  useEffect(() => {
    const t = setInterval(() => {
      setLogs(prev => [makeLog(), ...prev].slice(0, 50))
      setLatency(Math.floor(18 + Math.random() * 30))
    }, 2000)
    return () => clearInterval(t)
  }, [])

  // Welcome alert on mount
  useEffect(() => {
    push(`Logged in as ${user?.name} (${user?.role})`, 'info')
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const online  = devices.filter(d => d.status === 'Online').length
  const warning = devices.filter(d => d.status === 'Warning').length
  const offline = devices.filter(d => d.status === 'Offline').length

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 text-white p-6 md:p-10">
      <div className="max-w-6xl mx-auto flex flex-col gap-8">

        {/* Header */}
        <div className="flex items-start justify-between gap-4 flex-wrap">
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-white">IoT Monitor</h1>
            <p className="text-slate-400 mt-1 text-sm">Real-time device visibility across your network</p>
          </div>
          <div className="flex items-center gap-2">
            {isAdmin && (
              <div className="flex gap-2">
                <button
                  onClick={() => push('System diagnostic started', 'info')}
                  className="text-xs px-3 py-2 rounded-lg bg-purple-500/15 border border-purple-500/25 text-purple-400 hover:bg-purple-500/25 transition-all"
                >
                  🔧 Run Diagnostic
                </button>
                <button
                  onClick={() => push('All devices restarted successfully', 'success')}
                  className="text-xs px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-slate-400 hover:text-white hover:bg-white/10 transition-all"
                >
                  ↺ Restart All
                </button>
              </div>
            )}
            <span className={`text-xs font-medium px-2.5 py-1.5 rounded-lg border capitalize ${
              isAdmin
                ? 'text-purple-400 bg-purple-400/10 border-purple-400/25'
                : 'text-blue-400 bg-blue-400/10 border-blue-400/25'
            }`}>
              {user?.role}
            </span>
          </div>
        </div>

        {/* Live sensor readings — reuses SensorCard */}
        <div>
          <p className="text-xs text-slate-500 uppercase tracking-wider mb-3">Live Sensor Readings</p>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {sensors.map(s => (
              <SensorCard
                key={s.id}
                title={s.title}
                value={s.value}
                unit={s.unit}
                icon={s.icon}
                accent={s.accent}
              />
            ))}
          </div>
        </div>

        {/* Device status summary */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {[
            { label: 'Online',  val: online,         color: 'text-green-400',  bg: 'bg-green-400/10',  icon: '✅' },
            { label: 'Warning', val: warning,        color: 'text-yellow-400', bg: 'bg-yellow-400/10', icon: '⚠️' },
            { label: 'Offline', val: offline,        color: 'text-red-400',    bg: 'bg-red-400/10',    icon: '❌' },
            { label: 'Total',   val: devices.length, color: 'text-purple-400', bg: 'bg-purple-400/10', icon: '📡' },
          ].map(s => (
            <div key={s.label} className="backdrop-blur-md bg-white/5 border border-white/10 rounded-2xl p-4 flex items-center gap-3">
              <span className={`text-2xl w-10 h-10 flex items-center justify-center rounded-xl ${s.bg}`}>{s.icon}</span>
              <div>
                <p className="text-xs text-slate-400 uppercase tracking-wider">{s.label}</p>
                <p className={`text-2xl font-bold ${s.color}`}>{s.val}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Main grid */}
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_360px] gap-6 items-start">

          {/* Device table */}
          <div className="backdrop-blur-md bg-white/5 border border-white/10 rounded-2xl overflow-hidden">
            <div className="px-6 py-4 border-b border-white/10 flex items-center justify-between">
              <h2 className="text-base font-semibold text-white">Connected Devices</h2>
              <span className="text-xs text-slate-500">Updates every 3s</span>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="text-slate-400 text-xs uppercase tracking-wider border-b border-white/10">
                    <th className="text-left px-6 py-3">Device</th>
                    <th className="text-left px-6 py-3">Status</th>
                    <th className="text-left px-6 py-3">Signal</th>
                  </tr>
                </thead>
                <tbody>
                  {devices.map((d, i) => (
                    <tr
                      key={d.id}
                      className={`transition-colors hover:bg-white/5 ${i !== devices.length - 1 ? 'border-b border-white/5' : ''}`}
                    >
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <span className="text-xl w-9 h-9 flex items-center justify-center rounded-lg bg-white/5">{d.icon}</span>
                          <span className="font-medium text-white">{d.name}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`inline-flex items-center gap-1.5 text-xs font-medium px-2.5 py-1 rounded-full border ${STATUS[d.status].badge}`}>
                          <span className={`w-1.5 h-1.5 rounded-full animate-pulse ${STATUS[d.status].dot}`} />
                          {d.status}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="flex-1 h-1.5 rounded-full bg-white/10 overflow-hidden w-24">
                            <div
                              className={`h-full rounded-full transition-all duration-700 ${SIGNAL_COLOR[d.status]}`}
                              style={{ width: `${d.signal}%` }}
                            />
                          </div>
                          <span className="text-slate-400 text-xs w-8 text-right tabular-nums">{d.signal}%</span>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Right column */}
          <div className="flex flex-col gap-6">

            {/* Network health */}
            <div className="backdrop-blur-md bg-white/5 border border-white/10 rounded-2xl p-6">
              <h2 className="text-base font-semibold text-white mb-4">Network Health</h2>
              <div className="grid grid-cols-2 gap-3">
                {[
                  { label: 'Latency',      val: `${latency} ms`, color: latency > 40 ? 'text-yellow-400' : 'text-green-400' },
                  { label: 'Uptime',       val: '99.7 %',        color: 'text-green-400' },
                  { label: 'Active Nodes', val: online + warning, color: 'text-white' },
                  { label: 'Packet Loss',  val: '0.2 %',         color: 'text-green-400' },
                ].map(h => (
                  <div key={h.label} className="bg-white/5 border border-white/8 rounded-xl p-4">
                    <p className="text-xs text-slate-400 uppercase tracking-wider mb-1">{h.label}</p>
                    <p className={`text-2xl font-bold tabular-nums ${h.color}`}>{h.val}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Live logs */}
            <div className="backdrop-blur-md bg-white/5 border border-white/10 rounded-2xl p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-base font-semibold text-white">Live Logs</h2>
                <span className="text-xs font-semibold text-green-400 bg-green-400/10 border border-green-400/30 px-2.5 py-1 rounded-full animate-pulse">
                  ● LIVE
                </span>
              </div>
              <div ref={logRef} className="flex flex-col gap-1.5 max-h-72 overflow-y-auto">
                {logs.map(log => (
                  <div
                    key={log.id}
                    className="grid grid-cols-[60px_40px_1fr] gap-2 items-center text-xs font-mono bg-white/3 border border-white/5 rounded-lg px-3 py-2"
                  >
                    <span className="text-slate-500">{log.time}</span>
                    <span className={`text-center text-[10px] font-bold px-1.5 py-0.5 rounded ${LEVEL_STYLE[log.level]}`}>
                      {log.level}
                    </span>
                    <span className="text-slate-300 truncate">{log.source} — {log.event}</span>
                  </div>
                ))}
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  )
}

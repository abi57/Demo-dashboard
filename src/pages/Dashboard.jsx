import { useNavigate } from 'react-router-dom'
import { ClipboardCheck, Wifi, AlertCircle, MapPin, ArrowRight } from 'lucide-react'
import { Bar, Doughnut } from 'react-chartjs-2'
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, ArcElement, Tooltip, Legend } from 'chart.js'
import AppShell from '../components/AppShell'
import KPICard from '../components/KPICard'
import StatusBadge from '../components/StatusBadge'
import SerialBadge from '../components/SerialBadge'
import { useApp } from '../context/AppContext'

ChartJS.register(CategoryScale, LinearScale, BarElement, ArcElement, Tooltip, Legend)

export default function Dashboard() {
  const { installations, devices } = useApp()
  const navigate = useNavigate()

  const confirmed = installations.filter(i => i.secureFixing && i.dataFlow).length
  const pending   = installations.filter(i => !i.secureFixing || !i.dataFlow).length
  const online    = devices.filter(d => d.status === 'online').length
  const sites     = [...new Set(installations.map(i => i.siteOwner))].length
  const recent    = installations.slice(0, 5)

  // Bar chart: last 30 days
  const last30 = Array.from({ length: 30 }, (_, i) => {
    const d = new Date(); d.setDate(d.getDate() - (29 - i))
    return d.toISOString().split('T')[0]
  })
  const countByDay = last30.map(day => installations.filter(i => i.dateInstalled === day).length)

  const barData = {
    labels: last30.map(d => d.slice(5)),
    datasets: [{ data: countByDay, backgroundColor: '#0b3d4a', borderRadius: 4, borderSkipped: false }],
  }
  const barOpts = {
    responsive: true, maintainAspectRatio: false, animation: false,
    plugins: { legend: { display: false }, tooltip: { callbacks: { title: i => last30[i[0].dataIndex] } } },
    scales: {
      x: { grid: { display: false }, ticks: { color: '#9ca3af', font: { size: 10 }, maxTicksLimit: 8 } },
      y: { grid: { color: 'rgba(0,0,0,0.04)' }, ticks: { color: '#9ca3af', font: { size: 10 }, stepSize: 1 }, beginAtZero: true },
    },
  }

  const statusCounts = {
    online:   devices.filter(d => d.status === 'online').length,
    degraded: devices.filter(d => d.status === 'degraded').length,
    alert:    devices.filter(d => d.status === 'alert').length,
    offline:  devices.filter(d => d.status === 'offline').length,
  }
  const donutData = {
    labels: ['Online', 'Degraded', 'Alert', 'Offline'],
    datasets: [{ data: Object.values(statusCounts), backgroundColor: ['#16a34a','#f59e0b','#dc2626','#9ca3af'], borderWidth: 0 }],
  }
  const donutOpts = {
    responsive: true, maintainAspectRatio: false, animation: false,
    plugins: { legend: { position: 'bottom', labels: { font: { size: 11 }, padding: 12, color: '#4b5e66' } } },
    cutout: '65%',
  }

  return (
    <AppShell title="Dashboard">
      {/* KPI row */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 16, marginBottom: 24 }}>
        <KPICard label="Total Installations" value={installations.length} icon={ClipboardCheck} iconColor="#0b3d4a" sub={`${confirmed} confirmed`} />
        <KPICard label="Online Devices" value={online} icon={Wifi} iconColor="#16a34a" dot dotColor="#16a34a" sub={`of ${devices.length} total`} />
        <KPICard label="Pending Confirmations" value={pending} icon={AlertCircle} iconColor={pending > 0 ? '#f59e0b' : '#16a34a'} dot dotColor={pending > 0 ? '#f59e0b' : '#16a34a'} sub="secure fixing or data flow" />
        <KPICard label="Total Sites" value={sites} icon={MapPin} iconColor="#1b7a5e" sub="unique site owners" />
      </div>

      {/* Charts row */}
      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: 16, marginBottom: 24 }}>
        <div className="vio-card">
          <p className="vio-label" style={{ marginBottom: 16 }}>Installations — last 30 days</p>
          <div style={{ height: 200 }}><Bar data={barData} options={barOpts} /></div>
        </div>
        <div className="vio-card">
          <p className="vio-label" style={{ marginBottom: 16 }}>Device status breakdown</p>
          <div style={{ height: 200 }}><Doughnut data={donutData} options={donutOpts} /></div>
        </div>
      </div>

      {/* Recent installs + alerts */}
      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: 16 }}>
        <div className="vio-card" style={{ padding: 0 }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '16px 20px', borderBottom: '0.5px solid var(--vio-card-border)' }}>
            <p className="vio-label">Recent Installations</p>
            <button onClick={() => navigate('/install-records')} className="vio-btn vio-btn-ghost vio-btn-sm" style={{ gap: 4 }}>
              View all <ArrowRight size={12} />
            </button>
          </div>
          <table className="vio-table" style={{ width: '100%' }}>
            <thead>
              <tr>
                {['Date', 'Installer', 'Tower ID', 'Sensor', 'Site Owner', 'Status'].map(h => (
                  <th key={h}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {recent.length === 0 ? (
                <tr><td colSpan={6} style={{ textAlign: 'center', padding: 32, color: 'var(--vio-text-muted)' }}>No installations yet</td></tr>
              ) : recent.map(r => (
                <tr key={r.id} style={{ cursor: 'pointer' }} onClick={() => navigate(`/install-records/${r.id}`)}>
                  <td className="vio-cell">{r.dateInstalled}</td>
                  <td className="vio-cell">{r.installerName}</td>
                  <td className="vio-cell vio-mono" style={{ fontSize: 12 }}>{r.towerId}</td>
                  <td><div style={{ display: 'flex', gap: 4, flexWrap: 'wrap' }}>{r.sensorSerials.map(s => <SerialBadge key={s} serial={s} />)}</div></td>
                  <td className="vio-cell">{r.siteOwner}</td>
                  <td><StatusBadge status={r.status} /></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          {/* Alerts panel */}
          <div className="vio-card" style={{ padding: 0 }}>
            <p className="vio-label" style={{ padding: '16px 20px 12px', borderBottom: '0.5px solid var(--vio-card-border)' }}>Active Alerts</p>
            <div style={{ padding: '12px 16px' }}>
              {devices.filter(d => d.status === 'alert').length === 0 ? (
                <div style={{ textAlign: 'center', padding: '16px 0', color: 'var(--vio-status-green)', fontSize: 13 }}>
                  ✓ No active alerts
                </div>
              ) : devices.filter(d => d.status === 'alert').slice(0, 3).map(d => (
                <div key={d.serial} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '8px 0', borderBottom: '0.5px solid var(--vio-card-border)', borderLeft: '3px solid var(--vio-status-red)', paddingLeft: 10, marginLeft: -10 }}>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: 12, fontWeight: 600, color: 'var(--vio-text-primary)' }}>{d.serial}</div>
                    <div style={{ fontSize: 11, color: 'var(--vio-text-muted)' }}>{d.siteOwner} · {d.towerId}</div>
                  </div>
                  <StatusBadge status="alert" />
                </div>
              ))}
            </div>
          </div>

          {/* Quick device selector */}
          <div className="vio-card">
            <p className="vio-label" style={{ marginBottom: 12 }}>Quick Device Access</p>
            <select className="vio-input" onChange={e => { if (e.target.value) navigate(`/devices/${e.target.value}`) }} defaultValue="">
              <option value="" disabled>Select a device…</option>
              {devices.map(d => (
                <option key={d.serial} value={d.serial}>{d.serial} — {d.towerId}</option>
              ))}
            </select>
          </div>
        </div>
      </div>
    </AppShell>
  )
}

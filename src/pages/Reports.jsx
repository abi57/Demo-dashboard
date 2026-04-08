import { Bar, Line } from 'react-chartjs-2'
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, PointElement, LineElement, Tooltip, Legend } from 'chart.js'
import { Download } from 'lucide-react'
import AppShell from '../components/AppShell'
import KPICard from '../components/KpiCard'
import { useApp } from '../context/AppContext'
import { ClipboardCheck, Cpu, MapPin, Calendar } from 'lucide-react'

ChartJS.register(CategoryScale, LinearScale, BarElement, PointElement, LineElement, Tooltip, Legend)

export default function Reports() {
  const { installations, devices } = useApp()

  const thisMonth = installations.filter(i => {
    const d = new Date(i.dateInstalled)
    const now = new Date()
    return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear()
  }).length

  const sites = [...new Set(installations.map(i => i.siteOwner))].length

  // By company
  const byCompany = {}
  installations.forEach(i => { byCompany[i.company] = (byCompany[i.company] ?? 0) + 1 })
  const companyLabels = Object.keys(byCompany).sort((a, b) => byCompany[b] - byCompany[a])

  const barData = {
    labels: companyLabels,
    datasets: [{ data: companyLabels.map(c => byCompany[c]), backgroundColor: '#0b3d4a', borderRadius: 4 }],
  }
  const barOpts = {
    responsive: true, maintainAspectRatio: false, animation: false, indexAxis: 'y',
    plugins: { legend: { display: false } },
    scales: {
      x: { grid: { color: 'rgba(0,0,0,0.04)' }, ticks: { color: '#9ca3af', font: { size: 10 }, stepSize: 1 }, beginAtZero: true },
      y: { grid: { display: false }, ticks: { color: '#4b5e66', font: { size: 12 } } },
    },
  }

  // Monthly trend (last 6 months)
  const months = Array.from({ length: 6 }, (_, i) => {
    const d = new Date(); d.setMonth(d.getMonth() - (5 - i))
    return { label: d.toLocaleString('default', { month: 'short', year: '2-digit' }), month: d.getMonth(), year: d.getFullYear() }
  })
  const monthCounts = months.map(m => installations.filter(i => {
    const d = new Date(i.dateInstalled)
    return d.getMonth() === m.month && d.getFullYear() === m.year
  }).length)

  const lineData = {
    labels: months.map(m => m.label),
    datasets: [{ data: monthCounts, borderColor: '#1b7a5e', borderWidth: 2, fill: false, pointRadius: 4, pointBackgroundColor: '#1b7a5e', tension: 0.3 }],
  }
  const lineOpts = {
    responsive: true, maintainAspectRatio: false, animation: false,
    plugins: { legend: { display: false } },
    scales: {
      x: { grid: { display: false }, ticks: { color: '#9ca3af', font: { size: 11 } } },
      y: { grid: { color: 'rgba(0,0,0,0.04)' }, ticks: { color: '#9ca3af', font: { size: 10 }, stepSize: 1 }, beginAtZero: true },
    },
  }

  // Top installers
  const byInstaller = {}
  installations.forEach(i => {
    if (!byInstaller[i.installerName]) byInstaller[i.installerName] = { count: 0, confirmed: 0 }
    byInstaller[i.installerName].count++
    if (i.secureFixing && i.dataFlow) byInstaller[i.installerName].confirmed++
  })
  const topInstallers = Object.entries(byInstaller).sort((a, b) => b[1].count - a[1].count).slice(0, 8)

  return (
    <AppShell title="Reports">
      <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 8, marginBottom: 20 }}>
        <button className="vio-btn vio-btn-secondary vio-btn-sm" style={{ gap: 6 }}><Download size={14} /> Download CSV</button>
        <button className="vio-btn vio-btn-secondary vio-btn-sm" style={{ gap: 6 }}><Download size={14} /> Download PDF</button>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 16, marginBottom: 24 }}>
        <KPICard label="Total Installations" value={installations.length} icon={ClipboardCheck} />
        <KPICard label="Total Devices" value={devices.length} icon={Cpu} />
        <KPICard label="This Month" value={thisMonth} icon={Calendar} />
        <KPICard label="Sites Covered" value={sites} icon={MapPin} />
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 24 }}>
        <div className="vio-card">
          <p className="vio-label" style={{ marginBottom: 16 }}>Installations by Company</p>
          <div style={{ height: 220 }}><Bar data={barData} options={barOpts} /></div>
        </div>
        <div className="vio-card">
          <p className="vio-label" style={{ marginBottom: 16 }}>Monthly Trend</p>
          <div style={{ height: 220 }}><Line data={lineData} options={lineOpts} /></div>
        </div>
      </div>

      <div className="vio-card" style={{ padding: 0 }}>
        <p className="vio-label" style={{ padding: '16px 20px 12px', borderBottom: '0.5px solid var(--vio-card-border)' }}>Top Installers</p>
        <table className="vio-table">
          <thead><tr><th>Installer</th><th>Company</th><th>Installations</th><th>Completion Rate</th></tr></thead>
          <tbody>
            {topInstallers.map(([name, stats]) => {
              const inst = installations.find(i => i.installerName === name)
              const rate = Math.round((stats.confirmed / stats.count) * 100)
              return (
                <tr key={name}>
                  <td style={{ fontSize: 13, fontWeight: 500, color: 'var(--vio-text-primary)' }}>{name}</td>
                  <td className="vio-cell">{inst?.company ?? '—'}</td>
                  <td style={{ fontSize: 13, fontWeight: 600, color: 'var(--vio-primary)' }}>{stats.count}</td>
                  <td>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      <div style={{ width: 60, height: 5, borderRadius: 3, background: 'var(--vio-card-border)', overflow: 'hidden' }}>
                        <div style={{ width: `${rate}%`, height: '100%', background: rate === 100 ? '#16a34a' : rate >= 80 ? '#f59e0b' : '#dc2626', borderRadius: 3 }} />
                      </div>
                      <span style={{ fontSize: 12, color: 'var(--vio-text-secondary)' }}>{rate}%</span>
                    </div>
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
    </AppShell>
  )
}

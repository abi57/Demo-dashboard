import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { ArrowLeft } from 'lucide-react'
import { Line } from 'react-chartjs-2'
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Filler, Tooltip, TimeScale } from 'chart.js'
import 'chartjs-adapter-date-fns'
import AppShell from '../components/AppShell'
import StatusBadge from '../components/StatusBadge'
import KPICard from '../components/KpiCard'
import { useApp } from '../context/AppContext'
import { genFFT, genTimeSeries } from '../data/seed'

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Filler, Tooltip, TimeScale)

const RANGES = ['5 min', '15 min', '1 hr', '24 hr']

export default function DeviceDetail() {
  const { id } = useParams()
  const { devices } = useApp()
  const navigate = useNavigate()
  const device = devices.find(d => d.serial === id)
  const [range, setRange] = useState('1 hr')
  const [fftData] = useState(() => genFFT())
  const [series, setSeries] = useState(() => genTimeSeries())

  useEffect(() => {
    const t = setInterval(() => {
      setSeries(prev => {
        const last = prev[prev.length - 1]
        return [...prev.slice(1), { x: new Date(), y: +(last.y + (Math.random() - 0.5) * 0.02).toFixed(4) }]
      })
    }, 5000)
    return () => clearInterval(t)
  }, [])

  if (!device) return (
    <AppShell title="Device Dashboard">
      <div style={{ textAlign: 'center', padding: 64 }}>
        <p style={{ fontSize: 18, color: 'var(--vio-text-muted)' }}>Device not found.</p>
        <button className="vio-btn vio-btn-primary" style={{ marginTop: 16 }} onClick={() => navigate('/devices')}>Back to devices</button>
      </div>
    </AppShell>
  )

  const peakIdx = fftData.reduce((mi, p, i, a) => p.y > a[mi].y ? i : mi, 0)
  const resonantHz = fftData[peakIdx].x.toFixed(1)

  const fftChartData = {
    labels: fftData.map(p => p.x.toFixed(1)),
    datasets: [{
      data: fftData.map(p => p.y),
      borderColor: '#0b3d4a', borderWidth: 2,
      fill: true, backgroundColor: 'rgba(224,238,242,0.7)',
      pointRadius: 0, tension: 0.3,
    }],
  }

  const warnPlugin = {
    id: 'bands',
    beforeDraw(chart) {
      const { ctx, chartArea: { left, right, top, bottom }, scales: { x } } = chart
      if (!x) return
      ctx.save()
      const toX = hz => x.getPixelForValue(Math.round(hz * 10))
      ctx.fillStyle = 'rgba(245,158,11,0.12)'
      ctx.fillRect(toX(3), top, toX(5) - toX(3), bottom - top)
      ctx.fillStyle = 'rgba(220,38,38,0.1)'
      ctx.fillRect(toX(7), top, toX(9) - toX(7), bottom - top)
      const px = x.getPixelForValue(peakIdx)
      ctx.strokeStyle = '#1b7a5e'; ctx.lineWidth = 1.5; ctx.setLineDash([4, 3])
      ctx.beginPath(); ctx.moveTo(px, top); ctx.lineTo(px, bottom); ctx.stroke()
      ctx.setLineDash([]); ctx.restore()
    },
  }

  const fftOpts = {
    responsive: true, maintainAspectRatio: false, animation: false,
    plugins: { legend: { display: false }, tooltip: { callbacks: { title: i => `${i[0].label} Hz`, label: i => `Amplitude: ${Number(i.raw).toFixed(4)}` } } },
    scales: {
      x: { ticks: { maxTicksLimit: 6, callback: (_, i) => i % 50 === 0 ? `${(i * 0.1).toFixed(0)} Hz` : '', color: '#9ca3af', font: { size: 10 } }, grid: { color: 'rgba(0,0,0,0.04)' }, title: { display: true, text: 'Frequency (Hz)', color: '#9ca3af', font: { size: 11 } } },
      y: { ticks: { color: '#9ca3af', font: { size: 10 } }, grid: { color: 'rgba(0,0,0,0.04)' }, title: { display: true, text: 'Amplitude', color: '#9ca3af', font: { size: 11 } } },
    },
  }

  const tsData = {
    datasets: [{
      data: series, borderColor: '#1b7a5e', borderWidth: 1.5,
      fill: false, pointRadius: 0, tension: 0.3,
    }],
  }

  const tsOpts = {
    responsive: true, maintainAspectRatio: false, animation: false,
    plugins: { legend: { display: false }, tooltip: { callbacks: { title: i => new Date(i[0].parsed.x).toLocaleTimeString(), label: i => `${i.parsed.y.toFixed(4)} g` } } },
    scales: {
      x: { type: 'time', time: { unit: 'minute', displayFormats: { minute: 'HH:mm' } }, ticks: { color: '#9ca3af', font: { size: 10 }, maxTicksLimit: 8 }, grid: { color: 'rgba(0,0,0,0.04)' } },
      y: { ticks: { color: '#9ca3af', font: { size: 10 } }, grid: { color: 'rgba(0,0,0,0.04)' }, title: { display: true, text: 'g', color: '#9ca3af', font: { size: 11 } } },
    },
  }

  return (
    <AppShell title={`Device: ${device.serial}`}>
      <button className="vio-btn vio-btn-ghost vio-btn-sm" style={{ marginBottom: 20, gap: 6 }} onClick={() => navigate('/devices')}>
        <ArrowLeft size={14} /> Back to devices
      </button>

      {/* Device header */}
      <div className="vio-card" style={{ display: 'flex', alignItems: 'center', gap: 20, marginBottom: 20, flexWrap: 'wrap' }}>
        <div>
          <span className="vio-mono" style={{ fontSize: 20, fontWeight: 700, color: 'var(--vio-primary)' }}>{device.serial}</span>
          <div style={{ fontSize: 13, color: 'var(--vio-text-muted)', marginTop: 4 }}>{device.siteOwner} · {device.towerId} · {device.heightAGL} m AGL</div>
        </div>
        <StatusBadge status={device.status} />
        <div style={{ marginLeft: 'auto', fontSize: 12, color: 'var(--vio-text-muted)' }}>
          Last seen: {new Date(device.lastSeen).toLocaleTimeString()}
        </div>
      </div>

      {/* KPIs */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 16, marginBottom: 20 }}>
        <KPICard label="Resonant Frequency" value={`${resonantHz} Hz`} />
        <KPICard label="Peak Acceleration" value={`${device.peakAccel} g`} />
        <KPICard label="Tilt X" value={`${device.tiltX}°`} />
        <KPICard label="Battery" value={`${device.battery}%`} dot dotColor={device.battery < 20 ? '#dc2626' : '#16a34a'} />
      </div>

      {/* FFT Chart */}
      <div className="vio-card" style={{ marginBottom: 16 }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12, flexWrap: 'wrap', gap: 8 }}>
          <div>
            <p className="vio-label">Frequency Spectrum (FFT)</p>
            <p style={{ fontSize: 12, color: 'var(--vio-text-muted)', marginTop: 2 }}>Resonant: <strong style={{ color: '#1b7a5e' }}>{resonantHz} Hz</strong></p>
          </div>
          <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
            {RANGES.map(r => (
              <button key={r} onClick={() => setRange(r)}
                className={`vio-btn vio-btn-sm ${range === r ? 'vio-btn-primary' : 'vio-btn-ghost'}`}>
                {r}
              </button>
            ))}
            <button className="vio-btn vio-btn-secondary vio-btn-sm">Export CSV</button>
            <button className="vio-btn vio-btn-secondary vio-btn-sm">Export PNG</button>
          </div>
        </div>
        <div style={{ height: 220 }}>
          <Line data={fftChartData} options={fftOpts} plugins={[warnPlugin]} />
        </div>
      </div>

      {/* Time series */}
      <div className="vio-card" style={{ marginBottom: 16 }}>
        <p className="vio-label" style={{ marginBottom: 12 }}>Peak Acceleration — Time Series</p>
        <div style={{ height: 180 }}>
          <Line data={tsData} options={tsOpts} />
        </div>
      </div>

      {/* Alert log */}
      <div className="vio-card">
        <p className="vio-label" style={{ marginBottom: 12 }}>Recent Alerts</p>
        <div style={{ textAlign: 'center', padding: '16px 0', color: 'var(--vio-text-muted)', fontSize: 13 }}>
          No recent alerts for this device.
        </div>
      </div>
    </AppShell>
  )
}

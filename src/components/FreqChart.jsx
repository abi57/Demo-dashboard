import { useState, useRef } from 'react'
import { Line } from 'react-chartjs-2'
import {
  Chart as ChartJS, CategoryScale, LinearScale, PointElement,
  LineElement, Filler, Tooltip, Legend,
} from 'chart.js'

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Filler, Tooltip, Legend)

const RANGES = ['5 min', '15 min', '1 hr', '24 hr']

export default function FreqChart({ fftData, dominantHz }) {
  const [range, setRange] = useState('1 hr')

  const labels = fftData.map(p => p.x.toFixed(1))
  const values = fftData.map(p => p.y)
  const peakIdx = values.indexOf(Math.max(...values))

  // Warning band: 3–5 Hz, Alert band: 7–9 Hz (example thresholds)
  const warnPlugin = {
    id: 'bands',
    beforeDraw(chart) {
      const { ctx, chartArea: { left, right, top, bottom }, scales: { x } } = chart
      if (!x) return
      const toX = hz => {
        const idx = Math.round(hz * 10)
        return x.getPixelForValue(idx)
      }
      // Warning band
      ctx.save()
      ctx.fillStyle = 'rgba(245,158,11,0.08)'
      ctx.fillRect(toX(3), top, toX(5) - toX(3), bottom - top)
      // Alert band
      ctx.fillStyle = 'rgba(220,38,38,0.07)'
      ctx.fillRect(toX(7), top, toX(9) - toX(7), bottom - top)
      // Resonant peak line
      const px = x.getPixelForValue(peakIdx)
      ctx.strokeStyle = '#1b7a5e'
      ctx.lineWidth = 1.5
      ctx.setLineDash([4, 3])
      ctx.beginPath()
      ctx.moveTo(px, top)
      ctx.lineTo(px, bottom)
      ctx.stroke()
      ctx.setLineDash([])
      ctx.restore()
    },
  }

  const data = {
    labels,
    datasets: [{
      data: values,
      borderColor: '#0b3d4a',
      borderWidth: 2,
      fill: true,
      backgroundColor: 'rgba(224,238,242,0.7)',
      pointRadius: 0,
      tension: 0.3,
    }],
  }

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    animation: false,
    plugins: {
      legend: { display: false },
      tooltip: {
        callbacks: {
          title: items => `${items[0].label} Hz`,
          label: item => `Amplitude: ${item.raw.toFixed(4)}`,
        },
      },
    },
    scales: {
      x: {
        ticks: {
          maxTicksLimit: 6,
          callback: (_, i) => i % 50 === 0 ? `${(i * 0.1).toFixed(0)} Hz` : '',
          color: '#9ca3af',
          font: { size: 11 },
        },
        grid: { color: '#f0f4f5' },
        title: { display: true, text: 'Frequency (Hz)', color: '#6b7280', font: { size: 11 } },
      },
      y: {
        ticks: { color: '#9ca3af', font: { size: 11 }, stepSize: 0.25 },
        grid: { color: '#f0f4f5' },
        title: { display: true, text: 'Amplitude', color: '#6b7280', font: { size: 11 } },
      },
    },
  }

  return (
    <div className="vt-card" style={{ padding: '16px' }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12, flexWrap: 'wrap', gap: 8 }}>
        <div>
          <p style={{ fontSize: 13, fontWeight: 500, color: '#0b3d4a' }}>Frequency Spectrum (FFT)</p>
          <p className="vt-caption">Resonant: <strong style={{ color: '#1b7a5e' }}>{dominantHz} Hz</strong></p>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          {/* Range chips */}
          <div style={{ display: 'flex', gap: 4 }}>
            {RANGES.map(r => (
              <button
                key={r}
                onClick={() => setRange(r)}
                style={{
                  height: 26, padding: '0 10px', borderRadius: 99, fontSize: 11, fontWeight: 500,
                  border: '1px solid',
                  borderColor: range === r ? '#0b3d4a' : '#dde4e7',
                  background: range === r ? '#0b3d4a' : 'transparent',
                  color: range === r ? '#fff' : '#6b7280',
                  cursor: 'pointer',
                }}
              >
                {r}
              </button>
            ))}
          </div>
          {/* Export */}
          <button className="vt-btn vt-btn-outline" style={{ height: 26, fontSize: 11, padding: '0 10px' }}>Export CSV</button>
          <button className="vt-btn vt-btn-outline" style={{ height: 26, fontSize: 11, padding: '0 10px' }}>Export PNG</button>
        </div>
      </div>
      <div style={{ height: 200 }}>
        <Line data={data} options={options} plugins={[warnPlugin]} />
      </div>
    </div>
  )
}

import { Line } from 'react-chartjs-2'
import {
  Chart as ChartJS, TimeScale, LinearScale, PointElement,
  LineElement, Filler, Tooltip, Legend,
} from 'chart.js'
import 'chartjs-adapter-date-fns'

ChartJS.register(TimeScale, LinearScale, PointElement, LineElement, Filler, Tooltip, Legend)

export default function TiltChart({ tiltData }) {
  const { x: timestamps, tiltX, tiltY } = tiltData

  const alertPlugin = {
    id: 'tiltAlerts',
    beforeDraw(chart) {
      const { ctx, chartArea: { left, right, top, bottom }, scales: { y } } = chart
      if (!y) return
      ctx.save()
      // Alert zones beyond ±2°
      const y2pos = y.getPixelForValue(2)
      const y2neg = y.getPixelForValue(-2)
      ctx.fillStyle = 'rgba(220,38,38,0.06)'
      ctx.fillRect(left, top, right - left, y2pos - top)
      ctx.fillRect(left, y2neg, right - left, bottom - y2neg)
      // Zero reference
      const y0 = y.getPixelForValue(0)
      ctx.strokeStyle = '#d1d5db'
      ctx.lineWidth = 1
      ctx.setLineDash([4, 3])
      ctx.beginPath(); ctx.moveTo(left, y0); ctx.lineTo(right, y0); ctx.stroke()
      ctx.setLineDash([])
      ctx.restore()
    },
  }

  const data = {
    datasets: [
      {
        label: 'Tilt X',
        data: timestamps.map((t, i) => ({ x: t, y: tiltX[i] })),
        borderColor: '#0b3d4a',
        borderWidth: 1.5,
        fill: false,
        pointRadius: 0,
        tension: 0.3,
      },
      {
        label: 'Tilt Y',
        data: timestamps.map((t, i) => ({ x: t, y: tiltY[i] })),
        borderColor: '#1b7a5e',
        borderWidth: 1.5,
        fill: false,
        pointRadius: 0,
        tension: 0.3,
      },
    ],
  }

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    animation: false,
    plugins: {
      legend: {
        display: true,
        position: 'top',
        align: 'end',
        labels: { boxWidth: 12, font: { size: 11 }, color: '#6b7280', padding: 12 },
      },
      tooltip: {
        callbacks: {
          title: items => new Date(items[0].parsed.x).toLocaleTimeString(),
          label: item => `${item.dataset.label}: ${item.parsed.y.toFixed(2)}°`,
        },
      },
    },
    scales: {
      x: {
        type: 'time',
        time: { unit: 'minute', displayFormats: { minute: 'HH:mm' } },
        ticks: { color: '#9ca3af', font: { size: 11 }, maxTicksLimit: 8 },
        grid: { color: '#f0f4f5' },
      },
      y: {
        ticks: { color: '#9ca3af', font: { size: 11 } },
        grid: { color: '#f0f4f5' },
        title: { display: true, text: 'Degrees (°)', color: '#6b7280', font: { size: 11 } },
      },
    },
  }

  return (
    <div className="vt-card" style={{ padding: '16px' }}>
      <p style={{ fontSize: 13, fontWeight: 500, color: '#0b3d4a', marginBottom: 12 }}>Tilt History — X &amp; Y Axes (24 hr)</p>
      <div style={{ height: 180 }}>
        <Line data={data} options={options} plugins={[alertPlugin]} />
      </div>
    </div>
  )
}

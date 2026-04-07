import { Line } from 'react-chartjs-2'
import {
  Chart as ChartJS, TimeScale, LinearScale, PointElement,
  LineElement, Filler, Tooltip, Legend,
} from 'chart.js'
import 'chartjs-adapter-date-fns'

ChartJS.register(TimeScale, LinearScale, PointElement, LineElement, Filler, Tooltip, Legend)

export default function TimeChart({ series, label = 'Peak Acceleration (g)', unit = 'g', warnHigh = 0.25, alertHigh = 0.5 }) {
  const thresholdPlugin = {
    id: 'thresholds',
    beforeDraw(chart) {
      const { ctx, chartArea: { left, right, top, bottom }, scales: { y } } = chart
      if (!y) return
      ctx.save()
      // Normal zone fill
      const yWarnPx = y.getPixelForValue(warnHigh)
      ctx.fillStyle = 'rgba(22,163,74,0.04)'
      ctx.fillRect(left, yWarnPx, right - left, bottom - yWarnPx)
      // Warning line
      ctx.strokeStyle = '#f59e0b'
      ctx.lineWidth = 1
      ctx.setLineDash([5, 4])
      ctx.beginPath(); ctx.moveTo(left, yWarnPx); ctx.lineTo(right, yWarnPx); ctx.stroke()
      // Alert line
      const yAlertPx = y.getPixelForValue(alertHigh)
      ctx.strokeStyle = '#dc2626'
      ctx.beginPath(); ctx.moveTo(left, yAlertPx); ctx.lineTo(right, yAlertPx); ctx.stroke()
      ctx.setLineDash([])
      ctx.restore()
    },
  }

  const data = {
    datasets: [{
      label,
      data: series,
      borderColor: '#1b7a5e',
      borderWidth: 1.5,
      fill: false,
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
          title: items => new Date(items[0].parsed.x).toLocaleTimeString(),
          label: item => `${item.dataset.label}: ${item.parsed.y.toFixed(3)} ${unit}`,
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
        title: { display: true, text: unit, color: '#6b7280', font: { size: 11 } },
      },
    },
  }

  return (
    <div className="vt-card" style={{ padding: '16px' }}>
      <p style={{ fontSize: 13, fontWeight: 500, color: '#0b3d4a', marginBottom: 12 }}>{label}</p>
      <div style={{ height: 180 }}>
        <Line data={data} options={options} plugins={[thresholdPlugin]} />
      </div>
    </div>
  )
}

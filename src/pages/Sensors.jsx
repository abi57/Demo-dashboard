import { useViotel } from '../context/ViotelContext'
import KpiCard from '../components/KpiCard'
import FreqChart from '../components/FreqChart'
import TimeChart from '../components/TimeChart'
import TiltChart from '../components/TiltChart'
import NodeTable from '../components/NodeTable'
import AlertFeed from '../components/AlertFeed'
import EventLog from '../components/EventLog'

export default function Sensors() {
  const { asset, assetNodes, activeAlerts, timeSeries, fftData, tiltData, dominantHz, onlineCount, totalNodes, events } = useViotel()
  const lastEvent = events[0]

  return (
    <div style={{ padding: '20px 24px 32px', background: '#f4f7f8', minHeight: '100vh' }}>
      {/* KPI row */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 12, marginBottom: 16 }}>
        <KpiCard label="Active Nodes" value={`${onlineCount} / ${totalNodes}`} dot dotColor={onlineCount === totalNodes ? '#16a34a' : '#f59e0b'} sub={asset?.name} />
        <KpiCard label="Active Alerts" value={activeAlerts.length} dot dotColor={activeAlerts.length === 0 ? '#16a34a' : '#dc2626'} sub={activeAlerts.length === 0 ? 'All clear' : `${activeAlerts.length} unacknowledged`} />
        <KpiCard label="Dominant Resonant Frequency" value={`${dominantHz} Hz`} sub="FFT peak — selected asset" />
        <KpiCard label="Last Event" value={lastEvent ? lastEvent.ts.split(' ')[1] : '—'} sub={lastEvent ? `${lastEvent.node} · ${lastEvent.metric}` : 'No recent events'} />
      </div>

      {/* Main 65/35 */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 360px', gap: 12, marginBottom: 16 }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          <TimeChart series={timeSeries} label="Peak Acceleration (g)" unit="g" warnHigh={0.25} alertHigh={0.5} />
          <FreqChart fftData={fftData} dominantHz={dominantHz} />
          <TiltChart tiltData={tiltData} />
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          <NodeTable nodes={assetNodes} />
          <AlertFeed />
        </div>
      </div>

      <EventLog events={events} />
    </div>
  )
}

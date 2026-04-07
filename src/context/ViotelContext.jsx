import { createContext, useContext, useState, useEffect, useCallback } from 'react'
import { ASSETS, NODES, ALERTS, EVENTS, genTimeSeries, genFFT, genTiltSeries } from '../data/viotelData'
import { INSTALLATIONS } from '../data/installationData'

const Ctx = createContext(null)

export function ViotelProvider({ children }) {
  const [selectedAsset, setSelectedAsset] = useState(ASSETS[0].id)
  const [alerts, setAlerts] = useState(ALERTS)
  const [installations, setInstallations] = useState(INSTALLATIONS)
  const [timeSeries, setTimeSeries] = useState(() => genTimeSeries())
  const [fftData, setFftData] = useState(() => genFFT())
  const [tiltData, setTiltData] = useState(() => genTiltSeries())
  const [lastSync, setLastSync] = useState(new Date())

  // Simulate live updates every 5s
  useEffect(() => {
    const t = setInterval(() => {
      setTimeSeries(prev => {
        const next = [...prev.slice(1)]
        const last = prev[prev.length - 1]
        next.push({ x: new Date(), y: +(last.y + (Math.random() - 0.5) * 0.04).toFixed(3) })
        return next
      })
      setLastSync(new Date())
    }, 5000)
    return () => clearInterval(t)
  }, [])

  // Refresh FFT when asset changes
  useEffect(() => {
    setFftData(genFFT())
    setTimeSeries(genTimeSeries())
    setTiltData(genTiltSeries())
  }, [selectedAsset])

  const acknowledgeAlert = useCallback((id) => {
    setAlerts(prev => prev.map(a => a.id === id ? { ...a, ack: true } : a))
  }, [])

  const assetNodes = NODES.filter(n => n.asset === selectedAsset)
  const assetAlerts = alerts.filter(a => {
    const node = NODES.find(n => n.id === a.node)
    return node?.asset === selectedAsset
  })
  const activeAlerts = assetAlerts.filter(a => !a.ack)
  const asset = ASSETS.find(a => a.id === selectedAsset)

  // Dominant resonant frequency from FFT peak
  const dominantHz = fftData.reduce((max, p) => p.y > max.y ? p : max, { x: 0, y: 0 }).x.toFixed(1)

  const onlineCount = assetNodes.filter(n => n.status !== 'offline').length

  const addInstallation = useCallback((record) => {
    const id = `INS-${String(installations.length + 1).padStart(3, '0')}`
    setInstallations(prev => [{ ...record, id, submitted: new Date().toLocaleString('en-AU') }, ...prev])
    return id
  }, [installations.length])

  return (
    <Ctx.Provider value={{
      assets: ASSETS,
      selectedAsset, setSelectedAsset,
      asset,
      nodes: NODES,
      assetNodes,
      alerts, assetAlerts, activeAlerts, acknowledgeAlert,
      events: EVENTS,
      installations, addInstallation,
      timeSeries, fftData, tiltData,
      lastSync,
      dominantHz,
      onlineCount,
      totalNodes: assetNodes.length,
    }}>
      {children}
    </Ctx.Provider>
  )
}

export const useViotel = () => useContext(Ctx)

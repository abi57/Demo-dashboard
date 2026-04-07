import { createContext, useContext, useState, useEffect } from 'react'
import { SEED_INSTALLATIONS, genDeviceReadings } from '../data/seed'

const Ctx = createContext(null)
const KEY = 'vio_data'

function loadData() {
  try {
    const saved = JSON.parse(localStorage.getItem(KEY) ?? 'null')
    if (saved) return saved
  } catch {}
  return { installations: SEED_INSTALLATIONS }
}

export function AppProvider({ children }) {
  const [data, setData] = useState(loadData)

  useEffect(() => {
    localStorage.setItem(KEY, JSON.stringify(data))
  }, [data])

  function addInstallation(record) {
    const id = `INS-${String(data.installations.length + 1).padStart(3, '0')}`
    const newRec = { ...record, id, submitted: new Date().toLocaleString('en-AU') }
    setData(d => ({ ...d, installations: [newRec, ...d.installations] }))
    return id
  }

  function updateInstallation(id, updates) {
    setData(d => ({
      ...d,
      installations: d.installations.map(i => i.id === id ? { ...i, ...updates } : i),
    }))
  }

  // Derive devices from installations
  const devices = data.installations.flatMap(inst =>
    inst.sensorSerials.map(serial => ({
      ...genDeviceReadings(serial),
      serial,
      siteOwner: inst.siteOwner,
      towerId: inst.towerId,
      heightAGL: inst.heightAGL,
      dateInstalled: inst.dateInstalled,
      sensorType: inst.sensorType,
      installationId: inst.id,
    }))
  )

  // Derive sites
  const sitesMap = {}
  data.installations.forEach(inst => {
    if (!sitesMap[inst.siteOwner]) sitesMap[inst.siteOwner] = { siteOwner: inst.siteOwner, towers: [] }
    if (!sitesMap[inst.siteOwner].towers.find(t => t.towerId === inst.towerId)) {
      sitesMap[inst.siteOwner].towers.push({
        towerId: inst.towerId,
        serials: inst.sensorSerials,
        installationId: inst.id,
      })
    }
  })
  const sites = Object.values(sitesMap)

  return (
    <Ctx.Provider value={{
      installations: data.installations,
      addInstallation,
      updateInstallation,
      devices,
      sites,
    }}>
      {children}
    </Ctx.Provider>
  )
}

export const useApp = () => useContext(Ctx)

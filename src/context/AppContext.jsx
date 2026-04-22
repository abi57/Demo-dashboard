import { createContext, useContext, useState, useEffect, useCallback } from 'react'
import { apiListInstallations, apiCreateInstallation, apiUpdateInstallation } from '../api'
import { useAuth } from './AuthContext'

const Ctx = createContext(null)

export function AppProvider({ children }) {
  const { user } = useAuth()
  const [installations, setInstallations] = useState([])
  const [loading, setLoading] = useState(false)

  const fetchInstallations = useCallback(async () => {
    if (!user) { setInstallations([]); return }
    setLoading(true)
    try {
      const data = await apiListInstallations()
      setInstallations(data)
    } catch {
      setInstallations([])
    }
    setLoading(false)
  }, [user])

  useEffect(() => {
    fetchInstallations()
  }, [fetchInstallations])

  async function addInstallation(record) {
    const payload = {
      installer_name: record.installerName,
      date_installed: record.dateInstalled,
      site_owner: record.siteOwner,
      tower_id: record.towerId,
      sensor_serials: Array.isArray(record.sensorSerials)
        ? record.sensorSerials.join(', ')
        : record.sensorSerials,
      height_agl: record.heightAGL,
      accel_orientation: record.accelOrientation, accel_facing_direction: record.accelFacingDirection,
      wind_orientation: record.windOrientation, wind_height_agl: record.windHeightAGL,
      structural_element: record.structuralElement, power_source: record.powerSource,
      battery_voltage: record.batteryVoltage,
      dc_output: record.dcOutput,
      secure_fixing: record.secureFixing,
      data_flow: record.dataFlow,
      climbs: (record.climbs || []).map((c, i) => ({
        climb_number: i + 1,
        up_start: c.upStart || null,
        up_finish: c.upFinish || null,
        down_start: c.downStart || null,
        down_finish: c.downFinish || null,
      })),
    }
    const created = await apiCreateInstallation(payload)
    setInstallations(prev => [created, ...prev])
    return created.id
  }

  async function updateInstallation(id, record) {
    const payload = {
      installer_name: record.installerName,
      date_installed: record.dateInstalled,
      site_owner: record.siteOwner,
      tower_id: record.towerId,
      sensor_serials: Array.isArray(record.sensorSerials)
        ? record.sensorSerials.join(', ')
        : record.sensorSerials,
      height_agl: record.heightAGL,
      accel_orientation: record.accelOrientation, accel_facing_direction: record.accelFacingDirection,
      wind_orientation: record.windOrientation, wind_height_agl: record.windHeightAGL,
      structural_element: record.structuralElement, power_source: record.powerSource,
      battery_voltage: record.batteryVoltage,
      dc_output: record.dcOutput,
      secure_fixing: record.secureFixing,
      data_flow: record.dataFlow,
      climbs: (record.climbs || []).map((c, i) => ({
        climb_number: i + 1,
        up_start: c.upStart || null,
        up_finish: c.upFinish || null,
        down_start: c.downStart || null,
        down_finish: c.downFinish || null,
      })),
    }
    const updated = await apiUpdateInstallation(id, payload)
    setInstallations(prev => prev.map(inst => inst.id === id ? updated : inst))
  }

  return (
    <Ctx.Provider value={{
      installations,
      loading,
      addInstallation,
      updateInstallation,
      refresh: fetchInstallations,
    }}>
      {children}
    </Ctx.Provider>
  )
}

export const useApp = () => useContext(Ctx)

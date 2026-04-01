import { createContext, useContext, useState } from 'react'
import { MOCK_INSTALLATIONS, MOCK_SITES } from '../data/mockData'

const AppDataContext = createContext(null)

export function AppDataProvider({ children }) {
  const [installations, setInstallations] = useState(MOCK_INSTALLATIONS)
  const [sites] = useState(MOCK_SITES)
  const [selectedDeviceId, setSelectedDeviceId] = useState(null)

  function addInstallation(record) {
    const newRecord = {
      ...record,
      id: `INS-${String(installations.length + 1).padStart(3, '0')}`,
      status: 'Pending',
      photos: [],
    }
    setInstallations(prev => [newRecord, ...prev])
    return newRecord.id
  }

  const devices = installations.map(i => ({
    id: i.sensorSerial,
    serial: i.sensorSerial,
    name: `${i.sensorSerial}`,
    site: i.siteOwner,
    tower: i.towerId,
    installDate: i.date,
    installer: i.installer,
    status: i.status === 'Confirmed' ? 'Online' : i.status === 'Warning' ? 'Warning' : 'Pending',
    health: i.dataFlowConfirmed ? 'Good' : 'Check Required',
    deviceType: i.deviceType,
    installationId: i.id,
  }))

  return (
    <AppDataContext.Provider value={{
      installations, addInstallation,
      sites,
      devices,
      selectedDeviceId, setSelectedDeviceId,
    }}>
      {children}
    </AppDataContext.Provider>
  )
}

export const useAppData = () => useContext(AppDataContext)

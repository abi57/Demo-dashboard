// Viotel seed data

export const SITE_OWNERS = ['Indara', 'One NZ', 'OneNZ RCG', 'Forty South', 'PDC Telecommunications', 'PhilTower-MIDC']
export const COMPANIES = ['Titanium Services Group', 'All Heights Ltd', 'Downer', 'Tetro Group', 'Resonanz Technical Group']

function rnd(min, max, dp = 2) {
  return parseFloat((Math.random() * (max - min) + min).toFixed(dp))
}

function daysAgo(n) {
  const d = new Date()
  d.setDate(d.getDate() - n)
  return d.toISOString().split('T')[0]
}

export const SEED_INSTALLATIONS = [
  { id: 'INS-001', submitted: '15/01/2025 09:14', dateInstalled: daysAgo(45), installerName: 'Wade Hooper', company: 'Titanium Services Group', siteOwner: 'Indara', towerId: '3500833', sensorSerials: ['viot01916'], heightAGL: 29.80, accelOrientation: 330, windOrientation: null, structuralElement: 'Tower leg', batteryVoltage: '12v', dcOutput: null, secureFixing: true, dataFlow: true, photos: [], climbs: [{ upStart: '07:30', upFinish: '07:52', downStart: '09:10', downFinish: '09:28' }], sensorType: 'accelerometer', status: 'confirmed' },
  { id: 'INS-002', submitted: '16/01/2025 14:22', dateInstalled: daysAgo(44), installerName: 'Wade Hooper', company: 'Titanium Services Group', siteOwner: 'Indara', towerId: '3200339', sensorSerials: ['viot01875'], heightAGL: 30.44, accelOrientation: 45, windOrientation: 45, structuralElement: 'Tower leg', batteryVoltage: '12v', dcOutput: null, secureFixing: true, dataFlow: true, photos: [], climbs: [{ upStart: '08:00', upFinish: '08:25', downStart: '10:30', downFinish: '10:50' }], sensorType: 'accelerometer', status: 'confirmed' },
  { id: 'INS-003', submitted: '18/01/2025 11:05', dateInstalled: daysAgo(42), installerName: 'Wade Hooper', company: 'Titanium Services Group', siteOwner: 'Indara', towerId: '3500798', sensorSerials: ['viot02063', 'viot01915'], heightAGL: 50, accelOrientation: 340, windOrientation: 340, structuralElement: 'Tower ring', batteryVoltage: null, dcOutput: '12VDC', secureFixing: true, dataFlow: false, photos: [], climbs: [{ upStart: '06:45', upFinish: '07:18', downStart: '09:00', downFinish: '09:30' }], sensorType: 'tiltmeter', status: 'pending' },
  { id: 'INS-004', submitted: '22/01/2025 16:40', dateInstalled: daysAgo(38), installerName: 'Matt Siddells', company: 'All Heights Ltd', siteOwner: 'Forty South', towerId: 'S5WNK', sensorSerials: ['viot01942'], heightAGL: 17.38, accelOrientation: 63.1, windOrientation: null, structuralElement: 'Horizontal', batteryVoltage: '12v', dcOutput: null, secureFixing: true, dataFlow: true, photos: [], climbs: [{ upStart: '09:20', upFinish: '09:38', downStart: '11:05', downFinish: '11:20' }], sensorType: 'accelerometer', status: 'confirmed' },
  { id: 'INS-005', submitted: '25/01/2025 10:15', dateInstalled: daysAgo(35), installerName: 'Alfredo Celles Jr', company: 'Downer', siteOwner: 'One NZ', towerId: 'RCTLYF', sensorSerials: ['viot02056', 'viot01280'], heightAGL: 20, accelOrientation: 80, windOrientation: 80, structuralElement: 'Cable ladder', batteryVoltage: null, dcOutput: '12VDC', secureFixing: true, dataFlow: true, photos: [], climbs: [{ upStart: '07:00', upFinish: '07:22', downStart: '09:30', downFinish: '09:48' }], sensorType: 'tiltmeter', status: 'confirmed' },
]

export function genDeviceReadings(serial) {
  return {
    serial,
    resonantFreq: rnd(3.8, 6.2),
    peakAccel: rnd(0.02, 0.15),
    tiltX: rnd(-2.5, 2.5),
    tiltY: rnd(-2.5, 2.5),
    battery: rnd(60, 100, 0),
    signal: rnd(70, 100, 0),
    status: Math.random() > 0.15 ? 'online' : Math.random() > 0.5 ? 'degraded' : 'alert',
    lastSeen: new Date(Date.now() - rnd(0, 300000, 0)).toISOString(),
  }
}

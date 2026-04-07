// Realistic Viotel field data

export const SITE_OWNERS = ['Indara', 'One NZ', 'OneNZ RCG', 'Forty South', 'PDC Telecommunications', 'PhilTower-MIDC']

export const COMPANIES = ['Titanium Services Group', 'All Heights Ltd', 'Downer', 'Tetro Group', 'Resonanz Technical Group']

export const SENSOR_TYPES = {
  accelerometer: { label: 'Accelerometer', color: '#3b82f6', dotClass: 'vio-badge-blue' },
  tiltmeter:     { label: 'Tiltmeter',     color: '#1b7a5e', dotClass: 'vio-badge-teal' },
  barrier:       { label: 'Smart Barrier', color: '#f97316', dotClass: 'vio-badge-orange' },
  vibwire:       { label: 'Vibrating Wire',color: '#8b5cf6', dotClass: 'vio-badge-purple' },
  smart:         { label: 'SMART IoT',     color: '#6b7280', dotClass: 'vio-badge-grey' },
}

function rnd(min, max, dp = 2) {
  return parseFloat((Math.random() * (max - min) + min).toFixed(dp))
}

function daysAgo(n) {
  const d = new Date()
  d.setDate(d.getDate() - n)
  return d.toISOString().split('T')[0]
}

export const SEED_INSTALLATIONS = [
  {
    id: 'INS-001',
    submitted: '15/01/2025 09:14',
    dateInstalled: daysAgo(45),
    installerName: 'Wade Hooper',
    company: 'Titanium Services Group',
    siteOwner: 'Indara',
    towerId: '3500833',
    sensorSerials: ['viot01916'],
    heightAGL: 29.80,
    accelOrientation: 330,
    windOrientation: null,
    structuralElement: 'Tower leg',
    batteryVoltage: '12v',
    dcOutput: null,
    secureFixing: true,
    dataFlow: true,
    photos: [],
    climbs: [
      { upStart: '07:30', upFinish: '07:52', downStart: '09:10', downFinish: '09:28' },
    ],
    sensorType: 'accelerometer',
    status: 'confirmed',
  },
  {
    id: 'INS-002',
    submitted: '16/01/2025 14:22',
    dateInstalled: daysAgo(44),
    installerName: 'Wade Hooper',
    company: 'Titanium Services Group',
    siteOwner: 'Indara',
    towerId: '3200339',
    sensorSerials: ['viot01875'],
    heightAGL: 30.44,
    accelOrientation: 45,
    windOrientation: 45,
    structuralElement: 'Tower leg',
    batteryVoltage: '12v',
    dcOutput: null,
    secureFixing: true,
    dataFlow: true,
    photos: [],
    climbs: [
      { upStart: '08:00', upFinish: '08:25', downStart: '10:30', downFinish: '10:50' },
      { upStart: '11:05', upFinish: '11:28', downStart: '13:00', downFinish: '13:18' },
    ],
    sensorType: 'accelerometer',
    status: 'confirmed',
  },
  {
    id: 'INS-003',
    submitted: '18/01/2025 11:05',
    dateInstalled: daysAgo(42),
    installerName: 'Wade Hooper',
    company: 'Titanium Services Group',
    siteOwner: 'Indara',
    towerId: '3500798',
    sensorSerials: ['viot02063', 'viot01915'],
    heightAGL: 50,
    accelOrientation: 340,
    windOrientation: 340,
    structuralElement: 'Tower ring',
    batteryVoltage: null,
    dcOutput: '12VDC',
    secureFixing: true,
    dataFlow: false,
    photos: [],
    climbs: [
      { upStart: '06:45', upFinish: '07:18', downStart: '09:00', downFinish: '09:30' },
      { upStart: '10:15', upFinish: '10:44', downStart: '12:20', downFinish: '12:45' },
      { upStart: '13:30', upFinish: '13:55', downStart: '15:10', downFinish: '15:32' },
    ],
    sensorType: 'tiltmeter',
    status: 'pending',
  },
  {
    id: 'INS-004',
    submitted: '22/01/2025 16:40',
    dateInstalled: daysAgo(38),
    installerName: 'Matt Siddells',
    company: 'All Heights Ltd',
    siteOwner: 'Forty South',
    towerId: 'S5WNK',
    sensorSerials: ['viot01942'],
    heightAGL: 17.38,
    accelOrientation: 63.1,
    windOrientation: null,
    structuralElement: 'Horizontal',
    batteryVoltage: '12v',
    dcOutput: null,
    secureFixing: true,
    dataFlow: true,
    photos: [],
    climbs: [
      { upStart: '09:20', upFinish: '09:38', downStart: '11:05', downFinish: '11:20' },
    ],
    sensorType: 'accelerometer',
    status: 'confirmed',
  },
  {
    id: 'INS-005',
    submitted: '25/01/2025 10:15',
    dateInstalled: daysAgo(35),
    installerName: 'Alfredo Celles Jr',
    company: 'Downer',
    siteOwner: 'One NZ',
    towerId: 'RCTLYF',
    sensorSerials: ['viot02056', 'viot01280'],
    heightAGL: 20,
    accelOrientation: 80,
    windOrientation: 80,
    structuralElement: 'Cable ladder',
    batteryVoltage: null,
    dcOutput: '12VDC',
    secureFixing: true,
    dataFlow: true,
    photos: [],
    climbs: [
      { upStart: '07:00', upFinish: '07:22', downStart: '09:30', downFinish: '09:48' },
    ],
    sensorType: 'tiltmeter',
    status: 'confirmed',
  },
  {
    id: 'INS-006',
    submitted: '02/02/2025 08:55',
    dateInstalled: daysAgo(27),
    installerName: 'Peter Kite',
    company: 'Tetro Group',
    siteOwner: 'OneNZ RCG',
    towerId: 'C1PUM',
    sensorSerials: ['viot02512'],
    heightAGL: 22,
    accelOrientation: 357,
    windOrientation: null,
    structuralElement: 'PFC steel member',
    batteryVoltage: '12v',
    dcOutput: null,
    secureFixing: false,
    dataFlow: true,
    photos: [],
    climbs: [
      { upStart: '10:00', upFinish: '10:18', downStart: '11:45', downFinish: '12:00' },
    ],
    sensorType: 'smart',
    status: 'pending',
  },
  {
    id: 'INS-007',
    submitted: '10/02/2025 13:30',
    dateInstalled: daysAgo(19),
    installerName: 'Mr Tan',
    company: 'Mr Tan',
    siteOwner: 'PDC Telecommunications',
    towerId: 'Honda Site',
    sensorSerials: ['viot02860'],
    heightAGL: 20,
    accelOrientation: 93,
    windOrientation: 93,
    structuralElement: 'Tower leg',
    batteryVoltage: '12v',
    dcOutput: null,
    secureFixing: true,
    dataFlow: true,
    photos: [],
    climbs: [
      { upStart: '08:30', upFinish: '08:48', downStart: '10:15', downFinish: '10:30' },
    ],
    sensorType: 'vibwire',
    status: 'confirmed',
  },
  {
    id: 'INS-008',
    submitted: '14/02/2025 09:00',
    dateInstalled: daysAgo(15),
    installerName: 'Resonanz Technical Group',
    company: 'Resonanz Technical Group',
    siteOwner: 'PhilTower-MIDC',
    towerId: 'F01815-B07',
    sensorSerials: ['viot02927'],
    heightAGL: 40,
    accelOrientation: -29,
    windOrientation: null,
    structuralElement: 'Tower leg',
    batteryVoltage: null,
    dcOutput: '24VDC',
    secureFixing: true,
    dataFlow: true,
    photos: [],
    climbs: [
      { upStart: '05:30', upFinish: '06:10', downStart: '08:45', downFinish: '09:20' },
      { upStart: '10:00', upFinish: '10:35', downStart: '12:00', downFinish: '12:30' },
    ],
    sensorType: 'accelerometer',
    status: 'confirmed',
  },
]

// Generate mock device readings
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

// Generate FFT data
export function genFFT() {
  return Array.from({ length: 250 }, (_, i) => {
    const hz = i * 0.1
    const peak = 0.9 * Math.exp(-Math.pow((hz - 4.2) / 0.3, 2))
    const harmonic = 0.2 * Math.exp(-Math.pow((hz - 8.4) / 0.5, 2))
    return { x: hz, y: +(peak + harmonic + Math.random() * 0.04).toFixed(4) }
  })
}

// Generate time series
export function genTimeSeries(points = 60, base = 0.08, range = 0.06) {
  const now = Date.now()
  return Array.from({ length: points }, (_, i) => ({
    x: new Date(now - (points - i) * 60000),
    y: +(base + (Math.random() - 0.5) * range).toFixed(4),
  }))
}

export function normTime(t) {
  if (!t || t === '00:00' || t === '00:00:00') return null
  const s = String(t).trim()
  const pm = /pm/i.test(s), am = /am/i.test(s)
  const clean = s.replace(/[apm\s]/gi, '')
  const [h, m] = clean.split(':').map(Number)
  let hour = h ?? 0
  if (pm && hour < 12) hour += 12
  if (am && hour === 12) hour = 0
  return `${String(hour).padStart(2, '0')}:${String(m ?? 0).padStart(2, '0')}`
}

export function climbDuration(start, finish) {
  if (!start || !finish) return null
  const [sh, sm] = start.split(':').map(Number)
  const [fh, fm] = finish.split(':').map(Number)
  const mins = (fh * 60 + fm) - (sh * 60 + sm)
  return mins > 0 ? mins : null
}

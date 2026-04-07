// Real installation records based on Viotel field submissions
export const INSTALLATIONS = [
  {
    id: 'INS-001',
    submitted: '15/01/2025 09:14',
    dateInstalled: '2025-01-14',
    installerName: 'Jake Morrow',
    company: 'Titanium Services Group',
    siteOwner: 'Indara',
    towerId: '3500833',
    sensorSerials: ['viot01875'],
    heightAGL: 42,
    accelOrientation: 0,
    windOrientation: null,
    structuralElement: 'Tower leg',
    secureFixing: true,
    dataFlow: true,
    batteryVoltage: '12v',
    dcOutput: null,
    photos: [
      { name: 'IMG_0012.jpg', driveUrl: '#', thumb: null },
      { name: 'IMG_0013.jpg', driveUrl: '#', thumb: null },
      { name: 'IMG_0014.jpg', driveUrl: '#', thumb: null },
    ],
    climbs: [
      { upStart: '07:30', upFinish: '07:52', downStart: '09:10', downFinish: '09:28' },
      { upStart: '10:05', upFinish: '10:24', downStart: '11:40', downFinish: '11:55' },
    ],
  },
  {
    id: 'INS-002',
    submitted: '22/01/2025 14:37',
    dateInstalled: '2025-01-22',
    installerName: 'Sam Whitfield',
    company: 'All Heights Ltd',
    siteOwner: 'One NZ / OneNZ RCG',
    towerId: 'RCTLYF',
    sensorSerials: ['viot02063', 'viot02064'],
    heightAGL: 35,
    accelOrientation: 90,
    windOrientation: 180,
    structuralElement: 'Horizontal',
    secureFixing: true,
    dataFlow: true,
    batteryVoltage: null,
    dcOutput: '12VDC',
    photos: [
      { name: 'photo1.jpg', driveUrl: '#', thumb: null },
      { name: 'photo2.jpg', driveUrl: '#', thumb: null },
    ],
    climbs: [
      { upStart: '08:00', upFinish: '08:25', downStart: '10:30', downFinish: '10:50' },
    ],
  },
  {
    id: 'INS-003',
    submitted: '03/02/2025 11:02',
    dateInstalled: '2025-02-03',
    installerName: 'Chris Tanner',
    company: 'Downer',
    siteOwner: 'Forty South',
    towerId: 'S5WNK',
    sensorSerials: ['viot01990'],
    heightAGL: 58,
    accelOrientation: 270,
    windOrientation: 270,
    structuralElement: 'Cable ladder',
    secureFixing: true,
    dataFlow: false,
    batteryVoltage: '12v',
    dcOutput: null,
    photos: [
      { name: 'install_01.jpg', driveUrl: '#', thumb: null },
      { name: 'install_02.jpg', driveUrl: '#', thumb: null },
      { name: 'install_03.jpg', driveUrl: '#', thumb: null },
      { name: 'install_04.jpg', driveUrl: '#', thumb: null },
      { name: 'install_05.jpg', driveUrl: '#', thumb: null },
    ],
    climbs: [
      { upStart: '06:45', upFinish: '07:18', downStart: '09:00', downFinish: '09:30' },
      { upStart: '10:15', upFinish: '10:44', downStart: '12:20', downFinish: '12:45' },
      { upStart: '13:30', upFinish: '13:55', downStart: '15:10', downFinish: '15:32' },
    ],
  },
  {
    id: 'INS-004',
    submitted: '10/02/2025 16:55',
    dateInstalled: '2025-02-10',
    installerName: 'Liam Osei',
    company: 'Tetro Group',
    siteOwner: 'PDC Telecommunications',
    towerId: 'PDC-NZ-0044',
    sensorSerials: ['viot02101'],
    heightAGL: 28,
    accelOrientation: 45,
    windOrientation: null,
    structuralElement: 'Tower leg',
    secureFixing: false,
    dataFlow: true,
    batteryVoltage: '12v',
    dcOutput: null,
    photos: [],
    climbs: [
      { upStart: '09:20', upFinish: '09:38', downStart: '11:05', downFinish: '11:20' },
    ],
  },
  {
    id: 'INS-005',
    submitted: '18/02/2025 08:30',
    dateInstalled: '2025-02-17',
    installerName: 'Aroha Ngata',
    company: 'Resonanz Technical Group',
    siteOwner: 'PhilTower-MIDC',
    towerId: 'MIDC-PH-112',
    sensorSerials: ['viot02200', 'viot02201'],
    heightAGL: 72,
    accelOrientation: 180,
    windOrientation: 90,
    structuralElement: 'Horizontal',
    secureFixing: true,
    dataFlow: true,
    batteryVoltage: null,
    dcOutput: '24VDC',
    photos: [
      { name: 'site_photo_1.jpg', driveUrl: '#', thumb: null },
      { name: 'site_photo_2.jpg', driveUrl: '#', thumb: null },
      { name: 'site_photo_3.jpg', driveUrl: '#', thumb: null },
    ],
    climbs: [
      { upStart: '05:30', upFinish: '06:10', downStart: '08:45', downFinish: '09:20' },
      { upStart: '10:00', upFinish: '10:35', downStart: '12:00', downFinish: '12:30' },
    ],
  },
  {
    id: 'INS-006',
    submitted: '25/02/2025 13:44',
    dateInstalled: '2025-02-25',
    installerName: 'Jake Morrow',
    company: 'Titanium Services Group',
    siteOwner: 'Indara',
    towerId: '3500901',
    sensorSerials: ['viot02310'],
    heightAGL: 38,
    accelOrientation: 0,
    windOrientation: null,
    structuralElement: 'Tower leg',
    secureFixing: true,
    dataFlow: true,
    batteryVoltage: '12v',
    dcOutput: null,
    photos: [
      { name: 'IMG_0088.jpg', driveUrl: '#', thumb: null },
      { name: 'IMG_0089.jpg', driveUrl: '#', thumb: null },
    ],
    climbs: [
      { upStart: '07:00', upFinish: '07:22', downStart: '09:30', downFinish: '09:48' },
    ],
  },
]

// Parse time string to 24hr HH:MM
export function normTime(t) {
  if (!t || t === '00:00' || t === '00:00:00') return null
  const s = t.trim()
  // Handle "1:25 PM", "05:10pm", "13:40" etc.
  const pm = /pm/i.test(s)
  const am = /am/i.test(s)
  const clean = s.replace(/[apm\s]/gi, '')
  const [h, m] = clean.split(':').map(Number)
  let hour = h
  if (pm && hour < 12) hour += 12
  if (am && hour === 12) hour = 0
  return `${String(hour).padStart(2, '0')}:${String(m || 0).padStart(2, '0')}`
}

// Calculate duration in minutes between two HH:MM strings
export function climbDuration(start, finish) {
  if (!start || !finish) return null
  const [sh, sm] = start.split(':').map(Number)
  const [fh, fm] = finish.split(':').map(Number)
  const mins = (fh * 60 + fm) - (sh * 60 + sm)
  return mins > 0 ? mins : null
}

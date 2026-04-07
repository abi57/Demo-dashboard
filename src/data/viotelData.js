// ── Assets ────────────────────────────────────────────────────────────────────
export const ASSETS = [
  { id: 'grafton-bridge',   name: 'Grafton Bridge',        type: 'bridge',  location: 'Auckland, NZ' },
  { id: 'auckland-tower',   name: 'Auckland Tower VT-04',  type: 'tower',   location: 'Auckland, NZ' },
  { id: 'm1-barrier',       name: 'M1 Wire Rope Barrier',  type: 'barrier', location: 'Sydney, NSW'  },
  { id: 'warragamba-dam',   name: 'Warragamba Dam',         type: 'dam',     location: 'NSW, AU'      },
]

// ── Sensor types ──────────────────────────────────────────────────────────────
export const SENSOR_TYPES = {
  accelerometer: { label: 'Accelerometer',    color: '#3b82f6', dot: '#3b82f6' },
  tiltmeter:     { label: 'Tiltmeter',        color: '#0b3d4a', dot: '#1b7a5e' },
  barrier:       { label: 'Smart Barrier',    color: '#f97316', dot: '#f97316' },
  vibwire:       { label: 'Vibrating Wire',   color: '#8b5cf6', dot: '#8b5cf6' },
  smart:         { label: 'SMART IoT Node',   color: '#6b7280', dot: '#6b7280' },
}

// ── Nodes ─────────────────────────────────────────────────────────────────────
export const NODES = [
  { id: 'VT-ACC-01', asset: 'grafton-bridge', type: 'accelerometer', status: 'online',   battery: 87, signal: 92, reading: '0.12 g',   lastSeen: '10s ago' },
  { id: 'VT-ACC-02', asset: 'grafton-bridge', type: 'accelerometer', status: 'online',   battery: 74, signal: 88, reading: '0.09 g',   lastSeen: '10s ago' },
  { id: 'VT-TLT-01', asset: 'grafton-bridge', type: 'tiltmeter',     status: 'warning',  battery: 61, signal: 79, reading: '1.8°',     lastSeen: '12s ago' },
  { id: 'VT-TLT-02', asset: 'grafton-bridge', type: 'tiltmeter',     status: 'online',   battery: 90, signal: 95, reading: '0.3°',     lastSeen: '11s ago' },
  { id: 'VT-SMT-01', asset: 'grafton-bridge', type: 'smart',         status: 'online',   battery: 55, signal: 83, reading: '4.2 Hz',   lastSeen: '15s ago' },
  { id: 'VT-ACC-03', asset: 'auckland-tower', type: 'accelerometer', status: 'online',   battery: 82, signal: 91, reading: '0.07 g',   lastSeen: '8s ago'  },
  { id: 'VT-TLT-03', asset: 'auckland-tower', type: 'tiltmeter',     status: 'alert',    battery: 18, signal: 44, reading: '3.1°',     lastSeen: '45s ago' },
  { id: 'VT-VBW-01', asset: 'auckland-tower', type: 'vibwire',       status: 'online',   battery: 93, signal: 97, reading: '1240 Hz',  lastSeen: '9s ago'  },
  { id: 'VT-BAR-01', asset: 'm1-barrier',     type: 'barrier',       status: 'online',   battery: 78, signal: 86, reading: '42.1 kN',  lastSeen: '6s ago'  },
  { id: 'VT-BAR-02', asset: 'm1-barrier',     type: 'barrier',       status: 'warning',  battery: 34, signal: 67, reading: '38.7 kN',  lastSeen: '20s ago' },
  { id: 'VT-BAR-03', asset: 'm1-barrier',     type: 'barrier',       status: 'offline',  battery: 0,  signal: 0,  reading: '—',        lastSeen: '4h ago'  },
  { id: 'VT-SMT-02', asset: 'warragamba-dam', type: 'smart',         status: 'online',   battery: 69, signal: 88, reading: '0.04 g',   lastSeen: '14s ago' },
  { id: 'VT-VBW-02', asset: 'warragamba-dam', type: 'vibwire',       status: 'online',   battery: 88, signal: 94, reading: '1180 Hz',  lastSeen: '11s ago' },
  { id: 'VT-TLT-04', asset: 'warragamba-dam', type: 'tiltmeter',     status: 'online',   battery: 72, signal: 81, reading: '0.6°',     lastSeen: '13s ago' },
]

// ── Alerts ────────────────────────────────────────────────────────────────────
export const ALERTS = [
  { id: 'a1', node: 'VT-TLT-03', asset: 'auckland-tower', metric: 'Tilt Y', value: '3.1°',    threshold: '±2.5°',  severity: 'critical', time: '2 min ago',  ack: false },
  { id: 'a2', node: 'VT-TLT-01', asset: 'grafton-bridge', metric: 'Tilt X', value: '1.8°',    threshold: '±1.5°',  severity: 'warning',  time: '8 min ago',  ack: false },
  { id: 'a3', node: 'VT-BAR-02', asset: 'm1-barrier',     metric: 'Tension',value: '38.7 kN', threshold: '40 kN',  severity: 'warning',  time: '15 min ago', ack: false },
  { id: 'a4', node: 'VT-BAR-03', asset: 'm1-barrier',     metric: 'Status', value: 'Offline', threshold: 'Online', severity: 'critical', time: '4 hr ago',   ack: true  },
  { id: 'a5', node: 'VT-TLT-03', asset: 'auckland-tower', metric: 'Battery',value: '18%',     threshold: '20%',    severity: 'warning',  time: '1 hr ago',   ack: true  },
]

// ── Event log ─────────────────────────────────────────────────────────────────
export const EVENTS = [
  { id: 'e01', ts: '2025-04-02 14:32:11', node: 'VT-TLT-03', asset: 'Auckland Tower VT-04', metric: 'Tilt Y',          value: '3.1°',    threshold: '±2.5°',  severity: 'critical' },
  { id: 'e02', ts: '2025-04-02 14:26:44', node: 'VT-TLT-01', asset: 'Grafton Bridge',        metric: 'Tilt X',          value: '1.8°',    threshold: '±1.5°',  severity: 'warning'  },
  { id: 'e03', ts: '2025-04-02 14:19:03', node: 'VT-BAR-02', asset: 'M1 Wire Rope Barrier',  metric: 'Wire Tension',    value: '38.7 kN', threshold: '40 kN',  severity: 'warning'  },
  { id: 'e04', ts: '2025-04-02 13:55:22', node: 'VT-ACC-01', asset: 'Grafton Bridge',        metric: 'Peak Accel',      value: '0.31 g',  threshold: '0.25 g', severity: 'warning'  },
  { id: 'e05', ts: '2025-04-02 13:41:09', node: 'VT-BAR-01', asset: 'M1 Wire Rope Barrier',  metric: 'Impact Event',    value: 'TRUE',    threshold: 'FALSE',  severity: 'critical' },
  { id: 'e06', ts: '2025-04-02 12:30:00', node: 'VT-BAR-03', asset: 'M1 Wire Rope Barrier',  metric: 'Node Status',     value: 'Offline', threshold: 'Online', severity: 'critical' },
  { id: 'e07', ts: '2025-04-02 11:14:55', node: 'VT-TLT-03', asset: 'Auckland Tower VT-04',  metric: 'Battery',         value: '18%',     threshold: '20%',    severity: 'warning'  },
  { id: 'e08', ts: '2025-04-02 10:02:33', node: 'VT-VBW-01', asset: 'Auckland Tower VT-04',  metric: 'Resonant Freq',   value: '6.8 Hz',  threshold: '6.5 Hz', severity: 'warning'  },
  { id: 'e09', ts: '2025-04-02 09:45:17', node: 'VT-SMT-01', asset: 'Grafton Bridge',        metric: 'Resonant Freq',   value: '4.2 Hz',  threshold: '—',      severity: 'info'     },
  { id: 'e10', ts: '2025-04-02 08:30:00', node: 'VT-SMT-02', asset: 'Warragamba Dam',         metric: 'Peak Accel',      value: '0.04 g',  threshold: '0.25 g', severity: 'info'     },
]

// ── Thresholds ────────────────────────────────────────────────────────────────
export const DEFAULT_THRESHOLDS = [
  { metric: 'Resonant Frequency', unit: 'Hz',         warnLow: 2.0,  warnHigh: 6.0,  critLow: 1.0,  critHigh: 8.0,  enabled: true  },
  { metric: 'Peak Acceleration',  unit: 'g',          warnLow: null, warnHigh: 0.25, critLow: null, critHigh: 0.5,  enabled: true  },
  { metric: 'Tilt X',             unit: '°',          warnLow: -1.5, warnHigh: 1.5,  critLow: -2.5, critHigh: 2.5,  enabled: true  },
  { metric: 'Tilt Y',             unit: '°',          warnLow: -1.5, warnHigh: 1.5,  critLow: -2.5, critHigh: 2.5,  enabled: true  },
  { metric: 'Tilt Z',             unit: '°',          warnLow: -1.0, warnHigh: 1.0,  critLow: -2.0, critHigh: 2.0,  enabled: false },
  { metric: 'Wire Tension',       unit: 'kN',         warnLow: 35.0, warnHigh: 55.0, critLow: 30.0, critHigh: 60.0, enabled: true  },
  { metric: 'Dynamic Strain',     unit: 'microstrain',warnLow: null, warnHigh: 200,  critLow: null, critHigh: 400,  enabled: true  },
  { metric: 'Battery Level',      unit: '%',          warnLow: 20,   warnHigh: null, critLow: 10,   critHigh: null, enabled: true  },
]

// ── Chart data generators ─────────────────────────────────────────────────────
function rnd(base, range) { return +(base + (Math.random() - 0.5) * range).toFixed(3) }

export function genTimeSeries(points = 60, base = 0.1, range = 0.08) {
  const now = Date.now()
  return Array.from({ length: points }, (_, i) => ({
    x: new Date(now - (points - i) * 60_000),
    y: rnd(base, range),
  }))
}

export function genFFT() {
  // Simulated FFT with a dominant peak at ~4.2 Hz
  return Array.from({ length: 250 }, (_, i) => {
    const hz = i * 0.1
    const peak = 0.9 * Math.exp(-Math.pow((hz - 4.2) / 0.3, 2))
    const noise = Math.random() * 0.04
    const harmonic = 0.2 * Math.exp(-Math.pow((hz - 8.4) / 0.5, 2))
    return { x: hz, y: +(peak + harmonic + noise).toFixed(4) }
  })
}

export function genTiltSeries(points = 60) {
  const now = Date.now()
  return {
    x: Array.from({ length: points }, (_, i) => new Date(now - (points - i) * 60_000)),
    tiltX: Array.from({ length: points }, () => rnd(0.3, 0.4)),
    tiltY: Array.from({ length: points }, () => rnd(1.2, 0.6)),
  }
}

// Shared sensor definitions — used by Dashboard and Viotel
export const SENSOR_DATA = [
  { id: 'temp',     title: 'Temperature', value: 24.5, unit: '°C',  icon: '🌡️', accent: '#f59e0b', deviceId: 1 },
  { id: 'humidity', title: 'Humidity',    value: 62,   unit: '%',   icon: '💧', accent: '#60a5fa', deviceId: 6 },
  { id: 'pressure', title: 'Pressure',    value: 1013, unit: 'hPa', icon: '🌬️', accent: '#a78bfa', deviceId: 2 },
  { id: 'co2',      title: 'CO₂ Level',   value: 412,  unit: 'ppm', icon: '💨', accent: '#34d399', deviceId: 4 },
]

// Simulate a small random drift on a numeric value
export function drift(value, range) {
  return parseFloat((value + (Math.random() - 0.5) * range).toFixed(1))
}

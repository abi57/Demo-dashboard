import SensorCard from '../components/SensorCard'
import { SENSOR_DATA } from '../data/sensors'
import styles from './Dashboard.module.css'

export default function Dashboard() {
  return (
    <div className={styles.page}>
      <h1>Dashboard</h1>
      <div className={styles.grid}>
        {SENSOR_DATA.map(s => (
          <SensorCard key={s.id} title={s.title} value={s.value} unit={s.unit} icon={s.icon} accent={s.accent} />
        ))}
      </div>
    </div>
  )
}

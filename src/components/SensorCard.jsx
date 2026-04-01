import styles from './SensorCard.module.css'

export default function SensorCard({ title, value, unit, icon, accent }) {
  return (
    <div className={styles.card} style={accent ? { '--card-accent': accent } : {}}>
      <div className={styles.icon}>{icon}</div>
      <div className={styles.body}>
        <span className={styles.title}>{title}</span>
        <span className={styles.value}>
          {value}
          {unit && <span className={styles.unit}>{unit}</span>}
        </span>
      </div>
    </div>
  )
}

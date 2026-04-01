import { Link } from 'react-router-dom'
import styles from './Home.module.css'

export default function Home() {
  return (
    <div className={styles.page}>
      <h1>Welcome to Viotel Demo</h1>
      <p>Monitor your IoT devices in real time.</p>
      <div className={styles.actions}>
        <Link to="/viotel" className={styles.btn}>Open IoT Monitor →</Link>
        <Link to="/dashboard" className={styles.btnOutline}>Dashboard</Link>
      </div>
    </div>
  )
}

import { useBreakingNews } from '../../hooks/useArticles'
import styles from './Ticker.module.css'

export default function Ticker() {
  const items = useBreakingNews()
  if (!items.length) return null

  const text = items.join('  ·  ')

  return (
    <div className={styles.ticker}>
      <span className={styles.label}>ЯАРАЛТАЙ</span>
      <div className={styles.track}>
        <span className={styles.text}>{text}&nbsp;&nbsp;&nbsp;&nbsp;{text}</span>
      </div>
    </div>
  )
}

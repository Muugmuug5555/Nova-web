import styles from './Footer.module.css'

export default function Footer() {
  return (
    <footer className={styles.footer}>
      <div>
        <div className={styles.logo}>НОВА.мн</div>
        <div className={styles.copy}>© {new Date().getFullYear()} ХААЛТГҮЙ ҮНЭН · Бүх эрх хуулиар хамгаалагдсан</div>
      </div>
      <div className={styles.links}>
        <a href="/policy">Нийтлэлийн бодлого</a>
        <a href="/privacy">Нууцлал</a>
        <a href="/contact">Холбоо барих</a>
        <a href="/rss">RSS</a>
      </div>
    </footer>
  )
}

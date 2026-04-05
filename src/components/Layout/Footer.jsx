import styles from './Footer.module.css'

export default function Footer() {
  return (
    <footer className={styles.footer}>
      <div>
        <img 
  src="https://wblhguozbmfnrzoolids.supabase.co/storage/v1/object/public/nova%20logo/Nova%20(20).png" 
  alt="НОВА.мн" 
  className={styles.logo}
/>
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

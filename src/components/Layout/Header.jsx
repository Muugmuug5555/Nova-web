import { useState } from 'react'
import { useTheme } from '../../lib/ThemeContext'
import styles from './Header.module.css'

const CATEGORIES = [
  { label: 'Нүүр', slug: '' },
  { label: 'Улс төр', slug: 'Улс төр' },
  { label: 'Эдийн засаг', slug: 'Эдийн засаг' },
  { label: 'Нийгэм', slug: 'Нийгэм' },
  { label: 'Спорт', slug: 'Спорт' },
  { label: 'Технологи', slug: 'Технологи' },
]

export default function Header({ activeCategory, onCategoryChange, onSearch }) {
  const { dark, setDark } = useTheme()
  const [searchOpen, setSearchOpen] = useState(false)
  const [searchVal, setSearchVal] = useState('')

  function handleSearch(e) {
    e.preventDefault()
    onSearch?.(searchVal)
    setSearchOpen(false)
    setSearchVal('')
  }

  return (
    <header className={styles.header}>
      {/* Top bar */}
      <div className={styles.topbar}>
        <span className={styles.date}>
          {new Date().toLocaleDateString('mn-MN', {
            year: 'numeric', month: 'long', day: 'numeric', weekday: 'long'
          })}
        </span>
        <div className={styles.topLinks}>
          <a href="/about">Бидний тухай</a>
          <a href="/contact">Холбоо барих</a>
          <a href="/rss">RSS</a>
        </div>
      </div>

      {/* Logo + actions */}
      <div className={styles.main}>
        <a href="/" className={styles.logoWrap}>
  <img 
    src="https://wblhguozbmfnrzoolids.supabase.co/storage/v1/object/public/nova%20logo/Nova%20(20).png" 
    alt="НОВА.мн" 
    className={styles.logoImg} 
  />
</a>
        <div className={styles.actions}>
          <a
            href="https://facebook.com"
            target="_blank"
            rel="noreferrer"
            className={styles.fbBtn}
          >
            f 65,000 дагагч
          </a>

          {searchOpen ? (
            <form onSubmit={handleSearch} className={styles.searchForm}>
              <input
                autoFocus
                value={searchVal}
                onChange={e => setSearchVal(e.target.value)}
                placeholder="Хайх..."
                className={styles.searchInput}
              />
            </form>
          ) : (
            <button
              className={styles.searchBtn}
              onClick={() => setSearchOpen(true)}
            >
              Хайх
            </button>
          )}

          {/* Dark mode toggle */}
          <div className={styles.toggleWrap} onClick={() => setDark(d => !d)}>
            <span className={styles.toggleIcon}>{dark ? '☾' : '☀'}</span>
            <div className={`${styles.toggle} ${dark ? styles.toggleOn : ''}`}>
              <div className={styles.toggleKnob} />
            </div>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className={styles.nav}>
        {CATEGORIES.map(cat => (
          <button
            key={cat.slug}
            className={`${styles.navItem} ${activeCategory === cat.slug ? styles.navActive : ''}`}
            onClick={() => onCategoryChange?.(cat.slug)}
          >
            {cat.label}
          </button>
        ))}
      </nav>
    </header>
  )
}

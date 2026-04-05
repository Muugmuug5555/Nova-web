import { useArticles } from '../../hooks/useArticles'
import NewsCard from '../shared/NewsCard'
import styles from './HomePage.module.css'

const SECTIONS = [
  { label: 'УЛСТӨР', slug: 'Улс төр' },
  { label: 'ЭДИЙН ЗАСАГ', slug: 'Эдийн засаг' },
  { label: 'НИЙГЭМ', slug: 'Нийгэм' },
  { label: 'СПОРТ', slug: 'Спорт' },
  { label: 'ТЕХНОЛОГИ', slug: 'Технологи' },
]

function timeAgo(dateStr) {
  if (!dateStr) return ''
  const date = new Date(dateStr)
  if (isNaN(date.getTime())) return ''
  const diff = Date.now() - date.getTime()
  const min = Math.floor(diff / 60000)
  if (min < 60) return `${min} мин өмнө`
  const hr = Math.floor(min / 60)
  if (hr < 24) return `${hr} цаг өмнө`
  return `${Math.floor(hr / 24)} өдрийн өмнө`
}

function SidebarList({ articles, onArticleClick }) {
  return (
    <div className={styles.sidebarBlock}>
      <div className={styles.sbHead}>
        <span className={styles.sbLabel}>СҮҮЛИЙН МЭДЭЭ</span>
        <span className={styles.sbMore}>Бүгд →</span>
      </div>
      <div className={styles.sbScroll}>
        {articles.map((a, i) => (
          <div key={a.id} className={styles.sbItem} onClick={() => onArticleClick(a)}>
            <span className={styles.sbNum}>0{i + 1}</span>
            <div>
              <div className={styles.sbCat}>{a.category}</div>
              <div className={styles.sbTitle}>{a.title}</div>
              <div className={styles.sbTime}>{timeAgo(a.created_at)}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

function CategorySection({ slug, label, onArticleClick, onCategoryClick }) {
  const { articles, loading } = useArticles({ category: slug, limit: 3 })
  if (loading || !articles.length) return null

  return (
    <section className={styles.catSection}>
      <div className={styles.catHeader}>
        <span className={styles.catLabel}>{label}</span>
        <span
          className={styles.catMore}
          onClick={() => onCategoryClick?.(slug)}
        >Бүгдийг үзэх →</span>
      </div>
      <div className={styles.catGrid}>
        {articles.map(a => (
          <NewsCard key={a.id} article={a} onClick={onArticleClick} />
        ))}
      </div>
    </section>
  )
}

export default function HomePage({ activeCategory, onArticleClick, onCategoryChange }) {
  const { articles: featured } = useArticles({ featured: true, limit: 1 })
  const { articles: recent } = useArticles({ limit: 8 })
  const { articles: subArticles } = useArticles({ limit: 4 })

  const hero = featured[0] || recent[0]
  const sidebarArticles = recent.slice(0, 6)
  const subCards = subArticles.slice(1, 3)

  return (
    <div className={styles.page}>
      {!activeCategory && (
        <div className={styles.heroWrap}>
          <div className={styles.heroMain}>
            {hero && (
              <NewsCard article={hero} variant="hero" onClick={onArticleClick} />
            )}
            <div className={styles.subGrid}>
              {subCards.map(a => (
                <NewsCard key={a.id} article={a} variant="list" onClick={onArticleClick} />
              ))}
            </div>
          </div>
          <aside className={styles.sidebar}>
            <SidebarList articles={sidebarArticles} onArticleClick={onArticleClick} />
          </aside>
        </div>
      )}

      {(activeCategory
        ? SECTIONS.filter(s => s.slug === activeCategory)
        : SECTIONS
      ).map(s => (
        <CategorySection
          key={s.slug}
          slug={s.slug}
          label={s.label}
          onArticleClick={onArticleClick}
          onCategoryClick={onCategoryChange}
        />
      ))}
    </div>
  )
}

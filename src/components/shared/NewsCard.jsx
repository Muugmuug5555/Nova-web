import styles from './NewsCard.module.css'

const CAT_SLUG_MAP = {
  'Улс төр': 'politics',
  'Эдийн засаг': 'economy',
  'Нийгэм': 'society',
  'Спорт': 'sport',
  'Технологи': 'technology',
}

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

export default function NewsCard({ article, variant = 'default', onClick }) {
  const catName = article.categories?.name || ''
  const catSlug = article.categories?.slug || CAT_SLUG_MAP[catName] || 'politics'

  if (variant === 'hero') {
    return (
      <div className={styles.hero} onClick={() => onClick?.(article)}>
        <div className={styles.heroBg}>
          {article.image_url
            ? <img src={article.image_url} alt={article.title} className={styles.heroImg} />
            : <div className={`${styles.heroPlaceholder} cat-${catSlug}`}>{catName}</div>
          }
          <div className={styles.heroGrad} />
          <div className={styles.heroBody}>
            <span className={styles.catBadge}>{catName.toUpperCase()}</span>
            <h2 className={styles.heroTitle}>{article.title}</h2>
            <div className={styles.heroMeta}>
              <span>{article.author}</span>
              <span>·</span>
              <span>{timeAgo(article.published_at)}</span>
              <span>·</span>
              <span>{article.views?.toLocaleString()} уншигч</span>
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (variant === 'list') {
    return (
      <div className={styles.listItem} onClick={() => onClick?.(article)}>
        <div className={`${styles.listThumb} cat-${catSlug}`}>
          {article.image_url
            ? <img src={article.image_url} alt={article.title} className={styles.listImg} />
            : catName
          }
        </div>
        <div className={styles.listBody}>
          <div className={styles.listCat}>{catName.toUpperCase()}</div>
          <div className={styles.listTitle}>{article.title}</div>
          <div className={styles.listTime}>{timeAgo(article.published_at)}</div>
        </div>
      </div>
    )
  }

  if (variant === 'sidebar') {
    return null // handled by SidebarList
  }

  // default card
  return (
    <div className={styles.card} onClick={() => onClick?.(article)}>
      <div className={`${styles.cardImg} cat-${catSlug}`}>
        {article.image_url
          ? <img src={article.image_url} alt={article.title} className={styles.cardImgEl} />
          : catName
        }
      </div>
      <div className={styles.cardBody}>
        <div className={styles.cardCat}>{catName.toUpperCase()}</div>
        <div className={styles.cardTitle}>{article.title}</div>
        <div className={styles.cardMeta}>
          <span>{timeAgo(article.published_at)}</span>
          <span>·</span>
          <span>{article.views?.toLocaleString()} уншигч</span>
        </div>
      </div>
    </div>
  )
}

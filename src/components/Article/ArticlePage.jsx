import { useEffect, useState } from 'react'
import { useArticle, useArticles } from '../../hooks/useArticles'
import NewsCard from '../shared/NewsCard'
import styles from './ArticlePage.module.css'

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

function ReadingProgress() {
  const [pct, setPct] = useState(0)

  useEffect(() => {
    function onScroll() {
      const scrolled = window.scrollY
      const total = document.documentElement.scrollHeight - window.innerHeight
      setPct(total > 0 ? Math.min(Math.round((scrolled / total) * 100), 100) : 0)
    }
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <div className={styles.progBar}>
      <div className={styles.progFill} style={{ width: `${pct}%` }} />
    </div>
  )
}

export default function ArticlePage({ articleId, onBack, onArticleClick }) {
  const { article, loading } = useArticle(articleId)
  const { articles: related } = useArticles({
    category: article?.categories?.slug,
    limit: 4,
  })
  const { articles: sidebarArticles } = useArticles({ limit: 6 })

  if (loading) return <div className={styles.loading}>Уншиж байна...</div>
  if (!article) return <div className={styles.loading}>Мэдээ олдсонгүй</div>

  const catSlug = article.categories?.slug || 'politics'
  const catName = article.categories?.name || ''
  const relatedFiltered = related.filter(a => a.id !== article.id).slice(0, 4)

  function handleCopy() {
    navigator.clipboard.writeText(window.location.href)
  }

  return (
    <div className={styles.page}>
      <ReadingProgress />

      <button className={styles.backBtn} onClick={onBack}>
        ← Нүүр хуудас
      </button>

      <div className={styles.layout}>
        <article className={styles.main}>

          {/* Category breadcrumb */}
          <div className={styles.catRow}>
            <span className={styles.catBadge}>{catName.toUpperCase()}</span>
            <span className={styles.catSep}>/</span>
            <span className={styles.catSub}>Засгийн газар</span>
          </div>

          {/* Title */}
          <h1 className={styles.title}>{article.title}</h1>

          {/* Lead */}
          {article.excerpt && (
            <p className={styles.lead}>{article.excerpt}</p>
          )}

          {/* Meta */}
         {/* Meta */}
<div className={styles.meta}>
  <div className={styles.avatar}>
    {article.author?.slice(0, 2).toUpperCase()}
  </div>
  <div>
    <div className={styles.authorName}>{article.author}</div>
    <div className={styles.date}>
      {article.created_at
        ? new Date(article.created_at).toLocaleDateString('mn-MN', {
            year: 'numeric', month: 'long', day: 'numeric'
          })
        : ''}
    </div>
  </div>
</div>

          {/* Hero image */}
          <div className={`${styles.heroImg} cat-${catSlug}`}>
            {article.image_url
              ? <img src={article.image_url} alt={article.title} className={styles.heroImgEl} />
              : <span className={styles.heroImgIcon}>📰</span>
            }
          </div>
          <p className={styles.imgCaption}>
            Гэрэл зургийн тайлбар · НОВА.мн
          </p>

          {/* Body */}
          <div className={styles.body}>
  {(article.body || '').split('\n\n').map((para, i) => (
    <p key={i}>{para}</p>
  ))}
</div>

          {/* Share */}
          <div className={styles.shareRow}>
            <span className={styles.shareLabel}>ХУВААЛЦАХ</span>
            <a
              href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(window.location.href)}`}
              target="_blank" rel="noreferrer"
              className={`${styles.shareBtn} ${styles.fbShare}`}
            >Facebook</a>
            <a
              href={`https://twitter.com/intent/tweet?url=${encodeURIComponent(window.location.href)}&text=${encodeURIComponent(article.title)}`}
              target="_blank" rel="noreferrer"
              className={`${styles.shareBtn} ${styles.twShare}`}
            >X</a>
            <button
              className={`${styles.shareBtn} ${styles.cpShare}`}
              onClick={handleCopy}
            >Холбоос хуулах</button>
          </div>

          {/* Related */}
          {relatedFiltered.length > 0 && (
            <div className={styles.related}>
              <div className={styles.relLabel}>ХОЛБООТОЙ МЭДЭЭ</div>
              <div className={styles.relGrid}>
                {relatedFiltered.map(a => (
                  <NewsCard key={a.id} article={a} onClick={onArticleClick} />
                ))}
              </div>
            </div>
          )}
        </article>

        {/* Sticky sidebar */}
        <aside className={styles.sidebar}>
          <div className={styles.sbBlock}>
            <div className={styles.sbHead}>
              <span className={styles.sbLabel}>СҮҮЛИЙН МЭДЭЭ</span>
            </div>
            {sidebarArticles
              .filter(a => a.id !== article.id)
              .slice(0, 5)
              .map((a, i) => (
                <div key={a.id} className={styles.sbItem} onClick={() => onArticleClick(a)}>
                  <span className={styles.sbNum}>0{i + 1}</span>
                  <div>
                    <div className={styles.sbCat}>{a.categories?.name?.toUpperCase()}</div>
                    <div className={styles.sbTitle}>{a.title}</div>
                    <div className={styles.sbTime}>{timeAgo(a.published_at)}</div>
                  </div>
                </div>
              ))}
          </div>
        </aside>
      </div>
    </div>
  )
}

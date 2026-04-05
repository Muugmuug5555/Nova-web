import { useState } from 'react'
import { ThemeProvider } from './lib/ThemeContext'
import Header from './components/Layout/Header'
import Ticker from './components/Layout/Ticker'
import Footer from './components/Layout/Footer'
import HomePage from './components/Home/HomePage'
import ArticlePage from './components/Article/ArticlePage'
import './index.css'

export default function App() {
  const [page, setPage] = useState('home')         // 'home' | 'article'
  const [articleId, setArticleId] = useState(null)
  const [activeCategory, setActiveCategory] = useState('')

  function openArticle(article) {
    setArticleId(article.id)
    setPage('article')
    window.scrollTo(0, 0)
  }

  function goHome() {
    setPage('home')
    setArticleId(null)
    window.scrollTo(0, 0)
  }

  function handleCategoryChange(slug) {
    setActiveCategory(slug)
    setPage('home')
    window.scrollTo(0, 0)
  }

  return (
    <ThemeProvider>
     <Header
  activeCategory={activeCategory}
  onCategoryChange={handleCategoryChange}
/>

      {page === 'home' && <Ticker />}

      {page === 'home' && (
      <HomePage
  activeCategory={activeCategory}
  onArticleClick={openArticle}
  onCategoryChange={handleCategoryChange}
/>
      )}

      {page === 'article' && (
        <ArticlePage
          articleId={articleId}
          onBack={goHome}
          onArticleClick={openArticle}
        />
      )}

      <Footer />
    </ThemeProvider>
  )
}

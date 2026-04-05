import { useState, useEffect } from 'react'
import { supabase } from './lib/supabase'
import { ThemeProvider } from './lib/ThemeContext'
import Header from './components/Layout/Header'
import Ticker from './components/Layout/Ticker'
import Footer from './components/Layout/Footer'
import HomePage from './components/Home/HomePage'
import ArticlePage from './components/Article/ArticlePage'
import LoginPage from './components/Admin/LoginPage'
import AdminPage from './components/Admin/AdminPage'
import './index.css'

export default function App() {
  const [page, setPage] = useState('home')
  const [articleId, setArticleId] = useState(null)
  const [activeCategory, setActiveCategory] = useState('')
  const [admin, setAdmin] = useState(false)
  const [checkingAuth, setCheckingAuth] = useState(true)

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      setAdmin(!!data.session)
      setCheckingAuth(false)
    })
    supabase.auth.onAuthStateChange((_e, session) => {
      setAdmin(!!session)
    })
    if (window.location.pathname === '/admin') {
      setPage('admin')
    }
  }, [])

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

  if (checkingAuth && page === 'admin') {
    return <div style={{ minHeight: '100vh', background: '#0A0A0A' }} />
  }

  if (page === 'admin') {
    if (!admin) return <LoginPage onLogin={() => setAdmin(true)} />
    return <AdminPage onLogout={() => setAdmin(false)} />
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

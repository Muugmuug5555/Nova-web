import { useState, useEffect } from 'react'
import { BrowserRouter, Routes, Route, useNavigate, useParams } from 'react-router-dom'
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

function AppInner() {
  const [activeCategory, setActiveCategory] = useState('')
  const [admin, setAdmin] = useState(false)
  const [checkingAuth, setCheckingAuth] = useState(true)
  const navigate = useNavigate()

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      setAdmin(!!data.session)
      setCheckingAuth(false)
    })
    supabase.auth.onAuthStateChange((_e, session) => {
      setAdmin(!!session)
    })
  }, [])

  function openArticle(article) {
    navigate(`/article/${article.id}`)
    window.scrollTo(0, 0)
  }

  function goHome() {
    navigate('/')
    window.scrollTo(0, 0)
  }

  function handleCategoryChange(slug) {
    setActiveCategory(slug)
    navigate('/')
    window.scrollTo(0, 0)
  }

  return (
    <Routes>
      <Route path="/admin" element={
        checkingAuth
          ? <div style={{ minHeight: '100vh', background: '#0A0A0A' }} />
          : !admin
            ? <LoginPage onLogin={() => setAdmin(true)} />
            : <AdminPage onLogout={() => setAdmin(false)} />
      } />
      <Route path="/article/:id" element={
        <ThemeProvider>
          <Header activeCategory={activeCategory} onCategoryChange={handleCategoryChange} />
          <ArticleWrapper onBack={goHome} onArticleClick={openArticle} />
          <Footer />
        </ThemeProvider>
      } />
      <Route path="/" element={
        <ThemeProvider>
          <Header activeCategory={activeCategory} onCategoryChange={handleCategoryChange} />
          <Ticker />
          <HomePage
            activeCategory={activeCategory}
            onArticleClick={openArticle}
            onCategoryChange={handleCategoryChange}
          />
          <Footer />
        </ThemeProvider>
      } />
    </Routes>
  )
}

function ArticleWrapper({ onBack, onArticleClick }) {
  const { id } = useParams()
  return (
    <ArticlePage
      articleId={id}
      onBack={onBack}
      onArticleClick={onArticleClick}
    />
  )
}

export default function App() {
  return (
    <BrowserRouter>
      <AppInner />
    </BrowserRouter>
  )
}

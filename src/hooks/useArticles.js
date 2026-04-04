import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'

// Fetch all articles with optional category filter
export function useArticles({ category, limit = 12, featured = false } = {}) {
  const [articles, setArticles] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    async function fetch() {
      setLoading(true)
      let query = supabase
        .from('articles')
        .select('*, categories(name, slug, color)')
        .order('published_at', { ascending: false })
        .limit(limit)

      if (category) query = query.eq('categories.slug', category)
      if (featured) query = query.eq('is_featured', true)

      const { data, error } = await query
      if (error) setError(error)
      else setArticles(data || [])
      setLoading(false)
    }
    fetch()
  }, [category, limit, featured])

  return { articles, loading, error }
}

// Fetch single article by id
export function useArticle(id) {
  const [article, setArticle] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    if (!id) return
    async function fetch() {
      setLoading(true)
      const { data, error } = await supabase
        .from('articles')
        .select('*, categories(name, slug, color)')
        .eq('id', id)
        .single()

      if (error) setError(error)
      else {
        setArticle(data)
        // Increment view count
        supabase.rpc('increment_views', { article_id: id })
      }
      setLoading(false)
    }
    fetch()
  }, [id])

  return { article, loading, error }
}

// Fetch breaking news ticker
export function useBreakingNews() {
  const [items, setItems] = useState([])

  useEffect(() => {
    async function fetch() {
      const { data } = await supabase
        .from('breaking_news')
        .select('text')
        .eq('is_active', true)
        .order('created_at', { ascending: false })
        .limit(5)
      setItems(data?.map(d => d.text) || [])
    }
    fetch()
  }, [])

  return items
}

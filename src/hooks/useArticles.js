import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'

export function useArticles({ category, limit = 12, featured = false } = {}) {
  const [articles, setArticles] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetch() {
      setLoading(true)
      let query = supabase
        .from('posts')
        .select('*')
        .eq('status', 'published')
        .order('created_at', { ascending: false })
        .limit(limit)

      if (category) query = query.eq('category', category)
      if (featured) query = query.eq('is_featured', true)

      const { data } = await query
      setArticles(data || [])
      setLoading(false)
    }
    fetch()
  }, [category, limit, featured])

  return { articles, loading }
}

export function useArticle(id) {
  const [article, setArticle] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!id) return
    async function fetch() {
      setLoading(true)
      const { data } = await supabase
        .from('posts')
        .select('*')
        .eq('id', id)
        .single()
      setArticle(data)
      setLoading(false)
    }
    fetch()
  }, [id])

  return { article, loading }
}

export function useBreakingNews() {
  const [items, setItems] = useState([])

  useEffect(() => {
    async function fetch() {
      const { data } = await supabase
        .from('posts')
        .select('title')
        .eq('pinned', true)
        .eq('status', 'published')
        .limit(5)
      setItems(data?.map(d => d.title) || [])
    }
    fetch()
  }, [])

  return items
}

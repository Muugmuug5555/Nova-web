import { useState, useEffect } from 'react'
import { supabase } from '../../lib/supabase'

const CATEGORIES = ['Улс төр', 'Эдийн засаг', 'Нийгэм', 'Спорт', 'Технологи']

export default function AdminPage({ onLogout }) {
  const [posts, setPosts] = useState([])
  const [loading, setLoading] = useState(true)
  const [view, setView] = useState('list')
  const [editing, setEditing] = useState(null)
  const [form, setForm] = useState({
    title: '', summary: '', body: '',
    category: 'Улс төр', image_url: '',
    status: 'published', pinned: false
  })

  useEffect(() => { fetchPosts() }, [])

  async function fetchPosts() {
    setLoading(true)
    const { data } = await supabase
      .from('posts')
      .select('*')
      .order('created_at', { ascending: false })
    setPosts(data || [])
    setLoading(false)
  }

  async function handleSave() {
    if (editing) {
      await supabase.from('posts').update(form).eq('id', editing)
    } else {
      await supabase.from('posts').insert(form)
    }
    setView('list')
    setEditing(null)
    setForm({ title: '', summary: '', body: '', category: 'Улс төр', image_url: '', status: 'published', pinned: false })
    fetchPosts()
  }

  async function handleDelete(id) {
    if (!window.confirm('Устгах уу?')) return
    await supabase.from('posts').delete().eq('id', id)
    fetchPosts()
  }

  function handleEdit(post) {
    setEditing(post.id)
    setForm({
      title: post.title || '',
      summary: post.summary || '',
      body: post.body || '',
      category: post.category || 'Улс төр',
      image_url: post.image_url || '',
      status: post.status || 'published',
      pinned: post.pinned || false
    })
    setView('form')
  }

  async function handleLogout() {
    await supabase.auth.signOut()
    onLogout()
  }

  const inp = {
    width: '100%', padding: '10px 14px',
    background: '#111', border: '1px solid #333',
    borderRadius: '6px', color: '#fff',
    fontSize: '14px', fontFamily: 'Plus Jakarta Sans, sans-serif',
    marginBottom: '16px', boxSizing: 'border-box'
  }
  const lbl = {
    fontSize: '11px', color: '#888',
    display: 'block', marginBottom: '6px',
    fontWeight: '700', letterSpacing: '0.1em'
  }

  return (
    <div style={{ minHeight: '100vh', background: '#0A0A0A', color: '#F0F0F0', fontFamily: 'Plus Jakarta Sans, sans-serif' }}>
      <div style={{ background: '#111', borderBottom: '2px solid #C8202A', padding: '12px 24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <img src="https://wblhguozbmfnrzoolids.supabase.co/storage/v1/object/public/nova%20logo/Nova%20(20).png" alt="НОВА.мн" style={{ height: '36px' }} />
          <span style={{ fontSize: '13px', color: '#888' }}>Админ панел</span>
        </div>
        <div style={{ display: 'flex', gap: '12px' }}>
          {view === 'list' ? (
            <button onClick={() => { setEditing(null); setForm({ title: '', summary: '', body: '', category: 'Улс төр', image_url: '', status: 'published', pinned: false }); setView('form') }}
              style={{ background: '#C8202A', color: '#fff', border: 'none', borderRadius: '6px', padding: '8px 16px', cursor: 'pointer', fontWeight: '700', fontFamily: 'inherit' }}>
              + Мэдээ нэмэх
            </button>
          ) : (
            <button onClick={() => setView('list')}
              style={{ background: '#2A2A2A', color: '#fff', border: 'none', borderRadius: '6px', padding: '8px 16px', cursor: 'pointer', fontFamily: 'inherit' }}>
              ← Буцах
            </button>
          )}
          <button onClick={handleLogout}
            style={{ background: 'none', color: '#888', border: '1px solid #333', borderRadius: '6px', padding: '8px 16px', cursor: 'pointer', fontFamily: 'inherit' }}>
            Гарах
          </button>
        </div>
      </div>

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
  status: 'published', pinned: false, is_featured: false, is_sub: false
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
    setForm({ title: '', summary: '', body: '', category: 'Улс төр', image_url: '', status: 'published', pinned: false, is_featured: false, is_sub: false })
    fetchPosts()
  }

  async function handleImageUpload(e) {
    const file = e.target.files[0]
    if (!file) return
    const ext = file.name.split('.').pop()
    const fileName = `${Date.now()}.${ext}`
    const { error } = await supabase.storage
      .from('Nova-posts')
      .upload(fileName, file, { upsert: true })
    if (error) {
      alert('Зураг upload хийхэд алдаа гарлаа')
      return
    }
    const { data: urlData } = supabase.storage
      .from('Nova-posts')
      .getPublicUrl(fileName)
    setForm(prev => ({ ...prev, image_url: urlData.publicUrl }))
  }

  async function handleDelete(id) {
    if (!window.confirm('Устгах уу?')) return
    const { error } = await supabase.from('posts').delete().eq('id', id)
    if (error) {
      alert('Алдаа: ' + error.message)
      return
    }
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
      pinned: post.pinned || false,
      is_featured: post.is_featured || false
      is_sub: post.is_sub || false
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
            <button onClick={() => { setEditing(null); setForm({ title: '', summary: '', body: '', category: 'Улс төр', image_url: '', status: 'published', pinned: false, is_featured: false }); setView('form') }}
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
      <div style={{ padding: '24px', maxWidth: '1000px', margin: '0 auto' }}>
        {view === 'list' ? (
          <div>
            <div style={{ marginBottom: '16px', fontSize: '13px', color: '#888' }}>
              Нийт {posts.length} мэдээ
            </div>
            {loading ? (
              <div style={{ color: '#888', textAlign: 'center', padding: '40px' }}>Уншиж байна...</div>
            ) : (
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                  <tr style={{ borderBottom: '1px solid #2A2A2A' }}>
                    <th style={{ textAlign: 'left', padding: '10px', fontSize: '11px', color: '#888', letterSpacing: '0.1em' }}>ГАРЧИГ</th>
                    <th style={{ textAlign: 'left', padding: '10px', fontSize: '11px', color: '#888', letterSpacing: '0.1em' }}>АНГИЛАЛ</th>
                    <th style={{ textAlign: 'left', padding: '10px', fontSize: '11px', color: '#888', letterSpacing: '0.1em' }}>ТӨЛӨВ</th>
                    <th style={{ textAlign: 'left', padding: '10px', fontSize: '11px', color: '#888', letterSpacing: '0.1em' }}>ОГНОО</th>
                    <th style={{ padding: '10px' }}></th>
                  </tr>
                </thead>
                <tbody>
                  {posts.map(post => (
                    <tr key={post.id} style={{ borderBottom: '1px solid #1A1A1A' }}>
                      <td style={{ padding: '12px 10px', fontSize: '13px', maxWidth: '300px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                          {post.is_featured && <span style={{ fontSize: '10px', background: '#C8202A', color: '#fff', padding: '1px 6px', borderRadius: '3px' }}>ГОЛ</span>}
                          {post.pinned && <span style={{ fontSize: '10px', background: '#333', color: '#FFD700', padding: '1px 6px', borderRadius: '3px' }}>ЯАРАЛТАЙ</span>}
                          <div style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{post.title}</div>
                        </div>
                      </td>
                      <td style={{ padding: '12px 10px', fontSize: '12px', color: '#888' }}>{post.category}</td>
                      <td style={{ padding: '12px 10px' }}>
                        <span style={{ fontSize: '11px', padding: '2px 8px', borderRadius: '10px', background: post.status === 'published' ? '#1A3A1A' : '#2A2A2A', color: post.status === 'published' ? '#6DB86D' : '#888' }}>
                          {post.status === 'published' ? 'Нийтлэгдсэн' : 'Ноорог'}
                        </span>
                      </td>
                      <td style={{ padding: '12px 10px', fontSize: '12px', color: '#888' }}>
                        {new Date(post.created_at).toLocaleDateString('mn-MN')}
                      </td>
                      <td style={{ padding: '12px 10px' }}>
                        <div style={{ display: 'flex', gap: '8px' }}>
                          <button onClick={() => handleEdit(post)}
                            style={{ background: '#2A2A2A', color: '#fff', border: 'none', borderRadius: '4px', padding: '6px 12px', cursor: 'pointer', fontSize: '12px', fontFamily: 'inherit' }}>
                            Засах
                          </button>
                          <button onClick={() => handleDelete(post.id)}
                            style={{ background: '#3A1A1A', color: '#C8202A', border: 'none', borderRadius: '4px', padding: '6px 12px', cursor: 'pointer', fontSize: '12px', fontFamily: 'inherit' }}>
                            Устгах
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        ) : (
          <div style={{ maxWidth: '700px' }}>
            <h2 style={{ fontSize: '18px', marginBottom: '24px', fontWeight: '700' }}>
              {editing ? 'Мэдээ засах' : 'Шинэ мэдээ нэмэх'}
            </h2>
            <label style={lbl}>ГАРЧИГ</label>
            <input style={inp} value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} placeholder="Мэдээний гарчиг" />

            <label style={lbl}>ТОВЧ АГУУЛГА</label>
            <textarea style={{ ...inp, height: '80px', resize: 'vertical' }} value={form.summary} onChange={e => setForm({ ...form, summary: e.target.value })} placeholder="Товч агуулга" />

            <label style={lbl}>БҮТЭН АГУУЛГА</label>
            <textarea style={{ ...inp, height: '200px', resize: 'vertical' }} value={form.body} onChange={e => setForm({ ...form, body: e.target.value })} placeholder="Мэдээний бүтэн агуулга" />

            <label style={lbl}>ЗУРГИЙН ХОЛБООС</label>
            <input style={inp} value={form.image_url} onChange={e => setForm({ ...form, image_url: e.target.value })} placeholder="https://..." />

            <label style={lbl}>ЗУРАГ UPLOAD ХИЙХ</label>
            <input type="file" accept="image/*" onChange={handleImageUpload} style={{ ...inp, padding: '8px', cursor: 'pointer' }} />
            {form.image_url && (
              <img src={form.image_url} alt="preview" style={{ width: '100%', borderRadius: '6px', marginBottom: '16px', objectFit: 'cover', maxHeight: '200px' }} />
            )}

            <label style={lbl}>АНГИЛАЛ</label>
            <select style={{ ...inp, cursor: 'pointer' }} value={form.category} onChange={e => setForm({ ...form, category: e.target.value })}>
              {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
            </select>

            <label style={lbl}>ТӨЛӨВ</label>
            <select style={{ ...inp, cursor: 'pointer' }} value={form.status} onChange={e => setForm({ ...form, status: e.target.value })}>
              <option value="published">Нийтлэх</option>
              <option value="draft">Ноорог</option>
            </select>

            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '16px' }}>
              <input type="checkbox" id="pinned" checked={form.pinned} onChange={e => setForm({ ...form, pinned: e.target.checked })} style={{ width: '16px', height: '16px', cursor: 'pointer' }} />
              <label htmlFor="pinned" style={{ fontSize: '13px', color: '#ccc', cursor: 'pointer' }}>Яаралтай мэдээ (ticker-т харагдана)</label>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '16px' }}>
  <input type="checkbox" id="is_sub" checked={form.is_sub} onChange={e => setForm({ ...form, is_sub: e.target.checked })} style={{ width: '16px', height: '16px', cursor: 'pointer' }} />
  <label htmlFor="is_sub" style={{ fontSize: '13px', color: '#ccc', cursor: 'pointer' }}>Нүүр хуудасны дэд мэдээ (2 жижиг карт)</label>
</div>

            <button onClick={handleSave}
              style={{ background: '#C8202A', color: '#fff', border: 'none', borderRadius: '6px', padding: '12px 32px', cursor: 'pointer', fontWeight: '700', fontSize: '14px', fontFamily: 'inherit' }}>
              {editing ? 'Хадгалах' : 'Нийтлэх'}
            </button>
          </div>
        )}
      </div>
    </div>
  )
}

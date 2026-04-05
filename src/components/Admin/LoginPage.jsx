import { useState } from 'react'
import { supabase } from '../../lib/supabase'

export default function LoginPage({ onLogin }) {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  async function handleLogin(e) {
    e.preventDefault()
    setLoading(true)
    setError('')
    const { error } = await supabase.auth.signInWithPassword({ email, password })
    if (error) setError('Нэвтрэх мэдээлэл буруу байна')
    else onLogin()
    setLoading(false)
  }

  return (
    <div style={{
      minHeight: '100vh', display: 'flex',
      alignItems: 'center', justifyContent: 'center',
      background: '#0A0A0A'
    }}>
      <form onSubmit={handleLogin} style={{
        background: '#1A1A1A', padding: '40px',
        borderRadius: '12px', width: '360px',
        border: '1px solid #2A2A2A'
      }}>
        <div style={{ marginBottom: '24px', textAlign: 'center' }}>
          <img
            src="https://wblhguozbmfnrzoolids.supabase.co/storage/v1/object/public/nova%20logo/Nova%20(20).png"
            alt="НОВА.мн" style={{ height: '48px' }}
          />
        </div>
        <div style={{ marginBottom: '16px' }}>
          <label style={{ fontSize: '12px', color: '#888', display: 'block', marginBottom: '6px' }}>
            ИМЭЙЛ
          </label>
          <input
            type="email" value={email}
            onChange={e => setEmail(e.target.value)}
            style={{
              width: '100%', padding: '10px 14px',
              background: '#111', border: '1px solid #333',
              borderRadius: '6px', color: '#fff',
              fontSize: '14px', fontFamily: 'inherit'
            }}
          />
        </div>
        <div style={{ marginBottom: '24px' }}>
          <label style={{ fontSize: '12px', color: '#888', display: 'block', marginBottom: '6px' }}>
            НУУЦ ҮГ
          </label>
          <input
            type="password" value={password}
            onChange={e => setPassword(e.target.value)}
            style={{
              width: '100%', padding: '10px 14px',
              background: '#111', border: '1px solid #333',
              borderRadius: '6px', color: '#fff',
              fontSize: '14px', fontFamily: 'inherit'
            }}
          />
        </div>
        {error && (
          <div style={{ color: '#C8202A', fontSize: '13px', marginBottom: '16px' }}>
            {error}
          </div>
        )}
        <button
          type="submit" disabled={loading}
          style={{
            width: '100%', padding: '12px',
            background: '#C8202A', color: '#fff',
            border: 'none', borderRadius: '6px',
            fontSize: '14px', fontWeight: '700',
            cursor: 'pointer', fontFamily: 'inherit'
          }}
        >
          {loading ? 'Нэвтэрж байна...' : 'Нэвтрэх'}
        </button>
      </form>
    </div>
  )
}

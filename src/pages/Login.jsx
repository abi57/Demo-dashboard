import { useState, useEffect } from 'react'
import { useNavigate, Navigate, Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { Eye, EyeOff } from 'lucide-react'

export default function Login() {
  const { user, login } = useAuth()
  const navigate = useNavigate()
  const [form, setForm] = useState({ email: '', password: '' })
  const [errors, setErrors] = useState({})
  const [showPass, setShowPass] = useState(false)
  const [loading, setLoading] = useState(false)
  const [ready, setReady] = useState(false)

  useEffect(() => { setTimeout(() => setReady(true), 40) }, [])

  if (user) return <Navigate to="/dashboard" replace />

  const set = (k, v) => { setForm(f => ({ ...f, [k]: v })); setErrors(e => ({ ...e, [k]: undefined, global: undefined })) }

  async function handleSubmit(e) {
    e.preventDefault()
    const errs = {}
    if (!form.email)    errs.email    = 'Email is required'
    if (!form.password) errs.password = 'Password is required'
    if (Object.keys(errs).length) { setErrors(errs); return }
    setLoading(true)
    await new Promise(r => setTimeout(r, 500))
    const result = login(form.email, form.password)
    setLoading(false)
    if (!result.ok) { setErrors({ global: result.error }); return }
    navigate('/dashboard')
  }

  return (
    <div style={{ minHeight: '100svh', background: 'var(--vio-page-bg)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24 }}>
      <div style={{ width: '100%', maxWidth: 400, opacity: ready ? 1 : 0, transform: ready ? 'none' : 'translateY(8px)', transition: 'opacity 0.2s, transform 0.2s' }}>
        {/* Logo */}
        <div style={{ textAlign: 'center', marginBottom: 32 }}>
          <svg width="44" height="44" viewBox="0 0 44 44" fill="none" style={{ margin: '0 auto 12px', display: 'block' }}>
            <rect width="44" height="44" rx="11" fill="#0b3d4a"/>
            <circle cx="22" cy="22" r="6" stroke="white" strokeWidth="2" fill="none"/>
            <path d="M22 8v4M22 32v4M8 22h4M32 22h4" stroke="white" strokeWidth="2" strokeLinecap="round"/>
            <path d="M12 12l2.8 2.8M29.2 29.2L32 32M12 32l2.8-2.8M29.2 14.8L32 12" stroke="rgba(255,255,255,0.5)" strokeWidth="1.5" strokeLinecap="round"/>
          </svg>
          <div style={{ fontSize: 22, fontWeight: 800, color: 'var(--vio-primary)', letterSpacing: '-0.02em' }}>myViotel</div>
          <div style={{ fontSize: 13, color: 'var(--vio-text-muted)', marginTop: 4 }}>Field Engineer Platform</div>
        </div>

        <div className="vio-card">
          <h2 style={{ fontSize: 20, fontWeight: 700, color: 'var(--vio-text-primary)', marginBottom: 20 }}>Sign in</h2>

          {errors.global && (
            <div style={{ padding: '10px 14px', borderRadius: 8, background: '#fef2f2', border: '0.5px solid #fecaca', color: '#b91c1c', fontSize: 13, marginBottom: 16 }}>
              {errors.global}
            </div>
          )}

          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            <div>
              <label style={{ display: 'block', fontSize: 13, fontWeight: 500, color: 'var(--vio-text-secondary)', marginBottom: 6 }}>Email address</label>
              <input className={`vio-input${errors.email ? ' invalid' : ''}`} type="email" placeholder="you@company.com"
                value={form.email} onChange={e => set('email', e.target.value)} autoComplete="email" />
              {errors.email && <p style={{ fontSize: 12, color: 'var(--vio-status-red)', marginTop: 4 }}>{errors.email}</p>}
            </div>

            <div>
              <label style={{ display: 'block', fontSize: 13, fontWeight: 500, color: 'var(--vio-text-secondary)', marginBottom: 6 }}>Password</label>
              <div style={{ position: 'relative' }}>
                <input className={`vio-input${errors.password ? ' invalid' : ''}`} type={showPass ? 'text' : 'password'}
                  placeholder="••••••••" value={form.password} onChange={e => set('password', e.target.value)} autoComplete="current-password"
                  style={{ paddingRight: 44 }} />
                <button type="button" onClick={() => setShowPass(v => !v)}
                  style={{ position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: 'var(--vio-text-muted)', display: 'flex' }}>
                  {showPass ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
              {errors.password && <p style={{ fontSize: 12, color: 'var(--vio-status-red)', marginTop: 4 }}>{errors.password}</p>}
            </div>

            <button type="submit" className="vio-btn vio-btn-primary" style={{ width: '100%', marginTop: 4 }} disabled={loading}>
              {loading ? 'Signing in…' : 'Sign in'}
            </button>
          </form>

          <p style={{ textAlign: 'center', marginTop: 20, fontSize: 13, color: 'var(--vio-text-muted)' }}>
            Don't have an account?{' '}
            <Link to="/signup" style={{ color: 'var(--vio-accent)', fontWeight: 500, textDecoration: 'none' }}>Sign up</Link>
          </p>

          <div style={{ marginTop: 20, padding: '12px 14px', borderRadius: 8, background: 'var(--vio-page-bg)', border: '0.5px solid var(--vio-card-border)' }}>
            <p style={{ fontSize: 11, fontWeight: 600, letterSpacing: '0.06em', textTransform: 'uppercase', color: 'var(--vio-text-muted)', marginBottom: 6 }}>Demo credentials</p>
            <p style={{ fontSize: 12, color: 'var(--vio-text-secondary)', fontFamily: 'ui-monospace,monospace' }}>wade@titanium.co.nz · engineer123</p>
          </div>
        </div>
      </div>
    </div>
  )
}

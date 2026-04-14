import { useState, useEffect } from 'react'
import { useNavigate, Navigate, Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { Eye, EyeOff } from 'lucide-react'

export default function Login() {
  const { user, login } = useAuth()
  const navigate = useNavigate()
  const [form, setForm] = useState({ company: '', password: '' })
  const [errors, setErrors] = useState({})
  const [showPass, setShowPass] = useState(false)
  const [loading, setLoading] = useState(false)
  const [ready, setReady] = useState(false)

  useEffect(() => { setTimeout(() => setReady(true), 40) }, [])

  if (user) return <Navigate to="/installations/new" replace />

  const set = (k, v) => {
    setForm(f => ({ ...f, [k]: v }))
    setErrors(e => ({ ...e, [k]: undefined, global: undefined }))
  }

  async function handleSubmit(e) {
    e.preventDefault()
    const errs = {}
    if (!form.company.trim()) errs.company = 'Company name is required'
    if (!form.password) errs.password = 'Password is required'
    if (Object.keys(errs).length) { setErrors(errs); return }
    setLoading(true)
    await new Promise(r => setTimeout(r, 500))
    const result = login(form.company, form.password)
    setLoading(false)
    if (!result.ok) { setErrors({ global: result.error }); return }
    navigate('/installations/new')
  }

  return (
    <div className="auth-page">
      <div className="auth-bg-glow auth-bg-glow--top" />
      <div className="auth-bg-glow auth-bg-glow--bottom" />

      <div className="auth-container" style={{
        opacity: ready ? 1 : 0,
        transform: ready ? 'none' : 'translateY(10px)',
      }}>
        <div className="auth-brand">
          <h1 className="auth-brand-name">VIOTEL</h1>
          <p className="auth-brand-sub">Field Engineer Platform</p>
        </div>

        <div className="auth-card">
          <h2 className="auth-heading">Sign in</h2>

          {errors.global && (
            <div className="auth-error-banner">{errors.global}</div>
          )}

          <form onSubmit={handleSubmit} className="auth-form">
            <div className="auth-field">
              <label className="auth-label">Company name</label>
              <input
                className={`auth-input${errors.company ? ' auth-input--error' : ''}`}
                type="text"
                placeholder="e.g. Titanium Services Group"
                value={form.company}
                onChange={e => set('company', e.target.value)}
                autoComplete="organization"
              />
              {errors.company && <p className="auth-field-error">{errors.company}</p>}
            </div>

            <div className="auth-field">
              <label className="auth-label">Password</label>
              <div className="auth-input-wrap">
                <input
                  className={`auth-input${errors.password ? ' auth-input--error' : ''}`}
                  type={showPass ? 'text' : 'password'}
                  placeholder="••••••••"
                  value={form.password}
                  onChange={e => set('password', e.target.value)}
                  autoComplete="current-password"
                  style={{ paddingRight: 48 }}
                />
                <button type="button" onClick={() => setShowPass(v => !v)} className="auth-eye-btn" aria-label="Toggle password visibility">
                  {showPass ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
              {errors.password && <p className="auth-field-error">{errors.password}</p>}
            </div>

            <button type="submit" className="auth-submit" disabled={loading}>
              {loading ? 'Signing in…' : 'Sign in'}
            </button>
          </form>

          <p className="auth-switch">
            Forgot your password?{' '}
            <Link to="/forgot-password" className="auth-switch-link">Reset it here</Link>
          </p>

          <div className="auth-demo">
            <p className="auth-demo-label">Demo credentials</p>
            <p className="auth-demo-value">Titanium Services Group · engineer123</p>
          </div>
        </div>
      </div>
    </div>
  )
}

import { useState, useEffect } from 'react'
import { useNavigate, Navigate, Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { useToast } from '../context/ToastContext'
import { Eye, EyeOff } from 'lucide-react'

export default function SignUp() {
  const { user, signup } = useAuth()
  const { push } = useToast()
  const navigate = useNavigate()
  const [form, setForm] = useState({ name: '', company: '', email: '', password: '', confirm: '' })
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
    if (!form.name.trim())    errs.name    = 'Full name is required'
    if (!form.company.trim()) errs.company = 'Company is required'
    if (!form.email.trim())   errs.email   = 'Email is required'
    if (!form.password)       errs.password = 'Password is required'
    else if (form.password.length < 8) errs.password = 'Minimum 8 characters'
    if (form.password !== form.confirm) errs.confirm = 'Passwords do not match'
    if (Object.keys(errs).length) { setErrors(errs); return }
    setLoading(true)
    await new Promise(r => setTimeout(r, 500))
    const result = signup({ name: form.name, company: form.company, email: form.email, password: form.password })
    setLoading(false)
    if (!result.ok) { setErrors({ global: result.error }); return }
    push('Account created. Please sign in.', 'success')
    navigate('/login')
  }

  const Field = ({ k, label, type = 'text', placeholder, autoComplete, extra }) => (
    <div>
      <label style={{ display: 'block', fontSize: 13, fontWeight: 500, color: 'var(--vio-text-secondary)', marginBottom: 6 }}>{label}</label>
      <div style={{ position: 'relative' }}>
        <input className={`vio-input${errors[k] ? ' invalid' : ''}`} type={k === 'password' || k === 'confirm' ? (showPass ? 'text' : 'password') : type}
          placeholder={placeholder} value={form[k]} onChange={e => set(k, e.target.value)} autoComplete={autoComplete}
          style={extra} />
        {(k === 'password' || k === 'confirm') && (
          <button type="button" onClick={() => setShowPass(v => !v)}
            style={{ position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: 'var(--vio-text-muted)', display: 'flex' }}>
            {showPass ? <EyeOff size={16} /> : <Eye size={16} />}
          </button>
        )}
      </div>
      {errors[k] && <p style={{ fontSize: 12, color: 'var(--vio-status-red)', marginTop: 4 }}>{errors[k]}</p>}
    </div>
  )

  return (
    <div style={{ minHeight: '100svh', background: 'var(--vio-page-bg)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24 }}>
      <div style={{ width: '100%', maxWidth: 420, opacity: ready ? 1 : 0, transform: ready ? 'none' : 'translateY(8px)', transition: 'opacity 0.2s, transform 0.2s' }}>
        <div style={{ textAlign: 'center', marginBottom: 32 }}>
          <svg width="44" height="44" viewBox="0 0 44 44" fill="none" style={{ margin: '0 auto 12px', display: 'block' }}>
            <rect width="44" height="44" rx="11" fill="#0b3d4a"/>
            <circle cx="22" cy="22" r="6" stroke="white" strokeWidth="2" fill="none"/>
            <path d="M22 8v4M22 32v4M8 22h4M32 22h4" stroke="white" strokeWidth="2" strokeLinecap="round"/>
          </svg>
          <div style={{ fontSize: 22, fontWeight: 800, color: 'var(--vio-primary)', letterSpacing: '-0.02em' }}>myViotel</div>
          <div style={{ fontSize: 13, color: 'var(--vio-text-muted)', marginTop: 4 }}>Create your engineer account</div>
        </div>

        <div className="vio-card">
          <h2 style={{ fontSize: 20, fontWeight: 700, color: 'var(--vio-text-primary)', marginBottom: 20 }}>Create account</h2>

          {errors.global && (
            <div style={{ padding: '10px 14px', borderRadius: 8, background: '#fef2f2', border: '0.5px solid #fecaca', color: '#b91c1c', fontSize: 13, marginBottom: 16 }}>
              {errors.global}
            </div>
          )}

          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
              <Field k="name"    label="Full name"    placeholder="Wade Hooper"              autoComplete="name" />
              <Field k="company" label="Company"      placeholder="Titanium Services Group"  autoComplete="organization" />
            </div>
            <Field k="email"    label="Email address" type="email" placeholder="you@company.com" autoComplete="email" />
            <Field k="password" label="Password"      placeholder="Min. 8 characters"        autoComplete="new-password" extra={{ paddingRight: 44 }} />
            <Field k="confirm"  label="Confirm password" placeholder="Repeat password"       autoComplete="new-password" extra={{ paddingRight: 44 }} />

            <button type="submit" className="vio-btn vio-btn-primary" style={{ width: '100%', marginTop: 4 }} disabled={loading}>
              {loading ? 'Creating account…' : 'Create account'}
            </button>
          </form>

          <p style={{ textAlign: 'center', marginTop: 20, fontSize: 13, color: 'var(--vio-text-muted)' }}>
            Already have an account?{' '}
            <Link to="/login" style={{ color: 'var(--vio-accent)', fontWeight: 500, textDecoration: 'none' }}>Sign in</Link>
          </p>
        </div>
      </div>
    </div>
  )
}

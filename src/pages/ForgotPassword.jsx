import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useToast } from '../context/ToastContext'

export default function ForgotPassword() {
  const { push } = useToast()
  const [form, setForm] = useState({ company: '', email: '' })
  const [errors, setErrors] = useState({})
  const [loading, setLoading] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [ready, setReady] = useState(false)

  useEffect(() => { setTimeout(() => setReady(true), 40) }, [])

  const set = (k, v) => {
    setForm(f => ({ ...f, [k]: v }))
    setErrors(e => ({ ...e, [k]: undefined, global: undefined }))
  }

  async function handleSubmit(e) {
    e.preventDefault()
    const errs = {}
    if (!form.company.trim()) errs.company = 'Company name is required'
    if (!form.email.trim()) errs.email = 'Email is required'
    else if (!/\S+@\S+\.\S+/.test(form.email)) errs.email = 'Enter a valid email'
    if (Object.keys(errs).length) { setErrors(errs); return }
    setLoading(true)
    await new Promise(r => setTimeout(r, 800))
    setLoading(false)
    setSubmitted(true)
    push('Password reset instructions sent to your email.', 'success')
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
          {submitted ? (
            <>
              <h2 className="auth-heading">Check your email</h2>
              <p style={{ fontSize: 14, color: '#6b7280', lineHeight: 1.6, marginBottom: 28 }}>
                We've sent password reset instructions to <span style={{ fontWeight: 600, color: '#111827' }}>{form.email}</span>.
                Please check your inbox and follow the link to reset your password.
              </p>
              <Link to="/login" className="auth-submit" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', textDecoration: 'none' }}>
                Back to Sign in
              </Link>
            </>
          ) : (
            <>
              <h2 className="auth-heading">Reset password</h2>
              <p style={{ fontSize: 14, color: '#9ca3af', marginBottom: 28, lineHeight: 1.5 }}>
                Enter your company name and the email associated with your account. We'll send you instructions to reset your password.
              </p>

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
                  <label className="auth-label">Company email</label>
                  <input
                    className={`auth-input${errors.email ? ' auth-input--error' : ''}`}
                    type="email"
                    placeholder="admin@company.com"
                    value={form.email}
                    onChange={e => set('email', e.target.value)}
                    autoComplete="email"
                  />
                  {errors.email && <p className="auth-field-error">{errors.email}</p>}
                </div>

                <button type="submit" className="auth-submit" disabled={loading}>
                  {loading ? 'Sending…' : 'Send reset instructions'}
                </button>
              </form>

              <p className="auth-switch">
                Remember your password?{' '}
                <Link to="/login" className="auth-switch-link">Sign in</Link>
              </p>
            </>
          )}
        </div>
      </div>
    </div>
  )
}

import { useState, useEffect } from 'react'
import { useNavigate, Navigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { useAlert } from '../context/AlertContext'
import { useTheme } from '../context/ThemeContext'

/* ── Logo mark ─────────────────────────────────────────────────────────────── */
function Logo({ size = 36 }) {
  return (
    <div
      className="rounded-xl flex items-center justify-center flex-shrink-0"
      style={{
        width: size, height: size,
        background: 'linear-gradient(135deg, #22d3ee 0%, #3b82f6 100%)',
        boxShadow: '0 4px 16px rgba(34,211,238,0.35)',
      }}
    >
      <svg width={size * 0.52} height={size * 0.52} viewBox="0 0 20 20" fill="none">
        <path d="M10 2L17 6V14L10 18L3 14V6L10 2Z" stroke="white" strokeWidth="1.6" strokeLinejoin="round"/>
        <circle cx="10" cy="10" r="2.8" fill="white"/>
      </svg>
    </div>
  )
}

/* ── Eye toggle icon ───────────────────────────────────────────────────────── */
function EyeIcon({ open }) {
  return open ? (
    <svg width="15" height="15" viewBox="0 0 15 15" fill="none">
      <path d="M1 7.5C1 7.5 3.5 3 7.5 3s6.5 4.5 6.5 4.5-2.5 4.5-6.5 4.5S1 7.5 1 7.5z" stroke="currentColor" strokeWidth="1.2"/>
      <circle cx="7.5" cy="7.5" r="1.8" stroke="currentColor" strokeWidth="1.2"/>
    </svg>
  ) : (
    <svg width="15" height="15" viewBox="0 0 15 15" fill="none">
      <path d="M13.5 2L2 13M5.5 5.7C3.8 6.5 2.5 7.5 2.5 7.5S5 12 7.5 12c1 0 2-.4 2.8-1M9.5 9.3c.7-.7 1.2-1.5 1.2-1.8 0 0-2.5-4.5-5-4.5-.4 0-.8.1-1.2.2" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round"/>
    </svg>
  )
}

/* ── Feature list item ─────────────────────────────────────────────────────── */
function Feature({ icon, title, desc, isDark }) {
  return (
    <div
      className="flex items-start gap-3.5 p-4 rounded-xl transition-colors"
      style={{
        background: isDark ? 'rgba(255,255,255,0.04)' : 'rgba(0,0,0,0.03)',
        border: isDark ? '1px solid rgba(255,255,255,0.07)' : '1px solid rgba(0,0,0,0.06)',
      }}
    >
      <div
        className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5"
        style={{ background: 'rgba(34,211,238,0.12)', color: '#22d3ee' }}
      >
        {icon}
      </div>
      <div>
        <p className="text-[13px] font-semibold leading-none mb-1"
          style={{ color: isDark ? 'rgba(255,255,255,0.9)' : '#0f172a' }}>
          {title}
        </p>
        <p className="text-[12px] leading-relaxed"
          style={{ color: isDark ? 'rgba(255,255,255,0.38)' : '#64748b' }}>
          {desc}
        </p>
      </div>
    </div>
  )
}

/* ── Stat chip ─────────────────────────────────────────────────────────────── */
function Stat({ value, label, isDark }) {
  return (
    <div className="flex flex-col gap-0.5">
      <p className="text-[22px] font-bold leading-none" style={{ color: '#22d3ee' }}>{value}</p>
      <p className="text-[11px]" style={{ color: isDark ? 'rgba(255,255,255,0.35)' : '#94a3b8' }}>{label}</p>
    </div>
  )
}

/* ── Main component ────────────────────────────────────────────────────────── */
export default function SignIn() {
  const { user, login } = useAuth()
  const { push } = useAlert()
  const { isDark, toggle } = useTheme()
  const navigate = useNavigate()

  const [form, setForm]         = useState({ email: '', password: '', remember: false })
  const [error, setError]       = useState('')
  const [loading, setLoading]   = useState(false)
  const [showPass, setShowPass] = useState(false)
  const [mounted, setMounted]   = useState(false)

  useEffect(() => { setTimeout(() => setMounted(true), 50) }, [])

  if (user) return <Navigate to="/dashboard" replace />

  function set(k, v) { setForm(f => ({ ...f, [k]: v })); setError('') }

  function fillDemo(email, password) {
    setForm(f => ({ ...f, email, password }))
    setError('')
  }

  async function handleSubmit(e) {
    e.preventDefault()
    if (!form.email || !form.password) { setError('Please fill in all fields.'); return }
    setLoading(true)
    await new Promise(r => setTimeout(r, 650))
    const result = login(form.email, form.password)
    setLoading(false)
    if (!result.ok) { setError(result.error); return }
    push('Welcome back! Signed in successfully.', 'success')
    navigate('/dashboard')
  }

  /* ── Theme-dependent values ── */
  const bg        = isDark ? '#060b14'                    : '#f0f4f8'
  const panelBg   = isDark ? '#0a1020'                    : '#e8edf5'
  const cardBg    = isDark ? 'rgba(13,17,27,0.95)'        : 'rgba(255,255,255,0.98)'
  const cardBorder= isDark ? 'rgba(255,255,255,0.08)'     : 'rgba(0,0,0,0.08)'
  const divider   = isDark ? 'rgba(255,255,255,0.07)'     : 'rgba(0,0,0,0.07)'
  const inputBg   = isDark ? 'rgba(255,255,255,0.05)'     : '#f8fafc'
  const inputBdr  = isDark ? 'rgba(255,255,255,0.1)'      : 'rgba(0,0,0,0.12)'
  const inputClr  = isDark ? '#e2e8f0'                    : '#0f172a'
  const labelClr  = isDark ? 'rgba(255,255,255,0.45)'     : '#64748b'
  const subClr    = isDark ? 'rgba(255,255,255,0.35)'     : '#94a3b8'
  const demoBg    = isDark ? 'rgba(255,255,255,0.05)'     : 'rgba(0,0,0,0.04)'
  const demoBdr   = isDark ? 'rgba(255,255,255,0.09)'     : 'rgba(0,0,0,0.08)'
  const demoClr   = isDark ? 'rgba(255,255,255,0.45)'     : '#64748b'
  const eyeClr    = isDark ? 'rgba(255,255,255,0.3)'      : '#94a3b8'
  const glowA     = isDark ? 'rgba(34,211,238,0.12)'      : 'rgba(8,145,178,0.08)'
  const glowB     = isDark ? 'rgba(99,102,241,0.1)'       : 'rgba(99,102,241,0.06)'
  const gridClr   = isDark ? 'rgba(255,255,255,0.025)'    : 'rgba(0,0,0,0.04)'
  const headClr   = isDark ? '#ffffff'                    : '#0f172a'
  const footerClr = isDark ? 'rgba(255,255,255,0.18)'     : '#94a3b8'

  return (
    <div className="min-h-screen flex relative overflow-hidden" style={{ background: bg }}>

      {/* ── Background layer ── */}
      <div className="absolute inset-0 pointer-events-none">
        {/* Dot grid */}
        <div className="absolute inset-0" style={{
          backgroundImage: `radial-gradient(circle, ${gridClr} 1px, transparent 1px)`,
          backgroundSize: '28px 28px',
        }} />
        {/* Ambient glows */}
        <div className="absolute -top-32 -left-32 w-[700px] h-[700px] rounded-full"
          style={{ background: `radial-gradient(circle, ${glowA}, transparent 65%)` }} />
        <div className="absolute -bottom-32 -right-32 w-[600px] h-[600px] rounded-full"
          style={{ background: `radial-gradient(circle, ${glowB}, transparent 65%)` }} />
      </div>

      {/* ── Left branding panel ── */}
      <div
        className="hidden lg:flex flex-col justify-between w-[480px] flex-shrink-0 relative px-12 py-14"
        style={{ background: panelBg, borderRight: `1px solid ${divider}` }}
      >
        {/* Brand */}
        <div>
          <div className="flex items-center gap-3 mb-14">
            <Logo size={40} />
            <div>
              <p className="font-bold text-[17px] leading-none tracking-tight" style={{ color: headClr }}>Viotel</p>
              <p className="text-[10px] tracking-[0.18em] uppercase mt-1 font-medium" style={{ color: subClr }}>
                Infrastructure Platform
              </p>
            </div>
          </div>

          <div className="mb-10">
            <h2 className="text-[34px] font-bold leading-[1.15] tracking-tight mb-4" style={{ color: headClr }}>
              Enterprise IoT<br />Asset Management
            </h2>
            <p className="text-[14px] leading-[1.7]" style={{ color: isDark ? 'rgba(255,255,255,0.42)' : '#64748b' }}>
              Manage sensor installations, monitor device health, and track field operations across your entire infrastructure network.
            </p>
          </div>

          {/* Stats row */}
          <div className="flex items-center gap-8 mb-10 pb-10" style={{ borderBottom: `1px solid ${divider}` }}>
            <Stat value="2,400+" label="Installations" isDark={isDark} />
            <Stat value="180+"   label="Active sites"  isDark={isDark} />
            <Stat value="99.7%"  label="Uptime"        isDark={isDark} />
          </div>

          {/* Features */}
          <div className="flex flex-col gap-2.5">
            <Feature isDark={isDark}
              icon={<svg width="14" height="14" viewBox="0 0 15 15" fill="none"><circle cx="7.5" cy="7.5" r="2.5" stroke="currentColor" strokeWidth="1.3"/><path d="M7.5 1.5V3M7.5 12V13.5M1.5 7.5H3M12 7.5H13.5" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round"/></svg>}
              title="Real-time monitoring"
              desc="Live sensor data across all sites and towers"
            />
            <Feature isDark={isDark}
              icon={<svg width="14" height="14" viewBox="0 0 15 15" fill="none"><rect x="2" y="1" width="11" height="13" rx="1.5" stroke="currentColor" strokeWidth="1.3"/><path d="M5 5H10M5 7.5H10M5 10H8" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round"/></svg>}
              title="Installation management"
              desc="Full audit trail for every field deployment"
            />
            <Feature isDark={isDark}
              icon={<svg width="14" height="14" viewBox="0 0 15 15" fill="none"><path d="M7.5 1L13 4.5V10.5L7.5 14L2 10.5V4.5L7.5 1Z" stroke="currentColor" strokeWidth="1.3" strokeLinejoin="round"/></svg>}
              title="Multi-site operations"
              desc="Grouped by region, operator, and tower type"
            />
          </div>
        </div>

        <p className="text-[11px]" style={{ color: footerClr }}>
          © 2025 Viotel Technologies. All rights reserved.
        </p>
      </div>

      {/* ── Right form panel ── */}
      <div className="flex-1 flex items-center justify-center px-6 py-12 relative">

        {/* Theme toggle — top right */}
        <button
          onClick={toggle}
          className="absolute top-6 right-6 w-9 h-9 rounded-xl flex items-center justify-center transition-all"
          style={{ background: cardBg, border: `1px solid ${cardBorder}`, color: subClr }}
          title={`Switch to ${isDark ? 'light' : 'dark'} mode`}
          onMouseEnter={e => e.currentTarget.style.color = headClr}
          onMouseLeave={e => e.currentTarget.style.color = subClr}
        >
          {isDark ? (
            <svg width="15" height="15" viewBox="0 0 15 15" fill="none">
              <circle cx="7.5" cy="7.5" r="2.5" stroke="currentColor" strokeWidth="1.3"/>
              <path d="M7.5 1V2.5M7.5 12.5V14M1 7.5H2.5M12.5 7.5H14M3 3L4 4M11 11L12 12M3 12L4 11M11 4L12 3" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round"/>
            </svg>
          ) : (
            <svg width="15" height="15" viewBox="0 0 15 15" fill="none">
              <path d="M13 9.5A6 6 0 015.5 2a6 6 0 100 11 6 6 0 007.5-3.5z" stroke="currentColor" strokeWidth="1.3" strokeLinejoin="round"/>
            </svg>
          )}
        </button>

        {/* Card */}
        <div
          className="w-full max-w-[420px]"
          style={{
            opacity: mounted ? 1 : 0,
            transform: mounted ? 'translateY(0)' : 'translateY(16px)',
            transition: 'opacity 0.4s ease, transform 0.4s ease',
          }}
        >
          {/* Mobile brand */}
          <div className="flex items-center gap-3 mb-10 lg:hidden">
            <Logo size={36} />
            <div>
              <p className="font-bold text-[16px] leading-none" style={{ color: headClr }}>Viotel</p>
              <p className="text-[10px] tracking-widest uppercase mt-0.5" style={{ color: subClr }}>Platform</p>
            </div>
          </div>

          {/* Card surface */}
          <div
            className="rounded-2xl p-8"
            style={{
              background: cardBg,
              border: `1px solid ${cardBorder}`,
              boxShadow: isDark
                ? '0 24px 64px rgba(0,0,0,0.5), 0 0 0 1px rgba(255,255,255,0.04)'
                : '0 24px 64px rgba(0,0,0,0.1), 0 4px 16px rgba(0,0,0,0.06)',
            }}
          >
            {/* Heading */}
            <div className="mb-7">
              <h1 className="text-[24px] font-bold tracking-tight leading-none mb-2" style={{ color: headClr }}>
                Sign in to Viotel
              </h1>
              <p className="text-[13px]" style={{ color: subClr }}>
                Access your infrastructure dashboard
              </p>
            </div>

            {/* Demo fill buttons */}
            <div className="flex gap-2 mb-6">
              {[
                { label: 'Admin demo',    email: 'admin@viotel.io',    pass: 'admin123' },
                { label: 'Engineer demo', email: 'engineer@viotel.io', pass: 'user123'  },
              ].map(d => (
                <button
                  key={d.label}
                  type="button"
                  onClick={() => fillDemo(d.email, d.pass)}
                  className="flex-1 text-[12px] py-2.5 px-3 rounded-lg font-medium transition-all"
                  style={{ background: demoBg, border: `1px solid ${demoBdr}`, color: demoClr }}
                  onMouseEnter={e => {
                    e.currentTarget.style.borderColor = 'rgba(34,211,238,0.35)'
                    e.currentTarget.style.color = isDark ? 'rgba(255,255,255,0.75)' : '#334155'
                  }}
                  onMouseLeave={e => {
                    e.currentTarget.style.borderColor = demoBdr
                    e.currentTarget.style.color = demoClr
                  }}
                >
                  {d.label}
                </button>
              ))}
            </div>

            {/* Divider */}
            <div className="flex items-center gap-3 mb-6">
              <div className="flex-1 h-px" style={{ background: divider }} />
              <span className="text-[11px] font-medium" style={{ color: isDark ? 'rgba(255,255,255,0.2)' : '#cbd5e1' }}>
                or enter credentials
              </span>
              <div className="flex-1 h-px" style={{ background: divider }} />
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="flex flex-col gap-4">

              {/* Email */}
              <div className="flex flex-col gap-1.5">
                <label className="text-[12px] font-semibold" style={{ color: labelClr }}>
                  Email address
                </label>
                <input
                  type="email"
                  value={form.email}
                  onChange={e => set('email', e.target.value)}
                  autoComplete="email"
                  placeholder="you@company.com"
                  className="w-full rounded-xl px-4 py-3 text-[14px] outline-none transition-all"
                  style={{ background: inputBg, border: `1px solid ${inputBdr}`, color: inputClr, caretColor: '#22d3ee' }}
                  onFocus={e => e.target.style.borderColor = 'rgba(34,211,238,0.5)'}
                  onBlur={e => e.target.style.borderColor = inputBdr}
                />
              </div>

              {/* Password */}
              <div className="flex flex-col gap-1.5">
                <div className="flex items-center justify-between">
                  <label className="text-[12px] font-semibold" style={{ color: labelClr }}>Password</label>
                  <button
                    type="button"
                    className="text-[11px] font-medium transition-colors"
                    style={{ color: '#22d3ee' }}
                    onMouseEnter={e => e.currentTarget.style.opacity = '0.75'}
                    onMouseLeave={e => e.currentTarget.style.opacity = '1'}
                  >
                    Forgot password?
                  </button>
                </div>
                <div className="relative">
                  <input
                    type={showPass ? 'text' : 'password'}
                    value={form.password}
                    onChange={e => set('password', e.target.value)}
                    autoComplete="current-password"
                    placeholder="••••••••"
                    className="w-full rounded-xl px-4 py-3 pr-11 text-[14px] outline-none transition-all"
                    style={{ background: inputBg, border: `1px solid ${inputBdr}`, color: inputClr, caretColor: '#22d3ee' }}
                    onFocus={e => e.target.style.borderColor = 'rgba(34,211,238,0.5)'}
                    onBlur={e => e.target.style.borderColor = inputBdr}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPass(v => !v)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 transition-colors"
                    style={{ color: eyeClr }}
                    onMouseEnter={e => e.currentTarget.style.color = isDark ? 'rgba(255,255,255,0.6)' : '#64748b'}
                    onMouseLeave={e => e.currentTarget.style.color = eyeClr}
                  >
                    <EyeIcon open={showPass} />
                  </button>
                </div>
              </div>

              {/* Remember me */}
              <label className="flex items-center gap-2.5 cursor-pointer select-none">
                <div
                  className="w-4 h-4 rounded flex items-center justify-center flex-shrink-0 transition-all"
                  style={{
                    background: form.remember ? '#22d3ee' : 'transparent',
                    border: form.remember ? '1px solid #22d3ee' : `1px solid ${inputBdr}`,
                  }}
                  onClick={() => set('remember', !form.remember)}
                >
                  {form.remember && (
                    <svg width="9" height="9" viewBox="0 0 9 9" fill="none">
                      <path d="M1.5 4.5L3.5 6.5L7.5 2.5" stroke="#020617" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  )}
                </div>
                <span className="text-[12px]" style={{ color: labelClr }}>Remember me for 30 days</span>
              </label>

              {/* Error */}
              {error && (
                <div
                  className="flex items-center gap-2.5 text-[12px] rounded-xl px-4 py-3"
                  style={{ background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.2)', color: '#f87171' }}
                >
                  <svg width="13" height="13" viewBox="0 0 15 15" fill="none" className="flex-shrink-0">
                    <circle cx="7.5" cy="7.5" r="6" stroke="currentColor" strokeWidth="1.3"/>
                    <path d="M7.5 4.5V8M7.5 10.5V11" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
                  </svg>
                  {error}
                </div>
              )}

              {/* Submit */}
              <button
                type="submit"
                disabled={loading}
                className="w-full py-3.5 rounded-xl font-semibold text-[14px] transition-all active:scale-[0.98] disabled:opacity-40 mt-1"
                style={{
                  background: 'linear-gradient(135deg, #22d3ee 0%, #0891b2 100%)',
                  color: '#020617',
                  boxShadow: '0 6px 20px rgba(34,211,238,0.3)',
                }}
                onMouseEnter={e => !loading && (e.currentTarget.style.boxShadow = '0 8px 28px rgba(34,211,238,0.45)')}
                onMouseLeave={e => e.currentTarget.style.boxShadow = '0 6px 20px rgba(34,211,238,0.3)'}
              >
                {loading ? (
                  <span className="flex items-center justify-center gap-2.5">
                    <span
                      className="w-4 h-4 rounded-full border-2 animate-spin"
                      style={{ borderColor: 'rgba(2,6,23,0.25)', borderTopColor: '#020617' }}
                    />
                    Authenticating…
                  </span>
                ) : (
                  <span className="flex items-center justify-center gap-2">
                    Sign In
                    <svg width="14" height="14" viewBox="0 0 15 15" fill="none">
                      <path d="M3 7.5H12M8.5 4L12 7.5L8.5 11" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </span>
                )}
              </button>
            </form>
          </div>

          {/* Credential hints below card */}
          <div className="mt-5 grid grid-cols-2 gap-2.5">
            {[
              { role: 'Admin',    email: 'admin@viotel.io',    pass: 'admin123', accent: '#a78bfa', accentBg: 'rgba(167,139,250,0.08)', accentBdr: 'rgba(167,139,250,0.18)' },
              { role: 'Engineer', email: 'engineer@viotel.io', pass: 'user123',  accent: '#60a5fa', accentBg: 'rgba(96,165,250,0.08)',  accentBdr: 'rgba(96,165,250,0.18)'  },
            ].map(r => (
              <button
                key={r.role}
                type="button"
                onClick={() => fillDemo(r.email, r.pass)}
                className="rounded-xl p-3.5 text-left transition-all"
                style={{ background: r.accentBg, border: `1px solid ${r.accentBdr}` }}
                onMouseEnter={e => e.currentTarget.style.borderColor = r.accent + '50'}
                onMouseLeave={e => e.currentTarget.style.borderColor = r.accentBdr}
              >
                <div className="flex items-center gap-1.5 mb-1">
                  <span className="w-1.5 h-1.5 rounded-full" style={{ background: r.accent }} />
                  <p className="text-[11px] font-semibold" style={{ color: r.accent }}>{r.role}</p>
                </div>
                <p className="text-[10px] font-mono" style={{ color: subClr }}>{r.email}</p>
                <p className="text-[10px] font-mono" style={{ color: isDark ? 'rgba(255,255,255,0.2)' : '#cbd5e1' }}>
                  {r.pass}
                </p>
              </button>
            ))}
          </div>

          <p className="text-center text-[11px] mt-5" style={{ color: isDark ? 'rgba(255,255,255,0.18)' : '#cbd5e1' }}>
            © 2025 Viotel Technologies · Enterprise IoT Platform
          </p>
        </div>
      </div>
    </div>
  )
}

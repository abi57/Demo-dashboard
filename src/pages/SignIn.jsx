import { useState, useEffect } from 'react'
import { useNavigate, Navigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { useAlert } from '../context/AlertContext'
import { useTheme } from '../context/ThemeContext'
import { BrandLockup, LogoMark, BRAND } from '../components/Brand'

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
      className="flex items-start gap-3 p-3.5 rounded-xl"
      style={{
        background: isDark ? 'rgba(255,255,255,0.035)' : 'rgba(0,0,0,0.025)',
        border: isDark ? '1px solid rgba(255,255,255,0.065)' : '1px solid rgba(0,0,0,0.055)',
      }}
    >
      <div
        className="w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5"
        style={{ background: 'rgba(0,188,212,0.12)', color: '#00bcd4' }}
      >
        {icon}
      </div>
      <div>
        <p style={{ fontSize: 12.5, fontWeight: 600, color: isDark ? 'rgba(255,255,255,0.88)' : '#0c1420', lineHeight: 1, marginBottom: 3 }}>
          {title}
        </p>
        <p style={{ fontSize: 11.5, color: isDark ? 'rgba(255,255,255,0.36)' : '#6b7a8d', lineHeight: 1.5 }}>
          {desc}
        </p>
      </div>
    </div>
  )
}

/* ── Stat chip ─────────────────────────────────────────────────────────────── */
function Stat({ value, label, isDark }) {
  return (
    <div>
      <p style={{ fontSize: 22, fontWeight: 800, lineHeight: 1, letterSpacing: '-0.03em', color: '#00bcd4' }}>{value}</p>
      <p style={{ fontSize: 11, marginTop: 3, color: isDark ? 'rgba(255,255,255,0.32)' : '#9aaabb' }}>{label}</p>
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
  const bg        = isDark ? '#07090f'                    : '#eef2f7'
  const panelBg   = isDark ? '#0a0e18'                    : '#e6ecf4'
  const cardBg    = isDark ? 'rgba(12,16,24,0.97)'        : 'rgba(255,255,255,0.99)'
  const cardBorder= isDark ? 'rgba(255,255,255,0.08)'     : 'rgba(0,0,0,0.08)'
  const divider   = isDark ? 'rgba(255,255,255,0.07)'     : 'rgba(0,0,0,0.07)'
  const inputBg   = isDark ? 'rgba(255,255,255,0.04)'     : '#f5f8fc'
  const inputBdr  = isDark ? 'rgba(255,255,255,0.09)'     : 'rgba(0,0,0,0.1)'
  const inputClr  = isDark ? '#f0f4f8'                    : '#0d1520'
  const labelClr  = isDark ? 'rgba(255,255,255,0.42)'     : '#6b7a8d'
  const subClr    = isDark ? 'rgba(255,255,255,0.3)'      : '#9aaabb'
  const demoBg    = isDark ? 'rgba(255,255,255,0.04)'     : 'rgba(0,0,0,0.03)'
  const demoBdr   = isDark ? 'rgba(255,255,255,0.08)'     : 'rgba(0,0,0,0.07)'
  const demoClr   = isDark ? 'rgba(255,255,255,0.4)'      : '#6b7a8d'
  const eyeClr    = isDark ? 'rgba(255,255,255,0.25)'     : '#9aaabb'
  const glowA     = isDark ? 'rgba(0,200,224,0.1)'        : 'rgba(2,132,199,0.07)'
  const glowB     = isDark ? 'rgba(99,102,241,0.08)'      : 'rgba(99,102,241,0.05)'
  const gridClr   = isDark ? 'rgba(255,255,255,0.022)'    : 'rgba(0,0,0,0.035)'
  const headClr   = isDark ? '#f0f4f8'                    : '#0d1520'
  const footerClr = isDark ? 'rgba(255,255,255,0.16)'     : '#9aaabb'

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
          <div className="mb-12">
            <BrandLockup size="lg" showTagline theme={isDark ? 'dark' : 'light'} />
          </div>

          <div className="mb-9">
            <h2
              className="font-bold leading-[1.15] mb-4"
              style={{ fontSize: 32, letterSpacing: '-0.03em', color: headClr }}
            >
              Real-Time Monitoring<br />for Critical Infrastructure
            </h2>
            <p style={{ fontSize: 14, lineHeight: 1.7, color: isDark ? 'rgba(255,255,255,0.4)' : '#6b7a8d' }}>
              Manage sensor installations, monitor device health, and track field operations across your entire infrastructure network.
            </p>
          </div>

          {/* Stats row */}
          <div className="flex items-center gap-8 mb-9 pb-9" style={{ borderBottom: `1px solid ${divider}` }}>
            <Stat value="2,400+" label="Installations" isDark={isDark} />
            <Stat value="180+"   label="Active sites"  isDark={isDark} />
            <Stat value="99.7%"  label="Uptime SLA"    isDark={isDark} />
          </div>

          {/* Features */}
          <div className="flex flex-col gap-2">
            <Feature isDark={isDark}
              icon={<svg width="13" height="13" viewBox="0 0 15 15" fill="none"><circle cx="7.5" cy="7.5" r="2.5" stroke="currentColor" strokeWidth="1.3"/><path d="M7.5 1.5V3M7.5 12V13.5M1.5 7.5H3M12 7.5H13.5" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round"/></svg>}
              title="Real-time asset monitoring"
              desc="Live sensor data streamed from every site and tower"
            />
            <Feature isDark={isDark}
              icon={<svg width="13" height="13" viewBox="0 0 15 15" fill="none"><rect x="2" y="1" width="11" height="13" rx="1.5" stroke="currentColor" strokeWidth="1.3"/><path d="M5 5H10M5 7.5H10M5 10H8" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round"/></svg>}
              title="Full installation audit trail"
              desc="Every field deployment logged, verified, and searchable"
            />
            <Feature isDark={isDark}
              icon={<svg width="13" height="13" viewBox="0 0 15 15" fill="none"><path d="M2 12L5 8L7.5 10L10 6L13 9" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round"/><rect x="1" y="1" width="13" height="13" rx="1.5" stroke="currentColor" strokeWidth="1.3"/></svg>}
              title="Smarter data, faster decisions"
              desc="Trend analysis and alerts across your entire asset base"
            />
          </div>
        </div>

        <p style={{ fontSize: 11, color: footerClr }}>
          © {BRAND.year} {BRAND.name} Technologies. All rights reserved.
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
          <div className="mb-10 lg:hidden">
            <BrandLockup size="md" theme={isDark ? 'dark' : 'light'} />
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
              <h1
                className="font-bold leading-none mb-2"
                style={{ fontSize: 22, letterSpacing: '-0.025em', color: headClr }}
              >
                Sign in to {BRAND.name}
              </h1>
              <p style={{ fontSize: 13, color: subClr }}>
                {BRAND.tagline}
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
                  style={{ background: inputBg, border: `1px solid ${inputBdr}`, color: inputClr, caretColor: '#00c8e0' }}
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
                    style={{ color: '#00c8e0' }}
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
                    style={{ background: inputBg, border: `1px solid ${inputBdr}`, color: inputClr, caretColor: '#00c8e0' }}
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
                    background: form.remember ? '#00c8e0' : 'transparent',
                    border: form.remember ? '1px solid #00c8e0' : `1px solid ${inputBdr}`,
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
                  background: 'linear-gradient(135deg, #00c8e0 0%, #0284c7 100%)',
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

          <p className="text-center mt-5" style={{ fontSize: 11, color: isDark ? 'rgba(255,255,255,0.16)' : '#c5d0dc' }}>
            © {BRAND.year} {BRAND.name} Technologies · {BRAND.tagline}
          </p>
        </div>
      </div>
    </div>
  )
}

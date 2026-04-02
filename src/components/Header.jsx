import { useState, useRef, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { useAlert } from '../context/AlertContext'
import { useTheme } from '../context/ThemeContext'

function NotificationBell() {
  const [open, setOpen] = useState(false)
  const ref = useRef()

  const items = [
    { id: 1, type: 'warning', msg: 'INS-004: Secure fixing not confirmed', sub: 'Kano South Grid', time: '5m ago' },
    { id: 2, type: 'info',    msg: 'INS-002: Data flow pending verification', sub: 'Accra North', time: '12m ago' },
    { id: 3, type: 'success', msg: 'INS-003: All systems nominal', sub: 'Nairobi Belt Tower', time: '1h ago' },
  ]

  const typeStyle = {
    warning: { color: 'var(--warning)' },
    info:    { color: 'var(--accent)'  },
    success: { color: 'var(--success)' },
  }

  useEffect(() => {
    const h = e => { if (ref.current && !ref.current.contains(e.target)) setOpen(false) }
    document.addEventListener('mousedown', h)
    return () => document.removeEventListener('mousedown', h)
  }, [])

  return (
    <div className="relative" ref={ref}>
      <button
        onClick={() => setOpen(v => !v)}
        className="relative flex items-center justify-center rounded-lg transition-all"
        style={{ width: 32, height: 32, background: 'var(--bg-elevated)', border: '1px solid var(--border)', color: 'var(--text-muted)' }}
        onMouseEnter={e => { e.currentTarget.style.borderColor = 'var(--border-strong)'; e.currentTarget.style.color = 'var(--text-primary)' }}
        onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--border)'; e.currentTarget.style.color = 'var(--text-muted)' }}
      >
        <svg width="14" height="14" viewBox="0 0 15 15" fill="none">
          <path d="M7.5 1.5C5 1.5 3 3.5 3 6v3L1.5 11h12L12 9V6c0-2.5-2-4.5-4.5-4.5z" stroke="currentColor" strokeWidth="1.2" strokeLinejoin="round"/>
          <path d="M6 11.5a1.5 1.5 0 003 0" stroke="currentColor" strokeWidth="1.2"/>
        </svg>
        <span
          className="absolute rounded-full border-2"
          style={{ top: 5, right: 5, width: 7, height: 7, background: 'var(--danger)', borderColor: 'var(--bg-surface)' }}
        />
      </button>

      {open && (
        <div
          className="absolute right-0 rounded-xl overflow-hidden z-50 animate-fade-up"
          style={{ top: 40, width: 296, background: 'var(--bg-surface)', border: '1px solid var(--border)', boxShadow: 'var(--shadow-lg)' }}
        >
          <div className="flex items-center justify-between px-4 py-3" style={{ borderBottom: '1px solid var(--border)' }}>
            <p style={{ fontSize: 'var(--t-h4)', fontWeight: 'var(--fw-semibold)', color: 'var(--text-primary)' }}>System Alerts</p>
            <span
              className="font-semibold rounded-md px-2 py-0.5"
              style={{ fontSize: 'var(--t-micro)', color: 'var(--danger)', background: 'var(--danger-bg)', border: '1px solid var(--danger-border)' }}
            >
              {items.length} active
            </span>
          </div>
          {items.map(n => (
            <div
              key={n.id}
              className="flex items-start gap-3 px-4 py-3 cursor-pointer transition-all"
              style={{ borderBottom: '1px solid var(--border-soft)' }}
              onMouseEnter={e => e.currentTarget.style.background = 'var(--bg-hover)'}
              onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
            >
              <span
                className="rounded-full flex-shrink-0 mt-[5px]"
                style={{ width: 6, height: 6, background: typeStyle[n.type].color }}
              />
              <div className="flex-1 min-w-0">
                <p style={{ fontSize: 'var(--t-body-sm)', fontWeight: 'var(--fw-medium)', color: 'var(--text-secondary)', lineHeight: 1.5 }}>{n.msg}</p>
                <p style={{ fontSize: 'var(--t-caption)', marginTop: 3, color: 'var(--text-faint)' }}>{n.sub} · {n.time}</p>
              </div>
            </div>
          ))}
          <div className="px-4 py-2.5 text-center">
            <button style={{ fontSize: 'var(--t-caption)', fontWeight: 'var(--fw-medium)', color: 'var(--accent)' }}>
              View all alerts →
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

function UserMenu() {
  const { user, logout } = useAuth()
  const { push } = useAlert()
  const navigate = useNavigate()
  const [open, setOpen] = useState(false)
  const ref = useRef()

  useEffect(() => {
    const h = e => { if (ref.current && !ref.current.contains(e.target)) setOpen(false) }
    document.addEventListener('mousedown', h)
    return () => document.removeEventListener('mousedown', h)
  }, [])

  function handleLogout() {
    logout(); push('Signed out successfully', 'info'); navigate('/login')
  }

  return (
    <div className="relative" ref={ref}>
      <button
        onClick={() => setOpen(v => !v)}
        className="flex items-center gap-2 rounded-lg transition-all"
        style={{ paddingLeft: 8, paddingRight: 10, height: 32, background: 'var(--bg-elevated)', border: '1px solid var(--border)' }}
        onMouseEnter={e => e.currentTarget.style.borderColor = 'var(--border-strong)'}
        onMouseLeave={e => e.currentTarget.style.borderColor = 'var(--border)'}
      >
        <div
          className="rounded-full flex items-center justify-center font-bold text-white flex-shrink-0"
          style={{ width: 20, height: 20, fontSize: 9, background: 'linear-gradient(135deg, #7c3aed, #2563eb)' }}
        >
          {user?.name?.[0]?.toUpperCase()}
        </div>
        <span className="hidden sm:block font-medium" style={{ fontSize: 'var(--t-nav)', color: 'var(--text-secondary)' }}>
          {user?.name?.split(' ')[0]}
        </span>
        <svg width="9" height="9" viewBox="0 0 9 9" fill="none" style={{ color: 'var(--text-faint)' }}>
          <path d="M1.5 3L4.5 6L7.5 3" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round"/>
        </svg>
      </button>

      {open && (
        <div
          className="absolute right-0 rounded-xl overflow-hidden z-50 animate-fade-up"
          style={{ top: 40, width: 204, background: 'var(--bg-surface)', border: '1px solid var(--border)', boxShadow: 'var(--shadow-lg)' }}
        >
          <div className="px-4 py-3.5" style={{ borderBottom: '1px solid var(--border)' }}>
            <p style={{ fontSize: 'var(--t-h4)', fontWeight: 'var(--fw-semibold)', color: 'var(--text-primary)' }}>{user?.name}</p>
            <p className="truncate mt-0.5" style={{ fontSize: 'var(--t-caption)', color: 'var(--text-faint)' }}>{user?.email}</p>
            <span
              className="inline-block mt-2 rounded-md capitalize font-semibold px-2 py-0.5"
              style={user?.role === 'admin'
                ? { fontSize: 'var(--t-micro)', color: '#a78bfa', background: 'rgba(167,139,250,0.1)', border: '1px solid rgba(167,139,250,0.2)' }
                : { fontSize: 'var(--t-micro)', color: '#60a5fa', background: 'rgba(96,165,250,0.1)',  border: '1px solid rgba(96,165,250,0.2)'  }
              }
            >
              {user?.role}
            </span>
          </div>
          {[
            { label: 'Settings', action: () => { navigate('/settings'); setOpen(false) } },
            { label: 'Sign out', action: handleLogout, danger: true },
          ].map(item => (
            <button
              key={item.label}
              onClick={item.action}
              className="w-full text-left px-4 py-2.5 font-medium transition-all"
              style={{ fontSize: 'var(--t-body-sm)', color: item.danger ? 'var(--danger)' : 'var(--text-secondary)', borderBottom: '1px solid var(--border-soft)' }}
              onMouseEnter={e => e.currentTarget.style.background = 'var(--bg-hover)'}
              onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
            >
              {item.label}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}

function ThemeToggle() {
  const { isDark, toggle } = useTheme()
  return (
    <button
      onClick={toggle}
      title={`Switch to ${isDark ? 'light' : 'dark'} mode`}
      className="flex items-center justify-center rounded-lg transition-all"
      style={{ width: 32, height: 32, background: 'var(--bg-elevated)', border: '1px solid var(--border)', color: 'var(--text-muted)' }}
      onMouseEnter={e => { e.currentTarget.style.borderColor = 'var(--border-strong)'; e.currentTarget.style.color = 'var(--text-primary)' }}
      onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--border)'; e.currentTarget.style.color = 'var(--text-muted)' }}
    >
      {isDark ? (
        <svg width="13" height="13" viewBox="0 0 15 15" fill="none">
          <circle cx="7.5" cy="7.5" r="2.5" stroke="currentColor" strokeWidth="1.2"/>
          <path d="M7.5 1V2.5M7.5 12.5V14M1 7.5H2.5M12.5 7.5H14M3 3L4 4M11 11L12 12M3 12L4 11M11 4L12 3" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round"/>
        </svg>
      ) : (
        <svg width="13" height="13" viewBox="0 0 15 15" fill="none">
          <path d="M13 9.5A6 6 0 015.5 2a6 6 0 100 11 6 6 0 007.5-3.5z" stroke="currentColor" strokeWidth="1.2" strokeLinejoin="round"/>
        </svg>
      )}
    </button>
  )
}

export default function Header({ title, subtitle, action }) {
  const [search, setSearch] = useState('')

  return (
    <header
      className="flex items-center justify-between sticky top-0 z-30 flex-shrink-0"
      style={{
        height: 64,
        paddingLeft: 28,
        paddingRight: 24,
        background: 'color-mix(in srgb, var(--bg-surface) 92%, transparent)',
        backdropFilter: 'blur(20px)',
        WebkitBackdropFilter: 'blur(20px)',
        borderBottom: '1px solid var(--border)',
      }}
    >
      {/* Left */}
      <div className="flex items-center gap-5 min-w-0">
        <div className="min-w-0">
          <h1
            className="truncate leading-none"
            style={{ fontSize: 'var(--t-h3)', fontWeight: 'var(--fw-semibold)', letterSpacing: 'var(--ls-tight)', color: 'var(--text-primary)' }}
          >
            {title}
          </h1>
          {subtitle && (
            <p className="truncate leading-none mt-[5px]" style={{ fontSize: 'var(--t-caption)', color: 'var(--text-faint)' }}>
              {subtitle}
            </p>
          )}
        </div>
        {action && <div className="flex items-center gap-2 flex-shrink-0">{action}</div>}
      </div>

      {/* Right */}
      <div className="flex items-center gap-2 flex-shrink-0">
        <div className="relative hidden md:flex items-center">
          <svg
            className="absolute pointer-events-none"
            style={{ left: 10, color: 'var(--text-faint)' }}
            width="12" height="12" viewBox="0 0 15 15" fill="none"
          >
            <circle cx="6.5" cy="6.5" r="5" stroke="currentColor" strokeWidth="1.2"/>
            <path d="M10.5 10.5L13.5 13.5" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round"/>
          </svg>
          <input
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search…"
            className="rounded-lg outline-none"
            style={{
              paddingLeft: 30, paddingRight: 12, height: 32,
              fontSize: 'var(--t-body-sm)', width: 140,
              background: 'var(--bg-elevated)',
              border: '1px solid var(--border)',
              color: 'var(--text-secondary)',
            }}
            onFocus={e => { e.target.style.borderColor = 'var(--accent-border)'; e.target.style.width = '192px' }}
            onBlur={e => { e.target.style.borderColor = 'var(--border)'; e.target.style.width = '140px' }}
          />
        </div>

        <div className="w-px h-4 mx-1" style={{ background: 'var(--border)' }} />
        <ThemeToggle />
        <NotificationBell />
        <UserMenu />
      </div>
    </header>
  )
}

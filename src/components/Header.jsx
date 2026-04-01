import { useState, useRef, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { useAlert } from '../context/AlertContext'
import { useTheme } from '../context/ThemeContext'

function ThemeToggle() {
  const { isDark, toggle } = useTheme()
  return (
    <button
      onClick={toggle}
      title={`Switch to ${isDark ? 'light' : 'dark'} mode`}
      className="w-8 h-8 rounded-lg flex items-center justify-center transition-all"
      style={{
        background: 'var(--bg-elevated)',
        border: '1px solid var(--border)',
        color: 'var(--text-muted)',
      }}
      onMouseEnter={e => e.currentTarget.style.color = 'var(--text-primary)'}
      onMouseLeave={e => e.currentTarget.style.color = 'var(--text-muted)'}
    >
      {isDark ? (
        <svg width="14" height="14" viewBox="0 0 15 15" fill="none">
          <circle cx="7.5" cy="7.5" r="2.5" stroke="currentColor" strokeWidth="1.3"/>
          <path d="M7.5 1V2.5M7.5 12.5V14M1 7.5H2.5M12.5 7.5H14M3 3L4 4M11 11L12 12M3 12L4 11M11 4L12 3" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round"/>
        </svg>
      ) : (
        <svg width="14" height="14" viewBox="0 0 15 15" fill="none">
          <path d="M13 9.5A6 6 0 015.5 2a6 6 0 100 11 6 6 0 007.5-3.5z" stroke="currentColor" strokeWidth="1.3" strokeLinejoin="round"/>
        </svg>
      )}
    </button>
  )
}

function NotificationBell() {
  const [open, setOpen] = useState(false)
  const ref = useRef()

  const notifications = [
    { id: 1, type: 'warning', msg: 'INS-004: Secure fixing not confirmed', time: '5m ago' },
    { id: 2, type: 'info',    msg: 'INS-002: Data flow pending verification', time: '12m ago' },
    { id: 3, type: 'success', msg: 'INS-003: All systems nominal', time: '1h ago' },
  ]

  useEffect(() => {
    function handler(e) { if (ref.current && !ref.current.contains(e.target)) setOpen(false) }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

  const typeColor = { warning: '#f59e0b', info: '#60a5fa', success: '#34d399' }

  return (
    <div className="relative" ref={ref}>
      <button
        onClick={() => setOpen(v => !v)}
        className="w-8 h-8 rounded-lg flex items-center justify-center transition-all relative"
        style={{
          background: 'var(--bg-elevated)',
          border: '1px solid var(--border)',
          color: 'var(--text-muted)',
        }}
        onMouseEnter={e => e.currentTarget.style.color = 'var(--text-primary)'}
        onMouseLeave={e => e.currentTarget.style.color = 'var(--text-muted)'}
      >
        <svg width="14" height="14" viewBox="0 0 15 15" fill="none">
          <path d="M7.5 1.5C5 1.5 3 3.5 3 6v3L1.5 11h12L12 9V6c0-2.5-2-4.5-4.5-4.5z" stroke="currentColor" strokeWidth="1.3" strokeLinejoin="round"/>
          <path d="M6 11.5a1.5 1.5 0 003 0" stroke="currentColor" strokeWidth="1.3"/>
        </svg>
        <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-red-500 border border-[var(--bg-surface)]" />
      </button>

      {open && (
        <div
          className="absolute right-0 top-10 w-72 rounded-2xl shadow-2xl z-50 overflow-hidden animate-fade-up"
          style={{ background: 'var(--bg-surface)', border: '1px solid var(--border)' }}
        >
          <div className="px-4 py-3 flex items-center justify-between" style={{ borderBottom: '1px solid var(--border)' }}>
            <p className="text-[13px] font-semibold" style={{ color: 'var(--text-primary)' }}>Notifications</p>
            <span className="text-[10px] px-1.5 py-0.5 rounded-md bg-red-500/10 text-red-400 border border-red-500/20 font-medium">
              {notifications.length} new
            </span>
          </div>
          <div className="flex flex-col">
            {notifications.map(n => (
              <div key={n.id} className="px-4 py-3 flex items-start gap-3 transition-colors cursor-pointer"
                style={{ borderBottom: '1px solid var(--border-soft)' }}
                onMouseEnter={e => e.currentTarget.style.background = 'var(--bg-hover)'}
                onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
              >
                <span className="w-1.5 h-1.5 rounded-full mt-1.5 flex-shrink-0" style={{ background: typeColor[n.type] }} />
                <div className="flex-1 min-w-0">
                  <p className="text-[12px] leading-relaxed" style={{ color: 'var(--text-secondary)' }}>{n.msg}</p>
                  <p className="text-[10px] mt-0.5" style={{ color: 'var(--text-faint)' }}>{n.time}</p>
                </div>
              </div>
            ))}
          </div>
          <div className="px-4 py-2.5">
            <button className="text-[11px] w-full text-center transition-colors" style={{ color: 'var(--accent)' }}>
              View all notifications
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
    function handler(e) { if (ref.current && !ref.current.contains(e.target)) setOpen(false) }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

  function handleLogout() {
    logout(); push('Signed out successfully', 'info'); navigate('/login')
  }

  return (
    <div className="relative" ref={ref}>
      <button
        onClick={() => setOpen(v => !v)}
        className="flex items-center gap-2 px-2.5 py-1.5 rounded-lg transition-all"
        style={{ background: 'var(--bg-elevated)', border: '1px solid var(--border)' }}
      >
        <div className="w-6 h-6 rounded-full flex items-center justify-center text-[11px] font-bold text-white flex-shrink-0"
          style={{ background: 'linear-gradient(135deg, #8b5cf6, #3b82f6)' }}>
          {user?.name?.[0]?.toUpperCase()}
        </div>
        <span className="text-[12px] font-medium hidden sm:block" style={{ color: 'var(--text-secondary)' }}>
          {user?.name}
        </span>
        <svg width="10" height="10" viewBox="0 0 10 10" fill="none" style={{ color: 'var(--text-faint)' }}>
          <path d="M2 3.5L5 6.5L8 3.5" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round"/>
        </svg>
      </button>

      {open && (
        <div
          className="absolute right-0 top-10 w-52 rounded-2xl shadow-2xl z-50 overflow-hidden animate-fade-up"
          style={{ background: 'var(--bg-surface)', border: '1px solid var(--border)' }}
        >
          <div className="px-4 py-3" style={{ borderBottom: '1px solid var(--border)' }}>
            <p className="text-[13px] font-semibold" style={{ color: 'var(--text-primary)' }}>{user?.name}</p>
            <p className="text-[11px] mt-0.5" style={{ color: 'var(--text-faint)' }}>{user?.email}</p>
            <span className={`inline-block mt-1.5 text-[10px] font-medium px-2 py-0.5 rounded-md capitalize ${
              user?.role === 'admin' ? 'text-violet-400 bg-violet-400/10 border border-violet-400/20' : 'text-blue-400 bg-blue-400/10 border border-blue-400/20'
            }`}>{user?.role}</span>
          </div>
          {[
            { label: 'Settings', action: () => { navigate('/settings'); setOpen(false) } },
            { label: 'Sign out', action: handleLogout, danger: true },
          ].map(item => (
            <button
              key={item.label}
              onClick={item.action}
              className="w-full text-left px-4 py-2.5 text-[13px] transition-colors"
              style={{ color: item.danger ? '#f87171' : 'var(--text-secondary)', borderBottom: '1px solid var(--border-soft)' }}
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

export default function Header({ title, subtitle, action }) {
  const [search, setSearch] = useState('')

  return (
    <header
      className="h-[60px] flex items-center justify-between px-6 sticky top-0 z-30 flex-shrink-0 transition-colors duration-200"
      style={{
        background: 'color-mix(in srgb, var(--bg-surface) 90%, transparent)',
        backdropFilter: 'blur(16px)',
        WebkitBackdropFilter: 'blur(16px)',
        borderBottom: '1px solid var(--border)',
      }}
    >
      {/* Left: title */}
      <div className="flex items-center gap-4 min-w-0">
        <div className="min-w-0">
          <h1 className="font-semibold text-[15px] leading-none tracking-tight truncate" style={{ color: 'var(--text-primary)' }}>
            {title}
          </h1>
          {subtitle && <p className="text-[11px] mt-0.5 leading-none truncate" style={{ color: 'var(--text-faint)' }}>{subtitle}</p>}
        </div>
        {action && <div className="flex items-center gap-2 flex-shrink-0">{action}</div>}
      </div>

      {/* Right: search + controls */}
      <div className="flex items-center gap-2 flex-shrink-0">
        {/* Search */}
        <div className="relative hidden md:block">
          <svg className="absolute left-3 top-1/2 -translate-y-1/2" width="12" height="12" viewBox="0 0 15 15" fill="none" style={{ color: 'var(--text-faint)' }}>
            <circle cx="6.5" cy="6.5" r="5" stroke="currentColor" strokeWidth="1.3"/>
            <path d="M10.5 10.5L13.5 13.5" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round"/>
          </svg>
          <input
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search…"
            className="rounded-lg pl-8 pr-3 py-1.5 text-[12px] outline-none transition-all w-40 focus:w-52"
            style={{
              background: 'var(--bg-elevated)',
              border: '1px solid var(--border)',
              color: 'var(--text-secondary)',
            }}
            onFocus={e => e.target.style.borderColor = 'var(--accent-border)'}
            onBlur={e => e.target.style.borderColor = 'var(--border)'}
          />
        </div>

        <div className="w-px h-5 mx-1" style={{ background: 'var(--border)' }} />
        <ThemeToggle />
        <NotificationBell />
        <UserMenu />
      </div>
    </header>
  )
}

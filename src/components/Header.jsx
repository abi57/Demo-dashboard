import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Search, Bell, Sun, Moon, ChevronDown, LogOut, User } from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import { useTheme } from '../context/ThemeContext'

export default function Header({ title, sidebarWidth = 260 }) {
  const { user, logout } = useAuth()
  const { isDark, toggle } = useTheme()
  const navigate = useNavigate()
  const [search, setSearch] = useState('')
  const [menuOpen, setMenuOpen] = useState(false)

  function handleSearch(e) {
    e.preventDefault()
    if (search.trim()) navigate(`/install-records?q=${encodeURIComponent(search.trim())}`)
  }

  return (
    <header style={{
      position: 'fixed', top: 0, left: sidebarWidth, right: 0,
      height: 68, zIndex: 30,
      background: 'linear-gradient(135deg, #e84393 0%, #a855f7 40%, #6366f1 70%, #3b82f6 100%)',
      borderBottom: 'none',
      display: 'flex', alignItems: 'center',
      padding: '0 28px', gap: 20,
      transition: 'left 0.2s ease',
      boxShadow: '0 2px 12px rgba(0,0,0,0.08)',
    }}>
      {/* Search */}
      <form onSubmit={handleSearch} style={{ flex: 1, maxWidth: 420, position: 'relative' }}>
        <Search size={15} style={{
          position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)',
          color: 'rgba(255,255,255,0.5)', pointerEvents: 'none',
        }} />
        <input
          value={search}
          onChange={e => setSearch(e.target.value)}
          placeholder="Search records, devices, sites…"
          style={{
            width: '100%', height: 40, borderRadius: 10,
            border: '1px solid rgba(255,255,255,0.2)',
            background: 'rgba(255,255,255,0.15)',
            backdropFilter: 'blur(8px)',
            padding: '0 14px 0 40px',
            fontSize: 14, color: '#fff',
            outline: 'none', fontFamily: 'inherit',
          }}
          onFocus={e => { e.target.style.background = 'rgba(255,255,255,0.25)'; e.target.style.borderColor = 'rgba(255,255,255,0.35)' }}
          onBlur={e => { e.target.style.background = 'rgba(255,255,255,0.15)'; e.target.style.borderColor = 'rgba(255,255,255,0.2)' }}
        />
        <style>{`header input::placeholder { color: rgba(255,255,255,0.5) !important; }`}</style>
      </form>

      <div style={{ flex: 1 }} />

      {/* Right controls */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
        {/* Notifications */}
        <button
          style={{
            width: 40, height: 40, borderRadius: 10, display: 'flex', alignItems: 'center', justifyContent: 'center',
            background: 'rgba(255,255,255,0.12)', border: '1px solid rgba(255,255,255,0.15)',
            cursor: 'pointer', color: 'rgba(255,255,255,0.8)', position: 'relative',
            transition: 'background 0.12s',
          }}
          onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,0.2)'}
          onMouseLeave={e => e.currentTarget.style.background = 'rgba(255,255,255,0.12)'}
          title="Notifications"
        >
          <Bell size={18} />
          <span style={{
            position: 'absolute', top: 8, right: 8,
            width: 8, height: 8, borderRadius: '50%',
            background: '#fbbf24', border: '2px solid rgba(168,85,247,0.6)',
          }} />
        </button>

        {/* Theme toggle */}
        <button
          onClick={toggle}
          style={{
            width: 40, height: 40, borderRadius: 10, display: 'flex', alignItems: 'center', justifyContent: 'center',
            background: 'rgba(255,255,255,0.12)', border: '1px solid rgba(255,255,255,0.15)',
            cursor: 'pointer', color: 'rgba(255,255,255,0.8)',
            transition: 'background 0.12s',
          }}
          onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,0.2)'}
          onMouseLeave={e => e.currentTarget.style.background = 'rgba(255,255,255,0.12)'}
          title={isDark ? 'Light mode' : 'Dark mode'}
        >
          {isDark ? <Sun size={18} /> : <Moon size={18} />}
        </button>

        {/* User avatar dropdown */}
        <div style={{ position: 'relative' }}>
          <button
            onClick={() => setMenuOpen(o => !o)}
            style={{
              display: 'flex', alignItems: 'center', gap: 8,
              padding: '4px 12px 4px 4px', borderRadius: 20,
              background: 'rgba(255,255,255,0.15)', border: '1px solid rgba(255,255,255,0.2)',
              cursor: 'pointer', transition: 'background 0.12s',
            }}
            onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,0.22)'}
            onMouseLeave={e => e.currentTarget.style.background = 'rgba(255,255,255,0.15)'}
          >
            <div style={{
              width: 30, height: 30, borderRadius: '50%',
              background: 'rgba(255,255,255,0.25)', border: '1.5px solid rgba(255,255,255,0.4)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: 12, fontWeight: 700, color: '#fff',
            }}>
              {user?.name?.[0]?.toUpperCase()}
            </div>
            <span style={{ fontSize: 14, fontWeight: 500, color: '#fff' }}>
              {user?.name?.split(' ')[0]}
            </span>
            <ChevronDown size={14} style={{ color: 'rgba(255,255,255,0.5)' }} />
          </button>

          {menuOpen && (
            <>
              <div onClick={() => setMenuOpen(false)} style={{ position: 'fixed', inset: 0, zIndex: 99 }} />
              <div style={{
                position: 'absolute', top: 'calc(100% + 8px)', right: 0,
                background: 'var(--vio-card-bg)', border: '0.5px solid var(--vio-card-border)',
                borderRadius: 12, padding: 6, minWidth: 220,
                boxShadow: '0 8px 32px rgba(0,0,0,0.12)', zIndex: 100,
              }}>
                <div style={{ padding: '12px 16px', borderBottom: '0.5px solid var(--vio-card-border)', marginBottom: 4 }}>
                  <div style={{ fontSize: 14, fontWeight: 600, color: 'var(--vio-text-primary)' }}>{user?.name}</div>
                  <div style={{ fontSize: 12, color: 'var(--vio-text-muted)', marginTop: 2 }}>{user?.email}</div>
                  <div style={{ fontSize: 11, color: 'var(--vio-text-muted)', marginTop: 1 }}>{user?.company}</div>
                </div>
                <button
                  onClick={() => { setMenuOpen(false); navigate('/settings') }}
                  style={{
                    display: 'flex', alignItems: 'center', gap: 10, width: '100%',
                    padding: '10px 16px', background: 'none', border: 'none',
                    cursor: 'pointer', borderRadius: 8, fontSize: 14,
                    color: 'var(--vio-text-secondary)', fontFamily: 'inherit',
                    transition: 'background 0.1s',
                  }}
                  onMouseEnter={e => e.currentTarget.style.background = 'var(--vio-page-bg)'}
                  onMouseLeave={e => e.currentTarget.style.background = 'none'}
                >
                  <User size={16} /> Profile & Settings
                </button>
                <button
                  onClick={() => { logout(); navigate('/login') }}
                  style={{
                    display: 'flex', alignItems: 'center', gap: 10, width: '100%',
                    padding: '10px 16px', background: 'none', border: 'none',
                    cursor: 'pointer', borderRadius: 8, fontSize: 14,
                    color: '#dc2626', fontFamily: 'inherit',
                    transition: 'background 0.1s',
                  }}
                  onMouseEnter={e => e.currentTarget.style.background = '#fef2f2'}
                  onMouseLeave={e => e.currentTarget.style.background = 'none'}
                >
                  <LogOut size={16} /> Sign out
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </header>
  )
}

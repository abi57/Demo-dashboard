import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Search, Bell, Sun, Moon, ChevronDown, LogOut, User } from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import { useTheme } from '../context/ThemeContext'

export default function Header({ title, sidebarWidth = 240 }) {
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
      position: 'fixed', top: 0, left: sidebarWidth, right: 0, height: 60, zIndex: 30,
      background: 'var(--vio-card-bg)',
      borderBottom: '0.5px solid var(--vio-card-border)',
      display: 'flex', alignItems: 'center',
      padding: '0 24px', gap: 16,
      transition: 'left 0.2s ease',
    }}>
      {/* Page title */}
      <h2 style={{ fontSize: 18, fontWeight: 600, color: 'var(--vio-text-primary)', margin: 0, flexShrink: 0 }}>
        {title}
      </h2>

      {/* Search */}
      <form onSubmit={handleSearch} style={{ flex: 1, maxWidth: 400, position: 'relative' }}>
        <Search size={14} style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: 'var(--vio-text-muted)', pointerEvents: 'none' }} />
        <input
          className="vio-input vio-input-sm"
          style={{ paddingLeft: 36 }}
          placeholder="Search records, devices, sites…"
          value={search}
          onChange={e => setSearch(e.target.value)}
        />
      </form>

      <div style={{ flex: 1 }} />

      {/* Controls */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
        {/* Notifications */}
        <button
          className="vio-btn vio-btn-ghost vio-btn-sm"
          style={{ width: 36, padding: 0, position: 'relative' }}
          title="Notifications"
        >
          <Bell size={16} />
          <span style={{
            position: 'absolute', top: 4, right: 4,
            width: 8, height: 8, borderRadius: '50%',
            background: 'var(--vio-status-red)',
            border: '1.5px solid var(--vio-card-bg)',
          }} />
        </button>

        {/* Theme toggle */}
        <button
          className="vio-btn vio-btn-ghost vio-btn-sm"
          style={{ width: 36, padding: 0 }}
          onClick={toggle}
          title={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
        >
          {isDark ? <Sun size={16} /> : <Moon size={16} />}
        </button>

        {/* Avatar dropdown */}
        <div style={{ position: 'relative' }}>
          <button
            className="vio-btn vio-btn-ghost vio-btn-sm"
            style={{ gap: 6, paddingLeft: 8, paddingRight: 10 }}
            onClick={() => setMenuOpen(o => !o)}
          >
            <div style={{
              width: 24, height: 24, borderRadius: '50%', background: 'var(--vio-primary)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: 10, fontWeight: 700, color: '#fff', flexShrink: 0,
            }}>
              {user?.name?.[0]?.toUpperCase()}
            </div>
            <span style={{ fontSize: 13, fontWeight: 500, color: 'var(--vio-text-primary)' }}>
              {user?.name?.split(' ')[0]}
            </span>
            <ChevronDown size={12} style={{ color: 'var(--vio-text-muted)' }} />
          </button>

          {menuOpen && (
            <div style={{
              position: 'absolute', top: 'calc(100% + 6px)', right: 0,
              background: 'var(--vio-card-bg)', border: '0.5px solid var(--vio-card-border)',
              borderRadius: 10, padding: 6, minWidth: 180,
              boxShadow: '0 4px 16px rgba(0,0,0,0.1)', zIndex: 100,
            }}>
              <div style={{ padding: '8px 12px', borderBottom: '0.5px solid var(--vio-card-border)', marginBottom: 4 }}>
                <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--vio-text-primary)' }}>{user?.name}</div>
                <div style={{ fontSize: 11, color: 'var(--vio-text-muted)' }}>{user?.email}</div>
              </div>
              <button
                onClick={() => { setMenuOpen(false); navigate('/settings') }}
                style={{ display: 'flex', alignItems: 'center', gap: 8, width: '100%', padding: '8px 12px', background: 'none', border: 'none', cursor: 'pointer', borderRadius: 6, fontSize: 13, color: 'var(--vio-text-secondary)' }}
                onMouseEnter={e => e.currentTarget.style.background = 'var(--vio-page-bg)'}
                onMouseLeave={e => e.currentTarget.style.background = 'none'}
              >
                <User size={14} /> Profile & Settings
              </button>
              <button
                onClick={() => { logout(); navigate('/login') }}
                style={{ display: 'flex', alignItems: 'center', gap: 8, width: '100%', padding: '8px 12px', background: 'none', border: 'none', cursor: 'pointer', borderRadius: 6, fontSize: 13, color: 'var(--vio-status-red)' }}
                onMouseEnter={e => e.currentTarget.style.background = '#fef2f2'}
                onMouseLeave={e => e.currentTarget.style.background = 'none'}
              >
                <LogOut size={14} /> Sign out
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  )
}

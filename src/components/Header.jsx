import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Search, Sun, Moon, Settings, LogOut, ChevronDown, Bell, X, CheckCircle, AlertTriangle, Info, Menu } from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import { useTheme } from '../context/ThemeContext'
import { useNotifications } from '../context/NotificationContext'

export default function Header({ title, onMenuToggle }) {
  const { user, logout } = useAuth()
  const { isDark, toggle } = useTheme()
  const { items, remove, clearAll } = useNotifications()
  const navigate = useNavigate()
  const [search, setSearch] = useState('')
  const [menuOpen, setMenuOpen] = useState(false)
  const [bellOpen, setBellOpen] = useState(false)

  function handleSearch(e) {
    e.preventDefault()
    if (search.trim()) navigate(`/install-records?q=${encodeURIComponent(search.trim())}`)
  }

  const iconMap = { success: <CheckCircle size={15} color="#16a34a" />, error: <AlertTriangle size={15} color="#dc2626" />, info: <Info size={15} color="#3b82f6" /> }
  const unread = items.length

  return (
    <header className="app-header">
      {/* Mobile hamburger */}
      <button onClick={onMenuToggle} className="mobile-menu-btn header-icon-btn" title="Menu">
        <Menu size={20} />
      </button>

      {/* Search */}
      <form onSubmit={handleSearch} className="header-search">
        <Search size={15} className="header-search-icon" />
        <input
          value={search} onChange={e => setSearch(e.target.value)}
          placeholder="Search records"
          className="header-search-input"
        />
      </form>

      <div style={{ flex: 1 }} />

      <div className="header-right" style={{ display: 'flex', alignItems: 'center', gap: 10, flexShrink: 0 }}>
        {/* Notification bell */}
        <div style={{ position: 'relative' }}>
          <button onClick={() => { setBellOpen(o => !o); setMenuOpen(false) }} className="header-icon-btn" title="Notifications">
            <Bell size={18} />
            {unread > 0 && (
              <span style={{
                position: 'absolute', top: 6, right: 6, minWidth: 16, height: 16, borderRadius: 99,
                background: '#fbbf24', border: '2px solid rgba(168,85,247,0.6)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: 9, fontWeight: 700, color: '#000',
              }}>{unread > 9 ? '9+' : unread}</span>
            )}
          </button>
          {bellOpen && (
            <>
              <div onClick={() => setBellOpen(false)} style={{ position: 'fixed', inset: 0, zIndex: 999 }} />
              <div className="notif-dropdown" style={{
                position: 'absolute', top: 'calc(100% + 8px)', right: 0,
                background: 'var(--vio-card-bg)', border: '1px solid var(--vio-card-border)',
                borderRadius: 14, width: 340, maxWidth: 'calc(100vw - 24px)', maxHeight: 400, overflow: 'hidden',
                boxShadow: '0 8px 32px rgba(0,0,0,0.15)', zIndex: 1000,
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '14px 16px', borderBottom: '1px solid var(--vio-card-border)' }}>
                  <span style={{ fontSize: 14, fontWeight: 600, color: 'var(--vio-text-primary)' }}>Notifications</span>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    {items.length > 0 && (
                      <button onClick={clearAll} style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: 12, color: 'var(--vio-text-muted)', fontFamily: 'inherit', textDecoration: 'underline' }}>Clear all</button>
                    )}
                    <button onClick={() => setBellOpen(false)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--vio-text-muted)', display: 'flex', padding: 2 }}>
                      <X size={18} />
                    </button>
                  </div>
                </div>
                <div style={{ overflowY: 'auto', maxHeight: 340 }}>
                  {items.length === 0 ? (
                    <div style={{ padding: '32px 16px', textAlign: 'center', color: 'var(--vio-text-muted)', fontSize: 13 }}>No notifications</div>
                  ) : items.map(n => (
                    <div key={n.id} style={{ display: 'flex', alignItems: 'flex-start', gap: 10, padding: '12px 16px', borderBottom: '1px solid var(--vio-card-border)' }}>
                      <div style={{ marginTop: 2, flexShrink: 0 }}>{iconMap[n.type] || iconMap.info}</div>
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <p style={{ fontSize: 13, color: 'var(--vio-text-primary)', lineHeight: 1.4 }}>{n.message}</p>
                        <p style={{ fontSize: 11, color: 'var(--vio-text-muted)', marginTop: 3 }}>{n.time}</p>
                      </div>
                      <button onClick={() => remove(n.id)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--vio-text-muted)', padding: 2, flexShrink: 0 }}><X size={14} /></button>
                    </div>
                  ))}
                </div>
              </div>
            </>
          )}
        </div>

        {/* Theme toggle */}
        <button onClick={toggle} className="header-icon-btn" title={isDark ? 'Light mode' : 'Dark mode'}>
          {isDark ? <Sun size={18} /> : <Moon size={18} />}
        </button>

        {/* Company dropdown */}
        {user && (
          <div style={{ position: 'relative' }}>
            <button onClick={() => { setMenuOpen(o => !o); setBellOpen(false) }}
              style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '6px 14px 6px 6px', borderRadius: 20, background: 'rgba(255,255,255,0.12)', border: '1px solid rgba(255,255,255,0.15)', cursor: 'pointer', transition: 'background 0.12s', fontFamily: 'inherit' }}
              onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,0.22)'}
              onMouseLeave={e => e.currentTarget.style.background = 'rgba(255,255,255,0.12)'}>
              <div style={{ width: 30, height: 30, borderRadius: '50%', background: 'rgba(255,255,255,0.25)', border: '1.5px solid rgba(255,255,255,0.4)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 12, fontWeight: 700, color: '#fff' }}>
                {user.company?.[0]?.toUpperCase()}
              </div>
              <span className="company-label" style={{ fontSize: 14, fontWeight: 500, color: '#fff' }}>{user.company}</span>
              <ChevronDown size={14} style={{ color: 'rgba(255,255,255,0.5)' }} />
            </button>
            {menuOpen && (
              <>
                <div onClick={() => setMenuOpen(false)} style={{ position: 'fixed', inset: 0, zIndex: 999 }} />
                <div style={{ position: 'absolute', top: 'calc(100% + 8px)', right: 0, background: 'var(--vio-card-bg)', border: '0.5px solid var(--vio-card-border)', borderRadius: 12, padding: 6, minWidth: 200, boxShadow: '0 8px 32px rgba(0,0,0,0.12)', zIndex: 1000 }}>
                  <button onClick={() => { setMenuOpen(false); navigate('/settings') }} style={menuItemStyle}
                    onMouseEnter={e => e.currentTarget.style.background = 'var(--vio-page-bg)'} onMouseLeave={e => e.currentTarget.style.background = 'none'}>
                    <Settings size={16} /> Settings
                  </button>
                  <button onClick={() => { setMenuOpen(false); logout(); navigate('/login') }} style={{ ...menuItemStyle, color: '#dc2626' }}
                    onMouseEnter={e => e.currentTarget.style.background = '#fef2f2'} onMouseLeave={e => e.currentTarget.style.background = 'none'}>
                    <LogOut size={16} /> Sign out
                  </button>
                </div>
              </>
            )}
          </div>
        )}
      </div>
    </header>
  )
}

const menuItemStyle = {
  display: 'flex', alignItems: 'center', gap: 10, width: '100%',
  padding: '10px 16px', background: 'none', border: 'none',
  cursor: 'pointer', borderRadius: 8, fontSize: 14,
  color: 'var(--vio-text-secondary)', fontFamily: 'inherit', transition: 'background 0.1s',
}

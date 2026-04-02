import { NavLink, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { useAlert } from '../context/AlertContext'
import { useTheme } from '../context/ThemeContext'
import { SidebarBrand } from './Brand'

/* ── Nav definition ──────────────────────────────────────────────────────────── */
const NAV = [
  {
    label: 'Overview',
    items: [
      { to: '/dashboard', label: 'Dashboard', icon:
        <svg width="14" height="14" viewBox="0 0 15 15" fill="none"><rect x="1" y="1" width="5.5" height="5.5" rx="1.2" stroke="currentColor" strokeWidth="1.2"/><rect x="8.5" y="1" width="5.5" height="5.5" rx="1.2" stroke="currentColor" strokeWidth="1.2"/><rect x="1" y="8.5" width="5.5" height="5.5" rx="1.2" stroke="currentColor" strokeWidth="1.2"/><rect x="8.5" y="8.5" width="5.5" height="5.5" rx="1.2" stroke="currentColor" strokeWidth="1.2"/></svg>
      },
    ],
  },
  {
    label: 'Field Operations',
    items: [
      { to: '/installations/new', label: 'New Installation', icon:
        <svg width="14" height="14" viewBox="0 0 15 15" fill="none"><circle cx="7.5" cy="7.5" r="6" stroke="currentColor" strokeWidth="1.2"/><path d="M7.5 4.5V10.5M4.5 7.5H10.5" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round"/></svg>
      },
      { to: '/install-records', label: 'Install Records', icon:
        <svg width="14" height="14" viewBox="0 0 15 15" fill="none"><rect x="2" y="1" width="11" height="13" rx="1.5" stroke="currentColor" strokeWidth="1.2"/><path d="M5 5H10M5 7.5H10M5 10H8" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round"/></svg>
      },
      { to: '/devices', label: 'Devices & Sensors', icon:
        <svg width="14" height="14" viewBox="0 0 15 15" fill="none"><circle cx="7.5" cy="7.5" r="2.5" stroke="currentColor" strokeWidth="1.2"/><path d="M7.5 1.5V3M7.5 12V13.5M1.5 7.5H3M12 7.5H13.5M3.4 3.4L4.5 4.5M10.5 10.5L11.6 11.6M3.4 11.6L4.5 10.5M10.5 4.5L11.6 3.4" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round"/></svg>
      },
      { to: '/sites', label: 'Sites & Towers', icon:
        <svg width="14" height="14" viewBox="0 0 15 15" fill="none"><path d="M7.5 1L13 4.5V10.5L7.5 14L2 10.5V4.5L7.5 1Z" stroke="currentColor" strokeWidth="1.2" strokeLinejoin="round"/><circle cx="7.5" cy="7.5" r="2" stroke="currentColor" strokeWidth="1.2"/></svg>
      },
    ],
  },
  {
    label: 'Intelligence',
    items: [
      { to: '/photos', label: 'Photo Library', icon:
        <svg width="14" height="14" viewBox="0 0 15 15" fill="none"><rect x="1" y="3" width="13" height="10" rx="1.5" stroke="currentColor" strokeWidth="1.2"/><circle cx="7.5" cy="8" r="2.2" stroke="currentColor" strokeWidth="1.2"/><path d="M5 3L6 1H9L10 3" stroke="currentColor" strokeWidth="1.2" strokeLinejoin="round"/></svg>
      },
      { to: '/reports', label: 'Reports', icon:
        <svg width="14" height="14" viewBox="0 0 15 15" fill="none"><path d="M2 12L5 8L7.5 10L10 6L13 9" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/><rect x="1" y="1" width="13" height="13" rx="1.5" stroke="currentColor" strokeWidth="1.2"/></svg>
      },
    ],
  },
  {
    label: 'System',
    items: [
      { to: '/settings', label: 'Settings', icon:
        <svg width="14" height="14" viewBox="0 0 15 15" fill="none"><circle cx="7.5" cy="7.5" r="2" stroke="currentColor" strokeWidth="1.2"/><path d="M7.5 1.5V3M7.5 12V13.5M1.5 7.5H3M12 7.5H13.5M3.4 3.4L4.5 4.5M10.5 10.5L11.6 11.6M3.4 11.6L4.5 10.5M10.5 4.5L11.6 3.4" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round"/></svg>
      },
    ],
  },
]

export default function Sidebar() {
  const { user, logout } = useAuth()
  const { push } = useAlert()
  const { isDark, toggle } = useTheme()
  const navigate = useNavigate()

  function handleLogout() {
    logout()
    push('Signed out successfully', 'info')
    navigate('/login')
  }

  return (
    <aside
      className="fixed left-0 top-0 h-screen w-[232px] flex flex-col z-40"
      style={{ background: 'var(--sidebar-bg)', borderRight: '1px solid var(--sidebar-border)' }}
    >
      {/* ── Brand ── */}
      <div
        className="flex items-center px-5 flex-shrink-0"
        style={{ height: 64, borderBottom: '1px solid var(--sidebar-border)' }}
      >
        <SidebarBrand isDark={isDark} />
      </div>

      {/* ── Nav ── */}
      <nav className="flex-1 overflow-y-auto py-5 px-3 flex flex-col gap-5">
        {NAV.map(group => (
          <div key={group.label}>
            <p
              className="font-semibold uppercase px-3 mb-1.5"
              style={{ fontSize: 9.5, letterSpacing: '0.12em', color: 'var(--text-xfaint)' }}
            >
              {group.label}
            </p>
            <div className="flex flex-col gap-[1px]">
              {group.items.map(({ to, label, icon }) => (
                <NavLink
                  key={to}
                  to={to}
                  className="flex items-center gap-2.5 px-3 rounded-[8px] font-medium"
                  style={({ isActive }) => ({
                    height: 34,
                    fontSize: 'var(--t-nav)',
                    color: isActive ? 'var(--accent)' : 'var(--text-muted)',
                    background: isActive ? 'var(--accent-bg)' : 'transparent',
                    border: isActive ? '1px solid var(--accent-border)' : '1px solid transparent',
                  })}
                  onMouseEnter={e => {
                    const active = e.currentTarget.style.background !== 'transparent'
                    if (!active) {
                      e.currentTarget.style.background = 'var(--bg-hover)'
                      e.currentTarget.style.color = 'var(--text-secondary)'
                    }
                  }}
                  onMouseLeave={e => {
                    const active = e.currentTarget.style.borderColor === 'var(--accent-border)'
                    if (!active) {
                      e.currentTarget.style.background = 'transparent'
                      e.currentTarget.style.color = 'var(--text-muted)'
                    }
                  }}
                >
                  {({ isActive }) => (
                    <>
                      <span style={{ color: isActive ? 'var(--accent)' : 'var(--text-faint)', flexShrink: 0 }}>
                        {icon}
                      </span>
                      <span className="truncate flex-1">{label}</span>
                      {isActive && (
                        <span
                          className="flex-shrink-0 rounded-full"
                          style={{ width: 4, height: 4, background: 'var(--accent)', opacity: 0.8 }}
                        />
                      )}
                    </>
                  )}
                </NavLink>
              ))}
            </div>
          </div>
        ))}
      </nav>

      {/* ── Theme toggle ── */}
      <div className="px-4 py-3 flex-shrink-0" style={{ borderTop: '1px solid var(--sidebar-border)' }}>
        <button
          onClick={toggle}
          className="w-full flex items-center justify-between px-3 rounded-[8px] transition-all"
          style={{
            height: 36,
            background: 'var(--bg-elevated)',
            border: '1px solid var(--border)',
          }}
          onMouseEnter={e => e.currentTarget.style.borderColor = 'var(--border-strong)'}
          onMouseLeave={e => e.currentTarget.style.borderColor = 'var(--border)'}
        >
          <div className="flex items-center gap-2">
            {isDark ? (
              <svg width="12" height="12" viewBox="0 0 15 15" fill="none" style={{ color: 'var(--text-muted)' }}>
                <circle cx="7.5" cy="7.5" r="2.5" stroke="currentColor" strokeWidth="1.2"/>
                <path d="M7.5 1V2.5M7.5 12.5V14M1 7.5H2.5M12.5 7.5H14M3 3L4 4M11 11L12 12M3 12L4 11M11 4L12 3" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round"/>
              </svg>
            ) : (
              <svg width="12" height="12" viewBox="0 0 15 15" fill="none" style={{ color: 'var(--text-muted)' }}>
                <path d="M13 9.5A6 6 0 015.5 2a6 6 0 100 11 6 6 0 007.5-3.5z" stroke="currentColor" strokeWidth="1.2" strokeLinejoin="round"/>
              </svg>
            )}
            <span style={{ fontSize: 'var(--t-nav)', color: 'var(--text-muted)' }}>
              {isDark ? 'Light mode' : 'Dark mode'}
            </span>
          </div>
          {/* Toggle pill */}
          <div
            className="rounded-full relative flex-shrink-0"
            style={{
              width: 28, height: 16,
              background: isDark ? 'var(--accent-bg)' : 'var(--bg-active)',
              border: '1px solid var(--border-strong)',
            }}
          >
            <div
              className="absolute top-[2px] rounded-full"
              style={{
                width: 10, height: 10,
                background: isDark ? 'var(--accent)' : 'var(--text-muted)',
                left: isDark ? 2 : 14,
              }}
            />
          </div>
        </button>
      </div>

      {/* ── User ── */}
      {user && (
        <div className="p-3 flex-shrink-0" style={{ borderTop: '1px solid var(--sidebar-border)' }}>
          <div
            className="flex items-center gap-2.5 px-2.5 rounded-[8px] cursor-default group"
            style={{ height: 44 }}
            onMouseEnter={e => e.currentTarget.style.background = 'var(--bg-hover)'}
            onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
          >
            <div
              className="w-7 h-7 rounded-full flex items-center justify-center font-bold text-white flex-shrink-0"
              style={{ fontSize: 11, background: 'linear-gradient(135deg, #7c3aed 0%, #2563eb 100%)' }}
            >
              {user.name[0].toUpperCase()}
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-semibold truncate leading-none" style={{ fontSize: 'var(--t-nav)', color: 'var(--text-primary)' }}>
                {user.name}
              </p>
              <p className="capitalize mt-[3px]" style={{ fontSize: 10, color: 'var(--text-faint)' }}>
                {user.role}
              </p>
            </div>
            <button
              onClick={handleLogout}
              title="Sign out"
              className="opacity-0 group-hover:opacity-100 p-1 rounded transition-all"
              style={{ color: 'var(--text-faint)' }}
              onMouseEnter={e => e.currentTarget.style.color = 'var(--danger)'}
              onMouseLeave={e => e.currentTarget.style.color = 'var(--text-faint)'}
            >
              <svg width="13" height="13" viewBox="0 0 15 15" fill="none">
                <path d="M6 2H3C2.4 2 2 2.4 2 3V12C2 12.6 2.4 13 3 13H6M10 10.5L13 7.5L10 4.5M5 7.5H13"
                  stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </button>
          </div>
        </div>
      )}
    </aside>
  )
}

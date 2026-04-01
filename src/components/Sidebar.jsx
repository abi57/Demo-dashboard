import { NavLink, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { useAlert } from '../context/AlertContext'
import { useTheme } from '../context/ThemeContext'

const NAV_GROUPS = [
  {
    label: 'Overview',
    items: [
      { to: '/dashboard', label: 'Dashboard', icon: (
        <svg width="15" height="15" viewBox="0 0 15 15" fill="none"><rect x="1" y="1" width="5.5" height="5.5" rx="1" stroke="currentColor" strokeWidth="1.3"/><rect x="8.5" y="1" width="5.5" height="5.5" rx="1" stroke="currentColor" strokeWidth="1.3"/><rect x="1" y="8.5" width="5.5" height="5.5" rx="1" stroke="currentColor" strokeWidth="1.3"/><rect x="8.5" y="8.5" width="5.5" height="5.5" rx="1" stroke="currentColor" strokeWidth="1.3"/></svg>
      )},
    ],
  },
  {
    label: 'Operations',
    items: [
      { to: '/installations/new', label: 'New Installation', icon: (
        <svg width="15" height="15" viewBox="0 0 15 15" fill="none"><circle cx="7.5" cy="7.5" r="6" stroke="currentColor" strokeWidth="1.3"/><path d="M7.5 4.5V10.5M4.5 7.5H10.5" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round"/></svg>
      )},
      { to: '/install-records', label: 'Install Records', icon: (
        <svg width="15" height="15" viewBox="0 0 15 15" fill="none"><rect x="2" y="1" width="11" height="13" rx="1.5" stroke="currentColor" strokeWidth="1.3"/><path d="M5 5H10M5 7.5H10M5 10H8" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round"/></svg>
      )},
      { to: '/devices', label: 'Devices / Sensors', icon: (
        <svg width="15" height="15" viewBox="0 0 15 15" fill="none"><circle cx="7.5" cy="7.5" r="2.5" stroke="currentColor" strokeWidth="1.3"/><path d="M7.5 1.5V3M7.5 12V13.5M1.5 7.5H3M12 7.5H13.5M3.4 3.4L4.5 4.5M10.5 10.5L11.6 11.6M3.4 11.6L4.5 10.5M10.5 4.5L11.6 3.4" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round"/></svg>
      )},
      { to: '/sites', label: 'Sites / Towers', icon: (
        <svg width="15" height="15" viewBox="0 0 15 15" fill="none"><path d="M7.5 1L13 4.5V10.5L7.5 14L2 10.5V4.5L7.5 1Z" stroke="currentColor" strokeWidth="1.3" strokeLinejoin="round"/><circle cx="7.5" cy="7.5" r="2" stroke="currentColor" strokeWidth="1.3"/></svg>
      )},
    ],
  },
  {
    label: 'Data',
    items: [
      { to: '/photos', label: 'Photos', icon: (
        <svg width="15" height="15" viewBox="0 0 15 15" fill="none"><rect x="1" y="3" width="13" height="10" rx="1.5" stroke="currentColor" strokeWidth="1.3"/><circle cx="7.5" cy="8" r="2.5" stroke="currentColor" strokeWidth="1.3"/><path d="M5 3L6 1H9L10 3" stroke="currentColor" strokeWidth="1.3" strokeLinejoin="round"/></svg>
      )},
      { to: '/reports', label: 'Reports', icon: (
        <svg width="15" height="15" viewBox="0 0 15 15" fill="none"><path d="M2 12L5 8L7.5 10L10 6L13 9" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round"/><rect x="1" y="1" width="13" height="13" rx="1.5" stroke="currentColor" strokeWidth="1.3"/></svg>
      )},
    ],
  },
  {
    label: 'System',
    items: [
      { to: '/settings', label: 'Settings', icon: (
        <svg width="15" height="15" viewBox="0 0 15 15" fill="none"><circle cx="7.5" cy="7.5" r="2" stroke="currentColor" strokeWidth="1.3"/><path d="M7.5 1.5V3M7.5 12V13.5M1.5 7.5H3M12 7.5H13.5M3.4 3.4L4.5 4.5M10.5 10.5L11.6 11.6M3.4 11.6L4.5 10.5M10.5 4.5L11.6 3.4" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round"/></svg>
      )},
    ],
  },
]

function SunIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 15 15" fill="none">
      <circle cx="7.5" cy="7.5" r="2.5" stroke="currentColor" strokeWidth="1.3"/>
      <path d="M7.5 1V2.5M7.5 12.5V14M1 7.5H2.5M12.5 7.5H14M3 3L4 4M11 11L12 12M3 12L4 11M11 4L12 3" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round"/>
    </svg>
  )
}

function MoonIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 15 15" fill="none">
      <path d="M13 9.5A6 6 0 015.5 2a6 6 0 100 11 6 6 0 007.5-3.5z" stroke="currentColor" strokeWidth="1.3" strokeLinejoin="round"/>
    </svg>
  )
}

export default function Sidebar() {
  const { user, logout } = useAuth()
  const { push } = useAlert()
  const { theme, toggle, isDark } = useTheme()
  const navigate = useNavigate()

  function handleLogout() {
    logout()
    push('Signed out successfully', 'info')
    navigate('/signin')
  }

  return (
    <aside
      className="fixed left-0 top-0 h-screen w-[220px] flex flex-col z-40 transition-colors duration-200"
      style={{ background: 'var(--bg-surface)', borderRight: '1px solid var(--border)' }}
    >
      {/* Brand */}
      <div className="h-[60px] flex items-center px-5 flex-shrink-0" style={{ borderBottom: '1px solid var(--border)' }}>
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-cyan-400 to-blue-600 flex items-center justify-center flex-shrink-0">
            <svg width="16" height="16" viewBox="0 0 18 18" fill="none">
              <path d="M9 2L15.5 6V12L9 16L2.5 12V6L9 2Z" stroke="white" strokeWidth="1.5" strokeLinejoin="round"/>
              <circle cx="9" cy="9" r="2.5" fill="white"/>
            </svg>
          </div>
          <div>
            <p className="font-semibold text-[13px] leading-none tracking-tight" style={{ color: 'var(--text-primary)' }}>Viotel</p>
            <p className="text-[10px] mt-0.5 tracking-widest uppercase" style={{ color: 'var(--text-faint)' }}>Platform</p>
          </div>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 py-4 px-3 flex flex-col gap-5 overflow-y-auto">
        {NAV_GROUPS.map(group => (
          <div key={group.label}>
            <p className="text-[10px] font-semibold uppercase tracking-[0.1em] px-3 mb-1.5" style={{ color: 'var(--text-xfaint)' }}>
              {group.label}
            </p>
            <div className="flex flex-col gap-0.5">
              {group.items.map(({ to, label, icon }) => (
                <NavLink
                  key={to}
                  to={to}
                  className={({ isActive }) =>
                    `flex items-center gap-2.5 px-3 py-2 rounded-lg text-[13px] transition-all ${isActive ? 'font-medium' : ''}`
                  }
                  style={({ isActive }) => isActive
                    ? { background: 'var(--accent-bg)', color: 'var(--accent)', border: '1px solid var(--accent-border)' }
                    : { color: 'var(--text-muted)', border: '1px solid transparent' }
                  }
                >
                  {({ isActive }) => (
                    <>
                      <span className="flex-shrink-0 transition-colors" style={{ color: isActive ? 'var(--accent)' : 'var(--text-faint)' }}>
                        {icon}
                      </span>
                      <span>{label}</span>
                    </>
                  )}
                </NavLink>
              ))}
            </div>
          </div>
        ))}
      </nav>

      {/* Theme toggle */}
      <div className="px-4 pb-3" style={{ borderTop: '1px solid var(--border)' }}>
        <div className="flex items-center justify-between px-3 py-3">
          <span className="text-[12px]" style={{ color: 'var(--text-muted)' }}>Theme</span>
          <button
            onClick={toggle}
            className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg transition-all text-[11px] font-medium"
            style={{
              background: 'var(--bg-active)',
              border: '1px solid var(--border)',
              color: 'var(--text-secondary)',
            }}
            title={`Switch to ${isDark ? 'light' : 'dark'} mode`}
          >
            {isDark ? <SunIcon /> : <MoonIcon />}
            <span>{isDark ? 'Light' : 'Dark'}</span>
          </button>
        </div>
      </div>

      {/* User footer */}
      {user && (
        <div className="p-3 flex-shrink-0" style={{ borderTop: '1px solid var(--border)' }}>
          <div
            className="flex items-center gap-2.5 px-2 py-2 rounded-lg transition-colors group cursor-default"
            style={{ '--hover-bg': 'var(--bg-hover)' }}
            onMouseEnter={e => e.currentTarget.style.background = 'var(--bg-hover)'}
            onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
          >
            <div className="w-7 h-7 rounded-full bg-gradient-to-br from-violet-500 to-blue-500 flex items-center justify-center text-[11px] font-bold text-white flex-shrink-0">
              {user.name[0].toUpperCase()}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-[12px] font-medium truncate leading-none" style={{ color: 'var(--text-primary)' }}>{user.name}</p>
              <p className="text-[10px] capitalize mt-0.5" style={{ color: 'var(--text-faint)' }}>{user.role}</p>
            </div>
            <button
              onClick={handleLogout}
              title="Sign out"
              className="transition-colors opacity-0 group-hover:opacity-100"
              style={{ color: 'var(--text-faint)' }}
              onMouseEnter={e => e.currentTarget.style.color = 'var(--text-secondary)'}
              onMouseLeave={e => e.currentTarget.style.color = 'var(--text-faint)'}
            >
              <svg width="13" height="13" viewBox="0 0 15 15" fill="none"><path d="M6 2H3C2.4 2 2 2.4 2 3V12C2 12.6 2.4 13 3 13H6M10 10.5L13 7.5L10 4.5M5 7.5H13" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round"/></svg>
            </button>
          </div>
        </div>
      )}
    </aside>
  )
}

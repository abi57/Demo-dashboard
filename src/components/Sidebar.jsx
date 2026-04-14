import { NavLink, useNavigate } from 'react-router-dom'
import { ClipboardPlus, FileText, Settings, LogOut, X } from 'lucide-react'
import { useAuth } from '../context/AuthContext'

const NAV = [
  { to: '/installations/new',  label: 'New Installation',        Icon: ClipboardPlus },
  { to: '/install-records',    label: 'Completed Installations', Icon: FileText      },
  { to: '/settings',           label: 'Settings',                Icon: Settings      },
]

export default function Sidebar({ mobileOpen, onClose }) {
  const { user, logout } = useAuth()
  const navigate = useNavigate()

  return (
    <aside className={`sidebar ${mobileOpen ? 'sidebar--open' : ''}`}>
      {/* Brand + close on mobile */}
      <div style={{
        height: 80, display: 'flex', alignItems: 'center', justifyContent: 'center',
        padding: '0 16px', flexShrink: 0, borderBottom: '1px solid var(--vio-sidebar-border)',
        position: 'relative',
      }}>
        <span style={{ fontSize: 22, fontWeight: 700, color: '#e84393', letterSpacing: 1 }}>VIOTEL</span>
        {mobileOpen && (
          <button onClick={onClose} style={{
            position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)',
            background: 'none', border: 'none', cursor: 'pointer', color: 'var(--vio-text-muted)', display: 'flex',
          }}><X size={20} /></button>
        )}
      </div>

      {/* Navigation */}
      <nav style={{ flex: 1, padding: '16px 12px', overflowY: 'auto', overflowX: 'hidden' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          {NAV.map(({ to, label, Icon }) => (
            <NavLink key={to} to={to} end onClick={onClose}
              style={({ isActive }) => ({
                display: 'flex', alignItems: 'center', gap: 14,
                padding: '11px 16px', borderRadius: 10, textDecoration: 'none',
                fontSize: 15, fontWeight: isActive ? 500 : 400,
                color: isActive ? '#e84393' : 'var(--vio-text-secondary)',
                background: isActive ? 'rgba(232,67,147,0.08)' : 'transparent',
                whiteSpace: 'nowrap', overflow: 'hidden',
                transition: 'background 0.12s, color 0.12s',
              })}
            >
              {({ isActive }) => (
                <>
                  <Icon size={20} strokeWidth={isActive ? 2 : 1.5}
                    style={{ flexShrink: 0, color: isActive ? '#e84393' : 'var(--vio-text-muted)' }} />
                  <span>{label}</span>
                </>
              )}
            </NavLink>
          ))}
        </div>
      </nav>

      {/* Footer */}
      {user && (
        <div style={{ padding: '12px 12px 16px', borderTop: '1px solid var(--vio-sidebar-border)', flexShrink: 0 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '8px 10px', borderRadius: 10, marginBottom: 8 }}>
            <div style={{
              width: 34, height: 34, borderRadius: '50%', background: '#e84393',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: 13, fontWeight: 700, color: '#fff', flexShrink: 0,
            }}>{user.company?.[0]?.toUpperCase()}</div>
            <div style={{ minWidth: 0 }}>
              <div style={{ fontSize: 14, fontWeight: 600, color: 'var(--vio-text-primary)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                {user.company}
              </div>
            </div>
          </div>
          <button onClick={() => { logout(); navigate('/login'); onClose?.() }}
            style={{
              width: '100%', height: 36, display: 'flex', alignItems: 'center',
              justifyContent: 'flex-start', gap: 10, padding: '0 14px',
              background: 'var(--vio-card-bg)', border: '1px solid var(--vio-card-border)', borderRadius: 10,
              cursor: 'pointer', fontSize: 13, color: 'var(--vio-text-muted)', fontFamily: 'inherit',
              transition: 'background 0.12s',
            }}
            onMouseEnter={e => { e.currentTarget.style.background = 'var(--vio-page-bg)' }}
            onMouseLeave={e => { e.currentTarget.style.background = 'var(--vio-card-bg)' }}
          >
            <LogOut size={14} /> Sign out
          </button>
        </div>
      )}
    </aside>
  )
}

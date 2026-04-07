import { useState } from 'react'
import { NavLink, useNavigate } from 'react-router-dom'
import {
  LayoutDashboard, ClipboardPlus, FileText, Cpu,
  MapPin, Image, BarChart2, Settings, LogOut,
  ChevronLeft, ChevronRight,
} from 'lucide-react'
import { useAuth } from '../context/AuthContext'

const NAV = [
  { to: '/dashboard',        label: 'Dashboard',          Icon: LayoutDashboard },
  { to: '/installations/new',label: 'New Installation',   Icon: ClipboardPlus   },
  { to: '/install-records',  label: 'Install Records',    Icon: FileText        },
  { to: '/devices',          label: 'Devices',            Icon: Cpu             },
  { to: '/sites',            label: 'Sites',              Icon: MapPin          },
  { to: '/photos',           label: 'Photos',             Icon: Image           },
  { to: '/reports',          label: 'Reports',            Icon: BarChart2       },
  { to: '/settings',         label: 'Settings',           Icon: Settings        },
]

export default function Sidebar() {
  const [collapsed, setCollapsed] = useState(false)
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const W = collapsed ? 64 : 240

  return (
    <aside style={{
      position: 'fixed', top: 0, left: 0, bottom: 0, width: W,
      background: 'var(--vio-sidebar-bg)',
      borderRight: '0.5px solid var(--vio-sidebar-border)',
      display: 'flex', flexDirection: 'column', zIndex: 40,
      transition: 'width 0.2s ease', overflow: 'hidden',
    }}>
      {/* Brand */}
      <div style={{ height: 60, display: 'flex', alignItems: 'center', padding: '0 16px', borderBottom: '0.5px solid var(--vio-sidebar-border)', flexShrink: 0, gap: 10 }}>
        {/* Logo mark */}
        <svg width="28" height="28" viewBox="0 0 28 28" fill="none" style={{ flexShrink: 0 }}>
          <rect width="28" height="28" rx="7" fill="#0b3d4a"/>
          <circle cx="14" cy="14" r="4" stroke="white" strokeWidth="1.5" fill="none"/>
          <path d="M14 5v3M14 20v3M5 14h3M20 14h3" stroke="white" strokeWidth="1.5" strokeLinecap="round"/>
          <path d="M7.5 7.5l2 2M18.5 18.5l2 2M7.5 20.5l2-2M18.5 9.5l2-2" stroke="rgba(255,255,255,0.5)" strokeWidth="1.2" strokeLinecap="round"/>
        </svg>
        {!collapsed && (
          <div style={{ minWidth: 0 }}>
            <div style={{ fontSize: 14, fontWeight: 700, color: 'var(--vio-primary)', letterSpacing: '-0.01em', lineHeight: 1.2 }}>Viotel</div>
            <div style={{ fontSize: 11, color: 'var(--vio-text-muted)', fontWeight: 500 }}>myViotel</div>
          </div>
        )}
      </div>

      {/* Nav */}
      <nav style={{ flex: 1, padding: '8px 8px', overflowY: 'auto', overflowX: 'hidden' }}>
        {NAV.map(({ to, label, Icon }) => (
          <NavLink
            key={to}
            to={to}
            end={to === '/dashboard'}
            title={collapsed ? label : undefined}
            style={({ isActive }) => ({
              display: 'flex', alignItems: 'center', gap: 10,
              padding: collapsed ? '10px 18px' : '9px 12px',
              borderRadius: 8, marginBottom: 2,
              textDecoration: 'none', fontSize: 14, fontWeight: 400,
              color: isActive ? 'var(--vio-primary)' : 'var(--vio-text-secondary)',
              background: isActive ? 'rgba(11,61,74,0.08)' : 'transparent',
              borderLeft: isActive ? '3px solid var(--vio-primary)' : '3px solid transparent',
              whiteSpace: 'nowrap', overflow: 'hidden',
            })}
          >
            {({ isActive }) => (
              <>
                <Icon size={16} style={{ flexShrink: 0, color: isActive ? 'var(--vio-primary)' : 'var(--vio-text-muted)' }} />
                {!collapsed && <span>{label}</span>}
              </>
            )}
          </NavLink>
        ))}
      </nav>

      {/* Collapse toggle */}
      <button
        onClick={() => setCollapsed(c => !c)}
        style={{
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          height: 36, margin: '0 8px 4px',
          background: 'transparent', border: '0.5px solid var(--vio-card-border)',
          borderRadius: 8, cursor: 'pointer', color: 'var(--vio-text-muted)',
          flexShrink: 0,
        }}
        title={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
      >
        {collapsed ? <ChevronRight size={14} /> : <ChevronLeft size={14} />}
      </button>

      {/* User footer */}
      {user && (
        <div style={{ padding: '12px 8px', borderTop: '0.5px solid var(--vio-sidebar-border)', flexShrink: 0 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '8px', borderRadius: 8, marginBottom: 4 }}>
            <div style={{
              width: 28, height: 28, borderRadius: '50%', background: 'var(--vio-primary)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: 11, fontWeight: 700, color: '#fff', flexShrink: 0,
            }}>
              {user.name?.[0]?.toUpperCase()}
            </div>
            {!collapsed && (
              <div style={{ minWidth: 0 }}>
                <div style={{ fontSize: 12, fontWeight: 600, color: 'var(--vio-text-primary)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{user.name}</div>
                <div style={{ fontSize: 11, color: 'var(--vio-text-muted)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{user.company}</div>
              </div>
            )}
          </div>
          <button
            onClick={() => { logout(); navigate('/login') }}
            className="vio-btn vio-btn-ghost vio-btn-sm"
            style={{ width: '100%', justifyContent: collapsed ? 'center' : 'flex-start', gap: 6 }}
            title="Sign out"
          >
            <LogOut size={14} />
            {!collapsed && 'Sign out'}
          </button>
        </div>
      )}
    </aside>
  )
}

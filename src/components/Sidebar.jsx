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
  const W = collapsed ? 72 : 260

  return (
    <aside style={{
      position: 'fixed', top: 0, left: 0, bottom: 0, width: W,
      background: '#f5f5f5',
      display: 'flex', flexDirection: 'column', zIndex: 40,
      transition: 'width 0.2s ease', overflow: 'hidden',
      boxShadow: '1px 0 4px rgba(0,0,0,0.03)',
    }}>

      {/* ── Brand area — logo centered ── */}
      <div style={{
        height: 80, display: 'flex', alignItems: 'center', justifyContent: 'center',
        padding: '0 16px',
        flexShrink: 0,
        background: '#f5f5f5',
        borderBottom: '1px solid #e5e5e5',
      }}>
        <img
          src="/logo.webp"
          alt="Viotel"
          style={{
            height: collapsed ? 30 : 50,
            width: 'auto',
            objectFit: 'contain',
          }}
        />
      </div>

      {/* ── Navigation ── */}
      <nav style={{ flex: 1, padding: collapsed ? '16px 10px' : '16px 12px', overflowY: 'auto', overflowX: 'hidden' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          {NAV.map(({ to, label, Icon }) => (
            <NavLink
              key={to}
              to={to}
              end={to === '/dashboard'}
              title={collapsed ? label : undefined}
              style={({ isActive }) => ({
                display: 'flex', alignItems: 'center',
                gap: 14,
                padding: collapsed ? '11px 16px' : '11px 16px',
                borderRadius: 10,
                textDecoration: 'none',
                fontSize: 15,
                fontWeight: isActive ? 500 : 400,
                color: isActive ? '#e84393' : '#4b5563',
                background: isActive ? 'rgba(232,67,147,0.08)' : 'transparent',
                whiteSpace: 'nowrap',
                overflow: 'hidden',
                transition: 'background 0.12s, color 0.12s',
              })}
            >
              {({ isActive }) => (
                <>
                  <Icon
                    size={20}
                    strokeWidth={isActive ? 2 : 1.5}
                    style={{ flexShrink: 0, color: isActive ? '#e84393' : '#9ca3af' }}
                  />
                  {!collapsed && <span>{label}</span>}
                </>
              )}
            </NavLink>
          ))}
        </div>
      </nav>

      {/* ── Collapse toggle ── */}
      <button
        onClick={() => setCollapsed(c => !c)}
        style={{
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          height: 36, margin: '0 12px 8px',
          background: '#fff', border: '1px solid #e5e5e5',
          borderRadius: 10, cursor: 'pointer', color: '#9ca3af',
          flexShrink: 0, transition: 'background 0.12s',
        }}
        onMouseEnter={e => e.currentTarget.style.background = '#ebebeb'}
        onMouseLeave={e => e.currentTarget.style.background = '#fff'}
        title={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
      >
        {collapsed ? <ChevronRight size={14} /> : <ChevronLeft size={14} />}
      </button>

      {/* ── User footer ── */}
      {user && (
        <div style={{ padding: '12px 12px 16px', borderTop: '1px solid #e5e5e5', flexShrink: 0 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '8px 10px', borderRadius: 10, marginBottom: 8 }}>
            <div style={{
              width: 34, height: 34, borderRadius: '50%',
              background: '#e84393',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: 13, fontWeight: 700, color: '#fff', flexShrink: 0,
            }}>
              {user.name?.[0]?.toUpperCase()}
            </div>
            {!collapsed && (
              <div style={{ minWidth: 0 }}>
                <div style={{ fontSize: 13, fontWeight: 600, color: '#1f2937', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                  {user.name}
                </div>
                <div style={{ fontSize: 12, color: '#9ca3af', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                  {user.company}
                </div>
              </div>
            )}
          </div>
          <button
            onClick={() => { logout(); navigate('/login') }}
            style={{
              width: '100%', height: 36, display: 'flex', alignItems: 'center',
              justifyContent: collapsed ? 'center' : 'flex-start',
              gap: 10, padding: '0 14px',
              background: '#fff', border: '1px solid #e5e5e5',
              borderRadius: 10, cursor: 'pointer',
              fontSize: 13, color: '#6b7280', fontFamily: 'inherit',
              transition: 'background 0.12s',
            }}
            onMouseEnter={e => { e.currentTarget.style.background = '#ebebeb' }}
            onMouseLeave={e => { e.currentTarget.style.background = '#fff' }}
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

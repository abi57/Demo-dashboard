import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { useViotel } from '../context/ViotelContext'

export default function Navbar() {
  const { user, logout } = useAuth()
  const { assets, selectedAsset, setSelectedAsset, activeAlerts, lastSync } = useViotel()
  const navigate = useNavigate()

  const syncStr = lastSync.toLocaleTimeString('en-AU', {
    hour: '2-digit', minute: '2-digit', second: '2-digit',
  })

  return (
    <nav style={{
      position: 'fixed', top: 0, left: 0, right: 0, zIndex: 50,
      height: 60, background: '#0b3d4a',
      borderBottom: '1px solid rgba(255,255,255,0.08)',
      display: 'flex', alignItems: 'center',
      padding: '0 20px', gap: 0,
    }}>

      {/* Brand — fixed width matches sidebar */}
      <div style={{
        width: 220, flexShrink: 0, display: 'flex', alignItems: 'center', gap: 10,
        paddingRight: 16,
      }}>
        <svg width="26" height="26" viewBox="0 0 26 26" fill="none">
          <rect width="26" height="26" rx="6" fill="rgba(255,255,255,0.14)"/>
          <circle cx="13" cy="13" r="3.5" stroke="white" strokeWidth="1.4" fill="none"/>
          <path d="M13 4.5V7M13 19v2.5M4.5 13H7M19 13h2.5" stroke="white" strokeWidth="1.4" strokeLinecap="round"/>
          <path d="M7.3 7.3l1.7 1.7M17 17l1.7 1.7M7.3 18.7l1.7-1.7M17 9l1.7-1.7"
            stroke="rgba(255,255,255,0.45)" strokeWidth="1.1" strokeLinecap="round"/>
        </svg>
        <div>
          <span style={{ fontSize: 15, fontWeight: 600, color: '#fff', letterSpacing: '-0.01em' }}>Viotel</span>
          <span style={{ fontSize: 12, color: 'rgba(255,255,255,0.5)', marginLeft: 6 }}>myViotel</span>
        </div>
      </div>

      {/* Asset selector — centred */}
      <div style={{ flex: 1, display: 'flex', justifyContent: 'center' }}>
        <select
          value={selectedAsset}
          onChange={e => setSelectedAsset(e.target.value)}
          style={{
            height: 34, padding: '0 32px 0 12px', borderRadius: 8,
            border: '1px solid rgba(255,255,255,0.18)',
            background: 'rgba(255,255,255,0.08)',
            color: '#fff', fontSize: 13, fontWeight: 500,
            cursor: 'pointer', outline: 'none',
            minWidth: 200, maxWidth: 360,
            appearance: 'none', fontFamily: 'inherit',
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='10' height='6' viewBox='0 0 10 6' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M1 1l4 4 4-4' stroke='rgba(255,255,255,0.55)' stroke-width='1.5' stroke-linecap='round' stroke-linejoin='round'/%3E%3C/svg%3E")`,
            backgroundRepeat: 'no-repeat', backgroundPosition: 'right 10px center',
          }}
        >
          {assets.map(a => (
            <option key={a.id} value={a.id} style={{ background: '#0b3d4a', color: '#fff' }}>
              {a.name}
            </option>
          ))}
        </select>
      </div>

      {/* Right controls */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 16, flexShrink: 0 }}>

        {/* Sync timestamp */}
        <span style={{ fontSize: 11, color: 'rgba(255,255,255,0.4)', letterSpacing: '0.02em', whiteSpace: 'nowrap' }}>
          Synced {syncStr}
        </span>

        {/* Alert bell */}
        <button
          onClick={() => navigate('/alerts')}
          style={{
            position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center',
            color: activeAlerts.length > 0 ? '#fbbf24' : 'rgba(255,255,255,0.65)',
            background: 'none', border: 'none', cursor: 'pointer', padding: 4,
          }}
          title={`${activeAlerts.length} active alert${activeAlerts.length !== 1 ? 's' : ''}`}
        >
          <svg width="18" height="18" viewBox="0 0 20 20" fill="none">
            <path d="M10 2a6 6 0 00-6 6v3l-1.5 2h15L16 11V8a6 6 0 00-6-6z"
              stroke="currentColor" strokeWidth="1.4" strokeLinejoin="round"/>
            <path d="M8.5 16.5a1.5 1.5 0 003 0" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round"/>
          </svg>
          {activeAlerts.length > 0 && (
            <span style={{
              position: 'absolute', top: 0, right: 0,
              width: 16, height: 16, borderRadius: '50%',
              background: '#dc2626', color: '#fff',
              fontSize: 9, fontWeight: 700, lineHeight: '16px', textAlign: 'center',
              border: '1.5px solid #0b3d4a',
            }}>
              {activeAlerts.length}
            </span>
          )}
        </button>

        {/* User avatar + name */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <div style={{
            width: 30, height: 30, borderRadius: '50%',
            background: '#1b7a5e', border: '1.5px solid rgba(255,255,255,0.2)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: 12, fontWeight: 600, color: '#fff', flexShrink: 0,
          }}>
            {user?.name?.[0]?.toUpperCase() ?? 'E'}
          </div>
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <span style={{ fontSize: 12, fontWeight: 500, color: '#fff', lineHeight: 1.2, whiteSpace: 'nowrap' }}>
              {user?.name?.split(' ')[0]}
            </span>
            <span style={{ fontSize: 10, color: 'rgba(255,255,255,0.45)', lineHeight: 1.2 }}>
              {user?.company ?? 'Engineer'}
            </span>
          </div>
          <button
            onClick={() => { logout(); navigate('/login') }}
            title="Sign out"
            style={{
              background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.15)',
              borderRadius: 6, color: 'rgba(255,255,255,0.6)', cursor: 'pointer',
              fontSize: 11, padding: '3px 8px', fontFamily: 'inherit',
            }}
            onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,0.14)'}
            onMouseLeave={e => e.currentTarget.style.background = 'rgba(255,255,255,0.08)'}
          >
            Sign out
          </button>
        </div>
      </div>
    </nav>
  )
}

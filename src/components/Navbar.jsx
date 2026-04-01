import { NavLink, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { useAlert } from '../context/AlertContext'

const ROLE_STYLE = {
  admin: 'text-purple-400 bg-purple-400/10 border-purple-400/25',
  user:  'text-blue-400   bg-blue-400/10   border-blue-400/25',
}

export default function Navbar() {
  const { user, logout } = useAuth()
  const { push } = useAlert()
  const navigate = useNavigate()

  function handleLogout() {
    logout()
    push('You have been signed out.', 'info')
    navigate('/signin')
  }

  return (
    <nav className="sticky top-0 z-50 backdrop-blur-xl bg-slate-950/70 border-b border-white/10 px-6 md:px-10 h-14 flex items-center justify-between">
      <span className="text-purple-400 font-semibold text-base tracking-tight">⚡ Viotel Demo</span>

      <div className="flex items-center gap-1">
        {user && [
          { to: '/',          label: 'Home',        end: true },
          { to: '/dashboard', label: 'Dashboard' },
          { to: '/viotel',    label: 'IoT Monitor' },
        ].map(({ to, label, end }) => (
          <NavLink
            key={to}
            to={to}
            end={end}
            className={({ isActive }) =>
              `text-sm px-3 py-1.5 rounded-lg transition-colors ${
                isActive
                  ? 'bg-purple-500/15 text-purple-400 font-medium'
                  : 'text-slate-400 hover:text-white hover:bg-white/5'
              }`
            }
          >
            {label}
          </NavLink>
        ))}
      </div>

      <div className="flex items-center gap-3">
        {user ? (
          <>
            <span className={`hidden sm:inline-flex text-xs font-medium px-2.5 py-1 rounded-full border capitalize ${ROLE_STYLE[user.role]}`}>
              {user.role}
            </span>
            <span className="text-sm text-slate-300 hidden sm:block">{user.name}</span>
            <button
              onClick={handleLogout}
              className="text-xs px-3 py-1.5 rounded-lg bg-white/5 border border-white/10 text-slate-400 hover:text-white hover:bg-white/10 transition-all"
            >
              Sign out
            </button>
          </>
        ) : (
          <NavLink
            to="/signin"
            className="text-xs px-3 py-1.5 rounded-lg bg-purple-600 hover:bg-purple-500 text-white font-medium transition-all"
          >
            Sign in
          </NavLink>
        )}
      </div>
    </nav>
  )
}

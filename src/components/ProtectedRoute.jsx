import { Navigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export default function ProtectedRoute({ children, requiredRole }) {
  const { user } = useAuth()
  if (!user) return <Navigate to="/login" replace />
  if (requiredRole && user.role !== requiredRole) {
    return (
      <div className="min-h-screen flex items-center justify-center px-6 transition-colors"
        style={{ background: 'var(--bg-base)' }}>
        <div className="rounded-2xl p-10 max-w-sm text-center"
          style={{ background: 'var(--bg-surface)', border: '1px solid var(--border)' }}>
          <p className="text-4xl mb-4">🔒</p>
          <h2 className="text-[18px] font-bold mb-2" style={{ color: 'var(--text-primary)' }}>Access Denied</h2>
          <p className="text-[13px]" style={{ color: 'var(--text-muted)' }}>
            This page requires <span style={{ color: 'var(--accent)' }}>{requiredRole}</span> privileges.
          </p>
        </div>
      </div>
    )
  }
  return children
}

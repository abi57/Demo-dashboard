import { Navigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

// requiredRole: 'admin' | 'user' | undefined (any authenticated user)
export default function ProtectedRoute({ children, requiredRole }) {
  const { user } = useAuth()

  if (!user) return <Navigate to="/signin" replace />

  if (requiredRole && user.role !== requiredRole) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center text-center px-6">
        <div className="backdrop-blur-md bg-white/5 border border-white/10 rounded-2xl p-10 max-w-sm">
          <p className="text-4xl mb-4">🔒</p>
          <h2 className="text-xl font-bold text-white mb-2">Access Denied</h2>
          <p className="text-slate-400 text-sm">This page requires <span className="text-purple-400 font-medium">{requiredRole}</span> privileges.</p>
        </div>
      </div>
    )
  }

  return children
}

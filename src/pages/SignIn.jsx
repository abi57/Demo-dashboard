import { useState } from 'react'
import { useNavigate, Navigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { useAlert } from '../context/AlertContext'

export default function SignIn() {
  const { user, login } = useAuth()
  const { push } = useAlert()
  const navigate = useNavigate()

  const [form, setForm]     = useState({ username: '', password: '' })
  const [error, setError]   = useState('')
  const [loading, setLoading] = useState(false)
  const [showPass, setShowPass] = useState(false)

  // Already logged in — redirect
  if (user) return <Navigate to="/viotel" replace />

  function handleChange(e) {
    setForm(f => ({ ...f, [e.target.name]: e.target.value }))
    setError('')
  }

  async function handleSubmit(e) {
    e.preventDefault()
    if (!form.username || !form.password) {
      setError('Please fill in all fields.')
      return
    }
    setLoading(true)
    // Simulate async auth delay
    await new Promise(r => setTimeout(r, 700))
    const result = login(form.username, form.password)
    setLoading(false)
    if (!result.ok) {
      setError(result.error)
      return
    }
    push(`Welcome back! Signed in as ${form.username}`, 'success')
    navigate('/viotel')
  }

  function fillDemo(role) {
    setForm(role === 'admin'
      ? { username: 'admin', password: 'admin123' }
      : { username: 'user',  password: 'user123'  }
    )
    setError('')
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 flex items-center justify-center px-4">

      {/* Background glow */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -left-40 w-96 h-96 bg-purple-600/20 rounded-full blur-3xl" />
        <div className="absolute -bottom-40 -right-40 w-96 h-96 bg-blue-600/20 rounded-full blur-3xl" />
      </div>

      <div className="relative w-full max-w-md animate-fade-up">

        {/* Card */}
        <div className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-3xl p-8 shadow-2xl">

          {/* Logo */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-purple-500/20 border border-purple-500/30 text-3xl mb-4">
              ⚡
            </div>
            <h1 className="text-2xl font-bold text-white tracking-tight">Viotel Demo</h1>
            <p className="text-slate-400 text-sm mt-1">Sign in to your account</p>
          </div>

          {/* Demo credential hints */}
          <div className="flex gap-2 mb-6">
            {['admin', 'user'].map(role => (
              <button
                key={role}
                type="button"
                onClick={() => fillDemo(role)}
                className="flex-1 text-xs py-2 px-3 rounded-lg border border-white/10 bg-white/5 text-slate-400 hover:text-white hover:bg-white/10 transition-all capitalize"
              >
                Demo {role}
              </button>
            ))}
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <div className="flex flex-col gap-1.5">
              <label className="text-xs text-slate-400 uppercase tracking-wider">Username</label>
              <input
                name="username"
                value={form.username}
                onChange={handleChange}
                autoComplete="username"
                placeholder="Enter username"
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm text-white placeholder-slate-600 outline-none focus:border-purple-500/60 focus:ring-2 focus:ring-purple-500/20 transition-all"
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-xs text-slate-400 uppercase tracking-wider">Password</label>
              <div className="relative">
                <input
                  name="password"
                  type={showPass ? 'text' : 'password'}
                  value={form.password}
                  onChange={handleChange}
                  autoComplete="current-password"
                  placeholder="Enter password"
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 pr-11 text-sm text-white placeholder-slate-600 outline-none focus:border-purple-500/60 focus:ring-2 focus:ring-purple-500/20 transition-all"
                />
                <button
                  type="button"
                  onClick={() => setShowPass(v => !v)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-white transition-colors text-base"
                >
                  {showPass ? '🙈' : '👁️'}
                </button>
              </div>
            </div>

            {/* Error */}
            {error && (
              <p className="text-red-400 text-xs bg-red-500/10 border border-red-500/20 rounded-lg px-3 py-2">
                {error}
              </p>
            )}

            <button
              type="submit"
              disabled={loading}
              className="mt-2 w-full py-3 rounded-xl bg-purple-600 hover:bg-purple-500 disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold text-sm transition-all active:scale-95 shadow-lg shadow-purple-900/40"
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Signing in…
                </span>
              ) : 'Sign In'}
            </button>
          </form>

          {/* Role info */}
          <div className="mt-6 pt-5 border-t border-white/10">
            <p className="text-xs text-slate-500 text-center mb-3">Available roles</p>
            <div className="flex gap-2">
              {[
                { role: 'Admin', desc: 'Full access', color: 'text-purple-400 bg-purple-400/10 border-purple-400/20' },
                { role: 'User',  desc: 'View only',   color: 'text-blue-400   bg-blue-400/10   border-blue-400/20'   },
              ].map(r => (
                <div key={r.role} className={`flex-1 text-center text-xs px-3 py-2 rounded-lg border ${r.color}`}>
                  <p className="font-semibold">{r.role}</p>
                  <p className="opacity-70">{r.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

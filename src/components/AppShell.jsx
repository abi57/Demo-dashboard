import { useState } from 'react'
import Sidebar from './Sidebar'
import Header from './Header'

export default function AppShell({ title, children }) {
  const [mobileNav, setMobileNav] = useState(false)

  return (
    <div style={{ display: 'flex', minHeight: '100svh', background: 'var(--vio-page-bg)' }}>
      {/* Mobile overlay */}
      {mobileNav && (
        <div onClick={() => setMobileNav(false)}
          style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.4)', zIndex: 39 }} />
      )}

      <Sidebar mobileOpen={mobileNav} onClose={() => setMobileNav(false)} />

      <div className="app-main">
        <Header title={title} onMenuToggle={() => setMobileNav(o => !o)} />
        <main className="app-content">
          {children}
        </main>
      </div>
    </div>
  )
}

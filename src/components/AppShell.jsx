import { useState, useEffect, useRef } from 'react'
import { useLocation } from 'react-router-dom'
import Sidebar from './Sidebar'
import Header from './Header'

export default function AppShell({ title, children }) {
  const [mobileNav, setMobileNav] = useState(false)
  const mainRef = useRef()
  const { pathname } = useLocation()

  useEffect(() => {
    // Scroll both window and the main container to top on route change
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' })
    document.documentElement.scrollTop = 0
    document.body.scrollTop = 0
    if (mainRef.current) mainRef.current.scrollTop = 0
  }, [pathname])

  return (
    <div style={{ display: 'flex', minHeight: '100svh', background: 'var(--vio-page-bg)' }}>
      {mobileNav && (
        <div onClick={() => setMobileNav(false)}
          style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.4)', zIndex: 39 }} />
      )}

      <Sidebar mobileOpen={mobileNav} onClose={() => setMobileNav(false)} />

      <div className="app-main" ref={mainRef}>
        <Header title={title} onMenuToggle={() => setMobileNav(o => !o)} />
        <main className="app-content">
          {children}
        </main>
      </div>
    </div>
  )
}

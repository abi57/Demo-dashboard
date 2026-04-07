import { useState } from 'react'
import Sidebar from './Sidebar'
import Header from './Header'

export default function AppShell({ title, children }) {
  // Track sidebar width for header offset
  // Sidebar manages its own collapsed state internally
  // We use a simple approach: read from sidebar's default
  const sidebarWidth = 240 // default; sidebar handles its own collapse

  return (
    <div style={{ display: 'flex', minHeight: '100svh', background: 'var(--vio-page-bg)' }}>
      <Sidebar />
      <div style={{ flex: 1, marginLeft: sidebarWidth, display: 'flex', flexDirection: 'column', minHeight: '100svh', transition: 'margin-left 0.2s ease' }}>
        <Header title={title} sidebarWidth={sidebarWidth} />
        <main style={{ flex: 1, padding: '80px 24px 32px', maxWidth: 1400, width: '100%', margin: '0 auto' }}>
          {children}
        </main>
      </div>
    </div>
  )
}

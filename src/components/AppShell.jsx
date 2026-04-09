import Sidebar from './Sidebar'
import Header from './Header'

export default function AppShell({ title, children }) {
  const sidebarWidth = 260

  return (
    <div style={{ display: 'flex', minHeight: '100svh', background: 'var(--vio-page-bg)' }}>
      {/* Sidebar — full height, left side */}
      <Sidebar />

      {/* Main area — right of sidebar */}
      <div style={{
        flex: 1, marginLeft: sidebarWidth,
        display: 'flex', flexDirection: 'column',
        minHeight: '100svh',
        transition: 'margin-left 0.2s ease',
      }}>
        {/* Header — top of main area, right of sidebar */}
        <Header title={title} sidebarWidth={sidebarWidth} />

        {/* Page content — below header */}
        <main style={{
          flex: 1,
          padding: '92px 28px 40px',
          maxWidth: 1400,
          width: '100%',
        }}>
          {children}
        </main>
      </div>
    </div>
  )
}

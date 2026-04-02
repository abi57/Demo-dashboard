import Header from '../components/Header'
import { useAuth } from '../context/AuthContext'
import { useTheme } from '../context/ThemeContext'

const Section = ({ title, desc, children }) => (
  <div className="rounded-xl overflow-hidden" style={{ border: '1px solid var(--border)', background: 'var(--bg-surface)' }}>
    <div className="px-6 py-4" style={{ borderBottom: '1px solid var(--border)' }}>
      <h4 style={{ color: 'var(--text-primary)' }}>{title}</h4>
      {desc && <p className="t-caption mt-1" style={{ color: 'var(--text-faint)' }}>{desc}</p>}
    </div>
    <div>{children}</div>
  </div>
)

const Row = ({ label, desc, children }) => (
  <div className="flex items-center justify-between px-6 py-4" style={{ borderBottom: '1px solid var(--border-soft)' }}>
    <div>
      <p className="t-body-sm font-medium" style={{ color: 'var(--text-secondary)' }}>{label}</p>
      {desc && <p className="t-caption mt-0.5" style={{ color: 'var(--text-faint)' }}>{desc}</p>}
    </div>
    <div className="flex-shrink-0 ml-8">{children}</div>
  </div>
)

function ThemeToggle() {
  const { theme, toggle } = useTheme()
  return (
    <div className="flex rounded-xl overflow-hidden p-1 gap-1"
      style={{ background: 'var(--bg-elevated)', border: '1px solid var(--border)' }}>
      {[
        { value: 'dark',  label: 'Dark',  icon: <svg width="13" height="13" viewBox="0 0 15 15" fill="none"><path d="M13 9.5A6 6 0 015.5 2a6 6 0 100 11 6 6 0 007.5-3.5z" stroke="currentColor" strokeWidth="1.3" strokeLinejoin="round"/></svg> },
        { value: 'light', label: 'Light', icon: <svg width="13" height="13" viewBox="0 0 15 15" fill="none"><circle cx="7.5" cy="7.5" r="2.5" stroke="currentColor" strokeWidth="1.3"/><path d="M7.5 1V2.5M7.5 12.5V14M1 7.5H2.5M12.5 7.5H14M3 3L4 4M11 11L12 12M3 12L4 11M11 4L12 3" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round"/></svg> },
      ].map(opt => {
        const active = theme === opt.value
        return (
          <button key={opt.value} onClick={() => { if (!active) toggle() }}
            className="t-nav flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-medium transition-all"
            style={active
              ? { background: 'var(--accent-bg)', color: 'var(--accent)', border: '1px solid var(--accent-border)' }
              : { color: 'var(--text-muted)', border: '1px solid transparent' }
            }>
            {opt.icon}{opt.label}
          </button>
        )
      })}
    </div>
  )
}

export default function Settings() {
  const { user } = useAuth()
  return (
    <div className="flex-1 flex flex-col min-h-0" style={{ background: 'var(--bg-base)' }}>
      <Header title="Settings" subtitle="Platform configuration and preferences" />
      <div className="flex-1 overflow-y-auto p-8">
        <div className="max-w-2xl flex flex-col gap-5">

          <Section title="Account" desc="Your profile and access level">
            <Row label="Display Name" desc="Shown across the platform">
              <span className="t-body-sm" style={{ color: 'var(--text-muted)' }}>{user?.name}</span>
            </Row>
            <Row label="Role" desc="Determines your access permissions">
              <span className={`t-micro font-semibold px-2.5 py-1 rounded-md border capitalize ${
                user?.role === 'admin' ? 'text-violet-400 bg-violet-400/[0.1] border-violet-400/20' : 'text-blue-400 bg-blue-400/[0.1] border-blue-400/20'
              }`}>{user?.role}</span>
            </Row>
            <Row label="Session" desc="Current authentication session">
              <span className="t-micro font-semibold text-emerald-400 bg-emerald-400/[0.08] border border-emerald-400/20 px-2.5 py-1 rounded-md">Active</span>
            </Row>
          </Section>

          <Section title="Appearance" desc="Customize the look of the platform">
            <Row label="Theme" desc="Switch between dark and light interface">
              <ThemeToggle />
            </Row>
          </Section>

          <Section title="Platform" desc="Data and display preferences">
            <Row label="Data Refresh Rate" desc="How often live sensor readings update">
              <select className="t-nav rounded-lg px-3 py-1.5 outline-none cursor-pointer"
                style={{ background: 'var(--bg-elevated)', border: '1px solid var(--border)', color: 'var(--text-secondary)' }}>
                <option>3 seconds</option>
                <option>5 seconds</option>
                <option>10 seconds</option>
              </select>
            </Row>
            <Row label="Alert Notifications" desc="Toast alerts for device status changes">
              <div className="w-9 h-5 rounded-full relative cursor-pointer flex-shrink-0" style={{ background: 'var(--accent)' }}>
                <div className="absolute right-0.5 top-0.5 w-4 h-4 rounded-full bg-white shadow-sm" />
              </div>
            </Row>
          </Section>

          <Section title="About">
            <Row label="Platform Version">
              <span className="t-body-sm font-mono" style={{ color: 'var(--text-muted)' }}>v1.0.0</span>
            </Row>
            <Row label="Product">
              <span className="t-body-sm" style={{ color: 'var(--text-muted)' }}>Viotel IoT Platform</span>
            </Row>
            <Row label="Environment">
              <span className="t-micro font-semibold font-mono px-2.5 py-1 rounded-md"
                style={{ color: 'var(--accent)', background: 'var(--accent-bg)', border: '1px solid var(--accent-border)' }}>
                Production
              </span>
            </Row>
          </Section>
        </div>
      </div>
    </div>
  )
}

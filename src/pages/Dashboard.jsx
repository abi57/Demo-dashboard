import { useNavigate } from 'react-router-dom'
import Header from '../components/Header'
import SummaryCard from '../components/SummaryCard'
import StatusBadge from '../components/StatusBadge'
import { useAppData } from '../context/AppDataContext'
import { useAuth } from '../context/AuthContext'

export default function Dashboard() {
  const { installations, devices } = useAppData()
  const { user } = useAuth()
  const navigate = useNavigate()

  const confirmed = installations.filter(i => i.status === 'Confirmed').length
  const pending   = installations.filter(i => i.status === 'Pending').length
  const online    = devices.filter(d => d.status === 'Online').length
  const sites     = [...new Set(installations.map(i => i.siteOwner))].length
  const recent    = installations.slice(0, 5)

  const systemAlerts = [
    { id: 1, type: 'warning', msg: 'INS-004: Secure fixing not confirmed', site: 'Kano South Grid' },
    { id: 2, type: 'info',    msg: 'INS-002: Data flow pending verification', site: 'Accra North Station' },
    { id: 3, type: 'success', msg: 'INS-003: All systems nominal', site: 'Nairobi Belt Tower' },
  ]

  const alertMeta = {
    warning: { bar: '#fbbf24', text: '#fbbf24', bg: 'rgba(251,191,36,0.06)',  border: 'rgba(251,191,36,0.15)' },
    info:    { bar: '#60a5fa', text: '#60a5fa', bg: 'rgba(96,165,250,0.06)',  border: 'rgba(96,165,250,0.15)' },
    success: { bar: '#34d399', text: '#34d399', bg: 'rgba(52,211,153,0.06)',  border: 'rgba(52,211,153,0.15)' },
  }

  const hour = new Date().getHours()
  const greeting = hour < 12 ? 'Good morning' : hour < 17 ? 'Good afternoon' : 'Good evening'

  return (
    <div className="flex-1 flex flex-col min-h-0 transition-colors duration-200" style={{ background: 'var(--bg-base)' }}>
      <Header
        title="Dashboard"
        subtitle="System overview and recent activity"
        action={
          <button
            onClick={() => navigate('/installations/new')}
            className="flex items-center gap-2 px-4 py-2 rounded-lg text-[13px] font-semibold transition-all active:scale-[0.97]"
            style={{ background: 'var(--accent)', color: '#020617', boxShadow: '0 4px 14px rgba(34,211,238,0.25)' }}
          >
            <svg width="11" height="11" viewBox="0 0 11 11" fill="none"><path d="M5.5 1V10M1 5.5H10" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/></svg>
            New Installation
          </button>
        }
      />

      <div className="flex-1 overflow-y-auto p-8 flex flex-col gap-8">

        {/* Welcome */}
        <div className="flex items-center justify-between flex-wrap gap-3">
          <div>
            <h2 className="text-[20px] font-semibold tracking-tight" style={{ color: 'var(--text-primary)' }}>
              {greeting}, {user?.name?.split(' ')[0]}
            </h2>
            <p className="text-[13px] mt-0.5" style={{ color: 'var(--text-muted)' }}>
              Here's what's happening across your network today.
            </p>
          </div>
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg"
            style={{ background: 'var(--bg-surface)', border: '1px solid var(--border)' }}>
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            <span className="text-[11px]" style={{ color: 'var(--text-muted)' }}>
              Live · {new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}
            </span>
          </div>
        </div>

        {/* KPIs */}
        <div className="grid grid-cols-2 xl:grid-cols-4 gap-4">
          <SummaryCard label="Total Installations" value={installations.length} icon="📋" color="cyan"    trend={`${confirmed} confirmed`} />
          <SummaryCard label="Online Devices"       value={online}              icon="◉"  color="emerald" trend="Live monitoring" />
          <SummaryCard label="Pending Review"       value={pending}             icon="⏳" color="amber"   trend="Awaiting confirmation" />
          <SummaryCard label="Active Sites"         value={sites}               icon="⬡"  color="blue"    trend="Across all regions" />
        </div>

        {/* Main grid */}
        <div className="grid grid-cols-1 xl:grid-cols-[1fr_320px] gap-6">

          {/* Recent installs table */}
          <div className="rounded-2xl overflow-hidden" style={{ background: 'var(--bg-surface)', border: '1px solid var(--border)' }}>
            <div className="px-6 py-4 flex items-center justify-between" style={{ borderBottom: '1px solid var(--border)' }}>
              <div>
                <h3 className="font-semibold text-[13px]" style={{ color: 'var(--text-primary)' }}>Recent Installations</h3>
                <p className="text-[11px] mt-0.5" style={{ color: 'var(--text-faint)' }}>Latest field deployment records</p>
              </div>
              <button onClick={() => navigate('/install-records')}
                className="text-[11px] flex items-center gap-1 transition-colors"
                style={{ color: 'var(--accent)' }}>
                View all →
              </button>
            </div>
            <table className="w-full">
              <thead>
                <tr style={{ borderBottom: '1px solid var(--border-soft)' }}>
                  {['Record ID', 'Date', 'Engineer', 'Tower', 'Status'].map(h => (
                    <th key={h} className="text-left px-6 py-3 text-[10px] font-semibold uppercase tracking-[0.08em]"
                      style={{ color: 'var(--text-faint)' }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {recent.map(r => (
                  <tr key={r.id}
                    onClick={() => navigate(`/install-records/${r.id}`)}
                    className="cursor-pointer transition-colors"
                    style={{ borderBottom: '1px solid var(--border-soft)' }}
                    onMouseEnter={e => e.currentTarget.style.background = 'var(--bg-hover)'}
                    onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                  >
                    <td className="px-6 py-3.5">
                      <span className="font-mono text-[11px] font-medium" style={{ color: 'var(--accent)' }}>{r.id}</span>
                    </td>
                    <td className="px-6 py-3.5">
                      <span className="text-[12px]" style={{ color: 'var(--text-faint)' }}>{r.date}</span>
                    </td>
                    <td className="px-6 py-3.5">
                      <span className="text-[13px]" style={{ color: 'var(--text-secondary)' }}>{r.installer}</span>
                    </td>
                    <td className="px-6 py-3.5">
                      <span className="font-mono text-[11px]" style={{ color: 'var(--text-faint)' }}>{r.towerId}</span>
                    </td>
                    <td className="px-6 py-3.5"><StatusBadge status={r.status} /></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Right column */}
          <div className="flex flex-col gap-4">
            {/* Alerts */}
            <div className="rounded-2xl overflow-hidden" style={{ background: 'var(--bg-surface)', border: '1px solid var(--border)' }}>
              <div className="px-5 py-4 flex items-center justify-between" style={{ borderBottom: '1px solid var(--border)' }}>
                <h3 className="font-semibold text-[13px]" style={{ color: 'var(--text-primary)' }}>System Alerts</h3>
                <span className="text-[10px] font-medium px-2 py-0.5 rounded-md"
                  style={{ background: 'var(--bg-elevated)', color: 'var(--text-faint)', border: '1px solid var(--border)' }}>
                  {systemAlerts.length} active
                </span>
              </div>
              <div className="p-4 flex flex-col gap-2">
                {systemAlerts.map(a => {
                  const m = alertMeta[a.type]
                  return (
                    <div key={a.id} className="relative rounded-xl overflow-hidden p-3.5"
                      style={{ background: m.bg, border: `1px solid ${m.border}` }}>
                      <div className="absolute left-0 top-0 bottom-0 w-[3px]" style={{ background: m.bar }} />
                      <div className="pl-2">
                        <p className="text-[12px] font-medium" style={{ color: m.text }}>{a.msg}</p>
                        <p className="text-[11px] mt-0.5" style={{ color: 'var(--text-faint)' }}>{a.site}</p>
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>

            {/* Quick devices */}
            <div className="rounded-2xl overflow-hidden" style={{ background: 'var(--bg-surface)', border: '1px solid var(--border)' }}>
              <div className="px-5 py-4" style={{ borderBottom: '1px solid var(--border)' }}>
                <h3 className="font-semibold text-[13px]" style={{ color: 'var(--text-primary)' }}>Quick Device Access</h3>
              </div>
              <div className="p-3 flex flex-col gap-1.5">
                {devices.slice(0, 4).map(d => (
                  <button key={d.id} onClick={() => navigate(`/devices/${d.id}`)}
                    className="flex items-center justify-between px-3.5 py-3 rounded-xl text-left transition-all"
                    style={{ background: 'var(--bg-elevated)', border: '1px solid var(--border)' }}
                    onMouseEnter={e => e.currentTarget.style.borderColor = 'var(--accent-border)'}
                    onMouseLeave={e => e.currentTarget.style.borderColor = 'var(--border)'}
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-7 h-7 rounded-lg flex items-center justify-center text-[10px]"
                        style={{ background: 'var(--accent-bg)', border: '1px solid var(--accent-border)', color: 'var(--accent)' }}>◉</div>
                      <div>
                        <p className="text-[12px] font-medium font-mono" style={{ color: 'var(--text-secondary)' }}>{d.serial}</p>
                        <p className="text-[10px]" style={{ color: 'var(--text-faint)' }}>{d.tower}</p>
                      </div>
                    </div>
                    <StatusBadge status={d.status} pulse={d.status === 'Online'} />
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

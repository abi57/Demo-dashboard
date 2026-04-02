import Header from '../components/Header'
import StatusBadge from '../components/StatusBadge'
import { useAppData } from '../context/AppDataContext'

const Panel = ({ title, children }) => (
  <div className="rounded-xl overflow-hidden" style={{ background: 'var(--bg-surface)', border: '1px solid var(--border)' }}>
    <div className="px-5 py-4" style={{ borderBottom: '1px solid var(--border)' }}>
      <h4 style={{ color: 'var(--text-primary)' }}>{title}</h4>
    </div>
    <div className="px-5 py-3">{children}</div>
  </div>
)

export default function Reports() {
  const { installations } = useAppData()

  const byCompany = Object.entries(
    installations.reduce((acc, i) => { acc[i.company] = (acc[i.company] ?? 0) + 1; return acc }, {})
  ).sort((a, b) => b[1] - a[1])

  const bySite = Object.entries(
    installations.reduce((acc, i) => { acc[i.siteOwner] = (acc[i.siteOwner] ?? 0) + 1; return acc }, {})
  ).sort((a, b) => b[1] - a[1])

  const byStatus = Object.entries(
    installations.reduce((acc, i) => { acc[i.status] = (acc[i.status] ?? 0) + 1; return acc }, {})
  )

  const confirmed = installations.filter(i => i.secureFixing && i.dataFlowConfirmed).length

  const BarRow = ({ label, count, total, accent }) => (
    <div className="flex items-center gap-3 py-2.5" style={{ borderBottom: '1px solid var(--border-soft)' }}>
      <p className="t-body-sm flex-1 truncate" style={{ color: 'var(--text-secondary)' }}>{label}</p>
      <div className="w-24 h-1.5 rounded-full overflow-hidden" style={{ background: 'var(--bg-elevated)' }}>
        <div className="h-full rounded-full transition-all" style={{ width: `${(count / total) * 100}%`, background: accent }} />
      </div>
      <span className="t-body-sm font-semibold w-4 text-right" style={{ color: accent }}>{count}</span>
    </div>
  )

  const kpis = [
    { label: 'Total Installations', value: installations.length, accent: 'var(--accent)' },
    { label: 'Fully Confirmed',      value: confirmed,            accent: '#34d399' },
    { label: 'Companies',            value: byCompany.length,     accent: '#a78bfa' },
    { label: 'Site Owners',          value: bySite.length,        accent: '#60a5fa' },
  ]

  return (
    <div className="flex-1 flex flex-col min-h-0" style={{ background: 'var(--bg-base)' }}>
      <Header
        title="Reports"
        subtitle="Installation and deployment analytics"
        action={
          <button
            onClick={() => window.print()}
            className="t-nav flex items-center gap-2 px-4 py-2 rounded-lg transition-all"
            style={{ border: '1px solid var(--border)', color: 'var(--text-muted)', background: 'var(--bg-elevated)' }}
            onMouseEnter={e => e.currentTarget.style.color = 'var(--text-primary)'}
            onMouseLeave={e => e.currentTarget.style.color = 'var(--text-muted)'}
          >
            <svg width="13" height="13" viewBox="0 0 15 15" fill="none">
              <rect x="3" y="1" width="9" height="10" rx="1" stroke="currentColor" strokeWidth="1.3"/>
              <path d="M1 8H14V13H1V8Z" stroke="currentColor" strokeWidth="1.3" strokeLinejoin="round"/>
              <path d="M5 11H10" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round"/>
            </svg>
            Export
          </button>
        }
      />
      <div className="flex-1 overflow-y-auto p-8 flex flex-col gap-6">

        {/* KPIs */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {kpis.map(s => (
            <div key={s.label} className="rounded-xl p-5"
              style={{ background: 'var(--bg-surface)', border: `1px solid ${s.accent}25` }}>
              <p className="t-label mb-3" style={{ color: 'var(--text-faint)' }}>{s.label}</p>
              <p className="t-data-xl" style={{ color: s.accent }}>{s.value}</p>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
          <Panel title="By Company">
            {byCompany.map(([company, count]) => (
              <BarRow key={company} label={company} count={count} total={installations.length} accent="var(--accent)" />
            ))}
          </Panel>
          <Panel title="By Site Owner">
            {bySite.map(([site, count]) => (
              <BarRow key={site} label={site} count={count} total={installations.length} accent="#a78bfa" />
            ))}
          </Panel>
          <Panel title="By Status">
            {byStatus.map(([status, count]) => (
              <div key={status} className="flex items-center justify-between py-2.5" style={{ borderBottom: '1px solid var(--border-soft)' }}>
                <StatusBadge status={status} />
                <span className="t-body-sm font-semibold" style={{ color: 'var(--text-secondary)' }}>{count}</span>
              </div>
            ))}
          </Panel>
        </div>

        {/* Full table */}
        <div className="rounded-xl overflow-hidden" style={{ background: 'var(--bg-surface)', border: '1px solid var(--border)' }}>
          <div className="px-6 py-4" style={{ borderBottom: '1px solid var(--border)' }}>
            <h4 style={{ color: 'var(--text-primary)' }}>All Installations</h4>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr style={{ borderBottom: '1px solid var(--border)', background: 'var(--bg-elevated)' }}>
                  {['ID', 'Date', 'Engineer', 'Company', 'Site Owner', 'Tower', 'Height', 'Status'].map(h => (
                    <th key={h} className="text-left px-5 py-3 whitespace-nowrap">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {installations.map(r => (
                  <tr key={r.id} style={{ borderBottom: '1px solid var(--border-soft)' }}>
                    <td className="px-5 py-3.5">
                      <span className="t-micro font-mono font-semibold" style={{ color: 'var(--accent)' }}>{r.id}</span>
                    </td>
                    <td className="px-5 py-3.5 t-caption" style={{ color: 'var(--text-faint)' }}>{r.date}</td>
                    <td className="px-5 py-3.5 t-body-sm font-medium" style={{ color: 'var(--text-primary)' }}>{r.installer}</td>
                    <td className="px-5 py-3.5 t-body-sm" style={{ color: 'var(--text-muted)' }}>{r.company}</td>
                    <td className="px-5 py-3.5 t-body-sm" style={{ color: 'var(--text-muted)' }}>{r.siteOwner}</td>
                    <td className="px-5 py-3.5">
                      <span className="t-micro font-mono" style={{ color: 'var(--text-muted)' }}>{r.towerId}</span>
                    </td>
                    <td className="px-5 py-3.5 t-body-sm" style={{ color: 'var(--text-muted)' }}>{r.installHeight}m</td>
                    <td className="px-5 py-3.5"><StatusBadge status={r.status} /></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  )
}

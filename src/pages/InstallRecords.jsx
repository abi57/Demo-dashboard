import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Header from '../components/Header'
import StatusBadge from '../components/StatusBadge'
import { useAppData } from '../context/AppDataContext'

const T = {
  page:    { background: 'var(--bg-base)' },
  surface: { background: 'var(--bg-surface)', border: '1px solid var(--border)' },
  elevated:{ background: 'var(--bg-elevated)', border: '1px solid var(--border)' },
  input:   { background: 'var(--bg-elevated)', border: '1px solid var(--border)', color: 'var(--text-secondary)' },
}

export default function InstallRecords() {
  const { installations } = useAppData()
  const navigate = useNavigate()
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState('All')

  const filtered = installations.filter(r => {
    const q = search.toLowerCase()
    const matchSearch = !q || [r.id, r.installer, r.company, r.siteOwner, r.towerId, r.sensorSerial]
      .some(v => v?.toLowerCase().includes(q))
    const matchStatus = statusFilter === 'All' || r.status === statusFilter
    return matchSearch && matchStatus
  })

  const counts = ['Confirmed', 'Pending', 'Warning'].reduce((acc, s) => {
    acc[s] = installations.filter(i => i.status === s).length
    return acc
  }, {})

  const filterBtns = [
    { label: 'All',       count: installations.length, accent: null },
    { label: 'Confirmed', count: counts.Confirmed,     accent: '#34d399' },
    { label: 'Pending',   count: counts.Pending,       accent: '#fbbf24' },
    { label: 'Warning',   count: counts.Warning,       accent: '#f87171' },
  ]

  return (
    <div className="flex-1 flex flex-col min-h-0 transition-colors duration-200" style={T.page}>
      <Header
        title="Install Records"
        subtitle={`${installations.length} total installation records`}
        action={
          <button
            onClick={() => navigate('/installations/new')}
            className="flex items-center gap-2 px-4 py-2 rounded-lg text-[13px] font-semibold transition-all active:scale-[0.97]"
            style={{ background: 'var(--accent)', color: '#020617', boxShadow: '0 4px 14px rgba(34,211,238,0.2)' }}
          >
            <svg width="11" height="11" viewBox="0 0 11 11" fill="none"><path d="M5.5 1V10M1 5.5H10" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/></svg>
            New
          </button>
        }
      />
      <div className="flex-1 overflow-y-auto p-8 flex flex-col gap-6">

        {/* Filter + search bar */}
        <div className="flex items-center gap-3 flex-wrap">
          {filterBtns.map(f => {
            const isActive = statusFilter === f.label
            return (
              <button
                key={f.label}
                onClick={() => setStatusFilter(f.label)}
                className="flex items-center gap-2 px-3.5 py-2 rounded-lg text-[12px] font-medium transition-all"
                style={isActive
                  ? { background: f.accent ? `${f.accent}15` : 'var(--bg-active)', color: f.accent ?? 'var(--text-primary)', border: `1px solid ${f.accent ? f.accent + '40' : 'var(--border)'}` }
                  : { background: 'transparent', color: 'var(--text-muted)', border: '1px solid var(--border)' }
                }
              >
                {f.label}
                <span className="text-[10px] opacity-60">{f.count}</span>
              </button>
            )
          })}
          <div className="flex-1" />
          <div className="relative">
            <svg className="absolute left-3 top-1/2 -translate-y-1/2" width="13" height="13" viewBox="0 0 15 15" fill="none" style={{ color: 'var(--text-faint)' }}>
              <circle cx="6.5" cy="6.5" r="5" stroke="currentColor" strokeWidth="1.3"/>
              <path d="M10.5 10.5L13.5 13.5" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round"/>
            </svg>
            <input
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Search records…"
              className="rounded-lg pl-9 pr-4 py-2 text-[13px] outline-none transition-all w-56"
              style={T.input}
              onFocus={e => e.target.style.borderColor = 'var(--accent-border)'}
              onBlur={e => e.target.style.borderColor = 'var(--border)'}
            />
          </div>
        </div>

        {/* Table */}
        <div className="rounded-2xl overflow-hidden" style={T.surface}>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr style={{ borderBottom: '1px solid var(--border)', background: 'var(--bg-elevated)' }}>
                  {['Record ID', 'Date', 'Engineer', 'Company', 'Site Owner', 'Tower ID', 'Serial', 'Height', 'Status'].map(h => (
                    <th key={h} className="text-left px-5 py-3.5 text-[10px] font-semibold uppercase tracking-[0.08em] whitespace-nowrap"
                      style={{ color: 'var(--text-faint)' }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filtered.length === 0 ? (
                  <tr>
                    <td colSpan={9} className="text-center py-16 text-[13px]" style={{ color: 'var(--text-faint)' }}>
                      No records match your search
                    </td>
                  </tr>
                ) : filtered.map(row => (
                  <tr
                    key={row.id}
                    onClick={() => navigate(`/install-records/${row.id}`)}
                    className="cursor-pointer transition-colors"
                    style={{ borderBottom: '1px solid var(--border-soft)' }}
                    onMouseEnter={e => e.currentTarget.style.background = 'var(--bg-hover)'}
                    onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                  >
                    <td className="px-5 py-3.5"><span className="font-mono text-[11px] font-medium" style={{ color: 'var(--accent)' }}>{row.id}</span></td>
                    <td className="px-5 py-3.5"><span className="text-[12px]" style={{ color: 'var(--text-faint)' }}>{row.date}</span></td>
                    <td className="px-5 py-3.5"><span className="text-[13px]" style={{ color: 'var(--text-secondary)' }}>{row.installer}</span></td>
                    <td className="px-5 py-3.5"><span className="text-[12px]" style={{ color: 'var(--text-muted)' }}>{row.company}</span></td>
                    <td className="px-5 py-3.5"><span className="text-[12px]" style={{ color: 'var(--text-muted)' }}>{row.siteOwner}</span></td>
                    <td className="px-5 py-3.5"><span className="font-mono text-[11px]" style={{ color: 'var(--text-muted)' }}>{row.towerId}</span></td>
                    <td className="px-5 py-3.5"><span className="font-mono text-[11px]" style={{ color: 'var(--text-muted)' }}>{row.sensorSerial}</span></td>
                    <td className="px-5 py-3.5"><span className="text-[12px]" style={{ color: 'var(--text-muted)' }}>{row.installHeight}m</span></td>
                    <td className="px-5 py-3.5"><StatusBadge status={row.status} /></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="px-5 py-3" style={{ borderTop: '1px solid var(--border-soft)' }}>
            <p className="text-[11px]" style={{ color: 'var(--text-faint)' }}>{filtered.length} of {installations.length} records</p>
          </div>
        </div>
      </div>
    </div>
  )
}

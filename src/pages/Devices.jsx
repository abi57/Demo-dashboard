import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Header from '../components/Header'
import StatusBadge from '../components/StatusBadge'
import { useAppData } from '../context/AppDataContext'

const TYPE_META = {
  environmental: { icon: '🌡️', label: 'Environmental', accent: '#fbbf24' },
  asset:         { icon: '📡', label: 'Asset',          accent: '#60a5fa' },
  safety:        { icon: '🛡️', label: 'Safety',         accent: '#a78bfa' },
}

export default function Devices() {
  const { devices } = useAppData()
  const navigate = useNavigate()
  const [search, setSearch] = useState('')

  const filtered = devices.filter(d => {
    const q = search.toLowerCase()
    return !q || [d.serial, d.site, d.tower, d.installer].some(v => v?.toLowerCase().includes(q))
  })

  return (
    <div className="flex-1 flex flex-col min-h-0" style={{ background: 'var(--bg-base)' }}>
      <Header title="Devices & Sensors" subtitle={`${devices.length} registered devices across all sites`} />
      <div className="flex-1 overflow-y-auto p-8 flex flex-col gap-6">

        <div className="flex items-center gap-4">
          <div className="relative">
            <svg className="absolute left-3 top-1/2 -translate-y-1/2" width="13" height="13" viewBox="0 0 15 15" fill="none" style={{ color: 'var(--text-faint)' }}>
              <circle cx="6.5" cy="6.5" r="5" stroke="currentColor" strokeWidth="1.3"/>
              <path d="M10.5 10.5L13.5 13.5" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round"/>
            </svg>
            <input
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Search devices…"
              className="t-nav rounded-lg pl-9 pr-4 py-2 outline-none transition-all w-56"
              style={{ background: 'var(--bg-elevated)', border: '1px solid var(--border)', color: 'var(--text-secondary)' }}
              onFocus={e => e.target.style.borderColor = 'var(--accent-border)'}
              onBlur={e => e.target.style.borderColor = 'var(--border)'}
            />
          </div>
          <span className="t-caption" style={{ color: 'var(--text-faint)' }}>{filtered.length} results</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
          {filtered.map(d => {
            const meta = TYPE_META[d.deviceType] ?? TYPE_META.environmental
            return (
              <div
                key={d.id}
                onClick={() => navigate(`/devices/${d.id}`)}
                className="rounded-xl p-5 cursor-pointer transition-all group"
                style={{ background: 'var(--bg-surface)', border: '1px solid var(--border)' }}
                onMouseEnter={e => { e.currentTarget.style.borderColor = 'var(--accent-border)'; e.currentTarget.style.background = 'var(--bg-elevated)' }}
                onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--border)'; e.currentTarget.style.background = 'var(--bg-surface)' }}
              >
                <div className="flex items-start justify-between mb-5">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl flex items-center justify-center text-lg flex-shrink-0"
                      style={{ background: `${meta.accent}12`, border: `1px solid ${meta.accent}25` }}>
                      {meta.icon}
                    </div>
                    <div>
                      <p className="t-body-sm font-semibold font-mono" style={{ color: 'var(--text-primary)' }}>{d.serial}</p>
                      <p className="t-caption mt-0.5" style={{ color: 'var(--text-muted)' }}>{d.site}</p>
                    </div>
                  </div>
                  <StatusBadge status={d.status} pulse={d.status === 'Online'} />
                </div>

                <div className="grid grid-cols-2 gap-x-4 gap-y-3 mb-4">
                  {[
                    { label: 'Tower',     value: d.tower },
                    { label: 'Installed', value: d.installDate },
                    { label: 'Engineer',  value: d.installer },
                    { label: 'Health',    value: d.health },
                  ].map(f => (
                    <div key={f.label}>
                      <p className="t-label mb-1" style={{ color: 'var(--text-xfaint)' }}>{f.label}</p>
                      <p className="t-caption" style={{ color: 'var(--text-muted)' }}>{f.value}</p>
                    </div>
                  ))}
                </div>

                <div className="flex items-center justify-between pt-3.5" style={{ borderTop: '1px solid var(--border-soft)' }}>
                  <span className="t-micro px-2 py-0.5 rounded-md font-medium"
                    style={{ color: meta.accent, background: `${meta.accent}12`, border: `1px solid ${meta.accent}25` }}>
                    {meta.label}
                  </span>
                  <span className="t-caption opacity-0 group-hover:opacity-100 transition-opacity" style={{ color: 'var(--accent)' }}>
                    View dashboard →
                  </span>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}

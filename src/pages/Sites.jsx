import { useNavigate } from 'react-router-dom'
import Header from '../components/Header'
import { useAppData } from '../context/AppDataContext'

export default function Sites() {
  const { sites, devices, installations } = useAppData()
  const navigate = useNavigate()

  return (
    <div className="flex-1 flex flex-col min-h-0 transition-colors duration-200" style={{ background: 'var(--bg-base)' }}>
      <Header title="Sites / Towers" subtitle={`${sites.length} registered sites`} />
      <div className="flex-1 overflow-y-auto p-8 flex flex-col gap-5">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
          {sites.map(site => {
            const siteDevices  = devices.filter(d => d.site === site.owner)
            const siteInstalls = installations.filter(i => i.siteOwner === site.owner)

            return (
              <div key={site.id} className="rounded-2xl overflow-hidden transition-all"
                style={{ background: 'var(--bg-surface)', border: '1px solid var(--border)' }}
                onMouseEnter={e => e.currentTarget.style.borderColor = 'var(--accent-border)'}
                onMouseLeave={e => e.currentTarget.style.borderColor = 'var(--border)'}
              >
                <div className="px-6 py-4 flex items-start justify-between" style={{ borderBottom: '1px solid var(--border)' }}>
                  <div>
                    <h3 className="font-semibold text-[14px]" style={{ color: 'var(--text-primary)' }}>{site.name}</h3>
                    <p className="text-[11px] mt-0.5" style={{ color: 'var(--text-muted)' }}>{site.owner} · {site.region}</p>
                  </div>
                  <span className="text-[10px] font-mono px-2 py-1 rounded-md"
                    style={{ color: 'var(--text-faint)', background: 'var(--bg-elevated)', border: '1px solid var(--border)' }}>
                    {site.id}
                  </span>
                </div>

                <div className="p-5">
                  <div className="grid grid-cols-3 gap-3 mb-5">
                    {[
                      { label: 'Towers',       value: site.towers.length, accent: 'var(--accent)' },
                      { label: 'Devices',      value: siteDevices.length, accent: 'var(--text-primary)' },
                      { label: 'Installations',value: siteInstalls.length,accent: '#34d399' },
                    ].map(s => (
                      <div key={s.label} className="rounded-xl px-3 py-3 text-center"
                        style={{ background: 'var(--bg-elevated)', border: '1px solid var(--border)' }}>
                        <p className="text-xl font-bold" style={{ color: s.accent }}>{s.value}</p>
                        <p className="text-[10px] uppercase tracking-wider mt-0.5" style={{ color: 'var(--text-faint)' }}>{s.label}</p>
                      </div>
                    ))}
                  </div>

                  <div className="flex flex-col gap-2">
                    {site.towers.map(t => {
                      const towerDevices = devices.filter(d => d.tower === t)
                      return (
                        <div key={t} className="flex items-center justify-between px-4 py-3 rounded-xl"
                          style={{ background: 'var(--bg-elevated)', border: '1px solid var(--border-soft)' }}>
                          <div className="flex items-center gap-2.5">
                            <svg width="13" height="13" viewBox="0 0 15 15" fill="none" style={{ color: 'var(--text-muted)' }}>
                              <path d="M7.5 1L13 4.5V10.5L7.5 14L2 10.5V4.5L7.5 1Z" stroke="currentColor" strokeWidth="1.3" strokeLinejoin="round"/>
                            </svg>
                            <span className="text-[12px] font-mono" style={{ color: 'var(--text-muted)' }}>{t}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <span className="text-[10px]" style={{ color: 'var(--text-faint)' }}>
                              {towerDevices.length} device{towerDevices.length !== 1 ? 's' : ''}
                            </span>
                            {towerDevices.map(d => (
                              <button key={d.id} onClick={() => navigate(`/devices/${d.id}`)}
                                className="text-[10px] font-mono px-2 py-0.5 rounded-md transition-all"
                                style={{ color: 'var(--accent)', border: '1px solid var(--accent-border)', background: 'var(--accent-bg)' }}
                                onMouseEnter={e => e.currentTarget.style.background = 'var(--accent-border)'}
                                onMouseLeave={e => e.currentTarget.style.background = 'var(--accent-bg)'}
                              >
                                {d.serial}
                              </button>
                            ))}
                          </div>
                        </div>
                      )
                    })}
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}

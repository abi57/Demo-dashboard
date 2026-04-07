import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { ChevronDown, ChevronRight } from 'lucide-react'
import AppShell from '../components/AppShell'
import SerialBadge from '../components/SerialBadge'
import StatusBadge from '../components/StatusBadge'
import { useApp } from '../context/AppContext'

export default function Sites() {
  const { sites, devices } = useApp()
  const navigate = useNavigate()
  const [expanded, setExpanded] = useState({})

  if (sites.length === 0) return (
    <AppShell title="Sites">
      <div style={{ textAlign: 'center', padding: 64 }}>
        <MapPin size={40} style={{ color: 'var(--vio-text-muted)', margin: '0 auto 16px', display: 'block' }} />
        <p style={{ fontSize: 18, color: 'var(--vio-text-muted)' }}>No sites yet.</p>
        <button className="vio-btn vio-btn-primary" style={{ marginTop: 16 }} onClick={() => navigate('/installations/new')}>Add first installation</button>
      </div>
    </AppShell>
  )

  return (
    <AppShell title="Sites">
      <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
        {sites.map(site => {
          const isOpen = expanded[site.siteOwner]
          const siteDevices = devices.filter(d => d.siteOwner === site.siteOwner)
          return (
            <div key={site.siteOwner} className="vio-card" style={{ padding: 0, overflow: 'hidden' }}>
              <button
                onClick={() => setExpanded(e => ({ ...e, [site.siteOwner]: !e[site.siteOwner] }))}
                style={{ width: '100%', display: 'flex', alignItems: 'center', gap: 12, padding: '16px 20px', background: 'none', border: 'none', cursor: 'pointer', textAlign: 'left' }}
              >
                {isOpen ? <ChevronDown size={16} color="var(--vio-text-muted)" /> : <ChevronRight size={16} color="var(--vio-text-muted)" />}
                <div style={{ flex: 1 }}>
                  <span style={{ fontSize: 16, fontWeight: 600, color: 'var(--vio-text-primary)' }}>{site.siteOwner}</span>
                  <span style={{ fontSize: 13, color: 'var(--vio-text-muted)', marginLeft: 12 }}>
                    {site.towers.length} tower{site.towers.length !== 1 ? 's' : ''} · {siteDevices.length} device{siteDevices.length !== 1 ? 's' : ''}
                  </span>
                </div>
                <div style={{ display: 'flex', gap: 6 }}>
                  {['online','degraded','alert'].map(s => {
                    const count = siteDevices.filter(d => d.status === s).length
                    return count > 0 ? <StatusBadge key={s} status={s} /> : null
                  })}
                </div>
              </button>

              {isOpen && (
                <div style={{ borderTop: '0.5px solid var(--vio-card-border)' }}>
                  {site.towers.map(tower => {
                    const towerDevices = devices.filter(d => d.towerId === tower.towerId)
                    return (
                      <div key={tower.towerId} style={{ display: 'flex', alignItems: 'center', gap: 16, padding: '12px 20px 12px 48px', borderBottom: '0.5px solid var(--vio-card-border)' }}>
                        <span className="vio-mono" style={{ fontSize: 13, fontWeight: 600, color: 'var(--vio-primary)', minWidth: 100 }}>{tower.towerId}</span>
                        <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', flex: 1 }}>
                          {tower.serials.map(s => <SerialBadge key={s} serial={s} />)}
                        </div>
                        <div style={{ display: 'flex', gap: 6 }}>
                          {towerDevices.map(d => <StatusBadge key={d.serial} status={d.status} />)}
                        </div>
                        <button className="vio-btn vio-btn-ghost vio-btn-sm" onClick={() => navigate(`/install-records/${tower.installationId}`)}>
                          View records
                        </button>
                      </div>
                    )
                  })}
                </div>
              )}
            </div>
          )
        })}
      </div>
    </AppShell>
  )
}

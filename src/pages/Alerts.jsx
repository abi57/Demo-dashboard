import { useState, Fragment } from 'react'
import { useViotel } from '../context/ViotelContext'
import { DEFAULT_THRESHOLDS, ASSETS } from '../data/viotelData'
import { useAlert } from '../context/AlertContext'

const SEV_BORDER = { critical: '#dc2626', warning: '#f59e0b', info: '#1b7a5e' }
const SEV_BG     = { critical: '#fef2f2', warning: '#fffbeb', info: '#f0fdf4' }

export default function Alerts() {
  const { alerts, acknowledgeAlert, lastSync } = useViotel()
  const { push } = useAlert()
  const [tab, setTab] = useState('feed')
  const [asset, setAsset] = useState(ASSETS[0].id)
  const [thresholds, setThresholds] = useState(DEFAULT_THRESHOLDS)
  const [errors, setErrors] = useState({})

  const syncStr = lastSync.toLocaleTimeString('en-AU', { hour: '2-digit', minute: '2-digit', second: '2-digit' })

  function updateT(i, field, val) {
    setThresholds(prev => prev.map((t, idx) => idx === i ? { ...t, [field]: val === '' ? null : Number(val) } : t))
    setErrors(prev => ({ ...prev, [i]: undefined }))
  }

  function saveThresholds() {
    const e = {}
    thresholds.forEach((t, i) => {
      if (t.warnHigh !== null && t.critHigh !== null && t.critHigh <= t.warnHigh) e[i] = 'Critical high must exceed warning high'
      if (t.warnLow !== null && t.critLow !== null && t.critLow >= t.warnLow) e[i] = 'Critical low must be below warning low'
    })
    if (Object.keys(e).length) { setErrors(e); return }
    push('Thresholds saved successfully', 'success')
  }

  const tabStyle = (active) => ({
    padding: '8px 16px', borderRadius: 6, fontSize: 13, fontWeight: active ? 500 : 400,
    color: active ? '#0b3d4a' : '#6b7280', background: active ? '#e8f4f6' : 'transparent',
    border: 'none', cursor: 'pointer',
  })

  return (
    <div style={{ padding: '20px 24px 32px', background: '#f4f7f8', minHeight: '100vh' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 4, marginBottom: 20 }}>
        <button style={tabStyle(tab === 'feed')} onClick={() => setTab('feed')}>Alert Feed</button>
        <button style={tabStyle(tab === 'thresholds')} onClick={() => setTab('thresholds')}>Threshold Config</button>
        <button style={tabStyle(tab === 'notifications')} onClick={() => setTab('notifications')}>Notifications</button>
      </div>

      {tab === 'feed' && (
        <div style={{ maxWidth: 680 }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
            <h2 style={{ fontSize: 15, fontWeight: 500, color: '#0b3d4a', margin: 0 }}>Active Alerts</h2>
            <span style={{ fontSize: 11, color: '#9ca3af' }}>Refreshed {syncStr}</span>
          </div>
          {alerts.filter(a => !a.ack).length === 0 ? (
            <div className="vt-card" style={{ padding: '40px', textAlign: 'center' }}>
              <div style={{ fontSize: 28, marginBottom: 8 }}>✅</div>
              <p style={{ fontSize: 14, fontWeight: 500, color: '#16a34a' }}>No active alerts</p>
              <p style={{ fontSize: 12, color: '#9ca3af', marginTop: 4 }}>All nodes operating within thresholds</p>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {alerts.map(a => (
                <div key={a.id} style={{
                  display: 'flex', alignItems: 'flex-start', gap: 12, padding: '12px 16px',
                  borderRadius: 8, background: a.ack ? '#fafafa' : SEV_BG[a.severity],
                  border: '0.5px solid #dde4e7', borderLeft: `3px solid ${SEV_BORDER[a.severity]}`,
                  opacity: a.ack ? 0.5 : 1,
                }}>
                  <div style={{ flex: 1 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
                      <span style={{ fontFamily: 'ui-monospace,monospace', fontSize: 12, fontWeight: 500, color: '#0b3d4a' }}>{a.node}</span>
                      <span style={{ fontSize: 12, color: '#374151' }}>{a.metric}</span>
                      <span style={{ fontSize: 12, fontWeight: 500, color: SEV_BORDER[a.severity] }}>{a.value}</span>
                      <span style={{ fontSize: 11, color: '#9ca3af' }}>/ {a.threshold}</span>
                    </div>
                    <p style={{ fontSize: 11, color: '#9ca3af', marginTop: 3 }}>{a.time}</p>
                  </div>
                  {!a.ack && (
                    <button className="vt-btn vt-btn-ghost" style={{ height: 26, padding: '0 10px', fontSize: 11, flexShrink: 0 }}
                      onClick={() => acknowledgeAlert(a.id)}>Acknowledge</button>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {tab === 'thresholds' && (
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 16 }}>
            <label style={{ fontSize: 12, fontWeight: 500, color: '#6b7280' }}>Apply to asset</label>
            <select className="vt-input" style={{ maxWidth: 260 }} value={asset} onChange={e => setAsset(e.target.value)}>
              {ASSETS.map(a => <option key={a.id} value={a.id}>{a.name}</option>)}
            </select>
          </div>
          <div className="vt-card" style={{ overflow: 'hidden', marginBottom: 16 }}>
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                  <tr style={{ background: '#f4f7f8' }}>
                    {['Metric', 'Unit', 'Warn Low', 'Warn High', 'Critical Low', 'Critical High', 'Enabled'].map(h => (
                      <th key={h} style={{ padding: '9px 12px', textAlign: 'left', fontSize: 10, fontWeight: 500, letterSpacing: '0.08em', textTransform: 'uppercase', color: '#9ca3af', borderBottom: '0.5px solid #dde4e7', whiteSpace: 'nowrap' }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {thresholds.map((t, i) => (
                    <Fragment key={t.metric}>
                      <tr style={{ background: i % 2 === 0 ? '#fff' : '#fafcfc', borderBottom: errors[i] ? 'none' : '0.5px solid #f0f4f5' }}>
                        <td style={{ padding: '9px 12px', fontSize: 13, fontWeight: 500, color: '#0f2027' }}>{t.metric}</td>
                        <td style={{ padding: '9px 12px', fontFamily: 'ui-monospace,monospace', fontSize: 11, color: '#9ca3af' }}>{t.unit}</td>
                        {['warnLow', 'warnHigh', 'critLow', 'critHigh'].map(f => (
                          <td key={f} style={{ padding: '9px 12px' }}>
                            <input type="number" className="vt-input" style={{ width: 80, textAlign: 'right', height: 30, fontSize: 12 }}
                              value={t[f] ?? ''} onChange={e => updateT(i, f, e.target.value)} placeholder="—" />
                          </td>
                        ))}
                        <td style={{ padding: '9px 12px' }}>
                          <button onClick={() => setThresholds(prev => prev.map((th, idx) => idx === i ? { ...th, enabled: !th.enabled } : th))}
                            style={{ width: 36, height: 20, borderRadius: 99, border: 'none', cursor: 'pointer', background: t.enabled ? '#0b3d4a' : '#d1d5db', position: 'relative', transition: 'background 0.2s' }}>
                            <span style={{ position: 'absolute', top: 2, width: 16, height: 16, borderRadius: '50%', background: '#fff', left: t.enabled ? 18 : 2, transition: 'left 0.2s' }} />
                          </button>
                        </td>
                      </tr>
                      {errors[i] && (
                        <tr style={{ background: '#fef2f2' }}>
                          <td colSpan={7} style={{ padding: '4px 12px 8px', fontSize: 11, color: '#dc2626', borderBottom: '0.5px solid #f0f4f5' }}>⚠ {errors[i]}</td>
                        </tr>
                      )}
                    </Fragment>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: 12 }}>
            <button onClick={() => { setThresholds(DEFAULT_THRESHOLDS); setErrors({}) }} style={{ background: 'none', border: 'none', fontSize: 13, color: '#6b7280', cursor: 'pointer', textDecoration: 'underline' }}>Reset to defaults</button>
            <button className="vt-btn vt-btn-primary" onClick={saveThresholds}>Save thresholds</button>
          </div>
        </div>
      )}

      {tab === 'notifications' && (
        <div className="vt-card" style={{ padding: '24px', maxWidth: 560 }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
            <div>
              <label style={{ fontSize: 11, fontWeight: 500, letterSpacing: '0.08em', textTransform: 'uppercase', color: '#9ca3af', display: 'block', marginBottom: 6 }}>Email recipients</label>
              <input className="vt-input" placeholder="engineer@company.com, team@company.com" />
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <label style={{ fontSize: 12, fontWeight: 500, color: '#374151' }}>SMS alerts</label>
              <button style={{ width: 36, height: 20, borderRadius: 99, border: 'none', cursor: 'pointer', background: '#d1d5db', position: 'relative' }}>
                <span style={{ position: 'absolute', top: 2, left: 2, width: 16, height: 16, borderRadius: '50%', background: '#fff' }} />
              </button>
            </div>
            <div>
              <label style={{ fontSize: 11, fontWeight: 500, letterSpacing: '0.08em', textTransform: 'uppercase', color: '#9ca3af', display: 'block', marginBottom: 8 }}>Minimum severity to notify</label>
              <div style={{ display: 'flex', gap: 16 }}>
                {['Info', 'Warning', 'Critical'].map(s => (
                  <label key={s} style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 13, color: '#374151', cursor: 'pointer' }}>
                    <input type="radio" name="minSev" defaultChecked={s === 'Warning'} style={{ accentColor: '#0b3d4a' }} />
                    {s}
                  </label>
                ))}
              </div>
            </div>
            <div style={{ paddingTop: 8, borderTop: '0.5px solid #dde4e7' }}>
              <button className="vt-btn vt-btn-primary">Save notification settings</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

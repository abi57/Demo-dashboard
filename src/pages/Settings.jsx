import { useState, Fragment } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { useTheme } from '../context/ThemeContext'
import { useToast } from '../context/ToastContext'
import AppShell from '../components/AppShell'
import { LogOut } from 'lucide-react'

const DEFAULT_THRESHOLDS = [
  { metric: 'Resonant Frequency', unit: 'Hz',         warnLow: 2.0,  warnHigh: 6.5,  critLow: 1.0,  critHigh: 8.0,  enabled: true  },
  { metric: 'Peak Acceleration',  unit: 'g',          warnLow: null, warnHigh: 0.25, critLow: null, critHigh: 0.5,  enabled: true  },
  { metric: 'Tilt X',             unit: '°',          warnLow: -1.5, warnHigh: 1.5,  critLow: -2.5, critHigh: 2.5,  enabled: true  },
  { metric: 'Tilt Y',             unit: '°',          warnLow: -1.5, warnHigh: 1.5,  critLow: -2.5, critHigh: 2.5,  enabled: true  },
  { metric: 'Wire Tension',       unit: 'kN',         warnLow: 35,   warnHigh: 55,   critLow: 30,   critHigh: 60,   enabled: false },
  { metric: 'Battery',            unit: '%',          warnLow: 20,   warnHigh: null, critLow: 10,   critHigh: null, enabled: true  },
]

function Section({ title, children }) {
  return (
    <div className="vio-card" style={{ marginBottom: 16 }}>
      <p className="vio-section-label">{title}</p>
      {children}
    </div>
  )
}

export default function Settings() {
  const { user, logout } = useAuth()
  const { isDark, toggle } = useTheme()
  const { push } = useToast()
  const navigate = useNavigate()
  const [profile, setProfile] = useState({ name: user?.name ?? '', company: user?.company ?? '', email: user?.email ?? '' })
  const [thresholds, setThresholds] = useState(DEFAULT_THRESHOLDS)
  const [thresholdErrors, setThresholdErrors] = useState({})

  function updateT(i, field, val) {
    setThresholds(prev => prev.map((t, idx) => idx === i ? { ...t, [field]: val === '' ? null : Number(val) } : t))
    setThresholdErrors(e => ({ ...e, [i]: undefined }))
  }

  function saveThresholds() {
    const errs = {}
    thresholds.forEach((t, i) => {
      if (t.warnHigh !== null && t.critHigh !== null && t.critHigh <= t.warnHigh) errs[i] = 'Critical high must exceed warning high'
      if (t.warnLow !== null && t.critLow !== null && t.critLow >= t.warnLow) errs[i] = 'Critical low must be below warning low'
    })
    if (Object.keys(errs).length) { setThresholdErrors(errs); return }
    push('Thresholds saved successfully', 'success')
  }

  return (
    <AppShell title="Settings">
      {/* Profile */}
      <Section title="Profile">
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 16 }}>
          {[['name','Full Name','text'],['company','Company','text'],['email','Email','email']].map(([k, label, type]) => (
            <div key={k} style={k === 'email' ? { gridColumn: '1 / -1' } : {}}>
              <label style={{ display: 'block', fontSize: 13, fontWeight: 500, color: 'var(--vio-text-secondary)', marginBottom: 6 }}>{label}</label>
              <input className="vio-input" type={type} value={profile[k]} onChange={e => setProfile(p => ({ ...p, [k]: e.target.value }))} />
            </div>
          ))}
        </div>
        <button className="vio-btn vio-btn-primary" onClick={() => push('Profile saved', 'success')}>Save profile</button>
      </Section>

      {/* Appearance */}
      <Section title="Appearance">
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '8px 0' }}>
          <div>
            <p style={{ fontSize: 14, fontWeight: 500, color: 'var(--vio-text-primary)' }}>Theme</p>
            <p style={{ fontSize: 13, color: 'var(--vio-text-muted)' }}>Currently: {isDark ? 'Dark' : 'Light'}</p>
          </div>
          <button className="vio-btn vio-btn-secondary" onClick={toggle}>
            Switch to {isDark ? 'Light' : 'Dark'} mode
          </button>
        </div>
      </Section>

      {/* Notifications */}
      <Section title="Notifications">
        {[['Email alerts','Receive alerts via email'],['In-app alerts','Show alerts in the dashboard'],].map(([label, desc]) => (
          <div key={label} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '10px 0', borderBottom: '0.5px solid var(--vio-card-border)' }}>
            <div>
              <p style={{ fontSize: 14, fontWeight: 500, color: 'var(--vio-text-primary)' }}>{label}</p>
              <p style={{ fontSize: 12, color: 'var(--vio-text-muted)' }}>{desc}</p>
            </div>
            <label style={{ position: 'relative', display: 'inline-block', width: 40, height: 22, cursor: 'pointer' }}>
              <input type="checkbox" defaultChecked style={{ opacity: 0, width: 0, height: 0 }} />
              <span style={{ position: 'absolute', inset: 0, background: '#0b3d4a', borderRadius: 99, transition: '0.2s' }}>
                <span style={{ position: 'absolute', top: 3, left: 20, width: 16, height: 16, borderRadius: '50%', background: '#fff', transition: '0.2s' }} />
              </span>
            </label>
          </div>
        ))}
        <div style={{ padding: '10px 0' }}>
          <p style={{ fontSize: 13, fontWeight: 500, color: 'var(--vio-text-secondary)', marginBottom: 8 }}>Minimum severity</p>
          <div style={{ display: 'flex', gap: 8 }}>
            {['Info','Warning','Critical'].map(s => (
              <label key={s} style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 13, cursor: 'pointer' }}>
                <input type="radio" name="minSev" defaultChecked={s === 'Warning'} style={{ accentColor: '#0b3d4a' }} /> {s}
              </label>
            ))}
          </div>
        </div>
      </Section>

      {/* Thresholds */}
      <Section title="Threshold Configuration">
        <div style={{ overflowX: 'auto' }}>
          <table className="vio-table">
            <thead>
              <tr>{['Metric','Unit','Warn Low','Warn High','Crit Low','Crit High','Enabled'].map(h => <th key={h}>{h}</th>)}</tr>
            </thead>
            <tbody>
              {thresholds.map((t, i) => (
                <Fragment key={t.metric}>
                  <tr>
                    <td style={{ fontSize: 13, fontWeight: 500, color: 'var(--vio-text-primary)', whiteSpace: 'nowrap' }}>{t.metric}</td>
                    <td className="vio-cell vio-mono" style={{ fontSize: 12 }}>{t.unit}</td>
                    {['warnLow','warnHigh','critLow','critHigh'].map(f => (
                      <td key={f}>
                        <input type="number" className="vio-input" style={{ width: 80, height: 32, fontSize: 12, textAlign: 'right' }}
                          value={t[f] ?? ''} onChange={e => updateT(i, f, e.target.value)} placeholder="—" />
                      </td>
                    ))}
                    <td>
                      <button onClick={() => setThresholds(p => p.map((th, idx) => idx === i ? { ...th, enabled: !th.enabled } : th))}
                        style={{ width: 36, height: 20, borderRadius: 99, border: 'none', cursor: 'pointer', background: t.enabled ? '#0b3d4a' : '#d1d5db', position: 'relative', transition: 'background 0.2s' }}>
                        <span style={{ position: 'absolute', top: 2, width: 16, height: 16, borderRadius: '50%', background: '#fff', left: t.enabled ? 18 : 2, transition: 'left 0.2s' }} />
                      </button>
                    </td>
                  </tr>
                  {thresholdErrors[i] && (
                    <tr>
                      <td colSpan={7} style={{ padding: '4px 16px 8px', fontSize: 12, color: '#dc2626' }}>⚠ {thresholdErrors[i]}</td>
                    </tr>
                  )}
                </Fragment>
              ))}
            </tbody>
          </table>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: 12, marginTop: 16 }}>
          <button onClick={() => { setThresholds(DEFAULT_THRESHOLDS); setThresholdErrors({}) }} style={{ background: 'none', border: 'none', fontSize: 13, color: 'var(--vio-text-muted)', cursor: 'pointer', textDecoration: 'underline' }}>Reset to defaults</button>
          <button className="vio-btn vio-btn-primary" onClick={saveThresholds}>Save thresholds</button>
        </div>
      </Section>

      {/* Account */}
      <Section title="Account">
        <button className="vio-btn vio-btn-danger" style={{ gap: 8 }} onClick={() => { logout(); navigate('/login') }}>
          <LogOut size={16} /> Sign out
        </button>
      </Section>
    </AppShell>
  )
}

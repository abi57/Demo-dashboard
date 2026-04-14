import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { useTheme } from '../context/ThemeContext'
import { useToast } from '../context/ToastContext'
import AppShell from '../components/AppShell'
import { LogOut, Eye, EyeOff } from 'lucide-react'

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

  const [pw, setPw] = useState({ current: '', newPw: '', confirm: '' })
  const [pwErrors, setPwErrors] = useState({})
  const [showPw, setShowPw] = useState(false)

  const [report, setReport] = useState({ subject: '', message: '' })

  function handleChangePassword() {
    const errs = {}
    if (!pw.current) errs.current = 'Current password is required'
    if (!pw.newPw) errs.newPw = 'New password is required'
    else if (pw.newPw.length < 8) errs.newPw = 'Minimum 8 characters'
    if (pw.newPw !== pw.confirm) errs.confirm = 'Passwords do not match'
    if (Object.keys(errs).length) { setPwErrors(errs); return }
    setPwErrors({})
    setPw({ current: '', newPw: '', confirm: '' })
    push('Password changed successfully', 'success')
  }

  function handleReport() {
    if (!report.subject.trim() || !report.message.trim()) {
      push('Please fill in both subject and message', 'error')
      return
    }
    setReport({ subject: '', message: '' })
    push('Your message has been sent. We\'ll get back to you soon.', 'success')
  }

  const pwSet = (k, v) => { setPw(p => ({ ...p, [k]: v })); setPwErrors(e => ({ ...e, [k]: undefined })) }

  return (
    <AppShell title="Settings">
      {/* Change Password */}
      <Section title="Change Password">
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16, maxWidth: 400 }}>
          <div>
            <label style={labelStyle}>Current password</label>
            <div style={{ position: 'relative' }}>
              <input
                className={`vio-input${pwErrors.current ? ' invalid' : ''}`}
                type={showPw ? 'text' : 'password'}
                placeholder="Enter current password"
                value={pw.current}
                onChange={e => pwSet('current', e.target.value)}
                style={{ paddingRight: 44 }}
              />
              <button type="button" onClick={() => setShowPw(v => !v)}
                style={eyeStyle}>
                {showPw ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
            {pwErrors.current && <p style={errStyle}>{pwErrors.current}</p>}
          </div>
          <div>
            <label style={labelStyle}>New password</label>
            <input
              className={`vio-input${pwErrors.newPw ? ' invalid' : ''}`}
              type={showPw ? 'text' : 'password'}
              placeholder="Min. 8 characters"
              value={pw.newPw}
              onChange={e => pwSet('newPw', e.target.value)}
            />
            {pwErrors.newPw && <p style={errStyle}>{pwErrors.newPw}</p>}
          </div>
          <div>
            <label style={labelStyle}>Confirm new password</label>
            <input
              className={`vio-input${pwErrors.confirm ? ' invalid' : ''}`}
              type={showPw ? 'text' : 'password'}
              placeholder="Repeat new password"
              value={pw.confirm}
              onChange={e => pwSet('confirm', e.target.value)}
            />
            {pwErrors.confirm && <p style={errStyle}>{pwErrors.confirm}</p>}
          </div>
          <button className="vio-btn vio-btn-primary" style={{ alignSelf: 'flex-start' }} onClick={handleChangePassword}>
            Update password
          </button>
        </div>
      </Section>

      {/* Contact / Report */}
      <Section title="Contact Service / Report an Issue">
        <p style={{ fontSize: 13, color: 'var(--vio-text-muted)', marginBottom: 16 }}>
          Have a question or found something wrong? Send us a message and we'll get back to you.
        </p>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 14, maxWidth: 500 }}>
          <div>
            <label style={labelStyle}>Subject</label>
            <input className="vio-input" placeholder="e.g. Issue with installation, Account help…"
              value={report.subject} onChange={e => setReport(r => ({ ...r, subject: e.target.value }))} />
          </div>
          <div>
            <label style={labelStyle}>Message</label>
            <textarea
              className="vio-input"
              placeholder="Describe your issue or question…"
              value={report.message}
              onChange={e => setReport(r => ({ ...r, message: e.target.value }))}
              rows={4}
              style={{ height: 'auto', padding: '12px 14px', resize: 'vertical', minHeight: 100 }}
            />
          </div>
          <button className="vio-btn vio-btn-primary" style={{ alignSelf: 'flex-start' }} onClick={handleReport}>
            Send message
          </button>
        </div>
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

      {/* Sign Out */}
      <Section title="Account">
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '8px 0' }}>
          <div>
            <p style={{ fontSize: 14, fontWeight: 500, color: 'var(--vio-text-primary)' }}>{user?.name}</p>
            <p style={{ fontSize: 13, color: 'var(--vio-text-muted)' }}>{user?.company}</p>
          </div>
          <button className="vio-btn vio-btn-danger" style={{ gap: 8 }} onClick={() => { logout(); navigate('/login') }}>
            <LogOut size={16} /> Sign out
          </button>
        </div>
      </Section>
    </AppShell>
  )
}

const labelStyle = { display: 'block', fontSize: 13, fontWeight: 500, color: 'var(--vio-text-secondary)', marginBottom: 6 }
const errStyle = { fontSize: 12, color: '#dc2626', marginTop: 4 }
const eyeStyle = { position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: 'var(--vio-text-muted)', display: 'flex', padding: 0 }

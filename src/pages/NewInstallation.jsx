import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Header from '../components/Header'
import ClimbLogSection from '../components/ClimbLogSection'
import PhotoUpload from '../components/PhotoUpload'
import { useAppData } from '../context/AppDataContext'
import { useAlert } from '../context/AlertContext'

const EMPTY_CLIMB = { upStart: '', upFinish: '', downStart: '', downFinish: '' }

const inputStyle = {
  background: 'var(--bg-elevated)',
  border: '1px solid var(--border)',
  color: 'var(--text-primary)',
}

function Input({ label, required, error, children }) {
  return (
    <div className="flex flex-col gap-1.5">
      <label className="t-label" style={{ color: 'var(--text-faint)' }}>
        {label}{required && <span className="text-red-400 ml-1">*</span>}
      </label>
      {children}
      {error && <span className="t-caption" style={{ color: 'var(--danger)' }}>{error}</span>}
    </div>
  )
}

function Section({ step, title, subtitle, children }) {
  return (
    <div className="rounded-xl overflow-hidden" style={{ background: 'var(--bg-surface)', border: '1px solid var(--border)' }}>
      <div className="px-6 py-4 flex items-center gap-3" style={{ borderBottom: '1px solid var(--border)' }}>
        <div className="w-7 h-7 rounded-lg flex items-center justify-center t-micro font-bold flex-shrink-0"
          style={{ background: 'var(--accent-bg)', border: '1px solid var(--accent-border)', color: 'var(--accent)' }}>
          {step}
        </div>
        <div>
          <h4 style={{ color: 'var(--text-primary)' }}>{title}</h4>
          {subtitle && <p className="t-caption mt-0.5" style={{ color: 'var(--text-faint)' }}>{subtitle}</p>}
        </div>
      </div>
      <div className="p-6">{children}</div>
    </div>
  )
}

const cls = "w-full rounded-xl px-4 py-2.5 t-body-sm outline-none transition-all"

export default function NewInstallation() {
  const { addInstallation } = useAppData()
  const { push } = useAlert()
  const navigate = useNavigate()

  const [form, setForm] = useState({
    installer: '', company: '', date: new Date().toISOString().split('T')[0],
    siteOwner: '', towerId: '', assetTag: '', sensorSerial: '',
    installHeight: '', accelerometerOrientation: 'Vertical', windSensorOrientation: 'North-facing',
    structuralElement: '', secureFixing: '', dataFlowConfirmed: '', batteryVoltage: '', dcOutput: '',
    deviceType: 'environmental',
  })
  const [climbs, setClimbs] = useState([{ ...EMPTY_CLIMB }, { ...EMPTY_CLIMB }])
  const [photos, setPhotos] = useState([])
  const [errors, setErrors] = useState({})
  const [submitting, setSubmitting] = useState(false)

  const set = (k, v) => { setForm(f => ({ ...f, [k]: v })); setErrors(e => ({ ...e, [k]: undefined })) }

  function validate() {
    const e = {}
    if (!form.installer.trim())    e.installer    = 'Required'
    if (!form.company.trim())      e.company      = 'Required'
    if (!form.siteOwner.trim())    e.siteOwner    = 'Required'
    if (!form.towerId.trim())      e.towerId      = 'Required'
    if (!form.sensorSerial.trim()) e.sensorSerial = 'Required'
    if (!form.installHeight)       e.installHeight = 'Required'
    if (!form.structuralElement.trim()) e.structuralElement = 'Required'
    if (!form.secureFixing)        e.secureFixing = 'Required'
    if (!form.dataFlowConfirmed)   e.dataFlowConfirmed = 'Required'
    if (!form.batteryVoltage)      e.batteryVoltage = 'Required'
    if (!form.dcOutput)            e.dcOutput = 'Required'
    return e
  }

  async function handleSubmit(e) {
    e.preventDefault()
    const errs = validate()
    if (Object.keys(errs).length) { setErrors(errs); push('Please fill in all required fields', 'error'); return }
    setSubmitting(true)
    await new Promise(r => setTimeout(r, 700))
    const id = addInstallation({
      ...form,
      installHeight: parseFloat(form.installHeight),
      batteryVoltage: parseFloat(form.batteryVoltage),
      dcOutput: parseFloat(form.dcOutput),
      secureFixing: form.secureFixing === 'yes',
      dataFlowConfirmed: form.dataFlowConfirmed === 'yes',
      climbs: climbs.map((c, i) => ({ label: `Climb ${i + 1}`, ...c })),
      photos,
    })
    setSubmitting(false)
    push(`Installation ${id} created successfully`, 'success')
    navigate(`/install-records/${id}`)
  }

  const fieldStyle = {
    ...inputStyle,
    onFocus: e => e.target.style.borderColor = 'var(--accent-border)',
    onBlur:  e => e.target.style.borderColor = 'var(--border)',
  }

  return (
    <div className="flex-1 flex flex-col min-h-0 transition-colors duration-200" style={{ background: 'var(--bg-base)' }}>
      <Header title="New Installation" subtitle="Register a new sensor installation record" />
      <div className="flex-1 overflow-y-auto p-8">
        <form onSubmit={handleSubmit} className="max-w-4xl mx-auto flex flex-col gap-5">

          <Section step="A" title="Installer Details" subtitle="Field engineer information">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <Input label="Installer Full Name" required error={errors.installer}>
                <input className={cls} style={inputStyle} placeholder="e.g. James Okafor" value={form.installer}
                  onChange={e => set('installer', e.target.value)}
                  onFocus={e => e.target.style.borderColor = 'var(--accent-border)'}
                  onBlur={e => e.target.style.borderColor = 'var(--border)'} />
              </Input>
              <Input label="Company" required error={errors.company}>
                <input className={cls} style={inputStyle} placeholder="e.g. TowerTech Ltd" value={form.company}
                  onChange={e => set('company', e.target.value)}
                  onFocus={e => e.target.style.borderColor = 'var(--accent-border)'}
                  onBlur={e => e.target.style.borderColor = 'var(--border)'} />
              </Input>
              <Input label="Date of Installation" required>
                <input type="date" className={cls} style={inputStyle} value={form.date}
                  onChange={e => set('date', e.target.value)}
                  onFocus={e => e.target.style.borderColor = 'var(--accent-border)'}
                  onBlur={e => e.target.style.borderColor = 'var(--border)'} />
              </Input>
            </div>
          </Section>

          <Section step="B" title="Site / Asset" subtitle="Tower and sensor identification">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {[
                { key: 'siteOwner',    label: 'Site Owner',          ph: 'e.g. MTN Nigeria',    req: true  },
                { key: 'towerId',      label: 'Tower ID / Asset Tag', ph: 'e.g. TWR-LG-0042',   req: true  },
                { key: 'assetTag',     label: 'Asset Tag',            ph: 'e.g. AST-4421',       req: false },
                { key: 'sensorSerial', label: 'Sensor Serial Number', ph: 'e.g. SN-ENV-7821',   req: true  },
              ].map(f => (
                <Input key={f.key} label={f.label} required={f.req} error={errors[f.key]}>
                  <input className={cls} style={inputStyle} placeholder={f.ph} value={form[f.key]}
                    onChange={e => set(f.key, e.target.value)}
                    onFocus={e => e.target.style.borderColor = 'var(--accent-border)'}
                    onBlur={e => e.target.style.borderColor = 'var(--border)'} />
                </Input>
              ))}
            </div>
          </Section>

          <Section step="C" title="Installation Setup" subtitle="Physical configuration details">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Input label="Install Height (m AGL)" required error={errors.installHeight}>
                <input type="number" className={cls} style={inputStyle} placeholder="e.g. 42" value={form.installHeight}
                  onChange={e => set('installHeight', e.target.value)}
                  onFocus={e => e.target.style.borderColor = 'var(--accent-border)'}
                  onBlur={e => e.target.style.borderColor = 'var(--border)'} />
              </Input>
              <Input label="Structural Element" required error={errors.structuralElement}>
                <input className={cls} style={inputStyle} placeholder="e.g. Main Mast" value={form.structuralElement}
                  onChange={e => set('structuralElement', e.target.value)}
                  onFocus={e => e.target.style.borderColor = 'var(--accent-border)'}
                  onBlur={e => e.target.style.borderColor = 'var(--border)'} />
              </Input>
              <Input label="Accelerometer Orientation">
                <select className={cls + ' cursor-pointer'} style={inputStyle} value={form.accelerometerOrientation}
                  onChange={e => set('accelerometerOrientation', e.target.value)}>
                  {['Vertical', 'Horizontal', 'Inverted'].map(o => <option key={o}>{o}</option>)}
                </select>
              </Input>
              <Input label="Wind Sensor Orientation">
                <select className={cls + ' cursor-pointer'} style={inputStyle} value={form.windSensorOrientation}
                  onChange={e => set('windSensorOrientation', e.target.value)}>
                  {['North-facing', 'South-facing', 'East-facing', 'West-facing'].map(o => <option key={o}>{o}</option>)}
                </select>
              </Input>
              <Input label="Device Type">
                <select className={cls + ' cursor-pointer'} style={inputStyle} value={form.deviceType}
                  onChange={e => set('deviceType', e.target.value)}>
                  {['environmental', 'asset', 'safety'].map(o => (
                    <option key={o} value={o}>{o.charAt(0).toUpperCase() + o.slice(1)}</option>
                  ))}
                </select>
              </Input>
            </div>
          </Section>

          <Section step="D" title="Validation" subtitle="Confirmation and electrical readings">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Input label="Secure Fixing" required error={errors.secureFixing}>
                <select className={cls + ' cursor-pointer'} style={inputStyle} value={form.secureFixing}
                  onChange={e => set('secureFixing', e.target.value)}>
                  <option value="">Select…</option>
                  <option value="yes">Yes — Confirmed</option>
                  <option value="no">No — Not Confirmed</option>
                </select>
              </Input>
              <Input label="Data Flow Confirmed" required error={errors.dataFlowConfirmed}>
                <select className={cls + ' cursor-pointer'} style={inputStyle} value={form.dataFlowConfirmed}
                  onChange={e => set('dataFlowConfirmed', e.target.value)}>
                  <option value="">Select…</option>
                  <option value="yes">Yes — Data Flowing</option>
                  <option value="no">No — Not Confirmed</option>
                </select>
              </Input>
              <Input label="Battery Voltage (V)" required error={errors.batteryVoltage}>
                <input type="number" step="0.1" className={cls} style={inputStyle} placeholder="e.g. 12.4" value={form.batteryVoltage}
                  onChange={e => set('batteryVoltage', e.target.value)}
                  onFocus={e => e.target.style.borderColor = 'var(--accent-border)'}
                  onBlur={e => e.target.style.borderColor = 'var(--border)'} />
              </Input>
              <Input label="DC Output (V)" required error={errors.dcOutput}>
                <input type="number" step="0.1" className={cls} style={inputStyle} placeholder="e.g. 5.1" value={form.dcOutput}
                  onChange={e => set('dcOutput', e.target.value)}
                  onFocus={e => e.target.style.borderColor = 'var(--accent-border)'}
                  onBlur={e => e.target.style.borderColor = 'var(--border)'} />
              </Input>
            </div>
          </Section>

          <Section step="E" title="Climb Logs" subtitle={`${climbs.length} climb${climbs.length > 1 ? 's' : ''} recorded`}>
            <ClimbLogSection climbs={climbs} onChange={(i, k, v) => setClimbs(p => p.map((c, idx) => idx === i ? { ...c, [k]: v } : c))} />
            {climbs.length < 3 && (
              <button type="button" onClick={() => setClimbs(p => [...p, { ...EMPTY_CLIMB }])}
                className="mt-4 text-[12px] px-4 py-2 rounded-lg transition-all"
                style={{ color: 'var(--accent)', border: '1px solid var(--accent-border)', background: 'var(--accent-bg)' }}>
                + Add Climb
              </button>
            )}
          </Section>

          <Section step="F" title="Photos" subtitle="Upload installation site photos">
            <PhotoUpload photos={photos} onChange={setPhotos} />
          </Section>

          <div className="flex items-center justify-end gap-3 pb-4">
            <button type="button" onClick={() => navigate(-1)}
              className="t-body-sm px-5 py-2.5 rounded-xl transition-all"
              style={{ border: '1px solid var(--border)', color: 'var(--text-muted)', background: 'var(--bg-surface)' }}>
              Cancel
            </button>
            <button type="submit" disabled={submitting}
              className="t-body-sm flex items-center gap-2 px-6 py-2.5 rounded-xl font-semibold transition-all active:scale-[0.97] disabled:opacity-40"
              style={{ background: 'var(--accent)', color: '#020617', boxShadow: '0 4px 14px rgba(34,211,238,0.2)' }}>
              {submitting ? (
                <><span className="w-4 h-4 border-2 rounded-full animate-spin" style={{ borderColor: 'rgba(2,6,23,0.3)', borderTopColor: '#020617' }} /> Saving…</>
              ) : '✓ Save Installation'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

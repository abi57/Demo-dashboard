import { useState, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { Upload, X, Plus } from 'lucide-react'
import AppShell from '../components/AppShell'
import { useApp } from '../context/AppContext'
import { useToast } from '../context/ToastContext'

const EMPTY_CLIMB = { upStart: '', upFinish: '', downStart: '', downFinish: '' }

function calcDur(a, b) {
  if (!a || !b) return null
  const [ah, am] = a.split(':').map(Number), [bh, bm] = b.split(':').map(Number)
  const d = (bh * 60 + bm) - (ah * 60 + am)
  return d > 0 ? `${d} min` : null
}

function SectionLabel({ children }) {
  return <p className="vio-section-label">{children}</p>
}

function Field({ label, required, error, children, half }) {
  return (
    <div style={half ? {} : {}}>
      <label style={{ display: 'block', fontSize: 13, fontWeight: 500, color: 'var(--vio-text-secondary)', marginBottom: 6 }}>
        {label}{required && <span style={{ color: '#dc2626', marginLeft: 3 }}>*</span>}
      </label>
      {children}
      {error && <p style={{ fontSize: 12, color: '#dc2626', marginTop: 4 }}>{error}</p>}
    </div>
  )
}

export default function NewInstallation() {
  const { addInstallation } = useApp()
  const { push } = useToast()
  const navigate = useNavigate()
  const fileRef = useRef()

  const [form, setForm] = useState({
    installerName: '', company: '', dateInstalled: '',
    siteOwner: '', towerId: '', sensorSerials: '',
    heightAGL: '', accelOrientation: '', windOrientation: '', windNA: false,
    structuralElement: '', batteryVoltage: '', dcOutput: '',
    secureFixing: null, dataFlow: null,
  })
  const [climbs, setClimbs] = useState([{ ...EMPTY_CLIMB }])
  const [photos, setPhotos] = useState([])
  const [errors, setErrors] = useState({})
  const [submitting, setSubmitting] = useState(false)
  const [dragOver, setDragOver] = useState(false)

  const set = (k, v) => { setForm(f => ({ ...f, [k]: v })); setErrors(e => ({ ...e, [k]: undefined })) }

  function validate() {
    const e = {}
    if (!form.installerName.trim()) e.installerName = 'Required'
    if (!form.company.trim())       e.company = 'Required'
    if (!form.dateInstalled)        e.dateInstalled = 'Required'
    if (!form.siteOwner.trim())     e.siteOwner = 'Required'
    if (!form.towerId.trim())       e.towerId = 'Required'
    if (!form.sensorSerials.trim()) e.sensorSerials = 'Required'
    if (!form.heightAGL)            e.heightAGL = 'Required'
    if (!form.structuralElement.trim()) e.structuralElement = 'Required'
    if (form.secureFixing === null) e.secureFixing = 'Required'
    if (form.dataFlow === null)     e.dataFlow = 'Required'
    return e
  }

  async function handleSubmit(e) {
    e.preventDefault()
    const errs = validate()
    if (Object.keys(errs).length) { setErrors(errs); return }
    setSubmitting(true)
    await new Promise(r => setTimeout(r, 600))
    const id = addInstallation({
      installerName: form.installerName, company: form.company, dateInstalled: form.dateInstalled,
      siteOwner: form.siteOwner, towerId: form.towerId,
      sensorSerials: form.sensorSerials.split(',').map(s => s.trim()).filter(Boolean),
      heightAGL: parseFloat(form.heightAGL),
      accelOrientation: form.accelOrientation ? parseFloat(form.accelOrientation) : null,
      windOrientation: form.windNA ? null : (form.windOrientation ? parseFloat(form.windOrientation) : null),
      structuralElement: form.structuralElement,
      batteryVoltage: form.batteryVoltage || null, dcOutput: form.dcOutput || null,
      secureFixing: form.secureFixing, dataFlow: form.dataFlow,
      photos, climbs, sensorType: 'accelerometer', status: form.dataFlow ? 'confirmed' : 'pending',
    })
    setSubmitting(false)
    push('Installation record submitted successfully', 'success')
    navigate(`/install-records/${id}`)
  }

  function handleFiles(files) {
    Array.from(files).forEach(file => {
      const reader = new FileReader()
      reader.onload = ev => setPhotos(p => [...p, { url: ev.target.result, name: file.name }])
      reader.readAsDataURL(file)
    })
  }

  const YesNo = ({ field }) => (
    <div style={{ display: 'flex', gap: 8 }}>
      {[true, false].map(v => (
        <button key={String(v)} type="button"
          onClick={() => set(field, v)}
          className={`vio-btn vio-btn-sm ${form[field] === v ? 'vio-btn-primary' : 'vio-btn-ghost'}`}>
          {v ? 'Yes' : 'No'}
        </button>
      ))}
    </div>
  )

  const inputCls = k => `vio-input${errors[k] ? ' invalid' : ''}`

  return (
    <AppShell title="New Installation">
      <form onSubmit={handleSubmit}>
        <div className="vio-card" style={{ marginBottom: 16 }}>
          <SectionLabel>A — Installer Details</SectionLabel>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
            <Field label="Installer Full Name" required error={errors.installerName}>
              <input className={inputCls('installerName')} placeholder="Wade Hooper" value={form.installerName} onChange={e => set('installerName', e.target.value)} />
            </Field>
            <Field label="Installer Company" required error={errors.company}>
              <input className={inputCls('company')} placeholder="Titanium Services Group" value={form.company} onChange={e => set('company', e.target.value)} />
            </Field>
            <Field label="Date of Installation" required error={errors.dateInstalled}>
              <input className={inputCls('dateInstalled')} type="date" value={form.dateInstalled} onChange={e => set('dateInstalled', e.target.value)} />
            </Field>
          </div>
        </div>

        <div className="vio-card" style={{ marginBottom: 16 }}>
          <SectionLabel>B — Site & Asset</SectionLabel>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
            <Field label="Site Owner" required error={errors.siteOwner}>
              <input className={inputCls('siteOwner')} placeholder="Indara, One NZ, Forty South…" value={form.siteOwner} onChange={e => set('siteOwner', e.target.value)} />
            </Field>
            <Field label="Tower ID / Asset Tag" required error={errors.towerId}>
              <input className={inputCls('towerId')} placeholder="3500833, RCTLYF, S5WNK…" value={form.towerId} onChange={e => set('towerId', e.target.value)} />
            </Field>
            <Field label="Viotel Sensor Serial(s)" required error={errors.sensorSerials} style={{ gridColumn: '1 / -1' }}>
              <input className={inputCls('sensorSerials')} placeholder="e.g. viot01875, viot02063 — comma separate multiples" value={form.sensorSerials} onChange={e => set('sensorSerials', e.target.value)} />
            </Field>
          </div>
        </div>

        <div className="vio-card" style={{ marginBottom: 16 }}>
          <SectionLabel>C — Installation Setup</SectionLabel>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
            <Field label="Install Height (m AGL)" required error={errors.heightAGL}>
              <div style={{ position: 'relative' }}>
                <input className={inputCls('heightAGL')} type="number" step="0.01" placeholder="29.80" value={form.heightAGL} onChange={e => set('heightAGL', e.target.value)} style={{ paddingRight: 32 }} />
                <span style={{ position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)', fontSize: 12, color: 'var(--vio-text-muted)' }}>m</span>
              </div>
            </Field>
            <Field label="Accelerometer Orientation" required error={errors.accelOrientation}>
              <div style={{ position: 'relative' }}>
                <input className="vio-input" type="number" min="0" max="360" placeholder="330" value={form.accelOrientation} onChange={e => set('accelOrientation', e.target.value)} style={{ paddingRight: 56 }} />
                <span style={{ position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)', fontSize: 12, color: 'var(--vio-text-muted)' }}>° North</span>
              </div>
            </Field>
            <Field label="Wind Sensor Orientation">
              <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                <div style={{ position: 'relative', flex: 1 }}>
                  <input className="vio-input" type="number" min="0" max="360" placeholder="330" value={form.windOrientation} onChange={e => set('windOrientation', e.target.value)} disabled={form.windNA} style={{ paddingRight: 56, opacity: form.windNA ? 0.4 : 1 }} />
                  <span style={{ position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)', fontSize: 12, color: 'var(--vio-text-muted)' }}>° North</span>
                </div>
                <label style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 13, cursor: 'pointer', whiteSpace: 'nowrap' }}>
                  <input type="checkbox" checked={form.windNA} onChange={e => set('windNA', e.target.checked)} style={{ accentColor: '#0b3d4a' }} /> N/A
                </label>
              </div>
            </Field>
            <Field label="Structural Element" required error={errors.structuralElement}>
              <input className={inputCls('structuralElement')} placeholder="Tower leg, Horizontal, Cable ladder…" value={form.structuralElement} onChange={e => set('structuralElement', e.target.value)} />
            </Field>
          </div>
        </div>

        <div className="vio-card" style={{ marginBottom: 16 }}>
          <SectionLabel>D — Power & Confirmation</SectionLabel>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
            <Field label="Battery Voltage (solar)">
              <input className="vio-input" placeholder="e.g. 12v, 10 volts" value={form.batteryVoltage} onChange={e => set('batteryVoltage', e.target.value)} />
            </Field>
            <Field label="DC Output (DC power)">
              <input className="vio-input" placeholder="e.g. 12VDC" value={form.dcOutput} onChange={e => set('dcOutput', e.target.value)} />
            </Field>
            <Field label="Secure Fixing Confirmed" required error={errors.secureFixing}>
              <YesNo field="secureFixing" />
            </Field>
            <Field label="Data Flow on myViotel" required error={errors.dataFlow}>
              <YesNo field="dataFlow" />
            </Field>
          </div>
        </div>

        <div className="vio-card" style={{ marginBottom: 16 }}>
          <SectionLabel>E — Climb Log</SectionLabel>
          {climbs.map((c, i) => (
            <div key={i} style={{ marginBottom: 16, padding: 16, borderRadius: 8, background: 'var(--vio-page-bg)', border: '0.5px solid var(--vio-card-border)' }}>
              <p style={{ fontSize: 13, fontWeight: 600, color: 'var(--vio-primary)', marginBottom: 12 }}>Climb {i + 1}</p>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 12 }}>
                {[['upStart','Up Start'],['upFinish','Up Finish'],['downStart','Down Start'],['downFinish','Down Finish']].map(([k, label]) => (
                  <div key={k}>
                    <label style={{ display: 'block', fontSize: 12, fontWeight: 500, color: 'var(--vio-text-muted)', marginBottom: 4 }}>{label}</label>
                    <input type="time" className="vio-input" style={{ height: 36, fontSize: 13 }}
                      value={c[k]} onChange={e => setClimbs(p => p.map((cl, j) => j === i ? { ...cl, [k]: e.target.value } : cl))} />
                  </div>
                ))}
              </div>
              <div style={{ display: 'flex', gap: 16, marginTop: 8 }}>
                {calcDur(c.upStart, c.upFinish) && <span style={{ fontSize: 12, color: 'var(--vio-accent)' }}>↑ {calcDur(c.upStart, c.upFinish)} ascent</span>}
                {calcDur(c.downStart, c.downFinish) && <span style={{ fontSize: 12, color: 'var(--vio-accent)' }}>↓ {calcDur(c.downStart, c.downFinish)} descent</span>}
              </div>
            </div>
          ))}
          {climbs.length < 3 && (
            <button type="button" onClick={() => setClimbs(p => [...p, { ...EMPTY_CLIMB }])}
              style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--vio-accent)', fontSize: 13, fontWeight: 500, display: 'flex', alignItems: 'center', gap: 4 }}>
              <Plus size={14} /> Add Climb {climbs.length + 1}
            </button>
          )}
        </div>

        <div className="vio-card" style={{ marginBottom: 24 }}>
          <SectionLabel>F — Install Photographs</SectionLabel>
          <div
            onDragOver={e => { e.preventDefault(); setDragOver(true) }}
            onDragLeave={() => setDragOver(false)}
            onDrop={e => { e.preventDefault(); setDragOver(false); handleFiles(e.dataTransfer.files) }}
            onClick={() => fileRef.current.click()}
            style={{
              border: `2px dashed ${dragOver ? '#0b3d4a' : 'var(--vio-card-border)'}`,
              borderRadius: 10, padding: '32px 24px', textAlign: 'center', cursor: 'pointer',
              background: dragOver ? 'rgba(11,61,74,0.04)' : 'var(--vio-page-bg)',
              transition: 'all 0.15s', marginBottom: photos.length > 0 ? 16 : 0,
            }}
          >
            <Upload size={24} style={{ color: 'var(--vio-primary)', margin: '0 auto 8px', display: 'block' }} />
            <p style={{ fontSize: 14, fontWeight: 500, color: 'var(--vio-text-primary)' }}>Drag & drop photos here</p>
            <p style={{ fontSize: 12, color: 'var(--vio-text-muted)', marginTop: 4 }}>JPG, PNG, HEIC accepted</p>
            <input ref={fileRef} type="file" multiple accept="image/*,.heic" style={{ display: 'none' }} onChange={e => handleFiles(e.target.files)} />
          </div>
          {photos.length > 0 && (
            <>
              <p style={{ fontSize: 13, color: 'var(--vio-text-muted)', marginBottom: 10 }}>{photos.length} photo{photos.length !== 1 ? 's' : ''} selected</p>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(100px, 1fr))', gap: 8 }}>
                {photos.map((p, i) => (
                  <div key={i} style={{ position: 'relative', aspectRatio: '1', borderRadius: 8, overflow: 'hidden', border: '0.5px solid var(--vio-card-border)' }}>
                    <img src={p.url} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    <button type="button" onClick={() => setPhotos(p => p.filter((_, j) => j !== i))}
                      style={{ position: 'absolute', top: 4, right: 4, width: 20, height: 20, borderRadius: '50%', background: 'rgba(0,0,0,0.6)', border: 'none', cursor: 'pointer', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <X size={12} />
                    </button>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <button type="button" className="vio-btn vio-btn-secondary" onClick={() => navigate('/install-records')}>Save Draft</button>
          <button type="submit" className="vio-btn vio-btn-primary" disabled={submitting}>
            {submitting ? 'Submitting…' : 'Submit Installation Record'}
          </button>
        </div>
      </form>
    </AppShell>
  )
}

import { useState, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { Upload, X, Plus, Camera, Trash2, Play, Square, ArrowUp, ArrowDown } from 'lucide-react'
import AppShell from '../components/AppShell'
import { useApp } from '../context/AppContext'
import { useAuth } from '../context/AuthContext'
import { useToast } from '../context/ToastContext'
import { useNotifications } from '../context/NotificationContext'

const EMPTY_CLIMB = { upStart: '', upFinish: '', downStart: '', downFinish: '' }

function fmtTime(iso) {
  if (!iso) return '—'
  const d = new Date(iso)
  return d.toLocaleTimeString('en-NZ', { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: true })
}

function toTimeInput(iso) {
  if (!iso) return ''
  const d = new Date(iso)
  return `${String(d.getHours()).padStart(2,'0')}:${String(d.getMinutes()).padStart(2,'0')}:${String(d.getSeconds()).padStart(2,'0')}`
}

function fromTimeInput(val, existingIso) {
  if (!val) return ''
  const base = existingIso ? new Date(existingIso) : new Date()
  const parts = val.split(':').map(Number)
  base.setHours(parts[0] || 0, parts[1] || 0, parts[2] || 0, 0)
  return base.toISOString()
}

function calcDur(a, b) {
  if (!a || !b) return null
  const d = Math.round((new Date(b) - new Date(a)) / 60000)
  return d > 0 ? `${d} min` : null
}

function SectionLabel({ children }) {
  return <p style={{ fontSize: 13, fontWeight: 700, color: 'var(--vio-accent)', marginBottom: 16, textTransform: 'uppercase', letterSpacing: '0.06em' }}>{children}</p>
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
  const { user } = useAuth()
  const { push } = useToast()
  const { add: notify } = useNotifications()
  const navigate = useNavigate()

  const [form, setForm] = useState({
    installerName: '', company: user?.company ?? '', dateInstalled: '',
    siteOwner: '', towerId: '', sensorSerials: '',
    heightAGL: '', accelOrientation: '', windOrientation: '', windNA: true,
    structuralElement: '', batteryVoltage: '', dcOutput: '',
    secureFixing: null, dataFlow: null,
  })
  const [climbs, setClimbs] = useState([{ ...EMPTY_CLIMB }])
  const [photos, setPhotos] = useState([])
  const [serialPhotos, setSerialPhotos] = useState([])
  const [cameraOpen, setCameraOpen] = useState(false)
  const [cameraStream, setCameraStream] = useState(null)
  const [installCamOpen, setInstallCamOpen] = useState(false)
  const [installCamStream, setInstallCamStream] = useState(null)
  const videoRef = useRef()
  const canvasRef = useRef()
  const installVideoRef = useRef()
  const installCanvasRef = useRef()
  const serialFileRef = useRef()
  const installFileRef = useRef()
  const [errors, setErrors] = useState({})
  const [submitting, setSubmitting] = useState(false)

  const set = (k, v) => { setForm(f => ({ ...f, [k]: v })); setErrors(e => ({ ...e, [k]: undefined })) }

  async function openCamera() {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'environment' } })
      setCameraStream(stream)
      setCameraOpen(true)
      setTimeout(() => { if (videoRef.current) videoRef.current.srcObject = stream }, 50)
    } catch { alert('Unable to access camera. Please check permissions.') }
  }

  function capturePhoto() {
    const video = videoRef.current
    const canvas = canvasRef.current
    if (!video || !canvas) return
    canvas.width = video.videoWidth
    canvas.height = video.videoHeight
    canvas.getContext('2d').drawImage(video, 0, 0)
    const url = canvas.toDataURL('image/jpeg', 0.85)
    setSerialPhotos(p => [...p, { url, name: `serial-capture-${p.length + 1}.jpg` }])
    closeCamera()
    setErrors(e => ({ ...e, serialPhotos: undefined }))
  }

  function closeCamera() {
    if (cameraStream) cameraStream.getTracks().forEach(t => t.stop())
    setCameraStream(null)
    setCameraOpen(false)
  }

  function handleSerialFiles(files) {
    const remaining = 5 - serialPhotos.length
    Array.from(files).slice(0, remaining).forEach(file => {
      const reader = new FileReader()
      reader.onload = ev => setSerialPhotos(p => [...p, { url: ev.target.result, name: file.name }])
      reader.readAsDataURL(file)
    })
    setErrors(e => ({ ...e, serialPhotos: undefined }))
  }

  async function openInstallCam() {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'environment' } })
      setInstallCamStream(stream)
      setInstallCamOpen(true)
      setTimeout(() => { if (installVideoRef.current) installVideoRef.current.srcObject = stream }, 50)
    } catch { alert('Unable to access camera. Please check permissions.') }
  }

  function captureInstallPhoto() {
    const video = installVideoRef.current
    const canvas = installCanvasRef.current
    if (!video || !canvas) return
    canvas.width = video.videoWidth
    canvas.height = video.videoHeight
    canvas.getContext('2d').drawImage(video, 0, 0)
    const url = canvas.toDataURL('image/jpeg', 0.85)
    setPhotos(p => [...p, { url, name: `install-capture-${p.length + 1}.jpg` }])
    closeInstallCam()
  }

  function closeInstallCam() {
    if (installCamStream) installCamStream.getTracks().forEach(t => t.stop())
    setInstallCamStream(null)
    setInstallCamOpen(false)
  }

  function handleInstallFiles(files) {
    Array.from(files).forEach(file => {
      const reader = new FileReader()
      reader.onload = ev => setPhotos(p => [...p, { url: ev.target.result, name: file.name }])
      reader.readAsDataURL(file)
    })
  }

  function validate() {
    const e = {}
    if (!form.installerName.trim()) e.installerName = 'Installer name is required'
    else if (/\d/.test(form.installerName)) e.installerName = 'Name should not contain numbers'
    if (!form.company.trim())       e.company = 'Company is required'
    if (!form.dateInstalled)        e.dateInstalled = 'Date of installation is required'
    if (!form.siteOwner.trim())     e.siteOwner = 'Site owner is required'
    if (!form.towerId.trim())       e.towerId = 'Tower ID is required'
    if (!form.sensorSerials.trim()) e.sensorSerials = 'At least one sensor serial is required'
    if (serialPhotos.length < 1) e.serialPhotos = 'At least 1 serial number photo is required'
    if (!form.heightAGL)            e.heightAGL = 'Install height is required'
    else if (isNaN(parseFloat(form.heightAGL)) || parseFloat(form.heightAGL) <= 0) e.heightAGL = 'Must be a positive number'
    if (!form.accelOrientation && form.accelOrientation !== '0') e.accelOrientation = 'Accelerometer orientation is required'
    else { const v = parseInt(form.accelOrientation, 10); if (isNaN(v) || v < 0 || v > 359) e.accelOrientation = 'Must be between 0 and 359' }
    if (!form.windNA) {
      if (!form.windOrientation && form.windOrientation !== '0') e.windOrientation = 'Wind sensor orientation is required'
      else { const v = parseInt(form.windOrientation, 10); if (isNaN(v) || v < 0 || v > 359) e.windOrientation = 'Must be between 0 and 359' }
    }
    if (!form.structuralElement.trim()) e.structuralElement = 'Structural element is required'
    if (form.secureFixing === null) e.secureFixing = 'Please confirm secure fixing'
    if (form.dataFlow === null)     e.dataFlow = 'Please confirm data flow'
    return e
  }

  async function handleSubmit(e) {
    e.preventDefault()
    const errs = validate()
    if (Object.keys(errs).length) {
      setErrors(errs)
      const count = Object.keys(errs).length
      notify(`${count} field${count > 1 ? 's' : ''} need${count === 1 ? 's' : ''} attention before submitting`, 'error')
      return
    }
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
      photos, serialPhotos, climbs: climbs.map(c => ({
        upStart: c.upStart ? fmtTime(c.upStart) : '',
        upFinish: c.upFinish ? fmtTime(c.upFinish) : '',
        downStart: c.downStart ? fmtTime(c.downStart) : '',
        downFinish: c.downFinish ? fmtTime(c.downFinish) : '',
      })), sensorType: 'accelerometer', status: form.dataFlow ? 'confirmed' : 'pending',
    })
    setSubmitting(false)
    push('Installation record submitted successfully', 'success')
    notify(`Installation ${id} submitted successfully`, 'success')
    navigate(`/install-records/${id}`)
  }

  const YesNo = ({ field }) => (
    <div style={{ display: 'flex', gap: 10 }}>
      {[true, false].map(v => (
        <button key={String(v)} type="button"
          onClick={() => set(field, v)}
          className={`vio-btn ${form[field] === v ? 'vio-btn-primary' : 'vio-btn-ghost'}`}
          style={{ height: 42, padding: '0 28px', fontSize: 14, minWidth: 80 }}>
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
          <SectionLabel>Installer Details</SectionLabel>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
            <Field label="Installer Full Name" required error={errors.installerName}>
              <input className={inputCls('installerName')} placeholder="Wade Hooper" value={form.installerName} onChange={e => set('installerName', e.target.value)} />
            </Field>
            <Field label="Installer Company" required error={errors.company}>
              <input className={inputCls('company')} value={form.company} readOnly disabled style={{ background: 'var(--vio-page-bg)', cursor: 'not-allowed' }} />
            </Field>
            <Field label="Date of Installation" required error={errors.dateInstalled}>
              <input className={inputCls('dateInstalled')} type="date" value={form.dateInstalled} onChange={e => set('dateInstalled', e.target.value)} />
            </Field>
          </div>
        </div>

        <div className="vio-card" style={{ marginBottom: 16 }}>
          <SectionLabel>Site & Asset</SectionLabel>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
            <Field label="Site Owner" required error={errors.siteOwner}>
              <input className={inputCls('siteOwner')} placeholder="Indara, One NZ, Forty South…" value={form.siteOwner} onChange={e => set('siteOwner', e.target.value)} />
            </Field>
            <Field label="Tower ID / Asset Tag" required error={errors.towerId}>
              <input className={inputCls('towerId')} placeholder="3500833, RCTLYF, S5WNK…" value={form.towerId} onChange={e => set('towerId', e.target.value)} />
            </Field>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginTop: 16 }}>
            <Field label="Viotel Sensor Serial(s)" required error={errors.sensorSerials}>
              <input className={inputCls('sensorSerials')} placeholder="e.g. viot01875, viot02063 — comma separate multiples" value={form.sensorSerials} onChange={e => set('sensorSerials', e.target.value)} />
            </Field>
          </div>

          {/* Serial Number Photos */}
          <div style={{ marginTop: 20 }}>
            <label style={{ display: 'block', fontSize: 13, fontWeight: 500, color: 'var(--vio-text-secondary)', marginBottom: 6 }}>
              Serial Number Photo(s)<span style={{ color: '#dc2626', marginLeft: 3 }}>*</span>
            </label>
            <p style={{ fontSize: 12, color: 'var(--vio-text-muted)', marginBottom: 12 }}>Take or upload a clear photo of the device serial label. Min 1, max 5.</p>

            {/* Camera viewfinder */}
            {cameraOpen && (
              <div style={{ marginBottom: 14, borderRadius: 10, overflow: 'hidden', border: '1px solid var(--vio-card-border)', background: '#000', maxWidth: 480 }}>
                <video ref={videoRef} autoPlay playsInline muted style={{ width: '100%', display: 'block', maxHeight: 260, objectFit: 'cover' }} />
                <canvas ref={canvasRef} style={{ display: 'none' }} />
                <div style={{ display: 'flex', gap: 10, padding: 12, background: '#111', justifyContent: 'center' }}>
                  <button type="button" onClick={capturePhoto} className="vio-btn vio-btn-primary">Capture</button>
                  <button type="button" onClick={closeCamera} className="vio-btn vio-btn-ghost" style={{ color: '#fff', borderColor: '#444' }}>Cancel</button>
                </div>
              </div>
            )}

            {/* Buttons */}
            {serialPhotos.length < 5 && !cameraOpen && (
              <div style={{ display: 'flex', gap: 12, marginBottom: serialPhotos.length > 0 ? 14 : 0 }}>
                <button type="button" onClick={openCamera} className="vio-btn vio-btn-secondary" style={{ gap: 8, height: 44, padding: '0 24px', fontSize: 14 }}>
                  <Camera size={18} /> Take Photo
                </button>
                <button type="button" onClick={() => serialFileRef.current.click()} className="vio-btn vio-btn-ghost" style={{ gap: 8, height: 44, padding: '0 24px', fontSize: 14 }}>
                  <Upload size={18} /> Upload Photo
                </button>
                <input ref={serialFileRef} type="file" multiple accept="image/*,.heic" style={{ display: 'none' }}
                  onChange={e => { handleSerialFiles(e.target.files); e.target.value = '' }} />
              </div>
            )}

            {/* Thumbnails */}
            {serialPhotos.length > 0 && (
              <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', alignItems: 'center' }}>
                {serialPhotos.map((p, i) => (
                  <div key={i} style={{ position: 'relative', width: 64, height: 64, borderRadius: 8, overflow: 'hidden', border: '1px solid var(--vio-card-border)' }}>
                    <img src={p.url} alt={`Serial ${i + 1}`} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    <button type="button" onClick={() => setSerialPhotos(sp => sp.filter((_, j) => j !== i))}
                      style={{ position: 'absolute', top: 2, right: 2, width: 18, height: 18, borderRadius: '50%', background: 'rgba(0,0,0,0.6)', border: 'none', cursor: 'pointer', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <X size={10} />
                    </button>
                  </div>
                ))}
                <span style={{ fontSize: 12, color: 'var(--vio-text-muted)' }}>{serialPhotos.length}/5</span>
              </div>
            )}

            {errors.serialPhotos && <p style={{ fontSize: 12, color: '#dc2626', marginTop: 8 }}>{errors.serialPhotos}</p>}
          </div>
        </div>

        <div className="vio-card" style={{ marginBottom: 16 }}>
          <SectionLabel>Installation Setup</SectionLabel>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
            <Field label="Install Height (m above ground level)" required error={errors.heightAGL}>
              <div style={{ position: 'relative' }}>
                <input className={inputCls('heightAGL')} type="number" step="0.01" min="0" placeholder="29.80" value={form.heightAGL} onChange={e => set('heightAGL', e.target.value)} style={{ paddingRight: 32 }} />
                <span style={{ position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)', fontSize: 12, color: 'var(--vio-text-muted)' }}>m</span>
              </div>
            </Field>
            <Field label="Accelerometer Orientation" required error={errors.accelOrientation}>
              <div style={{ position: 'relative' }}>
                <input className={inputCls('accelOrientation')} type="number" min="0" max="359" placeholder="Degree from true north (0–359°)" value={form.accelOrientation} onChange={e => set('accelOrientation', e.target.value)} style={{ paddingRight: 100 }} />
                <span style={{ position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)', fontSize: 12, color: 'var(--vio-text-muted)' }}>° from true north</span>
              </div>
              <p style={{ fontSize: 11, color: 'var(--vio-text-muted)', marginTop: 5 }}>Sanity check: value must be between 0 and 359 degrees.</p>
            </Field>
            <div>
              <label style={{ display: 'block', fontSize: 13, fontWeight: 500, color: 'var(--vio-text-secondary)', marginBottom: 6 }}>
                Does this installation have a wind sensor?
              </label>
              <div style={{ display: 'flex', gap: 10 }}>
                {[{ label: 'Yes', value: false }, { label: 'No', value: true }].map(opt => (
                  <button key={opt.label} type="button"
                    onClick={() => set('windNA', opt.value)}
                    className={`vio-btn ${form.windNA === opt.value ? 'vio-btn-primary' : 'vio-btn-ghost'}`}
                    style={{ height: 42, padding: '0 28px', fontSize: 14, minWidth: 80 }}>
                    {opt.label}
                  </button>
                ))}
              </div>
            </div>
            <div style={{ opacity: form.windNA ? 0.35 : 1, transition: 'opacity 0.2s', pointerEvents: form.windNA ? 'none' : 'auto' }}>
              <Field label="Wind Sensor Orientation" required={!form.windNA} error={!form.windNA ? errors.windOrientation : undefined}>
                <div style={{ position: 'relative' }}>
                  <input
                    className={inputCls('windOrientation')}
                    type="number" min="0" max="359"
                    placeholder="Direction (0–359° from true north)"
                    value={form.windNA ? '' : form.windOrientation}
                    onChange={e => set('windOrientation', e.target.value)}
                    disabled={form.windNA}
                    style={{ paddingRight: 100, background: form.windNA ? 'var(--vio-page-bg)' : undefined, cursor: form.windNA ? 'not-allowed' : undefined }}
                  />
                  <span style={{ position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)', fontSize: 12, color: 'var(--vio-text-muted)' }}>° from true north</span>
                </div>
                <p style={{ fontSize: 11, color: 'var(--vio-text-muted)', marginTop: 5 }}>Direction the wind sensor end point marks to.</p>
              </Field>
            </div>
            <Field label="Structural Element" required error={errors.structuralElement}>
              <input className={inputCls('structuralElement')} placeholder="Tower leg, Horizontal, Cable ladder…" value={form.structuralElement} onChange={e => set('structuralElement', e.target.value)} />
            </Field>
          </div>
        </div>

        <div className="vio-card" style={{ marginBottom: 16 }}>
          <SectionLabel>Power & Confirmation</SectionLabel>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
            <Field label="Battery Voltage (VDC)">
              <input className="vio-input" placeholder="e.g. 12V, 10 volts, or NA if not applicable" value={form.batteryVoltage} onChange={e => set('batteryVoltage', e.target.value)} />
            </Field>
            <Field label="DC Output (VDC)">
              <input className="vio-input" placeholder="e.g. 12VDC, or NA if not applicable" value={form.dcOutput} onChange={e => set('dcOutput', e.target.value)} />
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
          <SectionLabel>Climb Log</SectionLabel>
          {climbs.map((c, i) => (
            <div key={i} style={{ marginBottom: 16, padding: 20, borderRadius: 12, background: 'var(--vio-page-bg)', border: '1px solid var(--vio-card-border)', position: 'relative' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
                <p style={{ fontSize: 14, fontWeight: 600, color: 'var(--vio-primary)' }}>Climb {i + 1}</p>
                {climbs.length > 1 && (
                  <button type="button" onClick={() => setClimbs(p => p.filter((_, j) => j !== i))}
                    style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--vio-status-red)', display: 'flex', alignItems: 'center', gap: 4, fontSize: 12, fontWeight: 500, padding: 4 }}>
                    <Trash2 size={14} /> Remove
                  </button>
                )}
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>
                {/* Up */}
                <div style={{ padding: 16, borderRadius: 10, background: 'var(--vio-card-bg)', border: '1px solid var(--vio-card-border)' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 14 }}>
                    <ArrowUp size={16} style={{ color: 'var(--vio-accent)' }} />
                    <span style={{ fontSize: 13, fontWeight: 600, color: 'var(--vio-text-primary)' }}>Up Start / Up Finish</span>
                  </div>
                  <div style={{ display: 'flex', gap: 10, marginBottom: 14 }}>
                    <button type="button"
                      onClick={() => setClimbs(p => p.map((cl, j) => j === i ? { ...cl, upStart: new Date().toISOString() } : cl))}
                      disabled={!!c.upStart}
                      className={`vio-btn ${c.upStart ? 'vio-btn-ghost' : 'vio-btn-primary'}`}
                      style={{ flex: 1, height: 48, gap: 8, fontSize: 14, fontWeight: 600, borderRadius: 10 }}>
                      <Play size={16} /> Start
                    </button>
                    <button type="button"
                      onClick={() => setClimbs(p => p.map((cl, j) => j === i ? { ...cl, upFinish: new Date().toISOString() } : cl))}
                      disabled={!c.upStart || !!c.upFinish}
                      className={`vio-btn ${c.upFinish ? 'vio-btn-ghost' : c.upStart ? 'vio-btn-primary' : 'vio-btn-ghost'}`}
                      style={{ flex: 1, height: 48, gap: 8, fontSize: 14, fontWeight: 600, borderRadius: 10 }}>
                      <Square size={14} /> Stop
                    </button>
                  </div>
                  <div style={{ fontSize: 13, color: 'var(--vio-text-muted)' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
                      <span>Start:</span>
                      {c.upStart ? (
                        <input type="time" step="1" className="vio-input" value={toTimeInput(c.upStart)}
                          onChange={e => setClimbs(p => p.map((cl, j) => j === i ? { ...cl, upStart: fromTimeInput(e.target.value, cl.upStart) } : cl))}
                          style={{ height: 36, width: 180, fontSize: 13, padding: '0 10px', textAlign: 'center', fontFamily: 'ui-monospace,monospace' }} />
                      ) : <span style={{ color: 'var(--vio-text-muted)' }}>—</span>}
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4 }}>
                      <span>Stop:</span>
                      {c.upFinish ? (
                        <input type="time" step="1" className="vio-input" value={toTimeInput(c.upFinish)}
                          onChange={e => setClimbs(p => p.map((cl, j) => j === i ? { ...cl, upFinish: fromTimeInput(e.target.value, cl.upFinish) } : cl))}
                          style={{ height: 36, width: 180, fontSize: 13, padding: '0 10px', textAlign: 'center', fontFamily: 'ui-monospace,monospace' }} />
                      ) : <span style={{ color: 'var(--vio-text-muted)' }}>—</span>}
                    </div>
                    {calcDur(c.upStart, c.upFinish) && (
                      <div style={{ marginTop: 8, fontSize: 13, fontWeight: 600, color: 'var(--vio-accent)' }}>↑ {calcDur(c.upStart, c.upFinish)} up</div>
                    )}
                  </div>
                  {c.upStart && (
                    <button type="button" onClick={() => setClimbs(p => p.map((cl, j) => j === i ? { ...cl, upStart: '', upFinish: '' } : cl))}
                      style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: 11, color: 'var(--vio-text-muted)', marginTop: 10, textDecoration: 'underline', padding: 0 }}>
                      Reset
                    </button>
                  )}
                </div>

                {/* Down */}
                <div style={{ padding: 16, borderRadius: 10, background: 'var(--vio-card-bg)', border: '1px solid var(--vio-card-border)' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 14 }}>
                    <ArrowDown size={16} style={{ color: '#f59e0b' }} />
                    <span style={{ fontSize: 13, fontWeight: 600, color: 'var(--vio-text-primary)' }}>Down Start / Down Finish</span>
                  </div>
                  <div style={{ display: 'flex', gap: 10, marginBottom: 14 }}>
                    <button type="button"
                      onClick={() => setClimbs(p => p.map((cl, j) => j === i ? { ...cl, downStart: new Date().toISOString() } : cl))}
                      disabled={!!c.downStart}
                      className={`vio-btn ${c.downStart ? 'vio-btn-ghost' : 'vio-btn-primary'}`}
                      style={{ flex: 1, height: 48, gap: 8, fontSize: 14, fontWeight: 600, borderRadius: 10 }}>
                      <Play size={16} /> Start
                    </button>
                    <button type="button"
                      onClick={() => setClimbs(p => p.map((cl, j) => j === i ? { ...cl, downFinish: new Date().toISOString() } : cl))}
                      disabled={!c.downStart || !!c.downFinish}
                      className={`vio-btn ${c.downFinish ? 'vio-btn-ghost' : c.downStart ? 'vio-btn-primary' : 'vio-btn-ghost'}`}
                      style={{ flex: 1, height: 48, gap: 8, fontSize: 14, fontWeight: 600, borderRadius: 10 }}>
                      <Square size={14} /> Stop
                    </button>
                  </div>
                  <div style={{ fontSize: 13, color: 'var(--vio-text-muted)' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
                      <span>Start:</span>
                      {c.downStart ? (
                        <input type="time" step="1" className="vio-input" value={toTimeInput(c.downStart)}
                          onChange={e => setClimbs(p => p.map((cl, j) => j === i ? { ...cl, downStart: fromTimeInput(e.target.value, cl.downStart) } : cl))}
                          style={{ height: 36, width: 180, fontSize: 13, padding: '0 10px', textAlign: 'center', fontFamily: 'ui-monospace,monospace' }} />
                      ) : <span style={{ color: 'var(--vio-text-muted)' }}>—</span>}
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4 }}>
                      <span>Stop:</span>
                      {c.downFinish ? (
                        <input type="time" step="1" className="vio-input" value={toTimeInput(c.downFinish)}
                          onChange={e => setClimbs(p => p.map((cl, j) => j === i ? { ...cl, downFinish: fromTimeInput(e.target.value, cl.downFinish) } : cl))}
                          style={{ height: 36, width: 180, fontSize: 13, padding: '0 10px', textAlign: 'center', fontFamily: 'ui-monospace,monospace' }} />
                      ) : <span style={{ color: 'var(--vio-text-muted)' }}>—</span>}
                    </div>
                    {calcDur(c.downStart, c.downFinish) && (
                      <div style={{ marginTop: 8, fontSize: 13, fontWeight: 600, color: '#f59e0b' }}>↓ {calcDur(c.downStart, c.downFinish)} down</div>
                    )}
                  </div>
                  {c.downStart && (
                    <button type="button" onClick={() => setClimbs(p => p.map((cl, j) => j === i ? { ...cl, downStart: '', downFinish: '' } : cl))}
                      style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: 11, color: 'var(--vio-text-muted)', marginTop: 10, textDecoration: 'underline', padding: 0 }}>
                      Reset
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
          <button type="button" onClick={() => setClimbs(p => [...p, { ...EMPTY_CLIMB }])}
            style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--vio-accent)', fontSize: 13, fontWeight: 500, display: 'flex', alignItems: 'center', gap: 4 }}>
            <Plus size={14} /> Add Climb
          </button>
        </div>

        <div className="vio-card" style={{ marginBottom: 24 }}>
          <SectionLabel>Install Photographs</SectionLabel>
          <p style={{ fontSize: 12, color: 'var(--vio-text-muted)', marginBottom: 14 }}>Take or upload photos of the installation. JPG, PNG, HEIC accepted.</p>

          {/* Camera viewfinder */}
          {installCamOpen && (
            <div style={{ marginBottom: 14, borderRadius: 10, overflow: 'hidden', border: '1px solid var(--vio-card-border)', background: '#000', maxWidth: 480 }}>
              <video ref={installVideoRef} autoPlay playsInline muted style={{ width: '100%', display: 'block', maxHeight: 260, objectFit: 'cover' }} />
              <canvas ref={installCanvasRef} style={{ display: 'none' }} />
              <div style={{ display: 'flex', gap: 10, padding: 12, background: '#111', justifyContent: 'center' }}>
                <button type="button" onClick={captureInstallPhoto} className="vio-btn vio-btn-primary">Capture</button>
                <button type="button" onClick={closeInstallCam} className="vio-btn vio-btn-ghost" style={{ color: '#fff', borderColor: '#444' }}>Cancel</button>
              </div>
            </div>
          )}

          {/* Buttons */}
          {!installCamOpen && (
            <div style={{ display: 'flex', gap: 16, justifyContent: 'center', marginBottom: photos.length > 0 ? 20 : 0 }}>
              <button type="button" onClick={openInstallCam} className="vio-btn vio-btn-secondary"
                style={{ width: 150, height: 100, flexDirection: 'column', gap: 10, fontSize: 13, fontWeight: 600, borderRadius: 12 }}>
                <Camera size={28} />
                Take Photo
              </button>
              <button type="button" onClick={() => installFileRef.current.click()} className="vio-btn vio-btn-ghost"
                style={{ width: 150, height: 100, flexDirection: 'column', gap: 10, fontSize: 13, fontWeight: 600, borderRadius: 12 }}>
                <Upload size={28} />
                Upload Photo
              </button>
              <input ref={installFileRef} type="file" multiple accept="image/*,.heic" style={{ display: 'none' }}
                onChange={e => { handleInstallFiles(e.target.files); e.target.value = '' }} />
            </div>
          )}

          {/* Photo grid */}
          {photos.length > 0 && (
            <>
              <p style={{ fontSize: 13, color: 'var(--vio-text-muted)', marginBottom: 10 }}>{photos.length} photo{photos.length !== 1 ? 's' : ''}</p>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(100px, 1fr))', gap: 10 }}>
                {photos.map((p, i) => (
                  <div key={i} style={{ position: 'relative', aspectRatio: '1', borderRadius: 8, overflow: 'hidden', border: '1px solid var(--vio-card-border)' }}>
                    <img src={p.url} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    <button type="button" onClick={() => setPhotos(ph => ph.filter((_, j) => j !== i))}
                      style={{ position: 'absolute', top: 4, right: 4, width: 22, height: 22, borderRadius: '50%', background: 'rgba(0,0,0,0.6)', border: 'none', cursor: 'pointer', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <X size={12} />
                    </button>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>

        <div style={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center' }}>
          <button type="submit" className="vio-btn vio-btn-primary" disabled={submitting}>
            {submitting ? 'Submitting…' : 'Submit Installation Record'}
          </button>
        </div>
      </form>
    </AppShell>
  )
}

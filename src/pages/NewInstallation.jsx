import { useState, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { Upload, X, Plus, Camera, Trash2, Play, Square, ArrowUp, ArrowDown, Video } from 'lucide-react'
import AppShell from '../components/AppShell'
import { useApp } from '../context/AppContext'
import { useAuth } from '../context/AuthContext'
import { useToast } from '../context/ToastContext'
import { useNotifications } from '../context/NotificationContext'

const EMPTY_CLIMB = { upStart: '', upFinish: '', downStart: '', downFinish: '' }

function fmtTime(iso) {
  if (!iso) return ''
  const d = new Date(iso)
  return d.toLocaleTimeString('en-NZ', { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: true })
}

function timeParts(iso) {
  if (!iso) return { hh: '', mm: '', ss: '', period: 'AM' }
  const d = new Date(iso)
  let h = d.getHours()
  const period = h >= 12 ? 'PM' : 'AM'
  if (h === 0) h = 12
  else if (h > 12) h -= 12
  return {
    hh: String(h).padStart(2, '0'),
    mm: String(d.getMinutes()).padStart(2, '0'),
    ss: String(d.getSeconds()).padStart(2, '0'),
    period,
  }
}

function partsToIso(parts, existingIso) {
  if (!parts.hh || !parts.mm) return existingIso || ''
  let h = parseInt(parts.hh, 10)
  if (parts.period === 'PM' && h < 12) h += 12
  if (parts.period === 'AM' && h === 12) h = 0
  const base = existingIso ? new Date(existingIso) : new Date()
  base.setHours(h, parseInt(parts.mm, 10), parseInt(parts.ss || '0', 10), 0)
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
    heightAGL: '', accelOrientation: '', windOrientation: '', windNA: true, windHeightAGL: '',
    structuralElement: '', batteryVoltage: '', dcOutput: '', powerSource: '',
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
  const [videosPos1, setVideosPos1] = useState([])
  const [videosPos2, setVideosPos2] = useState([])
  const [videoCamOpen, setVideoCamOpen] = useState(false)
  const [videoCamStream, setVideoCamStream] = useState(null)
  const [videoRecorder, setVideoRecorder] = useState(null)
  const [isRecording, setIsRecording] = useState(false)
  const [activeVideoTarget, setActiveVideoTarget] = useState(null)
  const videoCamRef = useRef()
  const videoFileRef1 = useRef()
  const videoFileRef2 = useRef()
  const videoCaptureRef1 = useRef()
  const videoCaptureRef2 = useRef()
  const videoChunksRef = useRef([])
  const [errors, setErrors] = useState({})
  const [submitting, setSubmitting] = useState(false)

  // Mobile detection
  const isMobile = /Android|iPhone|iPad|iPod/i.test(navigator.userAgent)

  // Native capture refs (for mobile)
  const serialCaptureRef = useRef()
  const installCaptureRef = useRef()
  const videoCaptureRef = useRef()

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

  // Video camera functions
  async function openVideoCam(targetSetter) {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'environment' }, audio: true })
      setVideoCamStream(stream)
      setVideoCamOpen(true)
      setActiveVideoTarget(() => targetSetter)
      setTimeout(() => { if (videoCamRef.current) videoCamRef.current.srcObject = stream }, 50)
    } catch { alert('Unable to access camera/microphone.') }
  }

  function startRecording() {
    if (!videoCamStream) return
    videoChunksRef.current = []
    const recorder = new MediaRecorder(videoCamStream, { mimeType: MediaRecorder.isTypeSupported('video/webm') ? 'video/webm' : 'video/mp4' })
    recorder.ondataavailable = e => { if (e.data.size > 0) videoChunksRef.current.push(e.data) }
    recorder.onstop = () => {
      const blob = new Blob(videoChunksRef.current, { type: recorder.mimeType })
      const url = URL.createObjectURL(blob)
      if (activeVideoTarget) activeVideoTarget(v => [...v, { url, name: `tower-video-${Date.now()}.webm`, blob }])
    }
    recorder.start()
    setVideoRecorder(recorder)
    setIsRecording(true)
  }

  function stopRecording() {
    if (videoRecorder && videoRecorder.state !== 'inactive') {
      videoRecorder.stop()
    }
    setIsRecording(false)
    setVideoRecorder(null)
    closeVideoCam()
  }

  function closeVideoCam() {
    if (videoCamStream) videoCamStream.getTracks().forEach(t => t.stop())
    setVideoCamStream(null)
    setVideoCamOpen(false)
    setIsRecording(false)
    setVideoRecorder(null)
    setActiveVideoTarget(null)
  }

  function handleVideoFiles(files, setter) {
    Array.from(files).forEach(file => {
      const url = URL.createObjectURL(file)
      setter(v => [...v, { url, name: file.name, blob: file }])
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
      if (!form.windHeightAGL) e.windHeightAGL = 'Wind sensor install height is required'
      else if (isNaN(parseFloat(form.windHeightAGL)) || parseFloat(form.windHeightAGL) <= 0) e.windHeightAGL = 'Must be a positive number'
      if (!form.windOrientation && form.windOrientation !== '0') e.windOrientation = 'Wind sensor orientation is required'
      else { const v = parseInt(form.windOrientation, 10); if (isNaN(v) || v < 0 || v > 359) e.windOrientation = 'Must be between 0 and 359' }
    }
    if (!form.structuralElement.trim()) e.structuralElement = 'Structural element is required'
    if (form.secureFixing === null) e.secureFixing = 'Please confirm secure fixing'
    if (form.dataFlow === null)     e.dataFlow = 'Please confirm data flow'
    if (!form.powerSource) e.powerSource = 'Device power source is required'
    if (videosPos1.length < 1) e.videosPos1 = 'Tower Video Position 1 is required'
    if (videosPos2.length < 1) e.videosPos2 = 'Tower Video Position 2 is required'
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
    try {
      const id = await addInstallation({
        installerName: form.installerName, company: form.company, dateInstalled: form.dateInstalled,
        siteOwner: form.siteOwner, towerId: form.towerId,
        sensorSerials: form.sensorSerials.split(',').map(s => s.trim()).filter(Boolean),
        heightAGL: parseFloat(form.heightAGL),
        accelOrientation: form.accelOrientation ? parseFloat(form.accelOrientation) : null,
        windOrientation: form.windNA ? null : (form.windOrientation ? parseFloat(form.windOrientation) : null),
        windHeightAGL: form.windNA ? null : (form.windHeightAGL ? parseFloat(form.windHeightAGL) : null),
        structuralElement: form.structuralElement,
        batteryVoltage: form.batteryVoltage || null, dcOutput: form.dcOutput || null,
        powerSource: form.powerSource || null,
        secureFixing: form.secureFixing, dataFlow: form.dataFlow,
        climbs: climbs.map(c => ({
          upStart: c.upStart ? fmtTime(c.upStart) : '',
          upFinish: c.upFinish ? fmtTime(c.upFinish) : '',
          downStart: c.downStart ? fmtTime(c.downStart) : '',
          downFinish: c.downFinish ? fmtTime(c.downFinish) : '',
        })),
      })

      // Upload media files
      const { apiUploadMedia } = await import('../api')
      for (const p of serialPhotos) {
        if (p.blob || p.url?.startsWith('data:')) {
          const blob = p.blob || await fetch(p.url).then(r => r.blob())
          await apiUploadMedia(id, 'serial_photo', new File([blob], p.name || 'serial.jpg', { type: 'image/jpeg' }))
        }
      }
      for (const p of photos) {
        if (p.blob || p.url?.startsWith('data:')) {
          const blob = p.blob || await fetch(p.url).then(r => r.blob())
          await apiUploadMedia(id, 'install_photo', new File([blob], p.name || 'photo.jpg', { type: 'image/jpeg' }))
        }
      }
      for (const v of videosPos1) {
        if (v.blob) {
          await apiUploadMedia(id, 'video_position_1', new File([v.blob], v.name || 'video.webm', { type: 'video/webm' }))
        }
      }
      for (const v of videosPos2) {
        if (v.blob) {
          await apiUploadMedia(id, 'video_position_2', new File([v.blob], v.name || 'video.webm', { type: 'video/webm' }))
        }
      }

      setSubmitting(false)
      push('Installation record submitted successfully', 'success')
      notify(`Installation ${id} submitted successfully`, 'success')

      // Reset form for next installation
      setForm({
        installerName: '', company: user?.company ?? '', dateInstalled: '',
        siteOwner: '', towerId: '', sensorSerials: '',
        heightAGL: '', accelOrientation: '', windOrientation: '', windNA: true, windHeightAGL: '',
        structuralElement: '', batteryVoltage: '', dcOutput: '', powerSource: '',
        secureFixing: null, dataFlow: null,
      })
      setClimbs([{ ...EMPTY_CLIMB }])
      setPhotos([])
      setSerialPhotos([])
      setVideosPos1([])
      setVideosPos2([])
      setErrors({})
      window.scrollTo({ top: 0, behavior: 'smooth' })
    } catch (err) {
      setSubmitting(false)
      notify(err.message || 'Failed to submit installation', 'error')
    }
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

  function TimeDisplay({ iso, onChange }) {
    const [open, setOpen] = useState(false)
    if (!iso) return <span style={{ color: 'var(--vio-text-muted)', fontSize: 14 }}>—</span>
    const p = timeParts(iso)
    const upd = (field, val) => onChange(partsToIso({ ...p, [field]: val }, iso))
    const cellStyle = (active) => ({
      padding: '8px 0', cursor: 'pointer', fontSize: 15, fontWeight: active ? 700 : 400,
      color: active ? '#fff' : 'var(--vio-text-primary)',
      background: active ? '#2563eb' : 'transparent',
      borderRadius: 6, margin: '1px 2px', transition: 'background 0.1s',
    })
    return (
      <div style={{ position: 'relative' }}>
        <div style={{
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          width: '100%', height: 44, padding: '0 14px', borderRadius: 10,
          border: '1.5px solid var(--vio-card-border)', background: 'var(--vio-card-bg)',
          fontFamily: 'ui-monospace,monospace', fontSize: 15, color: 'var(--vio-text-primary)',
        }}>
          <span>{p.hh}:{p.mm}:{p.ss} {p.period.toLowerCase()}</span>
          <button type="button" onClick={() => setOpen(o => !o)} style={{
            background: 'none', border: 'none', cursor: 'pointer', padding: 4,
            color: 'var(--vio-text-muted)', display: 'flex', borderRadius: 6,
          }}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/>
            </svg>
          </button>
        </div>
        {open && (
          <>
            <div onClick={() => setOpen(false)} style={{ position: 'fixed', inset: 0, zIndex: 98 }} />
            <div style={{
              position: 'absolute', top: 'calc(100% + 4px)', left: 0, right: 0, zIndex: 99,
              background: 'var(--vio-card-bg)', border: '1px solid var(--vio-card-border)',
              borderRadius: 12, boxShadow: '0 8px 24px rgba(0,0,0,0.12)',
              padding: 6, display: 'flex', gap: 2,
            }}>
              <div style={{ flex: 1, maxHeight: 180, overflowY: 'auto', textAlign: 'center' }}>
                {Array.from({ length: 12 }, (_, n) => n + 1).map(n => {
                  const v = String(n).padStart(2, '0')
                  return <div key={n} style={cellStyle(v === p.hh)} onClick={() => upd('hh', v)}>{v}</div>
                })}
              </div>
              <div style={{ flex: 1, maxHeight: 180, overflowY: 'auto', textAlign: 'center' }}>
                {Array.from({ length: 60 }, (_, n) => n).map(n => {
                  const v = String(n).padStart(2, '0')
                  return <div key={n} style={cellStyle(v === p.mm)} onClick={() => upd('mm', v)}>{v}</div>
                })}
              </div>
              <div style={{ flex: 1, maxHeight: 180, overflowY: 'auto', textAlign: 'center' }}>
                {Array.from({ length: 60 }, (_, n) => n).map(n => {
                  const v = String(n).padStart(2, '0')
                  return <div key={n} style={cellStyle(v === p.ss)} onClick={() => upd('ss', v)}>{v}</div>
                })}
              </div>
              <div style={{ flex: 1, textAlign: 'center' }}>
                {['AM', 'PM'].map(v => (
                  <div key={v} style={cellStyle(v === p.period)} onClick={() => upd('period', v)}>{v.toLowerCase()}</div>
                ))}
              </div>
            </div>
          </>
        )}
      </div>
    )
  }

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
              <div style={{ position: 'relative' }}>
                <input
                  className={inputCls('dateInstalled')}
                  type="date"
                  value={form.dateInstalled}
                  onChange={e => set('dateInstalled', e.target.value || '')}
                  onInput={e => set('dateInstalled', e.target.value || '')}
                  style={{ color: form.dateInstalled ? 'var(--vio-text-primary)' : 'transparent' }}
                />
                {!form.dateInstalled && (
                  <span style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', fontSize: 14, color: 'var(--vio-text-muted)', pointerEvents: 'none' }}>
                    dd/mm/yyyy
                  </span>
                )}
                {form.dateInstalled && (
                  <button type="button" onClick={() => set('dateInstalled', '')}
                    style={{ position: 'absolute', right: 36, top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: 'var(--vio-text-muted)', display: 'flex', padding: 2 }}>
                    <X size={16} />
                  </button>
                )}
              </div>
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
                <button type="button" onClick={() => isMobile ? serialCaptureRef.current.click() : openCamera()} className="vio-btn vio-btn-secondary" style={{ gap: 8, height: 44, padding: '0 24px', fontSize: 14 }}>
                  <Camera size={18} /> Take Photo
                </button>
                <button type="button" onClick={() => serialFileRef.current.click()} className="vio-btn vio-btn-ghost" style={{ gap: 8, height: 44, padding: '0 24px', fontSize: 14 }}>
                  <Upload size={18} /> Upload Photo
                </button>
                <input ref={serialFileRef} type="file" multiple accept="image/*,.heic" style={{ display: 'none' }}
                  onChange={e => { handleSerialFiles(e.target.files); e.target.value = '' }} />
                <input ref={serialCaptureRef} type="file" accept="image/*" capture="environment" style={{ display: 'none' }}
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
            <Field label="Accelerometer Install Height (m above ground level)" required error={errors.heightAGL}>
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
            <Field label="Structural Element" required error={errors.structuralElement}>
              <input className={inputCls('structuralElement')} placeholder="Tower leg, Horizontal, Cable ladder…" value={form.structuralElement} onChange={e => set('structuralElement', e.target.value)} />
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
              <Field label="Wind Sensor Install Height (m above ground level)" required={!form.windNA} error={!form.windNA ? errors.windHeightAGL : undefined}>
                <div style={{ position: 'relative' }}>
                  <input
                    className={inputCls('windHeightAGL')}
                    type="number" step="0.01" min="0"
                    placeholder="e.g. 25.50"
                    value={form.windNA ? '' : form.windHeightAGL}
                    onChange={e => set('windHeightAGL', e.target.value)}
                    disabled={form.windNA}
                    style={{ paddingRight: 32, background: form.windNA ? 'var(--vio-page-bg)' : undefined, cursor: form.windNA ? 'not-allowed' : undefined }}
                  />
                  <span style={{ position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)', fontSize: 12, color: 'var(--vio-text-muted)' }}>m</span>
                </div>
              </Field>
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
          </div>
        </div>

        <div className="vio-card" style={{ marginBottom: 16 }}>
          <SectionLabel>Power & Confirmation</SectionLabel>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
            <Field label="Device Power Source" required error={errors.powerSource}>
              <select className={inputCls('powerSource')} value={form.powerSource} onChange={e => set('powerSource', e.target.value)}>
                <option value="">Choose power supply</option>
                <option value="Battery Powered">Battery Powered</option>
                <option value="Solar Powered">Solar Powered</option>
                <option value="Tower Power (DC)">Tower Power (DC)</option>
                <option value="External Power Supply">External Power Supply</option>
                <option value="Other">Other</option>
              </select>
              <p style={{ fontSize: 11, color: 'var(--vio-text-muted)', marginTop: 5 }}>Select how the installed device is powered at this tower location.</p>
            </Field>
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
                    <div style={{ marginBottom: 8 }}>
                      <span style={{ display: 'block', marginBottom: 4 }}>Start:</span>
                      <TimeDisplay iso={c.upStart} onChange={val => setClimbs(p => p.map((cl, j) => j === i ? { ...cl, upStart: val } : cl))} />
                    </div>
                    <div style={{ marginBottom: 4 }}>
                      <span style={{ display: 'block', marginBottom: 4 }}>Stop:</span>
                      <TimeDisplay iso={c.upFinish} onChange={val => setClimbs(p => p.map((cl, j) => j === i ? { ...cl, upFinish: val } : cl))} />
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
                    <div style={{ marginBottom: 8 }}>
                      <span style={{ display: 'block', marginBottom: 4, fontSize: 13, color: 'var(--vio-text-muted)' }}>Start:</span>
                      <TimeDisplay iso={c.downStart} onChange={val => setClimbs(p => p.map((cl, j) => j === i ? { ...cl, downStart: val } : cl))} />
                    </div>
                    <div style={{ marginBottom: 4 }}>
                      <span style={{ display: 'block', marginBottom: 4, fontSize: 13, color: 'var(--vio-text-muted)' }}>Stop:</span>
                      <TimeDisplay iso={c.downFinish} onChange={val => setClimbs(p => p.map((cl, j) => j === i ? { ...cl, downFinish: val } : cl))} />
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
              <button type="button" onClick={() => isMobile ? installCaptureRef.current.click() : openInstallCam()} className="vio-btn vio-btn-secondary"
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
              <input ref={installCaptureRef} type="file" accept="image/*" capture="environment" style={{ display: 'none' }}
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

        {/* Tower Video – Position 1 */}
        <div className="vio-card" style={{ marginBottom: 16 }}>
          <SectionLabel>Tower Video – Position 1</SectionLabel>
          <p style={{ fontSize: 13, color: 'var(--vio-text-secondary)', marginBottom: 14, lineHeight: 1.5 }}>
            Move to a location approximately the same distance from the tower base as the height of the tower.
            Record a 30-second video, zoomed in so the top of the tower is clearly visible against the sky.
          </p>

          {videoCamOpen && activeVideoTarget === setVideosPos1 && (
            <div style={{ marginBottom: 14, borderRadius: 10, overflow: 'hidden', border: '1px solid var(--vio-card-border)', background: '#000' }}>
              <video ref={videoCamRef} autoPlay playsInline muted style={{ width: '100%', display: 'block', maxHeight: 300, objectFit: 'cover' }} />
              <div style={{ display: 'flex', gap: 10, padding: 12, background: '#111', justifyContent: 'center', alignItems: 'center' }}>
                {!isRecording ? (
                  <button type="button" onClick={startRecording} className="vio-btn vio-btn-primary" style={{ gap: 6, background: '#dc2626' }}>
                    <div style={{ width: 10, height: 10, borderRadius: '50%', background: '#fff' }} /> Start Recording
                  </button>
                ) : (
                  <button type="button" onClick={stopRecording} className="vio-btn vio-btn-primary" style={{ gap: 6 }}>
                    <Square size={12} /> Stop Recording
                  </button>
                )}
                {!isRecording && <button type="button" onClick={closeVideoCam} className="vio-btn vio-btn-ghost" style={{ color: '#fff', borderColor: '#444' }}>Cancel</button>}
              </div>
            </div>
          )}

          {!(videoCamOpen && activeVideoTarget === setVideosPos1) && (
            <div style={{ display: 'flex', gap: 16, justifyContent: 'center', marginBottom: videosPos1.length > 0 ? 16 : 0 }}>
              <button type="button" onClick={() => isMobile ? videoCaptureRef1.current.click() : openVideoCam(setVideosPos1)} className="vio-btn vio-btn-secondary"
                style={{ width: 150, height: 100, flexDirection: 'column', gap: 10, fontSize: 13, fontWeight: 600, borderRadius: 12 }}>
                <Video size={28} /> Record Video
              </button>
              <button type="button" onClick={() => videoFileRef1.current.click()} className="vio-btn vio-btn-ghost"
                style={{ width: 150, height: 100, flexDirection: 'column', gap: 10, fontSize: 13, fontWeight: 600, borderRadius: 12 }}>
                <Upload size={28} /> Upload Video
              </button>
              <input ref={videoFileRef1} type="file" accept="video/mp4,video/quicktime,video/webm,video/x-msvideo,video/x-matroska,video/3gpp,video/mpeg,.mp4,.mov,.webm,.avi,.mkv,.3gp,.mpeg" style={{ display: 'none' }}
                onChange={e => { handleVideoFiles(e.target.files, setVideosPos1); e.target.value = '' }} />
              <input ref={videoCaptureRef1} type="file" accept="video/mp4,video/quicktime,video/webm,video/x-msvideo,video/x-matroska,video/3gpp,video/mpeg,.mp4,.mov,.webm,.avi,.mkv,.3gp,.mpeg" capture="environment" style={{ display: 'none' }}
                onChange={e => { handleVideoFiles(e.target.files, setVideosPos1); e.target.value = '' }} />
            </div>
          )}

          {videosPos1.length > 0 && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {videosPos1.map((v, i) => (
                <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: 12, borderRadius: 10, border: '1px solid var(--vio-card-border)', background: 'var(--vio-page-bg)' }}>
                  <video src={v.url} controls style={{ width: 160, height: 90, borderRadius: 8, objectFit: 'cover', background: '#000' }} />
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <p style={{ fontSize: 13, fontWeight: 500, color: 'var(--vio-text-primary)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{v.name}</p>
                  </div>
                  <button type="button" onClick={() => setVideosPos1(vids => vids.filter((_, j) => j !== i))}
                    style={{ width: 28, height: 28, borderRadius: '50%', background: 'rgba(220,38,38,0.08)', border: 'none', cursor: 'pointer', color: '#dc2626', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                    <X size={14} />
                  </button>
                </div>
              ))}
            </div>
          )}
          {errors.videosPos1 && <p style={{ fontSize: 12, color: '#dc2626', marginTop: 8 }}>{errors.videosPos1}</p>}
        </div>

        {/* Tower Video – Position 2 */}
        <div className="vio-card" style={{ marginBottom: 24 }}>
          <SectionLabel>Tower Video – Position 2 (90° Angle)</SectionLabel>
          <p style={{ fontSize: 13, color: 'var(--vio-text-secondary)', marginBottom: 14, lineHeight: 1.5 }}>
            Move to a position approximately 90° around the tower from your previous location.
            Record a similar 30-second video, ensuring the top of the tower is clearly visible against the sky.
          </p>

          {videoCamOpen && activeVideoTarget === setVideosPos2 && (
            <div style={{ marginBottom: 14, borderRadius: 10, overflow: 'hidden', border: '1px solid var(--vio-card-border)', background: '#000' }}>
              <video ref={videoCamRef} autoPlay playsInline muted style={{ width: '100%', display: 'block', maxHeight: 300, objectFit: 'cover' }} />
              <div style={{ display: 'flex', gap: 10, padding: 12, background: '#111', justifyContent: 'center', alignItems: 'center' }}>
                {!isRecording ? (
                  <button type="button" onClick={startRecording} className="vio-btn vio-btn-primary" style={{ gap: 6, background: '#dc2626' }}>
                    <div style={{ width: 10, height: 10, borderRadius: '50%', background: '#fff' }} /> Start Recording
                  </button>
                ) : (
                  <button type="button" onClick={stopRecording} className="vio-btn vio-btn-primary" style={{ gap: 6 }}>
                    <Square size={12} /> Stop Recording
                  </button>
                )}
                {!isRecording && <button type="button" onClick={closeVideoCam} className="vio-btn vio-btn-ghost" style={{ color: '#fff', borderColor: '#444' }}>Cancel</button>}
              </div>
            </div>
          )}

          {!(videoCamOpen && activeVideoTarget === setVideosPos2) && (
            <div style={{ display: 'flex', gap: 16, justifyContent: 'center', marginBottom: videosPos2.length > 0 ? 16 : 0 }}>
              <button type="button" onClick={() => isMobile ? videoCaptureRef2.current.click() : openVideoCam(setVideosPos2)} className="vio-btn vio-btn-secondary"
                style={{ width: 150, height: 100, flexDirection: 'column', gap: 10, fontSize: 13, fontWeight: 600, borderRadius: 12 }}>
                <Video size={28} /> Record Video
              </button>
              <button type="button" onClick={() => videoFileRef2.current.click()} className="vio-btn vio-btn-ghost"
                style={{ width: 150, height: 100, flexDirection: 'column', gap: 10, fontSize: 13, fontWeight: 600, borderRadius: 12 }}>
                <Upload size={28} /> Upload Video
              </button>
              <input ref={videoFileRef2} type="file" accept="video/mp4,video/quicktime,video/webm,video/x-msvideo,video/x-matroska,video/3gpp,video/mpeg,.mp4,.mov,.webm,.avi,.mkv,.3gp,.mpeg" style={{ display: 'none' }}
                onChange={e => { handleVideoFiles(e.target.files, setVideosPos2); e.target.value = '' }} />
              <input ref={videoCaptureRef2} type="file" accept="video/mp4,video/quicktime,video/webm,video/x-msvideo,video/x-matroska,video/3gpp,video/mpeg,.mp4,.mov,.webm,.avi,.mkv,.3gp,.mpeg" capture="environment" style={{ display: 'none' }}
                onChange={e => { handleVideoFiles(e.target.files, setVideosPos2); e.target.value = '' }} />
            </div>
          )}

          {videosPos2.length > 0 && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {videosPos2.map((v, i) => (
                <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: 12, borderRadius: 10, border: '1px solid var(--vio-card-border)', background: 'var(--vio-page-bg)' }}>
                  <video src={v.url} controls style={{ width: 160, height: 90, borderRadius: 8, objectFit: 'cover', background: '#000' }} />
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <p style={{ fontSize: 13, fontWeight: 500, color: 'var(--vio-text-primary)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{v.name}</p>
                  </div>
                  <button type="button" onClick={() => setVideosPos2(vids => vids.filter((_, j) => j !== i))}
                    style={{ width: 28, height: 28, borderRadius: '50%', background: 'rgba(220,38,38,0.08)', border: 'none', cursor: 'pointer', color: '#dc2626', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                    <X size={14} />
                  </button>
                </div>
              ))}
            </div>
          )}
          {errors.videosPos2 && <p style={{ fontSize: 12, color: '#dc2626', marginTop: 8 }}>{errors.videosPos2}</p>}
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

import { useState, useRef } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { ArrowLeft, Camera, Upload, X, Plus, Trash2, Video } from 'lucide-react'
import AppShell from '../components/AppShell'
import { useApp } from '../context/AppContext'
import { useToast } from '../context/ToastContext'

function SectionLabel({ children }) {
  return <p style={{ fontSize: 15, fontWeight: 700, color: 'var(--vio-accent)', marginBottom: 16, textTransform: 'uppercase', letterSpacing: '0.06em' }}>{children}</p>
}

function Field({ label, required, error, children }) {
  return (
    <div>
      <label style={{ display: 'block', fontSize: 15, fontWeight: 600, color: 'var(--vio-text-secondary)', marginBottom: 6 }}>
        {label}{required && <span style={{ color: '#dc2626', marginLeft: 3 }}>*</span>}
      </label>
      {children}
      {error && <p style={{ fontSize: 12, color: '#dc2626', marginTop: 4 }}>{error}</p>}
    </div>
  )
}

export default function InstallDetail() {
  const { id } = useParams()
  const { installations, updateInstallation, refresh } = useApp()
  const { push } = useToast()
  const navigate = useNavigate()
  const rec = installations.find(i => i.id === id)
  const isMobile = /Android|iPhone|iPad|iPod/i.test(navigator.userAgent)

  const [form, setForm] = useState(() => rec ? {
    installerName: rec.installer_name || '',
    dateInstalled: rec.date_installed || '',
    siteOwner: rec.site_owner || '',
    towerId: rec.tower_id || '',
    sensorSerials: rec.sensor_serials || '',
    heightAGL: rec.height_agl ?? '',
    accelOrientation: rec.accel_orientation ?? '',
    accelFacingDirection: rec.accel_facing_direction ?? '',
    windNA: rec.wind_orientation == null,
    windOrientation: rec.wind_orientation ?? '',
    windHeightAGL: rec.wind_height_agl ?? '',
    structuralElement: rec.structural_element || '',
    powerSource: rec.power_source || '',
    batteryVoltage: rec.battery_voltage || '',
    dcOutput: rec.dc_output || '',
    secureFixing: rec.secure_fixing,
    dataFlow: rec.data_flow,
  } : {})

  const API_BASE = import.meta.env.VITE_API_URL || ''
  const resolveUrl = (url) => {
    if (!url) return ''
    if (url.startsWith('http') || url.startsWith('data:') || url.startsWith('blob:')) return url
    return `${API_BASE}${url}`
  }

  const [serialPhotos, setSerialPhotos] = useState(() =>
    (rec?.media || []).filter(m => m.media_type === 'serial_photo').map(m => ({ url: resolveUrl(m.url), name: m.filename, id: m.id }))
  )
  const [photos, setPhotos] = useState(() =>
    (rec?.media || []).filter(m => m.media_type === 'install_photo').map(m => ({ url: resolveUrl(m.url), name: m.filename, id: m.id }))
  )
  const [videosPos1, setVideosPos1] = useState(() =>
    (rec?.media || []).filter(m => m.media_type === 'video_position_1').map(m => ({ url: resolveUrl(m.url), name: m.filename, id: m.id }))
  )
  const [videosPos2, setVideosPos2] = useState(() =>
    (rec?.media || []).filter(m => m.media_type === 'video_position_2').map(m => ({ url: resolveUrl(m.url), name: m.filename, id: m.id }))
  )
  const [climbs, setClimbs] = useState(() => {
    if (!rec?.climbs?.length) return [{ upStart: '', upFinish: '', downStart: '', downFinish: '' }]
    return rec.climbs.map(c => ({ upStart: c.up_start || '', upFinish: c.up_finish || '', downStart: c.down_start || '', downFinish: c.down_finish || '' }))
  })
  const [errors, setErrors] = useState({})
  const [saving, setSaving] = useState(false)
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)
  const [deleting, setDeleting] = useState(false)

  const serialFileRef = useRef()
  const serialCaptureRef = useRef()
  const installFileRef = useRef()
  const installCaptureRef = useRef()
  const videoFileRef1 = useRef()
  const videoFileRef2 = useRef()
  const videoCaptureRef1 = useRef()
  const videoCaptureRef2 = useRef()

  if (!rec) return (
    <AppShell title="Edit Installation">
      <div style={{ textAlign: 'center', padding: 64 }}>
        <p style={{ fontSize: 18, color: 'var(--vio-text-muted)' }}>Installation not found.</p>
        <button className="vio-btn vio-btn-primary" style={{ marginTop: 16 }} onClick={() => navigate('/install-records')}>Back to records</button>
      </div>
    </AppShell>
  )

  const set = (k, v) => { setForm(f => ({ ...f, [k]: v })); setErrors(e => ({ ...e, [k]: undefined })) }
  const inputCls = k => `vio-input${errors[k] ? ' invalid' : ''}`

  function addFiles(files, setter) {
    Array.from(files).forEach(file => {
      const reader = new FileReader()
      reader.onload = ev => setter(p => [...p, { url: ev.target.result, name: file.name }])
      reader.readAsDataURL(file)
    })
  }
  function addVideoFiles(files, setter) {
    Array.from(files).forEach(file => {
      setter(v => [...v, { url: URL.createObjectURL(file), name: file.name, blob: file }])
    })
  }

  const YesNo = ({ field }) => (
    <div style={{ display: 'flex', gap: 10 }}>
      {[true, false].map(v => (
        <button key={String(v)} type="button" onClick={() => set(field, v)}
          className={`vio-btn ${form[field] === v ? 'vio-btn-primary' : 'vio-btn-ghost'}`}
          style={{ height: 52, padding: '0 36px', fontSize: 17, minWidth: 100 }}>
          {v ? 'Yes' : 'No'}
        </button>
      ))}
    </div>
  )

  async function handleSave() {
    const e = {}
    if (!form.installerName.trim()) e.installerName = 'Required'
    if (!form.siteOwner.trim()) e.siteOwner = 'Required'
    if (!form.towerId.trim()) e.towerId = 'Required'
    if (!form.sensorSerials.trim()) e.sensorSerials = 'Required'
    if (!form.heightAGL) e.heightAGL = 'Required'
    if (!form.structuralElement.trim()) e.structuralElement = 'Required'
    if (form.secureFixing === null) e.secureFixing = 'Required'
    if (form.dataFlow === null) e.dataFlow = 'Required'
    if (Object.keys(e).length) { setErrors(e); return }

    setSaving(true)
    try {
      await updateInstallation(id, {
        installerName: form.installerName, dateInstalled: form.dateInstalled,
        siteOwner: form.siteOwner, towerId: form.towerId, sensorSerials: form.sensorSerials,
        heightAGL: parseFloat(form.heightAGL),
        accelOrientation: form.accelOrientation ? parseFloat(form.accelOrientation) : null,
        accelFacingDirection: form.accelFacingDirection ? parseInt(form.accelFacingDirection, 10) : null,
        windOrientation: form.windNA ? null : (form.windOrientation ? parseFloat(form.windOrientation) : null),
        windHeightAGL: form.windNA ? null : (form.windHeightAGL ? parseFloat(form.windHeightAGL) : null),
        structuralElement: form.structuralElement,
        powerSource: form.powerSource || null,
        batteryVoltage: form.batteryVoltage || null, dcOutput: form.dcOutput || null,
        secureFixing: form.secureFixing, dataFlow: form.dataFlow,
        climbs: climbs.map(c => ({ upStart: c.upStart || '', upFinish: c.upFinish || '', downStart: c.downStart || '', downFinish: c.downFinish || '' })),
      })
      const { apiUploadMedia } = await import('../api')
      for (const p of serialPhotos) { if (!p.id && (p.blob || p.url?.startsWith('data:'))) { const blob = p.blob || await fetch(p.url).then(r => r.blob()); await apiUploadMedia(id, 'serial_photo', new File([blob], p.name || 'serial.jpg', { type: 'image/jpeg' })) } }
      for (const p of photos) { if (!p.id && (p.blob || p.url?.startsWith('data:'))) { const blob = p.blob || await fetch(p.url).then(r => r.blob()); await apiUploadMedia(id, 'install_photo', new File([blob], p.name || 'photo.jpg', { type: 'image/jpeg' })) } }
      for (const v of videosPos1) { if (!v.id && v.blob) { await apiUploadMedia(id, 'video_position_1', new File([v.blob], v.name || 'video.webm', { type: 'video/webm' })) } }
      for (const v of videosPos2) { if (!v.id && v.blob) { await apiUploadMedia(id, 'video_position_2', new File([v.blob], v.name || 'video.webm', { type: 'video/webm' })) } }
      setSaving(false)
      push('Installation updated successfully', 'success')
      navigate('/install-records')
    } catch (err) { setSaving(false); push(err.message || 'Failed to update', 'error') }
  }

  async function handleDelete() {
    setDeleting(true)
    try {
      const { apiDeleteInstallation } = await import('../api')
      await apiDeleteInstallation(id)
      push('Installation deleted', 'success')
      await refresh()
      navigate('/install-records')
    } catch (err) { push(err.message || 'Failed to delete', 'error') }
    setDeleting(false)
    setShowDeleteConfirm(false)
  }

  function MediaSection({ title, items, setItems, fileRef, captureRef, accept, isVideo }) {
    const [camOpen, setCamOpen] = useState(false)
    const [camStream, setCamStream] = useState(null)
    const [recorder, setRecorder] = useState(null)
    const [recording, setRecording] = useState(false)
    const vidRef = useRef()
    const canRef = useRef()
    const chunksRef = useRef([])

    async function openWebcam() {
      try {
        const stream = await navigator.mediaDevices.getUserMedia(
          isVideo ? { video: { facingMode: 'environment' }, audio: true } : { video: { facingMode: 'environment' } }
        )
        setCamStream(stream)
        setCamOpen(true)
        setTimeout(() => { if (vidRef.current) vidRef.current.srcObject = stream }, 50)
      } catch { alert('Unable to access camera.') }
    }

    function capturePhoto() {
      const v = vidRef.current, c = canRef.current
      if (!v || !c) return
      c.width = v.videoWidth; c.height = v.videoHeight
      c.getContext('2d').drawImage(v, 0, 0)
      const url = c.toDataURL('image/jpeg', 0.85)
      setItems(p => [...p, { url, name: `capture-${Date.now()}.jpg` }])
      closeCam()
    }

    function startRec() {
      if (!camStream) return
      chunksRef.current = []
      const rec = new MediaRecorder(camStream)
      rec.ondataavailable = e => { if (e.data.size > 0) chunksRef.current.push(e.data) }
      rec.onstop = () => {
        const blob = new Blob(chunksRef.current, { type: rec.mimeType })
        setItems(v => [...v, { url: URL.createObjectURL(blob), name: `video-${Date.now()}.webm`, blob }])
      }
      rec.start()
      setRecorder(rec)
      setRecording(true)
    }

    function stopRec() {
      if (recorder && recorder.state !== 'inactive') recorder.stop()
      setRecording(false)
      setRecorder(null)
      closeCam()
    }

    function closeCam() {
      if (camStream) camStream.getTracks().forEach(t => t.stop())
      setCamStream(null)
      setCamOpen(false)
      setRecording(false)
      setRecorder(null)
    }

    return (
      <div className="vio-card" style={{ marginBottom: 16 }}>
        <SectionLabel>{title}</SectionLabel>

        {/* Webcam viewfinder (desktop) */}
        {camOpen && (
          <div style={{ marginBottom: 14, borderRadius: 10, overflow: 'hidden', border: '1px solid var(--vio-card-border)', background: '#000' }}>
            <video ref={vidRef} autoPlay playsInline muted style={{ width: '100%', display: 'block', maxHeight: 260, objectFit: 'cover' }} />
            <canvas ref={canRef} style={{ display: 'none' }} />
            <div style={{ display: 'flex', gap: 10, padding: 12, background: '#111', justifyContent: 'center' }}>
              {isVideo ? (
                !recording ? (
                  <button type="button" onClick={startRec} className="vio-btn vio-btn-primary" style={{ gap: 6, background: '#dc2626' }}>
                    <div style={{ width: 10, height: 10, borderRadius: '50%', background: '#fff' }} /> Start Recording
                  </button>
                ) : (
                  <button type="button" onClick={stopRec} className="vio-btn vio-btn-primary" style={{ gap: 6 }}>Stop Recording</button>
                )
              ) : (
                <button type="button" onClick={capturePhoto} className="vio-btn vio-btn-primary">Capture</button>
              )}
              {!recording && <button type="button" onClick={closeCam} className="vio-btn vio-btn-ghost" style={{ color: '#fff', borderColor: '#444' }}>Cancel</button>}
            </div>
          </div>
        )}

        {/* Buttons */}
        {!camOpen && (
          <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap', marginBottom: items.length > 0 ? 14 : 0 }}>
            <button type="button" onClick={() => isMobile && captureRef ? captureRef.current.click() : openWebcam()} className="vio-btn vio-btn-secondary"
              style={{ flex: 1, maxWidth: 160, height: 70, flexDirection: 'column', gap: 6, fontSize: 13, fontWeight: 600, borderRadius: 10 }}>
              <Camera size={22} /> {isVideo ? 'Record Video' : 'Take Photo'}
            </button>
            <button type="button" onClick={() => fileRef.current.click()} className="vio-btn vio-btn-ghost"
              style={{ flex: 1, maxWidth: 160, height: 70, flexDirection: 'column', gap: 6, fontSize: 13, fontWeight: 600, borderRadius: 10 }}>
              <Upload size={22} /> {isVideo ? 'Upload Video' : 'Upload Photo'}
            </button>
            <input ref={fileRef} type="file" multiple accept={accept} style={{ display: 'none' }}
              onChange={e => { isVideo ? addVideoFiles(e.target.files, setItems) : addFiles(e.target.files, setItems); e.target.value = '' }} />
            {captureRef && (
              <input ref={captureRef} type="file" accept={isVideo ? 'video/*' : 'image/*'} capture="environment" style={{ display: 'none' }}
                onChange={e => { isVideo ? addVideoFiles(e.target.files, setItems) : addFiles(e.target.files, setItems); e.target.value = '' }} />
            )}
          </div>
        )}

        {/* Media list */}
        {items.length > 0 && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {items.map((p, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: 10, borderRadius: 8, border: '1px solid var(--vio-card-border)', background: 'var(--vio-page-bg)' }}>
                {isVideo ? (
                  <video src={p.url} controls style={{ width: 120, height: 68, borderRadius: 6, objectFit: 'cover', background: '#000' }} />
                ) : (
                  <img src={p.url} alt="" style={{ width: 56, height: 56, borderRadius: 6, objectFit: 'cover' }} />
                )}
                <p style={{ flex: 1, fontSize: 12, color: 'var(--vio-text-primary)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', minWidth: 0 }}>{p.name}</p>
                <button type="button" onClick={() => setItems(prev => prev.filter((_, j) => j !== i))}
                  style={{ width: 24, height: 24, borderRadius: '50%', background: 'rgba(220,38,38,0.08)', border: 'none', cursor: 'pointer', color: '#dc2626', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  <X size={12} />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    )
  }

  return (
    <AppShell title={`Edit — ${rec.id}`}>
      <button className="vio-btn vio-btn-ghost vio-btn-sm" style={{ marginBottom: 20, gap: 6 }} onClick={() => navigate('/install-records')}>
        <ArrowLeft size={14} /> Back to records
      </button>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 16, maxWidth: 800 }}>
        {/* Installer & Site */}
        <div className="vio-card">
          <SectionLabel>Installer & Site</SectionLabel>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
            <Field label="Installer Name" required error={errors.installerName}>
              <input className={inputCls('installerName')} value={form.installerName} onChange={e => set('installerName', e.target.value)} />
            </Field>
            <Field label="Company">
              <input className="vio-input" value={rec.company_name} readOnly disabled style={{ background: 'var(--vio-page-bg)', cursor: 'not-allowed' }} />
            </Field>
            <Field label="Date Installed">
              <input className="vio-input" type="date" value={form.dateInstalled} onChange={e => set('dateInstalled', e.target.value)} />
            </Field>
            <Field label="Submitted">
              <input className="vio-input" value={rec.submitted_at ? new Date(rec.submitted_at).toLocaleString() : ''} readOnly disabled style={{ background: 'var(--vio-page-bg)', cursor: 'not-allowed' }} />
            </Field>
          </div>
        </div>

        {/* Asset & Sensor */}
        <div className="vio-card">
          <SectionLabel>Asset & Sensor</SectionLabel>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
            <Field label="Site Owner" required error={errors.siteOwner}>
              <input className={inputCls('siteOwner')} value={form.siteOwner} onChange={e => set('siteOwner', e.target.value)} />
            </Field>
            <Field label="Tower ID / Asset Tag" required error={errors.towerId}>
              <input className={inputCls('towerId')} value={form.towerId} onChange={e => set('towerId', e.target.value)} />
            </Field>
          </div>
          <div style={{ marginTop: 16 }}>
            <Field label="Sensor Serial(s)" required error={errors.sensorSerials}>
              <input className={inputCls('sensorSerials')} value={form.sensorSerials} onChange={e => set('sensorSerials', e.target.value)} />
            </Field>
          </div>
        </div>

        {/* Serial Photos */}
        <MediaSection title="Serial Number Photos" items={serialPhotos} setItems={setSerialPhotos} fileRef={serialFileRef} captureRef={serialCaptureRef} accept="image/*,.heic" />

        {/* Installation Setup */}
        <div className="vio-card">
          <SectionLabel>Installation Setup</SectionLabel>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
            <Field label="Accelerometer Install Height (m above ground level)" required error={errors.heightAGL}>
              <div style={{ position: 'relative' }}>
                <input className={inputCls('heightAGL')} type="number" step="0.01" min="0" value={form.heightAGL} onChange={e => set('heightAGL', e.target.value)} style={{ paddingRight: 32 }} />
                <span style={{ position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)', fontSize: 12, color: 'var(--vio-text-muted)' }}>m</span>
              </div>
            </Field>
            <Field label="Accelerometer Orientation (Which direction is the pink label (front face of the device) pointing after installation?)" error={errors.accelOrientation}>
              <div style={{ position: 'relative' }}>
                <input className="vio-input" type="number" min="0" max="359" value={form.accelOrientation} onChange={e => set('accelOrientation', e.target.value)} style={{ paddingRight: 100 }} />
                <span style={{ position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)', fontSize: 12, color: 'var(--vio-text-muted)' }}>° from true north</span>
              </div>
            </Field>
            <Field label="Structural Element" required error={errors.structuralElement}>
              <input className={inputCls('structuralElement')} value={form.structuralElement} onChange={e => set('structuralElement', e.target.value)} />
            </Field>
            <div>
              <label style={{ display: 'block', fontSize: 15, fontWeight: 600, color: 'var(--vio-text-secondary)', marginBottom: 6 }}>Wind sensor?</label>
              <div style={{ display: 'flex', gap: 10 }}>
                {[{ label: 'Yes', value: false }, { label: 'No', value: true }].map(opt => (
                  <button key={opt.label} type="button" onClick={() => set('windNA', opt.value)}
                    className={`vio-btn ${form.windNA === opt.value ? 'vio-btn-primary' : 'vio-btn-ghost'}`}
                    style={{ height: 52, padding: '0 36px', fontSize: 17, minWidth: 100 }}>{opt.label}</button>
                ))}
              </div>
            </div>
            <div style={{ opacity: form.windNA ? 0.35 : 1, transition: 'opacity 0.2s', pointerEvents: form.windNA ? 'none' : 'auto' }}>
              <Field label="Wind Sensor Install Height (m)">
                <div style={{ position: 'relative' }}>
                  <input className="vio-input" type="number" step="0.01" min="0" value={form.windNA ? '' : form.windHeightAGL} onChange={e => set('windHeightAGL', e.target.value)} disabled={form.windNA} style={{ paddingRight: 32 }} />
                  <span style={{ position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)', fontSize: 12, color: 'var(--vio-text-muted)' }}>m</span>
                </div>
              </Field>
            </div>
            <div style={{ opacity: form.windNA ? 0.35 : 1, transition: 'opacity 0.2s', pointerEvents: form.windNA ? 'none' : 'auto' }}>
              <Field label="Wind Sensor Orientation">
                <div style={{ position: 'relative' }}>
                  <input className="vio-input" type="number" min="0" max="359" value={form.windNA ? '' : form.windOrientation} onChange={e => set('windOrientation', e.target.value)} disabled={form.windNA} style={{ paddingRight: 100 }} />
                  <span style={{ position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)', fontSize: 12, color: 'var(--vio-text-muted)' }}>° from true north</span>
                </div>
              </Field>
            </div>
          </div>
        </div>

        {/* Power & Confirmation */}
        <div className="vio-card">
          <SectionLabel>Power & Confirmation</SectionLabel>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
            <Field label="Device Power Source">
              <div style={{ position: 'relative' }}>
                <select className="vio-input" value={form.powerSource} onChange={e => set('powerSource', e.target.value)} style={{ appearance: 'none', WebkitAppearance: 'none', paddingRight: 40, cursor: 'pointer' }}>
                  <option value="">Choose power supply</option>
                  <option value="Battery Powered">Battery Powered</option>
                  <option value="Solar Powered">Solar Powered</option>
                  <option value="Tower Power (DC)">Tower Power (DC)</option>
                  <option value="External Power Supply">External Power Supply</option>
                  <option value="Other">Other</option>
                </select>
              </div>
            </Field>
            <Field label="Battery Voltage (VDC)">
              <input className="vio-input" value={form.batteryVoltage} onChange={e => set('batteryVoltage', e.target.value)} placeholder="e.g. 12V, or NA" />
            </Field>
            <Field label="DC Output (VDC)">
              <input className="vio-input" value={form.dcOutput} onChange={e => set('dcOutput', e.target.value)} placeholder="e.g. 12VDC, or NA" />
            </Field>
            <Field label="Secure Fixing Confirmed" required error={errors.secureFixing}>
              <YesNo field="secureFixing" />
            </Field>
            <Field label="Data Flow on myViotel" required error={errors.dataFlow}>
              <YesNo field="dataFlow" />
            </Field>
          </div>
        </div>

        {/* Climb Log */}
        <div className="vio-card">
          <SectionLabel>Climb Log</SectionLabel>
          {climbs.map((c, i) => (
            <div key={i} style={{ marginBottom: 16, padding: 16, borderRadius: 10, background: 'var(--vio-page-bg)', border: '1px solid var(--vio-card-border)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
                <p style={{ fontSize: 14, fontWeight: 600, color: 'var(--vio-primary)' }}>Climb {i + 1}</p>
                {climbs.length > 1 && (
                  <button type="button" onClick={() => setClimbs(p => p.filter((_, j) => j !== i))}
                    style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--vio-status-red)', fontSize: 12, fontWeight: 500 }}>Remove</button>
                )}
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                {[['upStart','Up Start'],['upFinish','Up Finish'],['downStart','Down Start'],['downFinish','Down Finish']].map(([k, label]) => (
                  <div key={k}>
                    <label style={{ display: 'block', fontSize: 12, fontWeight: 500, color: 'var(--vio-text-muted)', marginBottom: 4 }}>{label}</label>
                    <input className="vio-input" placeholder="e.g. 09:30:00 am" value={c[k]}
                      onChange={e => setClimbs(p => p.map((cl, j) => j === i ? { ...cl, [k]: e.target.value } : cl))} />
                  </div>
                ))}
              </div>
            </div>
          ))}
          <button type="button" onClick={() => setClimbs(p => [...p, { upStart: '', upFinish: '', downStart: '', downFinish: '' }])}
            style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--vio-accent)', fontSize: 13, fontWeight: 500, display: 'flex', alignItems: 'center', gap: 4 }}>
            <Plus size={14} /> Add Climb
          </button>
        </div>

        {/* Install Photographs */}
        <MediaSection title="Install Photographs" items={photos} setItems={setPhotos} fileRef={installFileRef} captureRef={installCaptureRef} accept="image/*,.heic" />

        {/* Tower Video Position 1 */}
        <MediaSection title="Tower Video – Position 1" items={videosPos1} setItems={setVideosPos1} fileRef={videoFileRef1} captureRef={videoCaptureRef1}
          accept="video/mp4,video/quicktime,video/webm,.mp4,.mov,.webm" isVideo />

        {/* Tower Video Position 2 */}
        <MediaSection title="Tower Video – Position 2 (90°)" items={videosPos2} setItems={setVideosPos2} fileRef={videoFileRef2} captureRef={videoCaptureRef2}
          accept="video/mp4,video/quicktime,video/webm,.mp4,.mov,.webm" isVideo />

        {/* Actions */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 12, padding: '8px 0' }}>
          <button className="vio-btn vio-btn-danger" style={{ gap: 6 }} onClick={() => setShowDeleteConfirm(true)}>
            <Trash2 size={16} /> Delete Record
          </button>
          <div style={{ display: 'flex', gap: 10 }}>
            <button className="vio-btn vio-btn-primary" onClick={() => navigate('/install-records')}>Cancel</button>
            <button className="vio-btn vio-btn-primary" onClick={handleSave} disabled={saving}>
              {saving ? 'Save Changes' : 'Save Changes'}
            </button>
          </div>
        </div>
      </div>

      {/* Delete confirmation modal */}
      {showDeleteConfirm && (
        <div style={{ position: 'fixed', inset: 0, zIndex: 9999, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24 }}>
          <div onClick={() => setShowDeleteConfirm(false)} style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.5)' }} />
          <div style={{ position: 'relative', background: 'var(--vio-card-bg)', borderRadius: 16, padding: '28px 24px', maxWidth: 400, width: '100%', boxShadow: '0 12px 40px rgba(0,0,0,0.2)' }}>
            <h3 style={{ fontSize: 18, fontWeight: 700, color: 'var(--vio-text-primary)', marginBottom: 12 }}>Delete Installation?</h3>
            <p style={{ fontSize: 14, color: 'var(--vio-text-secondary)', lineHeight: 1.5, marginBottom: 24 }}>
              Are you sure you want to delete this installation record? This action cannot be undone. All data, photos, and videos will be permanently removed.
            </p>
            <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end' }}>
              <button className="vio-btn vio-btn-ghost" onClick={() => setShowDeleteConfirm(false)}>Cancel</button>
              <button className="vio-btn vio-btn-danger" onClick={handleDelete} disabled={deleting} style={{ gap: 6 }}>
                <Trash2 size={15} /> {deleting ? 'Yes, Delete' : 'Yes, Delete'}
              </button>
            </div>
          </div>
        </div>
      )}
    </AppShell>
  )
}

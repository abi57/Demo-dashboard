import { useState, useRef } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { ArrowLeft, Camera, Upload, X, Plus } from 'lucide-react'
import AppShell from '../components/AppShell'
import { useApp } from '../context/AppContext'
import { useToast } from '../context/ToastContext'

function SectionLabel({ children }) {
  return <p style={{ fontSize: 13, fontWeight: 700, color: 'var(--vio-accent)', marginBottom: 16, textTransform: 'uppercase', letterSpacing: '0.06em' }}>{children}</p>
}

function Field({ label, required, error, children }) {
  return (
    <div>
      <label style={{ display: 'block', fontSize: 13, fontWeight: 500, color: 'var(--vio-text-secondary)', marginBottom: 6 }}>
        {label}{required && <span style={{ color: '#dc2626', marginLeft: 3 }}>*</span>}
      </label>
      {children}
      {error && <p style={{ fontSize: 12, color: '#dc2626', marginTop: 4 }}>{error}</p>}
    </div>
  )
}

export default function InstallDetail() {
  const { id } = useParams()
  const { installations, updateInstallation } = useApp()
  const { push } = useToast()
  const navigate = useNavigate()
  const rec = installations.find(i => i.id === id)

  const [form, setForm] = useState(() => rec ? {
    installerName: rec.installer_name || '',
    dateInstalled: rec.date_installed || '',
    siteOwner: rec.site_owner || '',
    towerId: rec.tower_id || '',
    sensorSerials: rec.sensor_serials || '',
    heightAGL: rec.height_agl ?? '',
    accelOrientation: rec.accel_orientation ?? '',
    windNA: rec.wind_orientation == null,
    windOrientation: rec.wind_orientation ?? '',
    structuralElement: rec.structural_element || '',
    batteryVoltage: rec.battery_voltage || '',
    dcOutput: rec.dc_output || '',
    secureFixing: rec.secure_fixing,
    dataFlow: rec.data_flow,
  } : {})

  const [serialPhotos, setSerialPhotos] = useState(() =>
    (rec?.media || []).filter(m => m.media_type === 'serial_photo').map(m => ({ url: m.url, name: m.filename, id: m.id }))
  )
  const [photos, setPhotos] = useState(() =>
    (rec?.media || []).filter(m => m.media_type === 'install_photo').map(m => ({ url: m.url, name: m.filename, id: m.id }))
  )
  const [climbs, setClimbs] = useState(() => {
    if (!rec?.climbs?.length) return [{ upStart: '', upFinish: '', downStart: '', downFinish: '' }]
    return rec.climbs.map(c => ({
      upStart: c.up_start || '', upFinish: c.up_finish || '',
      downStart: c.down_start || '', downFinish: c.down_finish || '',
    }))
  })
  const [errors, setErrors] = useState({})
  const [saving, setSaving] = useState(false)

  // Camera state for serial photos
  const [serialCamOpen, setSerialCamOpen] = useState(false)
  const [serialCamStream, setSerialCamStream] = useState(null)
  const serialVideoRef = useRef()
  const serialCanvasRef = useRef()
  const serialFileRef = useRef()

  // Camera state for install photos
  const [installCamOpen, setInstallCamOpen] = useState(false)
  const [installCamStream, setInstallCamStream] = useState(null)
  const installVideoRef = useRef()
  const installCanvasRef = useRef()
  const installFileRef = useRef()

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

  // Camera helpers
  async function openCam(setStream, setOpen, videoRef) {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'environment' } })
      setStream(stream)
      setOpen(true)
      setTimeout(() => { if (videoRef.current) videoRef.current.srcObject = stream }, 50)
    } catch { alert('Unable to access camera.') }
  }
  function capture(videoRef, canvasRef, addFn, closeFn) {
    const v = videoRef.current, c = canvasRef.current
    if (!v || !c) return
    c.width = v.videoWidth; c.height = v.videoHeight
    c.getContext('2d').drawImage(v, 0, 0)
    addFn({ url: c.toDataURL('image/jpeg', 0.85), name: `capture-${Date.now()}.jpg` })
    closeFn()
  }
  function closeCam(stream, setStream, setOpen) {
    if (stream) stream.getTracks().forEach(t => t.stop())
    setStream(null); setOpen(false)
  }
  function addFiles(files, setter, max) {
    Array.from(files).slice(0, max).forEach(file => {
      const reader = new FileReader()
      reader.onload = ev => setter(p => [...p, { url: ev.target.result, name: file.name }])
      reader.readAsDataURL(file)
    })
  }

  const YesNo = ({ field }) => (
    <div style={{ display: 'flex', gap: 10 }}>
      {[true, false].map(v => (
        <button key={String(v)} type="button" onClick={() => set(field, v)}
          className={`vio-btn ${form[field] === v ? 'vio-btn-primary' : 'vio-btn-ghost'}`}
          style={{ height: 42, padding: '0 28px', fontSize: 14, minWidth: 80 }}>
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
        installerName: form.installerName,
        dateInstalled: form.dateInstalled,
        siteOwner: form.siteOwner,
        towerId: form.towerId,
        sensorSerials: form.sensorSerials,
        heightAGL: parseFloat(form.heightAGL),
        accelOrientation: form.accelOrientation ? parseFloat(form.accelOrientation) : null,
        windOrientation: form.windNA ? null : (form.windOrientation ? parseFloat(form.windOrientation) : null),
        structuralElement: form.structuralElement,
        batteryVoltage: form.batteryVoltage || null,
        dcOutput: form.dcOutput || null,
        secureFixing: form.secureFixing,
        dataFlow: form.dataFlow,
        climbs: climbs.map(c => ({
          upStart: c.upStart || '', upFinish: c.upFinish || '',
          downStart: c.downStart || '', downFinish: c.downFinish || '',
        })),
      })

      // Upload new media (items without an existing id are new)
      const { apiUploadMedia } = await import('../api')
      for (const p of serialPhotos) {
        if (!p.id && (p.blob || p.url?.startsWith('data:'))) {
          const blob = p.blob || await fetch(p.url).then(r => r.blob())
          await apiUploadMedia(id, 'serial_photo', new File([blob], p.name || 'serial.jpg', { type: 'image/jpeg' }))
        }
      }
      for (const p of photos) {
        if (!p.id && (p.blob || p.url?.startsWith('data:'))) {
          const blob = p.blob || await fetch(p.url).then(r => r.blob())
          await apiUploadMedia(id, 'install_photo', new File([blob], p.name || 'photo.jpg', { type: 'image/jpeg' }))
        }
      }

      setSaving(false)
      push('Installation updated successfully', 'success')
      navigate('/install-records')
    } catch (err) {
      setSaving(false)
      push(err.message || 'Failed to update', 'error')
    }
  }

  function PhotoSection({ title, items, setItems, camOpen, setCamOpen, camStream, setCamStream, videoRef, canvasRef, fileRef, max }) {
    return (
      <div className="vio-card" style={{ marginBottom: 16 }}>
        <SectionLabel>{title}</SectionLabel>
        {camOpen && (
          <div style={{ marginBottom: 14, borderRadius: 10, overflow: 'hidden', border: '1px solid var(--vio-card-border)', background: '#000' }}>
            <video ref={videoRef} autoPlay playsInline muted style={{ width: '100%', display: 'block', maxHeight: 220, objectFit: 'cover' }} />
            <canvas ref={canvasRef} style={{ display: 'none' }} />
            <div style={{ display: 'flex', gap: 10, padding: 10, background: '#111', justifyContent: 'center' }}>
              <button type="button" onClick={() => capture(videoRef, canvasRef, p => setItems(prev => [...prev, p]), () => closeCam(camStream, setCamStream, setCamOpen))} className="vio-btn vio-btn-primary">Capture</button>
              <button type="button" onClick={() => closeCam(camStream, setCamStream, setCamOpen)} className="vio-btn vio-btn-ghost" style={{ color: '#fff', borderColor: '#444' }}>Cancel</button>
            </div>
          </div>
        )}
        {(!max || items.length < max) && !camOpen && (
          <div style={{ display: 'flex', gap: 16, justifyContent: 'center', marginBottom: items.length > 0 ? 14 : 0 }}>
            <button type="button" onClick={() => openCam(setCamStream, setCamOpen, videoRef)} className="vio-btn vio-btn-secondary"
              style={{ width: 130, height: 80, flexDirection: 'column', gap: 8, fontSize: 13, fontWeight: 600, borderRadius: 12 }}>
              <Camera size={24} /> Take Photo
            </button>
            <button type="button" onClick={() => fileRef.current.click()} className="vio-btn vio-btn-ghost"
              style={{ width: 130, height: 80, flexDirection: 'column', gap: 8, fontSize: 13, fontWeight: 600, borderRadius: 12 }}>
              <Upload size={24} /> Upload
            </button>
            <input ref={fileRef} type="file" multiple accept="image/*,.heic" style={{ display: 'none' }}
              onChange={e => { addFiles(e.target.files, setItems, max ? max - items.length : 99); e.target.value = '' }} />
          </div>
        )}
        {items.length > 0 && (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(80px, 1fr))', gap: 8 }}>
            {items.map((p, i) => (
              <div key={i} style={{ position: 'relative', aspectRatio: '1', borderRadius: 8, overflow: 'hidden', border: '1px solid var(--vio-card-border)' }}>
                <img src={p.url ?? p} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                <button type="button" onClick={() => setItems(prev => prev.filter((_, j) => j !== i))}
                  style={{ position: 'absolute', top: 3, right: 3, width: 20, height: 20, borderRadius: '50%', background: 'rgba(0,0,0,0.6)', border: 'none', cursor: 'pointer', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <X size={10} />
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

      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: 20, alignItems: 'start' }}>
        {/* Left — editable fields */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
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
                <input className={inputCls('sensorSerials')} value={form.sensorSerials} onChange={e => set('sensorSerials', e.target.value)} placeholder="Comma separated" />
              </Field>
            </div>
          </div>

          <div className="vio-card">
            <SectionLabel>Installation Setup</SectionLabel>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
              <Field label="Install Height (m above ground level)" required error={errors.heightAGL}>
                <div style={{ position: 'relative' }}>
                  <input className={inputCls('heightAGL')} type="number" step="0.01" min="0" value={form.heightAGL} onChange={e => set('heightAGL', e.target.value)} style={{ paddingRight: 32 }} />
                  <span style={{ position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)', fontSize: 12, color: 'var(--vio-text-muted)' }}>m</span>
                </div>
              </Field>
              <Field label="Accelerometer Orientation" error={errors.accelOrientation}>
                <div style={{ position: 'relative' }}>
                  <input className="vio-input" type="number" min="0" max="359" value={form.accelOrientation} onChange={e => set('accelOrientation', e.target.value)} style={{ paddingRight: 100 }} />
                  <span style={{ position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)', fontSize: 12, color: 'var(--vio-text-muted)' }}>° from true north</span>
                </div>
              </Field>
              <div>
                <label style={{ display: 'block', fontSize: 13, fontWeight: 500, color: 'var(--vio-text-secondary)', marginBottom: 6 }}>Wind sensor?</label>
                <div style={{ display: 'flex', gap: 10 }}>
                  {[{ label: 'Yes', value: false }, { label: 'No', value: true }].map(opt => (
                    <button key={opt.label} type="button" onClick={() => set('windNA', opt.value)}
                      className={`vio-btn ${form.windNA === opt.value ? 'vio-btn-primary' : 'vio-btn-ghost'}`}
                      style={{ height: 42, padding: '0 28px', fontSize: 14, minWidth: 80 }}>
                      {opt.label}
                    </button>
                  ))}
                </div>
              </div>
              <Field label="Wind Sensor Orientation">
                <div style={{ position: 'relative' }}>
                  <input className="vio-input" type="number" min="0" max="359" value={form.windNA ? '' : form.windOrientation}
                    onChange={e => set('windOrientation', e.target.value)} disabled={form.windNA}
                    style={{ paddingRight: 100, opacity: form.windNA ? 0.4 : 1, background: form.windNA ? 'var(--vio-page-bg)' : undefined, cursor: form.windNA ? 'not-allowed' : undefined }} />
                  <span style={{ position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)', fontSize: 12, color: 'var(--vio-text-muted)', opacity: form.windNA ? 0.4 : 1 }}>° from true north</span>
                </div>
              </Field>
              <Field label="Structural Element" required error={errors.structuralElement}>
                <input className={inputCls('structuralElement')} value={form.structuralElement} onChange={e => set('structuralElement', e.target.value)} />
              </Field>
            </div>
          </div>

          <div className="vio-card">
            <SectionLabel>Power & Confirmation</SectionLabel>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
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

          <div className="vio-card">
            <SectionLabel>Climb Log</SectionLabel>
            {climbs.map((c, i) => (
              <div key={i} style={{ marginBottom: 16, padding: 20, borderRadius: 10, background: 'var(--vio-page-bg)', border: '0.5px solid var(--vio-card-border)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
                  <p style={{ fontSize: 14, fontWeight: 600, color: 'var(--vio-primary)' }}>Climb {i + 1}</p>
                  {climbs.length > 1 && (
                    <button type="button" onClick={() => setClimbs(p => p.filter((_, j) => j !== i))}
                      style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--vio-status-red)', fontSize: 12, fontWeight: 500 }}>Remove</button>
                  )}
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 12 }}>
                  {[['upStart','Up Start'],['upFinish','Up Finish'],['downStart','Down Start'],['downFinish','Down Finish']].map(([k, label]) => (
                    <div key={k}>
                      <label style={{ display: 'block', fontSize: 12, fontWeight: 500, color: 'var(--vio-text-muted)', marginBottom: 4 }}>{label}</label>
                      <input className="vio-input" style={{ height: 36, fontSize: 13 }} placeholder="e.g. 09:30 AM"
                        value={c[k]} onChange={e => setClimbs(p => p.map((cl, j) => j === i ? { ...cl, [k]: e.target.value } : cl))} />
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

          {/* Save */}
          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 12 }}>
            <button className="vio-btn vio-btn-ghost" onClick={() => navigate('/install-records')}>Cancel</button>
            <button className="vio-btn vio-btn-primary" onClick={handleSave} disabled={saving}>
              {saving ? 'Saving…' : 'Save Changes'}
            </button>
          </div>
        </div>

        {/* Right — photos */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
          <PhotoSection title="Serial Number Photos" items={serialPhotos} setItems={setSerialPhotos} max={5}
            camOpen={serialCamOpen} setCamOpen={setSerialCamOpen} camStream={serialCamStream} setCamStream={setSerialCamStream}
            videoRef={serialVideoRef} canvasRef={serialCanvasRef} fileRef={serialFileRef} />
          <PhotoSection title="Install Photographs" items={photos} setItems={setPhotos}
            camOpen={installCamOpen} setCamOpen={setInstallCamOpen} camStream={installCamStream} setCamStream={setInstallCamStream}
            videoRef={installVideoRef} canvasRef={installCanvasRef} fileRef={installFileRef} />
        </div>
      </div>
    </AppShell>
  )
}

import { useRef } from 'react'

export default function PhotoUpload({ photos, onChange, readOnly = false }) {
  const inputRef = useRef()

  function handleFiles(e) {
    const files = Array.from(e.target.files)
    Promise.all(
      files.map(file => new Promise(res => {
        const r = new FileReader()
        r.onload = ev => res({ name: file.name, url: ev.target.result })
        r.readAsDataURL(file)
      }))
    ).then(newPhotos => onChange([...photos, ...newPhotos]))
  }

  return (
    <div>
      {!readOnly && (
        <div
          onClick={() => inputRef.current.click()}
          style={{
            border: '1.5px dashed #b2d8e0', borderRadius: 8, padding: '24px',
            textAlign: 'center', cursor: 'pointer', background: '#f8fcfd', marginBottom: 12,
          }}
          onMouseEnter={e => { e.currentTarget.style.borderColor = '#0b3d4a'; e.currentTarget.style.background = '#f0f8fa' }}
          onMouseLeave={e => { e.currentTarget.style.borderColor = '#b2d8e0'; e.currentTarget.style.background = '#f8fcfd' }}
        >
          <p style={{ fontSize: 13, fontWeight: 500, color: '#0b3d4a' }}>Click to upload photos</p>
          <p style={{ fontSize: 11, color: '#9ca3af', marginTop: 4 }}>JPG, PNG, HEIC accepted</p>
          <input ref={inputRef} type="file" multiple accept="image/*" style={{ display: 'none' }} onChange={handleFiles} />
        </div>
      )}

      {photos.length > 0 && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 8 }}>
          {photos.map((p, i) => (
            <div key={i} style={{ position: 'relative', aspectRatio: '1', borderRadius: 6, overflow: 'hidden', border: '0.5px solid #dde4e7', background: '#f4f7f8' }}>
              <img src={p.url} alt={p.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              {!readOnly && (
                <button
                  onClick={() => onChange(photos.filter((_, j) => j !== i))}
                  style={{ position: 'absolute', top: 3, right: 3, width: 18, height: 18, borderRadius: '50%', background: 'rgba(0,0,0,0.5)', border: 'none', color: '#fff', fontSize: 11, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                >×</button>
              )}
            </div>
          ))}
        </div>
      )}

      {photos.length === 0 && readOnly && (
        <p style={{ fontSize: 12, color: '#9ca3af' }}>No photographs uploaded</p>
      )}
    </div>
  )
}

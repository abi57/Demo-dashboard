import { useRef } from 'react'

export default function PhotoUpload({ photos, onChange, readOnly = false }) {
  const inputRef = useRef()

  function handleFiles(e) {
    const files = Array.from(e.target.files)
    Promise.all(files.map(file => new Promise(res => {
      const r = new FileReader()
      r.onload = ev => res({ name: file.name, url: ev.target.result })
      r.readAsDataURL(file)
    }))).then(newPhotos => onChange([...photos, ...newPhotos]))
  }

  return (
    <div>
      {!readOnly && (
        <div
          onClick={() => inputRef.current.click()}
          className="rounded-xl p-8 text-center cursor-pointer transition-all mb-4"
          style={{ border: '2px dashed var(--border)', background: 'var(--bg-elevated)' }}
          onMouseEnter={e => { e.currentTarget.style.borderColor = 'var(--accent-border)'; e.currentTarget.style.background = 'var(--accent-bg)' }}
          onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--border)'; e.currentTarget.style.background = 'var(--bg-elevated)' }}
        >
          <p className="text-3xl mb-2">📷</p>
          <p className="text-[13px] font-medium" style={{ color: 'var(--text-secondary)' }}>Click to upload photos</p>
          <p className="text-[11px] mt-1" style={{ color: 'var(--text-faint)' }}>JPG, PNG, WEBP supported</p>
          <input ref={inputRef} type="file" multiple accept="image/*" className="hidden" onChange={handleFiles} />
        </div>
      )}
      {photos.length > 0 ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
          {photos.map((p, i) => (
            <div key={i} className="relative group rounded-xl overflow-hidden aspect-square"
              style={{ background: 'var(--bg-elevated)', border: '1px solid var(--border)' }}>
              <img src={p.url} alt={p.name} className="w-full h-full object-cover" />
              {!readOnly && (
                <button
                  onClick={() => onChange(photos.filter((_, j) => j !== i))}
                  className="absolute top-1.5 right-1.5 w-6 h-6 rounded-full bg-red-500/80 text-white text-xs opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center"
                >x</button>
              )}
            </div>
          ))}
        </div>
      ) : readOnly ? (
        <p className="text-[13px]" style={{ color: 'var(--text-faint)' }}>No photos uploaded</p>
      ) : null}
    </div>
  )
}

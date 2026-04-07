import { useState } from 'react'
import { Image } from 'lucide-react'
import AppShell from '../components/AppShell'
import { useApp } from '../context/AppContext'

export default function Photos() {
  const { installations } = useApp()
  const [lightbox, setLightbox] = useState(null)
  const withPhotos = installations.filter(i => i.photos?.length > 0)

  return (
    <AppShell title="Photos">
      {withPhotos.length === 0 ? (
        <div style={{ textAlign: 'center', padding: 64 }}>
          <Image size={40} style={{ color: 'var(--vio-text-muted)', margin: '0 auto 16px', display: 'block' }} />
          <p style={{ fontSize: 18, fontWeight: 600, color: 'var(--vio-text-primary)', marginBottom: 8 }}>No photos yet</p>
          <p style={{ fontSize: 14, color: 'var(--vio-text-muted)' }}>Photos uploaded during installations will appear here.</p>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 32 }}>
          {withPhotos.map(inst => (
            <div key={inst.id}>
              <div style={{ marginBottom: 12 }}>
                <span style={{ fontSize: 14, fontWeight: 600, color: 'var(--vio-text-primary)' }}>{inst.installerName}</span>
                <span style={{ fontSize: 13, color: 'var(--vio-text-muted)', marginLeft: 8 }}>· {inst.towerId} · {inst.dateInstalled}</span>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(160px, 1fr))', gap: 10 }}>
                {inst.photos.map((p, i) => (
                  <div key={i} onClick={() => setLightbox(p.url ?? p)}
                    style={{ aspectRatio: '1', borderRadius: 10, overflow: 'hidden', cursor: 'pointer', background: 'var(--vio-page-bg)', border: '0.5px solid var(--vio-card-border)' }}>
                    <img src={p.url ?? p} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}

      {lightbox && (
        <div onClick={() => setLightbox(null)} style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.9)', zIndex: 9999, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 32 }}>
          <img src={lightbox} alt="" style={{ maxWidth: '100%', maxHeight: '100%', borderRadius: 12 }} />
        </div>
      )}
    </AppShell>
  )
}

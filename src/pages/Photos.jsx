import { useState } from 'react'
import Header from '../components/Header'
import { useAppData } from '../context/AppDataContext'

export default function Photos() {
  const { installations } = useAppData()
  const [selected, setSelected] = useState(null)
  const withPhotos = installations.filter(i => i.photos?.length > 0)

  return (
    <div className="flex-1 flex flex-col min-h-0 transition-colors duration-200" style={{ background: 'var(--bg-base)' }}>
      <Header title="Photos" subtitle="Installation photo gallery" />
      <div className="flex-1 overflow-y-auto p-8">
        {withPhotos.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-64">
            <p className="text-5xl mb-4 opacity-20">📷</p>
            <p className="text-[14px]" style={{ color: 'var(--text-muted)' }}>No photos uploaded yet</p>
            <p className="text-[12px] mt-1" style={{ color: 'var(--text-faint)' }}>Photos are added during installation</p>
          </div>
        ) : (
          <div className="flex flex-col gap-8">
            {withPhotos.map(inst => (
              <div key={inst.id}>
                <div className="flex items-center gap-3 mb-3">
                  <span className="font-mono text-[11px] font-medium" style={{ color: 'var(--accent)' }}>{inst.id}</span>
                  <span style={{ color: 'var(--text-faint)' }}>·</span>
                  <span className="text-[12px]" style={{ color: 'var(--text-muted)' }}>{inst.installer}</span>
                  <span style={{ color: 'var(--text-faint)' }}>·</span>
                  <span className="text-[12px]" style={{ color: 'var(--text-muted)' }}>{inst.towerId}</span>
                </div>
                <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-3">
                  {inst.photos.map((p, i) => (
                    <div key={i} onClick={() => setSelected(p)}
                      className="aspect-square rounded-xl overflow-hidden cursor-pointer transition-all hover:scale-105"
                      style={{ background: 'var(--bg-elevated)', border: '1px solid var(--border)' }}>
                      <img src={p.url} alt={p.name} className="w-full h-full object-cover" />
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {selected && (
        <div className="fixed inset-0 bg-black/90 z-[300] flex items-center justify-center p-8"
          onClick={() => setSelected(null)}>
          <img src={selected.url} alt={selected.name} className="max-w-full max-h-full rounded-2xl shadow-2xl" />
          <button className="absolute top-6 right-6 text-white text-3xl hover:opacity-70 transition-opacity">×</button>
        </div>
      )}
    </div>
  )
}

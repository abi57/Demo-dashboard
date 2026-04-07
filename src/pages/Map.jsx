import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useViotel } from '../context/ViotelContext'
import { SENSOR_TYPES } from '../data/viotelData'

const TYPE_ICON = { bridge: '🌉', tower: '📡', barrier: '🛡️', dam: '🏗️' }

export default function Map() {
  const { assets, nodes, setSelectedAsset } = useViotel()
  const navigate = useNavigate()
  const [selected, setSelected] = useState(null)

  function getAssetStatus(assetId) {
    const assetNodes = nodes.filter(n => n.asset === assetId)
    if (assetNodes.some(n => n.status === 'alert'))   return { color: '#dc2626', label: 'Alert' }
    if (assetNodes.some(n => n.status === 'warning')) return { color: '#f59e0b', label: 'Warning' }
    if (assetNodes.some(n => n.status === 'offline')) return { color: '#9ca3af', label: 'Degraded' }
    return { color: '#16a34a', label: 'Normal' }
  }

  const selectedAsset = assets.find(a => a.id === selected)
  const selectedNodes = selected ? nodes.filter(n => n.asset === selected) : []

  return (
    <div style={{ padding: '20px 24px 32px' }}>
      <h2 style={{ fontSize: 18, fontWeight: 500, color: '#0b3d4a', margin: '0 0 16px' }}>Asset Map</h2>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 340px', gap: 16 }}>
        {/* Map placeholder */}
        <div className="vt-card" style={{ minHeight: 480, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
          <div style={{ padding: '12px 16px', borderBottom: '0.5px solid #dde4e7', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <p style={{ fontSize: 13, fontWeight: 500, color: '#0b3d4a' }}>Asset Locations</p>
            <div style={{ display: 'flex', gap: 6 }}>
              {[{ color: '#16a34a', label: 'Normal' }, { color: '#f59e0b', label: 'Warning' }, { color: '#dc2626', label: 'Alert' }, { color: '#9ca3af', label: 'Offline' }].map(s => (
                <div key={s.label} style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                  <span style={{ width: 8, height: 8, borderRadius: '50%', background: s.color }} />
                  <span style={{ fontSize: 11, color: '#6b7280' }}>{s.label}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Schematic map */}
          <div style={{ flex: 1, background: '#f8fcfd', position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <p style={{ fontSize: 12, color: '#9ca3af', position: 'absolute', top: 12, left: 16 }}>
              Leaflet.js map — CartoDB Positron tiles
            </p>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 32, padding: 32 }}>
              {assets.map(a => {
                const status = getAssetStatus(a.id)
                const assetNodes = nodes.filter(n => n.asset === a.id)
                return (
                  <button key={a.id} onClick={() => setSelected(a.id === selected ? null : a.id)}
                    style={{
                      display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8,
                      padding: '20px 24px', borderRadius: 10, cursor: 'pointer',
                      background: selected === a.id ? '#e8f4f6' : '#fff',
                      border: `1.5px solid ${selected === a.id ? '#0b3d4a' : '#dde4e7'}`,
                    }}>
                    <div style={{ width: 40, height: 40, borderRadius: '50%', background: status.color, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 20 }}>
                      {TYPE_ICON[a.type]}
                    </div>
                    <div style={{ textAlign: 'center' }}>
                      <p style={{ fontSize: 13, fontWeight: 500, color: '#0b3d4a' }}>{a.name}</p>
                      <p style={{ fontSize: 11, color: '#9ca3af', marginTop: 2 }}>{a.location}</p>
                      <p style={{ fontSize: 11, marginTop: 4, color: status.color, fontWeight: 500 }}>{status.label} · {assetNodes.length} nodes</p>
                    </div>
                  </button>
                )
              })}
            </div>
          </div>
        </div>

        {/* Side panel */}
        <div>
          {selectedAsset ? (
            <div className="vt-card" style={{ overflow: 'hidden' }}>
              <div style={{ padding: '14px 16px', borderBottom: '0.5px solid #dde4e7' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <span style={{ fontSize: 20 }}>{TYPE_ICON[selectedAsset.type]}</span>
                  <div>
                    <p style={{ fontSize: 14, fontWeight: 500, color: '#0b3d4a' }}>{selectedAsset.name}</p>
                    <p style={{ fontSize: 11, color: '#9ca3af' }}>{selectedAsset.location}</p>
                  </div>
                </div>
              </div>
              <div style={{ padding: '14px 16px' }}>
                <p style={{ fontSize: 11, fontWeight: 500, letterSpacing: '0.08em', textTransform: 'uppercase', color: '#9ca3af', marginBottom: 10 }}>
                  {selectedNodes.length} nodes monitoring
                </p>
                <div style={{ display: 'flex', gap: 12, marginBottom: 14 }}>
                  {[
                    { label: 'Online',  count: selectedNodes.filter(n => n.status === 'online').length,  color: '#16a34a' },
                    { label: 'Warning', count: selectedNodes.filter(n => n.status === 'warning').length, color: '#f59e0b' },
                    { label: 'Alert',   count: selectedNodes.filter(n => n.status === 'alert').length,   color: '#dc2626' },
                    { label: 'Offline', count: selectedNodes.filter(n => n.status === 'offline').length, color: '#9ca3af' },
                  ].map(s => (
                    <div key={s.label} style={{ textAlign: 'center' }}>
                      <p style={{ fontSize: 18, fontWeight: 500, color: s.color }}>{s.count}</p>
                      <p style={{ fontSize: 10, color: '#9ca3af' }}>{s.label}</p>
                    </div>
                  ))}
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 6, marginBottom: 14 }}>
                  {selectedNodes.map(n => {
                    const st = SENSOR_TYPES[n.type]
                    const statusColor = { online: '#16a34a', warning: '#f59e0b', alert: '#dc2626', offline: '#9ca3af' }[n.status]
                    return (
                      <div key={n.id} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '7px 10px', borderRadius: 6, background: '#f8fcfd', border: '0.5px solid #dde4e7' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 7 }}>
                          <span style={{ width: 7, height: 7, borderRadius: '50%', background: st.dot, flexShrink: 0 }} />
                          <span style={{ fontFamily: 'ui-monospace,monospace', fontSize: 11, fontWeight: 500, color: '#0b3d4a' }}>{n.id}</span>
                        </div>
                        <span style={{ fontSize: 11, fontWeight: 500, color: statusColor }}>{n.reading}</span>
                      </div>
                    )
                  })}
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                  <button className="vt-btn vt-btn-primary" style={{ width: '100%', justifyContent: 'center' }}
                    onClick={() => { setSelectedAsset(selectedAsset.id); navigate('/sensors') }}>
                    Open dashboard →
                  </button>
                  <button className="vt-btn vt-btn-outline" style={{ width: '100%', justifyContent: 'center' }}
                    onClick={() => navigate('/installations')}>
                    View installations →
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <div className="vt-card" style={{ padding: '32px', textAlign: 'center' }}>
              <p style={{ fontSize: 13, color: '#9ca3af' }}>Select an asset to view details</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

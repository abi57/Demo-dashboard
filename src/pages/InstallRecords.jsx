import { useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { Search, Download, ChevronUp, ChevronDown } from 'lucide-react'
import AppShell from '../components/AppShell'
import StatusBadge from '../components/StatusBadge'
import SerialBadge from '../components/SerialBadge'
import { useApp } from '../context/AppContext'

const PAGE_SIZE = 20

export default function InstallRecords() {
  const { installations } = useApp()
  const navigate = useNavigate()
  const [params] = useSearchParams()
  const [search, setSearch] = useState(params.get('q') ?? '')
  const [filter, setFilter] = useState('all')
  const [sort, setSort] = useState({ col: 'submitted', dir: 'desc' })
  const [page, setPage] = useState(0)

  const filtered = installations.filter(r => {
    const q = search.toLowerCase()
    const matchSearch = !q || [r.installerName, r.towerId, r.siteOwner, r.company, ...r.sensorSerials].some(v => v?.toLowerCase().includes(q))
    const matchFilter = filter === 'all' || r.status === filter ||
      (filter === 'today' && r.dateInstalled === new Date().toISOString().split('T')[0]) ||
      (filter === 'week' && new Date(r.dateInstalled) >= new Date(Date.now() - 7 * 86400000))
    return matchSearch && matchFilter
  }).sort((a, b) => {
    const va = a[sort.col] ?? '', vb = b[sort.col] ?? ''
    return sort.dir === 'asc' ? String(va).localeCompare(String(vb)) : String(vb).localeCompare(String(va))
  })

  const pages = Math.ceil(filtered.length / PAGE_SIZE)
  const rows  = filtered.slice(page * PAGE_SIZE, (page + 1) * PAGE_SIZE)

  function toggleSort(col) {
    setSort(s => s.col === col ? { col, dir: s.dir === 'asc' ? 'desc' : 'asc' } : { col, dir: 'asc' })
    setPage(0)
  }

  const SortIcon = ({ col }) => sort.col === col
    ? (sort.dir === 'asc' ? <ChevronUp size={12} /> : <ChevronDown size={12} />)
    : <ChevronDown size={12} style={{ opacity: 0.3 }} />

  const FILTERS = [
    { key: 'all', label: 'All' }, { key: 'confirmed', label: 'Confirmed' },
    { key: 'pending', label: 'Pending' }, { key: 'today', label: 'Today' }, { key: 'week', label: 'This Week' },
  ]

  return (
    <AppShell title="Install Records">
      {/* Filter bar */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 20, flexWrap: 'wrap' }}>
        <div style={{ position: 'relative', flex: '1 1 240px', maxWidth: 320 }}>
          <Search size={14} style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: 'var(--vio-text-muted)', pointerEvents: 'none' }} />
          <input className="vio-input" style={{ paddingLeft: 36 }} placeholder="Search installer, tower, serial…"
            value={search} onChange={e => { setSearch(e.target.value); setPage(0) }} />
        </div>
        <div style={{ display: 'flex', gap: 6 }}>
          {FILTERS.map(f => (
            <button key={f.key} onClick={() => { setFilter(f.key); setPage(0) }}
              className={`vio-btn vio-btn-sm ${filter === f.key ? 'vio-btn-primary' : 'vio-btn-ghost'}`}>
              {f.label}
            </button>
          ))}
        </div>
        <div style={{ flex: 1 }} />
        <button className="vio-btn vio-btn-secondary vio-btn-sm" style={{ gap: 6 }}>
          <Download size={14} /> Export CSV
        </button>
      </div>

      {/* Table */}
      <div className="vio-card" style={{ padding: 0, overflow: 'hidden' }}>
        <div style={{ overflowX: 'auto' }}>
          <table className="vio-table">
            <thead>
              <tr>
                {[
                  ['submitted','Submitted'],['dateInstalled','Date'],['installerName','Installer'],
                  ['company','Company'],['siteOwner','Site Owner'],['towerId','Tower ID'],
                  [null,'Sensor Serial'],['heightAGL','Height'],
                  [null,'Secure Fixing'],[null,'Data Flow'],[null,'Photos'],[null,''],
                ].map(([col, label]) => (
                  <th key={label} onClick={col ? () => toggleSort(col) : undefined} style={{ cursor: col ? 'pointer' : 'default' }}>
                    <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4 }}>
                      {label} {col && <SortIcon col={col} />}
                    </span>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {rows.length === 0 ? (
                <tr><td colSpan={12} style={{ textAlign: 'center', padding: 48, color: 'var(--vio-text-muted)' }}>
                  No installation records found.
                </td></tr>
              ) : rows.map(r => (
                <tr key={r.id} style={{ cursor: 'pointer' }} onClick={() => navigate(`/install-records/${r.id}`)}>
                  <td className="vio-cell" style={{ whiteSpace: 'nowrap' }}>{r.submitted}</td>
                  <td className="vio-cell" style={{ whiteSpace: 'nowrap' }}>{r.dateInstalled}</td>
                  <td className="vio-cell" style={{ fontWeight: 500, whiteSpace: 'nowrap' }}>{r.installerName}</td>
                  <td className="vio-cell" style={{ whiteSpace: 'nowrap' }}>{r.company}</td>
                  <td className="vio-cell" style={{ whiteSpace: 'nowrap' }}>{r.siteOwner}</td>
                  <td className="vio-cell vio-mono" style={{ fontSize: 12, whiteSpace: 'nowrap' }}>{r.towerId}</td>
                  <td><div style={{ display: 'flex', gap: 4, flexWrap: 'wrap' }}>{r.sensorSerials.map(s => <SerialBadge key={s} serial={s} />)}</div></td>
                  <td className="vio-cell" style={{ whiteSpace: 'nowrap' }}>{r.heightAGL} m</td>
                  <td><StatusBadge status={r.secureFixing ? 'yes' : 'no'} /></td>
                  <td><StatusBadge status={r.dataFlow ? 'confirmed' : 'failed'} /></td>
                  <td className="vio-cell">{r.photos?.length > 0 ? <span style={{ color: 'var(--vio-accent)', fontWeight: 500, cursor: 'pointer' }}>{r.photos.length} photos</span> : '—'}</td>
                  <td><button className="vio-btn vio-btn-ghost vio-btn-sm" onClick={e => { e.stopPropagation(); navigate(`/install-records/${r.id}`) }}>View</button></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {pages > 1 && (
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px 20px', borderTop: '0.5px solid var(--vio-card-border)' }}>
            <span style={{ fontSize: 13, color: 'var(--vio-text-muted)' }}>{filtered.length} records</span>
            <div style={{ display: 'flex', gap: 6 }}>
              <button className="vio-btn vio-btn-ghost vio-btn-sm" disabled={page === 0} onClick={() => setPage(p => p - 1)}>← Prev</button>
              <span style={{ fontSize: 13, color: 'var(--vio-text-secondary)', padding: '0 8px', lineHeight: '32px' }}>{page + 1} / {pages}</span>
              <button className="vio-btn vio-btn-ghost vio-btn-sm" disabled={page >= pages - 1} onClick={() => setPage(p => p + 1)}>Next →</button>
            </div>
          </div>
        )}
      </div>
    </AppShell>
  )
}

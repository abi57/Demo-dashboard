export default function DataTable({ columns, rows, onRowClick, emptyMessage = 'No records found' }) {
  return (
    <div className="rounded-2xl border border-white/8 overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-white/8 bg-white/3">
              {columns.map(col => (
                <th
                  key={col.key}
                  className="text-left px-5 py-3.5 text-xs font-medium text-slate-400 uppercase tracking-wider whitespace-nowrap"
                >
                  {col.label}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.length === 0 ? (
              <tr>
                <td colSpan={columns.length} className="text-center py-12 text-slate-500 text-sm">
                  {emptyMessage}
                </td>
              </tr>
            ) : rows.map((row, i) => (
              <tr
                key={row.id ?? i}
                onClick={() => onRowClick?.(row)}
                className={`border-b border-white/5 last:border-0 transition-colors ${
                  onRowClick ? 'cursor-pointer hover:bg-white/4' : ''
                }`}
              >
                {columns.map(col => (
                  <td key={col.key} className="px-5 py-3.5 text-slate-300 whitespace-nowrap">
                    {col.render ? col.render(row[col.key], row) : row[col.key]}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

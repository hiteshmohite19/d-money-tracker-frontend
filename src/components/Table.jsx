import { useState, useEffect } from 'react'

/**
 * Reusable table with built-in pagination.
 *
 * columns: Array<{
 *   key: string,          — used as React key and fallback cell value (row[key])
 *   label: string,        — header text
 *   headerClass?: string, — extra class on <th>
 *   className?: string,   — extra class on <td>
 *   render?: (row) => ReactNode — custom cell renderer
 * }>
 *
 * data:         Array of row objects
 * pageSize:     rows per page (default 10)
 * emptyMessage: shown when data is empty
 * resetKey:     change this value (e.g. search string) to reset to page 1
 */
export default function Table({
  columns,
  data,
  pageSize = 10,
  emptyMessage = 'No data found.',
  resetKey,
}) {
  const [page, setPage] = useState(1)

  useEffect(() => { setPage(1) }, [resetKey])

  const totalPages = Math.max(1, Math.ceil(data.length / pageSize))
  const safePage   = Math.min(page, totalPages)
  const paginated  = data.slice((safePage - 1) * pageSize, safePage * pageSize)

  return (
    <div className="bg-white rounded-xl shadow-sm overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-gray-50 border-b border-gray-200 text-left text-gray-500 font-medium">
              {columns.map((col) => (
                <th key={col.key} className={`px-4 py-3 ${col.headerClass ?? ''}`}>
                  {col.label}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {paginated.length === 0 ? (
              <tr>
                <td colSpan={columns.length} className="px-4 py-12 text-center text-gray-400">
                  {emptyMessage}
                </td>
              </tr>
            ) : (
              paginated.map((row, i) => (
                <tr key={row.id ?? i} className="hover:bg-gray-50 transition-colors">
                  {columns.map((col) => (
                    <td key={col.key} className={`px-4 py-3 ${col.className ?? ''}`}>
                      {col.render ? col.render(row) : row[col.key]}
                    </td>
                  ))}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {totalPages > 1 && (
        <div className="flex items-center justify-between px-4 py-3 border-t border-gray-100">
          <p className="text-xs text-gray-500">
            Showing {(safePage - 1) * pageSize + 1}–{Math.min(safePage * pageSize, data.length)} of {data.length}
          </p>
          <div className="flex items-center gap-1">
            <button
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={safePage === 1}
              className="px-2 py-1 rounded text-sm text-gray-600 hover:bg-gray-100 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
            >
              ‹ Prev
            </button>
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
              <button
                key={p}
                onClick={() => setPage(p)}
                className={`w-8 h-8 rounded text-sm font-medium transition-colors ${
                  p === safePage ? 'bg-indigo-600 text-white' : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                {p}
              </button>
            ))}
            <button
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              disabled={safePage === totalPages}
              className="px-2 py-1 rounded text-sm text-gray-600 hover:bg-gray-100 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
            >
              Next ›
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

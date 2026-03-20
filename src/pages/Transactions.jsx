import { useState, useMemo } from 'react'
import { ALL_TRANSACTIONS } from '../data/transactions'
import Table from '../components/Table'

export default function Transactions({ onCategoryClick }) {
  const [search, setSearch] = useState('')
  const [fromDate, setFromDate] = useState('')
  const [toDate, setToDate] = useState('')

  const filtered = useMemo(() => {
    return ALL_TRANSACTIONS.filter((t) => {
      const matchesSearch =
        t.category.toLowerCase().includes(search.toLowerCase()) ||
        t.subCategory.toLowerCase().includes(search.toLowerCase()) ||
        t.description.toLowerCase().includes(search.toLowerCase())
      const txDate = new Date(t.date)
      const matchesFrom = fromDate ? txDate >= new Date(fromDate) : true
      const matchesTo   = toDate   ? txDate <= new Date(toDate)   : true
      return matchesSearch && matchesFrom && matchesTo
    })
  }, [search, fromDate, toDate])

  const hasFilters = search || fromDate || toDate

  const columns = [
    {
      key: 'category',
      label: 'Category',
      render: (t) => (
        <button
          onClick={() => onCategoryClick?.(t.category)}
          className="inline-block px-2 py-0.5 rounded-full text-xs bg-indigo-50 text-indigo-600 font-medium hover:bg-indigo-100 transition-colors"
        >
          {t.category}
        </button>
      ),
    },
    { key: 'subCategory', label: 'Sub-Category', className: 'text-gray-700 whitespace-nowrap' },
    { key: 'description', label: 'Description', className: 'text-gray-600' },
    {
      key: 'type',
      label: 'Type',
      render: (t) => (
        <span className={`inline-block px-2 py-0.5 rounded-full text-xs font-medium ${
          t.type === 'credit' ? 'bg-green-50 text-green-600' : 'bg-red-50 text-red-500'
        }`}>
          {t.type.charAt(0).toUpperCase() + t.type.slice(1)}
        </span>
      ),
    },
    {
      key: 'amount',
      label: 'Amount',
      headerClass: 'text-right',
      className: 'text-right font-semibold whitespace-nowrap',
      render: (t) => (
        <span className={t.type === 'credit' ? 'text-green-600' : 'text-red-500'}>
          {t.type === 'credit' ? '+' : '-'}${t.amount.toFixed(2)}
        </span>
      ),
    },
    { key: 'date', label: 'Date', className: 'text-gray-500 whitespace-nowrap' },
  ]

  return (
    <div>
      {/* Header */}
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-800">Transactions</h2>
        <p className="text-sm text-gray-500 mt-1">{filtered.length} record{filtered.length !== 1 ? 's' : ''} found</p>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl shadow-sm p-4 mb-4">
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-4.35-4.35M17 11A6 6 0 1 1 5 11a6 6 0 0 1 12 0z" />
            </svg>
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search category, sub-category, description..."
              className="w-full pl-9 pr-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>
          <div className="flex items-center gap-2">
            <label className="text-xs text-gray-500 font-medium whitespace-nowrap">From</label>
            <input
              type="date"
              value={fromDate}
              max={toDate || undefined}
              onChange={(e) => setFromDate(e.target.value)}
              className="border border-gray-300 rounded-lg px-3 py-2 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>
          <div className="flex items-center gap-2">
            <label className="text-xs text-gray-500 font-medium whitespace-nowrap">To</label>
            <input
              type="date"
              value={toDate}
              min={fromDate || undefined}
              onChange={(e) => setToDate(e.target.value)}
              className="border border-gray-300 rounded-lg px-3 py-2 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>
          {hasFilters && (
            <button
              onClick={() => { setSearch(''); setFromDate(''); setToDate('') }}
              className="px-3 py-2 text-sm text-gray-500 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors whitespace-nowrap"
            >
              Clear
            </button>
          )}
        </div>
      </div>

      <Table
        columns={columns}
        data={filtered}
        resetKey={search + fromDate + toDate}
        emptyMessage="No transactions match your filters."
      />
    </div>
  )
}

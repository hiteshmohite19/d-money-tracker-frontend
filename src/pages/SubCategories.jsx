import { useState } from 'react'
import { TRANSACTION_TYPE, SUBCATEGORY_DATA } from '../data/transactions'
import AddSubCategoryModal from '../components/AddSubCategoryModal'
import AddTransactionModal from '../components/AddTransactionModal'

function SubCategories({ category, onBack }) {
  const initial = SUBCATEGORY_DATA[category] ?? []
  const [rows, setRows] = useState(initial)
  const [subCategories, setSubCategories] = useState(
    [...new Set(initial.map((r) => r.subCategory))]
  )
  const [search, setSearch] = useState('')
  const [showSubCatModal, setShowSubCatModal] = useState(false)
  const [showTxModal, setShowTxModal] = useState(false)

  const filtered = rows.filter(
    (r) =>
      r.subCategory.toLowerCase().includes(search.toLowerCase()) ||
      r.description.toLowerCase().includes(search.toLowerCase())
  )

  function handleAddSubCategory(name) {
    setSubCategories((prev) => [...prev, name])
  }

  function handleAddTransaction(tx) {
    setRows((prev) => [tx, ...prev])
    if (!subCategories.includes(tx.subCategory)) {
      setSubCategories((prev) => [...prev, tx.subCategory])
    }
  }

  return (
    <div>
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <div className="flex items-center gap-3">
          <button
            onClick={onBack}
            className="p-2 rounded-lg text-gray-500 hover:bg-gray-200 transition-colors"
            aria-label="Back"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <div>
            <p className="text-xs text-gray-400 font-medium uppercase tracking-wide">Categories</p>
            <h2 className="text-2xl font-bold text-gray-800">{category}</h2>
          </div>
        </div>

        <div className="flex gap-2 flex-wrap">
          <button
            onClick={() => setShowSubCatModal(true)}
            className="inline-flex items-center gap-2 px-4 py-2 border border-indigo-600 text-indigo-600 text-sm font-medium rounded-lg hover:bg-indigo-50 transition-colors"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
            </svg>
            Add Sub-Category
          </button>
          <button
            onClick={() => setShowTxModal(true)}
            className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white text-sm font-medium rounded-lg hover:bg-indigo-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
            </svg>
            Add Transaction
          </button>
        </div>
      </div>

      {/* Search */}
      <div className="relative mb-4 max-w-sm">
        <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-4.35-4.35M17 11A6 6 0 1 1 5 11a6 6 0 0 1 12 0z" />
        </svg>
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search..."
          className="w-full pl-9 pr-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
        />
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-200 text-left text-gray-500 font-medium">
                <th className="px-4 py-3">Name</th>
                <th className="px-4 py-3">Description</th>
                <th className="px-4 py-3">Expense Type</th>
                <th className="px-4 py-3 text-right">Amount</th>
                <th className="px-4 py-3">Date</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-4 py-10 text-center text-gray-400">
                    No entries found. Add a sub-category and transaction to get started.
                  </td>
                </tr>
              ) : (
                filtered.map((r) => (
                  <tr key={r.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-4 py-3 text-gray-800 font-medium whitespace-nowrap">{r.subCategory}</td>
                    <td className="px-4 py-3 text-gray-600">{r.description}</td>
                    <td className="px-4 py-3">
                      <span className={`inline-block px-2 py-0.5 rounded-full text-xs font-medium ${
                        r.type === TRANSACTION_TYPE.CREDIT
                          ? 'bg-green-50 text-green-600'
                          : 'bg-red-50 text-red-500'
                      }`}>
                        {r.type.charAt(0).toUpperCase() + r.type.slice(1)}
                      </span>
                    </td>
                    <td className={`px-4 py-3 text-right font-semibold whitespace-nowrap ${
                      r.type === TRANSACTION_TYPE.CREDIT ? 'text-green-600' : 'text-red-500'
                    }`}>
                      {r.type === TRANSACTION_TYPE.CREDIT ? '+' : '-'}${r.amount.toFixed(2)}
                    </td>
                    <td className="px-4 py-3 text-gray-500 whitespace-nowrap">{r.date}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {showSubCatModal && (
        <AddSubCategoryModal
          subCategories={subCategories}
          onAdd={handleAddSubCategory}
          onClose={() => setShowSubCatModal(false)}
        />
      )}
      {showTxModal && (
        <AddTransactionModal
          subCategories={subCategories}
          category={category}
          onAdd={handleAddTransaction}
          onClose={() => setShowTxModal(false)}
        />
      )}
    </div>
  )
}

export default SubCategories

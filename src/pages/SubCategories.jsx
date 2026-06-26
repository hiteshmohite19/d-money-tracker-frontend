import { useState, useEffect } from 'react'
import { CURRENCY } from '../constants'
import { toast } from 'react-toastify'
import { get, post } from '../api/client'
import AddSubCategoryModal from '../components/AddSubCategoryModal'
import AddTransactionModal from '../components/AddTransactionModal'
import Table from '../components/Table'

function SubCategories({ category, onBack }) {
  const [subCategories, setSubCategories] = useState([])
  const [search, setSearch] = useState('')
  const [showSubCatModal, setShowSubCatModal] = useState(false)
  const [showTxModal, setShowTxModal] = useState(false)
  const [editingSubCat, setEditingSubCat] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    get(`/api/subcategories/${category.id}/sub-categories/`)
      .then((data) => setSubCategories(data))
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false))
  }, [category.id])

  const filtered = subCategories.filter((s) =>
    (s.name ?? '').toLowerCase().includes(search.toLowerCase())
  )

  function handleAddSubCategory(created) {
    setSubCategories(created)
  }

  function handleEditSubCategory(updated) {
    const next = Array.isArray(updated)
      ? updated
      : subCategories.map((s) => (s.id === updated.id ? updated : s))
    setSubCategories(next)
  }

  async function handleDeleteSubCategory(row) {
    if (!window.confirm(`Delete sub-category "${row.name}"?`)) return
    try {
      const updated = await post(`/api/subcategories/sub-category/${row.id}/delete/`, {})
      const next = Array.isArray(updated) ? updated : subCategories.filter((s) => s.id !== row.id)
      setSubCategories(next)
      toast.success('Sub-category deleted.')
    } catch (err) {
      toast.error(err.message || 'Failed to delete sub-category.')
    }
  }

  const actionColumn = {
    key: '_actions',
    label: 'Actions',
    headerClass: 'text-right',
    className: 'text-right',
    render: (row) => (
      <div className="flex items-center justify-end gap-2">
        <button
          onClick={() => setEditingSubCat(row)}
          className="p-1.5 rounded-lg text-indigo-500 hover:bg-indigo-50 transition-colors"
          title="Edit"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
          </svg>
        </button>
        <button
          onClick={() => handleDeleteSubCategory(row)}
          className="p-1.5 rounded-lg text-red-400 hover:bg-red-50 transition-colors"
          title="Delete"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
          </svg>
        </button>
      </div>
    ),
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
            <h2 className="text-2xl font-bold text-gray-800">{category.name}</h2>
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
            disabled={subCategories.length === 0}
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

      {error && <p className="text-sm text-red-500 mb-4">{error}</p>}
      {loading && <div className="text-sm text-gray-400 py-12 text-center">Loading…</div>}

      {!loading && (
        <Table
          columns={[
            { key: 'name', label: 'Name', className: 'text-gray-800 font-medium whitespace-nowrap' },
            { key: 'description', label: 'Description', className: 'text-gray-600' },
            { key: 'transaction_with', label: 'Transaction With', className: 'text-gray-600' },
            {
              key: 'amount',
              label: 'Amount',
              headerClass: 'text-right',
              className: 'text-right font-semibold whitespace-nowrap',
              render: (r) => (
                <span className={r.transaction_type?.toLowerCase() === 'credit' ? 'text-green-600' : 'text-red-500'}>
                  {r.transaction_type?.toLowerCase() === 'credit' ? '+' : '-'}{CURRENCY}{r.amount}
                </span>
              ),
            },
            { key: 'date', label: 'Date', className: 'text-gray-500 whitespace-nowrap' },
            actionColumn,
          ]}
          data={filtered}
          resetKey={search}
          emptyMessage="No entries found. Add a sub-category and transaction to get started."
        />
      )}

      {showSubCatModal && (
        <AddSubCategoryModal
          categoryId={category.id}
          subCategories={subCategories}
          onAdd={handleAddSubCategory}
          onClose={() => setShowSubCatModal(false)}
        />
      )}
      {editingSubCat && (
        <AddSubCategoryModal
          categoryId={category.id}
          subCategories={subCategories}
          initialData={editingSubCat}
          onEdit={handleEditSubCategory}
          onClose={() => setEditingSubCat(null)}
        />
      )}
      {showTxModal && (
        <AddTransactionModal
          subCategories={subCategories}
          category={category}
          onAdd={() => {}}
          onClose={() => setShowTxModal(false)}
        />
      )}
    </div>
  )
}

export default SubCategories

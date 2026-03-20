import { useState } from 'react'

export default function AddSubCategoryModal({ subCategories, onAdd, onClose }) {
  const [value, setValue] = useState('')
  const [error, setError] = useState('')

  function handleSubmit(e) {
    e.preventDefault()
    const trimmed = value.trim()
    if (!trimmed) return setError('Sub-category name is required.')
    if (subCategories.map((s) => s.toLowerCase()).includes(trimmed.toLowerCase()))
      return setError('Sub-category already exists.')
    onAdd(trimmed)
    onClose()
  }

  return (
    <div className="fixed inset-0 lg:left-64 z-50 overflow-y-auto bg-black/40">
      <div className="flex min-h-full items-start justify-center px-4 py-8 sm:items-center">
        <div className="bg-white rounded-xl shadow-xl w-full max-w-sm p-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Add Sub-Category</h3>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
              <input
                autoFocus
                type="text"
                value={value}
                onChange={(e) => { setValue(e.target.value); setError('') }}
                placeholder="e.g. Groceries"
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
              {error && <p className="text-xs text-red-500 mt-1">{error}</p>}
            </div>
            <div className="flex gap-3 justify-end">
              <button type="button" onClick={onClose} className="px-4 py-2 text-sm rounded-lg border border-gray-300 text-gray-600 hover:bg-gray-50 transition-colors">
                Cancel
              </button>
              <button type="submit" className="px-4 py-2 text-sm rounded-lg bg-indigo-600 text-white hover:bg-indigo-700 transition-colors">
                Add
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}

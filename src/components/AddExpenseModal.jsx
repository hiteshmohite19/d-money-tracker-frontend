import { useState } from 'react'

export default function AddExpenseModal({ onAdd, onClose }) {
  const [form, setForm] = useState({ name: '', description: '', price: '', expectedDate: '' })
  const [errors, setErrors] = useState({})

  function validate() {
    const e = {}
    if (!form.name.trim()) e.name = 'Required.'
    if (!form.price || isNaN(Number(form.price)) || Number(form.price) <= 0) e.price = 'Enter a valid price.'
    if (!form.expectedDate) e.expectedDate = 'Required.'
    return e
  }

  function handleSubmit(ev) {
    ev.preventDefault()
    const e = validate()
    if (Object.keys(e).length) return setErrors(e)
    onAdd({ ...form, price: parseFloat(form.price), id: Date.now() })
    onClose()
  }

  function field(key, val) {
    setForm((prev) => ({ ...prev, [key]: val }))
    setErrors((prev) => ({ ...prev, [key]: undefined }))
  }

  return (
    <div className="fixed inset-0 lg:left-64 z-50 overflow-y-auto bg-black/40">
      <div className="flex min-h-full items-start justify-center px-4 py-8 sm:items-center">
        <div className="bg-white rounded-xl shadow-xl w-full max-w-md p-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Add Expense</h3>
          <form onSubmit={handleSubmit} className="space-y-4">

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Item Name</label>
              <input
                autoFocus
                type="text"
                value={form.name}
                onChange={(e) => field('name', e.target.value)}
                placeholder="e.g. MacBook Pro"
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
              {errors.name && <p className="text-xs text-red-500 mt-1">{errors.name}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Description <span className="text-gray-400 font-normal">(optional)</span>
              </label>
              <input
                type="text"
                value={form.description}
                onChange={(e) => field('description', e.target.value)}
                placeholder="e.g. Upgrade for work productivity"
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Price ($)</label>
                <input
                  type="number"
                  min="0"
                  step="0.01"
                  value={form.price}
                  onChange={(e) => field('price', e.target.value)}
                  placeholder="0.00"
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
                {errors.price && <p className="text-xs text-red-500 mt-1">{errors.price}</p>}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Expected Date</label>
                <input
                  type="date"
                  value={form.expectedDate}
                  onChange={(e) => field('expectedDate', e.target.value)}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
                {errors.expectedDate && <p className="text-xs text-red-500 mt-1">{errors.expectedDate}</p>}
              </div>
            </div>

            <div className="flex gap-3 justify-end pt-2">
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

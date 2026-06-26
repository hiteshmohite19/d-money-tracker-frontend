import { useState } from 'react'
import { toast } from 'react-toastify'
import { post } from '../api/client'
import Input from './Input'

export default function AddSubCategoryModal({ categoryId, subCategories, initialData, onAdd, onEdit, onClose }) {
  const isEditing = !!initialData
  const [value, setValue] = useState(initialData?.name ?? '')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e) {
    e.preventDefault()
    const trimmed = value.trim()
    if (!trimmed) return setError('Sub-category name is required.')
    if (!isEditing && subCategories.map((s) => s.name.toLowerCase()).includes(trimmed.toLowerCase()))
      return setError('Sub-category already exists.')
    setLoading(true)
    try {
      if (isEditing) {
        const updated = await post(`/api/subcategories/sub-category/${initialData.id}/update/`, { name: trimmed, user_category: categoryId })
        onEdit(updated)
        toast.success('Sub-category updated.')
      } else {
        const created = await post('/api/subcategories/sub-category/', { user_category: categoryId, name: trimmed })
        onAdd(created)
        toast.success('Sub-category added.')
      }
      onClose()
    } catch (err) {
      toast.error(err.message || `Failed to ${isEditing ? 'update' : 'add'} sub-category.`)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="fixed inset-0 lg:left-64 z-50 overflow-y-auto bg-black/40">
      <div className="flex min-h-full items-start justify-center px-4 py-8 sm:items-center">
        <div className="bg-white rounded-xl shadow-xl w-full max-w-sm p-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">
            {isEditing ? 'Edit Sub-Category' : 'Add Sub-Category'}
          </h3>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
              <Input
                autoFocus
                value={value}
                onChange={(e) => { setValue(e.target.value); setError('') }}
                placeholder="e.g. Groceries"
                disabled={loading}
              />
              {error && <p className="text-xs text-red-500 mt-1">{error}</p>}
            </div>
            <div className="flex gap-3 justify-end">
              <button type="button" onClick={onClose} disabled={loading} className="px-4 py-2 text-sm rounded-lg border border-gray-300 text-gray-600 hover:bg-gray-50 transition-colors disabled:opacity-60">
                Cancel
              </button>
              <button type="submit" disabled={loading} className="px-4 py-2 text-sm rounded-lg bg-indigo-600 text-white hover:bg-indigo-700 transition-colors disabled:opacity-60">
                {loading ? (isEditing ? 'Saving…' : 'Adding…') : (isEditing ? 'Save' : 'Add')}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}

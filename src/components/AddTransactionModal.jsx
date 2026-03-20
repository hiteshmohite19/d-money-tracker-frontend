import { useState } from 'react'
import { TRANSACTION_TYPE } from '../data/transactions'

export default function AddTransactionModal({ subCategories, category, onAdd, onClose }) {
  const isEmi = category.toLowerCase() === 'emi'

  const [form, setForm] = useState({
    subCategory: subCategories[0] ?? '',
    description: '',
    type: TRANSACTION_TYPE.DEBIT,
    amount: '',
    date: new Date().toISOString().slice(0, 10),
    proof: null,
    emiDuration: '',
    emiDeductionDate: '',
  })
  const [proofPreview, setProofPreview] = useState(null)
  const [errors, setErrors] = useState({})

  function validate() {
    const e = {}
    if (!form.subCategory) e.subCategory = 'Required.'
    if (!form.description.trim()) e.description = 'Required.'
    if (!form.amount || isNaN(Number(form.amount)) || Number(form.amount) <= 0) e.amount = 'Enter a valid amount.'
    if (!form.date) e.date = 'Required.'
    if (isEmi) {
      if (!form.emiDuration || isNaN(Number(form.emiDuration)) || Number(form.emiDuration) < 1)
        e.emiDuration = 'Enter a valid duration.'
      if (!form.emiDeductionDate) e.emiDeductionDate = 'Required.'
    }
    return e
  }

  function handleSubmit(e) {
    e.preventDefault()
    const e2 = validate()
    if (Object.keys(e2).length) return setErrors(e2)
    onAdd({ ...form, amount: parseFloat(form.amount), id: Date.now() })
    onClose()
  }

  function field(key, value) {
    setForm((prev) => ({ ...prev, [key]: value }))
    setErrors((prev) => ({ ...prev, [key]: undefined }))
  }

  function handleProof(e) {
    const file = e.target.files[0]
    if (!file) return
    setForm((prev) => ({ ...prev, proof: file }))
    setProofPreview(URL.createObjectURL(file))
  }

  return (
    <div className="fixed inset-0 lg:left-64 z-50 flex items-start justify-center bg-black/40 px-4 pt-20 pb-8">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-md flex flex-col max-h-[calc(100vh-7rem)]">
        <div className="px-6 pt-6 pb-4 border-b border-gray-100 shrink-0">
          <h3 className="text-lg font-semibold text-gray-800">Add Transaction</h3>
        </div>
        <div className="overflow-y-auto flex-1 px-6 py-4">
          <form id="add-tx-form" onSubmit={handleSubmit} className="space-y-4">

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Sub-Category</label>
              <select
                value={form.subCategory}
                onChange={(e) => field('subCategory', e.target.value)}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
              >
                {subCategories.map((s) => <option key={s} value={s}>{s}</option>)}
              </select>
              {errors.subCategory && <p className="text-xs text-red-500 mt-1">{errors.subCategory}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
              <input
                type="text"
                value={form.description}
                onChange={(e) => field('description', e.target.value)}
                placeholder="e.g. Weekly grocery run"
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
              {errors.description && <p className="text-xs text-red-500 mt-1">{errors.description}</p>}
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Type</label>
                <select
                  value={form.type}
                  onChange={(e) => field('type', e.target.value)}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                >
                  <option value={TRANSACTION_TYPE.CREDIT}>Credit</option>
                  <option value={TRANSACTION_TYPE.DEBIT}>Debit</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Amount ($)</label>
                <input
                  type="number"
                  min="0"
                  step="0.01"
                  value={form.amount}
                  onChange={(e) => field('amount', e.target.value)}
                  placeholder="0.00"
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
                {errors.amount && <p className="text-xs text-red-500 mt-1">{errors.amount}</p>}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Date</label>
              <input
                type="date"
                value={form.date}
                onChange={(e) => field('date', e.target.value)}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
              {errors.date && <p className="text-xs text-red-500 mt-1">{errors.date}</p>}
            </div>

            {isEmi && (
              <div className="rounded-lg border border-indigo-100 bg-indigo-50 p-4 space-y-4">
                <p className="text-xs font-semibold text-indigo-500 uppercase tracking-wide">EMI Details</p>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Duration (months)</label>
                    <input
                      type="number"
                      min="1"
                      step="1"
                      value={form.emiDuration}
                      onChange={(e) => field('emiDuration', e.target.value)}
                      placeholder="e.g. 12"
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                    {errors.emiDuration && <p className="text-xs text-red-500 mt-1">{errors.emiDuration}</p>}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Date of Deduction</label>
                    <input
                      type="date"
                      value={form.emiDeductionDate}
                      onChange={(e) => field('emiDeductionDate', e.target.value)}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                    {errors.emiDeductionDate && <p className="text-xs text-red-500 mt-1">{errors.emiDeductionDate}</p>}
                  </div>
                </div>
              </div>
            )}

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Transaction Proof <span className="text-gray-400 font-normal">(optional)</span>
              </label>
              <label className="flex flex-col items-center justify-center w-full border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-indigo-400 transition-colors overflow-hidden">
                {proofPreview ? (
                  <img src={proofPreview} alt="proof preview" className="w-full max-h-40 object-contain p-2" />
                ) : (
                  <div className="flex flex-col items-center py-5 text-gray-400">
                    <svg className="w-8 h-8 mb-2" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5" />
                    </svg>
                    <span className="text-sm">Click to upload image</span>
                    <span className="text-xs mt-1">PNG, JPG, WEBP</span>
                  </div>
                )}
                <input type="file" accept="image/*" className="hidden" onChange={handleProof} />
              </label>
            </div>

          </form>
        </div>
        <div className="px-6 py-4 border-t border-gray-100 flex gap-3 justify-end shrink-0">
          <button type="button" onClick={onClose} className="px-4 py-2 text-sm rounded-lg border border-gray-300 text-gray-600 hover:bg-gray-50 transition-colors">
            Cancel
          </button>
          <button type="submit" form="add-tx-form" className="px-4 py-2 text-sm rounded-lg bg-indigo-600 text-white hover:bg-indigo-700 transition-colors">
            Add
          </button>
        </div>
      </div>
    </div>
  )
}

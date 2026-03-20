import { useState, useRef } from 'react'

const INITIAL = {
  firstName: 'John',
  lastName: 'Doe',
  mobile: '+1 (555) 000-1234',
  mobileVerified: true,
  email: 'john.doe@example.com',
  emailVerified: true,
  income: '5000',
  expectedExpense: '3500',
  expectedSavings: '1500',
  photo: null,
}

function VerifiedBadge({ verified }) {
  return verified ? (
    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium bg-green-50 text-green-600">
      <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
      </svg>
      Verified
    </span>
  ) : (
    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium bg-yellow-50 text-yellow-600">
      <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
        <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
      </svg>
      Unverified
    </span>
  )
}

function Field({ label, value, editing, onChange, type = 'text', prefix }) {
  return (
    <div>
      <label className="block text-xs font-medium text-gray-500 mb-1">{label}</label>
      {editing ? (
        <div className="flex items-center">
          {prefix && (
            <span className="inline-flex items-center px-3 py-2 border border-r-0 border-gray-300 rounded-l-lg bg-gray-50 text-gray-500 text-sm">
              {prefix}
            </span>
          )}
          <input
            type={type}
            value={value}
            onChange={(e) => onChange(e.target.value)}
            min={type === 'number' ? '0' : undefined}
            step={type === 'number' ? '0.01' : undefined}
            className={`w-full border border-gray-300 px-3 py-2 text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-indigo-500 ${prefix ? 'rounded-r-lg' : 'rounded-lg'}`}
          />
        </div>
      ) : (
        <p className="text-sm text-gray-800 py-2">
          {value ? `${prefix ?? ''}${value}` : <span className="text-gray-400 italic">Not set</span>}
        </p>
      )}
    </div>
  )
}

export default function Profile() {
  const [data, setData] = useState(INITIAL)
  const [draft, setDraft] = useState(INITIAL)
  const [editing, setEditing] = useState(false)
  const [photoPreview, setPhotoPreview] = useState(null)
  const [draftPhotoPreview, setDraftPhotoPreview] = useState(null)
  const fileRef = useRef(null)

  function handleEdit() {
    setDraft(data)
    setDraftPhotoPreview(photoPreview)
    setEditing(true)
  }

  function handleCancel() {
    setDraft(data)
    setDraftPhotoPreview(photoPreview)
    setEditing(false)
  }

  function handleSave() {
    setData(draft)
    setPhotoPreview(draftPhotoPreview)
    setEditing(false)
  }

  function handlePhoto(e) {
    const file = e.target.files[0]
    if (!file) return
    setDraft((prev) => ({ ...prev, photo: file }))
    setDraftPhotoPreview(URL.createObjectURL(file))
  }

  function field(key) {
    return {
      value: draft[key],
      onChange: (val) => setDraft((prev) => ({ ...prev, [key]: val })),
    }
  }

  const currentPhoto = editing ? draftPhotoPreview : photoPreview
  const displayData = editing ? draft : data

  return (
    <div className="max-w-2xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-gray-800">Profile</h2>
        <div className="flex gap-2">
          {editing ? (
            <>
              <button
                onClick={handleCancel}
                className="px-4 py-2 text-sm border border-gray-300 text-gray-600 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleSave}
                className="px-4 py-2 text-sm bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
              >
                Save Changes
              </button>
            </>
          ) : (
            <button
              onClick={handleEdit}
              className="inline-flex items-center gap-2 px-4 py-2 text-sm border border-gray-300 text-gray-600 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
              </svg>
              Edit
            </button>
          )}
        </div>
      </div>

      {/* Avatar card */}
      <div className="bg-white rounded-xl shadow-sm p-6 mb-4 flex items-center gap-5">
        <div className="relative flex-shrink-0">
          <div className="w-20 h-20 rounded-full bg-indigo-100 overflow-hidden flex items-center justify-center">
            {currentPhoto ? (
              <img src={currentPhoto} alt="Profile" className="w-full h-full object-cover" />
            ) : (
              <span className="text-2xl font-bold text-indigo-400 select-none">
                {displayData.firstName?.[0]?.toUpperCase() ?? '?'}
              </span>
            )}
          </div>
          {editing && (
            <>
              <button
                onClick={() => fileRef.current?.click()}
                className="absolute bottom-0 right-0 w-7 h-7 bg-indigo-600 text-white rounded-full flex items-center justify-center shadow hover:bg-indigo-700 transition-colors"
                title="Change photo"
              >
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              </button>
              <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={handlePhoto} />
            </>
          )}
        </div>
        <div>
          <p className="text-lg font-semibold text-gray-800">
            {`${displayData.firstName} ${displayData.lastName}`.trim() || 'Your Name'}
          </p>
          <p className="text-sm text-gray-500">{displayData.email}</p>
        </div>
      </div>

      {/* Personal Info */}
      <div className="bg-white rounded-xl shadow-sm p-6 mb-4">
        <h3 className="text-sm font-semibold text-gray-700 uppercase tracking-wide mb-4">Personal Information</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          <Field label="First Name" editing={editing} {...field('firstName')} />
          <Field label="Last Name" editing={editing} {...field('lastName')} />
        </div>
      </div>

      {/* Contact */}
      <div className="bg-white rounded-xl shadow-sm p-6 mb-4">
        <h3 className="text-sm font-semibold text-gray-700 uppercase tracking-wide mb-4">Contact</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-xs font-medium text-gray-500">Mobile</span>
              <VerifiedBadge verified={data.mobileVerified} />
            </div>
            <p className="text-sm text-gray-800 py-2">{data.mobile}</p>
          </div>
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-xs font-medium text-gray-500">Email</span>
              <VerifiedBadge verified={data.emailVerified} />
            </div>
            <p className="text-sm text-gray-800 py-2">{data.email}</p>
          </div>
        </div>
      </div>

      {/* Financial */}
      <div className="bg-white rounded-xl shadow-sm p-6">
        <h3 className="text-sm font-semibold text-gray-700 uppercase tracking-wide mb-4">Financial</h3>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
          <Field label="Monthly Income" editing={editing} type="number" prefix="$" {...field('income')} />
          <Field label="Expected Expense" editing={editing} type="number" prefix="$" {...field('expectedExpense')} />
          <Field label="Expected Savings" editing={editing} type="number" prefix="$" {...field('expectedSavings')} />
        </div>
      </div>
    </div>
  )
}

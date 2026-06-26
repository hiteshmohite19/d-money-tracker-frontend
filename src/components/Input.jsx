const BASE = 'w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 disabled:opacity-60'

export default function Input({ type = 'text', rows, className = '', ...props }) {
  if (type === 'textarea') {
    return <textarea rows={rows ?? 3} className={`${BASE} resize-none ${className}`.trim()} {...props} />
  }
  return <input type={type} className={`${BASE} ${className}`.trim()} {...props} />
}

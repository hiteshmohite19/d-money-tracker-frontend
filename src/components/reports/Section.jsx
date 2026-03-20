export default function Section({ title, action, children }) {
  return (
    <div className="bg-white rounded-xl shadow-sm p-6">
      <div className="flex items-center justify-between mb-4 pb-3 border-b border-gray-100">
        <h3 className="text-base font-semibold text-gray-800">{title}</h3>
        {action}
      </div>
      <div className="space-y-2 text-sm text-gray-700 leading-relaxed">
        {children}
      </div>
    </div>
  )
}

export default function Row({ label, value, valueClass = '' }) {
  return (
    <div className="flex items-start justify-between gap-4 py-1">
      <span className="text-gray-500">{label}</span>
      <span className={`font-medium text-right ${valueClass}`}>{value}</span>
    </div>
  )
}

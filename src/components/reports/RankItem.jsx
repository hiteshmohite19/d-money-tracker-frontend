export default function RankItem({ rank, label, sub, value, valueClass = '' }) {
  return (
    <div className="flex items-center gap-3 py-1.5">
      <span className="w-6 h-6 rounded-full bg-indigo-50 text-indigo-600 text-xs font-bold flex items-center justify-center shrink-0">
        {rank}
      </span>
      <div className="flex-1 min-w-0">
        <p className="font-medium text-gray-800 truncate">{label}</p>
        {sub && <p className="text-xs text-gray-400">{sub}</p>}
      </div>
      <span className={`font-semibold whitespace-nowrap ${valueClass}`}>{value}</span>
    </div>
  )
}

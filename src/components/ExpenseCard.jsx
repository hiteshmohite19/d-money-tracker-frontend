export default function ExpenseCard({ expense, onDelete }) {
  return (
    <div className="bg-white rounded-xl shadow-sm p-5 flex flex-col gap-3 hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between gap-2">
        <h4 className="font-semibold text-gray-800 leading-tight">{expense.name}</h4>
        <button
          onClick={() => onDelete(expense.id)}
          className="text-gray-300 hover:text-red-400 transition-colors shrink-0 mt-0.5"
          aria-label="Delete"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      {expense.description && (
        <p className="text-sm text-gray-500 leading-snug">{expense.description}</p>
      )}

      <div className="mt-auto pt-3 border-t border-gray-100 flex items-center justify-between">
        <span className="text-lg font-bold text-indigo-600">${expense.price.toFixed(2)}</span>
        <div className="flex items-center gap-1.5 text-xs text-gray-400">
          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
          {expense.expectedDate}
        </div>
      </div>
    </div>
  )
}

import { useState } from 'react'
import { SAMPLE_EXPENSES } from '../data/expenses'
import AddExpenseModal from '../components/AddExpenseModal'
import ExpenseCard from '../components/ExpenseCard'

export default function Wishlists() {
    const [expenses, setExpenses] = useState(SAMPLE_EXPENSES);
    const [search, setSearch] = useState("");
    const [showModal, setShowModal] = useState(false);

    const filtered = expenses.filter(
        (e) =>
            e.name.toLowerCase().includes(search.toLowerCase()) ||
            e.description.toLowerCase().includes(search.toLowerCase()),
    );

    function handleAdd(expense) {
        setExpenses((prev) => [expense, ...prev]);
    }

    function handleDelete(id) {
        setExpenses((prev) => prev.filter((e) => e.id !== id));
    }

    return (
        <div>
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
                <div>
                    <h2 className="text-2xl font-bold text-gray-800">
                        Expenses
                    </h2>
                    <p className="text-sm text-gray-500 mt-1">
                        {filtered.length} item{filtered.length !== 1 ? "s" : ""}
                    </p>
                </div>
                <button
                    onClick={() => setShowModal(true)}
                    className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white text-sm font-medium rounded-lg hover:bg-indigo-700 transition-colors"
                >
                    <svg
                        className="w-4 h-4"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth={2}
                        viewBox="0 0 24 24"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M12 4v16m8-8H4"
                        />
                    </svg>
                    Add Expense
                </button>
            </div>

            {/* Search */}
            <div className="relative mb-6 max-w-sm">
                <svg
                    className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth={2}
                    viewBox="0 0 24 24"
                >
                    <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M21 21l-4.35-4.35M17 11A6 6 0 1 1 5 11a6 6 0 0 1 12 0z"
                    />
                </svg>
                <input
                    type="text"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    placeholder="Search expenses..."
                    className="w-full pl-9 pr-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
            </div>

            {/* Cards grid */}
            {filtered.length === 0 ? (
                <div className="bg-white rounded-xl shadow-sm px-4 py-16 text-center text-gray-400 text-sm">
                    No expenses found.
                </div>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {filtered.map((e) => (
                        <ExpenseCard
                            key={e.id}
                            expense={e}
                            onDelete={handleDelete}
                        />
                    ))}
                </div>
            )}

            {showModal && (
                <AddExpenseModal
                    onAdd={handleAdd}
                    onClose={() => setShowModal(false)}
                />
            )}
        </div>
    );
}

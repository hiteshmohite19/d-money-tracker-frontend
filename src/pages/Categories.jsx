import { useState } from "react";
import Table from "../components/Table";

const DEFAULT_CATEGORIES = [
    "Food",
    "Transport",
    "Shopping",
    "Utilities",
    "Health",
    "Entertainment",
    "Salary",
    "EMI",
    "Other",
];

const SAMPLE_TRANSACTIONS = [
    {
        id: 1,
        date: "2026-03-01",
        description: "Grocery Store",
        category: "Food",
        type: "expense",
        amount: 52.4,
    },
    {
        id: 2,
        date: "2026-03-03",
        description: "Monthly Salary",
        category: "Salary",
        type: "income",
        amount: 3500,
    },
    {
        id: 3,
        date: "2026-03-05",
        description: "Electricity Bill",
        category: "Utilities",
        type: "expense",
        amount: 120,
    },
    {
        id: 4,
        date: "2026-03-06",
        description: "Bus Pass",
        category: "Transport",
        type: "expense",
        amount: 45,
    },
    {
        id: 5,
        date: "2026-03-07",
        description: "Netflix",
        category: "Entertainment",
        type: "expense",
        amount: 15.99,
    },
    {
        id: 6,
        date: "2026-03-08",
        description: "Pharmacy",
        category: "Health",
        type: "expense",
        amount: 30,
    },
    {
        id: 7,
        date: "2026-03-08",
        description: "Home Loan",
        category: "EMI",
        type: "expense",
        amount: 3000,
    },
];

function AddCategoryModal({ categories, onAdd, onClose }) {
    const [value, setValue] = useState("");
    const [description, setDescription] = useState("");
    const [error, setError] = useState("");

    function handleSubmit(e) {
        e.preventDefault();
        const trimmed = value.trim();
        if (!trimmed) return setError("Category name is required.");
        if (
            categories
                .map((c) => c.toLowerCase())
                .includes(trimmed.toLowerCase())
        )
            return setError("Category already exists.");
        onAdd(trimmed, description.trim());
        onClose();
    }

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
            <div className="bg-white rounded-xl shadow-xl w-full max-w-sm p-6">
                <h3 className="text-lg font-semibold text-gray-800 mb-4">
                    Add Category
                </h3>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Category Name
                        </label>
                        <input
                            autoFocus
                            type="text"
                            value={value}
                            onChange={(e) => {
                                setValue(e.target.value);
                                setError("");
                            }}
                            placeholder="e.g. Rent"
                            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        />
                        {error && (
                            <p className="text-xs text-red-500 mt-1">{error}</p>
                        )}
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Description{" "}
                            <span className="text-gray-400 font-normal">
                                (optional)
                            </span>
                        </label>
                        <textarea
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            placeholder="e.g. Monthly rent and housing costs"
                            rows={3}
                            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 resize-none"
                        />
                    </div>
                    <div className="flex gap-3 justify-end">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-4 py-2 text-sm rounded-lg border border-gray-300 text-gray-600 hover:bg-gray-50 transition-colors"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            className="px-4 py-2 text-sm rounded-lg bg-indigo-600 text-white hover:bg-indigo-700 transition-colors"
                        >
                            Add
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}

function Categories({ onCategoryClick }) {
      const [transactions] = useState(SAMPLE_TRANSACTIONS)
    const [categories, setCategories] = useState(DEFAULT_CATEGORIES);
    const [search, setSearch] = useState("");
    const [filterCategory, setFilterCategory] = useState("All");
    const [showModal, setShowModal] = useState(false);

      const filtered = transactions.filter((t) => {
        const matchesSearch =
          t.description.toLowerCase().includes(search.toLowerCase()) ||
          t.category.toLowerCase().includes(search.toLowerCase())
        const matchesCategory = filterCategory === 'All' || t.category === filterCategory
        return matchesSearch && matchesCategory
      })

    function handleAddCategory(name) {
        setCategories((prev) => [...prev, name]);
    }

    return (
        <div>
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
                <h2 className="text-2xl font-bold text-gray-800">Categories</h2>
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
                    Add Category
                </button>
            </div>

            {/* Search & filter bar */}
            <div className="flex flex-col sm:flex-row gap-3 mb-4">
                <div className="relative flex-1">
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
                        placeholder="Search transactions..."
                        className="w-full pl-9 pr-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                </div>
                <select
                    value={filterCategory}
                    onChange={(e) => setFilterCategory(e.target.value)}
                    className="border border-gray-300 rounded-lg px-3 py-2 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                >
                    <option value="All">All Categories</option>
                    {categories.map((c) => (
                        <option key={c} value={c}>
                            {c}
                        </option>
                    ))}
                </select>
            </div>

            <Table
                columns={[
                    {
                        key: 'category',
                        label: 'Category',
                        render: (t) => (
                            <button
                                onClick={() => onCategoryClick(t.category)}
                                className="inline-block px-2 py-0.5 rounded-full text-xs bg-indigo-50 text-indigo-600 font-medium hover:bg-indigo-100 transition-colors cursor-pointer"
                            >
                                {t.category}
                            </button>
                        ),
                    },
                    { key: 'description', label: 'Description', className: 'text-gray-800 font-medium' },
                    {
                        key: 'type',
                        label: 'Transaction Trend',
                        render: (t) => (
                            <span className={`inline-block px-2 py-0.5 rounded-full text-xs font-medium ${
                                t.type === 'income' ? 'bg-green-50 text-green-600' : 'bg-red-50 text-red-500'
                            }`}>
                                {t.type.charAt(0).toUpperCase() + t.type.slice(1)}
                            </span>
                        ),
                    },
                    {
                        key: 'amount',
                        label: 'Amount',
                        headerClass: 'text-right',
                        className: 'text-right font-semibold whitespace-nowrap',
                        render: (t) => (
                            <span className={t.type === 'income' ? 'text-green-600' : 'text-red-500'}>
                                {t.type === 'income' ? '+' : '-'}${t.amount ? t.amount.toFixed(2) : '0.00'}
                            </span>
                        ),
                    },
                ]}
                data={filtered}
                resetKey={search + filterCategory}
                emptyMessage="No transactions match your filters."
            />

            {showModal && (
                <AddCategoryModal
                    categories={categories}
                    onAdd={handleAddCategory}
                    onClose={() => setShowModal(false)}
                />
            )}
        </div>
    );
}

export default Categories;

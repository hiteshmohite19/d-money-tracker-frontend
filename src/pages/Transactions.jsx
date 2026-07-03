import { useState, useEffect, useMemo } from "react";
import { CURRENCY } from "../constants";
import { toast } from "react-toastify";
import { get, post } from "../api/client";
import Table from "../components/Table";
import AddTransactionModal from "../components/AddTransactionModal";

export default function Transactions({ onCategoryClick }) {
    const [transactions, setTransactions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [search, setSearch] = useState("");
    const [fromDate, setFromDate] = useState("");
    const [toDate, setToDate] = useState("");
    const [showModal, setShowModal] = useState(false);
    const [editingTransaction, setEditingTransaction] = useState(null);
    const categories = JSON.parse(localStorage.getItem("categories") ?? "[]");

    useEffect(() => {
        get("/api/transactions/transactions/")
            .then((data) => {
                const txns = Array.isArray(data) ? data : (data.results ?? data.transactions ?? []);
                setTransactions(txns);
            })
            .catch((err) => setError(err.message))
            .finally(() => setLoading(false));
    }, []);

    const filtered = useMemo(() => transactions, [transactions]);

    const hasFilters = search || fromDate || toDate;

    async function handleDeleteTransaction(row) {
        if (!window.confirm("Delete this transaction?")) return;
        try {
            const updated = await post(`/api/transactions/transaction/${row.id}/delete/`, {});
            const next = Array.isArray(updated) ? updated : transactions.filter((t) => t.id !== row.id);
            setTransactions(next);
            toast.success("Transaction deleted.");
        } catch (err) {
            toast.error(err.message || "Failed to delete transaction.");
        }
    }

    function handleEditTransaction(updated) {
        const next = Array.isArray(updated)
            ? updated
            : transactions.map((t) => (t.id === updated.id ? updated : t));
        setTransactions(next);
        setEditingTransaction(null);
    }

    const actionColumn = {
        key: "_actions",
        label: "Actions",
        headerClass: "text-right",
        className: "text-right",
        render: (row) => (
            <div className="flex items-center justify-end gap-2">
                <button
                    onClick={() => setEditingTransaction(row)}
                    className="p-1.5 rounded-lg text-indigo-500 hover:bg-indigo-50 transition-colors"
                    title="Edit"
                >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                    </svg>
                </button>
                <button
                    onClick={() => handleDeleteTransaction(row)}
                    className="p-1.5 rounded-lg text-red-400 hover:bg-red-50 transition-colors"
                    title="Delete"
                >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                </button>
            </div>
        ),
    };

    const columns = [
        {
            key: "category",
            label: "Category",
            render: (t) => (
                <button
                    onClick={() => onCategoryClick?.({ id: t.category_id ?? t.user_category_id, name: t.category })}
                    className="inline-block px-2 py-0.5 rounded-full text-xs bg-indigo-50 text-indigo-600 font-medium hover:bg-indigo-100 transition-colors"
                >
                    {t.category}
                </button>
            ),
        },
        { key: "sub_category", label: "Sub Category", className: "text-gray-700 whitespace-nowrap" },
        { key: "sub_category_description", label: "Description", className: "text-gray-600" },
        {
            key: "transaction_type",
            label: "Type",
            render: (t) => (
                <span className={`inline-block px-2 py-0.5 rounded-full text-xs font-medium ${
                    t.transaction_type.toLowerCase() === "credit"
                        ? "bg-green-50 text-green-600"
                        : "bg-red-50 text-red-500"
                }`}>
                    {t.transaction_type}
                </span>
            ),
        },
        {
            key: "amount",
            label: "Amount",
            headerClass: "text-right",
            className: "text-right font-semibold whitespace-nowrap",
            render: (t) => (
                <span className={t.transaction_type.toLowerCase() === "credit" ? "text-green-600" : "text-red-500"}>
                    {t.transaction_type.toLowerCase() === "credit" ? "+" : "-"}{CURRENCY}
                    {t.amount ? t.amount.toFixed(2) : "0.00"}
                </span>
            ),
        },
        { key: "date", label: "Date", className: "text-gray-500 whitespace-nowrap" },
        actionColumn,
    ];

    if (loading) return <div className="text-sm text-gray-400 py-12 text-center">Loading…</div>;
    if (error) return <div className="text-sm text-red-500 py-12 text-center">{error}</div>;

    return (
        <div>
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
                <div>
                    <h2 className="text-2xl font-bold text-gray-800">Transactions</h2>
                    <p className="text-sm text-gray-500 mt-1">
                        {filtered.length} record{filtered.length !== 1 ? "s" : ""} found
                    </p>
                </div>
                <button
                    onClick={() => setShowModal(true)}
                    disabled={categories.length === 0}
                    className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white text-sm font-medium rounded-lg hover:bg-indigo-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
                    </svg>
                    Add Transaction
                </button>
            </div>

            {/* Filters */}
            <div className="bg-white rounded-xl shadow-sm p-4 mb-4">
                <div className="flex flex-col sm:flex-row gap-3">
                    <div className="relative flex-1">
                        <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-4.35-4.35M17 11A6 6 0 1 1 5 11a6 6 0 0 1 12 0z" />
                        </svg>
                        <input
                            type="text"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            placeholder="Search category, sub-category, description..."
                            className="w-full pl-9 pr-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        />
                    </div>
                    <div className="flex items-center gap-2">
                        <label className="text-xs text-gray-500 font-medium whitespace-nowrap">From</label>
                        <input
                            type="date"
                            value={fromDate}
                            max={toDate || undefined}
                            onChange={(e) => setFromDate(e.target.value)}
                            className="border border-gray-300 rounded-lg px-3 py-2 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        />
                    </div>
                    <div className="flex items-center gap-2">
                        <label className="text-xs text-gray-500 font-medium whitespace-nowrap">To</label>
                        <input
                            type="date"
                            value={toDate}
                            min={fromDate || undefined}
                            onChange={(e) => setToDate(e.target.value)}
                            className="border border-gray-300 rounded-lg px-3 py-2 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        />
                    </div>
                    {hasFilters && (
                        <button
                            onClick={() => { setSearch(""); setFromDate(""); setToDate(""); }}
                            className="px-3 py-2 text-sm text-gray-500 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors whitespace-nowrap"
                        >
                            Clear
                        </button>
                    )}
                </div>
            </div>

            <Table
                columns={columns}
                data={filtered}
                resetKey={search + fromDate + toDate}
                emptyMessage="No transactions match your filters."
            />

            {showModal && (
                <AddTransactionModal
                    categories={categories}
                    onAdd={(created) => setTransactions(created)}
                    onClose={() => setShowModal(false)}
                />
            )}
            {editingTransaction && (
                <AddTransactionModal
                    categories={categories}
                    initialData={editingTransaction}
                    onEdit={handleEditTransaction}
                    onClose={() => setEditingTransaction(null)}
                />
            )}
        </div>
    );
}

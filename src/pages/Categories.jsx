import { useState, useEffect } from "react";
import { toast } from "react-toastify";
import Table from "../components/Table";
import { get, post } from "../api/client";
import Input from "../components/Input";
import { CURRENCY } from "../constants";

function AddCategoryModal({ initialData, onAdd, onEdit, onClose }) {
    const isEditing = !!initialData
    const [value, setValue] = useState(initialData?.name ?? "");
    const [description, setDescription] = useState(initialData?.description ?? "");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    async function handleSubmit(e) {
        e.preventDefault();
        const trimmed = value.trim();
        if (!trimmed) return setError("Category name is required.");
        setLoading(true);
        try {
            if (isEditing) {
                const updated = await post(`/api/users/category/${initialData.id}/update/`, { name: trimmed, description });
                onEdit(updated);
                toast.success("Category updated.");
            } else {
                const created = await post("/api/users/category/", { name: trimmed });
                onAdd(created);
                toast.success("Category added.");
            }
            onClose();
        } catch (err) {
            toast.error(err.message || `Failed to ${isEditing ? 'update' : 'add'} category.`);
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
            <div className="bg-white rounded-xl shadow-xl w-full max-w-sm p-6">
                <h3 className="text-lg font-semibold text-gray-800 mb-4">
                    {isEditing ? 'Edit Category' : 'Add Category'}
                </h3>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Category Name
                        </label>
                        <Input
                            autoFocus
                            value={value}
                            onChange={(e) => { setValue(e.target.value); setError(""); }}
                            placeholder="e.g. Rent"
                        />
                        {error && <p className="text-xs text-red-500 mt-1">{error}</p>}
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Description{" "}
                            <span className="text-gray-400 font-normal">(optional)</span>
                        </label>
                        <Input
                            type="textarea"
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            placeholder="e.g. Monthly rent and housing costs"
                            rows={3}
                        />
                    </div>
                    <div className="flex gap-3 justify-end">
                        <button
                            type="button"
                            onClick={onClose}
                            disabled={loading}
                            className="px-4 py-2 text-sm rounded-lg border border-gray-300 text-gray-600 hover:bg-gray-50 transition-colors disabled:opacity-60"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={loading}
                            className="px-4 py-2 text-sm rounded-lg bg-indigo-600 text-white hover:bg-indigo-700 transition-colors disabled:opacity-60"
                        >
                            {loading ? (isEditing ? 'Saving…' : 'Adding…') : (isEditing ? 'Save' : 'Add')}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}

function Categories({ onCategoryClick }) {
    const [transactions, setTransactions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [search, setSearch] = useState("");
    const [filterCategory, setFilterCategory] = useState("All");
    const [showModal, setShowModal] = useState(false);
    const [editingCategory, setEditingCategory] = useState(null);

    const [categories, setCategories] = useState(() => JSON.parse(localStorage.getItem("categories") ?? "[]"));

    function handleAddCategory(created) {
        setCategories(created);
        localStorage.setItem("categories", JSON.stringify(created));
    }

    function handleEditCategory(updated) {
        const next = Array.isArray(updated) ? updated : categories.map((c) => (c.id === updated.id ? updated : c));
        setCategories(next);
        localStorage.setItem("categories", JSON.stringify(next));
        setTransactions((prev) => prev.map((t) => t.category_id === (updated.id ?? updated.category_id) ? { ...t, name: updated.name, description: updated.description } : t));
    }

    async function handleDeleteCategory(row) {
        if (!window.confirm(`Delete category "${row.name}"?`)) return;
        try {
            const updated = await post(`/api/users/category/${row.category_id}/delete/`, {});
            const next = Array.isArray(updated) ? updated : categories.filter((c) => c.id !== row.category_id);
            setCategories(next);
            localStorage.setItem("categories", JSON.stringify(next));
            setTransactions((prev) => prev.filter((t) => t.category_id !== row.category_id));
            toast.success("Category deleted.");
        } catch (err) {
            toast.error(err.message || "Failed to delete category.");
        }
    }

    useEffect(() => {
        const categoryMap = Object.fromEntries(
            JSON.parse(localStorage.getItem("categories") ?? "[]").map((c) => [
                String(c.id),
                c.name,
            ]),
        );
        get("/api/categories/category-transactions/")
            .then((data) => {
                const txns = Array.isArray(data) ? data : (data.results ?? data.transactions ?? []);
                const enriched = txns.map((t) => ({
                    ...t,
                    name: categoryMap[String(t.category_id)] ?? String(t.category_id),
                }));
                setTransactions(enriched);
            })
            .catch((err) => setError(err.message))
            .finally(() => setLoading(false));
    }, [categories]);

    const filtered = transactions.filter((t) => {
        const matchesSearch =
            "".toLowerCase().includes(search.toLowerCase()) ||
            t.name.toLowerCase().includes(search.toLowerCase());
        const matchesCategory =
            filterCategory === "All" ||
            String(t.category_id) === filterCategory;
        return matchesSearch && matchesCategory;
    });

    const actionColumn = {
        key: "_actions",
        label: "Actions",
        headerClass: "text-right",
        className: "text-right",
        render: (row) => (
            <div className="flex items-center justify-end gap-2">
                <button
                    onClick={() => setEditingCategory({ id: row.category_id, name: row.name, description: row.description ?? '' })}
                    className="p-1.5 rounded-lg text-indigo-500 hover:bg-indigo-50 transition-colors"
                    title="Edit"
                >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                    </svg>
                </button>
                <button
                    onClick={() => handleDeleteCategory(row)}
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

    if (loading)
        return <div className="text-sm text-gray-400 py-12 text-center">Loading…</div>;
    if (error)
        return <div className="text-sm text-red-500 py-12 text-center">{error}</div>;

    return (
        <div>
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
                <h2 className="text-2xl font-bold text-gray-800">Categories</h2>
                <button
                    onClick={() => setShowModal(true)}
                    className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white text-sm font-medium rounded-lg hover:bg-indigo-700 transition-colors"
                >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
                    </svg>
                    Add Category
                </button>
            </div>

            <div className="flex flex-col sm:flex-row gap-3 mb-4">
                <div className="relative flex-1">
                    <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-4.35-4.35M17 11A6 6 0 1 1 5 11a6 6 0 0 1 12 0z" />
                    </svg>
                    <input
                        type="text"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        placeholder="Search categories..."
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
                        <option key={c.id} value={c.id}>{c.name}</option>
                    ))}
                </select>
            </div>

            <Table
                columns={[
                    {
                        key: "category",
                        label: "Category",
                        render: (t) => (
                            <button
                                onClick={() => onCategoryClick({ id: t.category_id, name: t.name })}
                                className="inline-block px-2 py-0.5 rounded-full text-xs bg-indigo-50 text-indigo-600 font-medium hover:bg-indigo-100 transition-colors cursor-pointer"
                            >
                                {t.name}
                            </button>
                        ),
                    },
                    {
                        key: "description",
                        label: "Description",
                        className: "text-gray-800 font-medium",
                    },
                    {
                        key: "amount",
                        label: "Amount",
                        headerClass: "text-right",
                        className: "text-right font-semibold whitespace-nowrap",
                        render: (t) => (
                            <span className={t.type === "income" ? "text-green-600" : "text-red-500"}>
                                {t.type === "income" ? "+" : "-"}{CURRENCY}
                                {t.amount ? t.amount.toFixed(2) : "0.00"}
                            </span>
                        ),
                    },
                    actionColumn,
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
            {editingCategory && (
                <AddCategoryModal
                    categories={categories}
                    initialData={editingCategory}
                    onEdit={handleEditCategory}
                    onClose={() => setEditingCategory(null)}
                />
            )}
        </div>
    );
}

export default Categories;

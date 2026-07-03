import { useState, useEffect } from "react";
import { toast } from "react-toastify";
import { post, get } from "../api/client";
import Input from './Input'
import { CURRENCY } from '../constants'

export default function AddTransactionModal({
    subCategories,  // pre-loaded (SubCategories page)
    category,       // pre-selected category object (SubCategories page)
    categories,     // all categories array (Transactions page — shows category select)
    initialData,    // transaction object to edit (optional)
    onAdd,
    onEdit,
    onClose,
}) {
    const isEditing = !!initialData
    const isCategoriesMode = Boolean(categories);

    const [categoryId, setCategoryId] = useState(
        initialData?.user_category ?? initialData?.category_id ?? category?.id ?? categories?.[0]?.id ?? ""
    );
    const [activeCategoryName, setActiveCategoryName] = useState(
        initialData?.category ?? category?.name ?? categories?.[0]?.name ?? ""
    );
    const [activeSubCats, setActiveSubCats] = useState(subCategories ?? []);
    const [subCatsLoading, setSubCatsLoading] = useState(false);

    const isEmi = activeCategoryName.toLowerCase() === "emi";

    useEffect(() => {
        if (!isCategoriesMode || !categoryId) return;
        setSubCatsLoading(true);
        get(`/api/subcategories/${categoryId}/sub-categories/`)
            .then((data) => {
                setActiveSubCats(data);
                if (!isEditing) {
                    setForm((prev) => ({ ...prev, subCategoryId: data[0]?.id ?? "" }));
                }
            })
            .catch(() => setActiveSubCats([]))
            .finally(() => setSubCatsLoading(false));
    }, [categoryId, isCategoriesMode]);

    const [form, setForm] = useState({
        subCategoryId: initialData?.sub_category_id ?? initialData?.sub_category ?? (subCategories ?? [])[0]?.id ?? "",
        transactionWith: initialData?.transaction_with ?? "",
        description: initialData?.sub_category_description ?? initialData?.description ?? "",
        type: initialData?.transaction_type?.toUpperCase() ?? "DEBIT",
        amount: initialData?.amount ? String(initialData.amount) : "",
        date: initialData?.date ?? new Date().toISOString().slice(0, 10),
        emiDuration: "",
        emiDeductionDate: "",
    });
    const [errors, setErrors] = useState({});
    const [loading, setLoading] = useState(false);

    function handleCategoryChange(e) {
        const id = e.target.value;
        const cat = categories.find((c) => String(c.id) === id);
        setCategoryId(id);
        setActiveCategoryName(cat?.name ?? "");
    }

    function validate() {
        const e = {};
        if (!form.subCategoryId) e.subCategoryId = "Required.";
        if (!form.transactionWith.trim()) e.transactionWith = "Required.";
        if (!form.amount || isNaN(Number(form.amount)) || Number(form.amount) <= 0)
            e.amount = "Enter a valid amount.";
        if (!form.date) e.date = "Required.";
        if (isEmi && !isEditing) {
            if (!form.emiDuration || isNaN(Number(form.emiDuration)) || Number(form.emiDuration) < 1)
                e.emiDuration = "Enter a valid duration.";
            if (!form.emiDeductionDate) e.emiDeductionDate = "Required.";
        }
        return e;
    }

    async function handleSubmit(e) {
        e.preventDefault();
        const e2 = validate();
        if (Object.keys(e2).length) return setErrors(e2);
        setLoading(true);
        try {
            const body = {
                user_category: categoryId,
                sub_category: form.subCategoryId,
                transaction_type: form.type,
                description: form.description,
                transaction_with: form.transactionWith,
                amount: parseFloat(form.amount),
                date: form.date,
            };
            if (isEditing) {
                const updated = await post(`/api/transactions/transaction/${initialData.id}/update/`, body);
                onEdit(updated);
                toast.success("Transaction updated.");
            } else {
                if (isEmi) {
                    body.emi_frequency = "MONTHLY";
                    body.emi_period = parseInt(form.emiDuration, 10);
                    body.emi_amount = parseFloat(form.amount);
                    body.emi_start_date = form.emiDeductionDate;
                }
                const created = await post("/api/transactions/transaction/", body);
                onAdd(created);
                toast.success("Transaction added.");
            }
            onClose();
        } catch (err) {
            toast.error(err.message || `Failed to ${isEditing ? 'update' : 'add'} transaction.`);
        } finally {
            setLoading(false);
        }
    }

    function field(key, value) {
        setForm((prev) => ({ ...prev, [key]: value }));
        setErrors((prev) => ({ ...prev, [key]: undefined }));
    }

    return (
        <div className="fixed inset-0 lg:left-64 z-50 flex items-start justify-center bg-black/40 px-4 pt-20 pb-8">
            <div className="bg-white rounded-xl shadow-xl w-full max-w-md flex flex-col max-h-[calc(100vh-7rem)]">
                <div className="px-6 pt-6 pb-4 border-b border-gray-100 shrink-0">
                    <h3 className="text-lg font-semibold text-gray-800">
                        {isEditing ? 'Edit Transaction' : 'Add Transaction'}
                    </h3>
                </div>
                <div className="overflow-y-auto flex-1 px-6 py-4">
                    <form id="add-tx-form" onSubmit={handleSubmit} className="space-y-4">

                        {isCategoriesMode && (
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                                <select
                                    value={categoryId}
                                    onChange={handleCategoryChange}
                                    className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                >
                                    {categories.map((c) => (
                                        <option key={c.id} value={c.id}>{c.name}</option>
                                    ))}
                                </select>
                            </div>
                        )}

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Sub-Category</label>
                            <select
                                value={form.subCategoryId}
                                onChange={(e) => field("subCategoryId", e.target.value)}
                                disabled={subCatsLoading || activeSubCats.length === 0}
                                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 disabled:opacity-60"
                            >
                                {subCatsLoading && <option value="">Loading…</option>}
                                {!subCatsLoading && activeSubCats.length === 0 && <option value="">No sub-categories</option>}
                                {activeSubCats.map((s) => (
                                    <option key={s.id} value={s.id}>{s.name}</option>
                                ))}
                            </select>
                            {errors.subCategoryId && <p className="text-xs text-red-500 mt-1">{errors.subCategoryId}</p>}
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                            <Input
                                value={form.description}
                                onChange={(e) => field("description", e.target.value)}
                                placeholder="e.g. Weekly grocery run"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Transaction To</label>
                            <Input
                                value={form.transactionWith}
                                onChange={(e) => field("transactionWith", e.target.value)}
                                placeholder="e.g. Walmart"
                            />
                            {errors.transactionWith && <p className="text-xs text-red-500 mt-1">{errors.transactionWith}</p>}
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Type</label>
                                <select
                                    value={form.type}
                                    onChange={(e) => field("type", e.target.value)}
                                    className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                >
                                    <option value="CREDIT">Credit</option>
                                    <option value="DEBIT">Debit</option>
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Amount ({CURRENCY})</label>
                                <Input
                                    type="text"
                                    inputMode="decimal"
                                    value={form.amount}
                                    onChange={(e) => field("amount", e.target.value)}
                                    placeholder="0.00"
                                />
                                {errors.amount && <p className="text-xs text-red-500 mt-1">{errors.amount}</p>}
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Date</label>
                            <Input
                                type="date"
                                value={form.date}
                                onChange={(e) => field("date", e.target.value)}
                            />
                            {errors.date && <p className="text-xs text-red-500 mt-1">{errors.date}</p>}
                        </div>

                        {isEmi && !isEditing && (
                            <div className="rounded-lg border border-indigo-100 bg-indigo-50 p-4 space-y-4">
                                <p className="text-xs font-semibold text-indigo-500 uppercase tracking-wide">EMI Details</p>
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Duration (months)</label>
                                        <Input
                                            type="text"
                                            inputMode="numeric"
                                            value={form.emiDuration}
                                            onChange={(e) => field("emiDuration", e.target.value)}
                                            placeholder="e.g. 12"
                                        />
                                        {errors.emiDuration && <p className="text-xs text-red-500 mt-1">{errors.emiDuration}</p>}
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Start Date</label>
                                        <Input
                                            type="date"
                                            value={form.emiDeductionDate}
                                            onChange={(e) => field("emiDeductionDate", e.target.value)}
                                        />
                                        {errors.emiDeductionDate && <p className="text-xs text-red-500 mt-1">{errors.emiDeductionDate}</p>}
                                    </div>
                                </div>
                            </div>
                        )}
                    </form>
                </div>
                <div className="px-6 py-4 border-t border-gray-100 flex gap-3 justify-end shrink-0">
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
                        form="add-tx-form"
                        disabled={loading || subCatsLoading}
                        className="px-4 py-2 text-sm rounded-lg bg-indigo-600 text-white hover:bg-indigo-700 transition-colors disabled:opacity-60"
                    >
                        {loading ? (isEditing ? 'Saving…' : 'Adding…') : (isEditing ? 'Save' : 'Add')}
                    </button>
                </div>
            </div>
        </div>
    );
}

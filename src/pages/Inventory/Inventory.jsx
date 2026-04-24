import { productsData } from "../../data/mockData";
import { Edit, Search, X } from "lucide-react";
import { useEffect, useMemo, useState } from "react";

export default function Inventory() {
    const [items, setItems] = useState(productsData);
    const [search, setSearch] = useState("");
    const [statusFilter, setStatusFilter] = useState("All");

    const [modalOpen, setModalOpen] = useState(false);
    const [selectedItem, setSelectedItem] = useState(null);

    const [form, setForm] = useState({
        stock: "",
        reorder_level: "",
    });

    // ================= PAGINATION =================
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 5;

    // ================= FILTER =================
    const filteredItems = useMemo(() => {
        const keyword = search.toLowerCase();

        return items.filter((item) => {
            const matchesSearch =
                item.name.toLowerCase().includes(keyword) ||
                item.category.toLowerCase().includes(keyword);

            const status = getStockLabel(item);

            const matchesStatus =
                statusFilter === "All" || statusFilter === status;

            return matchesSearch && matchesStatus;
        });
    }, [items, search, statusFilter]);

    // ================= PAGINATED =================
    const totalPages = Math.ceil(filteredItems.length / itemsPerPage);

    const paginatedItems = filteredItems.slice(
        (currentPage - 1) * itemsPerPage,
        currentPage * itemsPerPage
    );

    // reset page kapag nag filter/search
    useEffect(() => {
        setCurrentPage(1);
    }, [search, statusFilter]);

    // ================= SUMMARY =================
    const totalStock = items.reduce((sum, item) => sum + item.stock, 0);
    const lowStock = items.filter(
        (item) => item.stock > 0 && item.stock <= item.reorder_level
    ).length;
    const outStock = items.filter((item) => item.stock === 0).length;

    // ================= ACTIONS =================
    const openModal = (item) => {
        setSelectedItem(item);
        setForm({
            stock: String(item.stock),
            reorder_level: String(item.reorder_level),
        });
        setModalOpen(true);
    };

    const closeModal = () => {
        setModalOpen(false);
        setSelectedItem(null);
    };

    const handleSave = (e) => {
        e.preventDefault();

        setItems((prev) =>
            prev.map((item) =>
                item.id === selectedItem.id
                    ? {
                        ...item,
                        stock: Number(form.stock),
                        reorder_level: Number(form.reorder_level),
                    }
                    : item
            )
        );

        closeModal();
    };

    return (
        <div className="space-y-4 sm:space-y-6">

            {/* HEADER */}
            <div>
                <h1 className="text-2xl font-bold dark:text-white">Inventory</h1>
                <p className="text-sm text-slate-500 dark:text-slate-400">
                    Monitor stock levels and reorder points
                </p>
            </div>

            {/* CARDS */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <Card title="Total Stock" value={totalStock} />
                <Card title="Low Stock" value={lowStock} warning />
                <Card title="Out of Stock" value={outStock} danger />
            </div>

            {/* TABLE */}
            <div className="bg-white dark:bg-slate-900 border dark:border-slate-800 rounded-2xl p-4 sm:p-5">

                {/* SEARCH + FILTER */}
                <div className="flex flex-col gap-3 lg:flex-row lg:justify-between mb-4">
                    <div className="flex items-center gap-2 border rounded-xl px-3 py-2 dark:border-slate-700">
                        <Search size={16} />
                        <input
                            placeholder="Search..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            className="bg-transparent outline-none text-sm w-full"
                        />
                    </div>

                    <div className="flex flex-wrap gap-2">
                        {["All", "In Stock", "Low Stock", "Out of Stock"].map((s) => (
                            <button
                                key={s}
                                onClick={() => setStatusFilter(s)}
                                className={`px-3 py-1 text-xs rounded-lg ${statusFilter === s
                                    ? "bg-indigo-600 text-white"
                                    : "border dark:border-slate-700"
                                    }`}
                            >
                                {s}
                            </button>
                        ))}
                    </div>
                </div>

                {/* TABLE */}
                <div className="overflow-x-auto">
                    <table className="w-full min-w-[700px] text-xs sm:text-sm">
                        <thead>
                            <tr className="border-b dark:border-slate-800">
                                <th className="py-2 text-left">Product</th>
                                <th>Stock</th>
                                <th>Reorder</th>
                                <th>Status</th>
                                <th className="text-right">Action</th>
                            </tr>
                        </thead>

                        <tbody>
                            {paginatedItems.map((item) => (
                                <tr key={item.id} className="border-b dark:border-slate-800">
                                    <td className="py-2">
                                        <div className="flex items-center gap-2">
                                            <img
                                                src={item.image}
                                                className="h-8 w-8 sm:h-10 sm:w-10 rounded"
                                            />
                                            <span>{item.name}</span>
                                        </div>
                                    </td>

                                    <td>{item.stock}</td>
                                    <td>{item.reorder_level}</td>

                                    <td>
                                        <span className={`px-2 py-1 rounded text-xs ${getStockBadge(item)}`}>
                                            {getStockLabel(item)}
                                        </span>
                                    </td>

                                    <td className="text-right">
                                        <button onClick={() => openModal(item)}>
                                            <Edit size={16} />
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {/* PAGINATION */}
                <div className="mt-4 flex flex-col sm:flex-row justify-between items-center gap-2">
                    <span className="text-xs">
                        Page {currentPage} of {totalPages || 1}
                    </span>

                    <div className="flex gap-1 flex-wrap">
                        <button
                            disabled={currentPage === 1}
                            onClick={() => setCurrentPage((p) => p - 1)}
                            className="px-2 py-1 border rounded disabled:opacity-50"
                        >
                            Prev
                        </button>

                        {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
                            <button
                                key={p}
                                onClick={() => setCurrentPage(p)}
                                className={`px-2 py-1 rounded ${p === currentPage ? "bg-indigo-600 text-white" : "border"
                                    }`}
                            >
                                {p}
                            </button>
                        ))}

                        <button
                            disabled={currentPage === totalPages}
                            onClick={() => setCurrentPage((p) => p + 1)}
                            className="px-2 py-1 border rounded disabled:opacity-50"
                        >
                            Next
                        </button>
                    </div>
                </div>
            </div>

            {/* MODAL */}
            {modalOpen && selectedItem && (
                <div className="fixed inset-0 flex items-center justify-center bg-black/40">
                    <form
                        onSubmit={handleSave}
                        className="bg-white dark:bg-slate-900 p-4 rounded-xl w-full max-w-sm"
                    >
                        <h2 className="mb-3 font-bold">Adjust Inventory</h2>

                        <input
                            type="number"
                            value={form.stock}
                            onChange={(e) =>
                                setForm((p) => ({ ...p, stock: e.target.value }))
                            }
                            className="w-full mb-2 border p-2 rounded"
                            placeholder="Stock"
                        />

                        <input
                            type="number"
                            value={form.reorder_level}
                            onChange={(e) =>
                                setForm((p) => ({ ...p, reorder_level: e.target.value }))
                            }
                            className="w-full mb-3 border p-2 rounded"
                            placeholder="Reorder Level"
                        />

                        <div className="flex justify-end gap-2">
                            <button onClick={closeModal}>Cancel</button>
                            <button className="bg-indigo-600 text-white px-3 py-1 rounded">
                                Save
                            </button>
                        </div>
                    </form>
                </div>
            )}
        </div>
    );
}

// ================= HELPERS =================

function Card({ title, value, warning, danger }) {
    return (
        <div className="bg-white dark:bg-slate-900 border dark:border-slate-800 p-4 rounded-xl">
            <p className="text-sm text-slate-500">{title}</p>
            <h2
                className={`text-2xl font-bold ${danger
                    ? "text-red-500"
                    : warning
                        ? "text-yellow-500"
                        : "text-black dark:text-white"
                    }`}
            >
                {value}
            </h2>
        </div>
    );
}

function getStockLabel(item) {
    if (item.stock === 0) return "Out of Stock";
    if (item.stock <= item.reorder_level) return "Low Stock";
    return "In Stock";
}

function getStockBadge(item) {
    if (item.stock === 0) return "bg-red-100 text-red-600";
    if (item.stock <= item.reorder_level) return "bg-yellow-100 text-yellow-600";
    return "bg-green-100 text-green-600";
}
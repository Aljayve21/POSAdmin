import { productsData } from "../../data/mockData";
import { Edit, Plus, Search, Trash2, X } from "lucide-react";
import { useMemo, useState } from "react";

const emptyForm = {
    name: "",
    category: "",
    price: "",
    image: "",
    stock: "",
    reorder_level: "",
};

export default function Products() {
    const [products, setProducts] = useState(productsData);
    const [search, setSearch] = useState("");

    const [modalOpen, setModalOpen] = useState(false);
    const [editingProduct, setEditingProduct] = useState(null);
    const [form, setForm] = useState(emptyForm);

    // FILTER
    const filteredProducts = useMemo(() => {
        return products.filter(
            (p) =>
                p.name.toLowerCase().includes(search.toLowerCase()) ||
                p.category.toLowerCase().includes(search.toLowerCase())
        );
    }, [products, search]);

    // OPEN ADD
    const openAddModal = () => {
        setEditingProduct(null);
        setForm(emptyForm);
        setModalOpen(true);
    };

    // OPEN EDIT
    const openEditModal = (product) => {
        setEditingProduct(product);
        setForm(product);
        setModalOpen(true);
    };

    // CLOSE
    const closeModal = () => {
        setModalOpen(false);
        setEditingProduct(null);
        setForm(emptyForm);
    };

    // HANDLE INPUT
    const handleChange = (field, value) => {
        setForm((prev) => ({ ...prev, [field]: value }));
    };

    // SAVE
    const handleSave = (e) => {
        e.preventDefault();

        if (!form.name) return;

        if (editingProduct) {
            setProducts((prev) =>
                prev.map((p) =>
                    p.id === editingProduct.id ? { ...p, ...form } : p
                )
            );
        } else {
            setProducts((prev) => [
                {
                    id: Date.now(),
                    ...form,
                    price: Number(form.price),
                    stock: Number(form.stock),
                    reorder_level: Number(form.reorder_level),
                },
                ...prev,
            ]);
        }

        closeModal();
    };

    // DELETE
    const handleDelete = (id) => {
        if (!confirm("Delete product?")) return;
        setProducts((prev) => prev.filter((p) => p.id !== id));
    };

    return (
        <div className="space-y-4 sm:space-y-6">

            {/* HEADER */}
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-2xl font-bold dark:text-white">Products</h1>
                    <p className="text-sm text-slate-500">Manage your products</p>
                </div>

                <button
                    onClick={openAddModal}
                    className="bg-indigo-600 text-white px-4 py-2 rounded-xl flex gap-2 items-center"
                >
                    <Plus size={16} />
                    Add Product
                </button>
            </div>

            {/* SEARCH */}
            <div className="flex items-center gap-2 border px-3 py-2 rounded-xl dark:border-slate-700">
                <Search size={16} />
                <input
                    placeholder="Search..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="w-full bg-transparent outline-none text-sm"
                />
            </div>

            {/* TABLE */}
            <div className="bg-white dark:bg-slate-900 border dark:border-slate-800 p-4 rounded-xl">
                <div className="overflow-x-auto">
                    <table className="w-full min-w-[700px] text-xs sm:text-sm">
                        <thead>
                            <tr className="border-b dark:border-slate-800">
                                <th className="py-2 text-left">Product</th>
                                <th>Category</th>
                                <th>Price</th>
                                <th>Stock</th>
                                <th className="text-right">Action</th>
                            </tr>
                        </thead>

                        <tbody>
                            {filteredProducts.map((p) => (
                                <tr key={p.id} className="border-b dark:border-slate-800">
                                    <td className="py-2">
                                        <div className="flex items-center gap-2">
                                            <img
                                                src={p.image || "https://via.placeholder.com/80"}
                                                className="h-10 w-10 rounded object-cover"
                                            />
                                            {p.name}
                                        </div>
                                    </td>
                                    <td>{p.category}</td>
                                    <td>₱{p.price}</td>
                                    <td>{p.stock}</td>

                                    <td className="text-right">
                                        <div className="flex justify-end gap-1">
                                            <button onClick={() => openEditModal(p)}>
                                                <Edit size={16} />
                                            </button>
                                            <button onClick={() => handleDelete(p.id)}>
                                                <Trash2 size={16} />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* MODAL */}
            {modalOpen && (
                <ProductModal
                    form={form}
                    onChange={handleChange}
                    onClose={closeModal}
                    onSave={handleSave}
                    editing={editingProduct}
                />
            )}
        </div>
    );
}

// ================= MODAL =================

function ProductModal({ form, onChange, onClose, onSave, editing }) {

    const handleImageUpload = (e) => {
        const file = e.target.files[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onloadend = () => {
            onChange("image", reader.result);
        };
        reader.readAsDataURL(file);
    };

    return (
        <div className="fixed inset-0 flex items-center justify-center bg-black/40 px-3">
            <form
                onSubmit={onSave}
                className="bg-white dark:bg-slate-900 p-4 rounded-xl w-full max-w-md space-y-3"
            >
                <div className="flex justify-between">
                    <h2 className="font-bold">
                        {editing ? "Edit Product" : "Add Product"}
                    </h2>
                    <button onClick={onClose}>
                        <X size={16} />
                    </button>
                </div>

                <input
                    placeholder="Product Name"
                    value={form.name}
                    onChange={(e) => onChange("name", e.target.value)}
                    className="w-full border p-2 rounded"
                />

                <input
                    placeholder="Category"
                    value={form.category}
                    onChange={(e) => onChange("category", e.target.value)}
                    className="w-full border p-2 rounded"
                />

                <input
                    type="number"
                    placeholder="Price"
                    value={form.price}
                    onChange={(e) => onChange("price", e.target.value)}
                    className="w-full border p-2 rounded"
                />

                <input
                    type="number"
                    placeholder="Stock"
                    value={form.stock}
                    onChange={(e) => onChange("stock", e.target.value)}
                    className="w-full border p-2 rounded"
                />

                <input
                    type="number"
                    placeholder="Reorder Level"
                    value={form.reorder_level}
                    onChange={(e) => onChange("reorder_level", e.target.value)}
                    className="w-full border p-2 rounded"
                />

                {/* IMAGE UPLOAD */}
                <div>
                    <label className="text-sm font-semibold">Product Image</label>

                    <input
                        type="file"
                        accept="image/*"
                        onChange={handleImageUpload}
                        className="mt-2 w-full text-sm"
                    />

                    {form.image && (
                        <img
                            src={form.image}
                            className="mt-2 h-20 w-20 object-cover rounded"
                        />
                    )}
                </div>

                <div className="flex justify-end gap-2">
                    <button onClick={onClose}>Cancel</button>
                    <button className="bg-indigo-600 text-white px-3 py-1 rounded">
                        Save
                    </button>
                </div>
            </form>
        </div>
    );
}
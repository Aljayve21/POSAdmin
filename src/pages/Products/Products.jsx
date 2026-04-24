import api from "../../api/axios";
import { Edit, Plus, Search, Trash2, X } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import toast from "react-hot-toast";

const emptyForm = {
    name: "",
    category: "",
    price: "",
    image_path: "",
    stock: "",
    reorder_level: "",
};

export default function Products() {
    const [products, setProducts] = useState([]);
    const [search, setSearch] = useState("");
    const [loading, setLoading] = useState(true);

    const [modalOpen, setModalOpen] = useState(false);
    const [editingProduct, setEditingProduct] = useState(null);
    const [form, setForm] = useState(emptyForm);

    useEffect(() => {
        fetchProducts();
    }, []);

    const fetchProducts = async () => {
        try {
            const res = await api.get("/products");
            setProducts(res.data);
        } catch (err) {
            console.error(err);
            toast.error("Failed to load products");
        } finally {
            setLoading(false);
        }
    };

    const filteredProducts = useMemo(() => {
        return products.filter((p) => {
            const name = p.name || "";
            const category = p.category || "";

            return (
                name.toLowerCase().includes(search.toLowerCase()) ||
                category.toLowerCase().includes(search.toLowerCase())
            );
        });
    }, [products, search]);

    const openAddModal = () => {
        setEditingProduct(null);
        setForm(emptyForm);
        setModalOpen(true);
    };

    const openEditModal = (product) => {
        setEditingProduct(product);
        setForm({
            name: product.name || "",
            category: product.category || "",
            price: product.price || "",
            image_path: product.image_path || "",
            stock: product.stock || "",
            reorder_level: product.reorder_level || "",
        });
        setModalOpen(true);
    };

    const closeModal = () => {
        setModalOpen(false);
        setEditingProduct(null);
        setForm(emptyForm);
    };

    const handleChange = (field, value) => {
        setForm((prev) => ({ ...prev, [field]: value }));
    };

    const handleSave = async (e) => {
        e.preventDefault();

        if (!form.name.trim()) {
            toast.error("Product name is required");
            return;
        }

        if (!form.category.trim()) {
            toast.error("Category is required");
            return;
        }

        const loadingToast = toast.loading(
            editingProduct ? "Updating product..." : "Adding product..."
        );

        try {
            const payload = {
                name: form.name,
                category: form.category,
                price: Number(form.price || 0),
                image_path: form.image_path,
                stock: Number(form.stock || 0),
                reorder_level: Number(form.reorder_level || 0),
            };

            if (editingProduct) {
                await api.put(`/products/${editingProduct.id}`, payload);
                toast.success("Product updated successfully", { id: loadingToast });
            } else {
                await api.post("/products", payload);
                toast.success("Product added successfully", { id: loadingToast });
            }

            await fetchProducts();
            closeModal();
        } catch (err) {
            console.error(err);
            toast.error(err.response?.data?.error || "Something went wrong", {
                id: loadingToast,
            });
        }
    };

    const handleDelete = async (id) => {
        if (!confirm("Delete product?")) return;

        const loadingToast = toast.loading("Deleting product...");

        try {
            await api.delete(`/products/${id}`);
            toast.success("Product deleted successfully", { id: loadingToast });
            await fetchProducts();
        } catch (err) {
            console.error(err);
            toast.error(err.response?.data?.error || "Delete failed", {
                id: loadingToast,
            });
        }
    };

    if (loading) return <p className="p-6">Loading products...</p>;

    return (
        <div className="space-y-4 sm:space-y-6">
            <div className="flex items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold dark:text-white">Products</h1>
                    <p className="text-sm text-slate-500">Manage your products</p>
                </div>

                <button
                    onClick={openAddModal}
                    className="flex items-center gap-2 rounded-xl bg-indigo-600 px-4 py-2 text-white"
                >
                    <Plus size={16} />
                    Add Product
                </button>
            </div>

            <div className="flex items-center gap-2 rounded-xl border px-3 py-2 dark:border-slate-700">
                <Search size={16} />
                <input
                    placeholder="Search..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="w-full bg-transparent text-sm outline-none"
                />
            </div>

            <div className="rounded-xl border bg-white p-4 dark:border-slate-800 dark:bg-slate-900">
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
                                                src={p.image_path || "https://via.placeholder.com/80"}
                                                className="h-10 w-10 rounded object-cover"
                                                alt={p.name}
                                            />
                                            {p.name}
                                        </div>
                                    </td>
                                    <td>{p.category}</td>
                                    <td>₱{Number(p.price || 0).toLocaleString()}</td>
                                    <td>{p.stock}</td>

                                    <td className="text-right">
                                        <div className="flex justify-end gap-2">
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

                            {filteredProducts.length === 0 && (
                                <tr>
                                    <td colSpan="5" className="py-6 text-center text-slate-500">
                                        No products found.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

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

function ProductModal({ form, onChange, onClose, onSave, editing }) {
    const handleImageUpload = (e) => {
        const file = e.target.files[0];
        if (!file) return;

        const reader = new FileReader();

        reader.onloadend = () => {
            onChange("image_path", reader.result);
        };

        reader.readAsDataURL(file);
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-black/40 px-3 py-4">
            <form
                onSubmit={onSave}
                className="w-full max-w-md space-y-3 rounded-xl bg-white p-4 dark:bg-slate-900"
            >
                <div className="flex justify-between">
                    <h2 className="font-bold dark:text-white">
                        {editing ? "Edit Product" : "Add Product"}
                    </h2>

                    <button type="button" onClick={onClose}>
                        <X size={16} />
                    </button>
                </div>

                <input
                    placeholder="Product Name"
                    value={form.name}
                    onChange={(e) => onChange("name", e.target.value)}
                    className="w-full rounded border p-2 dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                />

                <input
                    placeholder="Category"
                    value={form.category}
                    onChange={(e) => onChange("category", e.target.value)}
                    className="w-full rounded border p-2 dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                />

                <input
                    type="number"
                    placeholder="Price"
                    value={form.price}
                    onChange={(e) => onChange("price", e.target.value)}
                    className="w-full rounded border p-2 dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                />

                <input
                    type="number"
                    placeholder="Stock"
                    value={form.stock}
                    onChange={(e) => onChange("stock", e.target.value)}
                    className="w-full rounded border p-2 dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                />

                <input
                    type="number"
                    placeholder="Reorder Level"
                    value={form.reorder_level}
                    onChange={(e) => onChange("reorder_level", e.target.value)}
                    className="w-full rounded border p-2 dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                />

                <div>
                    <label className="text-sm font-semibold dark:text-white">
                        Product Image
                    </label>

                    <input
                        type="file"
                        accept="image/*"
                        onChange={handleImageUpload}
                        className="mt-2 w-full text-sm dark:text-white"
                    />

                    {form.image_path && (
                        <img
                            src={form.image_path}
                            className="mt-2 h-20 w-20 rounded object-cover"
                            alt="Preview"
                        />
                    )}
                </div>

                <div className="flex justify-end gap-2">
                    <button type="button" onClick={onClose}>
                        Cancel
                    </button>

                    <button className="rounded bg-indigo-600 px-3 py-1 text-white">
                        Save
                    </button>
                </div>
            </form>
        </div>
    );
}
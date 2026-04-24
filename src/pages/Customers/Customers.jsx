import { customersData } from "../../data/mockData";
import { Edit, Plus, Search, Trash2, X } from "lucide-react";
import { useMemo, useState } from "react";

const emptyForm = {
    name: "",
    phone: "",
};

export default function Customers() {
    const [customers, setCustomers] = useState(customersData);
    const [search, setSearch] = useState("");

    const [modalOpen, setModalOpen] = useState(false);
    const [editing, setEditing] = useState(null);
    const [form, setForm] = useState(emptyForm);

    // FILTER
    const filtered = useMemo(() => {
        return customers.filter((c) =>
            c.name.toLowerCase().includes(search.toLowerCase())
        );
    }, [customers, search]);

    // ACTIONS
    const openAdd = () => {
        setEditing(null);
        setForm(emptyForm);
        setModalOpen(true);
    };

    const openEdit = (c) => {
        setEditing(c);
        setForm({ name: c.name, phone: c.phone });
        setModalOpen(true);
    };

    const close = () => {
        setModalOpen(false);
        setEditing(null);
    };

    const save = (e) => {
        e.preventDefault();

        if (!form.name) return;

        if (editing) {
            setCustomers((prev) =>
                prev.map((c) =>
                    c.id === editing.id ? { ...c, ...form } : c
                )
            );
        } else {
            setCustomers((prev) => [
                {
                    id: Date.now(),
                    ...form,
                    total_transactions: 0,
                    total_utang: 0,
                },
                ...prev,
            ]);
        }

        close();
    };

    const remove = (id) => {
        if (!confirm("Delete this customer?")) return;
        setCustomers((prev) => prev.filter((c) => c.id !== id));
    };

    return (
        <div className="space-y-4 sm:space-y-6">

            {/* HEADER */}
            <div className="flex flex-col sm:flex-row justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold dark:text-white">
                        Customers
                    </h1>
                    <p className="text-sm text-slate-500">
                        Manage your customers and utang records
                    </p>
                </div>

                <button
                    onClick={openAdd}
                    className="bg-indigo-600 text-white px-4 py-2 rounded-xl flex items-center gap-2"
                >
                    <Plus size={16} />
                    Add Customer
                </button>
            </div>

            {/* SEARCH */}
            <div className="flex items-center gap-2 border px-3 py-2 rounded-xl dark:border-slate-700">
                <Search size={16} />
                <input
                    placeholder="Search customer..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="w-full bg-transparent outline-none text-sm"
                />
            </div>

            {/* TABLE */}
            <div className="bg-white dark:bg-slate-900 rounded-2xl border dark:border-slate-800 p-4">
                <div className="overflow-x-auto">
                    <table className="w-full min-w-[600px] text-xs sm:text-sm">
                        <thead>
                            <tr className="border-b dark:border-slate-800">
                                <th className="py-2 text-left">Name</th>
                                <th>Phone</th>
                                <th>Transactions</th>
                                <th>Utang</th>
                                <th className="text-right">Action</th>
                            </tr>
                        </thead>

                        <tbody>
                            {filtered.map((c) => (
                                <tr key={c.id} className="border-b dark:border-slate-800">
                                    <td className="py-2">{c.name}</td>
                                    <td>{c.phone}</td>
                                    <td>{c.total_transactions}</td>

                                    <td>
                                        <span
                                            className={`px-2 py-1 rounded text-xs ${c.total_utang > 0
                                                ? "bg-red-100 text-red-600"
                                                : "bg-green-100 text-green-600"
                                                }`}
                                        >
                                            ₱{c.total_utang}
                                        </span>
                                    </td>

                                    <td className="text-right">
                                        <div className="flex justify-end gap-1">
                                            <button onClick={() => openEdit(c)}>
                                                <Edit size={16} />
                                            </button>
                                            <button onClick={() => remove(c.id)}>
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
                <div className="fixed inset-0 flex items-center justify-center bg-black/40 px-3">
                    <form
                        onSubmit={save}
                        className="bg-white dark:bg-slate-900 p-4 rounded-xl w-full max-w-sm"
                    >
                        <div className="flex justify-between mb-3">
                            <h2 className="font-bold">
                                {editing ? "Edit" : "Add"} Customer
                            </h2>
                            <button onClick={close}>
                                <X size={16} />
                            </button>
                        </div>

                        <input
                            value={form.name}
                            onChange={(e) =>
                                setForm((p) => ({ ...p, name: e.target.value }))
                            }
                            placeholder="Name"
                            className="w-full mb-2 border p-2 rounded"
                        />

                        <input
                            value={form.phone}
                            onChange={(e) =>
                                setForm((p) => ({ ...p, phone: e.target.value }))
                            }
                            placeholder="Phone"
                            className="w-full mb-3 border p-2 rounded"
                        />

                        <div className="flex justify-end gap-2">
                            <button onClick={close}>Cancel</button>
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
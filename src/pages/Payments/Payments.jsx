import { paymentsData } from "../../data/mockData";
import { Plus, Search, X } from "lucide-react";
import { useMemo, useState } from "react";

export default function Payments() {
    const [payments, setPayments] = useState(paymentsData);
    const [search, setSearch] = useState("");
    const [status, setStatus] = useState("All");

    const [modalOpen, setModalOpen] = useState(false);
    const [form, setForm] = useState({
        customer_name: "",
        amount: "",
        payment_method: "Cash",
    });

    // FILTER
    const filtered = useMemo(() => {
        return payments.filter((p) => {
            const matchSearch = p.customer_name
                .toLowerCase()
                .includes(search.toLowerCase());

            const matchStatus =
                status === "All" || p.status === status;

            return matchSearch && matchStatus;
        });
    }, [payments, search, status]);

    const total = filtered.reduce((sum, p) => sum + p.amount, 0);

    // ADD PAYMENT
    const addPayment = (e) => {
        e.preventDefault();

        setPayments((prev) => [
            {
                id: Date.now(),
                ...form,
                amount: Number(form.amount),
                status: "Paid",
                created_at: new Date().toISOString().slice(0, 10),
            },
            ...prev,
        ]);

        setModalOpen(false);
        setForm({
            customer_name: "",
            amount: "",
            payment_method: "Cash",
        });
    };

    return (
        <div className="space-y-4 sm:space-y-6">

            {/* HEADER */}
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-2xl font-bold dark:text-white">Payments</h1>
                    <p className="text-sm text-slate-500">
                        Manage all payment records
                    </p>
                </div>

                <button
                    onClick={() => setModalOpen(true)}
                    className="bg-indigo-600 text-white px-4 py-2 rounded-xl flex gap-2 items-center"
                >
                    <Plus size={16} />
                    Add Payment
                </button>
            </div>

            {/* SUMMARY */}
            <div className="bg-white dark:bg-slate-900 border dark:border-slate-800 p-4 rounded-xl">
                <p className="text-sm text-slate-500">Total Payments</p>
                <h2 className="text-2xl font-bold">
                    ₱{total.toLocaleString()}
                </h2>
            </div>

            {/* SEARCH + FILTER */}
            <div className="flex flex-col sm:flex-row gap-3 justify-between">
                <div className="flex items-center gap-2 border px-3 py-2 rounded-xl dark:border-slate-700">
                    <Search size={16} />
                    <input
                        placeholder="Search customer..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="bg-transparent outline-none text-sm w-full"
                    />
                </div>

                <div className="flex gap-2 flex-wrap">
                    {["All", "Paid", "Pending"].map((s) => (
                        <button
                            key={s}
                            onClick={() => setStatus(s)}
                            className={`px-3 py-1 text-xs rounded ${status === s
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
            <div className="bg-white dark:bg-slate-900 border dark:border-slate-800 rounded-xl p-4">
                <div className="overflow-x-auto">
                    <table className="w-full min-w-[650px] text-xs sm:text-sm">
                        <thead>
                            <tr className="border-b dark:border-slate-800">
                                <th className="py-2 text-left">Customer</th>
                                <th>Amount</th>
                                <th>Method</th>
                                <th>Status</th>
                                <th>Date</th>
                            </tr>
                        </thead>

                        <tbody>
                            {filtered.map((p) => (
                                <tr key={p.id} className="border-b dark:border-slate-800">
                                    <td className="py-2">{p.customer_name}</td>
                                    <td>₱{p.amount}</td>
                                    <td>{p.payment_method}</td>

                                    <td>
                                        <span
                                            className={`px-2 py-1 rounded text-xs ${p.status === "Paid"
                                                    ? "bg-green-100 text-green-600"
                                                    : "bg-yellow-100 text-yellow-600"
                                                }`}
                                        >
                                            {p.status}
                                        </span>
                                    </td>

                                    <td>{p.created_at}</td>
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
                        onSubmit={addPayment}
                        className="bg-white dark:bg-slate-900 p-4 rounded-xl w-full max-w-sm"
                    >
                        <h2 className="mb-3 font-bold">Add Payment</h2>

                        <input
                            value={form.customer_name}
                            onChange={(e) =>
                                setForm((p) => ({ ...p, customer_name: e.target.value }))
                            }
                            placeholder="Customer Name"
                            className="w-full mb-2 border p-2 rounded"
                        />

                        <input
                            type="number"
                            value={form.amount}
                            onChange={(e) =>
                                setForm((p) => ({ ...p, amount: e.target.value }))
                            }
                            placeholder="Amount"
                            className="w-full mb-2 border p-2 rounded"
                        />

                        <select
                            value={form.payment_method}
                            onChange={(e) =>
                                setForm((p) => ({
                                    ...p,
                                    payment_method: e.target.value,
                                }))
                            }
                            className="w-full mb-3 border p-2 rounded"
                        >
                            <option>Cash</option>
                            <option>GCash</option>
                        </select>

                        <div className="flex justify-end gap-2">
                            <button onClick={() => setModalOpen(false)}>
                                Cancel
                            </button>
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
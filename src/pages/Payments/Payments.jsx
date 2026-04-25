import api from "../../api/axios";
import { Plus, Search, X } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import toast from "react-hot-toast";

export default function Payments() {
    const [payments, setPayments] = useState([]);
    const [utangRecords, setUtangRecords] = useState([]);
    const [search, setSearch] = useState("");
    const [status, setStatus] = useState("All");
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [modalOpen, setModalOpen] = useState(false);
    const [form, setForm] = useState({
        utang_id: "",
        amount: "",
        payment_method: "Cash",
    });

    const fetchPayments = async () => {
        try {
            const res = await api.get("/payments");
            setPayments(res.data);
        } catch (error) {
            console.error(error);
            toast.error("Failed to load payments");
        } finally {
            setLoading(false);
        }
    };

    const fetchUtang = async () => {
        try {
            const res = await api.get("/utang");
            setUtangRecords(
                res.data.filter((item) => !item.is_paid && Number(item.amount || 0) > 0)
            );
        } catch (error) {
            console.error(error);
            toast.error("Failed to load unpaid balances");
        }
    };

    useEffect(() => {
        const loadData = async () => {
            await Promise.all([fetchPayments(), fetchUtang()]);
        };

        loadData();
    }, []);

    const filtered = useMemo(() => {
        return payments.filter((payment) => {
            const customerName = payment.customer_name || "";
            const matchesSearch = customerName.toLowerCase().includes(search.toLowerCase());
            const matchesStatus = status === "All" || payment.status === status;

            return matchesSearch && matchesStatus;
        });
    }, [payments, search, status]);

    const total = filtered.reduce(
        (sum, payment) => sum + Number(payment.amount || 0),
        0
    );

    const selectedUtang = useMemo(
        () => utangRecords.find((item) => String(item.id) === form.utang_id) || null,
        [utangRecords, form.utang_id]
    );

    const resetForm = () => {
        setForm({
            utang_id: "",
            amount: "",
            payment_method: "Cash",
        });
    };

    const addPayment = async (event) => {
        event.preventDefault();

        if (!form.utang_id) {
            toast.error("Select a customer balance first");
            return;
        }

        const amount = Number(form.amount || 0);

        if (amount <= 0) {
            toast.error("Payment amount must be greater than zero");
            return;
        }

        if (selectedUtang && amount > Number(selectedUtang.amount || 0)) {
            toast.error("Payment cannot exceed remaining balance");
            return;
        }

        try {
            setSaving(true);
            await api.post("/payments", {
                utang_id: Number(form.utang_id),
                amount,
                payment_method: form.payment_method,
            });

            toast.success("Payment saved");
            setModalOpen(false);
            resetForm();
            await Promise.all([fetchPayments(), fetchUtang()]);
        } catch (error) {
            console.error(error);
            toast.error(error.response?.data?.error || "Failed to save payment");
        } finally {
            setSaving(false);
        }
    };

    return (
        <div className="space-y-4 sm:space-y-6">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-2xl font-bold dark:text-white">Payments</h1>
                    <p className="text-sm text-slate-500">
                        Manage all collected payment records
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

            <div className="bg-white dark:bg-slate-900 border dark:border-slate-800 p-4 rounded-xl">
                <p className="text-sm text-slate-500">Total Payments</p>
                <h2 className="text-2xl font-bold dark:text-white">
                    PHP {total.toLocaleString()}
                </h2>
            </div>

            <div className="flex flex-col sm:flex-row gap-3 justify-between">
                <div className="flex items-center gap-2 border px-3 py-2 rounded-xl dark:border-slate-700">
                    <Search size={16} />
                    <input
                        placeholder="Search customer..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="bg-transparent outline-none text-sm w-full dark:text-white"
                    />
                </div>

                <div className="flex gap-2 flex-wrap">
                    {["All", "Paid", "Partial"].map((item) => (
                        <button
                            key={item}
                            onClick={() => setStatus(item)}
                            className={`px-3 py-1 text-xs rounded ${status === item
                                    ? "bg-indigo-600 text-white"
                                    : "border dark:border-slate-700 dark:text-white"
                                }`}
                        >
                            {item}
                        </button>
                    ))}
                </div>
            </div>

            <div className="bg-white dark:bg-slate-900 border dark:border-slate-800 rounded-xl p-4">
                {loading ? (
                    <p className="text-sm text-slate-500 dark:text-slate-400">
                        Loading payments...
                    </p>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full min-w-[850px] text-xs sm:text-sm">
                            <thead>
                                <tr className="border-b dark:border-slate-800">
                                    <th className="py-2 text-left">Customer</th>
                                    <th className="text-left">Amount</th>
                                    <th className="text-left">Method</th>
                                    <th className="text-left">Status</th>
                                    <th className="text-left">Remaining</th>
                                    <th className="text-left">Due Label</th>
                                    <th className="text-left">Date</th>
                                </tr>
                            </thead>

                            <tbody>
                                {filtered.map((payment) => (
                                    <tr key={payment.id} className="border-b dark:border-slate-800">
                                        <td className="py-2 dark:text-white">
                                            {payment.customer_name}
                                        </td>
                                        <td className="dark:text-slate-300">
                                            PHP {Number(payment.amount || 0).toLocaleString()}
                                        </td>
                                        <td className="dark:text-slate-300">
                                            {payment.payment_method}
                                        </td>
                                        <td>
                                            <span
                                                className={`px-2 py-1 rounded text-xs ${payment.status === "Paid"
                                                        ? "bg-green-100 text-green-600"
                                                        : "bg-yellow-100 text-yellow-700"
                                                    }`}
                                            >
                                                {payment.status}
                                            </span>
                                        </td>
                                        <td className="dark:text-slate-300">
                                            PHP {Number(payment.remaining_balance || 0).toLocaleString()}
                                        </td>
                                        <td className="dark:text-slate-300">
                                            {payment.due_label || "No due label"}
                                        </td>
                                        <td className="dark:text-slate-300">
                                            {payment.created_at
                                                ? new Date(payment.created_at).toLocaleString()
                                                : "N/A"}
                                        </td>
                                    </tr>
                                ))}

                                {filtered.length === 0 && (
                                    <tr>
                                        <td
                                            colSpan="7"
                                            className="py-6 text-center text-slate-500 dark:text-slate-400"
                                        >
                                            No payments found.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>

            {modalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-3">
                    <form
                        onSubmit={addPayment}
                        className="bg-white dark:bg-slate-900 p-4 rounded-xl w-full max-w-md"
                    >
                        <div className="mb-4 flex items-center justify-between">
                            <h2 className="font-bold dark:text-white">Add Payment</h2>
                            <button
                                type="button"
                                onClick={() => {
                                    setModalOpen(false);
                                    resetForm();
                                }}
                                className="dark:text-white"
                            >
                                <X size={16} />
                            </button>
                        </div>

                        <select
                            value={form.utang_id}
                            onChange={(e) =>
                                setForm((prev) => ({
                                    ...prev,
                                    utang_id: e.target.value,
                                    amount:
                                        utangRecords.find((item) => String(item.id) === e.target.value)
                                            ?.amount?.toString() || "",
                                }))
                            }
                            className="w-full mb-3 border p-3 rounded dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                            required
                        >
                            <option value="">Select unpaid customer</option>
                            {utangRecords.map((item) => (
                                <option key={item.id} value={item.id}>
                                    {item.customer_name} - PHP {Number(item.amount || 0).toLocaleString()}
                                </option>
                            ))}
                        </select>

                        <input
                            type="number"
                            value={form.amount}
                            onChange={(e) =>
                                setForm((prev) => ({ ...prev, amount: e.target.value }))
                            }
                            placeholder="Amount"
                            className="w-full mb-3 border p-3 rounded dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                            required
                        />

                        <select
                            value={form.payment_method}
                            onChange={(e) =>
                                setForm((prev) => ({
                                    ...prev,
                                    payment_method: e.target.value,
                                }))
                            }
                            className="w-full mb-3 border p-3 rounded dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                        >
                            <option value="Cash">Cash</option>
                            <option value="GCash">GCash</option>
                        </select>

                        {selectedUtang && (
                            <div className="mb-4 rounded-lg bg-slate-50 p-3 text-sm text-slate-600 dark:bg-slate-800 dark:text-slate-300">
                                <p>Customer: {selectedUtang.customer_name}</p>
                                <p>Remaining: PHP {Number(selectedUtang.amount || 0).toLocaleString()}</p>
                                <p>Due: {selectedUtang.due_label || "No due label"}</p>
                            </div>
                        )}

                        <div className="flex justify-end gap-2">
                            <button
                                type="button"
                                onClick={() => {
                                    setModalOpen(false);
                                    resetForm();
                                }}
                                className="px-3 py-2 rounded dark:text-white"
                            >
                                Cancel
                            </button>
                            <button
                                disabled={saving}
                                className="bg-indigo-600 text-white px-3 py-2 rounded disabled:opacity-70"
                            >
                                {saving ? "Saving..." : "Save"}
                            </button>
                        </div>
                    </form>
                </div>
            )}
        </div>
    );
}

import api from "../../api/axios";
import { CreditCard, Search } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import toast from "react-hot-toast";

export default function Utang() {
    const [utangRecords, setUtangRecords] = useState([]);
    const [search, setSearch] = useState("");
    const [status, setStatus] = useState("All");
    const [loading, setLoading] = useState(true);

    const [payingRecord, setPayingRecord] = useState(null);
    const [paymentForm, setPaymentForm] = useState({
        amount: "",
        payment_method: "Cash",
    });

    const fetchUtang = async () => {
        try {
            const res = await api.get("/utang");
            setUtangRecords(res.data);
        } catch (err) {
            console.error(err);
            toast.error("Failed to load utang records");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchUtang();
    }, []);

    const filteredRecords = useMemo(() => {
        return utangRecords.filter((item) => {
            const name = item.customer_name || "";

            const matchesSearch = name.toLowerCase().includes(search.toLowerCase());

            const matchesStatus =
                status === "All" ||
                (status === "Paid" && item.is_paid) ||
                (status === "Unpaid" && !item.is_paid && !isOverdue(item)) ||
                (status === "Overdue" && isOverdue(item));

            return matchesSearch && matchesStatus;
        });
    }, [utangRecords, search, status]);

    const totalUnpaid = utangRecords
        .filter((item) => !item.is_paid)
        .reduce((sum, item) => sum + Number(item.amount || 0), 0);

    const overdueCount = utangRecords.filter((item) => isOverdue(item)).length;

    const openPayModal = (record) => {
        setPayingRecord(record);
        setPaymentForm({
            amount: String(record.amount || ""),
            payment_method: "Cash",
        });
    };

    const closePayModal = () => {
        setPayingRecord(null);
        setPaymentForm({
            amount: "",
            payment_method: "Cash",
        });
    };

    const handlePay = async (e) => {
        e.preventDefault();

        if (!payingRecord) return;

        const amount = Number(paymentForm.amount || 0);

        if (amount <= 0) {
            toast.error("Payment amount must be greater than zero");
            return;
        }

        if (amount > Number(payingRecord.amount || 0)) {
            toast.error("Payment cannot exceed remaining balance");
            return;
        }

        const loadingToast = toast.loading("Recording payment...");

        try {
            await api.post(`/utang/${payingRecord.id}/pay`, {
                amount,
                payment_method: paymentForm.payment_method,
            });

            toast.success("Payment recorded successfully", { id: loadingToast });
            await fetchUtang();
            closePayModal();
        } catch (err) {
            console.error(err);
            toast.error(err.response?.data?.error || "Payment failed", {
                id: loadingToast,
            });
        }
    };

    if (loading) {
        return <p className="p-6 dark:text-white">Loading utang records...</p>;
    }

    return (
        <div className="space-y-4 sm:space-y-6">
            <div>
                <h1 className="text-2xl font-bold text-slate-900 dark:text-white">
                    Utang Records
                </h1>
                <p className="text-sm text-slate-500 dark:text-slate-400">
                    Monitor receivables, due dates, overdue balances, and payments.
                </p>
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-4">
                <SummaryCard
                    title="Total Unpaid"
                    value={`₱${totalUnpaid.toLocaleString()}`}
                    danger
                />
                <SummaryCard title="Total Records" value={utangRecords.length} />
                <SummaryCard title="Overdue" value={overdueCount} danger />
                <SummaryCard
                    title="Paid Records"
                    value={utangRecords.filter((item) => item.is_paid).length}
                    success
                />
            </div>

            <div className="flex flex-col gap-3 rounded-xl border bg-white p-4 dark:border-slate-800 dark:bg-slate-900 sm:flex-row sm:items-center sm:justify-between">
                <div className="flex items-center gap-2 rounded-xl border px-3 py-2 dark:border-slate-700 sm:w-96">
                    <Search size={16} />
                    <input
                        placeholder="Search customer..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="w-full bg-transparent text-sm outline-none dark:text-white"
                    />
                </div>

                <div className="flex flex-wrap gap-2">
                    {["All", "Unpaid", "Overdue", "Paid"].map((item) => (
                        <button
                            key={item}
                            onClick={() => setStatus(item)}
                            className={`rounded-xl px-3 py-2 text-xs font-bold ${status === item
                                    ? "bg-indigo-600 text-white"
                                    : "border text-slate-600 dark:border-slate-700 dark:text-slate-300"
                                }`}
                        >
                            {item}
                        </button>
                    ))}
                </div>
            </div>

            <div className="rounded-xl border bg-white p-4 dark:border-slate-800 dark:bg-slate-900">
                <div className="overflow-x-auto">
                    <table className="w-full min-w-[920px] text-xs sm:text-sm">
                        <thead>
                            <tr className="border-b text-left dark:border-slate-800">
                                <th className="py-3">Customer</th>
                                <th>Amount</th>
                                <th>Due Label</th>
                                <th>Due Date</th>
                                <th>Status</th>
                                <th>Date Created</th>
                                <th className="text-right">Action</th>
                            </tr>
                        </thead>

                        <tbody>
                            {filteredRecords.map((item) => {
                                const overdue = isOverdue(item);

                                return (
                                    <tr
                                        key={item.id}
                                        className={`border-b dark:border-slate-800 ${overdue ? "bg-red-50/60 dark:bg-red-500/5" : ""
                                            }`}
                                    >
                                        <td className="py-3 font-semibold text-slate-900 dark:text-white">
                                            {item.customer_name}
                                        </td>

                                        <td className="font-bold text-slate-900 dark:text-white">
                                            ₱{Number(item.amount || 0).toLocaleString()}
                                        </td>

                                        <td className="text-slate-600 dark:text-slate-300">
                                            {item.due_label || "No due label"}
                                        </td>

                                        <td className="text-slate-600 dark:text-slate-300">
                                            {item.due_date
                                                ? new Date(item.due_date).toLocaleDateString()
                                                : "No date"}
                                        </td>

                                        <td>
                                            <span
                                                className={`rounded-full px-3 py-1 text-xs font-bold ${item.is_paid
                                                        ? "bg-emerald-50 text-emerald-600 dark:bg-emerald-500/10 dark:text-emerald-400"
                                                        : overdue
                                                            ? "bg-red-100 text-red-700 dark:bg-red-500/10 dark:text-red-400"
                                                            : "bg-amber-50 text-amber-600 dark:bg-amber-500/10 dark:text-amber-400"
                                                    }`}
                                            >
                                                {item.is_paid ? "Paid" : overdue ? "Overdue" : "Unpaid"}
                                            </span>
                                        </td>

                                        <td className="text-slate-600 dark:text-slate-300">
                                            {item.created_at
                                                ? new Date(item.created_at).toLocaleDateString()
                                                : "N/A"}
                                        </td>

                                        <td className="text-right">
                                            <button
                                                disabled={item.is_paid}
                                                onClick={() => openPayModal(item)}
                                                className={`inline-flex items-center gap-2 rounded-lg px-3 py-2 text-xs font-bold ${item.is_paid
                                                        ? "cursor-not-allowed bg-slate-200 text-slate-500 dark:bg-slate-800"
                                                        : "bg-indigo-600 text-white hover:bg-indigo-700"
                                                    }`}
                                            >
                                                <CreditCard size={15} />
                                                Pay
                                            </button>
                                        </td>
                                    </tr>
                                );
                            })}

                            {filteredRecords.length === 0 && (
                                <tr>
                                    <td
                                        colSpan="7"
                                        className="py-8 text-center text-slate-500 dark:text-slate-400"
                                    >
                                        No utang records found.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {payingRecord && (
                <PayUtangModal
                    record={payingRecord}
                    form={paymentForm}
                    setForm={setPaymentForm}
                    onClose={closePayModal}
                    onSubmit={handlePay}
                />
            )}
        </div>
    );
}

function SummaryCard({ title, value, danger, success }) {
    return (
        <div className="rounded-xl border bg-white p-4 dark:border-slate-800 dark:bg-slate-900">
            <p className="text-sm text-slate-500 dark:text-slate-400">{title}</p>
            <h2
                className={`mt-2 text-2xl font-bold ${danger
                        ? "text-red-600 dark:text-red-400"
                        : success
                            ? "text-emerald-600 dark:text-emerald-400"
                            : "text-slate-900 dark:text-white"
                    }`}
            >
                {value}
            </h2>
        </div>
    );
}

function PayUtangModal({ record, form, setForm, onClose, onSubmit }) {
    const [payments, setPayments] = useState([]);
    const [loadingPayments, setLoadingPayments] = useState(true);

    const fetchPayments = async () => {
        try {
            const res = await api.get(`/utang/${record.id}/payments`);
            setPayments(res.data);
        } catch (err) {
            console.error(err);
            toast.error("Failed to load payment history");
        } finally {
            setLoadingPayments(false);
        }
    };

    useEffect(() => {
        fetchPayments();
    }, [record.id]);

    const totalPaid = payments.reduce(
        (sum, payment) => sum + Number(payment.amount || 0),
        0
    );

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-black/40 px-3 py-4">
            <div className="w-full max-w-2xl rounded-xl bg-white p-4 dark:bg-slate-900">
                <div className="mb-4 flex items-start justify-between gap-3">
                    <div>
                        <h2 className="text-lg font-bold text-slate-900 dark:text-white">
                            Utang Payment
                        </h2>
                        <p className="text-sm text-slate-500 dark:text-slate-400">
                            {record.customer_name}
                        </p>
                    </div>

                    <button type="button" onClick={onClose} className="dark:text-white">
                        ✕
                    </button>
                </div>

                <div className="mb-4 grid grid-cols-1 gap-3 sm:grid-cols-3">
                    <MiniCard
                        title="Remaining Balance"
                        value={`₱${Number(record.amount || 0).toLocaleString()}`}
                        danger
                    />
                    <MiniCard
                        title="Total Paid"
                        value={`₱${totalPaid.toLocaleString()}`}
                        success
                    />
                    <MiniCard
                        title="Status"
                        value={record.is_paid ? "Paid" : "Unpaid"}
                    />
                </div>

                <form onSubmit={onSubmit} className="mb-5 rounded-xl border p-4 dark:border-slate-800">
                    <h3 className="mb-3 font-bold text-slate-900 dark:text-white">
                        Record Partial Payment
                    </h3>

                    <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
                        <input
                            type="number"
                            value={form.amount}
                            onChange={(e) =>
                                setForm((prev) => ({ ...prev, amount: e.target.value }))
                            }
                            placeholder="Payment amount"
                            className="rounded border p-2 dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                        />

                        <select
                            value={form.payment_method}
                            onChange={(e) =>
                                setForm((prev) => ({
                                    ...prev,
                                    payment_method: e.target.value,
                                }))
                            }
                            className="rounded border p-2 dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                        >
                            <option value="Cash">Cash</option>
                            <option value="GCash">GCash</option>
                        </select>

                        <button className="rounded bg-indigo-600 px-3 py-2 text-white hover:bg-indigo-700">
                            Save Payment
                        </button>
                    </div>

                    <p className="mt-2 text-xs text-slate-500 dark:text-slate-400">
                        You can pay partially. The remaining balance will be updated automatically.
                    </p>
                </form>

                <div className="rounded-xl border p-4 dark:border-slate-800">
                    <h3 className="mb-3 font-bold text-slate-900 dark:text-white">
                        Payment History
                    </h3>

                    {loadingPayments ? (
                        <p className="text-sm text-slate-500">Loading payments...</p>
                    ) : payments.length === 0 ? (
                        <p className="text-sm text-slate-500">No payments yet.</p>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="w-full min-w-[480px] text-sm">
                                <thead>
                                    <tr className="border-b text-left dark:border-slate-800">
                                        <th className="py-2">Date</th>
                                        <th>Method</th>
                                        <th>Amount</th>
                                    </tr>
                                </thead>

                                <tbody>
                                    {payments.map((payment) => (
                                        <tr key={payment.id} className="border-b dark:border-slate-800">
                                            <td className="py-2 text-slate-600 dark:text-slate-300">
                                                {payment.created_at
                                                    ? new Date(payment.created_at).toLocaleString()
                                                    : "N/A"}
                                            </td>
                                            <td className="text-slate-600 dark:text-slate-300">
                                                {payment.payment_method}
                                            </td>
                                            <td className="font-bold text-slate-900 dark:text-white">
                                                ₱{Number(payment.amount || 0).toLocaleString()}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

function MiniCard({ title, value, danger, success }) {
    return (
        <div className="rounded-xl border bg-slate-50 p-3 dark:border-slate-800 dark:bg-slate-800">
            <p className="text-xs text-slate-500 dark:text-slate-400">{title}</p>
            <p
                className={`mt-1 font-bold ${danger
                        ? "text-red-600 dark:text-red-400"
                        : success
                            ? "text-emerald-600 dark:text-emerald-400"
                            : "text-slate-900 dark:text-white"
                    }`}
            >
                {value}
            </p>
        </div>
    );
}

function isOverdue(item) {
    if (item.is_paid || !item.due_date) return false;

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const due = new Date(item.due_date);
    due.setHours(0, 0, 0, 0);

    return due < today;
}
import { salesData } from "../../data/mockData";
import { Eye, Search, X } from "lucide-react";
import { useMemo, useState } from "react";

export default function Sales() {
    const [sales, setSales] = useState(salesData);
    const [search, setSearch] = useState("");
    const [status, setStatus] = useState("All");

    const [selected, setSelected] = useState(null);

    const filtered = useMemo(() => {
        return sales.filter((s) => {
            const matchSearch = s.customer_name
                .toLowerCase()
                .includes(search.toLowerCase());

            const matchStatus =
                status === "All" || s.status === status;

            return matchSearch && matchStatus;
        });
    }, [sales, search, status]);

    const totalSales = filtered.reduce((sum, s) => sum + s.total_amount, 0);

    return (
        <div className="space-y-4 sm:space-y-6">

            {/* HEADER */}
            <div>
                <h1 className="text-2xl font-bold dark:text-white">Sales</h1>
                <p className="text-sm text-slate-500">
                    Monitor all sales transactions
                </p>
            </div>

            {/* SUMMARY */}
            <div className="bg-white dark:bg-slate-900 p-4 rounded-xl border dark:border-slate-800">
                <p className="text-sm text-slate-500">Total Sales</p>
                <h2 className="text-2xl font-bold">
                    ₱{totalSales.toLocaleString()}
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
                    {["All", "Completed", "Pending", "Cancelled"].map((s) => (
                        <button
                            key={s}
                            onClick={() => setStatus(s)}
                            className={`px-3 py-1 rounded text-xs ${status === s
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
                    <table className="w-full min-w-[700px] text-xs sm:text-sm">
                        <thead>
                            <tr className="border-b dark:border-slate-800">
                                <th className="py-2 text-left">Customer</th>
                                <th>Amount</th>
                                <th>Payment</th>
                                <th>Status</th>
                                <th>Date</th>
                                <th className="text-right">Action</th>
                            </tr>
                        </thead>

                        <tbody>
                            {filtered.map((s) => (
                                <tr key={s.id} className="border-b dark:border-slate-800">
                                    <td className="py-2">{s.customer_name}</td>
                                    <td>₱{s.total_amount}</td>
                                    <td>{s.payment_method}</td>

                                    <td>
                                        <span
                                            className={`px-2 py-1 rounded text-xs ${s.status === "Completed"
                                                    ? "bg-green-100 text-green-600"
                                                    : s.status === "Pending"
                                                        ? "bg-yellow-100 text-yellow-600"
                                                        : "bg-red-100 text-red-600"
                                                }`}
                                        >
                                            {s.status}
                                        </span>
                                    </td>

                                    <td>{s.created_at}</td>

                                    <td className="text-right">
                                        <button onClick={() => setSelected(s)}>
                                            <Eye size={16} />
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* MODAL */}
            {selected && (
                <div className="fixed inset-0 flex items-center justify-center bg-black/40 px-3">
                    <div className="bg-white dark:bg-slate-900 p-4 rounded-xl w-full max-w-md">

                        <div className="flex justify-between mb-3">
                            <h2 className="font-bold">Sale Details</h2>
                            <button onClick={() => setSelected(null)}>
                                <X size={16} />
                            </button>
                        </div>

                        <p className="text-sm mb-2">
                            Customer: <strong>{selected.customer_name}</strong>
                        </p>

                        <p className="text-sm mb-2">
                            Payment: {selected.payment_method}
                        </p>

                        <p className="text-sm mb-3">
                            Total: ₱{selected.total_amount}
                        </p>

                        <div className="border-t pt-2">
                            <p className="font-bold mb-2 text-sm">Items</p>

                            {selected.items.map((i, idx) => (
                                <div key={idx} className="flex justify-between text-sm">
                                    <span>{i.name} x{i.qty}</span>
                                    <span>₱{i.price}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
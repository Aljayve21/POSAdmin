import {
    Box,
    CreditCard,
    Package,
    ShoppingCart,
    Users,
    Wallet,
} from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../api/axios";

const statConfig = [
    { key: "totalSales", title: "Total Sales", icon: ShoppingCart, currency: true },
    { key: "totalTransactions", title: "Transactions", icon: CreditCard },
    { key: "totalCustomers", title: "Customers", icon: Users },
    { key: "pendingUtang", title: "Pending Utang", icon: Wallet, currency: true },
];

export default function Dashboard() {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);
    const [summary, setSummary] = useState({
        totalSales: 0,
        totalTransactions: 0,
        totalCustomers: 0,
        pendingUtang: 0,
        completedCount: 0,
        cancelledCount: 0,
        refundedCount: 0,
        monthlySales: [],
    });
    const [recentSales, setRecentSales] = useState([]);

    useEffect(() => {
        const loadDashboard = async () => {
            try {
                setLoading(true);
                const [summaryRes, salesRes] = await Promise.all([
                    api.get("/reports/summary"),
                    api.get("/sales"),
                ]);

                setSummary({
                    totalSales: Number(summaryRes.data.totalSales || 0),
                    totalTransactions: Number(summaryRes.data.totalTransactions || 0),
                    totalCustomers: Number(summaryRes.data.totalCustomers || 0),
                    pendingUtang: Number(summaryRes.data.pendingUtang || 0),
                    completedCount: Number(summaryRes.data.completedCount || 0),
                    cancelledCount: Number(summaryRes.data.cancelledCount || 0),
                    refundedCount: Number(summaryRes.data.refundedCount || 0),
                    monthlySales: summaryRes.data.monthlySales || [],
                });

                setRecentSales((salesRes.data || []).slice(0, 6));
            } catch (error) {
                console.error("Dashboard load failed", error);
            } finally {
                setLoading(false);
            }
        };

        const timeoutId = setTimeout(() => {
            loadDashboard();
        }, 0);

        return () => clearTimeout(timeoutId);
    }, []);

    const monthlyTarget = 50000;
    const progress = Math.min(
        100,
        Math.round((Number(summary.totalSales || 0) / monthlyTarget) * 100)
    );

    const monthlyPeak = useMemo(() => {
        return Math.max(1, ...summary.monthlySales.map((item) => Number(item.sales || 0)));
    }, [summary.monthlySales]);

    return (
        <div className="space-y-4 sm:space-y-6">
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
                {statConfig.map((item) => (
                    <StatCard
                        key={item.key}
                        title={item.title}
                        icon={item.icon}
                        value={summary[item.key]}
                        currency={item.currency}
                        loading={loading}
                    />
                ))}
            </div>

            <div className="grid grid-cols-1 gap-4 xl:grid-cols-3 xl:gap-6">
                <div className="xl:col-span-2">
                    <MonthlySalesCard
                        loading={loading}
                        monthlySales={summary.monthlySales}
                        peak={monthlyPeak}
                    />
                </div>

                <MonthlyTargetCard
                    totalSales={summary.totalSales}
                    pendingUtang={summary.pendingUtang}
                    progress={progress}
                />
            </div>

            <div className="grid grid-cols-1 gap-4 xl:grid-cols-3 xl:gap-6">
                <RecentTransactions
                    loading={loading}
                    recentSales={recentSales}
                    onViewAll={() => navigate("/admin/sales")}
                />
                <QuickManagement navigate={navigate} summary={summary} />
            </div>
        </div>
    );
}

function StatCard({ title, icon: Icon, value, currency = false, loading }) {
    return (
        <div className="rounded-2xl border border-slate-200 bg-white p-4 dark:border-slate-800 dark:bg-slate-900 sm:p-6">
            <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-xl bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-white">
                <Icon size={21} />
            </div>

            <p className="mb-2 text-sm text-slate-500 dark:text-slate-400">{title}</p>

            <h2 className="text-2xl font-bold text-slate-800 dark:text-white sm:text-3xl">
                {loading
                    ? "Loading..."
                    : currency
                        ? `PHP ${Number(value || 0).toLocaleString()}`
                        : Number(value || 0).toLocaleString()}
            </h2>
        </div>
    );
}

function MonthlySalesCard({ loading, monthlySales, peak }) {
    return (
        <div className="rounded-2xl border border-slate-200 bg-white p-4 dark:border-slate-800 dark:bg-slate-900 sm:p-6">
            <div className="mb-5">
                <h2 className="text-lg font-bold text-slate-800 dark:text-white">Monthly Sales</h2>
                <p className="text-sm text-slate-500 dark:text-slate-400">
                    Sales performance this year
                </p>
            </div>

            {loading ? (
                <p className="text-sm text-slate-500 dark:text-slate-400">Loading chart...</p>
            ) : monthlySales.length === 0 ? (
                <p className="text-sm text-slate-500 dark:text-slate-400">No sales data yet.</p>
            ) : (
                <div className="flex h-[160px] items-end gap-4 overflow-x-auto px-1 sm:h-[180px] sm:gap-5 sm:px-2">
                    {monthlySales.map((item) => {
                        const height = Math.max(20, (Number(item.sales || 0) / peak) * 150);

                        return (
                            <div key={`${item.month}-${item.monthNumber}`} className="flex min-w-8 flex-col items-center gap-2">
                                <div className="w-4 rounded-t-lg bg-indigo-500" style={{ height: `${height}px` }} />
                                <span className="text-xs text-slate-500 dark:text-slate-400">{item.month}</span>
                            </div>
                        );
                    })}
                </div>
            )}
        </div>
    );
}

function MonthlyTargetCard({ totalSales, pendingUtang, progress }) {
    return (
        <div className="rounded-2xl border border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900">
            <div className="p-4 sm:p-6">
                <h2 className="text-lg font-bold text-slate-800 dark:text-white">Monthly Target</h2>
                <p className="text-sm text-slate-500 dark:text-slate-400">
                    Progress based on PHP 50,000 target
                </p>

                <div className="relative mx-auto my-6 flex h-40 w-40 items-center justify-center rounded-full border-[16px] border-indigo-500 border-b-slate-200 dark:border-b-slate-700 sm:h-48 sm:w-48 sm:border-[18px]">
                    <div className="text-center">
                        <h3 className="text-3xl font-bold text-slate-800 dark:text-white sm:text-4xl">
                            {progress}%
                        </h3>
                        <span className="mt-2 inline-block rounded-full bg-amber-50 px-2 py-1 text-xs font-bold text-amber-600 dark:bg-amber-500/10 dark:text-amber-400">
                            Utang PHP {Number(pendingUtang || 0).toLocaleString()}
                        </span>
                    </div>
                </div>

                <p className="text-center text-sm text-slate-500 dark:text-slate-400">
                    Current sales: PHP {Number(totalSales || 0).toLocaleString()}
                </p>
            </div>
        </div>
    );
}

function RecentTransactions({ loading, recentSales, onViewAll }) {
    return (
        <div className="rounded-2xl border border-slate-200 bg-white p-4 dark:border-slate-800 dark:bg-slate-900 sm:p-6 xl:col-span-2">
            <div className="mb-5 flex items-center justify-between gap-3">
                <div>
                    <h2 className="text-lg font-bold text-slate-800 dark:text-white">Recent Transactions</h2>
                    <p className="text-sm text-slate-500 dark:text-slate-400">
                        Latest sales activity
                    </p>
                </div>

                <button
                    onClick={onViewAll}
                    className="shrink-0 rounded-xl border border-slate-200 px-3 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-50 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800 sm:px-4 sm:text-sm"
                >
                    View All
                </button>
            </div>

            <div className="overflow-x-auto">
                <table className="w-full min-w-[560px] text-left text-xs sm:text-sm">
                    <thead>
                        <tr className="border-b border-slate-100 text-slate-500 dark:border-slate-800 dark:text-slate-400">
                            <th className="py-3 font-semibold">Customer</th>
                            <th className="py-3 font-semibold">Payment</th>
                            <th className="py-3 font-semibold">Amount</th>
                            <th className="py-3 font-semibold">Status</th>
                        </tr>
                    </thead>

                    <tbody>
                        {loading ? (
                            <tr>
                                <td colSpan="4" className="py-4 text-center text-slate-500 dark:text-slate-400">
                                    Loading transactions...
                                </td>
                            </tr>
                        ) : recentSales.length === 0 ? (
                            <tr>
                                <td colSpan="4" className="py-4 text-center text-slate-500 dark:text-slate-400">
                                    No recent transactions found.
                                </td>
                            </tr>
                        ) : (
                            recentSales.map((item) => (
                                <tr key={item.id} className="border-b border-slate-100 dark:border-slate-800">
                                    <td className="py-3 font-semibold text-slate-800 dark:text-white sm:py-4">
                                        {item.customer_name || "Walk-in Customer"}
                                    </td>
                                    <td className="py-3 text-slate-500 dark:text-slate-400 sm:py-4">
                                        {item.payment_method}
                                    </td>
                                    <td className="py-3 font-semibold text-slate-800 dark:text-white sm:py-4">
                                        PHP {Number(item.total_amount || 0).toLocaleString()}
                                    </td>
                                    <td className="py-3 sm:py-4">
                                        <span className="rounded-full bg-emerald-50 px-2 py-1 text-xs font-bold text-emerald-600 dark:bg-emerald-500/10 dark:text-emerald-400 sm:px-3">
                                            {item.status || "Completed"}
                                        </span>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}

function QuickManagement({ navigate, summary }) {
    return (
        <div className="rounded-2xl border border-slate-200 bg-white p-4 dark:border-slate-800 dark:bg-slate-900 sm:p-6">
            <h2 className="text-lg font-bold text-slate-800 dark:text-white">Quick Management</h2>
            <p className="mb-5 text-sm text-slate-500 dark:text-slate-400">
                Admin shortcuts and live overview
            </p>

            <div className="mb-5 space-y-3 rounded-2xl bg-slate-50 p-4 dark:bg-slate-800/70">
                <div className="flex items-center justify-between text-sm">
                    <span className="text-slate-500 dark:text-slate-400">Completed</span>
                    <strong className="text-slate-800 dark:text-white">{summary.completedCount}</strong>
                </div>
                <div className="flex items-center justify-between text-sm">
                    <span className="text-slate-500 dark:text-slate-400">Cancelled</span>
                    <strong className="text-slate-800 dark:text-white">{summary.cancelledCount}</strong>
                </div>
                <div className="flex items-center justify-between text-sm">
                    <span className="text-slate-500 dark:text-slate-400">Refunded</span>
                    <strong className="text-slate-800 dark:text-white">{summary.refundedCount}</strong>
                </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
                <QuickBox icon={Box} label="Products" onClick={() => navigate("/admin/products")} />
                <QuickBox icon={ShoppingCart} label="Sales" onClick={() => navigate("/admin/sales")} />
                <QuickBox icon={Wallet} label="Utang" onClick={() => navigate("/admin/utang")} />
                <QuickBox icon={Package} label="Inventory" onClick={() => navigate("/admin/inventory")} />
            </div>
        </div>
    );
}

function QuickBox({ icon: Icon, label, onClick }) {
    return (
        <button
            onClick={onClick}
            className="rounded-2xl border border-slate-200 bg-slate-50 p-4 text-left transition hover:bg-indigo-50 dark:border-slate-800 dark:bg-slate-800 dark:hover:bg-indigo-500/10"
        >
            <Icon size={22} className="mb-3 text-slate-700 dark:text-white" />
            <p className="text-sm font-bold text-slate-800 dark:text-white">{label}</p>
        </button>
    );
}

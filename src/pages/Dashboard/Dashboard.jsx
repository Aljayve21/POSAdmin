import {
    Box,
    Package,
    ShoppingCart,
    Users,
    Wallet,
} from "lucide-react";
import {
    monthlySalesData,
    recentTransactionsData,
    statsData,
} from "../../data/mockData";

export default function Dashboard() {
    return (
        <div className="space-y-4 sm:space-y-6">
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                {statsData.map((item) => (
                    <StatCard key={item.title} item={item} />
                ))}
            </div>

            <div className="grid grid-cols-1 gap-4 xl:grid-cols-3 xl:gap-6">
                <div className="xl:col-span-2">
                    <MonthlySalesCard />
                </div>

                <MonthlyTargetCard />
            </div>

            <div className="grid grid-cols-1 gap-4 xl:grid-cols-3 xl:gap-6">
                <RecentTransactions />
                <QuickManagement />
            </div>
        </div>
    );
}

function StatCard({ item }) {
    const Icon =
        item.title === "Customers"
            ? Users
            : item.title === "Products"
                ? Package
                : item.title === "Total Sales"
                    ? ShoppingCart
                    : Wallet;

    return (
        <div className="rounded-2xl border border-slate-200 bg-white p-4 dark:border-slate-800 dark:bg-slate-900 sm:p-6">
            <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-xl bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-white">
                <Icon size={21} />
            </div>

            <p className="mb-2 text-sm text-slate-500 dark:text-slate-400">
                {item.title}
            </p>

            <div className="flex items-end justify-between gap-2">
                <h2 className="text-2xl font-bold text-slate-800 dark:text-white sm:text-3xl">
                    {item.title.includes("Sales") || item.title.includes("Utang")
                        ? `₱${Number(item.value).toLocaleString()}`
                        : Number(item.value).toLocaleString()}
                </h2>

                <span
                    className={`shrink-0 rounded-full px-2 py-1 text-xs font-bold ${item.up
                        ? "bg-emerald-50 text-emerald-600 dark:bg-emerald-500/10 dark:text-emerald-400"
                        : "bg-red-50 text-red-600 dark:bg-red-500/10 dark:text-red-400"
                        }`}
                >
                    {item.up ? "↑" : "↓"} {item.growth}%
                </span>
            </div>
        </div>
    );
}

function MonthlySalesCard() {
    const maxValue = Math.max(...monthlySalesData.map((item) => item.value));

    return (
        <div className="rounded-2xl border border-slate-200 bg-white p-4 dark:border-slate-800 dark:bg-slate-900 sm:p-6">
            <div className="mb-5 flex items-center justify-between">
                <div>
                    <h2 className="text-lg font-bold text-slate-800 dark:text-white">
                        Monthly Sales
                    </h2>
                    <p className="text-sm text-slate-500 dark:text-slate-400">
                        Sales performance this year
                    </p>
                </div>
            </div>

            <div className="flex h-[160px] items-end gap-4 overflow-x-auto px-1 sm:h-[180px] sm:gap-5 sm:px-2">
                {monthlySalesData.map((item) => {
                    const height = Math.max(20, (item.value / maxValue) * 150);

                    return (
                        <div key={item.month} className="flex min-w-8 flex-col items-center gap-2">
                            <div
                                className="w-4 rounded-t-lg bg-indigo-500"
                                style={{ height: `${height}px` }}
                            />
                            <span className="text-xs text-slate-500 dark:text-slate-400">
                                {item.month}
                            </span>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}

function MonthlyTargetCard() {
    return (
        <div className="rounded-2xl border border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900">
            <div className="p-4 sm:p-6">
                <h2 className="text-lg font-bold text-slate-800 dark:text-white">
                    Monthly Target
                </h2>
                <p className="text-sm text-slate-500 dark:text-slate-400">
                    Target you’ve set for this month
                </p>

                <div className="relative mx-auto my-6 flex h-40 w-40 items-center justify-center rounded-full border-[16px] border-indigo-500 border-b-slate-200 dark:border-b-slate-700 sm:h-48 sm:w-48 sm:border-[18px]">
                    <div className="text-center">
                        <h3 className="text-3xl font-bold text-slate-800 dark:text-white sm:text-4xl">
                            75%
                        </h3>
                        <span className="mt-2 inline-block rounded-full bg-emerald-50 px-2 py-1 text-xs font-bold text-emerald-600 dark:bg-emerald-500/10 dark:text-emerald-400">
                            +10%
                        </span>
                    </div>
                </div>

                <p className="text-center text-sm text-slate-500 dark:text-slate-400">
                    You earned ₱3,287 today. Keep up your good work!
                </p>
            </div>
        </div>
    );
}

function RecentTransactions() {
    return (
        <div className="rounded-2xl border border-slate-200 bg-white p-4 dark:border-slate-800 dark:bg-slate-900 sm:p-6 xl:col-span-2">
            <div className="mb-5 flex items-center justify-between gap-3">
                <div>
                    <h2 className="text-lg font-bold text-slate-800 dark:text-white">
                        Recent Transactions
                    </h2>
                    <p className="text-sm text-slate-500 dark:text-slate-400">
                        Latest cashier activities
                    </p>
                </div>

                <button className="shrink-0 rounded-xl border border-slate-200 px-3 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-50 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800 sm:px-4 sm:text-sm">
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
                        {recentTransactionsData.map((item) => (
                            <tr key={item.id} className="border-b border-slate-100 dark:border-slate-800">
                                <td className="py-3 font-semibold text-slate-800 dark:text-white sm:py-4">
                                    {item.customer}
                                </td>
                                <td className="py-3 text-slate-500 dark:text-slate-400 sm:py-4">
                                    {item.payment}
                                </td>
                                <td className="py-3 font-semibold text-slate-800 dark:text-white sm:py-4">
                                    ₱{item.amount.toLocaleString()}
                                </td>
                                <td className="py-3 sm:py-4">
                                    <span
                                        className={`rounded-full px-2 py-1 text-xs font-bold sm:px-3 ${item.status === "Completed"
                                            ? "bg-emerald-50 text-emerald-600 dark:bg-emerald-500/10 dark:text-emerald-400"
                                            : item.status === "Pending"
                                                ? "bg-amber-50 text-amber-600 dark:bg-amber-500/10 dark:text-amber-400"
                                                : "bg-red-50 text-red-600 dark:bg-red-500/10 dark:text-red-400"
                                            }`}
                                    >
                                        {item.status}
                                    </span>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}

function QuickManagement() {
    return (
        <div className="rounded-2xl border border-slate-200 bg-white p-4 dark:border-slate-800 dark:bg-slate-900 sm:p-6">
            <h2 className="text-lg font-bold text-slate-800 dark:text-white">
                Quick Management
            </h2>
            <p className="mb-5 text-sm text-slate-500 dark:text-slate-400">
                Admin shortcuts
            </p>

            <div className="grid grid-cols-2 gap-3">
                <QuickBox icon={Box} label="Products" />
                <QuickBox icon={ShoppingCart} label="Sales" />
                <QuickBox icon={Wallet} label="Utang" />
                <QuickBox icon={Users} label="Cashiers" />
            </div>
        </div>
    );
}

function QuickBox({ icon: Icon, label }) {
    return (
        <button className="rounded-2xl border border-slate-200 bg-slate-50 p-4 text-left transition hover:bg-indigo-50 dark:border-slate-800 dark:bg-slate-800 dark:hover:bg-indigo-500/10">
            <Icon size={22} className="mb-3 text-slate-700 dark:text-white" />
            <p className="text-sm font-bold text-slate-800 dark:text-white">
                {label}
            </p>
        </button>
    );
}
import api from "../../api/axios";
import {
    Bar,
    BarChart,
    Cell,
    Pie,
    PieChart,
    ResponsiveContainer,
    Tooltip,
    XAxis,
} from "recharts";
import { useEffect, useMemo, useState } from "react";
import toast from "react-hot-toast";

const COLORS = ["#6366F1", "#22C55E", "#F59E0B", "#0EA5E9"];

export default function Reports() {
    const [summary, setSummary] = useState({
        totalSales: 0,
        totalTransactions: 0,
        totalCustomers: 0,
        pendingUtang: 0,
        completedCount: 0,
        cancelledCount: 0,
        refundedCount: 0,
        paymentBreakdown: [],
        paymentCollections: [],
        monthlySales: [],
    });
    const [loading, setLoading] = useState(true);

    const fetchSummary = async () => {
        try {
            const res = await api.get("/reports/summary");
            setSummary(res.data);
        } catch (error) {
            console.error(error);
            toast.error("Failed to load reports");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        const loadData = async () => {
            await fetchSummary();
        };

        loadData();
    }, []);

    const exportRows = useMemo(() => {
        return [
            ["Summary", "Value"],
            ["Total Sales", summary.totalSales],
            ["Transactions", summary.totalTransactions],
            ["Customers", summary.totalCustomers],
            ["Pending Utang", summary.pendingUtang],
            [],
            ["Month", "Sales"],
            ...summary.monthlySales.map((item) => [item.month, item.sales]),
            [],
            ["Payment Method", "Amount"],
            ...summary.paymentBreakdown.map((item) => [item.name, item.value]),
        ];
    }, [summary]);

    const exportCSV = () => {
        const csv = exportRows.map((row) => row.join(",")).join("\n");
        const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
        const url = URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = url;
        link.download = `smart-pos-report-${Date.now()}.csv`;
        link.click();
        URL.revokeObjectURL(url);
    };

    const exportPDF = () => {
        const html = `
      <html>
        <head>
          <title>Smart POS Report</title>
          <style>
            body { font-family: Arial, sans-serif; padding: 24px; color: #111827; }
            h1 { margin-bottom: 4px; }
            .muted { color: #6b7280; margin-bottom: 24px; }
            table { width: 100%; border-collapse: collapse; margin-bottom: 24px; }
            th, td { border: 1px solid #e5e7eb; padding: 10px; text-align: left; }
            th { background: #f3f4f6; }
          </style>
        </head>
        <body>
          <h1>Smart POS Report</h1>
          <p class="muted">Generated: ${new Date().toLocaleString()}</p>
          <p><strong>Total Sales:</strong> PHP ${Number(summary.totalSales || 0).toLocaleString()}</p>
          <p><strong>Transactions:</strong> ${summary.totalTransactions}</p>
          <p><strong>Customers:</strong> ${summary.totalCustomers}</p>
          <p><strong>Pending Utang:</strong> PHP ${Number(summary.pendingUtang || 0).toLocaleString()}</p>

          <h2>Monthly Sales</h2>
          <table>
            <thead><tr><th>Month</th><th>Sales</th></tr></thead>
            <tbody>
              ${summary.monthlySales
                .map((item) => `<tr><td>${item.month}</td><td>PHP ${Number(item.sales || 0).toLocaleString()}</td></tr>`)
                .join("")}
            </tbody>
          </table>

          <h2>Payment Methods</h2>
          <table>
            <thead><tr><th>Method</th><th>Amount</th></tr></thead>
            <tbody>
              ${summary.paymentBreakdown
                .map((item) => `<tr><td>${item.name}</td><td>PHP ${Number(item.value || 0).toLocaleString()}</td></tr>`)
                .join("")}
            </tbody>
          </table>
        </body>
      </html>
    `;

        const printWindow = window.open("", "_blank");
        printWindow.document.write(html);
        printWindow.document.close();
        printWindow.print();
    };

    if (loading) {
        return <p className="p-6 dark:text-white">Loading reports...</p>;
    }

    return (
        <div className="space-y-4 sm:space-y-6">
            <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
                <div>
                    <h1 className="text-2xl font-bold dark:text-white">Reports</h1>
                    <p className="text-sm text-slate-500 dark:text-slate-400">
                        Sales analytics and insights
                    </p>
                </div>

                <div className="flex flex-col gap-2 sm:flex-row">
                    <button
                        onClick={exportCSV}
                        className="rounded-xl border border-slate-200 px-4 py-2 text-sm font-bold text-slate-700 hover:bg-slate-50 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800"
                    >
                        Export CSV
                    </button>

                    <button
                        onClick={exportPDF}
                        className="rounded-xl bg-indigo-600 px-4 py-2 text-sm font-bold text-white hover:bg-indigo-700"
                    >
                        Export PDF
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-4">
                <Card title="Total Sales" value={`PHP ${Number(summary.totalSales || 0).toLocaleString()}`} />
                <Card title="Transactions" value={summary.totalTransactions} />
                <Card title="Customers" value={summary.totalCustomers} />
                <Card title="Pending Utang" value={`PHP ${Number(summary.pendingUtang || 0).toLocaleString()}`} />
            </div>

            <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
                <div className="rounded-xl border bg-white p-4 dark:border-slate-800 dark:bg-slate-900">
                    <h2 className="mb-3 font-bold dark:text-white">Monthly Sales</h2>

                    <div className="h-[250px] w-full">
                        <ResponsiveContainer>
                            <BarChart data={summary.monthlySales}>
                                <XAxis dataKey="month" />
                                <Tooltip />
                                <Bar dataKey="sales" fill="#6366F1" radius={[6, 6, 0, 0]} />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                <div className="rounded-xl border bg-white p-4 dark:border-slate-800 dark:bg-slate-900">
                    <h2 className="mb-3 font-bold dark:text-white">Sales by Payment Method</h2>

                    <div className="h-[250px] w-full">
                        <ResponsiveContainer>
                            <PieChart>
                                <Pie
                                    data={summary.paymentBreakdown}
                                    dataKey="value"
                                    nameKey="name"
                                    outerRadius={80}
                                >
                                    {summary.paymentBreakdown.map((entry, index) => (
                                        <Cell key={entry.name} fill={COLORS[index % COLORS.length]} />
                                    ))}
                                </Pie>
                                <Tooltip />
                            </PieChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                <Card title="Completed" value={summary.completedCount} />
                <Card title="Cancelled" value={summary.cancelledCount} />
                <Card title="Refunded" value={summary.refundedCount} />
            </div>

            <div className="rounded-xl border bg-white p-4 dark:border-slate-800 dark:bg-slate-900">
                <h2 className="mb-3 font-bold dark:text-white">Sales Breakdown</h2>

                <div className="overflow-x-auto">
                    <table className="w-full min-w-[420px] text-xs sm:text-sm">
                        <thead>
                            <tr className="border-b dark:border-slate-800">
                                <th className="py-2 text-left">Month</th>
                                <th className="text-left">Sales</th>
                            </tr>
                        </thead>

                        <tbody>
                            {summary.monthlySales.map((item) => (
                                <tr key={item.monthNumber} className="border-b dark:border-slate-800">
                                    <td className="py-2 dark:text-white">{item.month}</td>
                                    <td className="dark:text-slate-300">PHP {Number(item.sales || 0).toLocaleString()}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}

function Card({ title, value }) {
    return (
        <div className="rounded-xl border bg-white p-4 dark:border-slate-800 dark:bg-slate-900">
            <p className="text-sm text-slate-500 dark:text-slate-400">{title}</p>
            <h2 className="text-2xl font-bold dark:text-white">{value}</h2>
        </div>
    );
}

import { paymentMethods, reportSales } from "../../data/mockData";
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

const COLORS = ["#6366F1", "#22C55E", "#F59E0B"];

export default function Reports() {
    const totalSales = reportSales.reduce((sum, s) => sum + s.sales, 0);
    const totalPayments = paymentMethods.reduce((sum, p) => sum + p.value, 0);

    const exportCSV = () => {
        const rows = [
            ["Month", "Sales"],
            ...reportSales.map((item) => [item.month, item.sales]),
            [],
            ["Payment Method", "Amount"],
            ...paymentMethods.map((item) => [item.name, item.value]),
        ];

        const csv = rows.map((row) => row.join(",")).join("\n");

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
            body {
              font-family: Arial, sans-serif;
              padding: 24px;
              color: #111827;
            }
            h1 {
              margin-bottom: 4px;
            }
            .muted {
              color: #6b7280;
              margin-bottom: 24px;
            }
            table {
              width: 100%;
              border-collapse: collapse;
              margin-bottom: 24px;
            }
            th, td {
              border: 1px solid #e5e7eb;
              padding: 10px;
              text-align: left;
            }
            th {
              background: #f3f4f6;
            }
            .summary {
              margin-bottom: 24px;
            }
          </style>
        </head>
        <body>
          <h1>Smart POS Report</h1>
          <p class="muted">Generated: ${new Date().toLocaleString()}</p>

          <div class="summary">
            <p><strong>Total Sales:</strong> ₱${totalSales.toLocaleString()}</p>
            <p><strong>Total Payments:</strong> ₱${totalPayments.toLocaleString()}</p>
          </div>

          <h2>Monthly Sales</h2>
          <table>
            <thead>
              <tr>
                <th>Month</th>
                <th>Sales</th>
              </tr>
            </thead>
            <tbody>
              ${reportSales
                .map(
                    (item) => `
                    <tr>
                      <td>${item.month}</td>
                      <td>₱${item.sales.toLocaleString()}</td>
                    </tr>
                  `
                )
                .join("")}
            </tbody>
          </table>

          <h2>Payment Methods</h2>
          <table>
            <thead>
              <tr>
                <th>Method</th>
                <th>Amount</th>
              </tr>
            </thead>
            <tbody>
              ${paymentMethods
                .map(
                    (item) => `
                    <tr>
                      <td>${item.name}</td>
                      <td>₱${item.value.toLocaleString()}</td>
                    </tr>
                  `
                )
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

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                <Card title="Total Sales" value={`₱${totalSales.toLocaleString()}`} />
                <Card title="Transactions" value="120" />
                <Card title="Customers" value="45" />
            </div>

            <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
                <div className="rounded-xl border bg-white p-4 dark:border-slate-800 dark:bg-slate-900">
                    <h2 className="mb-3 font-bold dark:text-white">Monthly Sales</h2>

                    <div className="h-[250px] w-full">
                        <ResponsiveContainer>
                            <BarChart data={reportSales}>
                                <XAxis dataKey="month" />
                                <Tooltip />
                                <Bar dataKey="sales" fill="#6366F1" radius={[6, 6, 0, 0]} />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                <div className="rounded-xl border bg-white p-4 dark:border-slate-800 dark:bg-slate-900">
                    <h2 className="mb-3 font-bold dark:text-white">Payment Methods</h2>

                    <div className="h-[250px] w-full">
                        <ResponsiveContainer>
                            <PieChart>
                                <Pie
                                    data={paymentMethods}
                                    dataKey="value"
                                    nameKey="name"
                                    outerRadius={80}
                                >
                                    {paymentMethods.map((entry, index) => (
                                        <Cell key={entry.name} fill={COLORS[index % COLORS.length]} />
                                    ))}
                                </Pie>
                                <Tooltip />
                            </PieChart>
                        </ResponsiveContainer>
                    </div>
                </div>
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
                            {reportSales.map((item) => (
                                <tr key={item.month} className="border-b dark:border-slate-800">
                                    <td className="py-2">{item.month}</td>
                                    <td>₱{item.sales.toLocaleString()}</td>
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
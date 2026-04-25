import api from "../../api/axios";
import { Eye, Search, X } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import toast from "react-hot-toast";

export default function Sales() {
  const [sales, setSales] = useState([]);
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("All");
  const [loading, setLoading] = useState(true);

  const [selected, setSelected] = useState(null);
  const [selectedItems, setSelectedItems] = useState([]);
  const [detailsLoading, setDetailsLoading] = useState(false);

  const fetchSales = async () => {
    try {
      const res = await api.get("/sales");
      setSales(res.data);
    } catch (err) {
      console.error(err);
      toast.error("Failed to load sales");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSales();
  }, []);

  const filtered = useMemo(() => {
    return sales.filter((sale) => {
      const customerName = sale.customer_name || "";

      const matchSearch = customerName
        .toLowerCase()
        .includes(search.toLowerCase());

      const matchStatus = status === "All" || sale.status === status;

      return matchSearch && matchStatus;
    });
  }, [sales, search, status]);

  const totalSales = filtered.reduce(
    (sum, sale) => sum + Number(sale.total_amount || 0),
    0
  );

  const openDetails = async (sale) => {
    setSelected(sale);
    setSelectedItems([]);
    setDetailsLoading(true);

    try {
      const res = await api.get(`/sales/${sale.id}`);
      setSelected(res.data.sale);
      setSelectedItems(res.data.items || []);
    } catch (err) {
      console.error(err);
      toast.error("Failed to load sale details");
    } finally {
      setDetailsLoading(false);
    }
  };

  if (loading) {
    return <p className="p-6 dark:text-white">Loading sales...</p>;
  }

  return (
    <div className="space-y-4 sm:space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900 dark:text-white">
          Sales
        </h1>
        <p className="text-sm text-slate-500 dark:text-slate-400">
          Monitor all sales transactions
        </p>
      </div>

      <div className="rounded-xl border bg-white p-4 dark:border-slate-800 dark:bg-slate-900">
        <p className="text-sm text-slate-500 dark:text-slate-400">
          Total Sales
        </p>
        <h2 className="text-2xl font-bold text-slate-900 dark:text-white">
          ₱{totalSales.toLocaleString()}
        </h2>
      </div>

      <div className="flex flex-col justify-between gap-3 sm:flex-row">
        <div className="flex items-center gap-2 rounded-xl border px-3 py-2 dark:border-slate-700">
          <Search size={16} />
          <input
            placeholder="Search customer..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-transparent text-sm outline-none dark:text-white"
          />
        </div>

        <div className="flex flex-wrap gap-2">
          {["All", "Completed", "Refunded", "Cancelled"].map((item) => (
            <button
              key={item}
              onClick={() => setStatus(item)}
              className={`rounded px-3 py-1 text-xs ${
                status === item
                  ? "bg-indigo-600 text-white"
                  : "border dark:border-slate-700 dark:text-white"
              }`}
            >
              {item}
            </button>
          ))}
        </div>
      </div>

      <div className="rounded-xl border bg-white p-4 dark:border-slate-800 dark:bg-slate-900">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[760px] text-xs sm:text-sm">
            <thead>
              <tr className="border-b dark:border-slate-800">
                <th className="py-2 text-left">Customer</th>
                <th className="text-left">Amount</th>
                <th className="text-left">Payment</th>
                <th className="text-left">Status</th>
                <th className="text-left">Date</th>
                <th className="text-right">Action</th>
              </tr>
            </thead>

            <tbody>
              {filtered.map((sale) => (
                <tr key={sale.id} className="border-b dark:border-slate-800">
                  <td className="py-3 font-semibold text-slate-900 dark:text-white">
                    {sale.customer_name || "Walk-in Customer"}
                  </td>

                  <td className="text-slate-700 dark:text-slate-300">
                    ₱{Number(sale.total_amount || 0).toLocaleString()}
                  </td>

                  <td className="text-slate-700 dark:text-slate-300">
                    {sale.payment_method}
                  </td>

                  <td>
                    <span
                      className={`rounded-full px-3 py-1 text-xs font-bold ${
                        sale.status === "Completed"
                          ? "bg-green-100 text-green-600"
                          : sale.status === "Refunded"
                          ? "bg-yellow-100 text-yellow-600"
                          : "bg-red-100 text-red-600"
                      }`}
                    >
                      {sale.status}
                    </span>
                  </td>

                  <td className="text-slate-700 dark:text-slate-300">
                    {sale.created_at
                      ? new Date(sale.created_at).toLocaleString()
                      : "N/A"}
                  </td>

                  <td className="text-right">
                    <button
                      onClick={() => openDetails(sale)}
                      className="rounded border px-2 py-1 dark:border-slate-700 dark:text-white"
                    >
                      <Eye size={16} />
                    </button>
                  </td>
                </tr>
              ))}

              {filtered.length === 0 && (
                <tr>
                  <td
                    colSpan="6"
                    className="py-6 text-center text-slate-500 dark:text-slate-400"
                  >
                    No sales found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {selected && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-3">
          <div className="w-full max-w-md rounded-xl bg-white p-4 dark:bg-slate-900">
            <div className="mb-3 flex justify-between">
              <h2 className="font-bold text-slate-900 dark:text-white">
                Sale Details
              </h2>
              <button onClick={() => setSelected(null)}>
                <X size={16} />
              </button>
            </div>

            <p className="mb-2 text-sm dark:text-white">
              Customer:{" "}
              <strong>{selected.customer_name || "Walk-in Customer"}</strong>
            </p>

            <p className="mb-2 text-sm dark:text-white">
              Payment: {selected.payment_method}
            </p>

            <p className="mb-3 text-sm dark:text-white">
              Total: ₱{Number(selected.total_amount || 0).toLocaleString()}
            </p>

            <div className="border-t pt-2 dark:border-slate-800">
              <p className="mb-2 text-sm font-bold dark:text-white">Items</p>

              {detailsLoading ? (
                <p className="text-sm text-slate-500">Loading items...</p>
              ) : selectedItems.length === 0 ? (
                <p className="text-sm text-slate-500">No items found.</p>
              ) : (
                selectedItems.map((item) => (
                  <div
                    key={item.id}
                    className="mb-2 flex justify-between text-sm dark:text-white"
                  >
                    <span>
                      {item.product_name} x{item.quantity}
                    </span>
                    <span>
                      ₱{Number(item.subtotal || 0).toLocaleString()}
                    </span>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
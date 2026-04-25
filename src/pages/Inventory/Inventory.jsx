import api from "../../api/axios";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";

export default function Inventory() {
  const [inventory, setInventory] = useState([]);
  const [loading, setLoading] = useState(true);

  const [currentPage, setCurrentPage] = useState(1);
  const perPage = 8;



  const fetchInventory = async () => {
    try {
      const res = await api.get("/products/inventory");
      setInventory(res.data);
    } catch (err) {
      console.error(err);
      toast.error("Failed to load inventory");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInventory();
  }, []);

  const totalPages = Math.max(1, Math.ceil(inventory.length / perPage));
  const start = (currentPage - 1) * perPage;
  const paginated = inventory.slice(start, start + perPage);

  const handleUpdate = async (item) => {
    const loadingToast = toast.loading("Updating inventory...");

    try {
      await api.put(`/products/inventory/${item.id}`, {
        stock: Number(item.stock || 0),
        reorder_level: Number(item.reorder_level || 0),
      });

      toast.success("Inventory updated", { id: loadingToast });
      await fetchInventory();
    } catch (err) {
      console.error(err);
      toast.error(err.response?.data?.error || "Update failed", {
        id: loadingToast,
      });
    }
  };

  const updateLocalItem = (id, field, value) => {
    setInventory((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, [field]: value } : item
      )
    );
  };

  if (loading) {
    return <p className="p-6 dark:text-white">Loading inventory...</p>;
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900 dark:text-white">
          Inventory
        </h1>
        <p className="text-sm text-slate-500 dark:text-slate-400">
          Manage product stock and reorder levels
        </p>
      </div>

      <div className="rounded-xl border bg-white p-4 dark:border-slate-800 dark:bg-slate-900">
        <div className="overflow-x-auto">
          <table className="w-full min-w-175 text-sm">
            <thead>
              <tr className="border-b dark:border-slate-800">
                <th className="py-2 text-left">Product</th>
                <th className="text-left">Category</th>
                <th className="text-left">Stock</th>
                <th className="text-left">Reorder</th>
                <th className="text-right">Action</th>
              </tr>
            </thead>

            <tbody>
              {paginated.map((item) => (
                <tr key={item.id} className="border-b dark:border-slate-800">
                  <td className="py-3 text-slate-900 dark:text-white">
                    {item.name}
                  </td>

                  <td className="text-slate-600 dark:text-slate-300">
                    {item.category}
                  </td>

                  <td>
                    <input
                      type="number"
                      value={item.stock ?? ""}
                      onChange={(e) =>
                        updateLocalItem(item.id, "stock", e.target.value)
                      }
                      className="w-24 rounded border p-2 dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                    />
                  </td>

                  <td>
                    <input
                      type="number"
                      value={item.reorder_level ?? ""}
                      onChange={(e) =>
                        updateLocalItem(
                          item.id,
                          "reorder_level",
                          e.target.value
                        )
                      }
                      className="w-24 rounded border p-2 dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                    />
                  </td>

                  <td className="text-right">
                    <button
                      onClick={() => handleUpdate(item)}
                      className="rounded bg-indigo-600 px-3 py-2 text-sm font-semibold text-white hover:bg-indigo-700"
                    >
                      Save
                    </button>
                  </td>
                </tr>
              ))}

              {paginated.length === 0 && (
                <tr>
                  <td
                    colSpan="5"
                    className="py-6 text-center text-slate-500 dark:text-slate-400"
                  >
                    No inventory found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        <div className="mt-4 flex items-center justify-end gap-3">
          <button
            disabled={currentPage === 1}
            onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
            className="rounded border px-3 py-1 disabled:opacity-50 dark:border-slate-700"
          >
            Prev
          </button>

          <span className="text-sm dark:text-white">
            {currentPage} / {totalPages}
          </span>

          <button
            disabled={currentPage === totalPages}
            onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
            className="rounded border px-3 py-1 disabled:opacity-50 dark:border-slate-700"
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
}
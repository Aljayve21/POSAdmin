import api from "../../api/axios";
import { Edit, Plus, Search, Trash2, X } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import toast from "react-hot-toast";

const emptyForm = {
  name: "",
  phone: "",
};

export default function Customers() {
  const [customers, setCustomers] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);

  const [modalOpen, setModalOpen] = useState(false);
  const [editingCustomer, setEditingCustomer] = useState(null);
  const [form, setForm] = useState(emptyForm);

  const fetchCustomers = async () => {
    try {
      const res = await api.get("/customers");
      setCustomers(res.data);
    } catch (err) {
      console.error(err);
      toast.error("Failed to load customers");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCustomers();
  }, []);

  const filteredCustomers = useMemo(() => {
    return customers.filter((customer) => {
      const name = customer.name || "";
      const phone = customer.phone || "";

      return (
        name.toLowerCase().includes(search.toLowerCase()) ||
        phone.toLowerCase().includes(search.toLowerCase())
      );
    });
  }, [customers, search]);

  const openAddModal = () => {
    setEditingCustomer(null);
    setForm(emptyForm);
    setModalOpen(true);
  };

  const openEditModal = (customer) => {
    setEditingCustomer(customer);
    setForm({
      name: customer.name || "",
      phone: customer.phone || "",
    });
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
    setEditingCustomer(null);
    setForm(emptyForm);
  };

  const handleChange = (field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleSave = async (e) => {
    e.preventDefault();

    if (!form.name.trim()) {
      toast.error("Customer name is required");
      return;
    }

    const loadingToast = toast.loading(
      editingCustomer ? "Updating customer..." : "Adding customer..."
    );

    try {
      if (editingCustomer) {
        await api.put(`/customers/${editingCustomer.id}`, form);
        toast.success("Customer updated successfully", { id: loadingToast });
      } else {
        await api.post("/customers", form);
        toast.success("Customer added successfully", { id: loadingToast });
      }

      await fetchCustomers();
      closeModal();
    } catch (err) {
      console.error(err);
      toast.error(err.response?.data?.error || "Something went wrong", {
        id: loadingToast,
      });
    }
  };

  const handleDelete = async (id) => {
    if (!confirm("Delete this customer?")) return;

    const loadingToast = toast.loading("Deleting customer...");

    try {
      await api.delete(`/customers/${id}`);
      toast.success("Customer deleted successfully", { id: loadingToast });
      await fetchCustomers();
    } catch (err) {
      console.error(err);
      toast.error(err.response?.data?.error || "Delete failed", {
        id: loadingToast,
      });
    }
  };

  if (loading) {
    return <p className="p-6 dark:text-white">Loading customers...</p>;
  }

  return (
    <div className="space-y-4 sm:space-y-6">
      <div className="flex items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">
            Customers
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400">
            Manage customers and their utang balance
          </p>
        </div>

        <button
          onClick={openAddModal}
          className="flex items-center gap-2 rounded-xl bg-indigo-600 px-4 py-2 text-white hover:bg-indigo-700"
        >
          <Plus size={16} />
          Add Customer
        </button>
      </div>

      <div className="flex items-center gap-2 rounded-xl border px-3 py-2 dark:border-slate-700">
        <Search size={16} />
        <input
          placeholder="Search customer or phone..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full bg-transparent text-sm outline-none dark:text-white"
        />
      </div>

      <div className="rounded-xl border bg-white p-4 dark:border-slate-800 dark:bg-slate-900">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[700px] text-xs sm:text-sm">
            <thead>
              <tr className="border-b dark:border-slate-800">
                <th className="py-2 text-left">Customer</th>
                <th className="text-left">Phone</th>
                <th className="text-left">Transactions</th>
                <th className="text-left">Total Utang</th>
                <th className="text-right">Action</th>
              </tr>
            </thead>

            <tbody>
              {filteredCustomers.map((customer) => (
                <tr
                  key={customer.id}
                  className="border-b dark:border-slate-800"
                >
                  <td className="py-3 font-semibold text-slate-900 dark:text-white">
                    {customer.name}
                  </td>

                  <td className="text-slate-600 dark:text-slate-300">
                    {customer.phone || "N/A"}
                  </td>

                  <td className="text-slate-600 dark:text-slate-300">
                    {customer.total_transactions || 0}
                  </td>

                  <td>
                    <span
                      className={`rounded-full px-3 py-1 text-xs font-bold ${
                        Number(customer.total_utang) > 0
                          ? "bg-red-50 text-red-600 dark:bg-red-500/10 dark:text-red-400"
                          : "bg-emerald-50 text-emerald-600 dark:bg-emerald-500/10 dark:text-emerald-400"
                      }`}
                    >
                      ₱{Number(customer.total_utang || 0).toLocaleString()}
                    </span>
                  </td>

                  <td className="text-right">
                    <div className="flex justify-end gap-2">
                      <button
                        onClick={() => openEditModal(customer)}
                        className="rounded border px-2 py-1 dark:border-slate-700"
                      >
                        <Edit size={16} />
                      </button>

                      <button
                        onClick={() => handleDelete(customer.id)}
                        className="rounded border px-2 py-1 text-red-600 dark:border-slate-700"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}

              {filteredCustomers.length === 0 && (
                <tr>
                  <td
                    colSpan="5"
                    className="py-6 text-center text-slate-500 dark:text-slate-400"
                  >
                    No customers found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {modalOpen && (
        <CustomerModal
          form={form}
          editing={editingCustomer}
          onChange={handleChange}
          onClose={closeModal}
          onSave={handleSave}
        />
      )}
    </div>
  );
}

function CustomerModal({ form, editing, onChange, onClose, onSave }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-black/40 px-3 py-4">
      <form
        onSubmit={onSave}
        className="w-full max-w-md space-y-3 rounded-xl bg-white p-4 dark:bg-slate-900"
      >
        <div className="flex justify-between">
          <h2 className="font-bold text-slate-900 dark:text-white">
            {editing ? "Edit Customer" : "Add Customer"}
          </h2>

          <button type="button" onClick={onClose}>
            <X size={16} />
          </button>
        </div>

        <input
          placeholder="Customer Name"
          value={form.name}
          onChange={(e) => onChange("name", e.target.value)}
          className="w-full rounded border p-2 dark:border-slate-700 dark:bg-slate-800 dark:text-white"
        />

        <input
          placeholder="Phone Number"
          value={form.phone}
          onChange={(e) => onChange("phone", e.target.value)}
          className="w-full rounded border p-2 dark:border-slate-700 dark:bg-slate-800 dark:text-white"
        />

        <div className="flex justify-end gap-2">
          <button type="button" onClick={onClose}>
            Cancel
          </button>

          <button className="rounded bg-indigo-600 px-3 py-1 text-white">
            Save
          </button>
        </div>
      </form>
    </div>
  );
}
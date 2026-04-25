import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import ProtectedRoute from "./components/ProtectedRoute";
import AdminLayout from "./layouts/AdminLayout";
import Products from "./pages/Products/Products";
import Inventory from "./pages/Inventory/Inventory";
import Customers from "./pages/Customers/Customers";
import Sales from "./pages/Sales/Sales";
import Payments from "./pages/Payments/Payments";
import Reports from "./pages/Reports/Reports";
import Profile from "./pages/Profile/Profile";
import { Toaster } from "react-hot-toast";
import Utang from "./pages/Utang/Utang";
import Login from "./pages/Login";
import { getAdminSession } from "./utils/auth";
import Dashboard from "./pages/Dashboard/Dashboard";

export default function App() {
  const session = getAdminSession();

  return (
    <>
      <Toaster position="top-right" />
      <BrowserRouter>
        <Routes>
          <Route
            path="/"
            element={
              <Navigate
                to={session?.user ? "/admin/dashboard" : "/login"}
                replace
              />
            }
          />

          <Route
            path="/login"
            element={
              session?.user ? <Navigate to="/admin/dashboard" replace /> : <Login />
            }
          />

          <Route element={<ProtectedRoute />}>
            <Route path="/admin" element={<AdminLayout />}>
              <Route path="dashboard" element={<Dashboard />} />
              <Route path="products" element={<Products />} />
              <Route path="inventory" element={<Inventory />} />
              <Route path="customers" element={<Customers />} />
              <Route path="sales" element={<Sales />} />
              <Route path="utang" element={<Utang />} />
              <Route path="payments" element={<Payments />} />
              <Route path="reports" element={<Reports />} />
              <Route path="profile" element={<Profile />} />
            </Route>
          </Route>
        </Routes>
      </BrowserRouter>
    </>
  );
}

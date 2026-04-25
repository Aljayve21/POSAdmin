import { Navigate, Outlet, useLocation } from "react-router-dom";
import { getAdminSession } from "../utils/auth";

export default function ProtectedRoute() {
  const location = useLocation();
  const session = getAdminSession();

  if (!session?.user || session.user.role !== "admin") {
    return <Navigate to="/login" replace state={{ from: location }} />;
  }

  return <Outlet />;
}

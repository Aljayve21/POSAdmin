import api from "../api/axios";
import { useState } from "react";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { setAdminSession } from "../utils/auth";

export default function Login() {
    const navigate = useNavigate();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);

    const handleLogin = async (e) => {
        e.preventDefault();

        try {
            setLoading(true);

            const res = await api.post("/auth/login", {
                email,
                password,
                role: "admin",
            });

            setAdminSession(res.data);
            toast.success("Welcome back, admin");
            navigate("/admin/dashboard", { replace: true });
        } catch (error) {
            const message =
                error.response?.data?.error || "Failed to login as admin";
            toast.error(message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
            <div className="w-full max-w-md bg-white rounded-2xl shadow-lg p-8">
                <div className="text-center mb-6">
                    <h1 className="text-3xl font-bold text-purple-600">
                        Smart POS
                    </h1>
                    <p className="text-gray-500 text-sm mt-1">
                        Admin Dashboard Login
                    </p>
                </div>

                <form onSubmit={handleLogin} className="space-y-5">
                    <div>
                        <label className="text-sm text-gray-600">Email</label>
                        <input
                            type="email"
                            placeholder="admin@pos.com"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full mt-1 px-4 py-3 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-purple-500"
                            required
                        />
                    </div>

                    <div>
                        <label className="text-sm text-gray-600">Password</label>
                        <input
                            type="password"
                            placeholder="Enter your password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full mt-1 px-4 py-3 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-purple-500"
                            required
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-purple-600 hover:bg-purple-700 disabled:opacity-70 text-white font-semibold py-3 rounded-xl transition"
                    >
                        {loading ? "Signing in..." : "Login"}
                    </button>
                </form>

                <div className="mt-6 rounded-xl bg-slate-50 p-4 text-sm text-slate-600">
                    <p className="font-semibold text-slate-800">Default Admin Account</p>
                    <p>Email: admin@pos.com</p>
                    <p>Password: 123456</p>
                </div>

                <p className="text-center text-gray-400 text-xs mt-6">
                    2026 Smart POS System
                </p>
            </div>
        </div>
    );
}

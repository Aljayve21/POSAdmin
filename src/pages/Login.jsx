import { useState } from "react";

export default function Login() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const handleLogin = (e) => {
        e.preventDefault();
        console.log({ email, password });
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
            <div className="w-full max-w-md bg-white rounded-2xl shadow-lg p-8">

                {/* Logo / Title */}
                <div className="text-center mb-6">
                    <h1 className="text-3xl font-bold text-purple-600">
                        Smart POS
                    </h1>
                    <p className="text-gray-500 text-sm mt-1">
                        Admin Dashboard Login
                    </p>
                </div>

                {/* Form */}
                <form onSubmit={handleLogin} className="space-y-5">

                    {/* Email */}
                    <div>
                        <label className="text-sm text-gray-600">Email</label>
                        <input
                            type="email"
                            placeholder="admin@email.com"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full mt-1 px-4 py-3 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-purple-500"
                            required
                        />
                    </div>

                    {/* Password */}
                    <div>
                        <label className="text-sm text-gray-600">Password</label>
                        <input
                            type="password"
                            placeholder="••••••••"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full mt-1 px-4 py-3 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-purple-500"
                            required
                        />
                    </div>

                    {/* Button */}
                    <button
                        type="submit"
                        className="w-full bg-purple-600 hover:bg-purple-700 text-white font-semibold py-3 rounded-xl transition"
                    >
                        Login
                    </button>
                </form>

                {/* Footer */}
                <p className="text-center text-gray-400 text-xs mt-6">
                    © 2026 Smart POS System
                </p>
            </div>
        </div>
    );
}
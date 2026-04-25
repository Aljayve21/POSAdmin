import {
    Bell,
    Box,
    ChevronDown,
    CircleUserRound,
    CoinsIcon,
    CreditCard,
    Grid2X2,
    LayoutDashboard,
    Menu,
    Moon,
    Package,
    Search,
    ShoppingCart,
    Sun,
    Users,
    X,
} from "lucide-react";

import { useEffect, useState } from "react";
import { NavLink, Outlet } from "react-router-dom";
import { businessSettings } from "../data/mockData";

const menu = [
    { label: "Dashboard", icon: LayoutDashboard, path: "/admin/dashboard" },
    { label: "Products", icon: Box, path: "/admin/products" },
    { label: "Inventory", icon: Package, path: "/admin/inventory" },
    { label: "Customers", icon: Users, path: "/admin/customers" },
    { label: "Sales", icon: ShoppingCart, path: "/admin/sales" },
    { label: "Utang", icon: CoinsIcon, path: "/admin/utang" },
    { label: "Payments", icon: CreditCard, path: "/admin/payments" },
    { label: "Reports", icon: Grid2X2, path: "/admin/reports" },
    { label: "Profile", icon: CircleUserRound, path: "/admin/profile" },
];

export default function AdminLayout() {
    const [sidebarOpen, setSidebarOpen] = useState(false);

    const [darkMode, setDarkMode] = useState(() => {
        return (
            localStorage.theme === "dark" ||
            (!("theme" in localStorage) &&
                window.matchMedia("(prefers-color-scheme: dark)").matches)
        );
    });

    useEffect(() => {
        document.documentElement.classList.toggle("dark", darkMode);
        localStorage.theme = darkMode ? "dark" : "light";
    }, [darkMode]);

    return (
        <div className="min-h-screen bg-[#F7F8FA] text-slate-800 dark:bg-slate-950 dark:text-white">
            {sidebarOpen && (
                <div
                    className="fixed inset-0 z-30 bg-black/40 lg:hidden"
                    onClick={() => setSidebarOpen(false)}
                />
            )}

            <div className="flex">
                <aside
                    className={`
            fixed left-0 top-0 z-40 h-full w-[260px]
            border-r border-slate-200 bg-white p-4
            transform transition-transform duration-300
            dark:border-slate-800 dark:bg-slate-900
            ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}
            lg:static lg:translate-x-0
          `}
                >
                    <div className="mb-6 flex min-w-0 items-center justify-between gap-2">
                        <div className="flex min-w-0 items-center gap-3">
                            <img
                                src={businessSettings.logo}
                                alt="Business logo"
                                className="h-10 w-10 shrink-0 rounded-xl object-cover"
                            />

                            <div className="min-w-0 flex-1">
                                <h1
                                    title={businessSettings.business_name}
                                    className="truncate text-sm font-bold leading-5 text-slate-900 dark:text-white"
                                >
                                    {businessSettings.business_name}
                                </h1>
                                <p className="truncate text-xs text-slate-500 dark:text-slate-400">
                                    Admin Panel
                                </p>
                            </div>
                        </div>

                        <button
                            className="shrink-0 rounded-lg p-2 text-slate-500 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800 lg:hidden"
                            onClick={() => setSidebarOpen(false)}
                        >
                            <X size={20} />
                        </button>
                    </div>

                    <nav className="h-[calc(100vh-88px)] space-y-2 overflow-y-auto pr-1">
                        {menu.map((item) => {
                            const Icon = item.icon;

                            return (
                                <NavLink
                                    key={item.path}
                                    to={item.path}
                                    onClick={() => setSidebarOpen(false)}
                                    className={({ isActive }) =>
                                        `flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-semibold transition ${isActive
                                            ? "bg-indigo-50 text-indigo-600 dark:bg-indigo-500/10 dark:text-indigo-400"
                                            : "text-slate-600 hover:bg-slate-50 dark:text-slate-300 dark:hover:bg-slate-800"
                                        }`
                                    }
                                >
                                    <Icon size={18} className="shrink-0" />
                                    <span className="truncate">{item.label}</span>
                                </NavLink>
                            );
                        })}
                    </nav>
                </aside>

                <div className="min-h-screen min-w-0 flex-1">
                    <header className="sticky top-0 z-20 flex h-[70px] items-center justify-between border-b border-slate-200 bg-white px-3 dark:border-slate-800 dark:bg-slate-900 sm:px-4 md:px-6">
                        <div className="flex min-w-0 items-center gap-3">
                            <button
                                onClick={() => setSidebarOpen(true)}
                                className="rounded-xl border border-slate-200 p-2 text-slate-500 hover:bg-slate-50 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800 lg:hidden"
                            >
                                <Menu size={20} />
                            </button>

                            <div className="hidden items-center gap-2 rounded-xl border border-slate-200 px-3 py-2 dark:border-slate-700 md:flex">
                                <Search size={16} className="text-slate-400" />
                                <input
                                    placeholder="Search..."
                                    className="w-[220px] bg-transparent text-sm outline-none placeholder:text-slate-400 lg:w-[360px]"
                                />
                            </div>
                        </div>

                        <div className="flex items-center gap-2 sm:gap-3">
                            <button
                                onClick={() => setDarkMode(!darkMode)}
                                className="rounded-full border border-slate-200 p-2 text-slate-500 hover:bg-slate-50 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800"
                            >
                                {darkMode ? <Sun size={18} /> : <Moon size={18} />}
                            </button>

                            <button className="relative rounded-full border border-slate-200 p-2 text-slate-500 hover:bg-slate-50 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800">
                                <Bell size={18} />
                                <span className="absolute right-1.5 top-1.5 h-2 w-2 rounded-full bg-orange-400" />
                            </button>

                            <div className="flex min-w-0 items-center gap-2">
                                <div className="h-9 w-9 shrink-0 rounded-full bg-indigo-200 dark:bg-indigo-900" />
                                <div className="hidden min-w-0 sm:block">
                                    <p className="truncate text-sm font-bold text-slate-900 dark:text-white">
                                        Admin
                                    </p>
                                    <p className="truncate text-xs text-slate-500 dark:text-slate-400">
                                        Owner
                                    </p>
                                </div>
                                <ChevronDown size={14} className="hidden shrink-0 text-slate-500 sm:block" />
                            </div>
                        </div>
                    </header>

                    <div className="p-3 sm:p-4 md:p-6">
                        <Outlet />
                    </div>
                </div>
            </div>
        </div>
    );
}
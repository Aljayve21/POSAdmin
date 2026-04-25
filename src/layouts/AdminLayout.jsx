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

import api from "../api/axios";
import { useCallback, useEffect, useMemo, useState } from "react";
import { NavLink, Outlet, useLocation, useNavigate } from "react-router-dom";
import { clearAdminSession, getAdminSession } from "../utils/auth";

const menu = [
    { label: "Dashboard", icon: LayoutDashboard, path: "/admin/dashboard", keywords: ["home", "overview"] },
    { label: "Products", icon: Box, path: "/admin/products", keywords: ["items", "catalog"] },
    { label: "Inventory", icon: Package, path: "/admin/inventory", keywords: ["stocks", "stock"] },
    { label: "Customers", icon: Users, path: "/admin/customers", keywords: ["clients", "buyers"] },
    { label: "Sales", icon: ShoppingCart, path: "/admin/sales", keywords: ["transactions", "orders"] },
    { label: "Utang", icon: CoinsIcon, path: "/admin/utang", keywords: ["debt", "receivables"] },
    { label: "Payments", icon: CreditCard, path: "/admin/payments", keywords: ["collections", "paid"] },
    { label: "Reports", icon: Grid2X2, path: "/admin/reports", keywords: ["analytics", "summary"] },
    { label: "Profile", icon: CircleUserRound, path: "/admin/profile", keywords: ["business", "settings", "account"] },
];

const defaultBusiness = {
    business_name: "Riead Store POS",
    logo_path: "",
};

const fallbackLogo = `data:image/svg+xml;utf8,${encodeURIComponent(`
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 120 120">
  <rect width="120" height="120" rx="28" fill="#EEF2FF" />
  <text x="50%" y="53%" dominant-baseline="middle" text-anchor="middle" font-family="Arial" font-size="34" font-weight="700" fill="#4338CA">POS</text>
</svg>
`)}`;

export default function AdminLayout() {
    const navigate = useNavigate();
    const location = useLocation();
    const session = getAdminSession();

    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [business, setBusiness] = useState(defaultBusiness);
    const [topSearch, setTopSearch] = useState("");
    const [quickPanelOpen, setQuickPanelOpen] = useState(false);
    const [darkMode, setDarkMode] = useState(() => {
        return (
            localStorage.theme === "dark" ||
            (!("theme" in localStorage) &&
                window.matchMedia("(prefers-color-scheme: dark)").matches)
        );
    });

    const loadBusinessSettings = useCallback(async () => {
        try {
            const response = await api.get("/profile/business-settings");
            setBusiness({
                business_name: response.data.business_name || defaultBusiness.business_name,
                logo_path: response.data.logo_path || "",
            });
        } catch (error) {
            console.error("Failed to load business settings", error);
        }
    }, []);

    useEffect(() => {
        document.documentElement.classList.toggle("dark", darkMode);
        localStorage.theme = darkMode ? "dark" : "light";
    }, [darkMode]);

    useEffect(() => {
        const timeoutId = setTimeout(() => {
            loadBusinessSettings();
        }, 0);

        return () => clearTimeout(timeoutId);
    }, [loadBusinessSettings]);

    useEffect(() => {
        const timeoutId = setTimeout(() => {
            setQuickPanelOpen(false);
            setSidebarOpen(false);
        }, 0);

        return () => clearTimeout(timeoutId);
    }, [location.pathname]);

    const filteredMenu = useMemo(() => {
        const query = topSearch.trim().toLowerCase();

        if (!query) {
            return [];
        }

        return menu.filter((item) => {
            const haystack = [item.label, ...(item.keywords || [])].join(" ").toLowerCase();
            return haystack.includes(query);
        }).slice(0, 5);
    }, [topSearch]);

    const brandName = business.business_name?.trim() || defaultBusiness.business_name;
    const logoSrc = business.logo_path || fallbackLogo;
    const adminName = session?.user?.name || "Admin";
    const adminRole = session?.user?.role || "admin";
    const adminInitial = adminName.charAt(0).toUpperCase();

    const handleLogout = () => {
        clearAdminSession();
        navigate("/login", { replace: true });
    };

    const handleSearchSubmit = (query = topSearch) => {
        const normalized = query.trim().toLowerCase();

        if (!normalized) {
            return;
        }

        const match = menu.find((item) => {
            const haystack = [item.label, ...(item.keywords || [])].join(" ").toLowerCase();
            return haystack.includes(normalized) || normalized.includes(item.label.toLowerCase());
        });

        if (match) {
            navigate(match.path);
        }

        setTopSearch("");
    };

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
                    className={`fixed left-0 top-0 z-40 h-full w-[260px] border-r border-slate-200 bg-white p-4 transform transition-transform duration-300 dark:border-slate-800 dark:bg-slate-900 ${sidebarOpen ? "translate-x-0" : "-translate-x-full"} lg:static lg:translate-x-0`}
                >
                    <button
                        type="button"
                        onClick={() => navigate("/admin/profile")}
                        className="mb-6 flex w-full min-w-0 items-center justify-between gap-2 rounded-2xl border border-slate-200 p-3 text-left hover:bg-slate-50 dark:border-slate-800 dark:hover:bg-slate-800/80"
                    >
                        <div className="flex min-w-0 items-center gap-3">
                            <img
                                src={logoSrc}
                                alt="Business logo"
                                className="h-12 w-12 shrink-0 rounded-xl object-cover"
                            />

                            <div className="min-w-0 flex-1">
                                <h1
                                    title={brandName}
                                    className="truncate text-sm font-bold leading-5 text-slate-900 dark:text-white"
                                >
                                    {brandName}
                                </h1>
                                <p className="truncate text-xs text-slate-500 dark:text-slate-400">
                                    Business Settings
                                </p>
                            </div>
                        </div>

                        <span className="shrink-0 rounded-lg p-2 text-slate-500 dark:text-slate-300 lg:hidden">
                            <X size={20} />
                        </span>
                    </button>

                    <nav className="h-[calc(100vh-110px)] space-y-2 overflow-y-auto pr-1">
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
                    <header className="sticky top-0 z-20 border-b border-slate-200 bg-white px-3 py-3 dark:border-slate-800 dark:bg-slate-900 sm:px-4 md:px-6">
                        <div className="flex flex-wrap items-center justify-between gap-3">
                            <div className="flex min-w-0 flex-1 items-center gap-3">
                                <button
                                    type="button"
                                    onClick={() => setSidebarOpen(true)}
                                    className="rounded-xl border border-slate-200 p-2 text-slate-500 hover:bg-slate-50 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800 lg:hidden"
                                >
                                    <Menu size={20} />
                                </button>

                                <button
                                    type="button"
                                    onClick={() => navigate("/admin/profile")}
                                    className="hidden min-w-0 items-center gap-3 rounded-2xl border border-slate-200 px-3 py-2 text-left hover:bg-slate-50 dark:border-slate-700 dark:hover:bg-slate-800 md:flex"
                                >
                                    <img src={logoSrc} alt="Business logo" className="h-10 w-10 rounded-xl object-cover" />
                                    <div className="min-w-0">
                                        <p className="truncate text-sm font-bold text-slate-900 dark:text-white">{brandName}</p>
                                        <p className="truncate text-xs text-slate-500 dark:text-slate-400">Admin workspace</p>
                                    </div>
                                </button>

                                <div className="relative flex-1">
                                    <div className="flex items-center gap-2 rounded-xl border border-slate-200 px-3 py-2 dark:border-slate-700">
                                        <Search size={16} className="text-slate-400" />
                                        <input
                                            placeholder="Search admin pages..."
                                            value={topSearch}
                                            onChange={(event) => setTopSearch(event.target.value)}
                                            onKeyDown={(event) => {
                                                if (event.key === "Enter") {
                                                    handleSearchSubmit();
                                                }
                                            }}
                                            className="w-full bg-transparent text-sm outline-none placeholder:text-slate-400"
                                        />
                                        <button
                                            type="button"
                                            onClick={() => handleSearchSubmit()}
                                            className="rounded-lg px-2 py-1 text-xs font-semibold text-indigo-600 hover:bg-indigo-50 dark:hover:bg-indigo-500/10"
                                        >
                                            Go
                                        </button>
                                    </div>

                                    {filteredMenu.length > 0 && (
                                        <div className="absolute left-0 right-0 top-[calc(100%+8px)] rounded-2xl border border-slate-200 bg-white p-2 shadow-lg dark:border-slate-700 dark:bg-slate-900">
                                            {filteredMenu.map((item) => (
                                                <button
                                                    key={item.path}
                                                    type="button"
                                                    onClick={() => handleSearchSubmit(item.label)}
                                                    className="flex w-full items-center justify-between rounded-xl px-3 py-2 text-left text-sm font-semibold text-slate-600 hover:bg-slate-50 dark:text-slate-200 dark:hover:bg-slate-800"
                                                >
                                                    <span>{item.label}</span>
                                                    <span className="text-xs text-slate-400">Open</span>
                                                </button>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            </div>

                            <div className="flex items-center gap-2 sm:gap-3">
                                <button
                                    type="button"
                                    onClick={() => setDarkMode(!darkMode)}
                                    className="rounded-full border border-slate-200 p-2 text-slate-500 hover:bg-slate-50 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800"
                                >
                                    {darkMode ? <Sun size={18} /> : <Moon size={18} />}
                                </button>

                                <div className="relative">
                                    <button
                                        type="button"
                                        onClick={() => setQuickPanelOpen((current) => !current)}
                                        className="relative rounded-full border border-slate-200 p-2 text-slate-500 hover:bg-slate-50 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800"
                                    >
                                        <Bell size={18} />
                                        <span className="absolute right-1.5 top-1.5 h-2 w-2 rounded-full bg-orange-400" />
                                    </button>

                                    {quickPanelOpen && (
                                        <div className="absolute right-0 top-[calc(100%+10px)] w-64 rounded-2xl border border-slate-200 bg-white p-3 shadow-xl dark:border-slate-700 dark:bg-slate-900">
                                            <p className="mb-2 text-xs font-semibold uppercase tracking-[0.2em] text-slate-400">
                                                Quick Actions
                                            </p>

                                            {[
                                                { label: "Open Business Profile", path: "/admin/profile" },
                                                { label: "Review Reports", path: "/admin/reports" },
                                                { label: "Check Payments", path: "/admin/payments" },
                                            ].map((item) => (
                                                <button
                                                    key={item.path}
                                                    type="button"
                                                    onClick={() => navigate(item.path)}
                                                    className="mb-1 flex w-full items-center justify-between rounded-xl px-3 py-2 text-left text-sm font-semibold text-slate-600 hover:bg-slate-50 dark:text-slate-200 dark:hover:bg-slate-800"
                                                >
                                                    <span>{item.label}</span>
                                                    <ChevronDown size={14} className="rotate-[-90deg] text-slate-400" />
                                                </button>
                                            ))}

                                            <button
                                                type="button"
                                                onClick={handleLogout}
                                                className="mt-2 w-full rounded-xl border border-rose-200 px-3 py-2 text-sm font-semibold text-rose-600 hover:bg-rose-50 dark:border-rose-500/30 dark:hover:bg-rose-500/10"
                                            >
                                                Logout
                                            </button>
                                        </div>
                                    )}
                                </div>

                                <button
                                    type="button"
                                    onClick={() => navigate("/admin/profile")}
                                    className="flex min-w-0 items-center gap-2 rounded-2xl border border-slate-200 px-2 py-1.5 text-left hover:bg-slate-50 dark:border-slate-700 dark:hover:bg-slate-800"
                                >
                                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-indigo-200 font-bold text-indigo-700 dark:bg-indigo-900 dark:text-indigo-200">
                                        {adminInitial}
                                    </div>
                                    <div className="hidden min-w-0 sm:block">
                                        <p className="truncate text-sm font-bold text-slate-900 dark:text-white">
                                            {adminName}
                                        </p>
                                        <p className="truncate text-xs text-slate-500 dark:text-slate-400">
                                            {adminRole}
                                        </p>
                                    </div>
                                    <ChevronDown size={14} className="hidden shrink-0 text-slate-500 sm:block" />
                                </button>
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

import { businessSettings } from "../../data/mockData";
import { useState } from "react";

export default function Profile() {
    const [form, setForm] = useState({
        business_name: businessSettings.business_name,
        logo: businessSettings.logo,
        address: businessSettings.address,
        contact_number: businessSettings.contact_number,
        admin_name: "Admin User",
        email: "admin@email.com",
        current_password: "",
        new_password: "",
        confirm_password: "",
    });

    const handleChange = (key, value) => {
        setForm((prev) => ({ ...prev, [key]: value }));
    };

    const handleLogoUpload = (e) => {
        const file = e.target.files[0];
        if (!file) return;

        const reader = new FileReader();

        reader.onloadend = () => {
            handleChange("logo", reader.result);
        };

        reader.readAsDataURL(file);
    };

    const handleSaveBusiness = (e) => {
        e.preventDefault();
        console.log("Business saved:", form);
        alert("Business profile updated. Mock only muna.");
    };

    const handleSaveAccount = (e) => {
        e.preventDefault();
        console.log("Account saved:", form);
        alert("Admin account updated. Mock only muna.");
    };

    const handleChangePassword = (e) => {
        e.preventDefault();

        if (form.new_password !== form.confirm_password) {
            alert("New password and confirm password do not match.");
            return;
        }

        console.log("Password changed mock");
        alert("Password updated. Mock only muna.");

        setForm((prev) => ({
            ...prev,
            current_password: "",
            new_password: "",
            confirm_password: "",
        }));
    };

    return (
        <div className="space-y-4 sm:space-y-6">
            <div>
                <h1 className="text-2xl font-bold text-slate-900 dark:text-white">
                    Profile
                </h1>
                <p className="text-sm text-slate-500 dark:text-slate-400">
                    Manage your business branding and admin account.
                </p>
            </div>

            <form
                onSubmit={handleSaveBusiness}
                className="rounded-2xl border border-slate-200 bg-white p-4 dark:border-slate-800 dark:bg-slate-900 sm:p-6"
            >
                <h2 className="mb-4 text-lg font-bold text-slate-900 dark:text-white">
                    Business Information
                </h2>

                <div className="mb-5 flex flex-col gap-4 sm:flex-row sm:items-center">
                    <img
                        src={form.logo || "https://via.placeholder.com/120?text=LOGO"}
                        alt="Business Logo"
                        className="h-24 w-24 rounded-2xl object-cover ring-1 ring-slate-200 dark:ring-slate-700"
                    />

                    <div>
                        <label className="mb-2 block text-sm font-semibold text-slate-600 dark:text-slate-300">
                            Upload Business Logo
                        </label>

                        <input
                            type="file"
                            accept="image/*"
                            onChange={handleLogoUpload}
                            className="w-full text-sm text-slate-600 file:mr-4 file:rounded-xl file:border-0 file:bg-indigo-600 file:px-4 file:py-2 file:text-sm file:font-bold file:text-white hover:file:bg-indigo-700 dark:text-slate-300"
                        />

                        <p className="mt-2 text-xs text-slate-500 dark:text-slate-400">
                            PNG, JPG, or JPEG. Preview only muna habang mock data.
                        </p>
                    </div>
                </div>

                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                    <Input
                        label="Business Name"
                        value={form.business_name}
                        onChange={(v) => handleChange("business_name", v)}
                    />

                    <Input
                        label="Contact Number"
                        value={form.contact_number}
                        onChange={(v) => handleChange("contact_number", v)}
                    />

                    <div className="md:col-span-2">
                        <Input
                            label="Address"
                            value={form.address}
                            onChange={(v) => handleChange("address", v)}
                        />
                    </div>
                </div>

                <div className="mt-5 flex justify-end">
                    <button className="rounded-xl bg-indigo-600 px-5 py-3 text-sm font-bold text-white hover:bg-indigo-700">
                        Save Business Info
                    </button>
                </div>
            </form>

            <form
                onSubmit={handleSaveAccount}
                className="rounded-2xl border border-slate-200 bg-white p-4 dark:border-slate-800 dark:bg-slate-900 sm:p-6"
            >
                <h2 className="mb-4 text-lg font-bold text-slate-900 dark:text-white">
                    Admin Account
                </h2>

                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                    <Input
                        label="Full Name"
                        value={form.admin_name}
                        onChange={(v) => handleChange("admin_name", v)}
                    />

                    <Input
                        label="Email"
                        type="email"
                        value={form.email}
                        onChange={(v) => handleChange("email", v)}
                    />
                </div>

                <div className="mt-5 flex justify-end">
                    <button className="rounded-xl bg-indigo-600 px-5 py-3 text-sm font-bold text-white hover:bg-indigo-700">
                        Update Account
                    </button>
                </div>
            </form>

            <form
                onSubmit={handleChangePassword}
                className="rounded-2xl border border-slate-200 bg-white p-4 dark:border-slate-800 dark:bg-slate-900 sm:p-6"
            >
                <h2 className="mb-4 text-lg font-bold text-slate-900 dark:text-white">
                    Change Password
                </h2>

                <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                    <Input
                        label="Current Password"
                        type="password"
                        value={form.current_password}
                        onChange={(v) => handleChange("current_password", v)}
                    />

                    <Input
                        label="New Password"
                        type="password"
                        value={form.new_password}
                        onChange={(v) => handleChange("new_password", v)}
                    />

                    <Input
                        label="Confirm Password"
                        type="password"
                        value={form.confirm_password}
                        onChange={(v) => handleChange("confirm_password", v)}
                    />
                </div>

                <div className="mt-5 flex justify-end">
                    <button className="rounded-xl bg-red-600 px-5 py-3 text-sm font-bold text-white hover:bg-red-700">
                        Update Password
                    </button>
                </div>
            </form>
        </div>
    );
}

function Input({ label, value, onChange, type = "text" }) {
    return (
        <div>
            <label className="mb-2 block text-sm font-semibold text-slate-600 dark:text-slate-300">
                {label}
            </label>

            <input
                type={type}
                value={value || ""}
                onChange={(e) => onChange(e.target.value)}
                className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 dark:border-slate-700 dark:bg-slate-900 dark:text-white"
            />
        </div>
    );
}
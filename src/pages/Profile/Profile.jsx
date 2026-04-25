import api from "../../api/axios";
import { getAdminSession, updateAdminSessionUser } from "../../utils/auth";
import { useCallback, useEffect, useState } from "react";
import toast from "react-hot-toast";

export default function Profile() {
    const session = getAdminSession();
    const adminId = session?.user?.id;

    const [loading, setLoading] = useState(true);
    const [businessForm, setBusinessForm] = useState({
        business_name: "",
        logo_path: "",
        address: "",
        contact_number: "",
    });
    const [accountForm, setAccountForm] = useState({
        name: "",
        email: "",
    });
    const [passwordForm, setPasswordForm] = useState({
        current_password: "",
        new_password: "",
        confirm_password: "",
    });
    const [savingBusiness, setSavingBusiness] = useState(false);
    const [savingAccount, setSavingAccount] = useState(false);
    const [savingPassword, setSavingPassword] = useState(false);

    const loadProfile = useCallback(async () => {
        if (!adminId) {
            toast.error("Admin session not found");
            setLoading(false);
            return;
        }

        try {
            const [businessRes, userRes] = await Promise.all([
                api.get("/profile/business-settings"),
                api.get(`/profile/users/${adminId}`),
            ]);

            setBusinessForm({
                business_name: businessRes.data.business_name || "",
                logo_path: businessRes.data.logo_path || "",
                address: businessRes.data.address || "",
                contact_number: businessRes.data.contact_number || "",
            });

            setAccountForm({
                name: userRes.data.name || "",
                email: userRes.data.email || "",
            });
        } catch (error) {
            console.error(error);
            toast.error("Failed to load profile");
        } finally {
            setLoading(false);
        }
    }, [adminId]);

    useEffect(() => {
        const timeoutId = setTimeout(() => {
            loadProfile();
        }, 0);

        return () => clearTimeout(timeoutId);
    }, [loadProfile]);

    const handleBusinessChange = (key, value) => {
        setBusinessForm((prev) => ({ ...prev, [key]: value }));
    };

    const handleAccountChange = (key, value) => {
        setAccountForm((prev) => ({ ...prev, [key]: value }));
    };

    const handlePasswordChange = (key, value) => {
        setPasswordForm((prev) => ({ ...prev, [key]: value }));
    };

    const handleLogoUpload = (e) => {
        const file = e.target.files?.[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onloadend = () => {
            handleBusinessChange("logo_path", reader.result);
        };
        reader.readAsDataURL(file);
    };

    const handleSaveBusiness = async (e) => {
        e.preventDefault();

        try {
            setSavingBusiness(true);
            await api.put("/profile/business-settings", businessForm);
            toast.success("Business profile updated");
        } catch (error) {
            console.error(error);
            toast.error(error.response?.data?.error || "Failed to update business profile");
        } finally {
            setSavingBusiness(false);
        }
    };

    const handleSaveAccount = async (e) => {
        e.preventDefault();

        try {
            setSavingAccount(true);
            const res = await api.put(`/profile/users/${adminId}`, accountForm);
            updateAdminSessionUser(res.data.user);
            toast.success("Admin account updated");
        } catch (error) {
            console.error(error);
            toast.error(error.response?.data?.error || "Failed to update account");
        } finally {
            setSavingAccount(false);
        }
    };

    const handleChangePassword = async (e) => {
        e.preventDefault();

        if (passwordForm.new_password !== passwordForm.confirm_password) {
            toast.error("New password and confirm password do not match");
            return;
        }

        try {
            setSavingPassword(true);
            await api.put(`/profile/users/${adminId}/password`, {
                current_password: passwordForm.current_password,
                new_password: passwordForm.new_password,
            });
            toast.success("Password updated");
            setPasswordForm({
                current_password: "",
                new_password: "",
                confirm_password: "",
            });
        } catch (error) {
            console.error(error);
            toast.error(error.response?.data?.error || "Failed to update password");
        } finally {
            setSavingPassword(false);
        }
    };

    if (loading) {
        return <p className="p-6 dark:text-white">Loading profile...</p>;
    }

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
                        src={businessForm.logo_path || "https://via.placeholder.com/120?text=LOGO"}
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
                    </div>
                </div>

                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                    <Input
                        label="Business Name"
                        value={businessForm.business_name}
                        onChange={(v) => handleBusinessChange("business_name", v)}
                    />

                    <Input
                        label="Contact Number"
                        value={businessForm.contact_number}
                        onChange={(v) => handleBusinessChange("contact_number", v)}
                    />

                    <div className="md:col-span-2">
                        <Input
                            label="Address"
                            value={businessForm.address}
                            onChange={(v) => handleBusinessChange("address", v)}
                        />
                    </div>
                </div>

                <div className="mt-5 flex justify-end">
                    <button disabled={savingBusiness} className="rounded-xl bg-indigo-600 px-5 py-3 text-sm font-bold text-white hover:bg-indigo-700 disabled:opacity-70">
                        {savingBusiness ? "Saving..." : "Save Business Info"}
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
                        value={accountForm.name}
                        onChange={(v) => handleAccountChange("name", v)}
                    />

                    <Input
                        label="Email"
                        type="email"
                        value={accountForm.email}
                        onChange={(v) => handleAccountChange("email", v)}
                    />
                </div>

                <div className="mt-5 flex justify-end">
                    <button disabled={savingAccount} className="rounded-xl bg-indigo-600 px-5 py-3 text-sm font-bold text-white hover:bg-indigo-700 disabled:opacity-70">
                        {savingAccount ? "Updating..." : "Update Account"}
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
                        value={passwordForm.current_password}
                        onChange={(v) => handlePasswordChange("current_password", v)}
                    />

                    <Input
                        label="New Password"
                        type="password"
                        value={passwordForm.new_password}
                        onChange={(v) => handlePasswordChange("new_password", v)}
                    />

                    <Input
                        label="Confirm Password"
                        type="password"
                        value={passwordForm.confirm_password}
                        onChange={(v) => handlePasswordChange("confirm_password", v)}
                    />
                </div>

                <div className="mt-5 flex justify-end">
                    <button disabled={savingPassword} className="rounded-xl bg-red-600 px-5 py-3 text-sm font-bold text-white hover:bg-red-700 disabled:opacity-70">
                        {savingPassword ? "Updating..." : "Update Password"}
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

import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  LogOut,
  Mail,
  Package,
  ShieldCheck,
  User,
  UserRound,
  Camera,
  X,
  Check,
  Lock,
  Eye,
  EyeOff,
} from "lucide-react";
import axios from "axios";
import MyOrdersPage from "./MyOrdersPage";

// Toast Notification Component
const Toast = ({ message, type = "success", onClose }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, 3000);
    return () => clearTimeout(timer);
  }, [onClose]);

  const bgColor = type === "error" ? "bg-red-600" : "bg-slate-900";

  return (
    <div
      className={`fixed top-5 right-5 z-[100] flex items-center gap-3 rounded-xl ${bgColor} px-5 py-4 text-white shadow-2xl transition-all`}
    >
      <div className="h-2.5 w-2.5 rounded-full bg-emerald-400 animate-pulse" />
      <p className="text-sm font-semibold">{message}</p>
    </div>
  );
};

// Default Avatar Presets
const AVATAR_PRESETS = [
  "https://api.dicebear.com/7.x/avataaars/svg?seed=John",
  "https://api.dicebear.com/7.x/avataaars/svg?seed=Felix",
  "https://api.dicebear.com/7.x/avataaars/svg?seed=Aneka",
  "https://api.dicebear.com/7.x/avataaars/svg?seed=Sophia",
  "https://api.dicebear.com/7.x/avataaars/svg?seed=Alex",
  "https://api.dicebear.com/7.x/bottts/svg?seed=Robot1",
  "https://api.dicebear.com/7.x/bottts/svg?seed=Robot2",
  "https://api.dicebear.com/7.x/identicon/svg?seed=Abstract1",
];

const tabs = [
  { id: "profile", label: "Personal Info", icon: User },
  { id: "orders", label: "My Orders", icon: Package },
];

const Profile = () => {
  const [activeTab, setActiveTab] = useState("profile");
  const [userData, setUserData] = useState(null);
  const [toast, setToast] = useState({ message: "", type: "success" });

  // Modals state
  const [isAvatarModalOpen, setIsAvatarModalOpen] = useState(false);
  const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);

  const [customUrlInput, setCustomUrlInput] = useState("");
  const navigate = useNavigate();

  // Load user details from localStorage
  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      try {
        setUserData(JSON.parse(storedUser));
      } catch (err) {
        console.error("Error parsing user data:", err);
      }
    }
  }, []);

  const showToast = (message, type = "success") => {
    setToast({ message, type });
  };

  // Update Avatar
  const updateAvatar = (newAvatarUrl) => {
    const updatedUser = {
      ...userData,
      avatar: newAvatarUrl,
    };

    setUserData(updatedUser);
    localStorage.setItem("user", JSON.stringify(updatedUser));
    setIsAvatarModalOpen(false);
    showToast("Avatar updated successfully!");
  };

  // Logout Handler
  const handleLogout = () => {
    const roleName = isUserAdmin ? "Admin" : "User";
    localStorage.removeItem("user");
    localStorage.removeItem("token");

    showToast(`${roleName} logged out successfully!`);
    setTimeout(() => {
      navigate("/login");
    }, 1200);
  };

  // Flexible Admin Role Detection
  const isUserAdmin =
    userData?.role?.toLowerCase() === "admin" ||
    userData?.isAdmin === true ||
    userData?.user?.role?.toLowerCase() === "admin" ||
    userData?.user?.isAdmin === true;

  const currentUser = {
    name:
      userData?.name ||
      userData?.username ||
      userData?.user?.name ||
      "Guest User",
    email: userData?.email || userData?.user?.email || "guest@example.com",
    role: isUserAdmin ? "Admin" : userData?.role || "Customer",
    avatar:
      userData?.avatar ||
      userData?.user?.avatar ||
      `https://api.dicebear.com/7.x/avataaars/svg?seed=${
        userData?.name || "Guest"
      }`,
  };

  return (
    <main className="min-h-screen bg-[#f6f7fb] p-4 sm:p-6 lg:p-10">
      {/* Toast Render */}
      {toast.message && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast({ message: "", type: "success" })}
        />
      )}

      {/* AVATAR SELECTOR MODAL */}
      {isAvatarModalOpen && (
        <div className="fixed inset-0 z-[90] flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm">
          <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl">
            <div className="flex items-center justify-between border-b pb-4">
              <h3 className="text-lg font-bold text-gray-900">
                Choose Profile Avatar
              </h3>
              <button
                onClick={() => setIsAvatarModalOpen(false)}
                className="rounded-full p-1 text-gray-400 hover:bg-gray-100 hover:text-gray-600"
              >
                <X size={20} />
              </button>
            </div>

            <div className="mt-4">
              <p className="text-xs font-semibold uppercase tracking-wide text-gray-500">
                Select from Presets
              </p>
              <div className="mt-3 grid grid-cols-4 gap-3">
                {AVATAR_PRESETS.map((preset, idx) => (
                  <button
                    key={idx}
                    onClick={() => updateAvatar(preset)}
                    className={`relative grid h-16 w-16 place-items-center rounded-xl border p-1 transition hover:border-[#ea2e0e] ${
                      currentUser.avatar === preset
                        ? "border-[#ea2e0e] bg-orange-50 ring-2 ring-[#ea2e0e]/20"
                        : "border-gray-200 bg-gray-50"
                    }`}
                  >
                    <img
                      src={preset}
                      alt={`Avatar ${idx + 1}`}
                      className="h-full w-full rounded-lg object-cover"
                    />
                    {currentUser.avatar === preset && (
                      <span className="absolute -top-1 -right-1 grid h-5 w-5 place-items-center rounded-full bg-[#ea2e0e] text-white">
                        <Check size={12} />
                      </span>
                    )}
                  </button>
                ))}
              </div>
            </div>

            <div className="mt-6 border-t pt-4">
              <p className="text-xs font-semibold uppercase tracking-wide text-gray-500">
                Or Enter Custom Image URL
              </p>
              <div className="mt-2 flex gap-2">
                <input
                  type="url"
                  placeholder="https://example.com/photo.jpg"
                  value={customUrlInput}
                  onChange={(e) => setCustomUrlInput(e.target.value)}
                  className="w-full rounded-xl border border-gray-200 px-3 py-2 text-sm focus:border-black focus:outline-none"
                />
                <button
                  type="button"
                  onClick={() => {
                    if (customUrlInput.trim()) {
                      updateAvatar(customUrlInput.trim());
                      setCustomUrlInput("");
                    }
                  }}
                  className="rounded-xl bg-slate-950 px-4 py-2 text-xs font-bold text-white hover:bg-slate-800"
                >
                  Save
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* CHANGE PASSWORD MODAL */}
      {isPasswordModalOpen && (
        <ChangePasswordModal
          onClose={() => setIsPasswordModalOpen(false)}
          showToast={showToast}
        />
      )}

      <section className="mx-auto max-w-7xl space-y-6">
        {/* Header */}
        <header className="overflow-hidden rounded-2xl bg-gradient-to-r from-slate-950 via-slate-900 to-[#ea2e0e] p-5 text-white shadow-sm sm:p-6">
          <div className="flex flex-col gap-5 md:flex-row md:items-end md:justify-between">
            <div>
              <p className="text-sm font-semibold uppercase tracking-wide text-white/60">
                My Account
              </p>
              <h1 className="mt-1 text-2xl font-bold tracking-tight sm:text-3xl">
                Profile Dashboard
              </h1>
              <p className="mt-2 max-w-xl text-sm text-white/70">
                Manage your personal details and keep track of your order
                history.
              </p>
            </div>

            <div className="rounded-xl bg-white/10 px-4 py-3 ring-1 ring-white/15">
              <p className="text-xs font-semibold uppercase tracking-wide text-white/55">
                Role
              </p>
              <p className="mt-1 flex items-center gap-2 text-sm font-bold capitalize">
                <ShieldCheck size={16} />
                {currentUser.role}
              </p>
            </div>
          </div>
        </header>

        <div className="grid gap-6 lg:grid-cols-[320px_1fr]">
          {/* Sidebar */}
          <aside className="space-y-4">
            <section className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">
              <div className="bg-gradient-to-br from-orange-50 to-white p-6 text-center">
                <div className="group relative mx-auto h-28 w-28">
                  <img
                    src={currentUser.avatar}
                    alt={currentUser.name}
                    className="h-28 w-28 rounded-2xl border border-orange-100 bg-white p-2 shadow-sm object-cover"
                  />
                  <button
                    type="button"
                    onClick={() => setIsAvatarModalOpen(true)}
                    className="absolute inset-0 flex items-center justify-center rounded-2xl bg-black/40 text-white opacity-0 transition-opacity group-hover:opacity-100"
                    title="Change Avatar"
                  >
                    <Camera size={26} />
                  </button>
                  <span className="absolute -bottom-2 -right-2 h-7 w-7 rounded-full border-4 border-white bg-emerald-500" />
                </div>

                <h2 className="mt-5 text-xl font-bold text-gray-950">
                  {currentUser.name}
                </h2>

                <div className="mt-2 inline-flex items-center gap-1.5 rounded-full bg-[#ea2e0e]/10 px-3 py-1 text-xs font-bold uppercase tracking-wide text-[#c0260b] ring-1 ring-[#ea2e0e]/15">
                  <ShieldCheck size={14} />
                  {currentUser.role}
                </div>
              </div>

              <div className="border-t border-gray-100 p-4">
                <div className="flex items-center gap-3 rounded-xl bg-gray-50 px-3 py-3">
                  <Mail size={17} className="shrink-0 text-gray-400" />
                  <div className="min-w-0">
                    <p className="text-xs font-semibold uppercase tracking-wide text-gray-400">
                      Email
                    </p>
                    <p className="truncate text-sm font-semibold text-gray-700">
                      {currentUser.email}
                    </p>
                  </div>
                </div>
              </div>
            </section>

            {/* Navigation Tabs */}
            <nav className="overflow-hidden rounded-2xl border border-gray-200 bg-white p-2 shadow-sm">
              {tabs.map((tab) => {
                const Icon = tab.icon;
                const isActive = activeTab === tab.id;

                return (
                  <button
                    key={tab.id}
                    type="button"
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex w-full items-center gap-3 rounded-xl px-4 py-3 text-sm font-bold transition ${
                      isActive
                        ? "bg-slate-950 text-white shadow-sm"
                        : "text-gray-600 hover:bg-orange-50 hover:text-[#ea2e0e]"
                    }`}
                  >
                    <Icon size={18} />
                    {tab.label}
                  </button>
                );
              })}

              <div className="my-2 border-t border-gray-100" />

              <button
                type="button"
                onClick={handleLogout}
                className="flex w-full items-center gap-3 rounded-xl px-4 py-3 text-sm font-bold text-red-500 transition hover:bg-red-50"
              >
                <LogOut size={18} />
                Logout
              </button>
            </nav>
          </aside>

          {/* Main Content Pane */}
          <section className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">
            {activeTab === "profile" && (
              <ProfileDetails
                user={currentUser}
                onOpenChangePassword={() => setIsPasswordModalOpen(true)}
              />
            )}
            {activeTab === "orders" && <OrderHistory />}
          </section>
        </div>
      </section>
    </main>
  );
};

// Profile Details Section
const ProfileDetails = ({ user, onOpenChangePassword }) => (
  <div className="p-4 sm:p-6 lg:p-8">
    <div className="mb-6 flex items-center gap-3 border-b border-gray-100 pb-5">
      <div className="grid h-11 w-11 place-items-center rounded-xl bg-[#ea2e0e]/10 text-[#ea2e0e]">
        <UserRound size={21} />
      </div>

      <div>
        <h3 className="text-xl font-bold text-gray-950">Account Settings</h3>
        <p className="mt-1 text-sm text-gray-500">
          Review your personal account information.
        </p>
      </div>
    </div>

    <div className="grid gap-4 md:grid-cols-2">
      <InfoField label="Full Name" value={user.name} icon={User} />
      <InfoField label="Email Address" value={user.email} icon={Mail} />
      <InfoField label="Role" value={user.role} icon={ShieldCheck} />
    </div>

    {/* CHANGE PASSWORD BUTTON NOW OPENS MODAL */}
    <button
      type="button"
      onClick={onOpenChangePassword}
      className="mt-6 flex items-center justify-center gap-2 rounded-xl border border-slate-950 px-5 py-3 text-sm font-bold text-slate-950 transition hover:bg-slate-950 hover:text-white"
    >
      <Lock size={16} />
      Change Password
    </button>
  </div>
);

// CHANGE PASSWORD MODAL COMPONENT
const ChangePasswordModal = ({ onClose, showToast }) => {
  const [formData, setFormData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const [showPassword, setShowPassword] = useState({
    current: false,
    new: false,
    confirm: false,
  });

  const [loading, setLoading] = useState(false);

  const getAuthHeaders = () => {
    const userInfo = JSON.parse(localStorage.getItem("userInfo"));
    const token =
      userInfo?.token ||
      localStorage.getItem("token") ||
      localStorage.getItem("authToken");

    return {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    };
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (formData.newPassword !== formData.confirmPassword) {
      showToast("New passwords do not match!", "error");
      return;
    }

    if (formData.newPassword.length < 6) {
      showToast("Password must be at least 6 characters long!", "error");
      return;
    }

    setLoading(true);

    try {
      const response = await axios.put(
        "https://rabbit-studio-drab.vercel.app/api/users/change-password",
        {
          oldPassword: formData.currentPassword,
          newPassword: formData.newPassword,
        },
        {
          headers: getAuthHeaders(),
        }
      );

      showToast("Password updated successfully!");
      onClose();
    } catch (err) {
      console.error("Change Password Error:", err);
      const errorMsg =
        err.response?.data?.message ||
        err.message ||
        "Failed to update password";
      showToast(errorMsg, "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[90] flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm">
      <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl">
        <div className="flex items-center justify-between border-b pb-4">
          <div className="flex items-center gap-2.5">
            <div className="grid h-9 w-9 place-items-center rounded-lg bg-orange-100 text-[#ea2e0e]">
              <Lock size={18} />
            </div>
            <h3 className="text-lg font-bold text-gray-900">Change Password</h3>
          </div>
          <button
            onClick={onClose}
            className="rounded-full p-1 text-gray-400 hover:bg-gray-100 hover:text-gray-600"
          >
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="mt-5 space-y-4">
          {/* Current Password */}
          <div>
            <label className="text-xs font-semibold uppercase tracking-wide text-gray-500">
              Current Password
            </label>
            <div className="relative mt-1">
              <input
                type={showPassword.current ? "text" : "password"}
                required
                value={formData.currentPassword}
                onChange={(e) =>
                  setFormData({ ...formData, currentPassword: e.target.value })
                }
                className="w-full rounded-xl border border-gray-200 px-3 py-2.5 text-sm focus:border-black focus:outline-none"
                placeholder="••••••••"
              />
              <button
                type="button"
                onClick={() =>
                  setShowPassword({
                    ...showPassword,
                    current: !showPassword.current,
                  })
                }
                className="absolute right-3 top-2.5 text-gray-400 hover:text-gray-600"
              >
                {showPassword.current ? (
                  <EyeOff size={18} />
                ) : (
                  <Eye size={18} />
                )}
              </button>
            </div>
          </div>

          {/* New Password */}
          <div>
            <label className="text-xs font-semibold uppercase tracking-wide text-gray-500">
              New Password
            </label>
            <div className="relative mt-1">
              <input
                type={showPassword.new ? "text" : "password"}
                required
                value={formData.newPassword}
                onChange={(e) =>
                  setFormData({ ...formData, newPassword: e.target.value })
                }
                className="w-full rounded-xl border border-gray-200 px-3 py-2.5 text-sm focus:border-black focus:outline-none"
                placeholder="••••••••"
              />
              <button
                type="button"
                onClick={() =>
                  setShowPassword({ ...showPassword, new: !showPassword.new })
                }
                className="absolute right-3 top-2.5 text-gray-400 hover:text-gray-600"
              >
                {showPassword.new ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          {/* Confirm Password */}
          <div>
            <label className="text-xs font-semibold uppercase tracking-wide text-gray-500">
              Confirm New Password
            </label>
            <div className="relative mt-1">
              <input
                type={showPassword.confirm ? "text" : "password"}
                required
                value={formData.confirmPassword}
                onChange={(e) =>
                  setFormData({ ...formData, confirmPassword: e.target.value })
                }
                className="w-full rounded-xl border border-gray-200 px-3 py-2.5 text-sm focus:border-black focus:outline-none"
                placeholder="••••••••"
              />
              <button
                type="button"
                onClick={() =>
                  setShowPassword({
                    ...showPassword,
                    confirm: !showPassword.confirm,
                  })
                }
                className="absolute right-3 top-2.5 text-gray-400 hover:text-gray-600"
              >
                {showPassword.confirm ? (
                  <EyeOff size={18} />
                ) : (
                  <Eye size={18} />
                )}
              </button>
            </div>
          </div>

          <div className="mt-6 flex gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="w-full rounded-xl border border-gray-200 px-4 py-2.5 text-sm font-semibold text-gray-600 hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-xl bg-[#ea2e0e] px-4 py-2.5 text-sm font-bold text-white transition hover:bg-[#c0260b] disabled:opacity-50"
            >
              {loading ? "Updating..." : "Update Password"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

const OrderHistory = () => (
  <div className="p-4 sm:p-6 lg:p-8">
    <div className="mb-6 flex flex-col gap-3 border-b border-gray-100 pb-5 sm:flex-row sm:items-center sm:justify-between">
      <div>
        <h3 className="text-xl font-bold text-gray-950">Order History</h3>
        <p className="mt-1 text-sm text-gray-500">
          Track orders, delivery progress, and purchase history.
        </p>
      </div>

      <span className="inline-flex w-fit rounded-full bg-[#ea2e0e]/10 px-3 py-1 text-xs font-bold uppercase tracking-wide text-[#c0260b] ring-1 ring-[#ea2e0e]/15">
        Total 12 Orders
      </span>
    </div>

    <MyOrdersPage />
  </div>
);

const InfoField = ({ icon: Icon, label, value }) => (
  <div className="rounded-xl border border-gray-200 bg-gray-50 px-4 py-4">
    <div className="flex items-center gap-3">
      <div className="grid h-10 w-10 shrink-0 place-items-center rounded-lg bg-white text-gray-500 shadow-sm">
        <Icon size={18} />
      </div>

      <div className="min-w-0">
        <p className="text-xs font-bold uppercase tracking-wide text-gray-400">
          {label}
        </p>
        <p className="mt-1 truncate text-sm font-bold text-gray-800 capitalize">
          {value}
        </p>
      </div>
    </div>
  </div>
);

export default Profile;
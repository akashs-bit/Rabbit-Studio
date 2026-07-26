import React, { useEffect, useMemo, useState } from "react";
import {
  AlertCircle,
  KeyRound,
  Mail,
  Plus,
  Search,
  ShieldCheck,
  Trash2,
  UserRound,
  Users,
} from "lucide-react";
import axios from "axios";
import toast from "react-hot-toast";

const ROLES = ["Customer", "Admin"];

const EMPTY_FORM = {
  name: "",
  email: "",
  password: "",
  role: "Customer",
};

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const validateUserForm = (formData, users) => {
  const errors = {};
  const email = formData.email.trim().toLowerCase();

  if (!formData.name.trim()) errors.name = "Name is required";

  if (!email) {
    errors.email = "Email is required";
  } else if (!emailRegex.test(email)) {
    errors.email = "Enter a valid email address";
  } else if (users.some((user) => user.email.toLowerCase() === email)) {
    errors.email = "Email already exists";
  }

  if (!formData.password) {
    errors.password = "Password is required";
  } else if (formData.password.length < 8) {
    errors.password = "Use at least 8 characters";
  }

  if (!ROLES.includes(formData.role)) errors.role = "Choose a valid role";

  return errors;
};

const UserManagement = () => {
  const [users, setUsers] = useState([]);
  const [formData, setFormData] = useState(EMPTY_FORM);
  const [errors, setErrors] = useState({});
  const [notice, setNotice] = useState("");
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    fetchUsers();
  }, []);

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

  const fetchUsers = async () => {
    try {
      const { data } = await axios.get("https://rabbit-studio-drab.vercel.app/api/users", {
        headers: getAuthHeaders(),
      });

      const formattedUsers = (data.users || data || []).map((u) => ({
        ...u,
        id: u._id || u.id,
      }));

      setUsers(formattedUsers);
    } catch (error) {
      console.error("Error fetching users:", error);
      const errorMessage =
        error.response?.data?.message || "Failed to load users";
      toast.error(errorMessage);
    }
  };

  const adminCount = useMemo(
    () => users.filter((user) => user.role === "Admin").length,
    [users],
  );

  const filteredUsers = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();

    if (!query) return users;

    return users.filter((user) =>
      [user.name, user.email, user.role]
        .filter(Boolean)
        .join(" ")
        .toLowerCase()
        .includes(query),
    );
  }, [users, searchQuery]);

  const isFormIncomplete =
    !formData.name.trim() || !formData.email.trim() || !formData.password;

  const handleChange = (event) => {
    const { name, value } = event.target;

    setFormData((current) => ({
      ...current,
      [name]: value,
    }));

    setErrors((current) => ({
      ...current,
      [name]: undefined,
    }));

    setNotice("");
  };

  const handleAddUser = async (event) => {
    event.preventDefault();

    const validationErrors = validateUserForm(formData, users);
    setErrors(validationErrors);

    if (Object.keys(validationErrors).length > 0) return;

    try {
      const { data } = await axios.post(
        "https://rabbit-studio-drab.vercel.app/api/users",
        {
          name: formData.name.trim(),
          email: formData.email.trim().toLowerCase(),
          password: formData.password,
          role: formData.role,
        },
        {
          headers: getAuthHeaders(),
        },
      );

      const createdUser = data.user || data;
      const formattedNewUser = {
        ...createdUser,
        id: createdUser._id || createdUser.id,
      };

      setUsers((current) => [...current, formattedNewUser]);
      setFormData(EMPTY_FORM);
      setNotice("");
      toast.success("User created successfully");
    } catch (error) {
      console.error("Error creating user:", error);
      const errorMessage =
        error.response?.data?.message || "Failed to create user";
      toast.error(errorMessage);
    }
  };

  const handleRoleChange = async (userId, nextRole) => {
    if (!ROLES.includes(nextRole)) return;

    const selectedUser = users.find((user) => user.id === userId);

    if (
      selectedUser?.role === "Admin" &&
      nextRole !== "Admin" &&
      adminCount === 1
    ) {
      setNotice("At least one admin account must remain active.");
      toast.error("At least one admin account must remain active.");
      return;
    }

    try {
      const { data } = await axios.put(
        `https://rabbit-studio-drab.vercel.app/api/users/${userId}`,
        { role: nextRole },
        {
          headers: getAuthHeaders(),
        },
      );

      setNotice("");
      setUsers((current) =>
        current.map((user) =>
          user.id === userId ? { ...user, role: nextRole } : user,
        ),
      );
      toast.success("User role updated successfully");
    } catch (error) {
      console.error("Error updating user role:", error);
      const errorMessage =
        error.response?.data?.message || "Failed to update user role";
      toast.error(errorMessage);
    }
  };

  const handleDeleteUser = async (userId) => {
    const selectedUser = users.find((user) => user.id === userId);

    if (selectedUser?.role === "Admin" && adminCount === 1) {
      setNotice("At least one admin account must remain active.");
      toast.error("At least one admin account must remain active.");
      return;
    }

    if (!window.confirm("Are you sure you want to delete this user?")) return;

    try {
      await axios.delete(`https://rabbit-studio-drab.vercel.app/api/users/${userId}`, {
        headers: getAuthHeaders(),
      });

      setNotice("");
      setUsers((current) => current.filter((user) => user.id !== userId));
      toast.success("User deleted successfully");
    } catch (error) {
      console.error("Error deleting user:", error);
      const errorMessage =
        error.response?.data?.message || "Failed to delete user";
      toast.error(errorMessage);
    }
  };

  return (
    <section className="min-h-screen space-y-6 bg-[#f6f7fb] p-4 sm:space-y-8 sm:p-6 lg:p-8">
      <header className="overflow-hidden rounded-2xl bg-gradient-to-r from-slate-950 via-slate-900 to-[#ea2e0e] p-5 text-white shadow-sm sm:p-6">
        <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="text-sm font-semibold uppercase tracking-wide text-white/60">
              Admin Panel
            </p>
            <h1 className="mt-1 text-2xl font-bold tracking-tight sm:text-3xl">
              User Management
            </h1>
            <p className="mt-2 max-w-xl text-sm text-white/70">
              Create users, assign roles, and keep admin access protected.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:min-w-[360px]">
            <MiniStat label="Users" value={users.length} />
            <MiniStat label="Admins" value={adminCount} />
            <MiniStat
              label="Customers"
              value={users.filter((user) => user.role === "Customer").length}
            />
          </div>
        </div>
      </header>

      {notice && (
        <div className="flex items-start gap-3 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm font-semibold text-amber-800">
          <AlertCircle size={18} className="mt-0.5 shrink-0" />
          <p>{notice}</p>
        </div>
      )}

      <form
        onSubmit={handleAddUser}
        noValidate
        className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm"
      >
        <div className="border-b border-gray-100 bg-white px-4 py-5 sm:px-6">
          <div className="flex items-center gap-3">
            <div className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-[#ea2e0e]/10 text-[#ea2e0e]">
              <UserRound size={21} />
            </div>

            <div>
              <h2 className="text-lg font-bold text-gray-950">Add User</h2>
              <p className="mt-1 text-sm text-gray-500">
                Create a customer or admin account with validated details.
              </p>
            </div>
          </div>
        </div>

        <div className="grid gap-4 p-4 sm:p-6 md:grid-cols-2">
          <FormField
            id="user-name"
            label="Name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            placeholder="Enter name"
            icon={UserRound}
            error={errors.name}
          />

          <FormField
            id="user-email"
            label="Email"
            name="email"
            type="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="Enter email"
            icon={Mail}
            error={errors.email}
          />

          <FormField
            id="user-password"
            label="Password"
            name="password"
            type="password"
            value={formData.password}
            onChange={handleChange}
            placeholder="Minimum 8 characters"
            icon={KeyRound}
            error={errors.password}
          />

          <div>
            <label
              htmlFor="user-role"
              className="mb-2 block text-sm font-bold text-gray-800"
            >
              Role
            </label>

            <div
              className={`flex items-center gap-3 rounded-lg border px-3 transition focus-within:border-[#ea2e0e] focus-within:ring-2 focus-within:ring-[#ea2e0e]/15 ${
                errors.role ? "border-red-300 bg-red-50/30" : "border-gray-200"
              }`}
            >
              <ShieldCheck
                size={17}
                className="shrink-0 text-gray-400"
                aria-hidden="true"
              />

              <select
                id="user-role"
                name="role"
                value={formData.role}
                onChange={handleChange}
                aria-invalid={Boolean(errors.role)}
                className="h-11 w-full bg-transparent text-sm font-semibold outline-none"
              >
                {ROLES.map((role) => (
                  <option key={role} value={role}>
                    {role}
                  </option>
                ))}
              </select>
            </div>

            {errors.role && (
              <p className="mt-2 text-sm font-medium text-red-600">
                {errors.role}
              </p>
            )}
          </div>

          <div className="md:col-span-2">
            <button
              type="submit"
              disabled={isFormIncomplete}
              className="inline-flex w-full items-center justify-center gap-2 rounded-lg bg-[#22c55e] px-4 py-3 text-sm font-bold text-white shadow-sm transition hover:bg-[#16a34a] disabled:cursor-not-allowed disabled:bg-gray-300 sm:w-auto"
            >
              <Plus size={17} aria-hidden="true" />
              Add User
            </button>
          </div>
        </div>
      </form>

      <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">
        <div className="flex flex-col gap-4 border-b border-gray-200 bg-white px-4 py-4 sm:px-6 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <h2 className="text-lg font-bold text-gray-950">Users</h2>
            <p className="mt-1 text-sm text-gray-500">
              {filteredUsers.length} user
              {filteredUsers.length === 1 ? "" : "s"} found
            </p>
          </div>

          <div className="flex items-center gap-3 rounded-lg border border-gray-200 bg-white px-3 shadow-sm lg:w-80">
            <Search size={18} className="shrink-0 text-gray-400" />
            <input
              type="search"
              value={searchQuery}
              onChange={(event) => setSearchQuery(event.target.value)}
              placeholder="Search users"
              className="h-11 w-full bg-transparent text-sm outline-none placeholder:text-gray-400"
            />
          </div>
        </div>

        <div className="space-y-3 bg-gray-50/60 p-4 md:hidden">
          {filteredUsers.map((user) => {
            const isLastAdmin = user.role === "Admin" && adminCount === 1;

            return (
              <article
                key={user.id}
                className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm"
              >
                <div className="border-l-4 border-[#ea2e0e] p-4">
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex min-w-0 items-center gap-3">
                      <UserAvatar name={user.name} role={user.role} />

                      <div className="min-w-0">
                        <h3 className="truncate font-bold text-gray-950">
                          {user.name}
                        </h3>
                        <p className="truncate text-sm text-gray-500">
                          {user.email}
                        </p>
                      </div>
                    </div>

                    <RoleBadge role={user.role} />
                  </div>

                  <div className="mt-4 flex flex-col gap-3 border-t border-gray-100 pt-4 sm:flex-row sm:items-center sm:justify-between">
                    <RoleSelect
                      id={`role-mobile-${user.id}`}
                      value={user.role}
                      disabled={isLastAdmin}
                      onChange={(event) =>
                        handleRoleChange(user.id, event.target.value)
                      }
                    />

                    <button
                      type="button"
                      onClick={() => handleDeleteUser(user.id)}
                      disabled={isLastAdmin}
                      className="inline-flex items-center justify-center gap-2 rounded-lg bg-red-500 px-3 py-2 text-sm font-bold text-white transition hover:bg-red-600 disabled:cursor-not-allowed disabled:bg-gray-300"
                    >
                      <Trash2 size={16} aria-hidden="true" />
                      Delete
                    </button>
                  </div>
                </div>
              </article>
            );
          })}

          {filteredUsers.length === 0 && <EmptyUsers />}
        </div>

        <div className="hidden overflow-x-auto md:block">
          <table className="w-full min-w-[760px] text-left text-sm">
            <thead className="bg-slate-950 text-xs uppercase text-white/70">
              <tr>
                <th className="px-5 py-4 font-bold">Name</th>
                <th className="px-5 py-4 font-bold">Email</th>
                <th className="px-5 py-4 font-bold">Role</th>
                <th className="px-5 py-4 text-right font-bold">Action</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-gray-100">
              {filteredUsers.map((user) => {
                const isLastAdmin = user.role === "Admin" && adminCount === 1;

                return (
                  <tr
                    key={user.id}
                    className="transition hover:bg-orange-50/40"
                  >
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-3">
                        <UserAvatar name={user.name} role={user.role} />
                        <span className="font-semibold text-gray-950">
                          {user.name}
                        </span>
                      </div>
                    </td>

                    <td className="px-5 py-4 text-gray-600">{user.email}</td>

                    <td className="px-5 py-4">
                      <RoleSelect
                        id={`role-desktop-${user.id}`}
                        value={user.role}
                        disabled={isLastAdmin}
                        onChange={(event) =>
                          handleRoleChange(user.id, event.target.value)
                        }
                      />
                    </td>

                    <td className="px-5 py-4 text-right">
                      <button
                        type="button"
                        onClick={() => handleDeleteUser(user.id)}
                        disabled={isLastAdmin}
                        className="inline-flex items-center justify-center gap-2 rounded-lg bg-red-500 px-3 py-2 text-sm font-bold text-white transition hover:bg-red-600 disabled:cursor-not-allowed disabled:bg-gray-300"
                      >
                        <Trash2 size={16} aria-hidden="true" />
                        Delete
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>

          {filteredUsers.length === 0 && <EmptyUsers />}
        </div>
      </div>
    </section>
  );
};

const FormField = ({
  error,
  icon: Icon,
  id,
  label,
  name,
  onChange,
  placeholder,
  type = "text",
  value,
}) => (
  <div>
    <label htmlFor={id} className="mb-2 block text-sm font-bold text-gray-800">
      {label}
    </label>

    <div
      className={`flex items-center gap-3 rounded-lg border px-3 transition focus-within:border-[#ea2e0e] focus-within:ring-2 focus-within:ring-[#ea2e0e]/15 ${
        error ? "border-red-300 bg-red-50/30" : "border-gray-200 bg-white"
      }`}
    >
      <Icon size={17} className="shrink-0 text-gray-400" aria-hidden="true" />

      <input
        id={id}
        type={type}
        name={name}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        aria-invalid={Boolean(error)}
        aria-describedby={error ? `${id}-error` : undefined}
        className="h-11 w-full min-w-0 bg-transparent text-sm outline-none placeholder:text-gray-400"
      />
    </div>

    {error && (
      <p id={`${id}-error`} className="mt-2 text-sm font-medium text-red-600">
        {error}
      </p>
    )}
  </div>
);

const RoleSelect = ({ id, value, onChange, disabled = false }) => (
  <select
    id={id}
    value={value}
    onChange={onChange}
    disabled={disabled}
    className="h-10 rounded-lg border border-gray-200 bg-white px-3 text-sm font-bold text-gray-800 outline-none transition focus:border-[#ea2e0e] focus:ring-2 focus:ring-[#ea2e0e]/15 disabled:cursor-not-allowed disabled:bg-gray-100 disabled:text-gray-400"
  >
    {ROLES.map((role) => (
      <option key={role} value={role}>
        {role}
      </option>
    ))}
  </select>
);

const RoleBadge = ({ role }) => (
  <span
    className={`inline-flex rounded-full px-2.5 py-1 text-xs font-bold ring-1 ${
      role === "Admin"
        ? "bg-[#ea2e0e]/10 text-[#c0260b] ring-[#ea2e0e]/20"
        : "bg-sky-100 text-sky-800 ring-sky-200"
    }`}
  >
    {role}
  </span>
);

const UserAvatar = ({ name, role }) => (
  <div
    className={`grid h-10 w-10 shrink-0 place-items-center rounded-full text-sm font-bold uppercase text-white ${
      role === "Admin"
        ? "bg-gradient-to-br from-[#ea2e0e] to-red-700"
        : "bg-gradient-to-br from-sky-500 to-cyan-700"
    }`}
  >
    {(name || "U").trim().charAt(0)}
  </div>
);

const MiniStat = ({ label, value }) => (
  <div className="rounded-xl bg-white/10 px-3 py-3 ring-1 ring-white/15">
    <p className="text-xs font-semibold uppercase tracking-wide text-white/55">
      {label}
    </p>
    <p className="mt-1 text-xl font-bold text-white">{value}</p>
  </div>
);

const EmptyUsers = () => (
  <div className="px-6 py-12 text-center">
    <Users className="mx-auto text-gray-300" size={38} />
    <p className="mt-3 text-sm font-medium text-gray-500">No users found</p>
  </div>
);

export default UserManagement;

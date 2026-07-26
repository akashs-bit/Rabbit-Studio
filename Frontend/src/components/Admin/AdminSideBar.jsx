import React, { useState } from "react";
import { NavLink } from "react-router-dom";
import {
  LayoutDashboard,
  Users,
  Package,
  ShoppingBag,
  Store,
  LogOut,
  Menu,
  X,
} from "lucide-react";

export const adminNavItems = [
  {
    to: "/admin",
    icon: LayoutDashboard,
    label: "Admin Dashboard",
  },
  {
    to: "/admin/users",
    icon: Users,
    label: "Users",
  },
  {
    to: "/admin/products",
    icon: Package,
    label: "Products",
  },
  {
    to: "/admin/orders",
    icon: ShoppingBag,
    label: "Orders",
  },
  {
    to: "/",
    icon: Store,
    label: "Shop",
  },
];

const AdminSideBar = () => {
  const [isOpen, setIsOpen] = useState(false);

  const closeSidebar = () => setIsOpen(false);

  return (
    <>
      <header className="sticky top-0 z-40 flex h-16 items-center justify-between border-b border-gray-200 bg-white px-4 shadow-sm lg:hidden">
        <h1 className="text-lg font-bold text-gray-950">Rabbit Admin</h1>

        <button
          type="button"
          onClick={() => setIsOpen(true)}
          aria-label="Open sidebar"
          className="grid h-10 w-10 place-items-center rounded-md border border-gray-200 text-gray-700 transition hover:bg-gray-100"
        >
          <Menu size={22} />
        </button>
      </header>

      {isOpen && (
        <button
          type="button"
          aria-label="Close sidebar overlay"
          onClick={closeSidebar}
          className="fixed inset-0 z-40 bg-black/50 lg:hidden"
        />
      )}

      <aside
        className={`fixed inset-y-0 left-0 z-50 flex w-64 flex-col bg-[#111827] px-5 py-6 text-white transition-transform duration-300 lg:sticky lg:top-0 lg:z-auto lg:min-h-screen lg:translate-x-0 ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex items-center justify-between">
          <h1 className="text-xl font-bold">Rabbit</h1>

          <button
            type="button"
            onClick={closeSidebar}
            aria-label="Close sidebar"
            className="grid h-9 w-9 place-items-center rounded-md text-gray-300 transition hover:bg-white/10 hover:text-white lg:hidden"
          >
            <X size={20} />
          </button>
        </div>

        <nav className="mt-8 flex-1 space-y-2">
          {adminNavItems.map((item) => {
            const Icon = item.icon;

            return (
              <NavLink
                key={item.to}
                to={item.to}
                end={item.to === "/admin"}
                onClick={closeSidebar}
                className={({ isActive }) =>
                  `flex items-center gap-3 rounded-md px-4 py-3 text-sm font-semibold transition ${
                    isActive
                      ? "bg-white/10 text-white"
                      : "text-gray-300 hover:bg-white/10 hover:text-white"
                  }`
                }
              >
                <Icon size={17} aria-hidden="true" />
                <span>{item.label}</span>
              </NavLink>
            );
          })}
        </nav>

        <button
          type="button"
          className="mt-8 flex w-full items-center justify-center gap-2 rounded-md bg-red-500 px-4 py-3 text-sm font-bold text-white transition hover:bg-red-600"
        >
          <LogOut size={17} aria-hidden="true" />
          Logout
        </button>
      </aside>
    </>
  );
};

export default AdminSideBar;

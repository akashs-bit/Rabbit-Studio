import React from "react";
import {
  ArrowUpRight,
  IndianRupee,
  Package,
  ShoppingBag,
  TrendingUp,
} from "lucide-react";
import { Link } from "react-router-dom";

const stats = [
  {
    title: "Revenue",
    value: "₹10,000",
    helper: "+12.5% from last month",
    icon: IndianRupee,
    color: "from-emerald-600 to-teal-700",
  },
  {
    title: "Total Orders",
    value: "200",
    helper: "Manage Orders",
    icon: ShoppingBag,
    link: "/admin/orders",
    color: "from-sky-600 to-cyan-700",
  },
  {
    title: "Total Products",
    value: "100",
    helper: "Manage Products",
    icon: Package,
    link: "/admin/products",
    color: "from-orange-500 to-red-600",
  },
];

const recentOrders = [
  {
    id: "#ORD-1001",
    user: "Rahul Sharma",
    totalPrice: "₹9,999",
    status: "Processing",
  },
  {
    id: "#ORD-1002",
    user: "Priya Mehta",
    totalPrice: "₹4,499",
    status: "Delivered",
  },
  {
    id: "#ORD-1003",
    user: "Aman Verma",
    totalPrice: "₹2,199",
    status: "Pending",
  },
];

const statusStyles = {
  Processing: "bg-sky-100 text-sky-800 ring-sky-200",
  Delivered: "bg-emerald-100 text-emerald-800 ring-emerald-200",
  Pending: "bg-amber-100 text-amber-800 ring-amber-200",
};

const AdminHomePage = () => {
  return (
    <section className="min-h-screen space-y-6 bg-[#f6f7fb] p-4 sm:space-y-8 sm:p-6 lg:p-8">
      <header className="overflow-hidden rounded-2xl bg-gradient-to-r from-slate-950 via-slate-900 to-[#ea2e0e] p-5 text-white shadow-sm sm:p-6">
        <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="text-sm font-semibold uppercase tracking-wide text-white/60">
              Welcome back, Admin
            </p>
            <h1 className="mt-1 text-2xl font-bold tracking-tight sm:text-3xl">
              Admin Dashboard
            </h1>
            <p className="mt-2 max-w-xl text-sm text-white/70">
              Track revenue, monitor orders, and manage product activity from one place.
            </p>
          </div>

          <Link
            to="/admin/orders"
            className="inline-flex w-full items-center justify-center gap-2 rounded-lg bg-white px-4 py-3 text-sm font-bold text-slate-950 shadow-sm transition hover:bg-orange-50 sm:w-auto"
          >
            View Orders
            <ArrowUpRight size={17} aria-hidden="true" />
          </Link>
        </div>
      </header>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {stats.map((item) => {
          const Icon = item.icon;

          return (
            <div
              key={item.title}
              className={`rounded-2xl bg-gradient-to-br ${item.color} p-5 text-white shadow-sm transition hover:-translate-y-0.5 hover:shadow-md`}
            >
              <div className="flex items-start justify-between gap-4">
                <div className="min-w-0">
                  <p className="text-sm font-semibold text-white/75">
                    {item.title}
                  </p>
                  <h2 className="mt-2 truncate text-3xl font-bold">
                    {item.value}
                  </h2>
                </div>

                <div className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-white/15 text-white">
                  <Icon size={21} aria-hidden="true" />
                </div>
              </div>

              {item.link ? (
                <Link
                  to={item.link}
                  className="mt-5 inline-flex items-center gap-1.5 text-sm font-bold text-white/90 transition hover:text-white"
                >
                  {item.helper}
                  <ArrowUpRight size={15} aria-hidden="true" />
                </Link>
              ) : (
                <p className="mt-5 inline-flex items-center gap-1.5 text-sm font-bold text-white/90">
                  <TrendingUp size={15} aria-hidden="true" />
                  {item.helper}
                </p>
              )}
            </div>
          );
        })}
      </div>

      <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">
        <div className="flex items-start justify-between gap-4 border-b border-gray-200 px-4 py-4 sm:px-6">
          <div>
            <h2 className="text-lg font-bold text-gray-950 sm:text-xl">
              Recent Orders
            </h2>
            <p className="mt-1 text-sm text-gray-500">
              Latest customer orders from your store.
            </p>
          </div>

          <Link
            to="/admin/orders"
            className="shrink-0 text-sm font-bold text-[#ea2e0e] transition hover:text-red-700"
          >
            Manage All
          </Link>
        </div>

        <div className="space-y-3 bg-gray-50/60 p-4 md:hidden">
          {recentOrders.map((order) => (
            <article
              key={order.id}
              className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm"
            >
              <div className="border-l-4 border-[#ea2e0e] p-4">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="font-bold text-gray-950">{order.id}</p>
                    <p className="mt-1 text-sm text-gray-500">{order.user}</p>
                  </div>

                  <StatusBadge status={order.status} />
                </div>

                <div className="mt-4 flex items-center justify-between border-t border-gray-100 pt-3">
                  <span className="text-sm font-medium text-gray-500">
                    Total Price
                  </span>
                  <span className="font-bold text-gray-950">
                    {order.totalPrice}
                  </span>
                </div>
              </div>
            </article>
          ))}
        </div>

        <div className="hidden overflow-x-auto md:block">
          <table className="w-full min-w-[720px] text-left text-sm">
            <thead className="bg-slate-950 text-xs uppercase text-white/70">
              <tr>
                <th className="px-5 py-4 font-bold">Order ID</th>
                <th className="px-5 py-4 font-bold">User</th>
                <th className="px-5 py-4 font-bold">Total Price</th>
                <th className="px-5 py-4 font-bold">Status</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-gray-100">
              {recentOrders.map((order) => (
                <tr key={order.id} className="transition hover:bg-orange-50/40">
                  <td className="px-5 py-4 font-bold text-gray-950">
                    {order.id}
                  </td>

                  <td className="px-5 py-4 text-gray-600">{order.user}</td>

                  <td className="px-5 py-4 font-bold text-gray-950">
                    {order.totalPrice}
                  </td>

                  <td className="px-5 py-4">
                    <StatusBadge status={order.status} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
};

const StatusBadge = ({ status }) => (
  <span
    className={`inline-flex rounded-full px-3 py-1 text-xs font-bold ring-1 ${
      statusStyles[status]
    }`}
  >
    {status}
  </span>
);

export default AdminHomePage;

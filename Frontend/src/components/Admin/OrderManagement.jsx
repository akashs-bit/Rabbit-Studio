import React, { useEffect, useMemo, useState } from "react";
import {
  CalendarDays,
  Eye,
  IndianRupee,
  PackageCheck,
  Search,
  ShoppingBag,
  Trash2,
  Truck,
  UserRound,
} from "lucide-react";
import axios from "axios";

const ORDER_STATUSES = ["All", "Pending", "Processing", "Shipped", "Delivered", "Cancelled"];

const statusStyles = {
  Pending: "bg-amber-100 text-amber-800 ring-amber-200",
  Processing: "bg-sky-100 text-sky-800 ring-sky-200",
  Shipped: "bg-violet-100 text-violet-800 ring-violet-200",
  Delivered: "bg-emerald-100 text-emerald-800 ring-emerald-200",
  Cancelled: "bg-rose-100 text-rose-800 ring-rose-200",
};

const paymentStyles = {
  Paid: "bg-emerald-100 text-emerald-800 ring-emerald-200",
  Pending: "bg-rose-100 text-rose-800 ring-rose-200",
};

const statCardStyles = [
  {
    panel: "bg-gradient-to-br from-slate-950 to-slate-800 text-white",
    icon: "bg-white/10 text-white",
    helper: "text-slate-300",
  },
  {
    panel: "bg-gradient-to-br from-emerald-600 to-teal-700 text-white",
    icon: "bg-white/15 text-white",
    helper: "text-emerald-50",
  },
  {
    panel: "bg-gradient-to-br from-sky-600 to-cyan-700 text-white",
    icon: "bg-white/15 text-white",
    helper: "text-sky-50",
  },
  {
    panel: "bg-gradient-to-br from-orange-500 to-red-600 text-white",
    icon: "bg-white/15 text-white",
    helper: "text-orange-50",
  },
];

const formatPrice = (price) =>
  new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(price || 0);

const formatDate = (date) => {
  if (!date) return "N/A";
  const parsedDate = new Date(date);
  if (isNaN(parsedDate.getTime())) return "N/A";

  return new Intl.DateTimeFormat("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(parsedDate);
};

const OrderManagement = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeStatus, setActiveStatus] = useState("All");

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const token = localStorage.getItem("token");

      const { data } = await axios.get("http://localhost:5000/api/orders", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setOrders(data.orders || []);
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  const filteredOrders = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();

    return orders.filter((order) => {
      const matchesStatus =
        activeStatus === "All" || order.status === activeStatus;

      const customerName = order.user?.name || "Guest Customer";
      const customerEmail = order.user?.email || "";
      const displayId = order.orderId || order._id || "";

      const matchesSearch = [displayId, customerName, customerEmail]
        .join(" ")
        .toLowerCase()
        .includes(query);

      return matchesStatus && matchesSearch;
    });
  }, [orders, searchQuery, activeStatus]);

  const totalRevenue = useMemo(
    () => orders.reduce((sum, order) => sum + (order.totalPrice || 0), 0),
    [orders],
  );

  const handleStatusChange = async (dbId, status) => {
    try {
      const token = localStorage.getItem("token");

      await axios.patch(
        `http://localhost:5000/api/orders/${dbId}/status`,
        { status },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      fetchOrders();
    } catch (err) {
      console.log(err);
    }
  };

  const handleDeleteOrder = async (dbId) => {
    if (!window.confirm("Are you sure you want to delete this order?")) return;

    try {
      const token = localStorage.getItem("token");

      await axios.delete(`http://localhost:5000/api/orders/${dbId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      fetchOrders();
    } catch (err) {
      console.log(err);
      alert(err.response?.data?.message || "Failed to delete order");
    }
  };

  const stats = [
    {
      title: "Total Orders",
      value: orders.length,
      icon: ShoppingBag,
      helper: "All customer orders",
    },
    {
      title: "Revenue",
      value: formatPrice(totalRevenue),
      icon: IndianRupee,
      helper: "From listed orders",
    },
    {
      title: "Processing",
      value: orders.filter((order) => order.status === "Processing").length,
      icon: Truck,
      helper: "Need fulfillment",
    },
    {
      title: "Delivered",
      value: orders.filter((order) => order.status === "Delivered").length,
      icon: PackageCheck,
      helper: "Completed orders",
    },
  ];

  return (
    <section className="min-h-screen space-y-6 bg-[#f6f7fb] p-4 sm:space-y-8 sm:p-6 lg:p-8">
      <header className="overflow-hidden rounded-2xl bg-gradient-to-r from-slate-950 via-slate-900 to-[#ea2e0e] p-5 text-white shadow-sm sm:p-6">
        <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="text-sm font-semibold uppercase tracking-wide text-white/60">
              Admin Panel
            </p>
            <h1 className="mt-1 text-2xl font-bold tracking-tight sm:text-3xl">
              Order Management
            </h1>
            <p className="mt-2 max-w-xl text-sm text-white/70">
              Track order flow, payments, delivery stages, and customer requests.
            </p>
          </div>

          <div className="flex items-center gap-3 rounded-xl bg-white/10 px-3 ring-1 ring-white/15 backdrop-blur sm:w-96">
            <Search size={18} className="shrink-0 text-white/60" />
            <input
              type="search"
              value={searchQuery}
              onChange={(event) => setSearchQuery(event.target.value)}
              placeholder="Search order, customer, email"
              className="h-12 w-full bg-transparent text-sm text-white outline-none placeholder:text-white/50"
            />
          </div>
        </div>
      </header>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {stats.map((stat, index) => (
          <StatCard key={stat.title} {...stat} styles={statCardStyles[index]} />
        ))}
      </div>

      <div className="flex gap-2 overflow-x-auto rounded-xl bg-white p-2 shadow-sm ring-1 ring-gray-200">
        {ORDER_STATUSES.map((status) => (
          <button
            key={status}
            type="button"
            onClick={() => setActiveStatus(status)}
            className={`shrink-0 rounded-lg px-4 py-2 text-sm font-bold transition ${
              activeStatus === status
                ? "bg-[#ea2e0e] text-white shadow-sm"
                : "text-gray-600 hover:bg-gray-100 hover:text-gray-950"
            }`}
          >
            {status}
          </button>
        ))}
      </div>

      <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">
        <div className="border-b border-gray-200 bg-white px-4 py-4 sm:px-6">
          <h2 className="text-lg font-bold text-gray-950">Orders</h2>
          <p className="mt-1 text-sm text-gray-500">
            {filteredOrders.length} order
            {filteredOrders.length === 1 ? "" : "s"} found
          </p>
        </div>

        {/* Mobile View */}
        <div className="space-y-3 bg-gray-50/60 p-4 md:hidden">
          {filteredOrders.map((order) => {
            const dbId = order._id;
            const displayId = order.orderId || dbId;
            const customerName = order.user?.name || "Guest Customer";
            const itemCount = Array.isArray(order.items)
              ? order.items.reduce((acc, item) => acc + (item.quantity || 1), 0)
              : 0;

            return (
              <article
                key={dbId}
                className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm"
              >
                <div className="border-l-4 border-[#ea2e0e] p-4">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <h3 className="font-bold text-gray-950">#{displayId}</h3>
                      <p className="mt-1 text-sm text-gray-500">{customerName}</p>
                    </div>

                    <StatusBadge status={order.status} />
                  </div>

                  <div className="mt-4 grid grid-cols-2 gap-3 border-t border-gray-100 pt-4 text-sm">
                    <InfoItem
                      icon={IndianRupee}
                      label="Total"
                      value={formatPrice(order.totalPrice)}
                    />
                    <InfoItem
                      icon={ShoppingBag}
                      label="Items"
                      value={itemCount}
                    />
                    <InfoItem
                      icon={CalendarDays}
                      label="Date"
                      value={formatDate(order.createdAt)}
                    />
                    <InfoItem
                      icon={UserRound}
                      label="Payment"
                      value={order.paymentStatus || "Pending"}
                    />
                  </div>

                  <div className="mt-4 flex flex-col gap-3 border-t border-gray-100 pt-4">
                    <select
                      value={order.status}
                      onChange={(event) =>
                        handleStatusChange(dbId, event.target.value)
                      }
                      className="h-10 rounded-lg border border-gray-200 bg-white px-3 text-sm font-semibold outline-none focus:border-[#ea2e0e] focus:ring-2 focus:ring-[#ea2e0e]/15"
                    >
                      {ORDER_STATUSES.filter((status) => status !== "All").map(
                        (status) => (
                          <option key={status} value={status}>
                            {status}
                          </option>
                        ),
                      )}
                    </select>

                    <div className="flex gap-2">
                      <button
                        type="button"
                        className="flex-1 inline-flex items-center justify-center gap-2 rounded-lg border border-gray-200 px-3 py-2 text-sm font-bold text-gray-700 transition hover:bg-gray-100"
                      >
                        <Eye size={16} />
                        View
                      </button>
                      <button
                        type="button"
                        onClick={() => handleDeleteOrder(dbId)}
                        className="inline-flex items-center justify-center gap-2 rounded-lg border border-rose-200 bg-rose-50 px-3 py-2 text-sm font-bold text-rose-600 transition hover:bg-rose-100"
                      >
                        <Trash2 size={16} />
                        Delete
                      </button>
                    </div>
                  </div>
                </div>
              </article>
            );
          })}

          {filteredOrders.length === 0 && <EmptyOrders />}
        </div>

        {/* Desktop Table View */}
        <div className="hidden overflow-x-auto md:block">
          <table className="w-full min-w-[980px] text-left text-sm">
            <thead className="bg-slate-950 text-xs uppercase text-white/70">
              <tr>
                <th className="px-5 py-4 font-bold">Order ID</th>
                <th className="px-5 py-4 font-bold">Customer</th>
                <th className="px-5 py-4 font-bold">Date</th>
                <th className="px-5 py-4 font-bold">Total</th>
                <th className="px-5 py-4 font-bold">Payment</th>
                <th className="px-5 py-4 font-bold">Status</th>
                <th className="px-5 py-4 text-right font-bold">Actions</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-gray-100">
              {filteredOrders.map((order) => {
                const dbId = order._id;
                const displayId = order.orderId || dbId;
                const customerName = order.user?.name || "Guest Customer";
                const customerEmail = order.user?.email || "No email";

                return (
                  <tr key={dbId} className="transition hover:bg-orange-50/40">
                    <td className="px-5 py-4 font-bold text-gray-950">
                      #{displayId}
                    </td>

                    <td className="px-5 py-4">
                      <p className="font-semibold text-gray-950">{customerName}</p>
                      <p className="mt-1 text-xs text-gray-500">{customerEmail}</p>
                    </td>

                    <td className="px-5 py-4 text-gray-600">
                      {formatDate(order.createdAt)}
                    </td>

                    <td className="px-5 py-4 font-bold text-gray-950">
                      {formatPrice(order.totalPrice)}
                    </td>

                    <td className="px-5 py-4">
                      <PaymentBadge status={order.paymentStatus} />
                    </td>

                    <td className="px-5 py-4">
                      <select
                        value={order.status}
                        onChange={(event) =>
                          handleStatusChange(dbId, event.target.value)
                        }
                        className="h-10 rounded-lg border border-gray-200 bg-white px-3 text-sm font-semibold outline-none focus:border-[#ea2e0e] focus:ring-2 focus:ring-[#ea2e0e]/15"
                      >
                        {ORDER_STATUSES.filter((status) => status !== "All").map(
                          (status) => (
                            <option key={status} value={status}>
                              {status}
                            </option>
                          ),
                        )}
                      </select>
                    </td>

                    <td className="px-5 py-4 text-right">
                      <div className="inline-flex items-center gap-2">
                        
                        <button
                          type="button"
                          onClick={() => handleDeleteOrder(dbId)}
                          className="inline-flex items-center gap-1.5 rounded-lg border border-rose-200 bg-rose-50 px-3 py-2 text-sm font-bold text-rose-600 transition hover:bg-rose-100"
                        >
                          <Trash2 size={16} />
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>

          {filteredOrders.length === 0 && <EmptyOrders />}
        </div>
      </div>
    </section>
  );
};

const StatCard = ({ title, value, icon: Icon, helper, styles }) => (
  <div className={`rounded-2xl p-5 shadow-sm ${styles.panel}`}>
    <div className="flex items-start justify-between gap-4">
      <div>
        <p className="text-sm font-semibold opacity-80">{title}</p>
        <h2 className="mt-2 text-2xl font-bold">{value}</h2>
      </div>

      <div
        className={`grid h-11 w-11 shrink-0 place-items-center rounded-xl ${styles.icon}`}
      >
        <Icon size={20} />
      </div>
    </div>

    <p className={`mt-4 text-sm font-medium ${styles.helper}`}>{helper}</p>
  </div>
);

const StatusBadge = ({ status }) => (
  <span
    className={`inline-flex rounded-full px-2.5 py-1 text-xs font-bold ring-1 ${
      statusStyles[status] || "bg-gray-100 text-gray-800 ring-gray-200"
    }`}
  >
    {status || "Pending"}
  </span>
);

const PaymentBadge = ({ status }) => (
  <span
    className={`inline-flex rounded-full px-2.5 py-1 text-xs font-bold ring-1 ${
      paymentStyles[status] || "bg-rose-100 text-rose-800 ring-rose-200"
    }`}
  >
    {status || "Pending"}
  </span>
);

const InfoItem = ({ icon: Icon, label, value }) => (
  <div>
    <div className="flex items-center gap-1.5 text-gray-500">
      <Icon size={14} />
      <span>{label}</span>
    </div>
    <p className="mt-1 font-bold text-gray-950">{value}</p>
  </div>
);

const EmptyOrders = () => (
  <div className="px-6 py-12 text-center">
    <ShoppingBag className="mx-auto text-gray-300" size={38} />
    <p className="mt-3 text-sm font-medium text-gray-500">No orders found</p>
  </div>
);

export default OrderManagement;
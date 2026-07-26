import React, { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import {
  CalendarDays,
  ExternalLink,
  Filter,
  IndianRupee,
  MapPin,
  Package,
  Search,
  Truck,
} from "lucide-react";

const STATUS_STYLES = {
  Pending: "bg-yellow-100 text-yellow-800 ring-yellow-200",
  Processing: "bg-purple-100 text-purple-800 ring-purple-200",
  Shipped: "bg-sky-100 text-sky-800 ring-sky-200",
  Delivered: "bg-emerald-100 text-emerald-800 ring-emerald-200",
  Cancelled: "bg-red-100 text-red-800 ring-red-200",
  default: "bg-gray-100 text-gray-700 ring-gray-200",
};

const FILTERS = [
  "All",
  "Pending",
  "Processing",
  "Shipped",
  "Delivered",
  "Cancelled",
];

const formatCurrency = (value) =>
  new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(value);

const Header = () => (
  <div className="overflow-hidden rounded-2xl bg-gradient-to-r from-slate-950 via-slate-900 to-[#ea2e0e] p-5 text-white shadow-sm sm:p-6">
    <div className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
      <div>
        <p className="text-sm font-semibold uppercase tracking-wide text-white/60">
          Account
        </p>

        <h1 className="mt-1 text-2xl font-bold tracking-tight sm:text-3xl">
          My Orders
        </h1>

        <p className="mt-2 max-w-xl text-sm text-white/70">
          Track your orders, payment status and delivery progress.
        </p>
      </div>

      <button
        type="button"
        className="inline-flex items-center gap-2 rounded-xl bg-white px-5 py-3 text-sm font-bold text-slate-900"
      >
        <Filter size={16} />
        Order History
      </button>
    </div>
  </div>
);

const MetaChip = ({ icon: Icon, text }) => (
  <span className="inline-flex items-center gap-1.5 rounded-full bg-gray-100 px-3 py-1 text-xs font-bold text-gray-700">
    <Icon size={14} />
    {text}
  </span>
);

const StatusBadge = ({ status }) => (
  <span
    className={`inline-flex rounded-full px-3 py-1 text-xs font-bold ring-1 ${
      STATUS_STYLES[status] || STATUS_STYLES.default
    }`}
  >
    {status}
  </span>
);

const EmptyState = () => (
  <div className="rounded-2xl border border-dashed border-gray-200 bg-white px-6 py-16 text-center">
    <div className="mx-auto mb-5 grid h-16 w-16 place-items-center rounded-full bg-gray-100">
      <Package size={34} className="text-gray-400" />
    </div>

    <h2 className="text-xl font-bold text-gray-900">No Orders Found</h2>

    <p className="mt-2 text-sm text-gray-500">
      You haven't placed any orders yet.
    </p>

    <Link
      to="/products"
      className="mt-6 inline-flex items-center rounded-xl bg-[#ea2e0e] px-6 py-3 text-sm font-bold text-white transition hover:bg-[#d92a0c]"
    >
      Start Shopping
    </Link>
  </div>
);

const OrderCard = ({ order }) => {
  const image = order.items?.[0]?.image || "https://via.placeholder.com/150";

  const productNames = order.items?.map((item) => item.name).join(", ");

  const shippingAddress = `${order.shippingAddress?.address || ""}, ${
    order.shippingAddress?.city || ""
  }, ${order.shippingAddress?.postalCode || ""}`;

  const orderDate = new Date(order.createdAt).toLocaleDateString();

  return (
    <article className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm hover:shadow-md transition">
      <div className="border-l-4 border-[#ea2e0e] p-5">
        <div className="grid gap-5 lg:grid-cols-[1fr_180px]">
          <div className="grid gap-4 sm:grid-cols-[110px_1fr]">
            <div className="overflow-hidden rounded-xl bg-gray-100 h-28 w-full sm:w-28">
              <img
                src={image}
                alt={productNames}
                className="h-full w-full object-cover"
              />
            </div>

            <div>
              <div className="flex flex-wrap justify-between gap-3 border-b border-gray-100 pb-4">
                <div>
                  <p className="text-xs font-bold uppercase tracking-wide text-gray-400">
                    Order ID
                  </p>

                  <Link
                    to={`/orders/${order._id}`}
                    className="mt-1 inline-flex items-center gap-1 text-base font-bold hover:text-[#ea2e0e]"
                  >
                    {order.orderId}
                    <ExternalLink size={15} />
                  </Link>
                </div>

                <div className="flex flex-wrap gap-2">
                  <MetaChip icon={CalendarDays} text={orderDate} />
                  <MetaChip
                    icon={IndianRupee}
                    text={formatCurrency(order.totalPrice)}
                  />
                  <StatusBadge status={order.status} />
                </div>
              </div>

              <div className="grid gap-4 pt-4 md:grid-cols-2">
                <div>
                  <p className="text-xs font-bold uppercase tracking-wide text-gray-400">
                    Products
                  </p>

                  <p className="mt-1 text-sm font-semibold text-gray-700">
                    {productNames}
                  </p>

                  <p className="mt-2 text-sm text-gray-500">
                    Payment :
                    <span className="ml-1 font-bold text-[#ea2e0e]">
                      {order.paymentStatus}
                    </span>
                  </p>
                </div>

                <div className="flex gap-2">
                  <MapPin size={16} className="mt-1 text-[#ea2e0e]" />
                  <div>
                    <p className="text-xs font-bold uppercase tracking-wide text-gray-400">
                      Shipping Address
                    </p>

                    <p className="mt-1 text-sm text-gray-600">
                      {shippingAddress}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="grid gap-3">
            <Link
              to={`/orders/${order._id}`}
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-slate-900 px-5 py-3 text-sm font-bold text-white hover:bg-[#ea2e0e]"
            >
              <Search size={16} />
              View Details
            </Link>

            <button className="inline-flex items-center justify-center gap-2 rounded-xl bg-gray-100 px-5 py-3 text-sm font-bold text-gray-700">
              <Truck size={16} />
              {order.status === "Shipped" ? "Track Order" : order.status}
            </button>
          </div>
        </div>
      </div>
    </article>
  );
};

const MyOrdersPage = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeFilter, setActiveFilter] = useState("All");

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const token = localStorage.getItem("token");
      const user = JSON.parse(localStorage.getItem("user"));

      if (!user?._id) {
        setLoading(false);
        return;
      }

      const { data } = await axios.get(
        `https://rabbit-studio.onrender.com/api/orders/user/${user._id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      setOrders(data.orders || []);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  const filteredOrders = useMemo(() => {
    if (activeFilter === "All") return orders;

    return orders.filter((order) => order.status === activeFilter);
  }, [orders, activeFilter]);

  if (loading) {
    return (
      <div className="min-h-screen flex justify-center items-center text-xl font-bold">
        Loading Orders...
      </div>
    );
  }

  if (!orders.length) {
    return (
      <main className="bg-[#f6f7fb] px-4 py-8 min-h-screen">
        <div className="mx-auto max-w-6xl">
          <EmptyState />
        </div>
      </main>
    );
  }

  return (
    <main className="bg-[#f6f7fb] px-4 py-6 sm:px-6 lg:px-8 min-h-screen">
      <section className="mx-auto max-w-6xl space-y-6">
        <Header />

        <div className="overflow-x-auto rounded-2xl border border-gray-200 bg-white p-2 shadow-sm">
          <div className="flex min-w-max gap-2">
            {FILTERS.map((filter) => (
              <button
                key={filter}
                onClick={() => setActiveFilter(filter)}
                className={`rounded-xl px-4 py-2.5 text-sm font-bold transition ${
                  activeFilter === filter
                    ? "bg-[#ea2e0e] text-white"
                    : "hover:bg-gray-100"
                }`}
              >
                {filter}
              </button>
            ))}
          </div>
        </div>

        <div className="space-y-4">
          {filteredOrders.map((order) => (
            <OrderCard key={order._id} order={order} />
          ))}
        </div>
      </section>
    </main>
  );
};

export default MyOrdersPage;

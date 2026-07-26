import React, { useEffect, useState } from "react";
import {
  FiArrowLeft,
  FiCheckCircle,
  FiClock,
  FiCreditCard,
  FiMail,
  FiMapPin,
  FiPackage,
  FiPhone,
  FiTruck,
  FiUser,
} from "react-icons/fi";
import { Link, useParams } from "react-router-dom";
import axios from "axios";

const formatCurrency = (value) =>
  new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(value || 0);

const formatDate = (value) => {
  if (!value) return "N/A";
  return new Date(value).toLocaleDateString("en-IN", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
};

const OrderDetailsPage = () => {
  const { id } = useParams();
  const [orderDetails, setOrderDetails] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchOrderDetails();
  }, [id]);

  const fetchOrderDetails = async () => {
    try {
      const token = localStorage.getItem("token");
      const { data } = await axios.get(
        `https://rabbit-studio-drab.vercel.app/api/orders/${id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );
      setOrderDetails(data.order);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <main className="grid min-h-screen place-items-center bg-[#f6f7fb] px-6">
        <div className="text-center">
          <p className="text-xs font-bold uppercase tracking-wide text-gray-400">
            Loading Order Details...
          </p>
          <div className="mx-auto mt-5 h-10 w-10 animate-spin rounded-full border-2 border-gray-200 border-t-[#ea2e0e]" />
        </div>
      </main>
    );
  }

  if (!orderDetails) {
    return (
      <main className="grid min-h-screen place-items-center bg-[#f6f7fb] px-6">
        <div className="text-center space-y-4">
          <p className="text-xl font-bold text-gray-900">Order Not Found</p>
          <Link
            to="/my-order"
            className="inline-flex items-center rounded-xl bg-[#ea2e0e] px-5 py-2.5 text-sm font-bold text-white"
          >
            Back to Orders
          </Link>
        </div>
      </main>
    );
  }

  const itemsList = orderDetails.items || orderDetails.orderItems || [];
  const subtotal = itemsList.reduce(
    (total, item) => total + (item.price || 0) * (item.quantity || 1),
    0,
  );
  const shippingCost = subtotal > 3000 ? 0 : 150;
  const total = orderDetails.totalPrice || subtotal + shippingCost;

  const isPaid = orderDetails.paymentStatus === "Paid" || orderDetails.isPaid;
  const isDelivered =
    orderDetails.status === "Delivered" || orderDetails.isDelivered;

  return (
    <main className="min-h-screen bg-[#f6f7fb] p-4 text-gray-950 sm:p-6 lg:p-8">
      <div className="mx-auto max-w-7xl space-y-6">
        <Link
          to="/my-orders"
          className="inline-flex items-center gap-2 rounded-lg border border-gray-200 bg-white px-4 py-2.5 text-sm font-bold text-gray-700 shadow-sm transition hover:border-[#ea2e0e]/30 hover:bg-orange-50 hover:text-[#ea2e0e]"
        >
          <FiArrowLeft size={16} />
          Back to Orders
        </Link>

        <header className="overflow-hidden rounded-2xl bg-gradient-to-r from-slate-950 via-slate-900 to-[#ea2e0e] p-5 text-white shadow-sm sm:p-6">
          <div className="flex flex-col gap-5 md:flex-row md:items-end md:justify-between">
            <div>
              <p className="text-sm font-semibold uppercase tracking-wide text-white/60">
                Order Details
              </p>
              <h1 className="mt-1 text-2xl font-bold tracking-tight sm:text-3xl">
                #{orderDetails.orderId || orderDetails._id}
              </h1>
              <p className="mt-2 text-sm text-white/70">
                Placed on {formatDate(orderDetails.createdAt)}
              </p>
            </div>

            <div className="flex flex-wrap gap-3">
              <StatusPill
                active={isPaid}
                label={isPaid ? "Paid" : "Payment Pending"}
              />
              <StatusPill
                active={isDelivered}
                label={orderDetails.status || "Processing"}
                pending={!isDelivered}
              />
            </div>
          </div>
        </header>

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
          <section className="space-y-6 lg:col-span-8">
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <InfoCard icon={<FiUser size={18} />} title="Customer Info">
                <InfoRow
                  icon={<FiUser size={14} />}
                  text={orderDetails.user?.name || "Customer"}
                />
                <InfoRow
                  icon={<FiMail size={14} />}
                  text={orderDetails.user?.email || "No email available"}
                />
                <InfoRow
                  icon={<FiPhone size={14} />}
                  text={orderDetails.user?.phone || "+91 98765 43210"}
                />
              </InfoCard>

              <InfoCard icon={<FiCreditCard size={18} />} title="Payment Info">
                <DetailLine
                  label="Method"
                  value={orderDetails.paymentMethod || "Online Payment"}
                />
                <DetailLine
                  label="Status"
                  value={orderDetails.paymentStatus || "Pending"}
                />
                <DetailLine
                  label="Confirmation"
                  value={isPaid ? "Confirmed" : "Pending"}
                />
              </InfoCard>

              <InfoCard icon={<FiMapPin size={18} />} title="Shipping Info">
                <DetailLine
                  label="Method"
                  value={orderDetails.shippingMethod || "Standard Delivery"}
                />
                <DetailLine
                  label="Status"
                  value={orderDetails.status || "Processing"}
                />
                <DetailLine
                  label="Address"
                  value={`${orderDetails.shippingAddress?.address || ""}, ${orderDetails.shippingAddress?.city || ""}, ${orderDetails.shippingAddress?.postalCode || ""}`}
                />
              </InfoCard>

              <InfoCard icon={<FiTruck size={18} />} title="Delivery Status">
                <DetailLine
                  label="Current"
                  value={orderDetails.status || "Processing"}
                />
                <DetailLine
                  label="Shipment"
                  value={
                    isDelivered ? "Completed" : "Currently being processed"
                  }
                />
              </InfoCard>
            </div>

            <section className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">
              <div className="flex items-center gap-3 border-b border-gray-200 px-4 py-4 sm:px-6">
                <div className="grid h-11 w-11 place-items-center rounded-xl bg-[#ea2e0e]/10 text-[#ea2e0e]">
                  <FiPackage size={20} />
                </div>
                <div>
                  <h2 className="text-lg font-bold text-gray-950">
                    Product List
                  </h2>
                  <p className="mt-1 text-sm text-gray-500">
                    {itemsList.length} items in this order
                  </p>
                </div>
              </div>

              <div className="space-y-3 bg-gray-50/60 p-4 sm:p-6">
                {itemsList.map((item, index) => {
                  const itemName =
                    item.name || item.product?.name || "Product Item";
                  const itemImage =
                    item.image ||
                    item.product?.image ||
                    "https://picsum.photos/150";
                  const itemPrice = item.price || 0;
                  const itemQty = item.quantity || 1;

                  return (
                    <article
                      key={item.productId || item._id || index}
                      className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm"
                    >
                      <div className="border-l-4 border-[#ea2e0e] p-4">
                        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                          <div className="flex gap-4">
                            <div className="h-24 w-20 shrink-0 overflow-hidden rounded-xl bg-gray-100">
                              <img
                                src={itemImage}
                                alt={itemName}
                                className="h-full w-full object-cover"
                              />
                            </div>
                            <div className="min-w-0">
                              <h3 className="font-bold leading-tight text-gray-950">
                                {itemName}
                              </h3>
                              <p className="mt-2 text-sm font-medium text-gray-500">
                                Qty: {itemQty}
                              </p>
                              <p className="mt-1 text-sm font-medium text-gray-500">
                                Price: {formatCurrency(itemPrice)}
                              </p>
                            </div>
                          </div>

                          <div className="text-left sm:text-right">
                            <p className="text-xs font-bold uppercase tracking-wide text-gray-400">
                              Item Total
                            </p>
                            <p className="mt-1 text-xl font-bold text-gray-950">
                              {formatCurrency(itemPrice * itemQty)}
                            </p>
                          </div>
                        </div>
                      </div>
                    </article>
                  );
                })}
              </div>
            </section>
          </section>

          <aside className="lg:col-span-4">
            <div className="sticky top-6 space-y-6">
              <section className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm sm:p-6">
                <h2 className="text-lg font-bold text-gray-950">
                  Order Summary
                </h2>

                <div className="mt-6 space-y-4">
                  <SummaryRow
                    label="Subtotal"
                    value={formatCurrency(subtotal)}
                  />
                  <SummaryRow
                    label="Shipping"
                    value={
                      shippingCost === 0
                        ? "Complimentary"
                        : formatCurrency(shippingCost)
                    }
                    highlight={shippingCost === 0}
                  />

                  <div className="flex items-end justify-between border-t border-gray-100 pt-5">
                    <span className="text-sm font-bold text-gray-500">
                      Total
                    </span>
                    <span className="text-3xl font-bold tracking-tight text-[#ea2e0e]">
                      {formatCurrency(total)}
                    </span>
                  </div>
                </div>
              </section>

              <section className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm sm:p-6">
                <h2 className="text-lg font-bold text-gray-950">
                  Order Timeline
                </h2>

                <div className="mt-6 space-y-5">
                  <TimelineStep
                    icon={<FiCheckCircle size={16} />}
                    title="Order Confirmed"
                    active
                  />
                  <TimelineStep
                    icon={<FiCreditCard size={16} />}
                    title={isPaid ? "Payment Received" : "Awaiting Payment"}
                    active={isPaid}
                  />
                  <TimelineStep
                    icon={<FiTruck size={16} />}
                    title={isDelivered ? "Delivered" : "Shipment In Progress"}
                    active={isDelivered}
                    pending={!isDelivered}
                  />
                </div>
              </section>
            </div>
          </aside>
        </div>
      </div>
    </main>
  );
};

const InfoCard = ({ icon, title, children }) => (
  <section className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm sm:p-6">
    <div className="mb-5 flex items-center gap-3">
      <div className="grid h-11 w-11 place-items-center rounded-xl bg-[#ea2e0e]/10 text-[#ea2e0e]">
        {icon}
      </div>
      <h2 className="text-lg font-bold text-gray-950">{title}</h2>
    </div>
    <div className="space-y-3">{children}</div>
  </section>
);

const InfoRow = ({ icon, text }) => (
  <div className="flex items-center gap-3 text-sm font-semibold text-gray-700">
    <span className="text-[#ea2e0e]">{icon}</span>
    <span className="truncate">{text}</span>
  </div>
);

const DetailLine = ({ label, value }) => (
  <div>
    <p className="text-xs font-bold uppercase tracking-wide text-gray-400">
      {label}
    </p>
    <p className="mt-1 text-sm font-semibold leading-6 text-gray-800">
      {value}
    </p>
  </div>
);

const StatusPill = ({ active, label, pending = false }) => (
  <span
    className={`rounded-full px-4 py-2 text-xs font-bold ring-1 ${
      active
        ? "bg-emerald-100 text-emerald-800 ring-emerald-200"
        : pending
          ? "bg-amber-100 text-amber-800 ring-amber-200"
          : "bg-gray-100 text-gray-700 ring-gray-200"
    }`}
  >
    {label}
  </span>
);

const SummaryRow = ({ label, value, highlight = false }) => (
  <div className="flex items-center justify-between text-sm">
    <span className="font-semibold text-gray-500">{label}</span>
    <span
      className={`font-bold ${highlight ? "text-emerald-600" : "text-gray-950"}`}
    >
      {value}
    </span>
  </div>
);

const TimelineStep = ({ icon, title, active = false, pending = false }) => (
  <div className="flex items-center gap-4">
    <div
      className={`grid h-10 w-10 place-items-center rounded-xl ${
        active
          ? "bg-[#ea2e0e] text-white"
          : pending
            ? "bg-amber-100 text-amber-700"
            : "bg-gray-100 text-gray-400"
      }`}
    >
      {pending ? <FiClock size={16} /> : icon}
    </div>
    <p className="text-sm font-bold text-gray-950">{title}</p>
  </div>
);

export default OrderDetailsPage;

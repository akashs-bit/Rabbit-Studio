import React, { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import {
  FiArrowRight,
  FiCheckCircle,
  FiPackage,
  FiPrinter,
} from "react-icons/fi";

const formatCurrency = (value = 0) =>
  new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(value);

const OrderConfirmationPage = () => {
  const { state } = useLocation();
  const navigate = useNavigate();

  const orderData = state || JSON.parse(localStorage.getItem("latestOrder"));

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  if (!orderData) {
    return (
      <main className="grid min-h-screen place-items-center bg-[#f6f7fb] p-6">
        <div className="rounded-2xl border border-gray-200 bg-white px-6 py-10 text-center shadow-sm">
          <p className="text-sm font-semibold uppercase tracking-wide text-gray-400">
            No Session Found
          </p>

          <button
            type="button"
            onClick={() => navigate("/")}
            className="mt-5 rounded-lg bg-[#ea2e0e] px-5 py-3 text-sm font-bold text-white transition hover:bg-[#d92a0c]"
          >
            Back to Boutique
          </button>
        </div>
      </main>
    );
  }

  // Robust check for payment method text formatting
  const rawPaymentMethod =
    orderData.paymentMethod ||
    orderData.payment ||
    (orderData.paymentStatus === "Paid"
      ? "Credit / Debit Card"
      : "Cash on Delivery");

  const formattedPaymentMethod =
    rawPaymentMethod.toLowerCase().includes("card") ||
    rawPaymentMethod.toLowerCase().includes("paid")
      ? "Credit / Debit Card"
      : rawPaymentMethod;

  const orderId = orderData._id || orderData.orderId || "";
  const items = orderData.items || [];
  const shippingCost =
    orderData.pricing?.shipping || orderData.shippingFee || 0;
  const totalPrice = orderData.totalPrice || orderData.total || 0;
  const customerName =
    orderData.customer?.fullName ||
    orderData.shippingAddress?.fullName ||
    orderData.payerName ||
    "Valued Customer";

  return (
    <main className="min-h-screen bg-[#f6f7fb] p-4 sm:p-6 lg:p-8">
      <div className="mx-auto max-w-5xl space-y-6">
        <header className="overflow-hidden rounded-2xl bg-gradient-to-r from-slate-950 via-slate-900 to-[#ea2e0e] p-5 text-white shadow-sm sm:p-6">
          <div className="flex flex-col items-start gap-5 md:flex-row md:items-center md:justify-between">
            <div>
              <p className="text-sm font-semibold uppercase tracking-wide text-white/60">
                Order Confirmed
              </p>
              <h1 className="mt-1 text-2xl font-bold tracking-tight sm:text-3xl">
                Payment Received
              </h1>
              <p className="mt-2 max-w-xl text-sm text-white/70">
                Thank you, {customerName}. Your order is being prepared.
              </p>
            </div>

            <div className="grid h-16 w-16 shrink-0 place-items-center rounded-2xl bg-white/10 text-emerald-300 ring-1 ring-white/15">
              <FiCheckCircle size={34} />
            </div>
          </div>
        </header>

        <section className="grid gap-6 lg:grid-cols-[1fr_340px]">
          <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">
            <div className="grid gap-4 border-b border-gray-200 px-4 py-4 sm:grid-cols-2 sm:px-6">
              <MetaBlock
                label="Order ID"
                value={orderId ? `#${orderId.slice(-8).toUpperCase()}` : "#N/A"}
              />
              <MetaBlock
                label="Payment Method"
                value={formattedPaymentMethod}
                alignRight
              />
            </div>

            <div className="p-4 sm:p-6">
              <div className="mb-5 flex items-center gap-3">
                <div className="grid h-11 w-11 place-items-center rounded-xl bg-[#ea2e0e]/10 text-[#ea2e0e]">
                  <FiPackage size={20} />
                </div>

                <div>
                  <h2 className="text-lg font-bold text-gray-950">
                    Order Summary
                  </h2>
                  <p className="mt-1 text-sm text-gray-500">
                    {items.length} item{items.length === 1 ? "" : "s"} in this
                    order
                  </p>
                </div>
              </div>

              <div className="space-y-3">
                {items.map((item, index) => (
                  <article
                    key={item.product || item.productID || index}
                    className="overflow-hidden rounded-xl border border-gray-200 bg-gray-50/70"
                  >
                    <div className="border-l-4 border-[#ea2e0e] p-4">
                      <div className="flex gap-4">
                        <div className="h-20 w-16 shrink-0 overflow-hidden rounded-xl bg-white">
                          <img
                            src={item.image}
                            className="h-full w-full object-cover"
                            alt={item.name}
                          />
                        </div>

                        <div className="min-w-0 flex-1">
                          <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                            <div className="min-w-0">
                              <h3 className="truncate font-bold text-gray-950">
                                {item.name}
                              </h3>
                              <p className="mt-2 text-sm font-medium text-gray-500">
                                {item.size ? `Size ${item.size} / ` : ""}Qty{" "}
                                {item.quantity}
                              </p>
                            </div>

                            <p className="shrink-0 font-bold text-gray-950">
                              {formatCurrency(item.price * item.quantity)}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </article>
                ))}
              </div>
            </div>
          </div>

          <aside className="space-y-6">
            <section className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm sm:p-6">
              <h2 className="text-lg font-bold text-gray-950">Receipt</h2>

              <div className="mt-6 space-y-4">
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
                    Final Total
                  </span>
                  <span className="text-3xl font-bold tracking-tight text-[#ea2e0e]">
                    {formatCurrency(totalPrice)}
                  </span>
                </div>
              </div>
            </section>

            <section className="rounded-2xl border border-emerald-200 bg-emerald-50 p-5 text-emerald-800 shadow-sm sm:p-6">
              <div className="flex items-start gap-3">
                <FiPackage size={22} className="mt-0.5 shrink-0" />
                <div>
                  <h3 className="font-bold">Estimated Arrival</h3>
                  <p className="mt-1 text-sm font-semibold">
                    3-5 business days
                  </p>
                </div>
              </div>
            </section>

            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-1">
              <button
                type="button"
                onClick={() => navigate("/")}
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-slate-950 px-5 py-3 text-sm font-bold text-white transition hover:bg-[#ea2e0e]"
              >
                Continue Browsing
                <FiArrowRight />
              </button>

              <button
                type="button"
                onClick={() => window.print()}
                className="inline-flex items-center justify-center gap-2 rounded-xl border border-gray-200 bg-white px-5 py-3 text-sm font-bold text-gray-700 transition hover:bg-gray-100"
              >
                <FiPrinter />
                Print Receipt
              </button>
            </div>

            <p className="text-center text-sm font-medium text-gray-500">
              A confirmation and tracking link has been sent to your email.
            </p>
          </aside>
        </section>
      </div>
    </main>
  );
};

const MetaBlock = ({ label, value, alignRight = false }) => (
  <div className={alignRight ? "sm:text-right" : ""}>
    <p className="text-xs font-bold uppercase tracking-wide text-gray-400">
      {label}
    </p>
    <p className="mt-1 text-sm font-bold text-gray-950">{value}</p>
  </div>
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

export default OrderConfirmationPage;

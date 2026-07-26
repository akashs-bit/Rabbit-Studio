import React, { useMemo, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import {
  FiArrowLeft,
  FiCheckCircle,
  FiCreditCard,
  FiLoader,
  FiLock,
  FiMapPin,
  FiPackage,
} from "react-icons/fi";
import { useShop } from "./ShopContext";
import axios from "axios";
import { toast } from "sonner";

const FREE_SHIPPING_LIMIT = 5000;
const SHIPPING_FEE = 150;

const initialShipping = {
  fullName: "",
  email: "",
  phone: "",
  address: "",
  city: "",
  zip: "",
};

const initialCard = {
  cardNumber: "",
  cardHolder: "",
  expiryDate: "",
  cvv: "",
};

const formatCurrency = (value) =>
  new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(value);

const Checkout = () => {
  const { state } = useLocation();
  const navigate = useNavigate();

  const { cartProducts: contextCartItems, clearCart } = useShop();
  const cartItems = state?.cartProducts || contextCartItems;

  const [shipping, setShipping] = useState(initialShipping);
  const [card, setCard] = useState(initialCard);
  const [paymentMethod, setPaymentMethod] = useState("cod");
  const [errors, setErrors] = useState({});
  const [isPlacingOrder, setIsPlacingOrder] = useState(false);

  const pricing = useMemo(() => {
    const subtotal = cartItems.reduce(
      (total, item) => total + item.price * item.quantity,
      0,
    );

    const delivery = subtotal >= FREE_SHIPPING_LIMIT ? 0 : SHIPPING_FEE;

    return {
      subtotal,
      delivery,
      total: subtotal + delivery,
    };
  }, [cartItems]);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setShipping((current) => ({
      ...current,
      [name]: value,
    }));
    setErrors((current) => ({
      ...current,
      [name]: "",
    }));
  };

  const handleCardChange = (event) => {
    const { name, value } = event.target;
    setCard((current) => ({
      ...current,
      [name]: value,
    }));
    setErrors((current) => ({
      ...current,
      [name]: "",
    }));
  };

  const validateForm = () => {
    const nextErrors = {};

    if (!shipping.fullName.trim()) nextErrors.fullName = "Full name is required";
    if (!shipping.email.trim()) nextErrors.email = "Email is required";
    if (!shipping.address.trim()) nextErrors.address = "Address is required";
    if (!shipping.city.trim()) nextErrors.city = "City is required";
    if (!shipping.zip.trim()) nextErrors.zip = "Postal code is required";

    if (paymentMethod === "card") {
      if (!card.cardNumber.trim()) nextErrors.cardNumber = "Card number is required";
      if (!card.cardHolder.trim()) nextErrors.cardHolder = "Card holder name is required";
      if (!card.expiryDate.trim()) nextErrors.expiryDate = "Expiry date is required";
      if (!card.cvv.trim()) nextErrors.cvv = "CVV is required";
    }

    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const placeOrder = async () => {
    if (!validateForm()) return;

    setIsPlacingOrder(true);

    try {
      const token = localStorage.getItem("token");
      const user = JSON.parse(localStorage.getItem("user"));

      // FIX: Ensure the correct payment method label is passed based on user selection
      const selectedPaymentLabel =
        paymentMethod === "card" ? "Credit / Debit Card" : "Cash on Delivery";
      const selectedPaymentStatus =
        paymentMethod === "card" ? "Paid" : "Pending";

      const orderData = {
        user: user._id,
        items: cartItems.map((item) => ({
          product: item.productID || item._id,
          name: item.name,
          image: item.image,
          quantity: item.quantity,
          price: item.price,
          size: item.size,
        })),
        shippingAddress: {
          fullName: shipping.fullName,
          address: shipping.address,
          city: shipping.city,
          postalCode: shipping.zip,
        },
        pricing: {
          subtotal: pricing.subtotal,
          shipping: pricing.delivery,
        },
        totalPrice: pricing.total,
        total: pricing.total,
        paymentMethod: selectedPaymentLabel,
        paymentStatus: selectedPaymentStatus,
      };

      const { data } = await axios.post(
        "http://localhost:5000/api/orders",
        orderData,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      const savedOrder = data.order || data;
      
      // Save full payload to localStorage so the confirmation page captures it accurately
      localStorage.setItem("latestOrder", JSON.stringify(savedOrder));

      toast.success("Order placed successfully");
      clearCart();
      navigate("/order-confirmation", { state: savedOrder });
    } catch (error) {
      console.log(error);
      toast.error(error.response?.data?.message || "Failed to place order");
    } finally {
      setIsPlacingOrder(false);
    }
  };

  if (!cartItems.length) {
    return <EmptyCheckout onShop={() => navigate("/")} />;
  }

  return (
    <main className="min-h-screen bg-[#f6f7fb] p-4 text-gray-950 sm:p-6 lg:p-8">
      <div className="mx-auto max-w-7xl space-y-6">
        <button
          type="button"
          onClick={() => navigate(-1)}
          className="inline-flex items-center gap-2 rounded-lg border border-gray-200 bg-white px-4 py-2.5 text-sm font-bold text-gray-700 shadow-sm transition hover:border-[#ea2e0e]/30 hover:bg-orange-50 hover:text-[#ea2e0e]"
        >
          <FiArrowLeft size={16} />
          Return to Bag
        </button>

        <header className="overflow-hidden rounded-2xl bg-gradient-to-r from-slate-950 via-slate-900 to-[#ea2e0e] p-5 text-white shadow-sm sm:p-6">
          <div className="flex flex-col gap-5 md:flex-row md:items-end md:justify-between">
            <div>
              <p className="text-sm font-semibold uppercase tracking-wide text-white/60">
                Secure Checkout
              </p>
              <h1 className="mt-1 text-2xl font-bold tracking-tight sm:text-3xl">
                Complete Your Order
              </h1>
              <p className="mt-2 max-w-xl text-sm text-white/70">
                Add your shipping details, choose a payment method, and review
                everything before placing the order.
              </p>
            </div>

            <div className="rounded-xl bg-white/10 px-4 py-3 ring-1 ring-white/15">
              <p className="text-xs font-semibold uppercase tracking-wide text-white/55">
                Checkout Total
              </p>
              <p className="mt-1 text-2xl font-bold text-white">
                {formatCurrency(pricing.total)}
              </p>
            </div>
          </div>
        </header>

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
          <section className="space-y-6 lg:col-span-7">
            <Panel icon={<FiMapPin />} title="Shipping Address">
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <Field
                  label="Full Name"
                  name="fullName"
                  value={shipping.fullName}
                  error={errors.fullName}
                  onChange={handleChange}
                  placeholder="Akash Bojja"
                  autoComplete="name"
                />

                <Field
                  label="Email"
                  name="email"
                  type="email"
                  value={shipping.email}
                  error={errors.email}
                  onChange={handleChange}
                  placeholder="akash@example.com"
                  autoComplete="email"
                />

                <Field
                  label="Phone"
                  name="phone"
                  value={shipping.phone}
                  onChange={handleChange}
                  placeholder="+91 98765 43210"
                  autoComplete="tel"
                />

                <Field
                  label="Postal Code"
                  name="zip"
                  value={shipping.zip}
                  error={errors.zip}
                  onChange={handleChange}
                  placeholder="585101"
                  autoComplete="postal-code"
                />

                <div className="md:col-span-2">
                  <Field
                    label="Street Address"
                    name="address"
                    value={shipping.address}
                    error={errors.address}
                    onChange={handleChange}
                    placeholder="House no, street, area"
                    autoComplete="street-address"
                  />
                </div>

                <Field
                  label="City"
                  name="city"
                  value={shipping.city}
                  error={errors.city}
                  onChange={handleChange}
                  placeholder="Kalaburagi"
                  autoComplete="address-level2"
                />
              </div>
            </Panel>

            <Panel icon={<FiCreditCard />} title="Payment Method">
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                <PaymentButton
                  active={paymentMethod === "cod"}
                  title="Cash on Delivery"
                  subtitle="Pay when your order arrives"
                  onClick={() => setPaymentMethod("cod")}
                />

                <PaymentButton
                  active={paymentMethod === "card"}
                  title="Credit / Debit Card"
                  subtitle="Pay securely with card"
                  onClick={() => setPaymentMethod("card")}
                />
              </div>

              {paymentMethod === "card" && (
                <div className="mt-6 space-y-4 rounded-xl border border-gray-100 bg-gray-50/50 p-4 sm:p-5">
                  <h3 className="text-sm font-bold text-gray-950">Enter Card Details</h3>
                  
                  <Field
                    label="Card Number"
                    name="cardNumber"
                    value={card.cardNumber}
                    error={errors.cardNumber}
                    onChange={handleCardChange}
                    placeholder="4012 3456 7890 1234"
                    maxLength={19}
                  />

                  <Field
                    label="Card Holder Name"
                    name="cardHolder"
                    value={card.cardHolder}
                    error={errors.cardHolder}
                    onChange={handleCardChange}
                    placeholder="Akash Bojja"
                  />

                  <div className="grid grid-cols-2 gap-4">
                    <Field
                      label="Expiry Date"
                      name="expiryDate"
                      value={card.expiryDate}
                      error={errors.expiryDate}
                      onChange={handleCardChange}
                      placeholder="MM/YY"
                      maxLength={5}
                    />

                    <Field
                      label="CVV"
                      name="cvv"
                      type="password"
                      value={card.cvv}
                      error={errors.cvv}
                      onChange={handleCardChange}
                      placeholder="123"
                      maxLength={4}
                    />
                  </div>
                </div>
              )}
            </Panel>
          </section>

          <aside className="lg:col-span-5">
            <OrderSummary
              items={cartItems}
              pricing={pricing}
              paymentMethod={paymentMethod}
              isPlacingOrder={isPlacingOrder}
              onPlaceOrder={placeOrder}
            />
          </aside>
        </div>
      </div>
    </main>
  );
};

const Panel = ({ icon, title, children }) => (
  <section className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">
    <div className="flex items-center gap-3 border-b border-gray-200 px-4 py-4 sm:px-6">
      <div className="grid h-11 w-11 place-items-center rounded-xl bg-[#ea2e0e]/10 text-[#ea2e0e]">
        {icon}
      </div>
      <h2 className="text-lg font-bold text-gray-950">{title}</h2>
    </div>

    <div className="p-4 sm:p-6">{children}</div>
  </section>
);

const Field = ({ label, error, ...props }) => (
  <label className="block">
    <span className="mb-2 block text-sm font-bold text-gray-800">{label}</span>

    <input
      {...props}
      className={`h-12 w-full rounded-xl border bg-white px-4 text-sm font-semibold text-gray-950 outline-none transition placeholder:text-gray-400 focus:ring-2 ${
        error
          ? "border-red-300 focus:border-red-500 focus:ring-red-500/15"
          : "border-gray-200 focus:border-[#ea2e0e] focus:ring-[#ea2e0e]/15"
      }`}
    />

    {error && (
      <span className="mt-2 block text-sm font-medium text-red-600">
        {error}
      </span>
    )}
  </label>
);

const PaymentButton = ({ active, title, subtitle, onClick }) => (
  <button
    type="button"
    onClick={onClick}
    aria-pressed={active}
    className={`flex items-center gap-4 rounded-xl border p-4 text-left transition ${
      active
        ? "border-[#ea2e0e] bg-[#ea2e0e]/5 shadow-sm"
        : "border-gray-200 bg-white hover:border-[#ea2e0e]/30 hover:bg-orange-50"
    }`}
  >
    <span
      className={`grid h-6 w-6 shrink-0 place-items-center rounded-full border ${
        active
          ? "border-[#ea2e0e] bg-[#ea2e0e] text-white"
          : "border-gray-300 text-transparent"
      }`}
    >
      <FiCheckCircle size={14} />
    </span>

    <span>
      <span className="block text-sm font-bold text-gray-950">{title}</span>
      <span className="mt-1 block text-xs font-semibold text-gray-500">
        {subtitle}
      </span>
    </span>
  </button>
);

const OrderSummary = ({
  items,
  pricing,
  paymentMethod,
  isPlacingOrder,
  onPlaceOrder,
}) => (
  <div className="sticky top-6 overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">
    <div className="flex items-center justify-between border-b border-gray-200 px-4 py-4 sm:px-6">
      <div>
        <h3 className="text-lg font-bold text-gray-950">Order Summary</h3>
        <p className="mt-1 text-sm text-gray-500">
          {items.length} item{items.length === 1 ? "" : "s"} selected
        </p>
      </div>
      <div className="grid h-11 w-11 place-items-center rounded-xl bg-[#ea2e0e]/10 text-[#ea2e0e]">
        <FiPackage size={20} />
      </div>
    </div>

    <div className="max-h-72 space-y-4 overflow-y-auto bg-gray-50/60 p-4 sm:p-6">
      {items.map((item) => (
        <div
          key={item.productID || item._id}
          className="rounded-xl border border-gray-200 bg-white p-3 shadow-sm"
        >
          <div className="flex items-center gap-3">
            <div className="h-20 w-16 shrink-0 overflow-hidden rounded-xl bg-gray-100">
              <img
                src={item.image}
                alt={item.name}
                className="h-full w-full object-cover"
              />
            </div>

            <div className="min-w-0 flex-1">
              <p className="line-clamp-2 text-sm font-bold text-gray-950">
                {item.name}
              </p>
              <p className="mt-1 text-xs font-semibold text-gray-500">
                Qty {item.quantity}
              </p>
            </div>

            <p className="shrink-0 text-sm font-bold text-gray-950">
              {formatCurrency(item.price * item.quantity)}
            </p>
          </div>
        </div>
      ))}
    </div>

    <div className="p-4 sm:p-6">
      <div className="space-y-4">
        <SummaryRow label="Subtotal" value={formatCurrency(pricing.subtotal)} />
        <SummaryRow
          label="Shipping"
          value={
            pricing.delivery === 0
              ? "Complimentary"
              : formatCurrency(pricing.delivery)
          }
          highlight={pricing.delivery === 0}
        />

        <div className="flex items-end justify-between border-t border-gray-100 pt-5">
          <span className="text-sm font-bold text-gray-500">Total</span>
          <span className="text-3xl font-bold tracking-tight text-[#ea2e0e]">
            {formatCurrency(pricing.total)}
          </span>
        </div>
      </div>

      <button
        type="button"
        disabled={isPlacingOrder}
        onClick={onPlaceOrder}
        className="mt-6 flex w-full items-center justify-center gap-3 rounded-xl bg-slate-950 px-6 py-4 text-sm font-bold text-white shadow-sm transition hover:bg-[#ea2e0e] active:scale-[0.98] disabled:cursor-not-allowed disabled:bg-gray-200 disabled:text-gray-400"
      >
        {isPlacingOrder ? (
          <>
            <FiLoader className="animate-spin" size={16} />
            Processing
          </>
        ) : (
          <>
            <FiLock size={15} />
            {paymentMethod === "card" ? "Pay Now" : "Place Order"}
          </>
        )}
      </button>

      <p className="mt-5 text-center text-xs font-semibold text-gray-400">
        Encrypted checkout / 30 day returns
      </p>
    </div>
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

const EmptyCheckout = ({ onShop }) => (
  <main className="grid min-h-screen place-items-center bg-[#f6f7fb] px-6 text-center">
    <div className="rounded-2xl border border-gray-200 bg-white px-6 py-10 shadow-sm">
      <div className="mx-auto mb-5 grid h-16 w-16 place-items-center rounded-full bg-[#ea2e0e]/10 text-[#ea2e0e]">
        <FiPackage size={30} />
      </div>

      <h1 className="text-xl font-bold text-gray-950">Your cart is empty</h1>
      <p className="mt-2 text-sm text-gray-500">
        Add products to your bag before checkout.
      </p>

      <button
        type="button"
        onClick={onShop}
        className="mt-6 rounded-xl bg-slate-950 px-6 py-3 text-sm font-bold text-white transition hover:bg-[#ea2e0e]"
      >
        Start Shopping
      </button>
    </div>
  </main>
);

export default Checkout;
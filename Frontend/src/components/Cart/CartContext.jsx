import React, { useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { RiDeleteBin3Line } from "react-icons/ri";
import { HiOutlineArrowRight, HiOutlineShoppingBag } from "react-icons/hi";
import { FiMinus, FiPlus, FiTruck } from "react-icons/fi";
import { toast } from "sonner";
import { useShop } from "./ShopContext";

const FREE_SHIPPING_LIMIT = 5000;
const SHIPPING_FEE = 150;
const MAX_QUANTITY = 10;

const formatCurrency = (value) =>
  new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(value);

const CartContext = ({ onClose }) => {
  const navigate = useNavigate();

  // Read live state & handlers from shared ShopContext
  const { cartProducts, updateQuantity, removeFromCart } = useShop();

  const subtotal = useMemo(
    () =>
      cartProducts.reduce(
        (total, item) => total + item.price * item.quantity,
        0,
      ),
    [cartProducts],
  );

  const shippingFee = subtotal >= FREE_SHIPPING_LIMIT ? 0 : SHIPPING_FEE;
  const total = subtotal + shippingFee;
  const amountForFreeShipping = Math.max(FREE_SHIPPING_LIMIT - subtotal, 0);
  const shippingProgress = Math.min(
    (subtotal / FREE_SHIPPING_LIMIT) * 100,
    100,
  );

  const handleCheckout = () => {
    if (!cartProducts.length) return;

    // Check auth status
    const isAuthenticated =
      Boolean(localStorage.getItem("token")) ||
      Boolean(localStorage.getItem("user"));

    onClose?.();

    // If NOT logged in -> notify user and redirect to register/login
    if (!isAuthenticated) {
      toast.info("Please register or log in to complete your checkout!", {
        description: "An account is required to place an order.",
      });
      navigate("/login", {
        state: {
          from: "/checkout",
          cartProducts,
          subtotal,
          shippingFee,
          total,
        },
      });
      return;
    }

    // If logged in -> proceed to checkout page
    navigate("/checkout", {
      state: {
        cartProducts,
        subtotal,
        shippingFee,
        total,
      },
    });
  };

  if (!cartProducts.length) {
    return <EmptyCart onExplore={() => navigate("/")} />;
  }

  return (
    <div className="flex h-full w-full flex-col bg-white overflow-hidden">
      {/* Cart Header */}
      <div className="flex shrink-0 items-center justify-between border-b border-gray-100 px-5 py-4">
        <div>
          <p className="text-xs font-bold uppercase tracking-wide text-[#ea2e0e]">
            Shopping Bag
          </p>
          <h2 className="mt-0.5 text-xl font-bold text-gray-950 sm:text-2xl">
            Your Cart
          </h2>
        </div>

        <span className="rounded-full bg-gray-100 px-3 py-1.5 text-xs font-bold text-gray-700 sm:text-sm">
          {cartProducts.length} item{cartProducts.length === 1 ? "" : "s"}
        </span>
      </div>

      {/* Free Shipping Tracker */}
      <ShippingProgress
        subtotal={subtotal}
        progress={shippingProgress}
        amountRemaining={amountForFreeShipping}
      />

      {/* Scrollable Products Area */}
      <div className="flex-1 overflow-y-auto bg-gray-50/70 px-4 py-3">
        <div className="space-y-3">
          {cartProducts.map((product) => {
            const uniqueKey = `${product.productID || product._id}-${product.size}-${product.color}`;

            return (
              <CartItem
                key={uniqueKey}
                product={product}
                onDecrease={() =>
                  updateQuantity(
                    product.productID || product._id,
                    product.size,
                    product.color,
                    -1,
                  )
                }
                onIncrease={() =>
                  updateQuantity(
                    product.productID || product._id,
                    product.size,
                    product.color,
                    1,
                  )
                }
                onRemove={() => removeFromCart(product)}
              />
            );
          })}
        </div>
      </div>

      {/* Cart Footer */}
      <CartFooter
        subtotal={subtotal}
        shippingFee={shippingFee}
        total={total}
        onCheckout={handleCheckout}
      />
    </div>
  );
};

const EmptyCart = ({ onExplore }) => (
  <div className="grid h-full w-full place-items-center bg-white p-6 text-center">
    <div>
      <div className="mx-auto mb-5 grid h-16 w-16 place-items-center rounded-full bg-[#ea2e0e]/10 text-[#ea2e0e]">
        <HiOutlineShoppingBag size={34} />
      </div>

      <h2 className="text-xl font-bold text-gray-950">Your cart is empty</h2>
      <p className="mt-2 text-sm text-gray-500">
        Add products to your cart before checkout.
      </p>

      <button
        type="button"
        onClick={onExplore}
        className="mt-6 rounded-xl bg-slate-950 px-6 py-3 text-sm font-bold text-white transition hover:bg-[#ea2e0e]"
      >
        Explore Products
      </button>
    </div>
  </div>
);

const ShippingProgress = ({ subtotal, progress, amountRemaining }) => {
  const hasFreeShipping = subtotal >= FREE_SHIPPING_LIMIT;

  return (
    <div className="shrink-0 px-4 py-3 sm:px-5">
      <div className="flex items-start gap-3 rounded-2xl bg-orange-50 p-3.5 sm:p-4">
        <div className="grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-white text-[#ea2e0e] sm:h-10 sm:w-10">
          <FiTruck size={18} />
        </div>

        <div className="min-w-0 flex-1">
          <div className="flex items-start justify-between gap-2">
            <div>
              <p className="text-xs font-bold text-gray-950 sm:text-sm">
                {hasFreeShipping
                  ? "Free shipping unlocked"
                  : `Add ${formatCurrency(amountRemaining)} for free shipping`}
              </p>
              <p className="mt-0.5 text-xs text-gray-500 sm:text-sm">
                Free delivery over {formatCurrency(FREE_SHIPPING_LIMIT)}
              </p>
            </div>

            <span className="shrink-0 rounded-full bg-white px-2.5 py-0.5 text-xs font-bold text-gray-700">
              {Math.round(progress)}%
            </span>
          </div>

          <div className="mt-2.5 h-1.5 overflow-hidden rounded-full bg-white sm:h-2">
            <div
              className="h-full rounded-full bg-[#ea2e0e] transition-all duration-700"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

const CartItem = ({ product, onDecrease, onIncrease, onRemove }) => (
  <article className="rounded-2xl border border-gray-200 bg-white p-3 shadow-sm">
    <div className="flex gap-3">
      <div className="h-20 w-20 shrink-0 overflow-hidden rounded-xl bg-gray-100 sm:h-24 sm:w-24">
        <img
          src={product.image}
          alt={product.name}
          className="h-full w-full object-cover"
        />
      </div>

      <div className="flex min-w-0 flex-1 flex-col justify-between">
        <div className="flex items-start justify-between gap-2">
          <div className="min-w-0">
            <h3 className="line-clamp-1 text-xs font-bold text-gray-950 sm:text-sm">
              {product.name}
            </h3>
            <p className="mt-0.5 text-xs font-semibold text-gray-500">
              {product.size || "M"} / {product.color || "Standard"}
            </p>
          </div>

          <button
            type="button"
            onClick={onRemove}
            aria-label={`Remove ${product.name}`}
            className="grid h-7 w-7 shrink-0 place-items-center rounded-lg text-gray-400 transition hover:bg-red-50 hover:text-red-500"
          >
            <RiDeleteBin3Line size={16} />
          </button>
        </div>

        <div className="mt-2 flex items-center justify-between gap-2">
          <QuantityControl
            value={product.quantity}
            onDecrease={onDecrease}
            onIncrease={onIncrease}
          />

          <p className="whitespace-nowrap text-xs font-bold text-[#ea2e0e] sm:text-sm">
            {formatCurrency(product.price * product.quantity)}
          </p>
        </div>
      </div>
    </div>
  </article>
);

const QuantityControl = ({ value, onDecrease, onIncrease }) => (
  <div className="flex items-center gap-0.5 rounded-xl border border-gray-200 bg-gray-50 p-0.5">
    <button
      type="button"
      onClick={onDecrease}
      disabled={value <= 1}
      aria-label="Decrease quantity"
      className="grid h-7 w-7 place-items-center rounded-lg text-gray-500 transition hover:bg-white hover:text-gray-950 disabled:cursor-not-allowed disabled:opacity-30 sm:h-8 sm:w-8"
    >
      <FiMinus size={13} />
    </button>

    <span className="w-6 text-center text-xs font-bold text-gray-950 sm:text-sm">
      {value}
    </span>

    <button
      type="button"
      onClick={onIncrease}
      disabled={value >= MAX_QUANTITY}
      aria-label="Increase quantity"
      className="grid h-7 w-7 place-items-center rounded-lg text-gray-500 transition hover:bg-white hover:text-gray-950 disabled:cursor-not-allowed disabled:opacity-30 sm:h-8 sm:w-8"
    >
      <FiPlus size={13} />
    </button>
  </div>
);

const CartFooter = ({ subtotal, shippingFee, total, onCheckout }) => (
  <footer className="shrink-0 border-t border-gray-100 bg-white px-4 py-3.5 shadow-[0_-12px_30px_rgba(15,23,42,0.06)] sm:px-5 sm:py-4">
    <div className="space-y-1.5 sm:space-y-2">
      <SummaryRow label="Subtotal" value={formatCurrency(subtotal)} />
      <SummaryRow
        label="Shipping"
        value={
          shippingFee === 0 ? "Complimentary" : formatCurrency(shippingFee)
        }
        badge={shippingFee === 0}
      />

      <div className="flex items-end justify-between border-t border-gray-100 pt-2.5 sm:pt-3">
        <span className="text-xs font-bold text-gray-500 sm:text-sm">
          Total
        </span>
        <span className="text-xl font-bold tracking-tight text-[#ea2e0e] sm:text-2xl">
          {formatCurrency(total)}
        </span>
      </div>
    </div>

    <button
      type="button"
      onClick={onCheckout}
      className="group mt-3 flex w-full items-center justify-center gap-2 rounded-2xl bg-slate-950 px-5 py-3.5 text-xs font-bold text-white shadow-sm transition hover:bg-[#ea2e0e] active:scale-[0.98] sm:mt-4 sm:py-4 sm:text-sm"
    >
      Secure Checkout
      <HiOutlineArrowRight className="transition-transform group-hover:translate-x-1" />
    </button>

    <p className="mt-2.5 text-center text-[11px] font-semibold text-gray-400 sm:mt-3 sm:text-xs">
      Encrypted checkout / 30 day returns
    </p>
  </footer>
);

const SummaryRow = ({ label, value, badge = false }) => (
  <div className="flex items-center justify-between text-xs sm:text-sm">
    <span className="font-semibold text-gray-500">{label}</span>

    <span
      className={
        badge
          ? "rounded-full bg-emerald-100 px-2.5 py-0.5 text-[11px] font-bold text-emerald-700 sm:text-xs"
          : "font-bold text-gray-950"
      }
    >
      {value}
    </span>
  </div>
);

export default CartContext;

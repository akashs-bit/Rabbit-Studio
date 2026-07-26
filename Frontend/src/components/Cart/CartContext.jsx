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
    <section className="flex h-full min-h-0 flex-col bg-white">
      <div className="shrink-0 border-b border-gray-100 px-5 py-4">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-xs font-bold uppercase tracking-wide text-[#ea2e0e]">
              Shopping Bag
            </p>
            <h2 className="mt-1 text-2xl font-bold text-gray-950">Your Cart</h2>
          </div>

          <span className="rounded-full bg-gray-100 px-4 py-2 text-sm font-bold text-gray-700">
            {cartProducts.length} item{cartProducts.length === 1 ? "" : "s"}
          </span>
        </div>
      </div>

      <ShippingProgress
        subtotal={subtotal}
        progress={shippingProgress}
        amountRemaining={amountForFreeShipping}
      />

      <div className="min-h-0 flex-1 overflow-y-auto bg-gray-50/70 px-4 py-4">
        <div className="space-y-3">
          {cartProducts.map((product) => {
            // ✅ Unique key based on ID, size, and color so separate variants don't overwrite each other
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

      <CartFooter
        subtotal={subtotal}
        shippingFee={shippingFee}
        total={total}
        onCheckout={handleCheckout}
      />
    </section>
  );
};

const EmptyCart = ({ onExplore }) => (
  <div className="grid h-full place-items-center bg-white p-6 text-center">
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
    <div className="shrink-0 px-5 py-4">
      <div className="flex items-start gap-3 rounded-2xl bg-orange-50 p-4">
        <div className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-white text-[#ea2e0e]">
          <FiTruck size={19} />
        </div>

        <div className="min-w-0 flex-1">
          <div className="flex items-start justify-between gap-3">
            <div>
              <p className="font-bold text-gray-950">
                {hasFreeShipping
                  ? "Free shipping unlocked"
                  : `Add ${formatCurrency(amountRemaining)} for free shipping`}
              </p>
              <p className="mt-1 text-sm text-gray-500">
                Free delivery over {formatCurrency(FREE_SHIPPING_LIMIT)}
              </p>
            </div>

            <span className="rounded-full bg-white px-3 py-1 text-sm font-bold text-gray-700">
              {Math.round(progress)}%
            </span>
          </div>

          <div className="mt-3 h-2 overflow-hidden rounded-full bg-white">
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
    <div className="grid grid-cols-[92px_1fr] gap-3">
      <div className="h-24 w-24 overflow-hidden rounded-xl bg-gray-100">
        <img
          src={product.image}
          alt={product.name}
          className="h-full w-full object-cover"
        />
      </div>

      <div className="min-w-0">
        <div className="flex items-start justify-between gap-2">
          <div className="min-w-0">
            <h3 className="line-clamp-2 text-sm font-bold leading-5 text-gray-950">
              {product.name}
            </h3>

            <p className="mt-1 truncate text-xs font-semibold text-gray-500">
              {product.size || "M"} / {product.color || "Standard"}
            </p>
          </div>

          <button
            type="button"
            onClick={onRemove}
            aria-label={`Remove ${product.name}`}
            className="grid h-8 w-8 shrink-0 place-items-center rounded-lg text-gray-400 transition hover:bg-red-50 hover:text-red-500"
          >
            <RiDeleteBin3Line size={17} />
          </button>
        </div>

        <div className="mt-3 flex flex-wrap items-center justify-between gap-2">
          <QuantityControl
            value={product.quantity}
            onDecrease={onDecrease}
            onIncrease={onIncrease}
          />

          <p className="ml-auto whitespace-nowrap text-sm font-bold text-[#ea2e0e]">
            {formatCurrency(product.price * product.quantity)}
          </p>
        </div>
      </div>
    </div>
  </article>
);

const QuantityControl = ({ value, onDecrease, onIncrease }) => (
  <div className="flex items-center gap-1 rounded-xl border border-gray-200 bg-gray-50 p-1">
    <button
      type="button"
      onClick={onDecrease}
      disabled={value <= 1}
      aria-label="Decrease quantity"
      className="grid h-8 w-8 place-items-center rounded-lg text-gray-500 transition hover:bg-white hover:text-gray-950 disabled:cursor-not-allowed disabled:opacity-30"
    >
      <FiMinus size={14} />
    </button>

    <span className="w-7 text-center text-sm font-bold text-gray-950">
      {value}
    </span>

    <button
      type="button"
      onClick={onIncrease}
      disabled={value >= MAX_QUANTITY}
      aria-label="Increase quantity"
      className="grid h-8 w-8 place-items-center rounded-lg text-gray-500 transition hover:bg-white hover:text-gray-950 disabled:cursor-not-allowed disabled:opacity-30"
    >
      <FiPlus size={14} />
    </button>
  </div>
);

const CartFooter = ({ subtotal, shippingFee, total, onCheckout }) => (
  <footer className="shrink-0 border-t border-gray-100 bg-white px-5 py-4 shadow-[0_-12px_30px_rgba(15,23,42,0.06)]">
    <div className="space-y-2">
      <SummaryRow label="Subtotal" value={formatCurrency(subtotal)} />
      <SummaryRow
        label="Shipping"
        value={
          shippingFee === 0 ? "Complimentary" : formatCurrency(shippingFee)
        }
        badge={shippingFee === 0}
      />

      <div className="flex items-end justify-between border-t border-gray-100 pt-3">
        <span className="text-sm font-bold text-gray-500">Total</span>
        <span className="text-2xl font-bold tracking-tight text-[#ea2e0e]">
          {formatCurrency(total)}
        </span>
      </div>
    </div>

    <button
      type="button"
      onClick={onCheckout}
      className="group mt-4 flex w-full items-center justify-center gap-3 rounded-2xl bg-slate-950 px-6 py-4 text-sm font-bold text-white shadow-sm transition hover:bg-[#ea2e0e] active:scale-[0.98]"
    >
      Secure Checkout
      <HiOutlineArrowRight className="transition-transform group-hover:translate-x-1" />
    </button>

    <p className="mt-3 text-center text-xs font-semibold text-gray-400">
      Encrypted checkout / 30 day returns
    </p>
  </footer>
);

const SummaryRow = ({ label, value, badge = false }) => (
  <div className="flex items-center justify-between text-sm">
    <span className="font-semibold text-gray-500">{label}</span>

    <span
      className={
        badge
          ? "rounded-full bg-emerald-100 px-3 py-1 text-xs font-bold text-emerald-700"
          : "font-bold text-gray-950"
      }
    >
      {value}
    </span>
  </div>
);

export default CartContext;

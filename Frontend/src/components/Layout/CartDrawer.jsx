import React, { useEffect } from "react";
import { IoMdClose } from "react-icons/io";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import CartContents from "../Cart/CartContext";
import { useShop } from "../Cart/ShopContext";

const CartDrawer = ({ drawerOpen, toggleCartDrawer }) => {
  const navigate = useNavigate();
  const { cartProducts } = useShop();

  // Lock body scroll when drawer is open
  useEffect(() => {
    document.body.style.overflow = drawerOpen ? "hidden" : "auto";

    return () => {
      document.body.style.overflow = "auto";
    };
  }, [drawerOpen]);

  // Checkout handler with authentication check
  const handleCheckout = () => {
    // 1. Check if cart is empty
    if (!cartProducts || cartProducts.length === 0) {
      toast.error("Your cart is empty!");
      return;
    }

    // 2. Check if user is logged in (checking token or user in localStorage)
    const isAuthenticated =
      Boolean(localStorage.getItem("token")) ||
      Boolean(localStorage.getItem("user"));

    // Close the drawer first
    toggleCartDrawer();

    // 3. If NOT logged in -> Show alert & redirect to Register / Login
    if (!isAuthenticated) {
      toast.info("Please register or log in to complete your checkout!", {
        description: "You need an active account to place an order.",
      });
      navigate("/login", { state: { from: "/checkout" } });
      return;
    }

    // 4. If logged in -> Go straight to checkout page
    navigate("/checkout");
  };

  return (
    <>
      {/* Backdrop overlay */}
      <div
        onClick={toggleCartDrawer}
        className={`fixed inset-0 z-40 bg-black/40 transition-opacity ${
          drawerOpen ? "visible opacity-100" : "invisible opacity-0"
        }`}
      />

      {/* Slide-over Drawer */}
      <aside
        className={`fixed right-0 top-0 z-50 flex h-dvh w-[88%] max-w-[450px] transform flex-col overflow-hidden bg-white shadow-2xl transition-transform duration-300 sm:w-[70%] md:w-[400px] lg:w-[450px] ${
          drawerOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        {/* Drawer Header */}
        <header className="flex h-16 shrink-0 items-center justify-between border-b border-gray-200 px-5">
          <h2 className="text-xl font-bold text-gray-950">Your Cart</h2>

          <button
            type="button"
            onClick={toggleCartDrawer}
            aria-label="Close cart"
            className="grid h-10 w-10 place-items-center rounded-full text-gray-500 transition hover:bg-gray-100 hover:text-gray-950"
          >
            <IoMdClose className="h-6 w-6" />
          </button>
        </header>

        {/* Cart Contents / Items List */}
        <div className="min-h-0 flex-1 overflow-y-auto">
          <CartContents onClose={toggleCartDrawer} />
        </div>

        {/* Footer with Checkout Button */}
        {cartProducts?.length > 0 && (
          <div className="border-t border-gray-200 p-5 bg-white shrink-0">
            <button
              onClick={handleCheckout}
              className="w-full bg-black text-white py-3.5 px-4 rounded-xl font-bold text-sm hover:bg-gray-800 transition-all active:scale-[0.98] shadow-md flex items-center justify-center gap-2"
            >
              Proceed to Checkout
            </button>
          </div>
        )}
      </aside>
    </>
  );
};

export default CartDrawer;

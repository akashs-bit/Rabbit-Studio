import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import {
  User,
  ShoppingBag,
  Heart,
  Menu,
  X,
  ChevronRight,
  LogIn,
} from "lucide-react";
import SearchBar from "./SearchBar";
import CartDrawer from "../Layout/CartDrawer";
import { useShop } from "../Cart/ShopContext";

const Navbar = () => {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [navDrawerOpen, setNavDrawerOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const location = useLocation();

  const { cartProducts, wishlistItems } = useShop();

  const cartCount = cartProducts.reduce(
    (total, item) => total + (item.quantity || 1),
    0,
  );
  const wishlistCount = wishlistItems.length;

  const storedUser = localStorage.getItem("user");
  const token = localStorage.getItem("token");
  const user = storedUser ? JSON.parse(storedUser) : null;

  const isLoggedIn = Boolean(user || token);
  const isAdmin = user?.role === "admin";

  const toggleNavDrawer = () => setNavDrawerOpen((prev) => !prev);
  const toggleCartDrawer = () => setDrawerOpen((prev) => !prev);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    setNavDrawerOpen(false);
    setDrawerOpen(false);
  }, [location.pathname]);

  // Slugs aligned with route: path="collections/:collection"
  const navLinks = [
    { name: "Men", slug: "/collections/men" },
    { name: "Women", slug: "/collections/women" },
    { name: "Top Wear", slug: "/collections/top-wear" },
    { name: "Bottom Wear", slug: "/collections/bottom-wear" },
  ];

  return (
    <>
      <nav
        className={`sticky top-0 z-50 w-full transition-all duration-300 ${
          isScrolled
            ? "bg-white/80 backdrop-blur-md shadow-sm py-2"
            : "bg-white py-4"
        } border-b border-gray-100`}
      >
        <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-12">
          <div className="flex items-center justify-between">
            <Link
              to="/"
              className="text-xl sm:text-2xl font-black tracking-tighter text-black flex items-center gap-2.5"
            >
              <div className="w-8 h-8 bg-black rounded-lg flex items-center justify-center shrink-0">
                <div className="w-3 h-3 bg-white rounded-full animate-pulse" />
              </div>
              <span className="uppercase">
                RABBIT{" "}
                <span className="font-light text-neutral-500">STUDIO</span>
              </span>
            </Link>

            <div className="hidden md:flex items-center gap-10">
              {navLinks.map((link) => (
                <Link
                  key={link.name}
                  to={link.slug}
                  className={`group relative text-xs font-bold uppercase tracking-widest transition-colors duration-300 ${
                    location.pathname === link.slug
                      ? "text-[#ea2e0e]"
                      : "text-gray-500 hover:text-[#ea2e0e]"
                  }`}
                >
                  {link.name}
                  <span className="absolute left-0 -bottom-1 w-0 h-[2px] bg-[#ea2e0e] transition-all duration-300 group-hover:w-full"></span>
                  {location.pathname === link.slug && (
                    <span className="absolute left-0 -bottom-1 w-full h-[2px] bg-[#ea2e0e]"></span>
                  )}
                </Link>
              ))}
            </div>

            <div className="flex items-center gap-2 sm:gap-4">
              <div className="hidden lg:block w-44">
                <SearchBar />
              </div>

              <div className="flex items-center gap-1 sm:gap-2">
                {isLoggedIn && isAdmin && (
                  <Link
                    to="/admin"
                    className="px-3 py-1.5 text-[11px] font-bold uppercase tracking-widest text-[#ea2e0e] bg-red-50 border border-red-100 rounded-full hover:bg-red-100 transition"
                  >
                    Admin
                  </Link>
                )}

                <Link
                  to="/wishlist"
                  className="relative p-2 text-gray-700 hover:bg-gray-100 rounded-full transition"
                  title="Wishlist"
                >
                  <Heart size={22} strokeWidth={1.8} />
                  {wishlistCount > 0 && (
                    <span className="absolute -top-0.5 -right-0.5 bg-[#ea2e0e] text-white text-[10px] font-bold px-1.5 py-[1px] rounded-full min-w-[18px] text-center">
                      {wishlistCount}
                    </span>
                  )}
                </Link>

                {isLoggedIn ? (
                  <Link
                    to="/profile"
                    className="p-2 text-gray-700 hover:bg-gray-100 rounded-full transition"
                    title="Profile"
                  >
                    <User size={22} strokeWidth={1.8} />
                  </Link>
                ) : (
                  <div className="hidden sm:flex items-center gap-2">
                    <Link
                      to="/register"
                      className="px-4 py-2 text-xs font-bold uppercase tracking-widest bg-black text-white rounded-full hover:bg-gray-800 transition"
                    >
                      Register
                    </Link>
                  </div>
                )}

                <button
                  onClick={toggleCartDrawer}
                  className="relative p-2 text-gray-700 hover:bg-gray-100 rounded-full transition"
                  aria-label="Shopping Cart"
                >
                  <ShoppingBag size={24} strokeWidth={1.8} />
                  {cartCount > 0 && (
                    <span className="absolute -top-0.5 -right-0.5 bg-black text-white text-[10px] font-bold px-1.5 py-[1px] rounded-full min-w-[18px] text-center">
                      {cartCount}
                    </span>
                  )}
                </button>

                <button
                  onClick={toggleNavDrawer}
                  className="md:hidden p-2 text-gray-700 hover:bg-gray-100 rounded-full transition"
                >
                  <Menu size={24} />
                </button>
              </div>
            </div>
          </div>
        </div>
      </nav>

      <CartDrawer drawerOpen={drawerOpen} toggleCartDrawer={toggleCartDrawer} />

      {navDrawerOpen && (
        <div
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[60]"
          onClick={toggleNavDrawer}
        />
      )}

      <div
        className={`fixed top-0 left-0 h-full w-full max-w-xs bg-white z-[70] shadow-2xl transform transition-transform duration-500 ${
          navDrawerOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex flex-col h-full">
          <div className="flex items-center justify-between p-6 border-b">
            <span className="font-bold text-lg tracking-tight">
              RABBIT STUDIO
            </span>
            <button
              onClick={toggleNavDrawer}
              className="p-2 hover:bg-gray-100 rounded-full"
            >
              <X size={24} />
            </button>
          </div>

          <div className="p-4 border-b bg-gray-50">
            <SearchBar />
          </div>

          <div className="flex-grow p-6 space-y-2 overflow-y-auto">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                to={link.slug}
                onClick={toggleNavDrawer}
                className="flex items-center justify-between p-4 bg-gray-50 rounded-xl text-base font-semibold"
              >
                {link.name}
                <ChevronRight size={18} />
              </Link>
            ))}

            <Link
              to="/wishlist"
              onClick={toggleNavDrawer}
              className="flex items-center justify-between p-4 bg-gray-50 rounded-xl text-base font-semibold text-gray-800"
            >
              <div className="flex items-center gap-2">
                <Heart size={18} className="text-[#ea2e0e]" />
                Wishlist
              </div>
              {wishlistCount > 0 && (
                <span className="bg-[#ea2e0e] text-white text-xs font-bold px-2 py-0.5 rounded-full">
                  {wishlistCount}
                </span>
              )}
            </Link>

            {isLoggedIn && isAdmin && (
              <Link
                to="/admin"
                onClick={toggleNavDrawer}
                className="flex items-center justify-between p-4 bg-red-50 text-red-600 border border-red-100 rounded-xl text-base font-semibold"
              >
                Admin Panel
                <ChevronRight size={18} />
              </Link>
            )}
          </div>

          <div className="p-6 border-t bg-gray-50">
            {isLoggedIn ? (
              <Link
                to="/profile"
                onClick={toggleNavDrawer}
                className="flex items-center gap-3 p-4 bg-black text-white rounded-xl justify-center font-bold"
              >
                <User size={20} /> My Account
              </Link>
            ) : (
              <div className="flex flex-col gap-2">
                <Link
                  to="/register"
                  onClick={toggleNavDrawer}
                  className="flex items-center gap-2 p-3 bg-black text-white rounded-xl justify-center font-bold text-sm"
                >
                  <User size={18} /> Register Account
                </Link>
                <Link
                  to="/login"
                  onClick={toggleNavDrawer}
                  className="flex items-center gap-2 p-3 bg-gray-200 text-gray-800 rounded-xl justify-center font-bold text-sm"
                >
                  <LogIn size={18} /> Login
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default Navbar;

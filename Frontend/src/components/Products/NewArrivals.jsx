import React, { useEffect, useRef, useState } from "react";
import {
  FiChevronLeft,
  FiChevronRight,
  FiHeart,
  FiShoppingBag,
} from "react-icons/fi";
import { Link } from "react-router-dom";
import { useShop } from "../Cart/ShopContext";

const NewArrivals = () => {
  const scrollRef = useRef(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);
  const [isHovered, setIsHovered] = useState(false);

  // Consume context methods
  const { addToCart, wishlistItems, addToWishlist, removeFromWishlist } =
    useShop();

  const newArrivals = [
    {
      _id: "1",
      name: "Premium Leather Jacket",
      price: 2499,
      category: "Outerwear",
      sizes: ["M", "L", "XL"],
      image:
        "https://images.unsplash.com/photo-1551028719-00167b16eac5?auto=format&fit=crop&w=600&q=80",
    },
    {
      _id: "2",
      name: "Modern Oversized Hoodie",
      price: 1299,
      category: "Streetwear",
      sizes: ["S", "M", "L", "XL"],
      image:
        "https://images.unsplash.com/photo-1556905055-8f358a7a47b2?auto=format&fit=crop&w=600&q=80",
    },
    {
      _id: "3",
      name: "Classic Linen Shirt",
      price: 899,
      category: "Essentials",
      sizes: ["S", "M", "L"],
      image:
        "https://images.unsplash.com/photo-1596755094514-f87e34085b2c?auto=format&fit=crop&w=600&q=80",
    },
    {
      _id: "4",
      name: "Vintage Denim Jacket",
      price: 1899,
      category: "Outerwear",
      sizes: ["M", "L"],
      image:
        "https://images.unsplash.com/photo-1576995853123-5a10305d93c0?auto=format&fit=crop&w=600&q=80",
    },
    {
      _id: "5",
      name: "Minimalist Cotton Tee",
      price: 499,
      category: "Tops",
      sizes: ["S", "M", "L", "XL"],
      image:
        "https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&w=600&q=80",
    },
    {
      _id: "6",
      name: "Tailored Winter Coat",
      price: 3499,
      category: "Luxury",
      sizes: ["M", "L", "XL"],
      image:
        "https://images.unsplash.com/photo-1539533018447-63fcce2678e3?auto=format&fit=crop&w=600&q=80",
    },
  ];

  // Helper to format item payload with default size selection support
  const formatProduct = (item, selectedSize = "M") => ({
    id: item._id,
    productID: item._id,
    name: item.name,
    price: item.price,
    image: item.image,
    category: item.category,
    size: selectedSize,
    color: "Standard",
    quantity: 1,
  });

  // Toggle Wishlist Handler
  const handleWishlistToggle = (e, item) => {
    e.preventDefault();
    e.stopPropagation();

    const isWishlisted = wishlistItems?.some(
      (w) => w.id === item._id || w.productID === item._id,
    );

    if (isWishlisted) {
      removeFromWishlist(item._id, item.name);
    } else {
      addToWishlist(formatProduct(item));
    }
  };

  // Quick Add with Selected Size Handler
  const handleAddToCartWithSize = (e, item, size) => {
    e.preventDefault();
    e.stopPropagation();
    addToCart(formatProduct(item, size));
  };

  // SCROLL LOGIC
  const scroll = (direction) => {
    const container = scrollRef.current;
    if (container) {
      const item = container.querySelector(".snap-start");
      if (item) {
        const itemWidth = item.clientWidth;
        const gap = 32;
        const scrollAmount =
          direction === "left" ? -(itemWidth + gap) : itemWidth + gap;
        container.scrollBy({ left: scrollAmount, behavior: "smooth" });
      }
    }
  };

  // AUTO-SLIDE LOGIC
  useEffect(() => {
    if (isHovered) return;

    const interval = setInterval(() => {
      const container = scrollRef.current;
      if (container) {
        const maxScrollLeft = container.scrollWidth - container.clientWidth;

        if (container.scrollLeft >= maxScrollLeft - 10) {
          container.scrollTo({ left: 0, behavior: "smooth" });
        } else {
          scroll("right");
        }
      }
    }, 3500);

    return () => clearInterval(interval);
  }, [isHovered]);

  // BUTTON VISIBILITY
  const updateScrollButtons = () => {
    const el = scrollRef.current;
    if (el) {
      setCanScrollLeft(el.scrollLeft > 5);
      setCanScrollRight(el.scrollLeft + el.clientWidth < el.scrollWidth - 10);
    }
  };

  useEffect(() => {
    const el = scrollRef.current;
    if (el) {
      el.addEventListener("scroll", updateScrollButtons);
      updateScrollButtons();
    }
    return () => el?.removeEventListener("scroll", updateScrollButtons);
  }, []);

  return (
    <section className="py-8 bg-white overflow-hidden">
      <div className="container mx-auto px-4 lg:px-12">
        <div className="flex items-end justify-between mb-8 relative">
          <div className="max-w-md text-left">
            <h2 className="text-3xl font-black tracking-tighter uppercase mb-2">
              New Arrivals
            </h2>
            <p className="text-gray-500 text-sm">
              Our latest collection just dropped.
            </p>
          </div>

          <div className="flex gap-2">
            <button
              onClick={() => scroll("left")}
              className={`p-3 rounded-full border-2 transition-all ${
                canScrollLeft
                  ? "border-black bg-black text-white active:scale-90"
                  : "border-gray-100 text-gray-300 opacity-50 cursor-not-allowed"
              }`}
            >
              <FiChevronLeft size={18} />
            </button>
            <button
              onClick={() => scroll("right")}
              className={`p-3 rounded-full border-2 transition-all ${
                canScrollRight
                  ? "border-black bg-black text-white active:scale-90"
                  : "border-gray-100 text-gray-300 opacity-50 cursor-not-allowed"
              }`}
            >
              <FiChevronRight size={18} />
            </button>
          </div>
        </div>

        <div
          ref={scrollRef}
          className="flex gap-8 overflow-x-scroll no-scrollbar snap-x snap-mandatory scroll-smooth"
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
        >
          {newArrivals.map((item) => {
            const isWishlisted = wishlistItems?.some(
              (w) => w.id === item._id || w.productID === item._id,
            );

            return (
              <div
                key={item._id}
                className="min-w-[75%] sm:min-w-[45%] md:min-w-[30%] lg:min-w-[22%] snap-start group"
              >
                <div className="relative overflow-hidden rounded-2xl bg-gray-50 aspect-[4/5] max-h-[420px]">
                  <img
                    src={item.image}
                    alt={item.name}
                    draggable="false"
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                  />

                  {/* Wishlist Button */}
                  <button
                    onClick={(e) => handleWishlistToggle(e, item)}
                    className={`absolute top-3 right-3 p-2.5 rounded-full shadow-sm transition-all transform translate-y-[-5px] opacity-0 group-hover:translate-y-0 group-hover:opacity-100 ${
                      isWishlisted
                        ? "bg-red-500 text-white"
                        : "bg-white/90 backdrop-blur-md text-gray-700 hover:bg-black hover:text-white"
                    }`}
                  >
                    <FiHeart
                      size={16}
                      className={isWishlisted ? "fill-current" : ""}
                    />
                  </button>

                  {/* Quick Add Size Picker Overlay on Hover */}
                  <div className="absolute inset-x-0 bottom-0 p-4 bg-gradient-to-t from-black/70 via-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <p className="text-[11px] font-bold text-white mb-2 text-center uppercase tracking-wider">
                      Quick Add Size
                    </p>
                    <div className="flex items-center justify-center gap-1.5 flex-wrap">
                      {item.sizes?.map((size) => (
                        <button
                          key={size}
                          onClick={(e) =>
                            handleAddToCartWithSize(e, item, size)
                          }
                          className="bg-white text-gray-900 h-8 min-w-[32px] px-2 rounded-md text-xs font-bold flex items-center justify-center gap-1 hover:bg-[#ea2e0e] hover:text-white transition-all active:scale-95 shadow-sm"
                          title={`Add size ${size} to bag`}
                        >
                          {size}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="mt-4 px-1 text-left">
                  <Link to={`/product/${item._id}`}>
                    <p className="text-[9px] font-bold text-gray-400 uppercase tracking-widest mb-1">
                      {item.category}
                    </p>
                    <h4 className="text-base font-bold text-gray-900 truncate">
                      {item.name}
                    </h4>
                    <p className="text-gray-600 font-bold text-sm mt-1">
                      ₹{item.price.toLocaleString()}
                    </p>
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default NewArrivals;

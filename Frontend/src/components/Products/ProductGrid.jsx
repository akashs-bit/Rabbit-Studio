import React from "react";
import { Link } from "react-router-dom";
import { FiHeart } from "react-icons/fi";
import { FaHeart } from "react-icons/fa";
import { useShop } from "../Cart/ShopContext";

const ProductGrid = ({ products }) => {
  // Consume shared ShopContext methods and state
  const { addToCart, wishlistItems, addToWishlist, removeFromWishlist } =
    useShop();

  // Exactly 4 Men's Products: T-Shirt, Pant, Jacket, Hoodie (with sizes included)
  const defaultProducts = [
    {
      id: 201,
      name: "Heavyweight Cotton T-Shirt",
      category: "Men's T-Shirts",
      price: 999,
      sizes: ["S", "M", "L", "XL"],
      image:
        "https://images.unsplash.com/photo-1618354691373-d851c5c3a990?auto=format&fit=crop&w=800&q=80",
    },
    {
      id: 202,
      name: "Slim Fit Cargo Trousers",
      category: "Men's Pants",
      price: 2499,
      sizes: ["30", "32", "34", "36"],
      image:
        "https://images.unsplash.com/photo-1624378439575-d8705ad7ae80?auto=format&fit=crop&w=800&q=80",
    },
    {
      id: 203,
      name: "Classic Denim Trucker Jacket",
      category: "Men's Jackets",
      price: 3499,
      sizes: ["M", "L", "XL"],
      image:
        "https://images.unsplash.com/photo-1576995853123-5a10305d93c0?auto=format&fit=crop&w=800&q=80",
    },
    {
      id: 204,
      name: "Oversized Streetwear Hoodie",
      category: "Men's Hoodies",
      price: 2899,
      sizes: ["S", "M", "L", "XL", "2XL"],
      image:
        "https://images.unsplash.com/photo-1556905055-8f358a7a47b2?auto=format&fit=crop&w=800&q=80",
    },
  ];

  const data = products && products.length ? products : defaultProducts;

  // Helper to format item payload with size support
  const formatProductPayload = (item, selectedSize) => ({
    id: item.id || item._id,
    productID: item.id || item._id,
    name: item.name,
    price: item.price,
    image: item.image,
    category: item.category,
    size: selectedSize || (item.sizes ? item.sizes[0] : "M"),
    color: "Standard",
    quantity: 1,
  });

  // Toggle Wishlist Handler
  const handleWishlistToggle = (e, item) => {
    e.preventDefault();
    e.stopPropagation();

    const productId = item.id || item._id;
    const isWishlisted = wishlistItems?.some(
      (w) => (w.id || w.productID || w._id) === productId,
    );

    if (isWishlisted) {
      removeFromWishlist(productId, item.name);
    } else {
      addToWishlist(formatProductPayload(item));
    }
  };

  // Quick Add with Size Handler
  const handleAddToCartWithSize = (e, item, size) => {
    e.preventDefault();
    e.stopPropagation();
    addToCart(formatProductPayload(item, size));
  };

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-x-6 gap-y-12">
      {data.map((product) => {
        const productId = product.id || product._id;
        const isWishlisted = wishlistItems?.some(
          (w) => (w.id || w.productID || w._id) === productId,
        );

        // Fallback sizes if not passed from Home.jsx
        const availableSizes =
          product.sizes && product.sizes.length > 0
            ? product.sizes
            : ["XS", "S", "M", "L", "XL"];

        return (
          <div key={productId} className="group relative">
            {/* IMAGE CONTAINER */}
            <div className="relative aspect-[3/4] overflow-hidden rounded-2xl bg-neutral-100">
              <Link to={`/product/${productId}`}>
                <img
                  src={product.image}
                  alt={product.name}
                  className="w-full h-full object-cover transition-transform duration-[1.2s] ease-out group-hover:scale-110"
                />
              </Link>

              {/* WISHLIST BUTTON */}
              <button
                onClick={(e) => handleWishlistToggle(e, product)}
                className={`absolute top-4 right-4 p-2.5 backdrop-blur-md rounded-full shadow-sm transition-all duration-300 ${
                  isWishlisted
                    ? "bg-red-500 text-white opacity-100"
                    : "bg-white/80 text-neutral-700 opacity-0 group-hover:opacity-100 hover:bg-black hover:text-white"
                }`}
                title={
                  isWishlisted ? "Remove from Wishlist" : "Add to Wishlist"
                }
              >
                {isWishlisted ? (
                  <FaHeart size={16} className="fill-current" />
                ) : (
                  <FiHeart size={16} />
                )}
              </button>

              {/* QUICK ADD SIZE PICKER OVERLAY */}
              <div className="absolute inset-x-0 bottom-0 p-4 bg-gradient-to-t from-black/80 via-black/50 to-transparent translate-y-full transition-transform duration-500 group-hover:translate-y-0">
                <p className="text-[10px] font-black uppercase tracking-widest text-white mb-2 text-center">
                  Quick Add Size
                </p>
                <div className="flex items-center justify-center gap-1 flex-wrap">
                  {availableSizes.map((size) => (
                    <button
                      key={size}
                      onClick={(e) => handleAddToCartWithSize(e, product, size)}
                      className="bg-white text-black h-8 min-w-[28px] px-2 rounded-lg text-[10px] font-black uppercase tracking-wider flex items-center justify-center hover:bg-[#ea2e0e] hover:text-white transition-all active:scale-95 shadow-sm"
                      title={`Add size ${size} to bag`}
                    >
                      {size}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* INFO SECTION */}
            <div className="mt-5 px-1">
              <div className="flex justify-between items-start mb-1">
                <div>
                  <p className="text-[9px] font-black text-neutral-400 uppercase tracking-[0.2em] mb-1">
                    {product.category || "New Arrival"}
                  </p>
                  <Link to={`/product/${productId}`}>
                    <h3 className="text-sm font-bold text-neutral-900 group-hover:text-black transition-colors truncate max-w-[140px] md:max-w-[200px]">
                      {product.name}
                    </h3>
                  </Link>
                </div>
              </div>

              <div className="flex items-center gap-2 mt-2">
                <span className="text-sm font-black text-neutral-900">
                  ₹{product.price.toLocaleString("en-IN")}
                </span>
                {product.originalPrice && (
                  <span className="text-[11px] text-neutral-400 line-through">
                    ₹{product.originalPrice.toLocaleString("en-IN")}
                  </span>
                )}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default ProductGrid;

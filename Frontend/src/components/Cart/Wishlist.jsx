import React from "react";
import { Link } from "react-router-dom";
import { Trash2, ShoppingBag, Heart } from "lucide-react";
import { toast } from "sonner";
import { useShop } from "./ShopContext";

const Wishlist = () => {
  // ✅ Pull wishlist items and actions directly from global ShopContext
  const { wishlistItems, removeFromWishlist, moveToCartFromWishlist } =
    useShop();

  // Handle move to cart with custom action/toast feedback if needed
  const handleMoveToCart = (product) => {
    moveToCartFromWishlist(product);
    toast.success(`Moved ${product.name} to your Cart!`);
  };

  if (!wishlistItems || wishlistItems.length === 0) {
    return (
      <div className="flex min-h-[60vh] flex-col items-center justify-center px-4 text-center">
        <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-red-50">
          <Heart className="h-8 w-8 text-[#ea2e0e]" />
        </div>
        <h2 className="mb-2 text-2xl font-black uppercase tracking-tight">
          Your Wishlist is Empty
        </h2>
        <p className="mb-6 max-w-md text-sm text-neutral-500">
          Explore our collection and save your favorite items here to view or
          buy later.
        </p>
        <Link
          to="/collections/all"
          className="rounded-full bg-black px-8 py-3.5 text-xs font-bold uppercase tracking-widest text-white transition hover:bg-neutral-800"
        >
          Explore Collection
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-[1440px] px-4 py-10 sm:px-6 lg:px-12">
      {/* HEADER */}
      <div className="mb-8 flex items-center justify-between border-b pb-4">
        <div>
          <h1 className="text-2xl font-black uppercase tracking-tight sm:text-3xl">
            My Wishlist
          </h1>
          <p className="mt-1 text-xs font-medium text-neutral-500">
            {wishlistItems.length}{" "}
            {wishlistItems.length === 1 ? "Item" : "Items"} saved
          </p>
        </div>
      </div>

      {/* WISHLIST GRID */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {wishlistItems.map((product) => {
          const itemId = product.id || product.productID || product._id;

          return (
            <div
              key={itemId}
              className="group relative flex flex-col justify-between overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm"
            >
              <div>
                {/* IMAGE */}
                <div className="relative aspect-[3/4] overflow-hidden bg-neutral-100">
                  <img
                    src={product.image}
                    alt={product.name}
                    className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  <button
                    onClick={() => removeFromWishlist(itemId, product.name)}
                    className="absolute right-3 top-3 rounded-full bg-white/90 p-2 text-neutral-600 shadow-sm transition hover:bg-red-500 hover:text-white"
                    title="Remove"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>

                {/* DETAILS */}
                <div className="p-4">
                  <p className="text-[10px] font-bold uppercase tracking-widest text-neutral-400">
                    {product.category || "Collection"}
                  </p>
                  <h3 className="mt-1 truncate text-sm font-bold text-neutral-900">
                    {product.name}
                  </h3>
                  <p className="mt-2 text-sm font-black text-neutral-900">
                    ₹{product.price?.toLocaleString("en-IN")}
                  </p>
                </div>
              </div>

              {/* MOVE TO CART BUTTON */}
              <div className="p-4 pt-0">
                <button
                  onClick={() => handleMoveToCart(product)}
                  className="flex w-full items-center justify-center gap-2 rounded-xl bg-black py-3 text-xs font-bold uppercase tracking-wider text-white transition active:scale-95 hover:bg-neutral-800"
                >
                  <ShoppingBag size={15} /> Move to Cart
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Wishlist;

import React, { createContext, useContext, useState, useEffect } from "react";
import { toast } from "sonner";

const ShopContext = createContext();

export const ShopProvider = ({ children }) => {
  // Load cart from localStorage or start empty
  const [cartProducts, setCartProducts] = useState(() => {
    const saved = localStorage.getItem("cart");
    return saved ? JSON.parse(saved) : [];
  });

  // Load wishlist from localStorage or start empty
  const [wishlistItems, setWishlistItems] = useState(() => {
    const saved = localStorage.getItem("wishlist");
    return saved ? JSON.parse(saved) : [];
  });

  // Keep localStorage synchronized
  useEffect(() => {
    localStorage.setItem("cart", JSON.stringify(cartProducts));
  }, [cartProducts]);

  useEffect(() => {
    localStorage.setItem("wishlist", JSON.stringify(wishlistItems));
  }, [wishlistItems]);

  // --- CART FUNCTIONS ---
  const addToCart = (product) => {
    setCartProducts((prev) => {
      // ✅ Check if exact product WITH same size and color already exists
      const existingIndex = prev.findIndex(
        (item) =>
          item.productID === product.productID &&
          item.size === product.size &&
          item.color === product.color,
      );

      if (existingIndex > -1) {
        // If it exists, update quantity for that specific variant
        const updatedCart = [...prev];
        const newQty = Math.min(
          10,
          updatedCart[existingIndex].quantity + (product.quantity || 1),
        );
        updatedCart[existingIndex] = {
          ...updatedCart[existingIndex],
          quantity: newQty,
        };
        toast.success(`Updated ${product.name} quantity in cart!`);
        return updatedCart;
      }

      // If it's a new variation (different size or color), append as a new item row
      toast.success(`Added ${product.name} to cart!`);
      return [...prev, { ...product, quantity: product.quantity || 1 }];
    });
  };

  const updateQuantity = (id, size, color, delta) => {
    setCartProducts((prev) =>
      prev
        .map((item) => {
          // ✅ Target the specific variant using ID, size, and color
          if (
            (item.productID === id || item._id === id) &&
            item.size === size &&
            item.color === color
          ) {
            const newQty = Math.min(10, Math.max(1, item.quantity + delta));
            return { ...item, quantity: newQty };
          }
          return item;
        })
        .filter(Boolean),
    );
  };

  const removeFromCart = (product) => {
    setCartProducts((prev) =>
      prev.filter(
        (item) =>
          !(
            item.productID === product.productID &&
            item.size === product.size &&
            item.color === product.color
          ),
      ),
    );
    toast.success("Removed from cart", {
      description: `${product.name} (${product.size}, ${product.color})`,
      action: {
        label: "Undo",
        onClick: () => setCartProducts((prev) => [...prev, product]),
      },
    });
  };

  const clearCart = () => setCartProducts([]);

  // --- WISHLIST FUNCTIONS ---
  const addToWishlist = (product) => {
    const productId = product.id || product.productID || product._id;

    setWishlistItems((prev) => {
      const exists = prev.find(
        (item) => (item.id || item.productID || item._id) === productId,
      );

      if (exists) {
        toast.info(`${product.name} is already in your wishlist!`);
        return prev;
      }

      toast.success(`Added ${product.name} to your wishlist!`);
      return [...prev, product];
    });
  };

  const removeFromWishlist = (id, name) => {
    const updated = wishlistItems.filter(
      (item) => (item.id || item.productID || item._id) !== id,
    );
    setWishlistItems(updated);
    if (name) {
      toast.info(`Removed ${name} from your wishlist.`);
    }
  };

  const moveToCartFromWishlist = (product) => {
    const cartItem = {
      productID: product.id || product.productID || product._id,
      name: product.name,
      size: product.size || "M",
      color: product.color || "Standard",
      quantity: 1,
      price: product.price,
      image: product.image,
    };
    addToCart(cartItem);
    removeFromWishlist(
      product.id || product.productID || product._id,
      product.name,
    );
  };

  return (
    <ShopContext.Provider
      value={{
        cartProducts,
        wishlistItems,
        addToCart,
        updateQuantity,
        removeFromCart,
        clearCart,
        addToWishlist,
        removeFromWishlist,
        moveToCartFromWishlist,
      }}
    >
      {children}
    </ShopContext.Provider>
  );
};

export const useShop = () => {
  const context = useContext(ShopContext);
  if (!context) {
    throw new Error("useShop must be used within a ShopProvider");
  }
  return context;
};

import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { toast } from "sonner";
import {
  FiPlus,
  FiMinus,
  FiShoppingBag,
  FiTruck,
  FiRefreshCw,
  FiStar,
  FiCheck,
  FiTag,
  FiPercent,
} from "react-icons/fi";
import axios from "axios";
import { useShop } from "../Cart/ShopContext";

// Local dummy data fallback for collection items
const womenTops = [
  {
    id: 101,
    name: "Minimalist Ribbed Crop Top",
    category: "Essentials",
    price: 1499,
    originalPrice: 1799,
    discountBadge: "15% OFF",
    image:
      "https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?auto=format&fit=crop&w=800&q=80",
    colors: [
      { name: "Black", code: "#000000" },
      { name: "White", code: "#ffffff" },
      { name: "Beige", code: "#f5f5dc" },
    ],
  },
  {
    id: 102,
    name: "Floral Satin Silk Blouse",
    category: "Premium",
    price: 2899,
    originalPrice: 3479,
    discountBadge: "15% OFF",
    image:
      "https://images.unsplash.com/photo-1564257631407-4deb1f99d992?auto=format&fit=crop&w=800&q=80",
    colors: [
      { name: "Navy", code: "#1f2937" },
      { name: "Emerald", code: "#059669" },
    ],
  },
  {
    id: 103,
    name: "Vintage Linen Button Top",
    category: "Casual",
    price: 1899,
    originalPrice: 2299,
    discountBadge: "15% OFF",
    image:
      "https://images.unsplash.com/photo-1551803091-e20673f15770?auto=format&fit=crop&w=800&q=80",
  },
  {
    id: 104,
    name: "Elegance Velvet Corset Top",
    category: "Party",
    price: 2499,
    originalPrice: 2999,
    discountBadge: "15% OFF",
    image:
      "https://images.unsplash.com/photo-1539109136881-3be0616acf4b?auto=format&fit=crop&w=800&q=80",
  },
  {
    id: 105,
    name: "Chic Off-Shoulder Top",
    category: "Design",
    price: 2199,
    originalPrice: 2699,
    discountBadge: "15% OFF",
    image:
      "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=800&q=80",
  },
  {
    id: 106,
    name: "Classic White Cotton Shirt",
    category: "Corporate",
    price: 2299,
    originalPrice: 2799,
    discountBadge: "15% OFF",
    image:
      "https://images.unsplash.com/photo-1598554747436-c9293d6a588f?auto=format&fit=crop&w=800&q=80",
  },
  {
    id: 107,
    name: "Casual Knitted Summer Tank",
    category: "Basics",
    price: 999,
    originalPrice: 1299,
    discountBadge: "20% OFF",
    image:
      "https://images.unsplash.com/photo-1502716119720-b23a93e5fe1b?auto=format&fit=crop&w=800&q=80",
  },
  {
    id: 108,
    name: "Cozy Knit Sweater Top",
    category: "Winter",
    price: 3199,
    originalPrice: 3899,
    discountBadge: "15% OFF",
    image:
      "https://images.unsplash.com/photo-1576995853123-5a10305d93c0?auto=format&fit=crop&w=800&q=80",
  },
];

const defaultBestSeller = {
  productID: "shirt-01",
  name: "Slim-Fit Easy-Iron Shirt",
  price: 3499,
  originalPrice: 4999,
  discountBadge: "30% OFF",
  rating: 4.8,
  description:
    "A premium slim-fit, easy-iron shirt crafted in high-thread woven cotton.",
  brand: "Urban Chic",
  sizes: ["S", "M", "L", "XL", "XXL"],
  colors: [
    { name: "Classic White", code: "#ffffff" },
    { name: "Charcoal Navy", code: "#1f2937" },
  ],
  images: [
    {
      url: "https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?auto=format&fit=crop&w=1000&q=80",
    },
    {
      url: "https://images.unsplash.com/photo-1596755094514-f87e34085b2c?auto=format&fit=crop&w=1000&q=80",
    },
    {
      url: "https://images.unsplash.com/photo-1620012253295-c15cc3e65df4?auto=format&fit=crop&w=1000&q=80",
    },
    {
      url: "https://images.unsplash.com/photo-1507679799987-c73779587ccf?auto=format&fit=crop&w=1000&q=80",
    },
  ],
};

const ProductDetails = () => {
  const { id } = useParams();
  const { addToCart } = useShop();

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState("");
  const [selectedSize, setSelectedSize] = useState("M");
  const [selectedColor, setSelectedColor] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [isAdding, setIsAdding] = useState(false);

  // Available coupon codes state
  const [couponCode, setCouponCode] = useState("");
  const [appliedDiscount, setAppliedDiscount] = useState(0); // Percentage or fixed
  const [appliedCouponName, setAppliedCouponName] = useState("");

  const getAuthHeaders = () => {
    const userInfo = JSON.parse(localStorage.getItem("userInfo"));
    const token =
      userInfo?.token ||
      localStorage.getItem("token") ||
      localStorage.getItem("authToken");

    return {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    };
  };

  useEffect(() => {
    const loadProductData = async () => {
      setLoading(true);

      if (!id) {
        setProduct(defaultBestSeller);
        setSelectedImage(defaultBestSeller.images[0].url);
        setSelectedColor(defaultBestSeller.colors[0]?.name || "Standard");
        setLoading(false);
        return;
      }

      // Find in local array
      const localProduct = womenTops.find((p) => p.id === parseInt(id));
      if (localProduct) {
        setProduct(localProduct);
        setSelectedImage(localProduct.image);
        setSelectedColor(localProduct.colors?.[0]?.name || "Standard");
        setLoading(false);
        return;
      }

      // Fetch from backend API using Axios
      try {
        const { data } = await axios.get(
          `https://rabbit-studio.onrender.com/api/products/${id}`,
          {
            headers: getAuthHeaders(),
          }
        );

        if (data) {
          setProduct(data);
          setSelectedImage(data.images?.[0]?.url || data.image);
          setSelectedColor(data.colors?.[0]?.name || "Standard");
        }
      } catch (error) {
        console.error("Error fetching product:", error);
      } finally {
        setLoading(false);
      }
    };

    loadProductData();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-[50vh] flex items-center justify-center font-bold text-sm tracking-widest uppercase text-neutral-400">
        Loading Product...
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-[50vh] flex items-center justify-center font-bold text-sm tracking-widest uppercase text-neutral-400">
        Product not found.
      </div>
    );
  }

  // --- GALLERY HANDLING (ALWAYS GUARANTEES 4 THUMBNAIL SLOTS) ---
  let imagesList = [];
  if (product.images && product.images.length > 0) {
    imagesList = product.images.map((img) => (typeof img === "string" ? img : img.url));
  } else if (product.image) {
    imagesList = [product.image, product.image, product.image, product.image];
  } else {
    imagesList = [
      "https://via.placeholder.com/600",
      "https://via.placeholder.com/600",
      "https://via.placeholder.com/600",
      "https://via.placeholder.com/600",
    ];
  }

  // Pad to 4 images if less than 4
  while (imagesList.length < 4 && imagesList.length > 0) {
    imagesList.push(imagesList[0]);
  }

  const colorsList = (product.colors || []).map((c) => {
    if (typeof c === "string") return { name: c, code: c };
    return c;
  });

  const sizesList = product.sizes || ["S", "M", "L", "XL", "XXL"];

  const handleColorSelect = (color) => {
    setSelectedColor(color.name);
    if (color.image) {
      setSelectedImage(color.image);
    }
  };

  // Handle Applying Coupons / Discount Offers
  const handleApplyCoupon = (code) => {
    const targetCode = (code || couponCode).trim().toUpperCase();
    if (targetCode === "RABBIT10" || targetCode === "FIRST10") {
      setAppliedDiscount(10);
      setAppliedCouponName(targetCode);
      toast.success("Coupon Applied!", {
        description: "10% discount successfully applied to your order.",
      });
    } else if (targetCode === "SAVE20") {
      setAppliedDiscount(20);
      setAppliedCouponName(targetCode);
      toast.success("Coupon Applied!", {
        description: "20% discount successfully applied to your order.",
      });
    } else {
      toast.error("Invalid Code", {
        description: "Please enter a valid discount coupon (e.g., RABBIT10, SAVE20).",
      });
    }
  };

  const baseTotalPrice = product.price * quantity;
  const discountAmount = Math.round((baseTotalPrice * appliedDiscount) / 100);
  const finalPrice = baseTotalPrice - discountAmount;

  const handleAddToCart = () => {
    if (!selectedSize) {
      toast.error("Selection required", {
        description: "Please choose a size.",
      });
      return;
    }

    setIsAdding(true);
    const cartItem = {
      productID: product.id || product._id || product.productID || id,
      name: product.name,
      price: finalPrice / quantity, // adjusted unit price with discount
      originalUnitPrice: product.price,
      discountApplied: appliedDiscount,
      couponName: appliedCouponName,
      image: selectedImage,
      size: selectedSize,
      color: selectedColor || "Standard",
      quantity: quantity,
      category: product.category || product.brand || "Collection",
    };

    addToCart(cartItem);

    setTimeout(() => {
      setIsAdding(false);
      toast.success("Added to Bag!", {
        description: `${quantity}x ${product.name} added successfully.`,
      });
    }, 600);
  };

  return (
    <div className="bg-white text-gray-900 w-full">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-12 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-start">
          {/* LEFT THUMBNAILS GALLERY (PRESERVED 4 SLOTS) */}
          <div className="lg:col-span-7 flex flex-col-reverse md:flex-row gap-4 sm:gap-6">
            <div className="flex md:flex-col gap-3 overflow-x-auto no-scrollbar md:w-24 shrink-0">
              {imagesList.map((imgUrl, i) => (
                <button
                  key={i}
                  onClick={() => setSelectedImage(imgUrl)}
                  className={`relative aspect-[3/4] w-20 md:w-full overflow-hidden rounded-2xl border-2 transition-all duration-200 ${
                    selectedImage === imgUrl
                      ? "border-black ring-2 ring-black/10 scale-[1.02]"
                      : "border-gray-100 opacity-70 hover:opacity-100"
                  }`}
                >
                  <img
                    src={imgUrl}
                    alt={product.name}
                    className="w-full h-full object-cover object-top"
                  />
                </button>
              ))}
            </div>

            {/* MAIN PREVIEW IMAGE STAGE */}
            <div className="flex-1 relative group overflow-hidden rounded-3xl bg-gray-50 border border-gray-100 aspect-[4/5] max-h-[700px] shadow-sm">
              <img
                src={selectedImage || product.image}
                alt={product.name}
                className="w-full h-full object-cover object-top"
              />
              {product.discountBadge && (
                <span className="absolute top-4 left-4 bg-black text-white text-xs font-black px-3 py-1.5 rounded-full uppercase tracking-wider">
                  {product.discountBadge}
                </span>
              )}
            </div>
          </div>

          {/* RIGHT PRODUCT DETAILS */}
          <div className="lg:col-span-5 flex flex-col">
            <div className="border-b border-gray-100 pb-6 mb-6">
              <p className="text-gray-400 text-xs font-bold uppercase tracking-[0.2em] mb-2">
                {product.category || product.brand || "Collection Item"}
              </p>
              <h1 className="text-3xl md:text-4xl font-black tracking-tight text-gray-900 mb-4 leading-tight">
                {product.name}
              </h1>
              <div className="flex items-baseline gap-3">
                <span className="text-3xl font-black text-black tracking-tight">
                  ₹{finalPrice}
                </span>
                {product.originalPrice && (
                  <span className="text-lg text-gray-400 line-through font-medium">
                    ₹{product.originalPrice * quantity}
                  </span>
                )}
                {appliedDiscount > 0 && (
                  <span className="text-xs font-bold bg-emerald-100 text-emerald-800 px-2.5 py-1 rounded-md">
                    {appliedDiscount}% OFF Applied
                  </span>
                )}
              </div>
            </div>

            <p className="text-gray-600 text-sm leading-relaxed mb-6">
              {product.description ||
                "A premium silhouette crafted with exceptional detail and modern styling."}
            </p>

            <div className="space-y-6">
              {/* DISCOUNT OFFERS BOX */}
              <div className="p-4 rounded-2xl bg-amber-50/60 border border-amber-200/60 space-y-3">
                <div className="flex items-center gap-2 text-amber-900 font-bold text-xs uppercase tracking-wider">
                  <FiPercent className="size-4" /> Available Offers & Coupons
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    onClick={() => handleApplyCoupon("RABBIT10")}
                    className="text-left p-2.5 rounded-xl bg-white border border-amber-200 hover:border-black transition-all group"
                  >
                    <div className="text-xs font-black text-black group-hover:underline">RABBIT10</div>
                    <div className="text-[10px] text-gray-500">Get 10% off instantly</div>
                  </button>
                  <button
                    onClick={() => handleApplyCoupon("SAVE20")}
                    className="text-left p-2.5 rounded-xl bg-white border border-amber-200 hover:border-black transition-all group"
                  >
                    <div className="text-xs font-black text-black group-hover:underline">SAVE20</div>
                    <div className="text-[10px] text-gray-500">Get 20% off on orders</div>
                  </button>
                </div>

                {/* Custom Coupon Input */}
                <div className="flex gap-2 pt-1">
                  <div className="relative flex-1">
                    <FiTag className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 size-3.5" />
                    <input
                      type="text"
                      placeholder="Enter coupon code"
                      value={couponCode}
                      onChange={(e) => setCouponCode(e.target.value)}
                      className="w-full pl-9 pr-3 py-2 text-xs font-bold rounded-xl bg-white border border-amber-200 focus:outline-none focus:border-black uppercase"
                    />
                  </div>
                  <button
                    onClick={() => handleApplyCoupon()}
                    className="px-4 py-2 bg-black text-white text-xs font-bold rounded-xl hover:bg-gray-800 transition-all shrink-0"
                  >
                    Apply
                  </button>
                </div>
              </div>

              {/* COLORS */}
              {colorsList.length > 0 && (
                <div>
                  <label className="text-xs font-bold uppercase tracking-wider text-gray-900 block mb-3">
                    Color:{" "}
                    <span className="text-gray-500 font-normal">
                      {selectedColor}
                    </span>
                  </label>
                  <div className="flex flex-wrap gap-3">
                    {colorsList.map((color, idx) => {
                      const isSelected = selectedColor === color.name;
                      const isWhiteBg =
                        color.code?.toLowerCase() === "#ffffff" ||
                        color.code?.toLowerCase() === "white";

                      return (
                        <button
                          key={idx}
                          onClick={() => handleColorSelect(color)}
                          className={`flex items-center gap-2 px-3 py-2 rounded-xl border-2 transition-all ${
                            isSelected
                              ? "border-black bg-gray-50"
                              : "border-gray-100 bg-white"
                          }`}
                        >
                          <span
                            className="w-5 h-5 rounded-full border border-gray-300 flex items-center justify-center shadow-inner"
                            style={{ backgroundColor: color.code || "#000" }}
                          >
                            {isSelected && (
                              <FiCheck
                                className={`size-3 ${isWhiteBg ? "text-black" : "text-white"}`}
                              />
                            )}
                          </span>
                          <span className="text-xs font-bold text-gray-800">
                            {color.name}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* SIZES */}
              <div>
                <label className="text-xs font-bold uppercase tracking-wider text-gray-900 block mb-3">
                  Size:{" "}
                  <span className="text-gray-500 font-normal">
                    {selectedSize}
                  </span>
                </label>
                <div className="grid grid-cols-5 gap-2.5">
                  {sizesList.map((size) => (
                    <button
                      key={size}
                      onClick={() => setSelectedSize(size)}
                      className={`h-11 rounded-xl border-2 font-bold text-sm transition-all ${
                        selectedSize === size
                          ? "bg-black text-white border-black"
                          : "border-gray-100 text-gray-700 bg-white"
                      }`}
                    >
                      {size}
                    </button>
                  ))}
                </div>
              </div>

              {/* QUANTITY & ADD TO BAG */}
              <div className="pt-2 flex gap-4">
                <div className="flex items-center bg-gray-50 rounded-2xl p-1 border border-gray-200 shrink-0">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="w-10 h-10 flex items-center justify-center hover:bg-white rounded-xl"
                  >
                    <FiMinus className="size-4" />
                  </button>
                  <span className="w-10 text-center font-black text-sm">
                    {quantity}
                  </span>
                  <button
                    onClick={() => setQuantity(quantity + 1)}
                    className="w-10 h-10 flex items-center justify-center hover:bg-white rounded-xl"
                  >
                    <FiPlus className="size-4" />
                  </button>
                </div>

                <button
                  onClick={handleAddToCart}
                  disabled={isAdding}
                  className="flex-1 bg-black text-white h-12 rounded-2xl font-bold flex items-center justify-center gap-3 hover:bg-gray-900 shadow-xl"
                >
                  <FiShoppingBag className="size-5" /> Add to Bag • ₹
                  {finalPrice}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetails;
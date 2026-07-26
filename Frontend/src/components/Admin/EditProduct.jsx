import React, { useState, useEffect } from "react";
import { ArrowLeft, Save } from "lucide-react";
import { Link, useParams, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

const CATEGORIES = ["Top Wear", "Bottom Wear", "Accessories", "Footwear"];
const GENDERS = ["Men", "Women", "Unisex"];
const BRANDS = ["Rabbit Elite", "Urban Aura", "Nordic Silk", "Ethos"];
const SIZES = ["XS", "S", "M", "L", "XL", "XXL"];
const COLORS = ["Black", "White", "Stone", "Olive", "Navy", "Earth"];

const EditProduct = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);

  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: "",
    category: "Top Wear",
    gender: "Men",
    brand: "Rabbit Elite",
    stock: "",
    sku: "",
    collections: "All Apparel",
    images: "",
    sizes: [],
    colors: [],
    isPublished: true,
  });

  useEffect(() => {
    const fetchProductDetails = async () => {
      try {
        const response = await fetch(
          `http://localhost:5000/api/products/${id}`,
        );
        const data = await response.json();

        if (response.ok) {
          const imageUrls = Array.isArray(data.images)
            ? data.images.map((img) => img.url).join(", ")
            : "";

          setFormData({
            name: data.name || "",
            description: data.description || "",
            price: data.price !== undefined ? data.price.toString() : "",
            category: data.category || "Top Wear",
            gender: data.gender || "Men",
            brand: data.brand || "Rabbit Elite",
            stock:
              data.countInStock !== undefined
                ? data.countInStock.toString()
                : "",
            sku: data.sku || "",
            collections: data.collections || "All Apparel",
            images: imageUrls,
            sizes: data.sizes || [],
            colors: data.colors || [],
            isPublished:
              data.isPublished !== undefined ? data.isPublished : true,
          });
        } else {
          toast.error(data.message || "Failed to fetch product details");
        }
      } catch (err) {
        console.error("Error fetching product:", err);
        toast.error("Error connecting to server");
      } finally {
        setFetching(false);
      }
    };

    fetchProductDetails();
  }, [id]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleCheckboxArrayToggle = (field, item) => {
    setFormData((prev) => {
      const list = prev[field];
      const exists = list.includes(item);
      return {
        ...prev,
        [field]: exists ? list.filter((i) => i !== item) : [...list, item],
      };
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const userInfo = JSON.parse(localStorage.getItem("userInfo"));
      const token = userInfo?.token || localStorage.getItem("token");

      if (!token) {
        toast.error("Not authorized, please log in as admin again.");
        setLoading(false);
        return;
      }

      const imageArray = formData.images
        ? formData.images.split(",").map((img) => ({ url: img.trim() }))
        : [
            {
              url: "https://images.unsplash.com/photo-1521572267360-ee0c2909d518",
            },
          ];

      const payload = {
        ...formData,
        price: Number(formData.price),
        countInStock: Number(formData.stock),
        images: imageArray,
      };
      delete payload.stock;

      const response = await fetch(`http://localhost:5000/api/products/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });

      const data = await response.json();

      if (response.ok) {
        toast.success("Product updated successfully!");
        navigate("/admin/products");
      } else {
        toast.error(data.message || "Failed to update product");
      }
    } catch (err) {
      console.error("Error updating product:", err);
      toast.error("Error connecting to server");
    } finally {
      setLoading(false);
    }
  };

  if (fetching) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#f6f7fb]">
        <p className="text-sm font-semibold text-gray-500">
          Loading product details...
        </p>
      </div>
    );
  }

  return (
    <section className="min-h-screen bg-[#f6f7fb] p-4 sm:p-6 lg:p-8">
      <div className="mx-auto max-w-4xl space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link
              to="/admin/products"
              className="grid h-10 w-10 place-items-center rounded-xl border border-gray-200 bg-white text-gray-700 shadow-sm transition hover:bg-gray-50"
            >
              <ArrowLeft size={18} />
            </Link>
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-gray-400">
                Admin Portal
              </p>
              <h1 className="text-2xl font-bold tracking-tight text-gray-950">
                Edit Product
              </h1>
            </div>
          </div>
        </div>

        <form
          onSubmit={handleSubmit}
          className="space-y-6 rounded-2xl border border-gray-200 bg-white p-6 shadow-sm sm:p-8"
        >
          <div className="space-y-4">
            <h2 className="text-sm font-black uppercase tracking-wider text-gray-900 border-b border-gray-100 pb-3">
              1. General Information
            </h2>

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="sm:col-span-2">
                <label className="block text-xs font-bold uppercase tracking-wide text-gray-700 mb-2">
                  Product Name *
                </label>
                <input
                  type="text"
                  name="name"
                  required
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="e.g. Heavyweight Cotton Oversized Tee"
                  className="w-full rounded-xl border border-gray-200 bg-gray-50/50 px-4 py-3 text-sm font-medium text-gray-900 outline-none focus:border-black focus:bg-white transition-all"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block text-xs font-bold uppercase tracking-wide text-gray-700 mb-2">
                  Description
                </label>
                <textarea
                  name="description"
                  rows="3"
                  value={formData.description}
                  onChange={handleChange}
                  placeholder="Provide product details, fabrics, fit notes..."
                  className="w-full rounded-xl border border-gray-200 bg-gray-50/50 px-4 py-3 text-sm font-medium text-gray-900 outline-none focus:border-black focus:bg-white transition-all"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wide text-gray-700 mb-2">
                  Price (₹) *
                </label>
                <input
                  type="number"
                  name="price"
                  required
                  min="0"
                  step="0.01"
                  value={formData.price}
                  onChange={handleChange}
                  placeholder="2999"
                  className="w-full rounded-xl border border-gray-200 bg-gray-50/50 px-4 py-3 text-sm font-medium text-gray-900 outline-none focus:border-black focus:bg-white transition-all"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wide text-gray-700 mb-2">
                  Stock Quantity *
                </label>
                <input
                  type="number"
                  name="stock"
                  required
                  min="0"
                  value={formData.stock}
                  onChange={handleChange}
                  className="w-full rounded-xl border border-gray-200 bg-gray-50/50 px-4 py-3 text-sm font-medium text-gray-900 outline-none focus:border-black focus:bg-white transition-all"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wide text-gray-700 mb-2">
                  SKU Code
                </label>
                <input
                  type="text"
                  name="sku"
                  value={formData.sku}
                  onChange={handleChange}
                  className="w-full rounded-xl border border-gray-200 bg-gray-50/50 px-4 py-3 text-sm font-medium text-gray-900 outline-none focus:border-black focus:bg-white transition-all"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wide text-gray-700 mb-2">
                  Image URL(s)
                </label>
                <input
                  type="text"
                  name="images"
                  value={formData.images}
                  onChange={handleChange}
                  placeholder="Paste image URL (comma-separated for multiple)"
                  className="w-full rounded-xl border border-gray-200 bg-gray-50/50 px-4 py-3 text-sm font-medium text-gray-900 outline-none focus:border-black focus:bg-white transition-all"
                />
              </div>
            </div>
          </div>

          <div className="space-y-4 pt-4">
            <h2 className="text-sm font-black uppercase tracking-wider text-gray-900 border-b border-gray-100 pb-3">
              2. Taxonomy & Filters (Sidebar Sync)
            </h2>

            <div className="grid gap-4 sm:grid-cols-3">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wide text-gray-700 mb-2">
                  Category
                </label>
                <select
                  name="category"
                  value={formData.category}
                  onChange={handleChange}
                  className="w-full rounded-xl border border-gray-200 bg-gray-50/50 px-4 py-3 text-sm font-medium text-gray-900 outline-none focus:border-black focus:bg-white transition-all"
                >
                  {CATEGORIES.map((cat) => (
                    <option key={cat} value={cat}>
                      {cat}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wide text-gray-700 mb-2">
                  Gender Target
                </label>
                <select
                  name="gender"
                  value={formData.gender}
                  onChange={handleChange}
                  className="w-full rounded-xl border border-gray-200 bg-gray-50/50 px-4 py-3 text-sm font-medium text-gray-900 outline-none focus:border-black focus:bg-white transition-all"
                >
                  {GENDERS.map((gen) => (
                    <option key={gen} value={gen}>
                      {gen}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wide text-gray-700 mb-2">
                  Brand Name
                </label>
                <select
                  name="brand"
                  value={formData.brand}
                  onChange={handleChange}
                  className="w-full rounded-xl border border-gray-200 bg-gray-50/50 px-4 py-3 text-sm font-medium text-gray-900 outline-none focus:border-black focus:bg-white transition-all"
                >
                  {BRANDS.map((brand) => (
                    <option key={brand} value={brand}>
                      {brand}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="pt-2">
              <label className="block text-xs font-bold uppercase tracking-wide text-gray-700 mb-2">
                Available Sizes
              </label>
              <div className="flex flex-wrap gap-2">
                {SIZES.map((size) => {
                  const selected = formData.sizes.includes(size);
                  return (
                    <button
                      key={size}
                      type="button"
                      onClick={() => handleCheckboxArrayToggle("sizes", size)}
                      className={`rounded-lg border px-4 py-2 text-xs font-bold uppercase tracking-wider transition-all ${
                        selected
                          ? "border-black bg-black text-white"
                          : "border-gray-200 bg-gray-50 text-gray-700 hover:border-black"
                      }`}
                    >
                      {size}
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="pt-2">
              <label className="block text-xs font-bold uppercase tracking-wide text-gray-700 mb-2">
                Available Colors
              </label>
              <div className="flex flex-wrap gap-2">
                {COLORS.map((color) => {
                  const selected = formData.colors.includes(color);
                  return (
                    <button
                      key={color}
                      type="button"
                      onClick={() => handleCheckboxArrayToggle("colors", color)}
                      className={`rounded-lg border px-4 py-2 text-xs font-bold uppercase tracking-wider transition-all ${
                        selected
                          ? "border-black bg-black text-white"
                          : "border-gray-200 bg-gray-50 text-gray-700 hover:border-black"
                      }`}
                    >
                      {color}
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="flex items-center gap-3 pt-3">
              <input
                type="checkbox"
                name="isPublished"
                id="isPublished"
                checked={formData.isPublished}
                onChange={handleChange}
                className="h-5 w-5 rounded border-gray-300 accent-black cursor-pointer"
              />
              <label
                htmlFor="isPublished"
                className="text-sm font-bold text-gray-900 cursor-pointer"
              >
                Publish immediately (make visible in shop & collection filters)
              </label>
            </div>
          </div>

          <div className="flex items-center justify-end gap-3 pt-6 border-t border-gray-100">
            <Link
              to="/admin/products"
              className="rounded-xl border border-gray-200 bg-white px-6 py-3 text-sm font-bold text-gray-700 transition hover:bg-gray-50"
            >
              Cancel
            </Link>

            <button
              type="submit"
              disabled={loading}
              className="inline-flex items-center gap-2 rounded-xl bg-black px-6 py-3 text-sm font-bold text-white shadow-sm transition hover:bg-neutral-800 disabled:opacity-50"
            >
              <Save size={16} />
              {loading ? "Updating..." : "Update Product"}
            </button>
          </div>
        </form>
      </div>
    </section>
  );
};

export default EditProduct;

import React, { useMemo, useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  AlertTriangle,
  Edit3,
  Package,
  Plus,
  Search,
  ShoppingBag,
  Trash2,
  ArrowRight,
} from "lucide-react";
import axios from "axios";
import toast from "react-hot-toast";

const statusStyles = {
  Active: "bg-emerald-100 text-emerald-800 ring-emerald-200",
  Draft: "bg-gray-100 text-gray-700 ring-gray-200",
  "Low Stock": "bg-amber-100 text-amber-800 ring-amber-200",
};

const formatPrice = (price) =>
  new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(price || 0);

const ProductManagement = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      // Fetch products using Axios with destructuring
      const { data } = await axios.get(
        "https://rabbit-studio-drab.vercel.app/api/products?limit=100",
      );

      const formattedProducts = (data.products || []).map((p) => {
        let resolvedImage = "";
        if (p.image) {
          resolvedImage = p.image;
        } else if (Array.isArray(p.images) && p.images.length > 0) {
          const firstImg = p.images[0];
          resolvedImage =
            typeof firstImg === "string" ? firstImg : firstImg?.url || "";
        }

        const stockVal = p.stock ?? p.countInStock ?? 10;

        return {
          ...p,
          id: p._id,
          stock: stockVal,
          status: p.isPublished
            ? stockVal <= 5
              ? "Low Stock"
              : "Active"
            : "Draft",
          sku: p.sku || `SKU-${p._id.slice(-6).toUpperCase()}`,
          image: resolvedImage,
        };
      });
      setProducts(formattedProducts);
    } catch (error) {
      console.error("Error connecting to backend:", error);
      const errorMessage =
        error.response?.data?.message || "Error connecting to server";
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const filteredProducts = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();
    if (!query) return products;

    return products.filter((product) =>
      [product.name, product.sku, product.status, product.category]
        .filter(Boolean)
        .join(" ")
        .toLowerCase()
        .includes(query),
    );
  }, [products, searchQuery]);

  const displayedProducts = useMemo(() => {
    return filteredProducts.slice(0, 3);
  }, [filteredProducts]);

  const activeProducts = products.filter(
    (product) => product.status === "Active",
  ).length;

  const lowStockProducts = products.filter(
    (product) => product.status === "Low Stock" || product.stock <= 5,
  ).length;

  const handleDeleteProduct = async (productId) => {
    if (!window.confirm("Are you sure you want to delete this product?"))
      return;

    try {
      const userInfo = JSON.parse(localStorage.getItem("userInfo"));
      const token =
        userInfo?.token ||
        localStorage.getItem("token") ||
        localStorage.getItem("authToken");

      // Delete product using Axios DELETE request
      await axios.delete(`https://rabbit-studio-drab.vercel.app/api/products/${productId}`, {
        headers: {
          "Content-Type": "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
      });

      toast.success("Product deleted successfully");
      setProducts((current) =>
        current.filter((product) => product.id !== productId),
      );
    } catch (error) {
      console.error("Error deleting product:", error);
      const errorMessage =
        error.response?.data?.message || "Failed to delete product";
      toast.error(errorMessage);
    }
  };

  return (
    <section className="min-h-screen space-y-6 bg-[#f6f7fb] p-4 sm:space-y-8 sm:p-6 lg:p-8">
      <header className="overflow-hidden rounded-2xl bg-gradient-to-r from-slate-950 via-slate-900 to-[#ea2e0e] p-5 text-white shadow-sm sm:p-6">
        <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="text-sm font-semibold uppercase tracking-wide text-white/60">
              Admin Panel
            </p>
            <h1 className="mt-1 text-2xl font-bold tracking-tight sm:text-3xl">
              Product Management
            </h1>
            <p className="mt-2 max-w-xl text-sm text-white/70">
              Review inventory, monitor stock health, and update product
              details.
            </p>
          </div>

          <Link
            to="/admin/products/new"
            className="inline-flex w-full items-center justify-center gap-2 rounded-lg bg-white px-4 py-3 text-sm font-bold text-slate-950 shadow-sm transition hover:bg-orange-50 sm:w-auto"
          >
            <Plus size={17} aria-hidden="true" />
            Add Product
          </Link>
        </div>
      </header>

      <div className="grid gap-4 sm:grid-cols-3">
        <StatCard
          title="Products"
          value={products.length}
          icon={Package}
          gradient="from-slate-950 to-slate-800"
        />
        <StatCard
          title="Active"
          value={activeProducts}
          icon={ShoppingBag}
          gradient="from-emerald-600 to-teal-700"
        />
        <StatCard
          title="Low Stock"
          value={lowStockProducts}
          icon={AlertTriangle}
          gradient="from-orange-500 to-red-600"
        />
      </div>

      <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">
        <div className="flex flex-col gap-4 border-b border-gray-200 bg-white px-4 py-4 sm:px-6 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <h2 className="text-lg font-bold text-gray-950">Products</h2>
            <p className="mt-1 text-sm text-gray-500">
              Showing top {displayedProducts.length} of{" "}
              {filteredProducts.length} product
              {filteredProducts.length === 1 ? "" : "s"}
            </p>
          </div>

          <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
            <div className="flex items-center gap-3 rounded-lg border border-gray-200 bg-white px-3 shadow-sm lg:w-96">
              <Search size={18} className="shrink-0 text-gray-400" />
              <input
                type="search"
                value={searchQuery}
                onChange={(event) => setSearchQuery(event.target.value)}
                placeholder="Search by product name, SKU, or status"
                className="h-11 w-full bg-transparent text-sm outline-none placeholder:text-gray-400"
              />
            </div>

            <Link
              to="/admin/all-products"
              className="inline-flex items-center justify-center gap-1.5 rounded-lg bg-orange-50 px-4 py-2.5 text-xs font-bold text-[#ea2e0e] transition hover:bg-orange-100 whitespace-nowrap"
            >
              View All Products
              <ArrowRight size={14} />
            </Link>
          </div>
        </div>

        {loading ? (
          <div className="p-12 text-center text-sm font-medium text-gray-500">
            Loading products from database...
          </div>
        ) : (
          <>
            <div className="space-y-3 bg-gray-50/60 p-4 md:hidden">
              {displayedProducts.map((product) => (
                <article
                  key={product.id}
                  className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm"
                >
                  <div className="border-l-4 border-[#ea2e0e] p-4">
                    <div className="flex items-start gap-3">
                      <div className="relative h-12 w-12 shrink-0 overflow-hidden rounded-lg border border-gray-200 bg-gray-100">
                        <div className="absolute inset-0 grid place-items-center text-gray-400">
                          <Package size={20} />
                        </div>
                        {product.image && (
                          <img
                            src={product.image}
                            alt={product.name}
                            className="relative h-full w-full object-cover"
                            onError={(e) => {
                              e.target.onerror = null;
                              e.target.style.display = "none";
                            }}
                          />
                        )}
                      </div>

                      <div className="min-w-0 flex-1">
                        <div className="flex items-start justify-between gap-2">
                          <h3 className="truncate font-bold text-gray-950">
                            {product.name}
                          </h3>
                          <StatusBadge status={product.status} />
                        </div>
                        <p className="mt-0.5 text-xs text-gray-500">
                          {product.sku}
                        </p>
                      </div>
                    </div>

                    <div className="mt-4 grid grid-cols-2 gap-3 border-t border-gray-100 pt-4 text-sm">
                      <div>
                        <p className="text-gray-500">Price</p>
                        <p className="mt-1 font-bold text-gray-950">
                          {formatPrice(product.price)}
                        </p>
                      </div>

                      <div>
                        <p className="text-gray-500">Stock</p>
                        <p className="mt-1 font-bold text-gray-950">
                          {product.stock}
                        </p>
                      </div>
                    </div>

                    <div className="mt-4 grid grid-cols-2 gap-2">
                      <Link
                        to={`/admin/products/${product.id}/edit`}
                        className="inline-flex items-center justify-center gap-2 rounded-lg bg-amber-500 px-3 py-2 text-sm font-bold text-white transition hover:bg-amber-600"
                      >
                        <Edit3 size={16} aria-hidden="true" />
                        Edit
                      </Link>

                      <button
                        type="button"
                        onClick={() => handleDeleteProduct(product.id)}
                        className="inline-flex items-center justify-center gap-2 rounded-lg bg-red-500 px-3 py-2 text-sm font-bold text-white transition hover:bg-red-600"
                      >
                        <Trash2 size={16} aria-hidden="true" />
                        Delete
                      </button>
                    </div>
                  </div>
                </article>
              ))}

              {displayedProducts.length === 0 && <EmptyProducts />}
            </div>

            <div className="hidden overflow-x-auto md:block">
              <table className="w-full min-w-[860px] text-left text-sm">
                <thead className="bg-slate-950 text-xs uppercase text-white/70">
                  <tr>
                    <th className="px-5 py-4 font-bold">Product</th>
                    <th className="px-5 py-4 font-bold">Price</th>
                    <th className="px-5 py-4 font-bold">Stock</th>
                    <th className="px-5 py-4 font-bold">Category</th>
                    <th className="px-5 py-4 font-bold">Status</th>
                    <th className="px-5 py-4 text-right font-bold">Actions</th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-gray-100">
                  {displayedProducts.map((product) => (
                    <tr
                      key={product.id}
                      className="transition hover:bg-orange-50/40"
                    >
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-3">
                          <div className="relative h-10 w-10 shrink-0 overflow-hidden rounded-lg border border-gray-200 bg-gray-100">
                            <div className="absolute inset-0 grid place-items-center text-gray-400">
                              <Package size={18} />
                            </div>
                            {product.image && (
                              <img
                                src={product.image}
                                alt={product.name}
                                className="relative h-full w-full object-cover"
                                onError={(e) => {
                                  e.target.onerror = null;
                                  e.target.style.display = "none";
                                }}
                              />
                            )}
                          </div>
                          <div className="min-w-0">
                            <p className="font-semibold text-gray-950 truncate max-w-xs">
                              {product.name}
                            </p>
                            <p className="text-xs text-gray-500">
                              {product.sku}
                            </p>
                          </div>
                        </div>
                      </td>

                      <td className="px-5 py-4 font-medium text-gray-700">
                        {formatPrice(product.price)}
                      </td>

                      <td className="px-5 py-4 text-gray-600">
                        {product.stock}
                      </td>

                      <td className="px-5 py-4 text-gray-600 font-medium">
                        {product.category || "Uncategorized"}
                      </td>

                      <td className="px-5 py-4">
                        <StatusBadge status={product.status} />
                      </td>

                      <td className="px-5 py-4 text-right">
                        <div className="inline-flex items-center gap-2">
                          <Link
                            to={`/admin/products/${product.id}/edit`}
                            className="inline-flex items-center gap-1.5 rounded-lg bg-amber-500 px-3 py-2 text-sm font-bold text-white transition hover:bg-amber-600"
                          >
                            <Edit3 size={15} aria-hidden="true" />
                            Edit
                          </Link>

                          <button
                            type="button"
                            onClick={() => handleDeleteProduct(product.id)}
                            className="inline-flex items-center gap-1.5 rounded-lg bg-red-500 px-3 py-2 text-sm font-bold text-white transition hover:bg-red-600"
                          >
                            <Trash2 size={15} aria-hidden="true" />
                            Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>

              {displayedProducts.length === 0 && <EmptyProducts />}
            </div>
          </>
        )}
      </div>
    </section>
  );
};

const StatCard = ({ title, value, icon: Icon, gradient }) => (
  <div
    className={`rounded-2xl bg-gradient-to-br ${gradient} p-5 text-white shadow-sm`}
  >
    <div className="flex items-start justify-between gap-4">
      <div>
        <p className="text-sm font-semibold text-white/75">{title}</p>
        <h2 className="mt-2 text-3xl font-bold">{value}</h2>
      </div>

      <div className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-white/15 text-white">
        <Icon size={21} aria-hidden="true" />
      </div>
    </div>
  </div>
);

const StatusBadge = ({ status }) => (
  <span
    className={`inline-flex rounded-full px-2.5 py-1 text-xs font-bold ring-1 ${
      statusStyles[status] || statusStyles["Active"]
    }`}
  >
    {status}
  </span>
);

const EmptyProducts = () => (
  <div className="px-6 py-12 text-center">
    <Package className="mx-auto text-gray-300" size={38} />
    <p className="mt-3 text-sm font-medium text-gray-500">No products found</p>
  </div>
);

export default ProductManagement;

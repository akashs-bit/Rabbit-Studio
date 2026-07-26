import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { FiFilter, FiX, FiGrid, FiList } from "react-icons/fi";
import FilterSidebar from "../components/Products/FilterSidebar";
import ProductGrid from "../components/Products/ProductGrid";

const CollectionsPage = () => {
  const { collection } = useParams(); // Reads :collection from URL (e.g., 'men', 'women', 'top-wear', 'bottom-wear')
  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [viewMode, setViewMode] = useState("grid");

  const [filters, setFilters] = useState({
    categories: [],
    genders: [],
    brands: [],
    sizes: [],
    colors: [],
    maxPrice: 15000,
    sortBy: "Featured",
  });

  // Automatically map the URL route parameter to corresponding filter states
  useEffect(() => {
    let newCategories = [];
    let newGenders = [];

    if (collection === "men") {
      newGenders = ["Men"];
    } else if (collection === "women") {
      newGenders = ["Women"];
    } else if (collection === "top-wear") {
      newCategories = ["Top Wear"];
    } else if (collection === "bottom-wear") {
      newCategories = ["Bottom Wear"];
    }

    setFilters((prev) => ({
      ...prev,
      categories: newCategories,
      genders: newGenders,
    }));
    setCurrentPage(1);
  }, [collection]);

  useEffect(() => {
    setCurrentPage(1);
  }, [filters.sortBy, filters.maxPrice]);

  useEffect(() => {
    fetchProducts();
  }, [filters, currentPage]);

  const fetchProducts = async () => {
    try {
      setLoading(true);

      const queryParams = new URLSearchParams({
        page: currentPage,
        limit: 12,
      });

      if (filters.categories && filters.categories.length > 0)
        queryParams.append("category", filters.categories.join(","));
      if (filters.genders && filters.genders.length > 0)
        queryParams.append("gender", filters.genders.join(","));
      if (filters.brands && filters.brands.length > 0)
        queryParams.append("brand", filters.brands.join(","));
      if (filters.sizes && filters.sizes.length > 0)
        queryParams.append("size", filters.sizes.join(","));
      if (filters.colors && filters.colors.length > 0)
        queryParams.append("color", filters.colors.join(","));
      if (filters.maxPrice) 
        queryParams.append("maxPrice", filters.maxPrice);

      if (filters.sortBy === "Newest") queryParams.append("sortBy", "newest");
      if (filters.sortBy === "Price: Low to High")
        queryParams.append("sortBy", "price-asc");
      if (filters.sortBy === "Price: High to Low")
        queryParams.append("sortBy", "price-desc");

      const response = await fetch(
        `http://localhost:5000/api/products?${queryParams.toString()}`,
      );
      const data = await response.json();

      if (response.ok) {
        const formattedProducts = (data.products || []).map((p) => {
          let resolvedImage = "";
          if (p.image) {
            resolvedImage = p.image;
          } else if (Array.isArray(p.images) && p.images.length > 0) {
            const firstImg = p.images[0];
            resolvedImage =
              typeof firstImg === "string" ? firstImg : firstImg?.url || "";
          }

          return {
            ...p,
            id: p._id || p.id,
            image: resolvedImage,
          };
        });

        setProducts(formattedProducts);
        setTotalPages(data.totalPages || 1);
      } else {
        console.error("Failed to fetch products:", data.message);
      }
    } catch (error) {
      console.error("Error connecting to backend:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-6 lg:px-12 py-16">
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6">
        <div>
          <p className="text-[10px] font-black uppercase tracking-[0.4em] text-neutral-400 mb-2">
            Archive / 2026
          </p>
          <h1 className="text-5xl lg:text-7xl font-black uppercase tracking-tighter italic leading-none">
            {collection ? collection.replace("-", " ") : "All"}{" "}
            <span className="not-italic font-light opacity-50 text-neutral-400">
              Apparel.
            </span>
          </h1>
        </div>

        <div className="flex items-center gap-6 border-t md:border-t-0 pt-6 md:pt-0 border-neutral-100">
          <div className="hidden sm:flex items-center gap-3">
            <FiGrid
              className={`cursor-pointer transition ${viewMode === "grid" ? "text-black" : "text-neutral-300"}`}
              size={18}
              onClick={() => setViewMode("grid")}
            />
            <FiList
              className={`cursor-pointer transition ${viewMode === "list" ? "text-black" : "text-neutral-300"}`}
              size={18}
              onClick={() => setViewMode("list")}
            />
          </div>
          <select
            value={filters.sortBy}
            onChange={(e) => setFilters({ ...filters, sortBy: e.target.value })}
            className="text-[11px] font-black uppercase tracking-widest bg-transparent outline-none cursor-pointer"
          >
            <option>Featured</option>
            <option>Newest</option>
            <option>Price: Low to High</option>
            <option>Price: High to Low</option>
          </select>
        </div>
      </div>

      <div className="flex flex-col lg:flex-row relative">
        <button
          onClick={() => setIsMobileFilterOpen(true)}
          className="lg:hidden flex items-center justify-center gap-3 w-full bg-black text-white py-4 rounded-2xl mb-8 uppercase text-xs font-black tracking-widest active:scale-95 transition"
        >
          <FiFilter /> Filter & Sort
        </button>

        <div className="hidden lg:block">
          <FilterSidebar filters={filters} setFilters={setFilters} />
        </div>

        {isMobileFilterOpen && (
          <div className="fixed inset-0 z-[100] lg:hidden">
            <div
              className="absolute inset-0 bg-black/40 backdrop-blur-sm"
              onClick={() => setIsMobileFilterOpen(false)}
            />
            <div className="absolute right-0 top-0 h-full w-[85%] max-w-sm bg-white p-8 overflow-y-auto animate-slide-left">
              <div className="flex justify-between items-center mb-10">
                <h2 className="text-xl font-black uppercase italic">Filters</h2>
                <button onClick={() => setIsMobileFilterOpen(false)}>
                  <FiX size={24} />
                </button>
              </div>
              <FilterSidebar filters={filters} setFilters={setFilters} />
            </div>
          </div>
        )}

        <div className="flex-1 lg:pl-4">
          <ProductGrid
            products={products}
            loading={loading}
            viewMode={viewMode}
          />

          {totalPages > 1 && (
            <div className="mt-20 flex justify-center items-center gap-4">
              {Array.from({ length: totalPages }, (_, index) => index + 1).map(
                (pageNumber) => (
                  <button
                    key={pageNumber}
                    onClick={() => setCurrentPage(pageNumber)}
                    className={`w-12 h-12 rounded-full border border-neutral-100 flex items-center justify-center font-black text-xs transition ${
                      currentPage === pageNumber
                        ? "bg-black text-white"
                        : "hover:bg-black hover:text-white"
                    }`}
                  >
                    {pageNumber}
                  </button>
                ),
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CollectionsPage;
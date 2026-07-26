import React, { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { HiMagnifyingGlass, HiMiniXMark } from "react-icons/hi2";
import { FiLoader, FiArrowRight } from "react-icons/fi";
import axios from "axios";

const formatCurrency = (value) =>
  new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(value);

const SearchBar = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [results, setResults] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const inputRef = useRef(null);
  const navigate = useNavigate();

  const toggleSearch = () => {
    setIsOpen((prev) => !prev);
    if (!isOpen) {
      setSearchTerm("");
      setResults([]);
    }
  };

  // Real-time backend search mapped to your existing GET /api/products?search= route with debouncing
  useEffect(() => {
    if (!searchTerm.trim()) {
      setResults([]);
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    const delayDebounceFn = setTimeout(async () => {
      try {
        const { data } = await axios.get(
          `http://localhost:5000/api/products?search=${encodeURIComponent(
            searchTerm.trim(),
          )}`,
        );
        // Your backend returns { products: [...] }, handle it safely here
        setResults(Array.isArray(data) ? data : data.products || []);
      } catch (error) {
        console.error("Search error:", error);
        setResults([]);
      } finally {
        setIsLoading(false);
      }
    }, 300); // 300ms debounce delay

    return () => clearTimeout(delayDebounceFn);
  }, [searchTerm]);

  // Auto focus + ESC close + Body overflow scroll lock
  useEffect(() => {
    if (isOpen) {
      inputRef.current?.focus();
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }

    const handleEsc = (e) => {
      if (e.key === "Escape") setIsOpen(false);
    };

    window.addEventListener("keydown", handleEsc);
    return () => {
      window.removeEventListener("keydown", handleEsc);
      document.body.style.overflow = "auto";
    };
  }, [isOpen]);

  const handleFullSearchSubmit = (e) => {
    e.preventDefault();
    if (!searchTerm.trim()) return;
    setIsOpen(false);
    navigate(`/shop?search=${encodeURIComponent(searchTerm.trim())}`);
  };

  const handleSelectProduct = (productId) => {
    setIsOpen(false);
    navigate(`/product/${productId}`);
  };

  return (
    <>
      {/* Search Icon trigger */}
      {!isOpen && (
        <button
          type="button"
          onClick={toggleSearch}
          className="rounded-full p-2 transition hover:bg-gray-100"
          aria-label="Open search"
        >
          <HiMagnifyingGlass className="h-6 w-6 text-gray-700 transition hover:text-black" />
        </button>
      )}

      {/* Overlay Modal */}
      {isOpen && (
        <div className="fixed inset-0 z-50 flex flex-col items-start justify-start bg-black/50 backdrop-blur-xs transition-all animate-fadeIn">
          {/* Click outside backdrop zone */}
          <div className="absolute inset-0 -z-10" onClick={toggleSearch} />

          {/* Search Container Box */}
          <div className="w-full bg-white px-4 py-6 shadow-xl sm:px-6 md:px-12">
            <div className="mx-auto max-w-3xl">
              {/* Input Row */}
              <div className="flex items-center gap-4">
                <form
                  onSubmit={handleFullSearchSubmit}
                  className="relative flex-1"
                >
                  <input
                    ref={inputRef}
                    type="text"
                    placeholder="Search for clothes, jeans, jackets..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3.5 pr-12 text-sm font-semibold text-gray-950 outline-none transition focus:border-black focus:bg-white focus:ring-2 focus:ring-black/10"
                  />

                  <button
                    type="submit"
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 transition hover:text-black"
                  >
                    {isLoading ? (
                      <FiLoader className="h-5 w-5 animate-spin text-black" />
                    ) : (
                      <HiMagnifyingGlass className="h-5 w-5" />
                    )}
                  </button>
                </form>

                {/* Close Button */}
                <button
                  type="button"
                  onClick={toggleSearch}
                  className="rounded-xl p-2.5 text-gray-600 transition hover:bg-gray-100 hover:text-black"
                  aria-label="Close search"
                >
                  <HiMiniXMark className="h-6 w-6" />
                </button>
              </div>
            </div>
          </div>

          {/* Live Search Results Dropdown Container */}
          {searchTerm.trim().length > 0 && (
            <div className="w-full flex-1 overflow-y-auto bg-white/95 px-4 py-6 backdrop-blur-md sm:px-6">
              <div className="mx-auto max-w-3xl space-y-3">
                <div className="flex items-center justify-between border-b border-gray-100 pb-3">
                  <p className="text-xs font-bold uppercase tracking-wide text-gray-400">
                    {isLoading
                      ? "Searching database..."
                      : `Matching Products (${results.length})`}
                  </p>

                  <button
                    type="button"
                    onClick={handleFullSearchSubmit}
                    className="inline-flex items-center gap-1.5 text-xs font-bold text-[#ea2e0e] transition hover:underline"
                  >
                    View all results <FiArrowRight size={12} />
                  </button>
                </div>

                {/* Loader State */}
                {isLoading && (
                  <div className="py-12 text-center">
                    <FiLoader className="mx-auto h-8 w-8 animate-spin text-gray-400" />
                    <p className="mt-3 text-sm font-medium text-gray-500">
                      Finding best styles for you...
                    </p>
                  </div>
                )}

                {/* Empty State */}
                {!isLoading && results.length === 0 && (
                  <div className="rounded-2xl border border-dashed border-gray-200 py-12 text-center">
                    <p className="text-base font-bold text-gray-800">
                      No items found for "{searchTerm}"
                    </p>
                    <p className="mt-1 text-sm text-gray-500">
                      Try checking spelling or searching with broader keywords.
                    </p>
                  </div>
                )}

                {/* Results List */}
                {!isLoading && results.length > 0 && (
                  <div className="grid grid-cols-1 gap-2.5">
                    {results.map((product) => {
                      // Safely grab image url from your images array schema or string fallback
                      const productImg =
                        product.images?.[0]?.url ||
                        product.images?.[0] ||
                        product.image ||
                        "";

                      return (
                        <div
                          key={product._id || product.productID}
                          onClick={() =>
                            handleSelectProduct(
                              product._id || product.productID,
                            )
                          }
                          className="group flex cursor-pointer items-center justify-between rounded-xl border border-gray-100 bg-white p-3 shadow-2xs transition hover:border-black/20 hover:bg-gray-50"
                        >
                          <div className="flex items-center gap-4">
                            <div className="h-16 w-14 shrink-0 overflow-hidden rounded-lg bg-gray-100">
                              <img
                                src={productImg}
                                alt={product.name}
                                className="h-full w-full object-cover transition duration-300 group-hover:scale-105"
                              />
                            </div>

                            <div>
                              <h4 className="line-clamp-1 text-sm font-bold text-gray-900 group-hover:text-[#ea2e0e]">
                                {product.name}
                              </h4>
                              <p className="mt-0.5 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                                {product.category || "Apparel"}
                              </p>
                            </div>
                          </div>

                          <div className="text-right">
                            <span className="text-sm font-bold text-gray-950">
                              {formatCurrency(product.price)}
                            </span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      )}
    </>
  );
};

export default SearchBar;

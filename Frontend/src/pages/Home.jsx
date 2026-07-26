import React from "react";
import Hero from "../components/Layout/Hero";
import GenderCollectionSection from "../components/Products/GenderCollectionSection";
import NewArrivals from "../components/Products/NewArrivals";
import ProductDetails from "../components/Products/ProductDetails"; // Best Seller Spotlight Component
import ProductGrid from "../components/Products/ProductGrid";
import FeaturedCollection from "../components/Products/FeaturedCollection";
import FeatureSection from "../components/Products/FeatureSection";

// STRICTLY WOMEN'S TOP WEAR ONLY (Images and Items)
const womenTops = [
  {
    id: 101,
    name: "Minimalist Ribbed Crop Top",
    category: "Essentials",
    price: 1499,
    originalPrice: 1799,
    image:
      "https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?auto=format&fit=crop&w=800&q=80",
  },
  {
    id: 102,
    name: "Floral Satin Silk Blouse",
    category: "Premium",
    price: 2899,
    originalPrice: 3479,
    image:
      "https://images.unsplash.com/photo-1564257631407-4deb1f99d992?auto=format&fit=crop&w=800&q=80",
  },
  {
    id: 103,
    name: "Vintage Linen Button Top",
    category: "Casual",
    price: 1899,
    originalPrice: 2299,
    image:
      "https://images.unsplash.com/photo-1551803091-e20673f15770?auto=format&fit=crop&w=800&q=80",
  },
  {
    id: 104,
    name: "Elegance Velvet Corset Top",
    category: "Party",
    price: 2499,
    originalPrice: 2999,
    image:
      "https://images.unsplash.com/photo-1539109136881-3be0616acf4b?auto=format&fit=crop&w=800&q=80",
  },
  {
    id: 105,
    name: "Chic Off-Shoulder Top",
    category: "Design",
    price: 2199,
    originalPrice: 2699,
    image:
      "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=800&q=80",
  },
  {
    id: 106,
    name: "Classic White Cotton Shirt",
    category: "Corporate",
    price: 2299,
    originalPrice: 2799,
    image:
      "https://images.unsplash.com/photo-1598554747436-c9293d6a588f?auto=format&fit=crop&w=800&q=80",
  },
  {
    id: 107,
    name: "Casual Knitted Summer Tank",
    category: "Basics",
    price: 999,
    originalPrice: 1299,
    image:
      "https://images.unsplash.com/photo-1502716119720-b23a93e5fe1b?auto=format&fit=crop&w=800&q=80",
  },
  {
    id: 108,
    name: "Cozy Knit Sweater Top",
    category: "Winter",
    price: 3199,
    originalPrice: 3899,
    image:
      "https://images.unsplash.com/photo-1576995853123-5a10305d93c0?auto=format&fit=crop&w=800&q=80",
  },
];

const Home = () => {
  return (
    <main className="bg-white overflow-hidden">
      {/* 1. HERO ENTRANCE */}
      <Hero />

      {/* 2. CATEGORY DISCOVERY */}
      <GenderCollectionSection />

      {/* 3. NEW ARRIVALS SLIDER/GRID */}
      <div className="py-20">
        <NewArrivals />
      </div>

      {/* 4. BEST SELLER SPOTLIGHT */}
      <section className="py-24 bg-neutral-50/50 border-y border-neutral-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col items-center mb-16">
            <span className="text-[10px] font-black uppercase tracking-[0.4em] text-neutral-400 mb-4">
              Community Favorite
            </span>
            <h2 className="text-4xl md:text-6xl font-black uppercase tracking-tighter italic">
              The Best Seller
            </h2>
            <div className="w-12 h-1 bg-black mt-6"></div>
          </div>

          {/* Embedded ProductDetails layout with left-side thumbnails & interactive controls */}
          <div className="bg-white rounded-3xl shadow-sm border border-neutral-100 overflow-hidden">
            <ProductDetails />
          </div>
        </div>
      </section>

      {/* 5. WOMEN'S CURATED GRID */}
      <section className="py-24 px-6 lg:px-12">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6">
            <div>
              <p className="text-[11px] font-black uppercase tracking-[0.3em] text-neutral-400 mb-2">
                Curated Selection
              </p>
              <h2 className="text-4xl md:text-5xl font-black uppercase tracking-tighter">
                Women's Top Wears
              </h2>
            </div>
            <p className="max-w-xs text-neutral-500 text-sm font-medium leading-relaxed">
              Explore meticulously crafted silhouettes designed for the
              contemporary woman.
            </p>
          </div>

          <ProductGrid products={womenTops} />
        </div>
      </section>

      {/* 6. EDITORIAL CONTENT */}
      <FeaturedCollection />

      {/* 7. BRAND TRUST FOOTER SECTION */}
      <div className="mt-12">
        <FeatureSection />
      </div>
    </main>
  );
};

export default Home;

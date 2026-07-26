import React from "react";
import { Link } from "react-router-dom";
import { FiArrowRight } from "react-icons/fi";

const Hero = () => {
  // New high-resolution fashion background image
  const heroImg =
    "https://images.unsplash.com/photo-1490481651871-ab68de25d43d?auto=format&fit=crop&w=2000&q=85";

  return (
    <section className="relative w-full h-[600px] md:h-[85vh] lg:h-[90vh] overflow-hidden bg-[#171717]">
      {/* 1. BACKGROUND LAYER - With subtle zoom effect */}
      <div className="absolute inset-0 overflow-hidden">
        <img
          src={heroImg}
          alt="New Season Collection"
          className="w-full h-full object-cover object-center scale-105 animate-subtle-zoom"
        />
        {/* Modern multi-stage overlay for depth */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
        <div className="absolute inset-0 bg-black/10" />
      </div>

      {/* 2. CONTENT LAYER */}
      <div className="relative z-10 h-full flex items-center">
        <div className="container mx-auto px-6 lg:px-12 xl:px-20">
          <div className="max-w-3xl">
            {/* Tagline with line accent */}
            <div className="flex items-center gap-3 mb-6 animate-fade-in-down">
              <span className="w-12 h-[2px] bg-white"></span>
              <p className="text-[10px] md:text-xs font-black uppercase tracking-[0.4em] text-white/90">
                Spring / Summer 2026
              </p>
            </div>

            {/* Typography - Mixed weights for premium feel */}
            <h1 className="text-5xl sm:text-7xl md:text-8xl lg:text-9xl font-black leading-[0.9] text-white uppercase tracking-tighter mb-8 italic">
              Vacation <br />
              <span className="not-italic font-light opacity-80">Ready.</span>
            </h1>

            {/* Floating Info Box (Glassmorphism) */}
            <div className="inline-block backdrop-blur-md bg-white/5 border border-white/10 p-6 md:p-8 rounded-2xl max-w-lg mb-10 transform hover:bg-white/10 transition-all duration-500">
              <p className="text-sm md:text-lg text-gray-300 leading-relaxed mb-6 font-medium">
                Curated essentials for the modern traveler. Experience
                ultra-breathable fabrics engineered for the heat of the horizon.
              </p>

              {/* High-End Action Button */}
              <Link
                to="/collections/all"
                className="group flex items-center gap-4 text-white uppercase text-xs md:text-sm font-black tracking-widest"
              >
                <span className="bg-white text-black px-8 py-4 rounded-full group-hover:bg-black group-hover:text-white transition-all duration-500 flex items-center gap-3">
                  Explore Collection
                  <FiArrowRight className="group-hover:translate-x-2 transition-transform duration-300" />
                </span>
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* 3. DECORATIVE SIDEBAR (Hidden on mobile) */}
      <div className="absolute right-12 bottom-12 hidden lg:block">
        <div className="flex flex-col items-center gap-6">
          <p className="rotate-90 origin-right text-[10px] font-black uppercase tracking-[0.5em] text-white/30 whitespace-nowrap">
            Scroll to discover
          </p>
          <div className="w-[1px] h-24 bg-gradient-to-b from-white/40 to-transparent"></div>
        </div>
      </div>
    </section>
  );
};

export default Hero;

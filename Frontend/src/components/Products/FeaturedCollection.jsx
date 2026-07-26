import React from "react";
import { Link } from "react-router-dom";
import featured from "../../assets/featured.webp";

const FeaturedCollection = () => {
  return (
    <section className="py-14 px-4 lg:px-0">
      <div className="container mx-auto flex flex-col-reverse lg:flex-row items-center 
      bg-green-50 rounded-2xl overflow-hidden shadow-sm">

        {/* LEFT CONTENT */}
        <div className="lg:w-1/2 p-6 sm:p-8 md:p-10 text-center lg:text-left">

          <p className="text-sm font-medium text-gray-500 mb-2 tracking-wide">
            Comfort and Style
          </p>

          <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold mb-4 leading-tight text-gray-900">
            Apparel made for your everyday life
          </h2>

          <p className="text-gray-600 text-sm sm:text-base mb-6 max-w-md mx-auto lg:mx-0">
            Discover high-quality, comfortable clothing that effortlessly blends
            fashion and function. Designed to make you look and feel great every day.
          </p>

          <Link
            to="/collections/all"
            className="inline-block bg-black text-white px-6 py-3 rounded-md text-sm font-medium 
            hover:bg-gray-800 transition duration-300"
          >
            Shop Now →
          </Link>
        </div>

        {/* RIGHT IMAGE */}
        <div className="lg:w-1/2 relative">

          {/* subtle glow */}
          <div className="absolute inset-0 bg-green-200/20 blur-xl"></div>

          <img
            src={featured}
            alt="Featured Collection"
            className="relative w-full h-[260px] sm:h-[320px] md:h-[380px] lg:h-full 
            object-cover transition-transform duration-500 hover:scale-105"
          />
        </div>

      </div>
    </section>
  );
};

export default FeaturedCollection;
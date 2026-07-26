import React from "react";
import mensCollectionImage from "../../assets/mens-collection.webp";
import womenCollectionImage from "../../assets/womens-collection.webp";
import { Link } from "react-router-dom";
import { FiArrowUpRight } from "react-icons/fi";

const GenderCollectionSection = () => {
  const collections = [
    {
      title: "Women",
      subtitle: "Effortless Grace",
      image: womenCollectionImage,
      link: "/collections/all?gender=Women",
    },
    {
      title: "Men",
      subtitle: "Refined Utility",
      image: mensCollectionImage,
      link: "/collections/all?gender=Men",
    },
  ];

  return (
    <section className="py-20 px-6 lg:px-12 bg-white">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 lg:gap-16">
          {collections.map((item, index) => (
            <div key={index} className="group relative cursor-pointer">
              {/* IMAGE CONTAINER */}
              <div className="relative aspect-[4/5] md:aspect-[3/4] lg:aspect-[4/5.5] overflow-hidden rounded-3xl bg-neutral-100">
                <img
                  src={item.image}
                  alt={`${item.title} Collection`}
                  className="w-full h-full object-cover transition-transform duration-[1.5s] ease-out group-hover:scale-110"
                />

                {/* 2026 Style Gradient: Softer and Multi-layered */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-80 transition-opacity group-hover:opacity-100" />

                {/* CENTER BORDER FRAME - Appears on hover */}
                <div className="absolute inset-8 border border-white/20 rounded-2xl opacity-0 scale-95 transition-all duration-700 group-hover:opacity-100 group-hover:scale-100" />
              </div>

              {/* FLOATING CONTENT */}
              <div className="absolute inset-0 flex flex-col justify-end p-10 lg:p-14">
                <div className="overflow-hidden">
                  <p className="text-[10px] font-black uppercase tracking-[0.4em] text-white/60 mb-2 transform translate-y-full transition-transform duration-500 group-hover:translate-y-0">
                    {item.subtitle}
                  </p>
                </div>

                <h2 className="text-4xl lg:text-6xl font-black text-white uppercase tracking-tighter mb-6 italic leading-none">
                  {item.title}
                </h2>

                <Link
                  to={item.link}
                  className="inline-flex items-center gap-3 w-fit group/btn"
                >
                  <div className="relative overflow-hidden bg-white text-black px-6 py-3 rounded-full flex items-center gap-2 transition-all duration-300 group-hover/btn:bg-black group-hover/btn:text-white">
                    <span className="text-xs font-black uppercase tracking-widest">
                      Shop Now
                    </span>
                    <FiArrowUpRight className="text-lg transition-transform duration-300 group-hover/btn:rotate-45" />
                  </div>
                </Link>
              </div>

              {/* DECORATIVE NUMBERING */}
              <div className="absolute top-10 right-10">
                <span className="text-white/20 font-black text-5xl italic tracking-tighter">
                  0{index + 1}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default GenderCollectionSection;

import React from "react";
import { HiOutlineShoppingBag } from "react-icons/hi2";
import { FiRefreshCw, FiHeadphones, FiLock } from "react-icons/fi";

const features = [
  {
    icon: <HiOutlineShoppingBag className="text-xl" />,
    title: "Free Express Shipping",
    desc: "Complimentary delivery on all orders over ₹1,999 securely shipped.",
  },
  {
    icon: <FiRefreshCw className="text-xl" />,
    title: "45 Days Return",
    desc: "Hassle-free exchanges and seamless returns within 45 days.",
  },
  {
    icon: <FiLock className="text-xl" />,
    title: "Secure Payment",
    desc: "256-bit SSL encryption for 100% safe transactions & data protection.",
  },
  {
    icon: <FiHeadphones className="text-xl" />,
    title: "24/7 Priority Support",
    desc: "Dedicated styling and customer care team at your service anytime.",
  },
];

const FeatureSection = () => {
  return (
    <section className="py-20 px-6 sm:px-12 bg-white border-t border-neutral-100">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
          {features.map((item, index) => (
            <div
              key={index}
              className="relative p-8 rounded-3xl bg-neutral-50 border border-neutral-100/80 flex flex-col justify-between group hover:bg-neutral-900 transition-all duration-700 shadow-sm hover:shadow-xl"
            >
              <div>
                {/* Icon Container with Floating Effect */}
                <div className="flex items-center justify-between mb-8">
                  <div className="w-14 h-14 bg-white rounded-2xl text-black flex items-center justify-center shadow-sm transition-all duration-500 group-hover:bg-[#ea2e0e] group-hover:text-white group-hover:scale-110 group-hover:rotate-6">
                    {item.icon}
                  </div>
                  <span className="text-[10px] font-black uppercase tracking-[0.3em] text-neutral-300 group-hover:text-neutral-600 transition-colors">
                    0{index + 1}
                  </span>
                </div>

                {/* Text Content */}
                <div>
                  <h4 className="text-base font-black tracking-tight uppercase mb-2 text-neutral-900 group-hover:text-white transition-colors">
                    {item.title}
                  </h4>
                  <p className="text-neutral-500 text-xs font-medium leading-relaxed group-hover:text-neutral-400 transition-colors">
                    {item.desc}
                  </p>
                </div>
              </div>

              {/* Dynamic Bottom Line Accent */}
              <div className="mt-8 w-12 h-[2px] bg-neutral-200 group-hover:w-full group-hover:bg-[#ea2e0e] transition-all duration-700 ease-in-out" />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeatureSection;

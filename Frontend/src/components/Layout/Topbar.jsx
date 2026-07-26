import React from "react";
import { TbBrandMeta } from "react-icons/tb";
import { IoLogoInstagram } from "react-icons/io";
import { RiTwitterXLine } from "react-icons/ri";
import { FiPhone } from "react-icons/fi";

const Topbar = () => {
  return (
    <div className="bg-[#ea2e0e] text-white text-sm">
      <div className="w-full px-4 sm:px-6 md:px-8 lg:px-12 xl:px-16">
        <div className="flex items-center justify-between py-2">
          {/* Left - Social Icons */}
          <div className="hidden md:flex items-center gap-3">
            <a
              href="#"
              className="p-1.5 rounded-full hover:bg-white hover:text-[#ea2e0e] transition"
            >
              <TbBrandMeta size={16} />
            </a>

            <a
              href="#"
              className="p-1.5 rounded-full hover:bg-white hover:text-[#ea2e0e] transition"
            >
              <IoLogoInstagram size={16} />
            </a>

            <a
              href="#"
              className="p-1.5 rounded-full hover:bg-white hover:text-[#ea2e0e] transition"
            >
              <RiTwitterXLine size={16} />
            </a>
          </div>

          {/* Center - Announcement */}
          <div className="flex-1 text-center px-2">
            <p className="text-xs sm:text-sm font-medium tracking-wide">
              🚚 Free shipping worldwide — Fast & reliable delivery
            </p>
          </div>

          {/* Right - Phone */}
          <div className="hidden md:flex items-center gap-2">
            <FiPhone size={14} />
            <a
              href="tel:+1234567890"
              className="hover:text-gray-200 transition"
            >
              +1 (234) 567-890
            </a>
          </div>

          {/* Mobile Right Icon */}
          <div className="md:hidden flex items-center">
            <a href="tel:+1234567890">
              <FiPhone size={16} />
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Topbar;

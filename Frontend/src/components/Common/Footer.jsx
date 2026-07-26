import React from "react";
import { IoLogoInstagram } from "react-icons/io";
import { RiTwitterXLine } from "react-icons/ri";
import { TbBrandMeta } from "react-icons/tb";
import { FiPhoneCall, FiArrowRight } from "react-icons/fi";
import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer className="border-t border-neutral-100 bg-white text-neutral-900 pt-16 pb-12">
      {/* Main Container */}
      <div className="w-full px-4 sm:px-6 md:px-8 lg:px-12 xl:px-16 mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-12 lg:gap-8 pb-16 border-b border-neutral-100">
          {/* Brand & Newsletter Section (Spans 2 cols on lg) */}
          <div className="lg:col-span-2 pr-0 lg:pr-8">
            <Link
              to="/"
              className="inline-block text-xl font-black tracking-tighter uppercase mb-4"
            >
              RABBIT STUDIO<span className="text-[#ea2e0e]">.</span>
            </Link>
            <p className="text-neutral-500 text-sm mb-4 leading-relaxed max-w-sm">
              Elevating everyday wear with meticulously crafted silhouettes,
              premium textures, and contemporary design.
            </p>
            <p className="text-xs font-black uppercase tracking-widest text-neutral-900 mb-4">
              Get 10% off your first order. Subscribe now.
            </p>

            <form
              onSubmit={(e) => e.preventDefault()}
              className="flex max-w-md"
            >
              <input
                type="email"
                placeholder="Enter your email address"
                className="flex-1 bg-neutral-50 border border-neutral-200 px-4 py-3 text-xs rounded-l-xl focus:outline-none focus:border-black transition-colors"
              />
              <button className="bg-black hover:bg-[#ea2e0e] text-white px-6 py-3 text-xs font-black uppercase tracking-wider rounded-r-xl transition-all duration-300 flex items-center gap-2">
                <span>Join</span>
                <FiArrowRight size={14} />
              </button>
            </form>
          </div>

          {/* Shop Links */}
          <div>
            <h4 className="text-xs font-black uppercase tracking-[0.2em] mb-6 text-neutral-900">
              Shop Collection
            </h4>
            <ul className="space-y-3 text-sm font-medium text-neutral-500">
              <li>
                <Link to="#" className="hover:text-black transition-colors">
                  Men's Apparel
                </Link>
              </li>
              <li>
                <Link to="#" className="hover:text-black transition-colors">
                  Women's Collection
                </Link>
              </li>
              <li>
                <Link to="#" className="hover:text-black transition-colors">
                  Top Wear
                </Link>
              </li>
              <li>
                <Link to="#" className="hover:text-black transition-colors">
                  Bottom Wear
                </Link>
              </li>
              <li>
                <Link to="#" className="hover:text-black transition-colors">
                  New Arrivals
                </Link>
              </li>
            </ul>
          </div>

          {/* Support Links */}
          <div>
            <h4 className="text-xs font-black uppercase tracking-[0.2em] mb-6 text-neutral-900">
              Customer Support
            </h4>
            <ul className="space-y-3 text-sm font-medium text-neutral-500">
              <li>
                <Link to="#" className="hover:text-black transition-colors">
                  Contact Us
                </Link>
              </li>
              <li>
                <Link to="#" className="hover:text-black transition-colors">
                  About Our Brand
                </Link>
              </li>
              <li>
                <Link to="#" className="hover:text-black transition-colors">
                  Shipping & Returns
                </Link>
              </li>
              <li>
                <Link to="#" className="hover:text-black transition-colors">
                  FAQs
                </Link>
              </li>
              <li>
                <Link to="#" className="hover:text-black transition-colors">
                  Help Center
                </Link>
              </li>
            </ul>
          </div>

          {/* Social & Contact */}
          <div>
            <h4 className="text-xs font-black uppercase tracking-[0.2em] mb-6 text-neutral-900">
              Connect With Us
            </h4>

            <div className="flex gap-2.5 mb-6">
              <a
                href="#meta"
                aria-label="Meta"
                className="p-3 border border-neutral-200 rounded-xl hover:bg-black hover:text-white hover:border-black transition-all"
              >
                <TbBrandMeta size={18} />
              </a>
              <a
                href="#instagram"
                aria-label="Instagram"
                className="p-3 border border-neutral-200 rounded-xl hover:bg-black hover:text-white hover:border-black transition-all"
              >
                <IoLogoInstagram size={18} />
              </a>
              <a
                href="#twitter"
                aria-label="Twitter"
                className="p-3 border border-neutral-200 rounded-xl hover:bg-black hover:text-white hover:border-black transition-all"
              >
                <RiTwitterXLine size={18} />
              </a>
            </div>

            <div className="bg-neutral-50 p-4 rounded-2xl border border-neutral-100">
              <p className="text-[10px] font-black uppercase tracking-widest text-neutral-400 mb-1">
                Customer Care
              </p>
              <p className="flex items-center gap-2 text-xs font-bold text-neutral-900">
                <FiPhoneCall className="text-[#ea2e0e]" size={14} /> +91 (0215)
                255-546
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Legal Section */}
      <div className="w-full px-4 sm:px-6 md:px-8 lg:px-12 xl:px-16 mx-auto pt-8 flex flex-col sm:flex-row justify-between items-center gap-4 text-xs text-neutral-400">
        <p>© 2026 CompileTab. All rights reserved.</p>
        <div className="flex gap-6 font-medium">
          <Link to="#" className="hover:text-neutral-900 transition-colors">
            Privacy Policy
          </Link>
          <Link to="#" className="hover:text-neutral-900 transition-colors">
            Terms of Service
          </Link>
          <Link to="#" className="hover:text-neutral-900 transition-colors">
            Cookie Settings
          </Link>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

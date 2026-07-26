import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import toast from "react-hot-toast"; // 👈 1. Import toast
import {
  Mail,
  Lock,
  Eye,
  EyeOff,
  User,
  Loader2,
  ArrowRight,
} from "lucide-react";
import registerImg from "../assets/register.webp";

const Register = () => {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.password) {
      toast.error("Please complete all fields to join."); // 👈 Validation Toast
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch("http://localhost:5000/api/users/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message || "Registration failed. Please try again.",
        );
      }

      // Save token and user info
      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data.user));

      // 🎉 2. Success Toast
      toast.success(`Welcome to the club, ${data.user.name}! 🎉`, {
        duration: 3000,
      });

      // Redirect after a brief delay so user sees the message
      setTimeout(() => {
        navigate("/");
      }, 1500);
    } catch (err) {
      console.error("Registration Error:", err);
      // ❌ 3. Error Toast
      toast.error(err.message || "Server connection failed.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <section className="min-h-screen flex items-center justify-center bg-neutral-50 px-4 py-12">
      <div className="w-full max-w-5xl bg-white rounded-[2rem] shadow-2xl overflow-hidden grid grid-cols-1 md:grid-cols-2 min-h-[750px] border border-neutral-100">
        {/* LEFT: FORM SECTION */}
        <div className="p-10 sm:p-16 flex flex-col justify-center">
          <div className="mb-10">
            <h2 className="text-4xl font-black tracking-tighter uppercase mb-3 text-neutral-900">
              Create{" "}
              <span className="italic font-light text-neutral-500">
                Account.
              </span>
            </h2>
            <p className="text-sm font-medium text-neutral-400">
              Join our community of trendsetters today.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* FULL NAME */}
            <div className="space-y-2">
              <label className="text-[10px] font-black tracking-[0.2em] text-neutral-400 uppercase ml-1">
                Full Name
              </label>
              <div className="relative group">
                <User
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-neutral-300 group-focus-within:text-black transition-colors"
                  size={18}
                />
                <input
                  name="name"
                  type="text"
                  placeholder="Johnathan Doe"
                  value={formData.name}
                  onChange={handleChange}
                  className="w-full pl-12 pr-4 py-4 bg-neutral-50 border border-neutral-100 rounded-2xl focus:bg-white focus:ring-4 focus:ring-black/5 focus:border-black outline-none transition-all duration-300 text-sm font-medium"
                />
              </div>
            </div>

            {/* EMAIL */}
            <div className="space-y-2">
              <label className="text-[10px] font-black tracking-[0.2em] text-neutral-400 uppercase ml-1">
                Email Address
              </label>
              <div className="relative group">
                <Mail
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-neutral-300 group-focus-within:text-black transition-colors"
                  size={18}
                />
                <input
                  name="email"
                  type="email"
                  placeholder="name@email.com"
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full pl-12 pr-4 py-4 bg-neutral-50 border border-neutral-100 rounded-2xl focus:bg-white focus:ring-4 focus:ring-black/5 focus:border-black outline-none transition-all duration-300 text-sm font-medium"
                />
              </div>
            </div>

            {/* PASSWORD */}
            <div className="space-y-2">
              <label className="text-[10px] font-black tracking-[0.2em] text-neutral-400 uppercase ml-1">
                Set Security Key
              </label>
              <div className="relative group">
                <Lock
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-neutral-300 group-focus-within:text-black transition-colors"
                  size={18}
                />
                <input
                  name="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  value={formData.password}
                  onChange={handleChange}
                  className="w-full pl-12 pr-12 py-4 bg-neutral-50 border border-neutral-100 rounded-2xl focus:bg-white focus:ring-4 focus:ring-black/5 focus:border-black outline-none transition-all duration-300 text-sm font-medium"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-neutral-300 hover:text-black transition-colors"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            {/* SUBMIT BUTTON */}
            <button
              type="submit"
              disabled={isLoading}
              className="group w-full bg-black text-white py-4 rounded-2xl font-black uppercase tracking-widest text-xs flex items-center justify-center gap-3 hover:bg-neutral-800 transition-all duration-500 disabled:opacity-30 active:scale-95 shadow-lg shadow-black/10"
            >
              {isLoading ? (
                <Loader2 className="animate-spin" size={18} />
              ) : (
                <>
                  Create Account
                  <ArrowRight
                    size={16}
                    className="group-hover:translate-x-1 transition-transform"
                  />
                </>
              )}
            </button>
          </form>

          {/* LOGIN LINK */}
          <p className="text-[11px] font-bold text-neutral-400 mt-10 text-center uppercase tracking-widest">
            Member of the club?
            <Link
              to="/login"
              className="text-black ml-2 underline underline-offset-4 hover:text-neutral-600 transition-colors"
            >
              Sign In
            </Link>
          </p>
        </div>

        {/* RIGHT: STORY & BRANDING */}
        <div className="hidden md:block relative overflow-hidden bg-neutral-900 group">
          <img
            src={registerImg}
            alt="Register Aesthetics"
            className="w-full h-full object-cover opacity-80 group-hover:scale-110 transition-transform duration-[2s]"
          />
          <div className="absolute inset-0 flex flex-col justify-end p-12 bg-gradient-to-t from-black via-transparent to-transparent">
            <div className="backdrop-blur-md bg-white/10 border border-white/20 p-8 rounded-3xl">
              <h3 className="text-white text-2xl font-black tracking-tighter uppercase mb-2 italic">
                Join{" "}
                <span className="not-italic font-light text-white/70">
                  the Elite.
                </span>
              </h3>
              <p className="text-white/60 text-[10px] font-black leading-relaxed uppercase tracking-[0.2em]">
                "Style is a way to say who you are without having to speak."
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Register;

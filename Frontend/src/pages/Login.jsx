import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { Mail, Lock, Eye, EyeOff, Loader2, ArrowRight } from "lucide-react";
import axios from "axios";
import loginImg from "../assets/login.webp";

const Login = () => {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({ email: "", password: "" });

  const getAuthHeaders = () => {
    const userInfo = JSON.parse(localStorage.getItem("userInfo"));
    const token =
      userInfo?.token ||
      localStorage.getItem("token") ||
      localStorage.getItem("authToken");

    return {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    };
  };

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.email || !formData.password) {
      toast.error("Please fill in both email and password.");
      return;
    }

    setIsLoading(true);

    try {
      const { data } = await axios.post(
        "https://rabbit-studio.onrender.com/api/users/login",
        formData,
        {
          headers: getAuthHeaders(),
        },
      );

      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data.user));

      toast.success(`Welcome back, ${data.user?.name || "User"}! 👋`, {
        duration: 3000,
      });

      setTimeout(() => {
        navigate("/");
      }, 1200);
    } catch (err) {
      console.error("Login Error:", err);
      const errorMsg =
        err.response?.data?.message ||
        err.message ||
        "Something went wrong. Please try again.";
      toast.error(errorMsg);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <section className="min-h-screen flex items-center justify-center bg-neutral-50 px-4 py-12">
      <div className="w-full max-w-5xl bg-white rounded-[2rem] shadow-2xl overflow-hidden grid grid-cols-1 md:grid-cols-2 min-h-[700px] border border-neutral-100">
        {/* LEFT: THE FORM AREA */}
        <div className="p-10 sm:p-16 flex flex-col justify-center">
          <div className="mb-10">
            <h2 className="text-4xl font-black tracking-tighter uppercase mb-3 text-neutral-900">
              Welcome{" "}
              <span className="italic font-light text-neutral-500">Back.</span>
            </h2>
            <p className="text-sm font-medium text-neutral-400">
              Enter your details to access your curated dashboard.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* EMAIL INPUT */}
            <div className="space-y-2">
              <label className="text-[10px] font-black tracking-[0.2em] text-neutral-400 uppercase ml-1">
                Account Email
              </label>
              <div className="relative group">
                <Mail
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-neutral-300 group-focus-within:text-black transition-colors"
                  size={18}
                />
                <input
                  name="email"
                  type="email"
                  placeholder="name@company.com"
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full pl-12 pr-4 py-4 bg-neutral-50 border border-neutral-100 rounded-2xl focus:bg-white focus:ring-4 focus:ring-black/5 focus:border-black outline-none transition-all duration-300 text-sm font-medium"
                />
              </div>
            </div>

            {/* PASSWORD INPUT */}
            <div className="space-y-2">
              <div className="flex justify-between items-center px-1">
                <label className="text-[10px] font-black tracking-[0.2em] text-neutral-400 uppercase">
                  Security Key
                </label>
                {/* 👈 FORGOT PASSWORD LINK UPDATED HERE */}
                <Link
                  to="/forgot-password"
                  className="text-[10px] font-black text-neutral-400 hover:text-black uppercase tracking-widest transition-colors"
                >
                  Forgot Password?
                </Link>
              </div>
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
                  Enter Dashboard
                  <ArrowRight
                    size={16}
                    className="group-hover:translate-x-1 transition-transform"
                  />
                </>
              )}
            </button>
          </form>

          {/* REGISTER LINK */}
          <p className="text-[11px] font-bold text-neutral-400 mt-10 text-center uppercase tracking-widest">
            New to the platform?
            <Link
              to="/register"
              className="text-black ml-2 underline underline-offset-4 hover:text-neutral-600 transition-colors"
            >
              Create Account
            </Link>
          </p>
        </div>

        {/* RIGHT: THE BRAND IMAGE / STORY */}
        <div className="hidden md:block relative overflow-hidden bg-neutral-900 group">
          <img
            src={loginImg}
            alt="Login Aesthetics"
            className="w-full h-full object-cover opacity-80 group-hover:scale-110 transition-transform duration-[2s]"
          />
          {/* GLASS OVERLAY CARD */}
          <div className="absolute inset-0 flex flex-col justify-end p-12 bg-gradient-to-t from-black via-transparent to-transparent">
            <div className="backdrop-blur-md bg-white/10 border border-white/20 p-8 rounded-3xl">
              <h3 className="text-white text-2xl font-black tracking-tighter uppercase mb-2 italic">
                Quality <span className="not-italic font-light">Matters.</span>
              </h3>
              <p className="text-white/60 text-xs font-medium leading-relaxed uppercase tracking-widest">
                "Fashion is the armor to survive the reality of everyday life."
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Login;

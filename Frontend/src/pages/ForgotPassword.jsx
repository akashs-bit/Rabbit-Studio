import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { KeyRound, ArrowLeft, Mail, Lock } from "lucide-react";
import axios from "axios";

const ForgotPassword = () => {
  const [step, setStep] = useState(1); // Step 1: Email, Step 2: OTP & New Password
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ text: "", type: "" });

  const navigate = useNavigate();

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

  // Send Reset Code using Axios
  const handleRequestOtp = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage({ text: "", type: "" });

    try {
      const { data } = await axios.post(
        "https://rabbit-studio-drab.vercel.app/api/users/forgot-password",
        { email },
        { headers: getAuthHeaders() },
      );

      setMessage({
        text: data?.message || "Reset code sent to your email!",
        type: "success",
      });
      setStep(2);
    } catch (err) {
      const errorMsg =
        err.response?.data?.message || "Failed to send reset code.";
      setMessage({
        text: errorMsg,
        type: "error",
      });
    } finally {
      setLoading(false);
    }
  };

  // Reset Password using Axios
  const handleResetPassword = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage({ text: "", type: "" });

    try {
      await axios.post(
        "https://rabbit-studio-drab.vercel.app/api/users/reset-password",
        { email, otp, newPassword },
        { headers: getAuthHeaders() },
      );

      setMessage({
        text: "Password reset successfully! Redirecting to login...",
        type: "success",
      });
      setTimeout(() => {
        navigate("/login");
      }, 1500);
    } catch (err) {
      const errorMsg =
        err.response?.data?.message || "Invalid or expired code.";
      setMessage({
        text: errorMsg,
        type: "error",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="flex min-h-screen items-center justify-center bg-[#f6f7fb] p-4">
      <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-xl sm:p-8">
        {/* Top Navigation Back to Login */}
        <Link
          to="/login"
          className="inline-flex items-center gap-2 text-xs font-bold text-gray-500 hover:text-gray-900"
        >
          <ArrowLeft size={16} /> Back to Login
        </Link>

        {/* Header */}
        <div className="mt-6 flex items-center gap-3">
          <div className="grid h-12 w-12 place-items-center rounded-xl bg-orange-100 text-[#ea2e0e]">
            <KeyRound size={22} />
          </div>
          <div>
            <h1 className="text-xl font-bold text-gray-950">
              {step === 1 ? "Forgot Password?" : "Reset Your Password"}
            </h1>
            <p className="text-xs text-gray-500">
              {step === 1
                ? "Enter your email to receive a recovery code"
                : "Enter the code and set your new password"}
            </p>
          </div>
        </div>

        {/* Message Alert */}
        {message.text && (
          <div
            className={`mt-4 rounded-xl px-4 py-3 text-xs font-semibold ${
              message.type === "error"
                ? "bg-red-50 text-red-600 border border-red-200"
                : "bg-emerald-50 text-emerald-600 border border-emerald-200"
            }`}
          >
            {message.text}
          </div>
        )}

        {/* STEP 1: ENTER EMAIL */}
        {step === 1 ? (
          <form onSubmit={handleRequestOtp} className="mt-6 space-y-4">
            <div>
              <label className="text-xs font-bold uppercase tracking-wide text-gray-500">
                Email Address
              </label>
              <div className="relative mt-1">
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@example.com"
                  className="w-full rounded-xl border border-gray-200 py-2.5 pl-10 pr-3 text-sm focus:border-black focus:outline-none"
                />
                <Mail
                  size={18}
                  className="absolute left-3 top-3 text-gray-400"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-xl bg-[#ea2e0e] py-3 text-sm font-bold text-white transition hover:bg-[#c0260b] disabled:opacity-50"
            >
              {loading ? "Sending..." : "Send Reset Code"}
            </button>
          </form>
        ) : (
          /* STEP 2: ENTER OTP & NEW PASSWORD */
          <form onSubmit={handleResetPassword} className="mt-6 space-y-4">
            <div>
              <label className="text-xs font-bold uppercase tracking-wide text-gray-500">
                6-Digit Reset Code (OTP)
              </label>
              <input
                type="text"
                required
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                placeholder="123456"
                className="mt-1 w-full rounded-xl border border-gray-200 px-3 py-2.5 text-center text-sm font-mono tracking-widest focus:border-black focus:outline-none"
              />
            </div>

            <div>
              <label className="text-xs font-bold uppercase tracking-wide text-gray-500">
                New Password
              </label>
              <div className="relative mt-1">
                <input
                  type="password"
                  required
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full rounded-xl border border-gray-200 py-2.5 pl-10 pr-3 text-sm focus:border-black focus:outline-none"
                />
                <Lock
                  size={18}
                  className="absolute left-3 top-3 text-gray-400"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-xl bg-[#ea2e0e] py-3 text-sm font-bold text-white transition hover:bg-[#c0260b] disabled:opacity-50"
            >
              {loading ? "Resetting..." : "Update Password"}
            </button>
          </form>
        )}
      </div>
    </main>
  );
};

export default ForgotPassword;

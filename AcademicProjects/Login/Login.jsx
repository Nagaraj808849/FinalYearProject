import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FaEnvelope, FaLock } from "react-icons/fa";
import axios from "axios";
import { useAuth } from "../src/context/useAuth";

const Login = () => {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [loginData, setLoginData] = useState({
    emailId: "",
    password: "",
  });

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  // --- Forgot Password Modal State ---
  const [showForgotModal, setShowForgotModal] = useState(false);
  const [forgotStep, setForgotStep] = useState(1); // 1: Email, 2: OTP, 3: New Password
  const [forgotEmail, setForgotEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [forgotLoading, setForgotLoading] = useState(false);
  const [forgotMessage, setForgotMessage] = useState({ text: "", type: "" });

  // Handle forgot password modal close
  const closeForgotModal = () => {
    setShowForgotModal(false);
    setForgotStep(1);
    setForgotEmail("");
    setOtp("");
    setNewPassword("");
    setConfirmPassword("");
    setForgotMessage({ text: "", type: "" });
  };

  // Step 1: Request OTP
  const handleRequestOtp = async (e) => {
    e.preventDefault();
    setForgotLoading(true);
    try {
      const resp = await axios.post("http://localhost:7080/api/ForgotPassword/send-otp", { email: forgotEmail });
      setForgotMessage({ text: "OTP sent to your email!", type: "success" });
      setForgotStep(2);
    } catch (err) {
      const errorMessage = err.response?.data?.message || "Failed to send OTP. Please check your connection.";
      setForgotMessage({ text: errorMessage, type: "error" });
    }
    setForgotLoading(false);
  };

  // Step 2: Verify OTP
  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    setForgotLoading(true);
    try {
      await axios.post("http://localhost:7080/api/ForgotPassword/verify-otp", { email: forgotEmail, otp });
      setForgotMessage({ text: "OTP verified! Please set a new password.", type: "success" });
      setForgotStep(3);
    } catch (err) {
      setForgotMessage({ text: "Invalid or expired OTP.", type: "error" });
    }
    setForgotLoading(false);
  };

  // Step 3: Reset Password
  const handleResetPassword = async (e) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      setForgotMessage({ text: "Passwords do not match.", type: "error" });
      return;
    }
    setForgotLoading(true);
    try {
      await axios.post("http://localhost:7080/api/ForgotPassword/reset-password", {
        email: forgotEmail,
        otp,
        newPassword
      });
      alert("Password updated successfully! Please login with your new password.");
      closeForgotModal();
    } catch (err) {
      setForgotMessage({ text: "Failed to reset password.", type: "error" });
    }
    setForgotLoading(false);
  };

  // Handle input change
  const handleChange = (e) => {
    const { name, value } = e.target;
    setLoginData({ ...loginData, [name]: value });
    setError("");
  };

  // Handle form submit
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const response = await axios.post(
        "http://localhost:7080/api/Login/Login", 
        loginData,
        { headers: { "Content-Type": "application/json" } }
      );

      const data = response.data;
      login(data);

      const numericRole = data.role === 1 || String(data.role) === "1" || String(data.role).toLowerCase() === "admin" ? 1 : 2;

      if (numericRole === 1) {
        navigate("/Admin");
      } else {
        navigate("/Homepage1");
      }

    } catch (err) {
      console.error("Login Error:", err);
      if (err.response) {
        setError(err.response.data?.message || "Invalid Email or Password");
      } else {
        setError("Server not responding. Check backend.");
      }
    }
    setLoading(false);
  };

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-br from-amber-50 to-white">
      <div className="flex justify-center items-center flex-1">

        <div className="w-[850px] h-[540px] flex rounded-lg shadow-2xl border border-amber-400 overflow-hidden">

          {/* LEFT SIDE LOGIN FORM */}
          <div className="w-1/2 bg-white flex flex-col justify-center p-10">

            <h2 className="text-2xl font-semibold mb-6 text-amber-900 text-center">
              Login to Golden Essence
            </h2>

            <form className="space-y-5 text-gray-800" onSubmit={handleSubmit}>

              {/* Email */}
              <div className="relative">
                <input
                  type="email"
                  name="emailId"
                  placeholder="Email"
                  value={loginData.emailId}
                  onChange={handleChange}
                  className="w-full py-2 pl-10 border-b border-amber-300 focus:border-amber-600 focus:outline-none"
                  required
                />
                <FaEnvelope className="absolute left-2 top-3 text-amber-600" />
              </div>

              {/* Password */}
              <div className="relative">
                <input
                  type="password"
                  name="password"
                  placeholder="Password"
                  value={loginData.password}
                  onChange={handleChange}
                  className="w-full py-2 pl-10 border-b border-amber-300 focus:border-amber-600 focus:outline-none"
                  required
                />
                <FaLock className="absolute left-2 top-3 text-amber-600" />
              </div>

              {/* Forgot Password Link */}
              <div className="text-right">
                <button
                  type="button"
                  onClick={() => setShowForgotModal(true)}
                  className="text-amber-700 text-xs font-semibold hover:underline"
                >
                  Forgot Password?
                </button>
              </div>

              {/* Button */}
              <button
                type="submit"
                disabled={loading}
                className="w-full py-2 rounded-full bg-gradient-to-r from-amber-500 to-amber-600 text-white font-semibold hover:opacity-90 disabled:opacity-60 transition-all shadow-md"
              >
                {loading ? "Logging in..." : "Login"}
              </button>

              {/* Error */}
              {error && (
                <p className="mt-2 text-red-500 text-sm text-center font-medium bg-red-50 p-2 rounded border border-red-100">
                  {error}
                </p>
              )}

            </form>

            <p className="mt-6 text-sm text-gray-600 text-center">
              Don't have an account?
              <Link to="/Signup" className="text-amber-600 ml-2 font-bold hover:underline">
                Create Account
              </Link>
            </p>

          </div>

          {/* RIGHT SIDE */}
          <div className="w-1/2 bg-gradient-to-br from-amber-500 to-amber-600 text-white flex flex-col justify-center items-center p-8 text-center">
             <div className="w-20 h-20 bg-white/20 rounded-full flex items-center justify-center mb-6 backdrop-blur-sm shadow-xl">
                 <FaLock size={32} className="text-white" />
             </div>
            <h2 className="text-3xl font-extrabold mb-4">WELCOME BACK</h2>
            <p className="text-amber-50 text-sm leading-relaxed max-w-xs">
              Sign in to manage your orders and experience the taste of prestige at Golden Essence Restaurant.
            </p>
          </div>

        </div>

      </div>

      {/* Forgot Password Modal */}
      {showForgotModal && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4 backdrop-blur-[2px]">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-8 relative overflow-hidden">
            {/* Header */}
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-bold text-amber-900">Reset Password</h3>
              <button onClick={closeForgotModal} className="text-gray-400 hover:text-red-500 transition-colors uppercase text-xs font-bold tracking-widest">
                Close
              </button>
            </div>

            {/* Step Indicators */}
            <div className="flex gap-2 mb-8">
                {[1, 2, 3].map(s => (
                    <div key={s} className={`h-1 flex-1 rounded-full ${forgotStep >= s ? 'bg-amber-500' : 'bg-gray-200'}`}></div>
                ))}
            </div>

            {forgotMessage.text && (
              <div className={`p-4 rounded-lg mb-6 text-sm font-semibold text-center border ${forgotMessage.type === 'success' ? 'bg-green-50 text-green-700 border-green-200' : 'bg-red-50 text-red-700 border-red-200'}`}>
                {forgotMessage.text}
              </div>
            )}

            {/* Step 1: Email */}
            {forgotStep === 1 && (
              <form onSubmit={handleRequestOtp} className="space-y-6">
                <p className="text-gray-600 text-sm leading-relaxed text-center">
                  Enter your email address and we'll send a 6-digit OTP to reset your password.
                </p>
                <div className="relative">
                  <input
                    type="email"
                    required
                    placeholder="name@gmail.com"
                    value={forgotEmail}
                    onChange={(e) => setForgotEmail(e.target.value)}
                    className="w-full py-3 border-b-2 border-amber-200 focus:border-amber-500 focus:outline-none transition-all text-lg"
                  />
                </div>
                <button
                  type="submit"
                  disabled={forgotLoading}
                  className="w-full py-3 rounded-xl bg-amber-600 text-white font-bold hover:bg-amber-700 transition-all shadow-lg active:scale-95"
                >
                  {forgotLoading ? "Sending OTP..." : "Get Verification Code"}
                </button>
              </form>
            )}

            {/* Step 2: OTP */}
            {forgotStep === 2 && (
              <form onSubmit={handleVerifyOtp} className="space-y-6">
                <p className="text-gray-600 text-sm leading-relaxed text-center">
                  Check your Gmail for the 6-digit code.
                </p>
                <div>
                  <input
                    type="text"
                    required
                    maxLength={6}
                    placeholder="123456"
                    value={otp}
                    onChange={(e) => setOtp(e.target.value)}
                    className="w-full py-3 border-b-2 border-amber-200 focus:border-amber-500 focus:outline-none transition-all text-center text-3xl tracking-[12px] font-bold"
                  />
                </div>
                <button
                  type="submit"
                  disabled={forgotLoading}
                  className="w-full py-3 rounded-xl bg-amber-600 text-white font-bold hover:bg-amber-700 transition-all shadow-lg active:scale-95"
                >
                  {forgotLoading ? "Verifying..." : "Verify OTP"}
                </button>
                <button onClick={() => setForgotStep(1)} className="w-full text-sm text-amber-700 hover:underline">Resend code</button>
              </form>
            )}

            {/* Step 3: Password */}
            {forgotStep === 3 && (
              <form onSubmit={handleResetPassword} className="space-y-6">
                <p className="text-gray-600 text-sm leading-relaxed text-center">
                  Create a strong new password that you haven't used before.
                </p>
                <div className="space-y-4">
                  <input
                    type="password"
                    required
                    placeholder="New Password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    className="w-full py-3 border-b-2 border-amber-200 focus:border-amber-500 focus:outline-none transition-all"
                  />
                  <input
                    type="password"
                    required
                    placeholder="Confirm New Password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="w-full py-3 border-b-2 border-amber-200 focus:border-amber-500 focus:outline-none transition-all"
                  />
                </div>
                <button
                  type="submit"
                  disabled={forgotLoading}
                  className="w-full py-3 rounded-xl bg-amber-600 text-white font-bold hover:bg-amber-700 transition-all shadow-lg active:scale-95"
                >
                  {forgotLoading ? "Resetting..." : "Update Password"}
                </button>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default Login;



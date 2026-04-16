import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FaEnvelope, FaLock } from "react-icons/fa";
import axios from "axios";
import { useAuth } from "../src/context/useAuth";
import { API_ENDPOINTS } from "../src/config";

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
      const response = await axios.post(API_ENDPOINTS.FORGOT_PASSWORD.SEND_OTP, { email: forgotEmail });
      setForgotMessage({ 
        text: response.data.message || "OTP sent to your email!", 
        type: "success" 
      });
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
      await axios.post(API_ENDPOINTS.FORGOT_PASSWORD.VERIFY_OTP, { email: forgotEmail, otp });
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
      await axios.post(API_ENDPOINTS.FORGOT_PASSWORD.RESET_PASSWORD, {
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

  const [showLoginSuccess, setShowLoginSuccess] = useState(false);

  // Handle form submit
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const response = await axios.post(
        API_ENDPOINTS.LOGIN,
        loginData,
        { headers: { "Content-Type": "application/json" } }
      );

      const data = response.data;
      login(data);

      setShowLoginSuccess(true);

      const numericRole = data.role === 1 || String(data.role) === "1" || String(data.role).toLowerCase() === "admin" ? 1 : 2;

      // DELAY FOR ANIMATION
      setTimeout(() => {
        if (numericRole === 1) {
          navigate("/Admin");
        } else {
          navigate("/Homepage1");
        }
      }, 1500);

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
    <div className="flex flex-col min-h-screen bg-gradient-to-br from-amber-50 to-white overflow-hidden">
      
      {/* Sticky Success Notification */}
      {showLoginSuccess && (
        <div className="fixed top-6 left-1/2 z-[100] w-full max-w-sm px-4 animate-sticky-success">
          <div className="bg-emerald-600/95 backdrop-blur-md text-white shadow-2xl rounded-2xl p-4 flex items-center gap-4 border border-emerald-400/30">
            <div className="flex-shrink-0 w-12 h-12 bg-white/20 rounded-full flex items-center justify-center animate-pulse">
              <span className="text-2xl font-bold">✓</span>
            </div>
            <div>
              <h3 className="font-bold text-lg leading-tight">Login Successful!</h3>
              <p className="text-emerald-50 text-xs font-medium">Redirecting to your dashboard...</p>
            </div>
            <div className="ml-auto w-1 h-12 bg-white/20 rounded-full overflow-hidden">
              <div className="h-full bg-white animate-progress-shrink"></div>
            </div>
          </div>
        </div>
      )}
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
              <div className={`p-4 rounded-xl mb-6 text-sm font-semibold text-center border whitespace-pre-line animate-in fade-in slide-in-from-top-2 duration-300 ${forgotMessage.type === 'success' ? 'bg-emerald-50 text-emerald-700 border-emerald-200' : 'bg-rose-50 text-rose-700 border-rose-200'}`}>
                {forgotMessage.text}
              </div>
            )}

            {/* Step 1: Email */}
            {forgotStep === 1 && (
              <form onSubmit={handleRequestOtp} className="space-y-6">
                <div className="text-center space-y-2">
                  <p className="text-gray-600 text-sm leading-relaxed">
                    Enter your email address and we'll send a 6-digit OTP to reset your password.
                  </p>
                </div>
                <div className="relative group">
                  <input
                    type="email"
                    required
                    placeholder="name@gmail.com"
                    value={forgotEmail}
                    onChange={(e) => setForgotEmail(e.target.value)}
                    className="w-full py-3 border-b-2 border-amber-200 focus:border-amber-500 focus:outline-none transition-all text-lg group-hover:border-amber-300"
                  />
                  <FaEnvelope className="absolute right-2 top-4 text-amber-400 group-hover:text-amber-500 transition-colors" />
                </div>
                <button
                  type="submit"
                  disabled={forgotLoading}
                  className="w-full py-3.5 rounded-xl bg-gradient-to-r from-amber-600 to-amber-700 text-white font-bold hover:from-amber-700 hover:to-amber-800 transition-all shadow-lg active:scale-[0.98] disabled:opacity-70 disabled:cursor-not-allowed"
                >
                  {forgotLoading ? (
                    <span className="flex items-center justify-center gap-2">
                      <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
                      Sending Code...
                    </span>
                  ) : "Get Verification Code"}
                </button>
              </form>
            )}

            {/* Step 2: OTP */}
            {forgotStep === 2 && (
              <form onSubmit={handleVerifyOtp} className="space-y-6">
                <div className="text-center space-y-2">
                  <p className="text-gray-600 text-sm leading-relaxed">
                    Check your <span className="font-bold text-amber-900">Gmail</span> for the 6-digit code.
                  </p>
                  <p className="text-xs text-amber-600 font-medium italic">Sent to: {forgotEmail}</p>
                </div>
                <div className="flex justify-center">
                  <input
                    type="text"
                    required
                    maxLength={6}
                    placeholder="000000"
                    value={otp}
                    onChange={(e) => setOtp(e.target.value.replace(/\D/g, ""))}
                    className="w-full py-4 border-2 border-amber-100 rounded-xl focus:border-amber-500 focus:outline-none transition-all text-center text-4xl tracking-[8px] font-black text-amber-900 placeholder:text-gray-200 bg-amber-50/30"
                  />
                </div>
                <button
                  type="submit"
                  disabled={forgotLoading}
                  className="w-full py-3.5 rounded-xl bg-amber-600 text-white font-bold hover:bg-amber-700 transition-all shadow-lg active:scale-[0.98] disabled:opacity-70"
                >
                  {forgotLoading ? "Verifying..." : "Verify OTP"}
                </button>
                <div className="flex flex-col items-center gap-3">
                  <button 
                    type="button"
                    onClick={() => {
                      setForgotStep(1);
                      setForgotMessage({ text: "", type: "" });
                    }} 
                    className="text-sm text-gray-500 hover:text-amber-700 hover:underline transition-colors"
                  >
                    Change Email
                  </button>
                  <button 
                    type="button"
                    onClick={handleRequestOtp} 
                    className="text-xs font-bold text-amber-700 uppercase tracking-widest hover:text-amber-900 transition-colors"
                  >
                    Resend Code
                  </button>
                </div>
              </form>
            )}

            {/* Step 3: Password */}
            {forgotStep === 3 && (
              <form onSubmit={handleResetPassword} className="space-y-6">
                <div className="text-center space-y-2">
                  <p className="text-gray-600 text-sm leading-relaxed">
                    Create a strong new password to secure your account.
                  </p>
                </div>
                <div className="space-y-4">
                  <div className="relative group">
                    <input
                      type="password"
                      required
                      placeholder="New Password"
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      className="w-full py-3 border-b-2 border-amber-200 focus:border-amber-500 focus:outline-none transition-all pr-10"
                    />
                    <FaLock className="absolute right-2 top-4 text-amber-400" />
                  </div>
                  <div className="relative group">
                    <input
                      type="password"
                      required
                      placeholder="Confirm New Password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      className="w-full py-3 border-b-2 border-amber-200 focus:border-amber-500 focus:outline-none transition-all pr-10"
                    />
                    <FaLock className="absolute right-2 top-4 text-amber-400" />
                  </div>
                </div>
                <button
                  type="submit"
                  disabled={forgotLoading}
                  className="w-full py-3.5 rounded-xl bg-amber-600 text-white font-bold hover:bg-amber-700 transition-all shadow-lg active:scale-[0.98] disabled:opacity-70"
                >
                  {forgotLoading ? "Updating..." : "Update Password"}
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



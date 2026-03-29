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

  // Handle input change
  const handleChange = (e) => {
    const { name, value } = e.target;

    setLoginData({
      ...loginData,
      [name]: value,
    });

    setError("");
  };

  // Handle form submit
  const handleSubmit = async (e) => {
    e.preventDefault();

    setLoading(true);
    setError("");

    try {
      const response = await axios.post(
        "http://localhost:7080/api/Login/Login", // ? FIXED (HTTPS)
        loginData,
        {
          headers: {
            "Content-Type": "application/json",
          }
        }
      );

      const data = response.data;

      // Call centralized login from context which handles persistence
      login(data);

      // Redirect based on the role handled by the context
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
      } else if (err.request) {
        setError("Server not responding. Check backend.");
      } else {
        setError("Something went wrong");
      }
    }

    setLoading(false);
  };

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-br from-amber-50 to-white">
      <div className="flex justify-center items-center flex-1">

        <div className="w-[850px] h-[500px] flex rounded-lg shadow-2xl border border-amber-400">

          {/* LEFT SIDE LOGIN FORM */}
          <div className="w-1/2 bg-white flex flex-col justify-center p-10">

            <h2 className="text-2xl font-semibold mb-6 text-amber-900">
              Login
            </h2>

            <form className="space-y-6 text-gray-800" onSubmit={handleSubmit}>

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

              {/* Button */}
              <button
                type="submit"
                disabled={loading}
                className="w-full py-2 rounded-full bg-gradient-to-r from-amber-500 to-amber-600 text-white font-semibold hover:opacity-90 disabled:opacity-60"
              >
                {loading ? "Logging in..." : "Login"}
              </button>

              {/* Error */}
              {error && (
                <p className="mt-2 text-red-500 text-sm text-center">
                  {error}
                </p>
              )}

            </form>

            <p className="mt-4 text-sm text-gray-600 text-center">
              Don't have an account?
              <Link
                to="/Signup"
                className="text-amber-600 ml-2 font-semibold"
              >
                Signup
              </Link>
            </p>

          </div>

          {/* RIGHT SIDE */}
          <div className="w-1/2 bg-gradient-to-br from-amber-500 to-amber-600 text-white flex flex-col justify-center items-center p-8">
            <h2 className="text-3xl font-extrabold">WELCOME</h2>
            <p className="mt-4 text-sm text-center">
              Login to access your account and continue.
            </p>
          </div>

        </div>

      </div>
    </div>
  );
};

export default Login;



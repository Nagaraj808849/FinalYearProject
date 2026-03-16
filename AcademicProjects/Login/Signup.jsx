import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FaUser, FaEnvelope, FaLock } from "react-icons/fa";
import axios from "axios";

const Signup = () => {
  const navigate = useNavigate();
  const [error, setError] = useState("");

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    emailId: "",        // ✅ lowercase (important)
    password: "",
    confirmPassword: "",
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
    setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (
      !formData.firstName ||
      !formData.lastName ||
      !formData.emailId ||
      !formData.password ||
      !formData.confirmPassword
    ) {
      setError("All fields are required");
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    if (formData.password.length < 6) {
      setError("Password must be at least 6 characters");
      return;
    }

    try {
      const response = await axios.post(
        "http://localhost:5155/api/Registration/InsertRegisters",

        {
          "firstName": formData.firstName,
          "lastName": formData.lastName,
          "emailId": formData.emailId,
          "password": formData.password,
        
        }
      );

      alert(response.data.message);
      navigate("/Login");
    } catch (err) {
      console.error(err);

      if (err.response) {
        setError(err.response.data);
      } else {
        setError("Cannot connect to backend. Check if API is running.");
      }
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-br from-amber-50 to-white">
      <div className="flex justify-center items-center flex-1">
        <div className="w-[850px] h-[550px] flex rounded-lg shadow-2xl border border-amber-400">

          <div className="w-1/2 bg-gradient-to-br from-amber-500 to-amber-600 text-white flex flex-col justify-center items-center p-8">
            <h2 className="text-3xl font-extrabold">WELCOME</h2>
          </div>

          <div className="w-1/2 bg-white flex flex-col justify-center p-10">
            <h2 className="text-2xl font-semibold mb-6 text-amber-900">Sign Up</h2>

            <form className="space-y-5 text-gray-800" onSubmit={handleSubmit}>

              <div className="relative">
                <input
                  type="text"
                  name="firstName"
                  placeholder="First Name"
                  value={formData.firstName}
                  onChange={handleChange}
                  className="w-full py-2 pl-10 border-b border-gray-600 focus:outline-none"
                />
                <FaUser className="absolute left-2 top-3 text-gray-400" />
              </div>

              <div className="relative">
                <input
                  type="text"
                  name="lastName"
                  placeholder="Last Name"
                  value={formData.lastName}
                  onChange={handleChange}
                  className="w-full py-2 pl-10 border-b border-gray-600 focus:outline-none"
                />
                <FaUser className="absolute left-2 top-3 text-gray-400" />
              </div>

              <div className="relative">
                <input
                  type="email"
                  name="emailId"
                  placeholder="Email"
                  value={formData.emailId}
                  onChange={handleChange}
                  className="w-full py-2 pl-10 border-b border-gray-600 focus:outline-none"
                />
                <FaEnvelope className="absolute left-2 top-3 text-gray-400" />
              </div>

              <div className="relative">
                <input
                  type="password"
                  name="password"
                  placeholder="Password"
                  value={formData.password}
                  onChange={handleChange}
                  className="w-full py-2 pl-10 border-b border-gray-600 focus:outline-none"
                />
                <FaLock className="absolute left-2 top-3 text-gray-400" />
              </div>

              <div className="relative">
                <input
                  type="password"
                  name="confirmPassword"
                  placeholder="Confirm Password"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  className="w-full py-2 pl-10 border-b border-gray-600 focus:outline-none"
                />
                <FaLock className="absolute left-2 top-3 text-gray-400" />
              </div>

              <button
                type="submit"
                className="w-full py-2 rounded-full bg-gradient-to-r from-amber-500 to-amber-600 text-white font-semibold"
              >
                Sign Up
              </button>

              {error && (
                <p className="mt-2 text-red-500 text-sm">{error}</p>
              )}
            </form>

            <p className="mt-4 text-sm text-center text-gray-600">
              Already have an account?{" "}
              <Link to="/Login" className="text-amber-600 font-bold">
                Login
              </Link>
            </p>

          </div>
        </div>
      </div>
    </div>
  );
};

export default Signup;
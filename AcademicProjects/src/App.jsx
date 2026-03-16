import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import axios from "axios";

// 🔹 Global Axios Interceptor
axios.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

import Login from "../Login/Login";
import Signup from "../Login/Signup";
import Frontpage from "../Home/Frontpage";
import TableOrder from "../TableOrder/TableOrdering.jsx";
import PaymentPage from "../Payment/PaymentDetails.jsx";
import UserDash from "../UserDash/UserDash.jsx";
import Admin from "../AbminDash/Admin.jsx";
import Homepage1 from "../Home/HomePage1.jsx";
import Menu1 from "../Menu/Menu1.jsx";
import CartPage from "../Menu/Cartpage.jsx";
import { AuthProvider } from "./context/AuthContext";


// 🔹 Normalize role from any format to number: 2 or "2" → 2, "User" → 2, "Admin"/"Admin" → 1
// Note: role=0 means the DB didn't set a role (new users from sp_InsertRegistration) — treat as Customer (2)
const normalizeRole = (rawRole) => {
  if (!rawRole && rawRole !== 0) return 2; // null/undefined → Customer
  const s = String(rawRole).toLowerCase().trim();
  if (s === "admin" || s === "1") return 1;
  if (s === "user" || s === "customer" || s === "2" || s === "0" || s === "") return 2;
  const n = Number(rawRole);
  return isNaN(n) ? 2 : (n === 1 ? 1 : 2); // default to Customer for any unknown value
};

// 🔹 Embedded ProtectedRoute
const ProtectedRoute = ({ children, requiredRole }) => {

  const token = localStorage.getItem("token");
  const rawRole = localStorage.getItem("role");
  const role = normalizeRole(rawRole);

  // Not logged in at all
  if (!token) {
    return <Navigate to="/Login" replace />;
  }

  if (requiredRole) {
    // Admin (1) can see everything — no restriction
    if (role === 1) {
      // Only block Admin from UserDash (role 2 only route) if you want isolation
      // For now: Admin can see all pages
      return children;
    }

    // User (2) can only see role-2 routes
    if (role === 2 && requiredRole === 2) {
      return children;
    }

    // User (2) trying to access Admin (1) route — redirect home
    if (role === 2 && requiredRole === 1) {
      return <Navigate to="/Homepage1" replace />;
    }

    // Unknown role — redirect to login
    return <Navigate to="/Login" replace />;
  }

  return children;
};


function App() {
  return (
    <AuthProvider>
      <Router>

        <Routes>

          {/* Public Routes */}
          <Route path="/" element={<Frontpage />} />
          <Route path="/Login" element={<Login />} />
          <Route path="/Signup" element={<Signup />} />
          <Route path="/Homepage1" element={<Homepage1 />} />
          <Route path="/Menu1" element={<Menu1 />} />

          {/* Protected User Routes */}

          <Route
            path="/Cart"
            element={
              <ProtectedRoute requiredRole={2}>
                <CartPage />
              </ProtectedRoute>
            }
          />

          <Route
            path="/TableOrder"
            element={
              <ProtectedRoute requiredRole={2}>
                <TableOrder />
              </ProtectedRoute>
            }
          />

          <Route
            path="/PaymentDetails"
            element={
              <ProtectedRoute requiredRole={2}>
                <PaymentPage />
              </ProtectedRoute>
            }
          />

          <Route
            path="/UserDash"
            element={
              <ProtectedRoute requiredRole={2}>
                <UserDash />
              </ProtectedRoute>
            }
          />

          {/* 🔴 ADMIN ONLY ROUTE */}

          <Route
            path="/Admin"
            element={
              <ProtectedRoute requiredRole={1}>
                <Admin />
              </ProtectedRoute>
            }
          />

        </Routes>

      </Router>
    </AuthProvider>
  );
}

export default App;
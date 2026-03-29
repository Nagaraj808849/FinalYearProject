import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import axios from "axios";

// ðŸ”¹ Global Axios Interceptor
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


import { useAuth } from "./context/useAuth";

// ðŸ”¹ ProtectedRoute using useAuth hook
const ProtectedRoute = ({ children, requiredRole }) => {
  const { isAuthenticated, role, loading } = useAuth();

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-xl font-semibold text-amber-900 animate-pulse">Loading Application...</div>
      </div>
    );
  }

  // Not logged in at all
  if (!isAuthenticated) {
    return <Navigate to="/Login" replace />;
  }

  if (requiredRole) {
    const numericRole = Number(role);
    
    // Admin (1) can see everything
    if (numericRole === 1) {
      return children;
    }

    // User (2) can only see role-2 routes
    if (numericRole === 2 && requiredRole === 2) {
      return children;
    }

    // Role mismatch (e.g. User trying to access Admin route)
    if (numericRole === 2 && requiredRole === 1) {
      return <Navigate to="/Homepage1" replace />;
    }

    // Fallback
    return <Navigate to="/Login" replace />;
  }

  return children;
};


// ðŸ”¹ RedirectIfLoggedIn using useAuth hook
const RedirectIfLoggedIn = ({ children }) => {
  const { isAuthenticated, role, loading } = useAuth();

  if (loading) return null; // Wait for auth to resolve

  if (isAuthenticated) {
    const numericRole = Number(role);
    // Already logged in - redirect based on role
    if (numericRole === 1) {
      return <Navigate to="/Admin" replace />;
    }
    return <Navigate to="/Homepage1" replace />;
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
          <Route path="/Login" element={
            <RedirectIfLoggedIn>
              <Login />
            </RedirectIfLoggedIn>
          } />
          <Route path="/Signup" element={
            <RedirectIfLoggedIn>
              <Signup />
            </RedirectIfLoggedIn>
          } />
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

          {/* ðŸ”´ ADMIN ONLY ROUTE */}

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


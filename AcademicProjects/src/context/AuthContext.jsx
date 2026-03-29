import React, { createContext, useState, useEffect, useCallback } from "react";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Normalize role logic centralized in context
  const normalizeRole = useCallback((rawRole) => {
    if (!rawRole && rawRole !== 0) return 2;
    const s = String(rawRole).toLowerCase().trim();
    if (s === "admin" || s === "1") return 1;
    if (s === "user" || s === "customer" || s === "2" || s === "0" || s === "") return 2;
    const n = Number(rawRole);
    return isNaN(n) ? 2 : (n === 1 ? 1 : 2);
  }, []);

  // Initialize user from localStorage on mount
  useEffect(() => {
    const storedUser = localStorage.getItem("currentUser");
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch (error) {
        console.error("Error parsing stored user:", error);
        localStorage.removeItem("currentUser");
      }
    }
    setLoading(false);
  }, []);

  // Updated login function to handle ALL localStorage state
  const login = useCallback((userData) => {
    const role = normalizeRole(userData.role);
    const userWithRole = { ...userData, role };
    
    setUser(userWithRole);
    localStorage.setItem("currentUser", JSON.stringify(userWithRole));
    
    if (userData.token) {
      localStorage.setItem("token", userData.token);
    }
    localStorage.setItem("role", role);
  }, [normalizeRole]);

  // Logout function
  // Unified logout function
  const logout = useCallback(() => {
    setUser(null);
    localStorage.removeItem("currentUser");
    localStorage.removeItem("profile");
    localStorage.removeItem("token");
    localStorage.removeItem("role");
  }, []);

  // Signup function
  const signup = useCallback((userData) => {
    const users = JSON.parse(localStorage.getItem("users")) || [];
    if (users.find((u) => u.email === userData.email)) {
      throw new Error("User already exists");
    }
    const newUser = { ...userData, role: "user", id: Date.now() };
    users.push(newUser);
    localStorage.setItem("users", JSON.stringify(users));
    return newUser;
  }, []);

  // Update user profile
  const updateProfile = useCallback((updatedProfile) => {
    const updatedUser = { ...user, ...updatedProfile };
    setUser(updatedUser);
    localStorage.setItem("currentUser", JSON.stringify(updatedUser));
  }, [user]);

  // Strict session info computation
  const getSessionInfo = () => {
    const rawToken = localStorage.getItem("token");
    const rawRole = localStorage.getItem("role");
    
    // Stricter check: localStorage.getItem returns string "null" or "undefined" sometimes? No, it returns actual null.
    // However, !! "null" is true. So we should check explicitly.
    const hasValidToken = !!rawToken && rawToken !== "null" && rawToken !== "undefined" && rawToken !== "";
    const hasValidUser = !!user;
    
    const roleValue = user?.role ?? rawRole;
    return {
      isAuthenticated: hasValidUser || hasValidToken,
      role: roleValue !== "null" && roleValue !== "undefined" ? roleValue : null
    };
  };

  const { isAuthenticated, role: sessionRole } = getSessionInfo();

  const value = {
    user,
    loading,
    login,
    logout,
    signup,
    updateProfile,
    isAuthenticated,
    isAdmin: sessionRole == 1 || sessionRole === "admin" || sessionRole === "1",
    role: sessionRole,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

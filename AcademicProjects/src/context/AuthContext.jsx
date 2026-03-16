import React, { createContext, useState, useEffect, useCallback } from "react";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

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

  // Login function
  const login = useCallback((userData) => {
    setUser(userData);
    localStorage.setItem("currentUser", JSON.stringify(userData));
  }, []);

  // Logout function
  const logout = useCallback(() => {
    setUser(null);
    localStorage.removeItem("currentUser");
    localStorage.removeItem("profile");
  }, []);

  // Signup function
  const signup = useCallback((userData) => {
    const users = JSON.parse(localStorage.getItem("users")) || [];
    
    // Check if user already exists
    if (users.find((u) => u.email === userData.email)) {
      throw new Error("User already exists");
    }

    // Add new user
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

  const value = {
    user,
    loading,
    login,
    logout,
    signup,
    updateProfile,
    isAuthenticated: !!user,
    isAdmin: user?.role === "admin",
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

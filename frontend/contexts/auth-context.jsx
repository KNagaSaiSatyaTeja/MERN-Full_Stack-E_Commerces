"use client"

import { createContext, useContext, useState, useEffect } from "react"
import { loginUser, signupUser, updateUserProfile } from "@/lib/api"

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Check if user is logged in from localStorage
    const storedUser = localStorage.getItem("user");
    const storedToken = localStorage.getItem("token");
    
    if (storedUser && storedToken) {
      try {
        const userData = JSON.parse(storedUser);
        setUser(userData);
      } catch (error) {
        console.error("Failed to parse stored user:", error);
        localStorage.removeItem("user");
        localStorage.removeItem("token");
      }
    }
    setLoading(false);
  }, [])

  const login = async (email, password) => {
    try {
      const userData = await loginUser(email, password);
      setUser(userData);
      localStorage.setItem("user", JSON.stringify(userData));
      localStorage.setItem("token", userData.token);
      return userData;
    } catch (error) {
      console.error("Login failed:", error);
      throw error;
    }
  };

  const signup = async (name, email, password, address) => {
    try {
      const userData = await signupUser(name, email, password, address)
      return userData
    } catch (error) {
      console.error("Signup failed:", error)
      throw error
    }
  }

  const logout = () => {
    setUser(null);
    localStorage.removeItem("user");
    localStorage.removeItem("token");
  };

  const isAdmin = () => {
    return user && user.role === "admin";
  };

  const updateProfile = async (data) => {
    if (!user) {
      throw new Error("No user logged in")
    }

    try {
      const updatedUser = await updateUserProfile(user.id, data)
      setUser(updatedUser)
      localStorage.setItem("user", JSON.stringify(updatedUser))
      return updatedUser
    } catch (error) {
      console.error("Profile update failed:", error)
      throw error
    }
  }

  return (
    <AuthContext.Provider value={{ user, login, signup, logout, updateProfile, loading, isAdmin }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext)
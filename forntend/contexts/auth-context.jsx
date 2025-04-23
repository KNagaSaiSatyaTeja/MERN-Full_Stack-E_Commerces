"use client"

import { createContext, useContext, useState, useEffect } from "react"
import { loginUser, signupUser, updateUserProfile } from "@/lib/api"

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Check if user is logged in from localStorage
    const storedUser = localStorage.getItem("user")
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser))
      } catch (error) {
        console.error("Failed to parse stored user:", error)
        localStorage.removeItem("user")
      }
    }
    setLoading(false)
  }, [])

  const login = async (email, password) => {
    const userData = await loginUser(email, password)
    setUser(userData)
    localStorage.setItem("user", JSON.stringify(userData))
    return userData
  }

  const signup = async (name, email, password) => {
    const userData = await signupUser(name, email, password)
    return userData
  }

  const logout = () => {
    setUser(null)
    localStorage.removeItem("user")
  }

  const updateProfile = async (data) => {
    const updatedUser = await updateUserProfile(user.id, data)
    setUser(updatedUser)
    localStorage.setItem("user", JSON.stringify(updatedUser))
    return updatedUser
  }

  return (
    <AuthContext.Provider value={{ user, login, signup, logout, updateProfile, loading }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext)

"use client"

import { createContext, useContext, useState, useEffect } from "react"
import { useAuth } from "./auth-context"

const CartContext = createContext(null)

export function CartProvider({ children }) {
  const [cart, setCart] = useState([])
  const { user } = useAuth()

  // Load cart from localStorage when component mounts or user changes
  useEffect(() => {
    if (user) {
      const storedCart = localStorage.getItem(`cart_${user.id}`)
      if (storedCart) {
        try {
          setCart(JSON.parse(storedCart))
        } catch (error) {
          console.error("Failed to parse stored cart:", error)
          localStorage.removeItem(`cart_${user.id}`)
        }
      }
    } else {
      setCart([])
    }
  }, [user])

  // Save cart to localStorage whenever it changes
  useEffect(() => {
    if (user) {
      localStorage.setItem(`cart_${user.id}`, JSON.stringify(cart))
    }
  }, [cart, user])

  const addToCart = (product) => {
    setCart((prevCart) => {
      const existingItem = prevCart.find((item) => item.id === product.id)

      if (existingItem) {
        return prevCart.map((item) =>
          item.id === product.id ? { ...item, quantity: item.quantity + (product.quantity || 1) } : item,
        )
      } else {
        return [...prevCart, { ...product, quantity: product.quantity || 1 }]
      }
    })
  }

  const removeFromCart = (productId) => {
    setCart((prevCart) => prevCart.filter((item) => item.id !== productId))
  }

  const updateQuantity = (productId, quantity) => {
    setCart((prevCart) => prevCart.map((item) => (item.id === productId ? { ...item, quantity } : item)))
  }

  const clearCart = () => {
    setCart([])
  }

  return (
    <CartContext.Provider
      value={{
        cart,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
      }}
    >
      {children}
    </CartContext.Provider>
  )
}

export const useCart = () => useContext(CartContext)

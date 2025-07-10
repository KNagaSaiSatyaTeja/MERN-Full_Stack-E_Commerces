"use client"

import { createContext, useContext, useState, useEffect } from "react"
import { useAuth } from "./auth-context"
import { getCart, addToCart as apiAddToCart, removeFromCart as apiRemoveFromCart, clearCart as apiClearCart } from "@/lib/api"

const CartContext = createContext(null)

export function CartProvider({ children }) {
  const [cart, setCart] = useState([])
  const [loading, setLoading] = useState(false)
  const { user } = useAuth()

  // Load cart from backend when user changes
  useEffect(() => {
    if (user) {
      loadCart()
    } else {
      setCart([])
    }
  }, [user])

  const loadCart = async () => {
    if (!user) return
    
    try {
      setLoading(true)
      const cartData = await getCart(user.id)
      setCart(cartData.products || [])
    } catch (error) {
      console.error("Failed to load cart:", error)
      setCart([])
    } finally {
      setLoading(false)
    }
  }

  const addToCart = async (product) => {
    if (!user) {
      throw new Error("Please login to add items to cart")
    }

    try {
      setLoading(true)
      
      // Add to backend
      await apiAddToCart(user.id, {
        product_id: product.id,
        quantity: product.quantity || 1
      })

      // Reload cart from backend to get updated data
      await loadCart()
    } catch (error) {
      console.error("Failed to add to cart:", error)
      throw error
    } finally {
      setLoading(false)
    }
  }

  const removeFromCart = async (productId) => {
    if (!user) return

    try {
      setLoading(true)
      
      // Remove from backend
      await apiRemoveFromCart(user.id, productId)

      // Update local state
      setCart((prevCart) => prevCart.filter((item) => item.id !== productId))
    } catch (error) {
      console.error("Failed to remove from cart:", error)
      // Reload cart to sync with backend
      await loadCart()
      throw error
    } finally {
      setLoading(false)
    }
  }

  const updateQuantity = async (productId, quantity) => {
    if (!user) return

    try {
      setLoading(true)
      
      if (quantity <= 0) {
        await removeFromCart(productId)
        return
      }

      // Find the current item
      const currentItem = cart.find(item => item.id === productId)
      if (!currentItem) return

      // Calculate the difference
      const quantityDiff = quantity - currentItem.quantity

      if (quantityDiff > 0) {
        // Add more items
        await apiAddToCart(user.id, {
          product_id: productId,
          quantity: quantityDiff
        })
      } else if (quantityDiff < 0) {
        // Remove items (call remove API multiple times)
        for (let i = 0; i < Math.abs(quantityDiff); i++) {
          await apiRemoveFromCart(user.id, productId)
        }
      }

      // Update local state
      setCart((prevCart) => 
        prevCart.map((item) => 
          item.id === productId ? { ...item, quantity } : item
        )
      )
    } catch (error) {
      console.error("Failed to update quantity:", error)
      // Reload cart to sync with backend
      await loadCart()
      throw error
    } finally {
      setLoading(false)
    }
  }

  const clearCart = async () => {
    if (!user) return

    try {
      setLoading(true)
      
      // Clear from backend
      await apiClearCart(user.id)

      // Update local state
      setCart([])
    } catch (error) {
      console.error("Failed to clear cart:", error)
      throw error
    } finally {
      setLoading(false)
    }
  }

  return (
    <CartContext.Provider
      value={{
        cart,
        loading,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        loadCart,
      }}
    >
      {children}
    </CartContext.Provider>
  )
}

export const useCart = () => useContext(CartContext)